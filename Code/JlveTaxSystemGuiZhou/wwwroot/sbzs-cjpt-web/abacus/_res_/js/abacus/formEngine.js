/**
 * Created by Administrator on 2016-05-07.
 */
// 定义全局变量
var formData;
var otherParams;  //用于存储其他参数的数组
var formCT = {}; //Code-tables
var flagDataLoaded = false;
var flagExecuteInitial = true;//execute initialize formula flag
var formulaEngine;
var formulaEngineJb; //减少附表前对应的初始化报文
var formulaCalculates;
var formEngine;
var fxsmInitData;
var tbsmUrl;
// 限流标志：上传浏览器编译好的公式到服务器缓存时使用
var xlBz;
var htAll;
var isNgFinish = false;
// 低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = { log : function(){} };
}
var formulaExecType = ''; //1=实时监控，初始化报文中返回otherData；0=事中监控，初始化报文中不返回otherData；2或其他=非实时非事中监控，初始化报文中不返回otherData
var info2tip;//提交表单时提醒类是否需要提示：1=提示；0=不提示
var showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'}; // 默认公式提示显示右上角，风险扫描提示显示至填表说明栏
var serverTime;   //获取时间

//业务中台自动化测试标志
var flagYwztAutoTest = false;

/**
 * 表单引擎，负责管理整个表单框架的表单列表管理、数据访问管理、规则库管理等。
 */
