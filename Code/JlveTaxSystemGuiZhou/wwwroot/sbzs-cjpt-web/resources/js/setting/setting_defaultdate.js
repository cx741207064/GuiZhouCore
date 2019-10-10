function extMethods(mathFlag,newData,olddata,scope){
	
	if ("bsqjToSssq"==mathFlag){
		var rtnSssq = bsqjForSsq(newData);
		scope.formData.cwbbbsjcsz.sssqq = rtnSssq.sssqq;
		scope.formData.cwbbbsjcsz.sssqz = rtnSssq.sssqz;
		//20170627，千户企业单独入口，报送期间变更不再校验千户企业
//		if ("01"==newData){
//			if ("Y"==scope.formData.isAllbz){
//				//企业集团合并：首先必须是千户企业，其次：会计制度为101；或没有会计制度；或会计制度为201且税务机关以152开头；
//				var kjzdzzDm = scope.formData.cwbbbsjcsz.kjzdzzDm;
//				if ((scope.formData.isQhjt=="Y"&&kjzdzzDm=="101")||kjzdzzDm==""||(kjzdzzDm=="201"&&scope.formData.gsdq=="152")){
//					scope.CT.zlbsxlCT={"ZL1001045":"企业集团合并财务报表报送与信息采集"};
//				} else {
//					scope.CT.zlbsxlCT.ZL1001045="企业集团合并财务报表报送与信息采集";
//				}
//			} else {
//				//企业集团合并：首先必须是千户企业，其次：会计制度为101；或没有会计制度；或会计制度为201且税务机关以152开头；
//				var kjzdzzDm = scope.formData.cwbbbsjcsz.kjzdzzDm;
//				if ((scope.formData.isQhjt=="Y"&&kjzdzzDm=="101")||kjzdzzDm==""||(kjzdzzDm=="201"&&scope.formData.gsdq=="152")){
//					scope.CT.zlbsxlCT.ZL1001045="企业集团合并财务报表报送与信息采集";
//				}
//			}
//		} else {
//			delete scope.CT.zlbsxlCT.ZL1001045;
//		}
	}
}


/**
 * 申报期间与所属期校验
 * @param sbqj
 * @param sssqq
 * @param sssqz
 */
function checkDate(sbqj, sssqq, sssqz){
	var flag = false;
	if (sbqj != null && sbqj.length !=0 && sssqq != null && sssqq.length !=0 && sssqz != null && sssqz.length !=0){
		var year = sssqq.split("-")[0];
		var ssqzyear = sssqz.split("-")[0];
		var startmonth = sssqq.split("-")[1];
		var endmonth = sssqz.split("-")[1];
		var sday = "01";
		var eday = "";
		var cnum = parseInt(endmonth,10)-parseInt(startmonth,10);
		
		var smallmonth = ["04","06","09","11"];
		var bigmonth = ["01","03","05","07","08","10","12"];
		for (var i = 0; i < smallmonth.length; i++){
			if (endmonth==smallmonth[i]){
				eday="30";
			}
		}
		for (var i = 0; i < bigmonth.length; i++){
			if (endmonth==bigmonth[i]){
				eday="31";
			}
		}
		if (endmonth=="02"){
			if ((parseInt(year,10)%400==0)||(parseInt(year,10)%4==0 &&parseInt(year,10)%100 != 0)){
				eday="29";
			} else {
				eday="28";
			}
		}
		if (sday==sssqq.split("-")[2] && eday==sssqz.split("-")[2]){
			//03季报，04月报，11季报最后一个月
			if ("03"==sbqj && cnum==2){
				if (("01"==startmonth && "03"==endmonth)||("04"==startmonth && "06"==endmonth)||("07"==startmonth && "09"==endmonth)||("10"==startmonth && "12"==endmonth)){
					flag = true;
				}
			}else if ("04"==sbqj && cnum==0){
				flag = true;
			}else if ("11"==sbqj && cnum==0){
				if (("03"==startmonth && "03"==endmonth)||("06"==startmonth && "06"==endmonth)||("09"==startmonth && "09"==endmonth)||("12"==startmonth && "12"==endmonth)){
					flag = true;
				}
			}else if("01"==sbqj && cnum==11){
				if(year==ssqzyear && "01"==startmonth && "12"==endmonth){
					flag = true;
				}
			}
		}

	}
	return flag;
}

