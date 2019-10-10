/**
 * 
 * SDSDSYHB-2539
 * 印花税自动带出本期已缴税额(初始化的时候才用到)
 * 现需求，去掉“属期与当前申报属期存在交叉的”的规则
 *1、本期已缴税额：初始化自动带出，已缴税额取预缴信息下同品目，可修改
 *2、校验：征收品目【xx】的本期已缴税额合计【xx】不能大于征收品目 的实际预缴余额【xx】
 *①正常申报：循环期初数预缴信息下同品目的yjye相加
 *②更正申报：正常申报取数口径+同品目已申报的已缴额 
 * @param zspmDm 征收品目代码
 * 
 * */
function yhssb_setbqyjse(zspmDm){
	var yjye = 0.00;
	var isGzsb = this.formData.qcs.initData.isGzsb;
	var zgswskfjDm = this.formData.qcs.initData.nsrjbxx.zgswskfjDm;
	var skssqq = this.formData.yyssbbdxxVO.yhssb.sbbhead.skssqq.replace(/\-/g,'/');
	var skssqz = this.formData.yyssbbdxxVO.yhssb.sbbhead.skssqz.replace(/\-/g,'/');
	//申报并库修改计划（原来各区域的地税个性化判断要改为国税个性化判断
	var gdslxDm = parent.parent.gdslxDm;
	var gxh_sc = "";
	var gxh_sd = "";
	var gxh_gd = "";
	if ("2" == gdslxDm) {
		gxh_sc = "251";
		gxh_sd = "237";
		gxh_gd = "244";
	} else {
		gxh_sc = "151";
		gxh_sd = "137";
		gxh_gd = "144";
	}
	if(zgswskfjDm!=""&&zgswskfjDm!=null&&(typeof(zgswskfjDm)!="undefined")){
		// 四川 山东个性化
		// 山东公式序列号：061001070101000177 
		// 四川公式序列号：06100107010100022
		//广东个性化 GDSDZSWJ-9922   需求广东保留原有版本申报所属期校验 和 校验公式同步修改
		if(zgswskfjDm.substring(0,3)==gxh_sc || zgswskfjDm.substring(0,3)==gxh_sd) {
			if(isGzsb!=null && isGzsb!=undefined && 'Y'==isGzsb){
				//更正申报时取明细信息
				var mxxx = this.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
				if(mxxx!=null && mxxx!=undefined && mxxx.length>0){
					for(var i=0;i<mxxx.length;i++){
						var mxxxObj = mxxx[i];
						if(mxxxObj!=null && mxxxObj!=undefined){
							var yeZspmDm = mxxxObj.yspzDm;
							if(zspmDm==yeZspmDm){
								yjye = yjye + ROUND(mxxxObj.bqyjse,2);
							}
						}
					}
				}
			}else{
				//正常申报取yjxxGridlb
				var yjyelb = this.formData.qcs.initData.yhxx.yjxxGrid.yjxxGridlb;
				if(yjyelb!=null && yjyelb!=undefined && yjyelb.length>0){
					for(var i=0;i<yjyelb.length;i++){
						var yjyeObj = yjyelb[i];
						if(yjyeObj!=null && yjyeObj!=undefined){
							var yeZspmDm = yjyeObj.zspmDm;
							var sKssqq = yjyeObj.skssqq.replace(/\-/g,'/');
							var sKssqz = yjyeObj.skssqz.replace(/\-/g,'/');
							// 在有效认定期属期校验  只保留同一品目
							if(zspmDm==yeZspmDm){	
								yjye = yjye + ROUND(yjyeObj.yjye1,2);
							}
						}
					}
				}
			}
		}else if(zgswskfjDm.substring(0,3)==gxh_gd) {
				if(isGzsb!=null && isGzsb!=undefined && 'Y'==isGzsb){
					//更正申报时取明细信息
					var mxxx = this.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
					if(mxxx!=null && mxxx!=undefined && mxxx.length>0){
						for(var i=0;i<mxxx.length;i++){
							var mxxxObj = mxxx[i];
							if(mxxxObj!=null && mxxxObj!=undefined){
								var yeZspmDm = mxxxObj.yspzDm;
								if(zspmDm==yeZspmDm){
									yjye = yjye + ROUND(mxxxObj.bqyjse,2);
								}
							}
						}
					}
			}else{
					//正常申报取yjxxGridlb
					var yjyelb = this.formData.qcs.initData.yhxx.yjxxGrid.yjxxGridlb;
					if(yjyelb!=null && yjyelb!=undefined && yjyelb.length>0){
						for(var i=0;i<yjyelb.length;i++){
							var yjyeObj = yjyelb[i];
							if(yjyeObj!=null && yjyeObj!=undefined){
								var yeZspmDm = yjyeObj.zspmDm;
								var sKssqq = yjyeObj.skssqq.replace(/\-/g,'/');
								var sKssqz = yjyeObj.skssqz.replace(/\-/g,'/');
								// 在有效认定期属期校验  只保留同一品目
								if(zspmDm==yeZspmDm && (Date.parse(skssqq)==Date.parse(sKssqq)&&Date.parse(skssqz)==Date.parse(sKssqz))){	
									yjye = yjye + ROUND(yjyeObj.yjye1,2);
								}
							}
						}
					}
			}
		}
	}
	return ROUND(yjye,2);
}

