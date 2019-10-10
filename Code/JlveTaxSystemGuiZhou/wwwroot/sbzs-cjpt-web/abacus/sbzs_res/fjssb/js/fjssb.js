function extMethods(mathFlag,newData,olddata,scope){
	
	//是“增值税小规模纳税人季中转一般纳税人”：（jzznsrzglx=03）
	//进入申报表页面，初始化弹出提示框：申报属期内同时存在一般人和小规模两种纳税人状态，若使用该申报功能，系统会全额计算减征额，请自行折算并修改减征额。点击【确定】按钮，弹出框关闭。
	//ng-init初始化执行
	if ("jzznsrVaild"==mathFlag){		
		jzznsrVaild();
	}

	if ("needChangePhjmse"==mathFlag){		
		needChangePhjmse(newData,scope);
	}
}

/**
 * 
 * 此方法原为初始化提示
 * JSONE-5807此提示废弃（暂时留在这里，万一以后又要修改成初始化提示，可以直接使用）
 */
function jzznsrVaild(){
	//是否使用季中转规则的配置项
	var allowJzz=parent.formData.qcs.jzxx.xgmzg.allowJzz;
	//未配置或配置不为Y，跳过校验
	if(allowJzz=="N"){
		return;
	}
	//季中转纳税人类型
	var jzznsrzglx = parent.formData.qcs.jzxx.xgmzg.jzznsrzglx;
	if(jzznsrzglx=="03"){
		var tips="申报属期内同时存在一般人和小规模两种纳税人状态，若使用该申报功能，系统会全额计算减征额，请自行折算并修改减征额。";
		var b=layer.confirm(tips,{
			title:'提示',
			closeBtn: false,
			btn : ['确定']
		},function(index){
			layer.close(b);
		}); 
		return;
	}
}

/**
 * JSONE-5807 原来此块为初始化提示，现改为节点调整为Y触发）
 * 是“季中转的纳税人”：（jzznsrzglx=03、04）本期是否适用增值税小规模纳税人减征政策bqsfsyxgmyhzc修改为Y时，
 * 弹出提示框：申报属期内同时存在一般人和小规模两种纳税人状态，若使用该申报功能，系统会全额计算减征额，请自行折算并修改减征额。点击【确定】按钮，弹出框关闭。
 */
function jzznsrVaildTips(bqsfsyxgmyhzc){
	//是否使用季中转规则的配置项
	var allowJzz=formData.qcs.jzxx.xgmzg.allowJzz;
	//未配置或配置不为Y，跳过校验
	if(allowJzz=="N"){
		return;
	}
	//季中转纳税人类型
	var jzznsrzglx = formData.qcs.jzxx.xgmzg.jzznsrzglx;
	if((jzznsrzglx=="03"||jzznsrzglx=="04")&&bqsfsyxgmyhzc=='Y'){
		var tips="申报属期内同时存在一般人和小规模两种纳税人状态，若使用该申报功能，系统会全额计算减征额，请自行折算并修改减征额。";
		var b=layer.confirm(tips,{
			title:'提示',
			closeBtn: false,
			btn : ['确定']
		},function(index){
			layer.close(b);
		}); 
		return;
	}
}

function needChangePhjmse(newData,scope){
	var zspmDm=newData.split("%%")[0];
	var changed=newData.split("%%")[1];
	var bqsfsyxgmyhzc=parent.formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc;
	var sbxxGridlbVOArr = parent.formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	var index=0;
	for (var i = 0; i < sbxxGridlbVOArr.length; i++){
    	if(zspmDm==sbxxGridlbVOArr[i].zspmDm){
    		index=i;
    	}
    }
	var jpath="";
	if(changed=="ybzzs"){
		jpath = "fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].ybzzs";
		parent.formulaEngine.apply(jpath,sbxxGridlbVOArr[index].ybzzs);
	}else if(changed=="zzsmdse"){
		jpath = "fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].zzsmdse";
		parent.formulaEngine.apply(jpath,sbxxGridlbVOArr[index].zzsmdse);
	}else if(changed=="xfs"){
		jpath = "fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].xfs";
		parent.formulaEngine.apply(jpath,sbxxGridlbVOArr[index].xfs);
	}else if(changed=="yys"){
		jpath = "fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].yys";
		parent.formulaEngine.apply(jpath,sbxxGridlbVOArr[index].yys);
	}else if(changed=="jme"){
		jpath = "fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].jme";
		parent.formulaEngine.apply(jpath,sbxxGridlbVOArr[index].jme);
	}
	var phjmse =parent.calPhjmse(zspmDm,changed);
	sbxxGridlbVOArr[index].phjmse=phjmse;
	jpath="fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO["+index+"].phjmse";
	parent.formulaEngine.apply(jpath,phjmse);
	viewEngine.tipsForVerify(document.body);
	viewEngine.formApply($('#viewCtrlId'));
}


