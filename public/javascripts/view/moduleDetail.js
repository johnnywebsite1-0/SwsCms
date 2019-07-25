$(document).ready(function () {
  function initPage() {
    let moduleID = $('#hidden_moduleID').val();

    CKEDITOR.config.height = 550;
    CKEDITOR.config.width = 'auto';
    CKEDITOR.config.removeDialogTabs = 'image:advanced;image:Link';//隐藏超链接与高级选项
    CKEDITOR.config.filebrowserImageUploadUrl = "/HmCode/Shop/upload";//上传图片的地址
    CKEDITOR.config.filebrowserHtml5videoUploadUrl = "/HmCode/Shop/uploads";//上传视频的地址
    CKEDITOR.config.extraPlugins = 'html5video';
    CKEDITOR.config.image_previewText = ' ';

    CKEDITOR.replace( 'detailContent');


    $.ajax({
      url: '/modulesDetail/data?moduleID=' + moduleID,
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.detail.length !== 0){
          CKEDITOR.instances.detailContent.setData(res.detail[0].content);
        }else{
          CKEDITOR.instances.detailContent.setData('');
        }
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  $('#btn-close').click(function () {
    window.close();
  });
  
  $('#btn-save').click(function () {
    let content = CKEDITOR.instances.detailContent.getData();
    let moduleID = $('#hidden_moduleID').val();
    if(moduleID === ''){
      layer.msg('参数错误，为找到模块编号');
      return false;
    }

    if(content === ''){
      layer.msg('请输入详细内容。');
      return false;
    }

    $.ajax({
      url: '/modulesDetail',
      type: 'post',
      dataType: 'json',
      data:{
        moduleID: moduleID,
        content: content,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          bootbox.alert('保存成功！')
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  });

  initPage();
});