/**
 * 印花税本期已缴税额的校验
 * param
 * 
 * SDSDSYHB-2539
 * 调整规则定义，取消印花税自动带出的预缴、校验的预缴 的属期过滤规则。 
 * 
 * 现需求，去掉“属期与当前申报属期存在交叉的”的规则
 *1、本期已缴税额：初始化自动带出，已缴税额取预缴信息下同品目，可修改
 *2、校验：征收品目【xx】的本期已缴税额合计【xx】不能大于征收品目 的实际预缴余额【xx】
 *①正常申报：循环期初数预缴信息下同品目的yjye相加
 *②更正申报：正常申报取数口径+同品目已申报的已缴额 
 * */
function yhssb_jybqyjse(zspmDm,bqyjse,value){
	var zgswskfjDm = this.formData.qcs.initData.nsrjbxx.zgswskfjDm;
	var gdslxDm = parent.parent.gdslxDm;
	var gxh_gd="";
	if ("2" == gdslxDm) {
		gxh_gd = "244";
	} else {
		gxh_gd = "144";
	}
	if(zgswskfjDm!=""&&zgswskfjDm!=null&&(typeof(zgswskfjDm)!="undefined")){
		if(zspmDm==null || zspmDm==""){
			return true;
		}
		//因为有增删行，所以要根据同一个品目合计本期已缴税额
		var pmBqyjsehj = 0;
		var yhssbGridlb = this.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
		//需要返回提示语的时候使用，提示同一个品目相加的数值，如：hjTsy=10+10+10
		var hjTsy = "";
		var zspmMc = "";
		if(yhssbGridlb!=null && yhssbGridlb!=undefined && yhssbGridlb.length>0){
			for(var i=0;i<yhssbGridlb.length;i++){
				var yhssbGrid = yhssbGridlb[i];
				if(yhssbGrid!=null && yhssbGrid!=undefined){
					var yeZspmDm = yhssbGrid.zspmDm;
					if(zspmDm==yeZspmDm){
						zspmMc = yhssbGrid.zspmMc;
						pmBqyjsehj = ROUND(yhssbGrid.bqyjse1+pmBqyjsehj,2);
						if(hjTsy==""){
							hjTsy = "" + pmBqyjsehj;
						}else{
							hjTsy = hjTsy + "+" + yhssbGrid.bqyjse1;
						}
					}
				}
			}
		}
		if(pmBqyjsehj<=0){
			return true;
		}
		var yjye = 0.00;
		var yjyelb = this.formData.qcs.initData.yhxx.yjxxGrid.yjxxGridlb;
		// 预缴总余额取数逻辑： 
		// ①正常申报：循环期初数预缴信息下同品目，属期与当前申报属期存在交叉的yjye相加
		var skssqq = this.formData.yyssbbdxxVO.yhssb.sbbhead.skssqq.replace(/\-/g,'/');
		var skssqz = this.formData.yyssbbdxxVO.yhssb.sbbhead.skssqz.replace(/\-/g,'/');
		if(yjyelb!=null && yjyelb!=undefined && yjyelb.length>0){
			for(var i=0;i<yjyelb.length;i++){
				var yjyeObj = yjyelb[i];
				if(yjyeObj!=null && yjyeObj!=undefined){
					var yeZspmDm = yjyeObj.zspmDm;
					var sKssqq = yjyeObj.skssqq.replace(/\-/g,'/');
					var sKssqz = yjyeObj.skssqz.replace(/\-/g,'/');
					// 在有效认定期内
					// if(zspmDm==yeZspmDm&&Date.parse(skssqq)>=Date.parse(sKssqq)&&Date.parse(skssqz)<=Date.parse(sKssqz)){
					// 有效认定交叉 !(sssqQ>rdyxqz || sssqZ>rdyxqz)==true
					//广东个性化 GDSDZSWJ-9922   需求广东保留原有版本申报所属期校验 和 校验公式同步修改
					if(zgswskfjDm.substring(0,3)==gxh_gd){
						if(zspmDm==yeZspmDm && (Date.parse(skssqq)==Date.parse(sKssqq) && Date.parse(skssqz)==Date.parse(sKssqz))){
							yjye = yjye + ROUND(yjyeObj.yjye1,2);
						}
					}else{
						if(zspmDm==yeZspmDm){
							yjye = yjye + ROUND(yjyeObj.yjye1,2);
						}
					}
	
				}
			}
		}
		// ②更正申报：正常申报取数口径+同品目已申报的已缴额 
		var isGzsb = this.formData.qcs.initData.isGzsb;
		if(isGzsb!=null && isGzsb!=undefined && 'Y'==isGzsb){
			//更正申报时取明细信息
			var mxxx = this.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
			if(mxxx!=null && mxxx!=undefined && mxxx.length>0){
				for(var i=0;i<mxxx.length;i++){
					var mxxxObj = mxxx[i];
					if(mxxxObj!=null && mxxxObj!=undefined){
						var yeZspmDm = mxxxObj.yspzDm;
						if(zspmDm==yeZspmDm){
							yjye = yjye + ROUND(mxxxObj.bqyjse,2);
						}
					}
				}
			}
		}
		if("tips"==value){
			//需要返回提示语的时候，返回字符串,否则返回true和false
			var tips = "征收品目["+zspmMc+"]的本期已缴税额合计【"+hjTsy+"】不能大于征收项目的实际预缴余额【"+yjye+"】"
			return tips;
		}
		yjye = ROUND(yjye,2);
		if(yjye!=null && yjye!="" && pmBqyjsehj<=yjye){
			return true;
		}
		return false;
	}else{
		return true;
	}
}

