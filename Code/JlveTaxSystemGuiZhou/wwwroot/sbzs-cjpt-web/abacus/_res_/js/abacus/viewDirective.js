/**
 * Created by Administrator on 2016-05-12.
 */
Number.prototype.toFixed = function(d) {
	var s=this+""; 
	if(!d)d=0; 
	if(s.indexOf(".")==-1)s+="."; 
	s+=new Array(d+1).join("0"); 
	if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
		var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
		if(a==d+2){
			a=s.match(/\d/g); 
			if(parseInt(a[a.length-1])>4){
				for(var i=a.length-2;i>=0;i--){
					a[i]=parseInt(a[i])+1;
					if(a[i]==10){
						a[i]=0;
						b=i!=1;
					}else break;
				}
			}
			s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
		}
		if(b)s=s.substr(1); 
		return (pm+s).replace(/\.$/,"");
	}
	return this+"";
};

var $scopeTemp;
var idxTemp;
function ngDirectives(gobal, viewApp){
    viewApp
        .constant(
        "ngDatatypeConfig",
        {
            "number" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var precision = 2;
                    var defaultValue = 0.00;

                    if (attrs.ngDatatype) {
                        var reg = /{(\S*)}/;    // /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        //这里只处理了保留小数位数
                        if (result) {
                            result = result[1].split('\.');
                            if(result.length == 1){
                                precision = result[0];
                            }else if(result.length == 2){
                                precision = result[1];
                            }
                            if(result.length == 3){
                                if("" != result[1]) {precision = result[1];}
                                defaultValue = result[2];
                                var dtNum = parseFloat(defaultValue, 10);
                                defaultValue = isNaN(dtNum)? defaultValue : dtNum;
                                if(angular.equals("",modelValue)) return defaultValue;
                            }else{
                                defaultValue = filter("number")(0, precision);
                            }
                        }
                    }
                    try {
                        var rst = filter("number")(modelValue, precision);
                        if(rst == 0 || rst.toString().indexOf('e') > -1 || rst.toString().indexOf('E') > -1){
                            //if(defaultValue != rst){
                            //    return defaultValue;
                            //}
                            //对科学计数法表示的很小的数（如6.789e-7）进行处理转换成对应小数
                            modelValue = parent.ROUND(modelValue, precision);
                            var str = modelValue.toString();
                            if(str.indexOf('E') > -1 || str.indexOf('e') > -1){
                                var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
                                var result = str.match(reg);

                                var tail  = result[1];
                                var power = Number(result[2]);

                                var p_len = Math.abs(power);
                                var t_str = tail.replace(".", "");

                                if(power < 0){
                                    var t_len = tail.split(".")[0].length;
                                    var len = p_len - t_len;
                                    if(len >= 0){
                                        rst = "0.";
                                        for(var i=0; i<len; i++){
                                            rst = rst + "0";
                                        }
                                        rst = rst + t_str;

                                        //补满保留的小数位
                                        //取小数位
                                        var d_len = rst.split(".")[1].length;
                                        //计算保留的小数位和真实小数位的差值
                                        var c_len = precision - d_len;
                                        if(c_len > 0){
                                            //补满保留的小数位
                                            for(var j=0; j<c_len; j++){
                                                rst = rst + "0";
                                            }
                                        }
                                    }
                                }else{
                                    var t_len = tail.split(".")[1].length;
                                    var len = p_len - t_len;
                                    if(len >= 0){
                                        rst = t_str;
                                        for(var i=0; i<len; i++){
                                            rst = rst + "0";
                                        }

                                        //补满保留的小数位
                                        //取小数部分
                                        var decimal = rst.split(".")[1];
                                        //需要补的位数
                                        var c_len;
                                        if(decimal){
                                            //小数部分存在，取小数位数
                                            var d_len = decimal.length;
                                            //计算保留的小数位和真实小数位的差值
                                            c_len = precision - d_len;
                                        }else{
                                            //小数部分不存在，保留的小数位即为需要补的位数
                                            c_len = precision;
                                            //加上小数点
                                            rst = rst + ".";
                                        }

                                        //补相应位数的0
                                        if(c_len > 0){
                                            for(var j=0; j<c_len; j++){
                                                rst = rst + "0";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return rst;
                        
                    } catch (e) {
                        console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                    }
                },
                "parser" : function(args){
                    var precision = 2;
                    var zsw = 14;   //整数位 默认为14位
                    var viewValue = args.$viewValue, attrs = args.$attrs;
                    var num = viewValue.replace(/[^0-9.-]/g, '');
                    //默认取14位整数,支持number{10.2} 整数位数10位,小数位数2位  与 number{2} 小数位数2位
                    var numArr = num.split(".");
                    var defaultValue = 0.00;
                    if (attrs.ngDatatype) {
                        var reg = /{(\S*)}/;//   /{(-?\d*)}/
                        var resultPrec = reg.exec(attrs.ngDatatype);
                        if (resultPrec) {
                            var precisionStr = resultPrec[1];
                            var typeArr=precisionStr.split('\.');
                            if(typeArr.length == 1){
                                if(""!=typeArr[0]){
                                	zsw = 16 - typeArr[0];
                                	precision = parseInt(typeArr[0]);
                                }
                            }else if(typeArr.length>1){
                                if(""!=typeArr[0]) {
                                    zsw = typeArr[0];
                                    precision = parseInt(typeArr[1]);
                                }
                            }
                            if(typeArr.length == 3) {
                                defaultValue = typeArr[2];
                            }
                        }
                    }
                    num = (numArr[0]).substr(0,zsw) +"."+ numArr[1];
                    var result = parseFloat(num, 10);
                    //result = isNaN(result) ? defaultValue : result;
                    if(isNaN(result)) {
                        var dtNum = parseFloat(defaultValue, 10);
                        if(isNaN(dtNum)){
                            return defaultValue;
                        }
                        result = dtNum;
                    }
                    return parseFloat(((result*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(precision));
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue, modelValue = args.$modelValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event)
                        || gobal.keyHelper.currencyKeyBoard(event, viewValue) || gobal.keyHelper.floatKeyBoard(
                            event, viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            // 支持15位整数加两位小数。 -- GEARS-9907
            "number15" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var precision = 2;
                    var defaultValue = 0.00;

                    if (attrs.ngDatatype) {
                        var reg = /{(\S*)}/;    // /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        //这里只处理了保留小数位数
                        if (result) {
                            result = result[1].split('\.');
                            if(result.length == 1){
                                precision = result[0];
                            }else if(result.length == 2){
                                precision = result[1];
                            }
                            if(result.length == 3){
                                if("" != result[1]) {precision = result[1];}
                                defaultValue = result[2];
                                var dtNum = parseFloat(defaultValue, 10);
                                defaultValue = isNaN(dtNum)? defaultValue : dtNum;
                                if(angular.equals("",modelValue)) return defaultValue;
                            }else{
                                defaultValue = filter("number")(0, precision);
                            }
                        }
                    }
                    try {
                        var rst = filter("number")(modelValue, precision);
                        if(rst == 0){
                            //if(defaultValue != rst){
                            //    return defaultValue;
                            //}
                            //对科学计数法表示的很小的数（如6.789e-7）进行处理转换成对应小数
                            modelValue = parent.ROUND(modelValue, precision);
                            var str = modelValue.toString();
                            if(str.indexOf('E') > -1 || str.indexOf('e') > -1){
                                var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}(-?\\d+)$");
                                var result = str.match(reg);

                                var tail  = result[1];
                                var power = Number(result[2]);

                                var p_len = Math.abs(power);
                                var t_str = tail.replace(".", "");

                                if(power < 0){
                                    var t_len = tail.split(".")[0].length;
                                    var len = p_len - t_len;
                                    if(len >= 0){
                                        rst = "0.";
                                        for(var i=0; i<len; i++){
                                            rst = rst + "0";
                                        }
                                        rst = rst + t_str;
                                    }
                                }else{
                                    var t_len = tail.split(".")[1].length;
                                    var len = p_len - t_len;
                                    if(len >= 0){
                                        rst = t_str;
                                        for(var i=0; i<len; i++){
                                            rst = rst + "0";
                                        }
                                    }
                                }
                            }
                        }
                        return rst;

                    } catch (e) {
                        console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                    }
                },
                "parser" : function(args){
                    var precision = 2;
                    var zsw = 16;   //整数位 默认为16位
                    var viewValue = args.$viewValue, attrs = args.$attrs;
                    var num = viewValue.replace(/[^0-9.-]/g, '');
                    //默认取16位整数,支持number{10.2} 整数位数10位,小数位数2位  与 number{2} 小数位数2位
                    var numArr = num.split(".");
                    var defaultValue = 0.00;
                    if (attrs.ngDatatype) {
                        var reg = /{(\S*)}/;//   /{(-?\d*)}/
                        var resultPrec = reg.exec(attrs.ngDatatype);
                        if (resultPrec) {
                            var precisionStr = resultPrec[1];
                            var typeArr=precisionStr.split('\.');
                            if(typeArr.length == 1){
                                if(""!=typeArr[0]){
                                    zsw = 16 - typeArr[0];
                                    precision = parseInt(typeArr[0]);
                                }
                            }else if(typeArr.length>1){
                                if(""!=typeArr[0]) {
                                    zsw = typeArr[0];
                                    precision = parseInt(typeArr[1]);
                                }
                            }
                            if(typeArr.length == 3) {
                                defaultValue = typeArr[2];
                            }
                        }
                    }
                    num = (numArr[0]).substr(0,zsw) +"."+ numArr[1];
                    var result = parseFloat(num, 10);
                    //result = isNaN(result) ? defaultValue : result;
                    if(isNaN(result)) {
                        var dtNum = parseFloat(defaultValue, 10);
                        if(isNaN(dtNum)){
                            return defaultValue;
                        }
                        result = dtNum;
                    }
                    return parseFloat(((result*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(precision));
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue, modelValue = args.$modelValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event)
                        || gobal.keyHelper.currencyKeyBoard(event, viewValue) || gobal.keyHelper.floatKeyBoard(
                            event, viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "zero" : {
            	"formatter" : function(args){
            		var  modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
            		var precision = 2;
            		if(attrs.ngDatatype){
            			var reg = /{(-?\d*)}/;
            			var result =reg.exec(attrs.ngDatatype);
            			if(result){
            				precision = result[1];
            			}
            		}
            		try{
            			return filter("number")(modelValue, precision);
            		}catch(e){
            			console.log("ERROR["+e+"],ng-model is "+attrs.ngModel);
            		}
            	},
            	"parser" : function(args){
            		var precision = 2;
            		var viewValue = args.$viewValue, attrs = args.$attrs;
            		var num = viewValue.replace(/[^0-9.-]/g,'');
            		var numArr = num.split(".");
            		num = (numArr[0]).substr(0,14)+"."+numArr[1];
            		var result = parseFloat(num,10);
            		if(attrs.ngDatatype){
            			var reg=/{(\S*)}/;
            			var resultPrec =reg.exec(attrs.ngDatatype);
            			if(resultPrec){
            				precision =resultPrec[1];
            				var typeArr=precision.split('\.');
            				if(typeArr.length>1){
            				num =(numArr[0]).substr(0,typeArr[0])+"."+numArr[1];
            				var result=parseFloat(num,10);
            				precision =typeArr[1];
            				}
            			}
            		}
                      result=isNaN(result)||((result+"").substr(0,1)=='-')?0:result;
                      return parseFloat(((result*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(parseInt(precision)));
            	},
            	"isEmpty" : function(value){
            		return !value.$modelValue;
            	},
            	"keyDown" : function(args){
            		var event = args.$event,viewValue =args.$viewValue,modelValue=args.$modelValue;
            		if(!(gobal.keyHelper.smallKeyBoard(event)||gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper.functionKeyBoard(event))
            				||gobal.keyHelper.currencyKeyBoard(event,viewValue)||gobal.keyHelper.floatKeyboard(event,viewValue)){
            			event.stopPropagation();
            			event.preventDefault();
            		}
            	}
            },
            "digit" : {
            	"formatter" : function(args){
            		return args.$modelValue;
            	},
            	"parser" : function(args){
            		return args.$viewValue ? args.$viewValue.replace(/[^0-9-]/g, '') : "";
            	},
            	"isEmpty" : function(value){
            		return !value.$modelValue && value.$modelValue!==0;
            	},
            	"keyDown" : function(args){
            		var event = args.$event;
            		
            		if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
            				.functionKeyBoard(event))) {
            			event.stopPropagation();
            			event.preventDefault();
            		}
            	}
            },
            "natural" : {
                "formatter" : function(args){
                	if(args.$modelValue === ""){
                		 if(FrameworkConstant && FrameworkConstant.ViewDirective_ZERO_TO_EMPTY_STR){
                         	return '';
                         }
                    	return 0;
                    }
                    return args.$modelValue;
                },
                "parser" : function(args){
                    var value = args.$viewValue ? args.$viewValue.replace(/[^0-9]/g, '') : "";
                    if(value === ""){
                    	return 0;
                    }
                    return parseInt(value);
                },
                "isEmpty" : function(value){
                    return !value.$modelValue && value.$modelValue!==0;
                },
                "keyDown" : function(args){
                    var event = args.$event;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
                            .functionKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "strNatural" : {
                "formatter" : function(args){
                	if(args.$modelValue === ""){
                    	return "0";
                    }
                    return args.$modelValue;
                },
                "parser" : function(args){
                    var value = args.$viewValue ? args.$viewValue.replace(/[^0-9]/g, '') : "";
                    if(value === ""){
                    	return "0";
                    }
                    return parseInt(value)+"";
                },
                "isEmpty" : function(value){
                    return !value.$modelValue && value.$modelValue!==0;
                },
                "keyDown" : function(args){
                    var event = args.$event;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
                            .functionKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "strDigit" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return modelValue;
                },
                "parser" : function(args){
                	return args.$viewValue ? args.$viewValue.replace(/[^0-9a-zA-Z]/g, '') : "";
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue) || gobal.keyHelper.englishKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "email" : {
                "formatter" : function(args){
                	 var value = args.$viewValue, modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                     if (attrs.ngDatatype) {
                         var reg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                         var result = reg.test(modelValue) 
                         if (!result) {
                             return '';
                         }
                     }
                     
                     try {
                    	 return modelValue;
                     } catch (e) {
                         console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                     }
                },
                "parser" : function(args){
                    var val = args.$viewValue;
                    if(val)
                    var ret = args.$viewValue ? args.$viewValue.replace(/A-Za-z0-9'|_|\./, '') : "";
                    return ret;
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue) || gobal.keyHelper.englishKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "int" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return filter("number")(modelValue);
                },
                "parser" : function(args){
                    var val = parseInt(args.$viewValue.replace(/[^0-9-]/g, ''), 10);
                    return isNaN(val) ? 0 : val;
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
                            .functionKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "float" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return filter("number")(modelValue);
                },
                "parser" : function(args){
                    var val = parseFloat(args.$viewValue.replace(/[^0-9.-]/g, '')), ENOB = 3, tempNum = Math.pow(10,
                        ENOB);
                    return isNaN(val) ? undefined : Math.round(val * tempNum) / tempNum;
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "string" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return modelValue;
                },
                "parser" : function(args){
                    var val = args.$viewValue;
                    return isNaN(val) ? undefined : val;
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue) || gobal.keyHelper.englishKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "strNum" : {
                "formatter" : function(args){
                	var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs;
                	 var precision = 0;
                     var defaultValue = 0;
                     if(modelValue === ""){                    	 
                    	 return defaultValue;
                     }                     
                     if (attrs.ngDatatype) {
                         var reg = /{(\S*)}/;	// /{(-?\d*)}/;
                         var result = reg.exec(attrs.ngDatatype);
                         if (result) {
                         	result = result[1].split('\.');
                         	if(result.length == 1){
                         		precision = result[0];
                         	}else if(result.length == 2){
                         		precision = result[1];
                         	}                         	
                         }else{
                        	 var rst=modelValue;
                        	   var str = modelValue.toString();
                               if(str.indexOf('E') > -1 || str.indexOf('e') > -1){
                                   var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
                                   var result = str.match(reg);

                                   var tail  = result[1];
                                   var power = Number(result[2]);

                                   var p_len = Math.abs(power);
                                   var t_str = tail.replace(".", "");

                                   if(power < 0){
                                       var t_len = tail.split(".")[0].length;
                                       var len = p_len - t_len;
                                       if(len >= 0){
                                           rst = "0.";
                                           for(var i=0; i<len; i++){
                                               rst = rst + "0";
                                           }
                                           rst = rst + t_str;

                                           //补满保留的小数位
                                           //取小数位
                                           var d_len = rst.split(".")[1].length;
                                           //计算保留的小数位和真实小数位的差值
                                           var c_len = precision - d_len;
                                           if(c_len > 0){
                                               //补满保留的小数位
                                               for(var j=0; j<c_len; j++){
                                                   rst = rst + "0";
                                               }
                                           }
                                       }
                                   }else{
                                       var t_len = tail.split(".")[1].length;
                                       var len = p_len - t_len;
                                       if(len >= 0){
                                           rst = t_str;
                                           for(var i=0; i<len; i++){
                                               rst = rst + "0";
                                           }

                                           //补满保留的小数位
                                           //取小数部分
                                           var decimal = rst.split(".")[1];
                                           //需要补的位数
                                           var c_len;
                                           if(decimal){
                                               //小数部分存在，取小数位数
                                               var d_len = decimal.length;
                                               //计算保留的小数位和真实小数位的差值
                                               c_len = precision - d_len;
                                           }else{
                                               //小数部分不存在，保留的小数位即为需要补的位数
                                               c_len = precision;
                                               //加上小数点
                                               rst = rst + ".";
                                           }

                                           //补相应位数的0
                                           if(c_len > 0){
                                               for(var j=0; j<c_len; j++){
                                                   rst = rst + "0";
                                               }
                                           }
                                       }
                                   }
                               }
                        	 return rst;
                         }
                     }
                     try {                    	 
                    	 var result =String(modelValue).split('\.');                    	 
                		 if(result.length == 2&&result[1].length>precision){                	                		
                			 return modelValue;
                		 }else{
                			 var rst = filter("number")(parseFloat(modelValue,10), precision);                			 
                			 return rst;
                		 }
                     } catch (e) {
                         console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                     }                	
                },
                "parser" : function(args){            	
                    var viewValue = args.$viewValue, attrs = args.$attrs;
                    var precision = 0;
                    var defaultValue = 0;
                    if(viewValue === ""){                    	 
                   	 	return defaultValue;
                    }  
                    var num = viewValue.replace(/[^0-9.-]/g, '');
                    if (attrs.ngDatatype) {
                        var reg = /{(\S*)}/;	// /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                        	result = result[1].split('\.');
                        	if(result.length == 1){
                        		precision = result[0];
                        	}else if(result.length == 2){
                        		precision = result[1];
                        	}                         	
                        }else{
                        	var str =String(num).split('\.');  
                        	if(str.length == 2){
                       			precision=str[1].length;               			
                       		 }                        	
                        	return parseFloat(((num*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(parseInt(precision)));
                        }
                    }
                    try {                    	 
                   	 var result =String(num).split('\.');
               		 if(result.length == 2&&result[1].length>precision){
               			precision=result[1].length;
               		 }
               		 return parseFloat(((num*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(parseInt(precision)));
                    } catch (e) {
                        console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                    }                              	
                },
                "isEmpty" : function(value){
                    return !value.$modelValue && value.$modelValue!==0;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
                            .functionKeyBoard(event)|| gobal.keyHelper.floatKeyBoard(event, viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }                  
                }
            },"strInt" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;                                    	 
                   	return modelValue;                
                },
                "parser" : function(args){	            	
                	 var viewValue = args.$viewValue, attrs = args.$attrs;
                     var precision = 0;
                     var defaultValue = 0;
                     if(viewValue === ""||viewValue === "0"){                    	 
	                	 return viewValue;
	                 } 
                     var num = viewValue.replace(/[^0-9.-]/g, '');
                     if (attrs.ngDatatype) {
                         var reg = /{(\S*)}/;	// /{(-?\d*)}/;
                         var result = reg.exec(attrs.ngDatatype);
                         if (result) {
                         	result = result[1].split('\.');
                         	if(result.length == 1){
                         		precision = result[0];
                         	}else if(result.length == 2){
                         		precision = result[1];
                         	}                             	
                         }else{
	                     	var str =String(num).split('\.');  
	                     	if(str.length == 2){
	                    		precision=str[1].length;               			
	                    	}                        		                     	
                         }
                     }
                     try {                    	                     	 
                    	 return parseFloat(((num*Math.pow(10,parseInt(precision)+1))/Math.pow(10,parseInt(precision)+1)).toFixed(parseInt(precision)));
                     } catch (e) {
                         console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                     } 
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;
                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper
                            .functionKeyBoard(event)|| gobal.keyHelper.floatKeyBoard(event, viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }                   
                }
            },
            /**
             * 百分比带%显示格式化
             * 奇葩需求描述:value值为78，显示作78%
             */
            "percentV" : {
                "formatter" : function(args) {
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var decimals = 3;
                    var suffix = '%';
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            decimals = parseInt(result[1], 10);
                        }
                    }
                    if(angular.isNumber(modelValue)) {
                        return (Math.round(modelValue * Math.pow(10, decimals))/Math.pow(10, decimals)).toFixed(parseInt(decimals)) + suffix;
                    } else return (Math.round(0 * Math.pow(10, decimals))/Math.pow(10, decimals)).toFixed(parseInt(decimals)) + suffix;
                },
                "parser" : function(args) {
                    var viewValue = args.$viewValue,filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var decimals = 3;
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            decimals = parseInt(result[1], 10);
                        }
                    }
                    var vv = viewValue.replace(/[^0-9.]/g, '');
                    vv = parseFloat(vv, 10);
                    return isNaN(vv) ? 0 : Math.round(vv * Math.pow(10, decimals))/Math.pow(10, decimals);
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            /**
             * 百分比显示格式化
             */
            "percent" : {
                "formatter" : function(args) {
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var decimals = 3;
                    var suffix = '%';
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)(,?)([0,1]?)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            decimals = parseInt(result[1], 10);
                        }
                    }

                    if(angular.equals("",modelValue)) {
                    	return modelValue;
                    } else if(angular.isString(modelValue)) { 
                    	var mv = filter("number")(modelValue, decimals);
                    	return (Math.round(mv * Math.pow(10, decimals))/Math.pow(10, decimals)).toFixed(parseInt(decimals)) + suffix;
                    } else if(angular.isNumber(modelValue)) {
                    	return (Math.round(modelValue * Math.pow(10, decimals + 2))/Math.pow(10, decimals)).toFixed(parseInt(decimals)) + suffix;
                    } else return (Math.round(0 * Math.pow(10, decimals))/Math.pow(10, decimals)).toFixed(parseInt(decimals)) + suffix;
                },
                "parser" : function(args) {
                    var viewValue = args.$viewValue,filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var decimals = 3;
                    var isMinus = false;
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)(,?)([0,1]?)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            decimals = parseInt(result[1], 10);
                            isMinus = parseInt(result[3])===1?true:false;
                        }
                    }
                    var vv;
                    if(isMinus){
                        vv = viewValue.replace(/[^0-9.-]/g, '');
                    }else{
                        vv = viewValue.replace(/[^0-9.]/g, '');
                    }
                    if(angular.equals("",vv)) return vv;
                    vv = parseFloat(vv, 10);
                    return isNaN(vv) ? 0 : Math.round(vv * Math.pow(10, decimals))/Math.pow(10, decimals + 2);
                },
                "isEmpty" : function(value){
                    return !value.$modelValue;
                },
                "keyDown" : function(args){
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event)
                        || gobal.keyHelper.functionKeyBoard(event) || gobal.keyHelper.floatKeyBoard(event,
                            viewValue))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            }
        }).directive(
        "ngDatatype",
        [
            "ngDatatypeConfig",
            "$filter",
            "$parse",
            function(ngDatatypeConfig, $filter, $parse){
                return {
                    require : '?^ngModel',
                    link : function(scope, element, attrs, ctrl){
                        var ngDatatype = attrs.ngDatatype;
                        var formatParam;
                        var posTmp = ngDatatype.indexOf("{")
                        if (posTmp > 0) {
                            formatParam = ngDatatype.substr(posTmp + 1, ngDatatype.indexOf("}") - posTmp - 1);
                            ngDatatype = ngDatatype.substr(0, posTmp);
                        }
                        var config = ngDatatypeConfig[ngDatatype] || {};

                        /*
                         * 1.从属性获取默认配置中，获取处理函数
                         * 2.统一处理空字符串
                         */
                        var isVal2Empty = attrs.empty2str;
                        var parseFuction = function(funKey){
                            if (attrs[funKey]) {
                                var func = $parse(attrs[funKey]);
                                return (function(args){
                                    return func(scope, args);
                                });
                            }
                            return config[funKey];
                        };

                        var _formatter = parseFuction("formatter");
                        var _parser = parseFuction("parser");

                        var formatter = function(args){
                            var value=args.$modelValue;
                            if(isVal2Empty && (value==="" || value===null || value===undefined) ){
                                return "";
                            }else{
                                return _formatter(args);
                            }
                        };
                        var parser = function(args){
                            var value=args.$viewValue;
                            if(isVal2Empty && (value==="" || value===null || value===undefined) ){
                                return "";
                            }else{
                                return _parser(args);
                            }
                        };
                        var isEmpty = parseFuction("isEmpty");
                        var keyDown = parseFuction("keyDown");
                        var getModelValue = function(){
                            return $parse(attrs.ngModel)(scope);
                        };

                        if (keyDown) {
                            element.bind(
                                "blur",
                                function(){
                                    element.val(formatter({ "$modelValue" : getModelValue(), "$filter" : $filter,
                                        "$attrs" : attrs, "$eval" : scope.$eval
                                    }));
                                }).bind(
                                "keydown",
                                function(event){
                                    keyDown({ "$event" : event, "$viewValue" : element.val(),
                                        "$modelValue" : getModelValue(), "$attrs" : attrs, "$eval" : scope.$eval,
                                        "$ngModelCtrl" : ctrl
                                    });
                                });
                        }

                        ctrl.$parsers.push(function(viewValue){
                            return parser({ "$viewValue" : viewValue, "$attrs" : attrs, "$eval" : scope.$eval
                            });
                        });

                        ctrl.$formatters.push(function(value){
                            return formatter({ "$modelValue" : value, "$filter" : $filter, "$attrs" : attrs,
                                "$eval" : scope.$eval
                            });
                        });

                        ctrl.$isEmpty = function(value){
                            return isEmpty({ "$modelValue" : value, "$attrs" : attrs, "$eval" : scope.$eval
                            });
                        };
                    }
                };
            }
        ]).directive("checkBoxToArray", [

            function(){
                return { restrict : "A", require : "ngModel", link : function(scope, element, attrs, ctrl){
                    var value = scope.$eval(attrs.checkBoxToArray);
                    ctrl.$parsers.push(function(viewValue){
                        var modelValue = ctrl.$modelValue ? angular.copy(ctrl.$modelValue) : [];
                        if (viewValue === true && modelValue.indexOf(value) === -1) {
                            modelValue.push(value);
                        }

                        if (viewValue !== true && modelValue.indexOf(value) != -1) {
                            modelValue.splice(modelValue.indexOf(value), 1);
                        }

                        return modelValue.sort();
                    });

                    ctrl.$formatters.push(function(modelValue){
                        return modelValue && modelValue.indexOf(value) != -1;
                    });

                    ctrl.$isEmpty = function($modelValue){
                        return !$modelValue || $modelValue.length === 0;
                    };
                }
                }
            }
        ]);

    var smallKeyBoard = function(event){
        var which = event.which;
        return (which >= 96 && which <= 105) || which == 109;
    };
    
    var englishKeyBoard = function(event){
    	//谷歌和IE8以下（包括IE8）不支持event.key，获取的值undefined，导致判断失效
        /*var key = event.key;
        return ((key >= "a" && key <= "z") || (key >= "A" && key <= "Z"));*/
    	
    	//换成使用keyCode（谷歌和IE都支持）判断，火狐对字母键不支持keyCode，但支持which
    	var which = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
    	return (which >= "65" && which <= "90");
    };

    var numberKeyBpoard = function(event){
    	//var which = event.which;
    	var which = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        return (which >= 48 && which <= 57 || which == 45 || which == 229 || which == 189 || which == 173 || which == 46) && !event.shiftKey;
    };

    var functionKeyBoard = function(event){
        //var which = event.which;
    	var which = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        return (which <= 40) || (navigator.platform.indexOf("Mac") > -1 && event.metaKey)
            || (navigator.platform.indexOf("Win") > -1 && event.ctrlKey);
    };

    var currencyKeyBoard = function(event, viewValue){
        //var which = event.which;
    	var which = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        return (viewValue.toString().indexOf('$') === -1 && which === 52 && event.shiftKey);
    };

    var floatKeyBoard = function(event, viewValue){
        //var which = event.which;
    	var which = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
    	return (which===188) || (which === 190 || which === 110) && viewValue.toString().indexOf('.') === -1;
        // Change for compatible to IE8
        //return [188].indexOf(which) != -1 || (which === 190 || which === 110) && viewValue.toString().indexOf('.') === -1;
    }

    gobal.keyHelper = { smallKeyBoard : smallKeyBoard, numberKeyBpoard : numberKeyBpoard,
        functionKeyBoard : functionKeyBoard, currencyKeyBoard : currencyKeyBoard, floatKeyBoard : floatKeyBoard,englishKeyBoard : englishKeyBoard
    };
    
    /*
     * 2级动态行时替换动态行下标
     * */
    var _2DDynamicReplace = function(jpath, dynamicIdx){
    	var tmp_jpaths;
        if(jpath.indexOf("[#") == -1){
        	tmp_jpaths = jpath.replace(/\[\d+\]/,"["+ dynamicIdx[0] +"_mh_]")
				.replace(/\[\d+\]/,"["+ dynamicIdx[1] +"_mh_]")
				.replace(/_mh_\]/g,"]");
        }else{
        	tmp_jpaths = jpath.replace(/\[##\]/g,"["+ dynamicIdx[0] +"_mh_]")
			.replace(/\[#\]/g,"["+ dynamicIdx[1] +"_mh_]")
			.replace(/_mh_\]/g,"]");
        }
        return tmp_jpaths;
    };




    /**
     * 自定义指令ngRepeatInit
     * 在angular初始化repeat指令时调用，如为每一个指令下的单元格绑定事件
     */
    viewApp.directive('ngRepeatInit', function ($timeout) {
        return {
            link: function ($scope, $element, $attr) {
                /*
                 *获取分页id
                 *用于区分同个界面分页 _paginationId
                 */
                var _paginationId=(function ($attr) {
                    var pagingId = "";
                    var repeatAttr = $attr.ngRepeat;
                    if(new RegExp(/\|\s*paging.*?\s*:\s*'(.+?)'/g).test(repeatAttr)){ //正则检查，是否用了paging 分页
                        pagingId = RegExp.$1;//去除前后单一号,取rid
                    }
                    return pagingId;
                }($attr));

                /*
                 * 获取 数组过滤器 id
                 */
                var _filterArrId=null;
                _filterArrId=(function($attr){
                    var filterId = null;
                    var repeatAttr = $attr.ngRepeat;
                    if(new RegExp(/\|\s*filterArr\s*:\s*'(.+?)'/g).test(repeatAttr)){ //正则检查，是否用了paging 分页
                        filterId = RegExp.$1;//去除前后单一号,取rid
                    }
                    return filterId;
                }($attr));

                if(_filterArrId && _paginationId && _paginationId!=_filterArrId){
                    throw '[ERROR]因分页过滤和数组过滤都存在,分页过滤器filterArr的id 必须与数组过滤器paging的id保持一致。';
                }



                /*
                 * 获取分页界面序号,从0开始
                 * 如果存在分页，则计算出序号
                 * 如果不存在分页，则使用$index
                 */
                $scope.$pageIndex=function(){
                    var pageIndex=1;
                    if(_paginationId){
                        var conf= $scope.$parent.conf[_paginationId];
                        pageIndex=(conf.currentPage-1) * conf.itemsPerPage +$scope.$index;
                    }else{
                        pageIndex=$scope.$index;
                    }
                    return pageIndex;
                }

                /*
                 * 获取过滤后数组与原始数组下标对应关系;
                 */
                $scope.$originIndex=function(){
                    /*
                     * _filterMap = 过滤前数组下标 与 过滤后数组下标 的对应关系
                     * _filterMap.old2newMap 原始数组下标 对应 新数组下标
                     * _filterMap.new2oldMap 新数组下标 对应 原始数组下标
                     */
                    var _filterMap = null;
                    if(_filterArrId && $scope.$parent._filterMap){
                        _filterMap = $scope.$parent._filterMap[_filterArrId];
                    }

                    var oIdx = "";
                    if(_paginationId){ //存在分页
                        var conf= $scope.$parent.conf[_paginationId];//取的分页参数conf
                        var currPageIndex=(conf.currentPage-1) * conf.itemsPerPage + $scope.$index;

                        if(_filterArrId){ //存在数组过滤
                            oIdx = _filterMap.new2oldMap[currPageIndex];
                        }else{          //不存在过滤
                            oIdx = currPageIndex;
                        }

                    }else{      // 不存在分页

                        if(_filterArrId){ //存在数组过滤
                            oIdx = _filterMap.new2oldMap[$scope.$index];
                        }else{    //不存在过滤
                            oIdx = $scope.$index;
                        }
                    }
                    return oIdx;
                }

                /**
                 * 获取分页条参数的conf
                 * @returns {*}
                 */
                $scope.$pageConf=function(){
                    var conf;
                    if(_paginationId){
                        conf= $scope.$parent.conf[_paginationId];
                    }else{
                        conf=$scope.$parent.conf;
                    }
                    return conf;
                }

                /*
                 * bindEventsForElements执行两个事件
                 * 1.绑定jpath
                 * 2.注入默认事件
                 */
                viewEngine.bindEventsForElements($scope, $element);

                var _skipElem = $element.attr('skip-elem');
                var _defaultValue = $element.attr('default-value');
                var _keyword = $element.attr('ng-repeat-init');
                //动态行的默认值
                var obj = _defaultValue;
                var evalELement = $element.attr('eval-elem');

                if(undefined == obj || '' === obj) {
                    obj = jQuery.extend(true, {}, $scope[_keyword][0]);//增行时默认取第一行模型;
                    $.each(obj, function(k,v){
                        var _skipElems;
                        if(_skipElem) {
                            //skip-elem="djxh,nsrsbh,sfzjlxDm",以逗号分隔
                            _skipElems=_skipElem.split(',');
                        }
                        //ie8不支持indexOf方法，导致增行失效，故改用inArray。  _skipElems.indexOf(k)
                        if(_skipElems && $.inArray(k,_skipElems)>-1) {//如果包含，值不做处理。

                        } else{
                            if(typeof v =='string') {
                                obj[k] = '';
                            } else if(typeof v == 'number') {
                                obj[k] = 0;
                            } else if(typeof v == 'object') {
                                obj[k] = {};
                            }
                        }
                    });
                    // 由于angular双向绑定过程中，会对数据模型加入一些私有变量，如$index等标识，
                    // 所以不能直复制对象操作;
                    obj = JSON.stringify(obj);
                }else{//如果defaultValue属性存在，且有值，对每个value值进行$scope.$eval解析。读取scope中变量。
                    var _JsonObj = JSON.parse(obj);
                    var evalELements;
                    if(evalELement){
                        evalELements = evalELement.split(",");
                        $.each(_JsonObj, function(k,v){
                            //只对指定字段进行eval
                            if(evalELements && $.inArray(k,evalELements)>-1){
                                //只对字符串类型且非数字的值进行eval解析。否则不进行解析。
                                if(typeof v =='string' && v.replace(/[0-9.-]/g, '').length > 0){
                                    try{
                                        _JsonObj[k] = $scope.$eval(v);
                                    }catch(e){//解析失败，打印异常信息，保留原始值。
                                        console.log(e);
                                        _JsonObj[k] = v;
                                    }
                                }
                            }
                        });
                    }
                    obj = JSON.stringify(_JsonObj);
                }

                //重复行jpath集合
                /**
                 *
                 * 搜集所有jpath路径，目前是为执行公式.
                 * 此处需要注意，jpaths只是能获取当前界面的，分页后，只能分页初始jpath
                 *
                 * 所以 此时，会找到一级和二级下标
                 * 如果存在二级下标,则 一级下标=99999 二级下标=0
                 * 如果只存在一级下标,则 一级下标 0
                 *
                 * 二级动态行                 jpath = qcs.hjbhsSyxx[4].scjydz[3].scjy
                 * 第一个[x]替换成 [99999_mh_]   ->  qcs.hjbhsSyxx[99999_mh_].scjydz[3].scjy
                 * 第二个[y]替换成 [0]          ->  qcs.hjbhsSyxx[99999_mh_].scjydz[0].scjy
                 * _mh_替换  [99999]          ->  qcs.hjbhsSyxx[99999].scjydz[0].scjy
                 *
                 * 一级动态行            jpath = qcs.hjbhsSyxx[4].scjy
                 *  第一个[x]替换成 [0]      ->  qcs.hjbhsSyxx[0].scjy
                 *
                 * @type {Array}
                 * @private
                 */
                var _jpaths = [];
                $element.find('input,textarea,select').each(function(index) {
                    //angular双向绑定数据时，若全表打开标志为Y，则将元素readonly和disabled属性移除
                    if(parent.unlockedAllFormsBz=="Y"){
                        $(this).removeAttr("readonly");
                        $(this).removeAttr("disabled");
                    }

                    var _jpath = $(this).attr('jpath');
                    if(undefined != _jpath) {
                        //如果是2级动态行
                        var l = _jpath.match(/\[\d+\]/g);
                        if(l != null){
                            if(l.length == 2){
                                _jpaths.push(_jpath.replace(/\[\d+\]/,"[99999_mh_]").replace(/\[\d+\]/,"[0]").replace("_mh_",""));
                            }else{
                                _jpaths.push(_jpath.replace(/\[\d+\]/g,"[0]"));
                            }
                        }
                    }
                });


                /*
                 * 作用1：保存动态行的jpath
                 * 作用2：判断是否有动态行，如果scope._arr_存在,且长度不为0，则说明存在动态行
                 *  scope[ _arr_]               是总动态
                 *  scope[ _arr_][_arr_ + 对象]  保存 此域,也是当前行的 动态行jpath
                 */
                if(undefined == $scope['_arr_' + _keyword]) {
                    $scope['_arr_' + _keyword] = _jpaths;
                    if($scope._arr_ == null || typeof $scope._arr_ == "undefined"){
                        $scope['_arr_'] = [];
                    }
                    $scope._arr_.push('_arr_' + _keyword);
                }


                /**
                 * 以下标分割获取jpath的前中后缀，再根据前中后缀和实际下标拼接成jpath。用此方法替换原来使用的replace
                 */
                $scope.getJpathFixs=function(_jpaths){
                    // 当有10w条数据时，replace相当耗性能，故改用jpath前中后缀拼接下标的方式替换replace方法；由2s--优化到-->700ms。更优的方案应该是遍历idxVariable2NoPass，idxVariable2Control
                    var _jpaths_fixs = [];// 根据下标切分jpath字符串，切分后分别保存前中后缀。[{p:'jpath前缀',c:'jpath中段',s:'jpath后缀'}]
                    var _jpath_fix;
                    var _tmpjp,_i;
                    var prefixPath;
                    var sufixPath;
                    var centerPath;
                    for (var i=0,l= _jpaths.length;i<l;i++) {
                        _jpath_fix = {};
                        _tmpjp = _jpaths[i];
                        _i = _tmpjp.indexOf('[99999]');
                        if (_i > -1) {
                            prefixPath = _tmpjp.substring(0, _i + 1);
                            centerPath = _tmpjp.substring(_i + 6);
                        } else {
                            centerPath = _tmpjp;
                        }
                        var _ci = centerPath.indexOf('[0]');
                        if (_ci > -1) {
                            sufixPath = centerPath.substring(_ci + 2);
                            centerPath = centerPath.substring(0, _ci + 1);
                        }
                        _jpath_fix.p = prefixPath;
                        _jpath_fix.c = centerPath;
                        _jpath_fix.s = sufixPath;
                        _jpaths_fixs.push(_jpath_fix);
                    }
                    return _jpaths_fixs;
                }
                /**
                 * 根据前中后缀和实际下标拼接成jpath
                 */
                $scope.getONPath=function(jpathFix, j, n){
                	// jpath=zzsybsbSbbdxxVO.zzssyyybnsr_fwbdchwxzckcxmqd.fwbdchwxzckcxmqdGrid[99999].fwbdchwxzckcxmqdGridlb[2].je
        			// p="zzsybsbSbbdxxVO.zzssyyybnsr_fwbdchwxzckcxmqd.fwbdchwxzckcxmqdGrid["
        			// c="].fwbdchwxzckcxmqdGridlb["
        			// s="].je"
                    /*
                     * oJpath 原先 jpath 路径
                     * nJpath 更新后的jpath
                     */
					var oJpath, nJpath;

					if (jpathFix.p) {
						if (jpathFix.s) {
							oJpath = jpathFix.p + (dynamicIdx[0]) + jpathFix.c + (j + n) + jpathFix.s;
							nJpath = jpathFix.p + (dynamicIdx[0]) + jpathFix.c + (j) + jpathFix.s;
						} else {
							oJpath = jpathFix.p + (dynamicIdx[0]) + jpathFix.c;
							nJpath = jpathFix.p + (dynamicIdx[0]) + jpathFix.c;
						}
					} else if (jpathFix.c) {
						oJpath = jpathFix.c + (j + n) + jpathFix.s;
						nJpath = jpathFix.c + (j) + jpathFix.s;
					} else {
						oJpath = jpathFix.c;
						nJpath = jpathFix.c;
					}
        			return [oJpath,nJpath];
                }



                /*
                 *  增行,实现逻辑
                 * 1. 在数据模型增加一条记录 ->
                 *  （此处获取重新触发分页过滤器，分页过滤器改变conf,因为conf给ngpagination监听,所以会触发updateIdx4Jpath进行更新界面jpath下标）
                 *
                 * 2. 判断ng-repeat是否嵌套,获取dynamicIdx动态数组下标
                 *
                 * 3. 调整校验公式和控制公式
                 * 3.1 把原先该行的状态都替换成默认值
                 * 3.2 寻找子动态行，并进行调整
                 *
                 * 4.对新增行,遍历其他jpath,执行公式
                 */
                $scope.add=function(){
                	try {
                         if(typeof(addcheck)==='function'){
                             if(addcheck(_keyword)){
                                 return;
                             }}
                     }catch(e){

                     }
                	//说明存在分页的情况,分页不考虑2级动态行的情况
                    //如果时分页,则改成分页后的下标
                    var _finalIdx = this.$originIndex();//获取原始数据下标

                    // 1、往数据模型添加一行数据
                    $scope[_keyword].splice((_finalIdx+1),0,JSON.parse(obj.replace(/\\/g,'')));

                    // 2、组装动态行的行下标 TODO 操作父动态行是否需要子动态行的下标？
                    /*
                     * 存在 ng-repeat指令 中 嵌套 ng-repeat指令。即两级动态行
                     * 所以需要判断 ng-repeat 是否存在两级 ng-repeat。
                     * 通过父层scope,判断是否保存 动态行数组 _arr_
                     *
                     * 存在三种情况
                     * 当前ng-repeat,是否存在父ng-repeat
                     * 当前ng-repeat,是否存在子ng-repeat
                     * 当前ng-repeat,不存在 父ng-repeat 和 子 ng-repeat
                     */
                    var $parentDynamicScope = this.getParentDynamicScope($scope);
                    var dynamicIdx = null;
                    var $childDynamicScope = null;

                    //不存在上级动态行
                    if($parentDynamicScope != null){
                        var pIdx = $parentDynamicScope.$originIndex();
                        dynamicIdx = [pIdx, _finalIdx+1];
                    }else {
                        //判断是否存在子动态行，如果存在说明是操作父动态行 TODO 一级动态行删除时应该没有cIdx
                        $childDynamicScope = this.getChildDynamicScope($scope);
                        if($childDynamicScope != null){
                            dynamicIdx = [_finalIdx+1,$childDynamicScope.$originIndex()];
                        }else{
                            dynamicIdx = [_finalIdx+1];
                        }
                    }

                    // 4、获取当前动态行的数据模型，无法获取到新增行的scope
                    if(undefined != $scope['_arr_' + _keyword]) {
                        _jpaths = $scope['_arr_' + _keyword];

                    	//当在中间增加行时，需要替换新增行后面行的下标，即下标都要加一，替换校验公式和控制公式的下标
                    	var tt=parent.formulaEngine.idxVariable2NoPass; // 校验未通过jpath
            			var cc=parent.formulaEngine.idxVariable2Control;// 控制公式jpath

                        // 当有10w条数据时，replace相当耗性能，故改用jpath前中后缀拼接下标的方式替换replace方法；由2s--优化到-->700ms。更优的方案应该是遍历idxVariable2NoPass，idxVariable2Control
                        // 根据下标切分jpath字符串，切分后分别保存前中后缀。[{p:'jpath前缀',c:'jpath中段',s:'jpath后缀'}]
                        var _jpaths_fixs = this.getJpathFixs(_jpaths);

                        var oJpath, nJpath;
                        var temJpObj;
                        // TODO 应该只需要遍历idxVariable2NoPass，idxVariable2Control，而不需要遍历每个格子
                        /*
                         * ============== 增加注释：2018-08-07 huangpeiyuan =============
                         *
                         * 如果此处遍历不去遍历每个格子，改成遍历 idxVariable2NoPass, idxVariable2Control。
                         * 有问题要处理：
                         * 增行后，idxVariable2NoPass, idxVariable2Control 这里面的jpath下标需要调整。要怎么调整。
                         * 原先 idxVariable2NoPass，idxVariable2Control 保存的旧的下标，此时需要更新准确下标的。
                         * 目前可以获取参数有,当前行初始化时的jpath,当前行，新增行的下标，需要把旧jpath调整准确。
                         * 修改实现逻辑：取得当前行的增行下标. idxVariable2NoPass，idxVariable2Control 遍历，把大于等于jpath下标+1;
                         *
                         * 此处实现逻辑，进行全部调整。
                         * 1.取增行的新数组，遍历，从末尾遍历到当前增行的下一个位置（代码上处理： _finalIdx + 2）
                         * 2.由于这部分需要调整，生成旧jpath,和新的jpath,
                         * 3.把 idxVariable2NoPass，idxVariable2Control 旧的jpath替换新的jpath
                         * 如果当前数组m,数组中的对象 有n个属性。该计算过程O(m*n),性能比较低
                         */
                        // 此处没有调整子动态行的下标
                        // TODO 应该只需要遍历idxVariable2NoPass，idxVariable2Control，而不需要遍历每个格子
                        // 此处没有调整子动态行的下标
                        for (var j = $scope[_keyword].length - 1; j >= _finalIdx + 2; j--) {
                            for (var i=0,l= _jpaths_fixs.length;i<l;i++) {
                                //当调整子动态行的时候就会出现两级动态行下标
                                //oJpath=_jpaths[i].replace('[0]','['+(j-1)+']').replace('[99999]','['+(dynamicIdx[0])+']');
                                //nJpath=_jpaths[i].replace('[0]','['+(j)+']').replace('[99999]','['+(dynamicIdx[0])+']');
                                // 当有10w条数据时，replace相当耗性能，故使用以下方式替换replace方法；由2s--优化到-->700ms。更优的方案应该是遍历idxVariable2NoPass，idxVariable2Control
                                temJpObj = this.getONPath(_jpaths_fixs[i],j,-1);
                                oJpath = temJpObj[0];
                                nJpath = temJpObj[1];

                                if (tt[oJpath])
                                    tt[nJpath] = tt[oJpath];
                                if (cc[oJpath])
                                    cc[nJpath] = cc[oJpath];
                                //需要把这些调整了下标的公式添加到idxVariable2NoPass TODO
                                delete tt[oJpath];
                                delete cc[oJpath];
                            }
                        }

                        //寻找子动态行 TODO
                        var temFormulObjects = {}, temList = [];
                        if($childDynamicScope != null ){

                            // 3、调整数据模型
                            if($childDynamicScope != null ){
                                this.clearKeyWord($scope,_keyword);
                            }

                            var $nextScope = $scope.$$nextSibling;
                            var temFormulObjects = []
                            do{
	                    		if($nextScope !== null){
		                    		var c$scope = $nextScope.$$childHead;
		                    		do{
		                    			//循环查找到子动态行的jpath
				                    	for(var v in c$scope) {
				                    		//子scope有_arr_ 说明他是子动态行，或者动态行本身
				                    		if(v !== "_arr_" && v.indexOf("_arr_") == 0){
				                    			//是否存在属性
				                    			if(c$scope.hasOwnProperty(v)){
				                    				c_jpaths = c$scope[v];
				                    				//获取子动态行的jpath
				                    				var len = $scope[_keyword][$nextScope.$originIndex() + 1][v.replace("_arr_","").replace("lbVO","")][v.replace("_arr_","")].length;
				                    				for(var k=0; k < len; k++){
				                    					for(var i=0,l= c_jpaths.length;i<l;i++) {
	        		                    					temFormulObjects.push({ "jpath" : c_jpaths[i], "val":this.value, "params" : [$nextScope.$originIndex(),k] });
						                            	}
				                    				}
				                    			}
				                    		}
				                    	}
				                    	c$scope = c$scope.$$nextSibling == null?null:c$scope.$$nextSibling.$$childHead;//目前通过兄弟元素获取不到对应的动态行，故暂时这样处理
			                    	}while(c$scope != null);
		                    		$nextScope = $nextScope.$$nextSibling;
		                    	}
                    		}while($nextScope != null);
                    		
                    		// 调整子动态行的下标
                        	// 新添加一行的数据模型
                        	// 当前scope的下一个scope
                            for(var k = temFormulObjects.length-1, temObj; k>0; k--){
                                temObj = temFormulObjects[k];
                                oJpath=temObj.jpath.replace('[0]','['+(temObj.params[1])+']').replace('[99999]','['+(temObj.params[0])+']');
                                nJpath=temObj.jpath.replace('[0]','['+(temObj.params[1])+']').replace('[99999]','['+(temObj.params[0]+1)+']');
                                if(tt[oJpath])
                                    tt[nJpath]=tt[oJpath];
                                if(cc[oJpath])
                                    cc[nJpath]=cc[oJpath];
                                //需要把这些调整了下标的公式添加到idxVariable2NoPass TODO
                                delete tt[oJpath] ;delete cc[oJpath] ;
                            }

                            //执行新增行的子动态行的公式 TODO 目前不能正确的找到新增行子动态行的下标，需要结合obj对象来处理，暂时不处理
                            /*$.each(temFormulObjects,function(id, obj){
                                //
                                var tmp_jpaths = obj.jpath.replace('[0]','['+(obj.params[1])+']')
                                    .replace('[99999]','['+(obj.params[0])+']');
                                parent.formulaEngine.apply(tmp_jpaths, obj.val, obj.params);
                            });*/

                        }

                        // 此方法是用来做什么的，为什么要执行第0行的公式？ 经与申报组黄健商量先去掉
                        /*for(var i=0,l= _jpaths.length;i<l;i++) {
                            //新增子动态行时需要将99999替换为 TODO
                            var tmp_jpaths = _jpaths[i];
                            if(_jpaths[i].indexOf('[99999]') > -1){
                                tmp_jpaths=_jpaths[i].replace('[99999]','[0]');
                                parent.formulaEngine.apply(tmp_jpaths, this.value, [0,0]);
                            }else{
                                parent.formulaEngine.apply(tmp_jpaths, this.value, [0]);
                            }
                        }*/

                        // 执行新增的行的公式
                        var ldPos, field, newJpath;
                        //新增子动态行时需要将99999替换为 TODO
                        for(var i=0,l= _jpaths.length;i<l;i++) {
                            // 2、执行新增行的公式
                            //最后一个“.”在字符串中的下标
                            ldPos=_jpaths[i].lastIndexOf('.')+1;
                            //最后节点的名称
                            field=_jpaths[i].substring(ldPos);
                            //替换下标
                            if(_jpaths[i].indexOf('[99999]') > -1){
                                newJpath=_jpaths[i].replace('[0]','['+(dynamicIdx[1])+']')
                                    .replace('[99999]','['+(dynamicIdx[0])+']');
                            }else{
                                newJpath=_jpaths[i].replace('[0]','['+(_finalIdx+1)+']');
                            }
                            // eval('('+obj+')')[field]:获取动态行节点的默认值，并执行公式
                            parent.formulaEngine.apply(newJpath,  eval('('+obj+')')[field], dynamicIdx);
                        }

                        viewEngine.tipsForVerify2(document.body);
                    }


                    /*
                     * 不分页,但存在过滤，需要调整界面jpath下标
                     * 如果使用分页,则通过pagination监控conf属性去触发该事件。
                     */
                    if(!_paginationId  && _filterArrId){
                        $timeout(function(){
                            viewEngine.updateJpath($element.parent())
                        });
                    }

                }


                //这个暂时提供给通用代扣代缴使用，可以考虑做成通用的
                $scope.ajaxByNsrshbaa=function(idx,obj){
                    $scope.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idx].bdkdjdsdjnsrmc="";
                    $scope.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idx].rdSfzrdxxs="";
                    if(obj=='')return;
                    var url =  "/web-sbzs/NsrxxByNsrsbh/ajaxByNsrshb.do";
                    $.ajax({
                        data:{nsrsbh:obj},
                        url:url,
                        success:function(msg){
                            layer.closeAll();
                            if(msg.code=='000'){
                                layer.msg('数据成功加载,请点击任意继续。。。', {icon: 1});
                                var bodyM = eval("("+msg.body+")");
                                $scope.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idx].bdkdjdsdjnsrmc=bodyM.nsrMc;
                                $scope.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idx].rdSfzrdxxs=bodyM.rdSfzrdxxs;
                            }else if(msg.code=='002'){
                                $scopeTemp = $scope;
                                idxTemp=idx;
                                var nsrxxs = eval("("+msg.body+")");
                                var html='<html><head></head><body><div class="NewTableMain"><table width="98%" border="0" cellpadding="0" cellspacing="1"><tr><td align="center" class="title01"  style="width: 10%; ">选择</td><td align="center" class="title01"  style="width: 45%; ">主管机构名称</td><td align="center" class="title01"  style="width: 45%; ">注册地址</td></tr>';
                                for(var i=0;i<nsrxxs.length;i++){
                                    html+='<tr><td class="edit right" ><input type="radio" name="djxh" onclick=selecteDjxh("'+nsrxxs[i].nsrsbh+'","'+nsrxxs[i].djxh+'","'+nsrxxs[i].swjgDm+'")></td><td class="edit right" >'+nsrxxs[i].swjgMc+'</td><td class="edit right" >'+nsrxxs[i].zcdz+'</td></tr>';
                                }
                                html+='</table></div></body></html>';
                                //页面层
                                var index = layer.open({type:1,shadeClose: true,area: ['600px', '240px'], content:html,cancel: function(){
                                        var frame = parent.document.getElementById("frmSheet");
                                        var domDocument = frame.contentWindow.document.body;
                                        $(".layui-layer-shade",domDocument).remove();
                                        layer.closeAll();}});
                            }else{
                                layer.msg('数据加载失败,请留意错误信息，必要请联系管理员！', {icon: 5});
                                dhtmlx.message(msg.msg, "error", 5000);
                            }
                        },
                        error:function(){
                            layer.closeAll();
                            dhtmlx.message("请求失败 ", "error", 5000);
                        }
                    });
                }

                $scope.del=function(idx){

                    //说明存在分页的情况,分页不考虑2级动态行的情况
                    var _finalIdx = this.$originIndex();

                    // //这里修改了同一个界面,可以用多个分页。取得的conf修改根据id获取。
                    // var conf;
                    // if(_paginationId){
                    //     conf= $scope.$parent.conf[_paginationId];
                    // }
                    // //如果时分页,则改成分页后的下标
                    // if(conf){
                    //     _finalIdx = (conf.currentPage-1)*conf.itemsPerPage + this.$index;
                    // }
                    // 1、删除数据模型的一行数据
                    $scope[_keyword].splice(_finalIdx,1);

                    // 2、获取父动态行，最终目的是组装出动态行下标
                    var $parentDynamicScope = this.getParentDynamicScope($scope);
                    var $childDynamicScope;
                    var dynamicIdx = null;
                    if($parentDynamicScope != null){//存在父动态行，则说明是操作子动态行
                        dynamicIdx = [$parentDynamicScope.$originIndex(), _finalIdx];
                    }else {
                        //判断是否存在子动态行，如果存在说明是操作父动态行 TODO 一级动态行删除时应该没有cIdx
                        $childDynamicScope = this.getChildDynamicScope($scope);
                        if($childDynamicScope != null){
                            dynamicIdx = [_finalIdx,$childDynamicScope.$originIndex()];

                        }else{
                            dynamicIdx = [_finalIdx];
                        }
                    }


                    //获取当前动态行的jpath
                    if(undefined != $scope['_arr_' + _keyword]) {
                        _jpaths = $scope['_arr_' + _keyword];

                        // 根据下标切分jpath字符串，切分后分别保存前中后缀。[{p:'jpath前缀',c:'jpath中段',s:'jpath后缀'}]
                        var _jpaths_fixs = this.getJpathFixs(_jpaths);
                        //删除中间的动态行时，需要重新调整下标,即删除行下面的公式下标要减一：针对校验公式和控制公式
                        // TODO 应该只需要遍历idxVariable2NoPass，idxVariable2Control，而不需要遍历每个格子
                        var oJpath,nJpath;
                        var tt=parent.formulaEngine.idxVariable2NoPass;
                        var cc=parent.formulaEngine.idxVariable2Control;
                        var temJpObj;
                        for(var j = _finalIdx, len=$scope[_keyword].length ;j<=len ;j++){

                            //jpaths数组存在重复jpathd的情况，故要删除和调整下标要分开
                            if(j == _finalIdx){
                                for(var i=0,l= _jpaths.length;i<l;i++){
                                    //剔除删除行的控制和校验结果
                                    var tmp_jpaths;
                                    if(dynamicIdx.length == 2){
                                        tmp_jpaths = _2DDynamicReplace(_jpaths[i],dynamicIdx);
                                    }else{
                                        tmp_jpaths = _jpaths[i].replace(/\[\d+\]/g,"["+ _finalIdx +"]");
                                    }
                                    //为什么还要删除校验不通过的公式及其关联公式
                                    parent.formulaEngine.deleteIdxVariableNoPass(tmp_jpaths,dynamicIdx);
                                }
                            }

                            //调整剩余行的下标
                            for(var i=0,l= _jpaths_fixs.length;i<l;i++){
                                //调整删除行以下行校验不通过的公式下标减去一
                                /*if(dynamicIdx.length == 2 && $childDynamicScope !== null ){
                                    //删除动态行是，存在子动态行的情况，即此时的jpath是两级动态行
                                    oJpath=_jpaths[i].replace('[0]','['+(j+1)+']').replace('[99999]','['+dynamicIdx[0]+']');
                                    nJpath=_jpaths[i].replace('[0]','['+(j)+']').replace('[99999]','['+dynamicIdx[0]+']');
                                }else{//删除子级动态行或只有一级动态行时调整JPATH公式下标
                                    oJpath=_jpaths[i].replace('[0]','['+(j+1)+']');
                                    nJpath=_jpaths[i].replace('[0]','['+(j)+']');
                                }*/
                                //当调整子动态行的时候就会出现两级动态行下标
                                // 当有10w条数据时，replace相当耗性能，故使用以下方式替换replace方法；由2s--优化到-->700ms。更优的方案应该是遍历idxVariable2NoPass，idxVariable2Control
                                temJpObj = this.getONPath(_jpaths_fixs[i],j,1);
                                oJpath = temJpObj[0];
                                nJpath = temJpObj[1];

                                if(tt[oJpath])
                                    tt[nJpath]=tt[oJpath];
                                if(cc[oJpath])
                                    cc[nJpath]=cc[oJpath];
                                delete tt[oJpath] ;delete cc[oJpath] ;
                                //调整下标为什么要执行公式  TODO ?
                                //parent.formulaEngine.apply(_jpaths[i], this.value, dynamicIdx);
                            }
                        }

                        //有两级动态行时，需要寻找子动态行进行处理
                        var temFormulObjects = {}, temList = [];
                        if($childDynamicScope != null){

                            //调整数据模型
                            this.clearKeyWord($scope,_keyword);

                            //
                            var c$scope = $scope.$$childHead;
                            //循环遍历所有子动态行的行
                            var tmpArr, _arr_tmpArr;
                            //遍历scope的_arr_
                            do{
                                if(c$scope["_arr_"] != null
                                    && typeof c$scope["_arr_"] != "undefined"){
                                    for(var x=0,l= c$scope._arr_.length;x<l;x++){//遍历子scope的arr数组
                                        _arr_tmpArr = c$scope._arr_[x];
                                        tmpArr = c$scope._arr_[x].replace('_arr_','');
                                        if(c$scope.hasOwnProperty(_arr_tmpArr)){//判断子scope是否有此属性
                                            //子动态行的jpath
                                            c_jpaths = c$scope[_arr_tmpArr];
                                            //子动态行的行数
                                            if(c$scope[tmpArr]){
                                                for(var j=0, len = c$scope[tmpArr].length; j < len ; j++){
                                                    for(var i=0,l= c_jpaths.length;i<l;i++) {
                                                        temFormulObjects[c_jpaths[i] +";"+ this.value +";"+ [dynamicIdx[0],j]] =  { "jpath" : c_jpaths[i], "val":this.value, "params" : [dynamicIdx[0],j] };
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                //目前通过兄弟元素获取不到对应的动态行，故暂时这样处理
                                c$scope = c$scope.$$nextSibling == null?null:c$scope.$$nextSibling.$$childHead;
                            }while(c$scope != null);

                            //执行删除子动态行的公式
                            $.each(temFormulObjects,function(id, obj){
                                // 1、
                                if(obj.params[0] == dynamicIdx[0] ){
                                    var tmp_jpaths = _2DDynamicReplace(obj.jpath, obj.params);
                                    parent.formulaEngine.deleteIdxVariableNoPass(tmp_jpaths, obj.params);
                                }
                            });

                            //此处会重复执行很多此，需要优化 TODO
                            $.each(temFormulObjects,function(id, obj){
                                for(var j=obj.params[0],len = $scope[_keyword].length; j<=len-1 ;j++){
                                    // 2、调整下标
                                    //删除动态行是，存在子动态行的情况，即此时的jpath是两级动态行
                                    oJpath=obj.jpath.replace('[0]','['+(obj.params[1])+']').replace('[99999]','['+(j+1)+']');
                                    nJpath=obj.jpath.replace('[0]','['+(obj.params[1])+']').replace('[99999]','['+j+']');
                                    if(tt[oJpath])
                                        tt[nJpath]=tt[oJpath];
                                    if(cc[oJpath])
                                        cc[nJpath]=cc[oJpath];
                                    delete tt[oJpath] ;delete cc[oJpath] ;
                                }
                            });

                            //此处会重复执行很多此，需要优化 TODO
                            $.each(temFormulObjects,function(id, obj){
                                // 2、执行删除行的公式,删除最后一行时不需要执行删除行的公式
                                if($scope[_keyword].length !== obj.params[0]){
                                    var tmp_jpaths=obj.jpath.replace('[0]','['+(obj.params[1])+']').replace('[99999]','['+(obj.params[0])+']');
                                    parent.formulaEngine.apply(tmp_jpaths, obj.val, obj.params);
                                }

                            });
                            //调整动态行公式下标，如果存在多张附表，是否会把其他动态行公式下标也调整了，故此处应该只调整当前操作附表对应的公式
                            /*var tt=parent.formulaEngine.idxVariable2NoPass;
                            for(var v in tt) {
                                var dynAssign = (/\[\d+\]/.exec(v));
                                var ind = (dynAssign[0]).substr(1,1);
                                var newPath = null;
                                if(ind > $scope.$index ){
                                    newPath = v.replace(/\[\d+\]/,"["+(ind-1)+"]");
                                    parent.formulaEngine.idxVariable2NoPass[newPath] = tt[v];
                                    delete parent.formulaEngine.idxVariable2NoPass[v] ;
                                }
                            }*/

                        }

                        /*
                          这里不只是执行聚合公式,而是重新刷新关联的数据。
                         */
                        //执行第1行公式，触发聚合公式执行
                        for(var i=0,l= _jpaths.length;i<l;i++) {
                            //此处难道是为了触发校验公式和控制公式的执行？ 动态下标必须传第一行
                            var tmp_jpaths = _jpaths[i];
                            if(_jpaths[i].indexOf('[99999]') > -1){
                                tmp_jpaths=_jpaths[i].replace('[99999]','[0]');
                                parent.formulaEngine.apply(tmp_jpaths, this.value, [0,0]);
                            }else{
                                parent.formulaEngine.apply(tmp_jpaths, this.value, [0]);
                            }
                        }



                        //使用旧的校验公式渲染界面，即通过遍历界面的input元素
                        viewEngine.tipsForVerify2(document.body);
                    }

                    /*
                     * 不分页,但存在过滤，需要调整界面jpath下标
                     * 如果使用分页,则通过pagination监控conf属性去触发该事件。
                     */
                    if(!_paginationId  && _filterArrId){
                        $timeout(function(){
                            viewEngine.updateJpath($element.parent())
                        });
                    }

                }

                /**
                 * 针对文书提交给核心的请求报文，删除操作，不能直接把该行的数据模型给删掉，
                 * 需要把该行的数据内容提交至核心【例如，UUID节点】，故增加此方法。
                 * 如果是界面上点击【增加】操作增加的数据模型节点，可以删掉。
                 *
                 * 使用时注意：使用此方法，数据模型里面必须包含isDeleteTr节点，不然作用和del()方法一致。
                 */
                $scope.wsdel=function(idx){
                	idx=this.$originIndex();
                    // 校验所有数据
                    try {
                        if(typeof(wsdelcheck)==='function'){
                            if(wsdelcheck(idx)){
                                return;
                            }}
                    }catch(e){

                    }
                    var sfsctips=false;//是否删除校验不通过提示信息
                    if(undefined == $scope['_arr_' + _keyword]) {
                        $scope[_keyword].splice(this.$originIndex(),1);//删掉该行数据模型
                        sfsctips=true;
                    }else{
                        if($scope[_keyword][idx].isDeleteTr===undefined||$scope[_keyword][idx].isDeleteTr===''){
                        	if($scope[_keyword].length==1){
                        		$scope[_keyword].splice(0,1);//清空数据
                        		$scope[_keyword].splice(0,0,JSON.parse(obj.replace(/\\/g,'')));//赋值初始化默认首行数据
                        	}else{
                        		 $scope[_keyword].splice(this.$originIndex(),1);//删掉该行数据模型
                        	}
                            sfsctips=true;
                        }else{
                            /**
                             * 如果isDeleteTr【数据作废标志】不为Y时，把按钮删除替换为恢复按钮，
                             * 同时把数据作废标志置为Y，锁定该行所有的输入控件，方便纳税人操作。
                             * 避免纳税人误删，纳税人可点击恢复按钮及时恢复。
                             */
                        	var _jpathLast;
							var lockDynamic=$scope[_keyword][idx].lockDynamic;
                            if(!$scope[_keyword][idx].isDeleteTr||$scope[_keyword][idx].isDeleteTr==='N'){
//                				sfsctips = true;
                                $scope[_keyword][idx].isDeleteTr='Y';
                                
                                ($element).children().find('.layui-btn-danger').html('恢复');
                                $(($element).children().children()).each(function(i){
                                    //跳过增加、删除按钮,控件锁定
                                    var _jpath = $(this).attr("jpath");
                                    if(_jpath){
										if(lockDynamic===undefined){
											viewEngine.setDynamicElementEditFlag(this,true);
										}
                                    	parent.formulaEngine.apply(_jpath, '');
                                    	if(!_jpathLast){
                                    		_jpathLast=_jpath.split('\].')[0]+'].isDeleteTr';
                                    	}
                                    }
                                });
                            }else if($scope[_keyword][idx].isDeleteTr==='Y'){
                                $scope[_keyword][idx].isDeleteTr='N';
                                ($element).children().find('.layui-btn-danger').html('删除');
                                var _jpath;
                                $(($element).children().children()).each(function(i){
                                    //跳过增加、删除按钮，数据恢复之后，要重新计算校验规则公式
                                    _jpath = $(this).attr("jpath");
                                    if(_jpath!=undefined){
										if(lockDynamic===undefined){
											viewEngine.setDynamicElementEditFlag(this,false);
										}
                                    	//$(this).removeAttr("disabled");
                                    	parent.formulaEngine.apply(_jpath, '');
                                    	if(!_jpathLast){
                                    		_jpathLast=_jpath.split('\].')[0]+'].isDeleteTr';
                                    	}
                                    }
                                });
                            }
                            if(_jpathLast){
                            	parent.formulaEngine.apply(_jpathLast, '');
                            }
                            viewEngine.tipsForVerify2(document.body);
                        }
                    }
                    if(undefined != $scope['_arr_' + _keyword]) {
                        if(sfsctips){
                            _jpaths = $scope['_arr_' + _keyword];
                            for(var i=0,l= _jpaths.length;i<l;i++) {
                                parent.formulaEngine.apply(_jpaths[i], this.value);
                                parent.formulaEngine.deleteIdxVariableNoPass(_jpaths[i].replace(/\[\d+\]/g,"["+ this.$originIndex() +"]"));
                                viewEngine.tipsForVerify($element);
                            }
							//多加下面这两行原因，动态行渲染最后一格老是失效，VPN正常，基线不正常，待框架调整至基线在去掉以下两行代码。
							parent.formulaEngine.apply("taxML.xh", "");
                            viewEngine.tipsForVerify($element);
                            for(var j=this.$originIndex();j<=$scope[_keyword].length-1 ;j++)
                                for(var i=0,l= _jpaths.length;i<l;i++)
                                {
                                    var oJpath=_jpaths[i].replace('[0]','['+(j+1)+']');
                                    var nJpath=_jpaths[i].replace('[0]','['+(j)+']');
                                    var tt=parent.formulaEngine.idxVariable2NoPass;
                                    var cc=parent.formulaEngine.idxVariable2Control;
                                    if(tt[oJpath])
                                        tt[nJpath]=tt[oJpath];
                                    if(cc[oJpath])
                                        cc[nJpath]=cc[oJpath];
                                    delete tt[oJpath] ;delete cc[oJpath] ;
                                }
                            //TODO 应该有更好的方案
                            viewEngine.tipsForVerify2(document.body);
                        }
                    }
                }
                if ($scope.$last == true) {
                    //console.log('ng-repeat执行完毕');
                    $scope.$eval(renderFinish);
                }

                /*
                 * 不分页,但存在过滤，需要调整界面jpath下标
                 * 如果使用分页,则通过pagination监控conf属性去触发该事件。
                 */
                if(!_paginationId  && _filterArrId){
                    $timeout(function(){
                        viewEngine.updateJpath($element.parent())
                    });
                }
                
            }
        }
    });
    
    /**
     *自定义指令ngJprefix
     */
    viewApp.directive('ngJprefix', function () {
        return {
            require: '?^viewCtrl',
            link: function ($scope, $element, $attr) {
            	//SB100VO.SB100BdxxVO.cjbdxml.sycjtzcfzb.sycjtjjnsrxxForm
                var _jprefixs = $element.attr('ng-jprefix');//二选一
                //_jprefixs = $attr(ngJprefix);
                if(undefined != _jprefixs && "" != _jprefixs) {
                	if(_jprefixs.length>2 && _jprefixs.substr(0,2) == "$$"){
                		_jprefixs = _jprefixs.replace("$index",$scope.$index).substr(2);
                		//_jprefixs = $scope.$eval(_jprefixs.substr(2));
                	}
                }
                if(undefined != _jprefixs && "" != _jprefixs) {
                    var _brePath = _jprefixs.substr(_jprefixs.lastIndexOf('\.') + 1);
                    if('formData' == _jprefixs) {//此情形为json模型只有一层，没有prefixs
                        $scope["_jprefix_" + _brePath] = '';
                    } else {
                        $scope[_brePath] = jsonPath($scope.formData, _jprefixs)[0];
                        $scope["_jprefix_" + _brePath] = _jprefixs;
                        if($scope._jprefix_ == null || typeof $scope._jprefix_ == "undefined"){
                        	$scope['_jprefix_'] = [];
                        }
                        $scope._jprefix_.push(_brePath);
                    }
                } else {
                    $scope["_jprefix_formData"] = '';
                }

                viewEngine.bindEventsForElements($scope, $element);
            }
        }
    });

    /**
     * 自定义初始化代码表指令
     */
    viewApp.directive('ngCodetableInit', function(){
        return {
            require: '?^viewCtrl',
            priority: 100,
            scope: true,
            /*            link: function ($scope, $element, $attr) {var _attr = $element.attr("ng-codetable-init");var _xpath = _attr.split(',')[0];var _sattr = _attr.split(',')[1];
             $.when($.getJSON(_xpath)).then(function(response){$scope[_sattr] = response.root;});
             }*/
            compile: function (element, attributes){
                return {
                    pre: function preLink($scope, $element, attributes) {
                        var _attr = $element.attr("ng-codetable-init")
                        var _xpath = _attr.split(',')[0];
                        var _sattr = _attr.split(',')[1];
                        var _data;
                        $.when($.getJSON(_xpath)).then(function(response){
                            $scope[_sattr] = response.root;
                            _data = response.root;
                            viewEngine.formApply($('#viewCtrlId'), _sattr, _data);
                        });
                    },
                    post: function postLink($scope, $element, attributes) {
                    }
                }
            }
        }
    });

    /**
     * 自定义初始化代码表指令
     * 带缓存
     */
    viewApp.directive('ngCodetable', function(){
        return {
            require: '?^viewCtrl',
            priority: 100,
            restrict : "E",
            scope: true,
            compile: function (element, attributes){
                return {
                    pre: function preLink($scope, $element, attributes) {
                        if($element.attr("id")){
                            var _id = "_" + $element.attr("id");
                            if(!parent.formCT[_id]){
                                var _values = {};
                                _values.name = $element.attr("name");
                                _values.attributes = attributes;
                                parent.formEngine.cacheCodeTable(_id, _values);
                            }
                        }
                        initCodeTable($scope, attributes);
                    },
                    post: function postLink($scope, $element, attributes) {
                    }
                }
            }
        }
    });

    /**
     * 自定义检测渲染完成指令
     * 在ngCtrl所在DOM元素的子元素下使用
     */
    viewApp.directive('ngRenderFinish', ['$timeout',function($timeout) {
        return {
            scope: {
                finished: '=isFinish'
            },
            link: function ($scope, $element, $attr) {
                var asyncCallTipsForVerify2 = function(){
                    var rootScope = angular.element($('#viewCtrlId')).scope();
                    if(parent.flagExcuted && !rootScope.$$phase){
                        viewEngine.tipsForVerify2(document.body);
                        try {
                            //事项受理隐藏页面的按钮
                            viewEngine.hideButtons();
                        } catch(e){}
                        try {
                            // 单元格关联表单间跳转定位，渲染完成后才有风险扫描信息显示 C.Q 20170320
                            viewEngine.focusEle();
                        } catch(e){}
                        var _start_ = parent.formEngine._start_;
                        var _end_ = new Date().getTime();
                        // 当公式执行时间小于7秒才上传编译好的公式
                        if((_end_ - _start_) < 7000){
                            // 1、上传前端编译成功的公式
                            parent.formulaEngine.cacheCompiledRules();
                        }
                        parent.isNgFinish = true;
                        console.log("INFO:"+_start_+ "-" +_end_ + "-" +(_end_ - _start_)+ "ms 总耗时，公式");
                        // 判断是否存在该方法，只有云上税局js有实现CLOUDTAX-1324
                        if (typeof parent.autoSaveYsdj === "function") {
                        	parent.autoSaveYsdj();
                        }
                        parent.judgeAndUnlockedAllForms();//判断是否全表解除单元格锁定,是则解锁所有单元格
                    }else{
                       $timeout(function(){
                           asyncCallTipsForVerify2();
                       },10);
                    }
                };

                asyncCallTipsForVerify2();
                parent.autoResizeIframe("frmSheet");
            }
        }
    }]);


    /**
     * 修改人：huangpeiyuan
     * 修改时间：2018-07-17
     * 修改内容：支持传json对象参数，并支持回调函数使用
     * 自定义laydate日期控件指令
     * <input type="text" class="laydate-icon" id="sssqQ" ng-laydate="{}" ng-model="formData.sssq.rqQ">
     * id为必传参数
     */
    viewApp.directive('ngLaydate', ['$filter',function($filter) {
        var dateFilter = $filter('date');
        return {
            require: 'ngModel',//控制器是指令标签对应的ngModel
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs, ctrl) {
                /**
                 * 默认值参数初始化,优先级别， attr属性 > ng-laydate 属性
                 */
                if(!element[0].id){
                    element[0].id= "fs"+getUUID()+new Date().getTime();
                }

                //layDate插件默认最小日期 覆写此属性可变更可选时间区间
                var minDateDefault = "1900-01-01";
                //layDate插件默认最大日期  覆写此属性可变更可选时间区间
                var maxDateDefault = "2099-12-31";
                //视图格式 view 日期格式
                var formatDefault = 'yyyy-MM-dd';
                // 日期类型
                var  dateTypeDefault = 'date';
                // 日期 左右面板范围选择  Boolean/String，默认值：false
                var rangeDefault = false;

                /*
                * 是否在改变后关闭弹框,只作用在非date日期类型上
                * 类型：year,month
                */
                var isChangedCloseDefault = true;


                //打开日期
                var readyDefaultFn=function(){}
                //改日期
                var changeDefaultFn=function () {}
                //确定日期
                var doneDefalutFn=function(){}

                //model数据模型格式,默认yyyy-MM-dd
                var sourecFormatDefault=formatDefault;


                var ngLaydateAttr = attrs.ngLaydate;
                var _format = formatDefault;

                /**
                 * 根据函数名,找到该函数,用于layDate的回调函数
                 * @param nameFn
                 * @returns {fn}
                 */
                function attachFn(nameFn) {
                    var fn = function (){};
                    if (nameFn) {
                        try {
                            var evalFn = eval(nameFn);
                            if (evalFn && angular.isFunction(evalFn)) {
                                fn = evalFn;
                            }
                        } catch (e) {
                            throw "ERROR[" + e + "],nglaydate 解析 " + nameFn + " 函数失败！";
                        }
                    }
                    return fn;
                }


                /**
                 *  判断ngLaydate值,是字符串，还是json对象
                 *  原先旧值 是传入字符串,用于 _format
                 *  增加可以传入json ,支持其他属性替换
                 */
                if (ngLaydateAttr) {
                    try{
                        //解析是否json串对象
                        var ngLaydateJSON =angular.fromJson(ngLaydateAttr);
                        _format = ngLaydateJSON.format ? ngLaydateJSON.format : formatDefault;
                        minDateDefault = ngLaydateJSON.min ? ngLaydateJSON.min : minDateDefault;
                        maxDateDefault = ngLaydateJSON.max ? ngLaydateJSON.max : maxDateDefault;
                        dateTypeDefault = ngLaydateJSON.type ? ngLaydateJSON.type : dateTypeDefault;
                        rangeDefault = ngLaydateJSON.range ? ngLaydateJSON.range : rangeDefault;
                        sourecFormatDefault = ngLaydateJSON.ngModelFormat ? ngLaydateJSON.ngModelFormat : _format;
                        isChangedCloseDefault = ngLaydateJSON.isChangedClose ? ngLaydateJSON.isChangedClose : isChangedCloseDefault;
                        readyDefaultFn =   attachFn(ngLaydateJSON.ready);
                        changeDefaultFn = attachFn(ngLaydateJSON.change);
                        doneDefalutFn = attachFn(ngLaydateJSON.done);

                    }catch (e) {
                        //解析是否string 对象
                        var reg = /[^\{]+[^\}]/;
                        var result = reg.exec(ngLaydateAttr);
                        if (result) {
                            _format = result[0];
                        }
                    }
                }


                //显示到view 进行的操作,laydate,初始化填值
                function formatter(value) {
                    if(typeof value === "undefined"){
                        return "";
                    }else if(value.length >4){
                        //过滤器入参是date,时间戳,或者ISO8601日期格式比如2018-01-01
                        return dateFilter(value, _format); //format
                    }else{
                        //如果只有年度，不需要格式化  直接显示2017
                        return value;
                    }
                }

                //数据双向绑定时，把view值传到model时触发
                function parser(value) {
                    var v=ctrl.$viewValue;
                    if(v === undefined){
                        return "";
                    }else{
                        //数据线模型,格式化
                        if(sourecFormatDefault && sourecFormatDefault!=_format){
                            if(!/\d{4}-\d{2}-\d{2}/.test(v)){
                                v=str2Date(v, _format);//先把字符串时间格式化成date类型
                            }
                            v =dateFilter(v,sourecFormatDefault);//再进行格式化
                        }
                        return v;
                    }
                }

                ctrl.$formatters.push(formatter);  //结尾插入
                ctrl.$parsers.unshift(parser);   //首位插入
                element.val(ctrl.$viewValue);

                /**
                 * 修改日志: layDate 控件增加时间区间属性。
                 * 属性书写样例： ng-laydate-min="syxxForm.skssqq" ng-laydate-max="2030-12-31"
                 * 取值有两种，一种，静态日期格式。一种动态变量格式，类同于ng-model。
                 * 修改关键点1、关于指令编译顺序。
                 * 关键点2：指令变量格式区分。
                 */
                element.on({
                    "mouseover click" : function(event){
                        var minDate = minDateDefault;
                        var maxDate = maxDateDefault;
                        //关键点:1、 因ngJprefix 指令编译顺序在ngLaydate之后，所以此部分逻辑在点击事件时执行。
                        if(attrs.ngLaydateMin){
                            // 增加对变量兼容。取值类同于ng-model的变量。
                            //minDate = scope.$eval(attrs.ngLaydateMin);
                            var reg = /\d{4}-\d{2}-\d{2}/;
                            var result =reg.exec(attrs.ngLaydateMin);
                            if(!result){
                                minDate = scope.$eval(attrs.ngLaydateMin);
                            }else{
                                minDate = attrs.ngLaydateMin;
                            }
                            //关键点:2、$eval解析失败。取默认值
                            if(!minDate){
                                minDate = minDateDefault;
                            }
                        }

                        if(attrs.ngLaydateMax){
                            // 增加对变量兼容。取值类同于ng-model的变量。
                            //maxDate = scope.$eval(attrs.ngLaydateMax);
                            var reg = /\d{4}-\d{2}-\d{2}/;
                            var result =reg.exec(attrs.ngLaydateMax);
                            if(!result){
                                maxDate = scope.$eval(attrs.ngLaydateMax);
                            }else{
                                maxDate = attrs.ngLaydateMax;
                            }
                            //关键点:2、$eval解析失败。取默认值
                            if(!maxDate){
                                maxDate = maxDateDefault;
                            }
                        }


                        //日期范围的类型，默认为date
                        var dateType = $(element).attr("dateType");
                        /*
                         * type - 控件选择类型:year	年选择器	只提供年列表选择
                         *                month	年月选择器	只提供年、月选择
                         *                date	日期选择器	可选择：年、月、日。type默认值，一般可不填
                         *                time	时间选择器	只提供时、分、秒选择
                         *                datetime	日期时间选择器	可选择：年、月、日、时、分、秒
                         * */
                        if(dateType ==null || dateType===undefined || dateType === ""){
                            dateType = dateTypeDefault;
                        }

                        var range = $(element).attr("range");
                        //时间控件，选择时间范围参数，true为是时间范围的时间控件，
                        // 如所属期起止“2018-01-01 - 2018-01-31”，false为单个时间：如所属期起“2018-01-01”
                        if(range==null || range==undefined || range=="" || range!="true" || (!range)){
                            range = rangeDefault;
                        }else{
                            range = true;
                        }

                        $(element).addClass("layui-date-input");
                        layui.use('laydate', function() {
                            var laydate = layui.laydate;

                            laydate.render({
                                ctrl:ctrl,//表单引擎特有属性【非必填选项】
                                jpath:$(element).attr("jpath"),//表单引擎特有属性【非必填选项】
                                isChangedClose:isChangedCloseDefault,//当改变切换日期时,是否关闭弹框,一般用在type='year,month'
                                elem: '#'+element[0].id, //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
                                //event: 'focus', //响应事件。如果没有传入event，则按照默认的click
                                min:minDate,
                                max:maxDate,
                                type:dateType,
                                range:range,
                                // theme:'#1A56A9',
                                //isclear: true, //是否显示清空
                                //istoday: true, //是否显示今天
                                //festival: true, //是否显示节日
                                format:_format,
                                ready:function(date){  //控件在打开时触发
                                    // data 初始的日期时间对象
                                    readyDefaultFn.call(this,date,scope);
                                    //扩展laydate周六日红色文字
                                    taxlaydate();
                                },
                                change:function(value, date, endDate){ //年月日时间被切换时都会触发
                                    // value：得到日期生成的值
                                    // date：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                                    // endDate :得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                                    changeDefaultFn.call(this,value, date, endDate,scope);
                                    //扩展laydate周六日红色文字
                                    taxlaydate();
                                    /**
                                     * 场景：如果日期类型时年，月，日(type='month,year'),当用户点击后，laydate不会自动关闭日期弹框。
                                     * 所以通过这个isChangedClose来控制,当切换时，是否自动关闭弹框
                                     * 当前点击Li对象，才能关闭。
                                     */
                                    if( window.event.srcElement.nodeName =="LI" && (dateType == 'year' || dateType == 'month') && (isChangedCloseDefault=='true' || isChangedCloseDefault==true)){
                                        this.elem.val(value);
                                        this.done(value, date, endDate);
                                        var tempId="layui-laydate"+this.elem.attr('lay-key');
                                        $("#"+tempId).remove();
                                    }
                                },

                                done : function(datas,date,endDate){//选择日期完毕的回调
                                    // datas：得到日期生成的值
                                    // date：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                                    // 得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                                    ctrl.$setViewValue(datas);
                                    var _jpath = $(element).attr("jpath");
                                    var dynamicParams = null;
                                    var l = _jpath.match(/\[\d+\]/g);
                                    if(l != null){
                                        if(l.length === 2){
                                            var pIdx = l[0].replace(']','').replace('[','');
                                            var cIdx = l[1].replace(']','').replace('[','');
                                            dynamicParams = [pIdx,cIdx];
                                        }else{
                                            var idx = l[0].replace(']','').replace('[','');
                                            dynamicParams = [idx];
                                        }
                                    }
                                    //执行关联公式
                                    parent.formulaEngine.apply(_jpath, datas,dynamicParams);
                                    //刷新angular视图
                                    viewEngine.formApply($('#viewCtrlId'));
                                    //刷新校验结果和控制结果
                                    viewEngine.tipsForVerify(document.body);//el

                                    doneDefalutFn.call(this,datas, date, endDate,scope); //调用回调函数
                                }
                            });
                        });
                    }
                });
            }
        };
    }]);

    /**
     * 自定义ngWdate日期控件指令
     * <input type="text" ng-laydate='{"dateFmt":"yyyy"}' ng-model="formData.sssq.rqQ"/>
     * id为必传参数
     */
    viewApp.directive('ngWdate', ['$filter',function($filter) {
        var dateFilter = $filter('date');
        return {
            require: 'ngModel',//控制器是指令标签对应的ngModel
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs, ctrl) {
                var _format = 'yyyy-MM-dd';
                if (attrs.ngWdate) {
                	attrs.ngWdate = eval('(' + attrs.ngWdate + ')');
                    if (attrs.ngWdate.dateFmt) {
                        _format = attrs.ngWdate.dateFmt;
                    }
                }
                
                function formatter(value) {
                	if(value.length >4){
                		return dateFilter(value, _format); //format
                	}else{
                		//如果只有年度，不需要格式化  直接显示2017
                		return value;
                	}
                }
                var paramJson = {
                	onpicked: function(datas){ //选择日期完毕的回调
	                	ctrl.$setViewValue(this.value);
	                    var _jpath = $(element).attr("jpath");
	                    var dynamicParams = null;
	                    var l = _jpath.match(/\[\d+\]/g);
	                    if(l != null){
	                		if(l.length == 2){
	                			var pIdx = l[0].replace(']','').replace('[','');
	            				var cIdx = l[1].replace(']','').replace('[','');
	            				dynamicParams = [pIdx,cIdx];
	                		}else{
	                			var idx = l[0].replace(']','').replace('[','');
	                			dynamicParams = [idx];
	                		}
	                    }
	                    parent.formulaEngine.apply(_jpath, this.value,dynamicParams);
	                    viewEngine.tipsForVerify(document.body);//el
                	},
                	onclearing: function() {
                		// 日期控件清除时，同时清除模型数据
                		ctrl.$setViewValue('');
                	}
                };
                if (attrs.ngWdate) {
                	$.extend(true,paramJson,attrs.ngWdate);
                }
                element.on({ "click" : function(event){
    	                WdatePicker(paramJson);
    					}
    				});
    			}
    		};
    	} ]);
    /**
     * 自定义【jquery-tree】树状下拉级联插件，
     * 
     * <div id="menuContent" class="menuContent"  style="display:none; position: absolute; z-index:9999;">
	 *	<ul id="treeDemo"  class="ztree" style="margin-top:0; width:160px; height:250px; overflow-y: scroll; border: 1px solid #617775;background: #fff;"></ul>
	 * </div>
     * <input type="text" ng-tree='{"url":"tree_xzqh.json","parentSeleced":"N","parentAdd":"N","width":"160","affectNode":"yhyywdDm"}' align="left" ng-model="zmWcjyhdssglzmxxVO.wcjydxzqhszmc" readonly="readonly" />
     * <input type="hidden" ng-model="zmWcjyhdssglzmxxVO.wcjydxzqhszDm">
     * 使用说明：
     * 1、url：tree_xzqh.json文件html同级目录
     * 2、parentSeleced：Y可以选中父级目录，N不可选中
     * 3、parentAdd：Y追加父级名称，N不追加。
     * 4、width:下拉控件显示的宽度。
     * 5、affectNode：级联相关节点，
     * 6、rootNodeAdd：Y追加根目录名称，N不追加。
     * 7、formData:动态json报文，当不传url的时候才会使用formData的报文
     */
    viewApp.directive('ngTree', function () {
    	return {
        	require: 'ngModel',
        	restrict: 'EA',
        	link: function ($scope, element, attrs, ngModel) {
        		var setting = {
        				view : {
        					dblClickExpand : false,
                            showIcon: false,
                            showLine: false
                        },
        				data : {
        					simpleData : {
        						enable : true
        					}
                        },
        				callback : {
        					beforeClick : function beforeClick(treeId, treeNode) {
        						var check;
        						var ngTreeobj=JSON.parse(attrs.ngTree.replace(/\\/g,''));
        						if(ngTreeobj.parentSeleced==='Y'){//可以选中父级目录
        							check = treeNode;
        						}else{
                                    if(treeNode.isParent){
                                        //点击文字展开节点
                                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                        zTree.expandNode(treeNode,null,null,false);
                                    }

        							//不可以选中父级目录
        							check = (treeNode && !treeNode.isParent);
        						}
        						return check;
        					},
        					onClick : function(event, treeId, treeNode, clickFlag) {
        						var zTree = $.fn.zTree.getZTreeObj("treeDemo"), nodes = zTree
        								.getSelectedNodes(), id_ = "", v = "";
        						nodes.sort(function compare(a, b) {
        							return a.id - b.id;
        						});
        						for (var i = 0, l = nodes.length; i < l; i++) {
        							v += nodes[i].name + ",";
        							id_ = nodes[i].id
        						}
        						if (v.length > 0)
        							v = v.substring(0, v.length - 1);
        						//取出参数
        						var ngTreeobj=JSON.parse(attrs.ngTree.replace(/\\/g,''));
        						if(typeof(checkTree) === 'function'){//回调，检查业务js有无写方法，可以在这里做业务逻辑判断。
        							if(!checkTree(ngTreeobj.url,id_,v,element)){
        								return;
        							}
        						}
        						if(ngTreeobj.parentAdd==='Y'&&treeNode.getParentNode()!=null){//追加父级目录
        							v=treeNode.getParentNode().name+v;
        						}
        						if(ngTreeobj.parentAddAll==='Y'&&treeNode.getParentNode()!=null){//追加所有父级目录名称
        							v = treeNodeGetAllParentName(treeNode,v);
        						}
        						if(ngTreeobj.parentIdAdd==='Y'&&treeNode.getParentNode()!=null){//追加父级目录ID
        							id_=treeNode.getParentNode().id+"|"+id_;
        						}
        						if(ngTreeobj.parentIdAddAll==='Y'&&treeNode.getParentNode()!=null){//追加所有父级目录ID
        							id_ = treeNodeGetAllParentId(treeNode,id_);
        						}
        						var element_next=$(element).next();
        						var _jpath = $(element).attr("jpath");
        						//var ngModels=attrs.ngModel.split('.');
        						//var _nextngModels=element_next.attr('ng-model').split('.');
        						/*
        						 * 当页面绑定的节点是带数组下标形式时，原来的截取方式在赋值操作中会报错
        						 * 如：页面ng-model="zdsyqyjbxxbGridlbVO[34].zdsyqyjbxxnrDm"
        						 * 原来截取方式：var ngModels=attrs.ngModel.split('.');
        						 * 原来赋值操作：$scope[ngModels[0]][ngModels[1]]=v;
        						 * 报错原因：ngModels[0]的值为"zdsyqyjbxxbGridlbVO[34]"，$scope["zdsyqyjbxxbGridlbVO[34]"]无法获取到vo（数组）的第34个下标的数据
        						 * 故添加以下判断，后面的赋值操作 也需要添加对应的判断
        						*/
        						var ngModels = new Array();
        						var _nextngModels = new Array();
        						if(attrs.ngModel.indexOf("[") > -1){
        							ngModels[0] = attrs.ngModel.substring(0,attrs.ngModel.indexOf("["));
        							ngModels[1] = attrs.ngModel.substring(attrs.ngModel.indexOf("[")+1,attrs.ngModel.indexOf("]"));
        							ngModels[2] = attrs.ngModel.substring(attrs.ngModel.indexOf(".")+1);
        						}else{
        							ngModels=attrs.ngModel.split('.');
        						}
        						if(element_next.attr('ng-model').indexOf("[") > -1){
        							_nextngModels[0] = element_next.attr('ng-model').substring(0,element_next.attr('ng-model').indexOf("["));
        							_nextngModels[1] = element_next.attr('ng-model').substring(element_next.attr('ng-model').indexOf("[")+1,element_next.attr('ng-model').indexOf("]"));
        							_nextngModels[2] = element_next.attr('ng-model').substring(element_next.attr('ng-model').indexOf(".")+1);
        						}else{
        							_nextngModels=element_next.attr('ng-model').split('.');
        						}
        						//是否需要使用根节点的参数,注意：建议rootNodeAdd和parentAdd不要同时使用
        						if(ngTreeobj.rootNodeAdd==='Y'){
        							//获取被选中节点的根节点
        							var rootNode = treeNodeGetRoot(treeNode);
        							if(rootNode.id != treeNode.id){
        								//id不一样的时候才拼接，如果是一样，则是同一个节点
        								v = rootNode.name + "   |   " + v;
        							}
        							//使用rootNodeAdd的时候，暂时默认需要绑定rootId和rootName
        							var elementRootId = $(element).siblings(".rootId");
        							var elementRootName = $(element).siblings(".rootName");
        							if(elementRootId!=null && elementRootId.length>0){
        								//var _rootIdNgModels=elementRootId.attr('ng-model').split('.');
        								//$scope[ngModels[0]][_rootIdNgModels[1]]=rootNode.id;//赋值
        								var _rootIdNgModels = new Array();
        								if(elementRootId.attr('ng-model').indexOf("[") > -1){
        									_rootIdNgModels[0] = elementRootId.attr('ng-model').substring(0,elementRootId.attr('ng-model').indexOf("["));
        									_rootIdNgModels[1] = elementRootId.attr('ng-model').substring(elementRootId.attr('ng-model').indexOf("[")+1,elementRootId.attr('ng-model').indexOf("]"));
        									_rootIdNgModels[2] = elementRootId.attr('ng-model').substring(elementRootId.attr('ng-model').indexOf(".")+1);
        									$scope[ngModels[0]][ngModels[1]][_rootIdNgModels[2]]=rootNode.id;
                						}else{
                							_rootIdNgModels=elementRootId.attr('ng-model').split('.');
                							$scope[ngModels[0]][_rootIdNgModels[1]]=rootNode.id;
                						}

        								var _jpath_rootId = elementRootId.attr("jpath");
        								parent.formulaEngine.apply(_jpath_rootId, '');
        							}
        							if(elementRootName!=null && elementRootName.length>0){
        								//var _rootNameNgModels=elementRootName.attr('ng-model').split('.');
            							//$scope[ngModels[0]][_rootNameNgModels[1]]=rootNode.name;//赋值
            							var _rootNameNgModels = new Array();
            							if(elementRootName.attr('ng-model').indexOf("[") > -1){
            								_rootNameNgModels[0] = elementRootName.attr('ng-model').substring(0,elementRootName.attr('ng-model').indexOf("["));
            								_rootNameNgModels[1] = elementRootName.attr('ng-model').substring(elementRootName.attr('ng-model').indexOf("[")+1,elementRootName.attr('ng-model').indexOf("]"));
            								_rootNameNgModels[2] = elementRootName.attr('ng-model').substring(elementRootName.attr('ng-model').indexOf(".")+1);
        									$scope[ngModels[0]][ngModels[1]][_rootNameNgModels[2]]=rootNode.id;
            							}else{
            								var _rootNameNgModels=elementRootName.attr('ng-model').split('.');
                							$scope[ngModels[0]][_rootNameNgModels[1]]=rootNode.name;
            							}

            							var _jpath_rootName = elementRootName.attr("jpath");
                						parent.formulaEngine.apply(_jpath_rootName, '');
        							}
        						}
        						//$scope[ngModels[0]][ngModels[1]]=v;//赋值
        						//$scope[ngModels[0]][_nextngModels[1]]=id_;//赋值
        						if(ngModels.length>2){
        							$scope[ngModels[0]][ngModels[1]][ngModels[2]]=v;
        							$scope[ngModels[0]][ngModels[1]][_nextngModels[2]]=id_;
        						}else{
        							$scope[ngModels[0]][ngModels[1]]=v;
        							$scope[ngModels[0]][_nextngModels[1]]=id_;
        						}
        						if(ngTreeobj.affectNode){
        							var affectNodes=ngTreeobj.affectNode.split(',');
        							$.each(affectNodes, function(i){
        								$scope[ngModels[0]][this]='';//赋值
        								var affectJpath=_jpath.substring(0,_jpath.lastIndexOf('.')+1)+this;
        								parent.formulaEngine.apply(affectJpath, '');
        							});
        						}
        						var _jpath_next = element_next.attr("jpath");
        						parent.formulaEngine.apply(_jpath, '');
        						parent.formulaEngine.apply(_jpath_next, '');
        						viewEngine.tipsForVerify(document.body);
        						if (!$scope.$$phase) {
        							$scope.$apply();
        						}
        						if(typeof(clickTreeTodo) === 'function'){//增加点击方法后执行函数
        							clickTreeTodo(ngTreeobj.url,id_,v,element);
        						}
        						hideMenu();
        						$.fn.zTree.init($("#treeDemo"), setting, []);
        					},
                            onCheck : function onCheck(event, treeId, treeNode) {
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                var nodes = zTree.getCheckedNodes(true);
                                var id_ = "", v = "";
                                nodes.sort(function compare(a, b) {
                                    return a.id - b.id;
                                });
                                for (var i = 0, l = nodes.length; i < l; i++) {
                                    var node = nodes[i];
                                    if(!node.isParent){
                                        v += node.name + ",";
                                        id_ += node.id + ",";
                                    }
                                }
                                if (id_.length > 0) {
                                    v = v.substring(0, v.length - 1);
                                    id_ = id_.substring(0, id_.length - 1);
                                }

                                //取出参数
                                var ngTreeobj=JSON.parse(attrs.ngTree.replace(/\\/g,''));
                                if(typeof(checkTree) === 'function'){//回调，检查业务js有无写方法，可以在这里做业务逻辑判断。
                                    if(!checkTree(ngTreeobj.url,id_,v,element)){
                                        return;
                                    }
                                }
                                if(ngTreeobj.parentAdd==='Y'&&treeNode.getParentNode()!=null){//追加父级目录
                                    v=treeNode.getParentNode().name+v;
                                }

                                var element_next=$(element).next();
                                var _jpath = $(element).attr("jpath");
                                var ngModels = new Array();
                                var _nextngModels = new Array();

                                if(attrs.ngModel.indexOf("[") > -1){
                                    ngModels[0] = attrs.ngModel.substring(0,attrs.ngModel.indexOf("["));
                                    ngModels[1] = attrs.ngModel.substring(attrs.ngModel.indexOf("[")+1,attrs.ngModel.indexOf("]"));
                                    ngModels[2] = attrs.ngModel.substring(attrs.ngModel.indexOf(".")+1);
                                }else{
                                    ngModels=attrs.ngModel.split('.');
                                }
                                if(element_next.attr('ng-model').indexOf("[") > -1){
                                    _nextngModels[0] = element_next.attr('ng-model').substring(0,element_next.attr('ng-model').indexOf("["));
                                    _nextngModels[1] = element_next.attr('ng-model').substring(element_next.attr('ng-model').indexOf("[")+1,element_next.attr('ng-model').indexOf("]"));
                                    _nextngModels[2] = element_next.attr('ng-model').substring(element_next.attr('ng-model').indexOf(".")+1);
                                }else{
                                    _nextngModels=element_next.attr('ng-model').split('.');
                                }
                                //是否需要使用根节点的参数,注意：建议rootNodeAdd和parentAdd不要同时使用
                                if(ngTreeobj.rootNodeAdd==='Y'){
                                    //获取被选中节点的根节点
                                    var rootNode = treeNodeGetRoot(treeNode);
                                    if(rootNode.id != treeNode.id){
                                        //id不一样的时候才拼接，如果是一样，则是同一个节点
                                        v = rootNode.name + "   |   " + v;
                                    }
                                    //使用rootNodeAdd的时候，暂时默认需要绑定rootId和rootName
                                    var elementRootId = $(element).siblings(".rootId");
                                    var elementRootName = $(element).siblings(".rootName");
                                    if(elementRootId!=null && elementRootId.length>0){
                                        //var _rootIdNgModels=elementRootId.attr('ng-model').split('.');
                                        //$scope[ngModels[0]][_rootIdNgModels[1]]=rootNode.id;//赋值
                                        var _rootIdNgModels = new Array();
                                        if(elementRootId.attr('ng-model').indexOf("[") > -1){
                                            _rootIdNgModels[0] = elementRootId.attr('ng-model').substring(0,elementRootId.attr('ng-model').indexOf("["));
                                            _rootIdNgModels[1] = elementRootId.attr('ng-model').substring(elementRootId.attr('ng-model').indexOf("[")+1,elementRootId.attr('ng-model').indexOf("]"));
                                            _rootIdNgModels[2] = elementRootId.attr('ng-model').substring(elementRootId.attr('ng-model').indexOf(".")+1);
                                            $scope[ngModels[0]][ngModels[1]][_rootIdNgModels[2]]=rootNode.id;
                                        }else{
                                            _rootIdNgModels=elementRootId.attr('ng-model').split('.');
                                            $scope[ngModels[0]][_rootIdNgModels[1]]=rootNode.id;
                                        }

                                        var _jpath_rootId = elementRootId.attr("jpath");
                                        parent.formulaEngine.apply(_jpath_rootId, '');
                                    }
                                    if(elementRootName!=null && elementRootName.length>0){
                                        //var _rootNameNgModels=elementRootName.attr('ng-model').split('.');
                                        //$scope[ngModels[0]][_rootNameNgModels[1]]=rootNode.name;//赋值
                                        var _rootNameNgModels = new Array();
                                        if(elementRootName.attr('ng-model').indexOf("[") > -1){
                                            _rootNameNgModels[0] = elementRootName.attr('ng-model').substring(0,elementRootName.attr('ng-model').indexOf("["));
                                            _rootNameNgModels[1] = elementRootName.attr('ng-model').substring(elementRootName.attr('ng-model').indexOf("[")+1,elementRootName.attr('ng-model').indexOf("]"));
                                            _rootNameNgModels[2] = elementRootName.attr('ng-model').substring(elementRootName.attr('ng-model').indexOf(".")+1);
                                            $scope[ngModels[0]][ngModels[1]][_rootNameNgModels[2]]=rootNode.id;
                                        }else{
                                            var _rootNameNgModels=elementRootName.attr('ng-model').split('.');
                                            $scope[ngModels[0]][_rootNameNgModels[1]]=rootNode.name;
                                        }

                                        var _jpath_rootName = elementRootName.attr("jpath");
                                        parent.formulaEngine.apply(_jpath_rootName, '');
                                    }
                                }
                                //$scope[ngModels[0]][ngModels[1]]=v;//赋值
                                //$scope[ngModels[0]][_nextngModels[1]]=id_;//赋值
                                if(ngModels.length>2){
                                    $scope[ngModels[0]][ngModels[1]][ngModels[2]]=v;
                                    $scope[ngModels[0]][ngModels[1]][_nextngModels[2]]=id_;
                                }else{
                                    $scope[ngModels[0]][ngModels[1]]=v;
                                    $scope[ngModels[0]][_nextngModels[1]]=id_;
                                }
                                if(ngTreeobj.affectNode){
                                    var affectNodes=ngTreeobj.affectNode.split(',');
                                    $.each(affectNodes, function(i){
                                        $scope[ngModels[0]][this]='';//赋值
                                        var affectJpath=_jpath.substring(0,_jpath.lastIndexOf('.')+1)+this;
                                        parent.formulaEngine.apply(affectJpath, '');
                                    });
                                }
                                var _jpath_next = element_next.attr("jpath");
                                parent.formulaEngine.apply(_jpath, v);
                                parent.formulaEngine.apply(_jpath_next, id_);
                                viewEngine.tipsForVerify(document.body);
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
        				}
        			};
        		 var ngTreeobj=JSON.parse(attrs.ngTree.replace(/\\/g,''));
        		 element.on({ "click" : function(event){
    				var _url = ngTreeobj.url;
    				var _formData = ngTreeobj.formData;
    				var eleOffset = element.offset();
    				var width=element.width();
    				var filter = ngTreeobj.filter;
    				if(filter){
    					$("#ztreeId").val('');
    					$("#ztreeId").show();
    					$("#ztreeId").focus();
    					$("#ztreeId").width(width);
    					$('#ztreeId').unbind("keyup"); //移除keyup
    					$("#ztreeId").on({"keyup" : function(event){
    		    			 if(this.value){
    		    				 loadZtree(ngTreeobj,element,setting,this.value);
    		    			 }else{
    		    				 //loadZtree(ngTreeobj,element,setting,"");
    		    				 //hideMenu();
    		    			 }
    		    		 }});
    				}else{
    					$("#ztreeId").hide();
    				}
    				var checkbox = ngTreeobj.checkbox;
    				var showDesc = ngTreeobj.showDesc;
                    var description = ngTreeobj.description;
    				$("#menuContent").css({
    					left : eleOffset.left + "px",
    					top : eleOffset.top + element.outerHeight() + "px",
    					width : (width-10)+"px"
    				}).show();
    				$("#treeDemo").css({
    					width : (width-10)+"px"
    				});

    				//有checkbox属性则在setting中增加check参数，支持多选树
    				if(checkbox){
    				    setting.check = {"enable": true, "chkStyle": "checkbox", "chkboxType": { "Y": "ps", "N": "ps" }};
                    }

                    if(showDesc){
    				    if(!description){
                            description = "description";
                        }
    				    setting.data.key = { title: description }
    				}
                    loadZtree(ngTreeobj,element,setting,'');
    				var ifr=window.parent.document.getElementById("frmSheet");
    				if(ifr&&ifr.contentWindow){
    					var target = ifr.contentWindow.document || ifr.contentWindow;
    					$(target).bind("mousedown", onBodyDown);
    				}
        		 }
                 });
        	}
    	};
    });
    var  ztrrJson= {};
    function loadZtree(ngTreeobj,element,setting,ztreeIdval){
    	var _jpath=element.attr("jpath");
    	var _url = ngTreeobj.url;
		var _formData = ngTreeobj.formData;
		var checkbox = ngTreeobj.checkbox;
		var key,_data;
		if(_url){
			if(_url.indexOf('getDmb.do')>-1){
				var ywlx="/"+location.pathname.split('/')[3];
        		_url=parent.pathRoot+ywlx+_url;
        		var gdslxDm=parent.$("#gdslxDm").val();
        		if(gdslxDm){
        			_url=_url+"&gdslxDm="+gdslxDm;
        		}
				var str = _url;
				var num = str.indexOf("?");
				str=str.substr(num+1);
				var arr = str.split("&");
				for(var i=0;i<arr.length;i++){
					num = arr[i].indexOf("=");
					if(num > 0){
						name = arr[i].substr(0,num);
						value = arr[i].substr(num+1);
						if(name == "codeTable"){
							if(value&&value.indexOf('.')>-1){
								key=value.split('.')[0];
							}else{
								key = value;
							}
							break;
						}
					}
				}
			}else{
				key=_url.split('.')[0];
			}
			key=key+'_ztrre_'+_jpath;
			_data=ztrrJson[key];
		}
		if(_data){
			$.fn.zTree.init($("#treeDemo"), setting, _data);//展开下拉树控件
			if(ztreeIdval){
				//https://www.cnblogs.com/bsc2012/p/9241739.html
				filterhideNodes(ztreeIdval);
			}
			if(typeof(expandTree) === 'function'){//回调，检查业务js有无写方法，可以在这里做业务逻辑判断。
                 if(expandTree()){
                	  var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
				     	  var nodes = treeObj.getNodes();
				          if (nodes.length>0) {
				          for(var i=0;i<nodes.length;i++){
				         	 treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
				          }
						}
                 }
             }
            if(checkbox) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var element_next = $(element).next();
                var _jpath_next = element_next.attr("jpath");
                var checkNodes = eval("parent.formData." + _jpath_next);
                if (checkNodes) {
                    checkNodes = checkNodes.split(',');
                    for (var i = 0, len = checkNodes.length; i < len; i++) {
                        var nodeId = checkNodes[i];
                        var node = zTree.getNodeByParam("id", nodeId);
                        zTree.checkNode(node, true, true);
                    }
                }
            }
		}else if(_url){
			$.getJSON(encodeURI(_url), function(data) {
				if (data !== "" || data !== undefined) {
					ztrrJson[key]=data;
					$.fn.zTree.init($("#treeDemo"), setting, data);//展开下拉树控件
					if(ztreeIdval){
						filterhideNodes(ztreeIdval);
					}
					if(typeof(expandTree) === 'function'){//回调，检查业务js有无写方法，可以在这里做业务逻辑判断。
                         if(expandTree()){
                        	  var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
						     	  var nodes = treeObj.getNodes();
						          if (nodes.length>0) {
						          for(var i=0;i<nodes.length;i++){
						         	 treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
						          }
 							}
                         }
                     }
                    if(checkbox) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var element_next = $(element).next();
                        var _jpath_next = element_next.attr("jpath");
                        var checkNodes = eval("parent.formData." + _jpath_next);
                        if (checkNodes) {
                            checkNodes = checkNodes.split(',');
                            for (var i = 0, len = checkNodes.length; i < len; i++) {
                                var nodeId = checkNodes[i];
                                var node = zTree.getNodeByParam("id", nodeId);
                                zTree.checkNode(node, true, true);
                            }
                        }
                    }
				}
			});
		}else if(_formData){
			var _newFormDat = $scope.$eval(_formData);
			if (_newFormDat !== "" || _newFormDat !== undefined) {
				$.fn.zTree.init($("#treeDemo"), setting, _newFormDat);//展开下拉树控件
				if(ztreeIdval){
					filterhideNodes(ztreeIdval);
				}
                if(checkbox) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var element_next = $(element).next();
                    var _jpath_next = element_next.attr("jpath");
                    var checkNodes = eval("parent.formData." + _jpath_next);
                    if (checkNodes) {
                        checkNodes = checkNodes.split(',');
                        for (var i = 0, len = checkNodes.length; i < len; i++) {
                            var nodeId = checkNodes[i];
                            var node = zTree.getNodeByParam("id", nodeId);
                            zTree.checkNode(node, true, true);
                        }
                    }
                }
			}
		}
    }
    
    /**
     * 查找子结点，如果找到，返回true，否则返回false
     */
    function searchChildren(keyword,children){
        if(children == null || children.length == 0){
            return false;
        }
        for(var i = 0;i < children.length;i++){
            var node = children[i];
            if(node.name.indexOf(keyword)!=-1){
                return true;
            }
            //递归查找子结点
            var result = searchChildren(keyword,node.children);
            if(result){
                return true;
            }
        }
        return false;
    }
    
    /**
     * 查找当前结点和父结点，如果找到，返回ture，否则返回false
     */
    function searchParent(keyword,node){
        if(node == null){
            return false;
        }
        if(node.name.indexOf(keyword)!=-1){
            return true;
        }
        //递归查找父结点
        return searchParent(keyword,node.getParentNode());
    }
    function filterhideNodes(ztreeIdval){
    	var ztreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        //显示上次搜索后隐藏的结点
        //ztreeObj.showNodes(hiddenNodes);
        //查找不符合条件的结点
        //返回true表示要过滤，需要隐藏，返回false表示不需要过滤，不需要隐藏
        function filterFunc(node){
        //如果当前结点，或者其父结点可以找到，或者当前结点的子结点可以找到，则该结点不隐藏
            if(searchParent(ztreeIdval,node) || searchChildren(ztreeIdval,node.children)){
                return false;
            }
            return true;
        };

        //获取不符合条件的叶子结点
        var hiddenNodes=ztreeObj.getNodesByFilter(filterFunc);

        //隐藏不符合条件的叶子结点
        ztreeObj.hideNodes(hiddenNodes);
        //var nodeList = ztreeObj.getNodesByParamFuzzy("name", ztreeIdval, null);//搜索含有value关键字的节点
        //processShowNodes(nodeList);
    }
    function processShowNodes(highlightNodes) {
    	var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
       //先把全部节点更新为普通样式
       for(var i = 0; i < highlightNodes.length; i++) {
           highlightNodes[i].highlight = false;
           zTreeObj.updateNode(highlightNodes[i]);
       }
       //把指定节点的样式更新为高亮显示，并展开
       if(highlightNodes != null) {
           for(var i = 0; i < highlightNodes.length; i++) {
              //高亮显示节点，并展开
              highlightNodes[i].highlight = true;
              zTreeObj.expandNode(highlightNodes[i], true, true, true);
           }
       }
   }
    /**ng-tree获取追加所有父节点名称*/
    function treeNodeGetAllParentName(node,v){
    	if(node==null || node==undefined){
    		return ;
    	}
    	if(node.getParentNode()!=null && node.getParentNode()!=undefined){
    		return treeNodeGetAllParentName(node.getParentNode(),node.getParentNode().name+v);
    	}
    	return v;
	}
    /**ng-tree获取追加所有父节点代码*/
    function treeNodeGetAllParentId(node,id_){
    	if(node==null || node==undefined){
    		return ;
    	}
    	if(node.getParentNode()!=null && node.getParentNode()!=undefined){
    		return treeNodeGetAllParentId(node.getParentNode(),node.getParentNode().id+"|"+id_);
    	}
    	return id_;
	}
    /**ng-tree获取根节点*/
    function treeNodeGetRoot(node){
    	if(node==null || node==undefined){
    		return ;
    	}
    	if(node.getParentNode()!=null && node.getParentNode()!=undefined){
    		return treeNodeGetRoot(node.getParentNode());
    	}
    	return node;
	}
    
    /**
     * 自定义【jquery-multiple】树状下拉复选框插件，
     * 
     * 业务参考用例：外出经营税收管理证明开具,wcjyhdssglzmkj.html
     * 
     * <select multiple ng-multiple='{"url":"dm_gy_jyfs_gs.json","muheight":"250","maxlength":"35"}' ng-model="zmWcjyhdssglzmxxVO.jyfsDm"></select>
     * 
     * 使用说明：
     * 1、url非空，目前只支持读本地文件，后续有需求可以考虑优化
     * 2、muheight下拉框显示高度 可不写，默认250。
     * 3、maxlength字符显示长度，可不写，默认字符显示长度35，超过长度省略号代替。
     * 4、需要引入multiple插件js库、css
     * 
     * 注意点：
     * 需要设置中间节点，写初始化公式，具体参考rule.json文件
     * $..zmWcjyhdssglzmxxVO.jyfsDm=IF($..zmWcjyhdssglzmxxVO.jyfsdmjh=='','',($..zmWcjyhdssglzmxxVO.jyfsdmjh).split(','))
     */
    viewApp.directive('ngMultiple', function () {
    	return {
        	require: 'ngModel',
        	restrict: 'A',
        	link: function ($scope, element, attrs, ctrl) {
        		//获取数据模型的值
        		var viewValue=eval('$scope.formData.'+attrs.jpath);
        		var meobj=JSON.parse(attrs.ngMultiple.replace(/\\/g,''));
        		var _formData = meobj.formData;
        		var _url = meobj.url;
        		//GEARS-8867 涉税服务模块-下拉列表多选功能优化
        		if(_url){
        			if(_url.indexOf('getDmb.do')>-1){
                		var ywlx="/"+location.pathname.split('/')[3];
                		_url=parent.pathRoot+ywlx+_url;
                		var gdslxDm=parent.$("#gdslxDm").val();
                		if(gdslxDm){
                			_url=_url+"&gdslxDm="+gdslxDm;
                		}
                	}
        			$.ajax({
        		        async: false,
        		        cache: true,
        		        type: "GET",
        		        dataType: "json",
        		        url: encodeURI(_url),
        		        success: function (data) {
        		        	element.empty();
        		        	for (var key in data){
        		        		element.append("<option value='"+key+"'>"+data[key]+"</option>");
        		    	    }
        		        },
        		        error:function(){
        		        	dhtmlx.message(meobj.url+"加载失败！", "info", 5000);
        		        }
        		   });
        		}else if (_formData){
        			var _data = jsonPath($scope.formData, _formData)[0];
        			element.empty();
        			for (var i=0;i<_data.length;i++){
		        		element.append("<option value='"+_data[i].dm+"'>"+_data[i].mc+"</option>");
		    	    }
        		}
        		var muwidth=element.width();//填充所占单元格
        		var muheight=250,maxlength=muwidth;
        		if(meobj.muheight&&parseInt(meobj.muheight)>0){
        			muheight=meobj.muheight;
        		}
        		if(meobj.maxlength&&parseInt(meobj.maxlength)>0){
        			maxlength=meobj.maxlength;
        		}
        		if(meobj.muwidth&&parseInt(meobj.muwidth)>0){
        			muwidth=meobj.muwidth;
        		}
        		element.multiselect({
        			"maxlength":maxlength,
        			"height":muheight,
        			"minWidth":muwidth,
        			"menuWidth":muwidth,
        			"Callback":function($this, numChecked, text, $checked){
						var ngModels=attrs.ngModel.split('.');
						if(meobj.mc){
							$scope[ngModels[0]][meobj.mc]=numChecked;//赋值
						}
        				var _jpath = $(element).attr("jpath");
        				if(_jpath){
        					 parent.formulaEngine.apply(_jpath, '');
        					 parent.formulaEngine.apply(_jpath+'jh', '');
                             viewEngine.tipsForVerify(document.body);
        				}
        			}
        		});
        		//初始化下拉框选项
        		if(!$.isArray(viewValue)){
        			viewValue=viewValue.split(',');
        		}
        		if (viewValue != null) {
        			element.val(viewValue);
    	        	element.multiselect("refresh");
        		}
        	}
    	};
    });

	/**
     * 自定义输入地址控件指令
     * <input type="text" ng-select-address p="p" c="c" a="a" d="d" placeholder="请选择所在地" ng-model="xxx" />
     */
    viewApp.directive('ngSelectAddress', function($http, $q, $compile) {
    	var flag = 0;
        var cityURL, delay, templateURL;
        delay = $q.defer();
        templateURL = parent.pathRoot+'/abacus/_res_/js/address/address.html';
        cityURL = parent.pathRoot+'/abacus/_res_/js/address/city.json';
        $http.get(cityURL).success(function(data) {
          return delay.resolve(data);
        });
        return {
          restrict: 'A',
          scope: {
            p: '=',
            a: '=',
            c: '=',
            d: '=',
            ngModel: '='
          },
          link: function(scope, element, attrs) {
            var popup;
            popup = {
              element: null,
              backdrop: null,
              show: function() {
                return this.element.addClass('active');
              },
              hide: function() {
                this.element.removeClass('active');
                return false;
              },
              resize: function() {
                if (!this.element) {
                  return;
                }
                this.element.css({
                  top: -this.element.height() - 30,
                  'margin-left': -this.element.width() / 2
                });
                return false;
              },
              focus: function() {
                $('[ng-model="d"]').focus();
                return false;
              },
              init: function() {
                element.on('click keydown', function(event) {
                  flag = 1;
                  popup.show();
                  event.stopPropagation();
                  return false;
                });
                $(window).on('click', (function(_this) {
                  return function() {
                    return _this.hide();
                  };
                })(this));
                this.element.on('click', function(event) {
                  return event.stopPropagation();
                });
                return setTimeout((function(_this) {
                  return function() {
                    _this.element.show();
                    return _this.resize();
                  };
                })(this), 50);
              }
            };
            return delay.promise.then(function(data) {
              $http.get(templateURL).success(function(template) {
                var $template;
                $template = $compile(template)(scope);
                $('body').append($template);
                popup.element = $($template[2]);
                scope.provinces = data;
                return popup.init();
              });
              scope.aSet = {
                p: function(p) {
                  scope.p = p;
                  scope.c = null;
                  scope.a = null;
                  return scope.d = null;
                },
                c: function(c) {
                  scope.c = c;
                  scope.a = null;
                  return scope.d = null;
                },
                a: function(a) {
                  scope.a = a;
                  scope.d = null;
                  return popup.focus();
                }
              };
              scope.clear = function() {
                scope.p = null;
                scope.c = null;
                scope.a = null;
                scope.d = null;
                return scope.ngModel='';
              };

              scope.submit = function() {
            	  popup.hide();  
            	  element.change();
            	return
            	       	 
              };
              scope.$watch('p', function(newV) {
                var v, _i, _len, _results;
                if (newV) {
                  _results = [];
                  for (_i = 0, _len = data.length; _i < _len; _i++) {
                    v = data[_i];
                    if (v.p === newV) {
                      _results.push(scope.cities = v.c);
                    }
                  }
                  return _results;
                } else {
                  return scope.cities = [];
                }
              });
              scope.$watch('c', function(newV) {
                var v, _i, _len, _ref, _results;
                if (newV) {
                  _ref = scope.cities;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    v = _ref[_i];
                    if (v.n === newV) {
                      _results.push(scope.dists = v.a);
                    }
                  }
                  return _results;
                } else {
                  return scope.dists = [];
                }
              });
              return scope.$watch(function() {
                if(flag==0 && scope.ngModel!=''){
              }else{
            	var temp = true;
              	while(temp){
              	  if (scope.p) {
              		scope.ngModel = '';
              		scope.ngModel += scope.p;
                     }
                     if (scope.c) {
                    	 scope.ngModel = '';
                    	 scope.ngModel +=scope.p+ " " + scope.c;
                     }
                     if (scope.a) {
                    	 scope.ngModel = '';
                    	 scope.ngModel +=scope.p+ " " + scope.c+ " " + scope.a;
                     }
                     if (scope.d) {
                    	 scope.ngModel = '';
                    	 scope.ngModel += scope.p+ " " + scope.c+ " " + scope.a+" " + scope.d;
                     }
                    temp = false;
              	}
                 
              }
                return popup.resize();
                
              });
            });
          }
        };
    });

	/**
     * 自定义动态显示输入框全部内容指令
     * <input type="text" ng-show-content="12px" />
     */
    viewApp.directive('ngShowContent', function() {
    	return {
            require: 'ngModel',//控制器是指令标签对应的ngModel
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs) {
            	
            	element.on({ "mouseover" : function(event){
            		
            		var fontSize = "12px";            		
            		if (element.attr("ng-show-content") != "") {
            			fontSize = element.attr("ng-show-content");
            		}
            		if (this.style.fontSize != "") {
            			fontSize = this.style.fontSize;
            		}
            		
            	    var span = document.getElementById("getPxWidth");  
            	    if (span == null) {  
            	        span = document.createElement("span");  
            	        span.id = "getPxWidth";  
            	        document.body.appendChild(span);  
            	        span.style.visibility = "hidden";  
            	        span.style.whiteSpace = "nowrap";  
            	    }
            	    
            	    span.innerText = this.value;  
            	    span.style.fontSize = fontSize;
            	    //防止错误提示信息被遮罩，正确显示提示信息
            	    var title = element.attr("title");
            	    var className = this.className;
            		if (span.offsetWidth > this.offsetWidth && (title=="" || title==undefined || className.indexOf("yellow")<0)) {
            			//this._msgbox_value_ = dhtmlx.message(this.value, "info", -1);
            			element.attr("title", this.value);
            		}
            		
            		
                }, "mouseout" : function(event){
                    if (this._msgbox_value_){
                    	//dhtmlx.message.hide(this._msgbox_value_);
                    }
                }});        	
            }
    	}
    });
    
    /**
     * 自定义属性，设置display的值
     * <input type="text" ng-show-html="zzsxgmsbInitData.dqdeBz=='Y' && zzsxgmsbInitData.yshwjlwRdzg=='Y'" />
     */
    viewApp.directive('ngShowHtml', function() {
    	return {
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs) {
            	var flag = element.attr("ng-show-html");
            	if (scope.$eval(flag)) {
            		$(element).show();
        		}
            }
    	}
    });
    
    /**
     * 自定义动态显示填表说明
     * <input type="text" ng-show-tbsm="应据实填报申报所属期期间的在职职工工资总额" />
     */
    viewApp.directive('ngShowTbsm', function() {
    	return {
            require: 'ngModel',//控制器是指令标签对应的ngModel
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs) {
            	
            	element.on({ "mouseover" : function(event){
            		//暂时不考虑填表说明长度
            		if (element.attr("ng-show-tbsm") != "") {
            			var title = element.attr("ng-show-tbsm");
            		}
            	    //防止错误提示信息被遮罩，正确显示提示信息
            	    var errorTitle = element.attr("title");
            	    var className = this.className;
            		if (className.indexOf("yellow")>0 && errorTitle!=null && errorTitle!=undefined) {
            			//this._msgbox_value_ = dhtmlx.message(this.value, "info", -1);
            			element.attr("title", errorTitle);
            		}else{
            			element.attr("title", title);
            		}
            		
            		
                }, "mouseout" : function(event){
                    if (this._msgbox_value_){
                    	//dhtmlx.message.hide(this._msgbox_value_);
                    }
                }});        	
            }
    	}
    });

	/**
     * 封装select2自定义指令，支持ipnut和select两种输入组件，具备静态查询和动态查询功能
     * @param {scope} ng-model 选中的ID
     * @param {scope} select2-model 选中的详细内容
     * @param {scope} config 自定义配置
     * @param {String} [query] 内置的配置 (怎么也还得默认一个config)
     * @example
     * <input ng-select-query ng-model="a" select-model="b" config-url="select2.config" type="text" placeholder="占位符" />
     * <input ng-select-query ng-model="a" select-model="b" config-url="default" query="testQuery" type="text" placeholder="占位符" />
     * <select ng-select-query ng-model="b" class="form-control"></select>
     */
    viewApp.directive('ngSelectQuery', function ($http, selectQuery, select2Config) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                select2Model: '='
            },
            link: function (scope, element, attrs) {
                // 初始化
                var tagName = element[0].tagName,
                    config = {
                        allowClear: true,
                        multiple: attrs.multiple,
                        placeholder: attrs.placeholder || ' '   // 修复不出现删除按钮的情况
                    };

                //获取ngSelectQuery属性
                var ngSelectQueryAttr = attrs.ngSelectQuery;
                try{
                    if(ngSelectQueryAttr){
                        //ngSelectQuery属性存在，解析为json对象
                        var ngSelectQueryJSON = angular.fromJson(ngSelectQueryAttr);
                        if(ngSelectQueryJSON){
                            //遍历json对象，将键值对放入config对象中
                            for(var key in ngSelectQueryJSON) {
                                var value = ngSelectQueryJSON[key];
                                config[key] = value;
                            }
                        }
                    }
                }catch (e) {
                    //解析ngSelectQuery异常
                    console.log("ERROR：ngSelectQuery属性解析为Json异常，具体信息：" + e);
                }

                // 生成select
                if(tagName === 'SELECT') {
                    // 初始化
                    var $element = $(element);
                    delete config.multiple;

                    $element.select2(config);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        var _newVal
                        if(typeof(newVal) === 'string'){
                            _newVal = newVal;
                        }else{
                            _newVal = $.isEmptyObject(newVal) ? "" : newVal;
                        }
                        if($element.attr("disabled") || $element.attr("readonly")){
                            $element.select2("enable",false);
                        }

                        if(attrs["codeTableId"]){
                            var _id = attrs["codeTableId"];
                            var _values = parent.formCT["_" + _id];
                            if(_values.zt !== "200"){
                                var attributes = _values.attributes;
                                attributes.async = false;
                                initCodeTable(scope, attributes);
                            }
                            var _multiple = $element.attr('multiple');
                            if(_multiple) {} else _newVal += "#"+$element.val();

							//设置额外属性
            				setExtSetting($element);
                            $element.select2('val', _newVal);
                        }else{
                            //循环加载select2数据，直到数据加载成功，主要是等待ngCodetable初始化完成再加载数据
                            select2SetVal($element,_newVal);
                        }
                    }, true);
                    /*$element.change();
                    var element_next=$(element).next();
                    //处理名称赋值
                    if(element_next.length>0&&element_next.attr('type')==='hidden'&&element_next.attr('quoteDm')==='true'){
                    	$element.on('change', function () {
                    		var _jpath = $(this).attr("jpath");
                            try{
	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
                            }catch(e){
                			}
                            // 2、执行关联公式计算
                            parent.formulaEngine.apply(_jpath, this.value);
                            // 3、刷新校验结果和控制结果
                            viewEngine.tipsForVerify(document.body);
                            // 4、刷新angular视图
                            viewEngine.formApply($('#viewCtrlId'));
                    
                        	var _next_ngModels=element_next.attr("ng-model").split('.');
                        	var textArray=[];
                        	for(var i=0;i<$(element).find("option:selected").length;i++){
                        		textArray.push($(element).find("option:selected")[i].text);
                }
                        	var texts=textArray.join(',');
                        	$scope[_next_ngModels[0]][_next_ngModels[1]]=texts;//赋值
                        	var _jpath_next = element_next.attr("jpath");
                        	parent.formulaEngine.apply(_jpath_next, '');
    						viewEngine.tipsForVerify(document.body);
                        });
                    }*/
                }

                // 处理input
                if(tagName === 'INPUT') {
                    // 初始化
                    var $element = $(element);

                    // 获取内置配置
                    if(attrs.query) {
                        scope.config = selectQuery[attrs.query]();
                    }
                    
                    if(attrs.configUrl) {
                        scope.config = {
                        	data: [{id:1,text:'11111'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
                    		placeholder: '原始数据'
                    	};
                        $.get(attrs.configUrl).success(function(data){
                        	scope.config = eval("("+data+")");
                        	scope.$apply();
                        }).error(function(){
                			
                			alert("错误");
                			
                	   });
                    }

                    // 动态生成select2
                    scope.$watch('config', function () {
                        angular.extend(config, scope.config);
                        $element.select2('destroy').select2(config);
                    }, true);

                    // view - model
                    $element.on('change', function () {
	                        scope.$apply(function () {
	                            scope.select2Model = $element.select2('data');
	                        });
                    });

                    // model - view
                    scope.$watch('selectModel', function (newVal) {
                        $element.select2('data', newVal);
                    }, true);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        // 跳过ajax方式以及多选情况
                        if(config.ajax || config.multiple) { return false }

                        $element.select2('val', newVal);
                    }, true);
                }
            }
        }
    });
    
    
    
    viewApp.directive('ngSelectPage', function ($http, selectQuery, select2Config) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                selectPageModel: '='
            },
            link: function (scope, element, attrs) {
            	var $element = $(element);
                // 初始化
                var tagName = element[0].tagName;
	            var config = {
                		showField : 'name', //设置下拉列表中显示文本的列
                		keyField : 'id', //设置下拉列表项目中项目的KEY值，用于提交表单
                        /**
                         * 设置结果集排序，若只指定字段，不指定排序方式，则默认使用asc升序模式
                         * 排序字段若不指定，则默认对showField指定的列进行升序排列
                         * 若需要多字段排序，则设置['id desc','name']
                         * 当前案例设置了使用order字段的内容进行升序排序
                         */
                       orderBy : ['order asc'],
                		eSelect : function(data){
                			scope.$apply(function () {
                				var hiddenInput = $element.closest('input.sp_hidden');
                				var _jpath = hiddenInput.attr('jpath');
                				try{
    	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
    	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
                                }catch(e){
                    			}
                				var jb = "scope.$parent.formData." + _jpath + " = '" + data.id+"'";
    							eval(jb);
    							parent.formulaEngine.apply(_jpath, $element.val());
                                // 3、刷新校验结果和控制结果
                                viewEngine.tipsForVerify(document.body);
                			});
                			// 触发ngChange事件
                			if(attrs.ngChange){
                                scope.$parent.$eval(attrs.ngChange);
                            }

                	    },
                	    eClear : function(data){
                			scope.$apply(function () {
                				var hiddenInput = $element.closest('input.sp_hidden');
                				var _jpath = hiddenInput.attr('jpath');
                				try{
    	                            // 值改变后清除该单元格的第三方提示 A by C.Q 20170213
    	                            delete parent.fxsmInitData.idxVariable2NoPass[_jpath];
                                }catch(e){
                    			}
                				var jb = "scope.$parent.formData." + _jpath + " = ''";
    							eval(jb);
    							parent.formulaEngine.apply(_jpath, this.value);
                                // 3、刷新校验结果和控制结果
                                viewEngine.tipsForVerify(document.body);
                			});
                	    }
	                };

	            //初始化selectPage
                $element.selectPage(config);

                // 处理input
                if(tagName === 'INPUT') {
                    // 获取内置配置
                    if(attrs.query) {
                        scope.config = selectQuery[attrs.query]();
                    }

                    if(!attrs["codeTableId"]) {
                        setData4Config(attrs.ngSelectPage, $element);
                    }

                    // model - view
                    scope.$watch('selectPageModel', function (newVal) {
                    	var hiddenInput = $element.closest('input.sp_hidden');
        				var _jpath = hiddenInput.attr('jpath');
        				hiddenInput.attr('jpath', _jpath);
                    	if(typeof newVal !== 'undefined'){
                            setData4Config(attrs.ngSelectPage,$element,newVal);
                    	}
                    }, true);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        // 跳过ajax方式以及多选情况
                    	if(typeof newVal !== 'undefined'){
                            if(attrs["codeTableId"]){
                                var _id = attrs["codeTableId"];
                                var _values = parent.formCT["_" + _id];
                                if(_values.zt !== "200"){
                                    var attributes = _values.attributes;
                                    attributes.async = false;
                                    initCodeTable(scope,attributes);
                                }
                            }
                            setData4Config(attrs.ngSelectPage, $element, newVal);
                    	}
                    }, true);
                }
            }
        }
    });
    
    /**
     * select2 内置查询功能
     */
    viewApp.factory('selectQuery', function ($timeout) {
        return {
            testQuery: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        url: "/sxbl/query.do",
                        dataType: 'jsonp',
                        data: function (term) {
                            return {
                                q: term,
                                page_limit: 10,
                                apikey: "ju6z9mjyajq2djue3gbvv26t"
                            };
                        },
                        results: function (data, page) {
                            return {results: data.movies};
                        }
                    },
                    formatResult: function (data) {
                        return data.title;
                    },
                    formatSelection: function (data) {
                        return data.title;
                    }
                };

                return config;
            }
        }
    });
    
	    /**
     * select2 内置动态获取配置服务
     */
    viewApp.factory('select2Config', function ($http) {
        return {
            getConfig: function (config) {
                var configURL;
                configURL = 'select2.config';
                /*                $http.get(configURL).success(function(data) {
                 config = data;
                 });*/
                /*$.when($.getJSON(configURL)).then(function(response){
                 config = response;
                 });*/
                config = {
                    data: [{id:1,text:'tt'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
                    placeholder: '加载完毕'
                };
            }

        }
    });
	
    /**
     * 自定义初始化代码表指令——含多个节点
     * model中用#号隔开
     * 带缓存
     */
    viewApp.directive('ngMixCodetable', function(){
        return {
            require: '?^viewCtrl',
            priority: 100,
            restrict : "E",
            scope: true,
            compile: function (element, attributes){
                return {
                    pre: function preLink($scope, $element, attributes) {
                        var _models = $element.attr("model").split("#");
                        var _node = $element.attr("node");
                        var _name = $element.attr("name");
                        var _dm = $element.attr("dm");
                        var _mc = $element.attr("mc");
                        var _data;
                        if(undefined == parent.formCT[_name]) {//判断是否已缓存
                             if(undefined != _models && _models.length > 0) {//期初数来源
                                //parent.formCT = jsonPath($scope.formData, _model)[0];
                            	 var _jsons = {};
                            	 for (var i = 0; i < _models.length; i++){
                            		 _data = jsonPath($scope.formData, _models[i])[0];
                                     if(undefined != _dm && "" != _dm) {
                                         $.each(_data, function(k,v) {
                                        	 if (undefined != v[_dm] && "" != v[_dm]){
                                        		 _jsons[v[_dm]] = v[_dm];
                                        	 }

                                         });
//                                         var _jpath = jsonPath($scope.formData, _models[i], { "resultType" : "PATH" });
//                                         if(_jpath.length == 1){
//                                         	_jpath = _jpath[0].replace(/\[\'/g,".").replace(/\'\]/g,"");
//                                         }
//                                         var _info = {"model":_models[i],"dm":_dm,"jpath":_jpath};
//                                         linkingViewEngine.formApply($('#viewCtrlId'), "_info_"+_name, _info);
                                     }
                                }
                            	_data = _jsons;

                            	 //parent.formEngine.cacheCodeTable(_name, _data);
                                parent.formCT[_name] =jQuery.extend(true, {}, _data);
//                                linkingViewEngine.formApply($('#viewCtrlId'), _name, _data);
                                var scope = angular.element($('#viewCtrlId')).scope();
                                if (null != _name && null != _data) {
                                    scope[_name] = _data;
                                }
//                                scope.$apply();

                            } else {//codetable指令相关参数缺失
                                dhtmlx.message("codetable指令相关参数缺失，请检查...", "error", 2000);
                            }
                        }
                    },
                    post: function postLink($scope, $element, attributes) {
                    }
                }
            }
        }
    });

    viewApp.filter("lztFilter",[function(){
        return function(input,param) {
            console.log("------------------------------------------------- begin dump of custom parameters");
            console.log("input=",input);
            console.log("param(string)=", param);
            var args = Array.prototype.slice.call(arguments);
            console.log("arguments=", args.length);
        }
    }]);

    /**
     * 级联码表过滤指令实现。例如:CT.zspmCT | cascadeFilter:'zsxmDm':p.zsxmDm
     * 含义为，根据p.zsxmDm过滤品目码表。p.zsxmDm为其他节点的ng-model。
     * 如:CT.zspmCT | cascadeFilter:'zsxmDm':'10101' 过滤结果为增值税的品目。
     * @param input 默认参数无需传值，自动取被过滤对象。
     * @param field 被过滤对象中作为过滤条件的字段。为空时，过滤条件为被过滤对象的key。
     * @param value 被过滤对象中过滤条件的值。field不为空时，过滤判断equal，field为空时，过滤判断indexOf.
     */
    viewApp.filter("cascadeFilter",[function(){
        return function(input,field,value) {
        	if(!input) return input;
        	if(!value) return input;
        	var result = {};
            for(var index in input){
            	if(field){
            		if(input[index][field] && input[index][field] == value){
            			result[index] = input[index];
            		}else{
            			//do nothing, not be filtered.
            		}
            	}else{//no field setting. filter key.
            		if(index.indexOf(value)>-1){
            			result[index] = input[index];
            		}
            	}
            }
            return result;
        }
    }]);

    /**
     * 级联码表过滤指令特殊实现(特殊情况下使用，被过滤对象中作为过滤条件的字段的值为""时不过滤)。例如:CT.jmxzDmCT[p.zsxmDm] | cascadeEmptyFilter:'sjgsdq':formData.qcs.initData.nsrjbxx.sjgsdq.substring(1,3)
     * 含义为，根据sjgsdq第2、3位和p.zsxmDm过滤减免性质码表。
     * 如:CT.jmxzDmCT['30216'] | cascadeEmptyFilter:'sjgsdq':'44' 过滤结果为30216征收项目下广东及全国的减免性质。
     * @param input 默认参数无需传值，自动取被过滤对象。
     * @param field 被过滤对象中作为过滤条件的字段。为空时，过滤条件为被过滤对象的key。
     * @param value 被过滤对象中过滤条件的值。field不为空时，过滤判断equal，field为空时，过滤判断indexOf.
     */
    viewApp.filter("cascadeEmptyFilter",[function(){
        return function(input,field,value) {
        	if(!input) return input;
        	if(!value) return input;
        	var result = {};
            for(var index in input){
            	if(field){
            		if(input[index][field] && input[index][field] == value){
            			result[index] = input[index];
            		}else if(input[index][field] == ""){
            			result[index] = input[index];
            		}
            		else{
            			//do nothing, not be filtered.
            		}
            	}else{//no field setting. filter key.
            		if(index.indexOf(value)>-1){
            			result[index] = input[index];
            		}
            	}
            }
            return result;
        }
    }]);

    /**
     * 自定义动态显示输入框全部内容指令(针对select标签)
     * ng-show-select的值做唯一区分,不可重复,与input标签id对应
     * <select ng-show-content="selectShow" class="select01" ng-model="addZdztxxlb.zgswskfjDm" ng-selected="key==addZdztxxlb.zgswskfjDm" ng-options="key as value for (key,value) in CT.cjpageSwjgCT">
     * <input id="selectShow" ng-value="CT.cjpageSwjgCT[addZdztxxlb.zgswskfjDm]" type="hidden"/>
     */
    viewApp.directive('ngShowSelect', function() {
    	return {
            require: 'ngModel',//控制器是指令标签对应的ngModel
            restrict: "EA",//指令作用范围是element或attribute
            link: function(scope, element, attrs) {

            	element.on({ "mouseover" : function(event){

            		var fontSize = "12px";
            		var eleId = "";
            		if (element.attr("ng-show-select") != "") {
            			eleId = element.attr("ng-show-select");
            		}
            		if (this.style.fontSize != "") {
            			fontSize = this.style.fontSize;
            		}

            	    var span = document.getElementById("getPxWidth");
            	    if (span == null) {
            	        span = document.createElement("span");
            	        span.id = "getPxWidth";
            	        document.body.appendChild(span);
            	        span.style.visibility = "hidden";
            	        span.style.whiteSpace = "nowrap";
            	    }

            	    span.innerText = $("#"+eleId).val();
            	    span.style.fontSize = fontSize;
            	    //防止错误提示信息被遮罩，正确显示提示信息
            	    var title = element.attr("title");
            	    var className = this.className;
            		if (span.offsetWidth > (this.offsetWidth - 35) && (title=="" || title==undefined || className.indexOf("yellow")<0)) {
            			//this._msgbox_value_ = dhtmlx.message(this.value, "info", -1);
            			element.attr("title", $("#"+eleId).val());
            		}


                }, "mouseout" : function(event){
                    if (this._msgbox_value_){
                    	//dhtmlx.message.hide(this._msgbox_value_);
                    }
                }});
            }
    	}
    });



    /**
     *自定义分页指令ngPaging
     */
    viewApp.directive('ngPagination',function($compile,$timeout){

        return {
            restrict: 'EA',
            template:function(elem,attr){
                //分页条
                var tempStr='';
                tempStr+='<div class="pageBox">';
                tempStr+='	<table width="100%" border="0" cellspacing="0" cellpadding="0">';
                tempStr+='		<tbody>';
                tempStr+='			<tr>';
                tempStr+='				<td class="no-items"  align="center" ng-show="conf.totalItems <= 0"><font size="3" color="red">暂无数据!</font></td>';
                tempStr+='				<td ng-show="conf.totalItems > 0">';
                tempStr+='					<div class="page">';
                tempStr+='						<div class="page_box fs-l">';
                tempStr+='							<a ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()" style="font-family:\'宋体\';font-weight:bold;">&lt;</a>';
                tempStr+='							<a ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item ==\'...\'}" ng-click="changeCurrentPage(item)">{{item}}</a>';
                tempStr+='							<a ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()" style="font-family:\'宋体\';font-weight:bold;">&gt;</a>';
                tempStr+='						</div>';
                tempStr+='						<div class="page_box fs-r" ng-show="conf.totalItems > 0">';
                tempStr+='						每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions " ng-change="changeItemsPerPage()"/>';
                tempStr+='						共<strong>{{ conf.totalItems }}</strong>条 跳转至<input type="text" ng-model="jumpPageNum" ng-keyup="jumpPageKeyUp($event)"/>';
                tempStr+='						<input type="button" ng-click="jumpToPage()" value="确定" />';
                tempStr+='						</div>';
                tempStr+='					</div>';
                tempStr+='				</td>';
                tempStr+='			</tr>';
                tempStr+='		</tbody>';
                tempStr+='	</table>';
                tempStr+='</div>';
                return tempStr;
            },
            replace: true,
            scope: {
                //parentConf: '=conf'
            },
            link: function(scope, element, attrs) {
                var id=element[0].id;
                if(!id){
                    throw "分页指令ng-Pagination,需要配置一个id";
                    return;
                }

                // 默认分页长度
                var defaultPagesLength = 11;
                // 默认分页选项可调整每页显示的条数
                var defaultPerPageOptions = [10, 20, 30, 50];
                // 默认每页的个数
                var defaultPerPage = 10;
                var currentPage=1;
                var totalItems=800;

                var _parentConf={
                    currentPage: currentPage,
                    totalItems: totalItems,
                    itemsPerPage: defaultPerPage,
                    pagesLength: defaultPagesLength,
                    perPageOptions: defaultPerPageOptions,
                    opt: "",
                    step: 0,
                    onChange: function () {
                    }
                }

                //初始化参数
                var init=attrs.init;
                if(init && init.length>0){
                    var initObj=angular.fromJson(init);
                    _parentConf = angular.extend(_parentConf, initObj);
                }

                //指令内部分页条参数 与 id对应
                // !scope.parentConf?scope.parentConf={}:"";//初始化时，这个对象不存在,需要创建个空对象。
                // if(!scope.parentConf[id]) {
                //     scope.parentConf[id] = _parentConf;
                // }
                // scope.parentConf[id];

                scope.conf=_parentConf;

                var conf = scope.conf;
                // 获取分页长度
                if(conf.pagesLength) {
                    // 判断一下分页长度
                    conf.pagesLength = parseInt(conf.pagesLength, 10);

                    if(!conf.pagesLength) {
                        conf.pagesLength = defaultPagesLength;
                    }
                    // 分页长度必须为奇数，如果传偶数时，自动处理
                    if(conf.pagesLength % 2 === 0) {
                        conf.pagesLength += 1;
                    }
                } else {
                    conf.pagesLength = defaultPagesLength
                }

                // 分页选项可调整每页显示的条数
                if(!conf.perPageOptions){
                    conf.perPageOptions = defaultPagesLength;
                }

                // pageList数组
                function getPagination(element, compile) {
                    // conf.currentPage
                    if(conf.currentPage) {
                        conf.currentPage = parseInt(scope.conf.currentPage, 10);
                    }
                    if(!conf.currentPage) {
                        conf.currentPage = 1;
                    }
                    // conf.totalItems
                    if(conf.totalItems) {
                        conf.totalItems = parseInt(conf.totalItems, 10);
                    }
                    // conf.totalItems
                    if(!conf.totalItems) {
                        conf.totalItems = 0;
                        return;
                    }
                    // conf.itemsPerPage
                    if(conf.itemsPerPage) {
                        conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
                    }
                    if(!conf.itemsPerPage) {
                        conf.itemsPerPage = defaultPerPage;
                    }
                    // numberOfPages
                    conf.numberOfPages = Math.ceil(conf.totalItems/conf.itemsPerPage);
                    // 如果分页总数>0，并且当前页大于分页总数
                    if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
                        scope.conf.currentPage = scope.conf.numberOfPages;
                    }
                    // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                    var perPageOptionsLength = scope.conf.perPageOptions.length;

                    // 定义状态
                    var perPageOptionsStatus;
                    for(var i = 0; i < perPageOptionsLength; i++){
                        if(conf.perPageOptions[i] == conf.itemsPerPage){
                            perPageOptionsStatus = true;
                        }
                    }
                    // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                    if(!perPageOptionsStatus){
                        conf.perPageOptions.push(conf.itemsPerPage);
                    }
                    // 对选项进行sort
                    conf.perPageOptions.sort(function(a, b) {return a - b});
                    // 页码相关
                    scope.pageList = [];
                    if(conf.numberOfPages <= conf.pagesLength){
                        // 判断总页数如果小于等于分页的长度，若小于则直接显示
                        for(i =1; i <= conf.numberOfPages; i++){
                            scope.pageList.push(i);
                        }
                    }else{
                        // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                        // 计算中心偏移量
                        var offset = (conf.pagesLength - 1) / 2;
                        if(conf.currentPage <= offset){
                            // 左边没有...
                            for(i = 1; i <= offset + 1; i++){
                                scope.pageList.push(i);
                            }
                            scope.pageList.push('...');
                            scope.pageList.push(conf.numberOfPages);
                        }else if(conf.currentPage > conf.numberOfPages - offset){
                            scope.pageList.push(1);
                            scope.pageList.push('...');
                            for(i = offset + 1; i >= 1; i--){
                                scope.pageList.push(conf.numberOfPages - i);
                            }
                            scope.pageList.push(conf.numberOfPages);
                        }else{
                            // 最后一种情况，两边都有...
                            scope.pageList.push(1);
                            scope.pageList.push('...');

                            for(i = Math.ceil(offset / 2) ; i >= 1; i--){
                                scope.pageList.push(conf.currentPage - i);
                            }
                            scope.pageList.push(conf.currentPage);
                            for(i = 1; i <= offset / 2; i++){
                                scope.pageList.push(conf.currentPage + i);
                            }

                            scope.pageList.push('...');
                            scope.pageList.push(conf.numberOfPages);
                        }
                    }

                    //把指令域的分页条参数 关联到父层域中,用于实时监控,并控制父层数据模型分页展示
                    if(!scope.$parent.conf){
                        scope.$parent.conf={};
                    }
                    var id=element[0].id;
                    if(!id){
                        scope.$parent.conf=conf;
                    }else{
                        scope.$parent.conf[id] = conf;
                    }
                    //scope.$parent.conf = conf;

                    //var _scope = angular.element($('#viewCtrlId')).scope();
                    //_scope.conf = conf;
                    //viewEngine.bindEventsForElements(scope.$parent, $('#viewCtrlId'), compile);
                    scope.$watch(conf, viewEngine.updateIdx4Jpath(scope.$parent, element));
                    //viewEngine.updateIdx4Jpath(scope.$parent, element.parent().parent());
                    /*$timeout(function(){
                        viewEngine.updateIdx4Jpath(scope.$parent, $('#Pagination'));//element.parent().parent()
                        },0);*/
                }
                // prevPage
                scope.prevPage = function() {
                    if(conf.currentPage > 1){
                        conf.currentPage -= 1;
                        conf.opt = "previous";
                        conf.step = 1;
                    }
                    getPagination(element, $compile);
                    if(conf.onChange) {
                        conf.onChange();
                    }
                };
                // nextPage
                scope.nextPage = function() {
                    if(conf.currentPage < conf.numberOfPages){
                        conf.currentPage += 1;
                        conf.opt = "next";
                        conf.step = 1;
                    }
                    getPagination(element, $compile);
                    if(conf.onChange) {
                        conf.onChange();
                    }
                };
                // 变更当前页
                scope.changeCurrentPage = function(item) {

                    if(item == '...'){
                        return;
                    }else{
                        if(item > conf.currentPage){conf.opt = "next";} else if(item < conf.currentPage) {conf.opt = "previous";}
                        conf.step = Math.abs(item - conf.currentPage);
                        conf.currentPage = item;
                        getPagination(element, $compile);
                        // conf.onChange()函数
                        if(conf.onChange) {
                            conf.onChange();
                        }
                    }
                };
                // 修改每页展示的条数
                scope.changeItemsPerPage = function() {

                    // 一发展示条数变更，当前页将重置为1
                    conf.currentPage = 1;
                    getPagination(element, $compile);
                    // conf.onChange()函数
                    if(conf.onChange) {
                        conf.onChange();
                    }
                };
                scope.jumpToPage = function() {// 跳转页
                    num = scope.jumpPageNum;
                    if(num.match(/\d+/)) {
                        num = parseInt(num, 10);

                        if(num && num != conf.currentPage) {
                            if(num > conf.numberOfPages) {
                                num = conf.numberOfPages;
                            }
                            // 跳转
                            if(num > conf.currentPage){conf.opt = "next";} else if(num < conf.currentPage) {conf.opt = "previous";}
                            conf.step = Math.abs(num - conf.currentPage);
                            conf.currentPage = num;
                            getPagination(element, $compile);
                            // conf.onChange()函数
                            if(conf.onChange) {
                                conf.onChange();
                            }
                            scope.jumpPageNum = '';
                        }
                    }
                };
                scope.jumpPageKeyUp = function(e) {
                    var keycode = window.event ? e.keyCode :e.which;
                    if(keycode == 13) {
                        scope.jumpToPage();
                    }
                }
                scope.$watch('conf.totalItems', function(value, oldValue) {
                    // 在无值或值相等的时候，去执行onChange事件
                    if(!value || value == oldValue) {
                        if(conf.onChange) {
                            conf.onChange();
                        }
                    }
                    getPagination(element, $compile);
                });
                //当不在第一页把每页显示数量增大时需要调整当前显示的元素的jpath下标
                scope.$watch('conf.itemsPerPage', function(value, oldValue) {
                    // 在无值或值相等的时候，去执行onChange事件
                    if(!value || value == oldValue) {
                        if(conf.onChange) {
                            conf.onChange();
                        }
                    }else if(value > oldValue){
                    	//当增加每页数量时，页面下标没有刷新，故要修改当前页面元素的下标
                    	var el = element.parent().parent();
                    	//记录前一个jpath的下标
                    	var preIdx;
                    	//遍历页面元素
                        $(el).find("input,select,textarea").each(function(){
                            var _jpath = $(this).attr("jpath");
                            //jpath存在
                            if (_jpath) {
                            	//获取下标
                                var _idx = _jpath.match(/\[\d+\]/g);//只考虑一维
            	                //下标存在
                                if(_idx) {
            	                	var idx = parseInt(_idx[0].replace("]","").replace("[",""));
            	                	//下班小于旧的每页记录数直接退出
            	                	if(idx < oldValue){
            	                		return false; //跳出循环
            	                	}else{
            	                		//前一个元素的下班大于当前元素的下标时直接退出循环
            	                		if(preIdx && preIdx > idx){
            	                			return false; //跳出循环
            	                		}
            	                		preIdx = idx;
            	                        idx = idx%oldValue;
            	                        _jpath = _jpath.replace(/\[\d+\]/g, "[" + idx + "]");
            	                        $(this).attr("jpath", _jpath);
            	                	}
            	                }
                            }
                        });
                    }
                });
            }
        };
    }).constant('paginationConf', {
            currentPage: 1,
            totalItems: 800,
            itemsPerPage: 20,
            pagesLength: 11,
            perPageOptions: [10, 20, 30, 40, 50],
            opt: "",
            step: 0,
            keyWord: "",
            onChange: function(){}
        }
    );

    /**
     * 把日期格式字符串转换成日期date
     */
    function str2Date(StringDate,DateFormat) {
        //正则
        var regexList = [
            {
                "format": "yyyy",
                "index": -1,
                "regex": "([1-9]\\d{3})",
                "value": "",
                "regIndex":0
            },
            {
                "format": "MM",
                "index": -1,
                "regex": "(\\d{2})",
                "value": "",
                "regIndex":0
            },
            {
                "format": "dd",
                "index": -1,
                "regex": "(\\d{2})",
                "value": "",
                "regIndex":0
            },
            {
                "format": "HH",
                "index": -1,
                "regex": "(\\d{2})",
                "value": "",
                "regIndex":0
            },
            {
                "format": "mm",
                "index": -1,
                "regex": "(\\d{2})",
                "value": "",
                "regIndex":0
            },
            {
                "format": "ss",
                "index": -1,
                "regex": "(\\d{2})",
                "value": "",
                "regIndex":0
            }
        ]


        /**
         * 复制格式，转换成正则，并记录好位置
         */
        var regexDateStr=new String(DateFormat);


        var arr=[];
        for(var i in regexList){
            var o=regexList[i];
            var format=o.format;
            var index=o.index;
            var regex=o.regex;
            //标记位置,如果搜索不到，返回-1
            var sIndex=regexDateStr.search(format);
            regexList[i].index=sIndex;
            if(sIndex!=-1){
                arr.push(o);
            }
            //替换成正则
            regexDateStr = regexDateStr.replace(format,regex);
        }


        arr=arr.sort(function(a,b){
            return a.index-b.index;
        })

        for(var i=0;i<arr.length;i++){
            arr[i].regIndex=i+1;
        }




        //进行正则匹配
        var patt=new RegExp(regexDateStr,"ig");

        var resultDate={};
        if(patt.test(StringDate)){
            //根据下标取结果
            for(var j in arr){
                var o = arr[j];
                var format=o.format;

                if(o.index!=-1){
                    var v=RegExp["$"+o.regIndex];
                    o.value=v;
                    resultDate[format]=v;
                }
            }
        }else{
            //日期格式不符合
            console.log("日期格式不符合！");
            return "";
        }

        //把json日期格式转换date
        var date=new Date();
        resultDate["yyyy"]?date.setFullYear(resultDate["yyyy"]):"";
        resultDate["MM"] ? date.setMonth(Number(resultDate["MM"])-1) : "";
        resultDate["dd"] ? date.setDate(resultDate["dd"]) : "";
        resultDate["HH"] ? date.setHours(resultDate["HH"]) : "";
        resultDate["mm"] ? date.setMinutes(resultDate["mm"]) : "";
        resultDate["ss"] ? date.setSeconds(resultDate["ss"]) : "";

        return date;
    }


    /**
     * @author huanggpeiyuan
     * @date 2018-07-18
     * 获取月份最后一天
     */
    viewApp.filter("getEndDate", [function(){
        return function(dateStr,dateFormat) {
            var _dateFormat='yyyy-MM-dd';
            if (dateFormat) {
                _dateFormat = dateFormat;
            }
            var year = "";
            var month = "";
            if (_dateFormat == "yyyy-MM-dd") {
                var arr = dateStr.split("-");
                year = Number(arr[0]);
                month = arr[1];
            } else{
                var date = str2Date(dateStr, _dateFormat);
                year = date.getFullYear();
                month = (Number(date.getMonth())+1)+"";//月份是从0~11,所以要+1
                //如果是一个位，补上0
                if(month.length==1){
                    month="0"+month;
                }
            }

            var date={
                "01":31,
                "02":29,
                "03":31,
                "04":30,
                "05":31,
                "06":30,
                "07":31,
                "08":31,
                "09":30,
                "10":31,
                "11":30,
                "12":31
            }

            //判断是否闰年
            if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) {
                date['02']=28;
            }
            return date[month];
        }
    }]);

    /**
     * 新增：2018-08-01 huangpeiyuan
     * 数组过滤器
     * 过滤数组并记录其对应关系
     * arr 数组 array
     * id  特征值 String
     * fnNameOrIfCondition 函数名或者条件语句 String
     */
    viewApp.filter("filterArr", [function(){
        return function(arr,id,fnNameOrIfCondition) {
            var handle=null; //处理函数

            if(!angular.isArray(arr)){
                throw '[filterArr] 过滤对象非数组';
                return [];
            }
            if(!id){
                throw '[filterArr] 数组过滤器需要传入id';
                return [];
            }
            if(!fnNameOrIfCondition){
                throw '[filterArr] 条件或函数名未需要传入id';
                return [];
            }else{

                var firstVarIndex=fnNameOrIfCondition.indexOf('.')-1;
                //判断是否条件,如果是条件，则一般是取属性写法 "a.b"
                if(firstVarIndex >= -1){
                    //此处规定,必须第一个变量放到前面
                    var varName=$.trim(fnNameOrIfCondition).substring(0,firstVarIndex);
                    //handle=eval("(function("+varName+"){return "+fnNameOrIfCondition+";})");
                    var strFn='function('+varName+'){ return '+fnNameOrIfCondition+';}';
                    /*
                     * 由于IE8 不支持这种写法;
                     * eval(strFn)
                     * 改成 三元表达式，返回函数
                     * "0?0:"+strFn
                     */
                    handle = eval("0?0:"+strFn);
                    if(!angular.isFunction(handle)){
                        console.log("filterArr 函数参数解析失败!");
                        return [];
                    }
                }else{ //否则，是函数
                    try{
                        var newFn=  eval(fnNameOrIfCondition);
                        if(angular.isFunction(newFn)){
                            handle=newFn;
                        }else {
                            throw "[filterArr]"+ nameFn + "该参数不是函数名。";
                            return [];
                        }
                    }catch (e) {
                        throw "[filterArr] 无法解析" + nameFn + '该函数';
                        return [];
                    }
                }
            }
            !this._filterMap ? this._filterMap={}:"";
            //每次过滤需要重置，不能做缓存
            this._filterMap[id]={
                new2oldMap:{},
                old2newMap:{}
            }
            var storeMap=this._filterMap[id]; //保存新旧数组下标对应关系
            var newArr=[];
            for(var i=0;i<arr.length;i++){
                var o=arr[i];
                if(handle(o,id,i)){
                    newArr.push(o);
                    var newIndex=(newArr.length-1);// 新数组下标;
                    var origin = i;                  //原始数组下标;
                    storeMap.new2oldMap[newIndex+""]=origin;// 新数组下标 对应 原始数组下标
                    storeMap.old2newMap[origin+""]=newIndex;// 原始数组下标 对应 新数组下标
                }
            }
            //this._filterMap[id].newArr=newArr;//是否需要保存起来
            return newArr;
        }
    }]);

    /**
     * 分页过滤器
     * gridLb   动态行对象
     * page     当前第几页
     * pageSize 每页条数
     * hiddenItems 隐藏的记录数（环保税时页面可以一行都不展示，但是为了公式编译成功则需要增加一行空数据，这样导致总条数不对，故需要增加此参数来调整总条数）
     */
    viewApp.filter("paging", [function(){

        return function(gridLb,id, hiddenItems) {
            //判断是否有分页id传入
            if (!id) {
                throw "paging : 请加上ng-pagination 的id！";
                return;
            }
            var sconf =( this.conf && this.conf[id] ) ?this.conf[id]:"";
            var page = sconf.currentPage;
            var pageSize = sconf.itemsPerPage;

            //如果不存在，或者不是数组,或者当前当前页不存在
            if (!gridLb || !angular.isArray(gridLb || page < 0 || pageSize <= 0)) {
                sconf.totalItems=0
                return [];
            }

            // 当动态行执行filter的时候设置总条数 1
            if(hiddenItems && angular.isNumber(hiddenItems)){
                sconf.totalItems=gridLb.length-hiddenItems;
            }else{
                sconf.totalItems=gridLb.length
            }

            var _start = (page-1)*pageSize;//开始下标
            var _end = (page)*pageSize;//结束下标 （不包括该元素）
            var filtedList = gridLb.slice(_start, _end);//过滤分页内容 1 10

            return filtedList;
        };
    }]);
}//)(this, viewApp);

