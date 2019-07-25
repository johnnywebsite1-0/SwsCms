let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('moduleDetail', { title: '模块明细编辑', moduleID: req.query.moduleID });
});

router.get('/data', function(req, res, next) {
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

module.exports = router;
