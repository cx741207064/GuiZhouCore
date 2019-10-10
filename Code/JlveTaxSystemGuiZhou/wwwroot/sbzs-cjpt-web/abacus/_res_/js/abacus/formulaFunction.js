/***************************************函数目录*******************************************
【Math类】
ABS(any)
MIN()
MAX()
SUM()
ROUND(any, Number)
mul()
TRUNC(any, any)

【字符串类】
SUMIF()
DECODE()
CT(any, any, any)
len(any)
item_add(any, any)

【工具类】
DYNAMIC_LOAD_SCRIPT(any)

【判断类】
IF(any, any, any)
STRING_CHECK_IS_EMAIL(any)
STRING_CHECK_IS_TELEPHONENUMBER(any)
STRING_CHECK_IS_ID(any)
STRING_CHECK_IS_SPECIAL_CHARACTER(any)
STRING_CHECK_IS_CHINESE(any)
STRING_CHECK_IS_NUMBER_AND_LETTER(any)
DATE_CHECK_TIME_SIZE(any, any)
DATE_CHECK_IS_MONTH_FIRST_DAY(any)
DATE_CHECK_IS_MONTH_LAST_DAY(any)
ARRAY_CHECK_ELEMENT_REPEAT(any)
STRING_CHECK_IS_POSITIVEiINTEGER(str)
checkStrIsChineseOrLetter(cs,str)
STRING_CHECK_IS_NUMBER(any)

【日期类】
DATE_GET_FULL_MONTH(any)
getCurDate()【不推荐使用】
getLastMonthFd()【不推荐使用】
getLastMonthLd()【不推荐使用】
getLastYear(any)【不推荐使用】
DATE_GET_LAST_YEAR()
getYear(any)【不推荐使用】
DATE_GET_CURRENT_YEAR()
DATE_GET_CURRENT_DATE(any)
DATE_GET_CURRENT_YEAR_FIRST_DAY()
DATE_GET_SERVER_NOW_DATE()
DATE_GET_LAST_YEAR_TODATE()
DATE_GET_LAST_MONTH_FIRST_DAY()
DATE_GET_LAST_MONTH_LAST_DAY()
DATE_GET_CURRENT_MONTH_FIRST_DAY()
DATE_GET_CURRENT_MONTH_LAST_DAY()
DATE_GET_CURRENT_QUARTER_FIRST_MONTH()
DATE_GET_CURRENT_QUARTER_FIRST_DAY()
DATE_GET_CURRENT_QUARTER_LAST_DAY()
DATE_GET_TIME_INTERVAL_DAYS(any, any)
 *****************************************************************************************/
/***************************************Math类********************************************/
/**
 * Absolute value.<BR>
 * 取绝对值.
 *
 * @param number
 *            Number: Number for absoluting. 数字：需要求绝对值的数值.
 * @returns Number: Value of absolute. 传入参的绝对值（非负数）
 */
function ABS(number,defaultValue) {
	if (!isNaN(number)) {
		return (number > 0) ? (number) : (-number);
	}else{
		if(defaultValue !== undefined){
			return defaultValue;
		}
	}
}
/**
 * Minimum value.<BR>
 * 求多个数值的最小值.
 *
 * @param Multiple.
 *            Numbers, array of number or multiple array. 多个数值或数组.
 * @returns Number: Minimum value. 最小值
 */
function MIN() {
	var ps;
	if (arguments.length <= 0) {
		return null;
	} else if (arguments.length == 1) {
		ps = arguments[0];
	} else {
		ps = arguments;
	}
	if (ps.length) {
		var min = ps[0];
		for (var i = 0; i < ps.length; i++) {
			if (ps[i] instanceof Array) {
				var tmp = MIN(ps[i]);
				min = (min < tmp) ? (min) : (tmp);
			} else {
				min = (min < ps[i]) ? (min) : (ps[i]);
			}
		}
		return min;
	} else if (!isNaN(ps)) {
		return ps;
	}
}
function MAX() {
	var ps;
	if (arguments.length <= 0) {
		return null;
	} else if (arguments.length == 1) {
		ps = arguments[0];
	} else {
		ps = arguments;
	}
	if (ps.length) {
		var max = ps[0];
		for (var i = 0; i < ps.length; i++) {
			if (ps[i] instanceof Array) {
				var tmp = MAX(ps[i]);
				max = (max > tmp) ? (max) : (tmp);
			} else {
				max = (max > ps[i]) ? (max) : (ps[i]);
			}
		}
		return max;
	} else if (!isNaN(ps)) {
		return ps;
	}
}

function SUM() {
    var ps;
    if (arguments.length <= 0) {
        return null;
    } else if (arguments.length === 1) {
        ps = arguments[0];
    } else {
        ps = arguments;
    }

    if(typeof(ps) === "string") {
        //转数字
        ps = Number(ps);
        if (isNaN(ps)) {
            throw "调用SUM方法，传入非数字类型参数：[" + ps + "]";
            return;
        }
    }

    if (ps.length) {
        //定义返回值
        var ret = 0;
        //定义整数部分
        var intNum = 0;
        //定义小数部分的数组容器
        var decimalPart = new Array();
        //遍历数据，把整数部分求和结果放在intNum，小数部分放入数组decimalPart
        for (var i = 0; i < ps.length; i++) {
            var tmp = 0;
            if (ps[i] instanceof Array) {
                //ps[i]是数组则先求和
                tmp = SUM(ps[i]);
            } else {
                tmp = ps[i];
            }

            if(typeof(tmp) !== "number"){
				//转数字
				tmp = Number(tmp);
				if(isNaN(tmp)){
					throw "调用SUM方法，传入非数字类型参数：[" + ps[i] + "]";
					return;
				}
            }
            //调用整数部分与小数部分分离的方法
            intNum += DEPARTNUM(tmp).intNum;
            if (DEPARTNUM(tmp).decimal) {
                decimalPart.push(DEPARTNUM(tmp).decimal);
            }
        }
        //调用小数部分求和的方法
        ret = DECIMALSUM(decimalPart);
        //整数部分与小数部分相加
        ret = ret + intNum;
        return ret;
    } else if (!isNaN(ps)) {
        return ps;
    }
}

/**
 * Rounding the fractional part.<BR>
 * 将数字的小数部分进行四舍五入, 缺省保留两位精度.
 * 修复ROUND(123,2)没有变成123.00这类问题
 *
 * @param number
 *            Number: Number for rounding. 数字：需要做四舍五入的数值.
 * @param precision
 *            Number: Precision. 数字：精度，默认为2.
 * @returns Number: Rounding result.
 */
function ROUND_FIX(number, precision) {
    if (precision == undefined){
        precision = 2;
	}
    return ROUND(number, precision).toFixed(precision);
}

/**
 * Rounding the fractional part.<BR>
 * 将数字的小数部分进行四舍五入, 缺省保留两位精度.
 *
 * @param number
 *            Number: Number for rounding. 数字：需要做四舍五入的数值.
 * @param precision
 *            Number: Precision. 数字：精度，默认为2.
 * @returns Number: Rounding result.
 */
function ROUND(number, precision) {
	if (isNaN(number)) {
		return 0;
	}
	if (number == Infinity || number == -Infinity) {
		return 0;
	}
    if (precision == undefined || precision <= 13) {
        number = Number(Number(number).toFixed(13));
    } else if (precision > 13) {
        number = Number(Number(number).toFixed(precision));
    }
	/* 默认精度为2位 */
	if (precision == undefined)
		precision = 2;
	var t = 1;
	for (; precision > 0; t *= 10, precision--)
		;
	for (; precision < 0; t /= 10, precision++)
		;

	return Math.round(mul(number, t) + 1e-9 ) / t;
}

function mul() {
	if (arguments.length < 2) {
		throw "Wrong parameter Number!"
	} else if (arguments.length == 2) {
		a = arguments[0];
		b = arguments[1];
		var c = 0, d = a.toString(), e = b.toString();

        /**
		 * 增加科学计数法的处理，对于科学计数法（含E或e）
		 * ^(-?\d+.?\d*)[Ee]{1}(-?\d+)$ 科学计数法正则
		 * var result = d.match(reg) 返回一个数组
		 * result[0] 整个科学计数法表达式
		 * result[1] 是科学计数法的尾数（即e前面的表达式）
		 * result[2] 是科学计数法的阶码（即e后面10的幂）
		 * 尾数按照原来的逻辑处理（按小数点的位置移位）
		 * 阶码用c减阶码（最后计算会除以Math.pow(10, c)，相对于把阶码乘回来）
         */
        var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
		if(d.indexOf('E') > -1 || d.indexOf('e') > -1){
            var result = d.match(reg);
            d = result[1];
            c -= Number(result[2]);
		}

		if(e.indexOf('E') > -1 || e.indexOf('e') > -1){
            var result = e.match(reg);
            e = result[1];
            c -= Number(result[2]);
		}

		try {
			c += d.split(".")[1].length;
		} catch (f) {
		}
		try {
			c += e.split(".")[1].length;
		} catch (f) {
		}
		return Number(d.replace(".", "")) * Number(e.replace(".", ""))
				/ Math.pow(10, c);
	} else {
		a = arguments[0];
		b = arguments[1];
		var rtn_left = mul(a, b);
		var i = 2;
		var param = [];
		param[0] = rtn_left;
		while (i < arguments.length) {
			param[i - 1] = arguments[i];
			i++;
		}
		return mul.apply(this, param);
	}
}
/**
 * Truncate the fractional part.<BR>
 * 将数字的小数部分截去, 返回整数.
 *
 * @param number
 *            Number: Number for truncate. 数字：需要做截断的数值.
 * @returns Number: Truncated result.
 */
function TRUNC(number, precision) {
	var t = 1;
	for (; precision > 0; t *= 10, precision--)
	;
	number *= t;
	var integer_part = Math.floor(number);
	return integer_part/t;
	//throw "No implement yet!"
}
/*
整数部分小数部分分离的方法
 */
function DEPARTNUM(num) {
    //定义整数部分
    var intNum = 0;
    //定义小数部分
    var decimal = 0;
    //将得到的小数拆分成整数部分和小数部分，整数部分为intNum，小数部分为decimal
    //由于浏览器会把0.000000001这类的小数自动换成科学计数法，也不带小数点，所以要加以判断
    if (num.toString().indexOf(".") === -1 && num.toString().indexOf('E') === -1 && num.toString().indexOf('e') === -1) {
        //只包含整数
        intNum = num;
        decimal = null;
    } else if (num.toString().indexOf('E') > -1 || num.toString().indexOf('e') > -1) {
        if (num > 1) {
            //若传入为整数的科学记数法
            intNum = num;
            decimal = null;
        } else {
            //将小于1的小数放入小数部分
            decimal = num;
        }
    } else {
        //带小数的先取出整数
        intNum = parseInt(num);
        //判断是否执行小数拆分
        if (num.toString().indexOf(".") > -1) {
            decimal = ROUND(num - intNum, 13);
        }
    }
    return {"intNum":intNum,"decimal":decimal};
}

/*
小数部分求和的方法
 */
function DECIMALSUM(decimalPart) {
    var ret = 0;
    //定义存放所有小数部分的小数位数的数组
    var decimalBits = new Array();
    //科学计数法正则
    var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
    if (decimalPart.length) {
        for (var k = 0; k < decimalPart.length; k++) {
            if (decimalPart[k].toString().indexOf('E') > -1 || decimalPart[k].toString().indexOf('e') > -1) {
                //取科学计数法的位数
                var result = decimalPart[k].toString().match(reg);
                //把科学计数法的位数放入数组
                decimalBits.push(0 - Number(result[2]));
            }
            if (decimalPart[k].toString().indexOf(".") > -1) {
                //把正常带小数点的小数位数放入数组
                decimalBits.push(decimalPart[k].toString().split(".")[1].length);
            }
        }
        //取最大的小数位数
        var bits = MAX(decimalBits);
        for (var j = 0; j < decimalPart.length; j++) {
            //扩大小数至最大小数位数的倍数进行相加，避免小数相加有误差
            ret = Math.round((ret * Math.pow(10, bits)) + ((decimalPart[j]) * Math.pow(10, bits))) / Math.pow(10, bits);
        }
    }
    return ret;
}

/** **************************************字符串类********************************************** */
/**
 * matching:匹配区 conditions:条件区 sum:聚合区
 *
 * <pre>
 * UMIF('$..dkqdGridlbVO[*].fpzlDm',[condition1,condition2...],'$..dkqdGridlbVO[*].yfje').条件聚合
 * </pre>
 */