function selecteDjxh(nsrsbh,djxh,swjgDm){
	     layer.closeAll();
	     var index1 ;
	     var url =  "/web-sbzs/NsrxxByNsrsbh/ajaxByNsrshbNext.do";
		 $.ajax({
				data:{nsrsbh:nsrsbh,djxh:djxh,swjgDm:swjgDm},
				url:url,
	            beforeSend: function () {
	            	index1 = layer.load(2, {shade: false});
	            },
				success:function(msg){
					layer.close(index1);
					if(msg.code=='000'){
						layer.msg('数据成功加载,请点击任意继续。。。', {icon: 1});
						var formData = $scopeTemp.formData;
						var bodyM = eval("("+msg.body+")");
						$scopeTemp.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idxTemp].bdkdjdsdjnsrmc=bodyM.nsrMc;
						$scopeTemp.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idxTemp].bkjdjxh=djxh;
						$scopeTemp.formData.tydkdjdsdjsbbSbbdxxVO.dkdjdsdjskmxbgb.dkdjFbSkmxbgGrid.dkdjdsdjskbgbGridlb[idxTemp].rdSfzrdxxs=bodyM.rdSfzrdxxs;
						viewEngine.formApply($('#viewCtrlId'));
						var frame = parent.document.getElementById("frmSheet");
					    var domDocument = frame.contentWindow.document.body;
					    $(".layui-layer-shade",domDocument).remove();
					}else{
						layer.msg('数据加载失败,请留意错误信息，必要请联系管理员！', {icon: 5});
						dhtmlx.message(msg.msg, "error", 5000);
					}
				},
				error:function(){
					layer.close(index1);
					dhtmlx.message("请求失败 ", "error", 5000);
				}
			});
}
function hideMenu(_this) {
	$("#menuContent").hide();
	if(_this){
		$(_this).unbind("mousedown", onBodyDown);
	}
	
}
function onBodyDown(event) {
	var eve = event || window.event;
 	var target = eve.srcElement || eve.target;
	if (!(target.id == "menuContent" || $(target).parents(
			"#menuContent").length > 0)) {
		var _this=this;
		hideMenu(_this);
	}
}

