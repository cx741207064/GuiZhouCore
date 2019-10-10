if (!document.querySelectorAll) {
	document.querySelectorAll = function(selectors) {
		var style = document.createElement('style'), elements = [], element;
		document.documentElement.firstChild.appendChild(style);
		document._qsa = [];
		style.styleSheet.cssText = selectors
				+ '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
		window.scrollBy(0, 0);
		style.parentNode.removeChild(style);
		while (document._qsa.length) {
			element = document._qsa.shift();
			element.style.removeAttribute('x-qsa');
			elements.push(element);
		}
		document._qsa = null;
		return elements;
	};
}
if (!document.querySelector) {
	document.querySelector = function(selectors) {
		var elements = document.querySelectorAll(selectors);
		return (elements.length) ? elements[0] : null;
	};
}
var viewApp = angular.module("viewApp", []);
var ua = navigator.userAgent;
if (ua && ua.indexOf("MSIE 7") >= 0) {
	// Completely disable SCE to support IE7.
	viewApp.config(function($sceProvider) {
		console.log("启动IE7兼容性支持：" + ua);
		$sceProvider.enabled(false);
	});
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location) {
});

viewApp.filter('to_trusted', [ '$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
} ]);

/**
 * 国地税类型代码转名称
 */
viewApp.filter('gdslxDm',function() {
					return function(gdslxDm) {
						if (gdslxDm == "1")
							return "<span class=\"fontcolor01\">国税</span>";
						if (gdslxDm == "2")
							return "<span class=\"fontcolor02\">地税</span>";
						else
							return "<span class=\"fontcolor01\">国</span><span class=\"fontcolor02\">地</span>";
					};
				});


/**
 * 根据核心返回pzxh 显示按钮
 */
viewApp.filter('pzxh',
		function() {
			return function(item) {
				if (item.pzxh == null || item.pzxh == "")
					//凭证序号为 为null 导出盘报类
					return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','3','"+item.gdslxDm+"')\">查看</button>";
				else
					//正常申报类
					if(item.showType == "0"){
						return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>";
					}else if(item.showType == "1"){
						return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
					}else if(item.showType == "2"){
						return "<button style=\"margin:2px 1.5px;\" class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>" +
								"<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
					}else{
						return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
					}
			};
		});

//cksbb查看申报表 1.0补打功能
viewApp.filter('cksbb',
		function() {
			return function(item) {
				return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cksbb('"+item.gnId+"','"+item.bdDm+"','"+item.id+"','"+item.gdslxDm+"','"+item.sjgsrq+"','"+item.sjgsdq+"')\">查看</button>";
			};
		});

/**
 * 查看申报表（1.0补打功能）
 */
function cksbb(gnId,bdDm,sblsh,gdslxDm,sjgsrq,sjgsdq){
	var bdurl="/sbzs-cjpt-web/nssb/sbbd/jump2EtaxSbbd.do?gnId="+gnId+"&gnDm="+bdDm+"&sblsh="+sblsh+"&gdslxDm="+gdslxDm+"&sjgsrq="+sjgsrq+"&sjgsdq="+sjgsdq;
	$.ajax({
		url:bdurl,
		type:"GET",
		data:{},
		dataType:"json",
		contentType:"application/json",
		success:function(data){
			window.open(data);
		},
		error:function(){
			alertMsgs('链接超时或网络异常', {icon: 5});
		}
	});
}
/**
 * 判断是否存在某个值
 */
String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}

//var isFirstChangeiframeHight = true;//只改变一次ifrMain容器的高度
/**
 *页面加载提示
 */
window.onload=function(){ 
	var nsr = jQuery.parseJSON(nsrJson);
	var error = nsr.error;
	if (null != error && "" != error) {
		dhtmlx.message(error, "info", 3000);
	}
	
	//判断是否传有sssq，兼容北京的金财管家。
	var sssqQ = $('#sssqQ').val();
	var sssqZ = $('#sssqZ').val();
	var bsq = (sssqQ == 'null'&&sssqZ == 'null')?'null':getBsqForSkssq(sssqQ,sssqZ);
	$('#bsq').val(bsq);
	
	//控制国地标志的显示
	if("3" == gdbsms){
		$("#gdbztd1").show();
		$("#gdbztd2").show();
		$("#gdbz").find("option").eq(0).attr("selected","selected");
	}else if("1" == gdbsms){
		$("#gdbz").find("option").eq(1).attr("selected","selected");
	}else if("2" == gdbsms){
		$("#gdbz").find("option").eq(2).attr("selected","selected");
	}else{
		//云上电局  敏感字替换，陈林洪已确认：国地部署模式参数错误  可替换   部署模式参数错误
		alertMsgs('部署模式参数错误', {icon: 5});
	}
}	

