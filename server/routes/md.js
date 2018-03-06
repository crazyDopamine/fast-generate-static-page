var express = require('express');
var router = express();
var models = require('../model/models');
var tokenModule = require('../model/token');
var global = require('../global');
var fs = require('fs');

var request = function (req, res, next, callback) {
  var params = Object.assign(req.params, req.query, req.body);
  if (callback) callback(params, req, res, next);
}

router.post('/publish', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    let path = '../staticPage/source/_draft/'
    let fileName = params.fileName
    path += (fileName ? fileName : 'temp') + '.md'
    fs.writeFile(path, params.content, (err) => {
      console.log(err)
      if (err) {
        res.json({
          success: false,
          code: global.FailCode
        })
      } else {
        path = '../staticPage/source/_posts/'
        path += (fileName ? fileName : 'temp') + '.md'
        fs.writeFile(path, params.content, (err) => {
          console.log(err)
          if (err) {
            res.json({
              success: false,
              code: global.FailCode
            })
          }
          res.json({
            success: true,
            code: global.SuccessCode
          })
        })
      }
    })
  })
})

router.post('/save', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    let path = '../staticPage/source/_draft/'
    let fileName = params.fileName
    path += (fileName ? fileName : 'temp') + '.md'
    fs.writeFile(path, params.content, (err) => {
      console.log(err)
      if (err) {
        res.json({
          success: false,
          code: global.FailCode
        })
      }
      res.json({
        success: true,
        code: global.SuccessCode
      })
    })
  })
})

router.post('/unPublish', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    let path = '../staticPage/source/_posts/'
    let fileName = params.fileName
    path += (fileName ? fileName : 'temp') + '.md'
    fs.unlink(path, (err) => {
      console.log(err)
      if (err) {
        res.json({
          success: false,
          code: global.FailCode
        })
      } else {
        res.json({
          success: true,
          code: global.SuccessCode
        })
      }
    })
  })
})

router.get('/get', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    let path = '../staticPage/source/_draft/'
    let fileName = params.fileName
    path += (fileName ? fileName : 'temp') + '.md'
    fs.readFile(path, (err, data) => {
      console.log(err)
      if (err) {
        res.json({
          success: false,
          code: global.FailCode
        })
      } else {
        res.json({
          success: true,
          code: global.SuccessCode,
          data: data.toString()
        })
      }
    })
  })
})

router.get('/fileList', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    let path = '../staticPage/source/_draft/'
    fs.readdir(path, (err, files) => {
      if (err) {
        res.json({
          success: false,
          code: global.FailCode
        })
      } else {
        var result = []
        files.forEach((file, index) => {
          result.push(file.substr(0, file.lastIndexOf('.')))
        })
        res.json({
          success: true,
          code: global.SuccessCode,
          data: result
        })
      }
    })
  })
})

module.exports = router;
