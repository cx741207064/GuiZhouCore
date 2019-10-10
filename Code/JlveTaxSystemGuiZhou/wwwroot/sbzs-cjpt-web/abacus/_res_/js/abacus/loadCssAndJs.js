/**
 * Created by Administrator on 2018-11-01.
 */
var laydate;//日期控件
// 低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = { log : function(){} };
}
/**
 * 表单引擎，负责管理整个表单框架的表单列表管理、数据访问管理、规则库管理等。
 */
function loadCssAndJs(){

	var _start_ = new Date().getTime();
	console.log("INFO:"+_start_ + " 进入链接时间");
    /**
     * All CSS for sheet. 表单所需要的样式表.
     * select2样式需放table前面，解决csgj选择框选择后文字过长显示问题CSGJ-1093 CSGJ-1071
     */
    var viewCss = [ 
        "/resources4/tax-module/selectPage/selectpage.css",
	    "/resources4/tax-module/select2/select2.css",
	    "/abacus/_res_/css/message/message_solid.css",
	    "/resources4/tax-module/taxReturns/table.css",
        "/resources4/layui/css/layui.css",
	    "/resources/css/zTreeStyle/zTreeStyle.css"];
    
    var layerDateJs = [ 
	    "/resources4/layui/layui.js"];
    
    $("#iframehtm").load(function(event){
    	 for (var i = 0; i <viewCss.length; i++) {
    		 loadCss4Sheet(viewCss[i]);
	     }
    	 for (var i = 0; i <layerDateJs.length; i++) {
    		 loadScript4Sheet(layerDateJs[i]);
 	     }	     
    });
   
    function appendToHead (domDocument, elem){
        var temp = domDocument.getElementsByTagName("head");
        if (temp && temp.length > 0) {
            temp[0].appendChild(elem);
        } else {
            dhtmlx.message("动态增加头部信息节点失败, 无法获取 HEAD 节点 ", "error", 5000);
        }
    };
    /**
     * 装载表单所需要的样式表.
     * @param urlViewCss 样式表文件的URL
     */
    function loadCss4Sheet (urlViewCss){
    	var _start_ = new Date().getTime();
        console.log("INFO:"+_start_+" 加载"+urlViewCss+"开始时间");
        var frame = document.getElementById("iframehtm");
        var domDocument = frame.contentWindow.document;
        var oCss = document.createElement("link");
        oCss.type = "text/css";
        oCss.rel = "stylesheet";
        oCss.href = cp + urlViewCss;
        appendToHead(domDocument, oCss);
        var _end_ = new Date().getTime();
        console.log("INFO:"+_end_+" 加载"+urlViewCss+"结束时间");
        var _ms_ = _end_ - _start_;
        console.log("INFO:"+_ms_+"ms 加载"+urlViewCss+"耗时");
    };
    
    /**
     * 装载表单所需要的脚本文件.
     * @param urlViewScript 脚本文件的URL
     */
    function loadScript4Sheet (urlViewScript){
    	var _start_ = new Date().getTime();
        console.log("INFO:"+_start_+" 加载"+urlViewScript+"开始时间");
    	var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = cp + urlViewScript;
        var frame = document.getElementById("iframehtm");
        
        if(frame!=null && frame.contentWindow!=null){
        	var domDocument = frame.contentWindow.document;
            appendToHead(domDocument, oScript);
        }
        var _end_ = new Date().getTime();
        console.log("INFO:"+_end_+" 加载"+urlViewScript+"结束时间");
        var _ms_ = _end_ - _start_;
        console.log("INFO:"+_ms_+"ms 加载"+urlViewScript+"耗时");
    };
        
    function loadScript4head (urlViewScript){
    	var _start_ = new Date().getTime();
        console.log("INFO:"+_start_+" 加载"+urlViewScript+"开始时间");
    	var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = cp + urlViewScript;
        var oHead = document.getElementsByTagName("head").item(0);

        if(oHead!=null){
        	oHead.appendChild(oScript);
        }
        var _end_ = new Date().getTime();
        console.log("INFO:"+_end_+" 加载"+urlViewScript+"结束时间");
        var _ms_ = _end_ - _start_;
        console.log("INFO:"+_ms_+"ms 加载"+urlViewScript+"耗时");
    };
}