/**
 * 数据空值校验
 * @param cwkjzdzz
 * @param zlbsxl
 * @param bsqj
 * @param sssqq
 * @param sssqz
 * @returns {Array}
 */
function checkFormDate(cwkjzdzz, zlbsxl, bsqj, sssqq, sssqz){
	var tagjsonall = ["false","cwkjzdzz","zlbsxl","bsqj","sbssq"];
	var tagjson = [];
	var flag = false;
//	if (cwkjzdzz==null||cwkjzdzz.length==0){
//		tagjson.push("cwkjzdzz");
//		flag = true;
//	}
	if (zlbsxl==null||zlbsxl=="null"||zlbsxl.length==0){
		tagjson.push("zlbsxl");	
		flag = true;
	}
	if (bsqj==null||bsqj.length==0){
		tagjson.push("bsqj");
		flag = true;
	}
	if ((sssqq==null||sssqq.length==0) && (sssqz==null||sssqz.length==0)){
		tagjson.push("sbssq");
		flag = true;
	}

	if (flag){
		return tagjson;
	}
	return tagjsonall;
}

function add_error(tagStr){
	var tag = "#"+tagStr;
	$(tag).show();
}

function del_error(tagStr){
	var tag = "#"+tagStr;
	$(tag).hide();
}

/**
 * 获取年报年份，前10后5
 * @returns {___anonymous3067_3068}
 */
function getnbnf(){
	var date = new Date();
	var year = date.getFullYear();
	var yearjson = {};
	var reyear = {};
	yearjson.year1 = year+10;
	yearjson.year2 = year+9;
	yearjson.year3 = year+8;
	yearjson.year4 = year+7;
	yearjson.year5 = year+6;
	yearjson.year6 = year+5;
	yearjson.year7 = year+4;
	yearjson.year8 = year+3;
	yearjson.year9 = year+2;
	yearjson.year10 = year+1;
	yearjson.year11 = year;
	yearjson.year12 = year-1;
	yearjson.year13 = year-2;
	yearjson.year14 = year-3;
	yearjson.year15 = year-4;
	yearjson.year16 = year-5;
	yearjson.year17 = year-6;
	yearjson.year18 = year-7;
	yearjson.year19 = year-8;
	yearjson.year20 = year-9;
	yearjson.year21 = year-10;

	
	$.each(yearjson, function(k,v) {
		reyear[v] = v;
    });
	
	return reyear;
}

/**
 * 属期及年份保存session
 * @param dateJson
 */
function saveTimeData(dateJson){
	var url = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1]+"/setting/saveTimeData.do";
	$.ajax({
		type : "POST",
 		url : url,
 		dataType:"json",
        contentType:"application/json",
 		data:JSON.stringify(dateJson),
 		success:function(data){
 			
 		},
 		error:function(){
 			
 		}
 	});
}

function bsqjForSsq(bsqj){
	//计算当前时间
	var date = new Date();
	var year = date.getFullYear();//当前年
    var month = date.getMonth() + 1;//当前月
    
    var ldate = new Date(year,month-1,0);
    var lday = ldate.getDate();//当前月最后一天
    var lmonth = month - 1;
    var lyear = year - 1;
    
    var ssqJson = {};
    
    if (month==1){//一月上期是去年12月
    	year = lyear;
    	lmonth = 12;
    }
    
    if ("01"==bsqj){//年报
    	ssqJson.sssqq = lyear+"-01-01";
    	ssqJson.sssqz = lyear+"-12-31";
    } else if ("02"==bsqj){//半年报
    	if (month < 7){//去年下半年
    		ssqJson.sssqq = lyear+"-07-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else {//今年上半年
    		ssqJson.sssqq = year+"-01-01";
        	ssqJson.sssqz = year+"-06-30";
    	}
    } else if ("03"==bsqj){//季报
    	if (month >= 1 && month < 4){//去年最后一季度
    		ssqJson.sssqq = lyear+"-10-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else if (month >= 4 && month < 7){//今年第一季度
    		ssqJson.sssqq = year+"-01-01";
        	ssqJson.sssqz = year+"-03-31";
    	} else if (month >= 7 && month < 10){//今年第二季度
    		ssqJson.sssqq = year+"-04-01";
        	ssqJson.sssqz = year+"-06-30";
    	} else if (month >= 10 && month <= 12){//今年第三季度
    		ssqJson.sssqq = year+"-07-01";
        	ssqJson.sssqz = year+"-09-30";
    	}
    } else if ("04"==bsqj){//月报
    	if (month < 11 && month > 1){
    		ssqJson.sssqq = year+"-0"+lmonth+"-01";
        	ssqJson.sssqz = year+"-0"+lmonth+"-"+lday;
    	} else {
    		ssqJson.sssqq = year+"-"+lmonth+"-01";
        	ssqJson.sssqz = year+"-"+lmonth+"-"+lday;
    	}
    } else if ("11"==bsqj){//季报最后一个月
    	if (month >= 1 && month < 4){//去年最后一季度
    		ssqJson.sssqq = lyear+"-12-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else if (month >= 4 && month < 7){//今年第一季度
    		ssqJson.sssqq = year+"-03-01";
        	ssqJson.sssqz = year+"-03-31";
    	} else if (month >= 7 && month < 10){//今年第二季度
    		ssqJson.sssqq = year+"-06-01";
        	ssqJson.sssqz = year+"-06-30";
    	} else if (month >= 10 && month <= 12){//今年第三季度
    		ssqJson.sssqq = year+"-09-01";
        	ssqJson.sssqz = year+"-09-30";
    	}
    }
	return ssqJson;
}

