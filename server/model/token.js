var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1', { auth_pass: '' });
var models = require('../model/models');

var globalKey = {
  userTocken: 'USERTOCKEN'
}
client.on('ready', function (err) {
  console.log('redis ready!');
});

var checkToken = function (token, callback) {
  client.HGET(globalKey.userTocken, token, function (err, userId) {
    if (!err) {
      if (callback) {
        callback(true, userId);
      }
    } else {
      console.log(err);
      if (callback) {
        callback(false);
      }
    }
  });
}

var getToken = function (userId, callback) {
  var token = 'token_' + new Date().getTime() + '_' + userId;
  client.HSET(globalKey.userTocken, token, userId, function (err, data) {
    if (!err) {
      callback(null, token);
    } else {
      console.log(err);
      if (callback) callback(err);
    }
  });
  return
}

module.exports = {
  client: client,
  GlobalKey: globalKey,
  getToken: getToken,
  checkToken: checkToken
}