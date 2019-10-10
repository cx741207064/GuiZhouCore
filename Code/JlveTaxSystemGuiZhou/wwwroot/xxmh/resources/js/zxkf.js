	/*
	 * 在线客服接入
	 */
	//客服组编号（由在线客服提供）,贵州省电子税务局客服中心
    if(document.domain.indexOf("test")!=-1){
    	var groupNo = "10591001";//测试
    }else{
    	var groupNo = "10051002";//生产
    }
	//易号码，如果是匿名则使用anyone，如果是实名则改成自己实名的易号码
	var eno = "anyone";
	var thirdPartySession = "123";
	//true代表未登录的用户无法使用人工服务，false代表未登录的用户可以使用人工服务
	var isUseSeparationMode="true";
	//true代表已经登录，false代表没登录,默认没登录
	var isOutLogined="false";
	//控制只能打开一个在线客服的咨询窗口
	var openIndex=0;
	//关闭页面索引
	var closeIndex;
	
	
	

	if (window.addEventListener) {
      window.addEventListener('message', function (e) {
          var user = JSON.parse(e.data);
			var openUrl = user.url;
          switch(user.method)
          {
              case "closeLayer":
                  layer.closeAll();
                  break;
				case "closeAllLayer":
                  layer.closeAll();
                  break;
				case "openNav":
					layer.closeAll();
                  onclickZxkf();
                  break;
				case "layerMessageAction":
					layerMessageAction(openUrl);
					break;
				case "closeLayerByIndex":
					layer.close(closeIndex);
					break;
          }
      }, false);
  } else if (window.attachEvent) {
      window.attachEvent("onmessage", function (e) {
          var user = JSON.parse(e.data);
      });
  }
	
	

	//在线客服弹窗方法
	function onclickZxkf() {
		openIndex=openIndex+1;
		
		//检测是否登录
		//在$.post()前把ajax设置为同步
		$.ajaxSettings.async = false;		
		$.post("/xxmh/portalSer/checkLogin.do",{},function(d){
			var isLogin=d.isLogin;
			if(isLogin=="Y"){
				isOutLogined="true";
			}else{
				isOutLogined="false";
			}
		});
	    //在$.post()后把ajax改回为异步
		$.ajaxSettings.async = true;
		
		if(openIndex>1){
			layer.msg("只能发起一个会话");
			openIndex--;
		}else{
			//生产环境地址
			 var url = 'http://iccsweb.jchl.com/custom/web/GZ/index.html?groupNo='+groupNo+'&eno='+eno+'&thirdPartySession='+thirdPartySession+'&isUseSeparationMode='+isUseSeparationMode+'&isOutLogined='+isOutLogined;
         layer.open({
             type: 2,
             title: ' ',
             shadeClose: true,
             shade: false,
             maxmin: false, //开启最大化最小化按钮
             area: ['600px', '556px'],
             offset: 'rb',
             content: [url, 'no'],//传入要调用的url
				end: function () {           //关闭弹出层触发
					openIndex--;
             }
         });				
		}
 }
	
	//留言和查看留言回复弹窗方法
	function layerMessageAction(url) {
		var title = "";
		if(url.indexOf("msgManage.do")!=-1){
			title = "请您留言";
	    }else if(url.indexOf("msgReply.do")!=-1){
			title = "查看留言回复";
	    }else if(url.indexOf("eval.do")!=-1){
			title = "评价";
	    }
		closeIndex = layer.open({
			type: 2,
			title: title,
			shadeClose: true,
			shade: false,
			maxmin: false, //开启最大化最小化按钮
			area: ['600px', '556px'],
			offset: 'r',
			move: false,
			content: [url] //传入要调用的url
		});
	}