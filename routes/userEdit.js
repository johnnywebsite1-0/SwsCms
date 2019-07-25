let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();
let uploadPhoto = uploadUtils.createUploadObject(['public', 'upload', 'user']);

router.get('/', function(req, res, next) {
  res.render('userEdit', {
    title: '用户信息编辑' ,
    option: req.query.option,
    userID: req.query.userID
  });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('users');
  let userID = req.query.userID;

  service.get(userID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

router.post('/photoUpload',  uploadPhoto.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/user/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('addUser');
  let data = {
    fullName: req.body.fullName,
    cellphone: req.body.cellphone,
    password: '111111',
    photo: req.body.photo,
    introduction: req.body.introduction,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changeUser');
  let data = {
    accountID: req.body.userID,
    fullName: req.body.fullName,
    cellphone: req.body.cellphone,
    photo: req.body.photo,
    introduction: req.body.introduction,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.put('/changePassword', function (req, res, next) {
  let service = new commonService.commonInvoke('changePassword');
  let data = {
    accountID: req.body.userID,
    password: req.body.password,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteUser');
  let userID = req.query.userID;

  service.delete(userID, function (result) {
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
