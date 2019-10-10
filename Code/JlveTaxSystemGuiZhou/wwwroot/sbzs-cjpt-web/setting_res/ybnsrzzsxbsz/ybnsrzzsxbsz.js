/**
 * 一般纳税人基础设置js
 */

/**
 * 表单框架执行时针对scope定制方法
 * 
 * @param $scope
 * @returns $scope
 */
function scopeCallback($scope) {
	var formDataStr = JSON.stringify($scope.formData);
	$scope.oldFormData = JSON.parse(formDataStr);
	$scope.checkChanges = {};
	$scope.onCheck = function(event){
		var target = event.target;
		if(true){
			  $(target).parents("tr").siblings().children().siblings(".bgc01").removeClass("bgc01");
			  $(target).parent().addClass("bgc01");
			  $(target).parent().siblings().removeClass("bgc01");
		 }
		var ngModel = $(target).attr("ng-model");
		var paths = ngModel.split(".");
		var oldData = $scope.oldFormData[paths[0]];
		var newData = $scope.formData[paths[0]];
		for(var i = 1; i < paths.length; i++){
			oldData = oldData[paths[i]];
		}
		oldData = (oldData == undefined) ? 'N' : oldData;
		newData = target.checked?'Y':'N';
		
		if(ngModel=="jcxxsz.BDA0610338"||ngModel=="jcxxsz.FWBDCHWXZCKCXMQD"){
			if(newData=="Y"){
				if($scope.xsmap.FWBDCHWXZCKCXMQD === "Y"){
                    $scope.jcxxsz.FWBDCHWXZCKCXMQD="Y";
				}
				if($scope.xsmap.BDA0610338 === "Y"){
                    $scope.jcxxsz.BDA0610338="Y";
				}
			}else{
				$scope.jcxxsz.FWBDCHWXZCKCXMQD="N";
				$scope.jcxxsz.BDA0610338="N";
			}
			
		}
		
		if(ngModel=="jcxxsz.BDA0610566"||ngModel=="jcxxsz.WSPZDKJQD"){
			if(newData=="Y"){
                if($scope.xsmap.WSPZDKJQD === "Y"){
                    $scope.jcxxsz.WSPZDKJQD="Y";
                }
                if($scope.xsmap.BDA0610566 === "Y"){
                    $scope.jcxxsz.BDA0610566="Y";
                }
			}else{
				$scope.jcxxsz.WSPZDKJQD="N";
				$scope.jcxxsz.BDA0610566="N";
			}
			
		}
		
		if(oldData != newData){
			$scope.checkChanges[paths[i-1]] = newData;
		}else if($scope.checkChanges[paths[i-1]]){
			delete $scope.checkChanges[paths[i-1]];
		}
	};
	$scope.reset = function(){
		var formDataStr = JSON.stringify($scope.oldFormData);
		var formDataModel = JSON.parse(formDataStr);
		$scope.formData = formDataModel;
		for(var i in formDataModel){
			if($scope[i]){
				$scope[i] = formDataModel[i];
			}
		}
		//$scope.jcxxsz = formDataModel.jcxxsz;
		parent.formData = formDataModel;
		$scope.checkChanges = {};
		$scope.$apply();
	};
	
	return $scope;
}

/**
 * 初始化回调
 */
