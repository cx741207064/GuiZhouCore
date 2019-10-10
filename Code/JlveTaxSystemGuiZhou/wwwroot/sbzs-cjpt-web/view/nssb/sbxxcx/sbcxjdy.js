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
//全渠道不再使用打印，而是查看或下载
// viewApp.filter('pzxh',
// 		function() {
// 			return function(item) {
// 					return "<a class=\"sbtn sbtn02\"  onclick='openPdf(\""+item.pzxh+"\",\""+item.gdslxDm+"\")'>打印</button>";
// 			};
// 		});
viewApp.filter('pzxh',
    function() {
        return function(item) {
            if (item.pzxh == null || item.pzxh == "")
            //凭证序号为 为null 导出盘报类
                return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','3','"+item.gdslxDm+"')\">查看</button>";
            else
            //正常申报类
            if(item.showType == "0"){
                if(item.sbzfbz == "Y"){
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"warmInfo('0');\" >查看</button>";
                }else{
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>";
                }
            }else if(item.showType == "1"){
                if(item.sbzfbz == "Y"){
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"warmInfo('1');\" >下载</button>";
                }else{
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
                }
            }else if(item.showType == "2"){
                if(item.sbzfbz == "Y"){
                    return "<button style=\"margin:2px 1.5px;\" class=\"layui-btn layui-btn-sm\" onclick=\"warmInfo('0');\" >查看</button>" +
                        "<button class=\"layui-btn layui-btn-sm\" onclick=\"warmInfo('1');\" >下载</button>";
                }else{
                    return "<button style=\"margin:2px 1.5px;\" class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>" +
                        "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
                }
            }else{
                if(item.sbzfbz == "Y"){
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"warmInfo('1');\" >下载</button>";
                }else{
                    return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
                }
            }
        };
    });

//id = 原ywrz jylsh
viewApp.filter('id',
    function() {
        return function(item) {
            if (item.id == null || item.id == "")
            // 其他按钮预留
                return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','2','"+item.gdslxDm+"')\">查看</button>";
            else
                return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','2','"+item.gdslxDm+"')\" >查看</button>" ;
        };
    });

//cksbb查看申报表 1.0补打功能
viewApp.filter('cksbb',
    function() {
        return function(item) {
            //非本地渠道处理
        	if(item.version == 4) {
                return "<button class=\"layui-btn layui-btn-sm\"  onclick='alertMsgs(\"非本渠道申报，暂不提供打印!\", {icon : 5})'>查看</button>";
            } else {
                return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cksbb('" + item.gnId + "','" + item.bdDm + "','" + item.id + "','" + item.gdslxDm + "','" + item.sjgsrq + "','" + item.sjgsdq + "')\">查看</button>";
            }};
    });

//增值税0申报后，征管自动申报一税两费  2.0依申请补打pdf
viewApp.filter('fjssb',
    function() {
        return function(item) {
                return "<button class=\"layui-btn layui-btn-sm\" onclick=\"fjssbb('" + item.gdslxDm + "','" + item.pzxh + "','" + item.skssqq + "','" + item.skssqz + "','" + item.sbrq + "','" + item.yzpzzlDm + "')\">查看</button>";
            };
    });



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

var isFirstChangeiframeHight = true;//只改变一次ifrMain容器的高度
var nsrjosn ={};
/**
 *页面加载提示
 */
window.onload=function(){
	var nsr = jQuery.parseJSON(nsrxx);
	var error = nsr.error;
	if (null != error && "" != error) {
		dhtmlx.message(error, "info", 3000);
	}
	//判断是否传有sssq，兼容北京的金财管家。
	var sssqQ = $('#sssqQ').val();
	var sssqZ = $('#sssqZ').val();
	var nsqx = (sssqQ == 'null'||sssqZ == 'null'||sssqQ == 'undefined'||sssqZ == 'undefined')?'null':getNsqxForSkssq(sssqQ,sssqZ);
	$('#nsqx').val(nsqx);
	nsrjosn = nsrxx;
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

function warmInfo(type){
    if(type=="0"){
        alertMsgs('已作废的申报数据暂不支持查看PDF!', {icon: 5});
    }else if(type=="1"){
        alertMsgs('已作废的申报数据暂不支持下载PDF!', {icon: 5});
    }
}

/**
 * 重置
 */
function resetBtn(){
	window.location.href = 'sbcx.do?ywbm='+ywbm;
}

/**下载PDF*/
function cxDownloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm){
    dtdownloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm)
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
	var isok = jyCxtjfun(skssqq,skssqz,sbrqq,sbrqz);
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
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var reqUrl ="getsbxx.do?gdbz="+gdbz+"&skssqq="+skssqq+"&skssqz="+skssqz+"&gdslxDm="+gdslxDm_+"&sbrqq="+sbrqq+"&sbrqz="+sbrqz+"&ywbm="+ywbm;
	$.ajax({
		url:reqUrl,
		type:"GET",
		data:{reqParamsJSON:reqParamsObjStr},
		dataType:"json",
		contentType:"application/json",
		success:function(data) {
			//取值
			var result = eval("(" + data + ")");
			//异常信息
			var errormsg = result.msg;
			//申报作废信息
			var sbxxList = result.sbxxList;
			var nsqx = $("#nsqx").val();
			
			//分页
			if(nsqx == "null"){
				paging("sbxxGrid",sbxxList);
			}else{
				var newSbxxList = [];//保存北京根据nsqx过滤的List
				for(var i = 0;i<sbxxList.length;i++){
					var skssqq = sbxxList[i].skssqq;
					var skssqz = sbxxList[i].skssqz;
					var querySbqx = getNsqxForSkssq(skssqq,skssqz);
					if(nsqx == '10' && nsqx == querySbqx){
						newSbxxList.push(sbxxList[i]);
					}else if(nsqx == '06' || nsqx == '08' && nsqx == querySbqx){
						newSbxxList.push(sbxxList[i]);
					}
				}
				paging("sbxxGrid",newSbxxList);
			}
		    //异常提醒
			if(errormsg != ""){
				alertMsgs(errormsg);
			}
		},
		error:function(){
			alertMsgs('链接超时或服务异常!', {icon: 5});
		},
		complete:function(){
			layer.close(index);
		}
	});
	
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

