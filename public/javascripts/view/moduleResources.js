let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.initPage = function(){
    $scope.initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], true);
    $scope.initUploadPlugin('#file-upload-video', ['mp4'], true);
    $scope.initUploadPlugin('#file-upload-file', ['pdf'], true);
  };

  $scope.initUploadPlugin = function (selector, fileType, multiple) {
    $(selector).initUpload({
      "uploadUrl":"/moduleResources/fileUpload",//上传文件信息地址
      "deleteFileUrl":"/moduleResources/deleteFile?fileName=",//上传文件信息地址
      //"beforeUpload": beforeUploadFun,//在上传前执行的函数
      "ismultiple": multiple,
      "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
      //"size":350,//文件大小限制，单位kb,默认不限制
      "maxFileNumber": 10,//文件个数限制，为整数
      //"filelSavePath":"",//文件上传地址，后台设置的根目录
      //"onUpload":onUploadFun，//在上传后执行的函数
      //autoCommit:true,//文件是否自动上传
    });
  };

  $scope.onShowImageUpload = function () {
    $('#file-upload-image-modal').modal('show');
  };

  $scope.onShowVideoUpload = function () {
    $('#video-upload-modal').modal('show');
  };

  $scope.onShowPdfUpload = function () {
    $('#file-upload-pdf-modal').modal('show');
  };

  $scope.onSaveUploadImage = function(){
    if(!uploadTools.isUploaded){
      layer.msg('请先上传照片。');
      return false;
    }

    $.ajax({
      url: '/moduleResources',
      type: 'post',
      dataType: 'json',
      data: {
        files: uploadTools.uploadedList.toString(),
        fileType: 'I',
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          $('#file-upload-image-modal').modal('hide');
          uploadTools.isUploaded = false;
          location.reload();
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onSaveUploadFile = function(){
    if(!uploadTools.isUploaded){
      layer.msg('请先上传文件。');
      return false;
    }

    $.ajax({
      url: '/moduleResources',
      type: 'post',
      dataType: 'json',
      data: {
        files: uploadTools.uploadedList.toString(),
        fileType: 'F',
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          $('#file-upload-pdf-modal').modal('hide');
          uploadTools.isUploaded = false;
          location.reload();
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onSaveUploadVideo = function(){
    if(!uploadTools.isUploaded){
      layer.msg('请先上传视频。');
      return false;
    }

    $.ajax({
      url: '/moduleResources',
      type: 'post',
      dataType: 'json',
      data: {
        files: uploadTools.uploadedList.toString(),
        fileType: 'V',
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          $('#video-upload-modal').modal('hide');
          uploadTools.isUploaded = false;
          location.reload();
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onDelete = function(resourcesID){
    let confirmMsg = '您确定要删除该资源吗？';
    bootbox.confirm(confirmMsg, function(result) {
      if(result) {
        $.ajax({
          url: '/moduleResources?resourcesID=' + resourcesID,
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


  $scope.initPage();
});