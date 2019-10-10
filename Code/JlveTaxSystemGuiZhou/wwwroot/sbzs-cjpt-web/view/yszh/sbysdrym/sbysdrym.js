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
		// console.log("启动IE7兼容性支持：" + ua);
		$sceProvider.enabled(false);
	});
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location) {
});

/**
 * 根据yssbid 显示操作按钮
 */
viewApp.filter('yssbid', function() {
	return function(item) {
		return "<a href='javaScript:updateYssbBz(\""+item.yssbid+"\")' onmouseover='updateImg(this)' onmouseout='updateImg2(this)' class=\"layui-btn layui-btn-primary layui-btn-sm delbtn\" data-method=\"info\" data-type=\"auto\"><img src=\""+yszhContextPath+"/view/yszh/sbysdrym/del.png\" style=\"margin-bottom:4px\" alt=\"删除\" />删除</a>";
	};
});

/*
 * 动态切换按钮图片
 */
function updateImg(obj){
	$(obj).find("img").attr("src",yszhContextPath+"/view/yszh/sbysdrym/del2.png");
}

function updateImg2(obj){
	$(obj).find("img").attr("src",yszhContextPath+"/view/yszh/sbysdrym/del.png");
}

viewApp.filter('to_trusted', [ '$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
} ]);

$(document).ready(function(){
	
	// 初始化关闭弹窗事件
	$(".winClose").click(function () {
		var $winbox_bg = $(window.parent.document).find(".winbox_bg");
        $winbox_bg.remove();
        $(window.parent.document).find("#myModa5").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
    });
	
});

/** ============================= 校验是否存在请求参数 =============================**/
function jyParam(){
	var resultBz = false;
	var nsrsbh = GetQueryString("nsrsbh");
	var test = GetQueryString("test");
	// 如果是test模式,需要校验nsrsbh
	if(!isEmptyObject(test)){
		if(!isEmptyObject(nsrsbh)){
			resultBz = true;
		} else {
			resultBz = false;
		}
	} else {
		resultBz = true;
	}
	return resultBz;
}

/** ============================= 发起请求查询数据 =============================**/
//zhuyanfeng 2019-06-11 增加参数yccl，用于控制异常是否需要alert。默认需要（true）
function getYssbXxList(yccl){
	var result = {};
	var nsrsbh = GetQueryString("nsrsbh");
	var sssqQ = GetQueryString("sssqQ");
	var sssqZ = GetQueryString("sssqZ");
	// 后台根据ywbm获取zlbsxlDm
	var ywbm = parent.ywbm;
	if(isEmptyObject(ywbm)){
		if(yccl != false){
			parent.layer.alert("获取业务编码为空！", {title:"提示",icon: 2});
		}
		return ;
	}
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var params = {};
	params.nsrsbh = nsrsbh;
	params.sssqQ = sssqQ;
	params.sssqZ = sssqZ;
	params.ywbm = ywbm;
	$.ajax({
		type: "POST",
		url: mainUrl+"/yszx/getYssbXxList.do",
 		dataType:"json",
 		async:false,
        contentType:"application/json",
        data:JSON.stringify(params),
        success:function(data){
        	// 如果上下文路径不是yszx-cjpt-web 还要转成json对象
        	if(window.location.pathname.split("/")[1] != "yszx-cjpt-web"){
        		data = eval('('+data+')');
        	}
        	// 第一种查询到了数据 第二种是没有查询到数据 第三种查询发生异常
        	if(data.code == "0" && data.datas.length > 0){
 				result.code = "0";
 				result.datas = data.datas;
 				result.size = data.datas.length;
        	} else if(data.code == "0" && data.datas.length == 0){
 				result.code = "0";
 				result.datas = [];
 				result.size = 0;
 			} else if(data.code == "9"){
 				result.code = "9";
 				result.msg = data.msg;
 			}
 		},error:function(data){
 			if(yccl){
 				parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
 			}
 		}
	});
	return result;
}