function SUMIF() {
    var matching, con, ps;
    if (arguments.length > 0 && arguments.length <= 2) {
        return SUM(arguments[arguments.length - 1]);
    } else if (arguments.length === 3) {
        matching = arguments[0];
        con = arguments[1];
        ps = arguments[2];
        if (!(matching instanceof Array) && !(ps instanceof Array)) {
            matching = [matching];
            ps = [ps];
        }
    } else {
        return null;
    }

    if (matching.length) {
        //定义返回值
        var ret = 0;
        //定义整数部分
        var intNum = 0;
        //定义小数部分的数组容器
        var decimalPart = new Array();
        //遍历数据，把整数部分求和结果放在intNum，小数部分放入数组decimalPart
        for (var i = 0; i < matching.length; i++) {
         var index=false;
        	   if (con instanceof Array) {
        		   index=$.inArray(matching[i], con)!=-1?true:false;
        	   }else{
        		    index=con===matching[i]?true:false;
        	   }
            if (index) {
                var tmp = 0;
                if (matching[i] instanceof Array) {
                    tmp = SUM(ps[i]);
                } else {
                    tmp = ps[i];
                }

                if(typeof(tmp) !== "number") {
                    //转数字
                    tmp = Number(tmp);
                    if (isNaN(tmp)) {
                        throw "调用SUMIF方法，传入非数字类型参数：[" + ps[i] + "]";
                        return;
                    }
                }
                //调用整数部分与小数部分分离的方法
                intNum += DEPARTNUM(tmp).intNum;
                if (DEPARTNUM(tmp).decimal) {
                    decimalPart.push(DEPARTNUM(tmp).decimal);
                }
            }
        }
        //调用小数部分求和的方法
        ret = DECIMALSUM(decimalPart);
        //整数部分与小数部分相加
        ret = ret + intNum;
        return ret;
    } else if (!isNaN(ps)) {
        return ps;
    }
}
/**
 * Return value from multiple selections according to selection-expression.<BR>
 * 比较表达式和搜索字，如果匹配，返回结果；如果不匹配，返回default值；如果未定义default值，则返回空值.
 *
 * @param Multi-parameters:
 *            expression, search_1, result_1, search_2, result_2, ...,
 *            result_default <BR>
 *            不定参数：表达式, 索引1, 取值1, 索引2, 取值2, ..., 缺省结果
 *
 * <pre>
 *   DECODE (expression, search_1, result_1)
 *   DECODE (expression, search_1, result_1, search_2, result_2)
 *   DECODE (expression, search_1, result_1, search_2, result_2, ...., search_n, result_n)
 *   DECODE (expression, search_1, result_1, default)
 *   DECODE (expression, search_1, result_1, search_2, result_2, default)
 *   DECODE (expression, search_1, result_1, search_2, result_2, ...., search_n, result_n, default)
 * </pre>
 *
 * @returns Result if matched, otherwise return default or null. 返回匹配结果值,
 *          如无法匹配则返回default或null.
 */
function DECODE() {
	if (arguments.length <= 2) {
		return null;
	}
	// TODO: 啥都还没写.
	throw "No implement yet!"
}
/**
 * codeTable:代码表 path:索引 node:获取值
 *
 * <pre>
 * T('ysxmCT',$..ygzsffxcsmxbGridlbVO[#].ysxmdmjmc,'zsl').在应税项代码表中，根据应税项目代码获取征收率
 * </pre>
 */
function CT(codeTable, key, node) {
	return formCT[codeTable][key][node];
}

/**
 * 获取传入参数的长度属性值，没有长度属性则报错
 *
 */
function len(stringVar) {
	if(typeof stringVar==='number'){
		stringVar = stringVar.toString();
	}
	if(stringVar===null||stringVar===undefined){
		return 0;
	}
	try{
		return stringVar.replace(/[^\x00-\xff]/g,"abc").length;//使用正则替换所有中文字符,然后再计算
	}catch(e){
		throw new Error('传入的参数类型为：' + (typeof stringVar) + ",没有length属性。");
	}
}
/**
 * 获取字符串的长度
 *
 */
function strlen(stringVar) {
	var strlen = 0;
	for (var i = 0; i < stringVar.length; i++) {
		if (stringVar.charCodeAt(i) > 255) {
			strlen += 3;
		} else {
			strlen++;
		}
	}
	return strlen;
}

/**
 * 获取字符串的长度 a 要校验的节点 b 校验的长度 一个中文为3个长度
 */
function lenVerify(a, b) {
	var strlen = 0;
	for (var i = 0; i < a.length; i++) {
		if (a.charCodeAt(i) > 255) {
			strlen += 3;
		} else {
			strlen++;
		}
	}
	if (strlen > b) {
		return false;
	}
	return true;
}
/**
 * arr1 数组1 arr2 数组1 return 数组1 + 数组1 结果
 */
function item_add(arr1, arr2) {
	var ret = [];
	for (var i = 0; i < arr1.length; i++) {
		ret[i] = arr1[i] + arr2[i];
	}
	return ret;
}
/** *************************************判断类******************************************* */
/**
 * condition 条件 retYes condition 为 true 时的结果 retNo condition 为 false 时的结果
 */
function IF(condition, retYes, retNo) {
	return (condition) ? retYes : retNo;
}
/**
 * 判断内容是否是邮件格式 mail string return boolean
 */
function STRING_CHECK_IS_EMAIL(mail) {
	return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
			.test(mail);
}
/**
 * 判断输入参数是否是正整数 mail string return boolean
 */
function STRING_CHECK_IS_POSITIVEiINTEGER(str) {
	if ((/^(\+|-)?\d+$/.test(str)) && str > 0) {
		return true;
	} else {
		return false;
	}
}
/**
 * 固话，手机号码校验 固话 区号+号码 3+8或4+7 有一个匹配即表示符合条件 num 号码 return boolean
 */
function STRING_CHECK_IS_TELEPHONENUMBER(num) {
	var guhua = /^(\d{3}-?\d{8})|(\d{4}-?\d{7})$/.test(num);
	var shouji = /^1\d{10}$/.test(num);
	return guhua | shouji;
}
/**
 * 身份证号的简单校验 1、15位或18位，如果是15位，必需全是数字。 2、如果是18位，最后一位可以是数字或字母Xx，其余必需是数字。 id 身份证号码
 * return boolean
 */
function STRING_CHECK_IS_ID(id) {
	return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(id);
}
/**
 * 税务师证书编号校验 1、应为7位数字或8位数字或13位数字。 2、或SW+8位数字或RD+10位以下数字。 num 税务师证书编号
 * return boolean
 */
function STRING_CHECK_IS_SWSZSBHNUM(num) {
	var chunshuzi = /^(\d{7}$)|(^\d{8}$)|(^\d{13}$)/.test(num);
	var zimuheshuzi = /^(SW\d{8}$)|^(RD\d{0,10}$)/.test(num);
	return chunshuzi | zimuheshuzi;
}

/**
 * 注册会计师证书编号校验 应为12位数字或两位字母+9位数字。 num 注册会计师证书编号
 * return boolean
 */
function STRING_CHECK_IS_ZCKJSBHNUM(num) {
	return  /^(\d{12}$)|(^[a-zA-Z]{2}\d{9}$)/.test(num);
}

/**
 * 律师执业证编号校验 应为17位数字或一位字母+14位数字。 num 律师执业证编号
 * return boolean
 */
function STRING_CHECK_IS_LSBHNUM(num) {
	return /^(\d{17}$)|(^[a-zA-Z]\d{14}$)/.test(num);
}


/**
 * 判断是否是特殊字符 【"'<>%;)(&+】 str return boolean
 */
function STRING_CHECK_IS_SPECIAL_CHARACTER(str) {
	return /["'<>%;)(&+]/.test(str);
}

/**
 * 判断是否是number{15.2}
 *
 * @param str
 */
function STING_CHECK_IS_NUMBERAND(str) {
	return /^(0|[1-9]\d{0,14})(\.\d{1,2})?$/.test(str);
}
/**
 * 是否包含中文 str return boolean
 */
function STRING_CHECK_IS_CHINESE(str) {
	return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
}
/**
 * 判断是否由字母或者数字组成 strVar string return boolean
 */
function STRING_CHECK_IS_NUMBER_AND_LETTER(strVar) {
	return /^[a-zA-Z\d]+$/.test(strVar);
}

function STR_IS_EMPTY(strVar) {
	return strVar === "" || strVar === undefined || strVar === null;
}

function STR_IS_NOT_EMPTY(strVar) {
	return !STR_IS_EMPTY(strVar);
}

function STR_IS_EMPTY_OR() {
	var ret = true;
	for (var i = 0; i < arguments.length; i++) {
		if (STR_IS_EMPTY(arguments[i])) {
			return true;
		}
	}
	return false;
}

function STR_IS_NOT_EMPTY_OR() {
	var ret = true;
	for (var i = 0; i < arguments.length; i++) {
		if (STR_IS_NOT_EMPTY(arguments[i])) {
			return true;
		}
	}
	return false;
}

function STR_IS_EMPTY_AND() {
	var ret = true;
	for (var i = 0; i < arguments.length; i++) {
		if (!STR_IS_EMPTY(arguments[i])) {
			return false;
		}
	}
	return true;
}

function STR_IS_NOT_EMPTY_AND() {
	var ret = true;
	for (var i = 0; i < arguments.length; i++) {
		if (STR_IS_EMPTY(arguments[i])) {
			return false;
		}
	}
	return true;
}

/**
 * 比较两个时间的大小，可以相等 str1<=str2 str1 yyyy-mm-dd str2 yyyy-mm-dd return boolean
 */
function DATE_CHECK_TIME_SIZE(str1, str2) {
	if (str1 && str2 && str1.length == 10 && str2.length == 10) {
		var start = parseDate(str1);
		var end = parseDate(str2);
		return start <= end;
	} else {
		return false;
	}
}

/**
 * 比较两个时间的大小，不可以相等 str1<str2 str1 yyyy-mm-dd str2 yyyy-mm-dd return boolean
 */
function DATE_CHECK_TIME(str1, str2) {
	if (str1 && str2 && str1.length == 10 && str2.length == 10) {
		var start = parseDate(str1);
		var end = parseDate(str2);
		return start < end;
	} else {
		return false;
	}
}
function parseDate(dateStringInRange) {
	var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/, date = new Date(NaN), month, parts = isoExp
			.exec(dateStringInRange);
	if (parts) {
		month = +parts[2];
		date.setFullYear(parts[1], month - 1, parts[3]);
		if (month != date.getMonth() + 1) {
			date.setTime(NaN);
		}
	}
	return date;
}
/**
 * 判断是否是月初 str yyyy-mm-dd return boolean
 */
function DATE_CHECK_IS_MONTH_FIRST_DAY(str) {
	str = str.split('-');
	return parseInt(str[2]) == 1;
}
/**
 * 判断是否是月末 str yyyy-mm-dd return boolean
 */
function DATE_CHECK_IS_MONTH_LAST_DAY(string_date) {
	var str = string_date.split('-');
	var date = new Date(str[0], str[1], 0);
	return parseInt(str[2]) == date.getDate();
}

/**
 * ARRAY_CHECK_ELEMENT_REPEAT() 判断数组元素重复 array Array对象格式 单一元素判断 var array1 =
 * new{"bgxmDm1","bgxmDm2","bgxmDm3",...}; 联合元素判断 var array2 =
 * new{"bgxmDm1-bghnr1-...","bgxmDm2-bghnr2-...","bgxmDm3-bghnr3-...",...};
 * return 不重复返回 -1 array1 bgxmDm1==bgxmDm2 return 0 重复 返回重复元素所在索引【0,1,2,...】
 */
function ARRAY_CHECK_ELEMENT_REPEAT(ary) {
	// function rep(ary){
	var split = ",";
	var s = ary.join(",") + split;
	for (var i = 0; i < ary.length; i++) {
		if (s.replace(ary[i] + split, "").indexOf(ary[i] + split) > -1) {
			return i;
		}
	}
	return -1;
}
/** *************************************工具类******************************************* */
/**
 * 动态添加js文件 src src 路径
 */
function DYNAMIC_LOAD_SCRIPT(src) {
	var new_element = document.createElement("script");
	new_element.setAttribute("type", "text/javascript");
	new_element.setAttribute("src", src);
	document.body.appendChild(new_element);
}
/** *************************************日期类******************************************* */
Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 判断月份是否完成，是否需要加0,
 *
 */
function DATE_GET_FULL_MONTH(month) {
	if (parseInt(month) < 10) {
		return "0" + month;
	}
	return month;
}
/**
 * @deprecated 获取当前日期 推荐使用 DATE_GET_CURRENT_DATE()
 *
 */
function getCurDate() {
	var d = new Date();
	return d.format("yyyy-MM-dd");
}
/**
 * @deprecated 取上个月第一天 推荐使用 DATE_GET_LAST_MONTH_FIRST_DAY()
 */
function getLastMonthFd() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	if (month == '1')
		return new Date((year - 1) + '', '12', '01').format('yyyy-MM-dd');
	else
		return new Date(year + '', (month - 1) + '', '01').format('yyyy-MM-dd');
}
/**
 * @deprecated 取上个月最后一天 推荐使用 DATE_GET_LAST_MONTH_LAST_DAY()
 */
function getLastMonthLd() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	return new Date(year + '', month + '', '0').format('yyyy-MM-dd');
}
/**
 * @deprecated 取下一年6月30
 */
function getNextyear() {
	var d = new Date();
	var year = d.getFullYear() + 1;
	return new Date(year + '', '05', '30').format('yyyy-MM-dd');
}
/**
 * @deprecated 取当年1月1号
 */
function getNextyearFirsyDay() {
	var d = new Date();
	var year = d.getFullYear();
	return new Date(year + '', '00', '01').format('yyyy-MM-dd');
}
/**
 * @deprecated 取上年年份 推荐使用 DATE_GET_LAST_YEAR() date string return yyyy
 */
function getLastYear(date) {
	return parseInt(date.substring(0, date.indexOf('-'))) - 1 + '';
}
/**
 * 取上年年份 dateString string yyyy-mm-dd return string yyyyy
 */
function DATE_GET_LAST_YEAR(dateString) {
	return parseInt(dateString.split('-')[0]) - 1;
}
/**
 * @deprecated 取今年年份 推荐使用 DATE_GET_CURRENT_YEAR() date string return yyyy
 */
function getYear(date) {
	return date.substring(0, date.indexOf('-'));
}
/**
 * 取今年年份 dateString string yyyy-mm-dd return yyyy
 */
function DATE_GET_CURRENT_YEAR(dateString) {
	return parseInt(dateString.split('-')[0]);
}
/**
 * 判断输入的两个时间相差多少年
 */
function compateYearByTwoTime(time1,time2){
	var year1="";
	var year2="";
	if(time1!=""&&time2!=""){
		var day=DATE_GET_TIME_INTERVAL_DAYS(time1,time2);
		return day/365;
	}else{
		return 0;
	}



}

/**
 * 判断是否相差12个月
 *
 * @param timeqq
 * @param timeqz
 * @returns
 */
