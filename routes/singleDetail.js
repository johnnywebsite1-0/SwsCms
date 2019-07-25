let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('singleDetail');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, function (result) {
    let renderData = commonService.buildRenderData('单独内容管理', pageNumber, result);
    if(renderData.dataList !== null){
      renderData.dataList.forEach(function(data, index, array){
        data.linkUrl = 'http://' + sysConfig.websiteHost + '?singleID=' + data.detailID;
      });
    }
    res.render('singleDetail', renderData);
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteSingleDetail');
  let detailID = req.query.detailID;

  service.delete(detailID, function (result) {
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
