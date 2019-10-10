function extMethods(mathFlag, newData, data, $scope) {
	if ("changeJmse" == mathFlag) {
		//解决bug:SNSWJ-131,提出的问题
		var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
		var jmxxId=yhssbGridlb[newData].jmxxId;
		var zspmDm=yhssbGridlb[newData].zspmDm;
		var ssjmxzDm = "";
		var slswsxDm = "";
		//根据选择的jmxxId设置ssjmxzDm,jmxxId只有在qcs.formContent.sbYhs.body.mxxxs.jmxxlist中有
		var jmxx = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.jmxxlist[zspmDm];
		if(jmxx&&jmxx.length>0){//存在减免备案信息
			for(var i=0;i<jmxx.length;i++){
				var jmxxVo=jmxx[i];
				if(jmxxVo.jmxxId==jmxxId){
					ssjmxzDm = jmxxVo.dm;
					slswsxDm = jmxxVo.slswsxDm;
					break;
				}
			}
		}
		//执行减免性质相关的公式
		yhssbGridlb[newData].ssjmxzDm = ssjmxzDm;
		
		var isJmba=false;
		//备案信息的jmxx在qcs.initData.yhxx.jmxxGrid
		jmxx=$scope.formData.qcs.initData.yhxx.jmxxGrid;
		if(jmxx&&jmxx.jmxxGridlb.length>0){//存在减免备案信息
			for(var i=0;i<jmxx.jmxxGridlb.length;i++){
				var jmbaxx=jmxx.jmxxGridlb[i];
				if(jmbaxx.zspmDm==zspmDm&&jmbaxx.ssjmxzhzDm==ssjmxzDm){
					isJmba=true;
					break;
				}
			}
		}
        if(ssjmxzDm!=null && ssjmxzDm!='' && !isJmba){
        	if(!(slswsxDm==null || slswsxDm==undefined || slswsxDm=="" || slswsxDm=="null")){
                if (typeof isJmsb !== "function"
                    || (typeof isJmsb === "function" && !isJmsb())) {
                    layer.alert("您选择的减免性质没有进行税收减免优惠备案！", {icon: 2});
                }
        	}
		}
		changeJmse($scope,newData);
	}else if ("selectYspz" == mathFlag) {
		selectYspz($scope,newData);
	}else if ("selectHdbl" == mathFlag) {
		selectHdbl($scope,newData);
	}else if("changeBqsfsyxgmyhzc"==mathFlag){
		changeBqsfsyxgmyhzc($scope);
	}
}