/**更正申报时计算减免税额*/
function yhsGzsb_jsJmse(zspmDm,jmzlxDm,jsyj,hdzsHdde,hdzsHdbl,bqynse,fdsl,jmfd,jmed,jmsl){
	var isGzsb = formData.qcs.initData.isGzsb;
	//因为初始化的时候会有动态行，所以动态行有多少个，就会调用多少次这个方法，当初始化完成之后，jmseCshJsCs将等于动态行的个数(新增的时候不会改变mxxx的个数)，
	var jmseCshJsCs = formData.qcs.jmseCshJsCs;
	var jmse = 0.00;
	if(formData.qcs.formContent.sbYhs.body.mxxxs!=null && formData.qcs.formContent.sbYhs.body.mxxxs!=undefined){
		var mxxx = formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
		if(mxxx!=null && mxxx!=undefined && mxxx.length>0 &&'Y'==isGzsb && jmseCshJsCs<mxxx.length){
			for(var i=0;i<mxxx.length;i++){
				if(zspmDm!=null && zspmDm!=undefined && zspmDm==mxxx[i].yspzDm){
					jmse = mxxx[i].jmse;
					break ;
				}
			}
			formData.qcs.jmseCshJsCs = jmseCshJsCs + 1;
		}else{
			if(jsyj==0){
				jsyj = hdzsHdde*hdzsHdbl;
			}
			jmse = getMrjmseBySsjmxz(jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl);
		}
	}
	return jmse;
}


