var _TEST_TIMES_ = 1; // TODO: WARNING, For performance testing
var flagExcuted; // 公式执行完成标识
var flagExcutedError; // 公式执行失败的异常信息

 /**
 * Formula value-object. <BR>
 * 值对象：公式对象, 具体公式字段及取值信息参与内部注释.
 */
function FormulaObject(){
    this.formula; // Original formula. 原始公式字符串.
    this.id; // Formula ID from rule base. 规则库中所保存的公式ID.
    this.type; // Formula type. 规则类型（01计算公式；02校验公式；03控制公式；10初始公式；11初始并计算公式；12初始校验公式: 21提交时计算赋值公式）.
    this.desc; // Description from requirement. 本公式的需求说明.
    this.target; // Target effected by formula. 公式所影响的目标对象（主要用于控制公式：03）.
    this.tips; // User tips for verify. 用户提示信息，主要用于校验公式.
    this.strAssignment; // Original assignment's part, left of equal mark. 公式赋值部分，等号左边.
    this.strAssResolved; // Resolved assignment's part, full-path json. 解析后赋值部分（全JSON路径）.
    this.strExpression; // Original expression's part, right of equal mark. 公式计算部分，等号右边.
    this.strExpResolved; // Resolved expression's part, full-path json. 解析后计算部分（全JSON路径）.
    this.lstVariables = []; // All variables in formula. 公式中的所有变量列表.
    this.lstTargetResolved = []; // All target in resolved. 公式所涉及控制目标的解析.
    this.lstDynamicParams = []; // All dynamic parameter's name. 含动态参数公式的参数名（均以#开头）.
    this.flagAggregation = false; // Flag of aggregation, formula has [*]. 标志：聚合，公式中含有[*]数组下标.
    this.flagDynamicParam = false; // Flag of dynamic, formula has [#]. 标志：动态变量，公式中含有[#]下标.
    this.flagCompiled = false; // Flag of complied. 标志：已编译，公式是否成功编译.
    this.flagPreCompiled = false; // Flag of precomplied. 预编译标志：公式是否预编译.
    this.lastError = null; // Last error of Exception. 记录最后一次的错误信息（编译过程）.
    this.lastVerify = null; // Last verify result. 记录最后一次的校验结果.
    this.lastControl = null;
    this.tipType = 'error'; // C.Q info or error 默认error 消息提示级别error为阻断方式
    this.level = '1'; // C.Q 优先提示等级,在tipType同级别的前提下  1是最优先级别 [1 > 2 > 3 > ...]
    this.channel = 'gs'; // 来源渠道[gs=公式，fxsm=csgj-风险扫描] C.Q 20170329
    this.cljy; // 风险扫描-处理建议
    this.glbd; // 风险扫描-关联表单 数组[{"fbid": "关联表单id","fbmc": "附表名称", "ydwz": "疑点位置","jpath": "数据项路径"}]
    this.fxmc; // 风险扫描-风险名称
    this.jcjg; // 风险扫描-检查结果
    this.fxlx; // 风险扫描-风险类型[0风险扫描，1节税扫描]
    this.zcInit; // 暂存初始化标志，当有暂存报文时，若zcInit=Y，则初始化时也执行此计算公式。如果无暂存时，此参数无用。例：GEARS-7359 A表的数据是来自引导页/基础设置页时，引导页修改的数据能带到A表中，但由于表间公式不会执行，导致其它表数据有误。
    this.dthQlzxBz; // 动态行全量执行标志，如果dthQlzxBz=Y，则公式每行都执行。
    this.initVerify; // 针对校验公式初始化时执行次数控制标志：once=执行一次。此标志只作用于初始化时执行，控制动态行校验公式执行次数。
}
/**
 * Formula Engine. Maintain all formula in sheet. <BR>
 * 公式引擎, 维护当前表单中所有公式及运算.<BR>
 * 公式引擎主要需要关注以下几个方法（均标注了PUBLIC）：
 * @see loadFormulas(formulas) 从JSON数组中装载公式组（字符串形式）.
 * @see initialize(newBasename) 初始化公式引擎，需要先准备好公式.
 * @see apply(jpath, newValue) 执行数据模型更新（针对特定JPath）, 将指定关联计算公式及校验公式.
 * @see testFormula(cfgFormula) 测试公式，主要用于调试或编辑过程.
 * @see updateFormula(objFormula, cfgFormula) 用于编辑过程中对原公式进行替换.
 * @see appendFormula(cfgFormula) 增加公式.
 * @see deleteFormula(objFormula) 删除公式.
 * @see getFormulaById(id) 根据公式ID获取公式对象.
 * @see getFormulaByAssignment(strAssign) 根据赋值部分获取公式对象.
 * @demo
 * 
 * <pre>
 * var myData = { // 根对象
 *     a : 1, b : 2, c : { // 对象嵌对象
 *         x : 10, y : 20 
 *     }, d : [ // 对象嵌数组（也可继续重复嵌套）
 *         1, 2, 3
 *     ]
 * }; // 定义数据模型
 * var myRuls = [ // 定义公式模型，本身应是个数组
 *     {  'id' : 0, 
 *        'type' : '11', 
 *        'desc' : '执行运算，并将结果写进新的节点中', 
 *        'formula' : '$.temp.result=$..x + $.c.y + $.b * SUM($.d[*])',
 *        'tips' : '如果为校验公式，则此处是需要提示给最终用户的信息'
 *     }
 * ];
 * 
 * formulaEngine = new FormulaEngine(); // 1、创建公式对象
 * formulaEngine.loadFormulas(formulas); // 2、装载公式数据
 * formulaEngine.initialize('myData'); // 3、根据命名数据对象进行引擎初始化
 * 
 * formulaEngine.apply('name.path.of.json', 22); // 一般在事件中进行调用：某个节点值更新，计算所有关联公式
 * 
 * formulaEngine.testFormula('$.result=$.c.x+$..y'); // 一般在编辑公式后需要验证时时进行调用
 * formulaEngine.updateFormula(oldFormulaObject, {'type':'01','formula':'$.result=SUM($..x, $..d[*])'});
 * formulaEngine.appendFormula({'type':'01','formula':'$.result=SUM($..x, $..d[*])'});
 * </pre>
 */
