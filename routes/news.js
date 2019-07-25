let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, function (result) {
    let renderData = commonService.buildRenderData('新闻内容管理', pageNumber, result);
    res.render('news', renderData);
  });
});


router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteNews');
  let newsID = req.query.newsID;

  service.delete(newsID, function (result) {
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
