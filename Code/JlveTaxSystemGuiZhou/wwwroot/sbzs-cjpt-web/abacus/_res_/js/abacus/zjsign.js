/**
 * 总局客户端签名
 */
function pluginSign(zjTiket,viewOrDownload){
	
	var ywbm = $("#ywbm").val();
	//ywbm = "gtdjxxcjqr";
	var nssoywbm = "gtdjxxcjqr,xbqytcsq,yzymhscdjxx";
	//先判断是否免登陆业务，免登陆业务直接提交
	if(nssoywbm.toUpperCase().indexOf(ywbm.toUpperCase()) > -1){
		//申报提交逻辑
		parent.layer.close(index);
		submitPdf("N");
		return;
	}
	//过滤业务类型,提供给登陆前业务暂存
	var zlpzctl = "zlpz";
	nssoywbm = $("#nssoYwbm").val();
	if(ywbm!=null&&nssoywbm!=null&&ywbm!=""&&nssoywbm!=""&&ywbm!=undefined&&nssoywbm!=undefined){
		if(nssoywbm.toUpperCase().indexOf(ywbm.toUpperCase()) > -1){
			zlpzctl = "zlpznosso";
		}
	}
	var cp = $("#contextPath").val();
	var ywkeyword = "申报";
	if(cp.indexOf("sxsq")>-1){
		ywkeyword = "申请";
	}
		
	
	var viewOrDownloadBtn = '';
	var tips='';
	if(viewOrDownload !== 'view'){
		viewOrDownloadBtn = '下载凭证';
		tips = '如果需要下载'+ywkeyword+'凭证，可以点击“'	+viewOrDownloadBtn+'”按钮下载凭证文件到您的电脑，进行查看打印。';
	}else{
		viewOrDownloadBtn = '查看凭证';
		tips = '如果需要查看'+ywkeyword+'凭证，可以点击“'	+viewOrDownloadBtn+'”按钮查看凭证文件。';
	}
	//一键零申报直接提交
	if(window.parent.location.href.indexOf("yjlsb=Y")>-1){
		submitPdf("N");
	}else if('Y' !== otherParams.cayh){//非CA用户不用签名
		nocaSb(viewOrDownload,viewOrDownloadBtn,tips,ywkeyword,zlpzctl);
	}else{
		caSb(viewOrDownload,viewOrDownloadBtn,tips,zjTiket,ywkeyword);
	}
}

function nocaSb(viewOrDownload,viewOrDownloadBtn,tips,ywkeyword,zlpzctl){
	parent.layer.confirm('为了给您提供更佳的办税体验，系统不再展现PDF凭证界面，您可以点击“'+ywkeyword+'”按钮直接进行'+ywkeyword+'提交操作，'+tips,{
		icon : 1,
		title:'提示',
		btn2noclose:1,
		btn : [ywkeyword,viewOrDownloadBtn],
		btn2:function(index){
			//查看或者下载凭证
			var url = '/zlpz-cjpt-web/'+zlpzctl+'/viewOrDownloadPdfFile.do?ywbm='+$("#ywbm").val().toUpperCase()
				+'&gdslxDm='+$("#gdslxDm").val()
				+'&_query_string_='+encodeURIComponent($("#_query_string_").val())
				+'&ysqxxid='+$("#ysqxxid").val()
				+'&viewOrDownload='+viewOrDownload
				+'&_bizReq_path_='+_bizReq_path_;
			
			if(viewOrDownload !== 'view'){
				var form = $('<form method="POST" action="'+url+'"></form>');
				var iframe = $('<iframe name="fileDownload" style="display:none"></iframe>');
				$(document.body).append(iframe).append(form);
				form.submit();
			}else{
				parent.layer.open({
					type: 2,
					title: 'PDF凭证',
					shadeClose: true,
					shade: 0.8,
					area: ['90%', '90%'],
					content: url //iframe的url
				}); 
			}
			return false;
		},
		cancel: function(index){ 
		    //右上角关闭回调
			parent.layer.close(index);
			$("body").unmask();
			prepareMakeFlag = true;
		    return false ;
		}
	},function(index){
		//申报提交逻辑
		parent.layer.close(index);
		submitPdf("N");
		return;
	});
}

