// var viewApp;
var setViewEngine;
var formData;
var setFormulaEngine;
var formulaCalculates;
var formCT = {}; //Code-tables
var flagDataLoaded = false;
var flagExecuteInitial = true;
var setFormulaEngine_inited = false;

//单元格背景色 C.Q 20170209 tipType_level : class
var LevelInfos = {
    'error_1'	: 	'yellow',
    'info_1'	: 	'fxsm_tisi',
    'default'	:	'defaultFxsmColor'
};

var tipTypes = {
    'error'	: 	'1',
    'info'	: 	'2'
};

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
function SetViewEngine(){
    /**
     * Constant. 常量定义.
     */
    SetViewEngine.prototype.VIEW_APP_NAME = "viewApp";
    SetViewEngine.prototype.VIEW_CTRL_ID = "viewCtrlId";
    SetViewEngine.prototype.SCOPE = '';
    this.viewApp; // 保存 angular.module(strViewApp, []);
    if (typeof SetViewEngine.prototype._inited == "undefined") {
        var setViewEngine = this;
        SetViewEngine.prototype.prepareEnvironment = function(viewApp, strViewApp){
            //引入外部指令
        		ngDirectives(document, viewApp);
                //定义Control
                viewApp.run(function($rootScope, $http, $location){});
                viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location,
                    asyncService){
                    //debugger;
                	var data = formData;
                    $scope.formData = data;
                    $scope.CT = parent.formCT;
                    
                    //各业务可能需要对scope进行处理，增加回调方法进行处理。
                    if(typeof scopeCallback == 'function'){
                    	$scope = scopeCallback($scope);
                    }
                    //angular事件调用外部JS方法
                    $scope.externalMethods = function(mathFlag,newData){
                    	return extMethods(mathFlag,newData,data,$scope);
                    }
                    
                    SetViewEngine.SCOPE = $scope;
                });
                viewApp.factory('asyncService', [ '$http', function($http){
                    /*
                     * var doRequest = function(url) { return $http({ method: 'POST',//'JSONP' url: url }); }; return {
                     * opts: function(url) { return doRequest(url);} };
                     */
                    return { verify : function(el){
                        return setViewEngine.tipsForVerify(el);
                    } };
                } ]);
                // 执行模块装载
                this.manuaANgInit(angular, strViewApp);
        	}
        SetViewEngine.prototype.initialize = function(strViewApp){
            if ("undefined" == typeof angular || "undefined" == typeof ngDirectives) {
                console.log("Waiting angular and directive...");
                setTimeout("setViewEngine.initialize('" + strViewApp + "')", 300);
            } else {
                if (!parent.flagDataLoaded) {
                    console.log("Waiting form data loading...");
                    setTimeout("setViewEngine.initialize('" + strViewApp + "')", 50);
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
        }
        /**
         * 手工加载angular 页面加载完成后,再加载模块 以确保angular加载时数据模型以及dom已经完整存在
         */
        SetViewEngine.prototype.manuaANgInit = function(angular, strViewApp){
            angular.bootstrap(document.body, [strViewApp]);
        }
        SetViewEngine.prototype.bindEventsForElements = function(scope, el){
            $(el).find("input").each(
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
                                    _jprefix + "[" + scope.$index + "]." + _nmLowerHalfPath);
                            } else {
                                $(this).attr("jpath", _jprefix + _nmLowerHalfPath);
                            }
                            if(_ngRepeatInit){
                            	 var zfbzjpath='scope.formData.'+_jprefix;
                                 var sjzfbzs=eval(zfbzjpath)[scope.$index].isDeleteTr;
                                 if(sjzfbzs==='Y'){
                                 	$(this).attr("disabled",true);
                                 }
                            }
                            //注册事件
                            $(this).on({ "click" : function(event){
                                 if($(this).attr('type') == "text"){
                                	if( this.value == 0 && !($(this).attr("readonly")) ){
                                		$(this).val("");
                                		$(this).focus();
                                	}
                                } else if($(this).attr('type') == "radio") {
                                    var _jpath = $(this).attr("jpath");
                                    // 1、尝试disable该单元格的结果公式
                                    // 2、执行关联公式计算
                                    if(setFormulaEngine){
                                        setFormulaEngine.apply(_jpath, this.value);
                                        // 3、刷新校验结果和控制结果
                                        //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                                        //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                        setViewEngine.tipsForVerify(document.body);//el
                                        // 4、刷新angular视图
                                        setViewEngine.formApply($('#viewCtrlId'));
                                    }
                                }else if($(this).attr('type') == "checkbox"){
                                	var _jpath = $(this).attr("jpath");
                                    // 1、尝试disable该单元格的结果公式
                                    // 2、执行关联公式计算
                                	if(setFormulaEngine){
                                        setFormulaEngine.apply(_jpath, this.value);
                                        // 3、刷新校验结果和控制结果
                                        //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
                                        //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
                                        setViewEngine.tipsForVerify(document.body);//el
                                        // 4、刷新angular视图
                                        setViewEngine.formApply($('#viewCtrlId'));
                                    }
                                }
                            }});
                            if(formulaCalculates && formulaCalculates.length>0){
	                            $(this).on({ "change" : function(event){
	                                if($(this).attr('type') == "radio") {return;}
	                                var _jpath = $(this).attr("jpath");
	                                // 2、执行关联公式计算
	                                setFormulaEngine.apply(_jpath, this.value);
	                                // 3、刷新校验结果和控制结果
	                                //modify by lizhengtao 20160616 发现光校验$scope 下的$element还不够，
	                                //比如下面单元格填写值涉及到上面单元格改变，此时需要连上面单元格一起校验
	                                setViewEngine.tipsForVerify(document.body);//el 
	                                // 4、刷新angular视图
	                                setViewEngine.formApply($('#viewCtrlId'));
	                            }, "mouseover" : function(event){
	                                if (this.title) {
	                                    if (this._msgbox_title_) {
	                                        var ti = new Date().getTime();
	                                        if (ti - this._msgbox_title_time_ > 500) {
	                                            parent.dhtmlx.message.hide(this._msgbox_title_);
	                                            this._msgbox_title_ = undefined;
	                                        } else {
	                                            return;
	                                        }
	                                    }
	                                    this._msgbox_title_ = parent.dhtmlx.message(this.title,  $(this).attr("tiptype"), -1);
	                                    this._msgbox_title_time_ = new Date().getTime();
	                                }
	                            }, "mouseout" : function(event){
	                                if (this._msgbox_title_) {
	                                	parent.dhtmlx.message.hide(this._msgbox_title_);
	                                    this._msgbox_title_ = undefined;
	                                    this._msgbox_title_time_ = undefined;
	                                }
	                            }
	                            });
	                            
	                            
                            }//end if formulaCalculates && formulaCalculates.length>0
                            
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
                                    _jprefix + "[" + scope.$index + "]." + _nmLowerHalfPath);
                            } else {
                                $(this).attr("jpath", _jprefix + _nmLowerHalfPath);
                            }
                            if(_ngRepeatInit){
                           	 var zfbzjpath='scope.formData.'+_jprefix;
                                var sjzfbzs=eval(zfbzjpath)[scope.$index].isDeleteTr;
                                if(sjzfbzs==='Y'){
                                	$(this).attr("disabled",true);
                                }
                           }
                            //注册事件
                            $(this).on({ "change" : function(event){
                                var _jpath = $(this).attr("jpath");
                                try{
    	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
    	                            delete parent.formEngine.idxVariable2NoPass[_jpath];
                                }catch(e){
                    			}
                    			if(setFormulaEngine){
                                    // 2、执行关联公式计算
                                    setFormulaEngine.apply(_jpath, this.value);
                                    // 3、刷新校验结果和控制结果
                                    setViewEngine.tipsForVerify(document.body);
                                    // 4、刷新angular视图
                                    setViewEngine.formApply($('#viewCtrlId'));
                                }
                            }, "mouseover" : function(event){
                                if (this.title) {
                                    if (this._msgbox_title_) {
                                        var ti = new Date().getTime();
                                        if (ti - this._msgbox_time_ > 500) {
                                        	parent.dhtmlx.message.hide(this._msgbox_title_);
                                            this._msgbox_title_ = undefined;
                                        } else {
                                            return;
                                        }
                                    }
                                    //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                    // M by C.Q 20170213 提示类型级别从自身元素获取
                                    this._msgbox_title_ = parent.dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
                                    this._msgbox_time_ = new Date().getTime(); 
                                }
                            }, "mouseout" : function(event){
                                if (this._msgbox_title_) {
                                	parent.dhtmlx.message.hide(this._msgbox_title_);
                                    this._msgbox_title_ = undefined;
                                    this._msgbox_time_ = undefined;
                                }
                            }
                          });
                            var _obj = null;
                        
                            if(typeof $(this).attr("target-select-query") !== 'undefined'){
                                _obj = $(this).siblings("div").children("ul");
                            }
                            
    	                    if(typeof $(this).attr("ng-select-query") != 'undefined'){
    	                    	if($(this).siblings("div").children("a") != 'undefined'){
    	                    		_obj = $(this).siblings("div").children("a");
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
                            		parent.dhtmlx.message.hide(this._msgbox_title_);
                             		this._msgbox_title_ = undefined;
                                    this._msgbox_title_time_ = undefined;
                            	}, "mouseover" : function(event){
                                        if (this.title) {
                                        	var msgDiv = $(_obj).parent()[0];
                                        	if($(".dhtmlx_message_area").length > 0 && $(".dhtmlx_message_area").children().length > 0) {
                                        		if($(".dhtmlx_message_area .hidden").length == 0 || ($(".dhtmlx_message_area .hidden").length > 0 && $(".dhtmlx_message_area").children().length > $(".dhtmlx_message_area .hidden").length))
            	                                	return;
                                        	} 
                                            if (this._msgbox_title_) {
                                                var ti = new Date().getTime();
                                                if (ti - this._msgbox_title_time_ > 500) {
                                                	parent.dhtmlx.message.hide(this._msgbox_title_);
                                                    this._msgbox_title_ = undefined;
                                                } else {
                                                    return;
                                                }
                                            }
                                            //this._msgbox_title_ = dhtmlx.message(this.title, "error", -1);
                                            // M by C.Q 20170213 提示类型级别从自身元素获取
                                            this._msgbox_title_ = parent.dhtmlx.message(this.title, $(this).attr("tiptype"), -1);
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
            	                                	parent.dhtmlx.message.hide(this._msgbox_title_);
            		                         		this._msgbox_title_ = undefined;
            		                                this._msgbox_title_time_ = undefined;
            	                                }
                                        	} else {
                                        		parent.dhtmlx.message.hide(this._msgbox_title_);
            	                         		this._msgbox_title_ = undefined;
            	                                this._msgbox_title_time_ = undefined;
                                        	}
                                        }

                                    }
                            	});
                            }	//end if _obj
                        }
                    });
            }
        /**
         * 检查校验不通过单元格，并提示
         * @param el
         */
        SetViewEngine.prototype.tipsForVerify = function(el){
        	if(!setFormulaEngine){
        		return;
        	}
        	var idxVariable2NoPass = setFormulaEngine.idxVariable2NoPass;
            var idxVariable2Control = setFormulaEngine.idxVariable2Control;
            var setViewEngine = this;
            $(el).find("input").each(function(i){
                if ($(this).attr("ng-model")) {
                    var _obj = $(this);
                    if(typeof $(this).attr("target-select-query") !== 'undefined'){
                        _obj = $(this).siblings("div").children("ul");
                    }
                    var _nm = $(this).attr("ng-model");
                    var _jpath = $(this).attr("jpath");
                    var _subscript = null;
                    if(_jpath.indexOf('[')>-1 && _jpath.indexOf(']')>_jpath.indexOf('[')){
                    	_subscript = _jpath.substring(_jpath.indexOf('[')+1,_jpath.indexOf(']'));
                    }
                    // Adding tips according to not passed verify. 
                    var var2NoPass = idxVariable2NoPass[_jpath];
                    if(_jpath.indexOf('[')>0&&_jpath.indexOf(']')>0){//如果是动态行节点，同取target为#和*的内容
                    	var _jpath_tmp_1 = _jpath.replace('['+_subscript+']','[#]');
                    	var _jpath_tmp_2 = _jpath.replace('['+_subscript+']','[*]');;
                    	var var2NoPasslocal_dynamic_1 = idxVariable2NoPass[_jpath_tmp_1];
                    	var var2NoPasslocal_dynamic_2 = idxVariable2NoPass[_jpath_tmp_2];
                    	if(var2NoPass || var2NoPasslocal_dynamic_1 || var2NoPasslocal_dynamic_2){
                    		var2NoPass = $.extend(true,{},var2NoPass,var2NoPasslocal_dynamic_1 ,var2NoPasslocal_dynamic_2 );
                    	}
                    }
                    var _tips = '';
                    var _tips_title = '';

                    // Added C.Q 20170209 先移除所有背景色样式
                    for(var key in LevelInfos) {
                        _obj.removeClass(LevelInfos[key]); // 移除样式
                        _obj.parent().removeClass(LevelInfos[key]);
                    }

                    if (undefined == var2NoPass) {
                        _obj.removeAttr('title');
                        _obj.removeClass("tiptype");
                        _obj.parent().removeClass("checkboxYellow");
                        _obj.parent().removeClass("relative");
                    } else {
                        var2NoPass = setViewEngine.filterByLevels(var2NoPass);
                        var key = 'info_1'; // 样式数组key
                        var tipType;
                        $.each(var2NoPass, function(id, FormulaObject){
                            _tips += FormulaObject.tips + '<br/>';
                            _tips_title += FormulaObject.tips + '\n';

                            tipType = FormulaObject.tipType;
                            key = FormulaObject.tipType + '_' + FormulaObject.level;
                        });
                        _tips_title = setFormulaEngine.textSubstitution(_tips_title,_subscript);
                        _obj.attr('title', _tips_title);
                        //layer.tips(_tips, _obj);
                        var classColor = LevelInfos[key];
                        _obj.addClass(classColor ? classColor : LevelInfos['default']); // 增加背景色
                        _obj.attr('tiptype', tipType); // 增加提示类型  error/info
                        _obj.parent().addClass("relative");
                        
                     // 校验不通过时，为多选框checkbox父节点span添加背景颜色
                        var inputType = _obj.attr("type");  
                        if(inputType=="checkbox"||inputType=="radio"){
                        	_obj.parent().addClass("checkboxYellow");
                            _obj.parent().addClass(classColor ? classColor : LevelInfos['default']);
                        }
                    }
                    // Update UI according to calculate result of control's rule.
                    var controls = idxVariable2Control[_jpath];
                    if (controls) {
                        setViewEngine.updateUIControl(this, controls);
                    }
                }
            });
            $(el).find("select").each(function(i){
                if ($(this).attr("ng-model")) {
                	var _obj = $(this);
                	  if(typeof $(this).attr("target-select-query") !== 'undefined'){
                          _obj = $(this).siblings("div").children("ul");
                      }
                      
                    if(typeof $(this).attr("ng-select-query") != 'undefined'){
                    	if($(this).siblings("div").children("a") != 'undefined'){
                    		_obj = $(this).siblings("div").children("a");
                    	}
                    }
                    var _nm = $(this).attr("ng-model");
                    var _jpath = $(this).attr("jpath");
                    // Adding tips according to not passed verify. 
                    var var2NoPass = idxVariable2NoPass[_jpath];
                    var _tips = '';
                    var _tips_title = '';
                    var tipType;
                    if (undefined == var2NoPass) {
                        _obj.removeAttr('title');
                        _obj.removeClass("yellow");
                        _obj.parent().removeClass("relative");
                    } else {
                        $.each(var2NoPass, function(id, FormulaObject){
                            _tips += FormulaObject.tips + '\n';
                            _tips_title += FormulaObject.tips + '\n';
                            tipType = FormulaObject.tipType
                        });
                        _tips_title = setFormulaEngine.textSubstitution(_tips_title);
                        _obj.attr('title', _tips_title);
                        //layer.tips(_tips, _obj);
                        _obj.attr("tiptype",tipType);
                        _obj.addClass("yellow");
                        _obj.parent().addClass("relative");
                    }
                    // Update UI according to calculate result of control's rule.
                    var controls = idxVariable2Control[_jpath];
                    if (controls) {
                        setViewEngine.updateUIControl(this, controls);
                    }
                }
            });
        }
        SetViewEngine.prototype.updateUIControl = function(domElem, controls){
        	var jqElem = $(domElem);
            for ( var ctl in controls) {
                var flag = controls[ctl];
                if (ctl === "readonly") {
                    if (flag) {
                        if (typeof domElem["$OLD_RW$"] == "undefined") {
                            domElem["$OLD_RW$"] = jqElem.attr("readonly") || false;
                        }
                        jqElem.attr("readonly", "readonly");
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
                        if (domElem["$OLD_RW$"]) {
                            jqElem.attr("readonly", "readonly");
                        }
                    }
                } else if(ctl === "disabled") {
                    if (flag) {
                        if (typeof domElem["$OLD_RW$"] == "undefined") {
                            domElem["$OLD_RW$"] = jqElem.attr("disabled") || false;
                        }
                        jqElem.attr("disabled", "disabled");
                    } else {
                        if (!domElem["$OLD_RW$"]) {
                            jqElem.removeAttr("disabled");
                        }
                    }
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
        SetViewEngine.prototype.formApply = function(_el, _attr, _datas){
            var scope = angular.element(_el).scope();
            if (null != _attr && null != _datas) {
                scope[_attr] = _datas;
            }
            scope.$apply();
        }
        /**
         * 动态刷新整个数据模型
         * @params _el 进行刷新的顶层元素 目前是指定的 $("#viewCtrlId")
         * @params _datas 进行刷新的顶层数据对象 目前指定为formData
         * @params formEngineObj 进行刷新的表单引擎对象，目前为全局变量 formEngine
         */
        SetViewEngine.prototype.dynamicFormApply = function(_el,_datas,formEngineObj){
        	var scope = angular.element(_el).scope();
        	scope.formData = _datas;
        	for(var i in scope){
        		if(i.indexOf("_jprefix_")==0){//scope[i]示例:"a.b.c"
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
        			var _CTinfoData = jsonPath(scope.formData, scope[i])[0];//码表信息对象
        			var _model = _CTinfoData.model;
        			var _dm = _CTinfoData.dm;
        			var _obj = jsonPath($scope.formData, _model)[0];//码表数据来源对象
        			var _name = i.replace("_info_","");
                    if(undefined != _dm && "" != _dm) {
                        var _jsons = {};
                        $.each(_data, function(k,v) {
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

        // C.Q 2017209 同一单元格中，过滤级别低提示
        SetViewEngine.prototype.filterByLevels = function(arr){
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

        // For not to do initialization twice.
        SetViewEngine._inited = true;
    }
}


/**
 * 回调方法执行前置判断，各业务类自己实现initCallback。
 * 当数据和视图加载完毕之后再进行回调。
 */
function executeInitCallback(){
	if(parent.flagDataLoaded && !setFormulaEngine_inited){
		setFormulaEngine_inited = true;
		formData = parent.formData;
		initFormulaEngine();
	}
	if(typeof initCallback == 'function'){
		if(parent.flagDataLoaded && SetViewEngine._inited){
			console.log("form data and viewEngine loaded.");
			initCallback();
		}else{
			console.log("Waiting form data and viewEngine loading...");
            setTimeout("executeInitCallback()", 500);
		}
    }else{
    	return;
    }
}

//初始化FormulaEngine
function initFormulaEngine(){
	var path = "";
	if(window.ctxPath){
		path = window.ctxPath;
	}
	$.getJSON(path+"rule.json").then(function(rules){
		if(rules && rules != '404'){
			formulaCalculates = rules;
			setFormulaEngine = new SetFormulaEngine();
		    //初始定制公式暂无公式
		    if(formulaCalculates){
		    	//formulaCalculates = JSON.parse(formulaCalculates);
			    if(formulaCalculates.length > 0){ 
			    	setFormulaEngine.loadFormulas(formulaCalculates);
			    	setFormulaEngine.initialize("formData");
				}
		    }
		    setViewEngine = new SetViewEngine();
		    setViewEngine.initialize('viewApp');
		}else{
	    	setViewEngine = new SetViewEngine();
		    setViewEngine.initialize('viewApp');
		}
	    },function(aa,bb,cc,dd){
	    	setViewEngine = new SetViewEngine();
		    setViewEngine.initialize('viewApp');
 	   	 	return;
        });
}
/**
 * repeatFinish指令处理函数
 */
function renderFinish(){}

$(function(){
	
	
    //IE、Mozilla浏览器下
    //新增动态行数据模型后，需要向父框架formData更新（“不能执行已释放的Script代码”，
    //由于子页面数据生命周期终结而父框架访问到已释放对象所致）
    if ( ($.browser.msie || $.browser.mozilla) && parent.cloneFormData ) {
        $(window).on('unload',function() {
            if(SetViewEngine.SCOPE){
                parent.cloneFormData(SetViewEngine.SCOPE, SetViewEngine.SCOPE.formData);
            }
        });
    }
    
    //初始化执行完成后回调方法，各自业务自己实现。
    executeInitCallback();
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