//0610012001010001311公式调用该方法获取ybzzs的值
function fjssbYbzzs(value, zsxmDm, zspmDm) {
    var gzsbBz = formData.qcs.initData.fjssbInitData.gzsbBz;
    var sbxxGridlbVOArr = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
    //如果为更正申报的话，就作废公式的值，取formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO.ybzzs节点的值
    if ((gzsbBz != null && gzsbBz == "1") || (parent.location.href.indexOf("gzsb=") > 0)){
        //遍历取对应节点的ybzzs值
        for (var i = 0; i < sbxxGridlbVOArr.length; i++){
            if (zsxmDm == sbxxGridlbVOArr[i].zsxmDm && zspmDm == sbxxGridlbVOArr[i].zspmDm){
                return sbxxGridlbVOArr[i].ybzzs;
            }
        }
    }
    return value;
}
/**
 * 减免优惠提示
 * 当享受的时候，fjsnsrxxForm下的bqsfsyxgmyhzc节点传Y，且sbxxGridlbVO各明细行的sbxxGridlbVO也要传Y； 
 * 当不享受的时候，fjsnsrxxForm下的bqsfsyxgmyhzc节点传N即可，明细行不用传此节点。 
 * Add by C.Q 20190131 23:35
 * 水利建设不享受普惠减免
 */
function bqsfsyxgmyhzcToSbxxGridlbVO(bqsfsyxgmyhzc){
	var sbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	for (var i = 0; i < sbxxGridlbVO.length; i++) {
		if (bqsfsyxgmyhzc == 'Y' && sbxxGridlbVO[i].zsxmDm !='30221') {
			sbxxGridlbVO[i].bqsfsyxgmyhzc = 'Y';
		} else {
            sbxxGridlbVO[i].bqsfsyxgmyhzc = '';
            sbxxGridlbVO[i].phjmse = 0;
            sbxxGridlbVO[i].phjmxzDm = '';
            sbxxGridlbVO[i].phjzbl = 0;
            sbxxGridlbVO[i].phjmswsxDm = '';
            sbxxGridlbVO[i].phjmxzMc = '';
		}
	}
	return sbxxGridlbVO[0].bqsfsyxgmyhzc;
}

/**
 * 提交前处理
 * 当不享受的时候，删除节点<phjmse>0.0</phjmse>，<phjmxzDm>、<phjzbl>、<bqsfsyxgmyhzc>、<phjmswsxDm>。
 * Add by 黄健 20190214 16:18
 */
function bqsfsyxgmyhzcFilterInSbxxGridlbVO(){
    var sbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
    for (var i = 0; i < sbxxGridlbVO.length; i++) {
        if (sbxxGridlbVO[i].bqsfsyxgmyhzc == '') {
            delete sbxxGridlbVO[i].bqsfsyxgmyhzc;
            //delete sbxxGridlbVO[i].phjmse;
            delete sbxxGridlbVO[i].phjmxzDm;
            delete sbxxGridlbVO[i].phjzbl;
            delete sbxxGridlbVO[i].phjmswsxDm;
            delete sbxxGridlbVO[i].phjmxzMc;
        }
    }
    return sbxxGridlbVO[0].bqsfsyxgmyhzc;
}
/**
 * 减免优惠提示
 * 当一般纳税人 点击“是否适用增值税小规模纳税人减征优惠”选择是时，弹出提示框提示：“增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？”
 * 点击按钮“是” 关闭提示框 ，并默认选中是；点“否” 则选中否。
 * Add by C.Q 20190131 23:35
 */