function FormEngine(){

	var _start_ = new Date().getTime();
	FormEngine.prototype._start_ = _start_;
	console.log("INFO:"+_start_ + " 进入链接时间");
    /**
     * Constant. 常量定义.
     */
	FormEngine.prototype.URL_GET_SHEET_LIST = "xSheets";
    FormEngine.prototype.URL_GET_RULE_BASE = "xFormula";
    FormEngine.prototype.URL_GET_FORM_DATA = "xInitData";
    FormEngine.prototype.URL_GET_YS_DATA = "getYsData";
    FormEngine.prototype.URL_GET_HT_All = contextPath + "/ht/getHtAll.do";

    /**
     * All CSS for sheet. 表单所需要的样式表.
     * select2样式需放table前面，解决csgj选择框选择后文字过长显示问题CSGJ-1093 CSGJ-1071
     */
    FormEngine.prototype.viewCss = [ 
        "/abacus/resources4/tax-module/selectPage/selectpage.css",
	    "/abacus/resources4/tax-module/select2/select2.css",
	    "/abacus/_res_/css/message/message_solid.css",
	    "/abacus/resources4/tax-module/taxReturns/table.css",
        "/abacus/resources4/layui/css/layui.css",
	    "/resources/css/zTreeStyle/zTreeStyle.css",
        "/abacus/resources4/tax-css/ttk_blue.css"];
    
    /**
     * All JS for signBtn. 签名按钮所需的js文件.
     */
    FormEngine.prototype.wztsignJs = [ 
        "/abacus/resources/js/sign/wangzhengtong/cert.js",     
        "/abacus/resources/js/sign/wangzhengtong/commVar.js",   
        "/abacus/resources/js/sign/wangzhengtong/NetcaPKI.js",
        "/abacus/_res_/js/abacus/wztsign.js"];
    
    FormEngine.prototype.ocxsignJs = [ 
        "/resources/js/jquery.base64.js",
        "/abacus/_res_/js/abacus/zjsign.js"];
    
    FormEngine.prototype.fjocxsignJs = [ 
		"/abacus/_res_/js/abacus/fjzjsign.js"];
    
    FormEngine.prototype.bwsignJs = [ 
		"/abacus/_res_/js/abacus/bwsign.js",
		"/abacus/resources/js/sign/bw/bwsignapi.js"];//ca驱动供应商提供的js签章api
    
    FormEngine.prototype.yunnansignJs = [
        "/resources/js/jquery.base64.js",
         "/abacus/_res_/js/abacus/ynsign.js",
         "/resources/js/sign/yunnan/YNCAWebClient.js"];

    //配置特殊的删附表与ht表单节点的对应规则，一般规则直接查ysqFormRuleVo.dzbd下的dzbdbm和bdsxmc即可
    FormEngine.prototype.fbgz = {
        //业务编码
        "YBNSRZZS":
            {
                //电子表单编码
                "BDA0610566": [
                    //要删除的数据节点，不选也要传附表的情况；如：一般人的附表四，不选也传节点，因此给空数组
                    ],
                "BDA0610758": [
                    //要删除的数据节点，删除附表下所有子节点情况；如：一般人的减免表，需要删除附表节点下的所有节点，只保留空的附表节点
                    "ht_.zzsybsbSbbdxxVO.zzsjmssbmxb.*"
                    ],
                "BDA0610669": [
                    //要删除的数据节点，删除附表下部分子节点，保留部分子节点情况；如：一般人的汇总纳税企业增值税分配表，需要删除需要删除附表下的Grid节点，但是需要保留Form节点
                    "ht_.zzsybsbSbbdxxVO.zzssyyybnsr_hznsqyzzsfpb.hznsqyzzsfpbGrid"
                ]
            },
        "CWBB_XQY_KJZZ":
            {
                "CWBB_XQY_KJZZ_lrb_jb,CWBB_XQY_KJZZ_lrb_yb": [
                    //多个附表共用一个附表节点的情况；如：小企业的利润表的季报和月报共用一个附表节点，两个附表都没有选才需要删除附表节点
                    "ht_.SB100VO.SB100BdxxVO.cjbdxml.syxqylrb"
                ],
                "CWBB_XQY_KJZZ_xjllb_jb,CWBB_XQY_KJZZ_xjllb_yb": ["ht_.SB100VO.SB100BdxxVO.cjbdxml.syxqyxjllb"]
            }
    };

    this.lstSheets = [];

    // Declare function
    if (typeof FormEngine._inited === "undefined") {

        /**
         * PUBLIC: FormEngine initialization, should be called after create. PUBLIC: 表单引擎初始化，应在对象创建后即进行调用.
         * PUBLIC: FormEngine initialization, should be called after create.
		 * PUBLIC: 表单引擎初始化，应在对象创建后即进行调用.
         */
        FormEngine.prototype.initialize = function() {
            var _this = this;
            if (true === flagFormDebuging) {
                dhtmlx.message("表单引擎启动...", "info", 2000);
            }
            window.parent.layer.load(2, {shade: 0.3});
            if (navigator.userAgent.indexOf("Firefox") >= 0) {
                //bugid:CLOUDTAX-1189
                //火狐浏览器偶尔会出现在没注册事件IFrame事件之前附表表单会先渲染完导致页面没有样式，所以火狐浏览器优先注册IFrame事件
                // 3、注册IFrame事件，监听并动态注入JS脚本文件。
                _this.listenFrameSheet();
            }
            //1.装载左侧表单数据列表
            _this.loadSheetList(this.URL_GET_SHEET_LIST, jsonParams);

            // 2、加载初始化数据和公式，并启动执行公式引擎
            // getJSON 参数相同时不会请求后台数据，增加随机参数
            jsonParams['_random'] = Math.random();
            jsonParams['_bizReq_path_'] = $("#_bizReq_path_").val();
            var async = _this.load4YwztBz();
            if (!async) {
                jsonParams['dzbdbmList'] = $("#dzbdbmList").val();
            }
            var guideParam = _this.escapeGuideParam().replace(/\"/g, '').replace(/,/g, ';').replace(/:/g, '-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录
            jsonParams['_guideParam'] = guideParam
            _this.loadInitDataAndFormulas(jsonParams);

            //如果wbcsh已经赋值，则不再请求要素数据，否则会覆盖原有wbcsh的值
            var wbcsh = $("#wbcsh").val();
            if (!(typeof wbcsh !== 'undefined' && wbcsh !== null
                && wbcsh !== "null" && wbcsh !== "")) {
                // 查看得情况即lookBack=Y，不取要素数据，静默申报不取要素数据
                if(!(typeof lookBack === "string" && lookBack ==="Y") || !this.isJmsb()) {
                    // 要素申报, 获取wbcsh数据
                    _this.getYsData();
                }
            }

            if (navigator.userAgent.indexOf("Firefox") < 0) {
                // 3、注册IFrame事件，监听并动态注入JS脚本文件。
                _this.listenFrameSheet();
            }

		};

        /**
         * 加载初始化数据和公式，并启动执行公式引擎。（异步加载，加载initData和formulas没有依赖关系）
         */
        FormEngine.prototype.loadInitDataAndFormulas = function(jsonParams){
            var _this = this;
            var isQysds_a_17nd =( $("#ywbm").val()==='qysds_a_17nd' ||$("#ywbm").val()==='qysds_a_18nd' )&& navigator.appName === "Microsoft Internet Explorer"
                && (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE8.0"
                    ||  navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE7.0");
            var getRulesMethod = {}, getDatasMethod = {};
            // 解决使用getJSON获取公式时IE8报"脚本运行停止"，改用ajax的text方式获取 A by C.Q 20180327
            var formulaData = _this.keepRequiredParams(jsonParams);
            if(isQysds_a_17nd){
                $.ajax({
                    type : "GET",
                    async: false,
                    url : this.URL_GET_RULE_BASE,
                    data: formulaData,
                    dataType : "text",
                    success: function(data) {
                        formulaCalculates = eval('(' + data + ')');
                    },
                    complete: function(xhr){
                        xlBz = xhr.getResponseHeader('xlBz');
                    }
                });

            } else {
                getRulesMethod = $.getJSON(this.URL_GET_RULE_BASE, formulaData);
            }

            //解决房产税初始化报文过大的问题
            if($("#ywbm").val() === 'fcssb'){
                $.ajax({
                    type : "GET",
                    async: false,
                    url : this.URL_GET_FORM_DATA,
                    data: jsonParams,
                    dataType : "text",
                    success: function(data) {
                        formData = eval('(' + data + ')');
                    }
                });

            } else {
                getDatasMethod = $.getJSON(this.URL_GET_FORM_DATA, jsonParams);
            }


            var _start_ = new Date().getTime();
            $.when(getDatasMethod, getRulesMethod).then(function(datas, rules) {
                if ($("#ywbm").val() !== 'fcssb') {
                    formData = datas[0];
                }
                var _end_ = new Date().getTime();
                console.log("INFO:" + _start_ + "-" + _end_ + "-" + (_end_ - _start_) + "ms 公式 xFormula、xInitData");
                // 获取时间
                serverTime = formData['serverTime'];
                // 2018-07-03 将formData=formData.body会使ysqxxid丢失，保存到此变量
                var formData_ysqxxid = null;
                if (formData && formData.otherParams) {
                    otherParams = formData.otherParams;
                    if ("string" === typeof otherParams) {
                        otherParams = jQuery.parseJSON(otherParams);
                    }
                    //判断signType的值，判断是否加载签章的js到主页面
                    var signType = '';
                    if (typeof otherParams !== 'undefined' && otherParams !== "" && otherParams != null) {
                        if (typeof otherParams.signType !== 'undefined') {
                            signType = otherParams.signType;
                        }
                        if (signType === 'wzt') {//容器框签名
                            for (var i = 0; i < formEngine.wztsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.wztsignJs[i]);
                            }
                        } else if (signType === 'ocx') {//ocx插件签名
                            for (var i = 0; i < formEngine.ocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.ocxsignJs[i]);
                            }
                        } else if (signType === 'fjocx') {
                            for (var i = 0; i < formEngine.fjocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.fjocxsignJs[i]);
                            }
                        } else if (signType === 'bw') {
                            for (var i = 0; i < formEngine.bwsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.bwsignJs[i]);
                            }
                        } else if (signType === 'yunnan') {
                            for (var i = 0; i < formEngine.yunnansignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.yunnansignJs[i]);
                            }
                        }
                    }

                    //异步提交标志
                    var asyncSubmit = "";
                    if (typeof otherParams.asyncSubmit !== 'undefined') {
                        asyncSubmit = otherParams.asyncSubmit;
                    }
                    if (asyncSubmit == 'Y') {
                        $("#myform").append("<input type=\"hidden\" id=\"asyncSubmit\" name=\"asyncSubmit\" value=\"" + asyncSubmit + "\"/>");
                    }
                }

                if ("undefined" !== typeof formData.returnFlag && "N" === formData.returnFlag) {

                    //附税免申报弹窗提示
                    if (formData.warnInfo.code === "msb") {
                        if ("undefined" !== typeof formData.body && "undefined" !== typeof formData.flagExecuteInitial && formData.flagExecuteInitial === true) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                            //设置依申请信息ID
                            $("#ysqxxid").val(formData.ysqxxid);
                            $("#showTipsType").val(formData.showTipsType);  // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                            try {
                                if (typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== '') {
                                    showTipsType = eval('(' + formData.showTipsType + ')');
                                }
                            } catch (e) {
                                showTipsType = {'gs_error': '1', 'gs_info': '1', 'fxsm_error': '2', 'fxsm_info': '2'};
                            }
                            formulaExecType = formData.formulaExecType;
                            $("#formulaExecType").val(formulaExecType);
                            info2tip = formData.info2tip;
                            $("#info2tip").val(info2tip);
                            formData_ysqxxid = formData.ysqxxid;
                            formData = formData.body;
                            if ("string" === typeof formData) {
                                formData = jQuery.parseJSON(formData);
                            }
                            if (!isQysds_a_17nd) {
                                formulaCalculates = rules[0];
                                // 设置限流标志
                                xlBz = rules[2].getResponseHeader('xlBz');
                            }
                            var _ms_ = new Date().getTime() - _start_;
                            if (true === flagFormDebuging) {
                                dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                            }
                            //拿到ysqxxid，此时才能与附列资料集成
                            (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                            (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                            window.parent.layer.closeAll('loading');
                            layer.confirm(datas[0].warnInfo.msg, {icon: 0, title: '提示'}, '', function (index) {
                                _this.closeWindow();
                            });
                        } else {
                            window.parent.layer.closeAll('loading');
                            layer.confirm(datas[0].warnInfo.msg, {icon: 0, title: '提示'}, '', function (index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    } else {
                        if (typeof(formData.warnInfo) !== "undefined" && formData.warnInfo.msg !== "" && formData.warnInfo.msg != null) {
                            //流程阻断提示
                            window.parent.layer.load(2, {shade: 0.3});
                            window.parent.layer.alert(formData.warnInfo.msg, {icon: 0, title: '提示'}, function (index) {
                                _this.closeWindow();
                            });
                            return;
                        }
                    }
                } else {
                    if ((!_this.isJmsb())&&typeof(formData.warnInfo) !== "undefined" &&
                        typeof(formData.warnInfo.msg) !== "undefined" && formData.warnInfo.msg !== ""
                        && formData.warnInfo.msg != null) {
                        //提醒类提示
                        var index = window.parent.layer.load(2, {shade: 0.3});
                        window.parent.layer.alert(formData.warnInfo.msg);
                        window.parent.layer.close(index);
                    }
                    if ("undefined" !== typeof formData.body) {
                        if ("undefined" !== typeof formData.flagExecuteInitial) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                        }

                        //设置依申请信息ID
                        $("#ysqxxid").val(formData.ysqxxid);
                        formEngine.replaceYsqxxid(formData.ysqxxid); // 若queryString中ysqxxid与此不同，则替换成此
                        $("#showTipsType").val(formData.showTipsType); // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                        try {
                            if (typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== '') {
                                showTipsType = eval('(' + formData.showTipsType + ')');
                            }
                        } catch (e) {
                            showTipsType = {'gs_error': '1', 'gs_info': '1', 'fxsm_error': '2', 'fxsm_info': '2'};
                        }
                        formulaExecType = formData.formulaExecType;
                        $("#formulaExecType").val(formulaExecType);
                        info2tip = formData.info2tip;
                        $("#info2tip").val(info2tip);
                        formData_ysqxxid = formData.ysqxxid;
                        formData = formData.body;
                        //拿到ysqxxid，此时才能与附列资料集成
                    }
                    if ("string" === typeof formData) {
                        formData = jQuery.parseJSON(formData);
                    }
                    if(formData.wbcshInit){
                        var _wbcsh_in_formData = formData.wbcshInit;
                        var _wbcsh_in_dom = $("#wbcsh").val();
                        if(_wbcsh_in_dom == "" || _wbcsh_in_dom == "null"){

                        } else {
                            /* 合并初始化数据 */
                            _wbcsh_in_dom = JSON.parse(Base64.decode(_wbcsh_in_dom));
                            _wbcsh_in_formData = $.extend(true,_wbcsh_in_formData,_wbcsh_in_dom);

                        }
                        $("#wbcsh").val(Base64.encode(JSON.stringify(_wbcsh_in_formData)));
                        delete formData.wbcshInit;
                    }
                    //SXGS12366-58 优化需求，动态行操作列，税务人员端显示纳税人的操作类型（0：无操作，1：新增，2：修改，3：删除）。
                    var _bizReq_path_ = $("#_bizReq_path_").val();
                    if (_bizReq_path_ && _bizReq_path_.split('/')[0] === 'sxsq') {//事项申请才copy动态节点内容，用于提交表单数据前做比对，确定纳税人的操作类型。
                        var dtFlag;
                        try {
                            dtFlag = formData.taxML.initData.hasOwnProperty('dynamicInitData')//判断是否存在动态行节点
                        } catch (e) {

                        }
                        if (dtFlag) {
                            var dynamicNodes = formData.taxML.initData.dynamicInitData['dynamicNodes'];
                            var useZcbwFlag = typeof otherParams !== 'undefined' ? otherParams['useZcbwFlag'] : undefined;
                            if (dynamicNodes && useZcbwFlag !== 'Y') {//已暂存状态不再作处理
                                var dynamicNodeArray = dynamicNodes.split(',');
                                for (var i = 0; i < dynamicNodeArray.length; i++) {
                                    var _keyword = dynamicNodeArray[i];
                                    var flag = formData.taxML.initData.dynamicInitData.hasOwnProperty('DT_' + _keyword);//判断是否存在节点
                                    if (!flag) {
                                        var strPath = jsonPath(formData, '$..' + _keyword, {resultType: "PATH"})[0].replace(/\[\'/g, ".").replace(/\'\]/g, "").replace('$', 'formData');
                                        var _keywords = eval(strPath);//当前动态行的数据
                                        //变换下数据类型，避免备份出来的初始化数据也和表单数据模型一一绑定。
                                        var _keywordsStr = JSON.stringify(_keywords);
                                        var obj = jQuery.parseJSON(_keywordsStr);

                                        formData.taxML.initData.dynamicInitData['DT_' + _keyword] = obj;//赋值
                                    }
                                }
                            }
                        }
                    }

                    (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                    (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                }
                if (!isQysds_a_17nd) {
                    formulaCalculates = rules[0];
                    // 设置限流标志
                    xlBz = rules[2].getResponseHeader('xlBz');
                }
                _ms_ = new Date().getTime() - _start_;
                if (true === flagFormDebuging) {
                    dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                }

                //中台业务才处理ht_报文
                //TODO htAll请求目前财报已经联调通过，其他业务待联调，故只有财报业务才发起htAll请求
                var ywlx = "/"+location.pathname.split('/')[3];
                if (_this.getYwztBz() && ywlx === "/cb") {
                    //获取核心提交报文，过滤附表
                    _this.filterHtAll(jsonParams);
                    htAll = null;
                }
                
                //进入申报表后，有formData对象后需要执行的方法
                if( typeof beforeHtmlLoadAction === "function"){
                	beforeHtmlLoadAction(formData);
                }
                
            },function(aa){
            	//申报查看功能，去除所有的错误提示
            	if(typeof lookBack != 'undefined' && "Y" == lookBack){
            		return;
            	}
            	
                if( typeof commonError500Callback === "function"){
                    if(commonError500Callback(window.parent.layer,aa)){
                        return;
                    }
                }
                var closeFlag = false;
                if (aa.responseText.indexOf("closeFlag") !== -1) {
                    closeFlag = true;
                }
                window.parent.layer.open({
                    type:1,
                    area:['840px','420px'],
                    content:aa.responseText,
                    cancel: function(){
                        if (closeFlag) {
                            if (navigator.userAgent.indexOf("Firefox") > 0) {
                                // Firefox浏览器
                                window.parent.location.href = 'about:blank';
                                window.parent.close();
                            } else if (navigator.userAgent.indexOf("Chrome") > 0) {
                                // 谷歌浏览器
                                window.parent.location.href = 'about:blank';
                                window.parent.close();
                            } else {
                                // IE浏览器、360浏览器
                                window.parent.open('', '_top');
                                window.top.close();
                            }
                        }
                    }
                });
                return;
            }).then(function(){
                var _start_formula_ = new Date().getTime();
                // Init formula engine.
                formulaEngine = new FormulaEngine();

                //初始定制公式暂无公式
                if(formulaCalculates){
                    if(formulaCalculates.length > 0){
                        //对公式引擎执行的异常进行捕获
                        try {
                            formulaEngine.loadFormulas(formulaCalculates);
                            formulaEngine.initialize("formData");

                            if(otherParams && otherParams.jsfb ){
                                formulaEngineJb = new FormulaEngine();
                                formulaEngineJb.loadFormulas(formulaCalculates);
                                otherParams.formDataJb = jQuery.parseJSON(otherParams.formDataJb);
                                formulaEngineJb.initialize4Jb("otherParams.formDataJb");
                            }
                        } catch (e) {
                            // 公式执行报错的flag，提供给静默申报使用
                            flagExcuted = false;
                            flagExcutedError = "" + e;
                            throw "" + flagExcutedError;
                    	}
                    }

                    var _ms_ = new Date().getTime() - _start_formula_;
                    if(true === flagFormDebuging) {
                        dhtmlx.message("公式引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                    }
                }

                try{
                    if('true' === $("#fxsm").val()) {
                        fxsmInitData.loadThirdIV2NoPass(); // 加载风险扫描提示  A by C.Q 20170213
                    }
                }catch(e){
                    console.log(e);
                }
            }).done(function(){
                flagDataLoaded = true;
                var _ms_ = new Date().getTime() - _start_;
                if(true === flagFormDebuging) {
                    dhtmlx.message("表单引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                }
                window.parent.layer.closeAll("loading");
            });
        };

        /**
         * 监听表单装载成功的事件，即IFrame的#frmSheet的onLoad()事件，然后动态注入所需资源. 依赖[IFRAME id="frmSheet" name="frmSheet"]
         */
        FormEngine.prototype.listenFrameSheet = function(){
            $("#frmSheet").load(function(event){
            	//TODO 如果加载的页面为空（偶尔会出现加载不到内容的情况,此处为补偿措施），则重新加载
            	var frame = document.getElementById("frmSheet");
                var domDocument = frame.contentWindow.document.body;
                var $dom = $(domDocument);
                // 蒙层
                var html = "<div id=\"maskFrmSheet\" style=\"position: absolute; width: 100%; height: 100%; top: 0px; background-color: #EEEEEE; z-index: 999; opacity: 0.75;overflow: hidden; \"></div>"
                    + "<div id=\"marqueeFrmSheet\" style=\"position: absolute; width: 100%; height: 100%; top: 45%; color: black; z-index: 9999; opacity: 1; overflow: hidden; text-align: center;font-family: '宋体'; font-size: 16px;\"><b>正在加载表单...</b></div></td>";
                $dom.append(html);
                $dom.css({ "overflow" : "hidden" });
                // 动态注入<script>和<link>
                var useLoad=$("#frmSheet").attr("useLoad");
                if (formEngine&&useLoad!=="N") {
                    var delay = 50;
                    // 注入CSS，也即<link>标签
                    for (var i = 0; i < formEngine.viewCss.length; i++) {
                        formEngine.loadCss4Sheet(formEngine.viewCss[i]);
                    }
                    formEngine.loadScript4Sheet("/abacus/_res_/js/abacus/viewInit.js");
                } else {
                    console.log("Object formEngine not ready.");
                }
            });
        };
        
        FormEngine.prototype.appendToHead = function(domDocument, elem){
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
        FormEngine.prototype.loadCss4Sheet = function(urlViewCss){
        	var _start_ = new Date().getTime();
            var frame = document.getElementById("frmSheet");
            var domDocument = frame.contentWindow.document;
            var oCss = document.createElement("link");
            oCss.type = "text/css";
            oCss.rel = "stylesheet";
            oCss.href = pathRoot + urlViewCss;
            this.appendToHead(domDocument, oCss);
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewCss);
        };
        /**
         * 装载表单所需要的脚本文件.
         * @param urlViewScript 脚本文件的URL
         */
        FormEngine.prototype.loadScript4Sheet = function(urlViewScript){
        	var _start_ = new Date().getTime();

        	var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = pathRoot + urlViewScript;
            var frame = document.getElementById("frmSheet");
            
            if(frame!=null && frame.contentWindow!=null){
            	var domDocument = frame.contentWindow.document;
                this.appendToHead(domDocument, oScript);
            }
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewScript);
        };
        
        
        FormEngine.prototype.loadScript4head = function(urlViewScript){
        	var _start_ = new Date().getTime();
        	var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = pathRoot + urlViewScript;
            var oHead = document.getElementsByTagName("head").item(0);

            if(oHead!=null){
            	oHead.appendChild(oScript);
            }
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewScript);
        };
        /**
         * 装载表单列表信息.
         */
        FormEngine.prototype.loadSheetList = function(urlFormList, jsonParams){
            var _this = this;
            var _start_ = new Date().getTime();

            var formEngine = this;
            jsonParams['_random'] = Math.random();
            var async = _this.load4YwztBz();
            $.ajax({
        		url : urlFormList,
        		dataType : "json",
        		async: async,
        		data : jsonParams,
                success : function(data, status, xhr){
                    var _end_ = new Date().getTime();
                    console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms xSheets");

                    if (status === "success") {
            			if(data.length===1){
            				var $menu = $(".MenuNormal .SheetMenu");
            		        var menuWidth = $menu.width();
                            $menu.fadeOut();
            	            $(".MenuNormal .close_btn span").text(">");
            	            var rightEditW = $(window).width() - $(".TableMain").width();
            	            $(".DEV .RightEdit").width(rightEditW - 4);
            	            closebtn++;
            			}
                        _this.lstSheets = data;
                        _this.showSheetList();


                        if(true === flagFormDebuging) {
                            dhtmlx.message("主附表清单加载完毕, " + _ms_ + "ms", "info", 2000);
                        }
                        //设置dzbdbmLists
                        var dzbdbms="";
                        for(var i=0; i<data.length;i++){
                			dzbdbms += data[i].dzbdbm + "---";
                        }
                        $("#dzbdbmList").val(dzbdbms);
                        
                        formEngine.bindEvents4vSheetlist(); // 附表加载完成后增加click事件 A by C.Q 20170210
                    } else {
                        if(true === flagFormDebuging) {
                            dhtmlx.message("主附表清单加载失败.", "error", 5000);
                        }
                        console.log("FormlistLoader: Error while loading: " + xhr.status + ": "
                            + xhr.statusText);
                    }
                    if (formEngine.lstSheets.length > 0) {
                        var jqFrmSheet = $("#frmSheet");
                        if (jqFrmSheet.length) {
                        	if('true' === $("#fxsm").val()) {
                        		 var divSheetlist = $("#divSheetlist");
                        		 var toFbid = $("#fbid").val();
                        		 var sheetName; 
                        		 if (toFbid != null && toFbid !== '') {
                        			 for(var index in formEngine.lstSheets){
                            			 sheetName = formEngine.lstSheets[index].name;
                            			 if(sheetName != null && sheetName !== '' && sheetName.substr(0,toFbid.length) === toFbid) {
                             				jqFrmSheet.attr("src", formEngine.lstSheets[index].url);
                                      		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                                      		formEngine.getTbsmData(formEngine.lstSheets[index].url);
                                      		divSheetlist.find("li:not(.active)").first().removeClass("current_selected_BD");
                                      		divSheetlist.find("li:eq("+index+")").addClass("current_selected_BD");
                                      		break;
                             			 }
                            		 }
                        		 }
                        		 
                        		 if(!jqFrmSheet.attr("src")) {
                        			 jqFrmSheet.attr("src", formEngine.lstSheets[0].url);
                             		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                             		formEngine.getTbsmData(formEngine.lstSheets[0].url);
                        		 }
                        	} else {
    							if(typeof automaticloadingSheet === "function"){
    								automaticloadingSheet(formEngine.lstSheets);
    							}else{
    								jqFrmSheet.attr("src", formEngine.lstSheets[0].url);
    							}
                        		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                        		formEngine.getTbsmData(formEngine.lstSheets[0].url);
                        	}
                        }  
                    }    
                },
            	error :function(xhr, msg, err) {
                    var status = (xhr.status === "200") ? msg : xhr.status;
                    console.log("Loading sheet list fail with [" + status + "]\n----"
                        + xhr.responseText);
                    if(true === flagFormDebuging) {
                        dhtmlx.message("加载表清单失败 [" + status + "] " + err, "error", 5000);
                    }
            	}
        	});
            
        };
        /**
         *  判断url中的ywzt是否为Y
         */
        FormEngine.prototype.load4YwztBz = function(){
	        //获取ywzt信息，如果为Y，则设置为同步执行
	        var querystr = "{"+$("#_query_string_").val()+"}";
	        var async = true;
	        if(typeof querystr !== 'undefined' && querystr !=="" && querystr !=null){
	        	 var obj = JSON.parse(querystr);
	             if("Y"===obj.ywzt){
                     async = false;

                     if("true"===obj.test){
                         //url 中同时含有test=true和ywzt=Y 即为业务中台自动化测试
                         flagYwztAutoTest = true;
                     }
	             }
	        }  
	        return async;
        };

        FormEngine.prototype.isJmsb = function() {
        	var href = window.location.href;
        	var pahref = parent.window.location.href;
        	if (href.indexOf("jmsbId") > -1 || pahref.indexOf("jmsbId") > -1) {
               return true;
            }
        	return false;
        }


        /**
         * 主附表下的a标签赋予点击事件，点击时从服务器获取填表说明数据 A by C.Q 20170210
         */
        FormEngine.prototype.bindEvents4vSheetlist = function(){
            var _this = this;

            var $frmSheet = $("#frmSheet");

            var $divSheetlist = $("#divSheetlist");
        	if ($divSheetlist.length) {
                $divSheetlist.find("a").each(function(){
    	            //注册事件
    	            $(this).on({ "click" : function(){
    	            	//修改src属性
                        $frmSheet.attr("src", $(this).attr("href"));
                        // 2019-02-22调用业务编码.js的个性化按钮方法    huangweiping@foresee.com.cn
                        if (typeof ywControlBtn === "function") {
                        	ywControlBtn($(this).attr("dzbdbm"));
                        }
    	            	// 获取填表说明数据
                        _this.getTbsmData($(this).attr("href"));
    	            } });
        		});
        	}

            var $uiStepSheetlist = $("#uiStepSheetlist");
        	if ($uiStepSheetlist.length) {
        		var uiStepSheet=$($uiStepSheetlist.find(".ui-step-item-num")[0]);
        		uiStepSheet.on({ "click" : function(){
	            	//修改src属性
					parent.closeWin();

                    $frmSheet.attr("src", $(this).attr("url"));
                    $frmSheet.attr("xh", $(this).attr("xh"));
	            } });
        	}
    		
        };
        /**
         * 替换querystring中的ysqxxid为最新的 A by C.Q 20170929
         */
        FormEngine.prototype.replaceYsqxxid = function(ysqxxid){
    		var querystr = $("#_query_string_").val();
    		if (querystr=== '' || querystr==null) {
    			return;
    		}
    		// 判断qs中是否有ysqxxid
    		var regexYsq = /ysqxxid\":\"[0-9a-zA-Z]{32}/g;
    		var isHasSameYsq = false; // querystr中ysqxxid与传入是否有相同
    		var isReplace = false; // 是否需要替换,不同则替换
    		var oldysqid;
    		
    		var resultNode;
    		do
			{
				resultNode = regexYsq.exec(querystr);
				if(resultNode != null) {
					if(resultNode[0] === ('ysqxxid\":\"'+ysqxxid)) {
						isHasSameYsq = true;
						isReplace = false;
						break;
					} 
					if(!isHasSameYsq){
						isReplace = true;
						oldysqid = resultNode[0];
					}
				}
			} while (resultNode!=null) ;
    		
    		if(!isHasSameYsq && isReplace) {
    			querystr = querystr.replace(oldysqid,'ysqxxid\":\"'+ysqxxid);
    			$("#_query_string_").val(querystr);
    		}
    		 
        };
        
        /**
         * 获取填表说明数据 A by C.Q 20170210
         */
        FormEngine.prototype.getTbsmData = function(url){
        	// 先清空填表说明内容
        	if (typeof formDebuging === "undefined" || typeof formData === "undefined") {
        		tbsmUrl = url;
        		setTimeout(function() {
        			formEngine.getTbsmData(tbsmUrl);
        		}, 100);
        	} else {
	        	formDebuging.TBSM_JSON = {};
	        	formDebuging.setShowTbsmValues('','','');
                //配置了显示填表说明栏才请求填表说明
                if(typeof otherParams !== 'undefined' && otherParams["isShowTbsm"] ==="Y"){
                    // 由_bizReq_path_和当前页面文件名组成urlkey作为保存至mongodb的模块唯一键
                    // 例：当前请求连接为http://localhost:8080/sbzs-cjpt-web/biz/sbzs/xgmzzs/form/xgmzzs_BDA0610535.html，取到sbzs/xgmzzs/form/xgmzzs_BDA0610535.html作为urlkey存入数据库
                    var urlkey = formEngine.getUrlkey(url); // 保存至数据库作为此模块唯一key
                    var _start_ = new Date().getTime();

                    var urlExtractTbsm = formDebuging.URL_EXTRACT_TBSM + "?gdslxDm=" + jsonParams["gdslxDm"] + "&urlkey="+urlkey;
                    $.ajax({
                        type : "POST",
                        url : urlExtractTbsm,
                        dataType : "json",
                        success : function(data) {
                            formDebuging.TBSM_JSON = eval('('+data+')');

                            var _end_ = new Date().getTime();
                            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 填表说明请求");
                        }
                    });
                }
        	}
        };
        /**
         * 根据当前请求url + lstSheets的url来获取urlkey，作为当前页面唯一标识符 A by C.Q
         */
        FormEngine.prototype.getUrlkey = function(url){
        	// 如http://localhost:8080/sbzs-cjpt-web/biz/sbzs/xgmzzs，则取得到'/sbzs/xgmzzs'
        	return "/"+_bizReq_path_ + "/" + url;
        };
        /**
         * 显示表单列表信息在界面左侧，依赖[DIV id="divSheetlist"]
         */
        FormEngine.prototype.showSheetList = function(){
            var sheets = this.lstSheets;
            var divSheetlist = $("#divSheetlist");
			var divStepSheet = $(".table-step-item");
            if (divSheetlist.length) {
                var html = "";
                var sheet;
                var $ywbm = $("#ywbm");
                var dzswjTgc;
                if(typeof getTgcValue === "function" ){
                    dzswjTgc = getTgcValue();
                }
                for ( var i = 0; i< sheets.length; i++) {
                    sheet = sheets[i];
                    if($ywbm.val()==='qysds_a_17nd'||$ywbm.val()==='qysds_a_18nd'||$ywbm.val()==='qysds_a_18yjd'){
                    	 var reg = /\.a\d{6}/g;	//以a开始,数字结束
                         var result = reg.exec(sheet.bdsxmc);                         
                         sheet.bdsxmc=result!=null?sheet.bdsxmc.replace(result[0],result[0].toUpperCase()):sheet.bdsxmc;
                    }
                    if (typeof dzswjTgc != "undefined" && "" != dzswjTgc && dzswjTgc != "null" && dzswjTgc != null) {
                        sheet.url = sheet.url + "?DZSWJ_TGC=" + dzswjTgc;
                    }
                    html += "<li><a target=\"frmSheet\" style=\"display: inline-block;width: 290px;vertical-align: top;\" title=\""+sheet.name.replace(/<[^>]+>/g,"")+"\"  href=\"" + sheet.url + "\" dzbdbm=\""+(sheet.dzbdbm ? sheet.dzbdbm : '')+"\" bdsxmc=\""+(sheet.bdsxmc ? sheet.bdsxmc : '')+"\">" + sheet.name + "</a>"
                	+ "<span></span>"
                    + "</li>";
                }
                divSheetlist.html(html);
                divSheetlist.find("li:not(.active)").first().addClass("current_selected_BD");
            }
            if (divStepSheet.length) {
				showStepSheetlist(sheets);
			}
        };

        FormEngine.prototype.hideMaskFrmSheet = function(sheets){
        	     	
        	var frame = document.getElementById("frmSheet");
            var domDocument = frame.contentWindow.document.body;
            //导出中，锁定右侧工作区域
            if( true === isExporting){
            	//获取 右侧工作区 左右方向滚轮的宽度			
            	var scrollWidth = domDocument.scrollWidth;
            	//获取 右侧工作区 上下方向滚轮的高度			
            	var scrollHeight = domDocument.scrollHeight;
            	//获取 id=viewCtrlId 的 div
            	var $viewCtrlId = $(window.frames["frmSheet"].document).find("#viewCtrlId");
            	//设置靠左浮动，这样就可以实现div覆盖
            	$viewCtrlId.css("float","left");
            	//添加一个id=mask的div（该div将覆盖整个右侧工作区，主要用来添加mask，代替原来在body的范围内mask，因为table和div的宽、高度可能会超出body，导致覆盖不全）
            	$viewCtrlId.after("<div id='mask'></div>");
            	//获取刚刚添加的id=mask的div对象
            	var $mask = $(window.frames["frmSheet"].document).find("#mask");
            	//用id=mask的 div 覆盖整个右侧工作区（该div是透明的）
            	$mask.css({"float":"left","width":scrollWidth,"height":scrollHeight,"position":"absolute"})
            	//锁定整个右侧工作区
            	$mask.mask(" ");
                layer.alert("您已经将申报表导出报盘进行申报，此申报表不可再次填写编辑！");
                $mask.click(function () {
                    layer.alert("您已经将申报表导出报盘进行申报，此申报表不可再次填写编辑！");
                });
            }
            window.parent.layer.closeAll('loading');
            $(domDocument).find("#maskFrmSheet").hide();
            $(domDocument).find("#marqueeFrmSheet").hide();
            $(domDocument).css({ "overflow" : "scroll" });   
        };
        FormEngine.prototype.cacheCodeTable = function(key, value) {
            formCT[key] =jQuery.extend(true, {}, value);
        };
	
		FormEngine.prototype.cloneFormData = function(scope, newData) {
            formData = jQuery.extend(true, {}, newData);
            scope.$apply();
		};
        /**
         * 核心接口业务报文
         * 对核心返回信息进一步封装
         */
        FormEngine.prototype.hxjkBizXml = function(datas) {
        	var dataXml;
        	var hxjkBizObj = {};
        	if(datas != null && datas !== "") {//当datas为空是，强制$.parseXML()会抛异常
        		try{
        			dataXml = $($.parseXML(datas));
        		}catch(e){
            		hxjkBizObj.rtn_code='10';
            		hxjkBizObj.Code='0001';
            		hxjkBizObj.Message='';
            		hxjkBizObj.Reason=datas;
            		hxjkBizObj.bizXml='';
            		return hxjkBizObj;
        		}
        		//if(!isNull(dataXml.find("taxML > rtn_code")[0])){
        		if(dataXml.find("bizResult > head > rtnCode").length>0){
        			hxjkBizObj.rtn_code=$(dataXml.find("bizResult > head > rtnCode")[0]).text();
        			hxjkBizObj.Code=$(dataXml.find("bizResult > head > rtnMsg > code")[0]).text();
        			hxjkBizObj.Message=$(dataXml.find("bizResult > head > rtnMsg > message")[0]).text();
        			hxjkBizObj.Reason=$(dataXml.find("bizResult > head > rtnMsg > reason")[0]).text();
        			hxjkBizObj.bizXml=null;
        		} else {
        			hxjkBizObj.rtn_code='0';
        			hxjkBizObj.Code='000';
        			hxjkBizObj.Message='';
        			hxjkBizObj.Reason='';
        			hxjkBizObj.bizXml=dataXml;
        		}
        	}else{//TODO formData.msg为空，认为是返回成功报文，这个得依赖消息封装
        		hxjkBizObj.rtn_code='0';
        		hxjkBizObj.Code='000';
        		hxjkBizObj.Message='';
        		hxjkBizObj.Reason='';
        		hxjkBizObj.bizXml=dataXml;
        	}
        	return hxjkBizObj;
        };

        /**
         * 解析initData
         * */
        FormEngine.prototype.jxFormData = function(data){
            var _this = this;
            formData = data;
            if (formData){
                var _end_ = new Date().getTime();
                console.log("INFO:" +_end_ +" xFormula、xInitData请求结束时间");
                var _ms_ = _end_ - _start_;
                console.log("INFO:" +_ms_+"ms xFormula、xInitData请求耗时");
                // 设置服务器时间
                serverTime = formData['serverTime'];
                // 2018-07-03 将formData=formData.body会使ysqxxid丢失，保存到此变量
                var formData_ysqxxid = null;
                if (formData.otherParams) {
                    otherParams = formData.otherParams;
                    if ("string" === typeof otherParams) {
                        otherParams = jQuery.parseJSON(otherParams);
                    }
                    //判断signType的值，判断是否加载签章的js到主页面
                    var signType = '';
                    if(typeof otherParams !== 'undefined' && otherParams !=="" && otherParams !=null){
                        if(typeof otherParams.signType !== 'undefined'){
                            signType = otherParams.signType;
                        }
                        var i = 0;
                        if(signType === 'wzt'){//容器框签名
                            for (i = 0; i < _this.wztsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.wztsignJs[i]);
                            }
                        }else if(signType === 'ocx'){//ocx插件签名
                            for (i = 0; i < _this.ocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.ocxsignJs[i]);
                            }
                        }else if(signType === 'fjocx'){
                            for (i = 0; i < _this.fjocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.fjocxsignJs[i]);
                            }
                        }else if(signType === 'bw'){
                            for (i = 0; i < _this.bwsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.bwsignJs[i]);
                            }
                        }else if(signType === 'yunnan'){
                            for (i = 0; i < _this.yunnansignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.yunnansignJs[i]);
                            }
                        }
                    }
                }

                if("undefined" !== typeof "N" === formData['returnFlag']) {

                    //附税免申报弹窗提示
                    if(formData.warnInfo.code==="msb"){
                        if ("undefined" !== typeof formData.body&&"undefined" !== typeof
                            formData.flagExecuteInitial&&formData.flagExecuteInitial===true) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                            //设置依申请信息ID
                            $("#ysqxxid").val(formData.ysqxxid);
                            $("#showTipsType").val(formData.showTipsType);  // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                            try {
                                if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                    showTipsType = eval('('+formData.showTipsType+')');
                                }
                            } catch(e){
                                showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                            }
                            formulaExecType = formData.formulaExecType;
                            $("#formulaExecType").val(formulaExecType);
                            info2tip = formData.info2tip;
                            $("#info2tip").val(info2tip);
                            formData_ysqxxid = formData.ysqxxid;
                            formData = formData.body;
                            if ("string" === typeof formData) {
                                formData = jQuery.parseJSON(formData);
                            }
                            _ms_ = new Date().getTime() - _start_;
                            if(true === flagFormDebuging) {
                                dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                            }
                            //拿到ysqxxid，此时才能与附列资料集成
                            (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                            (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                            window.parent.layer.closeAll('loading');
                            layer.confirm(formData.warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                        }else{
                            window.parent.layer.closeAll('loading');
                            layer.confirm(formData.warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    }else{
                        if(typeof(formData.warnInfo) !== "undefined" && formData.warnInfo.msg !=="" && formData.warnInfo.msg!=null){
                            //流程阻断提示
                            window.parent.layer.load(2,{shade: 0.3});
                            window.parent.layer.alert(formData.warnInfo.msg, {icon: 0, title:'提示'}, function(index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    }
                }else {
                    if(typeof(formData.warnInfo) !== "undefined" &&
                        typeof(formData.warnInfo.msg) !== "undefined" && formData.warnInfo.msg !==""
                        && formData.warnInfo.msg!=null){
                        //提醒类提示
                        var index = window.parent.layer.load(2,{shade: 0.3});
                        window.parent.layer.alert(formData.warnInfo.msg);
                        window.parent.layer.close(index);
                    }
                    if ("undefined" !== typeof formData.body) {
                        if("undefined" !== typeof formData.flagExecuteInitial) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                        }

                        //设置依申请信息ID
                        $("#ysqxxid").val(formData.ysqxxid);
                        formEngine.replaceYsqxxid(formData.ysqxxid); // 若queryString中ysqxxid与此不同，则替换成此
                        $("#showTipsType").val(formData.showTipsType); // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                        try {
                            if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                showTipsType = eval('('+formData.showTipsType+')');
                            }
                        } catch(e){
                            showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                        }
                        formulaExecType = formData.formulaExecType;
                        $("#formulaExecType").val(formulaExecType);
                        info2tip = formData.info2tip;
                        $("#info2tip").val(info2tip);
                        formData_ysqxxid = formData.ysqxxid;
                        formData = formData.body;
                        //拿到ysqxxid，此时才能与附列资料集成
                    }
                    if ("string" === typeof formData) {
                        formData = jQuery.parseJSON(formData);
                    }
                    (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                    (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                }
            }
            return true;
        };

        /**
         * 针对verifyForm()的校验结构，给出相应的提示
         * */
        FormEngine.prototype.verifyForm = function() {
            var _this = this;
            if (typeof errorsAndWarnsAlert !== "undefined") {
                // 个性化提示
                if (errorsAndWarnsAlert(errors, warns, 'form')) {
                    return false;
                }
            } else {
                // 阻断提示
                var i = 1;
                if (errors != null && errors !== '' && errors !== '[]') {
                    var myErrors = '';
                    try {
                        var tempErrors = eval('(' + errors + ')');
                        for (i = 1; i <= tempErrors.length; i++) {
                            if (tempErrors.length === 1) {
                                myErrors = tempErrors[0].msg;
                                break;
                            }
                            myErrors += i + "：" + tempErrors[i - 1].msg + "<br>";
                        }
                    } catch (err) {
                        myErrors = errors;
                    }
                    window.parent.layer.load(2, {shade: 0.3});
                    window.parent.layer.alert(myErrors, {
                        title:'警告',
                        icon: 5,
                        closeBtn: 0,
                        offset: '270px'
                    }, function (index) {
                        // GZDSDZSWJ-1510 页面一直卡起，误认为死机
                        _this.closeWindow();
                    });
                    return false;
                } else if (warns != null && warns !== '' && warns !== '[]') {
                    // 提醒提示
                    var myWarns = '';
                    try {
                        var tempWarns = eval('(' + warns + ')');
                        for (i = 1; i <= tempWarns.length; i++) {
                            if (tempWarns.length === 1) {
                                myWarns = tempWarns[0].msg;
                                break;
                            }
                            myWarns += i + "：" + tempWarns[i - 1].msg + "<br>";
                        }
                    } catch (err) {
                        myWarns = warns;
                    }
                    var index = window.parent.layer.load(2, {shade: 0.3});
                    window.parent.layer.alert(myWarns, {
                        title:'提醒',
                        icon: 7,
                        closeBtn: 0,
                        offset: '270px'
                    });
                    window.parent.layer.close(index);
                }
            }
            return true;
        };
        /**
         * 关闭窗口
         * */
        FormEngine.prototype.closeWindow = function() {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    window.opener = null;
                    window.close();
                } else {
                    window.open('', '_top');
                    window.top.close();
                }
            } else if (navigator.userAgent.indexOf("Firefox") > 0) {
                window.location.href = 'about:blank ';
                window.top.close();
            } else if (navigator.userAgent.indexOf("Chrome") > 0) {
                top.open(location, '_self').close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        };
        
        // For not to do initialization twice.
        FormEngine._inited = true;
    }
    
    /**
     * 要素申报-获取要素信息，把数据加载到表单里
     */
    FormEngine.prototype.getYsData = function() {
    	if (parent.location.href.indexOf("lookBack=Y")>-1) {
    		return ;
    	}
    	// url中的参数一并带回给后台
    	var params = window.location.href.substring(window.location.href.indexOf('?')+1);
    	var data = {};
    	var paramArr = params.split('&');
    	for (var i=0 ; i<paramArr.length ; i++) {
    		var param = paramArr[i].split('=');
    		data[param[0]] = param[1];
    	}
    	// 生产环境的url可能没有带上完整的参数,固定放入djxh,ywbm,ssq,ywlx
    	data.ywbm = $("#ywbm").val();
    	data.djxh = $("#djxh").val();
    	data.sssqQ = $("#sssqQ").val();
    	data.sssqZ = $("#sssqZ").val();
    	if (parent.ywlx !== undefined) {
    		data.ywlx = parent.ywlx;
    	} else {
    		var index_start = window.location.href.indexOf("biz/")+4;
    		var index_end = index_start + window.location.href.substring(index_start).indexOf('/');
    		data.ywlx = window.location.href.substring(index_start, index_end).toUpperCase();
    	}
    	var sbzxWebContent = window.location.pathname.substring(0, window.location.pathname.substring(1).indexOf('/')+1);
    	if (typeof data.ywlx !== 'object' && data.ywlx !== "SXSQ" && data.ywlx !== "SXSL") {
    		$.ajax({
        		url: sbzxWebContent+'/ywzt/getYsData.do',
        		type: 'POST',
        		dataType: 'json',
        		async: false,
        		data: data,
        		success: function(data) {
        			if (data.rtnCode === "000") {
        				var wbcsh = data.body;
        				//TODO 请求要素数据之前，wbcsh已经赋值，再设置wbcsh的值会覆盖原有值
        				if(typeof wbcsh !== "undefined" && wbcsh !== null && wbcsh !== ""){
        				    // 请求到要素数据的情况才设置值，防止请求到空的要素数据覆盖了之前设置的wbcsh的值
        				    $("#wbcsh").val(Base64.encode(wbcsh));
                        }
        			} else {
        				console.log("getYsData请求异常, 返回数据"+data);
        			}
        		},
        		error: function(xhr, textStatus, errorThrown) {
        			console.log("getYsData请求"+textStatus+"异常: "+errorThrown);
        		},
        		complete: function (xhr, ts) {
        			
        		},
        		timeout: 5000
        	});
    	}
    };

    /**
     * 根据附表列表过滤核心提交报文
     */
    FormEngine.prototype.filterHtAll = function(jsonParams) {
        //获取附表列表
        var dzbdbmList = $("#dzbdbmList").val();
        var dzbdFromSheet = dzbdbmList.split("---");
        //删除最后一个为""的元素
        dzbdFromSheet.pop();

        //获取暂存报文中的附表列表
        var dzbd = formData.kz_.dzbd;
        var dzbdFromBw = dzbd.split("---");
        //删除最后一个为""的元素
        dzbdFromBw.pop();

        //定义新增附表列表和减少附表列表
        var xzfb = "";
        var jsfb = "";

        if(!flagExecuteInitial) {
            //筛选出新增附表列表
            for (var i = 0; i < dzbdFromSheet.length; i++) {
                if (dzbd.indexOf(dzbdFromSheet[i]) === -1) {
                    xzfb = xzfb + dzbdFromSheet[i] + ",";
                }
            }

            //筛选出减少附表列表
            for (var j = 0; j < dzbdFromBw.length; j++) {
                if (dzbdbmList.indexOf(dzbdFromBw[j]) === -1) {
                    jsfb = jsfb + dzbdFromBw[j] + ",";
                }
            }

            if (xzfb === "" && jsfb === "") {
                // 无增删附表直接返回
                return;
            }
        }

        var _this = this;
        //发起同步请求获取核心提交全量报文
        $.ajax({
            url: _this.URL_GET_HT_All,
            type: 'POST',
            dataType: 'json',
            async: false,
            data: jsonParams,
            success: function(data) {
                if (data) {
                    htAll = jQuery.parseJSON(data);
                } else {
                    console.log("getHtAll请求异常, 返回数据" + data);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("getHtAll请求"+textStatus+"异常: "+errorThrown);
            },
            complete: function (xhr, ts) {

            },
            timeout: 2000
        });

        if(!htAll){
            //没有请求到htAll，直接返回
            return;
        }

        //取全附表集合
        var idxSheets = htAll.kz_.dzbd;

        //获取业务编码
        var ywbm = $("#ywbm").val().toUpperCase();

        //构造特殊附表过滤规则
        var dzbdgzlb = {};
        if(this.fbgz[ywbm]){
            //循环配置的fbgz
            for (var fbgzKey in this.fbgz[ywbm]) {
                var fbgzValue = this.fbgz[ywbm][fbgzKey];

                if(fbgzKey.indexOf(',') === -1){
                    //单附表的规则直接放入dzbdgzlb
                    dzbdgzlb[fbgzKey] = fbgzValue;
                } else {
                    //多附表的情况，取出各个附表，判断是否所有附表都没有选中
                    var fbgzs = fbgzKey.split(",");
                    var fbgzFlag = true;
                    for (var i = 0; i < fbgzs.length; i++) {
                        if (dzbdbmList.indexOf(fbgzs[i]) > -1) {
                            fbgzFlag = false;
                        } else {
                            dzbdgzlb[fbgzs[i]] = [];
                        }
                    }

                    //只有当所有的附表都没有选时，才把相关规则直接放入dzbdgzlb
                    if(fbgzFlag){
                        dzbdgzlb[fbgzs[0]] = fbgzValue;
                    }
                }
            }
        }

        //判断有无暂存
        if(!flagExecuteInitial){
            //存在暂存
            if(!otherParams){
                otherParams = {};
            }

            if(xzfb !== ""){
                //存在新增附表
                xzfb = xzfb.substr(0, xzfb.length - 1);
                //设置新增附表参数，公式执行时会使用到
                otherParams.xzfb = xzfb;

                //formData的ht_节点下增加新增的附表节点，从htAll中取对应的附表节点的值
                var xzfblb = xzfb.split(",");
                for (var i = 0; i < xzfblb.length; i++) {
                    var fb = xzfblb[i];
                    var fbPath = idxSheets[fb];
                    //formData中创建新增的附表节点
                    _this.jpathNodeCreate(formData, "$." + fbPath);
                    //将htAll中附表节点的值赋给formData相应节点的值
                    eval("formData." + fbPath + " = htAll." + fbPath);
                }
            }

            if(jsfb !== ""){
                //存在减少附表
                jsfb = jsfb.substr(0, jsfb.length - 1);
                //设置减少附表参数，公式执行时会使用到
                otherParams.jsfb = jsfb;

                // formData的ht_节点下增加新增的附表节点，从htAll中取对应的附表节点的值
                var jsfblb = jsfb.split(",");
                for (var i = 0; i < jsfblb.length; i++) {
                    var fb = jsfblb[i];
                    _this.deleteFbNode("formData", fb, dzbdgzlb, idxSheets);
                }

                //拼装formDataJb
                var formDataJb = jQuery.extend(true, {}, formData);
                formDataJb.ht_ = {};
                var ht = _this.getHt();
                formDataJb.ht_ = ht;

                //存在减少附表，设置formDataJb，公式执行时会使用到
                otherParams.formDataJb = JSON.stringify(formDataJb);
            }
        } else {
            //无暂存时，获取htAll中本次请求的附表，请htAll.ht_赋值给formData.ht_，然后删除没有选中的附表
            var ht = _this.getHt(dzbdgzlb);
            formData.ht_ = ht;
        }
    };

    /**
     * 判断是否中台请求
     */
    FormEngine.prototype.getYwztBz = function() {
        //判断是否为4.0业务
        var ywztBz = false;
        var querystr = "{" + $("#_query_string_").val() + "}";
        if (typeof querystr !== 'undefined' && querystr !== "" && querystr != null) {
            var obj = JSON.parse(querystr);
            if ("Y" === obj.ywzt) {
                ywztBz = true;
            }
        }
        return ywztBz;
    };

    /**
     * 删除一些不需要的参数, 比如result, 防止get请求的URL链接太长
     */
    FormEngine.prototype.escapeGuideParam = function() {
        var querystr = $("#_query_string_").val();
        if (typeof querystr !== undefined && querystr !== "" && querystr != null) {
            var obj = JSON.parse("{" + querystr  + "}");
            if (typeof obj.result !== undefined) {
                delete obj.result;
            }
            var guideParam = JSON.stringify(obj);
            return guideParam.slice(1, (guideParam.length - 1));
        }
        return querystr;
    };

    /**
     * 发起公式请求的时候只传递必要的几个参数
     */
    FormEngine.prototype.keepRequiredParams = function(jsonParams) {
        var params = new Object();
        var props = ["ywlx", "ywbm", "swjgDm", "djxh", "formstyle", "ywzt", "nsrsbh", "test", "reset", "gdslxDm", 
                "sxlb", "yhlx", "sxjdglCkbz"];
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (jsonParams[prop] !== undefined && jsonParams[prop] !== "") {
                params[prop] = jsonParams[prop];
            }
        }
        return params;
    };

    /**
     * 根据htAll和选中的附表获取需要的ht
     * @param dzbdgzlb 特殊的附表过滤规则
     */
    FormEngine.prototype.getHt = function(dzbdgzlb){
        //获取附表列表
        var dzbdbmList = $("#dzbdbmList").val();
        //取全附表集合
        var idxSheets = htAll.kz_.dzbd;

        //选好全量附表，找出没有选中的附表并删除该附表节点
        for (var dzbdbm in idxSheets) {
            if(dzbdbmList.indexOf(dzbdbm) === -1){
                this.deleteFbNode("htAll", dzbdbm, dzbdgzlb, idxSheets);
            }
        }
        return htAll.ht_;
    };

    /**
     * 根据htAll和选中的附表获取需要的ht
     * @param data 需要删除附表节点的对象名称
     * @param dzbdbm 没有选中的附表
     * @param dzbdgzlb 特殊的附表过滤规则
     * @param idxSheets 全量附表
     */
    FormEngine.prototype.deleteFbNode = function(data, dzbdbm, dzbdgzlb, idxSheets){
        if(!dzbdgzlb || !dzbdgzlb[dzbdbm]) {
            //没有配置规则，则直接删除对应的附表节点
            eval("delete " + data + "." + idxSheets[dzbdbm]);
        } else {
            //删除配置的规则中的节点
            var fbPath = dzbdgzlb[dzbdbm];
            if (Object.prototype.toString.call(fbPath) == "[object Array]" && fbPath.length > 0) {
                //如果配置空数组[]，则不删除节点（如一般人的附表四，不选也传节点）
                for (var j = 0; j < fbPath.length; j++) {
                    if (fbPath[j].indexOf("*") > 0) {
                        //如果配置为ht_.xx.xx.fb.*，则表示需要删除fb下的所有节点，只保留fb节点（如小规模的减免附表）
                        //则可以直接把formData下的该附表节点赋值为{}
                        var fb = fbPath[j].substr(0, fbPath[j].indexOf("*") - 1);
                        eval(data + "." + fb + " = {}");
                    } else {
                        //如要删除fb下的某一些节点，保留部分节点（如一般人的《汇总纳税企业增值税分配表》，需要删除附表下的Grid节点，但是需要保留Form节点）
                        eval("delete " + data + "." + fbPath[j]);
                    }
                }
            }
        }
    };

    /**
     * 根据strJpath在objBase中创建节点
     * @param objBase 需要需要创建节点的json对象
     * @param strJpath 节点路径
     */
    FormEngine.prototype.jpathNodeCreate = function(objBase, strJpath){
        if (strJpath.substr(0, 2) !== "$.") {
            console.log("JPath illegal while trying jpathNodeCreate, should start with '$.' :"
                + strJpath);
            return;
        }
        var pos = strJpath.lastIndexOf(".");
        var posShorted = strJpath.lastIndexOf("..");
        posShorted = (posShorted < 0) ? (0) : (posShorted + 1);
        while (pos > posShorted) {
            var partial = strJpath.substr(0, pos);
            var obj = (partial === "$") ? [ objBase ] : jsonPath(objBase, partial);
            if (obj !== false) {
                if (obj.length === 1) {
                    obj = obj[0];
                    if ("object" === typeof obj) {
                        var flag = this.createSubPath(obj, strJpath.substr(pos + 1));
                        if (flag) {
                            eval('window.FSformData' +'= objBase');
                            obj = jsonPath(objBase, strJpath, { resultType : "PATH" });
                            if (obj && obj.length === 1) {
                                return obj[0].replace(/\[\'/g, ".").replace(/\'\]/g, "");
                            }
                        }
                        console.log("Failed while trying createSubPath: " + flag + ", "
                            + obj.length);
                    } else {
                        console.log("Failed while trying jpathNodeCreate, found parent '"
                            + partial + "' is not object: " + typeof obj);
                        return;
                    }
                } else {
                    console.log("Failed while trying jpathNodeCreate, found parent '" + partial
                        + "' return multi-result: " + obj.length);
                    return;
                }
            }
            pos = strJpath.lastIndexOf(".", pos - 1);
        }
    };

    /**
     * 根据subPath在objBase中创建节点，以.分割subPath，在objBase中逐层创建对象
     * @param objBase 需要需要创建节点的json对象
     * @param subPath 节点路径
     */
    FormEngine.prototype.createSubPath = function(objBase, subPath){
        try {
            var nodes = subPath.split(".");
            var base = objBase;
            var i = 0;
            do {
                var name = nodes[i];
                var pos = name.indexOf("[");
                var sub = null;
                if (pos > 0) {
                    // TODO: Can't support more than one [], like [1][2]
                    // or ['a']['b']
                    sub = name.substr(pos + 1, name.indexOf("]") - pos - 1);
                    name = name.substr(0, pos);
                }
                if (name.length === 0) {
                    return false;
                }
                if (typeof base[name] === "undefined" || base[name] == null) {
                    if (sub) {
                        base[name] = [];
                    } else {
                        base[name] = {};
                    }
                }
                if (typeof base !== "object") {
                    console.log("Failed while trying create subpath [" + subPath + "]: "
                        + nodes[i - 1] + "is not a object.");
                }
                base = base[name];
                if (sub) {
                    base[sub] = {};
                    base = base[sub];
                }
            } while (++i < nodes.length);
            return true;
        } catch (ex) {
            // Create node failed.
            console.log("Failed while trying create subpath [" + subPath + "]: " + ex);
            return false;
        }
    };

    /**
     * 重新请求核心期初数initData，赋值给formData，并执行初始化公式和外部初始化公式
     * 注意：执行完该方法后需要刷新表单（执行viewEngine.formApply($('#viewCtrlId'))）并渲染结果（执行viewEngine.tipsForVerify(document.body)）
     * @param wbcsh 外部初始化数据
     */
    FormEngine.prototype.reInitDataAndExecuteFormulas = function(wbcsh){
        //重新发起reset=Y的请求，获取期初数
        jsonParams["reset"] = "Y";
        $.when($.getJSON(this.URL_GET_FORM_DATA, jsonParams)).then(function(data) {
            if(data) {
                data = data.body;
                if ("string" === typeof data) {
                    //请求返回的formData存在，则重新设置formData
                    formData = jQuery.parseJSON(data);

                    if(wbcsh){
                        //外部初始化存在则赋值到wbcsh节点
                        $("#wbcsh").val(Base64.encode(wbcsh));
                    }

                    //初始化公式引擎（会触发编译公式、执行公式逻辑）
                    formulaEngine.initialize("formData");

                    //TODO 是否可以只调用execApplyInitialFormulas执行初始化公式和外部初始化公式，而不需要调initialize，可以省去编译的过程 待验证
                    //formulaEngine.execApplyInitialFormulas();

                    formEngine.formApply();
                }
            }
        });
    };

    /**
     * 刷新表单，并执行渲染
     */
    FormEngine.prototype.formApply = function(){
        if(!flagExcuted){
            setTimeout(function(){
                formEngine.formApply();
            },10);
            return;
        }

        var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
        var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
        var body = $("#frmSheet")[0].contentWindow.document.body;
        viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);

        viewEngine.formApply($viewAppElement);
        viewEngine.tipsForVerify(body);
    };
}


$(function(){
	/**
	 * 进入填表页弹框提示操作规程
	 */
	var czgcFlag = $("#czgcFlag").val(); // 全局设置
	var czgcStart = document.cookie.indexOf("czgcCookie=")===-1?-1:document.cookie.indexOf("czgcCookie=")+11;
	var czgcEnd = document.cookie.indexOf(";", czgcStart)===-1?document.cookie.length:document.cookie.indexOf(";", czgcStart);
	var czgcCookie = document.cookie.substring(czgcStart, czgcEnd);
	var sxslFlag = true;
	var ysdjFlag = true;
	if (typeof contextPath == 'object'){
        window.contextPath = $("#contextPath").val();
    }

	if (contextPath.indexOf("sxsl")>-1) {
		sxslFlag = false;
	}
	if (window.parent.location.href.indexOf("ysdj=Y")>-1) {
		ysdjFlag = false;
	}
	if (window.parent.location.href.indexOf("yjlsb=Y")>-1) {
		ysdjFlag = false;
	}
	if (czgcFlag==="Y" && czgcCookie!=="N" && sxslFlag && ysdjFlag) {
		var zyywnWebContextPath = $("#zyywnWebContextPath").val();
		if(zyywnWebContextPath === null || typeof zyywnWebContextPath === 'undefined'){
			zyywnWebContextPath = "/zyywn-cjpt-web";
		}
		var czgcUrl = zyywnWebContextPath+"/czgc/queryWSDataList.do?ywbm="+$("#ywbm").val().toUpperCase();
		window.parent.layer.open({
			type : 1,
			title : "操作规程",
			id : "czgcIframe",
			zIndex : 10000,
			skin : 'layui-layer-demo', // 样式类名
			anim : 2,
			shadeClose : true, // 开启遮罩关闭
			area : ['1000px', '600px'],
			content : '<iframe src='+czgcUrl+' style="width:100%; height:95%;"></iframe>',
			success : function(layero, index) {
				var $iframe = layero.find("#czgcIframe");
				$iframe.css("padding", "0px 0px 0px 0px");
				layero.css("height", (layero.height()-60)+"px");
				var $div = layero.find(".layui-layer-btn");
				$div.append('<span style="position:absolute; left:780px; bottom: 28px;"><input type="checkbox" id="nextShowFlag"/>下次不显示</span>');
			},
			btn : ['确认'],
			yes : function(index, layero) {
				var $checkbox = layero.find("#nextShowFlag");
				if ($checkbox.attr("checked")==="checked") {
					// 往Cookies里塞czgcCookies = false;
					document.cookie = "czgcCookie="+escape("N");
				}
				window.parent.layer.close(index);
			}
		});
	}
	
    formEngine = new FormEngine();

    //1、检查Adobe Reader
    checkPDFPlugin();

    //2、针对verifyForm()的校验结果，给出相应的提示
    if(!formEngine.verifyForm()){
        return;
    }

    //3、
    fxsmInitData = new FxsmInitData();
    formEngine.loadScript4Sheet("/resources/js/lib/jquery.min.js");
    
    // 更正申报自定义回调
    if(typeof commonGzsbCallback === "function"){
    	commonGzsbCallback();
		return false;
	}

    // 联合附加税申报（专表）自定义回调
    if(typeof lhfjssbCallback === "function"){
    	lhfjssbCallback();
		return false;
	}
    
	//纳税人是否需要输入免抵税额判断
 	if($('#isInputMdse').val()==="true"){
 		$("td.areaHeadBtn", window.parent.document).hide();
        window.parent.layer.confirm('<br><table>' +
            '<tr style=\'font-size:18px\' >' +
            '<td colspan=\'2\' width=\'100%\'>&nbsp;&nbsp;&nbsp;&nbsp;生产型出口退税企业：</td>' +
            '<td>' +
            '<input type=\'radio\' name=\'sfscqy\'onclick=\'javascript:document.getElementById("mdsetr").style.visibility="visible";\' value=\'1\'/>是&nbsp;&nbsp;' +
            '<input type=\'radio\' name=\'sfscqy\' value=\'2\'onclick=\'javascript:document.getElementById("mdsetr").style.visibility="hidden";\' checked=\'checked\'/>否' +
            '</td>' +
            '</tr>' +
            '<tr id=\'mdsetr\' style=\'visibility:hidden;\'>' +
            '<td  style=\'font-size:18px\' width=\'70%\'>&nbsp;&nbsp;&nbsp;&nbsp;当期免抵税额：</td>' +
            '<td colspan=\'2\'>' +
            '<input type=\'text\' id=\'myInput\'  style=\'border:1px solid #fff;border-bottom-color:#b5b5b5;\' />' +
            '</td>' +
            '</tr>' +
            '</table>',{
            type: 1,
            area: ['420px','225px'],
            btn: ['确定'],
            title: '提示',
            yes: function (index, layero) {
                var radioValue = $(layero).find(':radio[name="sfscqy"]:checked').val();
                if (radioValue === "1") {
                    var v = $(layero).find('#myInput').val();
                    if (v === "" || v === undefined || !/(^\d+$)|(^\d+\.\d+$)/g.test(v)) {
                        window.parent.layer.alert('您输入的值无效或未输入！', {
                            title: '错误提示'
                        });
                    }
                    else {
                        window.parent.layer.load(2, {shade: 0.3});
                        $("td.areaHeadBtn", window.parent.document).show();
                        $(jsonParams).attr("mdse", v);
                        formEngine.initialize();
                        window.parent.layer.close(index);
                    }
                } else {
                    window.parent.layer.load(2, {shade: 0.3});
                    $("td.areaHeadBtn", window.parent.document).show();
                    formEngine.initialize();
                    window.parent.layer.close(index);
                }
            }
        });

   	}else{
   		window.parent.layer.load(2,{shade: 0.3});
   		formEngine.initialize();
   	} 
	
});
