
// var viewApp;
var viewEngine,viewApp,strViewApp;
//单元格背景色 C.Q 20170209 tipType_level : class
var LevelInfos = {
	'error_1'	: 	'yellow',
	'info_1'	: 	'fxsm_tisi',
	'default'	:	'defaultFxsmColor'
};
//附表校验不通过样式显示  C.Q 20170306 tipType_level : class
var fbBgClasses = {
	'error_1'	: 	'nopass-num',
	'info_1'	: 	'nopass-num2'
};
var tipTypes = {
		'error'	: 	'1',
		'info'	: 	'2'
	};
function ViewEngine(){
    /**
     * Constant. 常量定义.
     */
	
	/**
	 * 匹配数字正则表达式（正负数、带小数点、带千分位）
	 * (-)? 符号位：负号出现0次或一次
	 * (0|([1-9]\d{0,2}(,?\d{3})*)) 整数位：整数位以0（后面直接跟小数位）开头；或者以1-9的数字开头后面跟0到2位数字 (,?\d{3})* ,（千分位）后跟三位数字
	 * (\.\d+)? 小数位：\.\d+ 小数点后至少出现一位数字 ? 小数位可以没有
	 * 以下测试数据（正整数、负整数、带小数点的数，带千分位分隔符的数），均测试通过
	 * 123 -12 1,123.1 -0.123 1234,000.0 12,024,123.11 0.00 
	 */
	ViewEngine.prototype.REG_DIGIT = /^(-)?(0|([1-9]\d{0,2}(,?\d{3})*))(\.\d+)?$/;
    ViewEngine.prototype.VIEW_APP_NAME = "viewApp";
    ViewEngine.prototype.VIEW_CTRL_ID = "viewCtrlId";
    ViewEngine.prototype.SCOPE = '';
    //this.viewApp; // 保存 angular.module(strViewApp, []);
    if (typeof ViewEngine.prototype._inited == "undefined") {
        var viewEngine = this;
        ViewEngine.prototype.prepareEnvironment = function(viewApp, strViewApp){
        	//数据模型中间变量
        	var tempFormData = {};
            //引入外部指令
        	var _start_ = new Date().getTime();
        	console.log("INFO:" + _start_ + " 指定代码编译执行开始时间");
        		ngDirectives(document, viewApp);
                //定义Control
                viewApp.run(function($rootScope, $http, $location){});
                viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location,
                    asyncService){
                    //debugger;
                	var data = parent.formData;
                    $scope.formData = data;
                    $scope.CT = parent.formCT;
                    ViewEngine.SCOPE = $scope;
                    //扣缴企业所得税，合同备案信息
                    $scope.getHtbaxxList = function(){
                    	data = getHtbaxx(data,this.CT);
                    }
                    $scope.bcDthsj = function(sdata,ngModel,type){
                    	data = margeDthIntoFormData(data,sdata,ngModel,$scope,type);
                    }
                    $scope.cztdsysUtil = function(mathFlag,newData){
                    	return utilMath(data,mathFlag,newData);
                    }
                    $scope.cztdsysMath = function(mathFlag,newData){
                    	return doMath(mathFlag,newData,data,$scope);
                    }
                    $scope.scjysdgrsdsMath = function(mathFlag,newData){
                    	return subMath(mathFlag,newData,data,$scope);
                    }
                    //angular事件调用外部JS方法
                    $scope.externalMethods = function(mathFlag,newData){
                    	return extMethods(mathFlag,newData,data,$scope);
                    }
                    $scope.tz5xmbh = function(){
                    	return editTdysmxxxXg(data,$scope);
                    }
                    $scope.formData = data;
                    tempFormData = data;
                    
                    /*
                     * 获取父动态行
                     * */
                    $scope.getParentDynamicScope = function(scope){
                    	var p$scope = scope.$parent;
                    	var flag = true
                    	while(p$scope != null && flag){
                    		if(this.isDynamicScope(p$scope)){
                    			flag = false;
                    			break;
                    		}
                        	if(!flag){
                        		break;
                        	}else{
                        		p$scope = typeof p$scope.$parent =="undefined"?null:p$scope.$parent;
                        	}
                    	}
                    	return p$scope;
                    	
                    };
                    /*
                     * 获取第一个子动态行
                     * */
                    $scope.getChildDynamicScope = function(scope){
                    	var rs = null;
                    	var c$scope = scope.$$childHead;
                    	//清除内容
                    	do{
                        	if(c$scope != null ){
                        		if(this.isDynamicScope(c$scope)){
                            		rs = c$scope;
                            		if(rs != null){
                            			return rs;	
                            		}
                            	}else{
                            		rs = this.getChildDynamicScope(c$scope);
                            	}
                        		
                        		if(rs != null){
                        			return rs;	
                        		}
                        		
                        		c$scope = c$scope.$$nextSibling;
                        		if(c$scope != null && this.isDynamicScope(c$scope)){
                            		rs = c$scope;
                            		if(rs != null){
                            			return rs;	
                            		}
                            	}
                        	}
                    	}while(c$scope != null);
                    	
                        return rs;	
                    };
                    
                    /*
                     * 判断是否为动态行
                     * 动态行=ng-repeat中jpath,会存在当前域中 scope,并以[_arr_]保存
                     *
                     * */
                    $scope.isDynamicScope = function(scope){
                    	var flag = false;
                    	if(scope["_arr_"] != null && typeof scope["_arr_"] != "undefined"){
                    		for(var y in scope._arr_){
                    			if(scope.hasOwnProperty(scope._arr_[y])){
                    				flag = true;
                    				break;
                    			}
                    		}
                		}
                    	return flag;
                    };
                    
                    /*
                     * 删除父动态行和增加父动态行时重新刷新子动态行的数据模型
                     * */
                    $scope.clearKeyWord = function(scope, _keyword){
                    	//清除内容
                    	var brother$Scope = scope;
                    	do{
                        	if(brother$Scope != null ){
                        		this.clearScopeKeyWord(brother$Scope, _keyword);
                        		brother$Scope = brother$Scope.$$nextSibling;
                        	}
                    	}while(brother$Scope != null);
                    };
                    
                    /*
                     * 删除父动态行和增加父动态行时重新刷新子动态行的数据模型
                     * */
                    $scope.clearScopeKeyWord = function(scope, _keyword){
                    	//清除内容
                    	if(scope["_arr_"] != null && typeof scope["_arr_"] != "undefined"){
                    		var inTmpArr,_jprefix;
                    		for(var y in scope._arr_){//遍历子scope的arr数组
                    			inTmpArr = scope._arr_[y].replace('_arr_','');
                    			if(scope.hasOwnProperty(inTmpArr)){//判断父scope是否有此属性
                        			if(scope.hasOwnProperty("_jprefix_" + inTmpArr)){
                        				_jprefix = eval("scope._jprefix_"+inTmpArr);
                    	    			//此处要深度复制
                    	    			scope[inTmpArr] = jsonPath(scope.formData, _jprefix)[0];
                        			}
                    	    			
                    			}
                    		}
                    	}
                    	
                    	var child$Scope = scope.$$childHead;
                    	if(child$Scope != null ){
                    		this.clearKeyWord(child$Scope, _keyword);
                    	}
                    };
                    
                    //定义ng-blur方法
                    $scope.fsBlur = function(ngevent){    
                    	var $this = $(ngevent.target);
                        if($this.attr('type') == "radio") {return;}
                    	var _jpath = $this.attr("jpath");
                        // 2、执行关联公式计算
                    	var $parentDynamicScope = this.getParentDynamicScope(this);
                    	
                        //var cIdx = this.$$childHead.$index;
                        var dynamicIdx = null;
                        if($parentDynamicScope!=null){
                        	var pIdx = $parentDynamicScope.$index;
                        	dynamicIdx = [pIdx, this.$index];
                        	_jpath=_jpath.replace(/\[\d+\]/,"[99999_mh_]").replace(/\[\d+\]/,"[0]").replace("_mh_","")
                    	}else if(typeof this.$index != "undefined"){
                    		dynamicIdx = [this.$index];
                    	}
                    	
                        parent.formulaEngine.apply(_jpath, $this.val(), dynamicIdx);
                        // 若有子级关联节点，则校验子级关联节点 Added By C.Q 20170704
                        var affectNode =  $this.attr("affectNode");
    					if(affectNode) {
    						viewEngine.applyAffNode(affectNode, _jpath); // 递归校验所有子级关联节点
    					}
                        // 3、刷新angular视图
                        viewEngine.formApply($('#viewCtrlId'));
                        // 4、刷新校验结果和控制结果
                        //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                        //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                        viewEngine.tipsForVerify(document.body);//el

                        
                    }
                    /**
                     * 分页参数
                     */
                    $scope.paginationConf = {
                            currentPage: 1,
                            totalItems: 800,
                            itemsPerPage: 20,
                            pagesLength: 11,
                            perPageOptions: [10, 20, 30, 40, 50],
                            opt : "",
                            step : 0,
                            onChange: function(){
                            }
                        };
                });
                viewApp.factory('asyncService', [ '$http', function($http){
                    /*
                     * var doRequest = function(url) { return $http({ method: 'POST',//'JSONP' url: url }); }; return {
                     * opts: function(url) { return doRequest(url);} };
                     */
                    /**
                     * @param config    TYPE: object 
                     *   {
					 *      "method":method,
					 *	    "url":url,
					 *	    "params":params,
					 *	    "data":data,
					 *	    "cache":cache,
					 *	    "timeout":timeout
					 *	}
                     * 		必选		•method  {String} 请求方式e.g. "GET"."POST"
 					 *		必选		•url {String} 请求的URL地址
 					 *		可为空   •params {key,value} 请求参数，将在URL上被拼接成？key=value
 					 *		可为空	•data {key,value} 数据，将被放入请求内发送至服务器
 					 *		可为空	•cache {boolean} 若为true，在http GET请求时采用默认的$http cache，否则使用$cacheFactory的实例
 					 *		可为空	•timeout {number} 设置超时时间
                     * @param successHandler 
                     *  function(data,status,headers,config){}
                     * @param errorHandler
                     * function(data,status,headers,config){}
                     * 
                     */
                    var doRequest = function(config,successHandler,errorHandler){
                    	return $http(config).success(successHandler).error(errorHandler);
                    };
                    
                    return { verify : function(el){
                        return viewEngine.tipsForVerify(el);
                    },getDtdmb:function(params){
                        var config = {
                        		"method":"get",
                        		"url":"getDtdmb.do",
                        		"params":params,
                        		"timeout":60
                        };
                        var successHandler = function(data,status,headers,config){
                        	var dmbmc = config.params["name"];
                        	var dmb_info = ViewEngine.SCOPE["_info_"+dmbmc];
                        	var formData = ViewEngine.SCOPE.formData;
                        	if(dmb_info != null && dmb_info != undefined){
                        		var _model = dmb_info.model;
                        		var _dm = dmb_info.dm;
                        		var _data = data;
                        		if(undefined != _dm && "" != _dm) {
                                    var _jsons = {};
                                    $.each(_data, function(k,v) {
                                        _jsons[v[_dm]] = v;
                                    });
                                    _data = _jsons;
                                    //margeData(formData,data,_model);
                        		}
                        		parent.formEngine.cacheCodeTable(dmbmc, _data);
                        		viewEngine.formApply($('#viewCtrlId'), dmbmc, _data);
                        	}else{
                        		var dmbmc = config.params["name"];
                        		var _node = config.params["node"];
                        		if(undefined == _node || "" == _node) {
                                    //parent.formCT[_name] = response;
                                    _data = response;
                                } else {
                                    //parent.formCT[_name] = response[_node];
                                    _data = response[_node];
                                }
                        		parent.formEngine.cacheCodeTable(dmbmc, _data);
                        		viewEngine.formApply($('#viewCtrlId'), dmbmc, _data);
                        		
                        	}
                        };
                        var errorHandler = function(data,status,headers,config){
                        	dhtmlx.message("动态代码表"+_url+"获取失败，请检查...", "error", 2000);
                        };
                        doRequest(config,successHandler,errorHandler);
                    }
                    
                    };
                } ]);
                $("input").each(function(){
                	var _this = this;
                	var attrNgModel = $(_this).attr("ng-model");
                    if(attrNgModel) {
                        //注册事件this
                    	var attrValue = $(_this).attr("ng-blur");
                    	if(attrValue){
                    		attrValue = "fsBlur($event);"+attrValue;
                    		$(_this).attr("ng-blur",attrValue);
                    	}else{
                    		$(_this).attr("ng-blur","fsBlur($event)");
                    	}
                    }
                });
                
                // 执行模块装载
                this.manuaANgInit(angular, strViewApp);
                //执行自定义js文件
                if('undefined' != typeof subViewCustomScripts){
                	if ('undefined' != typeof $ && 'undefined' != typeof viewApp){
                		for (var i = 0; i < subViewCustomScripts.length; i++) {
                			 //new _VIEW_START_UP_().subLoadScript4Sheet(subViewCustomScripts[i]);
                			 loader.add(subViewCustomScripts[i],true);
                       	}
                		loader.load();
                	}
                }
                setTimeout("parent.formEngine.hideMaskFrmSheet()", 50);
                // 在IE8下，table的宽度在页面加载时 计算多少列 并固定宽度,
                // 但table中涉及到ng-if/ng-show等操作单元格操作时,把列隐藏或者删除,这会导致所有列的宽度减少,导致table右侧出现黑边.
                // 所以在table.css中,将table隐藏,等ng指令渲染完毕再绘制table.
                // $(".NewTableMain table").show();
        	};
    
        ViewEngine.prototype.initialize = function(strViewApp){
        	// $(".NewTableMain table").hide();
            if ("undefined" === typeof angular || "undefined" === typeof ngDirectives) {
                console.log("Waiting angular and directive...");
                setTimeout("viewEngine.initialize('" + strViewApp + "')", 50);
            } else {
                if (!parent.flagDataLoaded) {
                    setTimeout("viewEngine.initialize('" + strViewApp + "')", 50);
                } else {
                    viewApp = angular.module(strViewApp, []);
                    var ua = navigator.userAgent;
                    if (ua && ua.indexOf("MSIE 7") >= 0) {
                        // Completely disable SCE to support IE7.
                        viewApp.config(function($sceProvider){
                            console.log("启动IE7兼容性支持：" + ua);
                            $sceProvider.enabled(false);
                        });
                    }
                    this.prepareEnvironment(viewApp, strViewApp);
                }
            }
        };
        /**
         * 手工加载angular 页面加载完成后,再加载模块 以确保angular加载时数据模型以及dom已经完整存在
         */
        ViewEngine.prototype.manuaANgInit = function(angular, strViewApp){
            angular.bootstrap(document.body, [strViewApp]);
        };

        /**
         * 修改:重构 封装jpath处理
         * 修改人：huangpeiyuan
         * 修改时间：2018-07-25
         * 修改内容：
         *  1.重构 获取jpath路径
         *  2.原先是获取scope.$index作为动态行下标。现改成获取数组真实下标.
         *
         * 目前该方法由  ngJprefix 和 ng-repeat-init 有调用到
         *
         * 方法：绑定事件，并赋予jpath
         * @param scope
         * @param el
         * @$compile  当有ngJprefix指令触发时,则不存在动态行情况,没有传该参数。当ng-repeat-init触发,存在动态行，则需要传入该参数
         */
        ViewEngine.prototype.bindEventsForElements = function(scope, el){
        	var _start_ = new Date().getTime();

            var _ngRepeatInit = $(el).attr('ng-repeat-init');
            var realIndex=_ngRepeatInit ? scope.$originIndex() :"";//如果是ng-repeat,则获取真实数组下标

            /**
             * 注册事件
             */
            $("table").each(function(i){
                $(this).off().on({ "keydown" : function(event){
                        viewEngine.eventCursorControl(this);
                    },"paste" : function(event){
                        viewEngine.doPasteExcelAdv(this);
                    }
                });
            });
            $(el).find("input").each(
                function(i){
                    if ($(this).attr("ng-model")) {
                        var _obj = null;
                        if(typeof $(this).attr("target-select-query") !== 'undefined'){
                            _obj = $(this).siblings("div").children("ul");
                        }
                        var _nm = $(this).attr("ng-model");
                        var _ngRepeatInit = $(el).attr('ng-repeat-init');
                        //带下标的ng-model需要去掉下标部分--存的时候没有存下标
                        var _nmFirstNode = _nm.substr(0, _nm.indexOf("\."));
                        var _nmLowerHalfPath = _nm;
                        var _nfFirstNodeNoIdx = _nmFirstNode;
                        //为了兼容不配置到下标节点，增加判断条件为以‘.’分割的第一个节点为依据，后面的不处理，如bqjxsemxbGrid.bqjxsemxbGridlbVO[0].fs
                        if (_nmFirstNode.indexOf('\[') > 0) {
                            _nfFirstNodeNoIdx = _nmFirstNode.split('[')[0];
                        }
                        _nmLowerHalfPath = _nmLowerHalfPath.replace(_nfFirstNodeNoIdx, '');
                        var _jprefix = scope['_jprefix_' + _nfFirstNodeNoIdx];
                        if (_ngRepeatInit) {
                            _jprefix = scope['_jprefix_' + _ngRepeatInit];
                            _nmLowerHalfPath = _nm.substr(_nm.indexOf("\.") + 1);
                            $(this).attr("jpath",
                                _jprefix + "[" + realIndex + "]." + _nmLowerHalfPath);
                        } else {
                            $(this).attr("jpath", _jprefix + _nmLowerHalfPath);
                        }
                        if(_ngRepeatInit){
                            var zfbzjpath='scope.formData.'+_jprefix;
                            var sjzfbzs=eval(zfbzjpath)[realIndex].isDeleteTr;
                            if(sjzfbzs==='Y'){
                                $(this).attr("disabled",true);
                            }
                        }

                        //注册事件
                        $(this).on({ "change" : function(event){
                            if($(this).attr('type') === "radio") {return;}
                            var _jpath = $(this).attr("jpath");
                            try{
	                            // 值改变后清除该单元格的财税管家风险扫描提示 A by C.Q 20170213
	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
	                            parent.formDebuging.clearFxtx();
                            }catch(e){
                			}
                        }, "focus" : function(event){
                            if ($(this).parent().hasClass("manual")){
                                if (this._msgbox_manual_) {
                                        return;
                                }
                                this._msgbox_manual_ = dhtmlx.message("\u3000\u3000您已手动修改过本格数据，本格自动计算已停用。如您需要恢复本格的自动计算，请清空（删除）本格数据。", "" +
                                		"info", 10000);
                            }
                            if($('#isShowTbsmId',parent.document).val() === 'Y'){
                            	parent.formDebuging.onfocus2Tbsm(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示填表说明
                            }
                        	parent.formDebuging.onfocus2Fxtx(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示风险扫描提醒
                        	parent.formDebuging.autoShowTbsm(this, event);  // 当单元格有提示时自动打开填表说明

                        }, "blur" : function(event){
                            if (this._msgbox_manual_) {
                                dhtmlx.message.hide(this._msgbox_manual_);
                                this._msgbox_manual_ = undefined;
                            }
                        }, "dblclick" : function(event){
                            if (true === parent.flagFormDebuging) {
                                if ("undefined" !== typeof parent.formDebuging) {
                                    parent.formDebuging.dblclickInputUI(this, event);
                                }
                            }
                        }, "click" : function(event){
                            if (true === parent.flagFormDebuging) {
                                if ("undefined" !== typeof parent.formDebuging) {
                                    if (event.ctrlKey) {
                                        parent.formDebuging.ctrlClickInputUI(this, event);
                                    }
                                }
                            }
                            if($(this).attr('type') === "radio") {
                                var _jpath = $(this).attr("jpath");
                                // 1、尝试disable该单元格的结果公式
                                // 2、执行关联公式计算
                                parent.formulaEngine.apply(_jpath, this.value);

                                // 3、刷新angular视图
                                viewEngine.formApply($('#viewCtrlId'));
                                // 4、刷新校验结果和控制结果
                                //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                                //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                viewEngine.tipsForVerify(document.body);//el
                            }else if($(this).attr('type') === "text"){
                            	var newValue=this.value;
                            	if($(this).attr("ng-datatype")){
                            		//当数据类型为百分比时，替换掉字符串里的%
                                	newValue=$(this).attr("ng-datatype").indexOf("percent")>-1?this.value.replace("%",""):this.value;
                            	}                            	                            	
                            	//当为非数字类型的文本域时无法填写0字符，故将原理的this.value == 0.00判断修改为this.value === '0.00'
                            	if( newValue === '0.00' && !($(this).attr("readonly")) && $(this).attr("ng-datatype") ){
                            		$(this).val("");
                            		$(this).focus();
                            	}
                            	//当数据类型为百分比时，只比较数值
                            	if((newValue === 0.00 || newValue === '0.00')  && !($(this).attr("readonly")) && $(this).attr("ng-datatype")&&$(this).attr("ng-datatype").indexOf("percent")>-1){
                            		$(this).val("%");
                            		this.setSelectionRange(0, 0);
                            		$(this).focus();
                            	}
                            	//当数据类型为number且带格式时，只比较数值
                            	if(newValue === 0.00 && !($(this).attr("readonly")) && $(this).attr("ng-datatype")&&$(this).attr("ng-datatype").indexOf("number{")>-1){
                            		$(this).val("");
                            		$(this).focus();
                            	}
                            }else if($(this).attr('type') === "checkbox") {
                            	var _jpath = $(this).attr("jpath");
                                // 1、尝试disable该单元格的结果公式
                                // 2、执行关联公式计算
                                parent.formulaEngine.apply(_jpath, this.value);
                                // 3、刷新angular视图
                                viewEngine.formApply($('#viewCtrlId'));
                                // 4、刷新校验结果和控制结果
                                // 发现光校验$scope 下的$element还不够，
                                //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                viewEngine.tipsForVerify(document.body);//el

                            }
                        }, "mouseover" : function(event){
                            if (this.title) {
                                if (this._msgbox_title_) {
                                    var ti = new Date().getTime();
                                    if (ti - this._msgbox_title_time_ > 300) {
                                        dhtmlx.message.hide(this._msgbox_title_);
                                        this._msgbox_title_ = undefined;
                                    } else {
                                        return;
                                    }
                                }
                                //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                // M by C.Q 20170213 提示类型级别从自身元素获取
                                this._msgbox_title_ = dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                this._msgbox_title_time_ = new Date().getTime();
                            }
                        }, "mouseout" : function(event){
                            if (this._msgbox_title_) {
                            	if($(".dhtmlx_message_area").length > 0 ) {
	                            	// 判断鼠标是否在div之上，如果在则不隐藏，否则隐藏 Add by C.Q 20170504
	                            	var msgDiv = $(".dhtmlx_message_area")[0];
	                            	var mouseX=event.clientX;  
	                                var mouseY=event.clientY;  
	                                var divx1 = msgDiv.offsetLeft;  
	                                var divy1 = msgDiv.offsetTop;  
	                                var divx2 = msgDiv.offsetLeft + msgDiv.offsetWidth;  
	                                var divy2 = msgDiv.offsetTop + msgDiv.offsetHeight; 
	                                if( mouseX < divx1 || mouseX > divx2 || mouseY < divy1 || mouseY > divy2) {  
	                                    //如果离开，则执行。。  
	                                	dhtmlx.message.hide(this._msgbox_title_);
		                         		this._msgbox_title_ = undefined;
		                                this._msgbox_title_time_ = undefined;
                                        $(".alert-box").css({"opacity":0 ,"right":-300});
	                                }
	                                var _objI = this;
	                                $(".dhtmlx_message_area").hover(function() { //对div的处理 
	                    			}, function() { 
	                    				// 鼠标离开提示框时隐藏
	                    				dhtmlx.message.hideAll();
	                    				_objI._msgbox_title_ = undefined;
	                    				_objI._msgbox_title_time_ = undefined;
	                    			});
                                    $(".alert-box").css({"opacity":0 ,"right":-300});
                            	} else {
                            		dhtmlx.message.hide(this._msgbox_title_);
	                         		this._msgbox_title_ = undefined;
	                                this._msgbox_title_time_ = undefined;
                                    $(".alert-box").css({"opacity":0 ,"right":-300});
                            	}
                            }
                        }});

                        /**
                         * _obj 预留为多选框元素。多选框控件可见元素是额外解析出来的div/ul元素。
                         * 1、需附加鼠标事件；2、附加背景色变色逻辑。
                         * 用来提示校验信息。
                         * 适用场景，校验公式的target为hidden的输入框。
                         * <select  ng-select-query class="form-control" multiple="multiple" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy_tmp"  ng-options="key as value  for (key,value) in CT.tzyyCT" ><option value=""></option></select>
                         * <input type="hidden" target-select-query="/div/ul" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy" ng-value=""/></td>
                         * 多选框ng-select-query作为中间节点，实现多选框。
                         * input为提交节点。校验节点定位到input上。
                         * 此处解析input的属性，获取多选框可见元素。
                         * 若校验提示节点定位到select，则需要在$(el).find("select").each(的位置增加。
                         */
                        var _obj = null;
                        if(typeof $(this).attr("target-select-query") !== 'undefined'){
                            _obj = $(this).siblings("div").children("ul");
                        }else if(typeof $(this).attr("ng-select-page") !== 'undefined'){
                            _obj = $(this).prev();
						}
                        //obj如果存在
                        if(_obj){
                        	$(_obj).on({"blur":function(event){
                        		if (this._msgbox_manual_) {
                                    dhtmlx.message.hide(this._msgbox_manual_);
                                    this._msgbox_manual_ = undefined;
                                }
                        	},"focus":function(event){
                            		if ($(this).parent().hasClass("manual")){
                                        if (this._msgbox_manual_) {
                                                return;
                                        }
                                        this._msgbox_manual_ = dhtmlx.message("\u3000\u3000您已手动修改过本格数据，本格自动计算已停用。如您需要恢复本格的自动计算，请清空（删除）本格数据。", "" +
                                        		"info", 10000);
                                    }
                                    if($('#isShowTbsmId',parent.document).val() === 'Y'){
                                    	parent.formDebuging.onfocus2Tbsm(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示填表说明
                                    }
                                	parent.formDebuging.onfocus2Fxtx(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示风险扫描提醒
                                	parent.formDebuging.autoShowTbsm(this, event);  // 当单元格有提示时自动打开填表说明

                        	}, "mouseover" : function(event){
                                    if (this.title) {
                                        if (this._msgbox_title_) {
                                            var ti = new Date().getTime();
                                            if (ti - this._msgbox_title_time_ > 500) {
                                                dhtmlx.message.hide(this._msgbox_title_);
                                                this._msgbox_title_ = undefined;
                                            } else {
                                                return;
                                            }
                                        }
                                        //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                        // M by C.Q 20170213 提示类型级别从自身元素获取
                                        this._msgbox_title_ = dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                        this._msgbox_title_time_ = new Date().getTime();
                                    }
                                }, "mouseout" : function(event){
                                    if (this._msgbox_title_) {
                                    	if($(".dhtmlx_message_area").length > 0 ) {
        	                            	// 判断鼠标是否在div之上，如果在则不隐藏，否则隐藏 Add by C.Q 20170504
        	                            	var msgDiv = $(".dhtmlx_message_area")[0];
        	                            	var mouseX=event.clientX;  
        	                                var mouseY=event.clientY;  
        	                                var divx1 = msgDiv.offsetLeft;  
        	                                var divy1 = msgDiv.offsetTop;  
        	                                var divx2 = msgDiv.offsetLeft + msgDiv.offsetWidth;  
        	                                var divy2 = msgDiv.offsetTop + msgDiv.offsetHeight; 
        	                                if( mouseX < divx1 || mouseX > divx2 || mouseY < divy1 || mouseY > divy2) {  
        	                                    //如果离开，则执行。。  
        	                                	dhtmlx.message.hide(this._msgbox_title_);
        		                         		this._msgbox_title_ = undefined;
        		                                this._msgbox_title_time_ = undefined;
                                                $(".alert-box").css({"opacity":0 ,"right":-300});
        	                                }
        	                                var _objI = this;
        	                                $(".dhtmlx_message_area").hover(function() { //对div的处理 
        	                    			}, function() { 
        	                    				// 鼠标离开提示框时隐藏
        	                    				dhtmlx.message.hideAll();
        	                    				_objI._msgbox_title_ = undefined;
        	                    				_objI._msgbox_title_time_ = undefined;
        	                    			});
                                            $(".alert-box").css({"opacity":0 ,"right":-300});
                                    	} else {
                                    		dhtmlx.message.hide(this._msgbox_title_);
        	                         		this._msgbox_title_ = undefined;
        	                                this._msgbox_title_time_ = undefined;
                                            $(".alert-box").css({"opacity":0 ,"right":-300});
                                    	}
                                    }
                                }
                        	});
                        }//end if _obj
                    }
                });
            $(el).find("select").each(
                function(i){
                    if ($(this).attr("ng-model")) {
                        var _nm = $(this).attr("ng-model");
                        var _ngRepeatInit = $(el).attr('ng-repeat-init');
                        //带下标的ng-model需要去掉下标部分--存的时候没有存下标
                        var _nmFirstNode = _nm.substr(0, _nm.indexOf("\."));
                        var _nmLowerHalfPath = _nm;
                        var _nfFirstNodeNoIdx = _nmFirstNode;
                        //为了兼容不配置到下标节点，增加判断条件为以‘.’分割的第一个节点为依据，后面的不处理，如bqjxsemxbGrid.bqjxsemxbGridlbVO[0].fs
                        if (_nmFirstNode.indexOf('\[') > 0) {
                            _nfFirstNodeNoIdx = _nmFirstNode.split('[')[0];
                        }
                        _nmLowerHalfPath = _nmLowerHalfPath.replace(_nfFirstNodeNoIdx, '');
                        var _jprefix = scope['_jprefix_' + _nfFirstNodeNoIdx];
                        if (_ngRepeatInit) {
                            _jprefix = scope['_jprefix_' + _ngRepeatInit];
                            _nmLowerHalfPath = _nm.substr(_nm.indexOf("\.") + 1);
                            $(this).attr("jpath",
                                _jprefix + "[" + realIndex + "]." + _nmLowerHalfPath);
                        } else {
                            $(this).attr("jpath", _jprefix + _nmLowerHalfPath);
                        }

                        if(_ngRepeatInit){
                       	 var zfbzjpath='scope.formData.'+_jprefix;
                            var sjzfbzs=eval(zfbzjpath)[realIndex].isDeleteTr;
                            if(sjzfbzs==='Y'){
                            	$(this).attr("disabled",true);
                            }
                        }

                        //注册事件
                        $(this).on({ "change" : function(event){
                            var _jpath = $(this).attr("jpath");
                            try{
	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
                            }catch(e){
                			}
                            
                            // 2、执行关联公式计算
                            parent.formulaEngine.apply(_jpath, this.value);
                            // 子级关联节点
                            var affectNode = $(this).attr("affectNode");
        					if(affectNode) {
        						viewEngine.applyAffNode(affectNode,_jpath); // 递归校验所有子级关联节点
        					}
                            // 3、刷新angular视图
                            viewEngine.formApply($('#viewCtrlId'));
                            // 4、刷新校验结果和控制结果
                            viewEngine.tipsForVerify(document.body);

                        }, "focus" : function(event){
                        	if (true === parent.flagFormDebuging) { //select下拉框获取焦点显示jpath、urlkey和ywbm
                                if ("undefined" !== typeof parent.formDebuging) {
                                    parent.formDebuging.dblclickInputUI(this, event);
                                }
                            }
                        	if($('#isShowTbsmId',parent.document).val() === 'Y'){
                            	parent.formDebuging.onfocus2Tbsm(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示填表说明
                            }
                        	parent.formDebuging.onfocus2Fxtx(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示风险扫描提醒
                        	parent.formDebuging.autoShowTbsm(this, event);  // 当单元格有提示时自动打开填表说明

                        }, "dblclick" : function(event){
                            if (true === parent.flagFormDebuging) {
                                if ("undefined" !== typeof parent.formDebuging) {
                                    parent.formDebuging.dblclickInputUI(this, event);
                                }
                            }
                        }, "click" : function(event){
                            if (true === parent.flagFormDebuging) {
                                if ("undefined" !== typeof parent.formDebuging) {
                                    if (event.ctrlKey) {
                                        parent.formDebuging.ctrlClickInputUI(this, event);
                                    }
                                }
                            }
                        }, "mouseover" : function(event){
                            if (this.title) {
                                if (this._msgbox_title_) {
                                    var ti = new Date().getTime();
                                    if (ti - this._msgbox_time_ > 500) {
                                        dhtmlx.message.hide(this._msgbox_title_);
                                        this._msgbox_title_ = undefined;
                                    } else {
                                        return;
                                    }
                                }
                                //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                // M by C.Q 20170213 提示类型级别从自身元素获取
                                this._msgbox_title_ = dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                this._msgbox_time_ = new Date().getTime(); 
                            }
                        }, "mouseout" : function(event){
                            if (this._msgbox_title_) {
                            	if($(".dhtmlx_message_area").length > 0 ) {
	                            	// 判断鼠标是否在div之上，如果在则不隐藏，否则隐藏 Add by C.Q 20170504
	                            	var msgDiv = $(".dhtmlx_message_area")[0];
	                            	var mouseX=event.clientX;  
	                                var mouseY=event.clientY;  
	                                var divx1 = msgDiv.offsetLeft;  
	                                var divy1 = msgDiv.offsetTop;  
	                                var divx2 = msgDiv.offsetLeft + msgDiv.offsetWidth;  
	                                var divy2 = msgDiv.offsetTop + msgDiv.offsetHeight; 
	                                if( mouseX < divx1 || mouseX > divx2 || mouseY < divy1 || mouseY > divy2) {  
	                                    //如果离开，则执行。。  
	                                	dhtmlx.message.hide(this._msgbox_title_);
		                         		this._msgbox_title_ = undefined;
		                                this._msgbox_title_time_ = undefined;
                                        $(".alert-box").css({"opacity":0 ,"right":-300});
	                                }
	                                var _objI = this;
	                                $(".dhtmlx_message_area").hover(function() { //对div的处理 
	                    			}, function() { 
	                    				// 鼠标离开提示框时隐藏
	                    				dhtmlx.message.hideAll();
	                    				_objI._msgbox_title_ = undefined;
	                    				_objI._msgbox_title_time_ = undefined;
	                    			});
                                    $(".alert-box").css({"opacity":0 ,"right":-300});
                            	} else {
                            		dhtmlx.message.hide(this._msgbox_title_);
	                         		this._msgbox_title_ = undefined;
	                                this._msgbox_title_time_ = undefined;
                                    $(".alert-box").css({"opacity":0 ,"right":-300});
                            	}
                            }
                        }
                      });
                        
	                    var _obj = null;
                        if(typeof $(this).attr("ng-select-query") !== 'undefined'){
                            if($(this).siblings("div") !== 'undefined'){
                                _obj = $(this).siblings("div");
	                    	}
	                    }
                        /**
                         * _obj 预留元素。元素是额外解析出来的div/a元素。
                         * 1、需附加鼠标事件；2、附加背景色变色逻辑。
                         * 用来提示校验信息。
                         * <select  ng-select-query class="form-control" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy_tmp"  ng-options="key as value  for (key,value) in CT.tzyyCT" ><option value=""></option></select> 
                         * 给a标签添加上述的 1.2
                         */
                        //obj如果存在
                        if(_obj){
                        	$(_obj).on({"mousedown":function(event){
                            	dhtmlx.message.hide(this._msgbox_title_);
                         		this._msgbox_title_ = undefined;
                                this._msgbox_title_time_ = undefined;
                        	}, "mouseover" : function(event){
                                    if (this.title) {
                                    	var msgDiv = $(_obj).parent()[0];
                                    	if($(".dhtmlx_message_area").length > 0 && $(".dhtmlx_message_area").children().length > 0) {
                                    		if($(".dhtmlx_message_area .hidden").length === 0 || ($(".dhtmlx_message_area .hidden").length > 0 && $(".dhtmlx_message_area").children().length > $(".dhtmlx_message_area .hidden").length))
        	                                	return;
                                    	} 
                                        if (this._msgbox_title_) {
                                            var ti = new Date().getTime();
                                            if (ti - this._msgbox_title_time_ > 500) {
                                                dhtmlx.message.hide(this._msgbox_title_);
                                                this._msgbox_title_ = undefined;
                                            } else {
                                                return;
                                            }
                                        }
                                        //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                        // M by C.Q 20170213 提示类型级别从自身元素获取
                                        this._msgbox_title_ = dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                        this._msgbox_title_time_ = new Date().getTime();
                                    }
                                }, "mouseout" : function(event){
                                    if (this._msgbox_title_) {
                                    	if($(".dhtmlx_message_area").length > 0 ) {
                                    		var mouseXY = getMousePos(event);
                                    		var msgDiv = $(_obj).parent()[0];
        	                            	// 判断鼠标是否在div之上，如果在则不隐藏，否则隐藏 Add by C.Q 20170504
        	                            	//var msgDiv = $(".dhtmlx_message_area")[0];
        	                            	var mouseX=mouseXY["x"];  
        	                                var mouseY=mouseXY["y"];  
        	                                var divx1 = msgDiv.offsetLeft;  
        	                                var divy1 = msgDiv.offsetTop;  
        	                                var divx2 = msgDiv.offsetLeft + msgDiv.clientWidth;  
        	                                var divy2 = msgDiv.offsetTop + msgDiv.clientHeight; 
        	                                if( mouseX <= divx1 || mouseX >= divx2 || mouseY <= divy1 || mouseY >= divy2) {  
        	                                    //如果离开，则执行。。  
        	                                	dhtmlx.message.hide(this._msgbox_title_);
        		                         		this._msgbox_title_ = undefined;
        		                                this._msgbox_title_time_ = undefined;
                                                $(".alert-box").css({"opacity":0 ,"right":-300});
        	                                }
                                    	} else {
                                    		dhtmlx.message.hide(this._msgbox_title_);
        	                         		this._msgbox_title_ = undefined;
        	                                this._msgbox_title_time_ = undefined;
                                            $(".alert-box").css({"opacity":0 ,"right":-300});
                                    	}
                                    }

                                },"mouseleave":function(){//离开时，关闭提示，重复执行一边，防止关闭渲染不及时
                                    _cloaseMsg(this);
                                }
                        	});
                        }	//end if _obj
                    }
                });
            $(el).find("textarea").each(
                    function(i){
                        if ($(this).attr("ng-model")) {
                            var _nm = $(this).attr("ng-model");
                            var _ngRepeatInit = $(el).attr('ng-repeat-init');
                            //带下标的ng-model需要去掉下标部分--存的时候没有存下标
                            var _nmFirstNode = _nm.substr(0, _nm.indexOf("\."));
                            var _nmLowerHalfPath = _nm;
                            var _nfFirstNodeNoIdx = _nmFirstNode;
                            //为了兼容不配置到下标节点，增加判断条件为以‘.’分割的第一个节点为依据，后面的不处理，如bqjxsemxbGrid.bqjxsemxbGridlbVO[0].fs
                            if (_nmFirstNode.indexOf('\[') > 0) {
                                _nfFirstNodeNoIdx = _nmFirstNode.split('[')[0];
                            }
                            _nmLowerHalfPath = _nmLowerHalfPath.replace(_nfFirstNodeNoIdx, '');
                            var _jprefix = scope['_jprefix_' + _nfFirstNodeNoIdx];
                            if (_ngRepeatInit) {
                                _jprefix = scope['_jprefix_' + _ngRepeatInit];
                                _nmLowerHalfPath = _nm.substr(_nm.indexOf("\.") + 1);
                                $(this).attr("jpath",
                                    _jprefix + "[" + realIndex + "]." + _nmLowerHalfPath);
                            } else {
                                $(this).attr("jpath", _jprefix + _nmLowerHalfPath);
                            }
                            if(_ngRepeatInit){
                            	 var zfbzjpath='scope.formData.'+_jprefix;
                                 var sjzfbzs=eval(zfbzjpath)[realIndex].isDeleteTr;
                                 if(sjzfbzs==='Y'){
                                 	$(this).attr("disabled",true);
                                 }
                            }

                            //注册事件
                            $(this).on({ "change" : function(event){
                                if($(this).attr('type') == "radio") {return;}
                                var _jpath = $(this).attr("jpath");
                                try{
    	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
    	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
                                }catch(e){
                    			}
                                // 2、执行关联公式计算
                                parent.formulaEngine.apply(_jpath, this.value);
                                // 3、刷新angular视图
                                viewEngine.formApply($('#viewCtrlId'));
                                // 4、刷新校验结果和控制结果
                                //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                                //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                viewEngine.tipsForVerify(document.body);//el 
                            }, "focus" : function(event){
                                if ($(this).parent().hasClass("manual")){
                                    if (this._msgbox_manual_) {
                                            return;
                                    }
                                    this._msgbox_manual_ = dhtmlx.message("\u3000\u3000您已手动修改过本格数据，本格自动计算已停用。如您需要恢复本格的自动计算，请清空（删除）本格数据。", "" +
                                    		"info", 10000);
                                }
                                if($('#isShowTbsmId',parent.document).val() === 'Y'){
                                	parent.formDebuging.onfocus2Tbsm(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示填表说明
                                }
                            	parent.formDebuging.onfocus2Fxtx(this, event);  // Added by C.Q 20170122 单元格获取焦点后显示风险扫描提醒
                            	parent.formDebuging.autoShowTbsm(this, event);  // 当单元格有提示时自动打开填表说明

                            }, "blur" : function(event){
                                if (this._msgbox_manual_) {
                                    dhtmlx.message.hide(this._msgbox_manual_);
                                    this._msgbox_manual_ = undefined;
                                }
                            }, "dblclick" : function(event){
                                if (true === parent.flagFormDebuging) {
                                    if ("undefined" !== typeof parent.formDebuging) {
                                        parent.formDebuging.dblclickInputUI(this, event);
                                    }
                                }
                            }, "click" : function(event){
                                if (true === parent.flagFormDebuging) {
                                    if ("undefined" !== typeof parent.formDebuging) {
                                        if (event.ctrlKey) {
                                            parent.formDebuging.ctrlClickInputUI(this, event);
                                        }
                                    }
                                }
                                if($(this).attr('type') === "radio") {
                                    var _jpath = $(this).attr("jpath");
                                    // 1、尝试disable该单元格的结果公式
                                    // 2、执行关联公式计算
                                    parent.formulaEngine.apply(_jpath, this.value);
                                    // 4、刷新angular视图
                                    viewEngine.formApply($('#viewCtrlId'));
                                    // 3、刷新校验结果和控制结果
                                    //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                                    //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                    viewEngine.tipsForVerify(document.body);//el
                                    // 
                                }else if($(this).attr('type') === "text"){
                                	if( this.value === 0 && !($(this).attr("readonly")) ){
                                		$(this).val("");
                                		$(this).focus();
                                	}
                                }
                            }, "mouseover" : function(event){
                                if (this.title) {
                                    if (this._msgbox_title_) {
                                        var ti = new Date().getTime();
                                        if (ti - this._msgbox_title_time_ > 3000) {
                                            dhtmlx.message.hide(this._msgbox_title_);
                                            this._msgbox_title_ = undefined;
                                        } else {
                                            return;
                                        }
                                    }
                                    //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                    // M by C.Q 20170213 提示类型级别(tiptype)从自身属性中获取
                                    this._msgbox_title_ = dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                    this._msgbox_title_time_ = new Date().getTime();
                                }
                            }, "mouseout" : function(event){
                                if (this._msgbox_title_) {
                                	if($(".dhtmlx_message_area").length > 0 ) {
    	                            	// 判断鼠标是否在div之上，如果在则不隐藏，否则隐藏 Add by C.Q 20170504
    	                            	var msgDiv = $(".dhtmlx_message_area")[0];
    	                            	var mouseX=event.clientX;  
    	                                var mouseY=event.clientY;  
    	                                var divx1 = msgDiv.offsetLeft;  
    	                                var divy1 = msgDiv.offsetTop;  
    	                                var divx2 = msgDiv.offsetLeft + msgDiv.offsetWidth;  
    	                                var divy2 = msgDiv.offsetTop + msgDiv.offsetHeight; 
    	                                if( mouseX < divx1 || mouseX > divx2 || mouseY < divy1 || mouseY > divy2) {  
    	                                    //如果离开，则执行。。  
    	                                	dhtmlx.message.hide(this._msgbox_title_);
    		                         		this._msgbox_title_ = undefined;
    		                                this._msgbox_title_time_ = undefined;
                                            $(".alert-box").css({"opacity":0 ,"right":-300});
    	                                }
    	                                var _objI = this;
    	                                $(".dhtmlx_message_area").hover(function() { //对div的处理 
    	                    			}, function() { 
    	                    				// 鼠标离开提示框时隐藏
    	                    				dhtmlx.message.hideAll();
    	                    				_objI._msgbox_title_ = undefined;
    	                    				_objI._msgbox_title_time_ = undefined;
    	                    			});
                                        $(".alert-box").css({"opacity":0 ,"right":-300});
                                	} else {
                                		dhtmlx.message.hide(this._msgbox_title_);
    	                         		this._msgbox_title_ = undefined;
    	                                this._msgbox_title_time_ = undefined;
                                        $(".alert-box").css({"opacity":0 ,"right":-300});
                                	}
                                }
                            } });
                        }
                    });
            var _end_ = new Date().getTime();
            console.log("INFO:"+ _start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 事件绑定");
        };
        /**
         * 由js改变select值不会触发change事件，所以在标签中增加属性affectNode="子级关联节点"，当前节点值改变时，对所有子级关联节点也做校验
         * 校验子级关联节点,注意此方法使用递归校验所有子级关联节点，如改变了省，市和区都会做校验 Added By C.Q 20170704
         * 例：
         * <select ng-model="p.shengDm"  affectNode="shiDm"><option>请选择省</option></select><!--当前节点 -->
         * <select ng-model="p.shiDm" affectNode="quDm"><option>请选择市</option></select><!--子级关联节点 -->
         * <select ng-model="p.quDm" ><option>请选择区</option></select><!--子级关联节点 -->
         * affectNode：子级关联节点，子级关联节点的jpath上级必须和当前节点的上级一样；关联多个节点以英文逗号","分隔。注意！！不可设置父级和当前级。
         * _jpath：当前节点jpath
         */
        ViewEngine.prototype.applyAffNode =  function (affectNode, _jpath) {
        	if(!affectNode) {
        		return;
        	}
			var affectNodes = affectNode.split(',');
			var aJpath;
			var aEl;
			$.each(affectNodes, function(i) {
				aJpath = _jpath.substring(0, _jpath.lastIndexOf('.') + 1)+ this;
				aEl = $("select[jpath='" + aJpath + "']");
				if (aEl) {
					parent.formulaEngine.apply4AffNode(aJpath, aEl.val());
					var aaEl=aEl.attr("affectNode"); 
	        		if(aaEl) {
	        			viewEngine.applyAffNode(aaEl, _jpath); // 递归校验所有子级关联节点
	        		}
				}
			});
		};
		
        /**
         * 检查校验不通过单元格，并提示
         * @param el
         */
        ViewEngine.prototype.tipsForVerify2 = function(el){
        	//定义局部变量，方法类调用时直接使用局部变量，不用到全局变量里面去找，提高性能
			var viewEngine = this;
        	var scope = angular.element($('#viewCtrlId')).scope();
        	if(scope.$$phase){
                setTimeout(function(){
                    viewEngine.tipsForVerify2(el);
        			},50);
                return;
            }

        	var _start_ = new Date().getTime();
            var idxVariable2NoPassLocal = parent.formulaEngine.idxVariable2NoPass;
            var idxVariable2Control = parent.formulaEngine.idxVariable2Control;
            // 合并本地和第三方风险扫描提示 A by C.Q 20170209 
            // 若显示在右边栏
            var idxVariable2NoPass = {};
            if(parent.fxsmInitData.idxVariable2NoPass !== undefined
                && !$.isEmptyObject(parent.fxsmInitData.idxVariable2NoPass)) {
            	// 合并集合，深度拷贝 
            	idxVariable2NoPass = $.extend(true,{},parent.fxsmInitData.idxVariable2NoPass,idxVariable2NoPassLocal);
            } else {
            	idxVariable2NoPass = idxVariable2NoPassLocal;
            }
            
            $(el).find("input").each(function() {
                if ($(this).attr("ng-model")) {
                    var _obj = $(this);
                    /**
                	 * 兼容多选框校验不通过背景变色：
                	 * 多选框控件可见元素是额外解析出来的div/ul元素。
                	 * 1、需附加鼠标事件；2、附加背景色变色逻辑。
                	 * 用来提示校验信息。
                	 * 适用场景，校验公式的target为hidden的输入框。
                	 * <select  ng-select-query class="form-control" multiple="multiple" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy_tmp"  ng-options="key as value  for (key,value) in CT.tzyyCT" ><option value=""></option></select> 
  					 * <input type="hidden" target-select-query="/div/ul" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy" ng-value=""/></td>
  					 * 多选框ng-select-query作为中间节点，实现多选框。
  					 * input为提交节点。校验节点定位到input上。
  					 * 此处解析input的属性，获取多选框可见元素。
  					 * 若校验提示节点定位到select，则需要在$(el).find("select").each(的位置增加。
  					 * 此处target为input，input为不可见元素，实际背景色变色应该在ul上。
                	 */
                    if(typeof $(this).attr("target-select-query") !== 'undefined'){
                    	_obj = $(this).siblings("div").children("ul");
                    }
                    if(typeof _obj.attr("ng-select-page") !== 'undefined'){
                        _obj = _obj.prev();
                    }
                    var _nm = $(this).attr("ng-model");
                    var _jpath = $(this).attr("jpath");
                    var _subscript = null;
                    if(_jpath && _jpath.indexOf('[')>-1 && _jpath.indexOf(']')>_jpath.indexOf('[')) {
                    	var l = _jpath.match(/\[\d+\]/g);
	                    if(l != null){
	                		if(l.length === 2){
	                			var pIdx = l[0].replace(']','').replace('[','');
	            				var cIdx = l[1].replace(']','').replace('[','');
	                			_subscript = [pIdx,cIdx];
	                		}else{
	                			var idx = l[0].replace(']','').replace('[','');
	                			_subscript = [idx];
	                		}
                    	}
                    	
                    }
                    // Adding tips according to not passed verify. 
                    var var2NoPasslocal = idxVariable2NoPass[_jpath];
                    if(_jpath && _jpath.indexOf('[')>0&&_jpath.indexOf(']')>0){//如果是动态行节点，同取target为#和*的内容
                    	var _jpath_tmp_1 = _jpath.replace('['+_subscript+']','[#]');
                    	var _jpath_tmp_2 = _jpath.replace('['+_subscript+']','[*]');;
                    	var var2NoPasslocal_dynamic_1 = idxVariable2NoPass[_jpath_tmp_1];
                    	var var2NoPasslocal_dynamic_2 = idxVariable2NoPass[_jpath_tmp_2];
                    	if(var2NoPasslocal || var2NoPasslocal_dynamic_1 || var2NoPasslocal_dynamic_2){
                    		var2NoPasslocal = $.extend(true,{},var2NoPasslocal,var2NoPasslocal_dynamic_1 ,var2NoPasslocal_dynamic_2 );
                    	}
                    }
                    var _tips = '';
                    var _tips_title = '';
                    // Added C.Q 20170209 先移除所有背景色样式
                	for(var key in LevelInfos) { 
                		_obj.removeClass(LevelInfos[key]); // 移除样式
                		_obj.parent().removeClass(LevelInfos[key]);
                	}
                    if (undefined === var2NoPasslocal) {
                        _obj.removeAttr('title');
                        _obj.removeAttr('tiptype');
                        _obj.parent().removeClass("relative");
                    	_obj.removeAttr('cljy');
                    	_obj.removeAttr('fxmc');
                    	_obj.removeAttr('glbd');
                    	_obj.removeAttr('fxlx');
                    	_obj.removeAttr('jcjg');
                    } else {
                        // 过滤级别低的提示 A by C.Q 20170209
                        var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                    	var key = 'info_1'; // 样式数组key
                    	var tipType;
                    	var _fxsmCljy = ''; // 风险扫描-处理建议
                    	var _fxsmFxmc = ''; // 风险扫描-风险名称
                    	var _fxsmJcjg = ''; // 风险扫描-检查结果
                    	var _fxsmFxlx = ''; // 风险扫描-风险类型
                    	var _fxsmGlbd = []; // 风险扫描-关联表单
                        $.each(var2NoPass, function(id, FormulaObject) {
                            if(id === "idx"){
                                _subscript = FormulaObject;
                            }else {
                                // 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                                var position = parent.showTipsType[FormulaObject.channel + '_' + FormulaObject.tipType];
                                if (position === '1') {
                                    // 显示至右上角
                                    _tips += FormulaObject.tips + '<br/>';
                                    _tips_title += FormulaObject.tips + '\n';
                                } else {
                                    // 默认显示至右边栏
                                    _fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>');
                                    _fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                                    _fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                                    _fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                                    if (FormulaObject.glbd) {
                                        _fxsmGlbd = $.extend(true, _fxsmGlbd, FormulaObject.glbd);
                                    }
                                }
                                tipType = FormulaObject.tipType;
                                key = FormulaObject.tipType + '_' + FormulaObject.level;
                            }
                        });
                        if(_fxsmJcjg) {
                        	_fxsmJcjg = parent.formulaEngine.textSubstitution(_fxsmJcjg,_subscript);
                        }
                        if(_tips_title) {
                        	_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                        }
                        _obj.attr('title', _tips_title);
                        //layer.tips(_tips, _obj);
                        // C.Q 20170209
                        //_obj.addClass("yellow");
                        var classColor = LevelInfos[key];
                        _obj.addClass(classColor ? classColor : LevelInfos['default']); // 增加背景色
                        _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                        _obj.parent().addClass("relative");
                        
                        // 校验不通过时，为多选框checkbox或单选框radio的父节点添加背景颜色
                        var inputType = _obj.attr("type");  
                        if(inputType==="checkbox"||inputType==="radio"){
                        	_obj.parent().addClass(classColor ? classColor : LevelInfos['default']);
                        }
                        
                    	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                    	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称
                    	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                    	var glbd = '';
                    	if(_fxsmGlbd) {
                    		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                    		$("#divSheetlist", parent.document).find("a").each(function(i) {
    			        		var sheetName = $(this).html();
    			        		var url = $(this).attr('href');
    	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
    	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
    	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
    	        	    			}
    	                		}
    		        		});
                    	}
                    	_obj.attr('glbd', glbd); // 关联表单
                    	_obj.attr('fxlx', _fxsmFxlx === '1' ? '节税提醒' : '风险名称');
                    	// 财税管家进来第一次需要显示
                    	parent.fxsmInitData.autoShowFxjk(_obj);
                    }
                    // Update UI according to calculate   result of control's rule.
                    var controls = idxVariable2Control[_jpath];
                    if (controls) {
                        viewEngine.updateUIControl(this, controls);
                    }
                }
            });
            $(el).find("textarea").each(function(i){
                if ($(this).attr("ng-model")) {
                    var _obj = $(this);
                    var _nm = $(this).attr("ng-model");
                    var _jpath = $(this).attr("jpath");
                    // Adding tips according to not passed verify. 
                    var var2NoPasslocal = idxVariable2NoPass[_jpath];
                    var _tips = '';
                    var _tips_title = '';
                    // Added C.Q 20170209 先移除所有背景色样式
                	for(var key in LevelInfos) { 
                		_obj.removeClass(LevelInfos[key]); // 移除样式
                	}
                    if (undefined === var2NoPasslocal) {
                        _obj.removeAttr('title');
                        _obj.removeAttr('tiptype');
                        _obj.parent().removeClass("relative");
                    	_obj.removeAttr('cljy');
                    	_obj.removeAttr('fxmc');
                    	_obj.removeAttr('glbd');
                    	_obj.removeAttr('fxlx');
                    	_obj.removeAttr('jcjg');
                    } else {
                        // 过滤级别低的提示 A by C.Q 20170209
                        var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                    	var key = 'info_1'; // 样式数组key
                    	var tipType;
                    	var _fxsmCljy = ''; // 风险扫描-处理建议
                    	var _fxsmFxmc = ''; // 风险扫描-风险名称
                    	var _fxsmJcjg = ''; // 风险扫描-检查结果
                    	var _fxsmFxlx = ''; // 风险扫描-风险类型
                    	var _fxsmGlbd = []; // 风险扫描-关联表单
                        $.each(var2NoPass, function(id, FormulaObject){
                        	// 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                        	var position = parent.showTipsType[FormulaObject.channel+'_'+FormulaObject.tipType];
                    		if (position === '1') {
                    			// 显示至右上角
                    			_tips += FormulaObject.tips + '<br/>';
 	                            _tips_title += FormulaObject.tips + '\n';
                    		} else {
                    			// 默认显示至右边栏
                    			_fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>') ;
                            	_fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                            	_fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                            	_fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                            	if(FormulaObject.glbd) {
                            		_fxsmGlbd = $.extend(true,_fxsmGlbd,FormulaObject.glbd);
                            	}
                    		}
                    		tipType = FormulaObject.tipType;
                    		key = FormulaObject.tipType + '_' + FormulaObject.level;
                        });
                        //_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                        _obj.attr('title', _tips_title);
                        //layer.tips(_tips, _obj);
                        // C.Q 20170209
                        //_obj.addClass("yellow");
                        var classColor = LevelInfos[key];
                        _obj.addClass(classColor ? classColor : LevelInfos['default']); // 增加背景色
                        _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                        _obj.parent().addClass("relative");
                    	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                    	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称
                    	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                    	var glbd = '';
                    	if(_fxsmGlbd) {
                    		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                    		$("#divSheetlist", parent.document).find("a").each(function(i) {
    			        		var sheetName = $(this).html();
    			        		var url = $(this).attr('href');
    	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
    	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
    	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
    	        	    			}
    	                		}
    		        		});
                    	}
                    	
                    	_obj.attr('glbd', glbd); // 关联表单
                    	_obj.attr('fxlx', _fxsmFxlx === '1' ? '节税提醒' : '风险名称');
                    	// 财税管家进来第一次需要显示
                    	parent.fxsmInitData.autoShowFxjk(_obj);
                    }
                    // Update UI according to calculate result of control's rule.
                    var controls = idxVariable2Control[_jpath];
                    if (controls) {
                        viewEngine.updateUIControl(this, controls);
                    }
                }
            });
            $(el).find("select").each(function(i) {
                if ($(this).attr("ng-model")) {
                    var _obj = $(this);
					//判断是否 select2 的选框
                    var _this=_obj;
                    var isSelectQuery=false;
                    if(typeof _obj.attr("ng-select-query") !== 'undefined'){
                        isSelectQuery=true;
                    }
                    if(isSelectQuery && _obj.siblings("div") !== 'undefined'){
                        _obj = _obj.siblings("div");
                    }
                    var _nm = $(this).attr("ng-model");
                    var _jpath = $(this).attr("jpath");
                    var _subscript = null;
                    if(_jpath && _jpath.indexOf('[')>-1 && _jpath.indexOf(']')>_jpath.indexOf('[')) {
                    	_subscript = _jpath.substring(_jpath.indexOf('[')+1,_jpath.indexOf(']'));
                    }
                    // Adding tips according to not passed verify. 
                    var var2NoPasslocal = idxVariable2NoPass[_jpath];
                    if(_jpath && _jpath.indexOf('[')>0&&_jpath.indexOf(']')>0){//如果是动态行节点，同取target为#和*的内容
                    	var _jpath_tmp_1 = _jpath.replace('['+_subscript+']','[#]');
                    	var _jpath_tmp_2 = _jpath.replace('['+_subscript+']','[*]');;
                    	var var2NoPasslocal_dynamic_1 = idxVariable2NoPass[_jpath_tmp_1];
                    	var var2NoPasslocal_dynamic_2 = idxVariable2NoPass[_jpath_tmp_2];
                    	if(var2NoPasslocal || var2NoPasslocal_dynamic_1 || var2NoPasslocal_dynamic_2){
                    		var2NoPasslocal = $.extend(true,{},var2NoPasslocal,var2NoPasslocal_dynamic_1 ,var2NoPasslocal_dynamic_2 );
                    	}
                    }
                    var _tips = '';
                    var _tips_title = '';
                    // Added C.Q 20170209 先移除所有背景色样式
                	for(var key in LevelInfos) { 
                		if(_obj.attr('ng-multiple')){
                			_obj.next().removeClass(LevelInfos[key]);
                		}
                		_obj.removeClass(LevelInfos[key]); // 移除样式
						isSelectQuery && _this.removeClass(LevelInfos[key]);//如果是select2,也有对元素select2进行清理
                	}
                    if (undefined === var2NoPasslocal) {
                    	if(_obj.attr('ng-multiple')){
                			_obj.next().removeAttr('title');
                		}
                        _obj.removeAttr('title');
                        _obj.removeAttr('tiptype');
                        _obj.parent().removeClass("relative");
                    	_obj.removeAttr('cljy');
                    	_obj.removeAttr('fxmc');
                    	_obj.removeAttr('glbd');
                    	_obj.removeAttr('fxlx');
                    	_obj.removeAttr('jcjg');
                        isSelectQuery && _cloaseMsg(_obj.get(0));//没有错误,则把提示关闭

                    } else {
                		// 过滤级别低的提示
                		var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                    	var key = 'info_1'; // 样式数组key
                    	var tipType;
                    	var _fxsmCljy = ''; // 风险扫描-处理建议
                    	var _fxsmFxmc = ''; // 风险扫描-风险名称
                    	var _fxsmJcjg = ''; // 风险扫描-检查结果
                    	var _fxsmFxlx = ''; // 风险扫描-风险类型
                    	var _fxsmGlbd = []; // 风险扫描-关联表单
                        $.each(var2NoPass, function(id, FormulaObject){
                            if(id === "idx"){
                                _subscript = FormulaObject;
                            }else {
                                // 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                                var position = parent.showTipsType[FormulaObject.channel + '_' + FormulaObject.tipType];
                                if (position === '1') {
                                    // 显示至右上角
                                    _tips += FormulaObject.tips + '<br/>';
                                    _tips_title += FormulaObject.tips + '\n';
                                } else {
                                    // 默认显示至右边栏
                                    _fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>');
                                    _fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                                    _fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                                    _fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                                    if (FormulaObject.glbd) {
                                        _fxsmGlbd = $.extend(true, _fxsmGlbd, FormulaObject.glbd);
                                    }
                                }
                                tipType = FormulaObject.tipType;
                                key = FormulaObject.tipType + '_' + FormulaObject.level
                            }
                        });
                        if(_fxsmJcjg) {
                        	_fxsmJcjg = parent.formulaEngine.textSubstitution(_fxsmJcjg,_subscript);
                        }
                        if(_tips_title) {
                        	_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                        }
                        _obj.attr('title', _tips_title);
                        if(_obj.attr('ng-multiple')){
                			_obj.next().attr('title', _tips_title);
                		}
                        //layer.tips(_tips, _obj);
                        // C.Q 20170209
                        //_obj.addClass("yellow");
                        var classColor = LevelInfos[key];
                         // 增加背景色
                        var _cc = classColor ? classColor : LevelInfos['default'];
                        //2018-06-25 ng-multiple 下拉复选框校验不通过时无法高亮显示
                        if(_obj.attr('ng-multiple')){
                            _obj.next().addClass(_cc);
                        }
                        /*
                         * 增加背景色,对select2做特殊处理。
                         * select2.js 生成div的class样式，是从原始select元素中取。
                         */
                        isSelectQuery ? _this.addClass(_cc) : _obj.addClass(_cc);

                        _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                        _obj.parent().addClass("relative");
                    	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                    	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称 不要显示出来,目前和检查结果内容有点重了
                    	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                    	var glbd = '';
                    	if(_fxsmGlbd) {
                    		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                    		$("#divSheetlist", parent.document).find("a").each(function(i) {
    			        		var sheetName = $(this).html();
    			        		var url = $(this).attr('href');
    	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
    	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
    	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
    	        	    			}
    	                		}
    		        		});
                    	} 
                    	
                    	_obj.attr('glbd', glbd); // 关联表单
                    	_obj.attr('fxlx', _fxsmFxlx === '1' ? '节税提醒' : '风险名称');
                    	// 财税管家进来第一次需要显示
                    	parent.fxsmInitData.autoShowFxjk(_obj);
                    }
                    // Update UI according to calculate result of control's rule.
                    var controls = idxVariable2Control[_jpath];
                    if (controls) {
                        viewEngine.updateUIControl(this, controls);
                    }
                }
            });
            // 设置附表背景色 Added By C.Q 20170306 
            viewEngine.showFbBgcolor(idxVariable2NoPass);
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms tipsForVerify2");

            //清理校验公式列表和控制公式列表
            parent.formulaEngine.procVerifyFormulas.length = 0;
            parent.formulaEngine.procContorlFormulas.length = 0;
            parent.formulaEngine.procVariableInStack = {};
        };
        /**
         * 检查校验不通过单元格，并提示
         * @param el
         */
        ViewEngine.prototype.tipsForVerify = function(el, qhfbbz){

        	//避免添加行时页面还没有渲染完成就去执行校验不通过的公式，导致找不到界面元素，从而添加背景色失败
        	var scope = angular.element($('#viewCtrlId')).scope();
        	if(scope.$$phase){
                setTimeout(function(){
                    viewEngine.tipsForVerify(el, qhfbbz);
        			},50);
                return;
            }

        	var _start_ = new Date().getTime();
            var idxVariable2NoPassLocal = parent.formulaEngine.idxVariable2NoPass;
            var idxCurrentVariable2NoPassLocal = parent.formulaEngine.idxCurrentVariable2NoPass;
            
            var idxVariable2Control = parent.formulaEngine.idxVariable2Control;
            var idxCurrentVariable2ControlLocal = parent.formulaEngine.idxCurrentVariable2Control;
            // 合并本地和第三方风险扫描提示 A by C.Q 20170209 
            // 若显示在右边栏
            var idxVariable2NoPass = {};
            if(parent.fxsmInitData.idxVariable2NoPass !== undefined
                && !$.isEmptyObject(parent.fxsmInitData.idxVariable2NoPass)) {
            	// 合并集合，深度拷贝 
            	idxVariable2NoPass = $.extend(true,{},parent.fxsmInitData.idxVariable2NoPass,idxVariable2NoPassLocal);
            	//TODO 增加风险扫描
            	idxCurrentVariable2NoPassLocal = $.extend(true,{},parent.fxsmInitData.idxVariable2NoPass,idxCurrentVariable2NoPassLocal);
            } else {
            	idxVariable2NoPass = idxVariable2NoPassLocal;
            }
            //var viewEngine = this; TODO
            var tmpNoPass = null;
            if(qhfbbz){
            	tmpNoPass = idxVariable2NoPass;
            }else{
            	tmpNoPass = idxCurrentVariable2NoPassLocal;
            }
            var _obj = null;
            $.each(tmpNoPass, function(_jpath, var2NoPass){//TODO 修改id这个变量名称
            	// 通过jpath到页面找元素不能使用ifelse，因为同一个jpath可能绑定到多个元素上，如：ybnsrzzs的汇总纳税人企业通用传递单的开户银行和银行账号。
            	if($('input[jpath=\''+_jpath+'\']').length > 0) {
                	_obj = $('input[jpath=\''+_jpath+'\']');
                    if (_obj.attr("ng-model")) {
                        /**
                    	 * 兼容多选框校验不通过背景变色：
                    	 * 多选框控件可见元素是额外解析出来的div/ul元素。
                    	 * 1、需附加鼠标事件；2、附加背景色变色逻辑。
                    	 * 用来提示校验信息。
                    	 * 适用场景，校验公式的target为hidden的输入框。
                    	 * <select  ng-select-query class="form-control" multiple="multiple" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy_tmp"  ng-options="key as value  for (key,value) in CT.tzyyCT" ><option value=""></option></select> 
      					 * <input type="hidden" target-select-query="/div/ul" ng-model="zczjtxqkjnstzmxbgridVO[1].nstzyy" ng-value=""/></td>
      					 * 多选框ng-select-query作为中间节点，实现多选框。
      					 * input为提交节点。校验节点定位到input上。
      					 * 此处解析input的属性，获取多选框可见元素。
      					 * 若校验提示节点定位到select，则需要在$(el).find("select").each(的位置增加。
      					 * 此处target为input，input为不可见元素，实际背景色变色应该在ul上。
                    	 */
                    	//分页下拉
                    	if(typeof _obj.attr("ng-select-page") !== 'undefined'){
                        	_obj = _obj.prev();
                        }
                        if(typeof _obj.attr("target-select-query") !== 'undefined'){
                        	_obj = _obj.siblings("div").children("ul");
                        }
                        var _nm = _obj.attr("ng-model");
                        var _subscript = null;
                        if(_jpath && _jpath.indexOf('[')>-1 && _jpath.indexOf(']')>_jpath.indexOf('[')) {
                        	var l = _jpath.match(/\[\d+\]/g);
    	                    if(l != null){
    	                		if(l.length === 2){
    	                			var pIdx = l[0].replace(']','').replace('[','');
    	            				var cIdx = l[1].replace(']','').replace('[','');
    	                			_subscript = [pIdx,cIdx];
    	                		}else{
    	                			var idx = l[0].replace(']','').replace('[','');
    	                			_subscript = [idx];
    	                		}
                        	}
                        	
                        }
                        // Adding tips according to not passed verify. 
                        var var2NoPasslocal = idxVariable2NoPass[_jpath];
                        if(_jpath && _jpath.indexOf('[')>0&&_jpath.indexOf(']')>0){//如果是动态行节点，同取target为#和*的内容
                        	var _jpath_tmp_1 = _jpath.replace('['+_subscript+']','[#]');
                        	var _jpath_tmp_2 = _jpath.replace('['+_subscript+']','[*]');;
                        	var var2NoPasslocal_dynamic_1 = idxVariable2NoPass[_jpath_tmp_1];
                        	var var2NoPasslocal_dynamic_2 = idxVariable2NoPass[_jpath_tmp_2];
                        	if(var2NoPasslocal || var2NoPasslocal_dynamic_1 || var2NoPasslocal_dynamic_2){
                        		var2NoPasslocal = $.extend(true,{},var2NoPasslocal,var2NoPasslocal_dynamic_1 ,var2NoPasslocal_dynamic_2 );
                        	}
                        }
                        var _tips = '';
                        var _tips_title = '';
                        // Added C.Q 20170209 先移除所有背景色样式
                    	for(var key in LevelInfos) { 
                    		_obj.removeClass(LevelInfos[key]); // 移除样式
                    		_obj.parent().removeClass(LevelInfos[key]);
                    	}
                    	//上次校验不通过，本次校验通过时，去除样式
                        if (undefined === var2NoPasslocal) {
                            _obj.removeAttr('title');
                            _obj.removeAttr('tiptype');
                            _obj.parent().removeClass("relative");
                        	_obj.removeAttr('cljy');
                        	_obj.removeAttr('fxmc');
                        	_obj.removeAttr('glbd');
                        	_obj.removeAttr('fxlx');
                        	_obj.removeAttr('jcjg');
                        } else {
                            // 过滤级别低的提示 A by C.Q 20170209
                            var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                        	var key = 'info_1'; // 样式数组key
                        	var tipType;
                        	var _fxsmCljy = ''; // 风险扫描-处理建议
                        	var _fxsmFxmc = ''; // 风险扫描-风险名称
                        	var _fxsmJcjg = ''; // 风险扫描-检查结果
                        	var _fxsmFxlx = ''; // 风险扫描-风险类型
                        	var _fxsmGlbd = []; // 风险扫描-关联表单
                            $.each(var2NoPass, function(id, FormulaObject) {
                                if(id === "idx"){
                                    _subscript = FormulaObject;
                                }else{
                                    // 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                                    var position = parent.showTipsType[FormulaObject.channel+'_'+FormulaObject.tipType];
                                    if (position === '1') {
                                        // 显示至右上角
                                        _tips += FormulaObject.tips + '<br/>';
                                        _tips_title += FormulaObject.tips + '\n';
                                    } else {
                                        // 默认显示至右边栏
                                        _fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>') ;
                                        _fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                                        _fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                                        _fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                                        if(FormulaObject.glbd) {
                                            _fxsmGlbd = $.extend(true,_fxsmGlbd,FormulaObject.glbd);
                                        }
                                    }
                                    tipType = FormulaObject.tipType;
                                    key = FormulaObject.tipType + '_' + FormulaObject.level;
                                }
                            });
                            if(_fxsmJcjg) {
                            	_fxsmJcjg = parent.formulaEngine.textSubstitution(_fxsmJcjg,_subscript);
                            }
                            if(_tips_title) {
                            	_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                            }
                            _obj.attr('title', _tips_title);
                            //layer.tips(_tips, _obj);
                            // C.Q 20170209
                            //_obj.addClass("yellow");
                            var classColor = LevelInfos[key];
                            _obj.addClass(classColor ? classColor : LevelInfos['default']); // 增加背景色
                            _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                            _obj.parent().addClass("relative");
                            
                            // 校验不通过时，为多选框checkbox或单选框radio的父节点添加背景颜色
                            var inputType = _obj.attr("type");  
                            if(inputType==="checkbox"||inputType==="radio"){
                            	_obj.parent().addClass(classColor ? classColor : LevelInfos['default']);
                            }
                            
                        	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                        	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称
                        	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                        	var glbd = '';
                        	if(_fxsmGlbd) {
                        		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                        		$("#divSheetlist", parent.document).find("a").each(function(i) {
        			        		var sheetName = $(this).html();
        			        		var url = $(this).attr('href');
        	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
        	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
        	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
        	        	    			}
        	                		}
        		        		});
                        	}
                        	_obj.attr('glbd', glbd); // 关联表单
                        	_obj.attr('fxlx', _fxsmFxlx === '1' ? '节税提醒' : '风险名称');
                        	// 财税管家进来第一次需要显示
                        	parent.fxsmInitData.autoShowFxjk(_obj);
                        }
                    }
            	} 
            	
            		
            	if($('textarea[jpath=\''+_jpath+'\']').length > 0) {
            		_obj = $('textarea[jpath=\''+_jpath+'\']');
                    if (_obj.attr("ng-model")) {
                        var _nm = _obj.attr("ng-model");
                        // Adding tips according to not passed verify. 
                        var var2NoPasslocal = idxVariable2NoPass[_jpath];
                        var _tips = '';
                        var _tips_title = '';
                        // Added C.Q 20170209 先移除所有背景色样式
                    	for(var key in LevelInfos) { 
                    		_obj.removeClass(LevelInfos[key]); // 移除样式
                    	}
                        if (undefined === var2NoPasslocal) {
                            _obj.removeAttr('title');
                            _obj.removeAttr('tiptype');
                            _obj.parent().removeClass("relative");
                        	_obj.removeAttr('cljy');
                        	_obj.removeAttr('fxmc');
                        	_obj.removeAttr('glbd');
                        	_obj.removeAttr('fxlx');
                        	_obj.removeAttr('jcjg');
                        } else {
                            // 过滤级别低的提示 A by C.Q 20170209
                            var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                        	var key = 'info_1'; // 样式数组key
                        	var tipType;
                        	var _fxsmCljy = ''; // 风险扫描-处理建议
                        	var _fxsmFxmc = ''; // 风险扫描-风险名称
                        	var _fxsmJcjg = ''; // 风险扫描-检查结果
                        	var _fxsmFxlx = ''; // 风险扫描-风险类型
                        	var _fxsmGlbd = []; // 风险扫描-关联表单
                            $.each(var2NoPass, function(id, FormulaObject){
                                if(id === "idx"){
                                    _subscript = FormulaObject;
                                }else {
                                    // 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                                    var position = parent.showTipsType[FormulaObject.channel + '_' + FormulaObject.tipType];
                                    if (position === '1') {
                                        // 显示至右上角
                                        _tips += FormulaObject.tips + '<br/>';
                                        _tips_title += FormulaObject.tips + '\n';
                                    } else {
                                        // 默认显示至右边栏
                                        _fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>');
                                        _fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                                        _fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                                        _fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                                        if (FormulaObject.glbd) {
                                            _fxsmGlbd = $.extend(true, _fxsmGlbd, FormulaObject.glbd);
                                        }
                                    }
                                    tipType = FormulaObject.tipType;
                                    key = FormulaObject.tipType + '_' + FormulaObject.level;
                                }
                            });
                            //_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                            _obj.attr('title', _tips_title);
                            //layer.tips(_tips, _obj);
                            // C.Q 20170209
                            //_obj.addClass("yellow");
                            var classColor = LevelInfos[key];
                            _obj.addClass(classColor ? classColor : LevelInfos['default']); // 增加背景色
                            _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                            _obj.parent().addClass("relative");
                        	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                        	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称
                        	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                        	var glbd = '';
                        	if(_fxsmGlbd) {
                        		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                        		$("#divSheetlist", parent.document).find("a").each(function(i) {
        			        		var sheetName = $(this).html();
        			        		var url = $(this).attr('href');
        	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
        	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
        	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
        	        	    			}
        	                		}
        		        		});
                        	}
                        	
                        	_obj.attr('glbd', glbd); // 关联表单
                        	_obj.attr('fxlx', _fxsmFxlx === '1' ? '节税提醒' : '风险名称');
                        	// 财税管家进来第一次需要显示
                        	parent.fxsmInitData.autoShowFxjk(_obj);
                        }
                    }
            	}
            	
            	if($('select[jpath=\''+_jpath+'\']').length > 0) {
            		_obj = $('select[jpath=\''+_jpath+'\']');
            		var _this=_obj;
            		var isSelectQuery=false;
                    if (_obj.attr("ng-model")) {
                        if(typeof _obj.attr("ng-select-query") !== 'undefined'){
                            isSelectQuery=true;
                        }
                        if(isSelectQuery && _obj.siblings("div") !== 'undefined'){
                            _obj = _obj.siblings("div");
                        }
                        var _nm = _obj.attr("ng-model");
                        var _subscript = null;
                        if(_jpath && _jpath.indexOf('[')>-1 && _jpath.indexOf(']')>_jpath.indexOf('[')) {
                        	_subscript = _jpath.substring(_jpath.indexOf('[')+1,_jpath.indexOf(']'));
                        }
                        // Adding tips according to not passed verify. 
                        var var2NoPasslocal = idxVariable2NoPass[_jpath];
                        if(_jpath && _jpath.indexOf('[')>0&&_jpath.indexOf(']')>0){//如果是动态行节点，同取target为#和*的内容
                        	var _jpath_tmp_1 = _jpath.replace('['+_subscript+']','[#]');
                        	var _jpath_tmp_2 = _jpath.replace('['+_subscript+']','[*]');;
                        	var var2NoPasslocal_dynamic_1 = idxVariable2NoPass[_jpath_tmp_1];
                        	var var2NoPasslocal_dynamic_2 = idxVariable2NoPass[_jpath_tmp_2];
                        	if(var2NoPasslocal || var2NoPasslocal_dynamic_1 || var2NoPasslocal_dynamic_2){
                        		var2NoPasslocal = $.extend(true,{},var2NoPasslocal,var2NoPasslocal_dynamic_1 ,var2NoPasslocal_dynamic_2 );
                        	}
                        }
                        var _tips = '';
                        var _tips_title = '';
                        // Added C.Q 20170209 先移除所有背景色样式
                    	for(var key in LevelInfos) {
                    		if(_obj.attr('ng-multiple')){
                    			_obj.next().removeClass(LevelInfos[key]);
                    		}
                    		_obj.removeClass(LevelInfos[key]); // 移除样式
                            isSelectQuery && _this.removeClass(LevelInfos[key]);//如果是select2,也有对元素select2进行清理
                    	}
                        if (undefined === var2NoPasslocal) {
                            _obj.removeAttr('title');
                            if(_obj.attr('ng-multiple')){
                    			_obj.next().removeAttr('title');
                    		}
                            _obj.removeAttr('tiptype');
                            _obj.parent().removeClass("relative");
                        	_obj.removeAttr('cljy');
                        	_obj.removeAttr('fxmc');
                        	_obj.removeAttr('glbd');
                        	_obj.removeAttr('fxlx');
                        	_obj.removeAttr('jcjg');
                            isSelectQuery && _cloaseMsg(_obj.get(0));//把提示关闭
                        } else {
                    		// 过滤级别低的提示
                    		var var2NoPass = viewEngine.filterByLevels(var2NoPasslocal);
                        	var key = 'info_1'; // 样式数组key
                        	var tipType;
                        	var _fxsmCljy = ''; // 风险扫描-处理建议
                        	var _fxsmFxmc = ''; // 风险扫描-风险名称
                        	var _fxsmJcjg = ''; // 风险扫描-检查结果
                        	var _fxsmFxlx = ''; // 风险扫描-风险类型
                        	var _fxsmGlbd = []; // 风险扫描-关联表单
                            $.each(var2NoPass, function(id, FormulaObject){
                                if(id === "idx"){
                                    _subscript = FormulaObject;
                                }else {
                                    // 取得显示位置 showTipsType在配置中心配置{ysq.showTipsType}
                                    var position = parent.showTipsType[FormulaObject.channel + '_' + FormulaObject.tipType];
                                    if (position === '1') {
                                        // 显示至右上角
                                        _tips += FormulaObject.tips + '<br/>';
                                        _tips_title += FormulaObject.tips + '\n';
                                    } else {
                                        // 默认显示至右边栏
                                        _fxsmCljy += (!FormulaObject.cljy ? '' : FormulaObject.cljy + '<br/>');
                                        _fxsmFxmc += (!FormulaObject.fxmc ? '' : FormulaObject.fxmc + '<br/>');
                                        _fxsmJcjg += (!FormulaObject.tips ? '' : FormulaObject.tips + '<br/>');
                                        _fxsmFxlx = (!FormulaObject.fxlx ? '' : FormulaObject.fxlx);
                                        if (FormulaObject.glbd) {
                                            _fxsmGlbd = $.extend(true, _fxsmGlbd, FormulaObject.glbd);
                                        }
                                    }
                                    tipType = FormulaObject.tipType;
                                    key = FormulaObject.tipType + '_' + FormulaObject.level;
                                }
                            });
                            if(_fxsmJcjg) {
                            	_fxsmJcjg = parent.formulaEngine.textSubstitution(_fxsmJcjg,_subscript);
                            }
                            if(_tips_title) {
                            	_tips_title = parent.formulaEngine.textSubstitution(_tips_title,_subscript);
                            }
                            _obj.attr('title', _tips_title);
                            if(_obj.attr('ng-multiple')){
                    			_obj.next().attr('title', _tips_title);
                    		}
                            //layer.tips(_tips, _obj);
                            // C.Q 20170209
                            //_obj.addClass("yellow");
                            var classColor = LevelInfos[key];
                            var _cc = classColor ? classColor : LevelInfos['default'];
                            if(_obj.attr('ng-multiple')){
                    			_obj.next().addClass(_cc);
                    		}
                            /*
                             * 增加背景色,对select2做特殊处理。
                             * select2.js 生成div的class样式，是从原始select元素中取。
                             */
                            isSelectQuery ? _this.addClass(_cc) : _obj.addClass(_cc);

                            _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                            _obj.parent().addClass("relative");
                        	_obj.attr('cljy', _fxsmCljy);  // 处理建议
                        	//_obj.attr('fxmc', _fxsmFxmc);  // 风险名称 不要显示出来,目前和检查结果内容有点重了
                        	_obj.attr('jcjg', _fxsmJcjg);  // 检查结果
                        	var glbd = '';
                        	if(_fxsmGlbd) {
                        		_fxsmGlbd = viewEngine.disGlbds(_fxsmGlbd); // 去重
                        		$("#divSheetlist", parent.document).find("a").each(function(i) {
        			        		var sheetName = $(this).html();
        			        		var url = $(this).attr('href');
        	        				for(var p in _fxsmGlbd) { // 遍历json数组时，这么写p为索引，0,1
        	        					if(sheetName != null && sheetName !== '' && sheetName.indexOf(_fxsmGlbd[p].fbid) >= 0) {
        	        						glbd += "<a target=\"frmSheet\" href=\""+url+"?fjp="+_fxsmGlbd[p].jpath+"\" onclick=\"javascript:fbSelected("+i+");\" >"+_fxsmGlbd[p].fbid + " " + (_fxsmGlbd[p].fbmc ? _fxsmGlbd[p].fbmc : '')+"</a>";
        	        	    			}
        	                		}
        		        		});
                        	} 
                        	
                        	_obj.attr('glbd', glbd); // 关联表单
                        	_obj.attr('fxlx', _fxsmFxlx == '1' ? '节税提醒' : '风险名称');
                        	// 财税管家进来第一次需要显示
                        	parent.fxsmInitData.autoShowFxjk(_obj);
                        }
                    }
            	}
            });
            //清空apply后受影响的公式
            parent.formulaEngine.idxCurrentVariable2NoPass = {};
            
            // Update UI according to calculate result of control's rule.
            var tmpControl = idxVariable2Control;
            if(!qhfbbz) {
            	tmpControl = idxCurrentVariable2ControlLocal;
            }
            $.each(tmpControl, function(id, controls){
            	var domElem = null;
            	if($('input[jpath=\''+id+'\']').length > 0) {
            		domElem = $('input[jpath=\''+id+'\']');
            	}else if($('textarea[jpath=\''+id+'\']').length > 0) {
            		domElem = $('textarea[jpath=\''+id+'\']');
            	}else if($('select[jpath=\''+id+'\']').length > 0) {
            		domElem = $('select[jpath=\''+id+'\']');
            	}
            	//var controls = tmpControl[id];
            	if (domElem != null) {
            		for(var z=0;z<domElem.length;z++){
            			viewEngine.updateUIControl(domElem[z], controls);
            		}
                }
            });
            parent.formulaEngine.idxCurrentVariable2Control = {};
            // 设置附表背景色 Added By C.Q 20170306 
            viewEngine.showFbBgcolor(idxVariable2NoPass);
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms tipsForVerify");

            //清理校验公式列表和控制公式列表
            parent.formulaEngine.procVerifyFormulas.length = 0;
            parent.formulaEngine.procContorlFormulas.length = 0;
            parent.formulaEngine.procVariableInStack = {};
        };
        // glbd数组去重
        ViewEngine.prototype.disGlbds = function(arr){
        	if(!arr) {
        		return;
        	}
            var displayArr = [];  
            var hash = {};  
            for(var i in arr){    //json come from backend  
                 if(!hash[arr[i].fbid]) {  
                     displayArr.push(arr[i]);  
                     hash[arr[i].fbid] = true;  
                 }  
            }  
            
            return displayArr;
        }
        // C.Q 2017209 同一单元格中，过滤级别低提示
        ViewEngine.prototype.filterByLevels = function(arr){
        	var hash = $.extend(true, {}, arr);  // 深度拷贝
    		for(var formulaItem in arr ){
    			for(var hashItem in hash){
    				if(formulaItem == hashItem) {
    					continue;	
    				}
    				//TODO 未容错处理
    				// 过滤提示类型(tiptype)级别低  ( error > info) 
        			if (parseInt(tipTypes[arr[formulaItem].tipType]) > parseInt(tipTypes[hash[hashItem].tipType])) {
       				 	delete hash[formulaItem]; // 剔除比较范围，减少循环次数
       				 	break;
        			} else if (parseInt(tipTypes[arr[formulaItem].tipType]) == parseInt(tipTypes[hash[hashItem].tipType]) && parseInt(arr[formulaItem].level) > parseInt(hash[hashItem].level)) {
        				// 当提示类型(tiptype)相同时，过滤level优先级低者( 1 > 2 > 3 ..)，如：
        				/*
        				 * {"jpath":"xx",
							"tipType":"info",
							"level":"1",
							"tips":"info级别level：1"
							},
							{"jpath":"xx",
							"tipType":"info",
							"level":"2",
							"tips":"info级别level：2"
							}
							在此组数据中，相同的jpath将会去掉level：2的数据(level：1 > 2 > 3 .. )
        				 */
        				delete hash[formulaItem]; // 剔除比较范围，减少循环次数
        				break;
        			}
                       
            	}
    		}
        		
            return hash;
        }
        /**
         * 当有未检查通过的附表时，附表需要显示背景色 Added By C.Q 20170306
         */
        ViewEngine.prototype.showFbBgcolor = function(idxVariable2NoPass) {
        	if(!idxVariable2NoPass) {
        		return;
        	}
		//性能优化，不使用extend
        	//var arr = $.extend(true, {}, idxVariable2NoPass);  // 深度拷贝
        	var jpathArr = {}; // 校验不通过jpath集合，用以匹配附表
        	$.each(idxVariable2NoPass, function(jpath, var2NoPass) {
        		var arr = viewEngine.filterByLevels(var2NoPass); // 过滤低级别提示以筛选出高级别提示背景色
        		var num = 1; // 错误数量
        		$.each(arr, function(id, FormulaObject) {
                    if(id === "idx"){
                        return ;
                    }
        			var jpathInfo = {};
        			jpathInfo['tipType'] = FormulaObject.tipType;
        			jpathInfo['level'] = FormulaObject.level;
        			jpathInfo['num'] = num;
        			// 保存jpath
                	jpathArr[jpath] = jpathInfo;
                	num++;
        		});
        		
        	});
        	var matchJpathLst = {}; // jpath和附表bdsxmc完全匹配表 ，保存内容：jpath=bdsxmc
        	var preBdsxmc = '';
        	// 解决bdsxmc存在父子关系问题，如A表单bdsxmc=a.b.c ，B表单bdsxmc=a.b.c.d；若B表单元格的jpath为a.b.c.d.e，原来统计时会纳入A表范围内；此处代码做修正。
        	$("#divSheetlist", parent.document).find("a").each(function(i){
        		var bdsxmc = $(this).attr('bdsxmc');
                var bdsxmcArr = bdsxmc.split(',');

                if(bdsxmcArr && bdsxmcArr.length > 0){
                    for (var j = 0,len = bdsxmcArr.length; j < len; j++) {
                        var tmpBdsxmc = bdsxmcArr[j];
                        if(!tmpBdsxmc){
                            return;
                        }
                        $.each(jpathArr, function(jpath, jpathInfo) {
                            if(jpath && tmpBdsxmc && jpath.indexOf(tmpBdsxmc+'.') >= 0) {
                                preBdsxmc = matchJpathLst[jpath];
                                if (!preBdsxmc || preBdsxmc.length < tmpBdsxmc.length) {
                                    matchJpathLst[jpath] = tmpBdsxmc;
                                }
                            }
                        });
                    }
                }
        	});
        	var fbErrNum = 0; // 显示错误数量 
        	// 遍历附表，判断是否需要显示附表
        	$("#divSheetlist", parent.document).find("a").each(function(i){
        		var elA = $(this);
        		var elSpan = elA.siblings('span'); 
        		var bdsxmc = elA.attr('bdsxmc');
        		if (!bdsxmc) {
        			return true;
        		}
        		for(var k in fbBgClasses) { 
        			elSpan.removeClass(fbBgClasses[k]); // 移除样式
            	}
        		elSpan.html(''); 
        		var key = ''; // 样式key值
        		var tmpTipType = '';
        		var tmpLevel = '';

                var bdsxmcArr = bdsxmc.split(',');

                if(bdsxmcArr && bdsxmcArr.length > 0) {
                    for (var j = 0, len = bdsxmcArr.length; j < len; j++) {
                        var tmpBdsxmc = bdsxmcArr[j];
                        if(!tmpBdsxmc){
                            return;
                        }
                        $.each(jpathArr, function(jpath, jpathInfo) {
                            // 若jpath属于此表单，则改变表单背景色
                            // 以附表为纬度，计算所有级别最高的提示数量
                            if(matchJpathLst[jpath] == tmpBdsxmc) {
                                if (tmpTipType != '') {
                                    if (parseInt(tipTypes[tmpTipType]) > parseInt(tipTypes[jpathInfo['tipType']])) {
                                        // 级别比上一次循环数据高，则覆盖上一次值，重新计算错误数量
                                        tmpTipType = jpathInfo['tipType'];
                                        tmpLevel = jpathInfo['level'];
                                        fbErrNum = 1;
                                        key = tmpTipType + '_' + tmpLevel;
                                        delete jpathArr[jpath];
                                        return true;
                                    } else if (parseInt(tipTypes[tmpTipType]) == parseInt(tipTypes[jpathInfo['tipType']]) && parseInt(tmpLevel) > parseInt(jpathInfo['level'])) {
                                        // 级别比上一次循环数据高，则覆盖上一次值，重新计算错误数量
                                        tmpTipType = jpathInfo['tipType'];
                                        tmpLevel = jpathInfo['level'];
                                        fbErrNum = 1;
                                        key = tmpTipType + '_' + tmpLevel;
                                        delete jpathArr[jpath];
                                        return true;
                                    } else if(parseInt(tipTypes[tmpTipType]) == parseInt(tipTypes[jpathInfo['tipType']]) && parseInt(tmpLevel) == parseInt(jpathInfo['level'])){
                                        // 级别与上一次循环数据一样，则累计错误数量
                                        //modify by lizhengtao 20180122 提示的错误数字应该是该附表内显示的校验不通过的单元格数
                                        fbErrNum += 1;
                                        delete jpathArr[jpath];
                                    }
                                } else {
                                    // 当前为第一次循环，当前级别保存至临时变量，为下一次循环做对比，若下一次循环中有比此级别高的提示则覆盖此临时变量。
                                    fbErrNum = 1;
                                    tmpTipType = jpathInfo['tipType'];
                                    tmpLevel = jpathInfo['level'];
                                    key = tmpTipType + '_' + tmpLevel;
                                    delete jpathArr[jpath];
                                }

                            }
                        });
                    }
                }

        		if(key != '' && !elSpan.hasClass(fbBgClasses[key])) {
        			elSpan.addClass(fbBgClasses[key]);
        			elSpan.html(fbErrNum); 
   			 	}
        		
        		fbErrNum = 0;
        	});
        	
        }
        ViewEngine.prototype.updateUIControl = function(domElem, controls){
            var jqElem = $(domElem);

            /**
             * ng-select-page 指令控制的应该是生成的selectpage对应的dom
             */
            if(jqElem.attr("ng-select-page")){
                jqElem = jqElem.prev();
                domElem = jqElem.get(0);
            }

            for ( var ctl in controls) {
                var flag = controls[ctl];
                if (ctl === "readonly") {
                    if (flag) {
                        if (typeof domElem["$OLD_RW$"] == "undefined") {
                            domElem["$OLD_RW$"] = jqElem.attr("readonly") || false;
                        }
                        if(parent.unlockedAllFormsBz!="Y"){
                            jqElem.attr("readonly", "readonly");
                        }
                    } else {
                        if (!domElem["$OLD_RW$"]) {
                            jqElem.removeAttr("readonly");
                        }
                    }
                } else if (ctl === "readwrite") {
                	if (flag) {
                        if (typeof domElem["$OLD_RW$"] == "undefined") {
                            domElem["$OLD_RW$"] = jqElem.attr("readonly") || false;
                        }
                        jqElem.removeAttr("readonly");
                    } else {
                        if (domElem["$OLD_RW$"] && parent.unlockedAllFormsBz!="Y") {
                            jqElem.attr("readonly", "readonly");
                        }
                    }
                } else if(ctl === "disabled") {
                    if (flag) {
                        if (typeof domElem["$OLD_RW$"] == "undefined") {
                            domElem["$OLD_RW$"] = jqElem.attr("disabled") || false;
                        }
                        if (typeof domElem["$OLD_CSS$background-color"] === "undefined") {
                            /**
                              *  设置dom元素样式为disabled时,会自动加上background-color:#f1edee(灰色)，
                              *  因此在设置disabled之前需要将dom元素本身的background-color样式保存在OLD_CSS中
                              *  以便在取消disabled时候能还原到dom元素最初的background-color
                             */
                            domElem["$OLD_CSS$background-color"] = jqElem.css("background-color") || false;
                        }
                        if(jqElem.attr("ng-select-query")!==undefined){
                            jqElem.select2("enable",false);
                        }else{
                            if(parent.unlockedAllFormsBz!="Y"){
                                jqElem.attr("disabled", "disabled");
                            }
                        }
                    } else {
                        if (!domElem["$OLD_RW$"]) {
                            jqElem.removeAttr("disabled");
                        }
                    }
                }  else if (ctl === "lock") {
					this.setElementEditFlag(domElem,flag);
                } else {
                    var tmp = ctl.split("=");
                    if (tmp.length > 1) {
                        if (flag) {
                            if (typeof domElem["$OLD_CSS$" + tmp[0]] == "undefined") {
                                domElem["$OLD_CSS$" + tmp[0]] = jqElem.css(tmp[0]) || false;
                            }
                            jqElem.css(tmp[0], tmp[1]);
                        } else {
                            var oldcss = domElem["$OLD_CSS$" + tmp[0]];
                            if (oldcss) {
                                jqElem.css(tmp[0], oldcss);
                            } else {
                                jqElem.css(tmp[0], "");
                            }
                        }
                    }
                }
            }
        }
        /**
         * 刷新angular模型 外部修改angular模型后，刷新angular视图 el:element要刷新的document元素 _attr:更新的scope属性 _data:更新的属性值 在没有scope的情况下使用
         * exp:$scope.apply()旨在angular框架之外传播模型变化
         */
        ViewEngine.prototype.formApply = function(_el, _attr, _datas){
            var scope = angular.element(_el).scope();
            if (null != _attr && null != _datas) {
                scope[_attr] = _datas;
            }
            if(!scope.$$phase){
            	scope.$apply();
            }
        }
        
        /**
         * 动态刷新整个数据模型
         * @params _el 进行刷新的顶层元素 目前是指定的 $("#viewCtrlId")
         * @params _datas 进行刷新的顶层数据对象 目前指定为formData
         * @params formEngineObj 进行刷新的表单引擎对象，目前为全局变量 formEngine
         */
        ViewEngine.prototype.dynamicFormApply = function(_el,_datas,formEngineObj){
        	var scope = angular.element(_el).scope();
        	scope.formData = _datas;
        	for(var i in scope){
        		if(i.indexOf("_jprefix_")==0 && i != "_jprefix_"){//scope[i]示例:"a.b.c"
        			var _obj = jsonPath(scope.formData, scope[i])[0];//简写路径--绑定对象
        			var _name = i.replace("_jprefix_","");
        			scope[_name] = _obj;
        		}
        		if(i.indexOf("_arr_")==0){//scope[i]示例:["a.b.c[1].c","a.b.c[0]"]
        			var path = scope[i][0].substr(0,scope[i][0].indexOf("["));
        			var _obj = jsonPath(scope.formData, path)[0];//动态行数组对象
        			var _name = i.replace("_arr_","");
        			scope[_name] = _obj;
        		}
        		if(i.indexOf("_info_")==0){//scope[i]示例:{"model":model,"dm":_dm}
        			var _CTinfoData = scope[i];//码表信息对象
        			var _model = _CTinfoData.model;
        			var _dm = _CTinfoData.dm;
        			var _obj = jsonPath(scope.formData, _model)[0];//码表数据来源对象
        			var _name = i.replace("_info_","");
                    if(undefined != _dm && "" != _dm) {
                        var _jsons = {};
                        $.each(_obj, function(k,v) {
                            _jsons[v[_dm]] = v;
                        });
                        _obj = _jsons;
                        //$scope["_info_"+_name] = {"model":model,"dm":_dm};
                    }
                    scope["CT"][_name] = _obj;
                    formEngineObj.cacheCodeTable(_name, _obj);
        		}
        	}
        	scope.$apply();
        }
        /**
         * 获取url中的参数 C.Q 20170317
         */
        ViewEngine.prototype.getUrlParam = function(name){
        	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }
        /**
         * 单元格定位 C.Q 20170317
         */
        ViewEngine.prototype.focusEle = function(name){
        	var i_jp = viewEngine.getUrlParam('fjp');  // 判断请求参数中的jpath
        	// 若有值则定位至该单元格
            if (i_jp) {
            	var i_El = $("input[jpath='"+i_jp+"']");
            	if (i_El[0]) {
            		i_El[0].focus();
            	}
            } 
        }
        /**
         * PRIVATE 根据指定的HTML节点名称（类型），寻找当前节点的下一个兄弟（同级）元素节点.
         * @param ce Current element.
         * @return Node in parents, null for not founded.
         */
        ViewEngine.prototype.findNextElement = function(ce) {
            do{
                if(!ce) break;
                ce = ce.nextSibling;
            } while(ce && ce.nodeType != 1);
            if(!!ce) {
                return ce;
            } else return null;
        }
        /**
         * PRIVATE 根据指定的HTML节点名称（类型），寻找当前节点的上一个兄弟（同级）元素节点.
         * @param ce Current element.
         * @return Node in parents, null for not founded.
         */
        ViewEngine.prototype.findPreviousElement = function(ce) {
            do{
                if(!ce) break;
                ce = ce.previousSibling;
            } while(ce && ce.nodeType != 1);
            if(!!ce) {
                return ce;
            } else return null;
        }
        /**
         * PRIVATE 根据指定的HTML节点名称（类型），寻找当前节点的父节点.
         * @param ce Current element.
         * @param tagName Name of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in parents, null for not founded.
         */
        ViewEngine.prototype.findParent = function (ce, tagName) {
            while (ce && ce != window && ce != document) {
                ce = ce.parentNode;
                if (ce && ce.tagName == tagName) {
                    return ce;
                }
            }
            return null;
        }

        /**
         * PRIVATE 根据指定的HTML节点名称（类型），寻找当前节点的下一个兄弟（同级）节点.
         * @param ce Current element.
         * @param tagName Name of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in sibling, null for not founded.
         */
        ViewEngine.prototype.findNextSibling = function (ce, tagName) {
            while (ce) {
                //ce = ce.nextSibling;
                ce = viewEngine.findNextElement(ce);
                if (ce && ce.tagName == tagName) {
                    return ce;
                }
            }
            return null;
        }

        /**
         *PRIVATE 根据指定的HTML节点名称（类型），寻找当前节点的上一个兄弟（同级）节点.
         * @param ce Current element.
         * @param tagName Name of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in sibling, null for not founded.
         */
        ViewEngine.prototype.findPreviousSibling = function (ce, tagName) {
            while (ce) {
                //ce = ce.previousSibling;
                ce = viewEngine.findPreviousElement(ce);
                if (ce && ce.tagName == tagName) {
                    return ce;
                }
            }
            return null;
        }

        /**
         * 根据指定的HTML节点名称（类型），寻找当前节点的第一个子节点.
         * @param ce Current element.
         * @param tagNames Names of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in children, null for not founded.
         */
        ViewEngine.prototype.findFirstChild = function (ce, tagNames) {
            var ret = null;
            var singleName = (tagNames instanceof Array) ? null : tagNames;
            if (ce) {
                //var cs = ce.childNodes;
                var cs = ce.children;//modify 0512
                for (var i = 0; i < cs.length; i++) {
                    // 当前子节点进行匹配
                    if (singleName) { // 只提供了唯一的TagName进行查找匹配
                        if (cs[i].tagName == singleName) {
                            ret = cs[i];
                            break;
                        }
                    } else { // 多个TagName进行查找匹配
                        for (var k = 0; k < tagNames.length; k++) {
                            if (cs[i].tagName == tagNames[k]) {
                                ret = cs[i];
                                break;
                            }
                        }
                    }
                    if (ret) break;
                    // 继续尝试匹配下层子节点
                    if (cs[i].hasChildNodes()) {
                        ret = viewEngine.findFirstChild(cs[i], tagNames);
                    }
                    if (ret) break;
                }
            }
            return ret;
        }

        /**
         * 根据指定的HTML节点名称（类型），寻找当前节点的最后一个子节点.
         * @param ce Current element.
         * @param tagNames Names of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in children, null for not founded.
         */
        ViewEngine.prototype.findLastChild = function (ce, tagNames) {
            var ret = null;
            var singleName = (tagNames instanceof Array) ? null : tagNames;
            if (ce) {
                //var cs = ce.childNodes;
                var cs = ce.children;//modify 0512
                for (var i = cs.length - 1; i >= 0; i--) {
                    // 当前子节点进行匹配
                    if (singleName) { // 只提供了唯一的TagName进行查找匹配
                        if (cs[i].tagName == singleName) {
                            ret = cs[i];
                            break;
                        }
                    } else { // 多个TagName进行查找匹配
                        for (var k = 0; k < tagNames.length; k++) {
                            if (cs[i].tagName == tagNames[k]) {
                                ret = cs[i];
                                break;
                            }
                        }
                    }
                    if (ret)
                        break;
                    // 继续尝试匹配下层子节点
                    if (cs[i].hasChildNodes()) {
                        ret = viewEngine.findLastChild(cs[i], tagNames);
                    }
                    if (ret)
                        break;
                }
            }
            return ret;
        }

        /**
         * 根据指定的HTML节点名称（类型），在表格行中的特定列中寻找第一个子节点.
         * @param ce Current element.
         * @param tagNames Names of HTML's tag, like 'TD', 'TR', 'DIV'
         * @return Node in children, null for not founded.
         */
        ViewEngine.prototype.searchCellInTR = function (tr, col, tagNames) {
            if (col && col > 0) {
                if (tr && "TR" == tr.tagName) {
                    //var tds = tr.childNodes;
                    var tds = tr.children;
                    if (tds.length < col) {
                        col = tds.length;
                    }
                    //modify by lzt 判断当前TD左边兄弟TD是否有跨行，若有要重新计算col
                    var len = col;
                    for(var i=0;i<len;i++){
                        if($(tds[i]).attr("rowspan")>1){
                            col +=1;
                        }
                    }

                    while (col > 0) {
                        col--;
                        //var tmp = viewEngine.findFirstChild(tds[col], tagNames);
                        var tmp = tds[col];
                        if (tmp) {
                            return tmp;
                        }
                    }
                } else {
                    console.log("searchCellInTR(): Param [tr] is null.");
                }
            } else {
                console.log("searchCellInTR(): Param [col] is illegal " + col);
            }
            return null;
        }

        /**
         * 检查并返回当前元素在表格中的位置.
         * @param ce Current element.
         * @return {td: ParentTD, tr: ParentTR, tab: ParentTABLE}
         */
        ViewEngine.prototype.cellPosInTable = function (ce) {
            var ret = null;
            var tmp;
            // 检查元素执行环境
            if (ce) {
                //TODO 如果这元素是td,则不用findParent。
                var nodeTD =  "TD" == ce.tagName? ce : viewEngine.findParent(ce, "TD");
                if (nodeTD) {
                    // 确定TD的顺序位（第几列）
                    var posCol = 1;
                    tmp = nodeTD;
                    var rowspanFlag = false;//检查左边兄弟TD是否包含rowspan,若包含，设置为直观的顺序
                    //while (tmp.previousSibling) {
                    while (viewEngine.findPreviousElement(tmp)) {
                        //tmp = tmp.previousSibling;
                        tmp = viewEngine.findPreviousElement(tmp);
                        if($(tmp).attr("rowspan")>1){
                            //posCol == 0?posCol:posCol--;
                        } else {
                            posCol++;
                        }
                    }

                    // 继续寻找上一层
                    var nodeTR = viewEngine.findParent(nodeTD, "TR");
                    if (nodeTR) {
                        // 确定TR的顺序位（第几行）
                        var posLine = 1;
                        tmp = nodeTR;
                        while (tmp.previousSibling && tmp.nodeName == "TR") {
                            tmp = tmp.previousSibling;
                            posLine++;
                        }
                        var nodeTAB = viewEngine.findParent(nodeTR, "TABLE");
                        if (nodeTAB) {
                            ret = { "td" : nodeTD, "tr" : nodeTR, "tab" : nodeTAB, "posTd" : posCol, "posTr" : posLine
                            };
                        } else {
                            console.log("cellPosInTable(): TABLE not founded!");
                        }
                    } else {
                        console.log("cellPosInTable(): TR not founded!");
                    }
                } else {
                    console.log("cellPosInTable(): TD not founded!");
                }
            } else {
                console.log("cellPosInTable(): Param [ce] is null!");
            }
            return ret;
        }

        ViewEngine.prototype.seekInLine = function (key, pos, cur, tagName) {
            return viewEngine.searchCellInTR(cur.tr, pos.posTd, tagName);
        }

        /**
         * 寻找下一行的tr,并返回tr的 td 或者 input
         * @param key
         * @param pos
         * @param cur
         * @returns {*}
         * 版本记录：修改2019.2.21
         * 原先逻辑： 找下一行,第一个td中第一个input,如果找不到，则继续往下找，直到找到为止,效果：粘贴跳行。
         * 现在调整为：找下一行，第一个 td 或者 input,获取不到则返回null,效果：粘贴不跳行
         */
        ViewEngine.prototype.seekInTable = function (key, pos, cur) {
            var ret = null;
            while (!ret) {
                if ("ArrowUp" == key) {
                    if (cur.tr) {
                        cur.tr = viewEngine.findPreviousSibling(cur.tr, "TR");
                    } else {
                        cur.tr = viewEngine.findLastChild(cur.tab, "TR");
                    }
                } else if ("ArrowDown" == key || "Enter" == key) {
                    if (cur.tr) {
                        cur.tr = viewEngine.findNextSibling(cur.tr, "TR");
                    } else {
                        //如果cur.tr等于空，则默认取第一个tr
                        cur.tr = viewEngine.findFirstChild(cur.tab, "TR");
                    }
                } else if ("ArrowLeft" == key) {
                    if(cur.td) {
                        cur.td = viewEngine.findPreviousSibling(cur.td, "TD");
                    } else {
                        cur.td = viewEngine.findLastChild(cur.tr, "TD");
                    }
                    cur.tr = null;
                } else if ("ArrowRight" == key || "Enter1" == key) {
                    if(cur.td) {
                        cur.td = viewEngine.findNextSibling(cur.td, "TD");
                    } else {
                        cur.td = viewEngine.findFirstChild(cur.tr, "TD");
                    }
                    cur.tr = null;
                }
                if (cur.tr) {
                    //modify by lzt 为解决TD不能跳转到下一行有INPUT的情况，若取到TD后无法取得子节点INPUT则在下一行继续找
                    var curTD = viewEngine.seekInLine(key, pos, cur, "TD");//此处取到的tr中第一个td
                    var inp = viewEngine.findFirstChild(curTD, "INPUT");
                    if(inp || curTD) {
                        ret = inp || curTD;
                    }
                } //else if (cur.td)
                //{
                //ret = cur.td;
                //}
                else {
                    break;
                }
            }
            return ret;
        }

        /**
         * 寻找元素
         * @param key
         * @param pos
         * @returns {Node|*}
         */
        ViewEngine.prototype.seekInDoc = function (key, pos) {
            var cur = { "tab" : pos.tab, "tr" : pos.tr, "td" : pos.td
            };
            var ret = viewEngine.seekInTable(key, pos, cur);
            //如果下一行中，没有td 或者 input,则继续找下一个table.
            while (!ret) {
                var thisLine;
                if ("ArrowUp" == key || "ArrowLeft" == key) {
                    cur.tab = viewEngine.findPreviousSibling(cur.tab, "TABLE");
                } else if ("ArrowDown" == key || "ArrowRight" == key || "Enter" == key) {
                    cur.tab = viewEngine.findNextSibling(cur.tab, "TABLE");
                }
                cur.tr = null;
                cur.td = null;
                if (cur.tab) {
                    ret = viewEngine.seekInTable(key, pos, cur);
                } else {
                    break;
                }
            }
            return ret;
        }

        /**
         * 从当前事件中识别并返回特殊按键
         */
        ViewEngine.prototype.recognizeSpecialEventKey = function (event) {
            var key = null;
            if (event) { //
                var keyCode = event.keyCode ? event.keyCode : event.which;
                switch (keyCode) {
                    case 13:
                        key = "Enter";   // 暂不处理
                        break;
                    case 37:
                        key = "ArrowLeft";
                        break;
                    case 38:
                        key = "ArrowUp";
                        break;
                    case 39:
                        key = "ArrowRight";
                        break;
                    case 40:
                        key = "ArrowDown";
                        break;
                    default:
                        key = null;
                }
            }
            return key;
        }

        /**
         * 捕获键盘事件，控制当前光标在表格中跳动
         */
        ViewEngine.prototype.eventCursorControl = function (eTable) {
            var theEvent = window.event || arguments.callee.caller.arguments[0];
            var theSrcElement = theEvent.srcElement ? theEvent.srcElement : theEvent.target;
            var key = viewEngine.recognizeSpecialEventKey(theEvent);
            if (key) {
                var pos = viewEngine.cellPosInTable(theSrcElement);
                if (pos) {
                    var innerINP = viewEngine.seekInDoc(key, pos);
                    if (innerINP && "INPUT" == innerINP.tagName && innerINP.focus ) {
                        innerINP.select();
                        innerINP.focus();
                        //theEvent.preventDefault();
                        stopIt(theEvent);
                    }
                }
                console.log(pos);
            }
        }

        ViewEngine.prototype.doPasteExcelAdv = function (eTable) {
            // 检查元素可执行环境
            eSource = event.srcElement;
            if ("INPUT" != eSource.tagName || !eSource.attributes.jpath) {
                return false; // 忽略：仅支持在INPUT控件上的复制效果
            }
            if ("TABLE" != eTable.tagName) {
                console.log("Function only effect on TABLE!");
                return false; // 无效：非TABLE范围内无法支持
            }
			if($(event.target).parents("td") && $(event.target).parents("td").find("input")){
            	 if($(event.target).parents("td").find("input").length>1){
                 	return true;
                 }
            }
            //event.preventDefault(); //消除默认粘贴
            stopIt(event);
            //获取粘贴板数据
            var data = null;
            var clipboardData = window.clipboardData || event.clipboardData; // IE || chrome
            data = clipboardData.getData('Text');
            data = data.replace(/\n/g, ''); // Excel 单元格内换行
            console.log(data);
            if (data.lastIndexOf("\r") >= data.length - 1) {
                data = data.substr(0, data.length - 1)
            }

            var data = data.split('\r');
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].split('\t');
            }
            console.log(data);
            //只考虑换行情况
            if ("INPUT" == eSource.tagName) {
                var pos = viewEngine.cellPosInTable(eSource);
                for (var i = 0; i < data.length; i++) {
                    var y = i;
                    var line = data[i];
                    var looking = {"y" : y, "x" : 0};

                    if(i != 0) {
                        eSource = viewEngine.seekInDoc("ArrowDown", pos); //找下一行的第一个input/td元素
                        pos = viewEngine.cellPosInTable(eSource); //确定input/td在table的位置,即下一行的位置
                    }
                    if(pos==null)break;//没有下一行，则退出
                    viewEngine.settingInputAdv(pos, looking, line);//给这一行，每一个input赋值
                }
                // 刷新视图
                viewEngine.formApply($('#viewCtrlId'));
                viewEngine.tipsForVerify(document.body);
            }
        }

        ViewEngine.prototype.doPasteExcel = function (e) {
            //event.preventDefault(); //消除默认粘贴
            stopIt(event);
            //获取粘贴板数据
            var data = null;
            var clipboardData = window.clipboardData || event.clipboardData; // IE || chrome
            data = clipboardData.getData('Text');
            if (data.lastIndexOf("\n") >= data.length - 1) {
                data = data.substr(0, data.length - 1)
            }
            console.log(data.replace(/\t/g, '\\t').replace(/\n/g, '\\n')); //data转码

            //只考虑换行情况
            node = event.srcElement;
            if ("INPUT" == node.tagName) {
                var idx = node.getAttribute("cellidx");
                var idxs = idx.split(",");
                var row = parseInt(idxs[0]);
                var col = parseInt(idxs[1]);
                var lines = data.split("\n");
                var max = row + lines.length;
                for (var i = 0; i < lines.length; i++) {
                    var y = row + i;
                    var texts = lines[i].split("\t");
                    for (var j = 0; j < texts.length; j++) {
                        var x = col + j;
                        var looking = y + "," + x;
                        if (!viewEngine.settingInput(e, looking, texts[j])) {
                            break;
                        }
                    }
                }
                // 刷新视图
                viewEngine.formApply($('#viewCtrlId'));
                viewEngine.tipsForVerify(document.body);
            }
        }

        ViewEngine.prototype.settingInputAdv = function (pos, looking, value) {
            var i = 0;
            var _td = pos.td;
            do{
                if(i>=value.length) break;
                var node = viewEngine.findFirstChild(_td, "INPUT");
                _td = viewEngine.findNextSibling(_td, "TD");
                if(!node) {
                    //在该列找不到input,则自动跳过这一列
                    i++;
                    continue;
                }
                //var regUpper = /^[0-9.-/,]*$/;//数字
                //TODO 百分号特殊处理32%-->0.32
                if ( ("text" == node.getAttribute("type") || !node.getAttribute("type")) && node.getAttribute("jpath")) {
                    looking.x = i;
                    var _v = value[i].replace(/(^\s*)|(\s*$)/g, "");//去掉前后空格
                    var _ngDataType = node.getAttribute("ng-datatype") == null?"String":node.getAttribute("ng-datatype");
                    var formatParam;
                    var posTmp = _ngDataType.indexOf("{");
                    if (posTmp > 0) {
                        formatParam = _ngDataType.substr(posTmp + 1, _ngDataType.indexOf("}") - posTmp - 1);
                        _ngDataType = _ngDataType.substr(0, posTmp);
                    }
                    if(this.REG_DIGIT.test(_v)) {
                        //加上percent，由于类型为字符和数字 percent的处理方式不同，因此不能转字符串
                        var dataTypeArr = ["digit", "number", "int", "float", "natural", "zero","percent"];
                        Array.prototype.contains = function(obj) {
                            var i = this.length;
                            while(i--) {
                                if(this[i] === obj) return true;
                            }
                            return false;
                        };
                        if(_ngDataType && dataTypeArr.contains(_ngDataType)){
                            _v = _v.replace(/[^0-9.-]/g, '');
                            if("" === _v) _v = 0.00;//TODO 最好加上formatParam更严格的格式

                            if(_ngDataType === "percent"){
                                _v = (_v / Math.pow(10, 2)).toFixed(parseInt(formatParam));

                                _v = Number(_v);
                                if(isNaN(_v)){
                                    return false;
                                }
                            }
                        } else{
                            _v = "\'" + _v + "\'";
                        }
                    } else {
                        if(_ngDataType === "percent" && _v.toString().indexOf("%") > -1){
                            //百分号特殊处理32%-->0.32
                            _v = _v.toString().replace("%","");
                            _v = (_v / Math.pow(10, 2)).toFixed(parseInt(formatParam));

                            _v = Number(_v);
                            if(isNaN(_v)){
                                return false;
                            }
                        }else{
                            _v = "\'" + _v + "\'";
                            var ngDataTypeArr = "digit,number,int,float,natural,zero";
                            //要进行粘贴的数据匹配不是数字类型而当前input的类型又是数字类型直接return false，不进行setValue操作
                            if (_ngDataType && ngDataTypeArr.indexOf(_ngDataType) > -1) {
                                return false;
                            }
                        }
                    }

                    if(!_v) {
                        if(typeof _v === "number"){
                            _v = 0.00;
                        }else{
                            _v = '\'\'';
                        }
                    }
                    i++;
                    //model jpath=
                    //view apply();
                    // 更新数据模型值
                    var jpath = node.getAttribute("jpath");
                    //如果属性是disabled 或者 readonle,则取消粘贴赋值;兼容chrome
                    var $eSource = $(node);
                    var readonlyAttr=$eSource.prop("readonly");
                    var disabledAttr=$eSource.prop("disabled");
                    if(!("INPUT" === eSource.tagName && (readonlyAttr || disabledAttr))){
                        parent.formulaEngine.setValue(jpath,_v);
                        parent.formulaEngine.apply(jpath,_v);
                    }
                    console.log('['+looking.y + ','+looking.y + ']=' + _v);
                }
            } while(_td);
            console.log(looking + " NOT FOUNDED.");
            return true;
        }

        ViewEngine.prototype.settingInput = function (root, looking, value) {
            var elems = root.getElementsByTagName("input");
            for (var i = 0; i < elems.length; i++) {
                var node = elems[i];
                if (looking == node.getAttribute("cellidx")) {
                    node.value = value;
                    console.log(looking + "=" + value);
                    return true;
                }
            }
            console.log(looking + " NOT FOUNDED.");
            return false;
        }

        /**
         * 在分页情况下,两种情况触发：
         * 1.翻页时,触发调整jpath下标
         * 2.当增行或者删行,数组改变,修改conf的总条数，监听conf属性有变动时,触发调整jpath下标
         * @param scope 全局域对象
         * @param self 当前分页对象
         */
        ViewEngine.prototype.updateIdx4Jpath = function (scope, self) {

            //因为angular界面还没有渲染完成时就取页面元素操作会漏洞元素执行，故需要等待元素渲染完成再操作
            var _this = this;
            // 当scope.$$phase有值是说明正在渲染，为null时说明渲染完成
            if(scope.$$phase){
                setTimeout(function(){
                    _this.updateIdx4Jpath(scope, self);
                },50);
                return;
            }

            var id=self[0].id;
            //var el=self.parent().parent(); //此处，获取分页数组有问题。即分页控制器无法移动到其他地方
            var conf=scope.conf[id]; //分页参数
            /*
             * 因为采用监听conf,angular 1.x 会经常回调这个函数，需要过滤这些非翻页触发事件。
             */
            if(!conf){
                return;
            }

            /*
             * 找table 和 分页对应关系。暂时不考虑用name 取标记table,涉及到界面比较多
             */
            !window._paginationRepeat ? window._paginationRepeat={} : "";
            var $dataPanel=(window._paginationRepeat && window._paginationRepeat[id]) ? window._paginationRepeat[id] : null;
            if(!$dataPanel){
                var ngRepeatList=$(document).find("*[ng-repeat]");
                for(var i=0;i<ngRepeatList.length;i++){
                    var o =ngRepeatList.get(i);
                    if(new RegExp("\\|paging:."+id+".").test(o.getAttribute("ng-repeat").replace(/\s+/g,""))){
                        $dataPanel=$(o).parent();
                        window._paginationRepeat[id]=$dataPanel;
                        break;
                    }
                }
            }

            /*
               获取代码ng-repeat-init的元素，获取该scope,获取真实数组下标。
               修改该元素中jpath属性
               此处考虑一个问题，就是table的遍历对象为空。此时是找不到table的
             */
            viewEngine.updateJpath($dataPanel);

            viewEngine.tipsForVerify2(document.body);//界面提示
        }

        // For not to do initialization twice.
        ViewEngine._inited = true;
    }
}

