
/**
 * 填报页[上一步]按钮动作
 */
function backBegin() {
	
	var backBegin = $("#backBegin").val();
			
	if(backBegin != 'null' && backBegin != null && backBegin != ''){
		backBegin = window.location.protocol +"//"+ window.location.host + backBegin; 
		window.location.href=backBegin;
	}
}

/**
 * 截取时间
 * */
function getServerTime2Day() {
	if(typeof(serverTime) != "undefined" && serverTime !=null){
		return serverTime.substring(0,serverTime.indexOf(" "));
	}else{
		return null;
	}
}
function getServerTime2Sec() {
	if(typeof(serverTime) != "undefined" && serverTime !=null){
		return serverTime;
	}else{
		return null;
	}
}

var prepareMakeFlag = true;

/**
 * 暂存
 */
function tempSave() {
    doSave(false);
}

/**
 * 保存
 */
function save() {
    doSave(true);
}

/**
 * 具体执行保存方法
 * @param saveFlag 保存标志（true 表示保存，false 暂存）
 */
function doSave(saveFlag) {
    $(top.document).find("body").mask("正在保存数据，请稍候...");
    //暂存时增加校验的逻辑
    try{
        var child = document.getElementById("frmSheet").contentWindow;
        if(typeof(child.isTempSave) === 'function'){
            if(!child.isTempSave()){
                $(top.document).find("body").unmask();
                return;
            }
        }
    }catch(e){

    }
    if(checkDIffDjxh()){//djxh不一致，不进行保存
        return;
    }

    var regEvent = new RegEvent();
    var tips = regEvent.verifyAllNoAlert();

    //设置提示语
    var msg = "暂存";
    if(saveFlag){
        msg = "保存";
    }

    if('' != tips && saveFlag){
        parent.layer.alert(tips, {title: msg + "失败！(表格校验没通过，请检查)", icon: 5});
        $(top.document).find("body").unmask();
        return;
    }

    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

    var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['djxh'] = $("#djxh").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['secondLoadTag'] = $("#secondLoadTag").val();
    d['_bizReq_path_'] = _bizReq_path_;
    d['_guideParam'] = _guideParam;
    d['formData'] = encodeURIComponent(JSON.stringify(formData));
    $.ajax({
        type : "POST",
        url : "xTempSave?",
        dataType : "json",
        //contentType : "text/json",
        data : d,
        success : function(data) {
            if ('Y' == data.returnFlag) {
                if('' != tips && !saveFlag){
                    parent.layer.alert(tips, {title: msg + "成功！(但表格校验没通过，请检查)", icon: 5});
                }else {             
                    parent.layer.alert(msg + "成功！", {
                        icon: 1
					});                   
                }
            } else {
                parent.layer.alert('尊敬的纳税人：' + msg + '失败，请稍后再试！', {
                    icon : 5
                });
            }
            $(top.document).find("body").unmask();
        },
        error : function() {
            $(top.document).find("body").unmask();
            parent.layer.alert('尊敬的纳税人：' + msg + '失败，请稍后再试！', {
                icon : 5
            });
        }
    });
}


/**
 * 自动执行暂存方法,不进行校验与提示，只保存数据
 */
function autoSave(zdzclx) {
	//zdzclx为区域需求，特定业务的才需要进行自动暂存，配置在配置中心。财务报表按申报需求为默认都需要暂存。
	var href = window.location.href;
	var ywbm = $("#ywbm").val().toUpperCase();
	if (href.indexOf("CWBB") > -1 || ( typeof(zdzclx)!="undefined" && zdzclx != null && zdzclx.indexOf(ywbm) > -1)) {
        setInterval('autoSaveRun()', 1680000);
    }
}

/**
 * 自动执行暂存方法,不进行校验与提示，只保存数据
 */
function autoSaveRun() {
	var _guideParam = $("#_query_string_").val().replace(/\"/g, '').replace(
			/,/g, ';').replace(/:/g, '-');// 增加guideParam作为组合主键来确认是否生产一条新的依申请记录
	var d = {};
	d['_query_string_'] = $("#_query_string_").val();
	d['gdslxDm'] = $("#gdslxDm").val();
	d['ysqxxid'] = $("#ysqxxid").val();
	d['djxh'] = $("#djxh").val();
	d['nsrsbh'] = $("#nsrsbh").val();
	d['secondLoadTag'] = $("#secondLoadTag").val();
	d['_bizReq_path_'] = _bizReq_path_;
	d['_guideParam'] = _guideParam;
	d['formData'] = encodeURIComponent(JSON.stringify(formData));
	$.ajax({
		type : "POST",
		url : "xTempSave?",
		dataType : "json",
		data : d,
		success : function(data) {
		},
		error : function() {
		}
	});
}


function checkDIffDjxh() {
	var isDiff = false;
	var url = location.search; // 获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var ywbm = $("#ywbm").val().toUpperCase();
	if(ywbm.indexOf("CWBB_")!=-1){
		var urlDjxh = theRequest["djxh"];
		var temp=$("#_query_string_").val();
		var djxhindex=temp.indexOf("djxh");
		var query_stringDjxh=temp.substr(djxhindex+7,20);
		if(undefined!=urlDjxh&&urlDjxh!=""&&urlDjxh!=null&&undefined!=query_stringDjxh&&query_stringDjxh!=""&&query_stringDjxh!=null&&urlDjxh!=query_stringDjxh){
			Message.errorInfo({
				title : "错误",
				message : "登记序号不一致，请退出重新申报!"
			});
			isDiff = true;
		}
		var urlbzz = theRequest["bzz"];
		if("dzswj" == urlbzz){
			var qcsDjxh = formData.qcs.djNsrxx.djxh;
			if(undefined!=urlDjxh&&urlDjxh!=""&&urlDjxh!=null&&undefined!=query_stringDjxh&&query_stringDjxh!=null&&query_stringDjxh!="null"&&query_stringDjxh!="" && query_stringDjxh != qcsDjxh){
				Message.errorInfo({
					title : "错误",
					message : "页面中的纳税人信息与登录的纳税人信息不一致，请重置或退出后重新申报!"
				});
				isDiff = true;
			}
		}
	}
	return isDiff;
}


function pjdjValidate(zyspjdjObj, fb, jdmc){
	var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
	for(var i in zyspjdjObj){
		var zyspjdj = zyspjdjObj[i];
		if(zyspjdj[jdmc]==fb[jdmc] && zyspjdj[jdmc] != ""){
			pjdjFlag = 1;
			var pjdj_fb = parseFloat(fb['jsxse'])/parseFloat(fb['jsxsl']);
			if(parseFloat(fb['jsxsl'])==0){
				pjdj_fb = 0;
			}
			if((Math.abs(pjdj_fb-parseFloat(zyspjdj['pjdj']))/parseFloat(zyspjdj['pjdj'])).toFixed(2)>0.1){
				pjdjFlag = 0;
				break;
			}
		}
	}
	return pjdjFlag;
}

function setStyle(msg){
	 return "<p style='line-height=20px;padding:10px;margin:10xp 0px;'>"+msg+"</p>";
}

/**
 * 资源税申报
 * @param isSecondCall
 */
function prepareMakeZyssb(isSecondCall) {
	var newFB1Obj = formData.zyysbywbw.zysywbwbody.BDA0610888.yklsmsyGrid.yklsmsyGridlbVO;
	var newFB2Obj = formData.zyysbywbw.zysywbwbody.BDA0610889.jklsmsyGrid.jklsmsyGridlbVO;
	var zyspjdjObj = formData.qcs.initData.zyspjdj.zyspjdjmxxx;
	var zyspjdjObj_zs=[];//州市
	var zyspjdjObj_sdsj=[];//省地税局
	var pjdjTemp = [];//平均单价不通过校验的数据明细临时数组
	for(var i in zyspjdjObj){
		var zyspjdj = zyspjdjObj[i];
		if(zyspjdj['swjgDm'].indexOf('000000')!=-1){
			zyspjdjObj_zs.push(zyspjdj);
		}else{
			zyspjdjObj_sdsj.push(zyspjdj);
		}
	}
	for(var i in newFB1Obj){
		var fb1 = newFB1Obj[i];
		var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
		pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb1 , 'zszmDm');
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb1 , 'zspmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb1 , 'zszmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb1 , 'zspmDm');
		}
		if(pjdjFlag===0 && fb1['cjclbz']!=='N'){
			pjdjTemp.push(fb1);
		}
	}
	for(var i in newFB2Obj){
		var fb2 = newFB2Obj[i];
		var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
		pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb2 , 'zszmDm');
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb2 , 'zspmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb2 , 'zszmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb2 , 'zspmDm');
		}
		if(pjdjFlag===0 && fb2['cjclbz']!=='N'){
			pjdjTemp.push(fb2);
		}
	}
	var zyssbGridlbObj = formData.qcs.formContent.BDA0610887.zyssbGrid.zyssbGridlbVO;
	var zspmDm2Mc = {};
	var zszmDm2Mc = {};
	for(var i in zyssbGridlbObj){
		var zyssbGridlb = zyssbGridlbObj[i];
		var zszmDm = zyssbGridlb['zszmDm'];
		var zspmDm = zyssbGridlb['zspmDm'];
		var zszmMc = zyssbGridlb['zszmMc'];
		var zspmMc = zyssbGridlb['zspmMc'];
		if(zszmDm!=undefined && zszmDm!=''){
			zszmDm2Mc[zszmDm]=zszmMc;
		}
		if(zspmDm!=undefined && zspmDm!=''){
			zspmDm2Mc[zspmDm]=zspmMc;
		}
	}
	var pm_zm = "";
	for(var i=0;i< pjdjTemp.length;i++){
		var fb = pjdjTemp[i];
		var zspmMc = zspmDm2Mc[fb['zspmDm']];
		pm_zm+=zspmMc;
		if(fb['zszmDm']!="" && fb['zszmDm']!=undefined){
			var zszmMc = zszmDm2Mc[fb['zszmDm']];
			pm_zm+=('['+zszmMc+']');
		}
		if(i!==pjdjTemp.length-1){
			pm_zm+='、';
		}
	}
	if(pjdjTemp.length!==0){
		 parent.layer.confirm(setStyle('根据纳税人申报销售额和销售量检测，（"'+pm_zm+'"） 存在销售额与销售量不匹配或申报不实可能，请予确认。'),{
				title:'提示',
				btn : ['确认','取消']
			},function(index){
				parent.layer.close(index);
				prepareMake(isSecondCall);
			},function(index){
				parent.layer.close(index);
			});
	}else{
		prepareMake(isSecondCall);
	}
}

/**
 * 契税申报
 * @param isSecondCall
 */
function beforeSubmitFormQssb() {
	//契税的初始化减免性质码表太大，必须过滤掉一些没用到的节点
	var zspmDm = formData.sb030QssbVO.zspmDm;
	var jmlxDm = formData.sb030QssbVO.jmlxDm;
	if(jmlxDm==''){
		formData.qcs.initData.jmxxlist.option=[];
		formData.sb030QssbVO.jmxzMc='';
		return;
	}
	var optionList = formData.qcs.initData.jmxxlist.option;
	var optionListTemp = [];
	for(var index in optionList){
		var option = optionList[index];
		var pc = option['pc'];
		var dm = option['dm'];
		if(pc===zspmDm && dm===jmlxDm){
			optionListTemp.push(option);
		}
	}
	formData.sb030QssbVO.jmxzMc=optionListTemp[0]['mc'];
	formData.qcs.initData.jmxxlist.option=optionListTemp;
}

/**
 * 申报[下一步]按钮动作
 * isSecondCall:true:为true时，忽略进入下一步;
  * xybNoTip 禁用下一步询问弹窗
 * sb:表示走福建签章流程的时候直接进入回执页，不需要弹框展示PDF
 */
function prepareMake(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	
	//判断是否为企业税务人员登陆，如果是则使得点击下一步按钮失效
	if("undefined" !== typeof otherParams && "undefined" !== typeof otherParams.LoginType && otherParams.LoginType === 'LOGIN_TYPE_SWRY'){
		parent.layer.alert('尊敬的纳税人，您是以企业身份登陆，不能进行下一步申报操作！', {title:"提示",icon: 5});
		return;
	}
	if(checkDIffDjxh()){//djxh不一致，不进行保存
		return;
	}

	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			// isSecondCall为true时，忽略进入下一步
			if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
				var regEvent = new RegEvent();
				tip = regEvent.verifyAllComfirm(prepareMake);
				if (!tip) {
					// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
					$("body").unmask();
					prepareMakeFlag = true;
					return;
				}
			}
			//附送资料必报的校验
            var sybbfs = 0;
            if (ywlx.toLowerCase().indexOf("sxsq") > -1) {
                var fszlFrame = window.parent.frames["fszlFrame"].document || window.parent.frames[1].document;
                sybbfs = $("#sybbfs", fszlFrame).val();
            }else {
                //申报文件上传按钮占用myModa1的fszlFrame，申报将附送资料改为myModa7的sbFszlFrame
                var sbFszlFrame = window.parent.frames["sbFszlFrame"].document || window.parent.frames[1].document;
                sybbfs = $("#sybbfs", sbFszlFrame).val();
			}
			if (sybbfs>0) {
				if(parent.formstyle==='form1'){
					parent.layer.alert("请上传必报的附送资料！", {title: "提示", icon: 5});
				}else{
					parent.layer.alert("请点击\"附送资料\"上传相关文件！", {title: "提示", icon: 5});
				}
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}

			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			//根据总局验收标准，现对所有申报表点击申报时，进行提示（申报提示，一键零申报、文书不提示）
			if(typeof ctips =="function" && location.href.indexOf("yjlsb=Y")==-1){
				//在申报确认提示前执行业务特有校验
				if (typeof doBeforeCtipsVerify == "function") {
					doBeforeCtipsVerify(isSecondCall);
				}else {
					ctips(isSecondCall);
				}
            }else{
                if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
                    $("body").mask("正在提交，请稍候...");
                } else {
                    $("body").mask("正在处理，请稍候...");
                }

                var saveData = JSON.stringify(formData);
                formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
                var submitData = JSON.stringify(formData);
                if (saveData == submitData) {
                    submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
                }
                // 将特殊字符转为全角字符避免合成pdf异常
                saveData = saveData.replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, "＞").replace(/\\\\/g, "＼");

                $("#saveData1").val(encodeURIComponent(saveData));
                $("#submitData1").val(encodeURIComponent(submitData));

                /**
                 * 申报提交时框架校验成功后调用业务特有校验（一般在ywbm.js中实现）
                 * 然后在业务特有校验中调用doBeforSubmitForm，在提交表单之前做一些事情。如弹出申报前的确认提示
                 * 最后由doBeforSubmitForm调用submitForm实现申报提交
                 */
                doAfterVerify(doBeforSubmitForm,submitForm,isSecondCall);
			}

		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
	}
}

