/**
 * 预缴校验：参数：申报金额sbje,预缴处理方式代码yjclfsDm：按征收项目校验，按征收品目校验，不校验。
 * 征收项目代码zsxmDm，征收品目代码zspmDm，预缴动态行节点yjGridlb。
 * 可选参数情况。
 * sbje,yjclfsDm,yjGridlb;参数个数：3
 * sbje/sbjexxlb,yjclfsDm,yjGridlb,yjGridlb_para,zsxmDm/zspmDm;参数个数5
 * sbjexxlb,yjclfsDm,yjGridlb,yjGridlb_para,zsxmDm/zspmDm,sbjexxlb_para参数个数6
 * 【动态行参数使用*】。
 * 参数描述：动态行参数如果为单个时，框架解析会处理为单节点。类型为number或者int，动态行参数如果
 * 为多行节点，框架解析会处理为数组。SUMIF传参必须为数组。
 */
function yjValidate(){
	if(arguments.length<3){//参数不足，默认校验不通过。
		throw "Wrong Parameter Number!" ;
	}
	var sbjeStr = arguments[0];
	var yjclfsDm = arguments[1];
	var yjGridlb = arguments[2];
	var sbje = 0;
	if(yjclfsDm == yjValidate.BYZYJ.yjfsDm){//不校验预缴
		return true;
	}
	if(typeof sbjeStr == "object"){//数组
		sbje = SUM(sbjeStr);
	}else{
		sbje = sbjeStr;
		sbjeStr = [sbjeStr];
	}
	if(yjclfsDm == yjValidate.YZYJDYL_BYZDX.yjfsDm){
		if(sbje >= 0){
			return true;
		}else{
			return false;
		}
	}else{
		if(arguments.length == 4){
			throw "Wrong Parameter Number!" ;
		}
	}
	if(sbje == null || sbje == undefined || isNaN(sbje)){
		sbje = 0;
	}
	if(arguments.length == 5){//参数个数为5，申报金额自主传参
		var column_value = arguments[4];
		var yjGridlb_para = arguments[3];

		if(yjclfsDm == yjValidate.AZSXMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSXMYJ.yjfsDm){
			if( typeof column_value != "string"){
				var ret = [];
				for(var index = 0;index < column_value.length;index++){
					ret[index] = {};
					ret[index].result = yjValidate(sbjeStr,yjclfsDm,yjGridlb,yjGridlb_para,column_value[index]);
					var key = column_value[index].substr(0,5);
					ret[index].je = yjValidate.AZSXMYJ.sjyjje[key];
					ret[index].sbje = yjValidate.AZSXMYJ.sbje[key];
					ret[index].key = key;
				}
				getYJJY.YJJY = ret;
				return ret;
			}
			column_value = column_value.substr(0,5);
			if(!yjValidate.AZSXMYJ.sjyjje[column_value]){
				if(typeof yjGridlb_para != "object"){
					yjGridlb_para = [yjGridlb_para];
				}
				if(typeof yjGridlb != "object"){
					yjGridlb = [yjGridlb];
				}
				if(yjGridlb_para[0].length>5){
					for(var i = 0;i < yjGridlb_para.length;i++){
						yjGridlb_para[i] = yjGridlb_para[i].substr(0,5);
					}
				}
				yjValidate.AZSXMYJ.sjyjje[column_value] = SUMIF(yjGridlb_para,column_value,yjGridlb);
			}
			yjValidate.AZSXMYJ.sbje[column_value] = sbje;
			if(yjValidate.AZSXMYJ.sjyjje[column_value] == null || yjValidate.AZSXMYJ.sjyjje[column_value] == undefined || isNaN(yjValidate.AZSXMYJ.sjyjje[column_value])){
				return 0>=sbje;
			}
			if(yjValidate.AZSXMYJ.sjyjje[column_value]>=sbje){
				return true;
			}else{
				return false;
			}
		}
		if(yjclfsDm == yjValidate.AZSPMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSPMYJ.yjfsDm){
			if( typeof column_value != "string"){
				var ret = [];
				for(var index = 0;index < column_value.length;index++){
					ret[index] = {};
					ret[index].result = yjValidate(sbjeStr,yjclfsDm,yjGridlb,yjGridlb_para,column_value[index]);
					var key = column_value[index].substr(0,9);
					ret[index].je = yjValidate.AZSPMYJ.sjyjje[key];
					ret[index].sbje = yjValidate.AZSPMYJ.sbje[key];
					ret[index].key = key;
				}
				getYJJY.YJJY = ret;
				return ret;
			}
			column_value = column_value.substr(0,9);
			if(!yjValidate.AZSPMYJ.sjyjje[column_value]){
				if(typeof yjGridlb_para != "object"){
					yjGridlb_para = [yjGridlb_para];
				}
				if(typeof yjGridlb != "object"){
					yjGridlb = [yjGridlb];
				}
				yjValidate.AZSPMYJ.sjyjje[column_value] = SUMIF(yjGridlb_para,column_value,yjGridlb);
			}
			yjValidate.AZSXMYJ.sbje[column_value] = sbje;
			if(yjValidate.AZSPMYJ.sjyjje[column_value] == null || yjValidate.AZSPMYJ.sjyjje[column_value] == undefined || isNaN(yjValidate.AZSPMYJ.sjyjje[column_value])){
				return 0>=sbje;
			}
			if(yjValidate.AZSPMYJ.sjyjje[column_value]>=sbje){
				return true;
			}else{
				return false;
			}
		}
	}
	if(arguments.length > 5){//参数个数为6.
		var column_value = arguments[4];
		var yjGridlb_para = arguments[3];
		var sbjexxlb_para = arguments[5];
		
		if(yjclfsDm == yjValidate.AZSXMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSXMYJ.yjfsDm){
			if(typeof sbjexxlb_para == "object"){//传参处理，如果传入征收品目代码,则主动截取。
				if(sbjexxlb_para[0].length>5){
					for(var i = 0;i < sbjexxlb_para.length;i++){
						sbjexxlb_para[i] = sbjexxlb_para[i].substr(0,5);
					}
				}
			}else{//如果单节点，先处理，后转化为数组。
				if(sbjexxlb_para != null && sbjexxlb_para.length > 5){
					sbjexxlb_para = sbjexxlb_para.substr(0,5);
					sbjexxlb_para = [sbjexxlb_para];
				}
			}
			if(typeof yjGridlb_para != "object"){
				yjGridlb_para = [yjGridlb_para];
			}
			if(typeof yjGridlb != "object"){
				yjGridlb = [yjGridlb];
			}
			if(yjGridlb_para[0].length>5){
				for(var i = 0;i < yjGridlb_para.length;i++){
					yjGridlb_para[i] = yjGridlb_para[i].substr(0,5);
				}
			}
			if( typeof column_value != "string"){
				var ret = [];
				for(var index = 0;index < column_value.length;index++){
					ret[index] = {};
					ret[index].result = yjValidate(sbjeStr,yjclfsDm,yjGridlb,yjGridlb_para,column_value[index],sbjexxlb_para);
					var key = column_value[index].substr(0,5);
					ret[index].je = yjValidate.AZSXMYJ.sjyjje[key];
					ret[index].sbje = yjValidate.AZSXMYJ.sbje[key];
					ret[index].key = key;
				}
				getYJJY.YJJY = ret;
				return ret;
			}
			column_value = column_value.substr(0,5);
			if(!yjValidate.AZSXMYJ.sjyjje[column_value]){
				yjValidate.AZSXMYJ.sjyjje[column_value] = SUMIF(yjGridlb_para,column_value,yjGridlb);
			}
			
			sbje = SUMIF(sbjexxlb_para,column_value,sbjeStr);
			if(sbje == null || sbje == undefined || isNaN(sbje)){
				sbje = 0;
			}
			yjValidate.AZSXMYJ.sbje[column_value] = sbje;
			if(yjValidate.AZSXMYJ.sjyjje[column_value] == null || yjValidate.AZSXMYJ.sjyjje[column_value] == undefined || isNaN(yjValidate.AZSXMYJ.sjyjje[column_value])){
				return 0>=sbje;
			}
			if(yjValidate.AZSXMYJ.sjyjje[column_value]>=sbje){
				return true;
			}else{
				return false;
			}
			
		}
		if(yjclfsDm == yjValidate.AZSPMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSPMYJ.yjfsDm){
			if( typeof column_value != "string"){
				var ret = [];
				for(var index = 0;index < column_value.length;index++){
					ret[index] = {};
					ret[index].result = yjValidate(sbjeStr,yjclfsDm,yjGridlb,yjGridlb_para,column_value[index],sbjexxlb_para);
					var key = column_value[index].substr(0,9);
					ret[index].je = yjValidate.AZSPMYJ.sjyjje[key];
					ret[index].sbje = yjValidate.AZSPMYJ.sbje[key];
					ret[index].key = key;
				}
				getYJJY.YJJY = ret;
				return ret;
			}
			column_value = column_value.substr(0,9);
			if(!yjValidate.AZSPMYJ.sjyjje[column_value]){
				yjValidate.AZSPMYJ.sjyjje[column_value] = SUMIF(yjGridlb_para,column_value,yjGridlb);
			}
			if(sbjexxlb_para instanceof Array){
				sbje = SUMIF(sbjexxlb_para,column_value,sbjeStr);	
			}else{
				sbje = SUMIF(sbjexxlb_para,column_value,sbjeStr[0]);
			}
			if(sbje == null || sbje == undefined || isNaN(sbje)){
				sbje = 0;
			}
			yjValidate.AZSPMYJ.sbje[column_value] = sbje;
			if(yjValidate.AZSPMYJ.sjyjje[column_value] == null || yjValidate.AZSPMYJ.sjyjje[column_value] == undefined || isNaN(yjValidate.AZSPMYJ.sjyjje[column_value])){
				return 0>=sbje;
			}
			if(yjValidate.AZSPMYJ.sjyjje[column_value]>=sbje){
				return true;
			}else{
				return false;
			}
		}
	}	
}

yjValidate.BYZYJ = {'yjfsDm':'16','sjyjje':{}};
yjValidate.AZSXMYJ = {'yjfsDm':'11','sjyjje':{},'sbje':{}};
yjValidate.AZSPMYJ = {'yjfsDm':'12','sjyjje':{},'sbje':{}};
yjValidate.ASYZSXMYJ = {'yjfsDm':'13','sjyjje':{},'sbje':{}};
yjValidate.ASYZSPMYJ = {'yjfsDm':'14','sjyjje':{},'sbje':{}};
yjValidate.YZYJDYL_BYZDX = {'yjfsDm':'15','sjyjje':{}};

function getYJJY(sbje,key,value,yjclfsDm){
	var obj = getYJJY.YJJY;
	if(yjclfsDm == yjValidate.AZSXMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSXMYJ.yjfsDm){
		key = key.substr(0,5);
	}
	if(yjclfsDm == yjValidate.AZSPMYJ.yjfsDm || yjclfsDm == yjValidate.ASYZSPMYJ.yjfsDm){
		key = key.substr(0,9);
	}
	if(obj == undefined && obj == null){
		//预缴信息为空或者其他情况导致预缴校验未能正常进行时，默认预缴信息为零，重新发起校验。
		var yjjg = yjValidate(sbje,yjclfsDm,0,key,key,key);
		obj = [{
			'result':yjjg,
			'je':0,
			'sbje':sbje,
			'key':key
		}];
	}
	if(typeof obj != "string"){
		for(var index = 0;index < obj.length;index++){
			if(obj[index].key == key){
				return obj[index][value];
			}
		}
	}
	return '';
}
/*
 * 预缴校验示例。印花税：
 * {
	  "id": "061001070101000291",
	  "type": "12",
	  "desc": "",
	  "formula": "$..sbbhead.lxdh!='' && yjValidate(100,'16',null)",
	  "target": "$..sbbhead.lxdh",
	  "tips": "预缴校验测试"
	},{
	  "id": "061001070101000292",
	  "type": "12",
	  "desc": "",
	  "formula": "$..sbbhead.lxdh!='' && yjValidate($..bqyjse1,'11',$..yjxxGirdlb[*].yjye,$..yjxxGirdlb[*].zsxmDm,'10111')",
	  "target": "$..sbbhead.lxdh",
	  "tips": "预缴校验测试"
	},{
	  "id": "061001070101000293",
	  "type": "12",
	  "desc": "",
	  "formula": "$..sbbhead.lxdh!='' && yjValidate($..yhssbGridlb[*].bqyjse1,'11',$..yjxxGirdlb[*].yjye,$..yjxxGirdlb[*].zsxmDm,'10111',$..yhssbGridlb[*].zspmDm)",
	  "target": "$..sbbhead.lxdh",
	  "tips": "预缴校验测试"
	}
	动态行预缴校验推荐方式：
	{
  "id": "0610010701010002932",
  "type": "11",
  "desc": "",
  "formula": "$..yhssbGrid.yjjy=yjValidate($..yhssbGridlb[*].bqyjse1,$..yhxx.yjxxGrid。yjfsDm,$..yhxx.yjxxGrid.yjxxGridlb[*].yjye1,$..yhxx.yjxxGrid.yjxxGridlb[*].zspmDm,$..yhssbGridlb[*].zspmDm,$..yhssbGridlb[*].zspmDm)",
  "target": "",
  "tips": ""
},{
	  "id": "061001070101000293",
	  "type": "12",
	  "desc": "",
	  "formula": "IF($..yhssbGridlb[#].bqyjse1>=0||$..bqyjse1hj>=0,getYJJY($..bqyjse1hj,$..yhssbGridlb[#].zspmDm,'result',$..yhxx.yjxxGrid。yjfsDm),false)",
	  "target": "$..yhssbGridlb[#].bqyjse1",
	  "tips": "本期已缴税额[{{getYJJY($..bqyjse1hj,$..yhssbGridlb[#].zspmDm,'sbje',$..yhxx.yjxxGrid。yjfsDm)}}]不能大于征收项目的实际预缴余额[{{getYJJY($..bqyjse1hj,$..yhssbGridlb[#].zspmDm,'je',$..yhxx.yjxxGrid。yjfsDm)}}]"
	}
	*/


/**
 * 选择减免性质后，获取默认带出的减免税额
 * @param jsyj - 计税依据
 * @param bqynse - 印花税传本期应纳税额、契税传jzse
 * @param fdsl - 法定税率
 * @param jmfd - 减免幅度
 * @param jmed - 减免额度
 * @param jmsl - 减免（减按）税率
 * 【动态行调用时，用#】
 * @return
 */
function getMrjmseBySsjmxz(jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl,jmxzDm,zspmDm){
	if(jmxzDm && zspmDm && !jmzlxDm){
		//当有减免性质,但无减免征类型时，循环码表数据来源，获取实际减免征类型。用于更正申报初始化时默认带出减免性质时，因码表未加载完。html中ng-change未触发导致的减免征类型代码为空。
        var option = formData.qcs.formContent.fjssbb.body.sbxxGrid.jmxxlist.option;
        if(option!=undefined && option!=null){
            for(var i=0;i<option.length;i++){
                if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm){
                    jmzlxDm = option[i].jmzlxDm;
                    jmfd = option[i].jmfd;
                    jmed = option[i].jmed;
                    jmsl = option[i].jmsl;
                }
            }
        }
	}
	var jmse = 0.00 ;
	var sljmje = 0.00 ;
	if(jmzlxDm == '02'){
		jmse = bqynse;

	}else if (jmzlxDm == '01'){
		if(jmed > 0) {
			if(jmed > bqynse){
				jmse = bqynse ;
			}else{
				jmse = jmed ;
			}
		}else if(jmsl > 0 && fdsl > jmsl){
			sljmje = jsyj * (fdsl - jmsl) ;

			if(sljmje > bqynse ) {
				jmse = bqynse ;
			}else{
				jmse = sljmje ;
			}
		}else if (jmfd > 0 && jmfd < 1) {
			jmse = jsyj * jmfd * fdsl ;
		}
	}
	return jmse ;
}

/**
 * 减免校验：获取最大可填写减免税额
 */
 function getMaxjmseBySsjmxz(jmse,jmzlxDm,jsyj,fdsl,jmfd,jmed,jmsl,bqynse){
	 if(jmzlxDm == "" || (jmzlxDm == "01" && (jmfd == 0 || jmfd == "") && (jmed == 0 || jmed == "") && (jmsl == "" || jmsl == 0))){
		 return Math.round(jsyj*100*fdsl)/100;
	 }else{
		 return getMrjmseBySsjmxz(jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl);
	 }
 }

/**
 * 增值税预缴，选择减免性质后，获取默认带出的减免税额
 * @param jmzlxDm 减免征类型
 * @param jsyj 计税依据
 * @param bqynse 本期应纳税额
 * @param fdsl 法定税率
 * @param jmfd 减免幅度
 * @param jmed 减免额度
 * @param jmsl 减免（减按）税率
 * @param jmxzDm 减免性质代码
 * @param zspmDm 征收品目代码
 * @returns {number}
 * 【动态行调用时，用#】
 */