function jmyhTips(bqsfsyxgmyhzc,sfzzsxgmjz,qzjyXgmFlag){
	//默认提示语
	var tips="增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？";
	var width = "230px";
	var height= "210px";
	var qdBtn = "是";
	var qxBtn = "否";
	var titleTips = "提示";
	var btn1Callback = function(index){
		layer.close(b);
	};
	var btn2Callback = function(index){
		//点击取消自动选为否。
		formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc = "N";
		//重新执行相关公式
		var _jpath = "fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc";
		formulaEngine.apply(_jpath,"N");
		// 去子页面刷新视图，子页面需要引入var subViewCustomScripts = ["/sbzs_res/fjssb/js/fjssb_cus.js"];
		$("#frmSheet")[0].contentWindow.refreshView();
		layer.close(b);
		/*viewEngine.formApply($('#viewCtrlId'));
		viewEngine.tipsForVerify(document.body);*/
	};
	//广东、陕西个性化提示语
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	if((swjgDm !=null && swjgDm != "") && (swjgDm.substring(0,3)=="144" || swjgDm.substring(0,3)=="161")){
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
		qdBtn = "取消（不需享受减免）";
		qxBtn = "确定（仍要享受减免）";
		width = "700px";
		height = "430px";
		titleTips = "";
		var tmpCallback = btn1Callback;
		btn1Callback = btn2Callback;
		btn2Callback = tmpCallback;
	}
	if (bqsfsyxgmyhzc=='Y' && sfzzsxgmjz=='N' && qzjyXgmFlag=='N' && (typeof isJmsb === "function") && !isJmsb()) {
		var b=layer.confirm(tips,{
			area: [width,height],
			title:titleTips,
			closeBtn: false,
			btn : [qdBtn,qxBtn],
			btn1:btn1Callback,
			btn2:btn2Callback
		});
	}
	//返回true不提示，提示改由上面弹框处理
	return true;
}

//公式调用该方法获取tempJmxzDm,初始化教育费附加30203，地方教育费附加30216减免性质
function cshjmxz(skssqq, skssqz, bqynsfehj) {
	if(formData.qcs.initData.fjssbInitData.gzsbBz=="1"){//更正申报
		return;
	}
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	var qsSbxxGridlbVO = formData.qcs.formContent.fjssbb.body.sbxxGrid.sbxxGridlbVO;
	var tjSbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	for(var i=0;i<qsSbxxGridlbVO.length;i++){
		//计算hj值 等同于06100120010100018公式
//		qsSbxxGridlbVO[i].hj = qsSbxxGridlbVO[i].ybzzs+qsSbxxGridlbVO[i].zzsmdse+qsSbxxGridlbVO[i].xfs+qsSbxxGridlbVO[i].yys;
//		var jsyjHj = qsSbxxGridlbVO[i].hj;
//		if(qsSbxxGridlbVO[i].zspmDm=="302030300" || qsSbxxGridlbVO[i].zspmDm=="302160300"){
//    		jsyjHj = xfsToZzs_jsyj(qsSbxxGridlbVO[i].hj,qsSbxxGridlbVO[i].zspmDm);
//    	}
        if(tjSbxxGridlbVO[i].bqynsfe == 0){
        	if(qsSbxxGridlbVO[i].zsxmDm=="30203" || qsSbxxGridlbVO[i].zsxmDm=="30216"){
        		formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = "";//清空减免性质
        	}
        	continue;	
        }
		//福建、陕西30216带出0061042802   SNSWJ-733(去掉陕西个性化)
		if(qsSbxxGridlbVO[i].zsxmDm=="30203" || (swjgDm.substring(0,3)=="135" && qsSbxxGridlbVO[i].zsxmDm=="30216")){
			var xxsr = qsSbxxGridlbVO[i].xssr;
            //如果附加税初始化报文既有增值税附加又有消费税附加，则以增值税附加初始化报文<xssr>为准判断是否达到起征点。（北京、福建、广东、陕西）
            xxsr = xfsToZzs_xssr(xxsr,qsSbxxGridlbVO[i].zspmDm);

            if(((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xxsr<=100000 && xxsr>0) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xxsr<=300000 && xxsr>0)){
                var jmxzList = formData.qcs.formContent.fjssbb.body.sbxxGrid.jmxxlist.option;
				for(var j=0;j<jmxzList.length;j++){
					if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0061042802" && jmxzList[j].swsxDm=="SXA031900783"){
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0061042802";
					}
				}
				//地方教育附加选不到0061042802，暂时设置其他（四川个性化，由于其他没选项时也会出现这情况，故先统一默认为其他）。liji，20190505
				if (!formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm) {
					for(var j=0; j<jmxzList.length; j++){
						if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0099129999"){
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0099129999";
						}
					}
				}
			}
		}else if(qsSbxxGridlbVO[i].zsxmDm=="30216"){
            var xxsr = qsSbxxGridlbVO[i].xssr;
            //如果附加税初始化报文既有增值税附加又有消费税附加，则以增值税附加初始化报文<xssr>为准判断是否达到起征点。（北京、福建、广东、陕西）
            xxsr = xfsToZzs_xssr(xxsr,qsSbxxGridlbVO[i].zspmDm);
            if(((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xxsr<=100000 && xxsr>0) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xxsr<=300000 && xxsr>0)){
                var jmxzList = formData.qcs.formContent.fjssbb.body.sbxxGrid.jmxxlist.option;
				for(var j=0;j<jmxzList.length;j++){
					if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0099042802"){
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0099042802";
					}
				}
				//地方教育附加选不到0061042802，暂时设置其他（四川个性化，由于其他没选项时也会出现这情况，故先统一默认为其他）。liji，20190505
				if (!formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm) {
					for(var j=0; j<jmxzList.length; j++){
						if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0099129999"){
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0099129999";
						}
					}
				}
			}
		}
	}
}