function isBeyond12Month(timeqq,timeqz) {
	//假设前面代码已判断timeqq<timeqz
	var yearqq = timeqq.split("-")[0];
	var yearqz = timeqz.split("-")[0];
	yearDiff = parseInt(yearqz) - parseInt(yearqq);
	if(0 == yearDiff) {
		return false;
	} else if(1 == yearDiff) {//判断相差是否超过1年
		//计算日期相差天数
		var dayDiff = DATE_GET_TIME_INTERVAL_DAYS(timeqq, timeqz);

		var monthqq = timeqq.split("-")[1];
		var monthqz = timeqz.split("-")[1];
		var leapYearBz = false;
		if(monthqq <= 2) {
			//期起月份<=2月，则判断期起年份是否为闰年
			leapYearBz = isLeapYear(yearqq);
		} else if (monthqz > 2) {
			//期止月份>2月，则判断期止年份是否为闰年
			leapYearBz = isLeapYear(yearqz);
		}
		//判断当前年是否为闰年,闰年一年366天，非闰年一年365天
		if(leapYearBz){
			 if(dayDiff > 366) {
				 return true;
			 }
			 return false
		} else {
			if(dayDiff > 365) {
				 return true;
			 }
			 return false
		}
	} else {
		//年份相差超过1年，判断超过
		return true;
	}
}
/**
 * 判断日期是否是某月第一天
 */
function isFirstDay(time){
	var day = time.split("-")[2];
	if(day==="01"){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断日期是否是某月最后一天
 */
function isLastDay(time){
	var year = time.split("-")[0];
	var month = time.split("-")[1];
	var day1 = time.split("-")[2];
	var day2 = new Date(year,month,0);
	day2 = day2.getDate();
	if(day1==day2){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断两个日期是否在同一月
 */
function isSameMonth(time1,time2){
	var month1 = time1.split("-")[1];
	var month2 = time2.split("-")[1];
	if(month1===month2){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断年份是否为闰年
 */
function isLeapYear(year) {
	if((year%4==0 && year%100!=0)||(year%100==0 && year%400==0)){
		return true;
	}
	return false;
}

/**
 * 获取服务器上的当前日期 return Date
 */
function DATE_GET_SERVER_NOW_DATE(ran) {
	var mat = Math.floor(Math.random()*1000);
	var date = new Date($.ajax({
		type : "GET",
		url : window.contextPath+"/abacus/_res_/js/abacus/readme.txt?&mat="+mat,
		async : false
	}).getResponseHeader("Date"));
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
/**
 * 获取当前日期 传参 返回要求的 DATE_FORMAT_STRING 格式化日期字符串 不传参 默认返回日期对象
 */
function DATE_GET_CURRENT_DATE(DATE_FORMAT_STRING) {
	// FIXME 取服务器当前时间
	var d = null;
	if(DATE_FORMAT_STRING){
		var mat = Math.floor(Math.random()*1000);
		var date = new Date($.ajax({
			type : "GET",
			url : window.contextPath+"/abacus/_res_/js/abacus/readme.txt?&mat="+mat,
			async : false
		}).getResponseHeader("Date"));
		d = date.format(DATE_FORMAT_STRING);
	}else{
		d = DATE_GET_SERVER_NOW_DATE();
	}
	return d;
}

/**
 * 获取当年1月1日的时间 return string yyyy-mm-dd
 */
function DATE_GET_CURRENT_YEAR_FIRST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	var year = myDate.getFullYear(); // 获取完整的年份(4位,1970-????)
	return year + "-01-01";
}
/**
 * 获取去年今天的日期 return string yyyy-mm-dd
 */
function DATE_GET_LAST_YEAR_TODATE() {
	var date = DATE_GET_CURRENT_DATE();
	var year = date.getFullYear() - 1;
	var month = date.getMonth();
	var day = date.getDay();
	return year + "-" + DATE_GET_FULL_MONTH(month + 1) + "-" + day;
}
/**
 * 上月月初 return string yyyy-mm-dd
 */
function DATE_GET_LAST_MONTH_FIRST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	if (month == 0) {
		year = year - 1;
		month = 12;
	}
	return year + "-" + DATE_GET_FULL_MONTH(month) + "-" + "01";
}
/**
 * 上月月末 var day = new Date(year, month, 0); day.getDate() 为 month
 * 当月份有day.getDate()天， return string yyyy-mm-dd
 */
function DATE_GET_LAST_MONTH_LAST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	if (month == 0) {
		year = year - 1;
		month = 12;
	}
	var day = new Date(year, month, 0);
	return year + "-" + DATE_GET_FULL_MONTH(month) + "-" + day.getDate();
}
/**
 * 次月月初
 */
function DATE_GET_NEXT_MONTH_FIRST_DAY() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	if (month == 12) {
		month = 1;
		year = year + 1;
	} else {
		month = month + 1;
	}
	return year + "-" + DATE_GET_FULL_MONTH(month) + "-" + "01";
}
/**
 * 次月月末
 */
function DATE_GET_NEXT_MONTH_LAST_DAY() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	if (month == 12) {
		year = year + 1;
		month = 1;
	} else {
		month = month + 1;
	}
	var day = new Date(year, month, 0);
	return year + "-" + DATE_GET_FULL_MONTH(month) + "-" + day.getDate();
}
/**
 * 当月1日 return string yyyy-mm-dd
 */
function DATE_GET_CURRENT_MONTH_FIRST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	return year + "-" + DATE_GET_FULL_MONTH(month + 1) + "-" + "01";
}
/**
 * 当月月末 return string yyyy-mm-dd
 */
function DATE_GET_CURRENT_MONTH_LAST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	var day = new Date(year, month + 1, 0);
	return year + "-" + DATE_GET_FULL_MONTH(month + 1) + "-" + day.getDate();
}

/**
 * 获得本季度的开始月份 return number
 */
function DATE_GET_CURRENT_QUARTER_FIRST_MONTH() {
	var myDate = DATE_GET_CURRENT_DATE();
	var month = myDate.getMonth();
	if (month <= 3) {
		return 1;
	} else if (month <= 6) {
		return 4;
	} else if (month <= 9) {
		return 7;
	} else {
		return 10;
	}
}
/**
 * 获得本季度的开始日期 return string yyyy-mm-dd
 */
function DATE_GET_CURRENT_QUARTER_FIRST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	return myDate.getFullYear() + "-"
			+ DATE_GET_FULL_MONTH(DATE_GET_CURRENT_QUARTER_FIRST_MONTH()) + "-"
			+ "01";
}
/**
 * 本季度末日期 return string yyyy-mm-dd
 */
function DATE_GET_CURRENT_QUARTER_LAST_DAY() {
	var myDate = DATE_GET_CURRENT_DATE();
	// 季度末 月份 = 季度初月份+2
	var month = DATE_GET_CURRENT_QUARTER_FIRST_MONTH() + 2;
	var day = new Date(myDate.getFullYear(), month, 0);
	var lastdate = myDate.getFullYear() + '-' + DATE_GET_FULL_MONTH(month)
			+ '-' + day.getDate();
	return lastdate;
}
/**
 * 计算两个时间的间隔天数 ksrq 开始日期 jsrq 结束日期 return number 相差天数
 */
function DATE_GET_TIME_INTERVAL_DAYS(ksrq, jsrq) {
	ksrq = ksrq.substring(0, 10);
	jsrq = jsrq.substring(0, 10);
	var strSeparator = "-"; // 日期分隔符
	var oDate1 = ksrq.split(strSeparator);
	var oDate2 = jsrq.split(strSeparator);
	var iDays;
	var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
	var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
	iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)// 把相差的毫秒数转换为天数
	return iDays;
}

/**
 * 固话，手机号码校验 固话 区号+号码 区号与号码之间可以无连接符，也可以“-”连接 有一个匹配即表示符合条件 num 号码 return boolean
 */

function checkLxdh(num) {
	var guahua = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/.test(num);
	var shouji = /^\d{9,13}$/.test(num);
	return shouji || guahua;
}

/**
 * 校验电话号码格式(包括固定和移动电话)
 */
function VALIDATE_PHONE_NUM(num) {
	if (typeof (num) === "number"||num===undefined) {
		return false;
	}
	if ((/^[0][0-9]{2,3}[0-9]{7,8}$/.test(num)) || (/^[0-9]{7,8}$/.test(num))
			|| (/^[0][0-9]{2,3}-[0-9]{7,8}$/.test(num))
			|| (/^\([0][0-9]{2,3}\)[0-9]{7,8}$/.test(num))
			|| (/^\（[0][0-9]{2,3}\）[0-9]{7,8}$/.test(num))
			|| (/^\[[0][0-9]{2,3}\][0-9]{7,8}$/.test(num))
			|| (/^\([0]\d{2,3}\)-\d{7,8}$/.test(num))
			|| (/^\（[0]\d{2,3}\）-\d{7,8}$/.test(num))
			|| (/^\[[0]\d{2,3}\]-\d{7,8}$/.test(num))
			|| (/^[1][0-9]{10}$/.test(num))) {
		return true;
	} else {
		return false;
	}
}
/**
 * 校验固定电话号码格式
 */
function VALIDATE_GDPHONE_NUM(num) {
	if (typeof (num) === "number"||num===undefined) {
		return false;
	}
	// 0209999999
	// 9999999
	// 020-9999999
	// (020)9999999
	// （020）9999999
	// [020]9999999
	// (020)-9999999
	// （020）-9999999
	// [020]-9999999
	if ((/^[0][0-9]{2,3}[0-9]{7,8}$/.test(num)) || (/^[0-9]{7,8}$/.test(num))
			|| (/^[0][0-9]{2,3}-[0-9]{7,8}$/.test(num))
			|| (/^\([0][0-9]{2,3}\)[0-9]{7,8}$/.test(num))
			|| (/^\（[0][0-9]{2,3}\）[0-9]{7,8}$/.test(num))
			|| (/^\[[0][0-9]{2,3}\][0-9]{7,8}$/.test(num))
			|| (/^\([0]\d{2,3}\)-\d{7,8}$/.test(num))
			|| (/^\（[0]\d{2,3}\）-\d{7,8}$/.test(num))
			|| (/^\[[0]\d{2,3}\]-\d{7,8}$/.test(num))) {
		return true;
	} else {
		return false;
	}
}
/**
 * 校验移动电话号码格式
 */
function VALIDATE_YDPHONE_NUM(num) {
	if (typeof (num) === "number"||num===undefined) {
		return false;
	}
	var lxdhgs = "(^[1][0-9]{10}$)";
	if (num.match(lxdhgs) == null) {
		return false;
	} else {
		return true;
	}
}
/**
 * 校验邮政编码
 */
function VALIDATE_POSTAL_CODE(code) {
	var re = /^[0-9]{6}$/;
	if (re.test(code)) {
		return true;
	} else {
		return false;
	}
}
/**
 * 消费税税费种认定校验
 *
 * zspmDm 征收品目(多个用英文","号隔开) xfs_sfzrd('101020201,101020222')
 */
function xfs_sfzrd() {
	var zspmDm = arguments[0];
	if (zspmDm == "" || zspmDm == null) {
		throw "Wrong Parameter Data!";
	}
	var zspmDms = zspmDm.split(",");
	var qtszhds = this.formData.qcs.initData.hdxx.qtszhd;
	if ($.isEmptyObject(qtszhds)) {
		return true;
	}
	for (var i = 0; i < zspmDms.length; i++) {
		for (var j = 0; j < qtszhds.length; j++) {
			if (zspmDms[i] == qtszhds[j].zspmDm) {
				return false;
			}
		}
	}
	return true;
}

/**
 * 关联业务往来报告表纳税人名称重复校验
 */
function GLYWWLBGB_NSRMC_REPEAT(nsrmc) {
	var data = this.formData;
	var glfxxhjlbVO = data.qyndglywwlbgywbw.qyndglywwlbg2016_G112000hj.glfxxhj.glfxxhjlbVO;
	var count = 0;
	for (var i = 0; i < glfxxhjlbVO.length; i++) {
		if (nsrmc == glfxxhjlbVO[i].nsrmc && nsrmc != "" && nsrmc != null) {
			count = count + 1;
			if (count == 2) {
				return false;
			}

		}
	}
	return true;
}

/**
 * 关联业务往来报告表注册地址带出匹配国家（地区）
 */
function MATCH_ZCDGJ_GJHDQ(nsrmc, ewbhxh, zcdzmatchindex) {
	var data = this.formData;
	var glfxxhjlbVO = data.qyndglywwlbgywbw.qyndglywwlbg2016_G112000hj.glfxxhj.glfxxhjlbVO;
	var glgxbGridlbVO = data.qyndglywwlbgywbw.qyndglywwlbg2016_G101000.glgxbGrid.glgxbGridlbVO;
	for (var j = 0; j < glgxbGridlbVO.length; j++) {
		if (nsrmc != ""
				&& glfxxhjlbVO[ewbhxh - 1].nsrsbh == glgxbGridlbVO[j].nsrsbh
				&& (glfxxhjlbVO[ewbhxh - 1].zcdgj == null
						|| glfxxhjlbVO[ewbhxh - 1].zcdgj == "" || glfxxhjlbVO[ewbhxh - 1].zcdgj == glgxbGridlbVO[zcdzmatchindex].gjhdqszDm)
				&& nsrmc == glgxbGridlbVO[j].glfmc) {
			glfxxhjlbVO[ewbhxh - 1].zcdgj = glgxbGridlbVO[j].gjhdqszDm;
			glfxxhjlbVO[ewbhxh - 1].zcdzmatchindex = j;
			return glfxxhjlbVO[ewbhxh - 1].zcdgj;
		} else if (nsrmc == ""
				&& glfxxhjlbVO[ewbhxh - 1].zcdgj == glgxbGridlbVO[zcdzmatchindex].gjhdqszDm
				&& glfxxhjlbVO[ewbhxh - 1].nsrsbh == "") {
			return "";
		}
	}
	return glfxxhjlbVO[ewbhxh - 1].zcdgj;
}

/**
 * 关联业务往来报告表交易地址带出匹配国家（地区）
 */