/**
 * 触发该事件：
 * 1.不采用分页，但是带有过滤器,增行或者删行，需要触发。
 * 2.采用分页，带有过滤器，增行，删行，翻页，需要触发
 * 更新jpath下标
 * @param $dataPanel 数据区ng-repeat的父dom
 */
ViewEngine.prototype.updateJpath = function ($dataPanel) {
    /*
     * 找不到表单table,则不更新下标
     */
    if(!$dataPanel){
        //throw "找不到表单table";
        return;
    }
    /*
       获取代码ng-repeat-init的元素，获取该scope,获取真实数组下标。
       修改该元素中jpath属性
     */
    $dataPanel.find("*[ng-repeat-init]").each(function(i){
        var _scope = angular.element(this).scope();
        var  _idx=_scope.$originIndex();
        var $this=$(this);
        $this.find("input[jpath],select[jpath],textarea[jpath]").each(function(i){
            var $$this=$(this);
            var _jpath = $$this.attr("jpath");
            _jpath=_jpath.replace(/\[\d+\]/g, "[" + _idx + "]");
            $$this.attr("jpath", _jpath);
        });
        //使用文书动态行wsdel()时，初始化话数据多页时切换分页有问题 JSONE-2858
        var _keyword = $this.attr('ng-repeat-init');
        $this.children().children().each(function(i){
        	var $$this=$(this);
            _jpath = $$this.attr("jpath");
        	if(_jpath!=undefined&&_scope[_keyword][_idx].isDeleteTr==='Y'){
        		viewEngine.setDynamicElementEditFlag(this,true);
        	}
        	if(_jpath!=undefined&&_scope[_keyword][_idx].isDeleteTr==='N'||_scope[_keyword][_idx].isDeleteTr===''){
        		viewEngine.setDynamicElementEditFlag(this,false);
        	}
        });
    });

}