/**
 *重置
 */
function resetBtn(){
	window.location.href='cbxxcx.do';

}


function queryBtn() {
	//获取查询条件
	var gdbz = $("#gdbz").val();
	
	var sbrqq = $("#sbrqq").val();
	var sbrqz = $("#sbrqz").val();
	
	var sbrq = $("#sbrq").val();
	var skssqq = $("#skssqq").val();
	var skssqz = $("#skssqz").val();
	
	// 校验申报日期
	var isok = jyCxtjfun(skssqq,skssqz,sbrqq,sbrqz);
	if (!isok) return;
	
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var sbxxcxurl  ="getCbxxcx.do?skssqq="+skssqq+"&skssqz="+skssqz+"&gdbz="+gdbz+"&sbrqq="+sbrqq+"&sbrqz="+sbrqz+"&urlgdslxDm="+urlgdslxDm;
	$.ajax({
		url:sbxxcxurl,
		type:"GET",
		data:{},
		dataType:"json",
		contentType:"application/json",
		success:function(data){
			//赋值
			var result = eval("(" + data + ")");
			//异常信息
			var errormsg = result.error;
			//财报信息
			var cbList = result.cbList;
			
			//北京查询区分月报季报和年报、北京的查询url会传bbbsqDm
			var bsq = $("#bsq").val();
			if(bsq == "null"){
				//财报分页
				cbpaging("cbxxList",cbList);
			}else{
				var newCbList = [];//保存北京根据bsq过滤的List
				for(var i = 0;i<cbList.length;i++){
					var skssqq = cbList[i].ssqq;
					var skssqz = cbList[i].ssqz;
					var queryBsq = getBsqForSkssq(skssqq,skssqz);
					if(bsq == '10' && bsq == queryBsq){
						newCbList.push(cbList[i]);
					}else if(bsq == '3' || bsq == '4' && bsq == queryBsq){
						newCbList.push(cbList[i]);
					}
				}
				//财报分页
				cbpaging("cbxxList",newCbList);
			}
			
			//异常提示
			if(errormsg.length>0){
				alertMsgs(errormsg);
			}
			
			/*if (isFirstChangeiframeHight) {
				changeHeight("ifrMain");
				isFirstChangeJframeHight = false;
			}*/
		},
		error:function(){
			alertMsgs('链接超时或网络异常', {icon: 5});
		},
		complete:function(){
			layer.close(index);
		},
		timeout : 1000000000
	});
	
}

/**
 * 查询pdf、导出pdf
 * @param pzxh
 * @param czlxDm
 * @param gdslxDm
 */
function queryAndexport(pzxh, version,gdslxDm,ysqxxid) {
	// alert("查看PDF");
	//此方法可重写 根据地方实际情况获取PDF信息 此处默认查询产品归档信息  其中VERSION 1 表示PZXH = 依申请PZXH、 3 PZXH=表示依申请 ID、 2 表示  PZXH =原NSBB_YWRZ的JYLSH
	printPdf(pzxh, version,gdslxDm,ysqxxid);
}

/**下载PDF*/
function cxDownloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm){
    downloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm)
}


//财报分页
function cbpaging(tableName, data) {
	cleanTable(tableName);
	var lineNumber = 1;
	var nums = "10";//$("#cbpageSize").val();
	$("#cbpageInfo").html("条/页，共" + data.length + "条信息");
	// 每页出现的数量
	var pages = Math.ceil(data.length / nums); // 得到总页数
	// 调用分页
	laypage({
		cont : 'cbpage1',
		pages : pages,
		jump : function(obj, first) {
			cleanTable(tableName);
			cbxxpaging(tableName, data, obj.curr, nums);
		}
	});
}