/**
 * 申报提交时框架校验成功后的业务特有校验，空方法，预留给产品具体业务实现
 * @param callBeforSubmitForm ：回调方法，调用表单提交前的业务特有提示
 * @param callSubmitForm ：回调方法，调用表单提交
 * @param params : 回调参数
 */
function doAfterVerify(callBeforSubmitForm,callSubmitForm, params) {
    /**
	 * 已经把prepareMake中所有带有ywbm判断的代码都迁移到了这里
     * 由申报组吧具体的ywbm判断再迁移到具体的ywbm.js中
	 * 迁移完成后doAfterVerify应该只有callBeforSubmitForm(callSubmitForm,params);这一句代码
     */
    var ywbm = $("#ywbm").val().toUpperCase();


    if(ywbm ==='QSSB'){
    	//将值赋值到页面前执行操作，去掉契税没用到的减免性质代码，否则报文太长，后台request.getParameter获取不到报文
        beforeSubmitFormQssb();
    	var saveData = JSON.stringify(formData);
		formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
		var submitData = JSON.stringify(formData);
		if (saveData == submitData) {
			submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
		}
		$("#saveData1").val(encodeURIComponent(saveData));
		$("#submitData1").val(encodeURIComponent(submitData));
    }

    var indexCwbb = ywbm.indexOf("CWBB_");
    if(indexCwbb===0){
        var swjgDm= "";
        var url = window.location.href;
        if(indexCwbb===0){
			if(formData.qcs == undefined && formData.fq_ != undefined){
				swjgDm = formData.fq_.djNsrxx.swjgDm;
			}else {
				swjgDm = formData.qcs.djNsrxx.zgswjdm;//财务报表的报文结构和其他申报表的结构不一样
			}
        }else{
            swjgDm = getSwjgDm(formData);
        }
        if(swjgDm.substring(0,3)==="137" && url.indexOf("bzz=csgj") > -1){
			if(!isJmsb()){
				var proMessage = "<div style=\"padding-left:20px;\">请确认是否提交申报？</div><br/>";
				parent.layer.confirm(proMessage,{
					icon : 3,
					title:'提示',
					btn : ['确认','取消'],
					btn2:function(index){
						parent.layer.close(index);
						$("body").unmask();
						prepareMakeFlag = true;
						return;
					}
				},function(index){
					parent.layer.close(index);
					// 执行回调函数
					callBeforSubmitForm(callSubmitForm,params);
				});
			}else{
				callBeforSubmitForm(callSubmitForm,params);
			}
        }else{
			callBeforSubmitForm(callSubmitForm,params);
        }
    }else{
        // 执行回调函数
        callBeforSubmitForm(callSubmitForm,params);
	}
}

/**
 * 申报提交前的业务特有提示，空方法，预留给区域具体业务实现
 * @param callSubmitForm ：回调方法，调用表单提交
 * @param params
 */
function doBeforSubmitForm(callSubmitForm, params) {
	//回调submitForm
    callSubmitForm(params);
}

function prepareMakeshow(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	var saveData = JSON.stringify(formData);
	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
	var submitData = JSON.stringify(formData);
	if (saveData == submitData) {
		submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
	}
	$("#saveData1").val(encodeURIComponent(saveData));
	$("#submitData1").val(encodeURIComponent(submitData));
	var d = {};
    var t = $('#myform').serializeArray();
    $.each(t, function() {
    	d[this.name ] = this.value;
    });
    d['saveData1'] = encodeURIComponent(saveData);
    d['submitData1'] = encodeURIComponent(submitData);
	$.ajax({
		type : "POST",
		async:false,
		url :  location.protocol + "//" + location.host + window.contextPath+"/save/saveYsqbw.do",
		data:d,
		dataType : "json",
		success : function() {
			
		},
		error : function() {
			
		}
	});
	
	var zlpzWebContextPath = $("#zlpzWebContextPath").val();
	if(zlpzWebContextPath ==null || typeof zlpzWebContextPath == 'undefined'){
		zlpzWebContextPath = "/zlpz-cjpt-web";
	}
	
	url = zlpzWebContextPath+"/zlpz/openPdfshow.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val();
	//window.location.href = url;
	//var url = location.protocol + "//" + location.host+"/zlpz-cjpt-web/zlpz/openPdfshow.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val()+"&showBtnIDs="+showBtnIDs;
	parent.window.open(url);
}
//全表解除锁定标志
var unlockedAllFormsBz = 'N';
/**
 * 全表解除锁定
 * */
function unlockedAllForms() {
	unlockedAllFormsBz = 'Y';
	judgeAndUnlockedAllForms();
}
/**
 * 判断是否全表解除单元格锁定,是则解锁所有单元格
 * */
function judgeAndUnlockedAllForms(){
	if(unlockedAllFormsBz=='Y'){
		$("iframe#frmSheet").contents().find("input[readonly][ng-model]").each(function(){
			$(this).removeAttr("readonly");
		});
		$("iframe#frmSheet").contents().find("select[disabled][ng-model]").each(function(){
			$(this).removeAttr("disabled");
		});
		$("iframe#frmSheet").contents().find("input[disabled][ng-model]").each(function(){
			$(this).removeAttr("disabled");
		});
	}
}

/**
 * 仅用于主干查看静态pdf按钮
 *
 * @param isSecondCall
 */
function prepareMakeSteamKey() {
    // TODO 置标志位 调用父页面的方法按钮 失效，
    // 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
    var saveData = JSON.stringify(formData);
    formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
    var submitData = JSON.stringify(formData);
    if (saveData == submitData) {
        submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
    }
    $("#saveData1").val(encodeURIComponent(saveData));
    $("#submitData1").val(encodeURIComponent(submitData));
    var d = {};
    var t = $('#myform').serializeArray();
    $.each(t, function() {
        d[this.name ] = this.value;
    });
    d['saveData1'] = encodeURIComponent(saveData);
    d['submitData1'] = encodeURIComponent(submitData);
    $.ajax({
        type : "POST",
        async:false,
        url :  location.protocol + "//" + location.host + window.contextPath+"/save/saveYsqbw.do",
        data:d,
        dataType : "json",
        success : function() {

        },
        error : function() {

        }
    });
    var zlpzWebContextPath = $("#zlpzWebContextPath").val();
    if(zlpzWebContextPath ==null || typeof zlpzWebContextPath == 'undefined'){
        zlpzWebContextPath = "/zlpz-cjpt-web";
    }
    //var queryString =  $("#zlpzWebContextPath").val();

    var url = zlpzWebContextPath+"/zlpzxfa/DownPdfSignBySteamKey.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val();
    //var url =  zlpzWebContextPath+"/zlpzxfa/DownPdfSignBySteamKey.do?_query_string_="++"&ysqxxid=<%=ysqxxid%>&ywbm=<%=ywbm%>&_bizReq_path_="+_bizReq_path_;
    window.open(url);
}

/**
 * 申报[下一步]按钮动作
 */
//function otherValidate() {
//	
//	var flag = false;
//
//	var saveData = JSON.stringify(formData);
//	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
//	var submitData = JSON.stringify(formData);
//	if (saveData == submitData) {
//		submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
//	}
//	$("#saveData1").val(encodeURIComponent(saveData));
//	$("#submitData1").val(encodeURIComponent(submitData));
//
//	var dataPara = $("#myform").serializeObject();   
//    
//    $.ajax({
//		type : "POST",
//		async:false,
//		url : location.protocol + "//" + location.host + window.contextPath
//				+ "/otherValidate/validate.do?_query_string_=" + $("#_query_string_").val()
//				+ "&gdslxDm=" + $("#gdslxDm").val()
//				+ "&ysqxxid=" + $("#ysqxxid").val() 
//				+ "&_bizReq_path_=" + _bizReq_path_,
//		dataType : "json",
//		contentType : "text/json",
//		data : encodeURIComponent(JSON.stringify(dataPara)),
//		success : function(data) {
//			if ('Y' == data.returnFlag) {
//				flag = true;
//			} else {
//				parent.layer.alert(tips, {title: "校验失败", icon: 5});
//			}
//		},
//		error : function() {
//			parent.layer.alert('校验失败.', {
//				icon : 5
//			});
//		}
//	});
//
//    return flag;
//}

/**
 * 校验按钮注册
 */
function verifyMake() {
	var Variable = regEvent.verifyAll();
	if (Variable == true) {
		if(!isJmsb()){
			parent.layer.alert("校验通过，可申报。", {
				icon : 1
			});
		}	
	} else {
		// parent.layer.alert("校验失败，请检查。", {icon: 5});
		return false;
	}
}



/**
 * 打印按钮
 */
function printForm() {
	window.frames["frmSheet"].window.focus();
	window.frames["frmSheet"].window.print();
}

/**
 * 关闭按钮注册
 */
function closeForm() {
	var frame = window;
	parent.layer.confirm("确定关闭？", {
		icon : 2,
		title : '提示'
	}, function(index) {
		if (navigator.userAgent.indexOf("MSIE") > 0) {
			if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
				frame.opener = null;
				frame.close();
			} else {
				frame.open('', '_top');
				frame.top.close();
			}
		} else if (navigator.userAgent.indexOf("Firefox") > 0) {
			frame.location.href = 'about:blank ';
			frame.top.close();
		} else if (navigator.userAgent.indexOf("Chrome") > 0) {
			/*window.location.href = 'about:blank ';
			window.close();*/
			top.open(location, '_self').close();
		} else {
			frame.open('', '_top');
			frame.top.close();
		}
		parent.layer.close(index);
	});
}

/**
 * 一般纳税人 期初数链接
 */
function linkQcssz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsqcs";
	}

	var url = location.protocol + "//" + location.host + window.contextPath
			+ "/biz/setting/" + ywbm + "?bzz=csgj&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val();
	// 不集成session的url，需要加些其他参数
	if (oldurl.indexOf("test=true") > -1) {
		url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
				+ "&test=true";
	}
	window.open(url);
}

/**
 * 一般纳税人 基础设置链接
 */
function linkJcsz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsjcsz";
	}
	if (sbywbm == "QYSDS_A" || sbywbm == "QYSDS_B" || sbywbm == "FJM_QYSDS_A"
			|| sbywbm == "FJM_QYSDS_B") {
		ywbm = "qysdsjcsz";
	}
	if (sbywbm.match("CWBB")) {
		if(oldurl.indexOf("isycs=1")!=-1){
			ywbm = "cwbbycsjcsz";
		}else if(oldurl.indexOf("bzz=csgj")!=-1){
			ywbm = "cwbbjcsz";
		}else if(oldurl.indexOf("bzz=dzswj")!=-1){
			ywbm = "cwbbydy";
		}else{
			ywbm = "cwbbydy";
		}
		var urlArg = window.location.search;
		var cwbburl = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + urlArg;
		if(cwbburl.indexOf("fromsbb=true")==-1){
			cwbburl = cwbburl + "&fromsbb=true";
		}
		parent.window.open(cwbburl, "_self");
	}else{
		var url = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + "?gdslxDm="
		+ $("#gdslxDm").val();
		// 不集成session的url，需要加些其他参数
		if (oldurl.indexOf("test=true") > -1) {
			url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
					+ "&test=true"+ "&sssqQ=" + $("#sssqQ").val() 
					+ "&sssqZ=" + $("#sssqZ").val();
		}
		window.open(url);
	}
	

}

/**
 * 重置按钮
 */
