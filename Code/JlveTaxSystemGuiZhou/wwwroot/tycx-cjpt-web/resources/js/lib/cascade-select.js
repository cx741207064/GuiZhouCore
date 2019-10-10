var cde_settings = {
        "subname": "cde-subname",
        "init": "cde-init",
        "xpath": "cde-datasource",
        "xdm":"cde-xdm",
        "xmc":"cde-xmc",
        "mode":"cde-mode",
        "jsonData":"cde-jsonData",
        "extranode":"cde-extranode",
        "option":"cde-option"
 };
$(function(){
	var view = $("body");
	view.find("select").each(function () {
        var subname = $(this).attr(cde_settings.subname);//级联子下拉 name 值
        var xpath = $(this).attr(cde_settings.xpath);//xml路径
        var init = $(this).attr(cde_settings.init);//是否初始化
        var value = "";//getValue(jsonData, path); 默认选中值 
        var pValue ="";//选中值 级联下拉
        var mode = $(this).attr(cde_settings.mode); // mix 为混合模式，即中英文都是显示
        var xdm = $(this).attr(cde_settings.xdm);//FIXME PS
    	var xmc = $(this).attr(cde_settings.xmc);//FIXME PS
    	var option = $(this).attr(cde_settings.option);//处理掉下拉为请选择的option
    	if (isEmpty(xpath)) return true; // 无xpath不需要处理
        //init 为Y 则初始化
        if(isEmpty(init) || init != "Y"){
        	$(this).append("<option value=''>全部</option>");
        }else{
            var selector = format("select[cde-datasource='{0}']", xpath);
            var index = view.find(selector).index(this);
            //获取xml文件初始化
            if(xpath.match(".xml")){
            	var extra = $(this).attr(cde_settings.extranode);
            	if(extra!=undefined){
            		if ($.isArray(value)) {
    	                var context = transformOptionForExtra(value[index], xpath, mode, extra, path, index, data);
    	                $(this).append(context);
    	            } else {
    	                var context = transformOptionForExtra(value, xpath, mode, extra, path, index, data);
    	                $(this).append(context);
    	            }
            	}else{
            		if ($.isArray(value)) {
    	                var context = transformOption(value[index], xpath, mode, pValue);
    	                $(this).append(context);
    	            } else {
    	                var context = transformOption(value, xpath, mode, pValue);
    	                $(this).append(context);
    	            }
            	}
            }else{
            	if ($.isArray(value)) {
                    var context = transformOptionFromjsonData(value[index], xpath,xdm,xmc, mode);
                    $(this).append(context);
                } else {
                    var context = transformOptionFromjsonData(value, xpath,xdm,xmc, mode);
                    $(this).append(context);
                }
            }
        }
        //绑定选择事件
        $(this).on("change",function(){
        	var  value ="";
            //如果没有subname则不处理
        	var subname = $(this).attr(cde_settings.subname);
            if(notEmpty(subname)) {
            	//获取当前选中值
            	var selected = $(this).find("option:selected");
            	var pValue = $(selected).val();
            	//找到子下拉
            	var subSelector = format("select[name='{0}']", subname);
            	var subSelector_ = format("select[name='{0}']", $(subSelector).attr(cde_settings.subname));
            	//清空子下拉值 //FIXME PS
            	$(subSelector).find("option").remove();
            	$(subSelector_).find("option").remove();
            	$(subSelector_).append("<option value=''>全部</option>");
            	//初始化子下拉
            	 var subname = $(subSelector).attr(cde_settings.subname);
                 var xpath = $(subSelector).attr(cde_settings.xpath);
                 if (isEmpty(xpath)) return true; // 无xpath不需要处理
                 //获取xml文件初始化
                 if(xpath.match(".xml")){
             		if ($.isArray(value)) {
     	                var context = transformOption(value[index], xpath, mode, pValue);
     	                $(subSelector).append(context);
     	            } else {
     	                var context = transformOption(value, xpath, mode, pValue);
     	                $(subSelector).append(context);
     	            }
                 }else{
                 	if ($.isArray(value)) {
                         var context = transformOptionFromjsonData(value[index], xpath,xdm,xmc, mode);
                         $(subSelector).append(context);
                     } else {
                         var context = transformOptionFromjsonData(value, xpath,xdm,xmc, mode);
                         $(subSelector).append(context);
                     }
                 }
                 
               //使用select2时下拉框中的文本框初始化(更新级联下拉框)时没有显示对应文本
                $(subSelector).val($(subSelector).find("option:first").val());
     			$(subSelector).trigger('change');
            }
        });
        
        if(!isEmpty(option)){
        	$("option[title='请选择']").remove();
        }
    });
   
   /**
    *  读取xml转换成select的下拉列表
    */
   function transformOption(value, xpath, mode, pValue) {
       var result = [];
   	 	$.ajax({
            async: false,
            cache: false,
            type: "GET",
            dataType: "xml",
            url: xpath,
            success: function (xml) {
                var option = $(xml).find("select>option");
                result.push(format("<option value=''>全部</option>"));
                if(pValue==undefined||pValue=="0"){
                	pValue ="";
                }
                if (mode == "mix") {
                    $.each(option, function (index, context) {
                        var dm = $(context).find("dm").text();
                        var mc = $(context).find("mc").text();
                        var pc = $(context).find("pc").text();
                        if(pc==pValue){
                        	//值与option相同则默认选中
                            if (value == (dm)) {
                                result.push(format("<option title='{1}' value='{0}' selected=\"selected\">{1}</option>", dm, dm + "|" + mc));
                                return true;
                            }
                            result.push(format("<option title='{1}' value='{0}'>{1}</option>", dm, dm + "|" + mc));
                        }
                    });
                } else  {
                    $.each(option, function (i, context) {
                        var dm = $(context).find("dm").text();
                        var mc = $(context).find("mc").text();
                        var pc = $(context).find("pc").text();
                        if(pc==pValue){
	                        // 值与option相同则默认选中
	                        if (value == dm) {
	                            result.push(format("<option title='{1}' value='{0}' selected=\"selected\">{1}</option>", dm, mc));
	                            return true;
	                        }
	                        result.push(format("<option title='{1}' value='{0}'>{1}</option>", dm, mc));
                        }else if(pValue==""){
                        	// 值与option相同则默认选中
	                        if (value == dm) {
	                            result.push(format("<option title='{1}' value='{0}' selected=\"selected\">{1}</option>", dm, mc));
	                            return true;
	                        }
	                        result.push(format("<option title='{1}' value='{0}'>{1}</option>", dm, mc));
                        }
                    });
                }
            },
            error:function(){
            	
            }
       }); 
       return result.join("");
   }

   /**
    *  读取期初数json中对应xpath数据转换成select的下拉列表
    */
   function transformOptionFromjsonData(value, xpath,xdm,xmc, mode) {
       var result = [];
       var option = getValue(cde_settings.jsonData, xpath);
	   result.push(format("<option value=''>全部</option>"));
	   if (mode == "mix") {
          $.each(option, function (index, context) {
       	   var dm = context[xdm];
              var mc = context[xmc];
              // 值与option相同则默认选中
              if (value == (dm)) {
                  result.push(format("<option title='{1}' value='{0}' selected=\"selected\">{1}</option>", dm, dm + "|" + mc));
                  return true;
              }
              result.push(format("<option title='{1}' value='{0}'>{1}</option>", dm, dm + "|" + mc));
          });
	   } else  {
          $.each(option, function (i, context) {
			   var dm = context[xdm];
			   var mc;
			   //为配置类似银行网点（名称）+ 银行账号的下拉列表
			   if(xmc.split("#").length>1){
				   var xmcArray = xmc.split("#");
			   		mc = context[xmcArray[0]] + "|" + context[xmcArray[1]];
			   }else{
				   mc = context[xmc];
			   }
              // 值与option相同则默认选中
              if (value == dm) {
                  result.push(format("<option title='{1}' value='{0}' selected=\"selected\">{1}</option>", dm, mc));
                  return true;
              }
              result.push(format("<option title='{1}' value='{0}'>{1}</option>", dm, mc));
          });
	   }
       return result.join("");
   }
   /**
    *  value -- 读取xml转换为实际值
    */
   function transformXml(value, xpath) {
       var result = value;
       $.ajax({
           async: false,
           cache: false,
           type: "GET",
           dataType: "xml",
           url: xpath,
           success: function (xml) {
               //利用jquery处理xml
              $(xml).find("option").each(function(){
            	  var dm = $(this).children("dm").text();
           		   if (value == dm) {
           			   result = $(this).find("mc").text();
           			   return;
           		   }
              });
           }
       });
       return result;
   }
});


