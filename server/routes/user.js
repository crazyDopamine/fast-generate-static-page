var express = require('express');
var router = express();
var models = require('../model/models');
var tokenModule = require('../model/token');
var global = require('../global');

var request = function (req, res, next, callback) {
  var params = Object.assign(req.params, req.query,req.body);
  if (callback) callback(params, req, res, next);
}

/* GET home page. */
router.post('/login', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    models.user.findOne({ where: { phone: params.phone, password: params.password } }).then(function (user) {
      if (user) {
        user = user.toJSON()
        tokenModule.getToken(user.id, function (err, tokenString) {
          if (!err) {
            user.token = tokenString;
            res.statusCode = 200;
            res.cookie(global.CookieKey, tokenString, { maxge: 20 * 60 * 1000 });
            res.json({
              success: true,
              code: global.SuccessCode,
              data: user
            });
          } else {
            res.json({
              success: false,
              code: global.FailCode,
              data: null
            });
          }
        });
      } else {
        res.json({
          success: false,
          code: global.FailCode,
          data: null
        });
      }
    });
  });
});

router.get('/userInfo', function (req, res, next) {
  request(req, res, next, function (params, req, res, next) {
    var token = req.headers[global.tokenKey];
    if(!token){
      res.statusCode = 401;
      res.json({
        success: false,
        data: null
      });
      return
    }
    tokenModule.checkToken(token, function (success, userId) {
      if (success) {
        models.user.findOne({ where: { id: userId } }).then(function (data) {
          if (data) {
            res.json({
              success: true,
              code: global.SuccessCode,
              data: data
            });
          }
        });
      }
    })
  });
});

router.get('/test', function(req, res){
  res.send('hello world');
});

module.exports = router;