/** ============================= 给弹窗赋值 =============================**/
function getModelData(result){
	// 清空上次的选中状态
	$("#tcWindow tr>td>input[type='radio']").attr('checked', false);
	var sbysxxGrid = result.datas;
	paging("sbysxxGrid", sbysxxGrid);
	// 自动勾选第一条数据
	if(sbysxxGrid.length>0){
		$("#tcWindow tr>td>input[type='radio']").first().attr('checked', true);
	}
}

/**
 * 分页
 */
function paging(tableName, data) {
	cleanTable(tableName);
	var lineNumber = 1;
	var nums = $("#pageSize").val();
	$("#pageInfo").html("条/页，共" + data.length + "条信息");
	// 每页出现的数量
	var pages = Math.ceil(data.length / nums); // 得到总页数
	// 调用分页
	laypage({
		cont : 'page1',
		pages : pages,
		jump : function(obj, first) {
			cleanTable(tableName);
			dataPaging(tableName, data, obj.curr, nums);
		}
	});
}

/**
 * 清空表数据
 */
function cleanTable(tableName) {
	$("#" + tableName + " tr:not(:first)").remove();
}

function dataPaging(tableName, data, curr, nums) {
	var last = curr * nums - 1;
	last = last >= data.length ? (data.length - 1) : last;
	// 排序
	data.sort(function(a,b) {
		return Date.parse(b.strLrrq.replace(/-/g,"/"))-Date.parse(a.strLrrq.replace(/-/g,"/"));
	});
	var pageData = [];
	for (var i = (curr * nums - nums); i <= last; i++) {
		pageData.push(data[i]);
	}
	// 序号赋值
	var xh = (curr * nums - nums);
	for (var j = 0; j < pageData.length; j++) {
		pageData[j].index = xh;
		xh++;
	}
	var scope = angular.element($('#viewCtrlid')).scope();
	if (typeof (scope) == 'undefined') {
		scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
	}
	scope.sbysxxList = pageData;
	//调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
}

/** ============================= 发起请求删除数据 =============================**/
function updateYssbBz(yssbid) {
	parent.layer.confirm('请确认是否删除该条数据！',{
		title:'提示',
		icon: 3,
		cancel : function(index,layero){
			//X按钮
			parent.layer.close(index);
		},
		btn : ['确定','取消'],
		btn2:function(index){
			//取消按钮
			parent.layer.close(index);
		}
	},function(index){
		//确定按钮
		parent.layer.close(index);
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var params = {};
		params.yssbid = yssbid;
		$.ajax({
			type: "POST",
			url: mainUrl+"/yszx/updateYssbBz.do",
	 		dataType:"json",
	 		async:false,
	        contentType:"application/json",
	        data:JSON.stringify(params),
	        success:function(data){
	        	// 如果上下文路径不是yszx-cjpt-web 还要转成json对象
	        	if(window.location.pathname.split("/")[1] != "yszx-cjpt-web"){
	        		data = eval('('+data+')');
	        	}
	        	// 第一种删除数据成功当点击确认按钮和X按钮 刷新列表数据 第二种是删除发生异常则提示
	        	if(data.code == "0"){
	        		parent.layer.confirm('删除数据成功！',{
	 					title:'提示',
	 					btn : ['确定'],
	 					icon: 1,
	 					cancel : function(index,layero){
		 						parent.layer.close(index);
		 						var result = getYssbXxList();
		 						getModelData(result);
							},
	 				},function(index){
	 					parent.layer.close(index);
						var result = getYssbXxList();
						getModelData(result);
	 				});
	 			} else if(data.code == "9"){
	 				parent.layer.alert(data.msg, {title:"提示",icon: 2});
	 			}
	 		},error:function(data){
	 			parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
	 		}
		});
	});
}