function selectYspz($scope,newData){
	//获取明细List
	var mxxxList = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
	//获取新建下拉集合
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	//bResult true节点 默认为true
	yhssbGridlb[newData].bResult="true";
	//获取核定比例集
	var hdbls = $scope.formData.qcs.hdbls;
	//获取当前征收品目代码
	var zspmDm = yhssbGridlb[newData].zspmDm;
	//要取得当前征收品目代码的名称
	var zspmMc = '';
	//当走的是无认定的方式时，取数来源不一样
	var acsbyxbqrdBz = $scope.formData.qcs.initData.yhsInitData.acsbyxbqrdBz;
	var zspmDmb = $scope.formData.qcs.zspmDmb;
	if("Y"===acsbyxbqrdBz && zspmDmb!=null && zspmDmb!=undefined){
		zspmMc = zspmDmb[zspmDm];
	}else{
		for(var i = 0;i<mxxxList.length;i++){
			if(zspmDm == mxxxList[i].yspzDm){
				zspmMc = mxxxList[i].yspzMc;
				break ;
			}
		}
	}
	var array = [];
	//这个品目已使用的比例
	var pmysyblArr = [];
	//当品目dm无值时  这个可能我不需要管（我只做提示）
	if(zspmDm == '' || zspmDm == null){
		//根据传入下标 对hdlx赋值
		parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdlx = '';
		parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].sysl = 0;
	}else{
		//当品目dm有值时,如果是无认定的方式，只需要带出税率即可,和校验选择的品目是否有一样的
		if("Y"===acsbyxbqrdBz){
			//设置sysl
			var zspmCT = parent.formCT.zspmCT;
			if(zspmCT!=null && zspmCT!=undefined && Object.keys(zspmCT).length>0){
				for(var i=0;i<Object.keys(zspmCT).length;i++){
					var zspmObj = zspmCT[i];
					if(zspmDm == zspmObj.zspmDm){
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].sysl = Number(zspmObj.sl1);
						break ;
					}
				}
			}
			
			//判断是否有选择一样的品目
			var zspmTips = "";
			var zspmResult = "true";
			for(var i = 0;i<yhssbGridlb.length;i++){
				//当前下标和循环下标不同时 且是同一个品目dm
				if(i != newData && zspmDm == yhssbGridlb[i].zspmDm){
					zspmTips = "应税凭证【"+zspmMc+"】不可重复选择！";
					zspmResult = "false";
					break ;
				}
			}
			parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmTips = zspmTips;
			parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmResult = zspmResult;
		}else{
			for(var i = 0;i<yhssbGridlb.length;i++){
				//当前下标和循环下标不同时 且是同一个品目dm
				if(i != newData && zspmDm == yhssbGridlb[i].zspmDm){
					//这里实现同一个品目，和除去当前下标的全部的这个品目比较
					//获得循环的核定征收核定比率
					var hdzsHdbl = yhssbGridlb[i].hdzsHdbl;
					//将除去当前下标的同一个征收品目的征收比率放到暂存的核定比率集合中
					for(var key in hdbls){
						if(zspmDm == key){
							array = hdbls[key];
						}
					}
					//核定征收核定比率有值时候  放到品目已使用比率集合中
					if(hdzsHdbl!=null && hdzsHdbl!=""){
						pmysyblArr.push(hdzsHdbl);
					}
					var bhhdlx = "0";
					//循环明细list  在同一个zspmDm下的 拿到本行核定利率
					for(j=0;j<mxxxList.length;j++){
						if(zspmDm == mxxxList[j].yspzDm){
							bhhdlx = mxxxList[j].hdlx2
							break ;
						}
					}
					//除去当前下标的同一个征收品目的征收比率无值 也就是不存在多条核定信息  或者 本行核定类型不为1时
					if(array.length <= 1 || "2"!=bhhdlx){
	                    if (typeof isJmsb !== "function"
	                        || (typeof isJmsb === "function" && !isJmsb())) {
	                        layer.alert("应税凭证【"+zspmMc+"】不存在多条核定信息，不可重复选择！");
	                    }
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmTips="应税凭证【"+zspmMc+"】不存在多条核定信息，不可重复选择！";
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmResult="false";
					}else{
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmResult="true";
					}
				}
			}
			for(var i=0;i<mxxxList.length;i++){
				if(zspmDm == mxxxList[i].yspzDm){
					var bhhdlx = mxxxList[i].hdlx2
					parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdlx = bhhdlx;
					if(bhhdlx=='1'){
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 1;
					}else if(bhhdlx=='2'){
						var kybl = getKybl(pmysyblArr,array);
						if(kybl!=null){
							parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = kybl;
						}else{
							parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 0;
						}
					}else if(bhhdlx!='2'){
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 0;
					}
					parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].sysl = mxxxList[i].sysl;
					break ;
				}
			}
		}
	}
	var tips_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].zspmTips";
	parent.formulaEngine.apply(tips_jpath,"");
	var zspmResult_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].zspmResult";
	parent.formulaEngine.apply(zspmResult_jpath,"");
	var bh_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].hdlx";
	parent.formulaEngine.apply(bh_jpath,"");
	
	var sysl_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].sysl";
	parent.formulaEngine.apply(sysl_jpath,"");
	
	var hdzsHdbl_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].hdzsHdbl";
	parent.formulaEngine.apply(hdzsHdbl_jpath,"");
	
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify(document.body);
}