/**
 * repeatFinish指令处理函数
 */
function renderFinish(){}

/**
 * 按需隐藏表单上的按钮
 * @author zoufeng@foresee.cn
 * */
ViewEngine.prototype.hideButtons = function() {
	if (parent.formData.taxML.formContent.root.head.publicHead.ywhdDm == '20') {
		if (typeof(sxsl_hideBtn) !== 'undefined' && sxsl_hideBtn === false) {
			return;
		}
		var nodes = document.getElementsByTagName('a');
		for (var i = 0;i < nodes.length; i++) {
			if (nodes[i].className.indexOf('layui-btn') != -1){
				nodes[i].style.display = 'none';
			}
		}
	}
}
/**
 * 点击“删除”，“恢复“按钮，控制动态行元素是否可编辑
 * @author jiangyunchun@foresee.com.cn
 * */
ViewEngine.prototype.setDynamicElementEditFlag = function(domElem,flag) {
	var jqElem=$(domElem);
	var isSelect = domElem.tagName == 'SELECT';
	if(!isSelect){
		if (flag) {
			jqElem.attr("disabled", "disabled");
		} else {
			jqElem.removeAttr("disabled");
		}
	}else {
		this.setElementEditFlag(domElem,flag);
	}
}
/**
 * 控制元素是否可编辑
 * @author jiangyunchun@foresee.com.cn
 * */