/**
 * 消费税销售收入转增值税销售收入
 */
function xfsToZzs_xssr(xssr,xfsZspmDm) {
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
    //如果附加税初始化报文既有增值税附加又有消费税附加，则以增值税附加初始化报文<xssr>为准判断是否达到起征点。（北京、福建、广东、陕西）
    if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="111" || swjgDm.substring(0,3)=="135" || swjgDm.substring(0,3)=="161" || swjgDm.substring(0,3)=="144")){
    	var qsSbxxGridlbVO = formData.qcs.formContent.fjssbb.body.sbxxGrid.sbxxGridlbVO;
    	if (xfsZspmDm == '302030300') {
            for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                if (qsSbxxGridlbVO[j].zspmDm == '302030100') {
                	xssr = qsSbxxGridlbVO[j].xssr;
                	break;
                }
            }
        }else if (xfsZspmDm == '302160300') {
            for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                if (qsSbxxGridlbVO[j].zspmDm == '302160100') {
                	xssr = qsSbxxGridlbVO[j].xssr;
                	break;
                }
            }
        }
    }
    return xssr;
}

/**
 * 消费税计税依据转增值税计税依据
 */
function xfsToZzs_jsyj(jsyj,xfsZspmDm) {
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
    //如果附加税初始化报文既有增值税附加又有消费税附加，则以增值税附加初始化报文<jsyj>为准判断是否达到起征点。（北京、福建、广东、陕西）
    if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="111" || swjgDm.substring(0,3)=="135" || swjgDm.substring(0,3)=="161" || swjgDm.substring(0,3)=="144")){
    	var qsSbxxGridlbVO = formData.qcs.formContent.fjssbb.body.sbxxGrid.sbxxGridlbVO;
    	if (xfsZspmDm == '302030300') {
            for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                if (qsSbxxGridlbVO[j].zspmDm == '302030100') {
                	jsyj = qsSbxxGridlbVO[j].hj;
                	break;
                }
            }
        }else if (xfsZspmDm == '302160300') {
            for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                if (qsSbxxGridlbVO[j].zspmDm == '302160100') {
                	jsyj = qsSbxxGridlbVO[j].hj;
                	break;
                }
            }
        }
    }
    return jsyj;
}

/**
 * 若ZSPM_DM的初始化报文<xssr>节点的值为0，则弹出提示框“尊敬的纳税人，系统未获取到您本期的销售收入，请确认主税是否已申报。”点击“确定”关闭提示框，不阻断申报。
 * 注：任意一条增值税附征、消费税附征ZSPM_DM的初始化报文<xssr>节点的值为0时均提示
 */
function xssrTip() {
	if(formData.qcs.initData.fjssbInitData.gzsbBz=="1"){//更正申报
		return;
	}
	var sbxxGridlbVO = formData.qcs.formContent.fjssbb.body.sbxxGrid.sbxxGridlbVO;
	var xfsCount = formData.qcs.initData.fjssbInitData.xfsCount; // 消费税主税申报数量
	var ybrOrXgmCount = formData.qcs.initData.fjssbInitData.ybrOrXgmCount; // 一般人或者小规模主税申报数量
	for(var i=0;i<sbxxGridlbVO.length;i++){
		if(sbxxGridlbVO[i].xssr == "0" && (sbxxGridlbVO[i].zsxmDm == "30203" || sbxxGridlbVO[i].zsxmDm == "30216" || sbxxGridlbVO[i].zsxmDm == "30221")){
			if (xfsCount == 0||ybrOrXgmCount == 0 && (typeof isJmsb === "function") && !isJmsb()) {
				var tips="尊敬的纳税人，系统未获取到您本期的销售收入，请确认主税是否已申报？";
				var b=layer.confirm(tips,{
					title:'提示',
					closeBtn: false,
					btn : ['确定']
				},function(index){
					layer.close(b);
				}); 
				return;
			}
		}
	}
}

