/**
 * 申报查询自定义js
 */

/**
 * 申报信息（电厅）打印pdf 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询国地税归档信息
 * @param pzxh
 * @param gdslxDm
 */
function dtprintPdf(pzxh,gdslxDm,ysqxxid){
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var printPdfUrl = "printPdf.do?pzxh=" + pzxh +"&gdslxDm="+gdslxDm+"&ysqxxid="+ysqxxid;
	$.ajax({
		url : printPdfUrl,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			var pdfName = eval("(" + data + ")");
			if (pdfName == null || pdfName == "") {
				alertMSGs('PDF文件正在生成，请稍后再下载打印!', {icon : 5});
				return;
			}
			var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName="+ pdfName + "&gdslxDm=" + gdslxDm +"&DZSWJ_TGC=" + DZSWJ_TGC ;;
			window.open(url);
		},
		error : function() {
			alertMSGs('链接超时或服务异常!', {icon : 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
	
}


/**
 * 申报信息（电厅）打印pdf 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询国地税归档信息
 * @param pzxh
 * @param gdslxDm
 */
function dtdownloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm){
    var top="auto"//默认自动
    try{
        if(window.top==window.self){
            //不存在父页面
        }else{
            top=window.parent.document.documentElement.scrollTop+200+"px";
        }
    }catch(e){}
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var printPdfUrl = "printPdf.do?pzxh=" + pzxh +"&gdslxDm="+gdslxDm+"&ysqxxid="+ysqxxid;
    $.ajax({
        url : printPdfUrl,
        type : "GET",
        data : {},
        dataType : "json",
        contentType : "application/json",
        success : function(data) {
            var pdfName = eval("(" + data + ")");
            if (pdfName == null || pdfName == "") {
                alertMSGs('PDF文件正在生成，请稍后再下载打印!', {icon: 5});
                return;
            }
        var url = "/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ysqxxid="+ysqxxid+"&viewOrDownload=download&gdslxDm="+gdslxDm+"&ywbm="+ywbm+"&DZSWJ_TGC=" + DZSWJ_TGC ;
    	window.open(url,"_self");
        },
        error : function() {
            alertMSGs('链接超时或服务异常！', {icon : 5});
        },
        complete : function() {
            layer.close(index);
        },
        timeout : 1000000000
    });

}


/**
 * 申报信息（产品） pdf显示 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询产品归档信息
 * @param pzxh
 * @param version
 * @param gdslxDm
 */
function printPdf(pzxh, version,gdslxDm,ysqxxid){
	var weburl = window.location.href;
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var openPdfurl ="openPdf.do?pzxh=" + pzxh + "&version=" + version+"&gdslxDm="+gdslxDm;
	if(ysqxxid!=undefined&&ysqxxid!=null&&ysqxxid!=""){
		openPdfurl+="&ysqxxid="+ysqxxid;
	}
	$.ajax({
		url : openPdfurl,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			var pdfurl = eval("(" + data + ")");
			if(version =="1" || version =="3"){
				if(pdfurl == null || pdfurl==""){
					alertMSGs('PDF文件正在生成，请稍后再下载打印!', {icon: 5});
					return;
				}
				var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName=" + pdfurl+"&gdslxDm="+gdslxDm+ "&DZSWJ_TGC=" + DZSWJ_TGC ;
				window.open(url);
			}else{
				var arrUrl = weburl.split("?");
				pdfurl=pdfurl+"&"+arrUrl[1];
				window.open(pdfurl);
			}
		},
		error : function() {
			alertMSGs('链接超时或服务异常!', {icon : 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
}


/**
* 申报信息（产品） pdf下载 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询产品归档信息
* @param pzxh
* @param version
* @param gdslxDm
*/
function downloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm){
    var top="auto"//默认自动
    try{
        if(window.top==window.self){
            //不存在父页面
        }else{
            top=window.parent.document.documentElement.scrollTop+200+"px";
        }
    }catch(e){}
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var openPdfurl = "openPdf.do?pzxh=" + pzxh + "&version=" + version+"&gdslxDm="+gdslxDm+"&ysqxxid="+ysqxxid;
    $.ajax({
        url : openPdfurl,
        type : "GET",
        data : {},
        dataType : "json",
        contentType : "application/json",
        success : function(data) {
            var pdfurl = eval("(" + data + ")");
            if(version =="1" || version =="3") {
                if (pdfurl == null || pdfurl == "") {
                    alertMSGs('PDF文件正在生成，请稍后再下载打印!', {icon: 5});
                    return;
                }
            }
                var url = "/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ysqxxid="+ysqxxid+"&viewOrDownload=download&gdslxDm="+gdslxDm+"&ywbm="+ywbm+"&DZSWJ_TGC=" + DZSWJ_TGC ;
			window.open(url,"_self");
        },
        error : function() {
            alertMSGs('链接超时或服务异常!', {icon : 5});
        },
        complete : function() {
            layer.close(index);
        },
        timeout : 1000000000
    });
}

/**
* 申报信息（产品） Excel下载
* @param pzxh
* @param version
* @param gdslxDm
*/
function downloadExcel(pzxh, version, gdslxDm, ysqxxid, ywbm){
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var myform = $("<form></form>");
	myform.attr('id','fileExport');
	myform.attr('method','post');
	myform.attr('action',mainUrl+"/nssb/dkdjdsjccssb/fileExport.do");
	
	var ysqxxidTOInput = $("<input type='hidden' name='ysqxxid'>");
	ysqxxidTOInput.attr('value', ysqxxid);
	myform.append(ysqxxidTOInput);
	var pzxhTOInput = $("<input type='hidden' name='pzxh'>");
	pzxhTOInput.attr('value', pzxh);
	myform.append(pzxhTOInput);
	
	myform.appendTo($(window.parent.document).find("body")).submit();
	$('#fileExport').remove();
}

/*
 * 提示
 */
function alertMSGs(msg,index){
	layui.use('layer', function(){
		var layer = layui.layer;
		layer.open({
			type : 1,
			area : [ '300px' ], //固定宽高400px
			offset : top,
			title : [ '提示信息' ],
			scrollbar : false,
			content : msg,
			btn : ['关闭' ],
			btnAlign : 'r', //按钮居右
			yes : function() {
				layer.closeAll();
			}
		});
	}); 
}