function caSb(viewOrDownload,viewOrDownloadBtn,tips,zjTiket,ywkeyword){
	// 调用总局签名
	var params = 'ywbm='+$("#ywbm").val().toUpperCase()
		+'&gdslxDm='+$("#gdslxDm").val()
		+'&_query_string_='+encodeURIComponent($("#_query_string_").val())
		+'&ysqxxid='+$("#ysqxxid").val()
		+'&viewOrDownload='+viewOrDownload
		+'&zjTiket='+zjTiket
		+'&_bizReq_path_='+_bizReq_path_;
	var url = location.protocol + "//" + location.host + "/zlpz-cjpt-web/zlpzzj/"+Base64.encode(params)+".pdf";
	try{
		var signatureFiled="SignatureField1[0]";
		var typeseal = "1";
		var Golparams ={"command":103, "code":10, "parameter":[url.toString(),signatureFiled.toString(),typeseal.toString()]};   
		var data =JSON.stringify(Golparams);
		data = Base64.encode(data);
		$.ajax({
			type : "get",
			timeout:15000,
			url :"http://127.0.0.1:16888?data="+data,
			dataType : "jsonp",
			jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
			jsonpCallback:"success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			success : function(json){
				var signedPdfUrl,msg,rtncode = '1';
				try{
					msg = json["msg"];
					signedPdfUrl = json["parameter"][0];
				}catch(e){
					rtncode = '0';
				}
				if('1' === rtncode){//签名成功
				   caSbSucc(viewOrDownload,viewOrDownloadBtn,tips,json,ywkeyword)
				}else{//签名失败
					caSbError(viewOrDownload,viewOrDownloadBtn,tips,msg,ywkeyword)
				}
			},
			error : function(json) {
				var alertMsg = '尊敬的用户您好！系统检查签章客户端异常或没有启动，如非CA用户请直接'+ywkeyword+'，CA用户请确认客户端是否正常启动，谢谢！'
					+ '<br/>如直接'+ywkeyword+'，请点击“'+ywkeyword+'”按钮。<br/>'+tips;
				ocxLayerAlert(alertMsg,viewOrDownloadBtn,viewOrDownload,ywkeyword);
			}
		});
	}catch(e){
		var alertMsg = '尊敬的用户您好！ca签名出错！'
			+ '<br/>如直接'+ywkeyword+'，请点击“'+ywkeyword+'”按钮。<br/>'+tips;
	    ocxLayerAlert(alertMsg,viewOrDownloadBtn,viewOrDownload,ywkeyword);
	}
}

//ca签名成功之后上传pdf凭证
function caSbSucc(viewOrDownload,viewOrDownloadBtn,tips,json,ywkeyword){
	var data64 = json["parameter"][2];
	var uploadUrl = "/zlpz-cjpt-web/zlpz/uploadSignPdf.do?_bizReq_path_=" + $("#_bizReq_path_").val()
	    + "&_query_string_=" + encodeURIComponent($("#_query_string_").val())
	    + "&ysqxxid=" + $("#ysqxxid").val()
		+ "&_re_contextpath_=" + $("#contextPath").val()
		+ "&makeType=" + makeType;
	$.ajax({
		type : "post",
		async: false,
		url :uploadUrl,
		data:{data64:data64},
		dataType : "json",
		success : function(result){
			while(typeof(result) === 'string'){
				result = JSON.parse(result);
			}
			if("01" !== result.code){
				ocxLayerAlert(result.msg ,viewOrDownloadBtn,viewOrDownload,ywkeyword);
			}else{
				//上传成功后才能申报
				parent.layer.confirm('尊敬的CA用户您好，系统已为您签名成功，为了给您提供更佳的办税体验，不再展现PDF凭证界面，您可以点击“'+ywkeyword+'”按钮直接进行'+ywkeyword+'提交操作，'+tips,{
					icon : 1,
					title:'提示',
					btn2noclose:1,
					btn : [ywkeyword,viewOrDownloadBtn],
					btn2:function(index){
						//TODO 查看凭证逻辑
						var url = '/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ywbm='+$("#ywbm").val().toUpperCase()
							+'&gdslxDm='+$("#gdslxDm").val()
							+'&_query_string_='+encodeURIComponent($("#_query_string_").val())
							+'&ysqxxid='+$("#ysqxxid").val()
							+'&viewOrDownload='+viewOrDownload
							+'&_bizReq_path_='+_bizReq_path_;
						
						if(viewOrDownload !== 'view'){
							var form = $('<form method="POST" action="'+url+'"></form>');
							var iframe = $('<iframe name="fileDownload" style="display:none"></iframe>');
							$(document.body).append(iframe).append(form);
							form.submit();
						}else{
							// 查看凭证逻辑
							parent.layer.open({
								  type: 2,
								  title: 'PDF凭证',
								  shadeClose: true,
								  shade: 0.8,
								  area: ['90%', '90%'],
								  content:signedPdfUrl
							}); 
						}
						return false;
					},
					cancel: function(index){ 
					    //右上角关闭回调
						parent.layer.close(index);
						$("body").unmask();
						prepareMakeFlag = true;
					    return false ;
					}
				},function(index){
					//TODO 申报提交逻辑
					parent.layer.close(index);
					submitPdf("Y");
				});
			}
		},
		error : function(aa) {
			ocxLayerAlert("上传签名后凭证出错！",viewOrDownloadBtn,viewOrDownload,ywkeyword);
		}
	});
}