/**
 * 根据征收品目自动带出减免性质
 * 并且ynse>0，税款所属期起为2018年5月1日（含）后
 * */
function yhsjsJmxz(zspmDm,ynse){
	var isGzsb = formData.qcs.initData.isGzsb;
	var jmxzCshJsCs = formData.qcs.jmxzCshJsCs;
	var jmxxId = "";
	var swsxDm = "";
	//如果是更正的时候，使用接口返回的ssjmxzDm,并且默认拼接一个swsxDm(因为接口没有返回，只能用一个默认的)
	var mxxx = formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
	if(mxxx!=null && mxxx!=undefined && mxxx.length>0 && "Y"==isGzsb && jmxzCshJsCs<mxxx.length){
		for(var i=0;i<mxxx.length;i++){
			var mxZspm = mxxx[i].yspzDm;
			if(zspmDm==mxZspm){
				jmxxId = mxxx[i].jmxxId;
				break ;
			}
		}
		formData.qcs.jmxzCshJsCs = jmxzCshJsCs + 1;
		formData.qcs.initData.isCsh = "N";
		return jmxxId;
	}
	var skssqq = formData.yyssbbdxxVO.yhssb.sbbhead.skssqq;
	if(!DATE_CHECK_TIME_SIZE("2018-05-01",skssqq)){
		return jmxxId;
	}
	var yhssbGridlb = formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	if(yhssbGridlb!=null && yhssbGridlb!=undefined && yhssbGridlb.length>0 && zspmDm!=null && zspmDm!=""){
		var ssjmxzDm = "";
		var swsxDm = "";
		for(var i=0;i<yhssbGridlb.length;i++){
			var tmpZspmDm = yhssbGridlb[i].zspmDm;
			if(zspmDm==tmpZspmDm){
				if(ynse<=0){
					formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].ssjmxzDm = "";
					var _jpath2 = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+i+"].ssjmxzDm";
					formulaEngine.apply(_jpath2,"");
					return jmxxId;
				}
				if("101110599"==zspmDm){
					//系统自动带出品目或选择品目为“101110599|其他营业账簿”且税款属期起为2018年5月1日（含）后并且应纳税额>0时
					ssjmxzDm = "0009129907";
					swsxDm = "SXA031900951";
				}else if("101110501"==zspmDm){
					ssjmxzDm = "0009129906";
					swsxDm = "SXA031900950";
				}
				if(ssjmxzDm!=""){
					jmxxId = zspmDm + ssjmxzDm + swsxDm;
				}
				//设置减免相关信息,并且判断这个jmxxId是否在代码中，不存在则将相关信息设置为空
				var isExistJmxxId = false;
				var jmxx = formData.qcs.formContent.sbYhs.body.mxxxs.jmxxlist[zspmDm];
				if(jmxx && jmxx.length>0 && jmxxId!=""){
					for(var j=0;j<jmxx.length;j++){
						var jmxxVo=jmxx[j];
						if(jmxxVo.jmxxId==jmxxId){
							isExistJmxxId = true;
							formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].jmzlxDm = jmxxVo.jmzlxDm;
							formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].jmsl = jmxxVo.jmsl;
							formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].jmfd = jmxxVo.jmfd;
							formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].jmed = jmxxVo.jmed;
							var ssjmxzPjMc = jmxxVo.dm + "|" + jmxxVo.swsxMc + "|" + jmxxVo.mc;
							formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].ssjmxzPjMc = ssjmxzPjMc; 
							break;
						}
					}
				}
				if(!isExistJmxxId){
					jmxxId = "";
					ssjmxzDm = "";
					formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].ssjmxzPjMc = "";
				}
				formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].ssjmxzDm = ssjmxzDm;
				var _jpath2 = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+i+"].ssjmxzDm";
				formulaEngine.apply(_jpath2,"");
				break ;
			}
		}
	}
	// 刷新本期已缴税额
	if(yhssbGridlb!=null && yhssbGridlb!=undefined && yhssbGridlb.length>0 && zspmDm!=null && zspmDm!=""){
		for(var i=0;i<yhssbGridlb.length;i++){
			var bqyjse1 = formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[i].bqyjse1;
			var _jpath_bqyjse1 = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+i+"].bqyjse1";
			formulaEngine.apply(_jpath_bqyjse1,bqyjse1);
		}
	}
	return jmxxId;
}

