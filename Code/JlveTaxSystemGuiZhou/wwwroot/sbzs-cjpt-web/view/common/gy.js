function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}	
//制保留2位小数，如：2，会在2后面补上00.即2.00    
function toDecimal2(x) {    
    var f = parseFloat(x);    
    if (isNaN(f)) {    
        return false;    
    }    
    var f = Math.round(x*100)/100;    
    var s = f.toString();    
    var rs = s.indexOf('.');    
    if (rs < 0) {    
        rs = s.length;    
        s += '.';    
    }    
    while (s.length <= rs + 2) {    
        s += '0';    
    }    
    return s;    
}  
function　thousands(num){
    num = num.toString();   //将输入的数字转换为字符串
    num=toDecimal2(num);
//    if(/^-?\d+\.?\d+$/.test(num)){  //判断输入内容是否为整数或小数
    if(/^(-?\d+)(\.\d+)?$/.test(num)){  //判断输入内容是否为整数或小数
        if(/^-?\d+$/.test(num)){    //判断输入内容是否为整数
            num =num + ",00";   //将整数转为精度为2的小数，并将小数点换成逗号
//            num =num + ",";   //将整数转为精度为2的小数，并将小数点换成逗号
        }else{
            num = num.replace(/\./,',');    //将小数的小数点换成逗号
        }
        while(/\d{4}/.test(num)){ //
            /***
             *判断是否有4个相连的数字，如果有则需要继续拆分，否则结束循环；
             *将4个相连以上的数字分成两组，第一组$1是前面所有的数字（负数则有符号），
             *第二组第一个逗号及其前面3个相连的数字；
             * 将第二组内容替换为“,3个相连的数字，”
             ***/
            num = num.replace(/(\d+)(\d{3}\,)/,'$1,$2');
        }

        num = num.replace(/\,(\d*)$/,'.$1');   //将最后一个逗号换成小数点
        
        var rs = num.indexOf('.');    
        while (num.length <= rs + 2) {    
            num += '0';    
        } 
        return num;
    }
}
function commafyback(num){ 
	var x = num.split(','); 
	return parseFloat(x.join("")); 
} 