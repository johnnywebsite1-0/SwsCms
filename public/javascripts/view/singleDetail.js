let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.onDelete = function (detailID) {
    let confirmMsg = '您确定要删除该信息吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: '/singleDetail?detailID=' + detailID,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              location.reload();
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，请检查网络设置。');
          }
        });
      }
    });
  };
});