// 校验逾期申报方法
function initVaild(sfjyyqhtqsb,sbqx){
	var sbywbm = parent.parent.ywbm;
	var yqsbbz = parent.parent.yqsbbz;
	var gdslxDm = parent.parent.gdslxDm;
	if(isNaN(sbqx) && !isNaN(Date.parse(parseDate(sbqx))) && sfjyyqhtqsb!="false" && yqsbbz!="Y"){
		var sbiniturl = parent.pathRoot+"/biz/yqsb/yqsbqc/enterYqsbUrl?gdslxDm="+gdslxDm+"&sbqx="+sbqx+"&yqsbbz="+yqsbbz+"&sbywbm="+sbywbm;
 		$.ajax({
 			url:sbiniturl,
 			type:"GET",
 			data:{},
 			dataType:"json",
 			contentType:"application/json",
 			success:function(data){
 				var sfkyqsbbz=data.sfkyqsbbz;
 		 		var wfurlList=data.wfurlList;
 		 		var msg=data.msg;
 		 		var yqtsmsg=data.yqtsmsg;
 		 		if(sfkyqsbbz=='Y'){
 		 			if(yqtsmsg && yqtsmsg!=''){
 		 				if(msg && msg!=''){
                            if (typeof isJmsb !== "function"
                                || (typeof isJmsb === "function" && !isJmsb())){
                                var tab = parent.layer.confirm(yqtsmsg, {
                                    title: '提示',
                                    closeBtn: false,
                                    btn: ['继续申报']
                                }, function (index) {
                                    parent.layer.close(tab);
                                    parent.layer.confirm(msg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['确定']
                                    });
                                });
							}
 		 				}else if (typeof isJmsb !== "function"
                            || (typeof isJmsb === "function" && !isJmsb())) {
                            parent.layer.confirm(yqtsmsg, {
                                title: '提示',
                                closeBtn: false,
                                btn: ['继续申报']
                            });
 		 				}
 		 			}else{
 		 				if(msg && msg!=''){
                            if (typeof isJmsb !== "function"
                                || (typeof isJmsb === "function" && !isJmsb())) {
                                parent.layer.confirm(msg, {
                                    title: '提示',
                                    closeBtn: false,
                                    btn: ['确定']
                                });
                            }
 		 				}
 		 			}
 		 		}else{
 		 			if(wfurlList.length>0){
 		 				parent.layer.confirm(msg,{
	 						title:'提示',
	 						icon:5,
	 						btn : ['去办理'],
	 						cancel:function(index){
	 							changeUrlToWFUrl(wfurlList);
	 						}
	 					}, function (index) {
	 						changeUrlToWFUrl(wfurlList);
                        });
 		 			} else {
 		 				parent.layer.confirm(msg,{
	 						title:'提示',
	 						icon:5,
	 						btn : ['确定'],
	 						cancel:function(index){
	 							changeUrlToWFUrl(wfurlList);
	 						}
	 					}, function (index) {
	 						changeUrlToWFUrl(wfurlList);
                        });
 		 			}
 		 		}
 			},
 			error:function(){
 				parent.layer.alert('由于链接超时或网络异常导致逾期申报校验失败，请稍候刷新重试！', {icon: 5});
 			}
 		});
	}
}