function FormulaEngine(){
	this.tmpLtAllFormulas;//临时数组，存放所有的公式，当公式编译完成后，其长度为0，此时开始执行公式
	this.compleflag = false;//临时标志，当公式编译完成后，其值为true，此时开始执行公式
    this.lstAllFormulas; // All loaded formulas. 数组, 所有载入的公式，含计算、初始化、校验.
    this.lstCalculateFormulas; // Calculate formulas about '01' or '11'. 数组, 计算公式.
    this.lstInitialFormulas; // Initial formulas about '10' or '11'. 数组, 初始化公式.
    this.lstVerifyFormulas; // Verify formulas about '02','12'. 数组, 校验公式.
    this.lstControlFormulas; // Control formulas about '03','13'. 数组, 控制公式.
    this.lstCalculate2SubmitFormulas;// Calculate formulas about '21'. 数组, 提交前赋值、计算公式.
    this.idxVariable2NoPass; // Recorder variable of not passed verifies.
    this.idxCurrentVariable2NoPass;
    this.idxVariable2Control; // Index for variable referenced by control-formula. 索引，记录变量所影响的控制公式。
    this.idxCurrentVariable2Control;
    this.idxAssign2Formulas; // Use for duplicate assignment detection. 索引, 用于检查重复公式, 关键字为赋值部分.
    this.idxId2Formulas; // Index of formula by formulaId. 索引, 主键索引, 公式ID.
    this.failedFormulas; // Loaded or compile failed formulas. 数组，解析失败的公式.
    this.idxVariable2Formula;// Index for variable referenced by formula. 索引, 反向变量索引用于处理公式级联.
    this.basename; // The base data-object used for calculation. 对象名称（字符串）, 记录公式计算所依赖JSON对象.
    this.idxWbcshCalculate2Formula; //外部初始化计算公式索引
    this.noPreCompiledRules = [];//非预编译公式【前端JS编译成功的公式】
    this.jp = new FSjpath();
    // Define function.
    if (typeof FormulaEngine._inited === "undefined") {
        FormulaEngine.prototype.regBasket = /\[(\d+)\]/g;
        //正则匹配独立的等于号
        FormulaEngine.prototype.regAssignMark = /[^!=><]=[^=><]/;
        /**
         * PUBLIC: Load formulas from JSON, as array. <BR>
         * 外部方法：从JSON数组中装载公式组（字符串形式）.
         * @param formulas JSON-Object: Formulas array from rule-base. JSON对象：从规则库导出的公式数组.
         */
        FormulaEngine.prototype.loadFormulas = function(formulas){
            var _start_ = new Date().getTime();

            // Check parameter
            if (formulas) {
                if (!(formulas instanceof Array)) {
                    throw "Parameter formulas is not a array!";
                }
                if (formulas.length <= 0) {
                    throw "Parameter formulas is empty!";
                }
            } else {
                throw "Parameter formulas illegal: " + formulas
            }
            // Do clean up the instance formulas information.
            this.doClean();
            // Load formula
            for (var i = 0; i < formulas.length; i++) {
            	var objFormula;
            	if (formulas[i].flagPreCompiled) {
            		objFormula = this.createFormulaObject2(formulas[i]);
            	} else {
            		objFormula = this.createFormulaObject(formulas[i]);
            	}

            	//静默申报情况下info类型的12公式不弹框
                if(typeof isJmsb === "function" && isJmsb() && objFormula.type === '12' && objFormula.tipType === 'info') {
                    continue;
                }

                this.add2List(objFormula); // Append to all those various list.
            }
            // Check time.
            var _end_ = new Date().getTime();
            console.log("INFO:"+ _start_+"-"+_end_+"-"+(_end_ - _start_)
                +"ms 公式加载: [" + this.lstAllFormulas.length + "] 条 ");
        };
        /**
         * PUBLIC: Initialize after formulas loaded. <BR>
         * 外部方法：初始化公式引擎，需要先准备好公式.
         * @param newBasename String The base data-object used for calculation. 对象名称（字符串）, 记录公式计算所依赖JSON对象.
         * @returns none.
         */
        FormulaEngine.prototype.initialize = function(newBasename){
        	var _this = this;
            var flagDoInitial = true;
            if (this.basename && newBasename === true) {
                flagDoInitial = false;
            } else {
                if (!newBasename && !(newBasename instanceof String)) {
                    throw "Initialize parameter illegal, needs String.";
                }
                try {
                    if (!eval(newBasename)) {
                        throw "Initialize parameter's object not founded";
                    }
                } catch (ex) {
                    throw "Initialize basename's object illegal [" + newBasename + "]: " + ex;
                }
                this.basename = newBasename;
                // 根据服务端返回执行初始化标识最终决定是否执行初始化
                /*if(!flagExecuteInitial) {
                    flagDoInitial = false;
                }*/
            }
            eval('window.FSformData='+this.basename);
            // Init the FSjpath
            this.jp.initialize(eval(this.basename));
            
            // Initial:
            this.procVerifyFormulas = []; // Temporary variable for processing: involved verify-formulas.
            this.procContorlFormulas = [];
            this.procVariableInStack = {}; // Temporary variable for processing: variable in calling-stack.
            // Do compile, calculate and verify            
            _this.compileAll();
            
            if (flagDoInitial) {
                var startTime = new Date().getTime();
        		this.execApplyInitialFormulas(startTime);
            }
            isInitialized = true;//已经初始化
        };

        /**
         * PUBLIC: Initialize after formulas loaded. <BR>
         * 外部方法：初始化公式引擎，需要先准备好公式.
         * @param newBasename String The base data-object used for calculation. 对象名称（字符串）, 记录公式计算所依赖JSON对象.
         * @returns none.
         */
        FormulaEngine.prototype.initialize4Jb = function(newBasename){
            var flagDoInitial = true;
            if (this.basename && newBasename === true) {
                flagDoInitial = false;
            } else {
                if (!newBasename && !(newBasename instanceof String)) {
                    throw "Initialize parameter illegal, needs String.";
                }
                try {
                    if (!eval(newBasename)) {
                        throw "Initialize parameter's object not founded";
                    }
                } catch (ex) {
                    throw "Initialize basename's object illegal [" + newBasename + "]: " + ex;
                }
                this.basename = newBasename;
            }
            eval('window.FSformData2='+this.basename);
            // Init the FSjpath
            this.jp.initialize(eval(this.basename));
            // Initial:
            this.procVerifyFormulas = []; // Temporary variable for processing: involved verify-formulas.
            this.procContorlFormulas = [];
            this.procVariableInStack = {}; // Temporary variable for processing: variable in calling-stack.
            // Do compile, calculate and verify            
            this.compileAll();
        };
        
        /**
         * 针对ie8奔溃问题，采取分批编译公式
         * startTime : IE8下编译开始时间
         */
        FormulaEngine.prototype.execApplyInitialFormulas = function(startTime){
        	var _this = this;
        	//当公式编译完成后才执行公式 
        	//1.1存在减少附表的情况，则需要等减少附表对应的数据模型的公式编译完成后才执行公式
        	if(this.compleflag){
                console.log("INFO:"+ startTime+"-"+new Date().getTime()+"-"+(new Date().getTime() - startTime)
                    +"ms IE8下公式编译结束时间");
        		//不存在otherParams.jsfb参数，直接执行
        		if(otherParams && otherParams.jsfb ){
        			//存在formulaEngineJb，并且编译完成
        			if(formulaEngineJb && formulaEngineJb.compleflag){
        				this.applyInitialFormulas();
        			}else{
        				setTimeout(function(){_this.execApplyInitialFormulas(startTime)},150);
        			}
        		}else{
        			this.applyInitialFormulas();
        		}
    		}else{
    			setTimeout(function(){_this.execApplyInitialFormulas(startTime)},150);
    		}
        	
        };
        /**
         * PUBLIC: Update formula with specify expression.<BR>
         * 外部方法：更新公式, 用指定的公式字符串来更新公式对象, 引擎将进行重编译和重索引.
         * @param cfgFormula ConfigObject: New formula configuration. 新公式配置信息.
         */
        FormulaEngine.prototype.appendFormula = function(cfgFormula){
            var newFormula = this.createFormulaObject(cfgFormula);
            var tmp = this.add2List(newFormula);
            if (tmp) {
                this.doClean(true);
                this.initialize(true);
            } else {}
        };
        /**
         * PUBLIC: Update formula with specify expression.<BR>
         * 外部方法：更新公式, 用指定的公式字符串来更新公式对象, 引擎将进行重编译和重索引.
         * @param objFormula FormulaObject: Original formula object. 原公式对象（将被替换）.
         * @param cfgFormula ConfigObject: New formula configuration. 新公式配置信息.
         */
        FormulaEngine.prototype.updateFormula = function(objFormula, cfgFormula){
            var temp = { "id" : cfgFormula.id || objFormula.id,
                "type" : cfgFormula.type || objFormula.type, "desc" : cfgFormula.desc,
                "formula" : cfgFormula.formula, "target" : cfgFormula.target,
                "tips" : cfgFormula.tips };
            this.createFormulaObject(temp, objFormula);
            this.doClean(true);
            this.initialize(true);
        };
        /**
         * PUBLIC: Update formula with specify expression.<BR>
         * 外部方法：更新公式, 用指定的公式字符串来更新公式对象, 引擎将进行重编译和重索引.
         * @param objFormula FormulaObject: Original formula object. 原公式对象（将被替换）.
         * @return boolean.
         */
        FormulaEngine.prototype.deleteFormula = function(objFormula){
            if (objFormula) {
                if (this.getFormulaById(objFormula.id)) {
                    this.delete4List(objFormula);
                    this.doClean(true);
                    this.initialize(true);
                } else {
                    dhtmlx.message("公式引擎中找不到指定要删除的公式。", "error", 5000);
                }
            } else {
                dhtmlx.message("指定要删除公式对象为空。", "error", 5000);
            }
            return false;
        };
        /**
         * PUBLIC: Test formula for debuging. <BR>
         * 外部方法：测试公式，主要用于调试或编辑过程.
         * @param cfgFormula ConfigObject: New formula configuration. 新公式配置信息.
         * @returns Result after execution. 公式执行结果.
         * @see FormulaEngine.prototype.createFormulaObject()
         */
        FormulaEngine.prototype.testFormula = function(cfgFormula){
			this.jp.initialize(eval(this.basename));
            var objFormula = this.createFormulaObject(cfgFormula);
            if (this.resolveFormula(objFormula)) {
                var strAssResolved = objFormula.strAssResolved;
                var strExpResolved = objFormula.strExpResolved;
                var ret;
                if (objFormula.flagDynamicParam) {
                	var _subscript = 0;
                	if(cfgFormula.subscript){
                		_subscript = cfgFormula.subscript;
                	}
                    // TODO: Currently only support one dynamic parameter.
                    if (strAssResolved) {
                    	strAssResolved = this.twoDynamicReplace(_subscript, strAssResolved)
                    }
                    strExpResolved = this.twoDynamicReplace(_subscript, strExpResolved)
                } else if (objFormula.flagAggregation) {
                    var tmp = this.resolveExpressionFull(objFormula.strExpression);
                    strExpResolved = tmp.resolved;
                } else {
                    // Simple formula calculate
                }
                ret = this.execute(strAssResolved, strExpResolved);
                return ret;
            }
            throw objFormula.lastError;
        };
        /**
         * PUBLIC: Replace macro-expression for text. 外部方法：对字符串进行计算表达式宏替换操作.
         * 
         * <pre>
         * textSubstitution("你好：{{$..zzssyyybnsr_zb.sbbhead.nsrmc}}")
         *      => 你好：方欣科技有限公司
         * textSubstitution("本月数（当前值:{{$..zbGridlbVO[0].asysljsxse}}）必须小于累计数（当前值:{{$..zbGridlbVO[1].asysljsxse}}）") 
         *      => 本月数（当前值:888）必须小于累计数（当前值:123）
         * </pre>
         * 
         * @param text String: Text with macro-expression. 字符串：包含表达式宏的文本串.
         */
        FormulaEngine.prototype.textSubstitution = function(text,_subscript){
            if ("string" !== typeof text || text.length <= 0) {
                return;
            }
            var regExpress = /\{\{([^}]*)\}\}/g;
            var ret = "";
            var lastPos = 0;
            do {
                // Searching
                var result = regExpress.exec(text);
                // console.log(result);
                if (null == result) {
                    ret += text.substr(lastPos, text.length - lastPos);
                    break;
                }
                ret += text.substr(lastPos, result.index - lastPos);
                // Calculation
                var cal = this.testFormula({ "type" : "02", "formula" : result[1],"subscript":_subscript });
                // Replacement
                ret += cal;
                lastPos = regExpress.lastIndex;
            } while (regExpress.lastIndex < text.length);
            return ret;
        };
        /**
         * PUBLIC: Get formula object by formula's id. <BR>
         * 外部方法：根据ID查询公式对象.
         * @param formulaId String: Formula's id. 公式的ID（唯一标识符）.
         * @returns FormulaObject: Return undefined if not founded. 公式对象.
         */
        FormulaEngine.prototype.getFormulaById = function(formulaId){
            return this.idxId2Formulas[formulaId];
        };
        /**
         * PUBLIC: Get formula object by formula's assignment. <BR>
         * 外部方法：根据赋值部分查询公式对象.
         * @param strAssign String: Formula's assignment part. 公式的赋值部分（等号左侧的对象）.
         * @returns FormulaObject: Return undefined if not founded. 公式对象.
         */
        FormulaEngine.prototype.getFormulaByAssignment = function(strAssign, flagIncludeDynamic){
            if (strAssign.substr(0, 2) !== "$.") {
                strAssign = "$." + strAssign;
            }
            var objFormula = undefined;
            if (flagIncludeDynamic) {
                var dynAssign = (/\[\d+\]/.exec(strAssign)) ? // Check array index.
                strAssign.replace(/\[\d+\]/g, "[#]") // Genarate dynamic array index.
                : null; // No needs.
                objFormula = this.idxAssign2Formulas[strAssign]
                    || this.idxAssign2Formulas[dynAssign] || undefined;
            } else {
                objFormula = this.idxAssign2Formulas[strAssign];
            }

            if(Object.prototype.toString.call(objFormula) == "[object Array]"){
                objFormula = objFormula[0];
            }

            return objFormula;
        };
        FormulaEngine.prototype.getFormulaIdByAssignment = function(strAssign, flagIncludeDynamic){
            var objFormula = this.getFormulaByAssignment(strAssign, flagIncludeDynamic);
            return (objFormula) ? objFormula.id : undefined;
        };
        /**
         * PUBLIC: Get formula object by formula's assignment. <BR>
         * 外部方法：临时性禁用公式（当次有效），主要用于纳税人手工修改单元格值.
         * @param strAssign String: Formula's assignment part. 公式的赋值部分（等号左侧的对象）.
         * @returns Boolean. true, 更改状态成功；false, 更改状态失败。
         */
        FormulaEngine.prototype.disableFormulaById = function(formulaId){
            //TODO: 如果纳税人暂存表单后冲田或者导入外部数据，还无法自动暂停缓存公式。
            //TODO: 还不支持动态参数公式
            var objFormula = this.idxId2Formulas[formulaId];
            if (objFormula && !objFormula.flagDisable) {
                objFormula.flagDisable = true;
                return true;
            }
            return false;
        };
        /**
         * PUBLIC: Get formula object by formula's assignment. <BR>
         * 外部方法：临时性禁用公式（当次有效），主要用于纳税人手工修改单元格值.
         * @param strAssign String: Formula's assignment part. 公式的赋值部分（等号左侧的对象）.
         * @returns Boolean. true, 更改状态成功；false, 更改状态失败。
         */
        FormulaEngine.prototype.enableFormulaById = function(formulaId){
            //TODO: 还不支持动态参数公式
            var objFormula = this.idxId2Formulas[formulaId];
            if (objFormula && objFormula.flagDisable) {
                objFormula.flagDisable = false;
                this.calculationPlanningOfList([ objFormula ], undefined, true);
                return true;
            }
            return false;
        };

        /**
         * PUBLIC: delete idxVariable object by jpath. <BR>
         * 外部方法：删除校验不通过记录(主要作用于用户删除存在校验不通过的动态行时，以及其他情况).
         * @param jpath.
         */
        FormulaEngine.prototype.deleteIdxVariableNoPass = function(jpath, dynamicIdx){
            var idxVariable2NoPassFull = this.idxVariable2NoPass;
            var idx = (/\[\d+\]/.exec(jpath))[0];
            var var2NoPass = this.idxVariable2NoPass[jpath];
            if(var2NoPass){
                $.each(var2NoPass, function(id, FormulaObject){
                    if(id === "idx"){
                        return;
                    }
                	if(FormulaObject.lstTargetResolved && FormulaObject.lstTargetResolved.length > 0){
                		//如果有target解析。则使用target进行删除
                		/**
                		 *lstTargetResolved结构 :
                		 * [{
						 *	   "jpath": "$..glgxbGridlbVO[#].glgxlxDm",
						 *	   "variable": "qyndglywwlbgywbw.qyndglywwlbg2016_G101000.glgxbGrid.glgxbGridlbVO[#].glgxlxDm"
						 *	}]
                		 */
                		$.each(FormulaObject.lstTargetResolved, function(id, obj){
                			if(typeof dynamicIdx === "undefined"){
                				dynamicIdx = [idx.replace('[','').replace(']','')];
                			}
                			lstVariable = formulaEngine.twoDynamicReplace(dynamicIdx, obj.variable);
                			
	                        if(idxVariable2NoPassFull[lstVariable]) {
	                            delete idxVariable2NoPassFull[lstVariable];
	                        }
	                    });
                	}else{
	                    $.each(FormulaObject.lstVariables, function(id, lstVariable){
	                    	if(typeof dynamicIdx === "undefined"){
                				dynamicIdx = [idx.replace('[','').replace(']','')];
                			}
	                    	lstVariable = formulaEngine.twoDynamicReplace(dynamicIdx, lstVariable);
	                        if(idxVariable2NoPassFull[lstVariable]) {
	                            delete idxVariable2NoPassFull[lstVariable];
	                        }
	                    });
                	}
                });
            }

            this.idxVariable2NoPass = idxVariable2NoPassFull;
        };

        FormulaEngine.prototype.getFormulasByVariables = function(jpaths){
            var rets = [], tmps = [];
            for (var i = 0; i < jpaths.length; i++) {
                tmps = tmps.concat(this.getFormulasByVariable(jpaths[i]));
            }
            // TODO: Low performance distinct
            for (var i = 0; i < tmps.length; i++) {
                var k = 0;
                if (this.rightSubstr(tmps[i].type, 1) === "1") {
                    for (; k < rets.length; k++) {
                        if (this.rightSubstr(rets[k].type, 1) !== "1") {
                            continue;
                        } else if (tmps[i] === rets[k]) {
                            break;
                        }
                    }
                } else {
                    k = rets.length + 1;
                }
                if (k >= rets.length) {
                    rets.push(tmps[i]);
                }
            }
            return rets;
        };
        /**
         * PUBLIC: Get formula object by formula's variable. <BR>
         * 外部方法：根据公式所包含变量（JSON's jpath）查询公式对象.
         * @param strAssign String: Formula's variable. 公式所包含变量（JSON's jpath）.
         * @returns FormulaObjects: Return undefined if not founded. 公式对象.
         */
        FormulaEngine.prototype.getFormulasByVariable = function(jpath){
            var rets = [];
            if (jpath.substr(0, 2) === "$.") {
                jpath = jpath.substr(2);
            }
            var dynJpath = (/\[\d+\]/.exec(jpath)) ? // Check array index.
            jpath.replace(/\[\d+\]/g, "[#]") // Genarate dynamic array index.
            : null; // No needs.
            if (this.idxVariable2Formula[jpath]) {
                //rets = rets.concat(this.idxVariable2Formula[jpath]);
                rets.push.apply(rets, this.idxVariable2Formula[jpath]);
            }
            if (dynJpath && this.idxVariable2Formula[dynJpath]) {
                //rets = rets.concat(this.idxVariable2Formula[dynJpath]);
                rets.push.apply(rets, this.idxVariable2Formula[dynJpath]);
            }
            var objFormula = this.getFormulaByAssignment(jpath, true);
            if (objFormula) {
                //rets.push(objFormula);
                rets.push.apply(rets, objFormula);
            }
            return rets;
        };
        /**
         * PRIVATE: Clean all those various list and index.
         * @param flagDoNotClear boolean. True: clear all list and index; Flase: clear index and remain list.
         */
        FormulaEngine.prototype.doClean = function(flagDoNotClear){
            if (!flagDoNotClear) {
                this.lstAllFormulas = []; // All loaded formulas
                this.lstCalculateFormulas = []; // Calculate formulas about '01' or'11'
                this.lstInitialFormulas = []; // Initial formulas about '10' or '11'
                this.lstVerifyFormulas = []; // Verify formulas about '02'
                this.lstControlFormulas = [];
                this.lstCalculate2SubmitFormulas = [];// Calculate formulas about '21'
                this.idxId2Formulas = {};
                this.pointStart10 = 0;
                this.pointStart11 = 0;
            }
            this.idxVariable2NoPass = {};
            this.idxCurrentVariable2NoPass = {};
            this.idxVariable2Control = {};
            this.idxCurrentVariable2Control = {};
            this.idxAssign2Formulas = {};
            this.failedFormulas = [];
            this.idxVariable2Formula = {};
        };
        /**
         * PRIVATE: Append formula to all those various list, according to type. <BR>
         * 内部方法：将公式对象按照公式类型增加到各分类公式列表中, 便于后续索引使用.
         * @param objFormula FormulaObject. 公示对象.
         * @returns boolean, 公式类型是否能识别.
         */
        FormulaEngine.prototype.add2List = function(objFormula){
            switch (objFormula.type) {
                case '01': // Calculate formulas
                    this.lstCalculateFormulas.push(objFormula);
                    break;
                case '02': // Verify formulas
                case '12': // Verify & Initial formulas
                    this.lstVerifyFormulas.push(objFormula);
                    break;
                case '11': // Calculate & Initial formulas
                    this.lstCalculateFormulas.push(objFormula);
                    this.lstInitialFormulas.push(objFormula);
                    break;
                case '10': // Initial formulas
                    this.lstInitialFormulas.push(objFormula);
                    break;
                case '03':
                case '13':
                    this.lstControlFormulas.push(objFormula);
                    break;
                case '21':
                    this.lstCalculate2SubmitFormulas.push(objFormula);
                    break;
                case '32':
                	// formulaExecType：1=实时监控，初始化报文中返回otherData；0=事中监控，初始化报文中不返回otherData；2或其他=非实时非事中监控，初始化报文中不返回otherData C.Q 20170327
                	if (typeof formulaExecType !== "undefined") {
	                	if(formulaExecType === '1') {
	                		objFormula.type = '12';
	                		this.lstVerifyFormulas.push(objFormula);
	                	} else if(formulaExecType === '0') {
	                		this.lstVerifyFormulas.push(objFormula);
	                	}
                	}
                    break;
                default:
                    console.log("FormulaEngine: Formula type not supported[" + objFormula.type + "]: "
                        + objFormula.strFormula);
            }
            if (objFormula.type === "10") {
                this.lstAllFormulas.splice(this.pointStart10++, 0, objFormula);
                this.pointStart11++;
            } else if (objFormula.type === "11") {
                this.lstAllFormulas.splice(this.pointStart11++, 0, objFormula);
            } else {
                this.lstAllFormulas.push(objFormula);
            }
            if (this.idxId2Formulas[objFormula.id]) {
                var err = "WARN: formulaId duplicated [" + objFormula.id + "], original: "
                    + this.idxId2Formulas[objFormula.id].formula + ", newer: "
                    + objFormula.formula;
                console.log(err);
                objFormula.lastError = err;
                objFormula.flagCompiled = false;
                return false;
            } else {
                this.idxId2Formulas[objFormula.id] = objFormula;
                return true;
            }
        };
        FormulaEngine.prototype.delete4List = function(objFormula){
            var pos;
            // Calculate formulas
            pos = $.inArray(objFormula, this.lstCalculateFmulas);
            if (pos >= 0) {
                this.lstCalculateFormulas.splice(pos, 1);
            }
            // Verify formulas
            pos = $.inArray(objFormula, this.lstVerifyFormulas);
            if (pos >= 0) {
                this.lstVerifyFormulas.splice(pos, 1);
            }
            // Initial formulas
            pos = $.inArray(objFormula, this.lstInitialFormulas);
            if (pos >= 0) {
                this.lstInitialFormulas.splice(pos, 1);
            }
            // Control formulas
            pos = $.inArray(objFormula, this.lstControlFormulas);
            if (pos >= 0) {
                this.lstControlFormulas.splice(pos, 1);
            }
            // Calculate2Submit formulas
            pos = $.inArray(objFormula,this.lstCalculate2SubmitFormulas);
            if(pos >= 0) {
                this.lstCalculate2SubmitFormulas.splice(pos,1);
            }
            // All list
            pos = $.inArray(objFormula, this.lstAllFormulas);
            if (pos >= 0) {
                this.lstAllFormulas.splice(pos, 1);
            }
            // Index of formulaId
            delete this.idxId2Formulas[objFormula.id];
            return true;
        };
        /**
         * 缓存公式
         */
        FormulaEngine.prototype.cacheCompiledRules = function(){
            var _this = this;
            setTimeout(function () {
                if(_this.noPreCompiledRules.length > 0 && xlBz === 'N'){
                    $.ajax({
                        type : "POST",
                        url : contextPath+"/formula/saveCompileRule.do",
                        dataType : "json",
                        data: {'ywbm':ywbm,'djxh':$("#djxh").val(),'nsrsbh':$("#nsrsbh").val(),'test':$("#test").val(),
                            'swjgDm':$("#swjgDm").val(),'gdslxDm':$("#gdslxDm").val(),"rules":JSON.stringify(_this.noPreCompiledRules)
                        },
                        success : function() {
                            console.log("缓存数据成功," + _this.noPreCompiledRules.length);
                        }
                    });
                }
            }, 10);
        };
        /**
         * PRIVATE: Apply all initial formulas, including calculate formula and verify formula.<BR>
         * 内部方法：执行所有初始化公式，包括计算公式和校验公式.
         * extends:此方法中增加了1、初始化执行逻辑；2、增加附表逻辑；3、减少附表逻辑
         */
        FormulaEngine.prototype.applyInitialFormulas = function(){

        	var _start_ = new Date().getTime();
        	var _this = this;

            // First: execute initial calculate formula. 先执行初始化计算公式.
            // warning 加载保存数据、外部导入数据时，屏蔽执行初始化计算公式
            if(flagExecuteInitial) {
            	this.procVerifyFormulas = [];
                this.procVariableInStack = {};
                this.calculationPlanningOfList(this.lstInitialFormulas, undefined, true);
            }
            // 1.有暂存时，执行具有暂存执行标志的公式 A by C.Q 20180402
            // 2.有新增附表时，执行新增附表的公式
            // 3.有减表时执行减表公式
            if(!flagExecuteInitial) {
            	//获取新增附表列表
            	var xzfbs = [];
            	//新增附表数量
            	var xzfbsl = 0;
            	if(otherParams && otherParams.xzfb){
            		xzfbs = otherParams.xzfb.split(',');
            		xzfbsl = xzfbs.length;
            	}
            	
            	//如果存在减少附表的情况
            	// 减表对应的公式对象
            	var jbObjFormulas = {};
            	var jsfbs;
                if(otherParams && otherParams.jsfb){
                	jsfbs = otherParams.jsfb.split(',');
                	//减表初始化数据模型对应的formulaEngine
	                //1、针对初始化公式创建索引
                	var leftFlag=false, rightFlag=false;
	                for (var i = 0, l = formulaEngineJb.lstInitialFormulas.length; i < l; i++) {
	                	var objFormula = formulaEngineJb.lstInitialFormulas[i];
	                	if(objFormula.flagCompiled){
	                		for(var j = 0, fblen = jsfbs.length; j < fblen; j++){
	                			var jsfb = jsfbs[j];
	                			//左边节点在减表附表中
	                			if( typeof(objFormula.strAssResolved) != "undefined" 
								 	&& objFormula.strAssResolved != null 
								 	&& objFormula.strAssResolved.indexOf(jsfb) > -1
								){
	                				leftFlag=true;
	                				break;
							  	}else if(!rightFlag){
							  		//右边节点在减表附表中
	                				if(typeof(objFormula.strExpResolved) != "undefined" 
    									  && objFormula.strExpResolved != null 
    									  && objFormula.strExpResolved.indexOf(jsfb) > -1 
    								){
										  rightFlag = true;	 
	                				}
							  	}
	                		}
	                		if(!leftFlag && rightFlag){
	                		     //把左边节点不在减表附表中、右边节点在减表附表中的公式加入到jbObjFormulas中
	                			 jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'N';
	                		}
	                		leftFlag=false;
               			 	rightFlag=false;
    	                }
	                }
	                //2、针对计算公式创建索引
	                for (var i = 0, l = formulaEngineJb.lstCalculateFormulas.length; i < l; i++) {
	                	var objFormula = formulaEngineJb.lstCalculateFormulas[i];
    	                if(objFormula.flagCompiled){
    	                	for(var j = 0, fblen = jsfbs.length; j < fblen; j++){
	                			var jsfb = jsfbs[j];
	                			//左边节点在减表附表中
	                			if( typeof(objFormula.strAssResolved) != "undefined" 
								 	&& objFormula.strAssResolved != null 
								 	&& objFormula.strAssResolved.indexOf(jsfb) > -1
								){
	                				leftFlag=true;
	                				break;
							  	}else if(!rightFlag){
							  		//右边节点在减表附表中
	                				if(typeof(objFormula.strExpResolved) != "undefined" 
    									  && objFormula.strExpResolved != null 
    									  && objFormula.strExpResolved.indexOf(jsfb) > -1 
    								){
										  rightFlag = true;	 
	                				}
							  	}
	                		}
    	                	if(!leftFlag && rightFlag){
                                 //把左边节点不在减表附表中、右边节点在减表附表中的公式加入到jbObjFormulas中
	                			 jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'N';
	                		}
    	                	leftFlag=false;
               			 	rightFlag=false;
    	                }
	                }
                }
            	
            	var lstZcInit = [];
            	//循环初始化公式
            	for (var i = 0, l = this.lstInitialFormulas.length; i < l; i++) {
            		 var objFormula = this.lstInitialFormulas[i];
            		 if(objFormula.zcInit=='Y') {
            			 lstZcInit.push(objFormula);
            		 }else{
            			 //处理新增附表逻辑
            			 if(xzfbsl > 0){
            				 for(var j = 0; j < xzfbsl; j++){
            					 var xzfb = xzfbs[j];
            					 if(objFormula.flagCompiled
            							 && ((typeof(objFormula.strAssResolved) != "undefined" 
            								 	&& objFormula.strAssResolved != null 
            								 	&& objFormula.strAssResolved.indexOf(xzfb) > -1)
            								  || (typeof(objFormula.strExpResolved) != "undefined" 
            									  && objFormula.strExpResolved != null 
            									  && objFormula.strExpResolved.indexOf(xzfb) > -1))){
            						 //如果JSON全路径的公式左边或者JSON全路径的公式的右边包含新增的附表，则这些公式需要执行
            						 console.log("增加附表时需要执行的公式："+objFormula.id+"="+objFormula.strAssResolved);
            						 lstZcInit.push(objFormula);
            					 }
            				 }
            			 }else{
            				 //5、处理减少附表逻辑
            				 if(otherParams && otherParams.jsfb){
            					 //执行formula中的（11、01、10）公式，且这些公式的左边节点必须在formula2中的左边节点中存在
            					 if (objFormula.flagCompiled) {
            						 if(jbObjFormulas[objFormula.strAssResolved + objFormula.type]){   //TODO 此处有bug
            							 //当一个格子存在两条初始化公式时，此逻辑错误，因为只执行了第一条公式 todo 黄健帮忙找个实例
            							 console.log("减少附表时需要执行的公式1："+objFormula.id+"="+objFormula.strAssResolved);
            							 lstZcInit.push(objFormula);
            							 //delete jbObjFormulas[objFormula.id];
            							 //表示此jpath已经执行过
            							 jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'Y';
            						 }
            					 }
            				 }
            			 }
            		 }
            	}
            	
                //6、执行触发计算公式
                if(otherParams && otherParams.jsfb){
                	//执行formula中的（11、01、10）公式，且这些公式的左边节点必须在formula2中的左边节点中存在
                	for (var i = 0, l = this.lstCalculateFormulas.length; i < l; i++) {
                		var objFormula = this.lstCalculateFormulas[i];
                        if(objFormula.flagCompiled) {
                            //处理减少附表逻辑,删除非减少附表的公式
                            if (jbObjFormulas[objFormula.strAssResolved + objFormula.type]) {
                                //当一个格子存在两条初始化公式时，此逻辑错误，因为只执行了第一条公式 todo 黄健帮忙找个实例
                                console.log("减少附表时需要执行的公式1：" + objFormula.id + "=" + objFormula.strAssResolved);
                                lstZcInit.push(objFormula);
                                jbObjFormulas[objFormula.strAssResolved + objFormula.type] = 'Y';
                            }
                        }
                	}
                }
                
            	this.procVerifyFormulas = []; 
                this.procVariableInStack = {};
                this.calculationPlanningOfList(lstZcInit, undefined, true,{"type":"_zcInit"});
                
                //7、减表时赋值，并执行
                var exp, val;
                $.each(jbObjFormulas, function(jpath, val){
                	//判断jpath是否已经在前面执行过
                	if(val === 'N'){
                		//去掉最后两位公式类型
                		jpath = jpath.substr(0,jpath.length-2);
                		if(_this.existJpathInFormData(jpath.replace('$','FSformData2'))){
                    		eval('val ='+jpath.replace('$','FSformData2')); 
                    		// formData中存在节点则执行
                    		if(_this.existJpathInFormData(jpath.replace('$','formData'))){
                    			exp = jpath.replace('$','formData')+'='+jpath.replace('$','FSformData2');
                        		//执行赋值
                        		eval(exp);
                        		//根据jpath获取formdata2的节点数据，并执行到formdata节点中
                        		//去掉$.
                        		console.log("减少附表时需要执行的公式："+jpath.replace('$.','')+"="+val);
                        		_this.apply(jpath.replace('$.',''), val, null);
                    		}
                		}
                	}
                });
            }


            //执行外部导致的赋值公式，1、判断值有发生变化才需要执行
            this.executeWbcshFormula();
			//申报查看功能，不执行校验公式和控制公式
            if(parent.location.href.indexOf("lookBack=Y")>-1 || parent.location.href.indexOf("yslookBack=Y")>-1){
        		return;
        	}
                // Second: execute initial control formula. 再执行初始化控制公式.
                var _start_control = new Date().getTime();
                var controls = this.lstControlFormulas;
                for (var i = 0; i < controls.length; i++) {
                    var objFormula = controls[i];
                    if ("1" === objFormula.type.substr(0, 1)) { // Checking initial sign.
                        objFormula.lastControl = this.execNoCaculateFormula(objFormula);
                        this.effectingControl(objFormula.lastControl, objFormula.lstTargetResolved);
                    }
                }
                var _end__control = new Date().getTime();
                console.log("INFO:" + _start_control + "-" + _end__control + "-" + (_end__control - _start_control)
                    + "ms 执行初始化控制公式[" + controls.length + "]条");
                // Thrid: execute initial verify formula. 再执行初始化校验公式.
                var _start_verifie = new Date().getTime();
                var verifies = this.lstVerifyFormulas;
                this.procVerifyFormulas = [];
                for (var i = 0; i < verifies.length; i++) {
                    if ("1" === verifies[i].type.substr(0, 1) || !flagExecuteInitial) { // Checking initial sign.
                        //this.execNoCaculateFormula(verifies[i]);执行校验表达式没起到实际作用
                        this.procVerifyFormulas.push(verifies[i]);
                    }
                }

                this.applyAssociatedFormulaVerify(null);
                var _end_verifie = new Date().getTime();
                console.log("INFO:" + _start_verifie + "-" + _end_verifie + "-" + (_end_verifie - _start_verifie)
                    + "ms 执行初始化校验公式[" + this.procVerifyFormulas.length + "]条");
                this.procVerifyFormulas = [];

                var _end_ = new Date().getTime();
                // hwping 增加公式执行结束标识
                flagExcuted = true;
                console.log("INFO:"+_start_+ "-" +_end_ + "-" +(_end_ - _start_)+ "ms 公式执行(applyInitialFormulas)");
        };
        /**
         * 执行外部初始化公式，适应于金财管家提交发票汇总数据到电局系统进行申报
         *
         */
        FormulaEngine.prototype.executeWbcshFormula = function(){
            var _start_ = new Date().getTime();

            var _this = this;
            var $wbcsh = $("#wbcsh").val();
            var lstWbcshInit = [];
            if(typeof $wbcsh !== 'undefined' && $wbcsh !== null
                && $wbcsh !== "null" && $wbcsh !== ""){

                $wbcsh = Base64.decode($wbcsh);
                $wbcsh = eval('('+$wbcsh+')');

                //执行外部初始化过滤
                var _start_FilterWbcsh = new Date().getTime();
                if(typeof filterWbcsh === "function"){
                    //由业务自行实现过滤规则（在ywbm.js重写filterWbcsh）
                    $wbcsh = filterWbcsh($wbcsh);
                    console.log("执行业务过滤方法，过滤后结果：" + JSON.stringify($wbcsh));
                }
                var _end_FilterWbcsh = new Date().getTime();
                console.log("INFO:"+_end_FilterWbcsh+"-"+_end_FilterWbcsh+"-"+(_end_FilterWbcsh - _start_FilterWbcsh)
                    +"ms 过滤外部初始化");

                var objFormulas = new Array();
                var idx = 0;

				var qzsx = $("#wbcshQzsx").val();
	            if(qzsx == '' || qzsx == null || qzsx == undefined){
	                qzsx = 'Y';
	            }

                $.each($wbcsh, function (key, val) {
                    if(key.indexOf('[#') > -1 && Object.prototype.toString.call(val) == "[object Array]" && val.length > 0){
                        lstWbcshInit = lstWbcshInit.concat(_this.initWbcshDynamicFormula(key, val));
                    } else {
                        objFormulas = _this.initWbcshFormula(key, val, idx++);

                        if (key.indexOf('[') > -1) {
                            // 判断节点是否存在
                            if (!_this.existJpathInFormData("formData." + key)) {
                                _this.jpathNodeCreate("$." + key);
                            }
                        }

                        if (formData.wbcsh) {
                            // formData中的节点值不等于外部初始化节点的值时，公式需要重新执行
                        /**
                         * 最初逻辑定义：当外部数据与暂存数据不一致就刷新数据。
                         * 值不一致有两种情况：1、本次发票数据与上一次发票数据不一致；
                         * 2、本次发票数据与申报表数据不一致（纳税人手工修改或其他模式调整数据）
                         * 以上两种情况满足其一即符合值不一致的判定。
                         *
                         * 注：第二种情况刷新数据的出发点是发票数据的信任度更高，更可靠。
                         *
                         * 20190508 修改：针对第二种情况，采用可变参数决定是否刷新。
                         *
                         * 实现效果:
                         *  当传入wbcshQzsx参数为空，强制刷新，延续以前的逻辑，值不一致就刷新。
                         *  当传入wbcshQzsx参数为Y，强制刷新，同上。
                         *  当传入参数为N，不强制刷新，当且仅当发票数据发生变化才进行刷新。
                         *
                         * 相关传参关联：发票汇总页有读取和刷新按钮，当触发读取和刷新按钮后，传参wbcshQzsx为Y，进行强制刷新发票数据。
                         * 否则，发票汇总页默认传参为空。
                         * 填表页进入时，当传参为空时，读取配置表参数配置。
                         *
                         * 广东和大连配置为N。实现发票数据不变化且为刷新读取发票，不刷新发票数据。关联问题单：DLGS-1616
                         */
                        if(formData.wbcsh[key] !== val || (qzsx == 'Y' && eval("formData."+key) !== val)){
                                // 已经暂存节点值为"",则将其值修改为0
                                if (val === '') {
                                    var formulasLen = objFormulas.length;
                                    for (var i = 0; i < formulasLen; i++) {
                                        var objFormula = objFormulas[i];
                                        objFormula.strExpResolved = 0;
                                        objFormula.strExpression = 0;
                                        objFormula.formula = "$." + key + "=" + 0;
                                    }
                                }
                                lstWbcshInit = lstWbcshInit.concat(objFormulas);
                            }
                        } else {
                            //formData中没有外部初始化节点
                            // 没有暂存节点值为"",则不执行赋值公式
                            if (JSON.stringify(eval("formData." + key)) === "{}" || val !== '') {
                                lstWbcshInit = lstWbcshInit.concat(objFormulas);
                            }
                        }
                    }
                });

                //外部初始化计算公式索引，索引结构{strAssResolved(公式左边节点全路径):外部初始化公式对象}
                this.idxWbcshCalculate2Formula = {};
                var len = lstWbcshInit.length;
                for(var i = 0; i < len; i++){
                    var formula = lstWbcshInit[i];
                    this.idxWbcshCalculate2Formula[formula.strAssResolved] = formula;
                }

                //执行外部初始化公式
                _this.calculationPlanningOfList(lstWbcshInit, undefined, true);
                //_this.applyWbcshFormula(lstWbcshInit);

                // 将外部初始化的数据赋值到formData保存到暂存报文中
                formData['wbcsh'] = $wbcsh;
                //重置外部初始化计算公式索引，避免影响正常填写公式执行
                this.idxWbcshCalculate2Formula = {};
            }

            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)
                +"ms 执行外部初始化公式[" + lstWbcshInit.length+"]条");
        };

        /**
         * 通过apply方式执行外部初始化公式，适应于金财管家提交发票汇总数据到电局系统进行申报
         * 之前的执行逻辑有问题，如存在a=b+c；给要素a=2，b=1；则a给的要素的值会被执行完a=b+c的值覆盖
         * 目前采用apply(jpath)的方式，这样才能真正模拟纳税人的操作，但是可能存在执行效率的问题
         */
        FormulaEngine.prototype.applyWbcshFormula = function(lstWbcshInit){
            if(lstWbcshInit && lstWbcshInit.length > 0){
                for (var i = 0; i < lstWbcshInit.length; i++) {
                    var objFormula = lstWbcshInit[i];
                    var formulaStr = objFormula.formula;

                    formulaStr = formulaStr.replace("$.","formData.");
                    eval(formulaStr);

                    var jpath = formulaStr.substr(0,formulaStr.indexOf("=")).replace("formData.","");
                    //var value = formulaStr.substr(formulaStr.indexOf("=") + 1);

                    //this.apply(jpath, value);

                    var dynamicParams;
                    var l = jpath.match(/\[\d+\]/g);
                    if(l != null){
                        if(l.length === 2){
                            var pIdx = l[0].replace(']','').replace('[','');
                            var cIdx = l[1].replace(']','').replace('[','');
                            dynamicParams = [pIdx,cIdx];
                        }else{
                            var idx = l[0].replace(']','').replace('[','');
                            dynamicParams = [idx];
                        }
                    }

                    this.calculationPlanningOfJPath(jpath, dynamicParams);
                }
            }
        };

        /**
         * 执行外部初始化公式，适应于金财管家提交发票汇总数据到电局系统进行申报
         *
         */
        FormulaEngine.prototype.initWbcshFormula = function(key, val, idx){
            //初始化外部初始化公式
            var init =  function(id) {
                var objFormula = new FormulaObject();
                objFormula.strAssResolved = "$." + key ;
                objFormula.strAssignment = "$." + key ;

                if(typeof val === 'string'){
                    objFormula.strExpResolved = "'" + val + "'" ;
                    objFormula.strExpression = "'" + val + "'" ;
                    objFormula.formula = "$." + key + "='" + val + "'";
                }else{
                    objFormula.strExpResolved = val ;
                    objFormula.strExpression = val ;
                    objFormula.formula = "$." + key + "=" + val;
                }

                objFormula.flagCompiled = true;
                objFormula.type = "10";
                objFormula.id = id;

                return  objFormula;
            };

            var objFormulas = new Array();
            //为外部初始化公式随机生成公式id
            objFormulas.push(init("0000000" + idx));

            return objFormulas;
        };
        /**
         * 判断jpath是否在数据模型中存在
         * 
         */
        FormulaEngine.prototype.existJpathInFormData = function(jpath){
			try{
				var isExist;
				eval('isExist = ' + jpath);
				if (typeof isExist === 'undefined') {
					return false;
				}
			}catch(e){
				return false;
			}
			return true;
		};
        /**
         * PRIVATE: Apply all runTime formulas, including calculate formula and verify formula.<BR>
         * 内部方法：执行所有运行期公式，包括计算公式和校验公式.
         */
        FormulaEngine.prototype.applyImportFormulas = function(caculate){
            // First: execute initial calculate formula. 先执行计算公式.01，11
            
        	this.procVerifyFormulas = []; 
            this.procVariableInStack = {};
            if(caculate){
            	this.calculationPlanningOfList(this.lstCalculateFormulas, undefined, true);
            }
            
            // Second: execute initial control formula. 再执行初始化控制公式.
            var controls = this.lstControlFormulas;
            for (var i = 0; i < controls.length; i++) {
                var objFormula = controls[i];
                if ("1" === objFormula.type.substr(0, 1) || true) { // Checking initial sign.
                    objFormula.lastControl = this.execNoCaculateFormula(objFormula);
                    this.effectingControl(objFormula.lastControl, objFormula.lstTargetResolved);
                }
            }
            // Thrid: execute initial verify formula. 再执行初始化校验公式.
            var verifies = this.lstVerifyFormulas;
            this.procVerifyFormulas = [];
            for (var i = 0; i < verifies.length; i++) {
                if ("1" === verifies[i].type.substr(0, 1) || true) { // All
                    //this.execNoCaculateFormula(verifies[i]);执行校验表达式没起到实际作用
                    this.procVerifyFormulas.push(verifies[i]);
                }
            }
            this.applyAssociatedFormulaVerify(null);
            this.procVerifyFormulas = [];
        };
        /**
         * PUBLIC: Apply JSON-data changed, will execute all relative formulas. <BR>
         * 外部方法：针对级联下拉框，执行数据模型更新（针对特定JPath）, 将指定关联计算公式及校验公式.
         * @param jpath JPath of JSON-data, must be full-path. 数据模型的全路径JPath.
         * @param newValue, 更新的值.
         */
        FormulaEngine.prototype.apply4AffNode = function(jpath, newValue, dynamicIdx){
        	if(newValue == null) {
        		newValue = '';
        	}
            try{
                eval(this.basename+'.'+jpath+'="'+newValue+'"');
            } catch(ex){
            	//console.log(ex);
            }
        	this.apply(jpath, newValue, dynamicIdx);
        };
        /**
         * PUBLIC: Apply JSON-data changed, will execute all relative formulas. <BR>
         * 外部方法：执行数据模型更新（针对特定JPath）, 将指定关联计算公式及校验公式.
         * @param jpath JPath of JSON-data, must be full-path. 数据模型的全路径JPath.
         * @param iHandle 自定义处理 json 格式字符串，用于拓展处理
         * @param newValue, 更新的值.
         */
        FormulaEngine.prototype.apply = function(jpath, newValue, dynamicIdx,iHandle){
            console.log("FormulaEngine.apply: " + jpath + " => " + newValue);
            var _ms_ = new Date().getTime();
            for (var _t_ = 0; _t_ < _TEST_TIMES_; _t_++) {
                // Initial:
                /*this.procVerifyFormulas = []; // Temporary variable for processing: involved verify-formulas.
                this.procContorlFormulas = []; // Temporary variable for processing: involved control-formulas.
                this.procVariableInStack = {}; // Temporary variable for processing: variable in calling-stack.*/
                
                var dynamicParams = dynamicIdx;
                if(dynamicParams == null || typeof dynamicParams === "undefined"){
                	var l = jpath.match(/\[\d+\]/g);
                	if(l != null){
                		if(l.length === 2){
                			var pIdx = l[0].replace(']','').replace('[','');
            				var cIdx = l[1].replace(']','').replace('[','');
            				dynamicParams = [pIdx,cIdx];
                		}else{
                			var idx = l[0].replace(']','').replace('[','');
                			dynamicParams = [idx];
                		}
                	}
                }else if(dynamicIdx.length === 1){
                	//此为原始逻辑，应为jpath下标始终未[0],故此处解析出来也始终是[0]
                	var regBasket = this.regBasket;
                    regBasket.lastIndex = 0;
                    var tmpResult = regBasket.exec(jpath);
                    if (tmpResult) {
                        // TODO: Currently only support one dynamic parameter.
                        dynamicParams = [ tmpResult[1] ];
                    }
                }
                
                // First: execute associated calculate.
                //this.formulaCalculate(jpath, dynamicParams);
                this.calculationPlanningOfJPath(jpath, dynamicParams,null,iHandle);
                // Second: execute associated verify-formula.
                /** modify: this.applyAssociatedFormulaVerify(dynamicParams) -> 
                 * 				this.applyAssociatedFormulaVerify(null) 
                 * 原因 : 业务场景：a动态行公式 -> 触发 -> b非动态行公式 -> 触发 -> c动态行校验和非动态行校验
                 * 		 对应动态行参数：dynamicParams       null                null
                 * 此处执行校验公式集合c时，批量执行带参数会导致动态行校验公式漏执行或下标错位。
                 * 故进行删除，无参执行。
                 */
                this.applyAssociatedFormulaVerify(dynamicParams);
                // Third: execute associated control-formula.
                /**
                 * modify: this.applyAssociatedFormulaControl(dynamicParams) -> 
                 * 				this.applyAssociatedFormulaControl(null) 
                 * 原理同上。
                 */
                this.applyAssociatedFormulaControl(dynamicParams);
                // Destroy:
                /*this.procVerifyFormulas = [];
                this.procContorlFormulas = [];
                this.procVariableInStack = {};*/
            }
            _ms_ = new Date().getTime() - _ms_;
            console.log("Calculate " + _TEST_TIMES_ + " in " + _ms_ + "ms, per: "
                + (_ms_ / _TEST_TIMES_));
        };

        /**
         * PUBLIC: Execute Calculate Formulas before submission. <BR>
         * 外部方法：提交前执行计算赋值公式.
         * @param .
         * @warning 目前只做了赋值操作，并未触发联动计算.
         */
        FormulaEngine.prototype.Calculate2SubmitFormulas = function() {
            //this.calculationPlanningOfList(this.lstCalculate2SubmitFormulas, undefined, false);
            for(var i = 0; i < this.lstCalculate2SubmitFormulas.length; i++) {
                this.execNoCaculateFormula(this.lstCalculate2SubmitFormulas[i]);
            }
        };

        /**
         * PRIVATE: Execute associated control formulas. Needs processing variable "this.procContorlFormulas". <BR>
         * 内部方法：执行所有关联校验公式, 依赖过程变量"this.procContorlFormulas", 结果会更新变量"this.idxVariable2Control".
         * 
         * <pre>
         * this.idxVariable2Control = { 
         *     jpath_1 : { 
         *         "readonly": true
         *     }, jpath_2 : { 
         *         "readwrite": true, 
         *         "bg-color=#FFDDDD": true, 
         *         "font-color=#008888": true 
         *     }
         * }
         * </pre>
         * 
         * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.applyAssociatedFormulaControl = function(dynamicParams){
            //业务中台自动化测试 记录执行的公式
            if(flagYwztAutoTest && typeof parent.saveFormula === "function"){
                var _this = this;
                setTimeout(function() {
                    parent.saveFormula(_this.procContorlFormulas);
                });
            }

            var controls = this.procContorlFormulas;
            if (controls) {
                for (var c = 0; c < controls.length; c++) {
                    var objFormula = controls[c];
                    //当公式存在全量执行标志时则动态行的整个列都需要执行
                    if(objFormula.dthQlzxBz === 'Y'){
                    	objFormula.lastControl = this.execNoCaculateFormula(objFormula, null);
                        this.effectingControl(objFormula.lastControl, objFormula.lstTargetResolved,null);
                    }else{
                    	objFormula.lastControl = this.execNoCaculateFormula(objFormula, dynamicParams);
                        this.effectingControl(objFormula.lastControl, objFormula.lstTargetResolved,
                        		dynamicParams);
                    }
                	
                }
            }
        };
        FormulaEngine.prototype.effectingControl = function(pass, targets, dynamicParams){
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var name = target.variable;
                var control = target.control;
                if (name && control) {
                    if (dynamicParams && !(pass instanceof Array)) {
                    	name = this.twoDynamicReplace(dynamicParams,name);
                    }
                    if(pass instanceof Array){
                    	// 如果无动态行参数,且结果为动态行。遍历，进行插入。动态行结果（#），target应该为数组。
                    	for(var k = 0;k < pass.length; k++){
                    		var tmp_name = name.replace(/\[#\]/g, "[" + k + "]");
                    		if (!this.idxVariable2Control[tmp_name]) {
                                this.idxVariable2Control[tmp_name] = {};
                            }
                    		//控制公式状态没有改变则不需要渲染
                    		if (!this.idxCurrentVariable2Control[tmp_name]) {
    	                        this.idxCurrentVariable2Control[tmp_name] = {};
    	                    }
                            if(this.idxVariable2Control[tmp_name][control] !== pass[k]){
                            	this.idxCurrentVariable2Control[tmp_name][control] = pass[k];
                            }
                            this.idxVariable2Control[tmp_name][control] = pass[k];
                    	}
                    }else{
	                    //非动态行或者动态行带参数情况：
	                    if (!this.idxVariable2Control[name]) {
	                        this.idxVariable2Control[name] = {};
	                    }
	                    //控制公式状态没有改变则不需要渲染
	                    if (!this.idxCurrentVariable2Control[name]) {
	                        this.idxCurrentVariable2Control[name] = {};
	                    }
	                    if(this.idxVariable2Control[name][control] !== pass){
                        	this.idxCurrentVariable2Control[name][control] = pass;
                        }
	                    this.idxVariable2Control[name][control] = pass;
                    }
                }
            }
        };
        /**
         * PRIVATE: Execute associated verify formulas. Needs processing variable "this.procVerifyFormulas". <BR>
         * 内部方法：执行所有关联校验公式, 依赖过程变量"this.procVerifyFormulas", 结果会更新变量"this.idxVariable2NoPass".
         * 
         * <pre>
         * this.idxVariable2NoPass = { 
         *     jpath_1 : { 
         *         formulaId_1 : FormulaObject_1
         *     }, jpath_2 : { 
         *         formulaId_2 : FormulaObject_2, formulaId_3 : FormulaObject_3
         *     }
         * }
         * </pre>
         * 
         * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.applyAssociatedFormulaVerify = function(dynamicParams){
            //业务中台自动化测试 记录执行的公式
            if(flagYwztAutoTest && typeof parent.saveFormula === "function"){
                var _this = this;
                setTimeout(function() {
                    parent.saveFormula(_this.procVerifyFormulas);
                });
            }

            var verifies = this.procVerifyFormulas;
            if (verifies) {
                for (var z = 0; z < verifies.length; z++) {
                    var objFormula = verifies[z];
                    var vars = [];
                    //判断是否添加了target属性，有则取target属性
                    if(objFormula.lstTargetResolved && objFormula.lstTargetResolved.length > 0){
                    	for(var i=0;i<objFormula.lstTargetResolved.length;i++){
                    		vars.push(objFormula.lstTargetResolved[i].variable)
                    	}
                    	
                    }else{
                    	//检验公式，默认提示公式中所有涉及的单元格（变量）
                    	vars = objFormula.lstVariables
                    }
                    var pass = null;
                    //当公式存在全量执行标志时则动态行的整个列都需要执行
                    if(objFormula.dthQlzxBz === 'Y'){
                    	pass = this.execNoCaculateFormula(objFormula, null);
                    }else{
                    	//当公式不存在全量执行标志时则只需要执行对应下标的公式
                    	pass = this.execNoCaculateFormula(objFormula, dynamicParams);
                    }
                      //多条公式执行结果：如动态行
	                if(pass instanceof Array) {
	                	// 若存在repeatflag，则说明是重复行校验结果 A By C.Q 20180425
                    	if(pass[0] !== undefined && pass[0] !== null && pass[0]['repeatflag'] != null && pass[0]['repeatflag'] !== undefined) {
                    		//重复行校验结果处理
                    		this.dealRepeatResult(pass[0], objFormula);
                    	} else {
	                    	/*动态行校验结果返回是以动态行行数为维度、校验结果为内容的数组。
	                    	长度为1时是默认一行。长度为N时返回N行。*/
	                    	objFormula.lastVerify = pass;
	                    	for(var k = 0;k < pass.length; k++){
	                    		var tmpPass = pass[k];
	                    		if(tmpPass instanceof Array) {
	                    			for(var v = 0;v < tmpPass.length; v++){
	                    			    //传入执行公式的下标
	                    			    var idx = [k,v];
	    	                            for (var i = 0; i < vars.length; i++) {
	    	                                var name = vars[i];
	    	                                
	    	                                    name = name.replace(/\[##\]/, "[" + k + "]")
	    	                                    	.replace(/\[#\]/, "[" + v + "]");
	    	                          
	    	                                this.updateIdx(tmpPass[v],name,objFormula,idx);
	    	                            }
	                        		}
	                    		}else{
                                    //传入执行公式的下标
                                    var idx = [k];
	                    			for (var i = 0; i < vars.length; i++) {
		                                var name = vars[i];
		                                name = name.replace(/\[#\]/, "[" + k + "]");
		                                this.updateIdx(pass[k],name,objFormula,idx);
		                            }
	                    		}
	                    		
	                    	}
                    	}
                    }else{
	                    objFormula.lastVerify = pass;
	                    for (var i = 0; i < vars.length; i++) {
	                        var name = vars[i];
				            if (dynamicParams) {
	                        	name = this.twoDynamicReplace(dynamicParams,name);
	                        }
	                       
	                        this.updateIdx(pass,name,objFormula);
	                    }
                    }
                }
            }
        };
        
        /**
         * PRIVATE: update idxVariable2NoPass and idxCurrentVariable2NoPass. <BR>
         * 内部方法：更新idxVariable2NoPass和idxCurrentVariable2NoPass. M By C.Q 20180424
         * @param pass. 校验结果, 应为布尔值
         * @param name. jpath.
         * @param objFormula,Formula Object. 公式对象.
         * @param idx 执行公式下标
         */
        FormulaEngine.prototype.updateIdx = function(pass, name, objFormula, idx) {
            if (pass) {
                // Check relative variable and remove it.
                if (this.idxVariable2NoPass[name]) {
                    if (this.idxVariable2NoPass[name][objFormula.id]) {
                        delete this.idxVariable2NoPass[name][objFormula.id];
                        if(this.idxVariable2NoPass[name].idx){
                            delete this.idxVariable2NoPass[name].idx;
                        }

                        if (!this.idxCurrentVariable2NoPass[name]) {
                            this.idxCurrentVariable2NoPass[name] = {};
                        }
                        this.idxCurrentVariable2NoPass[name][objFormula.id] = objFormula;
                        if(idx) {
                            this.idxCurrentVariable2NoPass[name].idx = idx;
                        }
                    }
                    if (!this.hasProperty(this.idxVariable2NoPass[name])) {
                        delete this.idxVariable2NoPass[name];
                    }
                }
            } else {
                // Record relative variable of not passed.
                if (!this.idxVariable2NoPass[name]) {
                    this.idxVariable2NoPass[name] = {};
                }
                if (!this.idxVariable2NoPass[name][objFormula.id] || this.idxVariable2NoPass[name][objFormula.id] !== objFormula) {
                    this.idxVariable2NoPass[name][objFormula.id] = objFormula;
                    if(idx) {
                        this.idxVariable2NoPass[name].idx = idx;
                    }
                }else if(idx && this.idxVariable2NoPass[name].idx && this.idxVariable2NoPass[name][objFormula.id]
                    && idx.toString() !== this.idxVariable2NoPass[name].idx.toString()){
                    this.idxVariable2NoPass[name].idx = idx;
                }

                if (!this.idxCurrentVariable2NoPass[name]) {
                    this.idxCurrentVariable2NoPass[name] = {};
                }
                this.idxCurrentVariable2NoPass[name][objFormula.id] = objFormula;
                if(idx) {
                    this.idxCurrentVariable2NoPass[name].idx = idx;
                }
            }
        };
        /**
         * 重复行校验结果处理
         */
        FormulaEngine.prototype.dealRepeatResult = function(results, objFormula) {
    		var objCopy; // objFormula副本，目的是为了改写tips
    		var plst = results['noPassLst'];
    		var tIndex = objFormula.tips.indexOf('<#num#>');
    		var preTip = objFormula.tips.substring(0, tIndex);
    		var sufTip = objFormula.tips.substring(tIndex+7);
    		var l = results['len']; // 集合长度
    		var lb = results['gridlb']; // jpath集合路径名称
    		var lk = results['lastKey']; // jpath最后一个key名称
    		for(var j=0;j<l;j++) {
    			// 若无此下标，则表明校验通过
    			if(plst[j] === undefined) {
    				this.updateIdx(true,lb+j+lk, objFormula);
    			} else {
    				objCopy = this.copyObjFormula(objFormula);
    				objCopy.tips = preTip+plst[j].row.rownums+sufTip;
        			this.updateIdx(false,lb+j+lk, objCopy);
    			}
    		}
        };
        /**obj对象拷贝:目的是为了改写tips,由于js是对象引用，不能直接更改objFormula中tips，只能先拷贝副本后改写；
        使用场景如：重复行校验，虽然是同一条公式，但却有不同的提示，“第1、3行不能重复”。
        不使用$.extend的原因是，当在大数据量的情况下$.extend存在性能问题；此方法缺点需要维护objFormula对象的属性变更
        */
        FormulaEngine.prototype.copyObjFormula = function(objFormula) {
            var objCopy = new FormulaObject();
            objCopy.formula = objFormula.formula;
            objCopy.id = objFormula.id;
            objCopy.type = objFormula.type;
            //objCopy.desc                     = objFormula.desc;
            objCopy.target = objFormula.target;
            objCopy.tips = objFormula.tips;
            objCopy.strAssignment = objFormula.strAssignment;
            objCopy.strAssResolved = objFormula.strAssResolved;
            objCopy.strExpression = objFormula.strExpression;
            objCopy.strExpResolved = objFormula.strExpResolved;
            objCopy.lstVariables = objFormula.lstVariables;
            objCopy.lstTargetResolved = objFormula.lstTargetResolved;
            objCopy.lstDynamicParams = objFormula.lstDynamicParams;
            objCopy.flagAggregation = objFormula.flagAggregation;
            objCopy.flagDynamicParam = objFormula.flagDynamicParam;
            objCopy.flagCompiled = objFormula.flagCompiled;
            objCopy.flagPreCompiled = objFormula.flagPreCompiled;
            objCopy.lastError = objFormula.lastError;
            objCopy.lastVerify = objFormula.lastVerify;
            objCopy.lastControl = objFormula.lastControl;
            objCopy.tipType = objFormula.tipType;
            objCopy.level = objFormula.level;
            objCopy.channel = objFormula.channel;
            objCopy.cljy = objFormula.cljy;
            objCopy.glbd = objFormula.glbd;
            objCopy.fxmc = objFormula.fxmc;
            objCopy.jcjg = objFormula.jcjg;
            objCopy.fxlx = objFormula.fxlx;
            objCopy.zcInit = objFormula.zcInit;
            objCopy.dthQlzxBz = objFormula.dthQlzxBz;
            objCopy.initVerify = objFormula.initVerify; 
            return objCopy;
        };
        /**
         * PRIVATE: Execute verify or control formula. <BR>
         * 内部方法：执行校验公式.
         * @param objFormula Formula: Verify or control formula object. 公式对象：校验公式.
         * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
         * @returns Formula result, should be true or false. 校验结果, 应为布尔值.
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.execNoCaculateFormula = function(objFormula, dynamicParams){
            if (objFormula.flagCompiled) {
                var ret;
                var strExpResolved = objFormula.strExpResolved;
                if (objFormula.flagDynamicParam) {
                    // TODO: Currently only support one dynamic parameter.
                    if(dynamicParams) {
                    	strExpResolved = this.twoDynamicReplace(dynamicParams,strExpResolved);
                        ret = this.execute(null, strExpResolved, null);
                    } else if(objFormula.initVerify === 'once'){
                    	// 动态行公式只执行一次,如：重复行校验公式 C.Q 20180501
                    	dynamicParams = [0];
                    	strExpResolved = this.twoDynamicReplace(dynamicParams,strExpResolved);
                        ret = this.execute(null, strExpResolved, null);
                    } else {//对于重复行初始化校验，无法传递下标，故做遍历处理
                        ret = this.noCalculateDynamicTraversing(null, strExpResolved, objFormula);
                    }
                } else if (objFormula.flagAggregation) { // 该公式存在聚合操作要求
                    // 重新解析表达式（因为很可能自编译后增加了动态行，所以需要重新计算）
                    var tmp = this.resolveExpressionFull(objFormula.strExpression);
                    strExpResolved = tmp.resolved;
                    ret = this.execute(null, strExpResolved);
                } else {
                    // Simple formula calculate
                    ret = this.execute(null, strExpResolved);
                }
                //console.log("Verify " + ret + "<= " + objFormula.formula + " " + objFormula.desc);
                return ret;
            }
        };
        /**
         * PRIVATE: Searching and execute calculate formulas referenced by JPath. Needs variable-to-formula reference
         * "this.idxVariable2Formula".<BR>
         * 内部方法：依赖反向索引"this.idxVariable2Formula"查找并执行与JPath有关的计算公式, 并记录受影响的校验公式.
         * @param jpath String: JsonPath. 字符串：路径表达式.
         * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
         * @param flagInitial 是否初始化调用
         * @param iHandleJSON 对关联出来公式处理
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.calculationPlanningOfJPath = function(nodepath, dynamicParams,
            flagInitial,iHandleJSON) {
            var lstFormulaAndParams = this.getInvolvedFormulas(nodepath, dynamicParams);
            //return this.calculationPlanning(lstFormulaAndParams, dynamicParams, flagInitial);
            return this.calculationPlanning8DAGsorting(lstFormulaAndParams, dynamicParams,flagInitial,iHandleJSON);
        };
        /**
         * 内部方法：依据初始给出的公式列表，查找出所有关联公式，并按照前后依赖关系进行计算。
         * @param lstFormulas 待处理公式队列：[FormulaObj, FormulaObj, ...]
         * @param dynamicParams 动态下标
         * @param flagInitial 是否初始化
         * @param iHandle 自定义处理 json 格式字符串，用于拓展处理
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.calculationPlanningOfList = function(lstFormulas, dynamicParams,
            flagInitial,iHandle){
            var lst = [];
            this.addingFormulaList(lst, lstFormulas, dynamicParams);
            //this.calculationPlanning(lst, dynamicParams, flagInitial);
            return this.calculationPlanning8DAGsorting(lst, dynamicParams, flagInitial,iHandle);
        };
        /**
         * 内部方法：采用图论中的拓扑排序命题来解决公式计算依赖关系的分析问题.<br />
         * 【拓扑排序命题】<br />
         * 拓扑排序用于解决图论中有向图的一类序列问题，拓扑排序在ACM比赛和实际生活中都比较常见，只要能将事物抽象成有向图，并要求按规则排序，那么就可以考虑拓扑排序，比如任务执行前后关系、选修课程的安排、按胜负排名次等。<br />
         * 【拓扑排序解释】<br />
         * 即在某一个有向图graph中，假设每一条有向边(u,v)代表节点u必须排在节点v的前面，那么按照这样的规则，将所有的节点进行排序，最终得出的序列就称为拓扑序。<br />
         * 
         * <pre>
         * 【拓扑排序流程】
         * 总体思路：遍历节点，删除入度为0的节点，删除该节点的出连接线，然后继续下一轮遍历。
         * 特殊说明：如果某轮遍历后没有找到任何入度为0的节点，说明存在循环依赖（也即拓扑排序无解）。
         * 具体流程：
         *   (1)、找到一个没有后继的顶点(如果有一条边从A指向B,那么B是A的后继)。
         *   (2)、从图中删除这个顶点，在列表的前面插入顶点的标记。
         *   (3)、重复步骤1和2.直到所有的顶点都从图中删除。这时列表显示的顶点顺序就是拓扑排序的结果。
         * 注：环图是不能进行拓扑排序的，如果有N个顶点的有向图有超过N-1条边，那么必定存在环；拓扑排序过程可以发现环。
         * </pre>
         * <pre>
         * 【算法应用】
         * 一、标记过程（梳理依赖有向图子图的过程）：
         * 1 初始化：初始公式清单-->标记计算区&待处理队列
         * 2 枚举待处理队列，取出一条处理公式；
         * 2.1 枚举公式的赋值变量所涉及的关联公式；
         * 2.1.1 如该关联公式不存在于标记计算区，则压入待处理队列，且关联公式放入标记计算区；
         * 2.1.2 在该关联公式上标记对当前变量的依赖；
         * 2.3 继续下一枚举关联公式；
         * 3 重复执行待处理队列；
         * 4 最终得到标记计算区。
         * 二、清理过程（对标记计算区进行拓扑排序）：
         * 1 初始化：初始公式清单-->待处理队列；
         * 2 枚举待处理队列，取出一条处理公式；
         * 2.1 检查其是否仍存在变量依赖（也即入度是否为0）：
         * 2.2 从计算区去除该公式（从图中删除该节点）
         * 2.3 将公式放入拟执行队列；
         * 2.4 查找赋值变量所涉及的关联公式
         * 2.5 枚举关联公式
         * 2.5.1 删除被枚举关联公式的依赖项（删除节点相关的出连接线）
         * 3 重复执行待处理队列；
         * 4 如队列仍为空，说明存在循环依赖，异常中止；
         * 5 将最终拟执行队列提交顺序执行。
         * 三、按拓扑顺序执行计算
         * </pre>
         * 
         * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
         * @param dynamicParams 暂未使用.
         * @param flagInitial 是否为初始化（初始化调用时才为true）.
         * @param iHandleFn 自定义函数处理
         * @return Calculate successful, boolean. 计算是否成功, 布尔值.
         */
        FormulaEngine.prototype.calculationPlanning8DAGsorting = function(lstFormulaAndParams,
            dynamicParams, flagInitial,iHandle){
            console.log("FormulaEngine: calculationPlanning8DAGsorting(), incoming ["
                + lstFormulaAndParams.length + "]......");
            var _start_ = new Date().getTime();
            // 一、标记过程（形成计算区，也即子图）
            var area = this.marking4DAGsorting(lstFormulaAndParams);
            var _ms_marking_ = new Date().getTime() - _start_;
            var _cnt_marking_ = this.countProperty(area);
            // 二、清理过程（逐步清理入度为0节点，形成计算顺序）
            var orderList = this.cleaning4DAGsorting(area);
            var _ms_cleaning_ = new Date().getTime() - _start_ - _ms_marking_;
            var _cnt_cleaning_ = orderList.length;
            // 三、按顺序执行计算
            var ret = this.calculateAccordingPlan(orderList, flagInitial,iHandle);
            var _ms_calculate_ = new Date().getTime() - _start_ - _ms_cleaning_ - _ms_marking_;
            var _end_ = new Date().getTime();

            console.log("INFO:"+ _start_+"-"+_end_+ "  标记(area) ["
                + _cnt_marking_ + "] " + _ms_marking_ + "ms, 清理(orderList) [" + _cnt_cleaning_ + "] "
                + _ms_cleaning_ + "ms, 计算 " + _ms_calculate_ + "ms. ");
        };
        /**
         * 内部方法：基于图论中的拓扑排序命题，对标记计算区进行拓扑排序.
         * @param area 标记计算区：{formulaId1:{obj:FormulaObj, depends:{paramName1, paramName2}, params:[]}, formulaId2:{}}
         */
        FormulaEngine.prototype.cleaning4DAGsorting = function(area){
            // 1 初始化：标记区公式清单-->待处理队列；
            var orderList = [];
            var total = this.countProperty(area);
            var cnt = 0, sum = 0, loop = 0; // cnt 用于发现循环依赖；sum 记录总计算量；loop 循环次数。
            do {
                cnt = 0;
                loop++;
                // 2 枚举待处理队列，取出一条处理公式；
                for ( var id in area) {
                    // 2.1 检查其是否仍存在变量依赖（也即入度是否已经为0）：
                    var item = area[id];
                    //当此公式存在依赖其他公式时继续找下一个公式。
                    if (this.countProperty(item.depends) > 0) {
                        continue;
                    }
                    cnt++;
                    sum++;
                    // 2.2 从计算区去除该公式（从图中删除该节点）
                    delete area[id];
                    var objFormula = item.obj;
                    var formulaParams = item.params;
                    // 2.3 将公式放入拟执行队列；
                    orderList.push({ "obj" : objFormula, "params" : formulaParams });
                    // 2.4 查找赋值变量所涉及的关联公式；
                    var strNodepath = objFormula.strAssResolved;
                    if (!strNodepath) {
                        continue;
                    }
                    strNodepath = strNodepath.substr(2);// 去掉前缀“$.”
                	//查找关联公式
                    var lstRefFormulaAndParams = this.getInvolvedFormulas(strNodepath,
                        formulaParams);
                    // 2.5 枚举关联公式；并去掉依赖
                    for (var i = 0; i < lstRefFormulaAndParams.length; i++) {
                        var objRef = lstRefFormulaAndParams[i][0];
                        if (objRef && objRef.id) {
                            // 2.5.1 删除被枚举关联公式的依赖项（删除节点相关的出连接线）；
                            var areaItem = area[objRef.id];
                            if (areaItem) {
                            	var _strAssResolved = objFormula.strAssResolved;
                            	//寻找该公式的赋值节点，用于寻找同一节点得其他赋值公式
                            	var _formula = this.idxAssign2Formulas[_strAssResolved];
                            	//同一节点有两条赋值公式时，此保存公式数据逻辑有问题。第二条公式会被覆盖
                            	//暂时默认写法是同一节点的10公式写在01或者11前面。暂不会有太大问题。
                                if(Object.prototype.toString.call(_formula) == "[object Array]"){
                                    var flagDel = true;
                                    for (var j = 0; j < _formula.length; j++) {
                                        var _formulaObj = _formula[j];
                                        var _formula_id = _formulaObj ? _formulaObj.id:null;
                                        if(_formula_id && area[_formula_id]){
                                            flagDel = false;
                                            break;
                                        }
                                    }

                                    if(flagDel){
                                        delete areaItem.depends[strNodepath];
                                    }
                                }else{
                                    var _formula_id = _formula ? _formula.id:null;
                                    if(_formula_id && area[_formula_id]){//该公式已从标记区删除，标记区能找到得公式肯定是其他赋值公式
                                        //同一节点的其他赋值公式存在于标记区时，不能删除依赖关系。
                                    }else{
                                        delete areaItem.depends[strNodepath];
                                    }
                                }
                            }
                        } else {
                            console.log("WARNING: getInvolvedFormulas() return illegal formula: "
                                + objRef);
                        }
                    }
                }
            } while (cnt > 0 && loop < 2000); // 3 重复执行待处理队列（并避免意外出现死循环）；
            // 4 如队列仍为空，说明存在循环依赖，异常中止；
            if (this.countProperty(area) > 0) {
                console.log("!!!FAILED: cleaning4DAGsorting() failed. Total involed rules " + total
                    + ",still remain " + this.countProperty(area) + ".");
            } else {
                console.log("FormulaEngine: cleaning4DAGsorting(" + total + ") loop-times: " + loop
                    + ", total-detect: " + sum + ".");
            }
            return orderList; // 5 返回最终拟执行队列，将用于提交顺序执行。 
        };
        /**
         * 内部方法：基于图论中的拓扑排序命题，对公式进行标记过程（也即梳理依赖有向图子图的过程）.<br />
         * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
         * @param isAloneExe 是否独立执行某类型公式标志(不执行关联公式) true=是
         */
        FormulaEngine.prototype.marking4DAGsorting = function(lstFormulaAndParams, isAloneExe){
            // 1 初始化：初始公式清单-->标记计算区&待处理队列
            var queue = [];
            var area = {}; //标记计算区：{formulaId1:{obj:FormulaObj, depends:{paramName1, paramName2}, params:[]}, formulaId2:{}}
            for (var i = 0; i < lstFormulaAndParams.length; i++) {
                var objFormulaAndParams = lstFormulaAndParams[i];
                var objFormula = objFormulaAndParams[0];
                var formulaParams = objFormulaAndParams[1];
                area[objFormula.id] = { "obj" : objFormula, "depends" : {},
                    "params" : formulaParams };
                queue.push([ objFormula, formulaParams ]);
            }
            // 2 枚举待处理队列
            while (queue.length > 0 && !isAloneExe) {
                // 2.0 取出一条处理公式
                var objFormulaAndParams = queue.shift();
                var objFormula = objFormulaAndParams[0];
                var formulaParams = objFormulaAndParams[1];
                // 2.1 枚举公式的赋值变量所涉及的关联公式；
                var strNodepath = objFormula.strAssResolved;
                if (!strNodepath) {
                    if ("1" === objFormula.type.substr(1)) {
                        // 只有在Chrome模式下才打印warning信息
                        // 后端预编译模式下java的js引擎没有引入jquery导致报错，故此处则根据try catch忽略错误
                        try{
                            if (!$.browser.msie && !$.browser.mozilla) {
                        console.log("WARNING: [" + objFormula.type + "] '" + objFormula.id
                            + "' Assignment not founded: " + objFormula.formula);
                    }
                        }catch (e) {}
                    }
                    continue;
                }
                strNodepath = strNodepath.substr(2); // 去掉前缀“$.”

                // 如果有动态行参数，则直接替换#号为具体的动态行下标  ；目标减少计算公式的执行；modify by meihu TODO此处可以不进行替换
            	var temStrNodepath = this.twoDynamicReplace(formulaParams, strNodepath);
                var lstRefFormulaAndParams = this.getInvolvedFormulas(temStrNodepath, formulaParams);
                for (var i = 0; i < lstRefFormulaAndParams.length; i++) { // 枚举关联公式
                    var objRef = lstRefFormulaAndParams[i][0];
                    if (objRef && objRef.id) {
                        var areaItem = area[objRef.id];
                        // 2.1.1 如该关联公式不存在于标记计算区，则压入待处理队列，且关联公式放入标记计算区；
                        if (!areaItem) {
                            areaItem = area[objRef.id] = { "obj" : objRef, "depends" : {},
                                "params" : lstRefFormulaAndParams[i][1] };
                            queue.push([ objRef, lstRefFormulaAndParams[i][1] ]);
                        } else if (!lstRefFormulaAndParams[i][1]) { // 如果被引用公式需要做全下标计算（即下标参数为空）
                            if(areaItem.params != null){
                                // 新关联引用出来的公式，存在非动态行公式需要全覆盖计算的情况，典型情况是：
                                // =>  动态行的分配比例  = 动态行的金额  / 合计金额
                                // 上述情况会因为合金金额发生变动而执行全覆盖计算，那么此时动态行的行标是有害的，需要被剔除。
                                //合计求比例是动态行的每行都需要重新求比例，此时通过这句代码可以去掉动态行下标
                                areaItem.params = null;

                                //ybnsrzzs-分配税额[汇总纳税企业增值税分配表]=比例*总机构应税服务分配税额 当比例重新计算时，分配税额也要每行执行
                                //将分配税额的公式塞到queue中，且不带动态行下标，下次循环会去掉动态行下标
                                queue.push([ objRef, null ]);
                            }
                        }
                        // 2.1.2 在该关联公式上标记对当前变量的依赖；
                        areaItem.depends[strNodepath] = true;
                    } else {
                        console.log("WARNING: getInvolvedFormulas() return illegal formula: "
                            + objRef);
                    }
                } // 2.3 继续下一枚举关联公式；
            } // 3 重复执行待处理队列；
            // 4 最终得到标记计算区。
            return area;
        };
        /**
         * @departed 该函数已经实际废除， 由calculationPlanning8DAGsorting()代替!!!
         * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
         */
        FormulaEngine.prototype.calculationPlanning = function(lstFormulaAndParams, dynamicParams,
            flagInitial){
            //1、基于所有关联公式；
            var queue = lstFormulaAndParams; //待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
            var idxPlan = {}; //已索引公式：{formulaId1:{obj:FormulaObj, ref:0, params:[]}, formulaId2:{}}
            var lstResult = [];//排序后公式列表；
            //2、对公式进行依次扫描，并将级联公式一并获取，同步进行引用计数；
            while (queue.length > 0) {
                var objFormulaAndParams = queue.shift();
                var objFormula = objFormulaAndParams[0];
                var formulaParams = objFormulaAndParams[1];
                if (!idxPlan[objFormula.id]) {
                    idxPlan[objFormula.id] = { "obj" : objFormula, "ref" : 1,
                        "params" : formulaParams };
                }               
                if (objFormula.flagCompiled) {
                    var strNodepath = objFormula.strAssResolved;
                    if (strNodepath) {
                        strNodepath = strNodepath.substr(2);
                        // 获取与当前赋值部分存在引用关系的公式
                        var lstRefFormulaAndParams = this.getInvolvedFormulas(strNodepath,
                            formulaParams);
                        // 对所引用公式进行引用值（ref）的增加运算
                        for (var i = 0; i < lstRefFormulaAndParams.length; i++) {
                            var objRef = lstRefFormulaAndParams[i][0];
                            if (objRef) {
                            	if (!idxPlan[objRef.id]) {
                                    idxPlan[objRef.id] = { "obj" : objRef, "ref" : 1,
                                        "params" : lstRefFormulaAndParams[i][1] };
                                } else if (!lstRefFormulaAndParams[i][1]) { // 如果被引用公式需要做全下标计算（即下标参数为空）
                                    // 新关联引用出来的公式，存在非动态行公式需要全覆盖计算的情况，典型情况是：
                                    // =>  动态行的分配比例  = 动态行的金额  / 合计金额
                                    // 上述情况会因为合金金额发生变动而执行全覆盖计算，那么此时动态行的行标是有害的，需要被剔除。
                                    idxPlan[objRef.id].params = null; 
                                }
                                // 注意到是引用了变量的公式才需要增加引用值（ref）
                                idxPlan[objRef.id].ref += idxPlan[objFormula.id].ref;
                            }
                        }
                        //queue = queue.concat(lstRefFormulaAndParams);
                        queue.push.apply(queue, lstRefFormulaAndParams);
                    }
                }
            }
            //3、根据引用计数进行升序排列；
            for ( var id in idxPlan) {
                lstResult.push(idxPlan[id]);
            }
            lstResult.sort(function(a, b){
                return a.ref - b.ref; // 降序排列
            });
            //4、按顺序进行公式计算
            return this.calculateAccordingPlan(lstResult, flagInitial);
        };
        /**
         * PRIVATE: Execute calculate formula by sorted list.<BR>
         * 内部方法：按顺序执行公式，不进行任何级联（关联）计算，其依赖于所计算公式的原始顺序.
         * @param lstObjFormulas Array: Formula objects. 数组：公式对象. [{obj:FormulaObj, ref:0, params:[]}, {obj:FormulaObj,
         *            ref:0, params:null}, ...]
         * @param dynamicParams Array: Dynamic parameters' value. 数组：动态参数值.
         * @param flagInitial Boolean: Is initial calculate. 布尔：是否为初始化.
         * @param iHandle 对公式自定义处理
         * @returns Calculate successful, boolean. 计算是否成功, 布尔值.
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.calculateAccordingPlan = function(lstPlanFormulas, flagInitial,iHandle){
            //业务中台自动化测试 记录执行的公式
            if(flagYwztAutoTest && typeof parent.saveFormula === "function"){
                setTimeout(function() {
                    parent.saveFormula(lstPlanFormulas);
                });
            }

            //自定义函数处理，过滤
            var handleFn=null;
            if(iHandle){
                var defaultHandle={"type":"", "handleFn":null}
                iHandle = $.extend(true, defaultHandle, iHandle);
                var iHandleType=iHandle.type;//处理类型
                handleFn=iHandle.handleFn ? iHandle.handleFn : _FormulaEngine_defaultFilterHandler[iHandleType];//优先使用外部传入的自定义函数
                if(typeof handleFn!="function"){
                    console.log("无法根据"+iHandle.type+"获取处理函数");
                    handleFn=null;
                }
            }

            var ret = true;
            for (var i = 0, len=lstPlanFormulas.length; i < len; i++) {
                var objFormulaPlan = lstPlanFormulas[i];
                var objFormula = objFormulaPlan.obj;
                var formualType=this.rightSubstr(objFormula.type, 1);
                /*
                 * 处理函数存在，且执行结果返回false,则跳过公式执行
                 */
                if(iHandle && handleFn && (handleFn(iHandle,objFormula,objFormulaPlan.params,formualType) === false) ){
                    continue;
                }

				
                if (objFormula.strAssResolved) {
                    this.procVariableInStack[objFormula.strAssResolved] = objFormula;
                }
                if (objFormula.flagCompiled) {
					var strAssResolved = (objFormula.strAssResolved && objFormula.flagDynamicParam) ? this
                        .resolveExpression(objFormula.strAssignment).resolved
                        : objFormula.strAssResolved;
                    var strExpResolved = objFormula.strExpResolved;
                    switch (formualType) {
                    case "0": // 初始化公式
                        if (!flagInitial) {
                            // 非初始化情况，直接忽视
                            break;
                        }
                        if (objFormula.flagDynamicParam) {
                            // 初始化公式包含动态下标参数，需要按动态变量进行下标遍历
                            this.calculateDynamicTraversing(strAssResolved, strExpResolved,
                                objFormula);
                            break;
                        }
                    case "1": // 计算公式,需要排除提交环节公式
                        if("2" === (objFormula.type).substr(0,1)) break;
                        try {
                            if (objFormula.flagDynamicParam) { // 该公式存在动态下标参数，需要特殊处理
                                if(objFormula.initVerify === 'once'){
                            		this.execute(strAssResolved, strExpResolved,[0]);
                            	}else if (objFormulaPlan.params) {
                                    // 已经提供了动态参数，可直接执行
                            		this.execute(strAssResolved, strExpResolved,
                                        objFormulaPlan.params);
                                } else if (objFormula.strAssignment 
									&& objFormula.strAssignment.indexOf("[#") > 0) {
                                    // 未提供动态参数，但是需要执行，只能进行遍历
                                    this.calculateDynamicTraversing(strAssResolved, strExpResolved,
                                        objFormula);
                                } else {
                                    // 其它情况则不能支持，很可能公式配置错误
                                    console
                                        .log("Calculate dynamic-param formula failed, param-value not founded: "
                                            + objFormula.formula);
                                    ret = false;
                                }
                            } else if (objFormula.flagAggregation) { // 该公式存在聚合操作要求
                                // 重新解析表达式（因为很可能自编译后增加了动态行，所以需要重新计算）
                                var tmp = this.resolveExpressionFull(objFormula.strExpression);
                                strExpResolved = tmp.resolved;
                                this.execute(strAssResolved, strExpResolved);
                            } else {
                                // Simple formula calculate
                                this.execute(strAssResolved, strExpResolved);
                            }
                        } catch (ex) {
                            console.log("ERROR[" + ex + "] while eval: " + strAssResolved + "="
                                + strExpResolved);
                            ret = false;
                        }
                        break;
                    case "2": // Founded verify-formula. 校验公式，记录下来后续执行。
                        this.procVerifyFormulas.push(objFormula);
                        break;
                    case "3": // Founded control-formula. 控制公式，记录下来后续执行。
                        this.procContorlFormulas.push(objFormula);
                        break;
                    default:
                        console.log("WARNING: Formula type not supported: ");
                    }
                }
            }
            return ret;
        };
        /**
         * 对动态下标的公式进行遍历计算，类似 $.vos[#].a = $.vos[#].b + $.others[1].s 时，枚举计算所有的 $.vos[#].b
         */
        FormulaEngine.prototype.calculateDynamicTraversing = function(strAssResolved,
            strExpResolved, objFormula){
            // 1、寻找公式中带动态参数的第一个变量
            var vars = objFormula.lstVariables;
            var dynamic = null;
            for (var v = 0; v < vars.length; v++) {
                if (vars[v].indexOf("[#") > 0 ) {
                    dynamic = vars[v];
                    break;
                }
            }
            if (!dynamic) {
                console
                    .log("Calculate dynamic initial-formula failed, dynamic-param not founded in expression part: "
                        + objFormula.formula);
                return false;
            }
            // 2、计算动态参数变量的总数，以便进行遍历计算
            var objBase = eval(this.basename);
            dynamic = dynamic.replace(/\[[#]{1,2}\]/g, "[*]");
            var tmp = jsonPath(objBase, dynamic);
            if (!tmp) {
                console
                    .log("Calculate dynamic initial-formula failed, jpath in expression part select failed: "
                        + dynamic + " @ " + objFormula.formula);
                return false;
            }
            // 3、执行遍历循环计算
            //支持二维数组
            for (var k = 0; k < tmp.length; k++) {
            	var tmp0 = tmp[k];
            	if(tmp0 instanceof Array){
            		for (var v = 0; v < tmp0.length; v++) {
    	            	this.execute(strAssResolved, strExpResolved, [k , v ]);
    	            }
            	}else{
            		this.execute(strAssResolved, strExpResolved, [k]);
            	}
	            
            }
            return true;
        };
        /**
         * 对动态下标的公式进行遍历校验，类似 $.vos[#].a = $.vos[#].b + $.others[1].s 时，枚举计算所有的 $.vos[#].b
         */
        FormulaEngine.prototype.noCalculateDynamicTraversing = function(strAssResolved,
            strExpResolved, objFormula){
            // 1、寻找公式中带动态参数的第一个变量
            var vars = objFormula.lstVariables;
            var dynamic = null;
            for (var v = 0; v < vars.length; v++) {
                if (vars[v].indexOf("[#") > 0) {
                    dynamic = vars[v];
                    break;
                }
            }
            if (!dynamic) {
                console .log("Calculate dynamic initial-formula failed, dynamic-param not founded in expression part: "
                        + objFormula.formula);
                return false;
            }
            // 2、计算动态参数变量的总数，以便进行遍历计算
            var objBase = eval(this.basename);
            dynamic = dynamic.replace(/\[[#]{1,2}\]/g, "[*]");
            var tmp = jsonPath(objBase, dynamic);
            if (!tmp) {
                console.log("Calculate dynamic initial-formula failed, jpath in expression part select failed: "
                        + dynamic + " @ " + objFormula.formula);
                return false;
            }
            // 3、执行遍历循环计算
            var ret=[];
            //支持二维数组
            var idx = 0;
            for (var k = 0; k < tmp.length; k++) {
            	var tmp0 = tmp[k];
            	if(tmp0 instanceof Array){
	            	var tempRet = [];//定义临时的内部一维数组
		            for (var v = 0; v < tmp0.length; v++) {
		            	tempRet[v] = this.execute(strAssResolved, strExpResolved, [k , v ]);
		            }
		            ret[k] = tempRet;
	            }else{
	            	ret[k] = this.execute(strAssResolved, strExpResolved, [k]);
	            }
            }
            
            return ret;
        };
        /**
         * 根据nodepath来搜索所有引用了该变量的公式，包括动态公式和聚合公式
         */
        FormulaEngine.prototype.getInvolvedFormulas = function(nodepath, dynamicParams){
            var regBasket = this.regBasket;
            var lstFormulas = [];
            // 1、Simple formula matching. 简单引用匹配（也即变量直接写在公式中）
            if (this.idxVariable2Formula[nodepath]) {
                // 这种情况下说明变量即便是动态行，其动态参数值也不适用于被引用公式，类似于：
                // $.others[1].s 变动引发公式： $.vos[#].a = $.vos[#].b + $.others[1].s
                this.addingFormulaList(lstFormulas, this.idxVariable2Formula[nodepath], null);
            }
            if(nodepath.indexOf('[')>0 && nodepath.indexOf('[#]') === -1){
            	//带具体下标的动态行节点，把动态行公式中的校验、控制公式加入进去.动态行公式的计算暂不处理。
            	//var nodeIndex = nodepath.substring(nodepath.indexOf('[')+1,nodepath.indexOf(']'));
            	//var dynamicNode = nodepath.replace('['+nodeIndex+']','[#]');
            	//判断nodepath是不是动态行
            	var dynamicNode = null;
            	var l = nodepath.match(/\[\d+\]/g);
	            if(l != null){
	        		if(l.length == 2){
	    				dynamicNode = nodepath.replace(l[0],'[##]').replace(l[1],'[#]')
	        		}else{
	        			dynamicNode = nodepath.replace(l[0],'[#]');
	        		}
            	}
            	
            	if (this.idxVariable2Formula[dynamicNode]) {
            		var arr = this.idxVariable2Formula[dynamicNode];
            		var arr_addto = [];
                    for(var i = 0;i < arr.length;i++){
                    	if(arr[i].type.substr(1,1)==='1'){
                    		//暂不处理。。
                    	}else if(arr[i].type.substr(1,1)==='2'){
                    		arr_addto.push(arr[i]);
                    	}else if(arr[i].type.substr(1,1)==='3'){
                    		arr_addto.push(arr[i]);
                    	}
                    }
                    this.addingFormulaList(lstFormulas, arr_addto, null);
                }
            }
            // 2、Trying dynamic formula. 尝试匹配动态参数公式，类似于：
            // $.vos[#].b 变动引发公式： $.vos[#].a = $.vos[#].b + 100
            var tmp = nodepath;
            if (dynamicParams || (tmp.indexOf('[')>0 && tmp.indexOf('[#]') == -1)) {
            	//关联场景: nodepath = grsdszxsbAbMx[1].jcfy dynamicParams = null;
            	//预期被触发得公式变量索引： grsdszxsbAbMx[#].jcfy
                // TODO: Currently only support one dynamic parameter.
                regBasket.lastIndex = 0;
                tmp = tmp.replace(/\[[9]{5}\]/g,'[##]').replace(/\[(\d+)\]/g,'[#]')
                //tmp = tmp.replace(regBasket, "[#]");
                if (this.idxVariable2Formula[tmp]) {
                    this.addingFormulaList(lstFormulas, this.idxVariable2Formula[tmp],
                        dynamicParams);
                }
            }
            // 3、Trying aggregation formula. 尝试匹配聚合参数公式，类似于：
            // $.vos[#].b 变动引发公式： $.some.thing.hj = SUM($.vos[*].b)
            if (tmp.indexOf("[#") > 0) {
                regBasket.lastIndex = 0;
                tmp = tmp.replace(/\[#\]/g, "[*]").replace(/\[[#]{2}\]/g, "[*]");
                if (this.idxVariable2Formula[tmp]) {
                    this.addingFormulaList(lstFormulas, this.idxVariable2Formula[tmp], null);
                }
            }
            // 4、Exclude self. 消除自运算导致的循环引用，类似于： 
            // $.vos[0].a = SUM($.vos[*].a) - $.vos[0].a
            var jpath = "$." + nodepath;
            for (var i = 0, len = lstFormulas.length; i < len; i++) {
                if (jpath === lstFormulas[i].strAssResolved) {
                    lstFormulas.splice(i, 1);
                    i--;
                }
            }
            return lstFormulas;
        };
        
        FormulaEngine.prototype.addingFormulaList = function(lstBase, lstAdding, dynamicParams){
            for (var idx = 0, len=lstAdding.length; idx < len; idx++) {
                var objFormula = lstAdding[idx];
                if (!objFormula.flagDisable) {
                    lstBase.push([ objFormula, dynamicParams ]);
                }
            }
        };
        /**
         * PRIVATE: Execute formula in string, formula must be completely solved.<BR>
         * 内部方法：执行字符串，公式内容必须已完整解析且处理了动态变量.
         * @param strAssResolved String: Assignment part. 字符串：赋值部分（等号左侧）.
         * @param strExpResolved String: Expression part. 字符串：表达式部分（等号右侧）.
         * @returns Result after execution. 公式执行结果.
         */
        FormulaEngine.prototype.execute = function(strAssResolved, strExpResolved, dynamicParams){
            if (dynamicParams) {
                // TODO: Currently only support one dynamic parameter.
                if (strAssResolved) {
                	 strAssResolved = this.twoDynamicReplace(dynamicParams, strAssResolved);
                	 if (jsonPath(eval(this.basename), strAssResolved) === false) {
                		 this.jpathNodeCreate(strAssResolved);
                	 }
                }
                strExpResolved = this.twoDynamicReplace(dynamicParams, strExpResolved);
            }
            var strEval = strExpResolved;
            if (strAssResolved) {
                strEval = strAssResolved + "=" + strEval;
                if(this.idxWbcshCalculate2Formula && this.idxWbcshCalculate2Formula[strAssResolved] &&
                    this.idxWbcshCalculate2Formula[strAssResolved].formula && strEval !== this.idxWbcshCalculate2Formula[strAssResolved].formula){
                    console.log("执行外部初始化公式，替换原有公式：" + strEval + " 为外部初始化公式：" + this.idxWbcshCalculate2Formula[strAssResolved].formula);
                    strEval = this.idxWbcshCalculate2Formula[strAssResolved].formula;
                }
            }
            strEval = strEval.replace(/[$]/g, this.basename);

            // 后端预编译模式下java的js引擎没有引入jquery导致报错，故此处则根据try catch忽略错误
            try{
                if (!$.browser.msie && !$.browser.mozilla){
                    console.log("Executing: " + strEval);
                }
            }catch (e) {}

            if(strEval === ''){
            	return true;
            }
            var result;
            try{
                result = eval(strEval);
            }catch (e) {
                console.log("公式执行报错：" + strEval );
                throw "公式执行报错:" + e;
            }
            return result;
        };
        // 判断当前业务编码是否在配置中心配置了按dthQlzxBz来执行
        FormulaEngine.prototype.getDthQlzxBz = function(){
        	if(otherParams && otherParams.dthQlzxYwbms ){
        		// dthQlzxYwbms参数为字符串时将其解析为对象
        		if(typeof otherParams.dthQlzxYwbms === 'string' ){
        			var ywbms = otherParams.dthQlzxYwbms.split(',');
        			otherParams.dthQlzxYwbms = {};
                	for(var i=0, len=ywbms.length; i<len; i++){
                		otherParams.dthQlzxYwbms[ywbms[i]] = true;
                	}
        		}
        		// 判断ywbm是否有配置
        		if(otherParams.dthQlzxYwbms[ywbm.toUpperCase()]){
            		return true;
            	}
        	}
        	
        	return false;
        };
        /**
         * PRIVATE: Create formula object from string, did not compile. <BR>
         * 内部方法：根据公式字符串来创建公式对象，尚未进行公式编译（预处理）。
         * @param jsonFormula JSON-Object: Formula information from rule-base. JSON对象：从规则库导出的单条公式信息.
         * 
         * <pre>
         * jsonFormula = { 
         *     'id' : 0, // Formula ID from rule base. 规则库中所保存的公式ID.
         *     'type' : '00', // Formula type. 规则类型（01计算公式；02校验公式；10初始公式；11初始并计算公式；12初始校验公式）.
         *     'desc' : '', // Description from requirement. 本公式的需求说明.
         *     'formula' : '', // Original formula in string. 原始公式字符串.
         *     'tips' : ''// User tips for verify. 用户提示信息，主要用于校验公式.
         * }
         * </pre>
         * 
         * @returns FormulaObject.
         */
        FormulaEngine.prototype.createFormulaObject = function(jsonFormula, oldFormula){
            var objFormula = new FormulaObject();
            if (oldFormula) {
                objFormula = oldFormula;
                objFormula.lastError = undefined;
            }
            objFormula.formula = jsonFormula.formula;
            objFormula.id = jsonFormula.id;
            objFormula.type = jsonFormula.type;
            objFormula.desc = jsonFormula.desc;
            objFormula.tips = jsonFormula.tips;
            objFormula.target = jsonFormula.target;
            objFormula.flagAggregation = false;
            objFormula.flagDynamicParam = false;
            objFormula.flagCompiled = false;
            objFormula.lastError = null;
            objFormula.lastVerify = null;
            objFormula.lastControl = null;
            objFormula.zcInit = jsonFormula.zcInit === undefined || jsonFormula.zcInit == null ? '' : jsonFormula.zcInit;
            if(this.getDthQlzxBz() || jsonFormula.dthQlzxBz){
            	objFormula.dthQlzxBz = (jsonFormula.dthQlzxBz === undefined || jsonFormula.dthQlzxBz == null) ? 'N' : jsonFormula.dthQlzxBz;
            }else{
                objFormula.dthQlzxBz = "Y";
            }
            
            // C.Q 20170209
            objFormula.tipType = !jsonFormula.tipType ? 'error' : jsonFormula.tipType;
            objFormula.level = jsonFormula.level === undefined || jsonFormula.level == null || jsonFormula.level === '' ? '1' : jsonFormula.level;
            objFormula.channel = jsonFormula.channel === undefined || jsonFormula.channel == null || jsonFormula.channel === '' ? 'gs' : jsonFormula.channel;
            objFormula.cljy = jsonFormula.cljy === undefined || jsonFormula.cljy == null ? '' : jsonFormula.cljy;
            objFormula.fxmc = jsonFormula.fxmc === undefined || jsonFormula.fxmc == null ? '' : jsonFormula.fxmc;
            objFormula.fxlx = jsonFormula.fxlx === undefined || jsonFormula.fxlx == null ? '' : jsonFormula.fxlx;
            objFormula.glbd = jsonFormula.glbd;
            objFormula.initVerify = jsonFormula.initVerify;
            if (!objFormula.id) {
                console.log("公式ID为空，请补上，formula：" + objFormula.formula);
                objFormula.id = Math.random(); // Auto generate id for empty-id.
            }
            // Search equal mark to split the assignment's part.
            var formula = objFormula.formula;
            var posEqual = this.searchAssignMark(formula);
            if (objFormula.type === "01" || objFormula.type === "11" || objFormula.type === "10") {
                // Formula type: '01' calculate; '02' verify; '11' calculate & initialize; '10' initialize.
                if (posEqual <= 0 || formula.indexOf("=") !== posEqual) {
                    if (posEqual > 0) {
                        console
                            .log("Formula assignment part too complex: " + objFormula.formula);
                    }
                    posEqual = -1;
                }
            }
            if (posEqual <= 0) {
                objFormula.strAssignment = null;
                objFormula.strExpression = formula;
            } else {
                if (objFormula.type === 2) {
                    console.log(objFormula.type + " ==> " + objFormula.formula);
                }
                objFormula.strAssignment = formula.substr(0, posEqual).trim();
                objFormula.strExpression = formula.substr(posEqual + 1).trim();
            }
            return objFormula;
        };
        
        FormulaEngine.prototype.createFormulaObject2 = function(jsonFormula, oldFormula){
            var objFormula = new FormulaObject();
            if (oldFormula) {
                objFormula = oldFormula;
                objFormula.lastError = undefined;
            }
            objFormula.formula = jsonFormula.formula;
            objFormula.id = jsonFormula.id;
            objFormula.type = jsonFormula.type;
            objFormula.desc = jsonFormula.desc;
            objFormula.tips = jsonFormula.tips;
            objFormula.target = jsonFormula.target;
            objFormula.zcInit = jsonFormula.zcInit === undefined || jsonFormula.zcInit == null ? '' : jsonFormula.zcInit;
            //当url中dthQlzxBz参数是，启用动态行全量执行标志 TODO 建议预编译阶段处理
            if(this.getDthQlzxBz() || jsonFormula.dthQlzxBz){
            	objFormula.dthQlzxBz = jsonFormula.dthQlzxBz === undefined || jsonFormula.dthQlzxBz == null ? 'N' : jsonFormula.dthQlzxBz;
            }else{
            	objFormula.dthQlzxBz = "Y";
            }
            objFormula.flagAggregation = jsonFormula.flagAggregation;
            objFormula.flagDynamicParam = jsonFormula.flagDynamicParam;
            
            objFormula.flagPreCompiled = jsonFormula.flagPreCompiled;
            if (objFormula.flagPreCompiled) {
            	objFormula.flagCompiled = true;
            } else {
            	objFormula.flagCompiled = false;
            }
            objFormula.lastError = null;
            objFormula.lastVerify = null;
            objFormula.lastControl = null;
            objFormula.lstVariables = jsonFormula.lstVariables === undefined || jsonFormula.lstVariables == null ? [] : jsonFormula.lstVariables;  // All variables in formula. 公式中的所有变量列表.
            objFormula.lstTargetResolved = jsonFormula.lstTargetResolved === undefined || jsonFormula.lstTargetResolved == null ? [] : jsonFormula.lstTargetResolved; // All target in resolved. 公式所涉及控制目标的解析.
            objFormula.lstDynamicParams = jsonFormula.lstDynamicParams === undefined || jsonFormula.lstDynamicParams == null ? [] : jsonFormula.lstDynamicParams; // All dynamic parameter's name. 含动态参数公式的参数名（均以#开头）.
            // C.Q 20170209
            objFormula.tipType = !jsonFormula.tipType ? 'error' : jsonFormula.tipType;
            objFormula.level = jsonFormula.level === undefined || jsonFormula.level == null || jsonFormula.level === '' ? '1' : jsonFormula.level;
            objFormula.channel = jsonFormula.channel === undefined || jsonFormula.channel == null || jsonFormula.channel === '' ? 'gs' : jsonFormula.channel;
            objFormula.cljy = jsonFormula.cljy === undefined || jsonFormula.cljy == null ? '' : jsonFormula.cljy;
            objFormula.fxmc = jsonFormula.fxmc === undefined || jsonFormula.fxmc == null ? '' : jsonFormula.fxmc;
            objFormula.fxlx = jsonFormula.fxlx === undefined || jsonFormula.fxlx == null ? '' : jsonFormula.fxlx;
            objFormula.glbd = jsonFormula.glbd;
            objFormula.initVerify = jsonFormula.initVerify;
            if (!objFormula.id) {
                console.log("公式ID为空，请补上，formula：" + objFormula.formula);
                objFormula.id = Math.random(); // Auto generate id for empty-id.
            }
            objFormula.strAssignment = jsonFormula.strAssignment;
            objFormula.strExpression = jsonFormula.strExpression;
            objFormula.strAssResolved = jsonFormula.strAssResolved;
            objFormula.strExpResolved = jsonFormula.strExpResolved;
            return objFormula;
        };
        /**
         * PRIVATE:针对ie8执行奔溃时处理.<BR>
         * Resolve all shorted-jpath to full-jpath.
         * 将所有公式中的所有缩略路解析为全路径.
         */
        FormulaEngine.prototype.splitFormulas = function(formulas){
        	var _this = this;
        	var len = formulas.length;
        	
        	if(len <=200){
        		setTimeout(function(){
        			// Resolve all shorted-jpath to full-jpath.
                    // 将所有公式中的所有缩略路解析为全路径.
                    for (var i = 0; i < len; i++) {
                        var objFormula = formulas[i];
                        if (objFormula.flagPreCompiled){
                        	// 后端编译后的公式进行二次简单编译(判断)
                        	_this.fmlSimpleCompiled(objFormula);
                        } else {
                        	
	                        // Resolve shorted-jpath
	                        if (_this.resolveFormula(objFormula)) {
	                            // Recognize variable of assignment's part.
	                            if (objFormula.strAssResolved) {
	                            	_this.recognizeAssignmentVariable(objFormula)
	                            }
	                            // Recognize all variable in formula.
	                            _this.recognizeExpressionVariable(objFormula);
	                            //
	                            objFormula.flagCompiled = (objFormula.lastError) ? false : true;
                                // 编译成功后判断是否要加入缓存列表
                                if(_this.noPreCompiledRules.length < 100){
                                    _this.noPreCompiledRules.push(objFormula);
                                }
	                        } else {
	                        	_this.failedFormulas.push(objFormula);
	                        }
                        }
                        _this.tmpLtAllFormulas.pop();
                    }
            	});
        		
        	}else{
        		var tmpname=[] ;
        		var j= 0;
        		for(var i = 0; i < len; i++){
        			if(i< len/2){
        				if(typeof tmpname[0] ==="undefined"){
        					tmpname[0] = [];
        				}
        				tmpname[0].push(formulas[i]);
        			}else{
        				if(typeof tmpname[1] ==="undefined"){
        					tmpname[1] = [];
        				}
        				tmpname[1].push(formulas[i]);
        			}
        		}
        		_this.splitFormulas(tmpname[0]);
        		_this.splitFormulas(tmpname[1]);
        	}
                 
        };
        
        /**
         * PRIVATE: Compile formula base on the JSON-Data.<BR>
         * 内部方法：基于JSON对象模型来进行公式编译（预处理）。
         */
        FormulaEngine.prototype.compileAll = function(){
            var _start_ = new Date().getTime();
            if (this.lstAllFormulas.length < 1) {
                throw "Formula list is empty!";
            }
            if (typeof this.basename === "undefined" || this.basename == null) {
                throw "Did not setting JSON-Data basename."
            }
            var objFormula;
            if(this.isIE8() && this.lstAllFormulas.length > 200) {
            	 // Resolve all shorted-jpath to full-jpath.
                this.tmpLtAllFormulas = $.extend(true, [], this.lstAllFormulas); 
                this.splitFormulas(this.tmpLtAllFormulas, this);
                //等待上面执行完再执行
                this.createIdxAndTgt();
            } else {
            	//var _ms_ = new Date().getTime();
            	for (var i = 0, len = this.lstAllFormulas.length; i < len; i++) {
            		//TODO 减表的时候找减表对应的公式，是否可以在这里直接分析处理
            		objFormula = this.lstAllFormulas[i];
            		
            		// Resolve all shorted-jpath to full-jpath.
                    // 将所有公式中的所有缩略路解析为全路径.
            		// Resolve shorted-jpath
            		// 若已预编译
            		if (objFormula.flagPreCompiled) {
                    	// 后端编译后的公式进行二次简单编译(判断)
            			this.fmlSimpleCompiled(objFormula);
                    	
                    }  else  {
                    	
                    	if ( this.resolveFormula(objFormula)) { 
                    		
                            // Recognize variable of assignment's part.
                            if (objFormula.strAssResolved) {
                            	this.recognizeAssignmentVariable(objFormula)
                            }
                            // Recognize all variable in formula.
                            this.recognizeExpressionVariable(objFormula);
                            // 
                            objFormula.flagCompiled = (!objFormula.lastError) ;

                            // 编译成功后判断是否要加入缓存列表
                            if(this.noPreCompiledRules.length < 100){
                                this.noPreCompiledRules.push(objFormula);
                            }
                        } else {
                        	this.failedFormulas.push(objFormula);
                        }
                    }
            		
            		// Index all variable.
                    // 建立索引：公式引擎所有的公式中的变量
            		// Duplicate assignment detection
                    if ("1" === this.rightSubstr(objFormula.type, 1) && objFormula.strAssResolved) {
                        if (this.idxAssign2Formulas[objFormula.strAssResolved]) {
                            console.log("WARNING! Duplicate assignment detected of ["
                                + objFormula.strAssResolved + "]:\n--Exist: "
                                + this.idxAssign2Formulas[objFormula.strAssResolved].formula
                                + "\n--Newer: " + objFormula.formula);

                            var objFormulas = [];
                            objFormulas.push(this.idxAssign2Formulas[objFormula.strAssResolved]);
                            objFormulas.push(objFormula);
                            this.idxAssign2Formulas[objFormula.strAssResolved] = objFormulas;
                        } else {
                            this.idxAssign2Formulas[objFormula.strAssResolved] = objFormula;
                        }
                    }
                    // Build up the cascade reference
                    if (objFormula.flagCompiled) {
                        for (var t = 0; t < objFormula.lstVariables.length; t++) {
                            var strVar = objFormula.lstVariables[t];
                            if (!this.idxVariable2Formula[strVar]) {
                                this.idxVariable2Formula[strVar] = [];
                            }
                            this.idxVariable2Formula[strVar].push(objFormula);
                        }
                    }
            		
            	}
            	
                // Decompose targets of control-formula.
                // 解析控制公式中的目标项.
                for (var i = 0, len=this.lstControlFormulas.length; i < len; i++) {
                    objFormula = this.lstControlFormulas[i];
                    if (objFormula.flagCompiled) {
                    	this.decomposeFormulaTargets(objFormula);
                    }
                }
                
                // 解析检验公式中的目标项.
                for (var i = 0, len=this.lstVerifyFormulas.length; i < len; i++) {
                    objFormula = this.lstVerifyFormulas[i];
                    if (objFormula.flagCompiled) {
                    	this.decomposeFormulaTargets(objFormula);
                    }
                }
                
                this.compleflag = true;
                // Index all control-variable's target
            }

            this.printCompiledTime(_start_);
           
        };

        /**
         * PRIVATE: 打印公式编译时间，主要针对IE使用setTimeout时兼容打印
         */
        FormulaEngine.prototype.printCompiledTime = function(_start_){
            var _this = this;

            if (_this.compleflag) {
            var _end_ = new Date().getTime();
                console.log("INFO:" + _start_ + "-" + _end_ + "-" + (_end_ - _start_) + "ms 公式编译:[" + _this.lstAllFormulas.length + "] compiled, ["
                    + _this.failedFormulas.length + "] failed.");
            }else{
                setTimeout(function () {
                    _this.printCompiledTime(_start_);
                });
            }
           
        };
        
        /**
         * PRIVATE: 判断后端编译过的公式在初始化数据下是否可用，不可用则把flagCompiled=false.若公式可用，则创建左边节点<BR>
         */
        FormulaEngine.prototype.fmlSimpleCompiled = function(objFormula){
        	// 如果右边公式节点在数据模型里都存在，则flagCompiled=true，否则为false；flagCompiled=true时，若左边节点不存在，则往数据模型添加节点
        	// 若右边为常量，则flagCompiled=true
        	if (typeof objFormula.lstVariables !== 'undefined') {
        		var variables = '';
        		// 判断右边节点是否存在
        		for(var j = 0,leng=objFormula.lstVariables.length; j < leng; j++) {
        			variables = objFormula.lstVariables[j];
        			variables = variables.replace(/\[#\]/g, "[0]").replace(/\[##\]/g, "[0]").replace(/\[\*\]/g, "[0]");
        			variables = "$."+variables;
        			if (!this.isNodeExist(variables)) {
        				objFormula.flagCompiled = false;
        				this.failedFormulas.push(objFormula);
        				break;
        			}
        		}
        	}
        	// 编译通过后，判断左边节点是否存在，不存在则补全
        	if (objFormula.flagCompiled){
        		this.createAssNode(objFormula);
        	}
        	// 若编译不通过，则清除信息
        	if(!objFormula.flagCompiled) {
        		objFormula.lstVariables = []; // 编译失败的需置空，如校验公式会出现错误提示
        		objFormula.lstTargetResolved = []; // 编译失败的需置空，如校验公式会出现错误提示
        	}
        };
        /**
         * PRIVATE: 创建公式左边节点<BR>
         */
        FormulaEngine.prototype.createAssNode = function(objFormula){
        	// 若左边公式..后第一个节点不存在，则置为编译失败
        	if(!this.firstAssNodeExist(objFormula)){
        		return;
        	}
    		var strAss = objFormula.strAssResolved;
    		if (strAss) {
    			var isExistNode = false;
    			// 判断非动态行节点是否存在，动态行则由创建节点中判断处理
    			if (strAss.indexOf("[#") < 0 && strAss.indexOf("[*") < 0) {
        			if (this.isNodeExist(strAss)) {
        				isExistNode = true;
        			}
    			}
        		// 左边，如果是动态行，父节点下有多少行，就补多少个节点
        		if (!isExistNode) {
                    // Try create assignment node
                    var node = "";
                    if (strAss.indexOf("[#") > 0) {
                        // 2、计算动态参数变量的总数，以便进行遍历计算
    	                var objBase = eval(this.basename);
    	                strAss = strAss.replace(/\[#\]/g, "[*]");
    	                var node = strAss.substring(strAss.lastIndexOf(".")+1);
    	                strAss = strAss.substring(0,strAss.lastIndexOf("."));
    	                strAss = jsonPath(objBase, strAss, { resultType : "PATH" });
    	                if(strAss){
    	                	for (var n = 0; n < strAss.length; n++) {
    		                	strAss[n] = strAss[n].replace(/\[\'/g, ".").replace(/\'\]/g, "");
    		                }
    	                }else{//动态行lb节点不存在时，采用旧逻辑。节点执行期新增。
    	                	strAss = [objFormula.strAssResolved.replace(/\[#\]/g, "[0]")];
    	                	node = "";
    	                }
                    }else{//非动态行时，默认单节点处理
                    	strAss = [objFormula.strAssResolved];
                    	node = "";
                    }
                    
                    for (var k = 0; k < strAss.length; k++) {
                    	var prePath = strAss[k];
                    	var stuffPath = node?("."+node):"";
    	                var fullPath = this.jpathNodeCreate(prePath+stuffPath);
    	                if (fullPath) {
                            //对中间节点增加索引
                            this.jp.addToKVByFullPath(fullPath);
                            //记录公式左边节点strAssignment的下标
                            var idx = [];
                            objFormula.strAssignment = objFormula.strAssignment.replace(/\[([*#\d]+)\]/g, function($1){
                                idx.push($1);
                                return $1;
                            });
                            //把编译成功的全路劲中的下标替换为之前记录的原始下标
                            var t = 0;
                            fullPath = fullPath.replace(/\[([*#\d]+)\]/g, function($1){
                                return idx[t++];
                            });
                            objFormula.strAssResolved = fullPath;
    	                } else {
    	                    // Create node failed.
    	                    console.log("Failed while trying create assignment's json-node  [" + strAss
    	                        + "]" );
    	                    objFormula.lastError = "Failed while trying create assignment's json-node  [" + strAss
	                        + "]" ;
    	                    objFormula.flagCompiled = false;
    	                    this.failedFormulas.push(objFormula);
    	                    break;
    	                }
                    }
        		}
    		}
        };
        /**
         * PRIVATE: 判断左边节点缩略路径第一个节点是否在数据模型formData存在
         */
        FormulaEngine.prototype.firstAssNodeExist = function(objFormula){
        	var strAssigmt = objFormula.strAssignment;
        	// 不存在公式左边则直接返回
        	if (!strAssigmt) {
        		return false;
        	}
        	// 判断缩略路径第一个节点是否在数据模型formData存在，不存在则不创建节点
    		if(strAssigmt.indexOf('..') > 0) {
        		// 以下情况都判断a是否在formData中存在，不存在则不创建节点。
    			// 1、$..a.b 
    			// 2、$.node..a.b
    			// 3、$..node..a.b 
        		strAssigmt = strAssigmt.substr(strAssigmt.lastIndexOf('..')+2); // 取最后一个..后面的 路径a.b
        		if (strAssigmt.indexOf('.') > 0) {
        			strAssigmt = strAssigmt.substr(0, strAssigmt.indexOf('.')); // 取a
        		}
        		
	        	var strAssReso = objFormula.strAssResolved;
	    		if (strAssReso) {
	    			// 正则匹配a[0]/a[10]/a[#]/a[##]/a[*]的情况
	    			// 问题：后端预编译可能会存在原始公式是a[#]，编译后a[0]的情况，如06100101013301016
	    			strAssigmt=strAssigmt.replace(/\[[\d#\*][#\d#\*]*\]/g,'\\[\[\\d#\\*\]\[\\d#\\*\]\*\\]');
	    			// 注意以下情况，截取第一节点时容易入坑
	    			// 1、节点中存在同名情况，如formData.test_1.test.aa
	    			// 2、节点为最后一个节点情况，如formData.node.test
	    			// 匹配节点非最后一个节点情况
	    			// x(?=y)只有当 x后面紧跟着 y时，才匹配 x
	    			var reg = new RegExp('.*\\.'+strAssigmt+'(?=\\.)');
	    			if(reg.test(strAssReso)) {
	    				// 匹配节点非最后一个节点情况
	    				strAssReso=reg.exec(strAssReso);
	    			} else {
	    				// 匹配节点为最后一个节点情况
	    				// x(?!y)只有当 x后面不是紧跟着 y时，才匹配 x
	    				reg = new RegExp('.*\\.'+strAssigmt+'(?!.+)');
                        strAssReso=reg.exec(strAssReso);
	    			}
	    			strAssReso = strAssReso+''; // 转为string
	    		}
	    		// 把动态行下标替换为0
        		if (strAssReso.indexOf("[#") > -1 || strAssReso.indexOf("[*") > -1) {
        			strAssReso = strAssReso.replace(/\[#\]/g, "[0]").replace(/\[##\]/g, "[0]").replace(/\[\*\]/g, "[0]");
        		}
				if (!this.isNodeExist(strAssReso)) {
					objFormula.flagCompiled = false;
					this.failedFormulas.push(objFormula);
					return false;
				}
    		}
        	return true;
        };
        /**
         * 判断节点是否在formData中存在
         */
        FormulaEngine.prototype.isNodeExist = function(node){
        	try {
        		if (node == null || node === '') {
        			return false;
        		}
				node = node.replace(/[$]/g, '');
				var isExist;
				if(this.basename === 'otherParams.formDataJb'){
					eval('isExist = FSformData2' + node);
				}else{
					eval('isExist = formData' + node);
				}
				
				if (typeof isExist === 'undefined') {
					return false;
				}
			} catch (e) {
				return false;
			}
        	return true;
        };
        /**
         * PRIVATE: 创建索引.解析控制公式中的目标项. 解析检验公式中的目标项.<BR>
         * 内部方法：基于JSON对象模型来进行公式编译（预处理）。
         */
        FormulaEngine.prototype.createIdxAndTgt = function(){
        	var _this = this;
        	if(this.tmpLtAllFormulas.length === 0 ){
        		var _ms_ = new Date().getTime();
        		// Index all variable.
                // 建立索引：公式引擎所有的公式中的变量
                for (var i = 0, len = this.lstAllFormulas.length; i < len; i++) {
                    var objFormula = this.lstAllFormulas[i];
                    // Duplicate assignment detection
                    if ("1" === this.rightSubstr(objFormula.type, 1) && objFormula.strAssResolved) {
                        if (this.idxAssign2Formulas[objFormula.strAssResolved]) {
                            console.log("WARNING! Duplicate assignment detected of ["
                                + objFormula.strAssResolved + "]:\n--Exist: "
                                + this.idxAssign2Formulas[objFormula.strAssResolved].formula
                                + "\n--Newer: " + objFormula.formula);

                            var objFormulas = [];
                            objFormulas.push(this.idxAssign2Formulas[objFormula.strAssResolved]);
                            objFormulas.push(objFormula);
                            this.idxAssign2Formulas[objFormula.strAssResolved] = objFormulas;
                        } else {
                            this.idxAssign2Formulas[objFormula.strAssResolved] = objFormula;
                        }
                    }
                    // Build up the cascade reference
                    if (objFormula.flagCompiled) {
                        for (var t = 0; t < objFormula.lstVariables.length; t++) {
                            var strVar = objFormula.lstVariables[t];
                            if (!this.idxVariable2Formula[strVar]) {
                                this.idxVariable2Formula[strVar] = [];
                            }
                            this.idxVariable2Formula[strVar].push(objFormula);
                        }
                    }
                }
                // Decompose targets of control-formula.
                // 解析控制公式中的目标项.
                for (var i = 0, len = this.lstControlFormulas.length; i < len; i++) {
                    var objFormula = this.lstControlFormulas[i];
                    if (objFormula.flagCompiled) {
                    	this.decomposeFormulaTargets(objFormula);
                    }
                }
                
                // 解析检验公式中的目标项.
                for (var i = 0, len = this.lstVerifyFormulas.length; i < len; i++) {
                    var objFormula = this.lstVerifyFormulas[i];
                    if (objFormula.flagCompiled) {
                    	this.decomposeFormulaTargets(objFormula);
                    }
                }
                // Index all control-variable's target
                // 建立索引：控制公式的变量
                _ms_ = new Date().getTime() - _ms_;
                console.log("FormulaEngine: Formulas [" + this.lstAllFormulas.length + "] compiled, ["
                    + this.failedFormulas.length + "] failed, spend " + _ms_ + "ms.");
                
                this.compleflag = true;
    		}else{
    			setTimeout(function(){_this.createIdxAndTgt()},100);
    		}
        	
        };
        
        FormulaEngine.prototype.decomposeFormulaTargets = function(objFormula){
            if ("3" === this.rightSubstr(objFormula.type, 1)
                || "2" === this.rightSubstr(objFormula.type, 1)) {
                var strTar = objFormula.target;
                if (strTar) {
                    var tars = strTar.split(";"); // Multi-target split by ';'
                    for (var i = 0; i < tars.length; i++) {
                        var tar = tars[i].trim();
                        if (tar.length > 0) {
                            var pair = tar.split(":");
                            try{
                            	/**
                            	 * 描述：如果target包含通配符，如$.taxML.formContent.[***]，则此处tmpObj.resolved是一个以“,”分隔数组字符串，
                            	 * 		 处理该数组后，把结果放入objFormula.lstTargetResolved中
                            	 * 修改人：zoufeng@foresee.cn
                            	 * 修改日期：2017-03-13
                            	 * */
                            	var tmpObj = this.resolveExpression(pair[0]);
                            	var tmpResolvedArr = tmpObj.resolved;
                            	if (tmpResolvedArr.search(/^\[(.)*\]$/) !== -1) {	//数组字符串
                            		tmpResolvedArr = tmpObj.resolved.split(",");
                            	} else {
                            		tmpResolvedArr = [ tmpResolvedArr ];
                            	}
                            	var arrLen = tmpResolvedArr.length;
                            	for (var j = 0; j < arrLen; j++) {
                            		var tarResolved = { "jpath" : pair[0], "control" : pair[1] };
                            		var tmp = {
                            				"flagAggregation" : tmpObj.flagAggregation,
                            				"flagDynamicParam" : tmpObj.flagDynamicParam,
                            				"resolved" : tmpResolvedArr[j]
                            		};
                                    if (tmp && tmp.resolved) {
                                    	if (j === 0) {
                                    		tarResolved.variable = tmp.resolved.substr(2);
                                    	} else if (j === arrLen - 1) {
                                    		tarResolved.variable = tmp.resolved.substr(1, tmp.resolved.length - 2);
                                    	} else {
                                    		tarResolved.variable = tmp.resolved.substr(1);
                                    	}
                                    } else {// this case will never come in.  
                                    		// func:resolveExpression() will return a JSON object, or throw an exception.
                                        console.log("WARN: Decompose formula targets failed: " + pair[0]);
                                        objFormula.flagCompiled = false;
                                    }
                                    objFormula.lstTargetResolved.push(tarResolved);
                            	}
                            }catch(ex){
                            	console.log(ex.toString());
                            	//do not push. ignore this pair target-item. 
                            }
                            
                        }
                    }
                } else {
                    // 只有在Chrome模式下才打印warning信息
                    try{
                        if (!$.browser.msie && !$.browser.mozilla){
                    console.log("WARNING: Control formula's target is empty: "
                        + objFormula.formula);
                }
                    }catch (e) {}

            	}
            }
        };
        FormulaEngine.prototype.recognizeAssignmentVariable = function(objFormula){
            var strAssResolved = objFormula.strAssResolved;
            var regJpath = /([$]([.\w]+|\[[.*\w#()]*\])+)/g;
            var regDynamic = /\[(#[A-Za-z]{0,1})\]/g;
            var tmpResult = regJpath.exec(strAssResolved);
            if (null == tmpResult) {
                throw "Assignment recognize failed: " + objFormula.strAssResolved + " in "
                    + objFormula;
            }
            if (regJpath.lastIndex >= strAssResolved.length) {
                if (regJpath.exec(strAssResolved) != null) {
                    throw "Assignment too complex: " + objFormula.strAssResolved + " in "
                        + objFormula;
                }
            }
            do {
                tmpResult = regDynamic.exec(strAssResolved);
                if (null == tmpResult) {
                    break;
                }
                objFormula.lstDynamicParams.push(tmpResult[1]);
            } while (regDynamic.lastIndex < strAssResolved.length);
            if (objFormula.lstDynamicParams.length > 0) {
                objFormula.flagDynamicParam = true;
            }
        };
        FormulaEngine.prototype.recognizeExpressionVariable = function(objFormula){
            var strExpResolved = objFormula.strExpResolved;
            var regJpath = /([$]([.\w]+|\[[.*\w#()]*\])+)/g;
            var tmpResult;
            do {
                tmpResult = regJpath.exec(strExpResolved);
                // console.log(strExpResolved + " :> " + tmpResult);
                if (null == tmpResult) {
                    break;
                }
                var strVariable = tmpResult[0].substr(2);
                if (strVariable.indexOf("[]") > 0) {
                    throw "Illegal empty basket: " + tmpResult[0] + " in " + strExpResolved;
                }
                if (strVariable.indexOf("[#") > 0) {
                    objFormula.flagDynamicParam = true;
                }
                var flagAdd = false;
                if (objFormula.flagAggregation) {
                    // TODO: Should do some merge to reduce the number of variable.
                    strVariable = strVariable.replace(this.regBasket, "[*]");
                    if (strVariable.indexOf("[*]") >= 0) {
                        var t = 0, lstVarLen = objFormula.lstVariables.length;
                        for (; t < lstVarLen; t++) {
                            if (objFormula.lstVariables[t] === strVariable) {
                                break;
                            }
                        }
                        if (t >= lstVarLen) {
                            flagAdd = true;
                        }
                    }else{
                    	//针对 a = b + SUM();需要将b也存入 lstVariables 中
                    	flagAdd = true;
                    }
                } else {
                    flagAdd = true;
                }
                if (flagAdd) {
                	//如果存在就不需要添加
                	var t = 0, lstVarLen = objFormula.lstVariables.length;
                    for (; t < lstVarLen; t++) {
                        if (objFormula.lstVariables[t] === strVariable) {
                            break;
                        }
                    }
                    if (t >= lstVarLen) {
                    	objFormula.lstVariables.push(strVariable);
                    }
                    
                    //qyndglywwlbgywbw.qyndglywwlbg2016_G110000hj.cbftxybGrid.cbftxybGridlbVO[##].jbxxGrid.jbxxGridlbVO[0].cbftxymc
                    //如果为固定动态行则需要把[0]替换成#号
                    if(strVariable.indexOf('[##]') > 0){
                    	var tmpStrVariable = strVariable.replace(/\[\d+\]/,'[#]')
                    	var t = 0, lstVarLen = objFormula.lstVariables.length;
                        for (; t < lstVarLen; t++) {
                            if (objFormula.lstVariables[t] == tmpStrVariable) {
                                break;
                            }
                        }
                        if (t >= lstVarLen) {
                        	objFormula.lstVariables.push(tmpStrVariable);
                        }
                    }
                }
            } while (regJpath.lastIndex < strExpResolved.length);
        };
        FormulaEngine.prototype.jpathNodeCreate = function(strJpath){
            if (strJpath.substr(0, 2) !== "$.") {
                console.log("JPath illegal while trying jpathNodeCreate, should start with '$.' :"
                    + strJpath);
                return;
            }
            var objBase = eval(this.basename);
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
        FormulaEngine.prototype.createSubPath = function(objBase, subPath){
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
         * 对公式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
         */
        FormulaEngine.prototype.resolveFormula = function(objFormula){
            var _start_ = new Date().getTime();
            // 公式编译结束时间
            var _end_;
            var _this = this;
            var tmp;
            // Resolve expression part, right of equal-mark
            try {
                tmp = _this.resolveExpression(objFormula.strExpression);
                objFormula.strExpResolved = tmp.resolved;
                objFormula.flagAggregation = tmp.flagAggregation;
                objFormula.flagDynamicParam = tmp.flagDynamicParam;
            } catch (ex) {
                objFormula.lastError = ex;
                _end_ = new Date().getTime();
                console.log("INFO:"+ _start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 编译失败耗时: " + ex);
                return false;
            }
            // Resolve assignment part, left of equal-mark
            try {
                if (objFormula.strAssignment) {
                    tmp = this.resolveExpression(objFormula.strAssignment);
                    objFormula.strAssResolved = tmp.resolved;
                }
            } catch (ex) {
                // Try create assignment node
                var strAss = objFormula.strAssignment;
                var node = "";
                if (strAss.indexOf("[#") > 0) {
                    // 2、计算动态参数变量的总数，以便进行遍历计算
	                var objBase = eval(this.basename);
	                strAss = strAss.replace(/\[#\]/g, "[*]");
	                var node = strAss.substring(strAss.lastIndexOf(".")+1);
	                strAss = strAss.substring(0,strAss.lastIndexOf("."));
	                strAss = jsonPath(objBase, strAss, { resultType : "PATH" });
	                if(strAss){
	                	for (var i = 0; i < strAss.length; i++) {
		                	strAss[i] = strAss[i].replace(/\[\'/g, ".").replace(/\'\]/g, "");
		                }
	                }else{//动态行lb节点不存在时，采用旧逻辑。节点执行期新增。
	                	strAss = [objFormula.strAssignment.replace(/\[#\]/g, "[0]")];
	                	node = "";
	                }
                }else{//非动态行时，默认单节点处理
                	strAss = [objFormula.strAssignment];
                	node = "";
                }

                for (var k = 0; k < strAss.length; k++) {
                	var prePath = strAss[k];
                	var stuffPath = node?("."+node):"";
	                var fullPath = this.jpathNodeCreate(prePath+stuffPath);
	                if (fullPath) {
                        //对中间节点增加索引
                        this.jp.addToKVByFullPath(fullPath);
                        //记录公式左边节点strAssignment的下标
                        var idx = [];
                        objFormula.strAssignment = objFormula.strAssignment.replace(/\[([*#\d]+)\]/g, function($1){
                            idx.push($1);
                            return $1;
                        });
                        //把编译成功的全路劲中的下标替换为之前记录的原始下标
                        var t = 0;
                        fullPath = fullPath.replace(/\[([*#\d]+)\]/g, function($1){
                            return idx[t++];
                        });
                        objFormula.strAssResolved = fullPath;
                    } else {
	                    // Create node failed.
	                    console.log("Failed while trying create assignment's json-node  [" + strAss
	                        + "]: " + ex);
	                    objFormula.lastError = ex;
                        _end_ = new Date().getTime();
                        console.log("INFO:"+ _start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 中间节点编译失败耗时:[" + strAss+ "]: " + ex);
	                    return false;
	                }
                }
                _end_ = new Date().getTime();
                console.log("INFO:"+ _start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 中间节点编译成功耗时:[" + strAss+ "]: " + ex);
            }

            return true;
        };
        /**
         * 对字符串表达式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
         */
        FormulaEngine.prototype.resolveExpression = function(strExp){
            var lastPos = 0;
            var strFast = "";
            var flagAggregation = false;
            /*
             * 描述：新增条件[*]{3}，使得target支持通配。
              		 如："target": "$.taxML.formContent.[***]:disabled;", 会将数据模型taxML.formContent下所有叶子节点对应的元素置为disabled；
             * 修改人：zoufeng@foresee.cn
             * 修改日期：2017-03-13
             * **/
            var regFastJpath = /([$]([.\w]+|\[([*#]|[*]{3}|[#]{2}|[\d]+)\])+)/g;
            do {
                var fastResult = regFastJpath.exec(strExp);
                // console.log(result);
                if (null == fastResult) {
                    strFast += strExp.substr(lastPos, strExp.length - lastPos);
                    break;
                }
                strFast += strExp.substr(lastPos, fastResult.index - lastPos);
                var fastJpaths = this.jp.paths(fastResult[0]);
                if (!fastJpaths) {
                    throw "Resolve expression failed: JsonPath [" + fastResult[0] + "] in ["
                        + strExp + "] select empty, can't resolve the full-path."
                } else if (fastJpaths.length > 1) {
                    //confusingDetecte
                    this.confusingDetecte(fastResult[0], strExp);
                }
                for (var i = 0; i < fastJpaths.length; i++) {
                    fastJpaths[i] = fastJpaths[i].replace(/\[([a-zA-Z_][\w]*)\]/g, ".$1");
                }
                if (fastJpaths.length > 1) {
                    strFast += "[" + fastJpaths + "]";
                } else {
                    strFast += fastJpaths[0];
                }
                lastPos = regFastJpath.lastIndex;
            } while (regFastJpath.lastIndex < strExp.length);
            if (strExp.indexOf("[*]") >= 0) {
                flagAggregation = true;
            }
            //return { 'resolved' : strRet, 'flagAggregation' : flagAggregation, 'flagDynamicParam' : (strExp.indexOf("[#") > 0) };
            return { 'resolved' : strFast, 'flagAggregation' : flagAggregation,
                'flagDynamicParam' : (strExp.indexOf("[#") > 0) };
        };
        /**
         * 对字符串表达式中所包含的各jpath进行解析，主要是将其从短路径形式解析为全路径形式。
         */
        FormulaEngine.prototype.resolveExpressionFull = function(strExp){
            var lastPos = 0;
            var strRet = "";
            var flagAggregation = false;
            var regJpath = /([$]([.\w]+|\[([*]|[\d]+)\])+)/g;
            do {
                var result = regJpath.exec(strExp);
                // console.log(result);
                if (null == result) {
                    strRet += strExp.substr(lastPos, strExp.length - lastPos);
                    break;
                }
                strRet += strExp.substr(lastPos, result.index - lastPos);
                var arrJpaths = jsonPath(eval(this.basename), result[0], { resultType : "PATH" });
                if (!arrJpaths) {
                	// Added By C.Q 20170808 GEARS-3872 动态行-删除最后一行，求和公式失效报错
                	// 修改方案：如果为求和公式内的节点不存在，则把该节点替换成0；
                	// 例1：SUM($..sbbxxGridlb[*].sjzdmj) -> SUM(0)
                	// 例2：ROUND(SUM($..qysdshznsfzjgsdsfpsbbfzjgGridlb[*].fpse)+SUM($..jwfzjgmbksmxbgridVO[*].jzhndmbsjksexj),2) -> ROUND(SUM(0)+SUM(0),2)
                	// 例3：ROUND($..jwfzjgmbksmxbgridVO.jzhndmbfsjkse+SUM($..jwfzjgmbksmxbgridVO[*].jzhndmbsjksexj),2) -> ROUND($..jwfzjgmbksmxbgridVO.jzhndmbfsjkse+SUM(0),2)
                	// 正则表达式符号解释:\s=匹配任何空白字符，包括空格、制表符、换页符等等。\w=匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'。\d=数字
                	var pattern = /SUM\s*\(\s*\$\.*\w*\[([*]|[\d]+)\]\.\w+\)/g; // 匹配公式中是否含有求和表达式，如SUM($..sbbxxGridlb[*].sjzdmj)，只匹配单个节点合计情况
                	var resultNode;
					var isHasReplace = false; // 是否把不存在节点替换成 0 
					do
					{
						resultNode = pattern.exec(strExp);
						if(resultNode != null) {
							// 如果是求和公式
							var pattern2 = /\$\.*\w*\[([*]|[\d]+)\]\.\w+/; // 提取SUM内节点
							// 判断SUM内的节点是否为json对象没有的节点，存在则替换成0
							if(resultNode[0].match(pattern2)[0] === result[0]) {
								strRet += '0';//把空节点替换为0
								isHasReplace =true;
								continue;
							}
						}
					} while (resultNode!=null) ;
                	if(isHasReplace) {
						lastPos = regJpath.lastIndex;
						continue;
					}
                    throw "Resolve expression failed: JsonPath [" + result[0] + "] in [" + strExp
                        + "] select empty, can't resolve the full-path.";
                } else if (arrJpaths.length > 1) {
                    //confusingDetecte
                    this.confusingDetecte(result[0], strExp);
                }
                for (var i = 0; i < arrJpaths.length; i++) {
                    arrJpaths[i] = arrJpaths[i].replace(/\[\'/g, ".").replace(/\'\]/g, "");
                }
                if (arrJpaths.length > 1) {
                    strRet += "[" + arrJpaths + "]";
                } else {
                    strRet += arrJpaths[0];
                }
                lastPos = regJpath.lastIndex;
            } while (regJpath.lastIndex < strExp.length);
            if (strExp.indexOf("[*]") >= 0) {
                flagAggregation = true;
            }
            return { 'resolved' : strRet, 'flagAggregation' : flagAggregation,
                'flagDynamicParam' : (strExp.indexOf("[#") > 0 ) };
        };
        
        /*
         * 
         * 
         * */
        FormulaEngine.prototype.confusingDetecte = function(jpath, strExp){
            var regArray = /\[[#$\d]*\]/g;
            var posMulti = jpath.indexOf("..");
            if (posMulti >= 0) {
                posMulti += 2;
                var posDot = jpath.indexOf(".", posMulti);
                var posBracket = jpath.indexOf("[", posMulti);
                if (posDot <= 0) {
                    posMulti = posBracket;
                } else if (posBracket <= 0) {
                    posMulti = posDot;
                } else {
                    posMulti = this.min(posDot, posBracket);
                }
                if (posMulti > 0) {
                    var preJpath = jpath.substr(0, posMulti);
                    var arrJpaths = jsonPath(eval(this.basename), preJpath, { resultType : "PATH" });
                    if (arrJpaths.length > 1) {
                        var base = arrJpaths[0];
                        for (var i = 1; i < arrJpaths.length; i++) {
                            if (base !== arrJpaths[i]) {
                                console.log("WARN JsonPath confusing detected: JsonPath [" + jpath
                                    + "] in [" + strExp + "] has multi paths");
                                for (var k = 0; k < arrJpaths.length; k++) {
                                    console.log("--" + k + ": "
                                        + arrJpaths[k].replace(/\[\'/g, ".").replace(/\'\]/g, ""));
                                }
                                throw "JsonPath confusing detected! JsonPath [" + jpath + "] in ["
                                    + strExp + "] has multi paths, can't resolve the full-path.";
                            }
                        }
                    }
                }
            }
        };
        /**
         * 
         */
        FormulaEngine.prototype.setValue = function(varName, newValue){
            var str = this.basename + "." + varName + "=" + newValue;
            eval(str);
        };
        FormulaEngine.prototype.min = function(){
            if (arguments.length > 0) {
                var ps = arguments;
                if (ps.length > 0) {
                    var min = ps[0];
                    for (var i = 1; i < ps.length; i++) {
                        min = (min < ps[i]) ? (min) : (ps[i]);
                    }
                    return min;
                }
            }
        };
        FormulaEngine.prototype.hasProperty = ((Object.getOwnPropertyNames && Object
            .getOwnPropertyNames(FormulaEngine).length) ? function(obj){
            return Object.getOwnPropertyNames(obj).length > 0;
        } : function(obj){
            for ( var i in obj)
                if (obj.hasOwnProperty(i)) {
                    return true;
                }
            return false;
        });
        FormulaEngine.prototype.countProperty = ((Object.getOwnPropertyNames && Object
            .getOwnPropertyNames(FormulaEngine).length) ? function(obj){
            return Object.getOwnPropertyNames(obj).length;
        } : function(obj){
            var count = 0;
            for ( var i in obj)
                if (obj.hasOwnProperty(i)) {
                    count++;
                }
            return count;
        });
        FormulaEngine.prototype.rightSubstr = function(str, num){
            if (str) {
                var pos = str.length - num;
                if (pos < 0) {
                    pos = 0;
                }
                return str.substr(pos);
            }
        };
        FormulaEngine.prototype.searchAssignMark = function(exp){
            var posEqual = exp.search(this.regAssignMark);
            if (posEqual > 0 && exp.charAt(posEqual) !== "=") posEqual++;
            return posEqual;
        };
        
        /**
         * 对校验不通过的公式，重新执行校验
         * 
         */
        FormulaEngine.prototype.reVerifyNoPass = function(){
        	var reVerifyNoPassFull = this.idxVariable2NoPass;
        	var reVerifyFormulas = [];
        	for(var i in reVerifyNoPassFull){
        		for(var j in reVerifyNoPassFull[i]){
        			reVerifyFormulas.push(reVerifyNoPassFull[i][j]);
        		}
        	}
        	this.procVerifyFormulas = reVerifyFormulas;
        	this.applyAssociatedFormulaVerify(null);
			this.procVerifyFormulas = [];
        };
        
        FormulaEngine.prototype.twoDynamicReplace = function(dynamicParams,jpath){
        	//两级动态行的时候，如外层动态行还存在其他校验，则此时是普通的动态行
            if (dynamicParams) {
            	 if(dynamicParams.length === 2){
            		 if(jpath.indexOf('[##]') > -1){
            			 jpath = jpath.replace(/\[##\]/g, "[" + dynamicParams[0] + "]");
                		 jpath = jpath.replace(/\[#\]/g, "[" + dynamicParams[1] + "]");
            		 }else{
                		 jpath = jpath.replace(/\[#\]/g, "[" + dynamicParams[0] + "]");
            		 }
                 }else{
                	 jpath = jpath.replace(/\[#\]/g, "[" + dynamicParams[0] + "]")
                	 	.replace(/\[##\]/g, "[" + dynamicParams[0] + "]");
                 }
            }
            return jpath;
        };
        
      //------------------以下方法与执行某类型公式相关 start---------------------//
        /**
         *	var types = ['10','12'];
		 *  formulaEngine.applyImportFormulasBytypes(types);
		 *  related :  true=执行关联公式，flase或不传值=不执行关联公式
         *  外部方法：根据传入公式类型执行公式，由related参数控制是否执行关联公式 C.Q
         */
        FormulaEngine.prototype.applyImportFormulasBytypes = function(types, related){
        	if(Object.prototype.toString.call(types) === '[object Array]') {
				if ($.inArray('10', types) >= 0) {
				    // 1、先执行10类型赋值公式
					var lstInitials = this.lstInitialFormulas;
					var lstInitialFormulasLocal = [];
					for (var i = 0; i < lstInitials.length; i++) {
						if ("10" === lstInitials[i].type) { // All
							lstInitialFormulasLocal.push(lstInitials[i]);
						}
					}
					if (related) {
						this.calculationPlanningOfList(lstInitialFormulasLocal, undefined, true);
					} else {
						this.calculation4Alone(lstInitialFormulasLocal, undefined, true);
					}
					//执行完回收资源
                    lstInitialFormulasLocal = [];
				}
				if ($.inArray('01', types) >= 0 || $.inArray('11', types) >= 0) {
					// 2、再执行计算公式 01，11
                    var lstCalculates = this.lstCalculateFormulas;
                    var lstCalculatesFormulasLocal = [];

                    for (var i = 0; i < lstCalculates.length; i++) {
                        //有传入01，则把01类型的公式加入到lstCalculatesFormulasLocal中
                        if ($.inArray('01', types) >= 0 && "0" === lstCalculates[i].type.substr(0, 1)) {
                            lstCalculatesFormulasLocal.push(lstCalculates[i]);
                        }
                        //有传入11，则把11类型的公式加入到lstCalculatesFormulasLocal中
                        if($.inArray('11', types) >= 0 && "1" === lstCalculates[i].type.substr(0, 1)){
                            lstCalculatesFormulasLocal.push(lstCalculates[i]);
                        }
                    }

					if (related) {
						this.calculationPlanningOfList(lstCalculatesFormulasLocal, undefined, true);
					} else {
						this.calculation4Alone(lstCalculatesFormulasLocal, undefined, true);
					}
                    //执行完回收资源
                    lstCalculatesFormulasLocal = [];
				}
				if ($.inArray('02', types) >= 0 || $.inArray('12', types) >= 0) {
					// 再执行校验公式 02，12
					var verifies = this.lstVerifyFormulas;
					this.procVerifyFormulas = [];
					for (var i = 0; i < verifies.length; i++) {
                        //有传入02，则把02类型的公式加入到this.procVerifyFormulas中
                        if ($.inArray('02', types) >= 0 && "0" === verifies[i].type.substr(0, 1)) {
                            this.procVerifyFormulas.push(verifies[i]);
                        }
                        //有传入12，则把12类型的公式加入到this.procVerifyFormulas中
                        if($.inArray('12', types) >= 0 && "1" === verifies[i].type.substr(0, 1)){
                            this.procVerifyFormulas.push(verifies[i]);
                        }
					}
					this.applyAssociatedFormulaVerify(null);
					//执行完回收资源
                    this.procVerifyFormulas = [];
				}
				if ($.inArray('03', types) >= 0 || $.inArray('13', types) >= 0) {
					// 最后执行控制公式 03，13
					var controls = this.lstControlFormulas;
					for (var i = 0; i < controls.length; i++) {
						var objFormula = controls[i];
                        //有传入03，则执行03公式
						if ($.inArray('03', types) >= 0 && "0" === objFormula.type.substr(0, 1)) {
							objFormula.lastControl = this.execNoCaculateFormula(objFormula);
							this.effectingControl(objFormula.lastControl,objFormula.lstTargetResolved);
						}
                        //有传入13，则执行13公式
						if($.inArray('13', types) >= 0 && "1" === objFormula.type.substr(0, 1)){
                            objFormula.lastControl = this.execNoCaculateFormula(objFormula);
                            this.effectingControl(objFormula.lastControl,objFormula.lstTargetResolved);
                        }
					}
				}
			}
        };
        
        /**
         * 独立执行公式（不执行关联公式）
         * 内部方法：依据初始给出的公式列表，查找出所有关联公式，并按照前后依赖关系进行计算。
         * @param lstFormulas 待处理公式队列：[FormulaObj, FormulaObj, ...]
         * @warning Currently only support one dynamic parameter. 目前仅支持一个动态参数值.
         */
        FormulaEngine.prototype.calculation4Alone = function(lstFormulas, dynamicParams,
            flagInitial){
            var lst = [];
            this.addingFormulaList(lst, lstFormulas, dynamicParams);
            //this.calculationPlanning(lst, dynamicParams, flagInitial);
            return this.calculation8DAGsorting4Alone(lst, dynamicParams,
                    flagInitial);
        };
        /**
         * 内部方法：参照calculationPlanning8DAGsorting方法,区别是不会执行关联公式
         * 
         * @param lstFormulaAndParams 待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]
         * @param dynamicParams 暂未使用.
         * @param flagInitial 是否为初始化（初始化调用时才为true）.
         * @return Calculate successful, boolean. 计算是否成功, 布尔值.
         */
        FormulaEngine.prototype.calculation8DAGsorting4Alone = function(lstFormulaAndParams,
            dynamicParams, flagInitial){
            console.log("FormulaEngine: calculation8DAGsorting4Alone(), incoming ["
                + lstFormulaAndParams.length + "]......");
            var _ms_ = new Date().getTime();
            // 一、标记过程（形成计算区，也即子图）
            var area = this.marking4DAGsorting(lstFormulaAndParams, true);
            var _ms_marking_ = new Date().getTime() - _ms_;
            var _cnt_marking_ = this.countProperty(area);
            // 二、清理过程（逐步清理入度为0节点，形成计算顺序）
            var orderList = this.cleaning4DAGsorting(area);
            var _ms_cleaning_ = new Date().getTime() - _ms_ - _ms_marking_;
            var _cnt_cleaning_ = this.countProperty(orderList);
            // 三、按顺序执行计算
            var ret = this.calculateAccordingPlan(orderList, flagInitial);
            var _ms_calculate_ = new Date().getTime() - _ms_ - _ms_cleaning_ - _ms_marking_;
            _ms_ = new Date().getTime() - _ms_;
            console.log("FormulaEngine: calculationPlanning8DAGsorting() done. marking ["
                + _cnt_marking_ + "] " + _ms_marking_ + "ms, cleaning [" + _cnt_cleaning_ + "] "
                + _ms_cleaning_ + "ms, calculating " + _ms_calculate_ + "ms. Total spend " + _ms_
                + "ms.");
        };

        /**
         * 内部方法：判断是否IE8
         * @return 是否ie8, boolean., 布尔值.
         */
        FormulaEngine.prototype.isIE8 = function(){
            return navigator.appName === "Microsoft Internet Explorer"
                && (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE8.0"
                    ||  navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE7.0");
        };


        /**
         * 初始化 外部初始化动态行公式
         * 动态行公式 数据结构形如："qcs.grid.gridlb[#]"=[{"key":{"zsxmDm":"001","zspmDm":"001001"},"je":1000,"sl":0.01}……]
         * 等号左边为动态行jpath，注意带上[#]表示为动态行
         * 等号右边为一个json数组，每一个json对象包含一个key节点（key节点目的是唯一确定该动态行在formData动态行中真实的行下标）和动态行下需要赋值的节点
         */
        FormulaEngine.prototype.initWbcshDynamicFormula = function(key, val){
            //返回公式列表
            var lstWbcshFormula = [];
            //对动态行中关键key和下标建索引
            var idxKeyIdx = {};
            //jsonPath解析formData得到动态行lb
            var tmpLb = jsonPath(formData, key.replace(/\[[#]\]/g, "[*]"));
            //获取json数组json对象中的key节点（key节点目的是唯一确定该json对象在formData动态行lb中的真实行下标），认为每个key的数据结构一致
            var idxKeyObj = val[0].key;
            //循环动态行lb
            for (var i = 0; i < tmpLb.length; i++) {
                //得到lb下的对象
                var tmp = tmpLb[i];

                /**
                 * 定义动态行中关键key
                 * 例如：外部初始化json数组json对象中的key节点是"key":{"zsxmDm":"001","zspmDm":"001001"}
                 * 则取出每个lb对象中的zsxmDm的值和zspmDm的值以_连接为idxKeyIdx索引的键，lb下标为值 创建idxKeyIdx索引
                 */
                var idxKeyIdxKey = "";
                for (var idxKey in idxKeyObj) {
                    idxKeyIdxKey = idxKeyIdxKey + tmp[idxKey] + "_";
                }

                //创建索引
                idxKeyIdx[idxKeyIdxKey] = i;
            }

            //循环外部初始化动态行公式，等号右边节点json数组
            for (var j = 0; j < val.length; j++) {
                //获取json对象
                var valObj = val[j];
                //获取json对象中的key节点（key节点目的是唯一确定该json对象在formData动态行lb中的真实行下标）
                var idxKeyObj = valObj.key;

                /**
                 * key节点中的所有值用_连接拼装为关键key
                 * 例如：外部初始化json数组json对象中的key节点是"key":{"zsxmDm":"001","zspmDm":"001001"}
                 * 则取出每个json对象中的key节点的zsxmDm的值和zspmDm的值以_连接 到idxKeyIdx索引取值
                 * 如果取到值那个该值就是该json对象在formData动态行lb中的真实行下标
                 */
                var idxKeyIdxKey = "";
                for (var idxKey in idxKeyObj) {
                    idxKeyIdxKey = idxKeyIdxKey + idxKeyObj[idxKey] + "_";
                }

                var idx = idxKeyIdx[idxKeyIdxKey];
                if(typeof idx !== "undefined"){
                    //表示在formData动态行lb的索引中找到真实行下标
                    var formulaIdx = 0;
                    for (var valKey in valObj) {
                        if(valKey !== "key"){
                            //替换#为真实真实行下标，并拼装json对象中除去key之外的其他要素节点，得到要素节点全部路径
                            var jpath =  key.replace(/\[[#]\]/g, "[" + idx + "]") + "." + valKey;
                            //获取要素节点value值
                            var jpathVal = valObj[valKey];
                            //构造外部初始化公式，并把外部初始化公式加入返回列表
                            formulaIdx++;
                            lstWbcshFormula = lstWbcshFormula.concat(this.initWbcshFormula(jpath, jpathVal, idx + "Dynamic" + formulaIdx));
                        }
                    }
                }
            }

            return lstWbcshFormula;
        };

        /**
         * var ids = ['10000000001', '10000000002']
         * ids: 需要执行的公式id列表
         * 根据传入公式id执行公式
         */
        FormulaEngine.prototype.applyImportFormulasByFormulaIds = function(ids) {
        	// 
        	this.procVerifyFormulas = [];
        	for (var i=0 ; i<ids.length ; i++) {
        		var formula = this.getFormulaById(ids[i]);
        		this.procVerifyFormulas.push(formula);
        		
        	}
        	this.applyAssociatedFormulaVerify(null);
        	this.procVerifyFormulas = [];
        };

        //------------------执行某类型公式相关 end---------------------//
        // For not to do initialization twice.
        FormulaEngine._inited = true;
    }
    /**
     * Internet Explorer 8 Compatible
     */
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function(){
        	if(Object.prototype.toString.call(this) === "[object String]"){
        		//认为是String类型，进行trim处理
        		return this.replace(/^\s+|\s+$/g, '');
        	}else{
        		//不是String类型，不处理
        		return this;
        	}
        };
    }
    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function(obj, start){
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        }
    }
}


/**
 * 默认处理器，在执行公式计算时，进行跳过处理。
 * _FormulaEngine_defaultFilterHandler
 * handle
 * @param 外部参数
 * @param 公式
 * @param 动态行下标
 * @param 公式类型
 */
var _FormulaEngine_defaultFilterHandler={
    "_zcInit":function(params,objFormula,dynamicParams,formualType){
        /*
         * 暂存公式，对标记Y的公式关联后执行，但由于有些公式不想执行，给关联出来。需要进行跳过执行。
         * 对标记为为A的公式跳过处理
         */
        if(objFormula.zcInit == "A"){ //暂存初始化，不执行
        return false;
    }
        return true;
    }
}