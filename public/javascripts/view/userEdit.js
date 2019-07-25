let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    optionType: 'add',
    userID: '',
    userPhoto: '/images/profile-pic.jpg',
    userName: '',
    cellphone: '',
    introduction: ''
  };

  $scope.onInit = function () {
    let optionType = $('#hidden_option').val();
    let userID = $('#hidden_userID').val();

    if(userID === ''){
      $scope.model.optionType = 'add';
    }else {
      $scope.model.userID = userID;
      $scope.model.optionType = 'upd';
    }
    CKEDITOR.replace( 'introduction');
    this.initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], '/user/edit/photoUpload', false);
    $scope.onLoadCurrentData();
  };

  $scope.initUploadPlugin = function (selector, fileType, uploadPath, multiple) {
    $(selector).initUpload({
      "uploadUrl": uploadPath,//上传文件信息地址
      "ismultiple": multiple,
      "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
      "maxFileNumber": 1,//文件个数限制，为整数\
    });
  };

  $scope.onLoadCurrentData = function () {
    if($scope.model.userID === '' || $scope.model.optionType !== 'upd'){
      return false;
    }

    $.ajax({
      url: '/user/edit/detail?userID=' + $scope.model.userID,
      type: 'GET',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.data === null){
          layer.msg('该用户不存在或已删除。');
          return false;
        }

        $scope.model.userID = res.data.accountID;
        $scope.model.userName = res.data.fullName;
        $scope.model.cellphone = res.data.cellphone;
        $scope.model.userPhoto = res.data.photo;
        $scope.model.introduction = res.data.introduction;
        CKEDITOR.instances.introduction.setData(res.data.introduction);
        $scope.$apply();
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onUploadPhoto = function () {
    $('#photo-upload-modal').modal('show');
  };

  $scope.onLoadImage = function () {
    if(!uploadTools.isUploaded){
      layer.msg('请先上传照片。');
      return false;
    }
    $scope.model.userPhoto = uploadTools.uploadedList[0];
    $('#photo-upload-modal').modal('hide');
    uploadTools.isUploaded = false;
  };

  $scope.onCellphoneBlur = function () {

  };

  $scope.checkData = function(){
    $scope.model.introduction = CKEDITOR.instances.introduction.getData();
    if($scope.model.userPhoto === '/images/profile-pic.jpg'){
      layer.msg('请上传个人照片！');
      return false;
    }
    if($scope.model.userName === ''){
      layer.msg('请输入姓名！');
      return false;
    }
    if($scope.model.cellphone === ''){
      layer.msg('请输入手机号码！');
      return false;
    }
    if($scope.model.introduction === ''){
      layer.msg('请输入个人简介！');
      return false;
    }
    return true;
  };

  $scope.onSubmit = function () {
    if(!$scope.checkData()){
      return false;
    }
    let type = '';
    let data = {};
    if($scope.model.optionType === 'add'){
      type = 'post';
      data = {
        fullName: $scope.model.userName,
        cellphone: $scope.model.cellphone,
        photo: $scope.model.userPhoto,
        introduction: $scope.model.introduction,
        loginUser: getLoginUser()
      }
    }else {
      type = 'put';
      data = {
        userID: $scope.model.userID,
        fullName: $scope.model.userName,
        cellphone: $scope.model.cellphone,
        photo: $scope.model.userPhoto,
        introduction: $scope.model.introduction,
        loginUser: getLoginUser()
      }
    }
    $.ajax({
      url: '/user/edit',
      type: type,
      dataType: 'json',
      data: data,
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/users';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onDelete = function () {
    let confirmMsg = '您确定要删除该用户吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: '/user/edit?userID=' + $scope.model.userID,
          type: 'delete',
          dataType: 'json',
          success: function(res){
            if(res.err){
              layer.msg(res.msg);
            }else{
              location.href = '/users';
            }
          },
          error: function(XMLHttpRequest){
            layer.msg('远程服务无响应，请检查网络设置。');
          }
        });
      }
    });
  };

  $scope.onInit();
});