function resetForm() {
    var frame = window;
    $("#backBegin").val("");
    $("#saveData1").val("");
    parent.layer.confirm("重置申报表将覆盖您申报表中已填写的相关数值，并重新生成申报表，请确认是否继续？", {
        icon : 3,
        title : '提示'
    }, function(index) {
        var url = frame.location.href;
        if (url.indexOf("reset=Y") == -1) {
            if(url.indexOf("?")>-1){
                url = url + "&reset=Y";
            }else{
                var action = $("#myform").attr("action");
                action = action.replace("make","begin");
                $("#myform").attr("action",action);
                $("#_query_string_").val("");
                $("#reset").val("Y");
                $("#toForm").val("true");
                $("#myform").submit();
                parent.layer.close(index);
                return;
            }

        }

		// 清空按钮工具条
		$(".areaHeadBtn", frame.parent.document).empty();
		frame.location.href = url;
		parent.layer.close(index);
	});
	
}

/**
 * 重置按钮，没有提示就重置
 * 
 * */
function resetForm2(){
	var frame = window;
	$("#backBegin").val("");
	$("#saveData1").val("");
	var url = frame.location.href;
	if (url.indexOf("reset=Y") == -1) {
		url = url + "&reset=Y";
	}
	// 清空按钮工具条
	$(".areaHeadBtn", frame.parent.document).empty();
	frame.location.href = url;
}

/**
 * 导入按钮（仅提供测试使用）
 */
function import01() {
	var jsonXml = window.prompt("导入的json报文内容", "");
	$("body").mask("正在保存数据，请稍候...");
	$.ajax({
		type : "POST",
		url : "saveData.do?djxh=" + $("#djxh").val() 
			+ "&sbywbm=" + $("#ywbm").val() 
			+ "&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val() 
			+ "&bz=" + $("#bzz").attr("value"),
		dataType : "json",
		contentType : "application/json",
		data : jsonXml,
		success : function(data) {
			if ('000' == data.code) {
				window.location.reload();
			} else {
				parent.layer.alert('保存失败.', {
					icon : 5
				});
			}
			$("body").unmask();
		},
		error : function() {
			$("body").unmask();
			parent.layer.alert('保存失败.', {
				icon : 5
			});
		}
	});
}

/**
 * 导出按钮（仅提供测试使用）
 */
function export01() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	/*
	 * if(!tip){ parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2}); $("body").unmask();
	 * return ; }
	 */
	$("body").unmask();
	var jsonXml = JSON.stringify(formData);
	layer.open({
		title : '导出的json报文',
		shadeClose : true,
		shade : 0.4,
		area : [ '500px', '600px' ],
		content : jsonXml
	});
}

/**
 * 自动化测试导出按钮（仅提供测试使用）
 */
function autoTestJson(sceneName) {
	var jsonXml = JSON.stringify(formData);
	var tempData = {};
	tempData.sceneName = sceneName;
	tempData.jsonData = jsonXml;
	var url = "http://10.10.0.161:8088/autoTest/jsp/exportedJson/exportedJson.jsp";
	layer.open({
		type : 2,
		title : '导出的json报文到自动化测试',
		shadeClose : true,
		shade : 0.4,
		skin: 'CLYM-style',
		area : [ '600px', '380px' ],
		content : url,
		success: function (layero, index) {
			layero.find("iframe")[0].contentWindow.postMessage(JSON.stringify(tempData),url);
		}
	});
	
//	window.frames[0].postMessage(jsonXml,'http://10.10.11.220:8080/autoTest/jsp/exportedJson/exportedJson.jsp');
	
}

/**
 * 自动化测试按钮（仅提供测试使用）
 */
function autoTestBtn() {
	
	var jsonXml = JSON.stringify(formData);
	var parameJson = {};
	parameJson.djxh = $("#djxh").val();
	parameJson.nsrsbh = $("#nsrsbh").val();
	parameJson.gdslxDm = $("#gdslxDm").val();
	parameJson.ywbm = $("#ywbm").val();
	parameJson.test = $("#test").val();
	parameJson.nsqx = "06";
	
	var paramArr =window.location.search.substring(1).split("&");
	for (var i = 0; i < paramArr.length; i++){
		if (paramArr[i].match("nsqx_dm")){
			parameJson.nsqx = paramArr[i].split("=")[1];
		}
	}
	
//	var url = "http://10.10.11.220:8080/autoTest/jsp/exportedJson/integrationSbJson.jsp";//本机联调
	var url = "http://10.10.0.161:8088/autoTest/jsp/exportedJson/integrationSbJson.jsp";//测试环境地址
	
	$.ajax({
		type: "POST",
 		url: window.contextPath+"/nssb/auto/autoGetNsrxx.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(parameJson),
        async:true,
 		success:function(data){
 			if (!$.isEmptyObject(data)){
 				var tempData = eval('('+data+')');
 				tempData.json = eval('('+jsonXml+')');
 				layer.open({
 	 				type : 2,
 	 				title : '自动化测试',
 	 				shadeClose : true,
 	 				shade : 0.4,
 	 				skin: 'CLYM-style',
 	 				area : [ '1200px', '550px' ],
 	 				content : url,
 	 				success: function (layero, index) {
 	 					layero.find("iframe")[0].contentWindow.postMessage(JSON.stringify(tempData),url);
 	 				}
 	 			});
 			}
 			
 		}
	});
	
	
//	window.frames[0].postMessage(jsonXml,'http://10.10.11.220:8080/autoTest/jsp/exportedJson/exportedJson.jsp');
	
}

/**
 * 导出报盘 XML
 */
function exportXML() {
    var result = doExport();
    if(result){
    	isExporting = true;
        //调用formEngine.js下的锁定右侧工作区的方法
        formEngine.hideMaskFrmSheet();
        if (window.location.search.indexOf("gzsb=Y") == -1 && window.location.search.indexOf("gzsb=zx") == -1) {
            //点击导出报盘屏蔽其他按钮
            $(".areaHeadBtn li a", window.parent.document).each(function () {
                var _$this = $(this);
                if (_$this.attr("id") != "btnExportXML") {
                    $(this).hide();
                }
            });
        }
    }
}
/**
 * 导出报盘操作
 */
function doExport() {
	
	var ywbm = $("#ywbm").val();
	var bzz = getQueryVariable("bzz");
	var swjgDm = getSwjgDm(formData);
	if(swjgDm != null){
		swjgDm = swjgDm.substring(0,3);
	}
	if("ybnsrzzs" == ywbm && bzz != "sb02" && bzz != "csgj" && swjgDm == "144"){
		var prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return false;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			// isSecondCall为true时，忽略进入下一步
			if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
				var regEvent = new RegEvent();
				tip = regEvent.verifyAllComfirm(prepareMake);
				if (!tip) {
					// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
					$("body").unmask();
					prepareMakeFlag = true;
					return false;
				}
			}
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return false;
		}
	}

    var saveData = JSON.stringify(formData); // 保存的报文。用于表单还原
    formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
    var submitData = JSON.stringify(formData); // 需要提交的报文，用来导出的报文

    // 如果保存的报文与提交报文一致，则把保存报文置空，减少网络传输
    if (saveData == submitData) {
        saveData = "";
    }
    $("body").unmask();

    parent.layer.alert("正在导出磁盘，需要再次导出，可进入此页面操作！", {
        icon: 1
    });
    //$("body").mask("正在导出到磁盘，请稍候...");
    if (submitData.charAt("1") === '"') {//当json文本类似于{"jmxxGrid":{"jmxxGridlb":......时
        //将引号内部的单引号替换为双引号。
        submitData = submitData.replace(/'/g, '\\"');
    } else if (submitData.charAt("1") === "'") {//当json文本类似于{'jmxxGrid':{'jmxxGridlb':......时
        //do nothing. 暂时未发现会出现此类情况。
    }
    // 由于ajxax返回不能是二进制流形式，通过form表单来请求。
    var form = $("<form>"); // 定义一个form表单
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", pathRoot + "/biz/" + _bizReq_path_
        + "/xExportXML?_query_string_=" + encodeURIComponent($("#_query_string_").val())
        + "&ysqxxid=" + $("#ysqxxid").val()
        + "&gdslxDm=" + $("#gdslxDm").val()
        + "&_bizReq_path_=" + _bizReq_path_
        + "&dzbdbmList=" + $("#dzbdbmList").val());
    var formHtml = "<input  type='hidden' name='saveData' value='"
        + encodeURIComponent(saveData)
        + "'><input  type='hidden' name='submitData' value='"
        + encodeURIComponent(submitData) + "'>";

    // 增加非单点登陆模式
    var url = window.location.href;
    if (url.indexOf("test=true") > -1) {
        formHtml += "<input  type='hidden' name='test' value='true'>";
    }

    $("body").append(form);// 将表单放置在web中
    form.append(formHtml);
    form.submit();// 表单提交
    form.remove();
    $("body").unmask();
    return true;
}
/**
 * 只导出报盘 XML，不改变任何业务状态
 */
function exportXMLOnly() {

	var ywbm = $("#ywbm").val();
	var bzz = getQueryVariable("bzz");
	var swjgDm = getSwjgDm(formData);
	if(swjgDm != null){
		swjgDm = swjgDm.substring(0,3);
	}
	if("ybnsrzzs" == ywbm && bzz != "sb02" && bzz != "csgj" && swjgDm == "144"){
		var prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			// isSecondCall为true时，忽略进入下一步
			if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
				var regEvent = new RegEvent();
				tip = regEvent.verifyAllComfirm(prepareMake);
				if (!tip) {
					// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
					$("body").unmask();
					prepareMakeFlag = true;
					return;
				}
			}
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
	}

	var saveData = JSON.stringify(formData); // 保存的报文。用于表单还原
	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
	var submitData = JSON.stringify(formData); // 需要提交的报文，用来导出的报文

	// 如果保存的报文与提交报文一致，则把保存报文置空，减少网络传输
	if (saveData == submitData) {
		saveData = "";
	}
	$("body").unmask();

	parent.layer.alert("正在导出到磁盘，请稍候通过其他途径可以再次导出", {
		icon : 1
	});
	$("body").mask("正在导出到磁盘，请稍候...");
	if(submitData.charAt("1") === '"'){//当json文本类似于{"jmxxGrid":{"jmxxGridlb":......时
		//将引号内部的单引号替换为双引号。
		submitData = submitData.replace(/'/g,'\\"');
	}else if (submitData.charAt("1") === "'"){//当json文本类似于{'jmxxGrid':{'jmxxGridlb':......时
		//do nothing. 暂时未发现会出现此类情况。
	}
	
	// 由于ajxax返回不能是二进制流形式，通过form表单来请求。
	var form = $("<form>"); // 定义一个form表单
	form.attr("style", "display:none");
	form.attr("target", "");
	form.attr("method", "post");
	form.attr("action", pathRoot + "/biz/" + _bizReq_path_
			+ "/xExportXML?_query_string_=" + encodeURIComponent($("#_query_string_").val())
			+ "&ysqxxid=" + $("#ysqxxid").val()
			+ "&gdslxDm=" + $("#gdslxDm").val()
			+ "&_bizReq_path_=" + _bizReq_path_
			+ "&dzbdbmList=" + $("#dzbdbmList").val() + "&isOnlyExpo=true");
	var formHtml = "<input  type='hidden' name='saveData' value='"
			+ encodeURIComponent(saveData)
			+ "'><input  type='hidden' name='submitData' value='"
			+ encodeURIComponent(submitData) + "'>";

	// 增加非单点登陆模式
	var url = window.location.href;
	if (url.indexOf("test=true") > -1) {
		formHtml += "<input  type='hidden' name='test' value='true'>";
	}

	$("body").append(form);// 将表单放置在web中
	form.append(formHtml);
	form.submit();// 表单提交
	form.remove();
	$("body").unmask();
}
/**
 * 查询附送资料份数
 */
/*
 * $(function(){
 * 
 * var swsxDm=$("#swsxDm").val(); var squuid=$("#ysqxxid").val(); var
 * swjgDm=$("#swjgDm").val(); var $fszlFrame =
 * $(window.parent.document).find("#fszlFrame");
 * $fszlFrame.attr("src","/zlpz-cjpt-web/attachment/getDzbdFlzlList.do?swsx_dm="+swsxDm+"&squuid="+squuid+"&swjgDm="+swjgDm)
 * 
 * $.ajax({ type : "POST", url :
 * "/zlpz-cjpt-web/attachment/queryFszlfs.do?swsx_dm="+swsxDm, success:function(data){
 * var json = eval('(' + data + ')'); var flzlsldiv='<div class="temp01"
 * style="">'+json.fs+'</div>'; var $btnScfszl =
 * $(window.parent.document).find("#btnScfszl");
 * $btnScfszl.append($(flzlsldiv)); }, error:function(){ $("body").unmask();
 * parent.layer.alert('查询附送资料份数失败', {icon: 5}); } }); var $winclose =
 * $(window.parent.document).find(".winclose"); $winclose.click(function(){ var
 * $winbox_bg=$(window.parent.document).find(".winbox_bg") $winbox_bg.remove()
 * $winclose.parents("#myModa1").animate({top:"-200px",opacity:"0"},300).fadeOut();
 *  })
 * 
 * });
 */
