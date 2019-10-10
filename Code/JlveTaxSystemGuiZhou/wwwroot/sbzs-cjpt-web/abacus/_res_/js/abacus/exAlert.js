/**
 * Created by C.Q on 2017-08-28. 异常提示公共方法
 */
// 定义全局变量
var exAlert;

/**
 * 异常提示公共类，统一提供layer.alert、message、500页面、自定义异常 4种页面调用方法。
 */
function ExAlert(json) {
	try {
		ExAlert.prototype.pathRoot = typeof pathRoot == "undefined" ? window.parent.pathRoot || "/sbzs-cjpt-web" : pathRoot;
	} catch (e) {
	}
	
	ExAlert.prototype.flagLoad = 0;
	ExAlert.prototype.alertScripts = [ // Custom's scripts, including view engine.
        // Common-Library scripts
        "/resources/js/lib/message.js",//LIB:message https://github.com/DHTMLX/message
        "/abacus/_res_/js/layer-v2.2/layer/layer.js"//依赖于jQuery 需要最后一个引入，需要根据js路径寻找css路径。                                     
    ];
	/**
	 * 是否跨域判断，true=跨域；false=非跨域
	 */
	ExAlert.prototype.isCrossOrigin = function() {
		try {
			window.parent.document.domain;//如果跨域就报错
	    } catch (e) {
	        return true;
	    }
	    return false;
	}
	/**
	 * 初始化完后，不需要重新初始化
	 */
	if (typeof ExAlert._inited == "undefined") {
		ExAlert.prototype.init = function(){
            if (0 == this.flagLoad) {
            	this.loadFirst();
                window.setTimeout('exAlert.init()', 100);
            } else if (1 == this.flagLoad) {
            	//console.log("loaded.");
            } else {
                //console.log("WARN: Invalid load status.");
            }
        }
		/**
		 * 初始加载弹框提示组件
		 */
        ExAlert.prototype.loadFirst = function(){
            // Load Common-Library for the first.
            if (this.flagLoad == 0) {
                var oHead = document.getElementsByTagName("head")[0];
                for (var i = 0; i < this.alertScripts.length; i++) {
                	if (this.isInclude(this.alertScripts[i])) {
                		continue;
                	}
                    var oScript = document.createElement("script");
                    oScript.type = "text/javascript"; 
                    oScript.src = this.pathRoot + this.alertScripts[i];
                    oHead.appendChild(oScript);
            	}
                this.flagLoad++;
            }
        }
        /**
         * 是否已加载
         */
        ExAlert.prototype.isInclude = function(name){
            var js= /js$/i.test(name);
            var es=document.getElementsByTagName(js?'script':'link');
            for(var i=0;i<es.length;i++) 
            if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
            return false;
        }
        /**
		 * 封装layer.alert，传入json对象{msg:"提示信息",code:"",stack:"堆栈信息"}，可弹堆栈信息
		 */
		ExAlert.prototype.alertEx = function(exjson, options, yes) {
			if(typeof exjson == 'string') {
				exjson = eval('('+exjson+')');
			}
			var layerlocal = this.getLayer();
			layerlocal.alertEx({content:exjson.msg,stack:exjson.stack},options,yes);
		}
		/**
		 * 封装messsage提示，传入json对象{msg:"提示信息",code:"",stack:"堆栈信息"}，可弹堆栈信息
		 */
		ExAlert.prototype.msgEx = function(exjson,level,time) {
			if(typeof exjson == 'string') {
				exjson = eval('('+exjson+')');
			}
			var dhtmlxlocal = this.getMessage();
			if (dhtmlxlocal) {
				dhtmlxlocal.messageEx(exjson.msg, exjson.stack, level || "error", time || 3000);
			}
		}
		/**
		 * 自定义提示，传入json对象{msg:"提示信息",code:"",stack:"堆栈信息"}，可弹堆栈信息
		 */
		ExAlert.prototype.customizeEx = function(exjson, divId) {
			if(typeof exjson == 'string') {
				exjson = eval('('+exjson+')');
			}
			this.customizeMsg(exjson.msg,exjson.stack,divId);
		}
		/**
		 * 封装layer.alertEx ，可弹堆栈信息
		 */
		ExAlert.prototype.layerAlertEx = function(errMsg, options, yes, stack) {
			var layerlocal = this.getLayer();
			layerlocal.alertEx(errMsg, options, yes, stack);
		}
		/**
		 * 封装layer.alert
		 */
		ExAlert.prototype.alert = function(errMsg, options, yes) {
			var layerlocal = this.getLayer();
			layerlocal.alert(errMsg, options, yes);
		}
		/**
		 * 封装messsage提示，可弹堆栈信息
		 */
		ExAlert.prototype.messageEx = function(errMsg, stack, level, time) {
			var dhtmlxlocal = this.getMessage();
			if (dhtmlxlocal) {
				dhtmlxlocal.messageEx(errMsg, stack, level || "error", time || 3000);
			}
		}
		/**
		 * 封装messsage提示
		 */
		ExAlert.prototype.message = function(errMsg, level, time) {
			var dhtmlxlocal = this.getMessage();
			if (dhtmlxlocal) {
				dhtmlxlocal.message(errMsg, level || "error", time || 3000);
			}
		}
		/**
		 * 自定义提示
		 */
		ExAlert.prototype.customizeMsg = function(errMsg, stack, divId) {
			divId = divId||'msId';
			if (stack) {
				$('#'+divId).html('<span style="color:red;" ondblclick="javascript:var s;if(window === window.top || exAlert.isCrossOrigin()) {s = document.getElementById(\'ms'+divId+'\');} else {s = window.top.document.getElementById(\'ms'+divId+'\');}if(s.style.display ==\'none\'){s.style.display =\'block\';}else{s.style.display =\'none\';}">'+errMsg+'</span>');
				var s = document.createElement("DIV");
				s.id= 'ms'+divId;
				s.style.display='none';
				s.style.left='50%';
				s.style.top='50%';
				s.style.marginLeft='-300px';
				s.style.marginTop='-200px';
				s.style.width='600px';
				s.style.border='1px solid #6b6666';
				s.style.height='400px';
				s.style.padding='5px';
				s.style.position = 'fixed';
				s.style.borderRadius='5px';
				s.style.background='#f9fbfa';
				s.innerHTML = '<div style="height:400px;width:600px;overflow:scroll;">' 
					+ stack // 设置堆栈信息
					+ '</div>'
					+ '<span style="background:silver;color:white;border-radius:12px;text-align:center;height:20px;width:20px;font-size: 15px;cursor:pointer;top:-10px;right:-10px;position:absolute;" onclick="javascript:this.parentNode.style.display=\'none\';">X</span>';
				if(window === window.top || exAlert.isCrossOrigin()) {
					document.body.appendChild(s);
				} else {
					window.top.document.body.appendChild(s);
				}
			} else {
				$('#'+divId).html('<span style="color:red;">'+errMsg+'</span>');
			}
		}
		
		/**
		 * 获取layer
		 */
		ExAlert.prototype.getLayer = function() {
			try{
				if(typeof layer != 'undefined') {
					return layer;
				} else if(typeof window.parent.layer != 'undefined') {
					return window.parent.layer;
				}
			}catch(e){}
		}
		/**
		 * 获取message
		 */
		ExAlert.prototype.getMessage = function() {
			try{
				if(typeof dhtmlx != 'undefined') {
					return dhtmlx;
				} else if(typeof window.parent.dhtmlx != 'undefined') {
					return window.parent.dhtmlx;
				} else {
					return null;
				}
			}catch(e){}
		}
		/*
         * Initialize
         */
        window.setTimeout('exAlert.init()', 100);
	}
	// For not to do initialization twice.
	ExAlert._inited = true;
	
}

$(function(){
	exAlert = new ExAlert();
});