function jyqzdjmxz(skssqq,skssqz,xssr,jmxzKey,tempJmxzDm,zsxmDm,zspmDm) {
	if(zspmDm=="302030300" || zspmDm=="302160300"){
		xssr = xfsToZzs_xssr(xssr,zspmDm);
	}
	if(jmxzKey!=undefined && (jmxzKey.indexOf("0099042802")==0 || jmxzKey.indexOf("0061042802")==0) &&(((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xssr>100000) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xssr>300000))){
		return false;
	}
	return true;
}

/**
 * 计算销售额不满10万（月度）、30万（季度）
 */
function jsxxsr(skssqq, skssqz,xssr) {
	//GDSDZSWJ-10700 广东、青海个性化 不需要锁定  GDSDZSWJ-11657——广东需要自动带出
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="163" || swjgDm.substring(0,3)=="152")){
		return false;
	}
	if(xssr ==0 ||((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xssr>100000) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xssr>300000)){
		return false;
	}	
	return true;
	

}

/**
 * 校验是否可继续申报附加税
 */
function errorsAndWarnsAlert() {
	var sfbksb = false;//是否不可申报
	//错误提示
	if (errors != null && errors !== '' && errors !== '[]') {
		sfbksb = true;
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

		window.parent.layer.load(2, {shade : 0.3});
		window.parent.layer.alert(myErrors, {
			title : '提示',
			closeBtn : 0,
			yes : function(index) {
				if (navigator.userAgent.indexOf("MSIE") > 0) {
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
					/*
					 * window.location.href = 'about:blank '; window.close();
					 */
					parent.top.open(location, '_self').close();
				} else {
					parent.window.open('', '_top');
					parent.window.top.close();
				}
			}
		});
	}else if (warns != null && warns !== '' && warns !== '[]') {
		//静默申报直接返回，不需判断
		if((typeof isJmsb === "function") && isJmsb()){
			return sfbksb;
		}
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
        window.parent.layer.load(2, {shade : 0.3});
		window.parent.layer.alert(myWarns, {
			title : '提示',
			closeBtn : 0,
			btn : [ '继续申报', '关闭' ],
			btn1 : function(index) {
				// 继续申报只关闭提示
				window.parent.layer.close(index);
			},
			btn2 : function(index) {
				if (navigator.userAgent.indexOf("MSIE") > 0) {
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
					/*
					 * window.location.href = 'about:blank '; window.close();
					 */
					parent.top.open(location, '_self').close();
				} else {
					parent.window.open('', '_top');
					parent.window.top.close();
				}
			}
		});
    }
	return  sfbksb;
}
   

//校验是否是企业重点群体人员
function jysfqyzdqtry(jmxzDm,jmxzKey, qyzdrq){
	if((jmxzKey != null && jmxzKey != "") &&  "0007013612_0007013613_0061013610_0061013611_0099013603_0099013604".search(jmxzKey.split("_")[0]) !=-1){
		return qyzdrq=='Y';
	}
	return true;
}

//当前是否是代理代理申报，若不是，清空代理人信息
function dqsfdlsb(sfdlsb){
	if(sfdlsb=="N"){
		var fjsslxxForm = formData.fjsSbbdxxVO.fjssbb.fjsslxxForm;
		fjsslxxForm.dlr="";
		fjsslxxForm.dlrsfzjzlDm1="";
		fjsslxxForm.dlrsfzh="";
	}
}

function jsxxsr_sx(skssqq, skssqz,xssr,ssjmxzdm) { 
	if(ssjmxzdm!="0061042802" && ssjmxzdm!="0099042802"){ 
		return false; 
	}	
	return true; 
}

/**
 * 控制减免性质是否锁定
 */