var index = 201
// 只提示1次是否使用复用资料
var FyzlFlag = false;
function scFszl() {
	// 当二次动态加载标识不一致时，更新附送资料
	if (typeof flzlDeliver == 'function') {
		var json = flzlDeliver();
		var tag = $("#secondLoadTag").val();
		if (json.params!=tag) {
			updateFszl();
		}
	}
	index = index + 1;
    // 添加遮罩层
    var boxbg = "<div class='winbox_bg'></div>";
    var $b = $(window.parent.document).find("body")
    $b.append(boxbg);
    var $winbox_bg = $(window.parent.document).find(".winbox_bg")
    if (ywlx.toLowerCase().indexOf("sxsq") > -1) {
        var $myModa1 = $(window.parent.document).find("#myModa1");
		$winbox_bg.last().css({
			"z-index" : index
		})
		$winbox_bg.animate({
			opacity : 0.3
		})	
		$myModa1.css({
			"z-index" : index + 1,
			"position" : "absolute",
			"left" : "210px",
			"top" : "-100px"
		}).show().animate({
			top : "10%",
			opacity : "1"
		}, 300);
	} else {
		//申报文件上传按钮占用myModa1的fszlFrame，申报将附送资料改为myModa7的sbFszlFrame
        var $myModa7 = $(window.parent.document).find("#myModa7");
		$winbox_bg.last().css({
			"z-index" : index
		})
		$winbox_bg.animate({
			opacity : 0.3
		})
		$myModa7.css({
			"z-index" : index + 1,
			"position" : "absolute",
			"left" : "210px",
			"top" : "-100px"
		}).show().animate({
			top : "10%",
			opacity : "1"
		}, 300);
	}	
	// GEARS-6327 附列资料复用，调用zlpz/attachment.js的方法，
	if(typeof parent.frames[1].findFyzl === 'function'){
		parent.frames[1].findFyzl();
	}
}

function updateFszl() {
	var msg;
	if (typeof flzlDeliver == 'function') {
		var json = flzlDeliver();
		if (json.flag === "Y" && (json.params != undefined && json.params != "")) {
			msg = json.params;
		} else if (json.flag === "" && json.params === "") {
			msg = "";
		} else if (json.flag === "N") {
			layer.alert(json.msg);
			return;
		}
	} else {
		return;
	}
	var ysqxxid = $("#ysqxxid").val();
	var swsxDm = $("#swsxDm").val();
	var lcswsxDm = $("#lcswsxDm").val();
	var gdslxDm = $("#gdslxDm").val();
	var nsrsbh = $("#nsrsbh").val();
	var djxh = $("#djxh").val();
	var test = $("#test").val();
	var ywbm = $("#ywbm").val();
	$("#secondLoadTag").val(msg);
	var param = "ysqxxid=" + ysqxxid + "&swsxDm=" + swsxDm + "&lcswsxDm="
			+ lcswsxDm + "&gdslxDm=" + gdslxDm + "&nsrsbh=" + nsrsbh + "&djxh="
			+ djxh + "&secondLoadTag=" + msg + "&ywbm=" + ywbm + "&test="
			+ test;
	var zlpzWebContextPath = $("#zlpzWebContextPath").val();
	if (zlpzWebContextPath == null || typeof zlpzWebContextPath == 'undefined') {
		zlpzWebContextPath = "/zlpz-cjpt-web";
	}
	// 根据yhlx是否等于0判断是否为登录前业务
	var path = window.location.search;
	var queryFszlfsUrl = "";
	if (path.indexOf("yhlx=0") < 0) {
		$("#fszlFrame", window.parent.document).attr("src", zlpzWebContextPath+"/attachment/getDzbdFlzlList.do?"+param);
		queryFszlfsUrl = zlpzWebContextPath + "/attachment/queryFszlfs.do?" + param;
		// updateBbfs(param);
	} else {
		$("#fszlFrame", window.parent.document).attr("src", zlpzWebContextPath+"/attachmentnosso/getDzbdFlzlList.do?"+param+"&yhlx=0");
		queryFszlfsUrl = zlpzWebContextPath + "/attachmentnosso/queryFszlfs.do?" + param + "&yhlx=0";
	}
	// 更新附送资料列表右上角的红标
	$("#fszlFrame", window.parent.document).one("load",function(){
        //加载完成，需要执行的代码
		updateBbfs(queryFszlfsUrl);
    });
}

// 动态加载完附送资料后需更新必报份数并更新下一步按钮
function updateBbfs (queryFszlfsUrl) {
	$.ajax({
		type : "POST",
		url : queryFszlfsUrl,
		success : function(data) {
			// 保存必报份数
			parent.sybbfs1 = data.blfs;
			// 保存条件报送份数
			parent.sytjbbfs1 = data.tjblfs;
			var jybz = data.jybz;
			// 根据返回的资料份数（必传、非必传）,在附送资料按钮中显示对应的数目和颜色
			var fszlFrame = window.parent.frames["fszlFrame"].document || window.parent.frames[1].document;
			var btmake = $("#btnPrepareMake", window.top.document);
			var flzlsldiv,flzltjbssldiv;
			$("#sybbfs", fszlFrame).val(data.blfs);
			$("#sytjbbfs", fszlFrame).val(data.tjblfs);
			if (data.blfs > 0) {
				// 先判断是否存在红点
				if ($("#syblfs", window.top.document).length>0) {
					$("#syblfs", window.top.document).text(data.blfs);
					$("#syblfs", window.top.document).css("display","block");
					if ($("#syblfs", window.top.document).attr('class')!='temp01') {
						$("#syblfs", window.top.document).removeClass("temp02");
						$("#syblfs", window.top.document).addClass("temp01");
					}
				} else {
					flzlsldiv='<div id="syblfs" class="temp01" style="">'+data.blfs+'</div>';
	        		$("#btnScfszl", window.top.document).append($(flzlsldiv));
				}
			} else if (data.tjblfs > 0) {
				// 先判断是否存在红点
				if ($("#syblfs", window.top.document).length>0) {
					$("#syblfs", window.top.document).text(data.tjblfs);
					$("#syblfs", window.top.document).css("display","block");
					if ($("#syblfs", window.top.document).attr('class')!='temp02') {
						$("#syblfs", window.top.document).removeClass("temp01");
						$("#syblfs", window.top.document).addClass("temp02");
					}
				} else {
					flzltjbssldiv='<div id="syblfs" class="temp02" style="">'+data.tjblfs+'</div>';
					$("#btnScfszl", window.top.document).append($(flzltjbssldiv));
				}
			} else {
				$("#syblfs", window.top.document).html(data.tjblfs);
				$("#syblfs", window.top.document).css("display","none");
			}
		}
	});
}