function selectHdbl($scope,newData){
	var mxxxList = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	var hdbls = $scope.formData.qcs.hdbls;
	var zspmDm = yhssbGridlb[newData].zspmDm;
	var zspmMc = '';
	for(var i = 0;i<mxxxList.length;i++){
		if(zspmDm == mxxxList[i].yspzDm){
			zspmMc = mxxxList[i].yspzMc;
			break ;
		}
	}
	var hdbl = yhssbGridlb[newData].hdzsHdbl;
	for(var i = 0;i<yhssbGridlb.length;i++){
		if(i != newData && zspmDm == yhssbGridlb[i].zspmDm){
			if(hdbl!=null && hdbl!="" && hdbl == yhssbGridlb[i].hdzsHdbl){
                if (typeof isJmsb !== "function"
                    || (typeof isJmsb === "function" && !isJmsb())) {
                    layer.alert("应税凭证【"+zspmMc+"】,核定比例【"+yhssbGridlb[newData].hdzsHdbl+"】不能重复选择！");
                }
				parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmTips01="应税凭证【"+zspmMc+"】,核定比例【"+yhssbGridlb[newData].hdzsHdbl+"】不能重复选择！";
				parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmResult01="false";
			}else{
				parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].zspmResult01="true";
			}
		}
	}

		var tips01_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].zspmTips01";
		parent.formulaEngine.apply(tips01_jpath,"");
		var zspmResult01_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].zspmResult01";
		parent.formulaEngine.apply(zspmResult01_jpath,"");
		viewEngine.formApply($('#viewCtrlId'));
		viewEngine.tipsForVerify(document.body);
}

function changeJmse($scope,newData){
	//设置税务事项名称
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	var jmxxId = yhssbGridlb[newData].jmxxId;
	//根据减免性质代码设置减免信息
	if(jmxxId!=null && jmxxId!=''){
		var zspmDm = yhssbGridlb[newData].zspmDm;
		var jmxxlist = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.jmxxlist[zspmDm];
		if(jmxxlist!=null && jmxxlist!=undefined && jmxxlist.length>0){
			for(i=0;i<jmxxlist.length;i++){
				var jmxxObj = jmxxlist[i];
				if(jmxxId==jmxxObj.jmxxId){
					yhssbGridlb[newData].jmzlxDm = jmxxObj.jmzlxDm;
					yhssbGridlb[newData].jmsl = jmxxObj.jmsl;
					yhssbGridlb[newData].jmfd = jmxxObj.jmfd;
					yhssbGridlb[newData].jmed = jmxxObj.jmed;
					yhssbGridlb[newData].ssjmxzDm = jmxxObj.dm;
					var ssjmxzPjMc = jmxxObj.dm + "|" + jmxxObj.swsxMc + "|" + jmxxObj.mc;
					yhssbGridlb[newData].ssjmxzPjMc = ssjmxzPjMc;
					break ;
				}
			}
		}
	}else{
		yhssbGridlb[newData].jmzlxDm = '';
		yhssbGridlb[newData].jmsl = 0;
		yhssbGridlb[newData].jmfd = 0;
		yhssbGridlb[newData].jmed = 0;
		yhssbGridlb[newData].ssjmxzPjMc = '';
	}
	$scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb = yhssbGridlb;
	var ssjmxzDm_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].ssjmxzDm";
	parent.formulaEngine.apply(ssjmxzDm_jpath,"");
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify(document.body);
}

/**
 * 根据已使用的比例，返回一个可用的比例
 * */
function getKybl(pmysyblArr,allblArr){
	if(allblArr!=null && allblArr.length>0 && allblArr.length!=pmysyblArr.length){
		if(pmysyblArr==null || pmysyblArr.length<1){
			return allblArr[0];
		}
		for(i=0;i<allblArr.length;i++){
			var allblVal = allblArr[i];
			for(j=0;j<pmysyblArr.length;j++){
				var ysyblVal = pmysyblArr[j];
				if(allblVal==ysyblVal){
					break ;
				}else if(j==pmysyblArr.length-1){
					//说明allblVal还没有用到,
					return allblVal;
				}
			}
		}
	}
	return null;
	
}

