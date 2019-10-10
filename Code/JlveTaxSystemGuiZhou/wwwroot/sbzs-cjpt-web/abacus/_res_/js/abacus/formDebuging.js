var formDebuging;
//closebtn在formEngine.js里面有用到，所以调到全局变量
var closebtn = 0;
$(document).ready(function(){
    formDebuging = new FormDebuging();
});
/**
 * Depend on two parameters: formData / formulaEngine
 */
function FormDebuging(){
    /**
     * Constant. 常量定义.
     */
    FormDebuging.prototype.URL_SAVE_2_FILE = contextPath+"/formula/save.do";
    FormDebuging.prototype.URL_SAVE_TBSM = contextPath+"/formula/savetbsm.do";
    FormDebuging.prototype.URL_EXTRACT_TBSM = contextPath+"/formula/exttbsm.do";
    FormDebuging.prototype.TBSM_JSON = null;
    this.lastSelectedFormulaElement;// Last selected formula element.
    this.jpath = "";
    this.formulaListFilters = [];
    this.flagInited = false;
    if (typeof this.formData == "" || this.formData == null) {
        this.formData = typeof formData === "undefined"?undefined:formData; // Try global parameter.
    }
    this.flagInited = true;
    this.lastStringData = "";
    // Declare function
    if (typeof FormDebuging._inited == "undefined") {
        FormDebuging.prototype.setDatamodelFilter = function(newJpath){
            this.jpath = newJpath;
        };
        FormDebuging.prototype.showData = function(){
            var divDataView = $("#divDebugDataView");
            var frmDebugDataView = $(document.getElementById('frmDebugDataView').contentWindow.document.body);
            var displayData = formData; // Global variable: formData
            if (displayData) {
                if (this.jpath) {
                    var arrJpaths = jsonPath(displayData, this.jpath);
                    if (arrJpaths) {
                        $("#lblJpathSelected").html(arrJpaths.length + " selected.");
                        if (arrJpaths.length > 1) {
                            displayData = arrJpaths;
                        } else {
                            displayData = arrJpaths[0];
                        }
                    } else {
                        $("#lblJpathSelected").html("JPath illegal");
                    }
                } else {
                    $("#lblJpathSelected").html("Input jpath below:");
                }
                var strData = JSON.stringify(displayData, null, 2);
                if (this.lastStringData != strData) {
                    this.lastStringData = strData;
                    frmDebugDataView.html("<pre>" + strData + "</pre>");
                }
            } else if (formData) {
                this.formData = formData;
            }
        };
        FormDebuging.prototype.clickFormulaListClear = function(elem, event){
            var jqTxtFormulaSearch = $('#txtFormulaSearch');
            jqTxtFormulaSearch.val("");
            jqTxtFormulaSearch.css("background-color", "");
            formDebuging.setFormulaSearch();
        };
        FormDebuging.prototype.setFormulaSearch = function(newJpath){
            if ("undefined" != typeof newJpath && newJpath.length > 2
                && newJpath.substr(0, 2) == "$.") {
                var jqTxtFormulaSearch = $("#txtFormulaSearch");
                var fullPaths = jsonPath(formData, newJpath, { resultType : "PATH" }); // 用于对比
                if (!fullPaths) {
                    jqTxtFormulaSearch.css("background-color", "#FFDDDD");
                } else {
                    jqTxtFormulaSearch.css("background-color", "");
                }
                for (var i = 0; i < fullPaths.length; i++) {
                    fullPaths[i] = fullPaths[i].replace(/\[\'/g, ".").replace(/\'\]/g, "");
                }
                this.formulaListFilters = fullPaths;
            } else {
                this.formulaListFilters = [];
            }
            this.showFormulaList();
        };
        FormDebuging.prototype.showFormulaList = function(newFormulaId){
            var jqFormulaList = $("#divFormulaList");
            if (formulaEngine) {
                var lstFormulas = formulaEngine.lstAllFormulas; // Global
                if (this.formulaListFilters && this.formulaListFilters.length > 0) {
                    lstFormulas = formulaEngine.getFormulasByVariables(this.formulaListFilters);
                }
                // Get the last selection.
                var selectedId;
                if (this.lastSelectedFormulaElement) {
                    var jqElem = $(this.lastSelectedFormulaElement);
                    var id = jqElem.attr("id").substr(jqElem.attr("id").indexOf("#") + 1);
                    if (id) {
                        selectedId = id;
                    }
                    this.lastSelectedFormulaElement = null;
                }
                if (newFormulaId) {
                    selectedId = newFormulaId;
                }
                if (lstFormulas) {
                    var strHtml = "";
                    jqFormulaList.html("");
                    for ( var i in lstFormulas) {
                        var objFormula = lstFormulas[i];
                        var css = objFormula.flagCompiled ? "" : "error";
                        var jqLi = $("<li>", { "nowrap" : "nowrap",
                            "id" : "debugFID#" + objFormula.id,
                            "title" : objFormula.desc + "\n" + (objFormula.lastError || ""),
                            "class" : css,
                            "ondblclick" : "formDebuging.dblclickFormulaList(this, event)",
                            "onmouseover" : "formDebuging.mouseoverFormulaList(this, event)",
                            "onmouseout" : "formDebuging.mouseoutFormulaList(this, event);" });
                        jqLi.html(" [" + objFormula.type + "] " + objFormula.formula);
                        if (selectedId == objFormula.id) {
                            jqLi.addClass("selected");
                            this.lastSelectedFormulaElement = jqLi[0];
                        }
                        jqFormulaList.append(jqLi);
                    }
                    if (newFormulaId) {
                        window.setTimeout("formDebuging.scrollToHighlightFormula()", 100);
                    }
                } else {
                    window.setTimeout("formDebuging.showFormulaList()", 50);
                    return;
                }
                this.debugViewControl.resize();
            }
        };
        FormDebuging.prototype.getLastSelectedFormula = function(){
            if (this.lastSelectedFormulaElement) {
                var jqElem = $(this.lastSelectedFormulaElement);
                var id = jqElem.attr("id").substr(jqElem.attr("id").indexOf("#") + 1);
                var objFormula = formulaEngine.idxId2Formulas[id];
                return objFormula;
            }
        };
        FormDebuging.prototype.scrollToHighlightFormula = function(){
            if (formDebuging.lastSelectedFormulaElement) {
                var jqFormulaList = $("#divFormulaList");
                if (jqFormulaList) {
                    if (formDebuging.lastSelectedFormulaElement) {
                        var offTop = formDebuging.lastSelectedFormulaElement.offsetTop;
                        jqFormulaList.scrollTop(offTop);
                    }
                }
            }
        };
        FormDebuging.prototype.ctrlClickInputUI = function(elem, event){
            var jpath = $(elem).attr('jpath');
            if ("undefined" == typeof jpath || jpath.length <= 0) {
                this.setFormulaSearch("");
            } else {
                jpath = "$." + jpath;
                $("#txtFormulaSearch").val(jpath);
                this.setFormulaSearch(jpath);
            }
        };
        /**
         * Event handler: dblclick on input UI.
         */
        FormDebuging.prototype.dblclickInputUI = function(elem, event){
        	//此处避免重复绑定事件
        	if(event._first) return ; 
			event._first=1;
			
            // Get jpath from InputUI
            var jpath = $(elem).attr('jpath');
            if ("undefined" == typeof jpath || jpath.length <= 0) {
                return;
            }
            jpath = "$." + jpath;
            var fullPath = jsonPath(formData, jpath, { resultType : "PATH" }); // 用于对比
            if (!fullPath) {
                dhtmlx.message("Jpath not founded in formData", "info", 1500);
            }
            // Try to translate to short-name.
            if (jpath.indexOf("..") < 0 && fullPath.length == 1) {
                var paths = jpath.split(".");
                if (paths.length > 2) {
                    fullPath = fullPath[0];
                    var lastShortPath = jpath;
                    var p = 2;
                    do {
                        var tmp = "$.";
                        for (var i = p; i < paths.length; i++) {
                            tmp += "." + paths[i];
                        }
                        p++;
                        var arrJpaths = jsonPath(formData, tmp, { resultType : "PATH" });
                        if (arrJpaths.length === 1 && arrJpaths[0] === fullPath) {
                            lastShortPath = tmp;
                        } else {
                            break;
                        }
                    } while (true);
                    jpath = lastShortPath;
                }
            } 
            // Append jpath to formula editor.
            //新框架parent.document取不到值就换成document取值
            var editor = $(parent.document).find("#txtFormulaEditor");
            if(editor.length == 0 ){
            	editor = $(document).find("#txtFormulaEditor");
            }
           
            var reg1=/\[(\d)+\]/g;
            var reg2=/\[#\]/g;
            //按住shift时
            if(event.shiftKey) jpath=jpath.replace(reg1,"[#]");
            //按住shift和ctrl时
            if(event.ctrlKey&&event.shiftKey) jpath=jpath.replace(reg2,"[*]");
            
            editor.insertContent(jpath);
            //editor.val(editor.val() + jpath);
            
            //将jpath赋值给填表说明模式的jpath,并将Json数据放入三个textarea
            $("#ViewModeYwbm").val(jsonParams["ywbm"]);
            $("#ViewModeUrlkey").val(this.getUrlkey('frmSheet'));
            $("#ViewModeJpath").val(jpath);
            if (this.TBSM_JSON == null || this.TBSM_JSON[jpath] == null) {
            	$("#tbsm").val("");
            	$("#zcfg").val("");
            	$("#shcy").val("");
            	editor[0].focus();
            	return;
            }
            $("#tbsm").val(this.TBSM_JSON[jpath].tbsm);
            $("#zcfg").val(this.TBSM_JSON[jpath].zcfg);
            $("#shcy").val(this.TBSM_JSON[jpath].shcy);
            editor[0].focus();
        };
        /**
         * Event handler: mouse-over on divFormulaList
         */
        FormDebuging.prototype.mouseoverFormulaList = function(elem, event){
            var jqElem = $(elem);
            elem.style.backgroundColor = "#EEFFEE";
            var id = jqElem.attr("id");
            if (id && id.indexOf("#") > 0) {
                id = id.substr(jqElem.attr("id").indexOf("#") + 1);
                var objFormula = formulaEngine.idxId2Formulas[id];
                if (objFormula) {
                    $("#lblFormulaId").val(id);
                    $("#lblFormulaType").val(objFormula.type);
                    $("#lblFormulaDesc").val(objFormula.desc);
                    if (objFormula.lastError) {
                        $("#lblFormulaDesc").attr("title", objFormula.lastError);
                        $("#lblFormulaDesc").css("background-color", "#FFEEEE");
                    } else {
                        $("#lblFormulaDesc").css("background-color", "");
                    }
                } else {
                    console.log("WARN: FormulaId [" + id + "] not founded in FormulaEngine.");
                }
            } else {
                console.log("WARN: Cann't get formulaId from formula list.");
            }
        };
        /**
         * Event handler: mouse-out on divFormulaList
         */
        FormDebuging.prototype.mouseoutFormulaList = function(elem, event){
            elem.style.backgroundColor = "";
        };
        /**
         * Event handler: double-click on divFormulaList
         */
        FormDebuging.prototype.clickClearFormula = function(elem, event){
            if (this.lastSelectedFormulaElement) {
                $(this.lastSelectedFormulaElement).removeClass("selected");
            }
            $("#txtFormulaId").val("");
            $("#txtFormulaType").val("");
            $("#txtFormulaDesc").val("");
            $("#txtFormulaTips").val("");
            $("#txtFormulaEditor").val("");
            $("#txtFormulaTargetEditor").val("");
            this.lastSelectedFormulaElement = undefined;
            dhtmlx.message("公式编辑区已清空", "info", 1500);
        };
        /**
         * Event handler: double-click on divFormulaList
         */
        FormDebuging.prototype.dblclickFormulaList = function(elem, event){
            var editor = $("#txtFormulaEditor");
            if (editor) {
                // Get formula
                var jqElem = $(elem);
                var id = jqElem.attr("id").substr(jqElem.attr("id").indexOf("#") + 1);
                var objFormula = formulaEngine.idxId2Formulas[id];
                // Setting information.
                if (objFormula) {
                    $("#txtFormulaId").val(id);
                    $("#txtFormulaType").val(objFormula.type);
                    $("#txtFormulaDesc").val(objFormula.desc);
                    $("#txtFormulaTargetEditor").val(objFormula.target);
                    $("#txtFormulaTips").val(objFormula.tips);
                    editor.val(objFormula.formula);
                } else {
                    console.log("WARN: FormulaId [" + id + "] not founded in FormulaEngine.");
                    return;
                }
                this.highlightFormulaList(elem);
            } else {
                console.log("WARNING! Div #txtFormulaEditor not founded.");
            }
            if ("undefined" != typeof document.getSelection) {
                document.getSelection().removeAllRanges();
            } else if (document.selection) {
                if ("undefined" != typeof document.selection.empty) {
                    document.selection.empty();
                }
            }
        };
        /**
         * 根据formulaId（公式列表中存在的ID）或domElem（公式列表中的LI对象）来高亮公式列表中的对应公式
         */
        FormDebuging.prototype.highlightFormulaList = function(specifyFormula){
            if ("undefined" === typeof specifyFormula || null == specifyFormula) {
                return;
            }
            var newSelectedFormulaElement = null;
            if ("string" === typeof specifyFormula) {
                var jqFormulaList = $("#divFormulaList");
                if (jqFormulaList) {
                    var lis = jqFormulaList.find("li");
                    for (var i = 0; i < lis.length; i++) {
                        var jqElem = $(lis[i]);
                        var id = jqElem.attr("id").substr(jqElem.attr("id").indexOf("#") + 1);
                        if (id === specifyFormula) {
                            jqElem.addClass("selected");
                            newSelectedFormulaElement = lis[i];
                        }
                    }
                }
            } else {// Setting current selection.
                $(specifyFormula).addClass("selected");
                newSelectedFormulaElement = specifyFormula;
            }
            // Remove last selection.
            if (this.lastSelectedFormulaElement) {
                $(this.lastSelectedFormulaElement).removeClass("selected");
            }
            this.lastSelectedFormulaElement = newSelectedFormulaElement || null;
            window.setTimeout("formDebuging.scrollToHighlightFormula()", 100);
            return (newSelectedFormulaElement != null);
        };
        /**
         * Event handler: button "CheckFormula"
         */
        FormDebuging.prototype.clickCheckFormula = function(elem, event){
        	var editor = $("#txtFormulaEditor");
            if (editor) {
            	//获取选择的文本，未做兼容性
            	var sPos=editor[0].selectionStart;
            	var ePos=editor[0].selectionEnd;
				if(ePos!=sPos){
		   	 		var formula =editor.val().trim().substr(sPos, (ePos - sPos));
				}
                else var formula = editor.val().trim();
                var result = this.testingFormula({ "formula" : formula });
            }
        };
        FormDebuging.prototype.testingFormula = function(cfgFormula){
            var editor = $("#txtFormulaEditor");
            if (editor) {
                try {
                    // Testing formula
                    var result = formulaEngine.testFormula(cfgFormula);
                    dhtmlx.message("[Result]: " + result, "info", 5000);
                    return result;
                } catch (ex) {
                    dhtmlx.message("[Failed]: " + ex, "error", 10000);
                }
            } else {
                dhtmlx.message("WARNING! Div #txtFormulaEditor not founded." + ex, "error", 5000);
            }
        };
        /**
         * Event handler: button "InsertFormula"
         */
        FormDebuging.prototype.clickAppendFormula = function(elem, event){
            var _ms_ = new Date().getTime();
            var editor = $("#txtFormulaEditor");
            if (editor) {
                var cfgFormula = this.getEditingFormulaCfg();
                if (!cfgFormula) {
                    return;
                }
                if (cfgFormula.id == 0) {
                    cfgFormula.id = this.guid();
                }
                // Testing formula.
                var result = this.testingFormula(cfgFormula);
                if ("undefined" == typeof result) {
                    dhtmlx.message("公式测试不通过，无法执行新增。", "error", 1500);
                    return false;
                }
                // Getting formula editing information.
                if (formulaEngine.idxId2Formulas[cfgFormula.id]) {
                    dhtmlx.message("公式ID存在重复, 无法新增。", "error", 5000);
                    dhtmlx.message(formulaEngine.idxId2Formulas[cfgFormula.id].desc, "info", 10000);
                    dhtmlx.message(formulaEngine.idxId2Formulas[cfgFormula.id].formula, "info",
                        10000);
                    return false;
                }
                if (cfgFormula) {
                    // Appending formula
                    formulaEngine.appendFormula(cfgFormula);
                    //TODO:
                    // Refresh formula list.
                    this.lastSelectedFormulaElement = undefined;
                    this.showFormulaList(cfgFormula.id);
                    _ms_ = new Date().getTime() - _ms_;
                    dhtmlx.message("公式新增完毕, " + _ms_ + "ms", "info", 1500);
                }
            } else {
                dhtmlx.message("WARNING! 找不到编辑区对象[#txtFormulaEditor]，无法获取公式。", "error", 5000);
            }
        };
        /**
         * Event handler: button "UpdateFormula"
         */
        FormDebuging.prototype.clickUpdateFormula = function(elem, event){
            var _ms_ = new Date().getTime();
            var editor = $("#txtFormulaEditor");
            if (editor) {
                var cfgFormula = this.getEditingFormulaCfg();
                if (!cfgFormula) {
                    return;
                }
                // Testing formula.
                var result = this.testingFormula(cfgFormula);
                if ("undefined" == typeof result) {
                    dhtmlx.message("公式测试不通过，无法执行更新。", "error", 1500);
                    return false;
                }
                // Getting formula editing information.
                var objFormula = this.getLastSelectedFormula();
                if (objFormula) {
                    if (cfgFormula) {
                        // Forbidden to change id.
                        $("#txtFormulaId").val(objFormula.id);
                        cfgFormula.id = objFormula.id;
                        // Updating formula
                        formulaEngine.updateFormula(objFormula, cfgFormula);
                        // Refresh formula list.
                        this.showFormulaList();
                        _ms_ = new Date().getTime() - _ms_;
                        dhtmlx.message("公式更新完毕, " + _ms_ + "ms", "info", 1500);
                    }
                } else {
                    dhtmlx.message("没有选择编辑公式，无法进行公式更新！", "error", 5000);
                }
            } else {
                dhtmlx.message("WARNING! 找不到编辑区对象[#txtFormulaEditor]，无法获取公式。", "error", 5000);
            }
        };
        /**
         * Event handler: button "DeleteFormula"
         */
        FormDebuging.prototype.clickDeleteFormula = function(elem, event){
            var _ms_ = new Date().getTime();
            var editor = $("#txtFormulaEditor");
            if (editor) {
                var objFormula = this.getLastSelectedFormula();
                if (objFormula) {
                    dhtmlx.message({ type : "confirm", text : "删除当前所编辑公式？", callback : function(){
                        // Deleting formula
                        formulaEngine.deleteFormula(objFormula);
                        // Refresh formula list.
                        formDebuging.lastSelectedFormulaElement = undefined;
                        formDebuging.showFormulaList();
                        _ms_ = new Date().getTime() - _ms_;
                        dhtmlx.message("公式删除完毕, " + _ms_ + "ms", "info", 2000);
                    } });
                } else {
                    dhtmlx.message("没有选择编辑公式，无法进行删除！", "error", 5000);
                }
            } else {
                dhtmlx.message("WARNING! 找不到编辑区对象[#txtFormulaEditor]，无法获取公式。", "error", 5000);
            }
        };
        FormDebuging.prototype.getEditingFormulaCfg = function(){
            var editor = $("#txtFormulaEditor");
            if (editor) {
                var formula = editor.val().trim();
                var formulaId = $("#txtFormulaId").val().trim();
                var formulaType = $("#txtFormulaType").val().trim();
                var formulaDesc = $("#txtFormulaDesc").val().trim();
                var formulaTips = $("#txtFormulaTips").val().trim();
                var formulaTarget = $("#txtFormulaTargetEditor").val().trim();
                if (formula.length <= 0) {
                    dhtmlx.message("公式内容为空，请补充公式内容！", "error", 5000);
                } else if (formulaId.length <= 0) {
                    dhtmlx.message("公式ID为空，请指定公式ID！", "error", 5000);
                } else if (formulaType.length <= 0) {
                    dhtmlx.message("公式类型为空，请指定公式类型！", "error", 5000);
                } else if (formulaType.length != 2) {
                    dhtmlx.message("公式类型为两位数字，请检查！", "error", 5000);
                } else if (formulaType === "03" && formulaTarget.length <= 0) {
                    dhtmlx.message("控制类公式需要指定控制目标，请补充公式控制目标！", "error", 5000);
                } else {
                    return { "formula" : formula, "id" : formulaId, "type" : formulaType,
                        "desc" : formulaDesc, "target" : formulaTarget, "tips" : formulaTips };
                }
            }
        };
        /**
         * Event handler: button "UpdateFormula"
         */
        FormDebuging.prototype.clickSave2File = function(elem, event){
            var _ms_ = new Date().getTime();
            dhtmlx.message("正在保存公式...", "info", 1500);
            if (formulaEngine.lstAllFormulas) {
                var prepares = [];
                for (var i = 0; i < formulaEngine.lstAllFormulas.length; i++) {
                    var obj = formulaEngine.lstAllFormulas[i];
                    prepares.push(JSON.stringify({ "id" : (obj.id > 1) ? obj.id : 0,
                        "type" : obj.type, "desc" : obj.desc, "formula" : obj.formula,
                        "target" : obj.target, "tips" : ombj.tips }, null, 2));
                }
                var nodes = elem.baseURI.substring(elem.baseURI.indexOf("biz")+3,elem.baseURI.indexOf("?")).split("/");
                var urlSave2File = this.URL_SAVE_2_FILE + "?ywbm=" + jsonParams["ywbm"] + "&visitPath=" +nodes[1]+"/"+nodes[2];
                $.when($.post(urlSave2File, "[" + prepares.join() + "]")).done(
                    function(data, status, xhr){
                        _ms_ = new Date().getTime() - _ms_;
                        if (data.retcode == 0) {
                            dhtmlx.message("公式保存成功, 总大小：" + data.size + ", " + _ms_ + " 毫秒",
                                "info", 3000);
                        } else {
                            dhtmlx.message("公式保存失败： " + status, "error", 5000);
                        }
                    }).fail(
                    function(xhr, msg, err){
                        var status = (xhr.status == "200") ? msg : xhr.status;
                        console.log("Saving formula-rules fail with [" + status + "]\n----"
                            + xhr.responseText);
                        dhtmlx.message("公式保存失败 [" + status + "] " + err, "error", 5000);
                    });
                $.post(urlSave2File, "[" + prepares.join() + "]",
                    function(data, textStatus, jqXHR){});
            }
        };
        /**
         * 根据单元格显示风险提醒 A by C.Q
         */
        FormDebuging.prototype.onfocus2Fxtx = function(elem, event){
        	var _obj = $(elem);
            var cljy = _obj.attr('cljy');
//            var fxmc = _obj.attr('fxmc');
            var glbd =  _obj.attr('glbd');
            var jcjg = _obj.attr('jcjg');
//            var fxlx = _obj.attr('fxlx');
            var tipType = _obj.attr('tipType');
        	var _jpath = _obj.attr("jpath");
//            $("#fxsmmcId").html(fxmc ? fxmc : '');
        	$("#fxsmjgId").html(jcjg ? jcjg : '');
        	$("#fxsmjyId").html(cljy ? cljy : '');
        	$("#fxsmbdId").html(glbd ? glbd : '');
//        	$("#fxlxId").html(fxlx ? fxlx : '风险名称');
        	
        	if(tipType) {
        		$("#lbId").html(tipType == 'error' ? '修改类' : '提示类');
        	} else {
        		$("#lbId").html('');
        	}
        };
        /**
         * 有提示时自动显示tbsm
         */
        FormDebuging.prototype.autoShowTbsm = function(elem, event){
        	var _obj = $(elem);
            var cljy = _obj.attr('cljy');
            var glbd =  _obj.attr('glbd');
            var jcjg = _obj.attr('jcjg');
            if(jcjg && $("#tbsmMenu").length>0) {
            	 $(".leftTab li").removeClass("active");
          	     $("#tbsmMenu").addClass("active");
          	     $(".SheetMenu").children("ul").hide();
          	     $(".SheetMenu").children("ul").eq(1).show();
               
         	     $(".biao_leftmenubox #menu02").parent().find("dd").slideDown();
         	     $(".biao_leftmenubox dt").css({ "background-color": "#ddeeff" });
	             $("#fxjk dt").css({ "background-color": "#a6c6f1" });
	             var $tbfd_span = $("#tbfd dt span");
	             var $tbfd_dd = $("#tbfd dd");
	             var $span = $("#fxjk").find("span");
	             var $dd = $("#fxjk").find("dd");
	             
	             $tbfd_span.removeClass("down");
	             $tbfd_dd.slideUp();
	             $span.addClass("down");
	             $dd.slideDown();
	             
            }
        };
        /**
         * Event handler: clearFxtx on input UI. 清除风险提醒 A by C.Q 20170220
         */
        FormDebuging.prototype.clearFxtx = function(){
            
//            $("#fxsmmcId").html('');
        	$("#fxsmjgId").html('');
        	$("#fxsmjyId").html('');
        	$("#fxsmbdId").html('');
//        	$("#fxlxId").html('');
        	$("#lbId").html('');
        };
        /**
         * Event handler: button "SaveTbsm" 
         */
        FormDebuging.prototype.clickSaveTbsm = function(elem, event) {
        	var jpath = $("#ViewModeJpath").val();
        	if(jpath == null || jpath == '') {
        		dhtmlx.message("Sorry! Fail to save due to jpath is null", "info", 1500);
        		return;
        	}
        	// A by C.Q 20170123
        	var urlkey = this.getUrlkey('frmSheet');
        	var urlSaveTbsm = this.URL_SAVE_TBSM + "?ywbm=" + jsonParams["ywbm"] + "&gdslxDm=" + jsonParams["gdslxDm"] + "&urlkey=" +urlkey;
        	var tbsm = $("#tbsm").val();
        	var zcfg = $("#zcfg").val();
        	var shcy = $("#shcy").val();
        	$.ajax({
        		type : "POST",
        		async: false,
        		url : urlSaveTbsm,
        		data : {"jpath":jpath, "tbsm":tbsm, "zcfg":zcfg, "shcy":shcy},
    			dataType : "text",
    			success : function(data) {
    				if (data==0) {
    					var str = "Sorry! Fail to save due to ywbm or jpath or urlkey is null";
    					dhtmlx.message(str, "info", 1500);
    					return;
    				} else if (data==1) {
    					var str = "Update successfully!";
    				} else if (data==2) {
    					var str = "Save successfully!";
    				}
    				dhtmlx.message(str, "info", 1500);
    				/*if (this.TBSM_JSON[jpath] == undefined) {
    					this.TBSM_JSON[jpath] = {};
    				}*/
    				this.TBSM_JSON[jpath].tbsm = $("#tbsm").val();
    				this.TBSM_JSON[jpath].zcfg = $("#zcfg").val();
    				this.TBSM_JSON[jpath].shcy = $("#shcy").val();
    			}
        	});
        };
        /**
         * 根据iframeId的url来获取urlkey，作为当前页面唯一标识符 A by C.Q
         */
        FormDebuging.prototype.getUrlkey = function(iframeId){
        	var frmSheetUri = document.getElementById(iframeId).contentWindow.location.href;
        	// 如http://localhost:8080/sbzs-cjpt-web/biz/sbzs/xgmzzs/form/xxx.html，则截取得到'/sbzs/xgmzzs/form/xxx.html'
        	return frmSheetUri.substring(frmSheetUri.indexOf("biz")+3,frmSheetUri.indexOf("?") < 0 ? frmSheetUri.lenght : frmSheetUri.indexOf("?"));
        };
        /**
         * Event handler: onfocus2Tbsm on input UI. 获得焦点时填充至填表说明文本框 A by C.Q
         */
        FormDebuging.prototype.onfocus2Tbsm = function(elem, event){
        	// Get jpath from InputUI
            var jpath = $(elem).attr('jpath');
            if ("undefined" == typeof jpath || jpath.length <= 0) {
                return;
            }
            jpath = "$." + jpath;
            var fullPath = jsonPath(formData, jpath, { resultType : "PATH" }); // 用于对比
            /*if (!fullPath) {
                dhtmlx.message("Jpath not founded in formData", "info", 1500);
            }*/
            // Try to translate to short-name.
            if (jpath.indexOf("..") < 0 && fullPath.length == 1) {
                var paths = jpath.split(".");
                if (paths.length > 2) {
                    fullPath = fullPath[0];
                    var lastShortPath = jpath;
                    var p = 2;
                    do {
                        var tmp = "$.";
                        for (var i = p; i < paths.length; i++) {
                            tmp += "." + paths[i];
                        }
                        p++;
                        var arrJpaths = jsonPath(formData, tmp, { resultType : "PATH" });
                        if (arrJpaths.length === 1 && arrJpaths[0] === fullPath) {
                            lastShortPath = tmp;
                        } else {
                            break;
                        }
                    } while (true);
                    jpath = lastShortPath;
                }
            } 
            var reg1=/\[(\d)+\]/g;
            var reg2=/\[#\]/g;
            //按住shift时
            if(event.shiftKey) jpath=jpath.replace(reg1,"[#]");
            //按住shift和ctrl时
            if(event.ctrlKey&&event.shiftKey) jpath=jpath.replace(reg2,"[*]");
            
            if (this.TBSM_JSON == null || this.TBSM_JSON[jpath] == null) {
            	this.setShowTbsmValues('','','');
            	return;
            }
            this.setShowTbsmValues(this.TBSM_JSON[jpath].tbsm,this.TBSM_JSON[jpath].zcfg,this.TBSM_JSON[jpath].shcy);
        };
        
        /**
         * Event handler: button "ClearTbsm" A by C.Q
         */
        FormDebuging.prototype.clickClearTbsm = function(elem, event) {
        	$("#tbsm").val("");
        	$("#zcfg").val("");
        	$("#shcy").val("");
        };
        /**
         * 设置右边栏填表说明显示文本 A by C.Q 
         * showTbsm: 填表说明 showZcfg:政策法规 showShcy:税会差异
         */
        FormDebuging.prototype.setShowTbsmValues = function(showTbsm,showZcfg,showShcy) {
        	$("#showTbsm1").html(showTbsm);
        	$("#showZcfg1").html(showZcfg);
        	$("#showShcy1").html(showShcy);
        };
        /**
         * Event handler: button "UpdateFormula"
         */
        FormDebuging.prototype.clickExcelToJson = function(elem, event){
        	dhtmlx.message("test clickExcelToJson!!!");
        	var excelpath = prompt("请输入导入的Excel文件的绝对路径","");
        	var req = "<taxML><ywdm>"+jsonParams["ywbm"]+"</ywdm>"+"<excelpath>"+excelpath+"</excelpath></taxML>";   	
        	$.ajax({
        		url :  "excel/excel.do",
        		data : {reqXml: req},
        		dataType : "text",
        		type:"POST",
        		headers : {
        			"Accept" : "text/plain;charset=UTF-8"
        		},
        		success : function(sdata, textStatus, jqXHR) {
        			$('#respXml').text(sdata);
        		},
        		timeout : 1000000000,
        		contentType : "application/x-www-form-urlencoded; charset=utf-8"
        	});	
        	dhtmlx.message("end clickExcelToJson!!!");
        };
        
        FormDebuging.prototype.addCSS = function(cssText){
            var style = document.createElement('style'), // 创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; // 获取head元素
            style.type = 'text/css'; // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
            if (style.styleSheet) { // IE
                var func = function(){
                    try { // 防止IE中stylesheet数量超过限制而发生错误
                        style.styleSheet.cssText = cssText;
                    } catch (e) {}
                };
                // 如果当前styleSheet还不能用，则放到异步中则行
                if (style.styleSheet.disabled) {
                    setTimeout(func, 50);
                } else {
                    func();
                }
            } else { // w3c
                // w3c浏览器中只要创建文本节点插入到style元素中就行了
                var textNode = document.createTextNode(cssText);
                style.appendChild(textNode);
            }
            head.appendChild(style); // 把创建的style元素插入到head中
        };
        FormDebuging.prototype.guid = function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        /**
         * 【jQuery插件】insertContent-在文本框光标位置插入内容并选中<br>
         * $(文本域选择器).insertContent("插入的内容");
         */
        (
            function($){
                $.fn.extend({ insertContent : function(myValue, t){
                    var $t = $(this)[0];
                    if (document.selection) { //ie
                        this.focus();
                        var sel = document.selection.createRange();
                        sel.text = myValue;
                        this.focus();
                        sel.moveStart('character', -l);
                        var wee = sel.text.length;
                        if (arguments.length == 2) {
                            var l = $t.value.length;
                            sel.moveEnd("character", wee + t);
                            t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel
                                .moveStart("character", wee - t - myValue.length);
                            sel.select();
                        }
                    } else if ($t.selectionStart || $t.selectionStart == '0') {
                        var startPos = $t.selectionStart;
                        var endPos = $t.selectionEnd;
                        var scrollTop = $t.scrollTop;
                        $t.value = $t.value.substring(0, startPos) + myValue
                            + $t.value.substring(endPos, $t.value.length);
                        this.focus();
                        $t.selectionStart = startPos + myValue.length;
                        $t.selectionEnd = startPos + myValue.length;
                        $t.scrollTop = scrollTop;
                        if (arguments.length == 2) {
                            $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
                            this.focus();
                        }
                    } else {
                        this.value += myValue;
                        this.focus();
                    }
                } })
            })(jQuery);
        
        this.debugViewControl = new DebugViewControl();
        // For not to do initialization twice.
        FormDebuging._inited = true;
    }
    this
        .addCSS("#divFormulaList .error{background:#FFFFAA;}\n"
            + "#divFormulaList .selected{font-style:italic; font-weight:bold; color:#440044; border:1px solid red;}"
            + "#divFormulaList li{-moz-user-select: none; -khtml-user-select: none; user-select: none;}");
    // Start the debug monitor.
    //window.setInterval("formDebuging.showData()", 50);
    //window.setTimeout("formDebuging.showFormulaList()", 50);
}

function DebugViewControl(){
    //普通用户的高度
    var ieHeight = $(window.parent).height();
    var headHeight = $(".TopHead",window.parent.document).height()+8;
    if($(".TopHead",window.parent.document).css("display") === "none"){
        headHeight = 8;
    }
	var menuHeight = $(".SheetMenu>h3").height();

    $(".USER .SheetMenu").height(ieHeight - headHeight);
    $(".USER .SheetMenu>ul").height(ieHeight - headHeight - menuHeight - 15);
    $(".USER .tableDiv").height(ieHeight - headHeight);
    
    $(".USER .biao_leftmenubox").height(ieHeight-headHeight-menuHeight);
	$(".USER .accordion-content").height(ieHeight-headHeight -menuHeight - 114);
	
    var h = parseInt($(window.parent).height())-headHeight;
    $("#frmMain", window.parent.document).css("height", h+"px");
    //获取高度
    DebugViewControl.prototype.resize = function(){
        //加载高度
        var ieWidth = parseInt($(window).width());
        var ieHeight = parseInt($(window.parent).height());
        var footHeight = parseInt($(".DEV .FootEdit").height()) || 0;
        var headHeight = parseInt($(".TopHead",window.parent.document).height()+8) || 0;
        if($(".TopHead",window.parent.document).css("display") === "none"){
            headHeight = 8;
        }
        var menuHeight = $(".SheetMenu>h3").height();
        //加载宽度
        $(".DEV .linefoot").css({ width : ieWidth });
        $(".DEV .TableMain").css({ "width" : "80%" });
        $(".DEV .rightEdit").css({ "width" : "20%" });
        //hwping添加
        $(".VIEW .TableMain").css({ "width" : "100%" });
        $(".VIEW .TableMain").height(ieHeight - footHeight - headHeight);
        //加载高度
        $("#frmSheet").height(ieHeight - headHeight - footHeight);

        if(typeof autoResizeIframe === "function"){
            //调用form/index.jsp中的autoResizeIframe方法，设置frmSheet高度
            setFrmSheetXScolling = true;
            autoResizeIframe();
        }

        $(".USER .SheetMenu").height(ieHeight - headHeight);
        $(".USER .SheetMenu>ul").height(ieHeight - headHeight - menuHeight  - 15);
        $(".USER .tableDiv").height(ieHeight - headHeight);
        $(".DEV .TableMain").height(ieHeight - footHeight - headHeight);
        $(".DEV .SheetMenu").height(ieHeight - footHeight - headHeight);
        $(".DEV .SheetMenu>ul").height(ieHeight - footHeight - headHeight  - 15);
        $(".DEV .accordion-content").height(ieHeight-headHeight -menuHeight - 120 - footHeight);
        $(".DEV .tableDiv").height(ieHeight - footHeight - headHeight);
        $(".DEV .boxStyle").height(ieHeight - footHeight - headHeight);
        $(".DEV .line").height(ieHeight - footHeight - headHeight);
        $(".DEV .line").css({ "marginTop" : headHeight });
        var tableDiv = parseInt($(".tableDiv").height()) || 0;
        $(".DEV .linefoot").css({ top : headHeight + tableDiv });
        var linew = parseInt($(".TableMain").width()) || 0;
        $(".DEV .line").css({ left : linew });
        var btnheight = parseInt($(".tableDiv").height()) || 0;
        $(".close_btn").height(btnheight);
        // 公式编辑区
        $("#divFormulaList").height(footHeight - 50);
        $("#txtFormulaEditor").height(footHeight - 200);
    };
    //开发者切换
    DebugViewControl.prototype.clickChangeMode = function(){
    	//切换到开发者模式时，修改
    	flagFormDebuging = true;
        if ($("body").hasClass("USER") || $("body").hasClass("VIEW")) {
            $("body").removeClass("USER");
            $("body").removeClass("VIEW");
            $("body").addClass("DEV");
            //hwping添加
            $(".DEV .FootEdit2").css({"display":"none"});
            //加载高度
            var ieWidth = $(window).width();
            var ieHeight = $(window.parent).height();
            var footHeight = parseInt($(".DEV .FootEdit").height()) || 0;
            var headHeight = parseInt($(".TopHead",window.parent.document).height()) || 0;
            var menuHeight = $(".SheetMenu>h3").height() || 0;
            //加载宽度
            $(".DEV .linefoot").css({ width : ieWidth });
            $(".DEV .TableMain").css({ "width" : "80%" });
            $(".DEV .rightEdit").css({ "width" : "20%" });
            //加载高度
            $("#frmSheet").height(ieHeight - headHeight - footHeight);
            $(".DEV .TableMain").height(ieHeight - footHeight - headHeight);
            // add by C.Q 20170122 重置右边填表说明栏高度
            $(".DEV .biao_leftmenubox").height(ieHeight-footHeight-headHeight);
            $(".DEV .SheetMenu").height(ieHeight - footHeight - headHeight);
            $(".DEV .SheetMenu>ul").height(ieHeight - footHeight - headHeight - menuHeight - 15);
            $(".DEV .accordion-content").height(ieHeight-headHeight -menuHeight - 120 - footHeight);
            $(".DEV .tableDiv").height(ieHeight - footHeight - headHeight);
            $(".DEV .boxStyle").height(ieHeight - footHeight - headHeight);
            $(".DEV .line").height(ieHeight - footHeight - headHeight);
            $(".DEV .line").css({ "marginTop" : headHeight });
            var tableDiv = $(".tableDiv").height();
            $(".DEV .linefoot").css({ top : headHeight + tableDiv });
            var linew = $(".TableMain").width();
            $(".DEV .line").css({ left : linew });
            var btnheight = $(".tableDiv").height();
            $(".close_btn").height(btnheight);
            //修改按钮
            $("#btnChangeMode",window.parent.document).text("普通用户");
            $("#btnViewMode",window.parent.document).text("填表说明");
            // 公式编辑区
            $("#divFormulaList").height(footHeight - 50);
            $("#txtFormulaEditor").height(footHeight - 200);
            //切换结束
            //x拖动
            $(function(){
                //是否移动
                var mFlag = false;
                //鼠标与div左上角相对位置
                var divX;
                $(".line").bind("click mousedown", function(e){
                    if (event.type == 'click') {} else if (event.type == 'mousedown') {
                        mFlag = true;
                        divX = e.pageX - parseInt($(".line").css("left"));
                    }
                });
                $(document).mousemove(function(e){
                    if (mFlag) {
                        //画出新坐标
                        if (e.pageX < $(window).width() - 100) {
                            var rightw = $(window).width() - e.pageX;
                            $(".line").css({ left : e.pageX - divX });
                            $(".TableMain").css({ width : e.pageX });
                            $(".RightEdit").css({ width : rightw });
                        }
                    }
                }).mouseup(function(){
                    mFlag = false;
                    //松开鼠标后停止移动并恢复成不透明
                });
            });
            $(function(){
                //是否移动
                var mFlag = false;
                //鼠标与div左上角相对位置
                var divY;
                $(".linefoot").bind("click mousedown", function(e){
                    if (event.type == 'click') {} else if (event.type == 'mousedown') {
                        mFlag = true;
                        divY = e.pageY - parseInt($(".linefoot").css("top"));
                    }
                });
                $(document).mousemove(function(e){
                    if (mFlag) {
                        //画出新坐标
                        if (e.pageY < $(window).height() - 42) {
                            var Fh = $(window).height() - e.pageY;
                            var headHeight = $(".TopHead",window.parent.document).height();
                            $(".linefoot").css({ top : e.pageY - divY });
                            $(".DEV .SheetMenu").css({ height : e.pageY - headHeight });
                            $(".DEV .tableDiv").css({ height : e.pageY - headHeight });
                            $(".DEV .TableMain").css({ height : e.pageY - headHeight });
                            $(".DEV .boxStyle").css({ height : e.pageY - headHeight });
                            $(".DEV .line").css({ height : e.pageY - headHeight });
                            $(".DEV .FootEdit").css({ height : Fh });
                            var btnheight = $(".tableDiv").height();
                            $(".close_btn").height(btnheight);
                        }
                    }
                }).mouseup(function(){
                    mFlag = false;
                    //松开鼠标后停止移动并恢复成不透明
                });
            });
            $(".FootEdit").show();
            $(".RightEdit").show();
        } else {
        	$(".areaHeadBtn",window.parent.document).empty();
            window.location.reload(true);//刷新当前页面
        }
    };
    
    //填表说明开发者切换
    DebugViewControl.prototype.clickViewMode = function(){
    	//点击填表说明时，从后台加载数据
    	if (FormDebuging.prototype.TBSM_JSON == null) {
	    	var urlExtractTbsm = FormDebuging.prototype.URL_EXTRACT_TBSM + "?ywbm=" + jsonParams["ywbm"] + "&gdslxDm=" + jsonParams["gdslxDm"];
	    	$.ajax({
	    		type : "POST",
	    		url : urlExtractTbsm,
				dataType : "json",
				success : function(data) {
					var json = eval('('+data+')');
					FormDebuging.prototype.TBSM_JSON = json;
				}
	    	});
    	}
    	//切换到开发者模式时，修改
    	flagFormDebuging = true;
        if ($("body").hasClass("USER")) {
            $("body").removeClass("USER");
            $("body").addClass("VIEW");
            
            $(".VIEW .RightEdit").css({"display":"none"});
            $(".VIEW .FootEdit").css({"display":"none"});
            //加载高度
            var ieWidth = $(window).width();
            var ieHeight = $(window).height();
            var footHeight = parseInt($(".VIEW .FootEdit2").height()) || 0;
            var headHeight = parseInt($(".TopHead",window.parent.document).height()) || 0;
            var menuHeight = $(".SheetMenu>h3").height() || 0;
            //加载宽度
            $(".VIEW .linefoot").css({ width : ieWidth });
            $(".VIEW .TableMain").css({ "width" : "100%" });
            //加载高度
            $(".VIEW #frmSheet").height(ieHeight - headHeight - footHeight);
            $(".VIEW .TableMain").height(ieHeight - footHeight - headHeight);
         // add by C.Q 20170122 重置右边填表说明栏高度
            $(".VIEW .biao_leftmenubox").height(ieHeight-footHeight-headHeight);
            $(".VIEW .SheetMenu").height(ieHeight - footHeight - headHeight);
            $(".VIEW .SheetMenu>ul").height(ieHeight - footHeight - headHeight - menuHeight - 30);
            $(".VIEW .accordion-content").height(ieHeight-headHeight -menuHeight - 114 - footHeight);
            $(".VIEW .tableDiv").height(ieHeight - footHeight - headHeight);
            $(".VIEW .boxStyle").height(ieHeight - footHeight - headHeight);
            $(".VIEW .line").height("0px");
            $(".VIEW .line").css({ "marginTop" : "0px" });
            var tableDiv = $(".tableDiv").height();
            $(".VIEW .linefoot").css({ top : headHeight + tableDiv });
            var linew = $(".TableMain").width();
            $(".VIEW .line").css({ left : linew });
            var btnheight = $(".tableDiv").height();
            $(".close_btn").height(btnheight);
            //修改按钮
            $("#btnViewMode",window.parent.document).text("取消说明");
            //切换结束
            $(".FootEdit2").show();
            
        } else if ($("body").hasClass("DEV")) {
        	$("body").removeClass("DEV");
            $("body").addClass("VIEW");
            $(".VIEW .RightEdit").css({"display":"none"});
            $(".VIEW .FootEdit").css({"display":"none"});
            $(".VIEW .TableMain").css({ "width" : "100%" });
            $(".FootEdit2").css({"display":"block"});
            //修改按钮
            $("#btnChangeMode",window.parent.document).text("开发者");
            $("#btnViewMode",window.parent.document).text("取消说明");
        }else {
        	$(".areaHeadBtn",window.parent.document).empty();
            window.location.reload(true);//刷新当前页面
        }
    };
    //填表说明
    $(".tabmenu .title").on("click",function(){
    	  $(".tabmenu .title").removeClass("active");
    	  $(".tabmenu .listbox ul").slideUp();
    	  $(this).addClass("active");
    	  $(this).next().slideDown();
    	});		

    $(".leftTab li").on("click",function(){
    	   $(".leftTab li").removeClass("active");
    	   $(this).addClass("active");
    	   var tab=$(this).index();

    	   $(".SheetMenu").children("ul").hide();
    	   $(".SheetMenu").children("ul").eq(tab).fadeIn();
    	 //  $(".biao_leftmenubox>ul").index(tab).fadeIn();
    	});	
    //左边菜单切换
    $(".MenuNormal .btnfixed").live("click", function(){
        $(".MenuNormal").removeClass().addClass("MenuDev");
        $(".btnfixed span").removeClass("icon-on").addClass("icon-off");
        $("MenuDev .btnfixed").hide();
        $(".btnfixed span").animate({ marginTop : -1, marginLeft : -1 });
        $(".biao_leftmenu").width(1);
    });
    $(".MenuDev .btnfixed").live("click", function(){
        $(".btnfixed span").animate({ marginTop : 3, marginLeft : 3 });
        $(".btnfixed span").removeClass("icon-off").addClass("icon-on");
        $(".MenuDev").removeClass().addClass("MenuNormal");
        $("MenuNormal .btnfixed").hide();
        $(".biao_leftmenu").width(350);
    });
    var btnheight = $(".tableDiv").height();
    $(".close_btn").height(btnheight);
    $(window).resize(function(){
        var btnheight = $(".tableDiv").height();
        $(".close_btn").height(btnheight);
    });
//    var closebtn = 0;
    $(".MenuNormal .close_btn1").click(function(){
        var menu = $(".MenuNormal .SheetMenu");
        var menuWidth = $(".MenuNormal .SheetMenu").width();

        if (closebtn == 0) {
            menu.fadeOut(); 
            $(".MenuNormal .close_btn span").text(">");
            var rightEditW = $(window).width() - $(".TableMain").width();
            $(".DEV .RightEdit").width(rightEditW - 4);
            closebtn++;
        } else {      	
            menu.fadeIn();                  
            var rightEditW = $(window).width() - $(".TableMain").width();
            $(".DEV .RightEdit").width(rightEditW - 4);
            $(".MenuNormal .close_btn span").text("<");
            closebtn = 0;
        }
    });
    //左边菜单切换02
    $(".MenuDev").live("mouseenter", function(){
        var menu = $(".MenuDev .SheetMenu");
        menu.show();
    });
    $(".MenuDev").live("mouseleave", function(){
        var menu = $(".MenuDev .SheetMenu");
        menu.fadeOut();
    });
    // tab页切换
    $(".tabbox td").click(function(){
		$(".tabbox td").eq($(this).index()).addClass("ved").siblings().removeClass("ved");
		$(".conbox").hide().eq($(this).index()).show();
	});
	// 填表说明菜单 A by C.Q 20170220 
	$(".biao_leftmenubox #menu02").parent().find("dd").slideDown();
    $(".biao_leftmenubox dt").click(function () {
        $(".biao_leftmenubox dt").css({ "background-color": "#ddeeff" })
        $(this).css({ "background-color": "#a6c6f1" });
        var $all_span = $(".biao_leftmenubox dt span");
        var $all_dd = $(".biao_leftmenubox dd");
        var $span = $(this).find("span");
        var $dd = $(this).parent().find("dd");
        if ($span.hasClass("down")) {
            $span.removeClass("down");
            $dd.slideUp();
            $(".biao_leftmenubox dt").attr("style", "")
            $(this).attr("style", "");
        }
        else {
            $all_span.removeClass("down");
            $all_dd.slideUp();
            $span.addClass("down");
            $dd.slideDown();
        }

    });
    //
    $("#btnChangeMode",window.parent.document).click(this.clickChangeMode);
    $("#btnViewMode",window.parent.document).click(this.clickViewMode);
    // Register onResize.
    $(window).resize(function(){
        formDebuging.debugViewControl.resize();
    });
    this.resize();
}