var index = 201
function fileUpload() {
	var $myModa1 = $(window.parent.document).find("#myModa1");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	// 2019-02-25 申报业务个性化上传页面提示信息
	if (typeof ywControlUploadTip === "function") {
		$deliverTips = ywControlUploadTip();
		$myModa1.find("#fszlFrame").contents().find("#uploadTips").html($deliverTips);
	}
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

function scfzzl() {
	var $myModa2 = $(window.parent.document).find("#myModa2");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa2.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

/**
 * 附加税预缴联合增值税预缴申报其他效验
 * @param prepareMake
 */
function prepareMakeLhyjsb(isSecondCall) {

    if (formData.fileGrid != null && formData.fileGrid.fileGridlb.length > 0) {

        var tip = true;
        if (!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
            var regEvent = new RegEvent();
            tip = regEvent.verifyAllComfirm(prepareMake);
            if (!tip) {
                $("body").unmask();
                prepareMakeFlag = true;
                return;
            }
        }
        //2、3必须同时报送。 就是有yj002和yj003 必须同时有
        var fjxx = formData.fileGrid.fileGridlb;
        var htfj = 0;
        var fpfj = 0;
        for (var i = 0; i < fjxx.length; i++) {
            if (fjxx[i].filepath == "yj002") {
                htfj = 1;
            }
            if (fjxx[i].filepath == "yj003") {
                fpfj = 1;
            }
        }

        if ((htfj == 1 && fpfj == 0) || (htfj == 0 && fpfj == 1)) {
            parent.layer.alert('与分包方签订的分包合同复印件(加盖纳税人公章)和从分包方取得的发票复印件(加盖纳税人公章)必须同时上传', {
                icon: 5
            });
        } else {
            // delete formData.fileGrid;
            prepareMake(isSecondCall);
        }


    } else {

        if (formData.qcs.kqsydj[0].xmlb == "建筑服务") {
            parent.layer.alert('请您至少报送一个材料！！', {
                icon: 5
            });
        }else {
            prepareMake(isSecondCall);
        }

    }
}


/**
 * 增值税预缴上传附注
 */
function yjscfjzl() {

    if (formData.qcs.kqsydj[0].xmlb == "建筑服务") {
        var $myModa2 = $(window.parent.document).find("#myModa6");
        index = index + 1
        // 添加遮罩层
        var boxbg = "<div class='winbox_bg'></div>";
        var $b = $(window.parent.document).find("body")
        $b.append(boxbg);
        var $winbox_bg = $(window.parent.document).find(".winbox_bg")
        $winbox_bg.last().css({
            "z-index": index
        })
        $winbox_bg.animate({
            opacity: 0.3
        })
        $myModa2.css({
            "z-index": index + 1,
            "position": "absolute",
            "left": "210px",
            "top": "-100px"
        }).show().animate({
            top: "10%",
            opacity: "1"
        }, 300);
    }else {
        parent.layer.alert('只允许建筑服务预缴申报上传附件！！', {
            icon: 5
        });
    }


}



function importXml() {
	var $myModa1 = $(window.parent.document).find("#myModa4");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

/*
 * 下载模版按钮
 * */
function modelDownload() {
	//alert(1);
	try{
		var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
		var tempData = eval('('+tempParems+')');
		var sbywbm = tempData.ywbm;
		var downloadPath = "";
		if (sbywbm.indexOf("CWBB")==0){
			downloadPath = "../../cwbb/_default_/form/cwbbbsmb.zip";
		} else {
			downloadPath = "../"+sbywbm.toLocaleLowerCase()+"/form/"+sbywbm.toLocaleLowerCase()+".xls";
		}
        var elemIF = document.createElement("iframe");
        elemIF.src = downloadPath;
       // elemIF.src = "../../cwbb/_default_/form/qykjzd.xls";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    } 
	 //window.location.href="../cwbb/_default_/form/cwbbbsmb.zip";
     //window.open("../cwbb/_default_/form/cwbbmb.zip");
     //window.open("../cwbb/_default_/form/test.zip");
     //window.open("../cwbb/_default_/begin/download.html");
    
}

function downCwbbmb(bbbsq_dm) {
	//alert(bbbsq_dm);
	try{
		var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
		var tempData = eval('('+tempParems+')');
		var sbywbm = tempData.ywbm;
		var downloadPath = "";
		if (sbywbm.indexOf("CWBB")==0){
			var vname = "_YJB.zip";
			if("1"==bbbsq_dm || "3"==bbbsq_dm){
				 vname = "_YJB.zip";
			}else if ("4"==bbbsq_dm){
				 vname = "_NB.zip";
			}
			var vfilename = "";
			if("CWBB_QY_KJZZ_YBQY"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_SYYH"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_ZQGS"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_BXGS"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_DBQY"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_XQY_KJZZ"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_SYDW_KJZD"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QHJT"==sbywbm){
				vfilename = sbywbm+"_NB.zip";
			}
			if(vfilename !=""){
				downloadPath = "../../cwbb/_default_/form/"+sbywbm+vname;
			}else {
				downloadPath = "../../cwbb/_default_/form/cwbbbsmb.zip";
			}
		}
        var elemIF = document.createElement("iframe");
        elemIF.src = downloadPath;
       // elemIF.src = "../../cwbb/_default_/form/qykjzd.xls";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    } 
}

/**下载模板*/
function downloadModelBy(fileName){
	try{
        var elemIF = document.createElement("iframe");
        if(!fileName){
        	fileName=ywbm+"-modle.xls";
        }
        elemIF.src = "../../sxsq/"+ywbm+"/form/"+fileName;
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);
    }catch(e){
    	
    }
}

function importJson() {
	var jsonXml = "";
	var paramBz = arguments[0];
	var rtnData = arguments[1];
	
	var params = {};
	params.fpath = rtnData;
	var $myModa3 = $(window.parent.document).find("#myModa3");
	if (paramBz == "1" && !$.isEmptyObject(rtnData)){
		importJson("0",rtnData);
	} else {
		$myModa3.css("display", "none");
		jsonXml = rtnData?rtnData:"";
		try{
			parent.layer.prompt({
				maxlength : 200000,
				formType : 2,
				value : jsonXml?jsonXml:'',
				title : '导入的json报文内容',
				btn: ['确定', '取消','预览'],
				btn3: function(value, index){
//					var $myModa3 = $(window.parent.document).find("#myModa3");
					index = index + 1;
					$myModa3.css({
						"z-index" : index + 1,
						"position" : "absolute",
						"left" : "35%",
						"top" : "50%",
						"display" : ""
					}).show().animate({
						top : "50%",
						opacity : "1"
					}, 300);
				}
			// area: ['800px', '350px'] //自定义文本域宽高
			}, function(value, index, elem) {
				jsonXml = value; // 得到value
                parent.layer.close(index);
				//formData = jQuery.parseJSON(jsonXml);
				var importData = jQuery.parseJSON(jsonXml);
				formData = deepcopy(formData, importData);	
				// $(".current_selected_BD").click();
				// $("#frmSheet")[0].contentWindow.location.reload();
				var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
				var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
				var body = $("#frmSheet")[0].contentWindow.document.body;
				viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
				flagExecuteInitial = false;
				formulaEngine.applyImportFormulas(true);
				viewEngine.formApply($viewAppElement);
				viewEngine.tipsForVerify(body);
			});
		}catch(e){
			parent.layer.alert("导入数据存在错误，请检查", {icon: 2});
            console.info(e);
		}
	}
	 
}

function exportJson() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	if (!tip) {
		/*parent.layer.alert("表格存在填写错误的数据，请检查", {
			icon : 2
		});*/
		$("body").unmask();
		return;
	}
	var tmp = JSON.stringify(formData);
	tmp = JSON.parse(tmp);
	//遍历公式置空数据。
	var formulas = formulaEngine.lstCalculateFormulas;
	for(var i=0;i<formulas.length;i++){
		if(formulaEngine.idxId2Formulas[formulas[i].id]){
			if(formulas[i].flagCompiled && !formulaEngine.idxId2Formulas[formulas[i].id].flagDisable){
				if(formulas[i].strAssResolved != undefined){
					var strAssResolved = formulas[i].strAssResolved.replace(/[$]/g,'tmp');
					if(formulas[i].strAssResolved.indexOf("#")>0){
						var dynamic = jsonPath(formData, formulas[i].strAssResolved);
						for (var k = 0; k < dynamic.length; k++) {
			            	var dynamic0 = dynamic[k];
			            	if(dynamic0 instanceof Array){
			            		for (var v = 0; v < dynamic0.length; v++) {
			            			strAssResolved = formulaEngine.twoDynamicReplace([k , v ],strAssResolved);
			    	            	eval(strAssResolved + "=''");
			    	            }
			            	}else{
			            		strAssResolved = formulaEngine.twoDynamicReplace([k],strAssResolved);
		    	            	eval(strAssResolved + "=''");
			            	}
				            
			            }
					}else{
						eval(strAssResolved+"=''");
					}
				}
			}
		}else{
			//do nothing but log.
			console.info("Error:formulas not exists in idxId2Formulas:"+formulas[i].id);
		}
	}
	$("body").unmask();
	var jsonXml = JSON.stringify(tmp);
	//值还原
	/*flagExecuteInitial = false;
    formulaEngine.applyImportFormulas(true);*/

    parent.layer.open({
		title : '导出的json报文',
		offset : '0px',
		shadeClose : true,
		shade : 0.4,
		area : [ '700px', '550px' ],
		content : jsonXml
	});
}

function importJsonNoCaculate() {
	 var jsonXml = "";
	 try{
    layer.prompt({
		maxlength : 200000,
		formType : 2,
		value : '',
		title : '导入的json报文内容'// ,
	// area: ['800px', '350px'] //自定义文本域宽高
	}, function(value, index, elem) {
		jsonXml = value; // 得到value
		layer.close(index);
		//formData = jQuery.parseJSON(jsonXml);
		var importData = jQuery.parseJSON(jsonXml);
		formData = deepcopy(formData, importData);
		// $(".current_selected_BD").click();
		// $("#frmSheet")[0].contentWindow.location.reload();
          var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
          var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
          var body = $("#frmSheet")[0].contentWindow.document.body;
          viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
          flagExecuteInitial = false;
          formulaEngine.applyImportFormulas(false);
          viewEngine.formApply($viewAppElement);
          viewEngine.tipsForVerify(body);
 	 });


	 }catch(e){
		 parent.layer.alert("导入数据存在错误，请检查", {icon: 2});
		 log.info(e);
	 }
}

function exportJsonNoCaculate() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	if (!tip) {
		/*parent.layer.alert("表格存在填写错误的数据，请检查", {
			icon : 2
		});*/
		$("body").unmask();
		return;
	}
	
	$("body").unmask();
	var jsonXml = JSON.stringify(formData);

	layer.open({
		title : '导出的json报文',
		offset : '0px',
		shadeClose : true,
		shade : 0.4,
		area : [ '700px', '550px' ],
		content : jsonXml
	});
}


/**
 * 工具方法
 */
$.fn.serializeObject = function(){
	var o= {};
	var a = this.serializeArray();
	$.each(a, function(){
		if(o[this.name]){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}else{
			o[this.name] = this.value || '';
		}
	
	});
	return o;
};
//事中监控 C.Q 20170323
function btnFEType() {
	 getOtherData();
}
/**
 * 事中监控-获取其他数据
 */
function getOtherData(){
	var index = window.parent.layer.load(2,{shade: 0.3});
	$.ajax({
		type : "POST",
		url : pathRoot+"/formula/getOtherData.do",
		dataType : "json",
		contentType : "application/json",
		data : jsonParams,
		success : function(data) {
			window.parent.layer.close(index);
			var otherData = data;
			if(!otherData) {
				parent.layer.alert('获取数据失败.', {
					icon : 5
				});
				return;
			}
			if ("string" === typeof otherData) {
				otherData = jQuery.parseJSON(otherData);   
			}
			if("undefined" !== typeof otherData.returnFlag && "N" == otherData.returnFlag) {
			
				if(typeof(otherData.errInfo) != "undefined" && otherData.errInfo.msg !="" && otherData.errInfo.msg!=null){
					//流程阻断提示
					//var index = window.parent.layer.load(0,{shade: 0.3});
					window.parent.layer.alert(otherData.errInfo.msg);
	     	   	 	return;
				}
			}
			if ("undefined" !== typeof otherData) {
				if(formData) {
					formData.qcs.initData['otherData']=otherData;
				} else {
					var qcs = {};
					var initData = {};
					initData['otherData'] = otherData;
					qcs['initData'] = initData;
					formData['qcs'] = qcs;
				}
				//formData.push(otherData);
				formulaEngine.loadFormulas(formulaCalculates);
	        	formulaEngine.initialize("formData");
	             var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
	             var body = $("#frmSheet")[0].contentWindow.document.body;
	             viewEngine.tipsForVerify(body);
			}
		},
		error : function() {
			window.parent.layer.close(index);
			parent.layer.alert('获取数据失败.', {
				icon : 5
			});
		}
	});
}


/**
 * 车船税申报[下一步]按钮动作
 */
function prepareMakeCCS(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tips = "";
			var t = 1;
			var sbsjxxGridlb = formData.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
			var pmJson = JSON.parse('{"101140611":"净吨位小于或者等于200吨的机动船舶","101140612":"净吨位201吨至2000吨的机动船舶","101140613":"净吨位2001吨至10000吨的机动船舶","101140614":"净吨位10001吨及以上的机动船舶","101140621":"净吨位不超过200吨的拖船、非机动驳船","101140622":"净吨位超过200吨但不超过2000吨的拖船、非机动驳船","101140623":"净吨位超过2000吨但不超过10000吨的拖船、非机动驳船","101140624":"净吨位超过10000吨的拖船、非机动驳船","101140631":"艇身长度不超过10米的游艇","101140632":"艇身长度超过10米但不超过18米的游艇","101140633":"艇身长度超过18米但不超过30米的游艇","101140634":"艇身长度超过30米的游艇","101140635":"辅助动力帆艇","101140101":"1.0升（含）以下的乘用车","101140102":"1.0升以上至1.6升(含)的乘用车","101140103":"1.6升以上至2.0升(含)的乘用车","101140104":"2.0升以上至2.5升(含)的乘用车","101140105":"2.5升以上至3.0升(含)的乘用车","101140106":"3.0升以上至4.0升(含)的乘用车","101140107":"4.0升以上的乘用车","101140211":"核定载客人数20人以下客车","101140212":"核定载客人数20人（含）以上客车","101140220":"货车","101140300":"挂车","101140400":"摩托车","101140500":"其他车辆","101140501":"专用作业车","101140502":"轮式专用机械车"}');
			if(sbsjxxGridlb==null || sbsjxxGridlb.length<1){
				//需要汇总
				tips = tips + t + ".您没有汇总数据，不能申报!</br>";
				t++;
			}else if(sbsjxxGridlb.length==1){
				//如果车船识别代码为空，则需要汇总
				var sbsjxxGridlbVo = sbsjxxGridlb[0];
				var clsbdm = sbsjxxGridlbVo.clsbdm;
				if(clsbdm==null || clsbdm==""){
					tips = tips + t + ".您没有汇总数据，不能申报!</br>";
					t++;
				}else{
					//[减免税额1]为【数值】，[减免性质1]不能为空！
					if(sbsjxxGridlbVo.jmse>0 && (sbsjxxGridlbVo.ssjmxzDm==null || sbsjxxGridlbVo.ssjmxzDm=="")){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[减免税额1]为【"+ROUND(sbsjxxGridlbVo.jmse,2)+"】，[减免性质1]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.jmse2>0 && (sbsjxxGridlbVo.ssjmxzDm2==null || sbsjxxGridlbVo.ssjmxzDm2=="")){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[减免税额2]为【"+ROUND(sbsjxxGridlbVo.jmse2,2)+"】，[减免性质2]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2)>ROUND(sbsjxxGridlbVo.bnynse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[本年减免税额1]与[本年减免税额2]之和【"+(ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2))+"】应小于等于[本年应纳税额]【"+ROUND(sbsjxxGridlbVo.bnynse,2)+"】！</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(sbsjxxGridlbVo.bqynse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[本期已缴税额]【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】应小于等于[本期应纳税额]【"+ROUND(sbsjxxGridlbVo.bqynse,2)+"】！</br>";
						t++;
					}
					//车船税征收品目[XX]，填写的预缴值【金额】，大于实际已预缴值【金额】，请修正！06100110010100047
					var bqyjse = 0;
					if(sbsjxxGridlbVo.zspmDm!=null &&sbsjxxGridlbVo.zspmDm!="" && formData.qcs.response1615.ccssbywbw!=null && formData.qcs.response1615.ccssbywbw.ccssbb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb.length>0){
						var sbsjxxGridlb15 = formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
						for(j=0;j<sbsjxxGridlb15.length;j++){
							var sbsjxxGridlb15Vo = sbsjxxGridlb15[j];
							if(sbsjxxGridlbVo.zspmDm==sbsjxxGridlb15Vo.zspmDm){
								bqyjse = sbsjxxGridlb15Vo.bqyjse;
								break;
							}
						}
					}
					if(bqyjse==null || bqyjse==""){
						bqyjse = 0;
					}
					if(ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(bqyjse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"车船税征收品目["+pmJson[sbsjxxGridlbVo.zspmDm]+"]，填写的预缴值【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】，大于实际已预缴值【"+ROUND(bqyjse,2)+"】，请修正！</br>";
						t++;
					}
					
				}
			}else{
				for(i=0;i<sbsjxxGridlb.length;i++){
					var sbsjxxGridlbVo = sbsjxxGridlb[i];
					var clsbdm = sbsjxxGridlbVo.clsbdm;
					//[减免税额1]为【数值】，[减免性质1]不能为空！
					if(sbsjxxGridlbVo.jmse>0 && (sbsjxxGridlbVo.ssjmxzDm==null || sbsjxxGridlbVo.ssjmxzDm=="")){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[减免税额1]为【"+ROUND(sbsjxxGridlbVo.jmse,2)+"】，[减免性质1]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.jmse2>0 && (sbsjxxGridlbVo.ssjmxzDm2==null || sbsjxxGridlbVo.ssjmxzDm2=="")){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[减免税额2]为【"+ROUND(sbsjxxGridlbVo.jmse2,2)+"】，[减免性质2]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2)>ROUND(sbsjxxGridlbVo.bnynse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[本年减免税额1]与[本年减免税额2]之和【"+(ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2))+"】应小于等于[本年应纳税额]【"+ROUND(sbsjxxGridlbVo.bnynse,2)+"】！</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(sbsjxxGridlbVo.bqynse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"[本期已缴税额]【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】应小于等于[本期应纳税额]【"+ROUND(sbsjxxGridlbVo.bqynse,2)+"】！</br>";
						t++;
					}
					//车船税征收品目[XX]，填写的预缴值【金额】，大于实际已预缴值【金额】，请修正！06100110010100047
					var bqyjse = 0;
					if(sbsjxxGridlbVo.zspmDm!=null &&sbsjxxGridlbVo.zspmDm!="" && formData.qcs.response1615.ccssbywbw!=null && formData.qcs.response1615.ccssbywbw.ccssbb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb.length>0){
						var sbsjxxGridlb15 = formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
						for(j=0;j<sbsjxxGridlb15.length;j++){
							var sbsjxxGridlb15Vo = sbsjxxGridlb15[j];
							if(sbsjxxGridlbVo.zspmDm==sbsjxxGridlb15Vo.zspmDm){
								bqyjse = sbsjxxGridlb15Vo.bqyjse;
								break;
							}
						}
					}
					if(bqyjse==null || bqyjse==""){
						bqyjse = 0;
					}
					if(ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(bqyjse,2)){
						tips = tips + t + ".车船识别代码 :"+clsbdm+"车船税征收品目["+pmJson[sbsjxxGridlbVo.zspmDm]+"]，填写的预缴值【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】，大于实际已预缴值【"+ROUND(bqyjse,2)+"】，请修正！</br>";
						t++;
					}
				}
			}
			var lxr = formData.ccssbywbw.ccssbb.sbbhead.lxr;//联系人不能为空
			if(lxr==null || lxr==""){
				tips = tips + t + ".[联系人]不能为空！";
				t++;
			}
			if(tips!=""){
				parent.layer.alert(tips, {title: "提示", icon: 5});
				$("body").unmask();
				prepareMakeFlag = true;
				return ;
			}
			var tip = true;
			// isSecondCall为true时，忽略进入下一步
			if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
				var regEvent = new RegEvent();
				tip = regEvent.verifyAllComfirm(prepareMake);
				if (!tip) {
					// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
					$("body").unmask();
					prepareMakeFlag = true;
					return;
				}
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));

		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		var xybNoTip = $("#xybNoTip").val();
	    if(xybNoTip != true && xybNoTip != "true" && !isJmsb()) {
	        layer.confirm('请确定是否提交申报，确定则提交，取消则返回申报表界面。', {
	            icon: -1, title: '提示',
	            btn2: function (index) {
	                $("body").unmask();
	                prepareMakeFlag = true;
	                layer.close(index);
	                return;
	            }
	            ,cancel: function(index, layero){
	                $("body").unmask();
	                prepareMakeFlag = true;
	                layer.close(index);
	                return;
	            }
	        }, function (index) {
	        	//提交表单
	    		submitForm(isSecondCall);
	            if (typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
	                $("body").mask("正在提交，请稍候...");
	            } else {
	                $("body").mask("正在处理，请稍候...");
	            }
	            
	            layer.close(index);
	        });
	    }else{
	        if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
	            $("body").mask("正在提交，请稍候...");
	        } else {
	            $("body").mask("正在处理，请稍候...");
	        }
	        //提交表单
			submitForm(isSecondCall);
	    }
	}

}


/**
 * 一般纳税人 选表设置链接
 */
function linkXbsz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsxbsz";
	}
	
		/*var url = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + "?gdslxDm="
		+ $("#gdslxDm").val()+ "&sssqQ=" + $("#sssqQ").val() 
		+ "&sssqZ=" + $("#sssqZ").val();
		// 不集成session的url，需要加些其他参数
		if (oldurl.indexOf("test=true") > -1) {
			url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
					+ "&test=true";
		}
		if(window.location.search.indexOf("gzsb=Y")>-1){
			url +="&gzsb=Y";
		}
		if(window.location.search.indexOf("gotoSbb=Y")>-1){
			url +="&gotoSbb=Y";
		}
		if(window.location.search.indexOf("gzsb=zx")>-1){
			url +="&gzsb=zx";
		}*/
	
		var url = location.protocol + "//" + location.host + window.contextPath + "/biz/setting/" + ywbm;
		url += window.location.search;
	
		top.location.href = url;
	}

	function redirectXbsz(){
		var action = $("#myform").attr("action");
		action = action.replace("make","xbsz");
		$("#myform").attr("action",action);
		$("#toXbsz").val("true");
		$("#toForm").val("false");
		$("#myform").submit();
	}