function caSbError(viewOrDownload,viewOrDownloadBtn,tips,msg,ywkeyword){
	var alertMsg = '尊敬的CA用户您好，系统签名失败，请确认是否插入证书或重新插入证书，谢谢！'
		+ '<br/>错误信息：' +msg
		+ '<br/>如直接'+ywkeyword+'，请点击“'+ywkeyword+'”按钮。<br/>'+tips;
	parent.layer.confirm(alertMsg,{
		icon : 3,
		title:'提示',
		btn2noclose:1,
		btn : [ywkeyword,viewOrDownloadBtn],
		btn2:function(index){
			//TODO 查看凭证逻辑
			var url = '/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ywbm='+$("#ywbm").val().toUpperCase()
				+'&gdslxDm='+$("#gdslxDm").val()
				+'&_query_string_='+encodeURIComponent($("#_query_string_").val())
				+'&ysqxxid='+$("#ysqxxid").val()
				+'&viewOrDownload='+viewOrDownload
				+'&_bizReq_path_='+_bizReq_path_;
			
			if(viewOrDownload !== 'view'){
				var form = $('<form method="POST" action="'+url+'"></form>');
				var iframe = $('<iframe name="fileDownload" style="display:none"></iframe>');
				$(document.body).append(iframe).append(form);
				form.submit();
			}else{
				// 查看凭证逻辑
				parent.layer.open({
					  type: 2,
					  title: 'PDF凭证',
					  shadeClose: true,
					  shade: 0.8,
					  area: ['90%', '90%'],
					  content:signedPdfUrl
				}); 
			}
			return false;
		},
		cancel: function(index){ 
		    //右上角关闭回调
			parent.layer.close(index);
			$("body").unmask();
			prepareMakeFlag = true;
		    return false ;
		}
	},function(index){
		//TODO 申报提交逻辑
		parent.layer.close(index);
		submitPdf("N");
	});
}

function ocxLayerAlert(msg,viewOrDownloadBtn,viewOrDownload,ywkeyword){
	parent.layer.confirm(msg,{
		icon : 3,
		title:'提示',
		btn2noclose:1,
		btn : [ywkeyword,viewOrDownloadBtn],
		btn2:function(index){
			//TODO 查看凭证逻辑
			var url = '/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ywbm='+$("#ywbm").val().toUpperCase()
				+'&gdslxDm='+$("#gdslxDm").val()
				+'&_query_string_='+encodeURIComponent($("#_query_string_").val())
				+'&ysqxxid='+$("#ysqxxid").val()
				+'&viewOrDownload='+viewOrDownload
				+'&_bizReq_path_='+_bizReq_path_;
			
			if(viewOrDownload !== 'view'){
				var form = $('<form method="POST" action="'+url+'"></form>');
				var iframe = $('<iframe name="fileDownload" style="display:none"></iframe>');
				$(document.body).append(iframe).append(form);
				form.submit();
			}else{
				// 查看凭证逻辑
				parent.layer.open({
					  type: 2,
					  title: 'PDF凭证',
					  shadeClose: true,
					  shade: 0.8,
					  area: ['90%', '90%'],
					  content:signedPdfUrl
				}); 
			}
			return false;
		},
		cancel: function(index){ 
		    //右上角关闭回调
			parent.layer.close(index);
			$("body").unmask();
			prepareMakeFlag = true;
		    return false ;
		}
	},function(index){
		//TODO 申报提交逻辑
		parent.layer.close(index);
		submitPdf("N");
	});
}