/**
 * 变更本期是否适用增值税小规模纳税人减征政策时
 * 当CS_NSSB_XTCS配置的csbm=SBZS_JZXX_QZJYXGM,CSZ=当前业务编码时，强制校验，否则提示性校验。校验逻辑如下：
 * ①提示性校验：当纳税人本期非增值税小规模纳税人，并且勾选了是时，提示“增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？”，点击确定继续流程，点击取消自动选为否。
 * ②强制校验：当纳税人本期非增值税小规模纳税人，并且勾选了是时，阻断校验：“增值税一般纳税人不适用增值税小规模纳税人减征政策！”
 */
function changeBqsfsyxgmyhzc(scope){
	var bqsfsyxgmyhzc = scope.formData.yyssbbdxxVO.yhssb.sbbhead.bqsfsyxgmyhzc;
	var qcs = scope.formData.qcs;
	var sfzzsxgmjz = "N";
	var qzjyXgmFlag = "N";
	if(isNotEmptyObject(qcs.jzxx) && isNotEmptyObject(qcs.jzxx.xgmzg)){
		sfzzsxgmjz = qcs.jzxx.xgmzg.sfzzsxgmjz;
		qzjyXgmFlag = qcs.jzxx.xgmzg.qzjyXgmFlag;
	}
	if("Y"==bqsfsyxgmyhzc && "Y"!=sfzzsxgmjz && "Y"!=qzjyXgmFlag){
		//不强制校验时才需要弹窗提示，阻断提示的在公式中，提示性校验：当纳税人本期非增值税小规模纳税人
		var tips="增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？";
		var width = "230px";
		var height= "210px";
		var qdBtn = "是";
		var qxBtn = "否";
		var titleTips = "提示";
		//广东的个性化提示语不一样
		var swjgDm = qcs.initData.nsrjbxx.zgswjDm;
		if(isNotEmptyObject(swjgDm) && (swjgDm.substring(0,3)=="144" || swjgDm.substring(0,3)=="244" || swjgDm.substring(0,3)=="161" || swjgDm.substring(0,3)=="261")){
			tips = "<h1 align='center'>温馨提示</h1><br/>"
				+ "尊敬的纳税人：<br/>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据系统校验结果，本次税款所属期内，您属于“增值税一般纳税人”。"
				+ "根据《财政部 税务总局关于实施小微企业普惠性税收减免政策的通知》（财税〔2019〕13号）第三条的规定，"
				+ "增值税一般纳税人<strong>不属于</strong>资源税、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、"
				+ "耕地占用税和教育费附加、地方教育附加享受减征50%的范围。<br/>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请再次核对您本次所属期内是否属于“增值税小规模纳税人”，若您继续选择“增值税小规模纳税人”身份申报，事后确认您属于“增值税一般纳税人”，可能出现以下情形：<br/>"
				+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、需补缴因错误享受减征少缴的税费；</strong><br/>"
				+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、需缴纳因逾期缴纳税费产生的滞纳金；</strong><br/>"
				+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、影响您的纳税信用等级评定。</strong><br/>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如有疑问，您可联系主管税务机关进行确认。<br/>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您对我们工作的理解和支持！";
			//广东的取消按钮要和全国版的对调
			qxBtn = "取消（不需享受减免）";
			qdBtn = "确定（仍要享受减免）";
			width = "700px";
			height = "430px";
			titleTips = "";
		}
        if (typeof isJmsb !== "function"
            || (typeof isJmsb === "function" && !isJmsb())) {
            var b=parent.layer.confirm(tips,{
                area: [width,height],
                title:titleTips,
                closeBtn: false,
                btn : [qxBtn,qdBtn],
                btn2:function(index){
                    parent.layer.close(b);
                }
            },function(index){
                //点击取消自动选为否。
                scope.formData.yyssbbdxxVO.yhssb.sbbhead.bqsfsyxgmyhzc = "N";
                //重新执行相关公式
                var _jpath = "yyssbbdxxVO.yhssb.sbbhead.bqsfsyxgmyhzc";
                parent.formulaEngine.apply(_jpath,"N");
                viewEngine.formApply($('#viewCtrlId'));
                viewEngine.tipsForVerify(document.body);
                parent.layer.close(b);
            });
        }
	}
}

function isNotEmptyObject(obj){
	if(obj!=null&&obj!=undefined&&obj!=""){
		return true;
	}else{
		return false;
	}
}

