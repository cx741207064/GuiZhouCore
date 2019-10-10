/**
 * Created by Administrator on 2016-05-12.
 */
function ngDirectives(gobal, viewApp){
    viewApp
        .constant(
        "ngDatatypeConfig",
        {
            "number" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var precision = 2;
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            precision = result[1];
                        }
                    }
                    try {
                        return filter("number")(modelValue, precision);
                    } catch (e) {
                        console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                    }
                },
                "parser" : function(args){
                    var precision = 2;
                    var viewValue = args.$viewValue, attrs = args.$attrs;
                    var num = viewValue.replace(/[^0-9.-]/g, '');
                    //TO-DO  默认取14位整数，有待优化，可以定义   支持number{10.2} 整数位数10位,小数位数2位  与 number{2} 小数位数2位
                    var numArr = num.split(".");
                    num = (numArr[0]).substr(0,14) +"."+ numArr[1]
                    var result = parseFloat(num, 10);
                    if (attrs.ngDatatype) {
                        var reg = /{(-?\d*)}/;
                        var resultPrec = reg.exec(attrs.ngDatatype);
                        if (resultPrec) {
                            precision = resultPrec[1];
                        }
                    }
                    result = isNaN(result) ? 0 : result;
                    return parseFloat(result.toFixed(precision));
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
            "positive_number" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
                    var precision = 2;
                    if (attrs.ngDatatype) {
                        var reg = /{(\d*)}/;
                        var result = reg.exec(attrs.ngDatatype);
                        if (result) {
                            precision = result[1];
                        }
                    }
                    try {
                    	if(modelValue !="" && modelValue*1 < 0){
                    		modelValue = - modelValue*1;
                    	}
                        return filter("number")(modelValue, precision);
                    } catch (e) {
                        console.log("ERROR[" + e + "],ng-model is " + attrs.ngModel);
                    }
                },
                "parser" : function(args){
                    var precision = 2;
                    var viewValue = args.$viewValue, attrs = args.$attrs;
                    var num = viewValue.replace(/[^0-9.]/g, '');
                    //TO-DO  默认取14位整数，有待优化，可以定义   支持number{10.2} 整数位数10位,小数位数2位  与 number{2} 小数位数2位
                    var numArr = num.split(".");
                    num = (numArr[0]).substr(0,16) +"."+ numArr[1]
                    var result = parseFloat(num, 10);
                    if (attrs.ngDatatype) {
                        var reg = /{(\d*)}/;
                        var resultPrec = reg.exec(attrs.ngDatatype);
                        if (resultPrec) {
                            precision = resultPrec[1];
                        }
                    }
                    result = isNaN(result) ? 0 : result;
                    return parseFloat(result.toFixed(precision));
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
            "digit" : {
                "formatter" : function(args){
                	if (args.$attrs.ngDefaultValue) {
                		return args.$modelValue ? args.$modelValue : args.$attrs.ngDefaultValue;
                	}
                    return args.$modelValue;
                },
                "parser" : function(args){
            		return args.$viewValue ? args.$viewValue.replace(/[^0-9-]/g, '') : "";
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
            "natural" : {
                "formatter" : function(args){
                    return args.$modelValue;
                },
                "parser" : function(args){
                    return args.$viewValue ? args.$viewValue.replace(/[^0-9]/g, '') : "";
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
            "int" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return filter("number")(modelValue);
                },
                "parser" : function(args){
                    var val = parseInt(args.$viewValue.replace(/[^0-9-]/g, ''), 10);
                    return isNaN(val) ? undefined : val;
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
                    return isNaN(val) ? undefined : '';
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
            "strInt" : {
                "formatter" : function(args){
                    var modelValue = args.$modelValue, filter = args.$filter;
                    if(modelValue === ""){                    	 
                   	 	return modelValue;
                    } 
                    return filter("number")(modelValue);
                },
                "parser" : function(args){
	            	if(args.$viewValue === ""){                    	 
	                	 return args.$viewValue;
	                } 
                	var val = parseInt(args.$viewValue.replace(/[^0-9-]/g, ''), 10);
                    return isNaN(val) ? '' : val;
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
            /**
             * 百分比显示格式化
             */
            "percent" : {
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
                    modelValue = modelValue * 1;
//                    if(isNaN(modelValue)){
//                    	modelValue = 0;
//                    	return 0+'.0000%';
//                    }
                    var default_val = attrs["defaultVal"];
                    if(angular.isNumber(modelValue) && !isNaN(modelValue)) {
                        return (Math.round(modelValue * Math.pow(10, decimals + 2))/Math.pow(10, decimals)).toFixed(decimals) + suffix;
                    } else if(default_val != undefined){
                    	return default_val;
                    }
                    else return (Math.round(0 * Math.pow(10, decimals + 2))/Math.pow(10, decimals)).toFixed(decimals) + suffix;
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

                        var parseFuction = function(funKey){
                            if (attrs[funKey]) {
                                var func = $parse(attrs[funKey]);
                                return (function(args){
                                    return func(scope, args);
                                });
                            }
                            return config[funKey];
                        };

                        var formatter = parseFuction("formatter");
                        var parser = parseFuction("parser");
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
        return (which >= 96 && which <= 105);
    };
    
    var englishKeyBoard = function(event){
        var key = event.key;
        return ((key >= "a" && key <= "z") || (key >= "A" && key <= "Z"));
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

    /**
     * 自定义指令ngRepeatInit
     *在angular初始化repeat指令时调用，如为每一个指令下的单元格绑定事件
     */
    viewApp.directive('ngRepeatInit', function () {
        return {
            link: function ($scope, $element, $attr) {
                //console.log(scope.$index)
                //调用绑定事件方法
               $scope.$eval(setViewEngine.bindEventsForElements($scope, $element));
                var _skipElem = $element.attr('skip-elem');
                var _defaultValue = $element.attr('default-value');
                var _keyword = $element.attr('ng-repeat-init');
                var obj = _defaultValue
                if(undefined == obj || '' === obj) {
                    obj = jQuery.extend(true, {}, $scope[_keyword][0]);//增行时默认取第一行模型;
                    $.each(obj, function(k,v){
                        if(_skipElem && k == _skipElem) {

                        } else{
                            if(typeof v =='string') {
                                obj[k] = '';
                            } else if(typeof v == 'number') {
                                obj[k] = 0;
                            } else if(typeof v == 'object') {
                                obj[k] = {};
                            }else if(typeof v == 'percent'){
                            	obj[k] = 0;
                            }
                        }
                    });
                    // 由于angular双向绑定过程中，会对数据模型加入一些私有变量，如$index等标识，
                    // 所以不能直复制对象操作;
                    obj = JSON.stringify(obj);
                }
                
                //重复行jpath集合
                var _jpaths = [];
                $($($element).children().children()).each(function(index) {
                	var _jpath = $(this).attr('jpath');
                	if(undefined != _jpath) {
                		_jpaths.push(_jpath.replace(/\[\d+\]/g,"[0]"));
                	}
                	
                });
                if(undefined == $scope['_arr_' + _keyword]) {
                	$scope['_arr_' + _keyword] = _jpaths;
                }
                
                $scope.add=function(){
                    $scope[_keyword].splice((this.$index+1),0,JSON.parse(obj.replace(/\\/g,'')));
                    if(undefined != $scope['_arr_' + _keyword]) {
                    	_jpaths = $scope['_arr_' + _keyword];
                    	for(var i in _jpaths) {
                    		if(typeof _jpaths[i] == "string"){
                    			setFormulaEngine.apply(_jpaths[i], this.value);
                    		}
                    	}
                    	for(var j=$scope[_keyword].length-1;j>=this.$index+2; j--)
                    		for(var i in _jpaths) 
                    		{
                    			var oJpath=_jpaths[i].replace('[0]','['+(j-1)+']');
                    			var nJpath=_jpaths[i].replace('[0]','['+(j)+']');
                    			var tt=setFormulaEngine.idxVariable2NoPass;
                    			var cc=setFormulaEngine.idxVariable2Control;
                    			
                    			if(tt[oJpath])
                    				tt[nJpath]=tt[oJpath];
                    			if(cc[oJpath])
                    				cc[nJpath]=cc[oJpath];
                    			delete tt[oJpath] ;delete cc[oJpath] ;
                    			  
                    		}
                    	for(var i in _jpaths) {
                    		var ldPos=_jpaths[i].lastIndexOf('.')+1;
                    		var field=_jpaths[i].substring(ldPos);
                    		var nJpath=_jpaths[i].replace('[0]','['+(this.$index+1)+']');
                    		setFormulaEngine.apply(nJpath,  eval('('+obj+')')[field]);
                    	}
                    	setTimeout("setViewEngine.tipsForVerify(document.body);",500);
//                    	for(var j=this.$index;j<=$scope[_keyword].length-1 ;j++)
//                    		for(var i in _jpaths) 
//                    		{
//                    			var oJpath=_jpaths[i].replace('[0]','['+(j+1)+']');
//                    			var nJpath=_jpaths[i].replace('[0]','['+(j)+']');
//                    			var tt=setFormulaEngine.idxVariable2NoPass;
//                    			var cc=setFormulaEngine.idxVariable2Control;
//                    			if(tt[oJpath])
//                    				tt[nJpath]=tt[oJpath];
//                    			if(cc[oJpath]) 
//                    				cc[nJpath]=cc[oJpath];
//                    			delete tt[oJpath] ;delete cc[oJpath] ;
//                    			setFormulaEngine.apply(_jpaths[i], this.value);  
//                    		}
                    }
                  //  setTimeout('parent.autoResizeIframe("iframehtm")',500);
                }
                $scope.del=function(idx){
                    $scope[_keyword].splice(this.$index,1);
                    if(undefined != $scope['_arr_' + _keyword]) {
                    	_jpaths = $scope['_arr_' + _keyword];
                    	for(var i in _jpaths) {
                    		setFormulaEngine.apply(_jpaths[i], this.value);
                            setFormulaEngine.deleteIdxVariableNoPass(_jpaths[i].replace(/\[\d+\]/g,"["+ this.$index +"]"));
                            setViewEngine.tipsForVerify($element);
                    	}
                    	for(var j=this.$index;j<=$scope[_keyword].length-1 ;j++)
                    		for(var i in _jpaths) 
                    		{
                    			var oJpath=_jpaths[i].replace('[0]','['+(j+1)+']');
                    			var nJpath=_jpaths[i].replace('[0]','['+(j)+']');
                    			var tt=setFormulaEngine.idxVariable2NoPass;
                    			var cc=setFormulaEngine.idxVariable2Control;
                    			if(tt[oJpath])
                    				tt[nJpath]=tt[oJpath];
                    			if(cc[oJpath]) 
                    				cc[nJpath]=cc[oJpath];
                    			delete tt[oJpath] ;delete cc[oJpath] ;
                    			setFormulaEngine.apply(_jpaths[i], this.value);  
                    		}
                    	//TODO 应该有更好的方案
                    	setTimeout("setViewEngine.tipsForVerify(document.body);",500);
                    }
                   // setTimeout('parent.autoResizeIframe("iframehtm")',500);
                }
//                if ($scope.$last == true) {
//                    //console.log('ng-repeat执行完毕');
//                    $scope.$eval(renderFinish);
//                }
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
                var _jprefixs = $element.attr('ng-jprefix');//二选一
                //_jprefixs = $attr(ngJprefix);
                
                var _brePath = _jprefixs.substr(_jprefixs.lastIndexOf('\.') + 1);
                $scope[_brePath] = jsonPath($scope.formData, _jprefixs)[0];
                $scope["_jprefix_" + _brePath] = _jprefixs;
                  
                setViewEngine.bindEventsForElements($scope, $element);
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
                            //setViewEngine.formApply($('#viewCtrlId'), _sattr, _data);
                            var scope = angular.element($('#viewCtrlId')).scope();
                            if (null != _sattr && null != _data) {
                                scope[_sattr] = _data;
                            }
                            scope.$apply();
                            
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
                        var _url = $element.attr("url");
                        var _model = $element.attr("model");
                        var _node = $element.attr("node");
                        var _name = $element.attr("name");
                        var _dm = $element.attr("dm");
                        var _mc = $element.attr("mc");
                        var _data;
                        if(undefined == parent.formCT[_name]) {//判断是否已缓存
                            if(undefined != _url && "" != _url) {//URL来源
                                // 同步获取码表
                                $.ajaxSettings.async = false;
                                $.when($.getJSON(_url)).then(function(response){
                                    _data = response;
                                    if(undefined == _node || "" == _node) {
                                        //parent.formCT[_name] = response;
                                        _data = response;
                                    } else {
                                        //parent.formCT[_name] = response[_node];
                                        _data = response[_node];
                                    }
                                    //parent.formEngine.cacheCodeTable(_name, _data);
                                    parent.formCT[_name] =jQuery.extend(true, {}, _data);
                                    //setViewEngine.formApply($('#viewCtrlId'), _name, _data);
                                    var scope = angular.element($('#viewCtrlId')).scope();
                                    if (null != _name && null != _data) {
                                        scope[_name] = _data;
                                    }
                                    // scope.$apply();
                                }).fail(function() {
                                    // dhtmlx.message("codetable指令缓存代码表"+_url+"，请检查...", "error", 2000);
                                });
                                // 关闭同步获取
                                $.ajaxSettings.async = true;
                            } else if(undefined != _model && "" != _model) {//期初数来源
                                //parent.formCT = jsonPath($scope.formData, _model)[0];
                                _data = jsonPath($scope.formData, _model)[0];
                                if(undefined != _dm && "" != _dm) {
                                    var _jsons = {};
                                    $.each(_data, function(k,v) {
                                        _jsons[v[_dm]] = v;
                                    });
                                    _data = _jsons;
                                }

                                //parent.formEngine.cacheCodeTable(_name, _data);
                                parent.formCT[_name] =jQuery.extend(true, {}, _data);
                                //setViewEngine.formApply($('#viewCtrlId'), _name, _data);
                                var scope = angular.element($('#viewCtrlId')).scope();
                                if (null != _name && null != _data) {
                                    scope[_name] = _data;
                                }
                                scope.$apply();
                            } else {//codetable指令相关参数缺失
                                // dhtmlx.message("codetable指令相关参数缺失，请检查...", "error", 2000);
                            }
                        }
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
                $timeout(function(){
                    setViewEngine.tipsForVerify(document.body);
                },500);
            }
        }
    }]);
    /**
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

                      //  $(element).addClass("layui-date-input");
                        layui.use('laydate', function() {
                           // var laydate = layui.laydate;

                        	layui.laydate.render({
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
                                    if(!isEmptyObject(setFormulaEngine)){
                                    	setFormulaEngine.apply(_jpath, datas,dynamicParams);
                                    }
                                    setViewEngine.tipsForVerify(document.body);//el
                                    // 4、刷新angular视图
                                    setViewEngine.formApply($('#viewCtrlId'));
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
     * 自定义输入地址控件指令
     * <input type="text" select-address p="p" c="c" a="a" d="d" placeholder="请选择所在地" ng-model="xxx" />
     */
    viewApp.directive('selectAddress', function($http, $q, $compile) {
        var cityURL, delay, templateURL;
        delay = $q.defer();
        templateURL = '../../res/js/lib/address/address.html';
        cityURL = '../../res/js/lib/address/city.json';
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
                element.on('click keydown', function() {
                  popup.show();
                  event.stopPropagation();
                  return false;
                });
                $(window).on('click', (function(_this) {
                  return function() {
                    return _this.hide();
                  };
                })(this));
                this.element.on('click', function() {
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
                return scope.d = null;
              };
              scope.submit = function() {
                return popup.hide();
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
                scope.ngModel = '';
                if (scope.p) {
                  scope.ngModel += scope.p;
                }
                if (scope.c) {
                  scope.ngModel += " " + scope.c;
                }
                if (scope.a) {
                  scope.ngModel += " " + scope.a;
                }
                if (scope.d) {
                  scope.ngModel += " " + scope.d;
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
            		if (span.offsetWidth > this.offsetWidth) {
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
                        /*setTimeout(function () {
                            //$element.find('[value^="?"]').remove();    // 清除错误的数据
                            $element.select2('val', newVal);
                        },500);*/
                        var _newVal = newVal;
                    	var _multiple = $element.attr('multiple');
                    	if(_multiple) {} else _newVal += "#"+$element.val();
                    	
                        /*setTimeout(function () {                  
                            //$element.find('[value^="?"]').remove();    // 清除错误的数据
                            $element.select2('val', _newVal);
                        },500);*/
                    	
                    	//循环加载select2数据，直到数据加载成功，主要是等待ngCodetable初始化完成再加载数据
                    	select2SetVal($element,_newVal);
                    }, true);
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

}//)(this, viewApp);

/**
 * IE浏览器情况下select2在加载option时早于ngCodetable初始化，导致select2加载不到数据
 * @param $element
 * @param _newVal
 */
function select2SetVal($element, _newVal){
	setTimeout(function () {
		if("" == $element.context.innerHTML){
			select2SetVal($element, _newVal);
		}else{
			$element.select2('val', _newVal);
		}  
	},500);
}

//生成伪uuid
function getUUID(){
    var uuid="";
    for(var i=0;i<8;i++){
        uuid+=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return uuid;
}

//判断是否为空
function isEmptyObject(obj){
	if(obj==""||obj==null||obj==undefined){
		return true;
	}else{
		return false;
	}
}

//扩展laydate周六日红色文字

function taxlaydate(){ 


	$(function(){
    
		$(".layui-laydate-content table tbody tr").each(function(){
			
			$(this).children("td").eq(0).addClass("numRed")
			$(this).children("td").eq(6).addClass("numRed")
		})
		
		$(".laydate-day-prev").removeClass("numRed")
		$(".laydate-day-next").removeClass("numRed")
		
  })

}
