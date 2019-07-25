let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('singleDetailEdit', { title: '单独信息编辑', detailID: req.query.detailID });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('singleDetail');
  let detailID = req.query.detailID;

  service.get(detailID, function (result) {
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

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('addSingleDetail');
  let data = {
    detailID: req.body.detailID,
    detailTitle: req.body.detailTitle,
    content: req.body.content,
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
  let service = new commonService.commonInvoke('changeSingleDetail');
  let data = {
    detailID: req.body.detailID,
    detailTitle: req.body.detailTitle,
    content: req.body.content,
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