/** ============================= 发起请求查询申报要素数据 =============================**/
//zhuyanfeng 2019-06-13 增加参数yccl，用于控制异常（成功等）是否需要alert。默认需要（true）
//zhuyanfeng  2019-06-13 给每一种终态设定返回值，主要是和yccl进行配合，由调用者处理这些终态的提示
//-2：请求异常； -1：没有合适的数据；0：操作成功；1：查询数据失败，后台返回的提示
function ImportBtn(yccl){
	//返回调用者的数据载体
	var resMsg = {
			code: 0,	//标志码
			msg: ""		//提示语
	};
	// 获取选中数据
	var selectYsxx = $('input[name="selectYsxx"]:checked');
	if (selectYsxx && selectYsxx.length == 0) {
		if(yccl != false){
			parent.layer.alert('请选择一条数据进行导入！', {title:"提示",icon: 2});
		}
		resMsg.code = -1;
		resMsg.msg = "";
		return resMsg;
	}
	var yssbid = $(selectYsxx).attr("id");
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var params = {};
	params.yssbid = yssbid;
	$.ajax({
		type: "POST",
		url: mainUrl+"/yszx/getYssbData.do",
 		dataType:"json",
 		async:false,
        contentType:"application/json",
        data:JSON.stringify(params),
        success:function(data){
        	// 如果上下文路径不是yszx-cjpt-web 还要转成json对象
        	if(window.location.pathname.split("/")[1] != "yszx-cjpt-web"){
        		data = eval('('+data+')');
        	}
        	// 第一种查询数据成功，第二种是查询数据失败，则提示
        	if(data.code == "0" && !isEmptyObject(data.ysData)){
        		//获取form页iframe frmMain
        		var frmMain = $(window.parent.document).find("iframe[id='frmMain']");
        		//获取formData
        		var formData = frmMain[0].contentWindow.formData;
        		//获取公式引擎formulaEngine
        		var formulaEngine = frmMain[0].contentWindow.formulaEngine;
        		//获取表单引擎formEngine
        		var formEngine = frmMain[0].contentWindow.formEngine;
        		//获取附表页iframe frmSheet
        		var frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
        		//获取附表页iframe 页id为viewCtrlId元素 整个页面div
        		var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
        		//获取视图引擎 viewEngine
        		var viewEngine = frmSheet[0].contentWindow.viewEngine;
        		//获取附表页iframe页的body
        		var body = frmSheet[0].contentWindow.document.body;
        		// 赋值
        		var wbcsh = data.ysData;
        		wbcsh =  wbcsh.replace(/\"/g,"'");
        		wbcsh = Base64.encode(wbcsh);
        		var $wbcsh = frmMain.contents().find("#wbcsh");
        		$wbcsh.val(wbcsh);
        		// 执行外部初始化公式
        		formulaEngine.executeWbcshFormula();
        		//执行对应类型的公式（检验公式和控制公式）
        		formulaEngine.applyImportFormulas(false);
        		// 刷新form表单
        		viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
        		viewEngine.formApply($viewAppElement);
        		// 渲染校验公式、控制公式效果
        		viewEngine.tipsForVerify2(body);
        		// 最后关闭弹窗
        		var $winbox_bg = $(window.parent.document).find(".winbox_bg");
                $winbox_bg.remove();
                $(window.parent.document).find("#myModa5").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        		if(yccl){
        			parent.layer.alert("导入数据成功！", {title:"提示",icon: 1});
        		}
        		resMsg.code = 0;
        		resMsg.msg = "操作成功";
 			} else if(data.code == "0"){
 	    		if(yccl){
 	    			parent.layer.alert(data.msg, {title:"提示",icon: 2});
 	    		}
        		resMsg.code = 1;
        		resMsg.msg = data.msg;
 			} else if(data.code == "9"){
 	    		if(yccl){
 	    			parent.layer.alert(data.msg, {title:"提示",icon: 2});
 	    		}
        		resMsg.code = 1;
        		resMsg.msg = data.msg;
 			}
 		},error:function(data){
    		if(yccl){
    			parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
    		}
    		resMsg.code = -2;
    		resMsg.msg = data.msg;
 		}
	});
	return resMsg;
}

/** ============================= 判断传参是否为空 =============================**/
function isEmptyObject(obj){
	if(obj==""||obj==null||obj==undefined){
		return true;
	}else{
		return false;
	}
}

/** ============================= 获取URL上的参数 =============================**/
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.parent.location.search.substr(1).match(reg);
     if(r!=null)return unescape(r[2]);return null;
}

/** ============================= 点击行自动勾选对应的单选框 =============================**/
function selectYsxxFun(obj){
	var id = $(obj).children().first().text();
	$("#"+id).attr('checked', true);
}