function initCallback() {
	var jsonData = parent.formData;
	if(!jsonData){
		parent.flagDataLoaded = true;
		parent.autoResizeIframe("iframehtm");
		return;
	}
	if(jsonData.extraParam && jsonData.extraParam.fpUrl && jsonData.extraParam.fpUrl.indexOf("$")==-1){
		if (parent.window.location.href.indexOf('ybsb=Y') != -1) {
			parent.$("#extraBtn").html("发票采集").show();
			parent.$("#extraBtn").click(function(){
				var url = jsonData.extraParam.fpUrl; 
				var index = top.layer.open({
				    type: 2,
				    content: url,
				    area: ['300px', '195px'],
				    maxmin: true,
				    title:'发票采集'
				});
				top.layer.full(index);
			});
		}
	}
	
	parent.$("#czan").show();
	//parent.$("#hqjdsj").hide();
	parent.$("#czan").off("click").click(function(){
		var $scope = angular.element($("#viewCtrlId")).scope();
		//setViewEngine.dynamicFormApply($("#viewCtrlId"),$scope.oldFormData);//--1
		//parent.formData = formDataModel;
		
		/*var formDataStr = JSON.stringify($scope.oldFormData); //--2
		var formDataModel = JSON.parse(formDataStr);
		setViewEngine.formApply($("#viewCtrlId"),"jcxxsz",formDataModel.jcxxsz);
		setViewEngine.formApply($("#viewCtrlId"),"formData",formDataModel);
		parent.formData = formDataModel;*/
		$scope.reset();//--3
	});
	
	var tipsJson;
	function getTips(){
		layer.load();
		var path = "";
		if(window.ctxPath){
			path = window.ctxPath;
		}
		$.getJSON(path+"labelTips.json",function(datas){
			layer.closeAll('loading');
			
			tipsJson = datas;
		});
	}
	
	getTips();
	$("#left_tab").find("tbody").find("tr").click(function(){
		var keyElement = $(this).find("td").find("input");
		if(!keyElement){
			return;
		}
		var key = $(keyElement).attr("ng-model");
		if(!key){
			return;
		}
		 $(this).siblings().children().siblings(".bgc01").removeClass("bgc01");
		 $(this).siblings().removeClass("bgc01");
		 $(this).addClass("bgc01").children().addClass("bgc01");
		var tips = tipsJson[key];
		$("#content").html(tips);
	});
	
	//parent.autoResizeIframe("iframehtm");
	//parent.$("#iframehtm").attr("height",parent.$("body").css("height").replace("px","")-parent.$(".head_11:first").css("height").replace("px","")-3);
	

};

parent.validateBeforeSubmit = function() {
	var frmDataStr = $('#formDataSpan').html();
	var frmData = JSON.parse(frmDataStr);
	
	//完税凭证抵扣清单 与 附表四 需要同步勾选
	if(frmData.jcxxsz.BDA0610566 === 'Y' && frmData.xsmap.WSPZDKJQD === 'Y' && frmData.jcxxsz.WSPZDKJQD !== 'Y'){
		parent.layer.alert("已勾选“增值税纳税申报表附列资料（表四）（税额抵减情况表）”，请同步勾选“完税凭证抵扣清单”！",{
			closeBtn: 0,
			title : "错误",
		});
		return false;
	}
	//服务、不动产和无形资产扣除项目清单 与 附表三 需要同步勾选
	if(frmData.jcxxsz.BDA0610338 === 'Y' && frmData.xsmap.FWBDCHWXZCKCXMQD === 'Y' && frmData.jcxxsz.FWBDCHWXZCKCXMQD !== 'Y'){
		parent.layer.alert("已勾选“增值税纳税申报表附列资料（表三）（服务、不动产和无形资产扣除项目明细）”，请同步勾选“服务、不动产和无形资产扣除项目清单”！",{
			closeBtn: 0,
			title : "错误",
		});
		return false;
	}
	var checks = SetViewEngine.SCOPE.checkChanges;
	if(JSON.stringify(checks) == "{}"){
		SetViewEngine.SCOPE.formData.changed = "N";
	}else{
		SetViewEngine.SCOPE.formData.changed = "Y";
	}
	var dzbdbmList = "";
	for(var szx in frmData.jcxxsz){
		if(frmData.jcxxsz[szx] == 'Y'){
            dzbdbmList += szx+"---";
		}
	}
    SetViewEngine.SCOPE.formData.dzbdbmList = dzbdbmList;
	SetViewEngine.SCOPE.$apply();
	return true;
}

parent.saveDataCallback = function(data,index){
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var result = pathName.substr(0, index + 1);
	var biz = "/biz/sbzs/ybnsrzzs";
	if(parent.location.search.indexOf("ywzt=Y")>-1){
        biz = "/biz/sb/ybnsrzzs";
	}
	var url = parent.location.protocol + "//" + parent.location.host +  result + biz + parent.location.search;
	if((parent.location.search && parent.location.search.indexOf("gotoSbb=Y")>-1) 
			|| (parent.location.search && parent.location.search.indexOf("gzsb=Y")>-1)
			|| (parent.location.search && parent.location.search.indexOf("gzsb=zx")>-1)){
		parent.window.location.href = url;
	}else if( (parent.location.search && parent.location.search.indexOf("closeXbsz=Y")>-1) ){
		parent.layer.close(index);
	}
}