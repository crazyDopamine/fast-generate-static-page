var express = require('express');
var router = express();
var models = require('../model/models');
var global = require('../global');
var modelConfig = require('../model/modelConfig');

var request = function (req, res, next, callback) {
    var params = Object.assign(req.params,req.query);
    if (callback)callback(params,req,res,next);
}

var success = function(res,data){
    res.statusCode = 200;
    var result = {
        code:global.resCode.SuccessCode,
        success:true,
        data:data?data:{}
    }
    res.json(result);
}

var fail = function(res,data){
    res.statusCode = 400;
    var result = {
        code:global.resCode.FailCode,
        success:false,
        data:null
    }
    res.json(result);
}

var initMudule = function(model){
    router.get('/'+model+'/list', function (req, res, next) {
        request(req, res, next,function (params,req, res, next) {
            var pageSize = params.pageSize?params.pageSize:global.pageSize;
            var page = params.page?params.page:1;
            models[model].findAndCountAll({offset:(page-1)*pageSize,limit:2}).then(function(result){
                success(res,{dataList:result.rows,count:result.count});
            });
        });
    });
    router.get('/'+model+'/detail', function (req, res, next) {
        request(req, res, next,function (params,req, res, next) {
            if(!params.id){
                fail(res,data);
                return;
            }
            models[model].findOne({id:params.id}).then(function(data){
                success(res,data);
            });
        });
    });
    router.post('/'+model+'/add', function (req, res, next) {
        request(req, res, next,function (params,req, res, next) {
            success(res);
        });
    });
    router.post('/'+model+'/edit', function (req, res, next) {
        request(req, res, next,function (params,req, res, next) {
            success(res);
        });
    });
    router.post('/'+model+'/delete', function (req, res, next) {
        request(req, res, next,function (params,req, res, next) {
            success(res);
        });
    });
}

for(var model in models){
    initMudule(model);
}

module.exports = router;