function getMrjmseBySsjmxzInZzsyjsb(jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl,jmxzDm,zspmDm){
	if(jmxzDm && zspmDm && !jmzlxDm){
		//当有减免性质,但无减免征类型时，循环码表数据来源，获取实际减免征类型。用于更正申报初始化时默认带出减免性质时，因码表未加载完。html中ng-change未触发导致的减免征类型代码为空。
		var option = formData.qcs.initData.zzsyjsbInitData.jmxxlist.option;
		if(option!=undefined && option!=null){
			for(var i=0;i<option.length;i++){
				if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm){
					jmzlxDm = option[i].jmzlxDm;
					jmfd = option[i].jmfd;
					jmed = option[i].jmed;
					jmsl = option[i].jmsl;
				}
			}
		}
	}
	var jmse = 0.00 ;
	var sljmje = 0.00 ;
	if(jmzlxDm == '02'){
		jmse = bqynse;

	}else if (jmzlxDm == '01'){
		if(jmed > 0) {
			if(jmed > bqynse){
				jmse = bqynse ;
			}else{
				jmse = jmed ;
			}
		}else if(jmsl > 0 && fdsl > jmsl){
			sljmje = jsyj * (fdsl - jmsl) ;

			if(sljmje > bqynse ) {
				jmse = bqynse ;
			}else{
				jmse = sljmje ;
			}
		}else if (jmfd > 0 && jmfd < 1) {
			jmse = jsyj * jmfd * fdsl ;
		}
	}
	return jmse ;
}
 
 /**
  * @param rtnType 返回值类型：ynssde 、 kcs、sl、sskcs、ynse、
  * @param srze
  * @param kcs
  * @param yssdl
  * @param zsxmDm
  * @param zspmDm
  * @param jsbz
  * @param sjjyyf
  * @param dlhdfsbz
  * @param ysbyf
  * @param hdjsyj
  * @param nsqxDm
  * @param zsl
  */
 function calculate_gs_jsme_sl_sskcs(){
	 if(arguments.length<15){
		 throw "Wrong Parameter Number!" ;
	 }
	 var rtnType = arguments[0];
	 var srze = arguments[1];
	 var kcs = arguments[2];
	 var yssdl = arguments[3];//
	 var zsxmDm = arguments[4];
	 var zspmDm = arguments[5];
	 var jsbz = arguments[6];
	 var sjjyyf = arguments[7];//实际经营月份
	 var dlhdfsbz = arguments[8];//定率核定方式标志；1：定期定额核定；2：个税定率核定
	 var ysbyf = arguments[9];//已申报月份
	 var hdjsyj = arguments[10];//核定计税依据
	 var nsqxDm = arguments[11]; //纳税期限代码---'08':按季;'06':按月
	 var zsl = arguments[12]; //征收率
	 var hdynse = arguments[13]; //核定应纳税额
	 var zszmDm = arguments[14]; //征收子目代码
	 var cshynse = arguments[15]; //初始化接口ynse
	//省级环境特殊需求,增加应税所得率字段,modified by 2014-12-23 lijunfeng 
	if(yssdl ==  'undefined' || yssdl == undefined || yssdl == 0){
		yssdl = 1;
	}
	if(typeof srze == "string"){
		srze = srze * 1;
	}
	if(typeof kcs == "string"){
		kcs = kcs * 1;
	}
	if(typeof sjjyyf == "string"){
		sjjyyf = sjjyyf * 1;
	}
	if(typeof ysbyf == "string"){
		ysbyf = ysbyf * 1;
	}
	
	// 这两个个税，走新的处理流程。
	if (zspmDm == '101060200' || zspmDm == '101060300') {
		// zsxmDm不作为参数传入，dlhdfsbz也不传入，计算时按1处理
		// 需要判断是定期定额自行申报还是定期定额汇总的，取的节点不一样。
		var ssq, sqz, kyrq, tbrq;
		if (formData.dqdehfyhzsbxxGridlbVO) {		// 分月汇总
			// -- 目前发现和自行申报计算是一致的。
			sqq = formData.nsrxxForm.skssqq;
			sqz = formData.nsrxxForm.skssqz;
			kyrq = formData.qcs.initData.dedehfyhzInitData.kyrq;
			tbrq = formData.qcs.initData.nsrjbxx.tbrq;
            // hdjsyj = 0; 核定计税依据不要了
			return dqdeCalc2018Gs(rtnType, srze, yssdl, zspmDm, jsbz, sjjyyf, 0, nsqxDm, zsl, sqq, sqz, kyrq, tbrq, 'fyhz');
		} else {				// 自行申报
			sqq = formData.dqdezxSbbdxxVO.dqdezxsb.sbbhead.skssqq;
			sqz = formData.dqdezxSbbdxxVO.dqdezxsb.sbbhead.skssqz;
			kyrq = formData.dqdeqcs.initData.sbDqdezxsbInitData.kyrq;
			tbrq = formData.dqdeqcs.initData.nsrjbxx.tbrq;
			return dqdeCalc2019Gs(rtnType, srze, yssdl, zspmDm, jsbz, sjjyyf, hdjsyj, nsqxDm, zsl, sqq, sqz, kyrq, tbrq, 'dqde', hdynse,zszmDm,cshynse);
		}
	}
	
	var key = srze + "_" + kcs +"_" + yssdl + "_" + zsxmDm + "_" + zspmDm + "_" + jsbz + "_" + sjjyyf + "_" + dlhdfsbz + "_" + ysbyf + "_" + hdjsyj;
	if(calculate_gs_jsme_sl_sskcs.json[key]){
		var value = calculate_gs_jsme_sl_sskcs.json[key];
		return value[rtnType];
	}
	
	var nsqx = false;
	if (nsqxDm=="08"){
		nsqx = true;//判断纳税期限，处理按季申报情况下ysx要除以3的情况；
		srze = srze/3;
		hdjsyj = hdjsyj/3;
	}
	
	 var ynssde = parseFloat((srze - kcs) *  yssdl);
		//ynssde = Math.round(100*ynssde)/100;
		if(calculate_gs_jsme_sl_sskcs.gs_zsxmDm === zsxmDm) {//个人所得税
				var jsonElement = {};
				switch(zspmDm) {
				case '101060200' : 
					if(jsbz == '1' || jsbz==""){	//征收率
						if(yssdl == 1 && (zsl !=  'undefined' && zsl != undefined && zsl != 0)){
							jsonElement['sl'] = zsl;
						}else{
							jsonElement['sl'] = yssdl;
						}
						jsonElement['sskcs'] = 0;
						
						ynssde = parseFloat((srze - kcs) *  1);
						break;//1.0确认，jsbz为1或者空时，sl取期初数的值
					}else if(jsbz == '2'){	//应税所得率。
							ynssde = parseFloat((srze - kcs) *  yssdl * sjjyyf);
						 
					}else if(jsbz == '3'){	//所得率
						//所得率情况:
						if(dlhdfsbz == '1'){
							//定期定额核定
							//用来判断税率和速算扣除数的应纳税所得额 = (应税项*所得率-3500)*实际经营月份 
								ynssde = parseFloat(((srze - kcs) *  yssdl - 3500));
							//计税依据=max(应税项*所得率-3500,核定计税依据）
							ynssde = Math.max(ynssde,hdjsyj)*sjjyyf;
						}else if(dlhdfsbz == '2'){
							//个税定率核定
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
							ynssde = parseFloat( ((srze - kcs) *  yssdl - 3500 * ysbyf));
							//计税依据=max(应税项*所得率-3500,核定计税依据）
							ynssde = Math.max(ynssde,hdjsyj);
							
						}
						
					}else if(jsbz == '5' && dlhdfsbz == '1'){	
						//甘肃和西藏比较特殊，定期定额生产经营所得个税3万以下减征，超过3万时需要减除3W进行计税
						yssdl = zsl;
						if(srze >= 30000){
							jsonElement['kcs'] = 30000.00;
							jsonElement['sl'] = yssdl;
							jsonElement['sskcs'] = 0.00;	
							ynssde = parseFloat((srze - 30000) *  1 );
							
						}else{
							//jsonElement['sl'] = 0.00;
							jsonElement['sl'] = yssdl;
							jsonElement['sskcs'] = 0.00;	
							jsonElement['kcs'] = 0.00;
							ynssde = 0;
						}
						break;
					}
						
					if(ynssde <= 15000) {
						jsonElement['sl'] = 0.05;
						jsonElement['sskcs'] = 0;					
					} else if(ynssde > 15000 && ynssde <=30000) {
						jsonElement['sl'] = 0.1;
						jsonElement['sskcs'] = 750;						
					} else if(ynssde > 30000 && ynssde <=60000) {
						jsonElement['sl'] = 0.2;
						jsonElement['sskcs'] = 3750;						
					} else if(ynssde > 60000 && ynssde <=100000) {
						jsonElement['sl'] = 0.3;
						jsonElement['sskcs'] = 9750;						
					} else if(ynssde > 100000) {
						jsonElement['sl'] = 0.35;
						jsonElement['sskcs'] = 14750;						
					}
					
					//所得率情况，
					//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
					if(jsbz == '3'){
						if(dlhdfsbz == '1'){
							//定期定额核定情况
							//个人所得税应纳税所得额=应税项*所得率-3500
							//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
							if(nsqx){
								//纳税期限为按季申报时，要乘以3	
								jsonElement['ynssde'] = parseFloat(((srze - kcs) *  yssdl - 3500)*3);
								//计税依据=max(应税项*所得率-3500,核定计税依据）
								jsonElement['ynssde'] = Math.max(jsonElement['ynssde'] ,hdjsyj*3);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde']/3 * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf * 3);
							}else{
								jsonElement['ynssde'] = parseFloat(((srze - kcs) *  yssdl - 3500));
								//计税依据=max(应税项*所得率-3500,核定计税依据）
								jsonElement['ynssde'] = Math.max(jsonElement['ynssde'] ,hdjsyj);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde'] * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf);

							}
							
							jsonElement['sskcs'] = parseFloat(jsonElement.sskcs / sjjyyf);
						}else if(dlhdfsbz == '2'){
							//个税核定率情况
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
							//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
							jsonElement['ynse'] = parseFloat((ynssde/sjjyyf * jsonElement.sl - jsonElement.sskcs));
						
						}
						
					}
					//1.0确认，jsbz=2的时候，ynse计算方式跟jsbz为3时一样--2017.1.20
					//所得率情况，
					//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
					if(jsbz == '2'){
						if(dlhdfsbz == '1'){
							//定期定额核定情况
							//个人所得税应纳税所得额=应税项*所得率-3500
							//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
							//计税依据=max(应税项*所得率-3500,核定计税依据）
							//jsonElement['ynssde'] = Math.max(ynssde ,hdjsyj);
							if(nsqx){
								jsonElement['ynssde'] = parseFloat((srze - kcs) *  yssdl * 3);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde']/3 * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf *3);
							}else{
								jsonElement['ynssde'] = parseFloat((srze - kcs) *  yssdl );
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde'] * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf);
							}
						jsonElement['sskcs'] = parseFloat(jsonElement.sskcs / sjjyyf);
						}else if(dlhdfsbz == '2'){
							//个税核定率情况
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
							//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
							jsonElement['ynse'] = parseFloat((ynssde/sjjyyf * jsonElement.sl - jsonElement.sskcs));
						}
						
					}
				 
					
					//jsbz为5的情况下
					if(jsbz == '5'){
						if(srze >= 30000){
							if(nsqx){
								jsonElement['ynssde'] = ynssde*3;
							}else{
								jsonElement['ynssde'] = ynssde;
							}
						jsonElement['ynse'] = parseFloat((jsonElement['ynssde']* jsonElement.sl - jsonElement.sskcs));
						
						}else{
							jsonElement['ynssde'] = 0;
						}
					}
					break;//个体户生产经营所得
				case '101060300' : 
					if(jsbz == '1' || jsbz==''){	//征收率
						if(yssdl == 1 && (zsl !=  'undefined' && zsl != undefined && zsl != 0)){
							jsonElement['sl'] = zsl;
						}else{
							jsonElement['sl'] = yssdl;
						}
						jsonElement['sskcs'] = 0;
						ynssde = parseFloat((srze - kcs) *  1);
						break;
					}else if(jsbz == '2'){	//应税所得率。
						ynssde = parseFloat((srze - kcs) *  yssdl * sjjyyf);
					}else if(jsbz == '3'){	//所得率
						//所得率情况:
						if(dlhdfsbz == '1'){
							//定期定额核定
							//用来判断税率和速算扣除数的应纳税所得额 = (应税项*所得率-3500)*实际经营月份 
							
								ynssde = parseFloat(((srze - kcs) *  yssdl - 3500));
							//计税依据=max(应税项*所得率-3500,核定计税依据）
								ynssde = Math.max(ynssde,hdjsyj)*sjjyyf;
						}else if(dlhdfsbz == '2'){
							//个税定率核定
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
								ynssde = parseFloat(((srze - kcs) *  yssdl - 3500 * ysbyf));
							//计税依据=max(应税项*所得率-3500,核定计税依据）
								ynssde = Math.max(ynssde,hdjsyj);
						}
						
					}
						
					if(ynssde <= 15000) {
						jsonElement['sl'] = 0.05;
						jsonElement['sskcs'] = 0;					
					} else if(ynssde > 15000 && ynssde <=30000) {
						jsonElement['sl'] = 0.1;
						jsonElement['sskcs'] = 750;						
					} else if(ynssde > 30000 && ynssde <=60000) {
						jsonElement['sl'] = 0.2;
						jsonElement['sskcs'] = 3750;						
					} else if(ynssde > 60000 && ynssde <=100000) {
						jsonElement['sl'] = 0.3;
						jsonElement['sskcs'] = 9750;						
					} else if(ynssde > 100000) {
						jsonElement['sl'] = 0.35;
						jsonElement['sskcs'] = 14750;						
					}
					
					//所得率情况，
					//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
					if(jsbz == '3'){
						if(dlhdfsbz == '1'){
							//定期定额核定情况
							//个人所得税应纳税所得额=应税项*所得率-3500
							//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
							if(nsqx){
								//纳税期限为按季申报时，要乘以3	
								jsonElement['ynssde'] = parseFloat(((srze - kcs) *  yssdl - 3500)*3);
								//计税依据=max(应税项*所得率-3500,核定计税依据）
								jsonElement['ynssde'] = Math.max(jsonElement['ynssde'] ,hdjsyj*3);
								//纳税期限为按季申报时，要除以3	
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde']/3 * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf *3) /100;
							}else{
								jsonElement['ynssde'] = parseFloat(((srze - kcs) *  yssdl - 3500));
								//计税依据=max(应税项*所得率-3500,核定计税依据）
								jsonElement['ynssde'] = Math.max(jsonElement['ynssde'] ,hdjsyj);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde'] * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf) /100;
							}
							
							jsonElement['sskcs'] = parseFloat(jsonElement.sskcs / sjjyyf);
						}else if(dlhdfsbz == '2'){
							//个税核定率情况
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
							//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
							jsonElement['ynse'] = parseFloat((ynssde/sjjyyf * jsonElement.sl - jsonElement.sskcs));
						}
						
					}
					//1.0确认，jsbz=2的时候，ynse计算方式跟jsbz为3时一样--2017.1.20
					//所得率情况，
					//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
					if(jsbz == '2'){
						if(dlhdfsbz == '1'){
							//定期定额核定情况
							//个人所得税应纳税所得额=应税项*所得率-3500
							//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
							//计税依据=max(应税项*所得率-3500,核定计税依据）
							//jsonElement['ynssde'] = Math.max(ynssde ,hdjsyj);
							if(nsqx){
								jsonElement['ynssde'] = parseFloat((srze - kcs) *  yssdl * 3);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde']/3 * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf*3) /100;
							}else{
								jsonElement['ynssde'] = parseFloat((srze - kcs) *  yssdl);
								jsonElement['ynse'] = parseFloat((jsonElement['ynssde'] * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf) /100;
							}
							
							jsonElement['sskcs'] = parseFloat(jsonElement.sskcs / sjjyyf);
						}else if(dlhdfsbz == '2'){
							//个税核定率情况
							//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
							//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
							jsonElement['ynse'] = parseFloat((ynssde/sjjyyf * jsonElement.sl - jsonElement.sskcs));
						}
						
					}
					
					break;//企事业承包承租经营所得
				
				case '101060400' : 
					//劳务报酬所得税，先判断收入，不超过4000的，减800，超过4000的减20%后为应纳税所得额
					if(ynssde <= 4000) {
						ynssde = ynssde - 800;
					}else if(ynssde > 4000) {
						ynssde = ynssde*0.8;
					}
					if(ynssde <= 20000) {
						jsonElement['sl'] = 0.2;
						jsonElement['sskcs'] = 0;						
					} else if(ynssde > 20000 && ynssde <=50000) {
						jsonElement['sl'] = 0.3;
						jsonElement['sskcs'] = 2000;						
					} else if(ynssde > 50000) {
						jsonElement['sl'] = 0.4;
						jsonElement['sskcs'] = 7000;						
					}
					; break;//劳务报酬所得税
				case '101060500' :
					if(ynssde >=800 && ynssde <= 4000) {
						ynssde = ynssde - 800;				
					}else if(ynssde > 4000) {
						ynssde = ynssde*0.8;	
					}
					jsonElement['sl'] = 0.2;
					jsonElement['sskcs'] =  ynssde*0.2*0.3;
					//ynssde = ynssde*0.7;//再按应纳税额减征30%
					; break;//稿酬所得
				case '101060600' : 
					if(ynssde >=800 && ynssde <= 4000) {
						ynssde = ynssde - 800;					
					}else if(ynssde > 4000) {
						ynssde = ynssde*0.8;	
					}
					jsonElement['sl'] = 0.2;	
					jsonElement['sskcs'] = 0;
					; break;//特许权使用所得
				case '101060800' : 
					if(ynssde >=800 && ynssde <= 4000) {
						ynssde = ynssde - 800;
					}else if(ynssde > 4000) {
						ynssde = ynssde*0.8;
					}
					jsonElement['sl'] = 0.2;	
					jsonElement['sskcs'] = 0;
					; break;//财产租赁所得
				case '101060100' : 
					//工资薪金的暂不用速算扣除数，跟认定走。
					; break;//工资薪金所得
					default :
					//取核心税率。
					; break;
				}
				//计算应纳税所得额，如果特殊的应纳税所得额处理方式，在前面进行处理。
				if(jsonElement.ynssde == 'undefined' || jsonElement.ynssde == undefined){
					if(nsqx){
						jsonElement['ynssde'] = parseFloat(ynssde*3);
					}else{
						jsonElement['ynssde'] = parseFloat(ynssde);
					}
						
					
				}
				
				//计算应纳税额，如果特殊的应纳税额处理方式，在前面进行处理。
				if((jsonElement.ynse == 'undefined' || jsonElement.ynse == undefined) 
						&& jsonElement.sl !=  'undefined' && jsonElement.sl != undefined){
					if(nsqx){
						jsonElement['ynse'] = parseFloat(ynssde*3 * jsonElement.sl - jsonElement.sskcs);
					}else{
						jsonElement['ynse'] = parseFloat(ynssde* jsonElement.sl - jsonElement.sskcs);
					}
				}
				
				//ynssde 、 kcs、sl、sskcs、ynse
				jsonElement['ynssde'] = Math.round(100 * jsonElement['ynssde']) / 100;
				jsonElement['ynse'] = Math.round(100 * jsonElement['ynse']) / 100;
				jsonElement['sskcs'] = Math.round(100 * jsonElement['sskcs']) / 100;
				if(jsonElement.ynse != 'undefined' && jsonElement.ynse != undefined){
					calculate_gs_jsme_sl_sskcs.json[key] = jsonElement;
					return jsonElement[rtnType];
				}
		}
		 
 }
 
 // 定期定额自行申报、定期定额个体工商户分月汇总申报
 var dqde2018Gs = {};	
 dqde2018Gs.items = {};
 dqde2018Gs.zsxmDm = '10106';
 dqde2018Gs.zspmDm = '101060200,101060300';
 /*{
	 jsyj: 
	 ynse:
	 sl: 两个税率则取最大的
	 sskcs: 两个速算扣除数则取最大
 }*/
/**
 * 新版的101060200，101060300，个税处理
 * 在旧版里面调用进来的。
 * rtnType:	返回类型
 * ysx:		应税项
 * kcs:		扣除数，固定0，作废，无需传入
 * yssdl:	应税所得率
 * zspmDm:	征收品目代码(101060200，101060300)
 * jsbz:	计税标志
 * sjjyyf:	实际经营月份
 * ysbyf:	已申报月份 -- 作废，定期定额只按照定期定额核定，不需要考虑税率核定的问题。ysbyf仅在税率核定时使用。
 * hdjsyj:	核定计税依据
 * nsqxDm:	纳税期限代码
 * sl:		税率
 * sqq:		属期起
 * sqz:		属期止
 * type: dqde|fyhz
 */
function dqdeCalc2018Gs(rtnType, ysx, yssdl, zspmDm, jsbz, sjjyyf, hdjsyj, nsqxDm, sl, sqq, sqz, kyrq, tbrq, type) {
	if (arguments.length < 14) {
		throw "Wrong Parameter Number!";
	}
	var rtnType = arguments[0];
	var ysx = arguments[1];
	var yssdl = arguments[2]; 
	var zspmDm = arguments[3];
	var jsbz = arguments[4];
	var sjjyyf = arguments[5];
	var hdjsyj = arguments[6]; 	
	var nsqxDm = arguments[7]; 	
	var sl = arguments[8]; 		
	var sqq = arguments[9]; 		
	var sqz = arguments[10]; 		
	var kyrq = arguments[11]; 		
	var tbrq = arguments[12]; 		
	var type = arguments[13]; 		
	
	if (dqde2018Gs.zspmDm.indexOf(zspmDm) == -1) {
		return 0;
	}
	
	var sskcs = 0;
	var kcs = 0;
		
	
	if (yssdl == 'undefined' || yssdl == undefined || yssdl == 0) {
		yssdl = 1;
	}
	if (typeof srze == "string") {
		ysx = ysx * 1;
	}
	
	// 优先取暂存的。暂存最多提供20条，如果超过，则移除第一条，添加数据在尾部。
	var item = {};
	var key = type + "_" + ysx + "_" + yssdl + "_" + zspmDm + "_" + jsbz + "_" + sjjyyf + "_" + hdjsyj;
	if (dqde2018Gs.items[key]) {
		item = dqde2018Gs.items[key];
		rtnType = rtnType == 'ynssde' ? 'jsyj' : rtnType;
		return item[rtnType];
	}
	
	// 纳税期限，纳税期限仅考虑下面三种情况
	var months = 1;	// 默认按月
	if (nsqxDm == '10') {
		months = 12;
	} else if (nsqxDm == '08') {
		months = 3;
	}

	// 开业月份
    var kyyf = 12 - sjjyyf + 1;
	
	// 实际经营月份
	var sjjyBefore = MAX(0, 10 - kyyf);		// 10月前
	var sjjyAfter = MIN(3, 12 - kyyf + 1); 	// 含10月
	
	// new: 新税率, old: 旧, transition: 过渡
	var slRule = 'new';
	var sSqq = sqq.substring(0, 7).replace('-', '').replace('-', '');	// 格式化属期起(年月)
	var sSqz = sqz.substring(0, 7).replace('-', '').replace('-', '');	// 格式化属期止(年月)
	if (sSqz < '201810') {
		slRule = 'old';	// 税款属期在2018-10之前,旧税率处理
	} else if (sSqq >= '201810') {
		slRule = 'new';	// 开业日期为2018-10之后，税款属期在2018-10及之后，采用新税率
	} else {
		slRule = 'transition';	// 开业日期为2018-10之前的，税款属期在2018第4季度，采用过渡期计算
	}
	
	// 分别对两个品目进行处理
	var ynssde = 0, ynssde1 = 0, ynssde2 = 0;
	// 计税依据
	var jsyj = 0;
	// 应纳税额
	var ynse = 0;
	if (!jsbz || jsbz == '1') {
		var zgswjDm = formData.dqdeqcs.initData.nsrjbxx.zgswjDm;
		if(zgswjDm.indexOf('163')==0){
			if(ysx>hdjsyj){
				sl=0.005;
			}else{
				sl=0;
			}
		}
		jsyj = ysx;
		ynse = jsyj * sl;
	} else if (jsbz == '2') {
		if (slRule == 'old' || slRule == 'new') {
			// 年应纳税所得额=(计税依据)*实际经营月份=应税项*应税所得率yssdl/Q*实际经营月份
			// ynssde = ROUND(ysx * yssdl / months * sjjyyf, 2);
			ynssde = ysx * yssdl * sjjyyf / months;
			jsyj = ysx * yssdl;
			var map = getCommmonGsSlAndSskcs(ynssde, slRule != 'old');
			sl = map['sl'];
			sskcs = map['sskcs'];
			ynse = (jsyj / months * sjjyyf * sl - sskcs) / sjjyyf * months;
			/** ===== end ===== **/
		} else if (slRule == 'transition') {
			jsyj = ysx * yssdl;
			ynssde1 = ysx * yssdl / months * sjjyBefore;
			ynssde2 = ysx * yssdl / months * sjjyAfter;
			ynssde = ynssde1 + ynssde2;	// 也就是ynssde = ysx*yssdl/months * sjjyyf
			
			// 分别取新旧两档税率
			var oldMap = getCommmonGsSlAndSskcs(ynssde, false);
			var newMap = getCommmonGsSlAndSskcs(ynssde, true);
			sl = newMap['sl'];
			ynse = (ynssde * oldMap['sl'] - oldMap['sskcs']) * sjjyBefore / sjjyyf;		// 旧
			ynse += (ynssde * newMap['sl'] - newMap['sskcs']) * sjjyAfter / sjjyyf;		// +新
			ynse = ynse / sjjyyf * months;	// 总/sjjyjf*月季年
			/** ===== end ===== **/
		} 
	} else if (jsbz == '3') {
		// 新旧版实际是一样的公式，只是税率和速算扣除数变化了
		if (slRule == 'old' || slRule == 'new') {
			var ljkcs = (slRule == 'old' ? 3500 : 5000);
			// jsyj = MAX((ysx * yssdl / months - ljkcs) * months, hdjsyj * months); // 暂不考虑核定
			jsyj = MAX((ysx * yssdl / months - ljkcs) * months, 0);
			ynssde = jsyj / months * sjjyyf;
			var map = getCommmonGsSlAndSskcs(ynssde, slRule != 'old');
			sl = map['sl'];
			sskcs = map['sskcs'];
			ynse = (jsyj / months * sjjyyf * sl - sskcs) / sjjyyf * months;
            /** ===== end ===== **/
        } else if (slRule == 'transition') {
            ynssde1 = MAX(ysx / months * yssdl - 3500, 0) * sjjyBefore;
			ynssde2 = MAX(ysx / months * yssdl - 5000, 0) * sjjyAfter;
			ynssde = ynssde1 + ynssde2;
			var oldMap = getCommmonGsSlAndSskcs(ynssde, false);
			var newMap = getCommmonGsSlAndSskcs(ynssde, true);
			sl = newMap['sl'];
			ynse = (ynssde * oldMap['sl'] - oldMap['sskcs']) * sjjyBefore / sjjyyf;		// 旧版
			ynse += (ynssde * newMap['sl'] - newMap['sskcs']) * sjjyAfter / sjjyyf;	// 新版
			ynse = ynse / sjjyyf * months;

			// jsjy 取新税率
            jsyj = MAX(ysx / months * yssdl - 5000, 0) * months;
			/** ===== end ===== **/
		} 
	} else if (jsbz == '5') {	// 仅在101060200中使用，西藏甘肃特有
		kcs = 30000;
		ynssde = ysx - kcs * months;
		if (ynssde > 0) {
			jsyj = ynssde;
			sskcs = 0;
			sl = yssdl;
			ynse = jsyj * sl - sskcs;	// 税率|征收率按传入的
		} else {
			ynssde = 0;
			ynssde = jsyj;
			sl = yssdl;
			sskcs = 0;
			ynse = 0;
			kcs = 0;
		}
		/** ===== end ===== **/
	}
	
	// 上步骤没求得计税依据的，计税依据=ynssde；
	jsyj = jsyj == 0 ? ynssde : jsyj;
	// 以上步骤没求得应纳税额的，ynse=ynssde*sl-速算扣除数sskcs
	ynse = ynse == 0 ? (ynssde * sl - sskcs) : ynse;
	
	// item.ynssde = ROUND(ynssde, 2);
	item.jsyj = ROUND(jsyj, 2);
	item.ynse = ROUND(ynse, 2);
	item.sskcs = ROUND(sskcs, 2);
	item.sl = sl;
	item.yssdl = yssdl;
	item.kcs = kcs;
	if (item.ynse != 'undefined') {
		dqde2018Gs.items[key] = item;
		rtnType = rtnType == 'ynssde' ? 'jsyj' : rtnType;
		return item[rtnType];
	} else {
		return 0;
	}
}
/**
 * 新版的101060200，101060300，个税处理
 * 在旧版里面调用进来的。
 * rtnType:	返回类型
 * ysx:		应税项
 * kcs:		扣除数，固定0，作废，无需传入
 * yssdl:	应税所得率
 * zspmDm:	征收品目代码(101060200，101060300)
 * jsbz:	计税标志
 * sjjyyf:	实际经营月份
 * ysbyf:	已申报月份 -- 作废，定期定额只按照定期定额核定，不需要考虑税率核定的问题。ysbyf仅在税率核定时使用。
 * hdjsyj:	核定计税依据
 * nsqxDm:	纳税期限代码
 * sl:		税率
 * sqq:		属期起
 * sqz:		属期止
 * type: dqde|fyhz
 */
function dqdeCalc2019Gs(rtnType, ysx, yssdl, zspmDm, jsbz, sjjyyf, hdjsyj, nsqxDm, sl, sqq, sqz, kyrq, tbrq, type, hdynse,zszmDm,cshynse) {
	if (arguments.length < 16) {
		throw "Wrong Parameter Number!";
	}
	var rtnType = arguments[0];
	var ysx = arguments[1];
	var yssdl = arguments[2]; 
	var zspmDm = arguments[3];
	var jsbz = arguments[4];
	var sjjyyf = arguments[5];
	var hdjsyj = arguments[6]; 	
	var nsqxDm = arguments[7]; 	
	var sl = arguments[8]; 		
	var sqq = arguments[9]; 		
	var sqz = arguments[10]; 		
	var kyrq = arguments[11]; 		
	var tbrq = arguments[12]; 		
	var type = arguments[13];
	var hdynse = arguments[14]; //核定应纳税额
	var zszmDm=arguments[15];
	var cshynse = arguments[16];
	if (yssdl == 'undefined' || yssdl == undefined || yssdl == 0) {
		yssdl = 1;
	}
	if (typeof srze == "string") {
		ysx = ysx * 1;
	}
	
	// 优先取暂存的。暂存最多提供20条，如果超过，则移除第一条，添加数据在尾部。
	var item = {};
	var key = type + "_" + ysx + "_" + yssdl + "_" + zspmDm + "_" + jsbz + "_" + sjjyyf + "_" + hdjsyj;
	if (dqde2018Gs.items[key]) {
		item = dqde2018Gs.items[key];
		rtnType = rtnType == 'ynssde' ? 'jsyj' : rtnType;
		return item[rtnType];
	}
	var sSqq = sqq.substring(0, 7).replace('-', '').replace('-', '');	
	var sSqz = sqz.substring(0, 7).replace('-', '').replace('-', '');	
	
	//往期累计计税依据
	var wqljjsyj = 0;
	var wqljynse = 0;
	var gswqsjGridlbList = formData.dqdeqcs.initData.sbDqdezxsbInitData.gswqsjGrid.gswqsjGridlb;
	for(var index in gswqsjGridlbList){
		var gswqsjGridlb = gswqsjGridlbList[index];
		if(zspmDm = gswqsjGridlb.zspmDm){
			wqljjsyj = gswqsjGridlb.wqljjsyj;
			wqljynse = gswqsjGridlb.wqljynse;
			break;
		}
	}
	
	// 纳税期限，纳税期限仅考虑下面三种情况
	var months = 1;	// 默认按月
	if (nsqxDm == '10') {
		months = 12;
	} else if (nsqxDm == '08') {
		months = 3;
	}
	
	//年中开业处理
	var sSqq = sqq.substring(0, 7).replace('-', '').replace('-', '');	
	var sSqz = sqz.substring(0, 7).replace('-', '').replace('-', '');
	var djrq = formData.dqdeqcs.initData.nsrjbxx.djrq;
	var bDjrq = djrq.substring(0, 7).replace('-', '').replace('-', '');
	var bqMonths = months;
	if(sSqq <= bDjrq && bDjrq <= sSqz){
		bqMonths = sSqq * 1 - bDjrq * 1  + 1;
	}
	
	var wqYsb = 0;
	//往期已申报(年中开业前不算往期未申报）
	var wqSkssqz = formData.dqdeqcs.initData.sbDqdezxsbInitData.wqSkssqz;
	if((wqSkssqz == undefined || wqSkssqz == "") && sSqq <= bDjrq && bDjrq <= sSqz){
		wqYsb =  djrq.substring(5,7) * 1;
	}else if(wqSkssqz.substring(0,4) == sqz.substring(0,4)){
		wqYsb = wqSkssqz.substring(5,7) * 1;
	}else{
		wqYsb = 0;
	}
	//本期后剩余期数
	var bqhsyqs = (12 - sqz.substring(5, 7) * 1) / months;
	// 计税依据
	var jsyj = 0;
	// 应纳税额
	var bqynse = 0;
	var qnjsyjSl = sl;
	var qnjsyjSskcs = 0;
    var zgswjDm = formData.dqdeqcs.initData.nsrjbxx.zgswjDm;
	if (!jsbz || jsbz == '1') {
		if(zgswjDm.indexOf('163')==0){
			if(ysx>hdjsyj){
				qnjsyjSl=0.005;
			}else{
				qnjsyjSl=0;
			}
		}
		jsyj = ysx;
		bqynse = jsyj * qnjsyjSl;
	}else if (jsbz == '2') {
		// （本年往期已申报属期的计税依据合计（查表）+本期填写的应税项*报文节点yssdl+报文节点hdynsjye*本期后未申报剩余月（季）份数）
		var nynssde = (wqljjsyj + ysx * yssdl + hdjsyj * bqhsyqs);
		jsyj = ysx * yssdl;
		var map = getCommmonGsSlAndSskcs(nynssde, true);
		qnjsyjSl = map['sl'];
		qnjsyjSskcs = map['sskcs'];
		//本期应纳税额      =【nynssde * 分档税率-速算扣除数】-【本年往期已申报属期的应纳税额合计（查表）】-【报文节点hdse*本期后未申报剩余月（季）份数】
		bqynse = (nynssde * qnjsyjSl - qnjsyjSskcs) - wqljynse - hdynse * bqhsyqs;
		//开业受理日期
		var kyslrq=formData.dqdeqcs.initData.sbDqdezxsbInitData.kyslrq;
		//开业年度
		var kynd="";
		if(kyslrq!=""&&kyslrq!=null&&kyslrq!=undefined){
			kynd=kyslrq.split("-")[0];
		}
		//申报年度
		var sbnd=sqz.split("-")[0];

		//年前开业
		if (kynd<sbnd){
			var bnwqysbqs = 0;
			bnwqysbqs = formData.dqdeqcs.initData.sbDqdezxsbInitData.bnwqysbqs*1;
			if((bnwqysbqs+1)!=(sqz.substring(5,7)*1/3)){
				parent.layer.alert("本年您存在往期未申报记录，请先申报往期！", {icon: 2, closeBtn: 0},function (){
					formEngine.closeWindow();
				});
			}
			var jzbqqnynse = nynssde*qnjsyjSl-qnjsyjSskcs;
			var map = getCommmonGsSlAndSskcs(jzbqqnynse, true);
			qnjsyjSl = map['sl'];
			qnjsyjSskcs = map['sskcs'];
			if (hdynse==0){
				bqynse = jzbqqnynse - wqljynse - cshynse * bqhsyqs;
			}else {
				bqynse = jzbqqnynse - wqljynse - hdynse * bqhsyqs;
			}

		}
		//SW2017150-346
		//qnjsyjSl = sl;
	}else if (jsbz == '5') {
		jsyj = ysx;
		bqynse = jsyj * qnjsyjSl;
	}else{
		//开业受理日期
		 var kyslrq=formData.dqdeqcs.initData.sbDqdezxsbInitData.kyslrq;
		 //开业年度
		 var kynd="";
		 if(kyslrq!=""&&kyslrq!=null&&kyslrq!=undefined){
			 kynd=kyslrq.split("-")[0];
		 }
		 //申报年度
		 var sbnd=sqz.split("-")[0];
		 //申报期至月度
		 var sbyd=parseInt((sqz).split("-")[1], 10);
		 //本期后本年未申报剩余月（季）份数
		 var wsbyjds=0;
		 if(nsqxDm=="06"){
			 wsbyjds=12-sbyd;
		 }
        if(nsqxDm=="08"){
        	wsbyjds=(12-sbyd)/3;
		 }
		
		
		//（往期存在未申报期数(查表）+本期后剩余期数（不包括本期）
		var syqs = (12 - wqYsb - bqMonths) / months;
		
		//计税依据=应税项*所得率-法定扣除额*本期月份数
		jsyj = ysx * yssdl - 5000 * bqMonths;
		
		//当本年的往期存在未申报的税款所属期，先确定未申报的期数数量：
		//全年计税依据=往期已申报累计计税依据（序号2本年已申报累计数）+（往期存在未申报期数(查表）+本期后剩余期数（不包括本期））*核定计税依据（序号3）+本期计税依据（序号2本期数）
		var qnjsyj = wqljjsyj + jsyj + syqs * hdjsyj;

		//根据全年计税依据套用经营所得税率表得出征收率和速算扣除数
		var map = getCommmonGsSlAndSskcs(qnjsyj, true);
		qnjsyjSl = map['sl'];
		qnjsyjSskcs = map['sskcs'];
		
		 //年中开业
		 if(kynd===sbnd){
			 var key1= zspmDm+"_"+zszmDm;
			//下期数据
			 var next_hdynsjye=0
			 var next_hdse=0;
			var nextSbxx= formData.dqdeqcs.nextSbxxGrid;
			if(nextSbxx!=undefined&&nextSbxx!=null&&nextSbxx!==""){
				 var nextSbxxList=formData.dqdeqcs.nextSbxxGrid.nextSbxxGridlb;
				 for(var i=0;i<nextSbxxList.length;i++){
					var key2= nextSbxxList[i].zspmDm+"_"+ nextSbxxList[i].zszmDm;
					if(key1===key2){
						next_hdynsjye= nextSbxxList[i].hdynsjye;
						next_hdse= nextSbxxList[i].hdse;
						break;
					}
					 
				 }
			}
			
					 
			 bqynse= (jsyj+next_hdynsjye*wsbyjds+wqljjsyj)*qnjsyjSl-qnjsyjSskcs-(next_hdse*wsbyjds)-wqljynse;
		 }else{
			//本期应纳税额=(全年计税依据（D)*税率(E)-速算扣除(F))[全年的应纳税额（A或B结果）]-往期已申报累计的应纳税额（查表）-（往期未申报期数（查表）+本期后剩余期数（不包括本期））*核定应纳税额（序号6）
				bqynse = qnjsyj * qnjsyjSl - qnjsyjSskcs - wqljynse - syqs * hdynse;
		 }
		
	}
	
	var item = {};
	item.jsyj = ROUND(jsyj, 2);
	item.sskcs = ROUND(qnjsyjSskcs, 2);
	item.sl = qnjsyjSl;
	item.ynse = ROUND(bqynse, 2);
	if (item.jsyj != 'undefined') {
		dqde2018Gs.items[key] = item;
		rtnType = rtnType == 'ynssde' ? 'jsyj' : rtnType;
		return item[rtnType]==undefined || item[rtnType]==""?0:item[rtnType];
	} else {
		return 0;
	}
}


var tysb2018Gs = {};	
tysb2018Gs.items = {};
tysb2018Gs.zsxmDm = '10106';
tysb2018Gs.zspmDm = '101060200,101060300';

/**
 * 新版的101060200，101060300，个税处理
 * rtnType:	返回类型 // 暂不使用
 * ysx:		应税项
 * kcs:		扣除数，默认0
 * yssdl:	应税所得率
 * zspmDm:	征收品目代码(101060200，101060300)
 * zszmDm:	征收子目代码
 * hdjsyj:	核定计税依据
 * nsqxDm:	纳税期限代码
 * zsl:		税率，取自body下的sbxxGridlb.sl
 * sqq:		属期起
 * sqz:		属期止
 * jsbz:	计税标志
 * jsqq:	计税期起
 * fdsl:	法定税率
 * dqdehdFlag: 定额定额标志 "true"||"false"
 * sfzrdxxbFlag: 税费种标志 "true"||"false"
 */
function tysbCalc2018Gs() {
	if (arguments.length < 16) {
		throw "Wrong Parameter Number!";
	}
	var rtnType = arguments[0];
	var ysx = arguments[1];
	var kcs = arguments[2];
	var yssdl = arguments[3]; 		// 后台调用接口返回返回
	var zspmDm = arguments[4];
	var zszmDm = arguments[5];
	var hdjsyj = arguments[6]; 	
	var nsqxDm = arguments[7]; 	
	var sl = arguments[8]; 			// 后台调用接口返回返回
	
	if (tysb2018Gs.zspmDm.indexOf(zspmDm) == -1) {
		return 0;
	}
	
	var sqq = arguments[9]; 	
	var sqz = arguments[10];
	
	// 后台返回
	var jsqq = arguments[11];		// 后台调用接口返回返回
	var jsbz = arguments[12];		// 后台调用接口返回返回
	var fdsl = arguments[13];		// 后台调用接口返回返回
	var dqdehdFlag = arguments[14];	// 后台调用接口返回返回
	var sfzrdxxbFlag = arguments[15];// 后台调用接口返回返回
	
	var sjjyyf = 0; 	
	var ysbyf = 0; 	
	var sskcs = 0;
		
	
	if (yssdl == 'undefined' || yssdl == undefined || yssdl == 0) {
		yssdl = 1;
	}
	if (typeof ysx == "string") {
		ysx = ysx * 1;
	}
	if (typeof kcs == "string") {
		kcs = kcs * 1;
	}
	
	if (typeof sl == "string") {
		sl = sl * 1;
	}
	
	if (typeof fdsl == "string") {
		fdsl = fdsl * 1;
	}
	
	// 优先取暂存的。暂存最多提供20条，如果超过，则移除第一条，添加数据在尾部。
	var item = {};
	var key = ysx + "_" + yssdl + "_" + kcs + "_" + zspmDm + "_" + zszmDm + "_" + jsbz + '_' + nsqxDm;
	if (tysb2018Gs.items[key]) {
		var rtn = [];
		rtn.push(tysb2018Gs.items[key]);
		return rtn;
	}
	
	/** ========================= 业务逻辑处理开始 ============================== **/
	// 实际经营月份
	var sjjyyf = 12 - Number(jsqq.substring(5, 7)) + 1;
	// 2018-10前实际经营月份
	var sjjyBefore = MAX(0, 10 - Number(jsqq.substring(5, 7)));
	// 2018-10后实际经营月份
	var sjjyAfter = MIN(3, 12 - Number(jsqq.substring(5, 7)) + 1);
	// 已申报月份
	var ysbyf = Number(sqz.substring(5, 7)) - Number(jsqq.substring(5, 7)) + 1;
	// 2018-10前已申报月份
	var ysbyfBefore = MAX(0, 10 - Number(jsqq.substring(5, 7)));
	// 2018-10后已申报月份
	var ysbyfAfter = MIN(3, Number(sqz.substring(5, 7)) - MAX(10, Number(jsqq.substring(5, 7))) + 1);
	
	var slRule = 'new';
	var sSqq = sqq.replace('-', '').replace('-', '');	// 格式化属期起(年月)
	var sSqz = sqz.replace('-', '').replace('-', '');	// 格式化属期止(年月)
	if (sSqz < '20181001') {
		slRule = 'old';	
	} else if (sSqq >= '20190101') {
		slRule = 'new';
	} else {
		slRule = 'transition';	
	}
	
	// 属期起月份
	var sqqMonth = Number(sqq.substring(5, 7));	
	// 属期止月份
	var sqzMonth = Number(sqz.substring(5, 7));	
	
	// 计税初始化
	var jsyj = ysx - kcs;	// 计税依据(默认值)
	var sskcs = 0;			// 速算扣除数(默认值)
	var sjsl = 0;			// 由税阶逻辑计算后取到的税率(默认值)
	var ynse = 0;			// 应纳税额(默认值)
	var dqjsFlag = 'N';		// 当期计税标志 Y|N(默认值)
	
	if (dqdehdFlag == 'true' || sfzrdxxbFlag == 'false') {
		dqjsFlag = 'Y';
	}
	
	var zspmPrefix = zspmDm.substring(0, 7);
	// 业务计算
	if ((jsbz == '2' || jsbz == '3') && (zspmPrefix == '1010602' || zspmPrefix == '1010603')) {
		//当jsbz=3或者jsbz=2 都需要速算扣除
		/*if (jsbz == '2') {
			dqjsFlag = 'Y';
			jsyj = (ysx - kcs) * yssdl;
		} else {*/
			var kce = 0;	// 速算扣除数累计
			if (dqjsFlag == 'Y') {
				if (slRule == 'old') {			// 2018-10-01前，纯旧税率
					kce = 3500 * (sqzMonth - sqqMonth + 1);
				} else if (slRule == 'new') {	// 2018-10-01后，纯新税率
					kce = 5000 * (sqzMonth - sqqMonth + 1);
				} else if (nsqxDm == '10') {
					kce = 5000 * sjjyyf;
				}else if (slRule == 'transition') {
					kce = 5000 * (sqzMonth - sqqMonth + 1);
				}
			} else {
				if (slRule == 'old') {			// 2018-10-01前，纯旧税率
					kce = 3500 * ysbyf;
				} else if (slRule == 'new') {	// 2018-10-01后，纯新税率
					kce = 5000 * ysbyf;
				} else {
					kce = 3500 * ysbyfBefore + 5000 * ysbyfAfter;
				}
			}
			
			// 计算所得额
			var sde = (ysx - kcs) * yssdl;
			jsyj = MAX(0, sde - kce);	// 不能为负，小于0则为0
		/*}*/
		
		var yssr = 0;	// 应税收入
		if (dqjsFlag == 'Y') {		// 当期计税计算
			if (slRule == 'new' || slRule == 'old') {		// 不在过渡期内应税收入计算
				yssr = ROUND(jsyj * sjjyyf / (sqzMonth - sqqMonth + 1), 3);
			} else {												// 过渡期内应税收入计算
				yssr = ROUND((jsyj * sjjyBefore + jsyj * sjjyAfter) / (sqzMonth - sqqMonth + 1), 3);
			}
			
			if (slRule == 'old') {			// 旧税率
				var map = getCommmonGsSlAndSskcs(yssr, false);
				sjsl = map['sl'];
				sskcs = map['sskcs'];
				sskcs = ROUND(sskcs * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				ynse = jsyj * sjsl - sskcs;
				/**== finish ==**/
			} else if (slRule == 'new') {	// 新税率
				var map = getCommmonGsSlAndSskcs(yssr, true);
				sjsl = map['sl'];
				sskcs = map['sskcs'];
				sskcs = ROUND(sskcs * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				ynse = jsyj * sjsl - sskcs;
				/**== finish ==**/
			} else {						// 过渡情况
				var oldMap = getCommmonGsSlAndSskcs(yssr, false);
				var oldSjsl = oldMap['sl'];
				var oldSskcs = oldMap['sskcs'];
				
				var newMap = getCommmonGsSlAndSskcs(yssr, true);
				var newSjsl = newMap['sl'];
				var newSskcs = newMap['sskcs'];
				
				ynse = ROUND((yssr * newSjsl - newSskcs) * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				sskcs = ROUND(newSskcs * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				sjsl = newSjsl;		// 过渡期，则显示为新税率
				/**== finish ==**/
			}
		} else {					// 非当期计税计算
			yssr = ROUND(jsyj, 3);
			if (slRule == 'old') {			// 旧税率
				var map = getCommmonGsSlAndSskcs(yssr, false);
				sjsl = map['sl'];
				sskcs = map['sskcs'];
				//sskcs = ROUND(sskcs * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				ynse = jsyj * sjsl - sskcs;
				/**== finish ==**/
			} else if (slRule == 'new') {	// 新税率
				var map = getCommmonGsSlAndSskcs(yssr, true);
				sjsl = map['sl'];
				sskcs = map['sskcs'];
				//sskcs = ROUND(sskcs * (sqzMonth - sqqMonth + 1) / sjjyyf, 3);
				ynse = jsyj * sjsl - sskcs;
				/**== finish ==**/
			} else {						// 过渡情况
				var oldMap = getCommmonGsSlAndSskcs(yssr, false);
				var oldSjsl = oldMap['sl'];
				var oldSskcs = oldMap['sskcs'];
				
				var newMap = getCommmonGsSlAndSskcs(yssr, true);
				var newSjsl = newMap['sl'];
				var newSskcs = newMap['sskcs'];
				
				ynse = ROUND((yssr * oldSjsl - oldSskcs) * ysbyfBefore / ysbyf, 3) + ROUND((yssr * newSjsl - newSskcs) * ysbyfAfter / ysbyf, 3);
				sskcs = newSskcs;
				sjsl = newSjsl;		// 过渡期，则显示为新税率
				/**== finish ==**/
			}
		}
	}
	
	// 补偿操作：如果没有取到税阶税率
	if (sjsl == 0) {
		sjsl = fdsl;
	}
	/** ========================= 业务逻辑处理结束 ============================== **/
	
	item.jsyj = ROUND(jsyj, 2);
	item.ynssde = item.jsyj;		// 兼容旧版写法
	item.ynse = ROUND(ynse, 2);
	item.sskcs = ROUND(sskcs, 2);
	item.sl = ROUND(sjsl, 6);
	if (item.sl == 0) {
		item.sl = sl;
	}
	item.yssdl = yssdl;
	item.jsbz = jsbz;
	item.dqjs = dqjsFlag;
	tysb2018Gs.items[key] = item;
	var rtn = [];
	rtn.push(item);
	return rtn;
}

/**
 * 个体工商户的生产、经营所得和对企事业单位的承包经营、承租经营所得适用
 * 2019开始，可考虑移除flag只保留新税率即可。
 * @param ynssde	全年应纳税所得额
 * @param flag	true或非空：新税率，空或false，旧税率
 * @return sl:税率, sskcs:速算扣除数
 */
function getCommmonGsSlAndSskcs(ynssde, flag) {
	var result = {};
	
	if (!ynssde || isNaN(ynssde)) {
        ynssde = 0;
    }

	if (flag) {
		if (ynssde <= 30000) {
			result['sl'] = 0.05;
			result['sskcs'] = 0;
		} else if (ynssde > 30000 && ynssde <= 90000) {
			result['sl'] = 0.1;
			result['sskcs'] = 1500;
		} else if (ynssde > 90000 && ynssde <= 300000) {
			result['sl'] = 0.2;
			result['sskcs'] = 10500;
		} else if (ynssde > 300000 && ynssde <= 500000) {
			result['sl'] = 0.3;
			result['sskcs'] = 40500;
		} else if (ynssde > 500000) {
			result['sl'] = 0.35;
			result['sskcs'] = 65500;
		}
	} else {
		if (ynssde <= 15000) {
			result['sl'] = 0.05;
			result['sskcs'] = 0;
		} else if (ynssde > 15000 && ynssde <= 30000) {
			result['sl'] = 0.1;
			result['sskcs'] = 750;
		} else if (ynssde > 30000 && ynssde <= 60000) {
			result['sl'] = 0.2;
			result['sskcs'] = 3750;
		} else if (ynssde > 60000 && ynssde <= 100000) {
			result['sl'] = 0.3;
			result['sskcs'] = 9750;
		} else if (ynssde > 100000) {
			result['sl'] = 0.35;
			result['sskcs'] = 14750;
		}
	}
	
	return result;
}

/**
 * 通用申报判断是否有定期定额的提示
 */
function tysbCheckDqdeHdTips() {
	var result = false;
	var dqdeGrid = formData.qcs.initData.tysbbInitData.dqdeHdxxGrid;
	if (dqdeGrid && dqdeGrid.dqdeHdxxGridlb && dqdeGrid.dqdeHdxxGridlb.length > 0) {	// 存在定额，检索
		$.each(dqdeGrid.dqdeHdxxGridlb, function(i, item) {
			if (item.zsxmDm && item.zspmDm) {
				result = true;
				return false;
			}
		});
	} 
	
	return result;
}
 
 /**
  * 扣缴企业所得税	计算实缴金额
  * 
  * jsje	计税金额
  * kssl	课税数量
  * sl		税率
  * dwse	单位税额
  * xssr	销售数量
  * kce		扣除额
  * yje		已缴额
  */
 function calculate_jsje(){
	 if(arguments.length<6){
		 throw "Wrong Parameter Number!" ;
	 }
	 var jsje = arguments[0];
	 var kssl = arguments[1];
	 var sl = arguments[2];
	 var dwse = arguments[3];
	 var xssr = arguments[4];
	 var kce = arguments[5];
	 if (arguments.length==7){
		 var yje = arguments[6];
		 //当“计税金额”大于0时,本项=计税金额*税率-已缴额-扣除额；
		 if (jsje>0){
			 return jsje*sl-yje-kce;
		 }
		 //当“计税金额”小于等于0，并且“课税数量”大于0时,本项=课税数量*单位税额-已缴额-扣除额；
		 if (jsje<=0 && kssl>0){
			 return kssl*dwse-yje-kce;
		 }
		 //当“计税金额”小于等于0，并且“课税数量”小于等于0时,本项=销售收入*税率-已缴额-扣除额
		 if (jsje<=0 && kssl<=0){
			 return xssr*sl-yje-kce;
		 }
		 return 0;
	 }
	 //当“计税金额”大于0时,本项=计税金额*税率-扣除额；
	 if (jsje>0){
		 return jsje*sl-kce;
	 }
	 //当“计税金额”小于等于0，并且“课税数量”大于0时,本项=课税数量*单位税额-扣除额；
	 if (jsje<=0 && kssl>0){
		 return kssl*dwse-kce;
	 }
	 //当“计税金额”小于等于0，并且“课税数量”小于等于0时,本项=销售收入*税率-扣除额
	 if (jsje<=0 && kssl<=0){
		 return xssr*sl-kce;
	 }
	 return 0;
 }
 
 calculate_gs_jsme_sl_sskcs.gs_zsxmDm = '10106';
 calculate_gs_jsme_sl_sskcs.json = {};
 /*calculate_gs_jsme_sl_sskcs end*/
 
 /**
  * 消费税税费种认定校验
  * 
  * zspmDm	征收品目(多个用英文","号隔开)
  * xfs_sfzrd('101020201,101020222')
  */
function xfs_sfzrd(){
	 var zspmDm = arguments[0];
	 if (zspmDm==""||zspmDm==null){
		 throw "Wrong Parameter Data!";
	 }
	 var zspmDms = zspmDm.split(",");
	 var qtszhds = this.formData.qcs.initData.hdxx.qtszhd;
	 if ($.isEmptyObject(qtszhds)){
		 return true;
	 }
	 for (var i=0; i<zspmDms.length; i++){
		 for (var j=0; j<qtszhds.length; j++){
			 if (zspmDms[i]==qtszhds[j].zspmDm){
				 return false;
			 }
		 }
	 }
	 return true;
}
 

 
 /**
  * 根据国地税标志和区域代码校验税务机关代码所属地区
  * flagDm
  * 		标志，如244为广东地税，44为广东省不考虑国地税区分;多个用逗号隔开244,151
  * swjgDm
  */
 function checkZgswjgDm(){
 	var flagDm = arguments[0];
 	var swjgDm = arguments[1];
 	
 	if ($.isEmptyObject(flagDm) || $.isEmptyObject(swjgDm)){
 		throw "Wrong Parameter Data:null Data!";
 	}
 	var dms = flagDm.split(",");
 	for (var i = 0; i < dms.length; i++){
 		if (dms[i].length==3 && (dms[i]==swjgDm.substring(0,3))){
 			return true;
 		}
 		if (dms[i].length==2 && (dms[i]==swjgDm.substring(1,3))){
 			return true;
 		}
 	}
 	return false;
 }

 /**
  * 城镇土地使用税——月减免金额计算
  */
 function jsYjmsje1(){
 	var dwse = arguments[0];
 	var jmzlxDm = arguments[1];
 	var jmmj = arguments[2];
 	var jmed = arguments[3];
 	var jmsl = arguments[4];
 	var jmfd = arguments[5];
 	var jmxzDm = arguments[6];
 	
 	var jmjsyj = jmmj/12;
 	var jmynse = jmmj*dwse/12;
 	var yjmsje1 = jmynse;
 	
 	if (jmzlxDm=='01'){
 		if(jmed>0){
 			yjmsje1 = jmed>jmynse?jmynse:jmed;
 		}else if(jmsl>0 && dwse>jmsl){
 			yjmsje1 = jmjsyj*(dwse-jmsl);
 		}else if(jmfd>0 && jmfd<1){
 			yjmsje1 = jmjsyj*(1-jmfd)*dwse;
 		}
 	}
 	return yjmsje1;
 }

 /**
  * 企业a年报7040减免优惠表单元格填写校验
  */
 function checkJmyh(arg0){
 	var count = 0;
 	var isTrue = true;
 	for (var i = 0;i < arg0.length;i++){
 		if(arg0[i]>0){
 			count = count + 1;
 			if(count > 1){
 				isTrue = false;
 				break;
 			}
 		}
 	}
 	
 	return isTrue;
 }
 
 /**
  * 企业a年报7040小微优惠表单元格填写校验
  */
 function checkXwjm(arg0){
 	var isTrue = true;
 	for (var i = 0;i < arg0.length;i++){
 		if(arg0[i]>0){
 				isTrue = false;
 				break;
 			}
	}
 	return isTrue;
 }
 
 /**
  * 企业a年报7040减免优惠表的享受过渡期税收优惠企业校验
  * 需求:填写大于0且＜表A100000第25行的金额(数组最后一个元素)
  */
 function checkMsjj(arg0){
 	
 	var isTrue = true;
 	var lastIndex = arg0.length-1;
 	
 	for (var i = 0;i < lastIndex;i++){
 		if (arg0[i]>0 && arg0[i] < arg0[lastIndex]){
 			isTrue = false;
 			break;
 		}
 	}
 	
 	return isTrue;
 }

 function autoResizeIframe (frameId,customizedHeight,customizedWidth) {
	 console.info("autoResizeIframe: "+frameId);
 	var frame = document.getElementById(frameId);
 	var frameContentWidth = 0;
 	var frameContentHeight = 0;
 	var frameWidth = 0;
 	var frameHeight = 0;
 	if (frame != null && !window.opera) {
 		/* var frameDoc = frame.document || frame.ownerDocument;
 		if (frameDoc != null) {
 			var width = customizedWidth || frameDoc.body.scrollWidth;
 			var height = customizedHeight || frameDoc.body.scrollHeight;
 			frame.height = height;
 			//frame.width = width;
 		} */
 		if (frame.contentDocument && frame.contentDocument.body.offsetHeight) { 
 			frameHeight = frame.contentDocument.body.offsetHeight; 
 			frameContentWidth = frame.contentDocument.body.offsetWidth;
 		} else if (frame.Document && frame.Document.body.scrollHeight) { 
 			frameHeight = frame.Document.body.scrollHeight; 
 			frameContentWidth = frame.Document.body.scrollWidth; 
 		}
 		frameWidth = Math.max(frame.scrollWidth,frame.offsetWidth);
 		frameHeight = document.getElementsByClassName("SheetMenu")[0].style.height;
 		if(typeof frameHeight == "string"){
 			frameHeight = parseInt(frameHeight);
 		}
 		//frame.width = frameWidth;
 		if(frameWidth < frameContentWidth){
 			frame.height = frameHeight-16;
 	 		frame.style.height = (frameHeight)+"px";
 		}else{
 			frame.height = frameHeight;
 	 		frame.style.height = (frameHeight)+"px";
 		}
 	}
 }
 
 
 /**
  * 用于企业a年报9090-多节点非空校验，
  * arg0 :数组 [a,b,c,...,2]，存放要校验的数据和相关的数据，最后一位数字表示要校验 的数据是第几个(从0开始)。
  * 
  */
 function checkIsNull(arg0){
 	var needNum = false;//返回值，返回false则有校验提示，true则校验通过无提示
 	var otherNum = false;//校验判断
 	var bz = arg0[arg0.length-1];//标志位，标志要校验的值
 	var needNumber = arg0[bz];//要校验的数据
 	for (var i = 0;i < arg0.length-1;i++){
 		if(i != bz){
 			//区分字符串和数字
 			if(typeof arg0[i] == "string"){
 				if(arg0[i]!=null && arg0[i]!=""){
 	 				otherNum = true;//存在其他文本框不为空
 	 				break;
 	 			}
 			}else{
 				if(arg0[i]!=0){
 	 				otherNum = true;//存在其他文本框不为空
 	 				break;
 	 			}
 			}
 			
 			
 		}
 		
 	}
 	//两种情况校验正确：① 校验的数据有值；②其他没值，校验的数据没值
 	if(typeof needNumber == "string"){
	 	if((!otherNum && (needNumber==null || needNumber=="")) || (needNumber!=null && needNumber!="")){
	 		needNum = true;
	 	} 
 	}else{
 		if((needNumber!=0) || (!otherNum && (needNumber==0))){
	 		needNum = true;
	 	} 
 	}
 	return needNum;
 } 
//bug-GEARS-2170需要
 function GEARS2170(a,b){
	 var hadStxs = false;
	 var needNum = 0;
	 var Stxs;
	 
	 if((formData.qcs.initData.qysdsndAInitData.formInitStr).indexOf("5010")>-1){
		 hadStxs = true;
		 Stxs = formData.zhrmghgjmqycczzndnssbYwbw.stxshfdckfqytdywnstzmxb.stxshfdckfqytdywnstzMxbVO;
	 }
	 
	 if(hadStxs){
		 needNum = parseFloat(a + b +Stxs.xswwgcpsrssje - Stxs.xswwgcpzwgcpssje);
	 }else{
		 needNum = parseFloat(a + b);
	 }
	 
	 return needNum;
 }
 
function szjkMsyhCheck(dm,nodeTj){
	var checkdm = false;//减免性质有等于dm里的某代码时为true
	var checkResult = true;
	var jmxzDm ;
	var jmxxGridlb = false;
	
	if(formData.qcs.initData.yhxx){
		if(formData.qcs.initData.yhxx.jmxxGrid){
			if(formData.qcs.initData.yhxx.jmxxGrid.jmxxGridlb){
				jmxxGridlb = true;
			}
		}
	}
	
	if(jmxxGridlb){
		var jmxx= formData.qcs.initData.yhxx.jmxxGrid.jmxxGridlb;
		//减免为数组的时候
		if(jmxx instanceof Array){
			for(var i=0;i<jmxx.length;i++){
				if(jmxx[i].ssjmxzhzDm!=undefined){
					for(var j=0;j<dm.length;j++){
						if(jmxx[i].ssjmxzhzDm == dm[j]){
							checkdm = true;//存在需要的减免性质代码
							break;
						}
					}
				}
			}
		}else{
			jmxzDm = formData.qcs.initData.yhxx.jmxxGrid.jmxxGridlb.ssjmxzhzDm;
			
			for(var i=0;i<dm.length;i++){
				
				if(jmxzDm == dm[i]){
					checkdm = true;//存在需要的减免性质代码
					break;
				}
			}
		}
	
	}
	
	if(!checkdm && nodeTj){
		checkResult = false;
	}
	
	return checkResult;
	
}
//企业所得税季度，用于提示财务报表是否已报送 
/*function verifyqysdsjdInit(cwbbsb ) {
	
	//cwbbsb 用于判断本期的财务报表是否已报送
	
	if(cwbbsb=="N"){
	var sfjx=confirm("该纳税人未报送本属期的财务会计报表。请按期报送，逾期未报送的按《税收征收管理法》（以下简称征管法）有关规定进行处理。请确认是否继续申报？ ")
	//确定则进入基础页面，取消则关闭当前页面	
	if(sfjx){
			return ;
		}else{
		     window.top.opener=null; 
		       window.top.open('', '_self', ''); 
		       window.top.close(); 
			}
			}
	return ;
}
*/
//增值税一般纳税人减免表期初余额带出
function getZzsybnsrJmqcye(hmc,ewbhxh){
  //本期起初余额
	var bqqcye=0.00;
	var flag = false;
	//起初减免表信息
	var jmxx= formData.qcs.initData.zzsybnsrsbInitData.sbZzsjmssbmxbjsxmqcsxxGrid;
	if ($.isEmptyObject(jmxx)){
		 return bqqcye;
	 }
	var jmxxlist=jmxx.sbZzsjmssbmxbjsxmqcsxxGridlb;
	for(var i=0;i<jmxxlist.length;i++){
				if(jmxxlist[i].hmc==hmc){
					bqqcye= jmxxlist[i].qmye;
					flag = true;
				}
	}
	if(!flag && ewbhxh==2){
		return formData.zzsybsbSbbdxxVO.zzsjmssbmxb.zzsjmssbmxbjsxmGrid.zzsjmssbmxbjsxmGridlbVO[ewbhxh-2].qcye;
	}
	 return bqqcye;
} 

//用于校验期初数信息里面的预缴信息是否有数据 有： return true ； 无： return false
function yjxxsffh(){
	var _yhxx= formData.qcs.initData.yhxx;
	if($.isEmptyObject(_yhxx)){
		 return false;
	}
	var _yjxx=_yhxx.yjxxGrid;
	if($.isEmptyObject(_yjxx)){
		 return false;
	}
	var _yjxxlist=_yjxx.yjxxGridlb;
	if($.isEmptyObject(_yjxxlist)){
		 return false;
	}
	 return true ;
}

function commonError500Callback(layerInstance, data){// return true 直接返回。return false，继续公共流程。
	if(location.pathname.indexOf("/ybnsrzzs")>-1){
		if(data.responseText.indexOf("未进行一般纳税人增值税系统设置！")>-1){
			$("body").unmask();
			layerInstance.closeAll('loading');
			//layerInstance.alert("未进行一般纳税人增值税系统设置！");
			linkXbsz();
			return true;
		}
		if(data.responseText.indexOf("获取期初数服务失败，未设置期初数信息，请联系管理员！")>-1){
			$("body").unmask();
			layerInstance.closeAll('loading');
			layerInstance.alert("纳税人本期申报未在系统提交，无法带出申报数据，请选择‘期初数设置’，填写期初数据后，重新填报本期数据！",{icon:5,closeBtn:0});
			//jumpQcssz();
			parent.$(".areaHeadBtn").find("li").find("a[id!=btnQcssz]").parent("li").remove();
			return true;
		}
		if(data.responseText.indexOf("GZSB_QCS_0001_YBNSRZZS")>-1){
			$("body").unmask();
			layerInstance.closeAll('loading');
			layerInstance.alert("纳税人本期因附表勾选变更,暂存数据不可用，期初数未设置，无法进行初始化。请选择‘期初数设置’，填写期初数据后，重新填报本期数据！",{icon:5,closeBtn:0});
			//jumpQcssz();
			parent.$(".areaHeadBtn").find("li").find("a[id!=btnQcssz]").parent("li").remove();
			return true;
		}
	}
	if(data.responseText.indexOf("上期未申报")>-1 || data.responseText.indexOf("请检查是否已申报")>-1){
		//layerInstance.alert(data.responseText,{icon:5,closeBtn: 0});
		var text = data.responseText.replace("<link href=\"/sbzs-cjpt-web/abacus/_res_/css/error/msg.css\" rel=\"stylesheet\"","")
		.replace("type=\"text/css\" />","");
		layerInstance.alert(text, {
			icon : 5,
			closeBtn: 0,
			offset : '270px'
		}, function(index) {
				// GZDSDZSWJ-1510 页面一直卡起，误认为死机
            formEngine.closeWindow();
    	});
		return true;
	}
	return false;
}

//企业所得税 小微企业特殊提示
function qysds_xwqytstj(flag,tipsMsg){
	
	if(flag==null || flag==""){
		return ;
	}
	if(flag){
		Message.succeedInfo({
			title : "提示",
			height:200,
			width:400 ,
			message : tipsMsg
		});
		
		formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.xwqytipsBz='1';
	}
	
}

//企业所得税 小微企业计算

function getXwqybz(lj9,lj20,qzd  ){
	
	if(lj9>qzd||lj20>qzd){
		
		return "N";
	}
	var b=formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy_old1;
	return b;
}

//环保税采集附表4 计算排污系数公式
function getPwxs(mc,cwxs,uuid){
		var syxx_xs=formData.qcs.hjbhsFb4Syxx;
		var syxx_jk=formData.qcs.qcs_fb4.hbscpwxscjb.pwxsjcxxcjGrid.pwxsjcxxcjGridlb;
		if(syxx_xs.length==syxx_jk.length){
			
		for(var i=0;i<syxx_xs.length;i++){
			if(syxx_xs[i].pwxsuuid==uuid){
				
				if(syxx_xs[i].mdzljsmc==""){
					return syxx_xs[i].cwxs;
				}
				return syxx_jk[i].pwxs;
		}
			}
	}
				
		for(var i=0;i<syxx_xs.length;i++){
			if(syxx_xs[i].pwxsuuid==uuid){
				
				if(syxx_xs[i].mdzljsmc==""){
					return syxx_xs[i].cwxs;
				}
				return 0;
			 	}
		  }
}

function getxwje(jbzsLjje){
	//当主表是否属于小型微利企业为否时，附表3第2行2列锁定不可修改。所以返回0
	if("N"==formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy){
		return 0.00;
	}
	var je=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.fhtjdxxwlqyLj;
	var bz=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.xwjmbz;
	
	if(bz=='Y'){
		return je;
	}
	if(bz=='N'){
		return jbzsLjje;
	}
	
}


function getjbzsLj(sfsyxxwlqy,yjfs,sjlreLj,xwqyqzd,byjynssdeLj){
	var zjjd=0;
	var sfwl=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.sfwl;
	if(sfwl<=0){
		zjjd=(formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy=='Y'?(formData.qcs.initData.qysds2015JmJdAsbInitData.yjfs=='1'?(formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sjlreLj>=0.03&&formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sjlreLj<=formData.qcs.initData.qysds2015JmJdAsbInitData.xwqyqzd?formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sjlreLj*0.15:0):(formData.qcs.initData.qysds2015JmJdAsbInitData.yjfs=='2'?(formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy=='Y'?(formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.byjynssdeLj>=0.03&&formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.byjynssdeLj<=formData.qcs.initData.qysds2015JmJdAsbInitData.xwqyqzd?formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.byjynssdeLj*0.15:0):0):0)):0);
	}
	
	var je=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.fhtjdxxwlqyLj;
	var jbzsLj=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.jbzsLj;
	var bz=formData.qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.xwjmbz;
	if(bz=='N'||(bz=='Y'&&je!=0)){
		return zjjd;
	}
	if(bz=='Y'&&je==0){
		return 0;
	}

}
/**
 * 
 * @param pm固体废物情况选择品目时，子目下拉有数据要校验
 * @param zm
 * @returns {Boolean}
 */
function pd(pm,zm){
	var c=0;
	//var scope = angular.element($(".NewTableMain")).scope();
	var a=formData.qcs.initData.hbsjbxxcx.zspmYzszmlist.wrwlb_s.zspmYzszm;
	if(pm!=""&&pm!=null){
	for(var i=0;i<a.length;i++){
		if(a[i].zspmDm==pm){
			var b=a[i].zszmlist.zszmmx;
			 c=b.length;
			break;
		}
		
	}
	}
	
	if(zm!=""&&zm!=null){
		return true;
	}
	if(pm==''||pm==null){
		return true;
	}
	
	if(c==1&&pm!=""&&pm!=null){
		return true;
	}else{
		return false;
	}
}

/**
 * 
 * 固体废物接受或委托选品目时，子目下拉有数据校验
 * @param pm
 * @param zm
 * @returns {Boolean}
 */
function pdjshwt(pm,zm){
	var lx=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJJshwtwdwclqkGrid.dJJshwtwdwclqkGridlb;
	var glpm=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJGtfwcsqkGrid.dJGtfwcsqkGridlb;
	var zhly=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJZhlyssGrid.dJZhlyssGridlb;
	var hgcz=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJHgczssGrid.dJHgczssGridlb;
	var cccs=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJHgcccsssGrid.dJHgcccsssGridlb;
	var CTjshwt={};
	for(var i=0;i<glpm.length;i++){
		var zszmDm_xs=glpm[i].zszmDm;
		var zspmDm_xs=glpm[i].zspmDm;
		if(isNull(zspmDm_xs)){continue;}
		if(!isNull(CTjshwt[zspmDm_xs])){
			if(isNull(zszmDm_xs)){continue;}
				var zszmMc=findMc(zszmDm_xs,zspmDm_xs);
				if(!isNull(zszmMc)){
					var zmObj={"zszmDm":zszmDm_xs,"zszmMc":zszmMc};
					CTjshwt[zspmDm_xs][CTjshwt[zspmDm_xs].length]=zmObj;
				}
		}else{
			CTjshwt[zspmDm_xs]=[];
			if(isNull(zszmDm_xs)){continue;}
				var zszmMc=findMc(zszmDm_xs,zspmDm_xs);
				if(!isNull(zszmMc)){
					var zmObj={"zszmDm":zszmDm_xs,"zszmMc":zszmMc};
					CTjshwt[zspmDm_xs][CTjshwt[zspmDm_xs].length]=zmObj;
				}
		}
	}
	var jshwtlen=0;
	if(pm!=""&&pm!=null){
		if(CTjshwt[pm]!=undefined){
			jshwtlen=CTjshwt[pm].length;
		}
		
	}
	
	if(zm!=""&&zm!=null){
		return true;
	}
	if(pm==''||pm==null){
		return true;
	}
	
	if(jshwtlen==0&&pm!=""&&pm!=null){
		return true;
	}else{
		return false;
	}
	
	
}

/**
 * 检查数据是否为空
 * 
 * @method isNull
 * @param param
 *            {Object} 参数对象
 * @returns {Boolean} 检查结果为空或未定义返回true，不为空返回false
 */
function isNull(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param) {
		return true;
	}
	return false;
}


/**固体废物根据子目代码查子目名称
 * 
 * @param zszm
 * @param zspm
 * @returns
 */
function findMc(zszm,zspm){
	var zm=[];
	var pm=formData.qcs.initData.hbsjbxxcx.zspmYzszmlist.wrwlb_s.zspmYzszm;
	//找到对应品目码表
	for(var i=0;i<pm.length;i++){
		if(pm[i].zspmDm==zspm){
			zm=pm[i].zszmlist.zszmmx;
			break;
		}
		
	}
	for(var i=0;i<zm.length;i++){
		if(zm[i].zszmDm==zszm){
			return zm[i].zszmMc;
		}
	}
}
/**
 * 
 * 固体废物防治设施选择品目时，子目下拉有数据时校验
 * @param pm
 * @param zm
 * @returns {Boolean}
 */
function pdfzss(pm,zm){
	var CTfz={};
	var lx=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJJshwtwdwclqkGrid.dJJshwtwdwclqkGridlb;
	var glpm=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJGtfwcsqkGrid.dJGtfwcsqkGridlb;
	var zhly=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJZhlyssGrid.dJZhlyssGridlb;
	var hgcz=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJHgczssGrid.dJHgczssGridlb;
	var cccs=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJHgcccsssGrid.dJHgcccsssGridlb;
	var arr2=[];
	for(var i=0;i<glpm.length;i++){
		if(!isNull(glpm[i].zspmDm)){
			var zspmDm_xs=glpm[i].zspmDm;
				var zszmDm_xs=glpm[i].zszmDm;
				var bzObj={"zspmDm":zspmDm_xs,"zszmDm":zszmDm_xs};
				arr2[arr2.length]=bzObj;
		}
	}
	for(var i=0;i<lx.length;i++){
		if(!isNull(lx[i].zspmDm)){
			var zspmDm_xs=lx[i].zspmDm;
				var zszmDm_xs=lx[i].zszmDm;
				var bzObj={"zspmDm":zspmDm_xs,"zszmDm":zszmDm_xs};
				arr2[arr2.length]=bzObj;
		}
	}

	for(var i=0;i<arr2.length;i++){
		var zszmDm_xs=arr2[i].zszmDm;
		var zspmDm_xs=arr2[i].zspmDm;
		if(isNull(zspmDm_xs)){continue;}
		if(!isNull(CTfz[zspmDm_xs])){
			if(isNull(zszmDm_xs)){continue;}
				var zszmMc=findMc(zszmDm_xs,zspmDm_xs);
				if(!isNull(zszmMc)){
					var zmObj={"zszmDm":zszmDm_xs,"zszmMc":zszmMc};
					CTfz[zspmDm_xs][CTfz[zspmDm_xs].length]=zmObj;
				}
		}else{
			CTfz[zspmDm_xs]=[];
			if(isNull(zszmDm_xs)){continue;}
				var zszmMc=findMc(zszmDm_xs,zspmDm_xs);
				if(!isNull(zszmMc)){
					var zmObj={"zszmDm":zszmDm_xs,"zszmMc":zszmMc};
					CTfz[zspmDm_xs][CTfz[zspmDm_xs].length]=zmObj;
				}
		}
	}
	
	
	var fzlen=0;
	if(pm!=""&&pm!=null){
		if(CTfz[pm]!=undefined){
			fzlen=CTfz[pm].length;
		}
		
	}
	
	if(zm!=""&&zm!=null){
		return true;
	}
	if(pm==''||pm==null){
		return true;
	}
	
	if(fzlen==0&&pm!=""&&pm!=null){
		return true;
	}else{
		return false;
	}
}

/*function different_pmzm(pm,zm){
	var glpm=formData.qcs.newHXZGDJ00843Response.hbsgtfwcjb.dJGtfwcsqkGrid.dJGtfwcsqkGridlb;
	var count=0;
	//品目不为空
	if(isNull(pm)){return true;}
	//品目和子目都不为空，品目不为空，子目为空
	if((!isNull(pm)&&isNull(zm))||(!isNull(pm)&&!isNull(zm))){
		for(var i=0;i<glpm.length;i++){
			if((pm==glpm[i].zspmDm)&&(zm==glpm[i].zszmDm)){
				count++;
				if(count==2){
					return false;
				}
			}
			if((pm==glpm[i].zspmDm)&&(zm==null)){
				count++;
				if(count==2){
					return false;
				}
			}
		}
	}
	return true;
	
}*/


//环保税固体计算表的 当期存储量的校验
function dqcclValidate(dqccl,zspmDm){
	if(dqccl<=0){
		return true;
	}
	// 用于标记是否有合规存储场所（设施）
	var ishgcc=false;  
	//合规存储场所（设施）
	var hgccsslist=formData.qcs.fb2.hbsgtfwcjb.dJHgcccsssGrid.dJHgcccsssGridlb;
	for(var i=0;i<hgccsslist.length;i++){
		if(hgccsslist[i].zspmDm!=""&&hgccsslist[i].zspmDm!=null){
			ishgcc=true;
			break;
		}
	}
	return ishgcc;
}

//环保税固体计算表的 当期处置量的校验
function dqczlValidate(dqczl,zspmDm){
	
	if(dqczl<=0){
		return true;
	}
	
	//合规处置信息
	var hgczsslist=formData.qcs.fb2.hbsgtfwcjb.dJHgczssGrid.dJHgczssGridlb;
	//接受或委托其他单位处理信息
	var jshwtczsslist=formData.qcs.fb2.hbsgtfwcjb.dJJshwtwdwclqkGrid.dJJshwtwdwclqkGridlb;
	
	var ishgcz=false;  // 用于标记是否有合规处置信息
	var iswtqtdw=false; // 用于标记是否有委托其他单位处理
	
	for(var i=0;i<hgczsslist.length;i++){
		if(hgczsslist[i].zspmDm!=""&&hgczsslist[i].zspmDm!=null){
			ishgcz=true;
			break;
		}
	}
	
   for(var i=0;i<jshwtczsslist.length;i++){
	   if(jshwtczsslist[i].gtfwclflxDm=="2"){
		   iswtqtdw=true;
			break;
	   }
	}
	
   //采集信息中的 “合规处置设施” 为空，且未委托其他单位处理  [本月固体废物的处置量（吨）]不能大于0！
   if(ishgcz||iswtqtdw){
	   return true;
   }
   return false;
}

/**
 * 环保税采集主表污染物类别的校验
 * @param wrwlb 	表头的污染物集合	字符串a,b,c
 * @param sfcycs	是否抽样测算 		Y|N
 * @param sywrwlb	当前动态行的排放口大类
 * @returns {boolean}
 */
function wrwlbValidate(wrwlb, sfcycs, sywrwlb){
	// 如果是抽样测试后者没有污染物集合，则直接返回
	if(sfcycs === "Y" || wrwlb === ""){
		 return true;
	}
	// 获取动态行信息，如果没有，则直接返回true
	var syxx = formData.qcs.hjbhsSyxx;
	if(syxx.length === 0){
		 return true;
	}
	var wrwstr = "";
    // 表头污染物类别数据拆分为数组[a, b, c]
	// 如果没有数据，则返回true(有点多余，最开始已经排除这种情况)
	var wrwArray = wrwlb.split(",");
	if(wrwArray.length === 0){
		 return true;
	}
	// 遍历税源信息动态行，获取污染物类别，拼接为字符串a,b,c
	for(var i = 0; i < syxx.length; i++){
		var zywrwlbDm = syxx[i].zywrwlbDm;
		if (zywrwlbDm && zywrwlbDm !== 'null' && zywrwlbDm != 'undefined') {
            wrwstr = wrwstr + zywrwlbDm;
        }
		//当集合A: wrwlb 不能全包含集合B ： zywrwlbDm 时  则反true  ;这种情况 用 这个方法检验sywrwlbValidate
		if(zywrwlbDm!=""&&zywrwlbDm!=null&&zywrwlbDm!=undefined&&wrwlb.indexOf(zywrwlbDm)==-1){
			 return true;
		}
		
	}
	
	// 遍历表头污染物类别数组，除固体外，表头污染物集合中存在污染物类别，但不存在于动态行污染物类别中，则返回false
	for(var i = 0; i < wrwArray.length; i++){
		var bz = wrwArray[i];
		//固体不需要税源
		if(bz === "S"){
			continue;
		}
		if(wrwstr.indexOf(bz) === -1||wrwstr==""||wrwstr==null||wrwstr==undefined){
			 return false;
		}
	}
	 return true;
}

/**
 * 环保税采集主表污染物类别的校验
 * @param wrwlb 	表头的污染物集合	字符串a,b,c
 * @param sfcycs	是否抽样测算 		Y|N
 * @param sywrwlb	当前动态行的排放口大类
 * @returns {boolean}
 */
function sywrwlbValidate(wrwlb, sfcycs, sywrwlb){
	if (!wrwlb) {
        wrwlb = '';
	}
	if (!sywrwlb) {
        sywrwlb = '';
	}
	// 如果没有动态行，则直接返回
	var syxx = formData.qcs.hjbhsSyxx;
	if(syxx.length === 0){
		 return true;
	}
	// 遍历动态行，如果动态行污染物中存在的数据，不存在于表头污染物集合中，则返回false
	for(var i = 0; i < syxx.length; i++){
		var zywrwlbDm = syxx[i].zywrwlbDm;
		if(zywrwlbDm!=""&&zywrwlbDm!=null &&wrwlb.indexOf(zywrwlbDm) === -1){
			 return false;
		}
	}

	return true;
}

/**
 * 环保税采集主表
 * 判断是否有一条税源信息有【排污许可证副本编号】
 */
function checkPhxkzfbbh() {
    var result = false;
	var list = formData.qcs.hjbhsSyxx;
	if (list.length === 0) {
        result = false;
	}

	$.each(list, function(i, item) {
		if (item.pwxkzbh && item.pwxkzbh !== 'null' && item.pwxkzbh !== 'undefined') {
            result = true;
            return false;
		}
	});

	return result;
}

//环保税采集主表 判断 初始带出的税源信息 是否全都没有许可证。

function xkzValidate(){
	var syxx=formData.qcs.hjbhsSyxx;
	if(syxx.length==0){
		 return true;
	}
	var flag=0;
	for(var i=0;i<syxx.length;i++){
		if(syxx[i].pwxkzbh!=""){
			flag++;
		}
	}
	
	if(flag>0){
		return true;
	}
	return false;
}
//扣缴企业实际征收率带出,根据下拉选择根据适用税收协定条款时查询税率
function getkjsjzsl(dy,tk){
	var zsl=formData.qcs.initData.kjqysdsBgbInitData.sjzsl;
	var oldzsl=0.1;
	//$..kjqysdssbvo.fdyqkjqkForm.sjzsl=IF($..nsrjbxxForm.sfxsssxddy=='1'&&$..nsrjbxxForm.syssxdtk=='2001',$..kjqysdsBgbInitData.sjzsl,$..kjqysdssbvo.fdyqkjqkForm.sjzslzjjd)
	if(dy=="1"&&(tk!=""&&tk!=null)&&zsl!=0.1){
		return zsl;
	}else{
		return oldzsl;
	}
	
}

//环保税B校验 月份 征收品目 征收子目 是的都一样
function compareRow(yf,zspmDm,zszmDm ){
	var arr=formData.ywbw.sbskxxGrid.sbskxxGridlb;
	var j=0;
	//当前月份为空不参与比较
	if(isNull(yf)||isNull(zspmDm)){
		return true;
	}
	
	
	for (var i = 0; i < arr.length; i++) {
		if(j<2){
			if(zspmDm==arr[i].zspmDm&&zszmDm==arr[i].zszmDm&&yf==arr[i].yf){
				j++;
			}			
		}else{
			break;
		}
	}
	if(j>=2){
	
		return false ;
}
	
	return true;
}

//GDSDZSWJ-6453 屏蔽backspace按钮的回退页面操作,common.js与viewEngine.js都引入这段代码
//Start Add By Huangweiping
$(document).ready(function() {
	//实现对字符码的截获，keypress中屏蔽了这些功能按键
	document.onkeypress = banBackSpace;
	//对功能按键的获取
	document.onkeydown = banBackSpace;
});
function banBackSpace(e) {
	var ev = e || window.event;
	//各种浏览器下获取事件对象
	var obj = ev.relatedTarget || ev.srcElement || ev.target
			|| ev.currentTarget;
	//按下Backspace键的keyCode为8
	if (ev.keyCode == 8) {
		var tagName = obj.nodeName //标签名称
		//如果标签不是input或者textarea则阻止Backspace
		if (tagName != 'INPUT' && tagName != 'TEXTAREA') {
			return stopIt(ev);
		}
		var tagType = obj.type.toUpperCase();//标签类型
		//input标签除了下面几种类型，全部阻止Backspace
		if (tagName == 'INPUT'
				&& (tagType != 'TEXT' && tagType != 'TEXTAREA' && tagType != 'PASSWORD')) {
			return stopIt(ev);
		}
		//input或者textarea输入框如果不可编辑则阻止Backspace
		if ((tagName == 'INPUT' || tagName == 'TEXTAREA')
				&& (obj.readOnly == true || obj.disabled == true)) {
			return stopIt(ev);
		}
	}
}
function stopIt(ev) {
	if (ev.preventDefault) {
		//preventDefault()方法阻止元素发生默认的行为
		ev.preventDefault();
	}
	if (ev.returnValue) {
		//IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
		ev.returnValue = false;
	}
	return false;
}
//End

//企业所得税A17年度年报 A105000表15行1列自定义公式
function ywzdfzczzje(dqdm,je){
	
	var yzzje=formData.ywbw.A105000.nstzxmmxbForm.ywzdfzczzje;
	
	if(yzzje!=0&&dqdm!="152"&&dqdm!="252"&&dqdm!="137"&&dqdm!="237"&&dqdm!="144"){
		return yzzje;
	}
	
	if(dqdm=="152"||dqdm=="252"||dqdm=="137"||dqdm=="237"||dqdm=="144"){
		return je;
	}
	
	return 0.0;
	
}

function copyQcsxx(){
	var _qcs=formData.qcs.qcs_zb.hjbhsdjxxVO.hjbhsSyxxGrid.hjbhsSyxxGridlb;
	formData.qcs.hjbhsSyxx = $.extend(true, [], _qcs);
	var syxxArr=formData.qcs.hjbhsSyxx;
	
	for(var i=0;i<syxxArr.length;i++){
		formData.qcs.hjbhsSyxx[i].syyxqq=(formData.qcs.hjbhsSyxx[i].syyxqq).substring(0,10);
		formData.qcs.hjbhsSyxx[i].syyxqz=(formData.qcs.hjbhsSyxx[i].syyxqz).substring(0,10);
		formData.qcs.hjbhsSyxx[i].yxqq=(formData.qcs.hjbhsSyxx[i].yxqq).substring(0,10);
		formData.qcs.hjbhsSyxx[i].yxqz=(formData.qcs.hjbhsSyxx[i].yxqz).substring(0,10);
		
	}
	
	var zbxx='{"dqwrwpfklbDm": "","gjhbjgDm": "","hgbhssybh": "","jd2": "","jdxzDm": "","pffsDm": "","pfkbh": "","zywrwlbDm": "","pfkmc": "","pfkwz": "","pwxkzbh": "","scjydz": "","syyxqq": "","syyxqz": "","wd": "","wspfqxDm": "","pfklxDm": "","xzqhszDm": "","yxqq": "","yxqz": "","zgswskfjDm": "","syuuid": "","hbsjcxxuuid": "","yxbz": "","pfkwybm": "","sbbz": "N","xkzfbwybm": "","wd_d": 0,"wd_f": 0,"wd_m": 0.00,"jd2_d": 0,"jd2_f": 0,"jd2_m": 0.00,"wbjhpfkuuid":""}';
	var zbvo = eval('('+zbxx+')');
	syxxArr[syxxArr.length]=zbvo;
}


function setBhsXse(zzsslhzsl,xse16,xse10,xse6,xse5,xse3){
	if(zzsslhzsl == 0.17 || zzsslhzsl == 0.16){
		return xse16;
	}else if(zzsslhzsl == 0.11 || zzsslhzsl == 0.1){
		return xse10;
	}else if(zzsslhzsl == 0.06){
		return xse6;
	}else if(zzsslhzsl == 0.05){
		return xse5;
	}else if(zzsslhzsl == 0.03){
		return xse3;
	}else{
		return 0;
	}
}//end function setBhsXse

/**
 * 检测产品比重是否有值
 * @returns {Number}
 */
function checkCpbz() {
	var gridlbs = formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb6.cpqkGrid.cpqkGridlb;
	var result = 0;
	for (var i = 0; i < gridlbs.length; i++) {
		if (result == 0) {
			if (i == 5) {
				if (gridlbs[i].cl != 0) {
					result = 1;
					break;
				}
			} else {
				if (gridlbs[i].cl != 0 || gridlbs[i].cpycpbl != 0) {
					result = 1;
					break;
				}
			}
		} else {
			break;
		}
	}
	
	return result;
}

/**
 * 检测定点直供计划情况模块是否有值
 * @returns {Number}
 */
function checkDdzgjhqk() {
	var gridlbs = formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb6.ddzgjhqkGrid.ddzgjhqkGridlb;
	var result = 0;
	for (var i = 0; i < gridlbs.length; i++) {
		if (result == 0) {
			if (gridlbs[i].gcRly != 0 || gridlbs[i].gcSny != 0 
					|| gridlbs[i].qygrRly != 0 || gridlbs[i].qygrSny != 0) {
				result = 1;
				break;
			}
		} else {
			break;
		}
	}
	
	return result;
}

/**
 * 检测库存耗用情况是否有值
 * @returns {Number}
 */
function checkXchyqk() {
	var gridlbs = formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb6.kchyqkGrid.kchyqkGridlb;
	var result = 0;
	for (var i = 0; i < gridlbs.length; i++) {
		if (result == 0) {
			if (gridlbs[i].qckcypsl != 0 || gridlbs[i].bqscypsl != 0 || 
					gridlbs[i].bqxshsypsl != 0 || gridlbs[i].bqhzfwbzzszyfpypsl != 0 || 
					gridlbs[i].kjptbzzszyfpypsl != 0 || gridlbs[i].scyxlcphyypsl != 0 || 
					gridlbs[i].scftlcphyypsl != 0 || gridlbs[i].scfyxftlcphyypsl != 0 || 
					gridlbs[i].qckcmsypsl != 0 || gridlbs[i].qckchsypsl != 0 || 
					gridlbs[i].dqwgmsypsl != 0 || gridlbs[i].dqwghsypsl != 0 || 
					gridlbs[i].bqxsmsypsl != 0 || gridlbs[i].wgbqxshsypsl != 0 || 
					gridlbs[i].scmsypsl != 0 || gridlbs[i].schsypsl != 0 || 
					gridlbs[i].sjscyxmsypsl != 0 || gridlbs[i].sjscyxhsypsl != 0 || 
					gridlbs[i].sjscftmsypsl != 0 || gridlbs[i].sjschsypsl) {
				result = 1;
				break;
			}
		} else {
			break;
		}
	}
	
	return result;
}

/**
 * 设置小规模增值税预缴额
 * 
 * @returns
 */
function setZzsxgmyje(){
	var ysfwYjye=0.0;
	var yshwjlwYjye=0.0;
	var hwfjyjje_302160100=0.0;
	var hwfjyjje_302030100=0.0;
	var fwfjyjje_302160100=0.0;
	var fwfjyjje_302030100=0.0;
	var yjxxlb =  formData.hq.yjxxGrid.yjxxGridlb;
	
	if (yjxxlb != null && yjxxlb.length >0) {
		var yj302160100 = 0.0;
		var yj302030100 = 0.0;
		for(var i=0;i<yjxxlb.length;i++){
			// 服务类预缴金额
			if (/^10101[6,7].*$/.test(yjxxlb[i].zspmDm)) {
				ysfwYjye += yjxxlb[i].yjye1;
			}else if(yjxxlb[i].zsxmDm =='10101'){  // 非服务类预缴金额
				yshwjlwYjye += yjxxlb[i].yjye1;
			}
			if (/^(0201,0202,0204,0208,0299)$/.test(yjxxlb[i].sksxDm)) {
				//增值税地方教育附加 预缴金额
				if (/^(302160100,301270100)$/.test(yjxxlb[i].zspmDm)) {
					yj302160100 += yjxxlb[i].yjye1;
				}else if (yjxxlb[i].zspmDm == '302030100'){  //增值税教育费附加 预缴金额
					yj302030100+=yjxxlb[i].yjye1;
				}
			}
		}
		var hwfpDkje = formData.hq.sbZzsxgmnsrqtxxVO.yshwlwFpdkbhsxse;
		var fwfpDkje = formData.hq.sbZzsxgmnsrqtxxVO.ysfwFpdkbhsxse;
		var hwlwQzd = formData.hq.sbZzsxgmnsrqtxxVO.zzsqzd;
		var fwQzd = formData.hq.sbZzsxgmnsrqtxxVO.zzsysfwqzd;
		
		hwfjyjje_302160100=(hwfpDkje+fwfpDkje)>0?hwfpDkje*yj302160100/(hwfpDkje+fwfpDkje):0.00;
	    hwfjyjje_302030100=(hwfpDkje+fwfpDkje)>0?hwfpDkje*yj302030100/(hwfpDkje+fwfpDkje):0.00;
	    fwfjyjje_302160100=(hwfpDkje+fwfpDkje)>0?fwfpDkje*yj302160100/(hwfpDkje+fwfpDkje):0.00;
	    fwfjyjje_302030100=(hwfpDkje+fwfpDkje)>0?fwfpDkje*yj302030100/(hwfpDkje+fwfpDkje):0.00;
	}
	formData.fq.ysfwYjye = ysfwYjye;
	formData.fq.yshwjlwYjye=yshwjlwYjye;
	formData.fq.hwfjyjje_302160100=hwfjyjje_302160100;
	formData.fq.hwfjyjje_302030100=hwfjyjje_302030100;
	formData.fq.fwfjyjje_302160100=fwfjyjje_302160100;
	formData.fq.fwfjyjje_302030100=fwfjyjje_302030100;
	
	return ysfwYjye;
}

/**取消下一步的功能,传入的条件为true则隐藏下一步按钮*/
function cancelClick(condition){
	if(condition){
		$($(window.top.document).find("#btnPrepareMake")[0]).attr("style", "display:none");
	}
	return condition;
}

/**
 * 根据申报期限做逾期申报控制
* @param sbqx 申报期限 如 ： 2015-11-15
 * @param sbrq 申报日期
 * @param yqjy 系统参数配置表中的逾期申报策略配置
 * @return 是否允许流程继续
 * 
 */
function yqsbControlBySbqx(sbqx, sbrq, yqjy){
	if(sbqx == null || sbqx == '' || sbqx.length == 1){
		return "逾期申报控制时，获取申报期限失败。";
	}
	if(yqjy == null || yqjy == ''){
		return "未配置逾期申报处理策略，请配置参数表。";
	}
	var reg = /^[0-9]+.?[0-9]*$/;
	if(!reg.test(yqjy)){
		return "逾期申报处理策略参数值错误，请检查配置参数表。参数编码：B0000001060000001";
	}
	
	if(yqjy == '2'){
		//强制性校验逾期
		var from = new Date(sbqx.replace(/-/g, "/"));
		var to = new Date(sbrq.replace(/-/g, "/"));//当前日期
		var days = to.getTime() - from.getTime();
		if(days > 0){
			var time = parseInt(days / (1000 * 60 * 60 * 24));
			return "申报期限为："+sbqx+"，已逾期" + time +"天，请前往办税大厅办理相关业务！";
		}
	}
	return "";
}

/**
 * 传入申报期限，进行逾期申报校验
 * gdslxDm 国地税类型代码
 * sbqx 申报期限
 * sfkyqsbbz 是否可预期申报标志（Y 可逾期申报，N，不可逾期申报，由业务决定）
 */
function  yqsbVaild(gdslxDm,sbqx,sfkyqsbbz){
	 var yqsbbz=parent.yqsbbz;//逾期清册入口进入，可允许申报。正常申报进入时，不允许。
	if(sfkyqsbbz != "Y" && yqsbbz != "Y"){
	 var sbiniturl = parent.pathRoot+"/biz/yqsb/yqsbqc/enterYqsbUrl?gdslxDm="+gdslxDm+"&sbqx="+sbqx+"&yqsbbz="+yqsbbz;
		$.ajax({
			url:sbiniturl,
			type:"GET",
			data:{},
			dataType:"json",
			contentType:"application/json",
			success:function(data){
		 		var sfkyqsbbz=data.sfkyqsbbz;
				if(sfkyqsbbz=="N"){
					formData.sfkyqsbbz="N";
					parent.$(window.parent.document.body).mask("&nbsp;");
		 			window.parent.parent.cleanMeunBtn();
					var b=parent.layer.confirm(data.msg,{
						//area: ['250px','150px'],
						title:'提示',
						btn : ['确定']
					//	btn2:function(index){}
					},function(index){
						parent.layer.close(b);
						var wfurl=data.wfurlList  ;
						if(wfurl != undefined && wfurl != "" && wfurl != null){
							var gnurl=wfurl[0].gnurl;
							var url= parent.location.protocol + "//" + parent.location.host +gnurl
							parent.parent.window.location.href = url;
						}else{
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
			        			window.close();
			        		} else if (navigator.userAgent.indexOf("Chrome") > 0) {
			        			top.open(location, '_self').close();
			        		}else {
			        			window.open('', '_top');
			        			window.top.close();
			        		} 		
						}
					}); 
			}else{
				formData.sfkyqsbbz="Y";	
			}	
				 			
			},
			error:function(){
				layer.alert('链接超时或网络异常', {icon: 5});
			}
		});
	}
 }

/**
 * 申报表页面使用的逾期申报控制
 * 1、有申报期限，传参及顺序：gdslxDm -> sbywbm -> sbqx, 对于部分可以按次申报的税种，则需要传入属期进行判断。
 * 2、无申报期限，传参及顺序：gdslxDm -> sbywbm -> zsxmDm -> ssqq -> ssqz -> nsqxDm -> sbqxDm
 *
 * 目前仅支持上述两种传参，判断参数个数为2或者7，其他都不执行。
 */
function sbbYqsbValid(gdslxDm, sbywbm, sbqx, ssqq, ssqz) {
	// 仅正常申报使用，更正申报的逾期暂不处理
	if (parent.location.href.indexOf('gzsb=zx') == -1 && parent.location.href.indexOf('gzsb=lx') == -1 && parent.location.href.indexOf('gzsb=Y') == -1) {
        var params = "";
		var gdslxDm = arguments[0];
		var sbywbm = arguments[1];	// 基线必须要传入sbywbm
		var sbqx = arguments[2];
		var ssqq = arguments[3];
		var ssqz = arguments[4];
		params += 'gdslxDm=' + gdslxDm + '&sbqx=' + sbqx + '&sbywbm=' + sbywbm;
		if (!gdslxDm || !sbqx || !sbywbm) {
			console.info("Error params, params = [" + params + "]");
			params = '';
		}

		if (params && ssqq && ssqz && ssqq == ssqz) {  // 按次申报，不检验
			console.info("按次申报, 不进行校验. ssqq = " + ssqq + ", ssqz = " + ssqz);
			params = '';
		}

        if (params) {
            var yqsbbz = parent.parent.yqsbbz;
            params += '&yqsbbz=' + yqsbbz;

            if (yqsbbz != "Y") {
                var sUrl = parent.pathRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
                $.ajax({
                    url: sUrl,
                    type: "GET",
                    data: {},
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        var sfkyqsbbz = data.sfkyqsbbz;
                        if (sfkyqsbbz && sfkyqsbbz == "N") {
                            $(window.parent.document.body).mask("&nbsp;");
                            window.parent.cleanMeunBtn();
                            var wfurl = data.wfurlList;
                            var btnName = wfurl != undefined && wfurl != "" && wfurl != null ? '去办理' : '确定';
                            var b = parent.layer.confirm(data.msg, {
                                //area: ['250px','150px'],
                                title: '提示',
								closeBtn: false,
                                btn: [btnName]
                            }, function (index) {
                                parent.layer.close(b);
                                if (wfurl != undefined && wfurl != "" && wfurl != null) {
                                    var gnurl = wfurl[0].gnurl;
                                    var url = parent.location.protocol + "//" + parent.location.host + gnurl;
                                    parent.parent.window.location.href = url;
                                } else {
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
                                        parent.top.open(location, '_self').close();
                                    } else {
                                        parent.window.open('', '_top');
                                        parent.window.top.close();
                                    }
                                }
                            });
                        } else if (sfkyqsbbz === "Y") {	// 弹框提示，不阻断
                            // modify by dfw - 2018年11月26日15:09:17。
                            // 可能会返回逾期提示(yqtsmsg)和处罚提示(msg)。
                            // 处理逻辑->弹出逾期提示（继续申报） -> 弹出行政处罚（确定）
                            if (data.msg) {
                                if (data.yqtsmsg) {
                                    var tab = parent.layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        parent.layer.close(tab);

                                        var subTab = parent.layer.confirm(data.msg, {
                                            title: '提示',
                                            closeBtn: false,
                                            btn: ['确定']
                                        }, function (index1) {
                                            parent.layer.close(subTab);
                                        });
                                    });
                                } else {
                                    var tab = parent.layer.confirm(data.msg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['确定']
                                    }, function (index) {
                                        parent.layer.close(tab);
                                    });
                                }
                            } else {
                                if (data.yqtsmsg) {
                                    var tab = parent.layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        parent.layer.close(tab);
                                    });
                                } else {
                                    // 不存在这种返回。阻断必须要给出提示。
                                    // layer.alert('无效的提示信息，请联系系统管理员！', {icon: 5});
                                }
                            }
						}
                    },
                    error: function () {
                        layer.alert('由于链接超时或网络异常导致逾期申报校验失败，请稍候刷新重试！', {icon: 5});
                    }
                });
            }
        }
    }
}

