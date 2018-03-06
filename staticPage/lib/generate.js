'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var tildify = require('tildify');
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;
var _ = require('lodash');
var util = require('hexo-util');

var join = pathFn.join;

function generateConsole(args, hexo) {
    args = args || {};
    var force = args.f || args.force;
    var bail = args.b || args.bail;
    var self = hexo ? hexo : this;
    var route = self.route;
    var publicDir = self.public_dir;
    var log = self.log;
    var start = process.hrtime();
    var Cache = self.model('Cache');
    var generatingFiles = {};

    function generateFile(path) {
        // Skip if the file is generating
        if (generatingFiles[path]) return Promise.resolve();

        // Lock the file
        generatingFiles[path] = true;

        var dest = join(publicDir, path);

        return fs.exists(dest).then(function(exist) {
            if (force || !exist) return writeFile(path, true);
            if (route.isModified(path)) return writeFile(path);
        }).finally(function() {
            // Unlock the file
            generatingFiles[path] = false;
        });
    }

    function writeFile(path, force) {
        var dest = join(publicDir, path);
        var cacheId = 'public/' + path;
        var dataStream = wrapDataStream(route.get(path), { bail });
        var cacheStream = new CacheStream();
        var hashStream = new util.HashStream();

        // Get data => Cache data => Calculate hash
        return pipeStream(dataStream, cacheStream, hashStream).then(function() {
            var cache = Cache.findById(cacheId);
            var hash = hashStream.read().toString('hex');

            // Skip generating if hash is unchanged
            if (!force && cache && cache.hash === hash) {
                return;
            }

            // Save new hash to cache
            return Cache.save({
                _id: cacheId,
                hash: hash
            }).then(function() {
                // Write cache data to public folder
                return fs.writeFile(dest, cacheStream.getCache());
            }).then(function() {
                log.info('Generated: %s', chalk.magenta(path));
                return true;
            });
        }).finally(function() {
            // Destroy cache
            cacheStream.destroy();
        });
    }

    function deleteFile(path) {
        var dest = join(publicDir, path);

        return fs.unlink(dest).then(function() {
            log.info('Deleted: %s', chalk.magenta(path));
        }, function(err) {
            // Skip ENOENT errors (file was deleted)
            if (err.cause && err.cause.code === 'ENOENT') return;
            throw err;
        });
    }

    function wrapDataStream(dataStream, options) {
        var bail = options && options.bail;

        // Pass original stream with all data and errors
        if (bail === true) {
            return dataStream;
        }

        // Pass all data, but don't populate errors
        dataStream.on('error', function(err) {
            log.error(err);
        });

        return dataStream.pipe(new PassThrough());
    }

    function firstGenerate() {
        // Show the loading time
        var interval = prettyHrtime(process.hrtime(start));
        log.info('Files loaded in %s', chalk.cyan(interval));

        // Reset the timer for later usage
        start = process.hrtime();

        // Check the public folder
        return fs.stat(publicDir).then(function(stats) {
            if (!stats.isDirectory()) {
                throw new Error('%s is not a directory', chalk.magenta(tildify(publicDir)));
            }
        }).catch(function(err) {
            // Create public folder if not exists
            if (err.cause && err.cause.code === 'ENOENT') {
                return fs.mkdirs(publicDir);
            }

            throw err;
        }).then(function() {
            var routeList = route.list();
            var publicFiles = Cache.filter(function(item) {
                return item._id.substring(0, 7) === 'public/';
            }).map(function(item) {
                return item._id.substring(7);
            });

            return Promise.all([
                // Generate files
                Promise.map(routeList, generateFile),

                // Clean files
                Promise.filter(publicFiles, function(path) {
                    return !~routeList.indexOf(path);
                }).map(deleteFile)
            ]);
        }).spread(function(result) {
            var interval = prettyHrtime(process.hrtime(start));
            var count = result.filter(Boolean).length;

            log.info('%d files generated in %s', count, chalk.cyan(interval));
        });
    }

    return self.load().then(firstGenerate).then(function() {
        if (args.d || args.deploy) {
            return self.call('deploy', args);
        }
    });
}

// Pipe a stream from one to another
function pipeStream() {
    var args = _.toArray(arguments);
    console.log(args)
    var src = args.shift();

    return new Promise(function(resolve, reject) {
        var stream = src.on('error', reject);
        var target;

        while ((target = args.shift()) != null) {
            stream = stream.pipe(target).on('error', reject);
        }

        stream.on('finish', resolve);
        stream.on('end', resolve);
        stream.on('close', resolve);
    });
}

function CacheStream() {
    Transform.call(this);

    this._cache = [];
}

require('util').inherits(CacheStream, Transform);

CacheStream.prototype._transform = function(chunk, enc, callback) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, enc);

    this._cache.push(buf);
    this.push(buf);
    callback();
};

CacheStream.prototype.destroy = function() {
    this._cache.length = 0;
};

CacheStream.prototype.getCache = function() {
    return Buffer.concat(this._cache);
};

module.exports = generateConsole;