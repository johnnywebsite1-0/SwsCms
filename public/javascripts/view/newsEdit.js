let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
  $scope.model = {
    optionType: 'add',
    newsID: '',
    newsTitle: '',
    newsThumbnailUrl: '/images/news3-4.jpg',
    newsDate: '',
    newsContent: ''
  };

  $scope.onInit = function () {
    let newsID = $('#hidden_newsID').val();

    if(newsID === ''){
      $scope.model.optionType = 'add';
    }else {
      $scope.model.newsID = newsID;
      $scope.model.optionType = 'upd';
    }
    // CKEDITOR.replace( 'detailContent');
    $scope.initCkEditor();
    $scope.initUploadPlugin('#file-upload-image', ['png','jpg','JPG', 'jpeg'], '/news/edit/photoUpload', false);
    $scope.onLoadCurrentData();
  };

  $scope.initCkEditor = function(){
    CKEDITOR.config.height = 500;
    CKEDITOR.config.width = 'auto';
    CKEDITOR.config.removeDialogTabs = 'image:advanced;image:Link';//隐藏超链接与高级选项
    CKEDITOR.config.filebrowserImageUploadUrl = "/HmCode/Shop/upload";//上传图片的地址
    CKEDITOR.config.filebrowserHtml5videoUploadUrl = "/HmCode/Shop/uploads";//上传视频的地址
    CKEDITOR.config.extraPlugins = 'html5video';
    CKEDITOR.config.image_previewText = ' ';
    CKEDITOR.replace( 'detailContent');
  };

  $scope.initUploadPlugin = function (selector, fileType, uploadPath, multiple) {
    $(selector).initUpload({
      "uploadUrl": uploadPath,//上传文件信息地址
      "ismultiple": multiple,
      "fileType": fileType,//文件类型限制，默认不限制，注意写的是文件后缀
      "maxFileNumber": 1,//文件个数限制，为整数\
    });
  };

  $scope.onLoadCurrentData = function(){
    if($scope.model.newsID === '' || $scope.model.optionType !== 'upd'){
      return false;
    }

    $.ajax({
      url: '/news/edit/detail?newsID=' + $scope.model.newsID,
      type: 'GET',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }

        if(res.data === null){
          return false;
        }

        $scope.model.newsID = res.data.newsID;
        $scope.model.newsTitle = res.data.newsTitle;
        $scope.model.newsDate = res.data.newsDate;
        document.getElementById('newsDate').value = res.data.newsDate;
        $scope.model.newsThumbnailUrl = res.data.newsThumbnailUrl;
        $scope.model.newsContent = res.data.newsContent;
        CKEDITOR.instances.detailContent.setData(res.data.newsContent);
        $scope.$apply();
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onShowDialog = function(){
    $('#photo-upload-modal').modal('show');
  };

  $scope.onLoadImage = function(){
    if(!uploadTools.isUploaded){
      layer.msg('请先上传图片。');
      return false;
    }
    $scope.model.newsThumbnailUrl = uploadTools.uploadedList[0];
    $('#photo-upload-modal').modal('hide');
    uploadTools.isUploaded = false;
  };

  $scope.onSave = function(){
    if(!$scope.checkData()){
      return false;
    }
    if($scope.model.newsID === '0'){
      $scope.addNews();
    }else{
      $scope.changeNews();
    }
  };

  $scope.checkData = function(){
    $scope.model.newsContent = CKEDITOR.instances.detailContent.getData();
    $scope.model.newsDate = document.getElementById('newsDate').value;
    if($scope.model.newsID === ''){
      layer.msg('参数错误，未发现新闻编号');
      return false;
    }
    if($scope.model.newsTitle === ''){
      layer.msg('请输入新闻标题');
      return false;
    }
    if($scope.model.newsDate === ''){
      layer.msg('请输入新闻日期');
      return false;
    }
    if($scope.model.newsThumbnailUrl === '/images/news3-4.jpg'){
      layer.msg('请上传新闻缩略图');
      return false;
    }
    if($scope.model.newsContent === ''){
      layer.msg('请编辑新闻内容');
      return false;
    }
    return true;
  };

  $scope.addNews = function(){
    $.ajax({
      url: '/news/edit',
      type: 'post',
      dataType: 'json',
      data:{
        newsTitle: $scope.model.newsTitle,
        newsDate: $scope.model.newsDate,
        newsThumbnailUrl: $scope.model.newsThumbnailUrl,
        newsContent: $scope.model.newsContent,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/news';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.changeNews = function(){
    $.ajax({
      url: '/news/edit',
      type: 'put',
      dataType: 'json',
      data:{
        newsID: $scope.model.newsID,
        newsTitle: $scope.model.newsTitle,
        newsDate: $scope.model.newsDate,
        newsThumbnailUrl: $scope.model.newsThumbnailUrl,
        newsContent: $scope.model.newsContent,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/news';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  };

  $scope.onInit();
});

// $(document).ready(function () {
//   function initPage() {
//     let newsID = $('#hidden_newsID').val();
//     CKEDITOR.replace( 'detailContent');
//
//     if(newsID === '' || newsID === '0'){
//       return false;
//     }
//
//     // $.ajax({
//     //   url: '/singleDetailEdit/detail?detailID=' + detailID,
//     //   type: 'get',
//     //   success: function(res){
//     //     if(res.err){
//     //       layer.msg(res.msg);
//     //       return false;
//     //     }
//     //     if(res.data !== null){
//     //       $('#title').val(res.data.detailTitle);
//     //       CKEDITOR.instances.detailContent.setData(res.data.content);
//     //     }else{
//     //       CKEDITOR.instances.detailContent.setData('');
//     //     }
//     //   },
//     //   error: function(XMLHttpRequest){
//     //     layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
//     //   }
//     // });
//   }
//
//   function addDetail(detailID, title, content){
//     $.ajax({
//       url: '/singleDetailEdit',
//       type: 'post',
//       dataType: 'json',
//       data:{
//         detailID: detailID,
//         detailTitle: title,
//         content: content,
//         loginUser: getLoginUser()
//       },
//       success: function(res){
//         if(res.err){
//           layer.msg(res.msg);
//         }else{
//           location.href = '/singleDetail';
//         }
//       },
//       error: function(XMLHttpRequest, textStatus){
//         layer.msg('远程服务无响应，请检查网络设置。');
//       }
//     });
//   }
//
//   function changeDetail(detailID, title, content){
//     $.ajax({
//       url: '/singleDetailEdit',
//       type: 'put',
//       dataType: 'json',
//       data:{
//         detailID: detailID,
//         detailTitle: title,
//         content: content,
//         loginUser: getLoginUser()
//       },
//       success: function(res){
//         if(res.err){
//           layer.msg(res.msg);
//         }else{
//           location.href = '/singleDetail';
//         }
//       },
//       error: function(XMLHttpRequest, textStatus){
//         layer.msg('远程服务无响应，请检查网络设置。');
//       }
//     });
//   }
//
//   $('#btn-save').click(function () {
//     let title = $.trim($('#title').val());
//     let content = CKEDITOR.instances.detailContent.getData();
//     let detailID = $('#hidden_detailID').val();
//     if(detailID === ''){
//       layer.msg('参数错误，为找到独立内容编号');
//       return false;
//     }
//
//     if(title === ''){
//       layer.msg('请输入详细标题。');
//       return false;
//     }
//     if(content === ''){
//       layer.msg('请输入详细内容。');
//       return false;
//     }
//
//     if(detailID === '0'){
//       addDetail(detailID, title, content);
//     }else{
//       changeDetail(detailID, title, content);
//     }
//   });
//
//   initPage();
// });