/**
 * 一般纳税人 期初数链接
 */
function jumpQcssz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsqcs";
	}
	if (sbywbm == "QYSDS_A") {
		ywbm = "qysdsjmaqcssz";
	}
	var url = location.protocol + "//" + location.host + window.contextPath
			+ "/biz/setting/" + ywbm + "?bzz=csgj&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val();
	// 不集成session的url，需要加些其他参数
	if (oldurl.indexOf("test=true") > -1) {
		url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
				+ "&test=true";
	}
	if(window.location.search.indexOf("gzsb=Y")>-1){
		url +="&gzsb=Y";
	}
	if(window.location.search.indexOf("gotoSbb=Y")>-1){
		url +="&gotoSbb=Y";
	}
	if(window.location.search.indexOf("gzsb=zx")>-1){
		url +="&gzsb=zx";
	}
	top.location.href = url;
}
	
//
function submitForm(isSecondCall){
	var signType = '';
	if(otherParams && otherParams.signType){
	//if(typeof otherParams.signType !== 'undefined'){
		signType = otherParams.signType;
	}
	if(signType === 'wzt' || signType === 'ocx' || signType === 'fjocx' || signType === 'bw' || signType === 'yunnan'){//容器框签名
		var ywylx,contextPath=$("#contextPath").val();
		if(contextPath&&contextPath.indexOf('sxsq')>-1){
			ywylx=contextPath.substring(1, contextPath.indexOf("-"));//业务类型
		}
		if(ywylx==='sxsq'&&$("#pageName").val()&&$("#pageName").val()==='show'){
			// 提交表单
			$("#myform").submit();
			// TODO 调用父页面的函数，则清空按钮区域
			parent.cleanMeunBtn();
		}else{
			//提交数据并且签名
			submitFormData(signType, isSecondCall);
		}
	}else{//确认页签名
		// 提交表单
		$("#myform").submit();
		// TODO 调用父页面的函数，则清空按钮区域
		parent.cleanMeunBtn();
}
}

//提交填报页数据报错到qqbw中
function submitFormData(signType, isSecondCall){
	var flag = true;
	var d = {};
	var t = $('#myform').serializeArray();
	$.each(t, function() {
		d[this.name ] = this.value;
	});
	
	
	var ywbm = $("#ywbm").val();
	var nssoywbm = $("#nssoYwbm").val();
	
	var svaeUrl = "/save/saveYsqbw.do";
	//过滤业务类型,提供给登陆前业务暂存
	if(ywbm!=null&&nssoywbm!=null&&ywbm!=""&&nssoywbm!=""&&ywbm!=undefined&&nssoywbm!=undefined){
		if(nssoywbm.toUpperCase().indexOf(ywbm.toUpperCase()) > -1){
			svaeUrl = "/savenosso/saveYsqbw.do";
		}
	}
	$.ajax({
		type : "POST",
		async : true,
		url : window.contextPath + svaeUrl,
		data : d,
		dataType : "json",
		success : function(data) {
			var returnFlag = data.returnFlag;
			var viewOrDownload = data.viewOrDownload;
			if('view'!==viewOrDownload){
				viewOrDownload = 'download';
			}
		    if(returnFlag==='N'){
		    	var returnType = data.returnType;
		    	var errMsg = data.errMsg;
		    	if(returnType&&returnType==='refresh'){
		    		parent.layer.confirm(errMsg,{
	            		icon : 1,
	            		title:'提示',
	            		btn2noclose:1,
	            		btn : ["是","否"]
	            	},function(index){
	            		parent.layer.close(index);
	            		window.location.reload();
	            	});
		    		return;
		    	}
		    	parent.layer.alert(errMsg, {title: "填表页报文保存异常", icon: 5});
		    	parent.layer.close(index);
				$("body").unmask();
				prepareMakeFlag = true;
			} else {
				//isSecondCall为1时表示直接进行申报，不需要进行弹框签名
				if("undefined" !== typeof isSecondCall && isSecondCall === 1){
					// 提交表单
					$("#myform").submit();
					// 调用父页面的函数，则清空按钮区域
					parent.cleanMeunBtn();
					return;
				}
				if(isJmsb()){
					submitPdf();
				}else if (signType === 'bw') {
					bwSign();
				}else {
					var zjTiket = data.zjTiket;
					if (signType === 'wzt') {
						clientSign(zjTiket, viewOrDownload);
					} else if (signType === 'ocx') {
						pluginSign(zjTiket, viewOrDownload);
					} else if (signType === 'fjocx') {
						fjpluginSign(zjTiket, viewOrDownload);
					}else if (signType === 'yunnan') {
						ynclientSign(zjTiket, viewOrDownload);
					}
				}
			}
		},
		error : function(aa) {
			window.parent.layer.open({
        		type:1,
        		area:['840px','420px'],
        		content:aa.responseText
        	});
		}
	});
}

//TODO 提交申报(上一步已经保存了填报页数据，此时只需要申报提交即可)
function submitPdf(qzbz){
	var href = parent.window.location.href;
    if (href.indexOf("?") > -1) {
        href = href.substr(0, href.indexOf("?"));
    }
    if (href.indexOf(";") > -1) {
        href = href.substr(0, href.indexOf(";"));
    }
    //添加异步提交对应的标志
    var asyncSubmit = $("#myform").find("#asyncSubmit").val();
    
    var url = href + "/make?_bizReq_path_=" + $("#_bizReq_path_").val()
	    + "&_query_string_=" + encodeURIComponent($("#_query_string_").val())
	    + "&ysqxxid=" + $("#ysqxxid").val()
		+ "&_re_contextpath_=" + $("#contextPath").val()
        + "&qzbz="+qzbz + (!"Y" == asyncSubmit ? "" : ("&asyncSubmit=" + asyncSubmit));
    $("#frmMain", window.parent.document).attr("src",url);
    window.parent.hideFrameHead();
}


//a 旧对象。b 新对象。把b对象copy到a对象上，返回。
function deepcopy(a,b) {
  var _clone = isArray(a)?[]:{};
  var i=0,
  _arg=arguments,_co='',len=_arg.length;
  if(!_arg[1]){
      _clone=this;
  };
  for(;i<len;i++){
      _co = _arg[i];
      for(var name in _co){
    	  if(!isEmpty(_clone[name]) && isEmpty(_co[name])){
    		  continue;
    	  }
          //深度拷贝
          if( typeof _co[name] === 'object'){
          	if(_clone[name] == undefined || isArray(_co[name]) != isArray(_clone[name]) || _clone[name].constructor.name !== _co[name].constructor.name )
          		_clone[name] = isArray(_co[name])?[]:{};
          	 _clone[name] = deepcopy(_clone[name],_co[name]);
          }else{
              _clone[name] = _co[name];
          }
      }
  }

  return _clone;
};

function isEmpty(_o){
	if(_o == undefined){
		return true;
	}
	if(typeof _o === "string"){
		return _o == '';
	}
	if(typeof _o === "object"){
		return JSON.stringify(_o) == "{}" || _o.length == 0; 
	}
	if(_o.constructor === Array){
		return _0.length == 0;
	}
}

function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}

// 个人所得税自行申报A 下一步 校验核算机关方法
function prepareMakeGrsdszxsbA(isSecondCall) {
	var frame = window;
	if(formData.grsdszxsbAb.head.zxsbqxDm.indexOf('0') == -1){
		prepareMake(isSecondCall);
		return ;
	}
	if(formData.grsdszxsbAb.head.slswjgDm == null || formData.grsdszxsbAb.head.slswjgDm == ''){
		parent.layer.alert("[受理税务机关]不能为空！", {title: "提示", icon: 5});
		return ;
	}
	formData.grsdszxsbAb.head.slswjgMc = formData.grsdszxsbAb.head.slswjgMc.split("|")[0].trim();
	var flag = false;    //核算机关代码校验是否通过标志
	
	//根据受理税务机关查询核算机关
	var gdslxDm = formData.qcs.initData.nsrjbxx.gdslxDm;
	var params = {};
	params.slswjgDm = formData.grsdszxsbAb.head.slswjgDm;
	params.gdslxDm = gdslxDm;
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	$.ajax({
		type: "POST",
		url: mainUrl+"/nssb/grsdszxsbA/getHsjgxx.do",
		data:JSON.stringify(params),
		dataType : "json",
		contentType:"application/json",
		success : function(data) {
			if(data != null && data != ""){
				var hsjgDmGridlb = data.taxML.hsjgDmGrid.hsjgDmGridlb;
				if(hsjgDmGridlb.length>1){
					for(var i=0;i<hsjgDmGridlb.length;i++){
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i] = {};
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i].gljgDm = hsjgDmGridlb[i].gljgDm;
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i].hsjgDm = hsjgDmGridlb[i].hsjgDm;
					}
				}else{
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0] = {};
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0].gljgDm = hsjgDmGridlb.gljgDm;
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0].hsjgDm = hsjgDmGridlb.hsjgDm;
				}
				if(formData.qcs.hsjgDmGrid.hsjgDmGridlb.length == 0) {
					parent.layer.alert("您选择的受理税务机关所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
					return ;
				}
				
				var length = formData.qcs.grsdszxsbAbMx1.length;
				if(length > 0) {
					// 遍历主表识别号得到的核算机关代码，每个识别号可能得到多个核算机关
					for(var i=0;i<length;i++){
						if(formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx != undefined && formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx != null && formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx.length>0){
							for(var k = 0;k<formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx.length;k++){
								var hsjgDm = formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx[k].hsjgDm;
								
								for(var j=0;j<formData.qcs.hsjgDmGrid.hsjgDmGridlb.length;j++){
									if(hsjgDm == formData.qcs.hsjgDmGrid.hsjgDmGridlb[j].hsjgDm){
										flag = true;
										break;
									}
								}
							}
						}
					}
					if(flag){
						prepareMake(isSecondCall);
					} else{// 判断是否来源山东——您的主管税务机关和您收入所在企业的主管税务机关所在区域不一致，请联系税管员处理！
						parent.layer.alert("您选择的受理税务机关和您收入所在企业的主管税务机关所在区域不一致，请联系税管员处理！", {title: "提示", icon: 5});
						return ;
					}
				} else{
					parent.layer.alert("您填写的任职受雇单位所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
					return ;
				}
			}else{
				parent.layer.alert("您选择的受理税务机关所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
				return;
			}
		},
		error : function(data) {
			parent.parent.layer.closeAll('loading');
			layer.alert('查询不到受理税务机关所属核算机关信息，请稍后再试.', {icon: 5});
		}
	});
}

/**个人所得税年12万以上申报下一步*/
function grsdsN12WPrepareMake(isSecondCall){
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
	
			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));
	
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		prepareMakeFlag = true;
		$("body").unmask("");
		if(!isJmsb()){
			parent.layer.confirm(
				'我声明，此纳税申报表是根据《中华人民共和国个人所得税法》及有关法律、法规的规定填报的，我保证它是真实的、可靠的、完整的。',
				{
					icon : 3,
					title : '信息',
					btn : ['确定']
				},function(index) {
					parent.layer.close(index);
					$("body").mask("校验数据中，请稍候...");
					submitForm(isSecondCall);// 提交表单
				});
		}
	}
}