function controllerJmxz(swjgDm,zsxmDm,skssqq,skssqz,xssr,zspmDm,jsyjHj,bqynsfe) {
	if(formData.qcs.initData.fjssbInitData.gzsbBz=="1"){//更正申报
		return false;
	}
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	// 销售收入月度是否大于10w、季度大于30w 大于——false，小于——true（北京、福建、广东）
    if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="111" || swjgDm.substring(0,3)=="135" || swjgDm.substring(0,3)=="144")){
    	if(zspmDm=="302030300" || zspmDm=="302160300"){
    		xssr = xfsToZzs_xssr(xssr,zspmDm);
    //		jsyjHj = xfsToZzs_jsyj(jsyjHj,zspmDm);
    	}
    	if(zspmDm=="302030300" || zspmDm=="302160300" || zspmDm=="302160100" || zspmDm=="302030100"){
    		if(bqynsfe==0 || xssr==0 ||xssr<0 || ((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xssr>100000) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xssr>300000)){
        		return false;
        	}
        	return true;
    	}
    }
    return false;//其余放开
}

/**
 * 初始化减征比例
 * 取HX_CS_ZDY.CS_GY_XTCS的CSZ
 * 如CSZ为空或核心未配置，默认jzbl=0.3，有效期2019-01-01~2999-12-31
 * 参数说明：参数值为产教融合型企业投资额可享受减征比例，属期之间用~号隔开，属期和比例之间用“：”隔开，可以配置多个比例，中间以英文逗号分隔，如：
 *		2019-01-01~2019-12-31:0.3,2020-01-01~2999-12-31:0.2
 *		未配置的话，程序默认为 :2019-01-01~2999-12-31:0.3
 *		配置后，未覆盖的时间区间，比例默认为“0”
 */
function cshJzbl(skssqq,skssqz) {
	var jzblCsz = formData.qcs.initData.fjssbInitData.jzblCsz;
	if(skssqq.substring(0,4)>2018){
		if(jzblCsz==undefined || jzblCsz=="" || jzblCsz=="undefined" || jzblCsz==null){
			return 0.3;
		}else if(jzblCsz.indexOf(",")>0){
			var cszList = jzblCsz.split(",");
			var cszStr;
			var csz_sqq;
			var csz_sqz;
			var csz_jzbl;
			for(var i=0;i<cszList.length;i++){
				cszStr = cszList[i];
				if(cszStr.indexOf(":")>0){
					csz_sqq = cszStr.substring(0,cszStr.indexOf("~"));
					csz_sqz = cszStr.substring(cszStr.indexOf("~")+1,cszStr.indexOf(":"));
					csz_jzbl = cszStr.substring(cszStr.indexOf(":")+1).trim();
					if(dateToNum(csz_sqq)<=dateToNum(skssqq) && dateToNum(skssqz)<=dateToNum(csz_sqz)){
						return csz_jzbl;
					}
				}
			}
			return 0;
		}else if(jzblCsz.indexOf(":")>0){
			var cszStr = jzblCsz;
			var csz_sqq = cszStr.substring(0,cszStr.indexOf("~"));
			var csz_sqz = cszStr.substring(cszStr.indexOf("~")+1,cszStr.indexOf(":"));
			var csz_jzbl = cszStr.substring(cszStr.indexOf(":")+1).trim();
			if(dateToNum(csz_sqq)<=dateToNum(skssqq) && dateToNum(skssqz)<=dateToNum(csz_sqz)){
				return csz_jzbl;
			}else{
				return 0;
			}
		}else{
			return jzblCsz;
		}
	}
}

/**
 *	日期格式yyyy-mm-dd转为数字
 */
function dateToNum(dateStr) {
	if(dateStr.indexOf("-")>0){
		dateStr = dateStr.trim();
		dateStr = dateStr.replace(/-/g,"");
	}
	return dateStr;
}

/**
 *征收项目为“教育费附加”zsxm_dm=30203、“地方教育费附加”zsxm_dm=30216，使用如下规则：
 *（2.1）若“当期新增投资额”×“减征比例”+“上期留抵可抵免金额”-教育费附加“7-9-12”栏-地方教育附加“7-9-12”栏≥0。--06100120010100107 
 *	征收项目为[教育费附加]zsxm_dm=30203的第14栏“本期抵免金额”=教育费附加行“7-9-12”栏 
 *	征收项目为[地方教育费附加] zsxm_dm=30216的第14栏“本期抵免金额”=地方教育费附加行“7-9-12”栏 
 *（2.2）若“当期新增投资额”×“减征比例”+“上期留抵可抵免金额”-教育费附加“7-9-10”栏-地方教育附加“7-9-12”栏 < 0。--06100120010100108 
 *教育费附加第14列“本期抵免金额”=（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）× [教育费附加实际征收费率÷（教育费附加实际征收费率+地方教育附加实际征收费率）] ÷（教育费附加征收品目的实际个数）
 *增值税地方教育费附加（zspm_dm=302160100）第14列 “本期抵免金额”=[（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）-教育费附加第14栏“本期抵免金额_合计”] ÷（地方教育费附加征收品目的实际个数）
 *消费税地方教育费附加（zspm_dm=302160300）第14列 “本期抵免金额”=[（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）-教育费附加第14列“本期抵免金额_合计”] - 增值税地方教育费附加的“本期抵免金额”
 */