/**
 * 判断是否为空对象
 */
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
/**
 * 判断目标是否为空.支持多种类型object,number,string类型的判断
 */
function isEmpty(target) {
    if (target == undefined || target == null){
        return true;
    }
    if(typeof target == "object"){//传入类型为object时
        return isEmptyObject(target);
    }
    if(typeof target == "number" && !isNaN(target)){ //传入对象为number且非NaN则不为空
        return false;
    }
    if (typeof target == "string" && target.length > 0) {  //String类型时判断长度
        return false;
    }
    if(typeof target =="boolean"){
        return false;
    }
    return true;
}
/*判断对象是否非空*/
function notEmpty(object) {
    return !isEmpty(object);
}

/**
 * 通过Jpath方式获取指定的json路径下的值 jpath格式a.b.c
 * 不使用递归,加快定位速度
 */
function getValue(json, path) {
	if(json==undefined){return [];}
    var paths = compile(path);
    //一级别访问
    if (paths.length == 1) {
        if (json.hasOwnProperty(path)) {//判定json中是否有该节点
            return json[path];
        } else {//不存在该节点，则加上
        	json[path] = 0;
        	return json[path];
        }
        return [];
    }
    //多层级访问,先定位上一级别的数据
    var target = null;
    try{
    	target = eval(buildPath(paths.slice(0, paths.length - 1)));
    }catch(e){
    	//console.log("没有找到初始化节点：%s,请开发人员检查%o",path,e);
    	//Message.errorInfo("没有找到初始化节点：" + path +  "请检查：" + e);
    	throw 'notFound';
    }
    if (isEmpty(target)) {
        return [];
    } else if (isObject(target)) {//最底层为对象
        if (target.hasOwnProperty(paths[paths.length - 1])) {//判定json中是否有该节点
            return eval(buildPath(paths));
        } else {//不存在该节点，则加上
        	target[paths[paths.length - 1]] =0; //直接进行添加不调用appendMc 进行添加
        	return target[paths[paths.length - 1]];
        }
        return [];
    } else {
       //最底层为数组,遍历访问
       var result =[];
       $.each(target,function(){
           var property= paths[paths.length-1];
            result.push(this[property]);
         });
       return result;
    }
}


