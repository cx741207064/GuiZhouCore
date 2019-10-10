/**
 * @author xuhuafei
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
