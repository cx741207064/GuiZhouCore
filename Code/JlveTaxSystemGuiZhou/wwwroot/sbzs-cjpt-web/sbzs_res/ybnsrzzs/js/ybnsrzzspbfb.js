try{
	window.onload = pbfbJudge();	
}catch(e){
	window.onload = pbfbJudge;
}


function pbfbJudge(){
	var tempSwjgDm = parent.formData.qcs.initData.nsrjbxx.swjgDm;
	//DLGS-309大连国税个性化需求,因为是改变主表，所以暂时在这里处理
	if(tempSwjgDm != "" && tempSwjgDm.substr(0,5) == "12102"){
		setYhzh(parent.formData.qcs.initData.zzsybnsrsbInitData.zzsybnsrSfxy,parent.formData.qcs.initData.nsrjbxx.yhxxGrid);
	}
	var tbbd = parent.formData.qcs.initData.zzsybnsrsbInitData.xbstr;
	var fb5qcye = parent.formData.qcs.initData.zzsybnsrsbInitData.fb5qcye;
	var fb5flag = false;
	var fb5Message = "";
	var bzz = "";
	var dqurl = parent.parent.location.href;
	if(dqurl.indexOf("bzz=")>0){
		bzz = dqurl.substring(dqurl.indexOf("bzz="));
		if(bzz.indexOf("&")>0){
			bzz = bzz.substring(0,bzz.indexOf("&"));
		}
		bzz = bzz.substring("bzz=".length);
	}
	var sfbbb = true;
	var sssqZ = parent.formData.qcs.initData.zzsybnsrsbInitData.sssq.rqZ;
	if(sssqZ >= '2019-04-30'){
        sfbbb = false;
	}
	if(tbbd.charAt(5)!="1" && fb5qcye!=undefined && fb5qcye!=0 && sfbbb){
		fb5flag = true;
		if(bzz == "csgj"){
			fb5Message = "《增值税纳税申报表附列资料（五）》上期存在期末数据，请在【基础设置】-【表单填报设置】中确认附表五已勾选，并点击“保存”按钮后，再填写申报表！";
		}else{
			fb5Message = "《增值税纳税申报表附列资料（五）》上期存在期末数据，请在【选表设置】中确认附表五已勾选，并点击“保存”按钮后，再填写申报表！";
		}
	}
	var scope = angular.element($(".NewTableMain")).scope();
	var swjgDm = parent.formData.qcs.initData.nsrjbxx.swjgDm;
	var noCheckSffxb = false;
	if(swjgDm != "" && swjgDm.substr(0,3) == "144" && bzz == "csgj"){
		noCheckSffxb = (parent.formData.qcs.initData.zzsybnsrsbInitData.ygzsfqybz=="Y") && (parent.formData.zzsybsbSbbdxxVO.zzssyyybnsr_ygzsffxcsmxb) == undefined;
		if(noCheckSffxb && sfbbb){
			// layer.alert("您为营改增税负企业，请在【基础设置】—【表单填报设置】勾选“营改增税负分析测算明细表”并保存后，再填写申报表！",{btn:[]});
			// layer.alert("<h1>请选择</h1>需要申报的项目！", {icon: 7})
			if(fb5flag){
				window.parent.layer.alert(fb5Message+"<br/>"+'您为营改增税负企业，请在【基础设置】—【表单填报设置】勾选“营改增税负分析测算明细表”并保存后，再填写申报表！', {
					title:"提示",closeBtn:0
				});
			}else{
				window.parent.layer.alert('您为营改增税负企业，请在【基础设置】—【表单填报设置】勾选“营改增税负分析测算明细表”并保存后，再填写申报表！', {
					title:"提示",closeBtn:0
				});
			}
			parent.$(window.parent.document.body).mask("&nbsp;");
			parent.parent.cleanMeunBtn();
		}
		/*var sfbfbb = (parent.formData.qcs.initData.zzsybnsrsbInitData.yzqybz == "Y" || parent.formData.qcs.initData.zzsybnsrsbInitData.dxqybz == "Y") && (parent.formData.zzsybsbSbbdxxVO.zzssyyybnsr_ygzsffxcsmxb) != undefined;
		
		if(sfbfbb && !parent.sfbfbb){
			layer.alert("贵公司属于邮电通信业预征企业，不需要申报营改增税负分析测算明细表！");
			parent.sfbfbb = sfbfbb;
		}*/
	}else{
		noCheckSffxb = (parent.formData.qcs.initData.zzsybnsrsbInitData.ygzsfqybz=="Y") && (parent.formData.zzsybsbSbbdxxVO.zzssyyybnsr_ygzsffxcsmxb) == undefined;
		if(noCheckSffxb && sfbbb){
			// layer.alert("您为营改增税负企业，请在【基础设置】—【表单选表设置】勾选“营改增税负分析测算明细表”并保存后，再填写申报表！",{btn:[]});
			// layer.alert("<h1>请选择</h1>需要申报的项目！", {icon: 7})
			if(fb5flag){
				window.parent.layer.alert(fb5Message+"<br/>"+'您为营改增税负样本企业，请在【选表设置】中确认《营改增税负测算明细表》已勾选，并点击“保存”按钮后，再填写申报表！', {
					title:"提示",closeBtn:0
				});
			}else{
				window.parent.layer.alert('您为营改增税负样本企业，请在【选表设置】中确认《营改增税负测算明细表》已勾选，并点击“保存”按钮后，再填写申报表！', {
					title:"提示",closeBtn:0
				});
			}
			parent.$(window.parent.document.body).mask("&nbsp;");
			parent.parent.$("#btnPrepareMake,#btnPrepareMakeYCSBD").remove();
		}
	}
	if(fb5flag && !(noCheckSffxb && sfbbb)){
		window.parent.layer.alert(fb5Message, {
			title:"提示",closeBtn:0
		});
		parent.$(window.parent.document.body).mask("&nbsp;");
		parent.parent.$("#btnPrepareMake,#btnPrepareMakeYCSBD").remove();
	}
	if(!bz){
		bz= parent.formData.qcs.initData.zzsybnsrsbInitData.yqwrdybnsrBz;
	}
	if(bz=="Y"){
		if(!parent.fbpbTsArray){
			parent.fbpbTsArray = {};
		}
		var fbxscs = window.xscs == undefined?1:window.xscs;
		var fbxsts = window.always_xsts == undefined?true:window.always_xsts;
		//配置显示提示为1，则每次进入附表都会提示。否则只会提示一次。 配置显示次数可以设定显示多少次。
		if(fbxsts || ((!parent.fbpbTsArray[fb] && fbxscs >= 1) || parent.fbpbTsArray[fb] < fbxscs)){
			window.parent.layer.alert("逾期仍未办理一般纳税人资格登记的纳税人，"+fb+"不允许填写 ",{title:"提示",closeBtn:0});
			if(parent.fbpbTsArray[fb]){
				parent.fbpbTsArray[fb] = parent.fbpbTsArray[fb]+1;
			}else{
				parent.fbpbTsArray[fb] = 1;
			}
		}
    	 if(pbfbBz == "Y"){
    		 parent.$(document.body).mask("&nbsp;");
    	 }
    	 if(pathArr){
			 var $scope = angular.element($("#viewCtrlId")).scope();
			 for(var i = 0;i < pathArr.length;i++){
				 var path = pathArr[i];
				 var path_0 = path.split(".")[0];
				 var path_last = path.substr(path.indexOf(".")+1);
				 if(path_0.indexOf("[")>-1){
						var path_tmp_1 = path_0.split("[")[0];
						var path_tmp_2 = path_0.split("[")[1].replace("]","");
						path_tmp_2 = isNaN(path_tmp_2)?path_tmp_2:(path_tmp_2*1);
						var obj_tmp_0 = $scope[path_tmp_1];
						var obj_tmp = setZero(obj_tmp_0[path_tmp_2],path_last);
						obj_tmp_0[path_tmp_2] = obj_tmp;
						$scope[path_tmp_1] = obj_tmp_0;
				 }else{
					 var scope_tmp = setZero($scope[path_0],path_last);
					 $scope[path_0] = scope_tmp;
				 }
			 }
			 $scope.$apply();
			 parent.flagExecuteInitial = false;
	         parent.formulaEngine.applyImportFormulas(true);
	         viewEngine.formApply($("#viewCtrlId"));
	         viewEngine.tipsForVerify(document.body);
		 }
     }	
}