function cbxxpaging(tableName, data, curr, nums) {
	var last = curr * nums - 1;
	last = last >= data.length ? (data.length - 1) : last;
	var pageData = [];
	for (var i = (curr * nums - nums); i <= last; i++) {
		pageData.push(data[i]);
	}
	// 排序
	pageData.sort(function(a,b) {
		return Date.parse(b.sbrq.replace(/-/g,"/"))-Date.parse(a.sbrq.replace(/-/g,"/"));
	});
	// 序号赋值
	var xh = (curr * nums - nums);
	for (var j = 0; j < pageData.length; j++) {
		pageData[j].index = xh;
		xh++;
	}
	var scope = angular.element($('#cbviewCtrlid')).scope();
	if(typeof(scope)=='undefined'){
		scope = angular.element($('#cbviewCtrlid')).scope($('#cbviewCtrlid'));
	}
	if(pageData==null || pageData==undefined || pageData.length<1){
		$("#cbxxNotTips").show()
	}else{
		$("#cbxxNotTips").hide()
	}
	// 调用$scope中的方法
	scope.cbxxitems = pageData;
	// 调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
}


/**
 * 清楚表数据
 * 
 * @param tableName
 */
function cleanTable(tableName) {
	$("#" + tableName + " tr:not(:first)").remove();
}

//根据税款所属期计算bbbsqDm
function getBsqForSkssq(skssqq,skssqz) {
	var newTime = new Date();
	var bbbsqDm = '';
	var skssqqArr = skssqq.split("-");
	var skssqzArr = skssqz.split("-");
	//起止年月日
	var syear = skssqqArr[0];
	var eyear = skssqzArr[0];
	var smonth = skssqqArr[1];
	var emonth = skssqzArr[1];
	var sday = skssqqArr[2];
	var eday = skssqzArr[2];
	
	
	if (smonth == emonth && sday != eday){//相同月不同天为按月申报
		bbbsqDm = "4";
	}
	if (smonth != emonth){//不同月可能为按季申报/半年申报/按年申报
		if ((parseInt(emonth)-parseInt(smonth)) == 11){//年报
			bbbsqDm = "1";
		}
		if ((parseInt(emonth)-parseInt(smonth)) == 2 ){
			//1-3
			if (skssqq==syear+"-01-01"&& skssqz==eyear+"-03-31"){
				bbbsqDm = "3";
			}
			//4-6
			if (skssqq==syear+"-04-01"&& skssqz==eyear+"-06-30"){
				bbbsqDm = "3";
			}
			//7-9
			if (skssqq==syear+"-07-01"&& skssqz==eyear+"-09-30"){
				bbbsqDm = "3";
			}
			//10-12
			if (skssqq==syear+"-10-01"&& skssqz==eyear+"-12-31"){
				bbbsqDm = "3";
			}
		}
	}
	return bbbsqDm;
}

function jyCxtjfun(skssqq,skssqz,sbrqq,sbrqz){
	if(skssqq =="" && skssqz == "" && sbrqq == "" && sbrqz == ""){
		alertMsgs('申报日期起止、税款所属期起止，请至少选择一项！', {icon: 5});
		return false;
	}
	if(sbrqq !="" && sbrqz == ""){
		alertMsgs('申报日期止不能为空！', {icon: 5});
		return false;
	}
	if(sbrqz !="" && sbrqq == ""){
		alertMsgs('申报日期起不能为空！', {icon: 5});
		return false;
	}
	if(skssqq !="" && skssqz == ""){
		alertMsgs('税款所属期止不能为空！', {icon: 5});
		return false;
	}
	if(skssqz !="" && skssqq == ""){
		alertMsgs('税款所属期起不能为空！', {icon: 5});
		return false;
	}
	if(sbrqq > sbrqz){
		alertMsgs('申报日期止的时间不能小于申报日期起的时间！', {icon: 5});
		return false;
	}
	if(skssqq > skssqz){
		alertMsgs('税款所属期止的时间不能小于税款所属期起！', {icon: 5});
		return false;
	}
	return true;
}

/*
 * 提示
 */
function alertMsgs(msg,idnex){
	layui.use('layer', function(){
		var layer = layui.layer;
		var top="auto"//默认自动
		try{
			if(window.top==window.self){
				//不存在父页面
			}else{
				top=window.parent.document.documentElement.scrollTop+100+"px";
			}
		}catch(e){}
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