function jsDmje(dqxzktme,sqldkdmje,bqsfsycjrhxqyjzzc,bqynsfehj,jmehj,phjmsehj) {
	var tjSbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	var dkje = dqxzktme+sqldkdmje;//“当期新增可抵免投资额” ×“减征比例”+“上期留抵可抵免金额”
	var fjHj = 0;//教育费附加“7-9-12”栏与地方教育附加“7-9-12”栏的合计
	var jyCount = 0;//教育费附加信息条数
	var dfjyCount = 0;//教育费附加信息条数
	var jySl = 0.03;//教育费附加费率
	var dfjySl = 0.02;//地方教育费附加费率
	var bqcjrhxqydmjehj = 0;//抵免金额合计值
	var slHj = 0;//实际征收费率合计
	for(var i=0;i<tjSbxxGridlbVO.length;i++){
		var kjye = tjSbxxGridlbVO[i].bqynsfe - tjSbxxGridlbVO[i].jme - tjSbxxGridlbVO[i].phjmse;//剩余可减余额
		if(tjSbxxGridlbVO[i].zsxmDm=="30203" && kjye>=0){
			fjHj = fjHj + kjye;
			jySl = tjSbxxGridlbVO[i].sl1;
			slHj = slHj + tjSbxxGridlbVO[i].sl1;
			jyCount++;
		}
		if(tjSbxxGridlbVO[i].zsxmDm=="30216" && kjye>=0){
			fjHj = fjHj + kjye;
			dfjySl = tjSbxxGridlbVO[i].sl1;
			slHj = slHj + tjSbxxGridlbVO[i].sl1;
			dfjyCount++;
		}
	}
	if(dqxzktme+sqldkdmje-fjHj>=0){
		for(var i=0;i<tjSbxxGridlbVO.length;i++){
			if(tjSbxxGridlbVO[i].zsxmDm=="30203" || tjSbxxGridlbVO[i].zsxmDm=="30216"){
				if(tjSbxxGridlbVO[i].bqynsfe - tjSbxxGridlbVO[i].jme - tjSbxxGridlbVO[i].phjmse<0 || bqsfsycjrhxqyjzzc=="N"){
					formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = 0;
					continue;
				}
				var bqdmje = tjSbxxGridlbVO[i].bqynsfe - tjSbxxGridlbVO[i].jme - tjSbxxGridlbVO[i].phjmse;
				formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = bqdmje;
				bqcjrhxqydmjehj = bqcjrhxqydmjehj + bqdmje;
			}
		}
	}else{
		for(var i=0;i<tjSbxxGridlbVO.length;i++){
			if(tjSbxxGridlbVO[i].bqynsfe - tjSbxxGridlbVO[i].jme - tjSbxxGridlbVO[i].phjmse<0 || bqsfsycjrhxqyjzzc=="N"){
				formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = 0;
				continue;
			}
			if(tjSbxxGridlbVO[i].zsxmDm=="30203"){
				//教育费附加第14列“本期抵免金额”=（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）× [教育费附加实际征收费率÷（教育费附加实际征收费率+地方教育附加实际征收费率）] ÷（教育费附加征收品目的实际个数）
				var bqdmje = ROUND(dkje*(tjSbxxGridlbVO[i].sl1/slHj),2);
				formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = bqdmje;
				bqcjrhxqydmjehj = bqcjrhxqydmjehj + bqdmje;
			}
			if(tjSbxxGridlbVO[i].zspmDm=="302160100"){
				//增值税地方教育费附加（zspm_dm=302160100）第14列 “本期抵免金额”=[（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）-教育费附加第14栏“本期抵免金额_合计”] ÷（地方教育费附加征收品目的实际个数）
				var bqdmje = ROUND((dkje-ROUND(dkje*jySl/slHj,2)*jyCount)/dfjyCount,2);
				formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = bqdmje;
				bqcjrhxqydmjehj = bqcjrhxqydmjehj + bqdmje;
			}
			if(tjSbxxGridlbVO[i].zspmDm=="302160300"){
				//消费税地方教育费附加（zspm_dm=302160300）第14列 “本期抵免金额”=[（“当期新增投资额” ×“减征比例”+“上期留抵可抵免金额”）-教育费附加第14栏“本期抵免金额_合计”]-增值税地方教育费附加
				var bqdmje = 0;
				if(dfjyCount==1){
					bqdmje = ROUND((dkje - ROUND(dkje*jySl/slHj,2)*jyCount - 0),2);
				}else{
					bqdmje = ROUND((dkje - ROUND(dkje*jySl/slHj,2)*jyCount - ROUND((dkje-ROUND(dkje*jySl/slHj,2)*jyCount)/dfjyCount,2)),2);
				}
				formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].bqcjrhxqydmje = bqdmje;
				bqcjrhxqydmjehj = bqcjrhxqydmjehj + bqdmje;
			}
		}
	}
	return bqsfsycjrhxqyjzzc=="N"?0:bqcjrhxqydmjehj;
}