/**
 * 申报表页面使用的逾期申报控制
 * 1、有申报期限，传参及顺序：gdslxDm -> sbywbm -> sbqx, 对于部分可以按次申报的税种，则需要传入属期进行判断。
 * 2、无申报期限，传参及顺序：gdslxDm -> sbywbm -> zsxmDm -> ssqq -> ssqz -> nsqxDm -> sbqxDm
 *
 * 目前仅支持上述两种传参，判断参数个数为2或者7，其他都不执行。
 */
function sbbYqsbValidEx(gdslxDm, sbywbm, zsxmDm, ssqq, ssqz, nsqxDm, sbqxDm) {
	// 仅正常申报使用，更正申报的逾期暂不处理
	if (parent.location.href.indexOf('gzsb=zx') == -1) {
        var params = "";
		var gdslxDm = arguments[0];
		var sbywbm = arguments[1];
		var zsxmDm = arguments[2];
		var ssqq = arguments[3];
		var ssqz = arguments[4];
		var nsqxDm = arguments[5];
		var sbqxDm = arguments[6];
		var djxh = $("#djxh").val();
        var nsrsbh = $("#nsrsbh").val();
		var test = $("#test").val();

		params += 'gdslxDm=' + gdslxDm + '&sbywbm=' + sbywbm +
			'&zsxmDm=' + zsxmDm + '&skssqq=' + ssqq +
			'&skssqz=' + ssqz + '&nsqxDm=' + nsqxDm +
			'&sbqxDm=' + sbqxDm;
        if(test == 'true'){
            params += '&djxh='+djxh + '&nsrsbh=' + nsrsbh + '&test=' + test;
        }
		if (!gdslxDm || !sbywbm || !zsxmDm || !ssqq || !ssqz || !nsqxDm || !sbqxDm) {
			console.info("Error params, params = [" + params + "]");
			params = '';
		}

		if (params && ssqq && ssqz && ssqq == ssqz) {  // 按次申报，不检验
			console.info("按次申报, 不进行校验. ssqq = " + ssqq + ", ssqz = " + ssqz);
			params = '';
		}

        if (params) {
            var yqsbbz = parent.parent.yqsbbz;
            params += '&yqsbbz=' + yqsbbz;

            if (yqsbbz != "Y") {
                var sUrl = parent.pathRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
                $.ajax({
                    url: sUrl,
                    type: "GET",
                    data: {},
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        var sfkyqsbbz = data.sfkyqsbbz;
                        if (sfkyqsbbz && sfkyqsbbz == "N") {
                            $(window.parent.document.body).mask("&nbsp;");
                            window.parent.cleanMeunBtn();
                            var wfurl = data.wfurlList;
                            var btnName = wfurl != undefined && wfurl != "" && wfurl != null ? '去办理' : '确定';
                            var b = parent.layer.confirm(data.msg, {
                                //area: ['250px','150px'],
                                title: '提示',
								closeBtn: false,
                                btn: [btnName]
                            }, function (index) {
                                parent.layer.close(b);
                                if (wfurl != undefined && wfurl != "" && wfurl != null) {
                                    var gnurl = wfurl[0].gnurl;
                                    var url = parent.location.protocol + "//" + parent.location.host + gnurl;
                                    parent.parent.window.location.href = url;
                                } else {
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
                                        parent.top.open(location, '_self').close();
                                    } else {
                                        parent.window.open('', '_top');
                                        parent.window.top.close();
                                    }
                                }
                            });
                        } else if (sfkyqsbbz === "Y") {	// 弹框提示，不阻断
                        	// modify by dfw - 2018年11月26日15:09:17。
							// 可能会返回逾期提示(yqtsmsg)和处罚提示(msg)。
							// 处理逻辑->弹出逾期提示（继续申报） -> 弹出行政处罚（确定）
							if (data.msg) {
								if (data.yqtsmsg) {
                                    var tab = parent.layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        parent.layer.close(tab);

                                        var subTab = parent.layer.confirm(data.msg, {
                                            title: '提示',
                                            closeBtn: false,
                                            btn: ['确定']
                                        }, function (index1) {
                                            parent.layer.close(subTab);
                                        });
                                    });
								} else {
                                    var tab = parent.layer.confirm(data.msg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['确定']
                                    }, function (index) {
                                        parent.layer.close(tab);
                                    });
								}
							} else {
								if (data.yqtsmsg) {
                                    var tab = parent.layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        parent.layer.close(tab);
                                    });
								} else {
									// 不存在这种返回。阻断必须要给出提示。
                                    // layer.alert('无效的提示信息，请联系系统管理员！', {icon: 5});
								}
							}
                        }
                    },
                    error: function () {
                        layer.alert('由于链接超时或网络异常导致逾期申报校验失败，请稍候刷新重试！', {icon: 5});
                    }
                });
            }
        }
    }
}