/**
 * 分页
 * @param tableName
 * @param data
 * @param curr
 * @param nums
 */
function sbxxpaging(tableName, data, curr, nums) {
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
	var scope = angular.element($('#viewCtrlid')).scope();
	if(typeof(scope)=='undefined'){
		scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
	}
	if(pageData==null || pageData==undefined || pageData.length<1){
		$("#sbxxNotTips").show()
	}else{
		$("#sbxxNotTips").hide()
	}
	// 调用$scope中的方法
	scope.items = pageData;
	// 调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
	
}

/**
 * 打印pdf  
 */
/*
function openPdf(pzxh,gdslxDm){
	//此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询归档信息
	dtprintPdf(pzxh,gdslxDm);
}
*/

/**
 * 查询pdf、导出pdf
 * @param pzxh
 * @param czlxDm
 * @param gdslxDm
 */
function queryAndexport(pzxh, version,gdslxDm,ysqxxid) {
    // alert("查看PDF");
    //此方法可重写 根据地方实际情况获取PDF信息 此处默认查询产品归档信息  其中VERSION 1 表示PZXH = 依申请PZXH、 3 PZXH=表示依申请 ID、 2 表示  PZXH =原NSBB_YWRZ的JYLSH
    //printPdf(pzxh, version,gdslxDm);
	dtprintPdf(pzxh,gdslxDm,ysqxxid);
}

/**
 *
 * @param ysqxxid   依申请id
 * @param version   版本类型
 * @param gdslxDm   国地税类型代码
 * @param ywbm      业务编码
 */
function downPdf(ysqxxid,version,gdslxDm,ywbm){
    var downPdfurl="/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ysqxxid="+ysqxxid+"&viewOrDownload=download&gdslxDm="+gdslxDm+"&ywbm="+ywbm;
    window.open(downPdfurl);
}


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
            alertMsgs('链接超时或服务异常!', {icon: 5});
        }
    });
}

function getNsqxForSkssq(skssqq,skssqz) {
	var newTime = new Date();
	var nsqx = '';
	var skssqqArr = skssqq.split("-");
	var skssqzArr = skssqz.split("-");
	//起止年月日
	var syear = skssqqArr[0];
	var eyear = skssqzArr[0];
	var smonth = skssqqArr[1];
	var emonth = skssqzArr[1];
	var sday = skssqqArr[2];
	var eday = skssqzArr[2];
	
	if (smonth == emonth && sday == eday){//相同一天为按次申报
		nsqx = "11";
	}
	if (smonth == emonth && sday != eday){//相同月不同天为按月申报
		nsqx = "06";
	}
	if (smonth != emonth){//不同月可能为按季申报/半年申报/按年申报
		if ((parseInt(emonth)-parseInt(smonth)) == 11){//年报
			nsqx = "10";
		}
		if ((parseInt(emonth)-parseInt(smonth)) >= 5 && (parseInt(emonth)-parseInt(smonth)) != 11){//半年报
			if (newTime.getMonth() >=0 && newTime.getMonth() < 6){
				nsqx = "09";
			}
			if (newTime.getMonth() > 5 && newTime.getMonth() <= 11){
				nsqx = "09";
			}
		}
		if ((parseInt(emonth)-parseInt(smonth)) == 2 ){
			//1-3
			if (skssqq==syear+"-01-01"&& skssqz==eyear+"-03-31"){
				nsqx = "08";
			}
			//4-6
			if (skssqq==syear+"-04-01"&& skssqz==eyear+"-06-30"){
				nsqx = "08";
			}
			//7-9
			if (skssqq==syear+"-07-01"&& skssqz==eyear+"-09-30"){
				nsqx = "08";
			}
			//10-12
			if (skssqq==syear+"-10-01"&& skssqz==eyear+"-12-31"){
				nsqx = "08";
			}
		}
	}
	return nsqx;
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
function alertMsgs(msg,index){
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



/**
 * 增值税0申报后，征管自动申报一税两费。打印时自动补偿pdf
 * @param gdslxDm
 * @param pzxh
 * @param skssqq
 * @param skssqz
 * @param sbrq
 * @param yzpzzlDm
 */
function fjssbb(gdslxDm,pzxh,skssqq,skssqz,sbrq,yzpzzlDm){
	var top="auto"// 默认自动
	try{
		if(window.top==window.self){
			// 不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var reqUrl ="getPdfByFjssbb.do?gdslxDm="+gdslxDm+"&pzxh="+pzxh+"&skssqq="+skssqq+"&skssqz="+skssqz+"&sbrq="+sbrq+"&yzpzzlDm="+yzpzzlDm;
	$.ajax({
		url:reqUrl,
		type:"GET",
		data:{},
		dataType:"json",
		contentType:"application/json",
		success : function(data) {
			var result = eval("(" + data + ")");
			var hcbz = result.hcbz;
			if(hcbz ==="Y"){
				// 获取pdf展示
				var pdfName = result.pdfName;
				var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName="+ pdfName + "&gdslxDm=" + gdslxDm;
				window.open(url);	
			}else{
				alertMsgs('合成PDF失败!', {icon: 5});
			}

		
		},
		error:function(){
			alertMsgs('链接超时或服务异常!', {icon: 5});
		},
		complete:function(){
			layer.close(index);
		}
	});
}