//申报确认提示前执行业务特有校验
function doBeforeCtipsVerify(isSecondCall) {
	var bqsfsycjrhxqyjzzc = formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsycjrhxqyjzzc;
	var sqldkdmje = formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.sqldkdmje;
	var zgswskfjDm = formData.qcs.initData.nsrjbxx.zgswskfjDm;
	if (bqsfsycjrhxqyjzzc=='N'&&sqldkdmje>0&&zgswskfjDm.substring(0,3)=='135'){
		layer.confirm('您存在上期留抵可抵免金额，请确认本期是否适用产教融合型企业减征政策。',{
			icon : 3,
			title:'提示',
			btn : ['确认','取消'],
			cancel: function(index, layero){
				layer.close(index);
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			},
			btn2:function(index){
				layer.close(index);
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
		},function(index){
			layer.close(index);
			// 执行回调函数
			ctips(isSecondCall);
		});
	}else {
		ctips(isSecondCall);
	}
}

//一键零申报（判断数据是否符合，符合则触发申报提交事件）
function cfYjlsb(bqybtsehj){
	if(location.href.indexOf("yjlsb=Y")>-1){
		var jyhjFlag = true;
		var tjSbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
		for(var i=0;i<tjSbxxGridlbVO.length;i++){
			if(jyhjFlag && (tjSbxxGridlbVO[i].hj!=0 || tjSbxxGridlbVO[i].bqynsfe!=0 || tjSbxxGridlbVO[i].bqybtse!=0)){
				jyhjFlag = false;
				window.parent.parent.layer.alert('您本期主税应补退税额不为0，不符合一键零申报，请根据实际收入填写申报表', {
			        icon: -1, title: '提示',
			        btn : [ '关闭' ],
			        btn1: function (index) {
			        	window.parent.parent.layer.close(index);
			        	if (navigator.userAgent.indexOf("Firefox") > 0) {
	                        // Firefox浏览器
	                        window.parent.parent.parent.location.href = 'about:blank';
	                        window.parent.parent.parent.close();
	                    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
	                        // 谷歌浏览器
	                        window.parent.parent.parent.location.href = 'about:blank';
	                        window.parent.parent.parent.close();
	                    } else {
	                        // IE浏览器、360浏览器
	                        window.parent.parent.parent.open('', '_top');
	                        window.parent.parent.top.close();
	                    }
			            return;
			        }
			        ,cancel: function(index, layero){
			        	window.parent.parent.layer.close(index);
			        	if (navigator.userAgent.indexOf("Firefox") > 0) {
	                        // Firefox浏览器
	                        window.parent.parent.parent.location.href = 'about:blank';
	                        window.parent.parent.parent.close();
	                    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
	                        // 谷歌浏览器
	                        window.parent.parent.parent.location.href = 'about:blank';
	                        window.parent.parent.parent.close();
	                    } else {
	                        // IE浏览器、360浏览器
	                        window.parent.parent.parent.open('', '_top');
	                        window.parent.parent.top.close();
	                    }
			            return;
			        }
			    });
			}
		}
		if(jyhjFlag){
			prepareMake("Y");
		}
	}
}
/**
 * 针对IE8jQuery的isEmptyObject方法无法正确判断String或简单类型
 */
function isEmptyObj(obj){
	if(obj==""||obj==null||obj==undefined||JSON.stringify(obj) == "{}"){
		return true;
	}else{
		return false;
	}
}
