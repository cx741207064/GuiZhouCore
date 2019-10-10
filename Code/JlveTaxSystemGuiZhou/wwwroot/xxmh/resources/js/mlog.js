
/**
 * 页面访问统计
 */

var tempId = null;

function statLog(url,m1,m2,title){
	
	if(null == tempId){//没有存在统计未结束的任务
		startLog(url,m1,m2,title);
	}else{//存在统计未结束的任务
		endLog(tempId);
		startLog(url,m1,m2,title);
	}
}


function startLog(url,m1,m2,title){
	var sUserAgent = navigator.userAgent;//浏览器
	var platform = navigator.platform;//操作系统
	var referrer = document.referrer;//上一页面地址
	
	if(url==null || url=="" || url==""){
		url=window.location.href;
	}
	
	var startTime = new Date().getTime();
	$.post(contPath+"/mlogController/addLog.do",
		{
			sUserAgent:sUserAgent,
			platform:platform,
			referrer:referrer,
			startTime:startTime,
			href:url,//当前页面地址
			m1:m1,
			m2:m2,
			title:title
		},function(d){
			if(d.flag=="ok"){
				tempId=d.id;
			}
		});
}

function endLog(id){
	if(null == id || undefined == id || "" == id)return;
	var endTime = new Date().getTime();
	$.post(contPath+"/mlogController/updateLog.do",
		{
			id:id,
			endTime:endTime
		},function(d){
			if(d.flag=="ok"){
				
			}
		});
}


function statIndex(){
	statLog("","index","","首页");
}

//屏幕失去焦点触发
function wobluer(){
	endLog(tempId);
}

$(function(){
	window.onbeforeunload = function(e) {
		wobluer();
		//return "请确认是否真的要退出该页面？"
	};
	//window.onblur=wobluer;
});