/**
 * 申报表页面使用的逾期申报控制
 * 1、有申报期限，传参及顺序：gdslxDm -> sbywbm -> sbqx -> skssqq -> skssqz -> yqsbbz -> djxh -> nsrsbh -> test
 * 2、因为获取参数的方式不同，无法在此统一获取，只能在原本的位置传过来；
 * 3、abledBtnPrepareForm()与disabledBtnPrepareForm()方法也会因为有无引导页调用的层级不同，所以都要求写在原来的位置。
 */
function sfkyqsbCheck(gdslxDm, sbywbm, sbqx, skssqq, skssqz,yqsbbz,djxh,nsrsbh,test){
	var params = "";
	params += 'gdslxDm=' + gdslxDm + '&sbywbm=' + sbywbm +'&sbqx=' + sbqx + '&yqsbbz=' + yqsbbz;
	
	if (!gdslxDm || !sbywbm || !sbqx || !yqsbbz) {
		console.info("Error params, params = [" + params + "]");
		params = '';
	}
	
	if(test == 'test'){
        params += '&djxh='+djxh + '&nsrsbh=' + nsrsbh + '&test=' + test;
    }
	
	if (params && skssqq && skssqz && skssqq == skssqz) {  // 按次申报，不检验
		console.info("按次申报, 不进行校验. skssqq = " + skssqz + ", skssqz = " + skssqz);
		params = '';
	}	
	if (params != '') {
		 var sbiniturl = parent.pathRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
		 yqsbVaildByUrl(sbiniturl);
	}
}