/**目标是否为对象*/
function isObject(object) {
    return typeof object === "object" &&
        object != undefined &&
        object.length == undefined;
}


/**创建请求路径*/
function buildPath(paths) {
    var str = "json";
    for (var i = 0; i < paths.length; i++) {
    	var tmp = paths[i];
    	if(paths[i].lastIndexOf("[") >= 0) {//
			tmp = "[\"" + paths[i].substr(0,paths[i].lastIndexOf("[")) + "\"]" + paths[i].substr(paths[i].lastIndexOf("["));
			str += tmp;
		} else {
            str = str + "[\"" + paths[i] + "\"]";			
		}
    }
    return str;
}

/**路径解析*/
function compile(path) {
	if($.isArray(path)) {
		return path;
	} else if(path.indexOf("\.") < 0){
		return new Array(path);
	}else {
        return path.split(".");
	}
}


/**
 *通过Jpath方式设置指定json路径下的值
 *不使用递归,加快定位速度
 */
function setValue(json, path, value,index) {
    var paths = compile(path);
    //一级访问
    if (paths.length == 1) {
        if (json.hasOwnProperty(path)) {
            json[path] = value;
        }
        return;
    }
    //多层级访问,先定位上一级别的数据
    var target = null;
    try{
    	target = eval(buildPath(paths.slice(0, paths.length - 1)));
    }catch(e){
    	//console.log("没有找到初始化节点：%s,请开发人员检查%o",path,e);
    	return;
    }
     if(isEmpty(target)){
         return;
     } else if(isObject(target)){
        if (target.hasOwnProperty(paths[paths.length - 1])) {
            target[paths[paths.length - 1]]= value;
        } else {
        	target[paths[paths.length - 1]]= value;
        }
        return ;
     } else {
        //最底层为数组,遍历设置
        if(index ==undefined){ //没有指定索引
            $.each(target, function () {
                var property = paths[paths.length - 1];
                this[property] = value;
            });
        } else {
            $.each(target, function (i) { //指定更新索引位
                if (i == index) {
                    var property = paths[paths.length - 1];
                    this[property] = value;
                }
            });
        }

     }
}

/**
 * 字符串格式化
 * @param content --格式化内容
 * @param args      --格式化参数
 * @returns {*}
 * example:format("a{0}b{1}c{2}",'one','two','three')
 */
function format(context, args) {
    if (arguments.length > 0) {
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] != undefined) {
                var index = i - 1;
                var reg = new RegExp('\\{' + index + '\\}', 'gm');
                context = context.replace(reg, arguments[i]);
            }
        }
    }
    return context;
}