/**
 * IE浏览器情况下select2在加载option时早于ngCodetable初始化，导致select2加载不到数据
 * @param $element
 * @param _newVal
 */
function select2SetVal($element, _newVal){
    var ngOptions = $element.attr('ng-options');
    if(ngOptions) {
        var index = ngOptions.indexOf("CT.");
        if (index > -1) {
            var ctName = ngOptions.substring(index + 3);
            index = ctName.indexOf("CT");
            if (index > -1) {
                ctName = ctName.substring(0, index + 2);
            } else {
                var reg = /([a-zA-Z0-9_]+)[\.\[\|]*.*/g;
                ctName = reg.exec(ctName)[1];
                ctName = $.trim(ctName);
            }

            if (parent.formCT[ctName]) {
                var _multiple = $element.attr('multiple');
            if(_multiple) {} else _newVal += "#"+$element.val();

                //设置额外属性
                setExtSetting($element);
                $element.select2('val', _newVal);
            } else {
                setTimeout(function () {
                    select2SetVal($element, _newVal);
                }, 50);
            }
        } else {
            if ("" == $element.context.innerHTML) {
                setTimeout(function () {
                    select2SetVal($element, _newVal);
                }, 50);
            } else {
                var _multiple = $element.attr('multiple');
            if(_multiple) {} else _newVal += "#"+$element.val();
                //设置额外属性
                setExtSetting($element);
                $element.select2('val', _newVal);
            }
        }
    }
}


/**
 * IE浏览器情况下select2在加载option时早于ngCodetable初始化，导致select2加载不到数据
 * @param expression
 * @param $element
 * @param newVal
 */
function setData4Config(expression,$element,newVal){
	var ct = getCTData(expression,$element);
	
	if(ct){
		var asIndex = expression.indexOf('as');
		var forIndex = expression.indexOf('for');

		var keyName = expression.substring(0,asIndex).replace(/(^\s*)|(\s*$)/g, '');
		var valueName = expression.substring(asIndex + 2,forIndex).replace(/(^\s*)|(\s*$)/g, '');

		var data = new Array();
		for(var key in ct){
			var value = ct[key];
			var tmp = {};
 
			tmp.id = eval(keyName);
            tmp.name = eval(valueName);
			tmp.order = key;
			data.push(tmp);
		}
        $element.selectPageData(data);

        if(typeof newVal !== 'undefined') {
            $element.val(newVal);
            $element.selectPageRefresh();
        }
	}else{
		setTimeout(function () {
			setData4Config(expression,$element,newVal);
		},10);
	}
}

//生成伪uuid
function getUUID(){
    var uuid="";
    for(var i=0;i<8;i++){
        uuid+=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return uuid;
}

/**
 * 解析表达式得到formCT里的ct对象
 * @param expression
 * @param $element
 * @returns
 */
function getCTData(expression,$element){
	var CT = parent.formCT;
	var formData = parent.formData;

	var inIndex = expression.indexOf('in');
	var ctName = expression.substring(inIndex + 2).replace(/(^\s*)|(\s*$)/g, '');
	var ct;
	
	if(ctName.indexOf('[') > -1){
		var newCtName = ctName.substring(0,ctName.indexOf('['));
		var newCt = eval(newCtName);

		if(newCt){
			var inStr = ctName.substring(ctName.indexOf('[')+1,ctName.lastIndexOf(']'));
			var inValue;
			try{
				inValue = eval(inStr);
			}catch(e){
				try{
					inValue = eval('formData.' + inStr);
				}catch(e1){}
			}
			
			if(!inValue){
				var attributes = $element.context.attributes;
				if(attributes.jpath){
					var jpath = attributes.jpath.value;
					jpath = 'formData.' + jpath.substring(0,jpath.lastIndexOf('.'));
					
					inStr = jpath + inStr.substring(inStr.lastIndexOf('.'));
					inValue = eval(inStr);
						
					if(inStr){
						ctName = ctName.substring(0,ctName.indexOf('[')+1) + inValue + ctName.substring(ctName.lastIndexOf(']'));
						ct = eval(ctName);
					}
				}
			}
		}
	}else{
		ct = eval(ctName);
	}
	
	return ct;
}

/**
 * 为下拉设置额外属性，具体场景如下：
 * JSONE-1230 车辆购置税申报，减免性质代码显示，其中一条要红色字体
 * @param $element
 */
function setExtSetting($element){
    //获取额外属性extSetting
    var extSetting = $element.attr('extSetting');
    if (!extSetting) {
        return;
    }
    //将extSetting转换成JSON对象
    var extSettingJSON;
    try {
        extSettingJSON = angular.fromJson(extSetting);
    } catch (e) {
    }

    if (extSettingJSON) {
        //遍历json对象，根据key找需要设置额外属性的option元素
        for (var key in extSettingJSON) {
            var optEle = $element.children("option[value='" + key + "']");
            var propJSON = extSettingJSON[key];
            if (optEle.length > 0 && propJSON) {
                //找到对应的option元素后，设置相关属性
                for (var propKey in propJSON) {
                    //设置属性
                    optEle.prop(propKey, propJSON[propKey]);
                }
            }
        }
    }
}

/**
 * 初始化码表
 * 从码表数据来源层面来说支持三种方式的码表
 *  1、码表数据来源于url（json文件和普通的getDmb.do）
 *  2、码表数据来源于期初数model
 *  3、码表数据来源于带参数的请求params（/nssb/getDtdmb.do）
 * 码表请求支持同步异步配置async（默认为异步true）
 * 码表支持累加contact，对于两个来源的数据码表的name一样，最后的结果会做合并操作
 * @param $scope
 * @param attributes
 */
function initCodeTable($scope, attributes) {
    var _name = attributes["name"];
    var _url = attributes["url"];
    var _model = attributes["model"];
    var _params = attributes["params"];
    var _ywztParams = attributes["ywztparams"];

    var _jsons = {};
    var codeTableContact = attributes["contact"];

    // 码表累加指令。如果有此指令。码表查询结果将会进行累加。
    if(codeTableContact){
        if(undefined !== parent.formCT[codeTableContact]){
            _jsons = jQuery.extend(true, {}, parent.formCT[codeTableContact]);
        }
    }

    if(undefined == parent.formCT[_name] || JSON.stringify(parent.formCT[_name]) == "{}") {//判断是否已缓存
        if((undefined != _url && "" != _url) || (undefined !== _params && "" !== _params)) {//URL来源
            getDmFromUrl($scope, attributes, _jsons);
        } else if(undefined !== _model && "" !== _model) {//期初数来源
            getDmFromModel($scope, attributes, _jsons);
        }else if(undefined !== _ywztParams && "" !== _ywztParams){
            getDmFromYwztParamsUrl($scope, attributes, _jsons);
        } else {
            //codetable指令相关参数缺失
            dhtmlx.message("codetable指令相关参数缺失，请检查...", "error", 2000);
        }
    }
}

/**
 * 从url（json文件和普通的getDmb.do）获取码表数据
 * @param $scope
 * @param attributes
 * @param _jsons
 */
function getDmFromUrl($scope, attributes, _jsons) {
    var _async=!(attributes["async"] === "false" || attributes["async"] === false);// 默认为异步true
    var _node = attributes["node"];
    var _name = attributes["name"];
    var _url = attributes["url"];

    var _params = attributes["params"];
    var _dynamicParam = attributes["dynamic"];
    var _data;

    var filterParam = attributes["filter"];
    var filterKey = filterParam?filterParam.split("#")[0]:null;
    var filterValue = filterParam?filterParam.split("#")[1]:null;
    
    var _dm = attributes["dm"];
    var _mc = attributes["mc"];

    var _start_ = new Date().getTime();
    console.log("INFO:"+_start_+" 初始化代码表"+ _name +"开始时间");
    
   
    var data = {};
    // 判断是否存在自定义方法名，如果存在，执行自定义方法，返回执行后得url参数
    var _ywFuName = attributes["ywfuname"];
    if(_ywFuName){
    	// 自定义组装url参数
    	_url = eval("parent."+_ywFuName+"(attributes);");
    }else if(!(undefined != _url && "" != _url)){
    	// 从带参数的请求params（/nssb/getDtdmb.do）获取码表数据
    
    	_url = parent.pathRoot+"/nssb/getDtdmb.do?";
        if(_params.indexOf("=") === -1){
            _params = "key=" + _params;
        }
        _url += _params;
        if(_dynamicParam && (typeof getDynamicParam === "function")){
        	_url += "&" + getDynamicParam($scope,_dynamicParam);
        }
        
        data["djxh"] = $(parent.document).find("#djxh").val();
        data["nsrsbh"] = $(parent.document).find("#nsrsbh").val();
        data["gdslxDm"] = $(parent.document).find("#gdslxDm").val();
        data["swjgdm"] = $(parent.document).find("#swjgDm").val();
        data["dm"] = _dm;
        if(_mc !== undefined && _mc !== ""){
            data["mc"] = _mc;
        }
    }else{
    	if(_url.indexOf('getDmb.do')>-1){
	        var ywlx="/"+location.pathname.split('/')[3];
	        _url=parent.pathRoot+ywlx+_url;
	        var gdslxDm=parent.$("#gdslxDm").val();
	        if(gdslxDm){
	            _url=encodeURI(_url+"&gdslxDm="+gdslxDm);
	        }
	    }
	    
	    // 允许添加参数，param为key, dynamicParam为value，可以多个逗号隔开，但个数必须一致
	    if (_params && _dynamicParam) {
	        var aryParam = _params.split(',');
	        var aryDynamic = _dynamicParam.split(',');
	        if (aryParam && aryDynamic && aryDynamic.length == aryDynamic.length) {
	            for (var idx=0; idx<aryParam.length; idx++) {
	                _data = jsonPath($scope.formData, aryDynamic[idx])[0];
	                if (_data) {
	                    _url = _url + (idx===0?"?":"&") + aryParam[idx] + "=" + _data;
	                } else {
	                    // 发现有不符合的，则不进行拼接
	                    break;
	                }
	            }
	        }
	    }
	    
	}
    $.ajax({
        type : "GET",
        async: _async,
        url : _url,
        data : data,
        dataType : "json",
        success : function(response) {
            _data = response;
            
            if(!(undefined != _url && "" != _url)){
            	if(typeof response === "string"){
                    response = JSON.parse(response);
                }
                if(response && response["dtdmbxx"]){
                    response = response["dtdmbxx"];
                }
                if(undefined === _node || "" === _node) {
                    _data = response;
                } else {
                    _data = response[_node];
                }
                if(typeof _data === "string"){
                    _data = JSON.parse(_data);
                }
                if(_data && _data["root"]){
                    $.each(_data.root, function(k,v) {
                        _jsons[v["dm"]] = v;
                    });
                    _data = _jsons;
                }
            }else{
            	if(undefined === _node || "" === _node) {
                    _data = response;
                } else {
                    _data = response[_node];
                }
                var doFilter = false;
                $.each(_data, function(k,v) {
                    doFilter = false;
                    if(filterKey && filterValue && v){
                        if(v[filterKey] != filterValue){
                            doFilter = true;
                        }
                    }
                    if(!doFilter){
                        _jsons[k] = v;
                    }
                });
            }
            
            
            parent.formEngine.cacheCodeTable(_name, _jsons);

            if(attributes["id"]){
                var _values = parent.formCT["_" + attributes["id"]];
                if(_values){
                    _values.zt = "200";
                    parent.formEngine.cacheCodeTable("_" + attributes["id"], _values);
                }else{
                    var _values = {};
                    _values.name = attributes["name"];
                    _values.attributes = attributes;
                    _values.zt = "200";
                    parent.formEngine.cacheCodeTable("_" + attributes["id"], _values);
                }
            }

            var _formApplyStart_ = new Date().getTime();
            viewEngine.formApply($('#viewCtrlId'), _name, _jsons);
            var _end_ = new Date().getTime();

            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 初始化代码表:"+ _name);
            console.log("INFO:"+_formApplyStart_+"-"+_end_+"-"+(_end_ - _formApplyStart_)+"ms formApply:"+ _name);
        },error : function() {
            dhtmlx.message("codetable指令缓存代码表"+_url+"，请检查...", "error", 2000);
        }
    });
}

/**
 * 从期初数model获取码表数据
 * @param $scope
 * @param attributes
 * @param _jsons
 */
function getDmFromModel($scope, attributes, _jsons) {
    var _name = attributes["name"];
    var _multi = attributes["multi"];
    var _data;

    var _model = attributes["model"];
    var _dm = attributes["dm"];

    var filterParam = attributes["filter"];
    var filterKey = filterParam?filterParam.split("#")[0]:null;
    var filterValue = filterParam?filterParam.split("#")[1]:null;

    _data = jsonPath($scope.formData, _model)[0];
    if(undefined === _data || "" === _data){
    	console.log("ERROR:codetable指令缓存代码表获取的data为空，对应的model为:"+_model+",name为:"+_name);
        return;
    }
    
    if(undefined !== _dm && "" !== _dm) {
        var doFilter = false;
        $.each(_data, function(k,v) {
            doFilter = false;
            if(filterKey && filterValue){
                if(v[filterKey] != filterValue){
                    doFilter = true;
                }
            }
            if(!doFilter){
                if(_multi=='true'){
                    if(!_jsons[v[_dm]])
                        _jsons[v[_dm]]=[];
                    _jsons[v[_dm]].push(v);
                }else{
                    _jsons[v[_dm]] = v;
                }
            }
        });
        _data = _jsons;
        var _jpath = jsonPath($scope.formData, _model, { "resultType" : "PATH" });
        if(_jpath.length === 1){
            _jpath = _jpath[0].replace(/\[\'/g,".").replace(/\'\]/g,"");
        }
        var _info = {"model":_model,"dm":_dm,"jpath":_jpath};
        viewEngine.formApply($('#viewCtrlId'), "_info_"+_name, _info);
    }

    parent.formEngine.cacheCodeTable(_name, _data);
    viewEngine.formApply($('#viewCtrlId'), _name, _data);
}


/**
 * 从带参数的请求ywztparams 获取码表数据
 * @param $scope
 * @param attributes
 * @param _jsons
 */
function getDmFromYwztParamsUrl($scope, attributes, _jsons) {
    var _node = attributes["node"];
    var _name = attributes["name"];
    var _params = attributes["ywztparams"];

    var _dm = attributes["dm"];
    var _mc = attributes["mc"];
    var _req_data = JSON.parse(_params);
    _req_data["djxh"] = $(parent.document).find("#djxh").val();
    _req_data["nsrsbh"] = $(parent.document).find("#nsrsbh").val();
    _req_data["gdslxDm"] = $(parent.document).find("#gdslxDm").val();
    _req_data["swjgdm"] = $(parent.document).find("#swjgDm").val();
    _req_data["dm"] = _dm;
    if(_mc !== undefined && _mc !== ""){
        _req_data["mc"] = _mc;
    }
    var _data = null;
    parent.parent.requestYwztData(_req_data,function(response){
        if(undefined === _node || "" === _node) {
            _data = response;
        } else {
            _data = response[_node];
        }
        try{
            if(typeof _data === "string"){
                _data = JSON.parse(_data);
            }
        }catch(e){
            console.log("INFO:初始化代码表失败。失败原因："+_data);
            return;
        }
        if(undefined !== _dm && "" !== _dm) {
            $.each(_data, function(k,v) {
                v["mc"] = v[_mc];
                //delete v[_mc];
                _jsons[v[_dm]] = v;
            });
        }else{
            _jsons = jQuery.extend(true, _jsons, _data);
        }
        parent.formEngine.cacheCodeTable(_name, _jsons);
        viewEngine.formApply($('#viewCtrlId'), _name, _jsons);
    },function(response){
        console.log("INFO:初始化代码表失败。失败原因："+response);
        return;
    });
}

