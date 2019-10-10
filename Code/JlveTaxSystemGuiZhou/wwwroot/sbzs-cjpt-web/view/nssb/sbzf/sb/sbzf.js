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
		// console.log("启动IE7兼容性支持：" + ua);
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
viewApp.filter('gdslxDm',
		function() {
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
 * 按钮转换
 */
viewApp.filter('pzxh',
		function() {
			return function(item) {
				return "<button class=\"layui-btn layui-btn-xs\" onclick='getsbzfmx(\""+item.sbqdzf+"\",\""+item.sbfsDm+"\",\""+item.pzxh+"\",\""+item.gdslxDm+"\",\""+item.skssqq+"\",\""+item.skssqz+"\",\""+item.sbrq+"\",\""+item.yzpzzlDm+"\")'>申报作废</button>";
				//return "<a style=\"margin-left:18px\" class=\"sbtn sbtn02\"  href='javaScript:getsbzfmx(\""+item.sbqdzf+"\",\""+item.sbfsDm+"\",\""+item.pzxh+"\",\""+item.gdslxDm+"\",\""+item.skssqq+"\",\""+item.skssqz+"\",\""+item.sbrq+"\",\""+item.yzpzzlDm+"\")'>申报作废</a>";
			};
		});

var nsrjosn ={};
/**
 *页面加载提示
 */
window.onload=function(){
	//初始化日期控件
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
		layer.alert('部署模式参数错误', {icon: 5});
	}
	var nsr = jQuery.parseJSON(nsrxx);
	var error = nsr.error;
	if (null != error && "" != error) {
		dhtmlx.message(error, "error", 10000);
	}
	nsrjosn = nsrxx;
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	$.ajax({
		type : "post",
		url : "getSsqz.do",
		data : {},
		success : function(data) {
			var dataJSON=$.parseJSON(data);	
			if(isQuery=="Y"){
				//$("#skssqq").val(skssqq_1);
				//$("#skssqz").val(skssqz_1);
				$("#sbrqq").val(dataJSON.sbrqq);
				$("#sbrqz").val(dataJSON.sbrqz);
				$("#gdbz").val(gdbz_);
				//queryBtn();
			}else{
				//$("#skssqq").val(dataJSON.sksqq);
				//$("#skssqz").val(dataJSON.sksqz);
				$("#sbrqq").val(dataJSON.sbrqq);
				$("#sbrqz").val(dataJSON.sbrqz);
			}
		},
		error : function() {

		},
		complete : function() {
			layer.close(index);
		}
	});
	
	
} 

/**
 * 重置
 */
function resetBtn(){
	window.location.href = 'sbzf.do?&ywbm='+ywbm;
}

/**
 * 查询申报作废列表
 */
function queryBtn(){
	//获取查询条件
	var gdbz = $("#gdbz").val();
	var sbrqq = $("#sbrqq").val();
	var sbrqz = $("#sbrqz").val();

	var skssqq = $("#skssqq").val();
	var skssqz = $("#skssqz").val();

	// 校验申报日期
	var isok = doBeforeQuery(skssqq,skssqz,sbrqq,sbrqz);
	if (!isok) return;
	//获取纳税人信息
	var nsrxx = jQuery.parseJSON(nsrjosn);
	var reqParamsObj = {};
	reqParamsObj.gsDjxh = nsrxx.gsDjxh;
	reqParamsObj.dsDjxh = nsrxx.dsDjxh;
	reqParamsObj.gsNsrsbh = nsrxx.gsNsrsbh;
	reqParamsObj.dsNsrsbh = nsrxx.dsNsrsbh;
	reqParamsObj.gsZgswjdm = nsrxx.gsZgswjdm;
	reqParamsObj.dsZgswjdm = nsrxx.dsZgswjdm;
	reqParamsObj.gsSwjgDm = nsrxx.gsSwjgDm;
	reqParamsObj.dsSwjgDm = nsrxx.dsSwjgDm;
	var reqParamsObjStr=JSON.stringify(reqParamsObj);
	//查询申报作废信息列表
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
	var sbzfreq ="getsbzf.do?gdbz="+gdbz+"&skssqq="+skssqq+"&skssqz="+skssqz+"&sbrqq="+sbrqq+"&sbrqz="+sbrqz+"&gdslxDm="+gdslxDm_+"&ywbm="+ywbm;
	$.ajax({
		url:sbzfreq,
		type:"GET",
		data:{reqParamsJSON:reqParamsObjStr},
		dataType:"json",
		contentType:"application/json",
		success:function(data) {
			//test
			//data = "{\"sbzfList\":[{\"zsxmDm\":\"10104\",\"yzpzzlmc\":\"《中华人民共和国企业所得税年度纳税申报表（A类）》（2017）\",\"skssqq\":\"2015-01-02\",\"gdslxDm\":\"2\",\"pzxh\":\"10024415000000944177\",\"yzpzzlDm\":\"BDA0610994\",\"sbrq\":\"2016-05-17\",\"ybtse\":\"0.00\",\"skssqz\":\"2015-01-02\",\"zsxmmc\":\"企业所得税\",\"sbfsDm\":\"32\",\"sbfsmc\":\"网络申报\",\"sbqdzf\":\"\"},{\"zsxmDm\":\"10104\",\"yzpzzlmc\":\"企业所得税月（季）度（查账征收）\",\"skssqq\":\"2015-01-01\",\"gdslxDm\":\"2\",\"pzxh\":\"10024415000000944139\",\"yzpzzlDm\":\"BDA0610756\",\"sbrq\":\"2015-10-16\",\"ybtse\":\"0.12\",\"skssqz\":\"2015-12-31\",\"zsxmmc\":\"企业所得税\",\"sbfsDm\":\"10\",\"sbfsmc\":\"直接(上门)申报\",\"sbqdzf\":\"\"},{\"zsxmDm\":\"10104\",\"yzpzzlmc\":\"企业所得税月（季）度（查账征收）\",\"skssqq\":\"2015-01-01\",\"gdslxDm\":\"2\",\"pzxh\":\"10024415000000944139\",\"yzpzzlDm\":\"BDA0610756\",\"sbrq\":\"2015-10-16\",\"ybtse\":\"0.12\",\"skssqz\":\"2015-12-31\",\"zsxmmc\":\"企业所得税\",\"sbfsDm\":\"10\",\"sbfsmc\":\"直接(上门)申报\",\"sbqdzf\":\"\"}],\"msg\":\"\"}";
			var result = eval("(" + data + ")");
			
			//异常信息
			var errormsg = result.msg;
			//申报作废信息
			var sbxxList = result.sbzfList;
			//分页
			paging("sbxxList",sbxxList);
		    //异常提醒
			if(errormsg != ""){
				layer.alert(errormsg);
			}
		},
		error:function(){
			layer.alert('链接超时或网络异常', {icon: 5});
		},
		complete:function(){
			layer.close(index);
		}
	});
	
}



/**
 * 跳转明细
 * @param pzxh
 * @param gdslxDm
 * @param skssqq
 * @param skssqz
 * @param sbrq
 * @param yzpzzlDm
 */
function getsbzfmx(sbqdzf,sbfsDm,pzxh, gdslxDm, skssqq, skssqz, sbrq, yzpzzlDm) {
	if(sbqdzf == "N" && sbfsDm == '10'){
		alertMsg("不允许作废“直接（上门）申报”！");
		return ;
	}
	var gdsdjxh = "";
	var gdsnsrsbh = "";
	var gdszgswjgDm = "";
	var gdsswjgDm = "";
	var result = eval("(" + nsrjosn + ")");
	if (gdslxDm == "1") {
		gdsdjxh = result.gsDjxh;
		gdsnsrsbh = result.gsNsrsbh;
		gdszgswjgDm = result.gsZgswjdm;
		gdsswjgDm = result.gsSwjgDm;
	} else {
		gdsdjxh = result.dsDjxh;
		gdsnsrsbh = result.dsNsrsbh;
		gdszgswjgDm = result.dsZgswjdm;
		gdsswjgDm = result.dsSwjgDm;
	}
	
	var skssqq_ = $("#skssq").val();
	var skssqz_ = $("#skssz").val()
	var gdbz_ = $("#gdbz").val();
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
	var reqParamsObj = {};
	reqParamsObj.pzxh = pzxh;
	reqParamsObj.skssqq = skssqq;
	reqParamsObj.skssqz = skssqz;
	reqParamsObj.gdslxDm = gdslxDm;
	reqParamsObj.djxh = gdsdjxh;
	reqParamsObj.yzpzzlDm = yzpzzlDm;
	var reqParamsObjStr = JSON.stringify(reqParamsObj);
	var isok = false;
	var sbqxurl = "getSbqx.do?gdslxDm=" + gdslxDm;
    var single = false;		// 是否为单次作废
    single = isSingleZf(skssqq,skssqz);
    //DLGSWSBSSC-289 ， 按次作废的，不需要判断是否逾期，直接提交。
    //是否跳过按次申报逾期检查，默认跳过，可通过菜单URL参数配置
    //即，在菜单URL中配置为chk_single_qx=true或者不配置时，跳过，只有在配置为false时候，才会对按次作废进行逾期校验
	var bool_chkSingleQx = str_chkSingleQx=='true' ? true : false;
	if(bool_chkSingleQx && single) {
		//alert("按次申报跳过逾期校验");
        window.location.href = "sbzfmx.do?pzxh=" + pzxh + "&gdslxDm="
            + gdslxDm + "&skssqq=" + skssqq + "&skssqz=" + skssqz
            + "&sbrq=" + sbrq + "&sbblxDm=" + yzpzzlDm
            + "&gdsdjxh=" + gdsdjxh + "&gdsnsrsbh=" + gdsnsrsbh
            + "&gdszgswjgDm=" + gdszgswjgDm + "&gdsswjgDm="
            + gdsswjgDm + "&skssqq_=" + skssqq_ + "&skssqz_="
            + skssqz_ + "&gdbz_=" + gdbz_ + "&ywbm=" + ywbm;

	} else {
        //alert("按次申报要做逾期校验");
        $.ajax({
            type: "post",
            async: false, // ajax同步
            url: sbqxurl,
            data: {
                reqParamsJSON: reqParamsObjStr
            },
            success: function (data) {
                var dataJSON = $.parseJSON(data);
                var reCode = dataJSON.reCode;
                if (reCode == "2") {
                    var errMsg = dataJSON.errMsg;
                    layer.alert("<br>" + errMsg + "!");
                    isok = false;
                }
                var qxbz = dataJSON.qxbz;
                var nsqx = dataJSON.nsqx;
                // 期限标志 0 表示 校验通过 1表示 逾期申报
                if (qxbz == "1") {
                    // 若申报日期 大于纳税期限 已逾期申报
                	alertMsg("<br>逾期不允许作废，最晚作废期限为" + nsqx + "!");
                    isok = false;
                } else {
                    isok = true;
                }
                if (isok) {
                    window.location.href = "sbzfmx.do?pzxh=" + pzxh + "&gdslxDm="
                        + gdslxDm + "&skssqq=" + skssqq + "&skssqz=" + skssqz
                        + "&sbrq=" + sbrq + "&sbblxDm=" + yzpzzlDm
                        + "&gdsdjxh=" + gdsdjxh + "&gdsnsrsbh=" + gdsnsrsbh
                        + "&gdszgswjgDm=" + gdszgswjgDm + "&gdsswjgDm="
                        + gdsswjgDm + "&skssqq_=" + skssqq_ + "&skssqz_="
                        + skssqz_ + "&gdbz_=" + gdbz_ + "&ywbm=" + ywbm;
                }

            },
            error: function () {

            },
            complete: function () {
            	layer.close(index);
            }
        });
    }
}

/**
 * 是否为按此申报
 */

function isSingleZf(skssqq,skssqz) {

    var skssqqArr = skssqq.split("-");
    var skssqzArr = skssqz.split("-");
    //起止年月日
    var syear = skssqqArr[0];
    var eyear = skssqzArr[0];
    var smonth = skssqqArr[1];
    var emonth = skssqzArr[1];
    var sday = skssqqArr[2];
    var eday = skssqzArr[2];

    if (syear == eyear &&  smonth == emonth && sday == eday){//相同一天为按次申报
       return true;
    }
	return false;
}

/**
 * 分页
 */
function paging(tableName, data) {
	if (data.length > 0) {
		cleanTable(tableName);
	}
	var lineNumber = 1;
	var nums = "10";//$("#pageSize").val();
	$("#pageInfo").html("条/页，共" + data.length + "条信息");
	// 每页出现的数量
	var pages = Math.ceil(data.length / nums); // 得到总页数
	// 调用分页
	laypage({
		cont : 'page1',
		pages : pages,
		jump : function(obj, first) {
			if (data.length != 0) {
				cleanTable(tableName);
			}
			sbxxpaging(tableName, data, obj.curr, nums);
		}
	});
}



/**
 * 清楚表数据
 * @param tableName
 */
function cleanTable(tableName){
	$("#"+tableName+" tr:not(:first)").remove();
}


function sbxxpaging(tableName, data, curr, nums) {
	var last = curr * nums - 1;
	last = last >= data.length ? (data.length - 1) : last;
	var pageData = [];
	for (var i = (curr * nums - nums); i <= last; i++) {
		pageData.push(data[i]);
	}
	var scope = angular.element($('#viewCtrlid')).scope();
	if(typeof(scope)=='undefined'){
		scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
	}
	scope.items = pageData;
	// 调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
}

function doAfterQuery(){
	$("table").find("tr").each(function(){
		var pzxh=$(this).attr("pzxh");
		if(undefined!=pzxh){//增加手心样式
			$(this).css({"cursor":"pointer"});
			$(this).attr("title","点击查看详细报表");
			
			//判断 如果某条申报记录的申报日期迟于申报期限，则该条记录以红色显示。 
			var sbrq=$(this).find("td:eq(4)").text();
			var sbqx=$(this).find("td:eq(5)").text();
			if(sbrq>sbqx){
				$(this).css({"background-color":"#da7979"});//红色背景
				$(this).find("td").css({"color":"#fff"});//白色底
				/*$(this).find("td").css({"color":"#E00"});//红色文字*/
			}
		}
		
		//点击事件
		$(this).click(function(){
			if(undefined!=pzxh){
				window.open("/web-sbzs/nssb/printPdf.do?pzxh="+pzxh);
			}
			
		});
	});
}

function doBeforeQuery(skssqq,skssqz,sbrqq,sbrqz){
	if(skssqq =="" && skssqz == "" && sbrqq == "" && sbrqz == ""){
		alertMsg('申报日期起止、税款所属时期起止，请至少选择一项！', {icon: 5});
		return false;
	}
	if(sbrqq !="" && sbrqz == ""){
		alertMsg('申报日期止不能为空！', {icon: 5});
		return false;
	}
	if(sbrqz !="" && sbrqq == ""){
		alertMsg('申报日期起不能为空！', {icon: 5});
		return false;
	}
	if(skssqq !="" && skssqz == ""){
		alertMsg('税款所属期止不能为空！', {icon: 5});
		return false;
	}
	if(skssqz !="" && skssqq == ""){
		alertMsg('税款所属期起不能为空！', {icon: 5});
		return false;
	}
	if(!validateTimeStart(skssqq)){
		alertMsg('税款所属期起应为每月月初！', {icon: 5});
		return false;
	}
	if(!validateTimeEnd(skssqz)){
		alertMsg('税款所属期止应为每月月末！', {icon: 5});
		return false;
	}
	if(sbrqq > sbrqz){
		alertMsg('申报日期止的时间不能小于申报日期起的时间！', {icon: 5});
		return false;
	}
	if(skssqq > skssqz){
		alertMsg('税款所属期止的时间不能小于税款所属期起！', {icon: 5});
		return false;
	}
	return true;
}


/*
 * 提示
 */
function alertMsg(msg,index){
	layui.use('layer', function(){
		var layer = layui.layer;
		var top = "auto"// 默认自动
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