/*
 * 跳转显示违法处罚信息的页面,没有关闭页面
 */
function changeUrlToWFUrl(wfurlList){
	if(wfurlList && wfurlList.length!=0){
		var gnurl=wfurlList[0].gnurl;
		var url= parent.location.protocol + "//" + parent.location.host +gnurl;
		parent.parent.window.location.href = url;
	} else {
		closeWindow();
	}
}

/*
 * 关闭页面
 */
function closeWindow(){
	if(navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            parent.window.opener = null;
            parent.window.close();
        } else {
            parent.window.open('', '_top');
            parent.window.top.close();
        }
    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        parent.window.location.href = 'about:blank ';
        parent.window.close();
    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
        parent.top.open(location, '_self').close();
    } else {
        parent.window.open('', '_top');
        parent.window.top.close();
    }
}

/**
 * 当进入申报表系统自动选择Y时，弹出提示框提示：“增值税年应税销售额超过小规模纳税人标准应当登记为一般纳税人而未登记，
 * 经税务机关通知，逾期仍不办理登记的，自逾期次月起不再适用减征优惠。”点击按钮“知道了” 关闭提示框可继续处理业务。
 */
function xgmtisp(){
	//如果是2019-01-01之前则不需要提示
	var qcs = formData.qcs;
	var skssqz = formData.yyssbbdxxVO.yhssb.sbbhead.skssqq;
	var skssqq = formData.yyssbbdxxVO.yhssb.sbbhead.skssqz;
	if(DATE_CHECK_TIME(skssqz,'2019-01-01') || DATE_CHECK_TIME(skssqq,'2019-01-01')){
		//skssqz<2019-01-01 || skssqq<2019-01-01
		return "";
	}
	var bqsfsyxgmyhzc = "N";
	if(isNotEmptyObject(qcs.jzxx) && isNotEmptyObject(qcs.jzxx.xgmzg)){
		bqsfsyxgmyhzc = qcs.jzxx.xgmzg.sfzzsxgmjz;
	}
	if("Y"!=bqsfsyxgmyhzc){
		return "";
	}
    if (typeof isJmsb !== "function"
        || (typeof isJmsb === "function" && !isJmsb())) {
        //当纳税人是本期非增值税小规模纳税人
        var tips="增值税年应税销售额超过小规模纳税人标准应当登记为一般纳税人而未登记， 经税务机关通知，逾期仍不办理登记的，自逾期次月起不再适用减征优惠。";
        var b=layer.confirm(tips,{
            area: ['300px','250px'],
            title:'提示',
            closeBtn: false,
            btn : ['知道了']
        },function(index){
            layer.close(b);
        });
    }

}

/**
 * 初始化本期是否适用增值税小规模纳税人减征政策
 * ①纳税人符合小规模减征时，默认选Y，可修改。
 * ②纳税人不符合小规模减征时，默认不选，可修改。
 * 更正时带出更正的
 * */
