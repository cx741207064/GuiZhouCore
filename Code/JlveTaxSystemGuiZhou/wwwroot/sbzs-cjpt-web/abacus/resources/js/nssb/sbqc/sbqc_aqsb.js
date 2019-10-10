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
var  formCT={};
var ua = navigator.userAgent;
if (ua && ua.indexOf("MSIE 7") >= 0) {
	// Completely disable SCE to support IE7.
	viewApp.config(function($sceProvider) {
		//console.log("启动IE7兼容性支持：" + ua);
		$sceProvider.enabled(false);
	});
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http,
		$location) {
	$scope.CT = formCT;
});
viewApp.filter('to_trusted', [ '$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
} ]);

/**
 * 自定义初始化代码表指令
 */
viewApp.directive('ngCodetableInit', function(){
    return {
        require: '?^viewCtrl',
        priority: 100,
        scope: true,
        /*            link: function ($scope, $element, $attr) {var _attr = $element.attr("ng-codetable-init");var _xpath = _attr.split(',')[0];var _sattr = _attr.split(',')[1];
         $.when($.getJSON(_xpath)).then(function(response){$scope[_sattr] = response.root;});
         }*/
        compile: function (element, attributes){
            return {
                pre: function preLink($scope, $element, attributes) {
                    var _attr = $element.attr("ng-codetable-init")
                    var _xpath = _attr.split(',')[0];
                    var _sattr = _attr.split(',')[1];
                    var _data;
                    $.when($.getJSON(_xpath)).then(function(response){
                        $scope[_sattr] = response.root;
                        _data = response.root;
                        viewEngine.formApply($('#viewCtrlId'), _sattr, _data);
                    });
                },
                post: function postLink($scope, $element, attributes) {
                }
            }
        }
    }
});

/**
 * 自定义初始化代码表指令
 * 带缓存
 */
viewApp.directive('ngCodetable', function(){
    return {
        require: '?^viewCtrl',
        priority: 100,
        restrict : "E",
        scope: true,
        compile: function (element, attributes){
            return {
                pre: function preLink($scope, $element, attributes) {
                    var _url = $element.attr("url");
                    var _model = $element.attr("model");
                    var _params = $element.attr("params");
                    var _node = $element.attr("node");
                    var _name = $element.attr("name");
                    var _dm = $element.attr("dm");
                    var _mc = $element.attr("mc");
                    var _dynamicParam = $element.attr("dynamic");
                    var _multi = $element.attr("multi");
                    var _data;
                    if(undefined == formCT[_name]) {//判断是否已缓存
                        if(undefined != _url && "" != _url) {//URL来源
                        	if(_url.indexOf('getDmb.do')>-1){
                        		_url=parent.pathRoot+_url;
                        	}
                            $.when($.getJSON(_url)).then(function(response){
                                _data = response;
                                if(undefined == _node || "" == _node) {
                                    //formCT[_name] = response;
                                    _data = response;
                                } else {
                                    //formCT[_name] = response[_node];
                                    _data = response[_node];
                                }
                                //parent.formEngine.cacheCodeTable(_name, _data);
                                formCT[_name] =jQuery.extend(true, {}, _data);
                               // viewEngine.formApply($('#viewCtrlId'), _name, _data);
                            }).fail(function() {
                                dhtmlx.message("codetable指令缓存代码表"+_url+"，请检查...", "error", 2000);
                            });
                        } else {
                        	//codetable指令相关参数缺失
                            dhtmlx.message("codetable指令相关参数缺失，请检查...", "error", 2000);
                        }
                    }
                },
                post: function postLink($scope, $element, attributes) {
                }
            }
        }
    }
});


/**
 * 国地税类型代码转名称
 */
