let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();
let uploadPhoto = uploadUtils.createUploadObject(['public', 'upload', 'news']);

router.get('/', function(req, res, next) {
  res.render('newsEdit', { title: '新闻编辑', newsID: req.query.newsID });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let newsID = req.query.newsID;

  service.get(newsID, function (result) {
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
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/news/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('addNews');
  let data = {
    newsTitle: req.body.newsTitle,
    newsDate: req.body.newsDate,
    newsThumbnailUrl: req.body.newsThumbnailUrl,
    newsContent: req.body.newsContent,
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
  let service = new commonService.commonInvoke('changeNews');
  let data = {
    newsID: req.body.newsID,
    newsTitle: req.body.newsTitle,
    newsDate: req.body.newsDate,
    newsThumbnailUrl: req.body.newsThumbnailUrl,
    newsContent: req.body.newsContent,
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

module.exports = router;