/**
 * 无备案时，放开报送期间和属期选择，所属期起止关联变动
 * @returns
 */
function changeSsq(){
	var rtnData = {};
	rtnData.isTrue = false;//为false则锁定属期选择，或者错误属期不做关联变动
	//先获取是否备案标志
	var url = parent.location.href;
	if(url.charAt(url.length-1) == '#'){//抹除#号
        url = url.substr(0,url.length-1);
	}
	var isCwbabz = "Y";
	var isCwbabzIndex=url.indexOf("isCwbabz=");	
	if(isCwbabzIndex!=-1){
		if(url.indexOf("&",isCwbabzIndex)!=-1){
			isCwbabz=url.substring(isCwbabzIndex+"isCwbabz=".length,url.indexOf("&",isCwbabzIndex));			
		}else{
			isCwbabz=url.substring(isCwbabzIndex+"isCwbabz=".length);
		}
	}
	//是否是财税管家bzz=csgj
	var bzz = "N";
	var bzzIndex=url.indexOf("bzz=");	
	if(bzzIndex!=-1){
		if(url.indexOf("&",bzzIndex)!=-1){
			bzz=url.substring(bzzIndex+"bzz=".length,url.indexOf("&",bzzIndex));			
		}else{
			bzz=url.substring(bzzIndex+"bzz=".length);
		}
	}
	
	//已备案情况，只对应一个报送期间，则属期锁定不可选，如需报送其他属期，则重新有清册选择报送期进入
	// 贵州个性化
	var gz_gxh = false;
	if (isCwbabz=="Y" && bzz=="dzswj"){
		// GZDSDZSWJ-2305 测试环境选择财务报表年报申报属期带出不对
		var scope = arguments[0];
		var swjgDm = scope.formData.extraParam.djNsrxx.zgswjdm;
		if (swjgDm.indexOf('152') == -1 ){
			return rtnData;
		} else {
			gz_gxh = true;
		}
	}
	//无备案情况，放开报送期间填写，做属期选择联动处理
	if ((isCwbabz=="N" && (bzz=="dzswj"||bzz=="N")) || gz_gxh){
		$('#sssqqId').attr('disabled',false);
		$('#sssqzId').attr('disabled',false);
		var scope = arguments[0];
		var dynDatezbz = arguments[1];
		var bsqj = arguments[2];
		var sssqq = arguments[3];
		var sssqz = arguments[4];
		var rtnSsq = ssqBsqjSsq(dynDatezbz,bsqj,sssqq,sssqz);
		scope.formData.cwbbbsjcsz.sssqq = rtnSsq.sssqq;
		scope.formData.cwbbbsjcsz.sssqz = rtnSsq.sssqz;
		rtnData.sssqq = rtnSsq.sssqq;
		rtnData.sssqz = rtnSsq.sssqz;
		rtnData.isTrue = rtnSsq.isTrue;
		scope.$apply();
		
		return rtnData;
	}
	//财税管家的申报期间代码与电局不同，但是目前是有些JS是公用的，暂时做此处理区分
	if (bzz=="csgj"){
		var scope = arguments[0];//区域对象
		var dynDatezbz = arguments[1];//所属期起止标志
		var bsqj = arguments[2];//报送期间
		var sssqq = arguments[3];//所属期起
		var sssqz = arguments[4];//所属期止
		
		var rtnSsq = CSGJ_SSQ(dynDatezbz,bsqj,sssqq,sssqz);
		scope.formData.cwbbbsjcsz.sssqq = rtnSsq.sssqq;
		scope.formData.cwbbbsjcsz.sssqz = rtnSsq.sssqz;
		rtnData.sssqq = rtnSsq.sssqq;
		rtnData.sssqz = rtnSsq.sssqz;
		rtnData.isTrue = rtnSsq.isTrue;
		scope.$apply();
		
		return rtnData;
	}
	
	return rtnData;
}