/**水资源税税源采集保存*/
function szyssycjSave(){
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
	
			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));
	
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		prepareMakeFlag = true;
		$("body").unmask("");
		$(top.document).find("body").mask("正在保存数据，请稍候...");
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var rtnJson = {};
		var params = {};
		params.djxh = $("#djxh").val();
		params.nsrsbh = formData.qcs.initData.nsrjbxx.nsrsbh;
		params.gdslxDm = $("#gdslxDm").val();
		var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
		params.swjgDm = swjgDm;
		params.formData = formData;
		//Excel文件解析
		$.ajax({
			type: "POST",
	 		url: mainUrl+"/nssb/szys/szyssycjSave.do",
	 		dataType:"json",      
	        contentType:"application/json",
	        data:JSON.stringify(params),
	        success:function(data){
	 			if (data!=undefined&&data!=null&&data!='') {
	 				//保存成功后需要刷新页面，将新增加或者修改刷新到qcs的税源信息中
	 				var newSzyssybxxGridlb = {};
	 				var DJSzyssyxxVO = formData.DJSzyssyxxVO;
	 				var lbIndex = 0;//通过数组下标修改或者新增加期初数的税源信息,新增时下标刚好是数组的长度
	 				if(formData.qcs.szyssybxxGrid.szyssybxxGridlb!=null &&  formData.qcs.szyssybxxGrid.szyssybxxGridlb!=undefined){
	 					lbIndex = formData.qcs.szyssybxxGrid.szyssybxxGridlb.length;
	 				}else{
	 					var szyssybxxGridlb = new Array();
	 					formData.qcs.szyssybxxGrid = {};
	 					formData.qcs.szyssybxxGrid.szyssybxxGridlb = szyssybxxGridlb;
	 				}
	 				var isAdd = "Y";
	 				if(DJSzyssyxxVO.szysybh==null || DJSzyssyxxVO.szysybh=='' || data!=DJSzyssyxxVO.szysybh){
	 					//新增
	 					formData.DJSzyssyxxVO.szysybh = data;
	 					formData.DJSzyssyxxVO.bgrq = formData.qcs.initData.rqxx.tbrq;
	 					parent.layer.alert("保存成功，税源编号为："+data);
	 				}else{
	 					isAdd = "N";
	 					parent.layer.alert("保存成功，税源信息已变更");
	 					//修改
	 					for(i=0;i<formData.qcs.szyssybxxGrid.szyssybxxGridlb.length;i++){
	 						var szyssybxxGrid = formData.qcs.szyssybxxGrid.szyssybxxGridlb[i];
	 						if(szyssybxxGrid.szysybh == data){
	 							//等于返回结果的税源编号，则是修改了这个税源信息
	 							lbIndex = i;
	 							break ;
	 						}
	 					}
	 				}
	 				newSzyssybxxGridlb.zgswjDm = DJSzyssyxxVO.zgswj_dm;
					newSzyssybxxGridlb.nqysjhDbs = DJSzyssyxxVO.nqysjhdbs;
					newSzyssybxxGridlb.tsyslbjhDm = DJSzyssyxxVO.tsyslbjh_dm;
					newSzyssybxxGridlb.qslhzjgxzjbDm = DJSzyssyxxVO.qslhzjgxzjb_dm;
					newSzyssybxxGridlb.jdxzDm = DJSzyssyxxVO.jdxz_dm;
					newSzyssybxxGridlb.qsxkspjg = DJSzyssyxxVO.qsxkspjg;
					newSzyssybxxGridlb.djxh = DJSzyssyxxVO.djxh;
					newSzyssybxxGridlb.qsyxqz = DJSzyssyxxVO.qsyxqz;
					newSzyssybxxGridlb.szysybh = data;
					newSzyssybxxGridlb.flzlMc = DJSzyssyxxVO.flzlmc;
					newSzyssybxxGridlb.qsyxqq = DJSzyssyxxVO.qsyxqq;
					newSzyssybxxGridlb.lrrq = DJSzyssyxxVO.lrrq;
					newSzyssybxxGridlb.sysedcDm = DJSzyssyxxVO.sysedc_dm;
					newSzyssybxxGridlb.gsgwfgBz = DJSzyssyxxVO.gsgwfgbz;
					newSzyssybxxGridlb.bgrq = formData.qcs.initData.rqxx.tbrq;
					newSzyssybxxGridlb.dxsccgsqDm = DJSzyssyxxVO.dxsccgsq_dm;
					newSzyssybxxGridlb.sjgsdq = DJSzyssyxxVO.sjgsdq;
					newSzyssybxxGridlb.qslhzjg = DJSzyssyxxVO.qslhzjg;
					newSzyssybxxGridlb.zgswskfjDm = DJSzyssyxxVO.zgswskfj_dm;
					newSzyssybxxGridlb.xzqhszDm = DJSzyssyxxVO.xzqhsz_dm;
					newSzyssybxxGridlb.nqysjhDxs = DJSzyssyxxVO.nqysjhdxs;
					newSzyssybxxGridlb.sylxjhDm = DJSzyssyxxVO.sylxjh_dm;
					newSzyssybxxGridlb.uuid = DJSzyssyxxVO.uuid;
					newSzyssybxxGridlb.qskdz = DJSzyssyxxVO.qskdz;
					newSzyssybxxGridlb.qyshylbDm = DJSzyssyxxVO.qyshylb_dm;
					newSzyssybxxGridlb.qsxkzh = DJSzyssyxxVO.qsxkzh;
					newSzyssybxxGridlb.qsxkzBz = DJSzyssyxxVO.qsxkzbz;
	 				formData.qcs.szyssybxxGrid.szyssybxxGridlb[lbIndex] = newSzyssybxxGridlb;
	 				$(top.document).find("body").unmask();
	 				var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
					var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
					var body = $("#frmSheet")[0].contentWindow.document.body;
					// 3、刷新校验结果和控制结果
					formCT["szysyxxCT"] = formData.qcs.szyssybxxGrid.szyssybxxGridlb;
					viewEngine.formApply($viewAppElement);
					viewEngine.tipsForVerify(body);
					var sel = $("#frmSheet").contents().find("#szysybh")[0];
					for(i=0;i<sel.options.length;i++){
					   var s = sel.options[i];
					   if(DJSzyssyxxVO.szysybh===s.label.trim()){
					     s.selected=true;
					   }
					}
	 			}else{
	 				parent.layer.alert('保存失败，请联系管理员排查原因！', {title:"提示",icon: 5});
		 			$(top.document).find("body").unmask();
	 			}
	 		},
	 		error:function(data){
	 			parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
	 			$(top.document).find("body").unmask();
	 		}
		
		});
	}
}




/**
 * 土地增值税二下一步按钮
 * URL不传属期，填表页属期在选择项目编号之后变动
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeTdzzs2(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.dzzsqssbywbw.tdzzsqssbb.tdzzsqssbzb.nsrxxForm.skssqq;
	var skssqz = formData.dzzsqssbywbw.tdzzsqssbb.tdzzsqssbzb.nsrxxForm.skssqz;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
}
/**
 * 土地增值税四下一步按钮
 * URL不传属期，填表页属期在选择项目编号之后变动
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeTdzzs4(isSecondCall) {
    var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
    var tempData = eval('('+tempParems+')');
    var skssqq = formData.tdzzssbcsfdcqshwpxssyywbw.tdzzssbcsfdcqshwpxssy.tdzzssbcsfdcqshwpxssybd.nsrxxForm.skssqq;
    var skssqz = formData.tdzzssbcsfdcqshwpxssyywbw.tdzzssbcsfdcqshwpxssy.tdzzssbcsfdcqshwpxssybd.nsrxxForm.skssqz;
    tempData.sssqQ = skssqq;
    tempData.sssqZ = skssqz;
    tempParems = JSON.stringify(tempData);
    tempParems = tempParems.substring(1,tempParems.length-1);
    $("#myform").find("input[id='_query_string_']").val(tempParems);
    $("#myform").find("input[id='sssqQ']").val(skssqq);
    $("#myform").find("input[id='sssqZ']").val(skssqz);
    prepareMake(isSecondCall);
}


/**
 * 土地增值税5下一步按钮
 * URL不传属期，填表页属期在选择项目编号之后变动
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeTdzzs5(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.tdzzsqshdzsywbw.tdzzsqshdzs.tdzzsqshdzzbd.nsrxxForm.skssqq;
	var skssqz = formData.tdzzsqshdzsywbw.tdzzsqshdzs.tdzzsqshdzzbd.nsrxxForm.skssqz;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
}

/**
 * 申报要素数据导入
 */
function sbysDataImport(){
	// 调用iframe里面的方法
	var sbysdrym = $(window.parent.document).find("#sbysdrym")[0].contentWindow;
	// 第一步判断是否存在nsrsbh zlbsxlDm 如果没有则提示
	var resultBz = sbysdrym.jyParam();
	if(resultBz==false){
		parent.layer.alert("缺少相关查询参数，请联系管理员分析！", {title:"提示",icon: 2});
		return ;
	}
	// 如果有数据则发起请求，如果没有返回数据或者查询出错则提示，有返回数据则显示
	var result = sbysdrym.getYssbXxList();
	// 如果等于undefined说明报错了，流程终止
	if(result.code == undefined){
		return ;
	}
	if(result.code == "0" && result.size == 0){
		parent.layer.alert("系统未能获取您在财务软件中的相关财报报盘文件，请您查看在财务软件中是否上传成功，如有疑问，请联系您的财务厂商！", {title:"提示",icon: 2});
		return ;
	} else if(result.code == "9"){
		parent.layer.alert(result.msg, {title:"提示",icon: 2});
		return ;
	} else {
		sbysdrym.getModelData(result);
		// 显示弹窗
		var $myModa5 = $(window.parent.document).find("#myModa5");
		index = index + 1
		// 添加遮罩层
		var boxbg = "<div class='winbox_bg'></div>";
		var $b = $(window.parent.document).find("body");
		$b.append(boxbg);
		var $winbox_bg = $(window.parent.document).find(".winbox_bg");
		$winbox_bg.last().css({
			"z-index" : index
		});
		$winbox_bg.animate({
			opacity : 0.3
		});
		$myModa5.css({
			"z-index" : index + 1,
			"position" : "absolute",
			"left" : "210px",
			"top" : "-100px"
		}).show().animate({
			top : "10%",
			opacity : "1"
		}, 300);
	}
}
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.parent.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]);return null;
}
/**
 * 调起青岛的exe应用，并轮询后台获取数据，轮询总时长控制轮询的次数
 * */
