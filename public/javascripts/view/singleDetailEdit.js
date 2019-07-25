$(document).ready(function () {
  function initPage() {
    let detailID = $('#hidden_detailID').val();
    CKEDITOR.replace( 'detailContent');

    if(detailID === '' || detailID === '0'){
      return false;
    }

    $.ajax({
      url: '/singleDetailEdit/detail?detailID=' + detailID,
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.data !== null){
          $('#title').val(res.data.detailTitle);
          CKEDITOR.instances.detailContent.setData(res.data.content);
        }else{
          CKEDITOR.instances.detailContent.setData('');
        }
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function addDetail(detailID, title, content){
    $.ajax({
      url: '/singleDetailEdit',
      type: 'post',
      dataType: 'json',
      data:{
        detailID: detailID,
        detailTitle: title,
        content: content,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/singleDetail';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  function changeDetail(detailID, title, content){
    $.ajax({
      url: '/singleDetailEdit',
      type: 'put',
      dataType: 'json',
      data:{
        detailID: detailID,
        detailTitle: title,
        content: content,
        loginUser: getLoginUser()
      },
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
        }else{
          location.href = '/singleDetail';
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('远程服务无响应，请检查网络设置。');
      }
    });
  }

  $('#btn-save').click(function () {
    let title = $.trim($('#title').val());
    let content = CKEDITOR.instances.detailContent.getData();
    let detailID = $('#hidden_detailID').val();
    if(detailID === ''){
      layer.msg('参数错误，为找到独立内容编号');
      return false;
    }

    if(title === ''){
      layer.msg('请输入详细标题。');
      return false;
    }
    if(content === ''){
      layer.msg('请输入详细内容。');
      return false;
    }

    if(detailID === '0'){
      addDetail(detailID, title, content);
    }else{
      changeDetail(detailID, title, content);
    }
  });

  initPage();
});