viewApp.filter('gdslxDmFilter',
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
 * 填写申报按钮
 */
viewApp.filter('sbztDmFilter',
		function() {
			return function(item) {
				if(item.sbztDm=="210"&&"Y"!=item.yxcfsb){
					//已申报
					return "<div class=\"sbtnbox\"><span>已申报</span></div>";
				}else{
					//如果是房产税或者是城镇土地税，且开启了查看税源明细标志，可点击查看税源情况
					if(syqcbz == "Y" && ("10110" == item.zsxmDm || "10112" == item.zsxmDm)){
						return "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;padding: 0 8px!important;\" href='javaScript:sbinit(\""+item.url+"\",\""+item.sbqx+"\",\""+item.skssqQ+"\",\""+item.skssqZ+"\",\"" +item.gdslxDm+"\",\""+item.zsxmDm+"\",\""+item.nsqxDm+"\",\""+item.yzpzzlDm+"\",\""+item.sbyfIn+"\")'>填写</a>" 
								+ "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;padding: 0 8px!important;\" onclick='initSymx(\""+item.skssqQ+"\",\""+item.skssqZ+"\",\""+item.zsxmDm+"\",\""+item.zspmDm+"\",\""+item.nsqxDm+"\",\""+item.tjny+"\")'>详情</a>";;
					}else if(item.sbztDm=="210"&&"Y"==item.yxcfsb&&item.sbrq!="null"&&isJxsb=="Y") {
						return "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;width: 80px;\" href='javaScript:sbinit(\""+item.url+"\",\""+item.sbqx+"\",\""+item.skssqQ+"\",\""+item.skssqZ+"\",\"" +item.gdslxDm+"\",\""+item.zsxmDm+"\",\""+item.nsqxDm+"\",\""+item.yzpzzlDm+"\",\""+item.sbyfIn+"\")'>继续申报</a>";
					}else{
						//填写按钮
						return "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;\" href='javaScript:sbinit(\""+item.url+"\",\""+item.sbqx+"\",\""+item.skssqQ+"\",\""+item.skssqZ+"\",\"" +item.gdslxDm+"\",\""+item.zsxmDm+"\",\""+item.nsqxDm+"\",\""+item.yzpzzlDm+"\",\""+item.sbyfIn+"\")'>填写申报表</a>";
					}
				}
			};
		});

/**
 * 刷新按钮
 */
viewApp.filter('uuidFilter',
		function() {
			return function(item, sxh) {
					//刷新按钮
					//console.log("--------------------index--------------", index);
//					return "<div class=\"sbtnbox\"><a class=\"icon\"  href='javaScript:oneRefreshSbqc(\""+item.gdslxDm+"\",\""+item.uuid+"\",\""+sxh+"\")' title=\"刷新申报状态\">"+"<img src=\""+cp+"/resources/images/refresh.png\" width=\"32px\";height=\"32px\"></a></div>";
					return "<a class=\"link-strong remove-line iconfont fsicon-refresh \" href='javaScript:oneRefreshSbqc(\""+item.gdslxDm+"\",\""+item.uuid+"\",\""+sxh+"\")' title=\"刷新申报状态\" style=\"text-decoration: none;font-size: 16px\"></a>";
			};
		});

/**
 * 申报表名称
 */
viewApp.filter('sbbmcFilter', function() {
	return function(zspmDm, sbbmc) {
		if (sbbmc == "null" || sbbmc == undefined || sbbmc == "undefined" || sbbmc == null) {
			return "";
		}
		else{
			//文化建设费，娱乐业
			if("302170100" == zspmDm){
				return sbbmc + "(娱乐业)";
			}
			//文化建设费，广告业
			else if("302170200" == zspmDm){
				return sbbmc + "(广告业)";
			}else{
				return sbbmc;
			}
		}
	};
});

/**
 * 财报国地税类型代码转名称
 */
viewApp.filter('cbgdsbzFilter',
		function() {
			return function(gdsbz) {
				if (gdsbz == "gs")
					return "<span class=\"fontcolor01\">国税</span>";
				if (gdsbz == "ds")
					return "<span class=\"fontcolor02\">地税</span>";
				else
					return "<span class=\"fontcolor01\">国</span><span class=\"fontcolor02\">地</span>";
			};
		});


/**
 * 财报填写申报按钮
 */
viewApp.filter('cbBtnFilter',
		function() {
			return function(item) {
				if(item.sbztDm=="210"){   //已申报 ，但不允许重复申报, -  sbzs.yxcbcfbsbz = N  (不允许重复申报标志)
					//已申报
					return "<div class=\"sbtnbox\"><span>已申报</span></div>";
				}else if(item.bsrq === "") {     //未申报
					//填写按钮
					return "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;\" href='javaScript:cbinit(\""+item.url+"\",\""+item.bsssqQ+"\",\""+item.bsssqZ+"\",\""+item.bsqx+"\")'>填写财报</a>";
				}else{    //已申报，sbztDm='000'   ，sbzs.yxcbcfbsbz = Y 时回写000  可重复申报
					//更正填写
					return "<a class=\"layui-btn layui-btn-primary\" style=\"height:24px;line-height:24px;padding:0 10px;\" href='javaScript:cbgzinit(\""+item.url+"\",\""+item.bsssqQ+"\",\""+item.bsssqZ+"\",\""+item.bsqx+"\",\""+item.bsrq+"\")'>更正财报</a>";
				}
			};
		});

/**
 * 公共参数
 */
var gdbamsBz;//备案控制显示去备案信息标志 GWDW=国无地无 GYDY=国有地有  GYDW=国有地无 GWDY=国无地有 
var gdbabyzBz;//国地备案不一致标志  Y表示不一致N或NULL表示一致
var tqyqsbbz;//是否允许切换月份 Y表示不允许 N或NULL表示允许
var cwbbzzfDm;//财务备案主责方  1 表示主责方在国税 2 表示主责方在地税
var czsjjg;//重置时间间隔
var showGsCburlBz;//国税是否显示现在去备案url标志
var showDsCburlBz;//地税是否显示现在去备案url标志
var showCburlbz;//未启用联合财报模式 是否显示现在去备案url标志
var nsrztxx;//纳税人主体信息
var showGdsbz;//控制是否显示国地税标志Y:显示，N:不显示，默认不显示
var sbqcShowms;//控制显示清册展示模式 SBB模式，其他默认项目品目模式
var sbqcZdrz;//申报清册诊断日志
var cwbbSize;//财务报表条数
var syqcbz; //福建房土税查看明细标志。
var isJxsb; //继续申报按钮显示标志。

//加载数据
function loadAqsb() {
//	var index = layer.load(2, {shade:0.1});
	var index = parent.layer.load(2, {shade:0.1});
	//父页面sksq
//	var sksq = parent.document.getElementById("sksq").innerText;
	var sksq = parent.$("#test3").val();
	var nd = sksq.substr(0, 4);
	var yf = sksq.substr(5, 6);
	var showaqsbUrl = contextRoot+"/biz/sbqc/sbqc_aqsb/enterSbqc?tjNd=" + nd + "&tjYf=" + yf + "&gdslxDm=" + parent.gdslxDm;
	//财税管家请求参数
	if (parent.appid == "csgj") {
		showaqsbUrl += "&appid=" + parent.appid + "&token=" + parent.token + "&yypt_nsrsbh=" + parent.yypt_nsrsbh;
	}
	$.ajax({
		type : "POST",
		url : showaqsbUrl,
		dataType : "json",
		contentType : "text/json",
		data : "",
		success : function(data) {
			// var result = eval("(" + data + ")");
			var sbqcList = data.sbqcList;
			var cwbbList = data.cwbbList;
			var errList = data.errList;
			cwbbzzfDm = data.cwbbzzfDm;
			gdbamsBz = data.gdbamsBz;
			gdbabyzBz = data.gdbabyzBz;
			tqyqsbbz = data.tqyqsbbz;
			syqcbz = data.syqcbz;
			isJxsb = data.isJxsb;
			//判断是否允许切换月份
			isChangeYf();
			czsjjg = data.czsjjg;
			nsrztxx = data.nsrztxx;
			showGdsbz = data.showGdsbz;
			sbqcShowms = data.sbqcShowms;
			sbqcZdrz = data.sbqcZdrz;
			var isGsCburlBz = data.isGsCburlBz;
			var isDsCburlBz = data.isDsCburlBz;
			var scope = angular.element($('#viewCtrlid')).scope();
			if (typeof (scope) == 'undefined') {
				scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
			}
			//是否显示现在去备案url
			showNowCburl(gdbamsBz,cwbbzzfDm,isGsCburlBz,isDsCburlBz);
			scope.qcitems = sbqcList;
			scope.cbitems = cwbbList;
			scope.cwbbzzfDm = cwbbzzfDm;
			scope.gdbamsBz = gdbamsBz;
			scope.showCburlbz = showCburlbz;
			scope.showGsCburlBz = showGsCburlBz;
			scope.showDsCburlBz = showDsCburlBz;
			scope.showGdsbz = showGdsbz;
			scope.sbqcShowms = sbqcShowms;
			scope.$apply();
			//异常去重测试list
//			errList = [{msg:"尊敬的用户：系统服务出现异常！",code:"",stack:"堆栈信息"},{msg:"尊敬的用户：系统服务出现异常！",code:"",stack:"堆栈信息"},{msg:"尊敬的用户：系统服务出现异常！",code:"",stack:"堆栈信息"}]
			// 服务异常信息去重
			errList = buildErrList(errList);
			// 服务异常展示
			showExAltr(errList);
			//财报备案不一致提示
			showCbMsg(gdbabyzBz);
			// 关闭遮罩
//			layer.close(index);
			parent.layer.close(index);
			//iframe根据页面内容自适应高度
			var sbqcSize = sbqcList.length;
			cwbbSize = cwbbList.length;
			var ycSize = errList.length;
			changeIframeHeight(sbqcSize, cwbbSize, ycSize)
		},
		error : function() {
//			parent.alertWin('提示信息', "<br>尊敬的纳税人：连接超时或网络异常，请稍后再试！", 300, 100);
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
		},
		complete : function() {
//			layer.close(index);
			parent.layer.close(index);
		}
	});
}



/**
 * iframe根据页面内容自适应高度
 * @param tqyqsbbz
 * @returns
 */
function changeIframeHeight(sbqcSize, cwbbSize, ycSize) {
//	if ("N"==showGdsbz) {
//		document.getElementById('msgIframe').contentWindow.document.getElementById('sbqcWxts').innerHTML = "";
//	}else{
//		document.getElementById("gdslhsfsb").innerHTML="国地税联合税费申报";
//		document.getElementById("gdslhcwbbbs").innerHTML="国地税联合财务报表报送";
//	}
	var height = 600;// 申报清册+财务报表+提示信息
	if (sbqcSize > 1) {
		height += sbqcSize * 32;
	}
	if (cwbbSize > 1) {
		height += cwbbSize * 32;
	}
	if (ycSize > 0) {
		height += ycSize * 20;
	}
	// 联合申报高度自定义
	var main = $(window.parent.document).find("#lhsbIframe");
	main.height(height);
	// 重新自定义框架高度
	parent.changeHeight("ifrMain");
}

/**
 * 是否允许切换月份 供父页面调用子页面方法
 * @param tqyqsbbz
 * @returns
 */
function checkYfjk(){
	return tqyqsbbz;
}
/**
 * 判断是否允许切换月份  
 * 设置input 是否可点击
 * @returns
 */
function isChangeYf(){
	if(tqyqsbbz == "Y"){
		parent.$("#test3").attr("disabled","disabled")
	}
	else {
		parent.$("#test3").removeAttr("disabled")
	}
}

/**
 * 是否显示现在去备案url
 * @param isGsCburlBz
 * @param isDsCburlBz
 */
function showNowCburl(gdbamsBz, cwbbzzfDm, isGsCburlBz, isDsCburlBz) {
	// 未启用联合财报模式
	if (gdbamsBz == '') {
		if (cwbbzzfDm == "1" && isGsCburlBz == "Y") {
			showCburlbz = "true";
		} else if (cwbbzzfDm == "2" && isDsCburlBz == "Y") {
			showCburlbz = "true";
		} else {
			showCburlbz = "false";
		}
	} else {
		// 启用联合财报模式
		if (isGsCburlBz == "Y") {
			showGsCburlBz = "true";
		} else {
			showGsCburlBz = "false";
		}
		if (isDsCburlBz == "Y") {
			showDsCburlBz = "true";
		} else {
			showDsCburlBz = "false";
		}
	}
}

/**
 * 服务异常信息去重
 */
function buildErrList(errList){
	var eList = [];
	for(var i in errList){
		var flag = true;
		for(var j in eList){
		    var msg1 = eList[j].msg;
			var msg2 = errList[i].msg;
			var index1 = msg1.indexOf("错误码");
			var index2 = msg2.indexOf("错误码");
			if(index1 != -1){
				msg1 = msg1.substr(0,index1-1)
			}
			if(index2 != -1){
				msg2 = msg2.substr(0,index2-1)
			}
			if(msg1 == msg2){
				flag = false;
			}
		}
		if(flag){
			eList.push(errList[i])
		}
	}
	return eList
}

/**
 *服务异常展示
 */
function showExAltr(errList) {
	var htmlString="";
 	for(var j=0;j<errList.length;j++){
			htmlString +="<div style=\"padding: 5px 0; color: #999;letter-spacing:1px;font-size: 12px\" id=serviceErrId"+j+"></div>";
	} 
	document.getElementById('serviceErrId').innerHTML = htmlString;
 	for (var i = 0; i < errList.length; i++) {
		exAlert.customizeEx(errList[i],"serviceErrId"+i);
	}  
 	//隐藏纳税人主体信息，便于定位问题
 	var nsrztxxmsg = "纳税人主体信息：" + nsrztxx;
 	nsrztxxmsg += "&nbsp;&nbsp;||&nbsp;&nbsp;申报清册诊断日志：gssbqcZdrz:" + sbqcZdrz["gssbqcZdrz"] + ",dssbqcZdrz:" + sbqcZdrz["dssbqcZdrz"];
	$("#nsrztxxId").html(nsrztxxmsg);
}

/**
 * 财务备案不一致提示
 * @param gdbabyzBz
 */
function showCbMsg(gdbabyzBz){
	//国地财务会计制度不一致，提示备案不一致
 	if('Y'==gdbabyzBz){
 		var html = "<div style=\"padding: 5px 0; color: #FF0000;letter-spacing:1px;font-size: 12px\">温馨提示：国地税备案不一致，请修改备案！</div>";
 		$("#cwbaMsgId").html(html);
 	}
}

/**
  *打开申报表
  */
function sbinit(url,sbqx,skssqQ,skssqZ,gdslxDm,zsxmDm,nsqxDm,yzpzzlDm,sbyfIn){
	//从url里获取申报业务编码
	var sbywbm = "";
	if(url != "" && url != null && url != undefined){
		var strs = url.split("&");
		for(var i in strs){
			var str = strs[i];
			if(str.indexOf("sbywbm") != -1){
				sbywbm = str.split("=")[1];
				break;
			}
		}
	}
	
	//提前逾期监控
	var index = layer.load(2, {shade:0.1});
	//父页面sksq
	var sksq = parent.$("#test3").val();
	var nd = sksq.substr(0, 4);
	var yf = sksq.substr(5, 6);
	//加工url
	var sbUrl = contextRoot+"/biz/sbqc/sbqc_aqsb/sbqxControl?type=SBQC&skssqQ="
			+ skssqQ + "&skssqZ="+ skssqZ+ "&sbqx="+ sbqx
			+ "&gdslxDm="+ gdslxDm+ "&zsxmDm="+ zsxmDm
			+ "&nsqxDm="+ nsqxDm + "&tjNd="+ nd + "&tjYf=" + yf+"&yzpzzlDm="+yzpzzlDm+"&sbyfIn="+sbyfIn;
	$.ajax({
		type : "post",
		async : false, // ajax同步
		url : sbUrl,
		data : {},
		success : function(data) {
			var result = eval("(" + data + ")");
			var qxbz = result.istqyqbz;//是否逾期提前标志
			var nsqx = result.nsqx;
			var cbglsbbz = result.cbglsbbz;//是否校验财务报表关联申报业务标志
			var cbnbglsbnbbz = result.cbnbglsbnbbz;//是否校验财务报表关联申报年报业务标志
			var sbnbqzglcbnbbz = result.sbnbqzglcbnbbz;//是否强制关联年报标志
			//期限标志 0 表示 校验通过  1表示 逾期申报  2 表示提前申报
			if (qxbz == "1") {
				//若申报日期 大于纳税期限 已逾期申报 
				parent.alertMsg("尊敬的纳税人：您已逾期申报，请到主管税务机关进行申报，谢谢!","1");
				return;
			} else if (qxbz == "2") {
				//若申报日期 小于 纳税期限起 提前申报
				parent.alertMsg("尊敬的纳税人：该所属期的税（费）种尚未到申报期，不能提前申报!","1");
				return;
			} else {
				if(cbglsbbz=="Y" && cwbbSize>0){
					parent.alertMsg("尊敬的纳税人：您本期还未申报财务报表，请先进行财务报表的报送!","1");
					return;	
				}
				if(cbnbglsbnbbz=="Y" && cwbbSize>0){
					if(sbnbqzglcbnbbz=="Y"){
						parent.alertMsg("尊敬的纳税人：您本期还未申报财务报表，请先进行财务报表的报送!","1");
						return;	
					}else{
						//需要调用父页面的询问框，否则遮罩的范围与其他提示框的不一致  在父页面调子页面方法打开申报表
						parent.alertMsg("尊敬的纳税人：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您本期还未申报财务报表，建议先进行财务报表的报送！请问是否继续申报当前申报表？","2",url)
					}
				}
				//不关联
				else{
					// 打开申报表
					openSbb(url, sbywbm);	
				}
			}
				
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
		},
		complete : function() {
			layer.close(index);
		}
	});
}

/**
  *打开申报表
  */
function openSbb(url, sbywbm) {
	//加工url
	var sbburl = contextRoot+"/biz/sbqc/sbqc_aqsb/sburlControl?"+ url;
	var index = layer.load(2, {shade:0.1});
	$.ajax({
		type : "post",
		async : false, // ajax同步
		url : sbburl,
		data : {},
		success : function(data) {
			var result = eval("(" + data + ")");
			var success = result.success;
			// 展示申报表
			if(success=="Y"){
				var urlList = result.urlList;
				//是否存在业务监控信息
				var hasYwjkbz = result.hasYwjkbz;
				var ywjkmsg = result.msg;
				//展示申报表
				showSburldata(urlList,ywjkmsg,hasYwjkbz,sbywbm);
			}else{
				parent.alertMsg("尊敬的纳税人：系统暂未配置可用申报表!","1")
			}
			
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
		},
		complete : function() {
			layer.close(index);
		}
	});
}

/**
 *正常展示申报表
 */
function showSburldata(urlList,ywjkmsg,hasYwjkbz,sbywbm){
	//如果是城镇土地税或者是房产税（从价，从租），url拼接特殊标志
	for(var i in urlList){
		if(urlList[i].gnurl.indexOf("zsxmDm=10112") != -1 
				|| urlList[i].gnurl.indexOf("zspmDm=101100700") != -1
				|| urlList[i].gnurl.indexOf("zspmDm=101100800")  != -1){
			urlList[i].gnurl = urlList[i].gnurl + "&syqcbz=Y"
		}
	}
	var showName = "申报";
	if(sbywbm == "YBNSRRD"){
		showName = "登记";
	}
	if(urlList.length===1){
		parent.openWindow(urlList[0].gnurl);
	}else if(urlList.length > 1){
		var msg = "<div class='win-center'>";
		msg += "<table class='layui-table' lay-even='' lay-skin='nob'><colgroup><col><col width='60'></colgroup>";
		msg += "<tbody>";
		for(var i=0;i<urlList.length;i++){
			if(urlList[i].zxlxbz==="1"){
				msg += "<tr><td>" + urlList[i].gnmc + "</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>" + showName + "</button></td></tr>";
			}else if(urlList[i].zxlxbz==="2"){
				msg += "<tr><td>" + urlList[i].gnmc + "(离线)</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>" + showName + "</button></td></tr>";
			}
		}
		msg += "</tbody></table>";
		if("Y"==hasYwjkbz){
			//是否存在业务监控 若存在 显示业务提示 
		 	msg += "<div class='tax-notice marginT16'><ul class='notice-warning'><i class='icon-dot iconfont fsicon-notice-warning'></i>" + ywjkmsg + "</ul></div>";
		}
		msg  += "</div>";
		parent.alertMsg(msg,"3")
	}
/*	else if(urlList.length>2){
		var msg = "<div class='win-center'>";
		msg += "<table class='layui-table' lay-even='' lay-skin='nob'><colgroup><col><col width='60'></colgroup>";
		msg += "<tbody>";
		for (var i = 0; i < urlList.length; i++) {
			if (urlList[i].zxlxbz === "1") {
				msg += "<tr><td>" + urlList[i].gnmc + "</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
			} else if (urlList[i].zxlxbz === "2") {
				msg += "<tr><td>" + urlList[i].gnmc + "(离线)</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
			}
		}
		msg += "</tbody></table>";
		if("Y"==hasYwjkbz){
			//是否存在业务监控 若存在 显示业务提示 
		 	msg += "<div class='tax-notice marginT16'><ul class='notice-warning'><i class='icon-dot iconfont fsicon-notice-warning'></i>" + ywjkmsg + "</ul></div>";
		}
		msg += "</div>";
		parent.alertMsg(msg,"3")
	}*/
}


/**
  *单行刷新
  */
function oneRefreshSbqc(gdslxDm, uuid, sxh) {
	//var sksq = $("#sksq").html();
	//加工url
	var oneRefreshurl = contextRoot+"/biz/sbqc/sbqc_aqsb/refreshSbqc?gdslxDm="+ gdslxDm + "&uuid=" + uuid+"&type=oneRefresh";
	//获取当前行数
	var top="auto"//默认自动
	if(window.top==window.self){
	  //不存在父页面
	}else{
		top=window.parent.document.documentElement.scrollTop+200+"px";
	}
	var index = parent.layer.load(2, {offset:top,shade:0.1});
	$.ajax({
		type : "post",
		url : oneRefreshurl,
		contentType : "text/json",
		data : {},
		success : function(data) {
			var result = eval("(" + data + ")");
			var code = result.code;
			var sbrq = result.sbrq;
			var yxcfsb = result.yxcfsb;
			var sbztDm = "";
			if (sbrq != null && "" != sbrq && sbrq != "undefined") {
				sbztDm = "210";
			}
			//更新申报日期错误或者无需更新
			if(code=="1" || code=="2"){
				return;
			}
			//赋值
			var scope = angular.element($('#viewCtrlid')).scope();
			if (typeof (scope) == 'undefined') {
				scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
			}
			scope.qcitems[sxh].sbrq = sbrq;
			scope.qcitems[sxh].sbztDm = sbztDm;//已申报
			scope.qcitems[sxh].yxcfsb = yxcfsb;//允许重复申报
			// 调用方法后，可以重新绑定，在页面同步（可选）
			scope.$apply();
			//关闭遮罩
			parent.layer.close(index);
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
		},
		complete : function() {
			parent.layer.close(index);
		}
	});
}


/**
  *刷新申报状态
  */
function refreshSbqc(isCheckHxzgBz) {
	//获取父页面sksq
	//var sksq = parent.document.getElementById("sksq").innerText;
	//加工url
	var url = parent.refreshAndresetSbqcUrl+"&type=refresh";
	if(isCheckHxzgBz != null && isCheckHxzgBz != "" && isCheckHxzgBz != undefined){
		url += "&isCheckHxzgBz=" + isCheckHxzgBz;
	}
	//获取当前行数
	var top="auto"//默认自动
	if(window.top==window.self){
	  //不存在父页面
	}else{
		top=window.parent.document.documentElement.scrollTop+200+"px";
	}
	var index = parent.layer.load(2, {offset:top,shade:0.1});
	$.ajax({
		type : "post",
		url : url,
		contentType : "text/json",
		data : {},
		success : function(data) {
			var result = eval("(" + data + ")");
			var sbqcList = result.sbqcList;
			var cwbbList = result.cwbbList;
			cwbbzzfDm = result.cwbbzzfDm;
			gdbamsBz = result.gdbamsBz;
			gdbabyzBz = result.gdbabyzBz;
			czsjjg = result.czsjjg;
			var isGsCburlBz = result.isGsCburlBz;
			var isDsCburlBz = result.isDsCburlBz;
			var scope = angular.element($('#viewCtrlid')).scope();
			if (typeof (scope) == 'undefined') {
				scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
			}
			//是否显示现在去备案url
			showNowCburl(gdbamsBz,cwbbzzfDm,isGsCburlBz,isDsCburlBz);
			scope.qcitems = sbqcList;
			scope.cbitems = cwbbList;
			scope.cwbbzzfDm = cwbbzzfDm;
			scope.gdbamsBz = gdbamsBz;
			scope.showCburlbz = showCburlbz;
			scope.showGsCburlBz = showGsCburlBz;
			scope.showDsCburlBz = showDsCburlBz;
			scope.showGdsbz = showGdsbz;
			scope.sbqcShowms = sbqcShowms;
			// 调用方法后，可以重新绑定，在页面同步（可选）
			scope.$apply();
			//关闭遮罩
			parent.layer.close(index);
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
		},
		complete : function() {
			parent.layer.close(index);
		}
	});
}


/**
  *重置申报清册
  */
function resetSbqc() {
	//获取父页面sksq
	//var sksq = parent.document.getElementById("sksq").innerText;
	//重置间隔时间校验
	settime();
	//加工url
	var url = parent.refreshAndresetSbqcUrl+"&type=reset";
	//获取当前行数
	var top="auto"//默认自动
	if(window.top==window.self){
	  //不存在父页面
	}else{
		top=window.parent.document.documentElement.scrollTop+200+"px";
	}
	var index = parent.layer.load(2, {offset:top,shade:0.1});
	$.ajax({
		type : "post",
		url : url,
		contentType : "text/json",
		data : {},
		success : function(data) {
			var scope = angular.element($('#viewCtrlid')).scope();
			if (typeof (scope) == 'undefined') {
				scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
			}
			var result = eval("(" + data + ")");
			var sbqcList = result.sbqcList;
			var cwbbList = result.cwbbList;
			cwbbzzfDm = result.cwbbzzfDm;
			gdbamsBz = result.gdbamsBz;
			gdbabyzBz = result.gdbabyzBz;
			czsjjg = result.czsjjg;
			var isGsCburlBz = result.isGsCburlBz;
			var isDsCburlBz = result.isDsCburlBz;
			//是否显示现在去备案url
			showNowCburl(gdbamsBz,cwbbzzfDm,isGsCburlBz,isDsCburlBz);
			scope.qcitems = sbqcList;
			scope.cbitems = cwbbList;
			scope.cwbbzzfDm = cwbbzzfDm;
			scope.gdbamsBz = gdbamsBz;
			scope.showCburlbz = showCburlbz;
			scope.showGsCburlBz = showGsCburlBz;
			scope.showDsCburlBz = showDsCburlBz;
			scope.showGdsbz = showGdsbz;
			scope.sbqcShowms = sbqcShowms;
			// 调用方法后，可以重新绑定，在页面同步（可选）
			scope.$apply();
			//关闭遮罩
			parent.layer.close(index);
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
		},
		complete : function() {
			parent.layer.close(index);
		}
	});
}

/**
 * 更正申报
 */

function cbgzinit(url, bsssqQ, bsssqZ, bsqx, bsrq) {
	var top="auto"//默认自动
 	if(window.top==window.self){
		//不存在父页面
  	}else{
  		//获取父页面滚动条的高度
		top=window.parent.document.documentElement.scrollTop+100+"px";
  	}
	//加工提示信息
	var msg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您已于"+bsrq+"提交过所属期为"+bsssqQ+"到"+bsssqZ+"的财务报表，是否进行更正？";
	layer.open({
        type: 1
		,area: ['400px']
		,title:['提示信息'] 
		,offset: top 
		,scrollbar: false
        ,info: 1 //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        ,content: msg
        ,btn: ['是', '否']
        ,btnAlign: 'r' //按钮居中
        ,yes: function(){
			//打开财务报表
        	var cfsbBz = "Y";
			cbinit(url, bsssqQ, bsssqZ, bsqx ,cfsbBz);
			layer.closeAll();
		}
		,btn2: function(index, layero){
			return;	
		}
	});
}

/**
 *填写财务报表 
 */
function cbinit(url, bsssqQ, bsssqZ, bsqx, cfsbBz) {
	//提前逾期监控
	var index = layer.load(2, {shade:0.1});
	$.ajax({
		type : "post",
		async : false, // ajax同步
		url : contextRoot+"/biz/sbqc/sbqc_aqsb/sbqxControl?skssqQ="+ bsssqQ + "&skssqZ=" + bsssqZ + "&sbqx=" + bsqx + "&type=CWBB",
		data : {},
		success : function(data) {
			var result = eval("(" + data + ")");
			var qxbz = result.istqyqbz;
			var nsqx = result.nsqx;
			//期限标志 0 表示 校验通过  1表示 逾期申报  2 表示提前申报
			if (qxbz == "1") {
				//若申报日期 大于纳税期限 已逾期申报 
				parent.alertMsg("尊敬的纳税人：您已逾期申报，请到主管税务机关进行申报，谢谢!","1")
				return;
			} else if (qxbz == "2") {
				//若申报日期 小于 纳税期限起 提前申报
				parent.alertMsg("尊敬的纳税人：该所属期的财务报表尚未到申报期，不能提前申报!","1")
				return;
			} else {
				//打开财务报表
				cwbainit(url, "Y", "", cfsbBz);
			}
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
		},
		complete : function() {
			layer.close(index);
		}
	});

}

/**
 *财报报表
 */
function cwbainit(url, isCwbabz,gdslxDm,cfsbBz) {
	//根据isCwbabz 加工url
	if (isCwbabz == "Y") {
		url = contextRoot+"/biz/sbqc/sbqc_aqsb/cburlControl?" + url;
	} else {
		//无备案url
		url = contextRoot+"/biz/sbqc/sbqc_aqsb/cburlControl?sbywbm=" + url+"&isCwbabz="+isCwbabz+"&gdslxDm="+gdslxDm;
	}
	var index = layer.load(2, {shade:0.1});
	$.ajax({
		url : url,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			//var jsondata = eval("(" + data + ")");
			var success = data.success;
			if (success =="Y") {
				var urlList = data.urlList;
				//可重复申报标志（用于在引导页判断是否弹出申报更正提示）
				if(cfsbBz == "Y"){
					for(var i in urlList){
						urlList[i].gnurl += "&cfsbBz=Y";
					}
				}
				//展示财报
				showCburldata(urlList);
			} else {
				parent.alertMsg("尊敬的纳税人：系统暂未配置可用财务报表!","1")
			}
		},
		error : function() {
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
}

/**
 *正常展示申报表
 */
function showCburldata(urlList) {
	if (urlList.length === 1) {
		parent.openWindow(urlList[0].gnurl);
	} else if (urlList.length > 1) {
		var msg = "<div class='win-center'>";
		msg += "<table class='layui-table' lay-even='' lay-skin='nob'><colgroup><col><col width='60'></colgroup>";
		msg += "<tbody>";
		//当网页填写申报和离线PDF申报都存在时,网页填写申报默认在左边
		for (var i = 0; i < urlList.length; i++) {
			if (urlList[i].zxlxbz === "1") {
				msg += "<tr><td>网页填写申报</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
			}
		}
		for (var i = 0; i < urlList.length; i++) {
			if (urlList[i].zxlxbz === "2") {
				msg += "<tr><td>离线PDF申报</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:openWindow(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
			}
		}
		msg += "</tbody></table>";
		msg += "</div>";
		parent.alertMsg(msg,"3")
	}
}


/**
 * 重置时间监控
 */
function settime() {
	if (czsjjg == 0) {
		document.getElementById('msgIframe').contentWindow.document.getElementById('czBtn').href = "JavaScript:parent.resetSbqc()";
		document.getElementById('msgIframe').contentWindow.document.getElementById('czBtn').innerHTML = "重置申报清册";
		// document.getElementById("czabz").style.color="#000000";
		czsjjg = czsjjg;
		return;
	} else {
		document.getElementById('msgIframe').contentWindow.document.getElementById('czBtn').href = "javascript:void(0);";
		document.getElementById('msgIframe').contentWindow.document.getElementById('czBtn').innerHTML = "请等待...(" + czsjjg+ ")";
		// document.getElementById("czabz").style.color="#FF0000";
		czsjjg--;
	}
	setTimeout(function() {
		settime()
	}, 1000)
}

/**
 * 查看税源明细
 * @param skssqQ
 * @param skssqz
 * @param zsxmDm
 * @param zspmDm
 * @param nsqxDm
 * @returns
 */
function initSymx(skssqQ, skssqZ, zsxmDm, zspmDm, nsqxDm, tjny){
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+50+"px";
		}
	}catch(e){ }
	var index = layer.load(2, {offset:top,shade:0.1});
	
	if(tjny == "" || tjny == undefined || tjny == null || tjny == "undefined"){
		tjny = parent.$("#test3").val();
	}
	//房产税
	if("10110" == zsxmDm){
		url = "/sbqc/syqc/fcssyxx.do";
	}
	//城镇土地税
	if("10112" == zsxmDm){
		url = "/sbqc/syqc/cztdsyxx.do";
	}
	//查询税源信息
	$.ajax({
		type:"post",
		url:contextRoot + url,
		data:{ 
			skssqq:skssqQ,
			skssqz:skssqZ,
			zsxmDm:zsxmDm,
			zspmDm:zspmDm,
			tjny:tjny
		}, 
		success:function(data) {
			if(data != null && data != "" && data != undefined && data != "null"){
				var dataJSON = JSON.parse(data);
				if(dataJSON.code == "999"){
					parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
				}
				if(dataJSON.code == "000"){
					var list = dataJSON.resList;
					var ysbNum = 0;
					var html = "";
					for(var i in list){
						var map = list[i];
						var index = parseInt(i) + 1;
						html += "<tr>";
						html += "<td align='center' name='lineNumber'>" + parseInt(index) + "</td>";
						html += "<td align='center' name='sybh'>" + map.sybh + "</td>";
						html += "<td align='center' name='skssqq'>" + map.skssqq + "</td>";
						html += "<td align='center' name='skssqz'>" + map.skssqz + "</td>";
						if("210" == map.sbztDm){
							html += "<td align='center' name='sbzt'>已申报</td>";
							ysbNum += 1;
						}else{
							html += "<td align='center' name='sbzt'>未申报</td>";
						}
					}
					var wxts = "您本期应申报税源" + list.length + "条，已申报" + ysbNum + "条。";
					$("#wxts").html(wxts);
					$("#syxxmx").html(html);
					//弹出层
					ftOpen();
					//分页
					ftlayPage(list);
				}
			}
		},
		error:function(){
			parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
		},
		complete:function(){
			layer.close(index);
		}
	});
	
}

/**
 * 房产税、城镇土地税子页面弹框
 * @returns
 */
function ftOpen(){
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+50+"px";
		}
	}catch(e){ }
	
	layer.open({
		  type: 1 
		  ,title: '税源申报情况' 
		  ,offset: top
		  ,area: ['850px','550px']
//		  ,area: '850px'
		  ,content: $("#showsy")
	}); 
//	$(".showsy .layui-layer-page").css("left", "21%");
}

/**
 * 房产税、城镇土地税分页
 * @param date
 * @returns
 */
function ftlayPage(date){
	page.render({
        elem: 'layuiPage', 
        count: date.length,  //总条数
        curr: 1,   //起始页
        limit: 10, //每页条数
        limits: [10,20,30,40,50], //每页条数的选择项
        first: "首页",
        last: "尾页",
        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
        jump: function (obj, first) {  //切换分页的回调
        	$("#syxxmx").find("td[name='lineNumber']").each(function(){
        		var index = $(this).text();
        		var max = obj.curr * obj.limit;
        		var min = (obj.curr - 1) * obj.limit;
        		if(min < parseInt(index) && parseInt(index) <= max){
        			$(this).parent().show();
        		}else{
        			$(this).parent().hide();
        		}
        	});
        }
    });
	
	$(".layui-laypage span").css("font-size","12px");
}