function sbysDataImport2(){
	var loadIndex = pop03();
	// 显示弹窗
	var $openExe = $(window.parent.document).find("#openExe");

	//定时器超时时间，即总执行最长时间。默认60秒
	var timeouts = 60*1000;
	//每隔N秒执行一次，默认2秒
	var mcjg = 2*1000;
	//记录总执行次数，用于计算定时任务执行的总时长
	var totalTime  = 0;
	//取数前服务器的时间
	var newestTime = 0;
	//定义定时器要执行的function
	var checkData = function(){
		totalTime++;
		var result = {};
		//记录当前录入日期的数据的yssbid
		var newYssbId = null;
		var qsbz = "";//取数是否成功标志，cg：成功、sb：失败
		var errorMsg = "";//记录取数失败原因
		// 调用iframe里面的方法
		var sbysdrym = $(window.parent.document).find("#sbysdrym")[0].contentWindow;
		// 第一步判断是否存在nsrsbh zlbsxlDm 如果没有则提示
		var resultBz = sbysdrym.jyParam();
		if(resultBz==false){
			console.log("缺少相关查询参数", resultBz, totalTime);
		}else{
			// 如果有数据则发起请求，如果没有返回数据或者查询出错则提示，有返回数据则显示
			result = sbysdrym.getYssbXxList(false);
			if((result.code == "0" && result.size == 0) || result.code == "9"){
				console.log("result", result, totalTime);
			}else{
				//遍历本地mongo库取数数据，获取大于取数操作时间的那条
				var datas = result.datas;
				for(var i=0; i<datas.length; i++){
					var temp = datas[i];
					//如果成立，表示这条数据更 新
					if(newestTime < temp.lrrq || newestTime < temp.xgrq){
						if (temp.errorCode == 0 || temp.errorCode == "0" || temp.errorCode == "0.0") {
							//取数成功，记录相关信息
							newestTime = temp.lrrq;
							newYssbId  = temp.yssbid;
							qsbz = "cg";
						}else {
							qsbz = "sb";
							errorMsg = temp.errorMsg;
						}
						break;
					}
				}
			}
		}
		//轮询总时长不够
		if(totalTime  <= timeouts/mcjg){
			//没有取数成功
			if(qsbz == ""){
				//进入下一次定时轮询
				setTimeout(checkData, mcjg);
			}else {
				if (qsbz == "cg") {
					//给iframe弹窗赋值，准备进行渲染界面
					sbysdrym.getModelData(result);
					//需要使用定时器去提交数据，因为iframe界面的angelarJS渲染需要一定的时间
					setTimeout(function(){
						$("#sbysdrym").contents().find("#"+newYssbId).prop("checked",true);
						var res = sbysdrym.ImportBtn(false);
						//去掉load层
						parent.layer.close(loadIndex);
						switch (res.code) {
							case -2:
								parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
								break;
							case -1:
								parent.layer.alert('取数失败，请稍后再试！', {title:"提示",icon: 2});
								break;
							case 0:
								parent.layer.alert("取数成功！", {title:"提示",icon: 1});
								break;
							case 1:
								parent.layer.alert(res.msg, {title:"提示",icon: 2});
								break;
						}
					}, 1000);
				} else {
					parent.layer.close(loadIndex);
					parent.layer.alert(errorMsg, {title:"提示",icon: 0});
				}
			}
		}else{
			//去掉load层
			parent.layer.close(loadIndex);
			parent.layer.alert('取数失败，请稍后再试！', {title:"提示",icon: 2});
		}
	};

	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	$.ajax({
		type: "POST",
		url: mainUrl+"/nssb/cwbb/getInfoOrgId.do",
 		dataType:"json",
        contentType:"application/json",
        success:function(data){
			var jsonData = JSON.parse(data);

			//验证【客户-账套连接】状态：true：验证通过、false：验证失败
			if (!verifyTZConnect(jsonData.jbxx, loadIndex)) {
				return;
			}

			//获取服务器的时间
			newestTime = jsonData.newestTime;
			//调用框架提供的方法，重置
        	formEngine.reInitDataAndExecuteFormulas();
        	console.log("/nssb/cwbb/getInfoOrgId.do", data);
        	console.log("/nssb/cwbb/getInfoOrgId.do>JSON.parse", JSON.parse(data));
        	var cwbbdsq = null;
        	if(jsonData.cwbbdsq != null && jsonData.cwbbdsq != "" && jsonData.cwbbdsq != "null"){
        		cwbbdsq = JSON.parse(jsonData.cwbbdsq);
        	}
        	//{"timeouts":600000,"mcjg":2000}
        	if(null != cwbbdsq){
        		if(cwbbdsq.timeouts != null && cwbbdsq.timeouts != 'null' && cwbbdsq.timeouts != 0 && cwbbdsq.timeouts != '0'){
        			timeouts = cwbbdsq.timeouts;
        		}
        		if(cwbbdsq.mcjg != null && cwbbdsq.mcjg != 'null' && cwbbdsq.mcjg != 0 && cwbbdsq.mcjg != '0'){
        			mcjg = cwbbdsq.mcjg;
        		}
        	}
        	var tjNd = GetQueryString("tjNd");
        	var tjYf = GetQueryString("tjYf");
        	var onlineTallyBz = true;
        	if (jsonData.jbxx.ztljzt == 'true' && jsonData.jbxx.bbszzt == 'true') {
				$openExe.prop("src", 'Foresees://EtlParams:{"AppID":"BB","FuncID":"GetBalance","ConID":"DT","orgID":"' + jsonData.orgId + '","year":' + tjNd + ',"period":' + tjYf + '}');
			}else if (jsonData.jbxx.ztzt == '001' &&  jsonData.jbxx.bbszzt == 'true') {
				//调北京xdk方法取数
				onlineTallyBz = onlineTally(jsonData.jbxx);
			}
        	if (onlineTallyBz) {
				//隔2s执行
				setTimeout(checkData, mcjg);
			}else {
				parent.layer.close(loadIndex);
				parent.layer.alert('取数失败，请稍后再试！', {title:"提示",icon: 2});
			}
 		},error:function(data){
			parent.layer.alert('发生服务异常！请联系管理员。', {title:"提示",icon: 5});
			parent.layer.close(loadIndex);
 		}
	});
}

/**
 * 验证【客户-账套连接】状态
 */
function verifyTZConnect(jbxx, loadIndex) {
	var bool = true;
	if (jbxx.ztljzt != 'true' && jbxx.ztzt != '001') {
		bool = false;
		parent.layer.close(loadIndex);
		parent.layer.alert("未连接财务软件，请进入【客户-账套管理】连接后再操作！", {title: "提示", icon: 0});
	}
	if (jbxx.bbszzt != 'true') {
		bool = false;
		parent.layer.close(loadIndex);
		parent.layer.alert("未进行报表设置，请进入【客户-账套连接】设置后再操作！", {title: "提示", icon: 0});
	}
	return bool;
}

/**
 * 在线记账调北京xdk方法
 * @param jbxx
 * @returns {boolean} true：调用成功、false：调用失败
 */
function onlineTally(jbxx){
	var result = false;
	var item = {};
	item['tzId'] = jbxx.tzId;
	item['sid'] = "/openapi/xdz/saveAccountBalanceFromTTK";
	item['khdjxh'] = jbxx.djxh;
	item['nsrsbh'] = jbxx.nsrsbh;
	item['zgswjgDm'] = jbxx.swjgdm;
	item['tjNd'] = GetQueryString("tjNd");
	item['tjYf'] = GetQueryString("tjYf");
	var webName = location.pathname.substring(1).substring(0,location.pathname.substring(1).indexOf('/'));
	$.ajax({
		url: "/" + webName + "/nssb/cwbb/onlineTally.do",
		type: "get",
		data: {"item": JSON.stringify(item)},
		dataType: "json",
		contentType: "application/json",
		async: false,
		success: function(data) {
			var _data = JSON.parse(data);
			console.log("onlineTally.do接口结果：" + _data);
			if(_data.rtnCode == "0000"){
				result = true;
			}
		},
		error:function(){
			layer.alert('链接超时或服务异常!', {icon: 5});
		}
	});
	return result;
}

/**
 * 云上-财报自定义loading层
 * zhuyanfeng 2019-06-13
 * */
function pop03(){
	var html = '<div class="win-center"id="pop-03"style="margin-top: 16px;"><div class="loading-info-02"><div class="icon"><img src="/sbzs-cjpt-web/resources4/tax-images/ttk/loading.png"></div><p style="width: 100%">数据上传中，请稍等...</p></div></div>';
	var popIndex = parent.layer.open({
		type: 1,
		area: ['300px'],
		title: false, //不显示标题栏	
		closeBtn: false,
		scrollbar: false,
		shade:  [0.6, '#fff'],
		pop01: 'auto',
		id: 'layerDemoauto',
		content: html,
		yes: function(){
			parent.layer.closeAll();
		},
		btn2: function(index, layero){
		}
	});	
	//重新定义弹出窗的样式
	parent.layer.style(popIndex, {
		'background': 'rgba(0,0,0,0)',
    	'box-shadow': '0px 0px 10px rgba(0,0,0,0)'
	}); 
	return popIndex;
}




/**
 * 代收代缴车船税申报
 * 不用URL的属期，使用导入模板中的属期
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeDsdjccs(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.qcs.initData.dkdjdsdjInitData.mbSssqQ;
	var skssqz = formData.qcs.initData.dkdjdsdjInitData.mbSssqZ;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
	
}

/**
 * 小规模发票汇总
 */
function showXgmFphz() {
	if(typeof(xgmFphzCallback) === 'function'){
		xgmFphzCallback();
	}
}
/**
 * 小规模一表集成切换电局版本
 */
function gotoXgmzzs() {
	if(!isJmsb()){
		var msg = '您目前使用的是发票导入申报表模式填报，【切换电局版本】为不导入发票数据手动填写申报表模式，请确认是否继续？';
		parent.layer.confirm(msg,{
			icon: 3,
			title: '提示',
			btn: [ '确定', '取消' ],
			btn1 :function(index) {
				var url = parent.window.location.href;
				if (url.indexOf('&ybsb=Y')) {
					url = url.replace('&ybsb=Y', '');
				}
				
				if (url.indexOf('ybsb=Y&')) {
					url = url.replace('ybsb=Y&', '');
				}
				
				parent.window.location.href = url;
			}
		});
	}
}

function redirectFphzPage(){
	$("body").mask("处理中，请稍候...");
	parent.flagDataLoaded = false;
	var action = $("#myform").attr("action");
	action = action.replace("make","wbsj");
	$("#myform").attr("action",action);
	$("#_query_string_").val("");
	$("#toWbsj").val("true");
	$("#toXbsz").val("false");
	$("#toForm").val("false");
    $("#myform").submit();
	// 调用父页面的函数，清空按钮区域
	parent.cleanMeunBtn();
}

/**
 * 财务报表申报表页面跳转到财务报表转换页面
 * */
function cwbbCbzh(){
	var mainUrl = window.location.protocol+"//"+window.location.host;
	var DZSWJ_TGC = "";
	try{
		DZSWJ_TGC = parent.window.frames["fzzlFrame"].contentWindow.DZSWJ_TGC;
	}catch(e){
		DZSWJ_TGC = parent.window.frames["fzzlFrame"].DZSWJ_TGC;
	}
	var cbzhUrl = mainUrl+"/v1/sso.html"+window.location.search+"&source=A99&DZSWJ_TGC="+DZSWJ_TGC;
	if(cbzhUrl.indexOf("&yhid=")>-1){
		//将yhid替换成null
		cbzhUrl = changeUrlArg(cbzhUrl, "yhid", "null");
	}
	if(cbzhUrl.indexOf("&yhm=")>-1){
		//将yhm替换成null
		cbzhUrl = changeUrlArg(cbzhUrl, "yhm", "null");
	}
	//小类代码
	var zlbsxlDm = formData.SB100VO.SB100BdxxVO.zlbsxlDm;
	if(zlbsxlDm!=undefined && zlbsxlDm!=null && zlbsxlDm!=""){
		if(cbzhUrl.indexOf("zlbsxlDm=")>-1){
			cbzhUrl = changeUrlArg(cbzhUrl, "zlbsxlDm", zlbsxlDm);
		}else{
			cbzhUrl = cbzhUrl + "&zlbsxlDm=" + zlbsxlDm;
		}
	}
	//企业会计制度代码
	var kjzdzzDm = formData.qcs.kjzdzzDm;
	if(kjzdzzDm!=undefined && kjzdzzDm!=null && kjzdzzDm!=""){
		if(cbzhUrl.indexOf("kjzdzzDm=")>-1){
			cbzhUrl = changeUrlArg(cbzhUrl, "kjzdzzDm", kjzdzzDm);
		}else{
			cbzhUrl = cbzhUrl + "&kjzdzzDm=" + kjzdzzDm;
		}
	}
	parent.window.open(cbzhUrl,"_self");
}

function changeUrlArg(url, arg, val) {
	var pattern = arg + '=([^&]*)';
	var replaceText = arg + '=' + val;
	return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
}

function getSwjgDm(formData){
	var swjgDm = null;
	if(formData.qcs == undefined && formData.fq_ != undefined){
		swjgDm = formData.fq_.nsrjbxx.swjgDm;
	}else{
		swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
	}
	return swjgDm;
}

/**
 * 填表页操作规程按钮
 */
function showCzgc() {
	// layer弹窗提示url
	var zyywnWebContextPath = $("#zyywnWebContextPath").val();
	if(zyywnWebContextPath === null || typeof zyywnWebContextPath === 'undefined'){
		zyywnWebContextPath = "/zyywn-cjpt-web";
	}
	layer.open({
		type : 2,
		title : '操作规程',
		shadeClose : true,
		shade : 0.8,
		area : [ '800px', '70%' ],
		content : zyywnWebContextPath + '/czgc/queryWSDataList.do?ywbm=' + ywbm.toUpperCase()
	}); 
}
// menuBtnEvent.js在frmMain引入，所以此document指frmMain，监听frmMain的键盘事件
$(document).on("keydown", function(event) {
	if (event.keyCode === 112 || event.keyCode === 173) {
		showCzgc();
	}
});
// 监听父页面index.jsp，页眉按钮部分
$("body", parent.document).on("keydown", function(event) {
	if (event.keyCode === 112 || event.keyCode === 173) {
		showCzgc();
	}
});
// 监听frmSheet 右侧表单部分
$("#frmSheet").on("load", function(event) {
	$("body", this.contentDocument).on("keydown", function(event) {
		if (event.keyCode === 112 || event.keyCode === 173) {
			showCzgc();
		}
	});
});

function isJmsb() {
	var href = window.location.href;
	var pahref = parent.window.location.href;
	if (href.indexOf("jmsbId") > -1 || pahref.indexOf("jmsbId") > -1) {
       return true;
    }
	return false;
}

/***
 * 云上电局申报之前进行监控(一般纳税人，增值税，小规模。。。)
 * @param before 提前标志
 * @param after 逾期标志
 * @param value
 */
function prepareMakeMonitor(before, after, value) {
	var monitor = value;
	if (isEmpty(value)) {
		monitor = getQueryVariable("monitor");
	}
	if (before) {
		if (monitor == "1") {
			parent.layer.alert('当前税款属期未到申报征期，暂无法申报！', {title: "提示", icon: 5});
			return;
		}
	}
	if (after) {
		if (monitor == "2") {
			parent.layer.alert('当前税款属期已超出申报期限，不支持逾期申报！', {title: "提示", icon: 5});
			return;
		}
	}
	prepareMake();
}

/***
 * 云上电局申报之前进行监控(一般纳税人，增值税，小规模。。。)
 * 获取url参数(url匹配其他调用可能会出错)
 */
function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	if(query == ""){
		query = parent.window.location.search.substring(1);
	}
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}