function MATCH_JYDGJ_GJHDQ(nsrmc, ewbhxh, jydzmatchindex) {
	var data = this.formData;
	var glfxxhjlbVO = data.qyndglywwlbgywbw.qyndglywwlbg2016_G112000hj.glfxxhj.glfxxhjlbVO;
	var glgxbGridlbVO = data.qyndglywwlbgywbw.qyndglywwlbg2016_G101000.glgxbGrid.glgxbGridlbVO;
	for (var j = 0; j < glgxbGridlbVO.length; j++) {
		if (nsrmc != ""
				&& glfxxhjlbVO[ewbhxh - 1].nsrsbh == glgxbGridlbVO[j].nsrsbh
				&& (glfxxhjlbVO[ewbhxh - 1].jydgj == null
						|| glfxxhjlbVO[ewbhxh - 1].jydgj == "" || glfxxhjlbVO[ewbhxh - 1].jydgj == glgxbGridlbVO[jydzmatchindex].gjhdqszDm)
				&& nsrmc == glgxbGridlbVO[j].glfmc) {
			glfxxhjlbVO[ewbhxh - 1].jydgj = glgxbGridlbVO[j].gjhdqszDm;
			glfxxhjlbVO[ewbhxh - 1].jydzmatchindex = j;
			return glfxxhjlbVO[ewbhxh - 1].jydgj;
		} else if (nsrmc == ""
				&& glfxxhjlbVO[ewbhxh - 1].jydgj == glgxbGridlbVO[jydzmatchindex].gjhdqszDm
				&& glfxxhjlbVO[ewbhxh - 1].nsrsbh == "") {
			return "";
		}
	}
	return glfxxhjlbVO[ewbhxh - 1].jydgj;
}

// 用于判断 数组中重复的数据，返回重复的值
function duplicatecheck(arg) {
	var arg1 = ",";
	var z = 0;
	if (arg) {
		if (arg.length > 0 && arg.constructor == window.Array) {
			var tmp = {};
			for (var i = 0; i < arg.length; i++) {
				var a = tmp[arg[i]];
				if (a == 0) {
					a = a + "";
				}
				if (a && arg[i] != '' && arg[i] != null) {
					// 下标 i 与 tmp[a[i]] 的值重复
					arg1 = arg1 + arg[i] + ",";
					z++;

				} else {
					tmp[arg[i] + ""] = i;
				}
			}
		}
	} else {
		return "";
	}
	return arg1;
}

/**
 * 根据国地税标志和区域代码校验税务机关代码所属地区 flagDm
 * 标志，如244为广东地税，44为广东省不考虑国地税区分;多个用逗号隔开244,151;000为全部 swjgDm
 */
function checkZgswjgDm() {
	var flagDm = arguments[0];
	var swjgDm = arguments[1];

	if ($.isEmptyObject(flagDm) || $.isEmptyObject(swjgDm)) {
		throw "Wrong Parameter Data:null Data!";
	}
	var dms = flagDm.split(",");
	for (var i = 0; i < dms.length; i++) {
		if (dms[i].length == 3 && (dms[i] == swjgDm.substring(0, 3))) {
			return true;
		}
		if (dms[i].length == 2 && (dms[i] == swjgDm.substring(1, 3))) {
			return true;
		}
		if (dms[i].length == 3 && dms[i] == "000") {
			return true;
		}
	}
	return false;
}

/**
 * 城镇土地使用税——月减免金额计算
 */
function jsYjmsje1() {
	var dwse = arguments[0];
	var jmzlxDm = arguments[1];
	var jmmj = arguments[2];
	var jmed = arguments[3];
	var jmsl = arguments[4];
	var jmfd = arguments[5];
	var jmxzDm = arguments[6];

	var jmjsyj = jmmj / 12;
	var jmynse = jmmj * dwse / 12;
	var yjmsje1 = jmynse;

	if (jmzlxDm == '01') {
		if (jmed > 0) {
			yjmsje1 = jmed > jmynse ? jmynse : jmed;
		} else if (jmsl > 0 && dwse > jmsl) {
			yjmsje1 = jmjsyj * (dwse - jmsl);
		} else if (jmfd > 0 && jmfd < 1) {
			yjmsje1 = jmjsyj * jmfd * dwse;
		}
	}

	var swjgDm = this.formData.sbInit9106100100443.initData.nsrjbxx.swjgDm

	// 是否对0010019906减免性质有特殊需求，默认为需要特殊处理
	// 传税务机关代码前三位或前三位中后两位，传值为不需特殊处理;可传多个，用英文“,”号隔开
	var dqSwjg = arguments[7] ? arguments[7].split(",") : new Array();
	var isTs = true;
	if (dqSwjg.length > 0) {
		for (var i = 0; i < dqSwjg.length; i++) {
			if (swjgDm.indexOf(dqSwjg[i]) == 0
					|| swjgDm.indexOf(dqSwjg[i]) == 1) {
				isTs = false;
				break;
			}
		}
	}

	// 特殊减免性质代码
	if ("0010019906" == jmxzDm && isTs) {
		var yxqq = this.formData.editYsmxxx.editData.yxqq;
		var yxqz = this.formData.editYsmxxx.editData.yxqz;
		// 需要备案的减免性质
		var hyjmxxx = this.formData.editYsmxxx.tddjxx.tddj.hyjmxx.hyjmxxx;
		// 排序，有多个备案时，取有效期早的有交集的
		for (var i = 0; i < hyjmxxx.length - 1; i++) {
			for (var j = 0; j < hyjmxxx.length - 1 - i; j++) {
				if (hyjmxxx[j].yxqq.substring(0, 10) > hyjmxxx[j + 1].yxqq
						.substring(0, 10)) {
					var temp = hyjmxxx[j];
					hyjmxxx[j] = hyjmxxx[j + 1];
					hyjmxxx[j + 1] = temp;
				}
			}
		}
		// 排序完后看是否有交集
		var isTrue = true;
		for (var i = 0; i < hyjmxxx.length; i++) {
			var hyjmq = hyjmxxx[i].yxqq.substring(0, 10);
			var hyjmz = hyjmxxx[i].yxqz.substring(0, 10);

			isTrue = yxqq >= hyjmq && yxqq <= hyjmz;
			isTrue = isTrue ? isTrue : yxqq <= hyjmq && yxqz >= hyjmz;
			isTrue = isTrue ? isTrue : yxqz >= hyjmq && yxqz <= hyjmz;
			isTrue = isTrue ? isTrue : yxqq >= hyjmq && yxqz <= hyjmz;

			if (isTrue) {
				// 减免面积*土地等级税率/12*减免幅度
				jmfd = this.formData.editYsmxxx.tddjxx.tddj.hyjmxx.hyjmxxx[i].jmfd;
				yjmsje1 = jmmj * (dwse / 12) * jmfd;
				break;
			}
		}
		if (!isTrue) {
			yjmsje1 = 0.00;
		}
	}
	return yjmsje1;
}

/**
 * 校验一个数值的长度，整数位保留多少位，小数位保留多少位, num： 需要检验的数值， intDigits ：整数位的位数 decDigits ：小数位的位数
 *
 */
function decimalNum(num, intDigits, decDigits) {
	if (num == null || num == '') {
		return true;
	}
	
	if(isNaN(num)){
		return false;
	}
 var numStr=num.toString();
	if(numStr.indexOf('E') > -1 || numStr.indexOf('e') > -1){
	   var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
	   var result = numStr.match(reg);
        var b = result[1];
        var c = result[2];
        if(c.indexOf('-') > -1){
        var d=c.split("-");
       if (Number(d[1])>decDigits){
    		return false;
       }
        }else{
        	if(Number(c[2])+1>intDigits){
        		return false;
        	}
       if(b.indexOf('.') > -1){
    	   var e=c.split(".");
    	   if(e[1].length-Number(c[2])>decDigits){
    		   return false;
    	   }
       } 	
        }
	}


	if (intDigits == null || intDigits == '') {
		return true;
	}
	if (decDigits == null || decDigits == '') {
		decDigits = 0;
	}
	num = num.toString();
	if (num.indexOf(".") > -1) {
		var numArr = num.split(".");
		if (numArr != null && numArr.length == 2) {
			if (numArr[0]==""||numArr[1]==""||numArr[0].length > intDigits || numArr[1].length > decDigits) {
				return false;
			}
			return /^(-)?\d{1,30}$/.test(numArr[0])&&/\d{1,30}/.test(numArr[1]);
		}
	} else {
		if (num.length > intDigits) {
			return false;
		}
	}
	return true;
}

/**
 * 比较房产税从租应税明细信息减免租金收入合计
 *
 * cjczmxbz 从价从租标记 jmszjsr 减免税租金收入
 */
function jsFcssbCzjmszjsrhj() {
	var cjczmxbz = arguments[0];
	var sbzjsr = arguments[1];

	var jmszjsrhj = 0.00;
	if (cjczmxbz == 'cz') {
		var jmxxlb = this.formData.fymxxx.jmxx.jmxxList.jmxxListlb;
		for (var i = 0; i < jmxxlb.length; i++) {
			jmszjsrhj += jmxxlb[i].jmszjsr;
		}
		return jmszjsrhj <= sbzjsr;
	}
	return true;
}

/**
 * 房产税——变更时间计算出属期后的校验
 */
function changeSqValid() {
	var rtnData = {};
	rtnData.isTrue = true;
	rtnData.isYxqq = true;
	rtnData.yxqq = "";
	rtnData.yxqz = "";
	var cjczmxbz = arguments[0];
	var syuuid = arguments[1];
	var sqQ = arguments[2];
	var sqZ = arguments[3];

	var rtnFlag = true;

	if (cjczmxbz == 'cj' && !$.isEmptyObject(syuuid)) {
		if ($.isEmptyObject(sqQ)) {
			sqQ = this.formData.fymxxx.editFymxxx.cjFymx.yxqq;
		}
		if (sqQ > sqZ) {
			rtnData.isYxqq = false;
			return rtnData;
		}
		var cjjzsymxbGridlb = this.formData.fymxxx.fcssyxxcjb.cjjzsymxbGrid.cjjzsymxbGridlb;
		for (var i = 0; i < cjjzsymxbGridlb.length; i++) {
			if (syuuid != cjjzsymxbGridlb[i].cjsyuuid
					&& cjjzsymxbGridlb[i].yxqz < sqZ) {
				if ($.isEmptyObject(cjjzsymxbGridlb[i].yxqq)
						&& $.isEmptyObject(cjjzsymxbGridlb[i].yxqz)) {
					rtnData.isTrue = true;
				} else {
					rtnFlag = sqQ > cjjzsymxbGridlb[i].yxqz;
					rtnData.yxqq = sqQ;
					rtnData.isTrue = rtnFlag;
				}
			}
		}
	} else if (cjczmxbz == 'cz') {
		if ($.isEmptyObject(sqQ)) {
			sqQ = this.formData.fymxxx.editFymxxx.czFymx.sbzjsszlqq;
		}
		// var czjzsymxbGridlb =
		// this.formData.fymxxx.fcssyxxcjb.czjzsymxbGrid.czjzsymxbGridlb;
		// for (var i = 0; i < czjzsymxbGridlb.length; i++){
		// if (syuuid==czjzsymxbGridlb[i].czsyuuid){
		// rtnFlag = sqQ >= czjzsymxbGridlb[i].htydzlqq && sqQ <=
		// czjzsymxbGridlb[i].htydzlqz;
		// }
		// }
		var htydzlqq = this.formData.fymxxx.editFymxxx.czFymx.htydzlqq;
		var htydzlqz = this.formData.fymxxx.editFymxxx.czFymx.htydzlqz;
		if ($.isEmptyObject(htydzlqq) && $.isEmptyObject(htydzlqz)) {
			rtnData.isTrue = true;
		} else {
			rtnFlag = sqQ >= htydzlqq && sqQ <= htydzlqz;
			rtnData.isTrue = rtnFlag;
		}
	}

	return rtnData;
}

/**
 * 校验所属期起是否是月初第一天，所属起止是否是月末最后一天
 *
 * jsbz 校验标志：01为校验月初，02为校验月末 sssq 税款所属期
 */
function firstOrLastDay() {
	var jybz = arguments[0];
	var sssq = arguments[1];
	var result = false;

	if ($.isEmptyObject(sssq)) {
		return true;
	}

	if ("01" == jybz) {
		result = "01" == sssq.split("-")[2];
	} else if ("02" == jybz) {
		var newSssq = calculateMonthLastDay(sssq);
		result = newSssq.split("-")[2] == sssq.split("-")[2];
	}
	return result;
}

/**
 * 计算指定日期月份的最后一天
 *
 * @param nowDate
 * @returns {String}
 */
function calculateMonthLastDay(nowDate) {
	var nowTime = nowDate.split("-");
	var month = parseInt(nowTime[1],10);
	var new_year = parseInt(nowTime[0],10);// 取当前的年份
	var new_month = month++;// 取下一个月的第一天，方便计算（最后一天不固定）
	// 当月前一个月的月末
	if (month > 12) {
		new_month -= 12; // 月份减
		new_year++; // 年份增
	}
	var new_date = new Date(new_year, new_month, 1); // 取当年当月中的第一天
	var lastDay = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24))
			.getDate();// 获取当月最后一天日期
	return nowTime[0] + "-" + nowTime[1] + "-" + lastDay;
}

/**
 * 中外合作及海上自营油气田资源税纳税申报的重复申报校验 zspmDm 征收品目代码 zszmDm 征收子目代码 yqtmc 油气田名称 xssxrq
 * 销售实现日期
 *
 */