/**
 * 申报表页面使用的逾期申报控制
 * 1、无申报期限，传参及顺序：gdslxDm -> sbywbm -> zsxmDm -> skssqq -> skssqz -> nsqxDm -> sbqxDm -> yqsbbz -> djxh -> nsrsbh -> test
 * 2、因为获取参数的方式不同，无法在此统一获取，只能在原本的位置传过来；
 * 3、abledBtnPrepareForm()与disabledBtnPrepareForm()方法也会因为有无引导页调用的层级不同，所以都要求写在原来的位置。
 */
function sfkyqsbCheckEx(gdslxDm, sbywbm, zsxmDm, skssqq, skssqz, nsqxDm, sbqxDm, yqsbbz,djxh,nsrsbh,test){
	var params = "";
	params += 'gdslxDm=' + gdslxDm + '&sbywbm=' + sbywbm +'&zsxmDm=' + zsxmDm + '&skssqq=' + skssqq
			     +'&skssqz=' + skssqz + '&nsqxDm=' + nsqxDm +'&sbqxDm=' + sbqxDm + '&yqsbbz=' + yqsbbz;
	
	if (!gdslxDm || !sbywbm || !zsxmDm || !skssqq || !skssqz || !nsqxDm || !sbqxDm || !yqsbbz) {
		console.info("Error params, params = [" + params + "]");
		params = '';
	}
	
	if(test == 'test'){
        params += '&djxh='+djxh + '&nsrsbh=' + nsrsbh + '&test=' + test;
    }
	
	if (params && skssqq && skssqz && skssqq == skssqz) {  // 按次申报，不检验
		console.info("按次申报, 不进行校验. skssqq = " + skssqz + ", skssqz = " + skssqz);
		params = '';
	}	
	if (params != '') {
		 var sbiniturl = parent.pathRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
		 yqsbVaildByUrl(sbiniturl);
	}
}