ViewEngine.prototype.setElementEditFlag = function(domElem,flag) {
	var jqElem = $(domElem),isSelect = domElem.tagName == 'SELECT',needDisabled = (isSelect || domElem.type == 'radio' || domElem.type == 'checkbox'),
		clickEventName = jqElem.attr("onclick"),
		foculsEventName = jqElem.attr("onfocus"),
		mouseoverEventName = jqElem.attr("onmouseover"),	//专门针对升级后的日期控件
		ngClickEventName= jqElem.attr("ng-click"),
		myClick = jqElem.attr("myclick"),
		myFocus = jqElem.attr("myfocus"),
		myMouseover = jqElem.attr("mymouseover"),
		myNgClick = jqElem.attr("myngclick");
		if (flag) {
			if (typeof domElem["$OLD_LOCK$"] == "undefined") {
				domElem["$OLD_LOCK$"] = (needDisabled ? jqElem.attr("disabled") : jqElem.attr("readonly")) || false;
			}
			jqElem.attr("readonly", "readonly");
			if (needDisabled) {
				jqElem.attr("disabled", "disabled");
				//GEARS-4961 兼容IE8，当select无option时，执行domElem.options[index].text会报错“TypeError: 对象不支持此属性或方法”；解决方案判断有无options，domElem.options.length > 0. M By C.Q 20171031 
				isSelect && domElem.options.length > 0 && domElem.selectedIndex!=-1 && domElem.options[domElem.selectedIndex] && (domElem.title = domElem.options[domElem.selectedIndex].text);	//鼠标移上去时，提示选中的文本
			}
			if (clickEventName) {
				jqElem.attr("myclick", clickEventName);
				jqElem.removeAttr("onclick");
			}
			if (foculsEventName) {
				jqElem.attr("myfocus", foculsEventName);
				jqElem.removeAttr("onfocus");
			}
			if (mouseoverEventName) {
				jqElem.attr("mymouseover", mouseoverEventName);
				jqElem.removeAttr("onmouseover");
			}
			if (ngClickEventName) {
				jqElem.attr("myngclick", ngClickEventName);
				jqElem.removeAttr("ng-click")
			}
			jqElem.off("click");	//解绑ng-click与onclick事件
			jqElem.off("focus");	//解绑focus
			jqElem.off("mouseover");	//解绑mouseover
			if(jqElem.attr("ng-select-query")!==undefined){
				jqElem.select2("enable",false);
			}
		} else {
			jqElem.removeAttr("readonly");
			jqElem.removeAttr("unselectable");
			needDisabled && jqElem.removeAttr("disabled");
			if (myClick) {
				jqElem.attr("onclick", myClick);
				jqElem.removeAttr("myclick");
			}
			if (myNgClick) {
				jqElem.attr("ng-click", myNgClick);
				jqElem.removeAttr("myngclick");
			}
			if (myFocus) {
				jqElem.attr("onfocus", myClick);
				jqElem.removeAttr("myfocus");
			}
			if (myMouseover) {
				jqElem.attr("onmouseover", myClick);
				jqElem.removeAttr("mymouseover");
			}
			if(jqElem.attr("ng-select-query")!==undefined){
				jqElem.select2("enable",true);
			}
		}
}

