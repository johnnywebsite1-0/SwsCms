let express = require('express');
let path = require('path');
let fs = require("fs");
let uploadUtils = require('../common/uploadUtils');
let commonService = require('../service/commonService');
let router = express.Router();
let uploadPhoto = uploadUtils.createUploadObject(['public', 'upload', 'resources']);

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('moduleResources');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, function (result) {
    let renderData = commonService.buildRenderData('资源管理', pageNumber, result);
    if(renderData.dataList !== null){
      renderData.dataList.forEach(function(data, index, array){
        if(data.resourcesType === 'I'){
          data.isPhoto = true;
        }
        if(data.resourcesType === 'F'){
          data.isPdf = true;
        }
        if(data.resourcesType === 'V'){
          data.isVideo = true;
        }
      });
    }
    res.render('moduleResources', renderData);
  });
});

router.post('/fileUpload',  uploadPhoto.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/resources/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('addModuleResources');
  let data = {
    resourcesUrlList: req.body.files,
    resourcesType: req.body.fileType,
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

router.delete('/deleteFile', function (req, res, next) {
  let fileName = req.query.fileName;
  let filePath = './public/upload/resources/' + fileName;

  fs.exists(filePath, function (exists) {
    if(exists){
      fs.unlink(filePath, function(err) {
        if (err) {
          res.json({err: true, msg: '文件删除失败。'});
        }else{
          res.json({err: false, msg: '文件删除成功。'});
        }
      });
    }else{
      res.json({err: false, msg: '文件删除功能。'});
    }
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteModuleResources');
  let resourcesID = req.query.resourcesID;

  service.delete(resourcesID, function (result) {
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
