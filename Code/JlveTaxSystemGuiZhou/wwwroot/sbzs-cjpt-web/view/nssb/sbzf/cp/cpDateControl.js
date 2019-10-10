
/**
 * 
 * 公用查询时间函数，主要判断选中的时间是否为月初
 */

function validateTimeStart(time){
	var day=time.substr(8,2);
	if(time!=""&&time!=null&&day!="01"){
//		alert("税款所属期起应为每月的１日，请重新选择！");
		return false;
	}else{
		return true;
	}
}
/**
 * 公用查询时间函数，主要判断选中的时间是否为月末
 */
function validateTimeEnd(time){
	var year=time.substr(0,4);
	var month=time.substr(5,2);
	var day=time.substr(8,2);
	if(month=="01" || month=="03"
		|| month=="05" || month=="07"
		 || month=="08"  || month=="10"
		 || month=="12"){
	if(day!="31"){
//		alert("税款所属期止应该为月末，请重新选择！");
		return false;
	}
}
if( month=="04" || month=="06" || month=="09"
		 || month=="11"){
	if(day!='30'){
//		alert("税款所属期止应该为月末，请重新选择！");
		return false;
	}
}
if(month=="02"){
	if(year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)){
		if(day!="29"){
//			alert("税款所属期止应该为月末，请重新选择！");
			return false;
		}
	}else{
		if(day!="28"){
//			alert("税款所属期止应该为月末，请重新选择！");
			return false;
		}
	}
}
return true;
}

//查询前，进行查询条件判定函数
function doBeforeQuery(skssqq,skssqz){
	if(skssqq==""){
		alertMsg('税款所属期起不能为空!');
		return false;
	}
	if(skssqz==""){
		alertMsg('税款所属期止不能为空!');
		return false;
	}
	if(!validateTimeStart(skssqq)){
		alertMsg('税款所属期起应为每月月初!');
		return false;
	}
	if(!validateTimeEnd(skssqz)){
		alertMsg('税款所属期止应为每月月末!');
		return false;
	}
	if(skssqq > skssqz){
		alertMsg('税款所属期止的时间不能小于税款所属期起!');
		return false;
	}
	return true;
}

//查询前，进行查询条件判定函数
function validateSbrq(sbrqq,sbrqz){
	if(!sbrqq){
		alertMsg('申报日期起不能为空!');
		return false;
	}
	if(!sbrqz){
		alertMsg('申报日期止不能为空!');
		return false;
	}
	if(sbrqq > sbrqz){
		alertMsg('申报日期止不能小于申报日期起!');
		return false;
	}
	return true;
}

//输入Date对象，输出格式YYYY-MM-DD
function getFormatDate(date) {
	var newDate = new Date(date);
    var seperator = "-";
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1;
    var strDate = newDate.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var returnDate = year + seperator + month + seperator + strDate;
    return returnDate;
}

/*
 * 获取当月天数
 */
function getLastDay(year,month)   
{   
 var new_year = year;  //取当前的年份   
 var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）   
 if(month>12)      //如果当前大于12月，则年份转到下一年   
 {   
 new_month -=12;    //月份减   
 new_year++;      //年份增   
 }
 month--;//恢复传进来的月份
 var new_date = new Date(new_year,new_month,1);        //取当年当月中的第一天   
 var new_day = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期 
 return new Date(year,month-1,new_day); 
}



/*
 * 提示
 */
function alertMsg(msg){
	layui.use('layer', function(){
		var layer = layui.layer;
		var top="auto"//默认自动
		try{
			if(window.top==window.self){
				//不存在父页面
			}else{
				top=window.parent.document.documentElement.scrollTop+100+"px";
			}
		}catch(e){}
		layer.open({
			type : 1,
			area : [ '300px' ], //固定宽高400px
			offset : top,
			title : [ '提示信息' ],
			scrollbar : false,
			content : msg,
			btn : ['关闭' ],
			btnAlign : 'r', //按钮居右
			yes : function() {
				layer.closeAll();
			}
		});
	}); 
}