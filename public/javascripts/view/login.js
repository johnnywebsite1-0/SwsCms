let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    cellphone: '',
    password: '',
    remember: true
  };

  $scope.onLogin = function () {
    if($scope.model.cellphone === '' || $scope.model.password === ''){
      return false;
    }

    $http.post('/', {
      cellphone:  $scope.model.cellphone,
      password: $scope.model.password
    }).then(function successCallback (response) {
      if(response.data.err){
        layer.msg(response.data.msg);
        return false;
      }
      if(response.data.userInfo === null){
        layer.msg('该账户不存在');
        return false;
      }
      response.data.userInfo.introduction = '';
      setCookie('swsLoginUser', JSON.stringify(response.data.userInfo));
      location.href = '/index';
    }, function errorCallback(response) {
      layer.msg('网络异常，请检查网络设置');
    });
  }
});