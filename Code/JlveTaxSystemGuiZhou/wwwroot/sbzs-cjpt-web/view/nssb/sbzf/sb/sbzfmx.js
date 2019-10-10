//低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = { log : function(){} };
}
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
		//console.log("启动IE7兼容性支持：" + ua);
		$sceProvider.enabled(false);
	});
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location) {
});

var sbzfmx;
window.onload=function(){ 
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	//扩展结束
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	$.ajax({
		type : "post",
		url : "getsbzfmx.do?pzxh="+pzxh+"&gdslxDm="+gdslxDm+"&skssqq="+skssqq+"&skssqz="+skssqz+"&djxh="+djxh+"&nsrsbh="+nsrsbh+"&zgswjgDm="+zgswjgDm+"&swjgDm="+swjgDm,
		data : {},
		success : function(data) {
			// 赋值
			var result = eval("(" + data + ")");
			// 异常信息
			var errormsg = result.error;
			// 申报作废信息
			var sbzfMxList = result.sbzfMxList;
			var scope = angular.element($('#viewCtrlid')).scope();
			if(typeof(scope)=='undefined'){
				scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
			}
			// 调用$scope中的方法
			scope.sbmxitems = sbzfMxList;
			//残保金作废时界面要把 税率改成 上年在职职工年平均工资 所以这里要传应征种类代码 区分
			scope.sbblxDm=sbblxDm;
			sbzfmx =sbzfMxList;
			// 调用方法后，可以重新绑定，在页面同步（可选）
			scope.$apply();
		},
		error : function() {
			layer.alert('链接超时或网络异常', {icon: 5});
		},
		complete : function() {
			layer.close(index);
		}
	});
}

/**
 *作废提交
 */
function zfSubmit() {
	var param = {};
	//获取作废原因
	var sqzfly = $("#sqzfly").val();
	//判断是否输入全是空格
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	if(sqzfly == "" || sqzfly == null || re.test(sqzfly)){
		layer.alert('请填写作废原因', {icon: 5});
		return;
	}
	//错误原因
	param.sqzfly = sqzfly;
	//納稅人信息
	param.pzxh = pzxh;
	param.gdslxDm = gdslxDm;
	param.skssqq = skssqq;
	param.skssqz = skssqz;
	param.djxh = djxh;
	param.nsrsbh = nsrsbh;
	param.zgswjgDm = zgswjgDm;
	param.swjgDm = swjgDm;
	param.yzpzzlDm = sbblxDm;
	param.sbrq = sbrq;
	//作废 数据明细
	param.mx = sbzfmx;
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	//扩展结束
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var subzfurl = "sbZfSubmit.do?gdslxDm="+gdslxDm;
	$.ajax({
		url : subzfurl,
		type : "POST",
		data : {reqParamsJSON : JSON.stringify(param)},
		success : function(data) {
			//alert("----作废返回-----"+data);
			//var ms =jQuery.parseJSON(data)
			var jsondata = eval("("+data+")");
			var code = jsondata.code;
			var msg =jsondata.msg;
			//提示
			layer.alert(msg, { skin: {icon: 6}
				  ,closeBtn: 0
				}, function(){
					back();
				});
		},
		error : function() {
			layer.alert('链接超时或网络异常', {icon: 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});

}

/**
 * 返回上一页
 */
function back() {
	var backUrl ="sbzf.do?isQuery=Y&gdbz="+gdbz_+"&skssqq="+skssqq_+"&skssqz="+skssqz_+"&ywbm="+ywbm;
	window.location.href=backUrl;
}