window.onload = initVaild();

function initVaild(){	
	deleteVaild();
}

function extMethods(mathFlag, newData, olddata, scope) {
	// 保存信息时需要判断
	var addOrUpdateFlag = "";
	var updateIndex = 0;
	// 新增明细信息
	if ("addMxxx" == mathFlag) {
		addMxxx(scope);
	}	
	// 修改明细信息
	if ("updateMxxx" == mathFlag) {
		updateMxxx(newData,scope);
	}
	// 保存明细信息
	if ("save" == mathFlag) {
		save(scope);
	}
	// 关闭明细信息
	if ("closeWinbox" == mathFlag) {
		closeWinbox(scope);
	}
	// 设置代码名称用于PDF
	if ("setMc" == mathFlag) {
		setMc(newData);
	}
}

function addMxxx(scope) {
	addOrUpdateFlag = "add";
	$("#tableHead")[0].innerHTML="居民企业参股外国企业信息报告表--新增";
	// 创建空对象
	newObject(scope);	
	// 刷新公式
	flushVaild();
	// 显示弹窗
	$("#mxxx")[0].style.display = "";
}

function updateMxxx(index,scope) {
	addOrUpdateFlag = "update";
	updateIndex = index;
	$("#tableHead")[0].innerHTML="居民企业参股外国企业信息报告表--修改";
	// 根据下标替换mxxx
	replaceMxxx(index,scope);
	// 刷新公式
	flushVaild();
	// 显示弹窗
	$("#mxxx")[0].style.display = "";
}

function save(scope) {
	
	// 保存到对应附表并移除临时节点
	var tip = parent.regEvent.verifySingleForm("ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0]");
	if (tip) {
		if(isNull(parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwmc)){
			parent.layer.alert("外国企业名称（中文）不能为空！",{icon : 5});
		}else{
			parent.layer.confirm("保存成功！",{icon : 6},
					function(index) {
						if (addOrUpdateFlag == "add") {							
							parent.formData.kz.temp.cgwgqyxxbgbVO.push(angular.copy(parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0]));
							if(isNull(parent.formData.kz.temp.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwmc)){
								parent.formData.kz.temp.cgwgqyxxbgbVO.splice(0,1);
							}
						} else if (addOrUpdateFlag == "update") {
							angular.copy(parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0],parent.formData.kz.temp.cgwgqyxxbgbVO[updateIndex]);
						}
						// 标志置空
						addOrUpdateFlag = "";
						updateIndex = 0;
						newObject(scope);
						// 刷新公式
						flushVaild();
						// 关闭弹窗
						$("#mxxx")[0].style.display = "none";
						parent.layer.close(index);
					});
		}
		
	}
}

function closeWinbox(scope) {
	// 标志置空
	addOrUpdateFlag = "";
	updateIndex = 0;
	newObject(scope);
	// 刷新公式
	flushVaild();	
	// 关闭弹窗
	$("#mxxx")[0].style.display = "none";
}

function newObject(scope) {	
	angular.copy(parent.formData.kz.temp.xxbgbVO.wgqyxxForm,scope.wgqyxxForm);
	angular.copy(parent.formData.kz.temp.xxbgbVO.czgfxxGrid.czgfxxGridlb,scope.czgfxxGridlb);
	angular.copy(parent.formData.kz.temp.xxbgbVO.dsxxGrid.dsxxGridlb,scope.dsxxGridlb);
	angular.copy(parent.formData.kz.temp.xxbgbVO.gdxxGrid.gdxxGridlb,scope.gdxxGridlb);
	angular.copy(parent.formData.kz.temp.xxbgbVO.sggfxxGrid.sggfxxGridlb,scope.sggfxxGridlb);
}

function replaceMxxx(index,scope) {
	if (!isNull(index)) {	
		angular.copy(parent.formData.kz.temp.cgwgqyxxbgbVO[index].wgqyxxForm,scope.wgqyxxForm);
		angular.copy(parent.formData.kz.temp.cgwgqyxxbgbVO[index].czgfxxGrid.czgfxxGridlb,scope.czgfxxGridlb);
		angular.copy(parent.formData.kz.temp.cgwgqyxxbgbVO[index].dsxxGrid.dsxxGridlb,scope.dsxxGridlb);
		angular.copy(parent.formData.kz.temp.cgwgqyxxbgbVO[index].gdxxGrid.gdxxGridlb,scope.gdxxGridlb);
		angular.copy(parent.formData.kz.temp.cgwgqyxxbgbVO[index].sggfxxGrid.sggfxxGridlb,scope.sggfxxGridlb);		
	}
}

function flushVaild(initFlag,scope) {	
	var _jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwmc";
	parent.formulaEngine.apply(_jpath,parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwmc);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwcld";
	parent.formulaEngine.apply(_jpath,parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwcld);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.szgnssbh";
	parent.formulaEngine.apply(_jpath,parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.szgnssbh);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.zyywlx";
	parent.formulaEngine.apply(_jpath,parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.zyywlx);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.bgrcgbl";
	parent.formulaEngine.apply(_jpath,parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.bgrcgbl);	
	/*if(!isNull(initFlag)){		
		for (var i = 0; i < initFlag.length; i++) {
			_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].dsxxGrid.dsxxGridlb["+i+"].rzrqz";		
			parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0,i]);	
		}
	}*/
	
	// 刷新模型
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify2(document.body);
}

function deleteVaild(){
	var _jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwmc";
	parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0]);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.wgqyzwcld";
	parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0]);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.szgnssbh";
	parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0]);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.zyywlx";
	parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0]);
	_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].wgqyxxForm.bgrcgbl";
	parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0]);
	var dsxxGridlb=parent.formData.ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].dsxxGrid.dsxxGridlb;
	for (var i = 0; i < dsxxGridlb.length; i++) {
		_jpath = "ht.qysdsczzsyjdSbbdxxVO.cgwgqyxxbgbYwbd.cgwgqyxxbgbVO[0].dsxxGrid.dsxxGridlb["+i+"].rzrqz";		
		parent.formulaEngine.deleteIdxVariableNoPass(_jpath,[0,i]);	
	}	
	// 刷新模型
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify2(document.body);
}

function setMc(args) {
	var node = args.substring(0, args.indexOf('_'));
	var dmb = parent.formData.kz.basedata[node];
	var dm = "";
	var mc = "";
	var arr = new Array();
	args = args.substring(args.indexOf('_') + 1);
	if (!isNull(dmb)) {
		arr = dmb['item'];
	}
	if (!isNull(args)) {
		dm = args.substring(0, args.indexOf('_'));
		mc = args.substring(args.indexOf('_') + 1);
	}
	if (!isNull(dm) && !isNull(mc)) {
		dmb = {};
		// 去掉重复的TODO
		var item = {};
		item['dm'] = dm;
		item['mc'] = mc;
		arr.push(item);
		dmb['item'] = arr;
	}
}

function isNull(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param) {
		return true;
	}
	return false;
}