function checkZwhzZyssb(zspmDm, zszmDm, yqtmc, xssxrq) {
	if (zspmDm == null || zspmDm == '') {
		return true;
	}
	if (zszmDm == null || zszmDm == '') {
		return true;
	}
	if (yqtmc == null || yqtmc == '') {
		return true;
	}
	if (xssxrq == null || xssxrq == '') {
		return true;
	}
	var ysbxxs = this.formData.qcs.initData.zwhzjhszyyqtzysInitData.ysbxx;
	if ($.isEmptyObject(ysbxxs)) {
		return true;
	}
	for (var i = 0; i < ysbxxs.length; i++) {
		if (zspmDm == ysbxxs[i].zspmDm && zszmDm == ysbxxs[i].zszmDm
				&& yqtmc == ysbxxs[i].yqtMc && xssxrq == ysbxxs[i].xssxrq) {
			return false;
		}
	}
	return true;
}

/**
 * 判断某个字符串开头是否包含某个字符串 currStr 需要判断的字符串 containStr 是否被包含的字符串
 * 说明，由于子公式中不知道怎么使用节点的方式使用indexOf，所以直接写一个自定义函数 作者 xuyaosen
 */
function startWidthStr(currStr, containStr) {
	if (currStr == null || currStr == "") {
		return false;
	}
	if (containStr == null || containStr == "") {
		return false;
	}
	if (currStr.indexOf(containStr) == 0) {
		return true;
	}
	return false;
}

/**
 * 获取字符串的某段字符串 startNum 截取字符串开始位置 endNum 截取字符串结束位置 strs 所要截取的字符串
 *
 */
function getStrs(startNum, endNum, strs) {
	if (endNum == "") {
		return strs.substring(startNum);
	} else {
		return strs.substring(startNum, endNum);
	}
}

var msgArr = [];
var msgIndex = "";
var height = 0;
var merge = false;
/**
 * 根据判断条件，弹出对话框提示信息，提示之后不影响后续的操作 flag 判断条件的结果 tipsMsg 提示的信息 tipsType
 * =error：失败的提示，=success：成功的提示，否则普通的提示, 作者 xuyaosen
 */
function tipsMsg(flag, tipsMsg, tipsType,_width,_height,_merge) {
	if (flag == null || flag == "") {
		return;
	}
	if (typeof isJmsb === "function" && isJmsb()) {
		return;		
	}
	if(!(_width && _height)){
		_width = 400;
		_height = 220;
	}
	if(tipsMsg){
		tipsMsg = tipsMsg.replace(/class-/,"class=");
	}
	if (flag) {
        /**
		 * 提示语去重,一样的提示语不进行合并弹框.
         */
		if(msgArr.indexOf(tipsMsg) == -1){
            msgArr.push(tipsMsg);
		}else{
			return;
		}
		/*if ("error" == tipsType) {
			Message.errorInfo({
				title : "提示",
				height : _height,
				width : _width,
				message : tipsMsg
			});

		} else if ("success" == tipsType) {
			Message.succeedInfo({
				title : "提示",
				height : _height,
				width : _width,
				message : tipsMsg
			});
		} else {*/
			/*Message.alert({
				title : "提示",
				height : _height,
				width : _width,
				message : tipsMsg
			});*/
			merge |= _merge;
			if(merge){
				tipsMsg = generMsgArray(msgArr);
				layer.close(msgIndex);
				height = MAX(height,_height);
				_height = height;
			}
			msgIndex = layer.open({
				  type: 1 //Page层类型
				  ,area: [_width+'px', _height+'px']
				  ,title: '提示'
				  ,shade: false //遮罩透明度
				  ,maxmin: false //允许全屏最小化
				  ,closeBtn: 0
				  ,anim: -1 //0-6的动画形式，-1不开启
				  ,content: tipsMsg
				  ,btn:['确认']
				  ,yes : function(index){
				      layer.close(index);
				      msgArr = [];
				  }
			});
		/*}*/
	}

}

var titleSet = ["零","一","二","三","四","五","六","七","八","九","十"];
function generMsgArray(arr){
	var ret = "";
	for(var i = 0;i < arr.length;i++){
		if(arr[i].indexOf("class=\"red\"") > -1){
			ret += "<span class=\"red\">"+titleSet[i+1]+"、    </span>";
		}else{
			ret += titleSet[i+1]+"、    ";
		}
		ret += arr[i];
		if(i != arr.length -1){
			ret += "<br>";
		}
	}
	return ret;
}

/**
 * 根据月份判断是否是季初
 */
function isJcByMonth(date) {

	var month = date.split("-")[1];
	var day = date.split("-")[2];
	if (month == "10" && day == "01") {
		return true;
	} else if (month == "07" && day == "01") {
		return true;
	} else if (month == "04" && day == "01") {
		return true;
	} else if (month == "01" && day == "01") {
		return true;
	}
	return false;

}
/**
 * 判断是否是季末
 */
function isJmByMonth(jmDate) {
	var jmMonth = jmDate.split("-")[1];
	if (jmMonth == "12" || jmMonth == "09" || jmMonth == "06"
			|| jmMonth == "03") {
		return DATE_CHECK_IS_MONTH_LAST_DAY(jmDate)
	} else {
		return false;
	}
}

/**
 * 判断某个字符串是否包含某个字符串 currStr 需要判断的字符串 containStr 是否被包含的字符串
 * 说明，由于子公式中不知道怎么使用节点的方式使用indexOf，所以直接写一个自定义函数 作者 xuyaosen
 */
function isIndexOfStr(currStr, containStr) {
	if (currStr == null || currStr == "") {
		return false;
	}
	if (containStr == null || containStr == "") {
		return false;
	}
	if (currStr.indexOf(containStr) != -1) {
		return true;
	}
	return false;
}
/**
 * 判断某个字符串只能由数字和字母的大写组成
 *
 * @param str
 * @returns
 */
function checkisupperandnumber(str) {
	return /^[0-9A-Z]+$/.test(str);
}
/**
 * 判断某个字符串只能由数字和字母的大写组成
 *
 * @param str
 * @returns
 */
function regx(r) {
	return /^[0-9A-Z]+$/.test(r);
}
/**
 * 判某个字符串为数字和大写字母的组合，且不能全为数字或全为大写字母
 * @param str
 * @returns
 * */
function checkissupperandnumbergai(str){
	return /^(?=.*?[0-9]+)(?=.*?[A-Z])[0-9A-Z]+$/.test(str);
}
/**
 * 判断某个字符串只能由数字和字母的大写汉字组成
 *
 * @param str
 * @param bz 是否需要三种字符都包含标志，N为不需要，否则为需要全部包含
 * @returns
 */