var gzCshBqsfsyxgmyhzc = false;
function jzzc_bqsfsyxgmyhzc(){
	//如果是2019-01-01之前则返回""
	var qcs = formData.qcs;
	var skssqz = formData.yyssbbdxxVO.yhssb.sbbhead.skssqq;
	var skssqq = formData.yyssbbdxxVO.yhssb.sbbhead.skssqz;
    var bqsfsyxgmyhzc = "";
    var isGzsb = formData.qcs.initData.isGzsb;
    if("Y"==isGzsb && !gzCshBqsfsyxgmyhzc){
        //更正时减征比例取接口返回的
        bqsfsyxgmyhzc = formData.yyssbbdxxVO.yhssb.sbbhead.bqsfsyxgmyhzc;
        gzCshBqsfsyxgmyhzc = true;
        return bqsfsyxgmyhzc;
    }
	if(DATE_CHECK_TIME(skssqz,'2019-01-01') || DATE_CHECK_TIME(skssqq,'2019-01-01')){
		//skssqz<2019-01-01 || skssqq<2019-01-01
		return "N";
	}
    if(qcs.jzxx.xgmzg.jzznsrzglx =='03' && !DATE_CHECK_TIME(skssqq,'2019-01-01')){
        return "N";
    }
    if(qcs.jzxx.xgmzg.jzznsrzglx =='04' && !DATE_CHECK_TIME(skssqq,'2019-01-01')){
        return "N";
    }
	if(isNotEmptyObject(qcs.jzxx) && isNotEmptyObject(qcs.jzxx.xgmzg)){
		bqsfsyxgmyhzc = qcs.jzxx.xgmzg.sfzzsxgmjz;
	}
	if(bqsfsyxgmyhzc!="Y"){
		bqsfsyxgmyhzc = "N";
	}
	return bqsfsyxgmyhzc;
}

/**
 * 计算本期增值税小规模纳税人减征政策-减征比例（%）
 * 
 * */
function jzzc_phjzbl(bqsfsyxgmyhzc){
	//如果是2019-01-01之前则返回0
	var qcs = formData.qcs;
	var skssqz = formData.yyssbbdxxVO.yhssb.sbbhead.skssqq;
	var skssqq = formData.yyssbbdxxVO.yhssb.sbbhead.skssqz;
	if(DATE_CHECK_TIME(skssqz,'2019-01-01') || DATE_CHECK_TIME(skssqq,'2019-01-01')){
		//skssqz<2019-01-01 || skssqq<2019-01-01
		return 0.00;
	}
	if("Y"!=bqsfsyxgmyhzc){
		//不是小规模标志则不计算
		return 0;
	}
	//印花税只有一个征收项目，jzbl只取第一个
	var phjzbl = 0.00;
	if(isNotEmptyObject(qcs.jzxx) && isNotEmptyObject(qcs.jzxx.jzxxMxList)){
		var jzxxMxList = qcs.jzxx.jzxxMxList;
		if(jzxxMxList.length>0){
			var vo = jzxxMxList[0];
			if(isNotEmptyObject(vo.jzbl)){
				phjzbl = vo.jzbl;
			}
		}
	}
	phjzbl = ROUND(phjzbl,6);
	return phjzbl;
	
}


function isNotEmptyObject(obj){
	if(obj!=null&&obj!=undefined&&obj!=""){
		return true;
	}else{
		return false;
	}
}


//判断
function bResult(result){
	if(result=='false'){
		return false;
	}else{
		return true;
	}
}


function ymTip(bqsfsyxgmyhzc) {
      if ((formData.qcs.jzxx.xgmzg.jzznsrzglx == '03' || formData.qcs.jzxx.xgmzg.jzznsrzglx == '04') && formData.yyssbbdxxVO.yhssb.sbbhead.bqsfsyxgmyhzc == 'Y' && !DATE_CHECK_TIME(formData.yyssbbdxxVO.yhssb.sbbhead.skssqq,'2019-01-01')) {
          var tips="申报属期内同时存在一般人和小规模两种纳税人状态，若使用该申报功能，系统会全额计算减征额，请自行折算并修改减征额。";
          parent.layer.confirm(tips,{
              title:'提示',
              closeBtn: false,
              btn : ['确定']
          })
      }
    return true;
}