function yqsbVaildByUrl(sbiniturl){
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
	 			abledBtnPrepareForm();
	 			if(yqtsmsg && yqtsmsg!=''){
	 				if(msg && msg!=''){
	 					var tab = parent.layer.confirm(setStyle(yqtsmsg), {
                         title: '提示',
                         closeBtn: false,
                         btn: ['继续申报']
                     }, function (index) {
                         parent.layer.close(tab);
                         parent.layer.confirm(setStyle(msg), {
                             title: '提示',
                             closeBtn: false,
                             btn: ['确定']
                         });
                     });
	 				}else{
	                    parent.layer.confirm(setStyle(yqtsmsg), {
	                        title: '提示',
	                        closeBtn: false,
	                        btn: ['继续申报']
	                    });
	 				}
	 			}else{
	 				if(msg && msg!=''){
	 				  parent.layer.confirm(setStyle(msg), {
	                      title: '提示',
	                      closeBtn: false,
	                      btn: ['确定']
	                  });
	 				}
	 			}
	 		}else if(msg && msg!=''){
	 			parent.layer.confirm(setStyle(msg),{
					title:'提示',
					btn : ['确定','取消'],
					cancel:function(index){
						disabledBtnPrepareForm();
						parent.layer.close(index);
					}
				},function(index){
					changeUrlToWFUrl(wfurlList);
					disabledBtnPrepareForm();
					parent.layer.close(index);
				},function(index){
	 				disabledBtnPrepareForm();
	 				parent.layer.close(index);
				});
	 		}
		},
		error:function(){
			parent.layer.alert('链接超时或网络异常', {icon: 5});
			disabledBtnPrepareForm();
		}
	});
}
//---------------------------------------------------------------------
//------↓以下为成品油消费税公式用到的js，单独写js因加载速度太慢容易出错，所以放到公共js里↓------
//---------------------------------------------------------------------
/*计算主表销售数量
 * "当zspmdm=101020607时
“本期销售数量”=成品油发票开具数量-《本期委托加工情况报告表》第二部分“委托加工收回的应税消费品领用存情况”中对应“商品和服务税收分类编码”的“本期委托加工收回直接销售的数量”-《本期准予扣除税额计算表》第二部分“润滑油基础油（废矿物油）和变性燃料乙醇领用存”中“润滑油基础油（废矿物油）”对应的“本期生产领用数量”
可修改"
"当zspmdm=101020609时
“本期销售数量”=成品油发票开具数量-《本期委托加工情况报告表》第二部分“委托加工收回的应税消费品领用存情况”中对应“商品和服务税收分类编码”的“本期委托加工收回直接销售的数量”-《本期准予扣除税额计算表》第二部分“润滑油基础油（废矿物油）和变性燃料乙醇领用存”中“变性燃料乙醇”对应的“本期生产领用数量”
可修改"
"当zspmdm≠101020607、101020609时
“本期销售数量”=成品油发票开具数量-《本期委托加工情况报告表》第二部分“委托加工收回的应税消费品领用存情况”中对应“商品和服务税收分类编码”的“本期委托加工收回直接销售的数量”
可修改"
*/
function jsZbXssl(zspmdm,bqsclysl0,bqsclysl1,bqwtjgshzjjgsl,qcsbz){
	var fpkjxx=this.formData.qcs.initData.xfsCpysbInitData.cpyfpkjsl.cpyfpkjslGrid.cpyfpkjslGridlb;
	var dmdzxx=this.formData.qcs.initData.xfsCpysbInitData.cpyzspmspbm.cpyzspmspbmGrid.cpyzspmspbmGridlb;
	var xssl=0;
	//成品油发票开具数量
	if(fpkjxx!=null&&typeof(fpkjxx)!='undefined'){
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].zspmdm==zspmdm){
				xssl+=parseFloat(fpkjxx[i].sl);
			}
		}
	}
	//《本期委托加工情况报告表》第二部分“委托加工收回的应税消费品领用存情况”中对应“商品和服务税收分类编码”的“本期委托加工收回直接销售的数量”
	var wtjghsdysxfplyqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.wtjghsdysxfplyqkGrid.wtjghsdysxfplyqkGridlb;
	if(wtjghsdysxfplyqkGridlb!=null&&typeof(wtjghsdysxfplyqkGridlb)!='undefined'&&dmdzxx!=null&&typeof(dmdzxx)!='undefined'){
		for(var i = 0; i < wtjghsdysxfplyqkGridlb.length; i++){
			var sphfwssflbm=wtjghsdysxfplyqkGridlb[i].sphfwssflbm;
			for(var j = 0; j < dmdzxx.length; j++){
				if(dmdzxx[j].spbm==sphfwssflbm&&dmdzxx[j].zspmdm==zspmdm){
					var bqwtjgshzjjgsl=wtjghsdysxfplyqkGridlb[i].bqwtjgshzjjgsl;
					xssl-=bqwtjgshzjjgsl;
				}
			}
		}
	}
	//《本期准予扣除税额计算表》第二部分“润滑油基础油（废矿物油）和变性燃料乙醇领用存”中“润滑油基础油（废矿物油）”对应的“本期生产领用数量”
	if(zspmdm=="101020607"){
		xssl-=bqsclysl0;
	//《本期准予扣除税额计算表》第二部分“润滑油基础油（废矿物油）和变性燃料乙醇领用存”中“变性燃料乙醇”对应的“本期生产领用数量”
	}else if(zspmdm=="101020609"){
		xssl-=bqsclysl1;
	}
	if(qcsbz=="N"){
		//减免明细表汇总带入销售数量部分
		var jmmxGridlb = this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb13.bqjmsemxbGrid.bqjmsemxbGridlb;
		if(jmmxGridlb!=null&&typeof(jmmxGridlb)!='undefined'){
			for(var i = 0; i < jmmxGridlb.length; i++){
				//通过电子底账库“商品和服务税收分类编码SPHFWSSFLBM ”查询下列开票数量自动带入，可修改
				//燃料油定点直供
				//1070101040200000000
				//石脑油定点直供
				//1070101050200000000
				//填报数量汇总计入“成品油消费税纳税申报表”燃料油及石脑油“本期销售数量”
				if("0002125205"==jmmxGridlb[i].ssjmxzDm){
					if(zspmdm=="101020605"){
						var fpkjsl=0;
						var bqjmsl=parseFloat(jmmxGridlb[i].bqjmsl);
						if(fpkjxx!=null&&typeof(fpkjxx)!='undefined'){
							for (var i = 0; i < fpkjxx.length; i++) {
								if(fpkjxx[i].spbm=="1070101050200000000"){
									fpkjsl+=parseFloat(fpkjxx[i].sl);
								}
							}
						}
						if(bqjmsl>=fpkjsl){
							xssl=xssl+bqjmsl-fpkjsl;
						}
					}else if(zspmdm=="101020608"){
						var fpkjsl=0;
						var bqjmsl=parseFloat(jmmxGridlb[i].bqjmsl);
						if(fpkjxx!=null&&typeof(fpkjxx)!='undefined'){
							for (var i = 0; i < fpkjxx.length; i++) {
								if(fpkjxx[i].spbm=="1070101040200000000"){
									fpkjsl+=parseFloat(fpkjxx[i].sl);
								}
							}
						}
						if(bqjmsl>=fpkjsl){
							xssl=xssl+bqjmsl-fpkjsl;
						}
					}
					//减免性质代码选择“
					//125204《财政部 国家税务总局关于对成品油生产企业生产自用油免征消费税的通知》 财税〔2010〕98号，生产成品油过程中消耗的自产成品油部分免税”时生效
					//填报数量汇总计入“成品油消费税纳税申报表”对应的成品油的“本期销售数量”
				}else if("0002125204"==jmmxGridlb[i].ssjmxzDm){
					var bqjmsl=parseFloat(jmmxGridlb[i].bqjmsl);
					if(jmmxGridlb[i].zspmDm==zspmdm){
						xssl+=bqjmsl;
					}
				}
			}
		}
	}
	return xssl;
}

