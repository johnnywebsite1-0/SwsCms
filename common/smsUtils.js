let sysConfig = require('../config/sysConfig');
let apiConfig = require('../config/apiConfig');
let SMSClient = require('@alicloud/sms-sdk');

exports.sendNotice = function (cellphone, sender, sendTime, callback) {
  let smsClient = new SMSClient({
    accessKeyId: apiConfig.aliSms.accessKeyId,
    secretAccessKey: apiConfig.aliSms.secretAccessKey
  });
  let smsParameter = '{"name":"' + sender + '",' + '"time": "' + sendTime + '" }';
  let req = {
    PhoneNumbers: cellphone,
    SignName: apiConfig.aliSms.signName,
    TemplateCode: apiConfig.aliSms.noticeCode,
    TemplateParam: smsParameter
  };
  smsClient.sendSMS(req).then(function (res) {
    let resText = getAliSmdResponseText(res.Code);
    return callback(res.Code === 'OK', JSON.stringify(req), JSON.stringify(res), resText);
  }, function (err) {
    return callback(false, JSON.stringify(req), JSON.stringify(err), err.data.Message);
  })
};

function getAliSmdResponseText(code) {
  let resMapping = apiConfig.aliSms.resMapping;
  for(let key in resMapping){
    if(key === code){
      return resMapping[key];
    }
  }
}