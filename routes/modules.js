let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('modules', { title: '模块管理' });
});

router.get('/all', function(req, res, next) {
  let service = new commonService.commonInvoke('modules');
  service.get('', function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        modules: result.content.responseData
      });
    }
  });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('moduleDetail');
  service.get(req.query.moduleID, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        detail: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('addModule');
  let data = {
    moduleName: req.body.moduleName,
    moduleType: req.body.moduleType,
    moduleParentID: req.body.moduleParentID,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.post('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('addModuleDetail');
  let data = {
    moduleID: req.body.moduleID,
    content: req.body.content,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('changeModuleDetail');
  let data = {
    detailID: req.body.detailID,
    moduleID: req.body.moduleID,
    content: req.body.content,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changeModule');
  let data = {
    moduleID: req.body.moduleID,
    moduleName: req.body.moduleName,
    moduleType: req.body.moduleType,
    moduleParentID: req.body.moduleParentID,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/move', function (req, res, next) {
  let service = new commonService.commonInvoke('moveModule');
  let data = {
    moduleID: req.body.moduleID,
    moduleName: req.body.moduleName,
    moduleType: req.body.moduleType,
    moduleParentID: req.body.moduleParentID,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/changeNodeOrder', function (req, res, next) {
  let service = new commonService.commonInvoke('changeModuleSequence');
  let data = {
    moduleParentID: req.body.moduleParentID,
    modulesOrder: req.body.modulesOrder,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteModule');
  let moduleID = req.query.moduleID;
  service.delete(moduleID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;