// 初始化ViewEngine
$(function(){
    viewEngine = new ViewEngine();
    strViewApp = 'viewApp';
    viewEngine.initialize(strViewApp);
    //IE、Mozilla浏览器下
    //新增动态行数据模型后，需要向父框架formData更新（“不能执行已释放的Script代码”，
    //由于子页面数据生命周期终结而父框架访问到已释放对象所致）
    if ($.browser.msie || $.browser.mozilla) {
        $(window).on('unload',function() {
        	if(ViewEngine.SCOPE){
        		parent.formEngine.cloneFormData(ViewEngine.SCOPE, ViewEngine.SCOPE.formData);
        	}
        });
    }
    
});

//获取鼠标的x，y坐标
function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    var a = [];
    a["x"] = x;
    a["y"] = y;
    return a;
}


//GDSDZSWJ-6453 屏蔽backspace按钮的回退页面操作,common.js与viewEngine.js都引入这段代码
//Start Add By Huangweiping
$(document).ready(function() {
	//实现对字符码的截获，keypress中屏蔽了这些功能按键
	document.onkeypress = banBackSpace;
	//对功能按键的获取
	document.onkeydown = banBackSpace;
});
function banBackSpace(e) {
	var ev = e || window.event;
	//各种浏览器下获取事件对象
	var obj = ev.relatedTarget || ev.srcElement || ev.target
			|| ev.currentTarget;
	//按下Backspace键的keyCode为8
	if (ev.keyCode == 8) {
		var tagName = obj.nodeName //标签名称
		//如果标签不是input或者textarea则阻止Backspace
		if (tagName != 'INPUT' && tagName != 'TEXTAREA') {
			return stopIt(ev);
		}
		var tagType = obj.type.toUpperCase();//标签类型
		//input标签除了下面几种类型，全部阻止Backspace
		if (tagName == 'INPUT'
				&& (tagType != 'TEXT' && tagType != 'TEXTAREA' && tagType != 'PASSWORD')) {
			return stopIt(ev);
		}
		//input或者textarea输入框如果不可编辑则阻止Backspace
		if ((tagName == 'INPUT' || tagName == 'TEXTAREA')
				&& (obj.readOnly == true || obj.disabled == true)) {
			return stopIt(ev);
		}
	}
}
function stopIt(ev) {
    if ( ev.preventDefault ) {
        ev.preventDefault();
    } else {
        ev.returnValue = false;
    }
	return false;
}
//End

//生成伪uuid
function getUUID(){
    var uuid="";
    for(var i=0;i<8;i++){
        uuid+=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return uuid;
}

/*
* 关闭提示
*/
function _cloaseMsg(dom){
    dhtmlx.message.hide(dom._msgbox_title_);
    dom._msgbox_title_ = undefined;
    dom._msgbox_title_time_ = undefined;
    return true;
}

function isJmsb(){
    var jmsbId = parent.$("#jmsbId").val();
	if(jmsbId!=undefined && jmsbId!=null&&jmsbId!=""&&jmsbId!="null"){
		return true;
	}
	return false;
}