/**
 * 根据报送期间与所属期计算所属期起止
 * @param dynDatezbz
 * @param bsqj
 * @param sssqq
 * @param sssqz
 * @returns 
 */
function ssqBsqjSsq(dynDatezbz,bsqj,sssqq,sssqz){
	var rtnSsq = {};
	rtnSsq.sssqq = sssqq;
	rtnSsq.sssqz = sssqz;
	rtnSsq.isTrue = false;
	var sssqqArr = sssqq.split("-");
	var sssqzArr = sssqz.split("-");
	var year = sssqqArr[0];//年份
	var qmonth = sssqqArr[1];//所属期起月份
	var zmonth = sssqzArr[1];//所属起止月份
	
	//由所属期起跟报送期间计算所属起止
	//月报:04
	//季报:03,当前所属期起是否符合季报月份:01,04,07,10
	//年报:01
	if (dynDatezbz=="1"){
		if (bsqj=="04"){
			rtnSsq.sssqq = year+"-"+qmonth+"-01";
			rtnSsq.sssqz = calculateMonthLastDay(sssqq);
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
		if (bsqj=="03"){
			if (qmonth != "01" && qmonth != "04" && qmonth != "07" && qmonth != "10"){
				return rtnSsq;
			}
			rtnSsq.sssqq = year+"-"+qmonth+"-01";
			rtnSsq.sssqz = calculateMonthLastDay(year+"-"+monthToStr(parseInt(qmonth,10)+2));
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
		if (bsqj=="01"){
			rtnSsq.sssqq = year+"-01-01";
			rtnSsq.sssqz = year+"-12-31";
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
	}
	
	//有所属期止跟报送期间计算所属期起
	//月报:04
	//季报:03，当前所属期止是否符合季报月份:03,06,09,12
	//年报:01
	if (dynDatezbz=="2"){
		if (bsqj=="04"){
			rtnSsq.sssqq = year+"-"+zmonth+"-01";
			rtnSsq.sssqz = calculateMonthLastDay(sssqz);
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
		if (bsqj=="03"){
			if (zmonth != "03" && zmonth != "06" && zmonth != "09" && zmonth != "12"){
				return rtnSsq;
			}
			rtnSsq.sssqq = year+"-"+monthToStr(parseInt(zmonth,10)-2)+"-01";
			rtnSsq.sssqz = calculateMonthLastDay(sssqz);
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
		if (bsqj=="01"){
			rtnSsq.sssqq = year+"-01-01";
			rtnSsq.sssqz = year+"-12-31";
			rtnSsq.isTrue = true;
			return rtnSsq;
		}
	}
	
	return rtnSsq;
}

/**
 * 计算指定日期月份的最后一天
 * @param nowDate
 * @returns {String}
 */
function calculateMonthLastDay(nowDate) {
	var nowTime = nowDate.split("-");
	var month = parseInt(nowTime[1],10);
	var new_year = parseInt(nowTime[0],10);//取当前的年份          
	var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定） 
	//当月前一个月的月末
	if (month > 12) {
		new_month -= 12; //月份减          
		new_year++; //年份增          
	}
	var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
	var lastDay = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24))
			.getDate();//获取当月最后一天日期        
	return nowTime[0] + "-" + nowTime[1] + "-" + lastDay;
}

/**
 * 日期转字符串
 * @param month
 * @returns {String}
 */
function monthToStr(month){
	if (month<10){
		return "0"+month;
	}
	return ""+month;
}