function checkisupperandnumberandzw(r,bz) {
	var count = 0;
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	for (var i = 0; i < r.length; i++) {
		if (/[\u4e00-\u9fa5]+/.test(r.charAt(i))) {
			count1 = count + 1;
			count = count + 1;
			continue;
		}
		if (/[A-Z]+/.test(r.charAt(i))) {
			count2 = count2 + 1;
			count = count + 1;
			continue;
		}
		if (/[0-9]+/.test(r.charAt(i))) {
			count3 = count3 + 1;
			count = count + 1;
			continue;
		} else {
			return false;
		}
	}
	if(bz=="N"){
		return true;
	}else if (count1 != 0 && count2 != 0 && count3 != 0 && count >= r.length) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断某个字符串应由多少个字节组成
 *
 * @param str
 * @returns
 */
function zjlen(r) {
	var count=0;
	for(var i=0;i<r.length;i++){
		if(/[\u4e00-\u9fa5]+/.test(r.charAt(i))){
			count=count+3;
		}else{
			count++;
		}
	}
	return count;
}

/**
 * 判断某个字符串可以由数字或字母的大小写或汉字组成
 *
 * @param str
 * @returns
 */
function checkywornumberorzw(r) {
	var count = 0;
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	for (var i = 0; i < r.length; i++) {
		if (/[\u4e00-\u9fa5]+/.test(r.charAt(i))) {
			count1 = count + 1;
			count = count + 1;
			continue;
		}
		if ((/[a-z]+/.test(r.charAt(i))) || (/[A-Z]+/.test(r.charAt(i)))) {
			count2 = count2 + 1;
			count = count + 1;
			continue;
		}
		if (/[0-9]+/.test(r.charAt(i))) {
			count3 = count3 + 1;
			count = count + 1;
			continue;
		} else {
			return false;
		}
	}
	if (count1 != 0 || count2 != 0 || count3 != 0 && count >= r.length) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断某个字符串只能由汉字或英文字母组成
 *
 * @param str
 * @returns cs=1校验中文名（如：陈大卫、大卫·陈、大卫·陈·弗尼斯） 其它则校验英文名（dav nik、isi hu jia）
 */
function checkStrIsChineseOrLetter(cs, str) {
	if (cs == 1) {
		if (/^[\u4e00-\u9fa5\s·]+$/.test(str)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (/^([A-Za-z]+\s?)*[A-Za-z]$/.test(str)) {
			return true;
		} else {
			return false;
		}
	}

}
function STRING_CHECK_IS_NUMBER(str){
	if(/^[0-9].*$/.test(str)){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断某个字符是否有中文和数字组成
 */
function checkzwandnumber(r) {
	var count = 0;
	var count1 = 0;
	var count3 = 0;
	for (var i = 0; i < r.length; i++) {
		if (/[\u4e00-\u9fa5]+/.test(r.charAt(i))) {
			count1 = count + 1;
			count = count + 1;
			continue;
		}
		if (/[0-9]+/.test(r.charAt(i))) {
			count3 = count3 + 1;
			count = count + 1;
			continue;
		} else {
			return false;
		}
	}
	if (count1 != 0 && count3 != 0 && count >= r.length) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断某个字符是否有字母和数字组成
 */
function checkywandnumber(r) {
	var count = 0;
	var count1 = 0;
	var count3 = 0;
	for (var i = 0; i < r.length; i++) {
		if ((/[a-z]+/.test(r.charAt(i))) || (/[A-Z]+/.test(r.charAt(i)))) {
			count1 = count + 1;
			count = count + 1;
			continue;
		}
		if (/[0-9]+/.test(r.charAt(i))) {
			count3 = count3 + 1;
			count = count + 1;
			continue;
		} else {
			return false;
		}
	}
	if (count1 != 0 && count3 != 0 && count >= r.length) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断某个字符是否有字母或数字组成
 */
function checkywornumber(r) {
	var count = 0;
	var count1 = 0;
	var count3 = 0;
	for (var i = 0; i < r.length; i++) {
		if ((/[a-z]+/.test(r.charAt(i))) || (/[A-Z]+/.test(r.charAt(i)))) {
			count1 = count + 1;
			count = count + 1;
			continue;
		}
		if (/[0-9]+/.test(r.charAt(i))) {
			count3 = count3 + 1;
			count = count + 1;
			continue;
		} else {
			return false;
		}
	}
	if (count1 != 0 || count3 != 0 && count >= r.length) {
		return true;
	} else {
		return false;
	}
}

/**
 * 校验输入内容是否包含数字和字母，无中文，无特殊字符
 * @param inputValue
 * @returns {*|boolean}
 */
function  checkInputWordAndNumber(inputValue) {
    return (/^[A-Za-z0-9]+$/).test(inputValue);
}


/**
 * 城镇土地使用税，应税土地面积与宗地面积的校验
 */
function checkCztdsysZdmj2Ysmj() {
	// 税源uuid
	var syuuid = arguments[0];
	// 应税土地面积
	var ystdmj = arguments[1];
	// 公式标志：2为校验；1为计算
	var gsbz = arguments[2];
	// 数据模型
	var data = this.formData;
	// 税源数组
	var syDataArr = data.sbInit9106100100442.sbcxstdsyxxcjbvoList.sbcxstdsyxxcjbvoListlb;

	for (var i = 0; i < syDataArr.length; i++) {
		if (syuuid == syDataArr[i].syuuid) {
			if ("1" == gsbz) {
				return syDataArr[i].zytdmj1;
			}
			if (ystdmj <= syDataArr[i].zytdmj1) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 计算指定日期后一个月的第一天
 */
function GET_DATE_NEXT_MONTH_FIRSTDAY() {
	var nowDate = arguments[0];

	var nowTime = nowDate.split("-");
	//IE8下面parseInt默认会把“08”、“09”当成八进制，但是又发现不是合法的八进制，最后就抛出了0
	var month = parseInt(nowTime[1],10);
	var new_year = parseInt(nowTime[0],10);
	var new_month = month + 1;
	// 当月前一个月的月末
	if (month == 12) {
		new_month = 1; // 月份减
		new_year++; // 年份增
	}
	if (new_month < 10) {
		new_month = "0" + new_month;
	}
	return new_year + "-" + new_month + "-01";
}
function strSubstring(str, num) {
	if (str != null && str != '' && num != null && num != '') {
		return str.substring(0, num);
	} else {
		return str;
	}
}

/**
 * ssjmxzDm 下拉所选减免性质代码 ssjmxzDm_ba 作为过滤条件的减免性质代码
 *
 * @returns {Boolean}
 */
function CHECK_ISBA_CZTD() {
	var ssjmxzDm = arguments[0];

	// 数据模型
	var data = this.formData;
	// 是否对0010019906减免性质有特殊需求，默认为需要特殊处理
	// 传税务机关代码前三位或前三位中后两位，传值为不需特殊处理;可传多个，用英文“,”号隔开
	var swjgDm = data.sbInit9106100100443.initData.nsrjbxx.swjgDm;
	var dqSwjg = arguments[2] ? arguments[2].split(",") : new Array();
	if (dqSwjg.length > 0) {
		for (var i = 0; i < dqSwjg.length; i++) {
			if (swjgDm.indexOf(dqSwjg[i]) == 0
					|| swjgDm.indexOf(dqSwjg[i]) == 1) {
				return true;
			}
		}
	}

	var ssjmxzDm_ba = arguments[1].split(",");
	for (var i = 0; i < ssjmxzDm_ba.length; i++) {
		if (ssjmxzDm == ssjmxzDm_ba[i]) {
			var ssjmxzDmArr = data.editYsmxxx.tddjxx.tddj.hyjmxx.hyjmxxx;
			for (var i = 0; i < ssjmxzDmArr.length; i++) {
				if (ssjmxzDmArr[i].ssjmxzhzDm.match(ssjmxzDm)) {
					return true;
				}
			}
			return false;
		}
	}

	return true;
}

/**
 * 校验减免性质有效期与应税信息有效期是否有交集，没有不可选当前减免性质(针对房产税)
 *
 */
function FCSSB_CHECK_JMXZDM_YXQ() {
	var rtnData = {};
	rtnData.isTrue = false;
	var cjczbz = arguments[0];// 从价从租标志
	var ssjmxzDm = arguments[1];// 减免性质代码
	if ($.isEmptyObject(ssjmxzDm)) {
		rtnData.yxqq = "";
		rtnData.yxqz = "";
		rtnData.isTrue = true;
		//优化版把有效期起止合并到一个格子，所以需要返回yxqqz；
		rtnData.yxqqz = "";
		return rtnData;
	}

	var data = this.formData;
	var yxqq = "";
	var yxqz = "";

	if ("cj" == cjczbz) {
		yxqq = data.fymxxx.editFymxxx.cjFymx.yxqq;
		yxqz = data.fymxxx.editFymxxx.cjFymx.yxqz;
	}
	if ("cz" == cjczbz) {
		yxqq = data.fymxxx.editFymxxx.czFymx.sbzjsszlqq;
		yxqz = data.fymxxx.editFymxxx.czFymx.sbzjsszlqz;
	}
	if ($.isEmptyObject(yxqq) || $.isEmptyObject(yxqz)) {
		rtnData.yxqq = "";
		rtnData.yxqz = "";
		rtnData.isTrue = true;
		//优化版把有效期起止合并到一个格子，所以需要返回yxqqz；
		rtnData.yxqqz = "";
		return rtnData;
	}

	if ($.isEmptyObject(this.formCT.jmxzCT[ssjmxzDm])) {
		throw "FCSSB_CHECK_JMXZDM_YXQ Wrong Data:null Data!";
	}

	var jmyxqq = this.formCT.jmxzCT[ssjmxzDm].item.yxqq;
	var jmyxqz = this.formCT.jmxzCT[ssjmxzDm].item.yxqz;

	if (jmyxqq < yxqz && jmyxqz > yxqq) {
		rtnData.yxqq = jmyxqq < yxqq ? yxqq : jmyxqq;
		rtnData.yxqz = jmyxqz > yxqz ? yxqz : jmyxqz;
		rtnData.isTrue = true;
		//优化版把有效期起止合并到一个格子，所以需要返回yxqqz；
		var yxqqz = yxqq + " - " + yxqz;
		rtnData.yxqqz = yxqqz;
		return rtnData;
	}

	return rtnData;
}

/**
 * 校验减免性质有效期与应税信息有效期是否有交集，没有不可选当前减免性质(针对城镇土地使用税)
 *
 */
function CZTDSYS_CHECK_JMXZDM_YXQ() {
	var rtnData = {};
	rtnData.yxqq = "";
	rtnData.yxqz = "";
	rtnData.isTrue = false;
	var ssjmxzDm = arguments[0];// 减免性质代码
	if ($.isEmptyObject(ssjmxzDm)) {
		rtnData.yxqq = "";
		rtnData.yxqz = "";
		rtnData.isTrue = true;
		return rtnData;
	}
	var data = this.formData;
	// 是否对0010019906减免性质有特殊需求，默认为需要特殊处理
	// 传税务机关代码前三位或前三位中后两位，传值为不需特殊处理;可传多个，用英文“,”号隔开
	var swjgDm = data.sbInit9106100100443.initData.nsrjbxx.swjgDm;
	var dqSwjg = arguments[1] ? arguments[1].split(",") : new Array();
	var isTs = true;
	if (dqSwjg.length > 0) {
		for (var i = 0; i < dqSwjg.length; i++) {
			if (swjgDm.indexOf(dqSwjg[i]) == 0
					|| swjgDm.indexOf(dqSwjg[i]) == 1) {
				isTs = false;
				break;
			}
		}
	}

	var yxqq = data.editYsmxxx.editData.yxqq;
	var yxqz = data.editYsmxxx.editData.yxqz;

	var yxqArr = new Array();
	if ("0010019906" == ssjmxzDm && isTs) {
		// 有多个备案信息
		var hyjmxxx = this.formData.editYsmxxx.tddjxx.tddj.hyjmxx.hyjmxxx;
		// 取备案的有效期
		for (var i = 0; i < hyjmxxx.length; i++) {
			var tempYxq = {};
			var baYxqq = hyjmxxx[i].yxqq;
			var baYxqz = hyjmxxx[i].yxqz;

			if (!$.isEmptyObject(baYxqq) && !$.isEmptyObject(baYxqz)) {
				baYxqq = baYxqq.substring(0, 10);
				baYxqz = baYxqz.substring(0, 10);
				tempYxq.yxqz = baYxqz;
				tempYxq.yxqq = baYxqq;
				yxqArr.push(tempYxq);
			}
		}
	}

	if (yxqArr.length == 0 && ($.isEmptyObject(yxqq) || $.isEmptyObject(yxqz))) {
		rtnData.yxqq = "";
		rtnData.yxqz = "";
		rtnData.isTrue = true;
		return rtnData;
	}

	// 特殊减免性质代码
	if (yxqArr.length > 0) {// 取备案的有效期，可能有多个减免备案
		for (var i = 0; i < yxqArr.length; i++) {
			var jmyxqq = yxqArr[i].yxqq;
			var jmyxqz = yxqArr[i].yxqz;
			// 是否有交集
			if (jmyxqq < yxqz && jmyxqz > yxqq) {
				// 有交集，第一次直接取
				if ($.isEmptyObject(rtnData.yxqq)
						&& $.isEmptyObject(rtnData.yxqz)) {
					rtnData.yxqq = jmyxqq < yxqq ? yxqq : jmyxqq;
					rtnData.yxqz = jmyxqz > yxqz ? yxqz : jmyxqz;
					rtnData.isTrue = true;
				} else {// 第二次，取完后跟上一次的比较，取较早的交集
					var changBz = (jmyxqq < yxqq ? yxqq : jmyxqq) < rtnData.yxqq;
					rtnData.yxqq = changBz ? (jmyxqq < yxqq ? yxqq : jmyxqq)
							: rtnData.yxqq;
					rtnData.yxqz = changBz ? (jmyxqz > yxqz ? yxqz : jmyxqz)
							: rtnData.yxqz;
					rtnData.isTrue = true;
				}
			}
		}
		return rtnData;
	} else if(this.formCT.jmxzCT[ssjmxzDm]!=null && this.formCT.jmxzCT[ssjmxzDm]!=undefined
			&& this.formCT.jmxzCT[ssjmxzDm].item!=null && this.formCT.jmxzCT[ssjmxzDm].item!=undefined){// 不用取备案的有效期
		var jmyxqq = this.formCT.jmxzCT[ssjmxzDm].item.yxqq;
		var jmyxqz = this.formCT.jmxzCT[ssjmxzDm].item.yxqz;
		if (jmyxqq < yxqz && jmyxqz > yxqq) {
			rtnData.yxqq = jmyxqq < yxqq ? yxqq : jmyxqq;
			rtnData.yxqz = jmyxqz > yxqz ? yxqz : jmyxqz;
			rtnData.isTrue = true;
			return rtnData;
		}
	}

	return rtnData;
}

/**
 * 城镇土地使用税，注销宗地校验：转出时间与应税信息的有效期起止
 */
function CZTDSYS_CHECK_TDCZSJ_YSYXQ() {
	var tdzcsj = arguments[0];// 土地转出时间

	var data = this.formData;
	var ysxxlb = data.ysmxxx.ysxxByZd.ysxx.ysxxlb;

	if ($.isEmptyObject(ysxxlb) || ysxxlb.length == 0) {
		throw "CZTDSYS_CHECK_TDCZSJ_YSYXQ Wrong Data:null Data!";
	}
	var ysxx_yxq = {};
	ysxx_yxq.yxqq = "";
	ysxx_yxq.yxqz = "";
	ysxx_yxq.isTrue = true;
	for (var i = 0; i < ysxxlb.length; i++) {
		if (!$.isEmptyObject(ysxxlb[i].syuuid)) {
			ysxx_yxq.yxqq = ysxx_yxq.yxqq ? (ysxx_yxq.yxqq < ysxxlb[i].yxqq ? ysxx_yxq.yxqq
					: ysxxlb[i].yxqq)
					: ysxxlb[i].yxqq;
			ysxx_yxq.yxqz = ysxx_yxq.yxqz ? (ysxx_yxq.yxqz > ysxxlb[i].yxqz ? ysxx_yxq.yxqz
					: ysxxlb[i].yxqz)
					: ysxxlb[i].yxqz;
		}
	}
	if ($.isEmptyObject(ysxx_yxq.yxqq) || $.isEmptyObject(ysxx_yxq.yxqz)) {
		return ysxx_yxq;
	} else {
		ysxx_yxq.isTrue = (ysxx_yxq.yxqq <= tdzcsj && tdzcsj <= ysxx_yxq.yxqz);
		return ysxx_yxq;
	}

	return ysxx_yxq;
}
/**
 * JSONE-2345 修改公式 保留原有公式 以防其他业务调用
 * @returns {Boolean}
 */
function FCSSB_CHECK_FCJSYZ() {
	var tdzcsj = arguments[0];// 房产计税原值

	var jmsfcyzhj = 0.00;
	var jmxxlb = this.formData.fymxxx.jmxx.jmxxList.jmxxListlb;
	for (var i = 0; i < jmxxlb.length; i++) {
		jmsfcyzhj += jmxxlb[i].jmsfcyz;
	}

	return jmsfcyzhj <= tdzcsj;
}
/**
 * JSONE-2345 修改公式 保留原有公式 以防其他业务调用
 * @returns {Boolean}
 */
function FCSSB_CHECK_FCJSYZ01() {
	var tdzcsj = arguments[0];// 房产计税原值
	var i=arguments[2];
	var jmsfcyzhj = 0.00;
	var jmxxlb = this.formData.fymxxx.jmxx.jmxxList.jmxxListlb;
		jmsfcyzhj += jmxxlb[i].jmsfcyz;
	return jmsfcyzhj <= tdzcsj;
}

/**
 * 城镇土地使用税有效期起与土地取得时间校验
 *
 * @returns
 */
function CZTDSYS_CHECK_YXQQ_TDQDSJ() {
	var yxqq = arguments[0];// 有效期起
	var syuuid = arguments[1];// 税源uuid

	var rtnData = {};
	rtnData.tdqdsj = "";
	rtnData.isTrue = true;
	var tdsyxxlb = this.formData.sbInit9106100100442.sbcxstdsyxxcjbvoList.sbcxstdsyxxcjbvoListlb;
	for (var i = 0; i < tdsyxxlb.length; i++) {
		if (syuuid == tdsyxxlb[i].syuuid) {
			rtnData.tdqdsj = tdsyxxlb[i].csqdsj;
		}
	}

	if ($.isEmptyObject(rtnData.tdqdsj)) {
		return rtnData;
	}

	rtnData.tdqdsj = rtnData.tdqdsj.substring(0, 10);
	rtnData.isTrue = yxqq >= rtnData.tdqdsj;
	return rtnData;
}

/**
 * 房产税纳税申报申报租金所属租赁期起校验
 *
 * @returns
 */
function FCSSB_CHECK_SBZJSSZLQQ() {
	var rtnData = {};
	rtnData.isTrue = true;
	rtnData.sbzjsszlqq = "";
	rtnData.sbzjsszlqz = "";
	var cjczbz = arguments[0];// 从价从租标志
	var syuuid = arguments[1];// 税源uuid
	var sbzjsszlqq = arguments[2];// 申报租金所属租赁期起
	var sbzjsszlqz = arguments[3];// 申报租金所属租赁期止
	if (cjczbz == "cz" && !$.isEmptyObject(syuuid)) {
		var czjzsymxbGridlb = this.formData.fymxxx.fcssyxxcjb.czjzsymxbGrid.czjzsymxbGridlb;
		for (var i = 0; i < czjzsymxbGridlb.length; i++) {
			if (syuuid == czjzsymxbGridlb[i].czsyuuid) {
				var isTrue = sbzjsszlqq >= czjzsymxbGridlb[i].sbzjsszlqq
						&& sbzjsszlqq <= czjzsymxbGridlb[i].sbzjsszlqz;
				rtnData.isTrue = isTrue;
				rtnData.sbzjsszlqq = czjzsymxbGridlb[i].sbzjsszlqq;
				rtnData.sbzjsszlqz = czjzsymxbGridlb[i].sbzjsszlqz;
			}
		}
	}
	return rtnData;
}

/**
 * 房产税纳税申报申报租金所属租赁期起是否存在交叉校验
 *
 * @returns
 */
function FCSSB_CHECK_SBZJSSZLQQ_CZ() {
	var rtnData = {};
	rtnData.isTrue = true;
	rtnData.sbzjsszlqq = "";
	rtnData.sbzjsszlqz = "";
	var cjczbz = arguments[0];// 从价从租标志
	var syuuid = arguments[1];// 税源uuid
	var sbzjsszlqq = arguments[2];// 申报租金所属租赁期起
	var sbzjsszlqz = arguments[3];// 申报租金所属租赁期止

	//新增从租信息时，校验申报租金所属租赁期起止是否与现有的从租信息存在交集
	var bgsj = this.formData.fymxxx.editFymxxx.czFymx.bgsj;
	if (cjczbz == "cz" && $.isEmptyObject(bgsj) && $.isEmptyObject(syuuid)) {
		var czjzsymxbGridlb = this.formData.fymxxx.fcssyxxcjb.czjzsymxbGrid.czjzsymxbGridlb;
		if (czjzsymxbGridlb.length > 0 && !$.isEmptyObject(czjzsymxbGridlb[0].czsyuuid)){
			for (var i = 0; i < czjzsymxbGridlb.length; i++) {
				if (sbzjsszlqq >= czjzsymxbGridlb[i].sbzjsszlqq && sbzjsszlqq <= czjzsymxbGridlb[i].sbzjsszlqz) {
					rtnData.isTrue = false;
				} else if (sbzjsszlqz >= czjzsymxbGridlb[i].sbzjsszlqq && sbzjsszlqz <= czjzsymxbGridlb[i].sbzjsszlqz) {
					rtnData.isTrue = false;
				} else if (sbzjsszlqq <= czjzsymxbGridlb[i].sbzjsszlqq && sbzjsszlqz >= czjzsymxbGridlb[i].sbzjsszlqz) {
					rtnData.isTrue = false;
				}else {
					rtnData.isTrue = true;
				}
				rtnData.sbzjsszlqq = czjzsymxbGridlb[i].sbzjsszlqq;
				rtnData.sbzjsszlqz = czjzsymxbGridlb[i].sbzjsszlqz;
				if (!rtnData.isTrue) {
					return rtnData;
				}
			}
		}
	}
	return rtnData;
}

/**
 * 房产税纳税申报采集，减免性质代码从有到无，减免税原值自动置0，减免税租金收入值自动置0；从无到有或者有变更为其他，返回原值
 *
 * @returns
 */
function FCSSB_JMXZDM_JMSFCYZ() {
	var cjczbz = arguments[0];// 从价从租标志
	var jmxzdm = arguments[1];// 减免性质代码

	if ($.isEmptyObject(jmxzdm)) {
		return 0.00;
	}

	var rtnData = 0.00;
	var jmxxListlb = this.formData.fymxxx.jmxx.jmxxList.jmxxListlb;
	if (cjczbz == "cj") {
		for (var i = 0; i < jmxxListlb.length; i++) {
			if (jmxzdm == jmxxListlb[i].ssjmxzDm) {
				rtnData = jmxxListlb[i].jmsfcyz;
			}
		}
	}
	if (cjczbz == "cz") {
		for (var i = 0; i < jmxxListlb.length; i++) {
			if (jmxzdm == jmxxListlb[i].ssjmxzDm) {
				rtnData = jmxxListlb[i].jmszjsr;
			}
		}
	}
	return rtnData;
}

/**
 * 变更时间不能早于上个税款所属期的最后一天
 *
 * @returns {Boolean}
 */
function CHECK_BGSJ_SSSQ() {
	var rtnData = {};
	rtnData.isTrue = true;
	rtnData.sssqZ = "";

	var bgsj = arguments[0];// 变更时间
	var nowDate = getCurDate();// 获取当前日期
	var dateArr = nowDate.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	
	if(bgsj != "" && bgsj != null && bgsj != undefined){
		if (month >= "01" && month <= "03") {// 当前时间在01月到03月
			rtnData.isTrue = (bgsj >= ((parseInt(year) - 1) + "-09-30"));
			rtnData.sssqZ = ((parseInt(year) - 1) + "年09月30日");
		}
		if (month >= "04" && month <= "06") {// 当前时间在04月到06月
			rtnData.isTrue = (bgsj >= ((parseInt(year) - 1) + "-12-31"));
			rtnData.sssqZ = (year + "年12月31日");
		}
		if (month >= "07" && month <= "09") {// 当前时间在07月到09月
			rtnData.isTrue = (bgsj >= (year + "-03-31"));
			rtnData.sssqZ = (year + "年03月31日");
		}
		if (month >= "10" && month <= "12") {// 当前时间在10月到12月
			rtnData.isTrue = (bgsj >= (year + "-06-30"));
			rtnData.sssqZ = (year + "年06月30日");
		}
	}

	return rtnData;
}

/**
 * 委托代征formCTl初始化
 */
function INIT_WTDZSB_FORMCT() {
	// 目前只是zspmCT和pzzgCT为初始化而先编译公式，可能还有其他代码表问题，暂未发现
	var zspmJson = {};
	var pzzgJson = {};
	var wtdzskmxbGridlb2 = this.formData.qcs.formContent.wtdzskmxb.body.wtdzskmxbGrid2.wtdzskmxbGridlb2;
	if (!$.isEmptyObject(wtdzskmxbGridlb2)) {
		if (wtdzskmxbGridlb2.length > 0) {
			for (var i = 0; i < wtdzskmxbGridlb2.length; i++) {
				if(zspmJson[wtdzskmxbGridlb2[i].zspmDm]){
					if(wtdzskmxbGridlb2[i].zszmDm != ''){
						continue;
					}
				}
				zspmJson[wtdzskmxbGridlb2[i].zspmDm] = wtdzskmxbGridlb2[i];
			}
		}
	}
	this.formCT.zspmCT = zspmJson;
//	this.formCT.zszmCT = {};

	var pzzlxx = this.formData.qcs.formContent.swjszyb.body.swjszybGrid2.pzzlxx;
	
	if(pzzlxx!=undefined){
		var pzxxGridlb = pzzlxx.pzxxGridlb;
		if (!$.isEmptyObject(pzxxGridlb)) {
			if (pzxxGridlb.length > 0) {
				for (var i = 0; i < pzxxGridlb.length; i++) {
					pzzgJson[pzxxGridlb[i].pzzgDm] = pzxxGridlb[i];
				}
			}
		}
	}
	this.formCT.pzzgCT = pzzgJson;

	return true;
}

/**
 * 城镇土地使用税，变更时间不能早于土地取得时间检验
 */
function CHECK_BGSJ_TDQDSJ() {
	var bgsj = arguments[0];
	if ($.isEmptyObject(bgsj)) {
		return true;
	}
	var syuuid = this.formData.editYsmxxx.editData.syuuid;
	var tdxxlb = this.formData.sbInit9106100100442.sbcxstdsyxxcjbvoList.sbcxstdsyxxcjbvoListlb;
	for (var i = 0; i < tdxxlb.length; i++) {
		if (tdxxlb[i].syuuid == syuuid) {
			return bgsj >= tdxxlb[i].csqdsj.substring(0, 10);
		}
	}
	return false;
}

/**
 * 企业所得税B更正申报初始化公式有值并且可修改
 */
function calculate() {
	var qysdszsfsDm = this.formData.qcs.initData.sbQysds2008JdBsbInitData.qysdszsfsDm;
	var mainUrl = window.location.href;
	if (mainUrl.indexOf("&gzsb") != -1) {
		return "0";
	} else {
		if (qysdszsfsDm == '499') {
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.qysdsyddhndnssbbblFrom.yyjsdse = 0;
		} else {
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.qysdsyddhndnssbbblFrom.yyjsdse = ROUND(this.formData.qcs.initData.sbQysds2008JdBsbInitData.ybtsdseYyjsdse,2);
		}
	}
	return "0";
}

/**
 * 企业所得税A累计金额计算青海个性化需求
 */
function ljjejs(){
	var swjgDm=this.formData.qcs.initData.nsrjbxx.swjgDm;
	var sqyjje=this.formData.qcs.initData.qysds2015JmJdAsbInitData.sqyjje;
	var kyyjye=this.formData.qcs.initData.qysds2015JmJdAsbInitData.kyyjye;
	var yyyjje=this.formData.qcs.initData.qysds2015JmJdAsbInitData.yyyjje;
	var yjfsDm=this.formData.qcs.initData.qysds2015JmJdAsbInitData.yjfsDm;
	var zfjglb=this.formData.qcs.initData.qysds2015JmJdAsbInitData.zfjglb;
	if(swjgDm.substring(1,3)=="63"&&zfjglb!="4"&&yjfsDm=="01"){
		this.formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sjyyjsdseLj=ROUND(sqyjje+kyyjye+yyyjje,2);
	}
	return "";
}


/**
 * 企业所得税B青海国税个性化需求
 */
function qhxw(){

	var qsyf=this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.skssqq.substring(5,7);
	var jsyf=this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.skssqz.substring(5,7);
	var zsfsDm=this.formData.qcs.initData.sbQysds2008JdBsbInitData.zsfsDm;
	var swjgDm=this.formData.qcs.initData.nsrjbxx.swjgDm.substring(0,3);
	var swjghdynsdse=this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.qysdsyddhndnssbbblFrom.swjghdynsdse;
	var sfsyxxwlqy=this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.sfsyxxwlqy;
	//判断是月度还是季度
	if(jsyf-qsyf==2&&swjgDm=="163"){
		if(swjgDm=="163"&&swjghdynsdse>=12500){
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.sfsyxxwlqy="Y";
		}else{
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.sfsyxxwlqy="N";
		}
	}
	if(jsyf-qsyf==0&&swjgDm=="163"){
		if(swjgDm=="163"&&swjghdynsdse>=4166.67){
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.sfsyxxwlqy="Y";
		}else{
			this.formData.qysdshdzsSbbdxxVO.qysdshdzsyjdndsb.nsrxxFrom.sfsyxxwlqy="N";
		}
}
	return "";
}


/**
 * 正则表达式判定Url
 *
 * @param url
 * @returns {Boolean}
 */
function CHECK_URL(url) {
	// url= 协议://(ftp的登录信息)[IP|域名](:端口号)(/或?请求参数)
	var strRegex = '^((https|http|ftp)://)?'// (https或http或ftp):// 可有可无
			+ '(([\\w_!~*\'()\\.&=+$%-]+: )?[\\w_!~*\'()\\.&=+$%-]+@)?' // ftp的user@
																		// 可有可无
			+ '(([0-9]{1,3}\\.){3}[0-9]{1,3}' // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
			+ '|' // 允许IP和DOMAIN（域名）
			+ '(localhost)|' // 匹配localhost
			+ '([\\w_!~*\'()-]+\\.)*' // 域名- 至少一个[英文或数字_!~*\'()-]加上.
			+ '\\w+\\.' // 一级域名 -英文或数字 加上.
			+ '[a-zA-Z]{1,6})' // 顶级域名- 1-6位英文
			+ '(:[0-9]{1,5})?' // 端口- :80 ,1-5位数字
			+ '((/?)|' // url无参数结尾 - 斜杆或这没有
			+ '(/[\\w_!~*\'()\\.;?:@&=+$,%#-]+)+/?)$';// 请求参数结尾-
														// 英文或数字和[]内的各种字符
	var re = new RegExp(strRegex, 'i');// i不区分大小写
	// 将url做uri转码后再匹配，解除请求参数中的中文和空字符影响
	if (re.test(encodeURI(url))) {
		return (true);
	} else {
		return (false);
	}
}

/**
 * 校验数据类型
 * dataObj
 * 		需要校验的数据
 * typeBz
 * 		数据标记，
 * 		N为纯数字；
 * 		A为纯大写字母；
 * 		B为纯小写字母；
 * 		C为大写与小写混合；
 * 		D为数字与大写和小写混合；
 * 		NA数字与大写字母混合
 * 		NB数字与小写字母混合
 * 		E为不做限制
 */
function CHECK_DATA_TYPE() {
	var dataObj = arguments[0];
	var typeBz = arguments[1];
	if (typeBz == "N"){
		if (/[0-9]+/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "A"){
		if (/[A-Z]+/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "B"){
		if (/[a-z]+/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "C"){
		if (/^[A-Za-z]+$/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "D"){
		if (/^[A-Za-z0-9]+$/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "NA"){
		if (/^[A-Z0-9]+$/.test(dataObj)){
			return true;
		}
	} else if (typeBz == "NB"){
		if (/^[a-z0-9]+$/.test(dataObj)){
			return true;
		}
	} else {
		return true;
	}
	return false;
}


//获取当前日期
function DateToString(){
	var date=new Date();
	var year=date.getFullYear();
	var month1=date.getMonth()+1;
	var month=month1<10? "0"+month1:month1.toString();
	var day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
	return year+'-'+month+'-'+day;
}
//比较两个日期大小
function DATE_CHECK_TIME_SIZE1(str1,str2){
		if(str1&&str2&&str1.length==10&&str2.length==10){
			var start=new Date(str1);
			var end=new Date(str2);
		    return start<=end;
		}else{
			return false;
		}
}

function dateFormat(dateString,format) {
    if(!dateString)return "";
    var time = new Date(dateString.replace(/-/g,'/').replace(/T|Z/g,' ').trim());
    var o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}
function DATE_CHECK_TIME_SIZE_CUSTOMER(str1,str2){
    str1=str1.replace("-","/");
    str1=str1.replace("-","/");
    var date =new Date(str1);
    return date.getTime()<=new Date().getTime();
}
//校验输入的是否是数字
function validateIsNum(num){
    var reg = /^[0-9]*$/;
    return reg.test(num);

};


/**
 * 返回第一个符合条件的减免性质代码行下标，没有则返回-1 （0开始）
 * @param data		全路径。数组形如$..zzsjmssbmxbjsxmGridlbVO[0] --> $..zzsjmssbmxbjsxmGridlbVO 的全路径
 * @param jmxzDm	需要的条件减免性质代码
 * @param swsxDm	需要的条件税务事项代码
 * @param _jmxzKey	取值列，默认为hmc
 * @param _swsxKey	取值列，默认为swsxDm
 */
function indexOfJmxzDmAndSwsxDm(data, jmxzDm, swsxDm, _jmxzKey, _swsxKey) {
	if (!_jmxzKey) {
		_jmxzKey = 'hmc';
	}

	if (!_swsxKey) {
		_swsxKey = 'swsxDm';
	}

	/**
	 * 分三类
	 * 1、只有减免性质代码			-- 具体场景自行验证
	 * 2、只有税务事项代码			-- 具体场景自行验证
	 * 3、有减免性质代码及税务实现代码	-- 已验证
	 */
	var index = -1;

	if (data.length > 0) {
		if (jmxzDm && swsxDm) {
			for (var i=0; i<data.length; i++) {
				var item = data[i];
				if (item[_jmxzKey] == jmxzDm && item[_swsxKey] == swsxDm) {
					index = i;
					break;
				}
			}
		} else if (jmxzDm) {
			for (var i=0; i<data.length; i++) {
				var item = data[i];
				if (item[_jmxzKey] == jmxzDm) {
					index = i;
					break;
				}
			}
		} else if (swsxDm) {
			for (var i=0; i<data.length; i++) {
				var item = data[i];
				if (item[_swsxKey] == swsxDm) {
					index = i;
					break;
				}
			}
		} else {
			// 都是空的，不管
		}
	}

	return index;
}

/**
 * 返回第一个符合条件的减免性质代码行自定列的数据（需结合方法@see indexOfJmxzDmAndSwsxDm 一同使用）
 * @param data		全路径。数组形如$..zzsjmssbmxbjsxmGridlbVO[0] --> $..zzsjmssbmxbjsxmGridlbVO 的全路径
 * @param jmxzDm	需要的条件减免性质代码
 * @param swsxDm	需要的条件税务事项代码
 * @param valueKey	需要获取的列值
 * @param _jmxzKey	取值列，默认为hmc
 * @param _swsxKey	取值列，默认为swsxDm
 */
function getValueOfRowJmxzDm(data, jmxzDm, swsxDm, valueKey, _jmxzKey, _swsxKey) {
	var index = indexOfJmxzDmAndSwsxDm(data, jmxzDm, swsxDm, _jmxzKey, _swsxKey)
	if (index != -1 && valueKey) {
		index = Number(index);
		return data[index][valueKey];
	} else {
		return undefined;
	}
}

/**
 * 码表过滤服务
 */
function existsInCodeTable(codeTableName,filterKey,filterValue){
	var codeObject = formCT[codeTableName];
	for(var index in codeObject){
    	if(filterKey){
    		if(codeObject[index][filterKey] && codeObject[index][filterKey] == filterValue){
    			return true;
    		}
    	}else{//no field setting. filter key.
    		return true;
    	}
    }
	return false;
}
/***********重复行校验***********/
//定义 受影响重复行对象
function RowObj(){
	this.rownums = '';//受影响行号，如1、2
}
/**
 * 检查重复行
 * @param paths 校验的jpath集合 ['jpath1','jpath2']
 * @param lnoffset 行号偏移量
 * @param targetJpath 校验结果显示的目标格子，只能配置一个jpath且是格子的叶子节点变量
 * @returns {Array} 校验不通过集合 [{repeatpass:{"index":{row:{rownums:"1、2"}}}}] index：当前重复行下标，row：重复行下标集
 */
function checkRepeatRows(paths, lnoffset, targetJpath) {
	var gridlb = paths[0].substring(0,paths[0].lastIndexOf('[')); // 截取jpath中最后一个节点所在的列表路径
	var _lst = eval(gridlb); // 通过eval 将列表路径转成集合数据
	var lastKeys = []; // 截取多列jpath中最后一个节点名称
	var path;
	var l = paths.length;
	for(var i=0;i<l;i++) {
		path = paths[i];
		lastKeys.push(path.substring(path.lastIndexOf('.')+1, path.length));// 截取jpath中最后一个节点名称
	}
	// 得出重复值集合
	var valLst = {};// 值索引-jpath集合 {val1:[jpath1,jpath2],val2:[a3,a4]}
	var vals; // 多列值组合
	var val;
	var temp;
	for(var i=0;i<_lst.length;i++) {
		vals = '';
		temp = '';
		for(var n=0;n<lastKeys.length;n++) {
			val = _lst[i][lastKeys[n]];
			if(val==''){
				vals +='^'; // a1=a,b1='';a2='',b2=a时，两行不应该相等
				temp +='';
			} else {
				vals += val;
				temp += val;
			}
		}
		if(temp==''){
			continue;
		}
		if(valLst[vals]){
			valLst[vals].push(i);
		} else {
			valLst[vals] = [i];
		}
	}
	// 重复行
    var jpLst;
    var row; // 重复行的下标集：如1和3行重复了，此处为{rownums:"1、3"}
    // 调整行号参数
    if(!lnoffset) {
    	lnoffset = 0;
    }
    var noPassLst={}; // 只存放校验不通过的下标集合： {"index":{row:{rownums:"1、2"}}} index：校验不通过下标
    // 遍历值索引，得出校验不通过的行下标集合及每行所对应重复行的下标集
	for(var k in valLst) {
		jpLst = valLst[k];
		if(jpLst.length > 1) {
			row = new RowObj(); // {rownums:"1、2"}
			for(var i=0;i< jpLst.length;i++) {
				$i = jpLst[i];
				if(row.rownums) {
					row.rownums = row.rownums+'、'+($i+lnoffset);
				} else {
					row.rownums = ($i+lnoffset);
				}
				noPassLst[jpLst[i]] = {"row":row};
			}
		}
	}
	var lastKey = paths[0].substring(paths[0].lastIndexOf('.')+1,paths[0].length);// 截取jpath中最后一个节点名称
	var resultPaths =[]; // 受影响结果集 [{repeatpass:{"index":{row:{rownums:"1、2"}}}}]
    var _r = {}; // {repeatpass:{"index":{row:{rownums:"1、2"}}}}
    _r.repeatflag = 1;
	_r.noPassLst = noPassLst;
	_r.len = _lst.length;
	_r.gridlb = gridlb.replace('formData.','')+'[';
	if(targetJpath!=undefined && targetJpath!=null && targetJpath!='') {
		_r.lastKey = '].'+targetJpath;
	} else {
		_r.lastKey = '].'+lastKey;
	}
	resultPaths.push(_r);
	return resultPaths;
}
/***********重复行校验 end***********/

/**
 * 数字金额转换为大写人民币汉字的方法
 * @param money
 * @returns {String}
 */
function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/**
 * 计数：包含
 * @returns {number}
 * @constructor
 */
function COUNT(){
    if (arguments.length <= 1) {
        return 0;
    }else if (arguments.length > 2){
    	var c = 0;
    	for(var i = 1;i < arguments.length;i++){
    		c += arguments.callee.call(this,arguments[0],arguments[i]);
		}
    	return c;
	}else {
    	var a = arguments[0];
    	var b = arguments[1];
    	var c = 0;
    	while(a.indexOf(b) > -1){
    		a = a.replace(b,"");
    		c++;
		}
		return c;
	}
}

/**
 * 位与操作
 * @param strA
 * @param strB
 */
function binaryAnd(strA, strB){
	var ret = "";
	for(var i = 0;i < strA.length;i++){
		if(strA[i] == '0' || strB[i] == '0'){
			ret += '0';
		}else{
			ret += '1';
		}
	}
	return ret;
}

/**
 * isObj，isArray，getLength，CompareObj，Compare等方法用于比对json对象是否相等
 */
function isObj(object) {
	return object
			&& typeof (object) == 'object'
			&& Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}
function isArray(object) {
	return object && typeof (object) == 'object' && object.constructor == Array;
}
function getLength(object) {
	var count = 0;
	for ( var i in object)
		count++;
	return count;
}
function Compare(objA, objB) {
	//去掉czlxDm,czlxmc,再做比对
	delete objA["czlxDm"];
	delete objA["czlxmc"];
	delete objB["czlxDm"];
	delete objB["czlxmc"];
	if (!isObj(objA) || !isObj(objB))
		return false; // 判断类型是否正确
	if (getLength(objA) != getLength(objB))
		return false; // 判断长度是否一致
	return CompareObj(objA, objB, true);// 默认为true
}
function CompareObj(objA, objB, flag) {
	for ( var key in objA) {
		if (!flag) // 跳出整个循环
			break;
		if (!objB.hasOwnProperty(key)) {
			flag = false;
			break;
		}
		if (!isArray(objA[key])) { // 子级不是数组时,比较属性值
			if (objB[key] != objA[key]) {
				flag = false;
				break;
			}
		} else {
			if (!isArray(objB[key])) {
				flag = false;
				break;
			}
			var oA = objA[key], oB = objB[key];
			if (oA.length != oB.length) {
				flag = false;
				break;
			}
			for ( var k in oA) {
				if (!flag) // 这里跳出循环是为了不让递归继续
					break;
				flag = CompareObj(oA[k], oB[k], flag);
			}
		}
	}
	return flag;
}
/**
 * 城镇土地使用税，变更时间不能晚于土地终止时间检验
 * 
 */
function CHECK_BGSJ_TDZZSJ(){
	var bgsj = BG_CYSR(arguments[0]);
	var yxqz = arguments[1];
	var bgsjArr=new Array();
	var yxqzArr=new Array();
	bgsjArr=bgsj.split('-');
	yxqzArr=yxqz.split('-');
	if ($.isEmptyObject(bgsj)) {
		
		return true;
	}
	//日期控件可能误点击；还未无成选择日期流程出现NaN-NaN-01这种情况
	if(bgsjArr.indexOf('NaN') > -1){
		return true;
	}
	var numBgsj=''+bgsjArr[0]+bgsjArr[1]+bgsjArr[2];
	var numYxqz=''+yxqzArr[0]+yxqzArr[1]+yxqzArr[2];
	if(numBgsj>numYxqz){
		return false;
	}else{
		return true;
	}
}


/**
 * 初始取得时间获取提示SW2017112-1774
 * @returns
 */
function CHECK_BGSJ_TDQDSJ_TIPES() {
	var bgsj = arguments[0];
	if ($.isEmptyObject(bgsj)) {
		return true;
	}
	var tdYxqz = this.formData.ysmxxx.ysxxByZd.ysxx.ysxxlb;
	var syuuid = this.formData.editYsmxxx.editData.syuuid;
	var tdxxlb = this.formData.sbInit9106100100442.sbcxstdsyxxcjbvoList.sbcxstdsyxxcjbvoListlb;
	for (var i = 0; i < tdxxlb.length; i++) {
		if (tdxxlb[i].syuuid == syuuid) {
			if(bgsj >= tdxxlb[i].csqdsj.substring(0, 10)){
			 	return '';
			}else{
				return  tdxxlb[i].csqdsj.substring(0, 10);
			}
		}
	}
}
/**
 * SW2017112-1774
 * 根据传入日期，获取次月一号
 * 变更次后日期，
 * 默认选择次月首日日期
 */
function BG_CYSR(){
	var bgrq=arguments[0];
	var str = bgrq.replace(/-/g, '/'); // "2010/08/01";
	// 创建日期对象
	var date = new Date(str);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month == 12) {
		month = 1;
		year = year + 1;
	} else {
		month = month + 1;
	}
	return year + "-" + DATE_GET_FULL_MONTH(month) + "-" + "01";
}

/**
 * 提示框，点击确定关闭弹窗，点击关闭关闭当前页面；
 * @param message block
 * @returns
 */
var ywztMsgIndex = "";
function  financialStatement(message,block){
	var btnList= ["确定"];
	var btnFunc = {
			btn1:closeWindow,
			btn2:closeMsgWindow
	}
	if(block && block == "N"){
		btnList = ['确定','取消'];
		btnFunc = {
				btn1:closeMsgWindow,
				btn2:closeWindow
		}
	}

	ywztMsgIndex = parent.layer.alert(message,{
		  type: 1//Page层类型
		 ,skin: 'layui-layer-molv' //样式类名  自定义样式
		 ,title: '提醒'
		 ,closeBtn: 0 ,
		 shadeClose:true
		 ,scrollbar: false
		 ,icon: 6    // icon
		 ,anim: 1 //0-6的动画形式，-1不开启
		 ,content: message
		 ,btn:btnList
		  ,yes : function(index){
			  //按钮【按钮二】的回调
            //return false 开启该代码可禁止点击该按钮关闭
			  btnFunc.btn1(index);
               
		  },btn2:function(index){
			  btnFunc.btn2(index);
		  }
	});
}
/**
 * 关闭当前页面
 * */
function closeWindow(index){
	var windowObj = window;
	if(window.top){
		windowObj = window.top;
	}
	 if (navigator.userAgent.indexOf("MSIE") > 0) {     
         if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {     
        	 windowObj.opener = null; 
        	 windowObj.close();     
         }     
         else {     
        	 windowObj.open('', '_top'); 
				window.top.close();     
         }     
     }     
     else if (navigator.userAgent.indexOf("Firefox") > 0) {  
    	//火狐默认状态非window.open的页面window.close是无效的
    	 windowObj.location.href = 'about:blank ';     
         //window.history.go(-2);     
    	 windowObj.close();
     }     
     else {     
    	 windowObj.opener = null;      
         windowObj.open('', '_self', '');     
         windowObj.close();     
     }     
	 windowObj.location.href="about:blank";
	 windowObj.close(); 
}
/**
 * 关闭当前弹窗
 * */
function closeMsgWindow(){
	parent.layer.closeAll()
}
/**
 * 比较两个数字大小，传进来的数据有可能是由字符串
 */
function compareTime(str1, str2) {
	if (str1 && str2) {
		var time1 = str1*1;
		var time2 = str2*1;
		return time1 <= time2;
	} 
}
/**
 * 事项办理提示公共方法
 */
function commonTs(codeList,ts_dm){
	for(key in codeList){
		if(key===ts_dm){
			return codeList[key];
        }
	}
}

/**
 * 判读下拉框多选为[]的情况,返回true不为空，false为空
 */
function mulSelectIsNotEmpty(param){
    if(param){
        for(var num in param){
            return true;
        }
        return false;
    }else{
        return false;
    }
}


/**
 * 是否需要锁定整个表单，返回true表示锁定，false表示不锁定
 * 各个业务可以在ywlx.js、ywbm.js中复写改方法，框架提供默认实现
 */
function isLockAllForm(){
	return false;
}
/**
 * 合同注明的跨境服务价款校验 2019-08-19
 */
function STRING_CHECK_HTZMDKJFWJKJY(fwjk) {
	return /^\d{1,14}$|^\d{1,14}[.]\d{1,2}$/.test(fwjk);
}