function setZero(obj,path){
	if(path.indexOf(".")>-1){
		var path_0 = path.split(".")[0];
		var path_last = path.substr(path.indexOf(".")+1);
		
		if(obj[path_0]){
			var obj_tmp = setZero(obj[path_0],path_last);
			obj[path_0] = obj_tmp;
			return obj;
		}else if(path_0.indexOf("[")>-1){
			var path_tmp_1 = path_0.split("[")[0];
			var path_tmp_2 = path_0.split("[")[1].replace("]","");
			path_tmp_2 = isNaN(path_tmp_2)?path_tmp_2:(path_tmp_2*1);
			var obj_tmp_0 = obj[path_tmp_1];
			var obj_tmp = setZero(obj_tmp_0[path_tmp_2],path_last);
			obj_tmp_0[path_tmp_2] = obj_tmp;
			obj[path_tmp_1] = obj_tmp_0; 
			return obj;
		}else{
			//路径错误，不做处理。
			return obj;
		}
	}else{
		if(obj[path]){
			obj[path] = 0.00;
			return obj;
		}else{
			//路径错误，不做处理。
			return obj;
		}
	}
}

function setYhzh(zzsybnsrSfxy,yhxxGrid){
	var newYhxxGridlb = new Array();
	if(zzsybnsrSfxy[0].yhzh!="" && zzsybnsrSfxy[0].yhhbMc!=""){
		parent.formData.qcs.initData.nsrjbxx.khzh = zzsybnsrSfxy[0].yhzh;
		parent.formData.qcs.initData.nsrjbxx.yhMc = zzsybnsrSfxy[0].yhhbMc;
		return  "";
	}
	return  "";
}

/**
 * 获取数组长度
 * 
 * @param
 */
function arrayCount(myArray) {
	var arrayType = typeof myArray;
	if (arrayType = "string") {
		return myArray.length;
	} else if (arrayType = "object") {
		var n = 0;
		for ( var i in myArray) {
			n++;
		}
		return n;
	}
	return false;
}