//计算本期减免数量
function jsBqjmsl(zspmDm,ssjmxzDm,xh){
	var bqjmsl=0;
	var fpkjxx=this.formData.qcs.initData.xfsCpysbInitData.cpyfpkjsl.cpyfpkjslGrid.cpyfpkjslGridlb;
	if(fpkjxx==null||typeof(fpkjxx)=='undefined'){
		return 0;
	}
	if(ssjmxzDm=="0002125207"){
		//开具数量
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].spbm=="1070101010300000000"){
				bqjmsl=parseFloat(fpkjxx[i].sl);
			}
		}
	}else if(ssjmxzDm=="0002064001"){
		//开具数量
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].spbm=="1070101030300000000"){
				bqjmsl=parseFloat(fpkjxx[i].sl);
			}
		}
	}else if(ssjmxzDm=="0002064005"){
		//开具数量
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].spbm=="1070101010400000000"||fpkjxx[i].spbm=="1070101030400000000"||fpkjxx[i].spbm=="1070101070300000000"){
				bqjmsl+=parseFloat(fpkjxx[i].sl);
			}
		}	
	}else if(ssjmxzDm=="0002125205"){
		//开具数量
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].spbm=="1070101040200000000"&&zspmDm=="101020608"){
				bqjmsl+=parseFloat(fpkjxx[i].sl);
			}else if(fpkjxx[i].spbm=="1070101050200000000"&&zspmDm=="101020605"){
				bqjmsl+=parseFloat(fpkjxx[i].sl);
			}
		}	
	}
	return bqjmsl;
}
//委托加工数量
//自动带入《本期委托加工情况报告表》中第二部分第2项中“本期委托加工收回用于连续生产数量”按品目汇总后的数值。不可修改
function jsWtjghssl(zspmDm,bqwtjgshsl){
	var wtjghssl=0;
	var wtjghsdysxfplyqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.wtjghsdysxfplyqkGrid.wtjghsdysxfplyqkGridlb;
	if(wtjghsdysxfplyqkGridlb==null||typeof(wtjghsdysxfplyqkGridlb)=='undefined'){
		return 0;
	}
	for (var i = 0; i < wtjghsdysxfplyqkGridlb.length; i++) {
		if(wtjghsdysxfplyqkGridlb[i].zspmDm==zspmDm){
			wtjghssl+=parseFloat(wtjghsdysxfplyqkGridlb[i].bqwtjgshyylxscsl);
		}
	}
	return wtjghssl;
}
//本期外购入库数量 
//通过电子底账库“商品和服务税收分类编码SPHFWSSFLBM ”自动带入，可修改
function jsBqwgsl(ewbhxh){
	var xhZspmMap=new Array();
	xhZspmMap[0]="101020609";
	xhZspmMap[1]="101020603";
	xhZspmMap[2]="101020605";
	xhZspmMap[3]="101020607";
	xhZspmMap[4]="101020608";
	var zspmDm=xhZspmMap[ewbhxh-1];
	var bqwgsl=0;
	var fpkjxx=this.formData.qcs.initData.xfsCpysbInitData.cpygffpkjsl.cpyfpkjslGrid.cpyfpkjslGridlb;
	if(fpkjxx==null||typeof(fpkjxx)=='undefined'){
		return 0;
	}
	//成品油发票开具数量
	for (var i = 0; i < fpkjxx.length; i++) {
		/*排除
		燃料油定点直供
		ZSPM_DM 101020608
		SPHFWSSFLBM 1070101040200000000
		石脑油定点直供
		ZSPM_DM 101020605
		SPHFWSSFLBM 1070101050200000000
		甲醇汽油
		ZSPM_DM 101020609
		SPHFWSSFLBM 1070101010200000000
		乙醇汽油
		ZSPM_DM 101020609
		SPHFWSSFLBM 1070101010300000000
		乙醇汽油调和组分油
		ZSPM_DM 
		SPHFWSSFLBM 
		纯生物柴油
		ZSPM_DM 101020603
		SPHFWSSFLBM 1070101030300000000
		溶剂油
		ZSPM_DM 101020606
		SPHFWSSFLBM 1070101060100000000
		航空煤油
		ZSPM_DM 101020604
		SPHFWSSFLBM 1070101020100000000
		汽油（废矿物油）
		ZSPM_DM 101020609
		SPHFWSSFLBM 1070101010400000000
		柴油（废矿物油）
		ZSPM_DM 101020603
		SPHFWSSFLBM 1070101030400000000
		燃料油（废矿物油）
		ZSPM_DM 101020608
		SPHFWSSFLBM 1070101040300000000
		石脑油（废矿物油）
		ZSPM_DM 101020605
		SPHFWSSFLBM 1070101050300000000*/
		if(fpkjxx[i].spbm=="1070101040200000000"||fpkjxx[i].spbm=="1070101050200000000"||
				fpkjxx[i].spbm=="1070101010200000000"||fpkjxx[i].spbm=="1070101010300000000"||fpkjxx[i].spbm=="1070101030300000000"||
				fpkjxx[i].spbm=="1070101060100000000"||fpkjxx[i].spbm=="1070101020100000000"||fpkjxx[i].spbm=="1070101010400000000"||
				fpkjxx[i].spbm=="1070101030400000000"||fpkjxx[i].spbm=="1070101040300000000"||fpkjxx[i].spbm=="1070101050300000000"||
				fpkjxx[i].spbm=="1070102020800000000"){
			continue;
		}
		if(fpkjxx[i].zspmdm==zspmDm){
			bqwgsl+=parseFloat(fpkjxx[i].sl);
		}
	}
	return bqwgsl;
}
//润滑油基础油（废矿物油）本期入库数量 
//[本期入库数量]【数值】应等于《本期减（免）税额明细表》润滑油“减（免）数量”＋电子底账库“润滑油基础油（废矿物油）”成品油专用发票外购数量【数值】
function jsRhyBqwgsl(rksl){
	var bqwgsl=0;
	var fpkjxx=this.formData.qcs.initData.xfsCpysbInitData.cpyfpkjsl.cpyfpkjslGrid.cpyfpkjslGridlb;
	if(fpkjxx!=null&&typeof(fpkjxx)!='undefined'){
		//润滑油发票开具数量
		for (var i = 0; i < fpkjxx.length; i++) {
			if(fpkjxx[i].zspmdm=="101020607"&&fpkjxx[i].spbm=="1070101070300000000"){
				bqwgsl+=parseFloat(fpkjxx[i].sl);
			}
		}
	}
	
	//减免附表
	var bqjmxx=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb13.bqjmsemxbGrid.bqjmsemxbGridlb;
	if(bqjmxx!=null&&typeof(bqjmxx)!='undefined'){
		for (var i = 0; i < bqjmxx.length; i++) {
			if(bqjmxx[i].zspmDm=="101020607"){
				bqwgsl+=parseFloat(bqjmxx[i].bqjmsl);
			}
		}
	}
	return bqwgsl;
}
//变性燃料乙醇本期入库数量 
//自动带出，不可修改 取电子底账库“变性燃料乙醇”成品油专用发票数量
function jsBxrlycBqwgsl(){
	var bqwgsl=0;
	var fpkjxx=this.formData.qcs.initData.xfsCpysbInitData.cpyfpkjsl.cpyfpkjslGrid.cpyfpkjslGridlb;
	if(fpkjxx==null||typeof(fpkjxx)=='undefined'){
		return 0;
	}
	//变性燃料乙醇发票开具数量
	for (var i = 0; i < fpkjxx.length; i++) {
		if(fpkjxx[i].spbm=="1070102020800000000"){
			bqwgsl+=parseFloat(fpkjxx[i].sl);
		}
	}
	return bqwgsl;
}
function tbWtjgYsxfpmc(xh,dsdjskhj){
	if(xh==""||xh==null||typeof(xh)=="undefined"){
		return "";
	}
	var stfdkdjskqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.stfdkdjskqkGrid.stfdkdjskqkGridlb[xh-1];
	if(stfdkdjskqkGridlb==null||typeof(stfdkdjskqkGridlb)=="undefined"){
		return "";
	}
	return stfdkdjskqkGridlb.ysxfpmc;
}
function tbWtjgBqwtjgshsl(xh,dsdjskhj){
	if(xh==""||xh==null||typeof(xh)=="undefined"){
		return "";
	}
	var stfdkdjskqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.stfdkdjskqkGrid.stfdkdjskqkGridlb[xh-1];
	if(stfdkdjskqkGridlb==null||typeof(stfdkdjskqkGridlb)=="undefined"){
		return "";
	}
	return stfdkdjskqkGridlb.wtjgshsl;
}
function tbWtjgSphfwssflbm(xh,dsdjskhj){
	if(xh==""||xh==null||typeof(xh)=="undefined"){
		return "";
	}
	var stfdkdjskqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.stfdkdjskqkGrid.stfdkdjskqkGridlb[xh-1];
	if(stfdkdjskqkGridlb==null||typeof(stfdkdjskqkGridlb)=="undefined"){
		return "";
	}
	return stfdkdjskqkGridlb.sphfwssflbm;
}
function tbWtjgSysl(xh,dsdjskhj){
	if(xh==""||xh==null||typeof(xh)=="undefined"){
		return "";
	}
	var stfdkdjskqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.stfdkdjskqkGrid.stfdkdjskqkGridlb[xh-1];
	if(stfdkdjskqkGridlb==null||typeof(stfdkdjskqkGridlb)=="undefined"){
		return "";
	}
	return stfdkdjskqkGridlb.sysl;
}
function tbWtjgZspmDm(xh,dsdjskhj){
	if(xh==""||xh==null||typeof(xh)=="undefined"){
		return "";
	}
	var stfdkdjskqkGridlb=this.formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_wtjgfb.bqwtjgqkbgb.stfdkdjskqkGrid.stfdkdjskqkGridlb[xh-1];
	if(stfdkdjskqkGridlb==null||typeof(stfdkdjskqkGridlb)=="undefined"){
		return "";
	}
	return stfdkdjskqkGridlb.zspmDm;
}
//---------------------------------------------------------------------
//-----------------------↑成品油消费税公式用到的结束↑---------------------------
//---------------------------------------------------------------------