// 低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = { log : function(){} };
}
function _VIEW_START_UP_(){
    _VIEW_START_UP_.prototype.pathRoot = parent.pathRoot || "/sbzs";
    _VIEW_START_UP_.prototype.flagLoad = 0;
    /**
     * All scripts for sheet. 表单所需的各类JS脚本.
     */
    _VIEW_START_UP_.prototype.viewLibScripts = [ // Common-Library scripts
	    "/abacus/_res_/js/abacus/loader.js",
        "/abacus/_res_/js/lib/jquery.min.js", // LIB: JQuery
	    "/abacus/_res_/js/abacus/frameworkConstant.js", // constant
        "/abacus/resources4/layui/layui.js",//引入layui
        "/abacus/resources4/layui/transfer.js"
    ];
    _VIEW_START_UP_.prototype.viewCustomScripts = [ // Custom's scripts, including view engine.
        "/resources/js/jquery.base64.js",
        "/resources/js/lib/json3.min.js", // LIB: Json3
        "/resources/js/lib/jsonpath.js", // LIB: JsonPath's selector
        "/resources/js/lib/message.js",//LIB:message https://github.com/DHTMLX/message
        "/resources/js/lib/angular.js", // LIB: Google Angular
        "/resources/js/lib/jquery.ztree.core.min.js" ,
        "/resources/js/lib/jquery.ztree.excheck.js" ,
        "/resources/js/lib/jquery.ztree.exhide-3.5.min.js" ,
        "/abacus/resources4/tax-module/select2/select2.js", //LIB: select2。
        "/abacus/resources4/tax-module/selectPage/selectPage.js",
        "/resources/js/ecm-taglib/laypage-v1.3/laypage/laypage.js",  //laypage 分页控件
        "/abacus/resources4/tax-js/common.js",//引入tax-js下的common.js
        "/resources/js/fixed-table.js",// 固定表头,
        "/abacus/_res_/js/abacus/viewDirective.js", // Framework: custom's directives
        "/abacus/_res_/js/abacus/viewEngine.js" // Framework: viewEngine
    ];
    if (typeof _VIEW_START_UP_._inited === "undefined") {
        _VIEW_START_UP_.prototype.init = function(){
            if (0 === this.flagLoad) {
                this.loadFirst();
                // TODO 此处为什么要延时加载js
                window.setTimeout('_viewStartUp_.init()', 50);
            } else if (1 === this.flagLoad) {
                if ('undefined' !== typeof $ && 'undefined' !== typeof loader
                    && 'undefined' !== typeof layer) {

                    //1、加载html页面定义的插件js，因为有些指令要依赖这些插件
                	if('undefined' !== typeof subViewLibScripts){
                    	for (var i = 0; i < subViewLibScripts.length; i++) {        			
                    		//this.loadScript4Sheet(subViewLibScripts[i]);
                    		loader.add(subViewLibScripts[i],true);
                    	}
                    }
                	//2、加载公共的js
                    for (var i = 0; i < this.viewCustomScripts.length; i++) {
                        loader.add(this.viewCustomScripts[i],true);
                	}
                    
                	loader.load();
                    this.flagLoad++;

                    //3、加载公办理浮框相关js和css
                    this.loadTableStep4Sheet();
                } else {
                    window.setTimeout('_viewStartUp_.init()', 50);
                }
            } else {
                console.log("WARN: Invalid load status.");
                
                // 执行模块装载
//                viewEngine.manuaANgInit(angular, strViewApp);
            }
        };
        _VIEW_START_UP_.prototype.loadFirst = function(){
            // Load Common-Library for the first.
            if (this.flagLoad === 0) {
                for (var i = 0; i < _viewStartUp_.viewLibScripts.length; i++) {
                    this.loadScript4Sheet(this.viewLibScripts[i]);
            	}
                this.flagLoad++;
            }
        };
        _VIEW_START_UP_.prototype.appendToHead = function(elem){
            var temp = document.getElementsByTagName("head");
            if (temp && temp.length > 0) {
                temp[0].appendChild(elem);
            } else {
                dhtmlx.message("动态增加CSS失败, 无法获取 HEAD 节点 ", "error", 5000);
            }
        };
        /**
         * 装载表单所需要的样式表.
         * @param urlViewCss 样式表文件的URL
         */
        _VIEW_START_UP_.prototype.loadCss4Sheet = function(urlViewCss){
            var domDocument = document;
            var oCss = document.createElement("link");
            oCss.type = "text/css";
            oCss.rel = "stylesheet";
            oCss.href = this.pathRoot + urlViewCss;
            this.appendToHead(oCss);
        };
        /**
         * 装载表单所需要的样式表(业务特有的样式).
         * @param urlViewCss 样式表文件的URL
         */
        _VIEW_START_UP_.prototype.subLoadCss4Sheet = function(urlViewCss){
            var domDocument = document;
            var oCss = document.createElement("link");
            oCss.type = "text/css";
            oCss.rel = "stylesheet";
            oCss.href = this.pathRoot + urlViewCss;
            this.appendToHead(oCss);
        };
        /**
         * 装载表单所需要的脚本文件.
         * @param urlViewScript 脚本文件的URL
         */
        _VIEW_START_UP_.prototype.loadScript4Sheet = function(urlViewScript){
            var domDocument = document;
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = this.pathRoot + urlViewScript;
            this.appendToHead(oScript);
        };
        /**
         * 装载表单所需要的脚本文件(业务特有的脚本).
         * @param urlViewScript 脚本文件的URL
         */
        _VIEW_START_UP_.prototype.subLoadScript4Sheet = function(urlViewScript){
            var domDocument = document;
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = this.pathRoot + urlViewScript;
            this.appendToHead(oScript);
        };

        /**
         * 装载办理浮框相关js和css（table-step.css和table-step.js）.
         */
        _VIEW_START_UP_.prototype.loadTableStep4Sheet = function(){
            if(this.pathRoot.indexOf("/sxsq") > -1){
                var domDocument = document;
                //加载table-step.css
                var oCss = document.createElement("link");
                oCss.type = "text/css";
                oCss.rel = "stylesheet";
                oCss.href = this.pathRoot + "/abacus/resources4/tax-module/table_step/table-step.css";
                this.appendToHead(oCss);
                //加载table-step.js
                var oScript = document.createElement("script");
                oScript.type = "text/javascript";
                oScript.src = this.pathRoot + "/abacus/resources4/tax-module/table_step/table-step.js";
                this.appendToHead(oScript);
            }
        };

        /**
         * Internet Explorer 7 Compatible
         */
        if (!document.querySelectorAll) {
            document.querySelectorAll = function(selectors){
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
            document.querySelector = function(selectors){
                var elements = document.querySelectorAll(selectors);
                return (elements.length) ? elements[0] : null;
            };
        }
        /*
         * Initialize
         */
        window.setTimeout('_viewStartUp_.init()', 100);
    }
    _VIEW_START_UP_._inited = true;
}
_viewStartUp_ = new _VIEW_START_UP_();