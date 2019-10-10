
//获取客户端的请求地址
var curWwwPath=window.document.location.href; 
//获取主机地址之后的目录如：/tycx-tjpt-web/index.jsp 
var pathName=window.document.location.pathname; 
var pos=curWwwPath.indexOf(pathName); 
//获取主机地址，如： http://localhost:8080 
var localhostPath=curWwwPath.substring(0,pos); 
// 获取应用的上下文
var contextName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
//引入json2，因为ie7需要这个
document.write("<script type=\"text/javascript\" src=\"" + contextName + "/resources/js/lib/json2.js\"></script>");

window.console = window.console || {
    log: $.noop,
    debug: $.noop,
    info: $.noop,
    warn: $.noop,
    exception: $.noop,
    assert: $.noop,
    dir: $.noop,
    dirxml: $.noop,
    trace: $.noop,
    group: $.noop,
    groupCollapsed: $.noop,
    groupEnd: $.noop,
    profile: $.noop,
    profileEnd: $.noop,
    count: $.noop,
    clear: $.noop,
    time: $.noop,
    timeEnd: $.noop,
    timeStamp: $.noop,
    table: $.noop,
    error: $.noop
};

//兼容脚本
if (!document.querySelectorAll) { 
	document.querySelectorAll = function(selectors){  
		var style = document.createElement('style'), elements = [], element;  
		document.documentElement.firstChild.appendChild(style);  
		document._qsa = [];  
		style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';  
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
	document.querySelector = function(selectors){  
	var elements = document.querySelectorAll(selectors);  
	return (elements.length) ? elements[0] : null; 
	};
}

$(function(){
	//页面如果有验证码的话，页面加载后，执行验证码加载显示
	if($("#yzmImg") && $("#yzmImg").length>0){
		/*
		 *查看配置表中是否有打开验证码 
		 */
		$.ajax({
			type : "post",
			url: cp+"/cxptGz/getCaptchaConfig.do",
			datatype : "text",
			data:{},
			success:function(data){//返回true/false
				if("true" == data){
					refreshYzm();
					//每隔2分钟自动刷新一次验证码
					setInterval(function(){
						refreshYzm();
					}, 120000);
				}else if("false" == data){
					$(".yzmTd").remove();
				}
			}
		});
		
	}
	
	//子页面内内绑定回车键查询
	if($("#queryBtn") && $("#queryBtn").length>0){
		$(document).keydown(function (e) {
		    if (e.keyCode == 13) {
		    	$("#queryBtn").click();
		    }  
		});
	}
	
	//带搜索下拉框初始化
	if($(".mySelect") && $(".mySelect").length>0){
		$(".mySelect").each(function(){
			$(this).select2({minimumResultsForSearch: 10});
		});
		
	}
	
});

function bwxx(sid,cs){
	var bwcs="{\"taxML\":{\"head\":{\"gid\":\"311085A116185FEFE053C2000A0A5B63\"," +
		"\"sid\":\""+sid+"\"," +
			"\"tid\":\" \"," +
			"\"version\":\"\"}," +
	"\"body\":{"+cs+"}}}";
	return bwcs;
}


//把日期转换为年月日 例如：2017-09-09-----2017年9月9日
function rqzh(rq){
	if(rq!=""){
		var arr=rq.split('-');
		var rq=arr[0]+"年"+arr[1]+"月"+arr[2]+"日";
		return rq;
	}
	
}


/**
 * 动态生成验证码
 */
function refreshYzm() {
	if($("#yzmImg")){
		$("#yzmImg").attr("src",cp+"/cxptGz/builderCaptcha.do?t="+ new Date().getTime());
	}	
}

/**
 * 校验验证码是否正确
 */
/*function checkYzm(captcha) {
	
	var url = "/web-tycx/gzrk/checkCaptcha.do?t="+new Date().getTime();
	var rtn;
	
	if(!captcha){
//		alert("请输入验证码！");
		layer.alert("请输入验证码!", {title:"提示",icon: 5});
		return false;	
	}
	
	$.ajax({        		
  		url : url,
  		async : false,
        data:{"userCaptcha":captcha},
   		success:function(data){ 
   			
   			rtn = true;
   			
   		},
       	error:function(){
       		
       		rtn = false;
//       		alert("验证码有误，请重新输入！");
       		layer.alert("验证码有误，请重新输入！", {title:"提示",icon: 5});
       			
       	}
       	});
	
	//每次请求查询验证后都重新生成动态验证码以防恶意攻击服务器
	refreshYzm();
	return rtn;
}
*/
//获取url参数值
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


//涉税查询，三层iframe嵌套，调整界面高度
function changeHeight3(id,id2,id3) {
	try {
		//如果三层iframe都存在
		if($("#" + id, window.parent.document).length > 0){
			
			if( $("#" + id2, window.parent.parent.document).length > 0 
				&& $("#" + id3, window.parent.parent.parent.document).length > 0){
				var height = document.body.scrollHeight +15;
				$("#" + id, window.parent.document).css({
					'height' : height
				});
				height = window.parent.document.body.scrollHeight  + 20;
				$("#" + id2, window.parent.parent.document).css({
					'height' : height
				});
				height = window.parent.parent.document.body.scrollHeight + 20 > 950 
							? window.parent.parent.document.body.scrollHeight + 20 : 950;
				$("#" + id3, window.parent.parent.parent.document).css({
					'height' : height
				});
			}else{
				var height = document.body.scrollHeight +15;
				$("#" + id, window.parent.document).css({
					'height' : height
				});
			}
		}
	} catch (ex) {
	}
}

//涉税查询，两层iframe嵌套，调整界面高度
function changeHeight2(id,id2){
	try{
		
		if($("#" + id, window.parent.document).length > 0 
				&& $("#" + id2, window.parent.parent.document).length > 0){
			var height = document.body.scrollHeight;
			
			$("#" + id, window.parent.document).css({
				'height' : height
			});
		
			height = window.parent.document.body.scrollHeight + 20 > 950 
						? window.parent.document.body.scrollHeight + 20 : 950;
			$("#" + id2, window.parent.parent.document).css({
				'height' : height
			});
		}
	}catch(ex){
		
	}
}


//输入Date对象，输出格式YYYY-MM-DD
function getFormatDate(date) {
	var newDate = new Date(date);
    var seperator = "-";
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1;
    var strDate = newDate.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var returnDate = year + seperator + month + seperator + strDate;
    return returnDate;
}

/*
 * 获取当月天数
 */
function getLastDay(year,month)   
{   
 var new_year = year;  //取当前的年份   
 var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）   
 if(month>12)      //如果当前大于12月，则年份转到下一年   
 {   
 new_month -=12;    //月份减   
 new_year++;      //年份增   
 }
 month--;//恢复传进来的月份
 var new_date = new Date(new_year,new_month,1);        //取当年当月中的第一天   
 var new_day = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期 
 return new Date(year,month-1,new_day); 
}