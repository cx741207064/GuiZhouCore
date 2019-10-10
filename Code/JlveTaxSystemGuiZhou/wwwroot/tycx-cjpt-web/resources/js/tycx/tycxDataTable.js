/**
 * var queryAfterInit=Y
 * function doBeforeQuery(){}
 */
//var dataSourceUrl = cp+"/cxpt/query.do";   //通用查询的URL
var TYCX = {
		dataSourceUrl:cp+"/cxpt/query.do",
		pageSize:10,                        //, 每页条数
        first:'首页',
        last:'尾页',
        groups:8,
		index:0,                            //loading 效果的索引
		queryGsMult:0,                      //国税多次查询的计数器
		queryDsMult:0,                      //地税多次查询的计数器
		queryJdMult:0,					  //局端(url中无国地税类型业务)多次查询的计数器
		sidLength:0,                         //需要查询的SID的个数  即查询发起的次数
		currPage:1,
		itemSize:0,
		errorMsg:""							// 查询出错的异常信息
};
var pageInDb = {
		isPageInDb:false,  //用于判断是不是在数据库分页
		total:0,  // 查询总记录数
		pageNo:1,  // 当前页码
    	pageSize:10, // 页大小
		scope:"",
		http:"",
		qureyParams:"" // 页面显示或隐藏的参数
};
//TYCX.pageSize = 8;
var isShowPages=true;             //是否分页，默认是
//var pageSize="10";               //每页条数
var lhbsModelSync = true;        //联合办税同步处理数据模型
var multQuerySync = true;        //多重查询是否同步处理数据模型
var isMainLoading = true;        //是否查询框架控制loading效果
//var index;                       //loading 效果的索引
//var queryGsMult = 0;             //国税多次查询的计数器
//var queryDsMult = 0;             //地税多次查询的计数器
var responseDs = new Array();    //国税查询返回结果
var responseGs = new Array();    //地税查询返回结果
var responseJd = new Array();    //局端查询返回结果
///var sidLength;                   //需要查询的SID的个数  即查询发起的次数
var isQuering = false;                   //是否正在查询标志，防止重复点击
// var deliverErrorMsg = "";		//可在jsp或者js中定义此变量值，对 查无数据的提示信息 进行个性化设置		
/**
 * 自定义的参数，为啥调用封装到一个函数里的，因为不生效。晕死了
 */
try {
	if (typeof(customDataSourceUrl) != "undefined"){
		TYCX.dataSourceUrl=customDataSourceUrl;
	}
} catch(e) {}
try {
	if (typeof(customPageSize) != "undefined"){
		TYCX.pageSize=customPageSize;
	}
} catch(e) {}
try {
	if (typeof(customIsShowPages) != "undefined"){
		isShowPages=customIsShowPages;
	}
} catch(e) {}
try {
	if (typeof(customLhbsModelSync) != "undefined"){
		lhbsModelSync=customLhbsModelSync;
	}
} catch(e) {}
try {
	if (typeof(customMultQuerySync) != "undefined"){
		multQuerySync=customMultQuerySync;
	}
} catch(e) {}
try {
	if (typeof(customIsMainLoading) != "undefined"){
		isMainLoading=customIsMainLoading;
	}
} catch(e) {}
/**
 * end 自定义的参数，为啥调用封装到一个函数里的，因为不生效。晕死了
 */

var ngControllerName="angulajs_customersCtrl";//主绑定div的ctrl名称
var ngAppName="angulajs_tycxApp";//

//angular js controll初始化
var app =angular.module(ngAppName, []);



var ua = navigator.userAgent;
if (ua && ua.indexOf("MSIE 7") >= 0) {
    // Completely disable SCE to support IE7.
	app.config(function($sceProvider){
        //console.log("启动IE7兼容性支持：" + ua);
        $sceProvider.enabled(false);
    });
}

//ie7 兼容设置
if (ua && ua.indexOf("MSIE 7") >= 0) {
	if (! document.querySelector) {
	    document.querySelector = function(selectors){
	        var elements = document.querySelectorAll(selectors);
	        return (elements.length) ? elements[0] : null;
	    };
	}
	/**
	 * Internet Explorer 7 Compatible
	 */
	if (! document.querySelectorAll) {
	    document.querySelectorAll = function(selectors){
	        var style = document.createElement('style'), elements = [], element;
	        document.documentElement.firstChild.appendChild(style);
	        document._qsa = [];
	        style.styleSheet.cssText = selectors
	            + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
	        window.scrollBy(0, 0);
	        style.parentNode.removeChild(style);
	        while (document._qsa.length) {
	            element = document._qsa.shift();
	            element.style.removeAttribute('x-qsa');
	            elements.push(element);
	        }
	        document._qsa = null;
	        return elements;
	    };
	}
}


//自定义过滤器
/**base64转码*/
app.filter('base64Decode', function() {
   return function(input) {
	   var output=input;
	   if(isExitsFunction("decode")){
		   output=decode(output);
	   }
	   return output;
   };
});

//格式化数字
app.filter('formatnumber', function () {
    return function (input) {
    	//先转科学
    	var num = new Number(input);
        return num;
    };
});

/**年份规范*/
app.filter("dateConvert",function(){
	return function(input){
		if(input.length == 4){
			var out = "";
			var str = input.substr(4);
			if(str == null || str == ""){
				out = input + "年";
			}else{
				out = input;
			}
			return out;
		}else{
			out = input;
			return out;
		}
	}
});
//车牌号码格式化
app.filter("formatCph",function(){
	return function(input){
		//把中间三位数字用***代替
		var formatNum = "";
		if(input != "" && input.length >=5){
			var before = input.substr(0,2);
			var after = input.substr(5,input.length);
			formatNum = before+"***"+after;
		}
		return formatNum;
	}
});
/**yesNo2Chinese 将 Y N 转 是否*/
app.filter('yesNo2Chinese', function() {
   return function(input) {
	  if(input=="Y") return "是";
	  if(input=="N") return "否";
	   return input;
   };
});
/** */
app.filter('change2ChineseWithDm', function() {
   return function(nr,dm) {

	   //调用ajax进行请求
	   /*function getName(){
		   if(nr==null || nr =="" || nr ==undefined) return nr;
		   $.ajax({
				type : "post",
				url : cp+"/cxpt/zhBgnrMc.do",
				async: false,
				data : { bgxmdm : dm, bgnr : nr },
				dataType : "json",
				success : function(data) {
					var result = data;
					var flag=result.flag;
					nr=result.bgnr;
				}
		   });
		   return nr;
	   }*/
	   return getName();
   };
});
//

/**
 * laypage 分页过滤
 * 先触发ngRepeat, 再触发laypage组件
 */
app.filter('laypage', function() {
    return function(arr,laypageId) {
        if(!arr){
            return [];
        }

        if(!laypageId){
            console.log("分页过滤器,需要传入 laypage的id 作为参数。比如： laypageFilter :'test1',test1是laypage对应元素id");
            return [];
        }

        /*
         * 获取当前分页情况
         */
        //初始化时,用框架分页默认值,再使用用户自定义的
        var _conf = this.laypageConf[laypageId];
        if(!_conf){
            _conf = $.extend(true,{}, TYCX);

            //如果有自定义分页，则再使用分页自定义
            var customizeConfStr = $("#" + laypageId).attr("laypage");
            if(customizeConfStr){
                var customizeConf = eval("("+customizeConfStr+")");
                _conf = $.extend(true,_conf,customizeConf);
            }
            this.laypageConf[laypageId] = _conf;
        }
        this.laypageConf[laypageId].total = arr.length;//总条数

        //数据分页
        _conf = this.laypageConf[laypageId];
        var page = _conf.currPage;//当前页
        var pageSize = _conf.pageSize;//每页条数
        return arr.slice((page-1)*pageSize,(page)*pageSize);//过滤分页内容 1 10;
    };
});

var gdslxDm = "1";
var conf_bsms = "";
/**
 * 全局变量---控制国地税标志的显示，Y：显示，N，不显示
 */
var showGdsbz;
var cxShowGdsbz="";
try{
	
	if(typeof(parent.showGdsbz) == "undefined" || parent.showGdsbz == null){
		//从父页面获取不到，则需请求
		var requesturl = cp + "/viewsControlController/getShowGdsbz.do";
		$.ajax({
			type : "post",
			async: false,
			url : requesturl,
			data :{},
			datatype:"text",
			success : function(data){
				if(data == "N" || data == "Y"){
					showGdsbz = data;
				}
			}
		});
	 }else{
		showGdsbz = parent.showGdsbz;//从父页面获取
	 }
	
	 if(showGdsbz!="Y" && showGdsbz!="N"){
		 showGdsbz = "";
	 }
}catch(error){
	
}

try{
	
	if(typeof(parent.cxShowGdsbz) == "undefined" || parent.cxShowGdsbz == null){
		//从父页面获取不到，则需请求
		var requesturl = cp + "/viewsControlController/getCxShowGdsbz.do";
		$.ajax({
			type : "post",
			async: false,
			url : requesturl,
			data :{},
			datatype:"text",
			success : function(data){
				if(data == "N" || data == "Y"){
					cxShowGdsbz = data;
				}
			}
		});
	}else{
		cxShowGdsbz = parent.cxShowGdsbz;//从父页面获取
	}
	
	if(cxShowGdsbz!="Y" && cxShowGdsbz!="N"){
		cxShowGdsbz = "";
	}else{
		showGdsbz = cxShowGdsbz;
	}
}catch(error){
	
}

try{
	conf_bsms = parent.bsms;
}catch(error){
	//文书可能取不到bsms
}
if(conf_bsms == '1'){
	gdslxDm = '1';
}else if(conf_bsms == '2'){
	gdslxDm = '2';
}else{
	gdslxDm = getQueryString("gdslxDm");
}
var zhxz = getQueryString("zhxz");
//福建涉税查询根据纳税人信息是否加载国地税
var dqdm = getQueryString("dqDm");
if(dqdm=='35'){
	if(zhxz=='0'){
		gdslxDm = '3';
	}else{
		gdslxDm=zhxz;
	}
}
var tycxEngine;
app.controller(ngControllerName, function($scope, $http) {

    $scope.laypageConf={};//用于laypage分页使用

    tycxEngine = new TycxEngine();
	//查询按钮监听
	if(navigator.appName == "Microsoft Internet Explorer"
		&& (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"
		||  navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
		) {
		$("input").each(function(){
			var clickfun=$(this).attr("ng-click");
			if(clickfun !=null){
				if(clickfun!=""){
					clickfun=clickfun.substring(0,clickfun.length-2);
				}
				if(clickfun=="queryBtn"){
					$scope.queryBtn = function() {
						if(typeof(cleanExternalParameters) === 'function'){
							cleanExternalParameters();
						}
						tycxEngine.query($scope, $http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
				    }
				}else if(clickfun=="resetBtn"){//重置
					$scope.resetBtn = function() {
						tycxEngine.restAll();
				    }
				}
			}
		});
		$("button").each(function(){
			var clickfun=$(this).attr("ng-click");
			if(clickfun !=null){
				if(clickfun!=""){
					clickfun=clickfun.substring(0,clickfun.length-2);
				}
				if(clickfun=="queryBtn"){
					$scope.queryBtn = function() {
						if(typeof(cleanExternalParameters) === 'function'){
							cleanExternalParameters();
						}
						tycxEngine.query($scope, $http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
				    }
				}else if(clickfun=="resetBtn"){//重置
					$scope.resetBtn = function() {
						tycxEngine.restAll();
				    }
				}
			}
		});
	}else{
		//查询按钮监听
		$("input[ng-click]").each(function(){
			var clickfun=$(this).attr("ng-click");
			if(clickfun!=""){
				clickfun=clickfun.substring(0,clickfun.length-2);
			}
			if(clickfun=="queryBtn"){
				$scope.queryBtn = function() {
					if(typeof(cleanExternalParameters) === 'function'){
						cleanExternalParameters();
					}
					tycxEngine.query($scope, $http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
			    }
			}else if(clickfun=="resetBtn"){//重置
				$scope.resetBtn = function() {
					tycxEngine.restAll();
			    }
			}
		});
		//查询按钮监听
		$("button[ng-click]").each(function(){
			var clickfun=$(this).attr("ng-click");
			if(clickfun!=""){
				clickfun=clickfun.substring(0,clickfun.length-2);
			}
			if(clickfun=="queryBtn"){
				$scope.queryBtn = function() {
					if(typeof(cleanExternalParameters) === 'function'){
						cleanExternalParameters();
					}
					tycxEngine.query($scope, $http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
			    }
			}else if(clickfun=="resetBtn"){//重置
				$scope.resetBtn = function() {
					tycxEngine.restAll();
			    }
			}
		});
	}

	$scope.gdslxDm = gdslxDm;
	$scope.showGdsbz = showGdsbz;
	//如果页面定义了 queryAfterInit 变量并且为Y，则页面加载后马上执行查询。因为有些页面是无查询的，直接加载的。
	if (typeof(queryAfterInit) != "undefined"){
		if (queryAfterInit){
			//console.log($scope+":"+(typeof $http)+":"+ngControllerName+":"+TYCX.dataSourceUrl+":"+isShowPages+":");

			tycxEngine.query($scope,$http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
		}
	}
	// 如果页面定义了initBeforeQuery函数，则先初始化自定义的数据
	// 在angular初始化时，框架js提供一个个性化的入口让具体业务js去做一些事情。bug单号JSONE-179
	// 具体业务场景：1.发票信息查询的发票类型下拉框数据项，需要调另外的接口去初始化这个数据；
	//2.涉及到使用angular的绑定事件的，比如打印按钮的点击事件的绑定
	if (typeof(initBeforeQuery) !== "undefined" && typeof(initBeforeQuery) === "function"){
		if (initBeforeQuery){
			initBeforeQuery($scope, $http);
		}
	}

	/*
	 * 获取 nglaypage 分页下标
	 */
    $scope.getIndex = function(pageId,$index){
        var _conf=$scope.laypageConf['layper_page_box'];
        return _conf ? (_conf.currPage-1)*(_conf.pageSize) + $index + 1 : $index + 1  ;
    }

});


function TycxEngine(){
	/**
	 * 清空输入框中类型为text的内容
	 */
	TycxEngine.prototype.restAll = function(){
		$(".searchCriteria input[type='text']").each(function(){
	        $(this).val("");
		});

		$(".searchCriteria select").each(function(){//改为选中第一个。一般第一个都是全部或者请选择
			$(this).find('option:eq(0)').attr('selected','selected');
		});
	}

	//进行转码
	TycxEngine.prototype.eeucParam = function(val){
		return escape(encodeURIComponent(val));
	}

	//查询，分页是按照获取全部后，直接在页面上分页
	//查询框架

	TycxEngine.prototype.query = function($scope,$http,ngControllerName,dataSourceUrl,isShowPages){
		// 如果启用数据库分页, 先重置参数
		if(pageInDb.isPageInDb){
			pageInDb.total = 0;
			pageInDb.scope = "";
			pageInDb.http = "";
			pageInDb.pageNo = 1;
			$("#layper_page_box").html("");
		}
		
		
		//防止重复点击
		if(isQuering){
			return;
		}
		isQuering = true;
		//查询条件判断
		var vok=this.formValid();

		if(!vok){
			isQuering = false;   //校验失败 重置   isQuering
			return;
		}

		//查询前，需要进行的其他操作（比如查询条件验证等，如果有，在各自的js里定义
		if(this.isExitsFunction("customBeforeQuery")){
			var ok=customBeforeQuery();
			if(!ok){
				isQuering = false;   //校验失败 重置   isQuering
				return;
			}
		}

		//遮罩
		if(isMainLoading){
			//console.log("isMainLoading:"+isMainLoading);
			TYCX.index = layer.load(2,{shade: 0.2,offset:'120px'});
		}

		var cxcs="";   //查询参数
		//组装查询区域的查询条件
		//TODO 隐藏参数 和 显示参数 放到form表单中，jquery 组装form中的参数  暂不调整 from获取为数据，数据还需要转为json格式
		$("#queryContion").find("input,select").each(function(){
			var iType=$(this).attr("type");
			if(iType=="text" || $(this).is('select') || iType=="hidden"){
				var val=$(this).val();
				var id=$(this).attr("id");
				if("skssqq"==id){
					if(val!=""){
						val = val.substr(0,7);
						var dateq = new Date(Date.parse((val+"-01").replace(/-/g,"/")));
						val = getFormatDate(dateq);
					}
				}else if("skssqz"==id){
					if(val!=""){
						var yy = val.substr(0,4);
						var mm = val.substr(5,2);
						var datez = getLastDay(yy,mm);
						val = getFormatDate(datez);
					}
				}
				if(id!=null && id!=undefined){
					cxcs+="\""+id+"\":\""+val+"\","
				}
			}
		});

		//页面自定义传入报文参数：
		try {
			if (typeof(customBwcsParams) != "undefined"){
					cxcs+=customBwcsParams;
			}
		} catch(e) {}

		if(cxcs.endWith(",")){
			cxcs=cxcs.substr(0,cxcs.length-1);
		}

		if(pageInDb.isPageInDb){
			pageInDb.qureyParams = cxcs;
		}

		//查询成功次数初始化0
		TYCX.queryGsMult = 0;
		TYCX.queryDsMult = 0;
		TYCX.queryJdMult = 0;
		responseGs = [];
		responseDs = [];
		responseJd = [];
		
		if(sids == undefined || null == sids){
			//支持不通过规则中心进行查询，但目前只能发起一次查询
			TYCX.sidLength = 1;
			var bwcs=customBwxx(cxcs);//组装报文信息
			this.doQuery($scope,$http,ngControllerName,TYCX.dataSourceUrl,isShowPages,bwcs,null);
		}else{
			if(pageInDb.isPageInDb){
				tycxEngine.doPageInDb($scope,$http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
			}else{
				//支持多个查询，多个sid 通过 ; 隔开
				TYCX.sidLength = sids.length;
				for(var i=0;i<TYCX.sidLength;i++){
					var sid = sids[i];
					var bwcs=bwxx(sid,cxcs);//组装报文信息
					this.doQuery($scope,$http,ngControllerName,dataSourceUrl,isShowPages,bwcs,sid);
				}
			}
		}

		//ie 情况下，会有缓存，加上时间戳
		if(dataSourceUrl.indexOf("?")!=-1){
			TYCX.dataSourceUrl+="&t="+new Date().getTime();
		}else{
			TYCX.dataSourceUrl+="?t="+new Date().getTime();
		}
	}

	//执行查询
	TycxEngine.prototype.doQuery = function($scope,$http,ngControllerName,dataSourceUrl,isShowPages,bwcs,sid){
		var params={params:{bw:bwcs}};
		//兼容直接URL测试，不与会话中心集成
		var test = getQueryString("test");
		if(test == "true"){
			var currentUrL = document.location.href;
			var currentUrLArr = (currentUrL.substr(currentUrL.indexOf("?")+1)).split("&");
			for(var k=0;k<currentUrLArr.length;k++){
				var name = (currentUrLArr[k].split("="))[0];
				var value = (currentUrLArr[k].split("="))[1]
				params.params[name] = value;
			}
		}
		
		
		if(gdslxDm == "1" || gdslxDm == "3"){
			//国税请求
			var paramsGs;
			paramsGs = jQuery.extend(true, {}, params)
			paramsGs.params.gdslxDm = "1";
			$http.get(dataSourceUrl,paramsGs)
		    .success(function (response){
		    	tycxEngine.doSucess($scope,response,"1");
		    }).error(function(data,header,config,status){
		    	tycxEngine.doError($scope,sid,"1");
		    });
		}

		if(gdslxDm == "2" || gdslxDm == "3"){
			//地税请求
			params.params.gdslxDm = "2";
			$http.get(dataSourceUrl,params)
		    .success(function (response){
		    	tycxEngine.doSucess($scope,response,"2");
		    }).error(function(data,header,config,status){
		    	tycxEngine.doError($scope,sid,"2");
		    });
		}
		//局端请求(url中无国地税类型代码业务)
		if(!gdslxDm){
			//params.params.gdslxDm = "2";
			$http.get(dataSourceUrl,params)
		    .success(function (response){
		    	tycxEngine.doSucess($scope,response,null);
		    }).error(function(data,header,config,status){
		    	tycxEngine.doError($scope,sid,null);
		    });
		}
	}

	//各种公用条件判断
	TycxEngine.prototype.formValid = function(){

		//税款所属期起止
		var skssqq = "";
		var skssqz = "";
		if($("#skssqq").length>0){
			skssqq = $("#skssqq").val();
			if(skssqq!=""){
				skssqq = skssqq.substr(0,7);
				var dateq = new Date(Date.parse((skssqq+"-01").replace(/-/g,"/")));
				skssqq = getFormatDate(dateq);
			}
		}
		if($("#skssqz").length>0){
			skssqz = $("#skssqz").val();
			if(skssqz!=""){
				var yy = skssqz.substr(0,4);
				var mm = skssqz.substr(5,2);
				var datez = getLastDay(yy,mm);
				skssqz = getFormatDate(datez);
			}

		}

		if(skssqq !="" && skssqz == ""){
			layer.alert('税款所属期止不能为空！', {title:"提示",icon: 5,offset:'120px'});
			return false;
		}
		if(skssqz !="" && skssqq == ""){
			layer.alert('税款所属期起不能为空！', {title:"提示",icon: 5,offset:'120px'});
			return false;
		}
		if(this.isExitsFunction("validateTimeStart") && !validateTimeStart(skssqq)){
			layer.alert("税款所属期起应为每月月初", {title:"提示",icon: 5,offset:'120px'});
			return false;
		}
		if(this.isExitsFunction("validateTimeEnd") && !validateTimeEnd(skssqz)){
			layer.alert("税款所属期止应为每月月末", {title:"提示",icon: 5,offset:'120px'});
			return false;
		}
		if(skssqq > skssqz){
			layer.alert("税款所属期止的时间不能小于税款所属期起", {title:"提示",icon: 5,offset:'120px'});
			return false;
		}

		return true;
	}

	//静态分页
	TycxEngine.prototype.staticPages = function(curr,itemSize){
		var isFrames = !typeof(window.frames["ifrMain"]) == "undefined";
		var trManager = null;
		if (isFrames)
			trManager = $(window.frames["ifrMain"].document).find("table").find(".trheader");
		else
			trManager = $(window.document).find("table").find(".trheader");
		trManager.each(function(){
			$(this).parent().find("tr").not(".trheader").not(".trfooter").each(function(index){
				  var startNo=parseInt(TYCX.pageSize)*(curr-1)+1;
				  var endNo=parseInt(TYCX.pageSize)*curr;
				  if((index+1)>=parseInt(startNo) && (index+1) <=parseInt(endNo)){
					  $(this).show();
				  }else{
					  $(this).hide();
				  }
			 });
			$(".custom_layper_page_info").html(TYCX.pageSize+"条/页，共"+TYCX.itemSize+"条信息");//改外部调用（例如删除），重新选择分页信息
		});
	}
	//静态分页（页面多个表格）
	TycxEngine.prototype.staticPagesMul = function(curr,dataTableId){
		//$("#"+dataTableId).find(".trheader").each(function(){
			$("#"+dataTableId).find("tr").not(".trheader").not(".trfooter").each(function(index){
				var startNo=parseInt(TYCX.pageSize)*(curr-1)+1;
				var endNo=parseInt(TYCX.pageSize)*curr;
				if((index+1)>=parseInt(startNo) && (index+1) <=parseInt(endNo)){
					$(this).show();
				}else{
					$(this).hide();
				}
			});
		//});
	}

	//设置表格横向滚动条
	TycxEngine.prototype.setTableScrollX = function(){
		try {
			if (typeof(customNeedScrollX) != "undefined" && customNeedScrollX){//是否设置横向滚动条

				var sWidth="2000";//默认2000
				try {
					if (typeof(customScrollWidth) != "undefined"){//滚动的表格长度
						sWidth=customScrollWidth;
					}
				} catch(e) {}

				$(".searchTable").css({"overflow-x":"scroll"});
				$(".searchTable").find("table").css({"width":sWidth});
			}
		} catch(e) {}
	}

	//修改国地税标志的样式
	TycxEngine.prototype.changeGDSbzColor = function(){
		$("tr td span").each(function(){
			var value=$(this).text();
			if (value == "原国税"){
				$(this).removeClass('fontcolor02');
				$(this).addClass('fontcolor01');
			}else if (value == "原地税"){
				$(this).removeClass('fontcolor01');
				$(this).addClass('fontcolor02');
			}
		});
	}

	//封装layeralert,方便调用
	TycxEngine.prototype.tycxLayerAlert = function(message){
		layer.alert(message, {title:"提示",icon: 5,offset:'120px'});
	}

	//弹窗打开  明细页面
	TycxEngine.prototype.openWindowByLayer = function(url){
		if(top.location != location){
			var topObj=tycxEngine.getWindowTop();
			var host=window.location.host;
			var topHost=topObj.location.host;
			if(host==topHost){
				tycxEngine.getWindowTop().openWindowByLayer(url);
			}else{
				tycxEngine.directOpenWindowByLayer(url)
			}
		}else{
			tycxEngine.directOpenWindowByLayer(url)
		}
	}

	//弹窗打开预加载页面(预加载DIV)
	TycxEngine.prototype.openPreInitWindowByLayer = function(index){
		var oraObj = '#'+index;
		layer.open({
            type: 1,
            title: '详细页面',
            /*shadeClose: true,*/ //点击阴影处也关闭
            /*maxmin: true, //开启最大化最小化按钮*/
            shade: 0.1,
            area: ['90%', '90%'],
            content: $(oraObj)
		})
	}

	TycxEngine.prototype.directOpenWindowByLayer = function(url){
		//iframe层
		layer.open({
		  type: 2,
		  title: '详细页面',
		  /*shadeClose: true,*/ //点击阴影处也关闭
		  maxmin: true, //开启最大化最小化按钮
		  shade: 0.1,
		  area: ['90%', '90%'],
		  content: url //iframe的url
		});
	}
	//自定义弹窗2
	TycxEngine.prototype.directOpenWindowByLayer2 = function(url,title){
		//iframe层
		layer.open({
		  type: 2,
		  title: title,
		  /*shadeClose: true,*/ //点击阴影处也关闭
		  maxmin: true, //开启最大化最小化按钮
		  shade: 0.1,
		  area: ['90%', '90%'],
		  content: url //iframe的url
		});
	}

	//是否存在指定函数
	TycxEngine.prototype.isExitsFunction = function(funcName) {
	    try {
	        if (typeof(eval(funcName)) == "function") {
	            return true;
	        }
	    } catch(e) {}
	    return false;
	}

	//是否存在变量
	TycxEngine.prototype.isExitsVariable = function(funcName) {
		try {
			if (typeof(variableName) != "undefined"){
				return true;
			}
		} catch(e) {}
		return false;
	}


	TycxEngine.prototype.getWindowTop = function() {
	    var obj = self;
	    while (true) {
	        if (obj == top) {
	            break;
	        }
	        obj = obj.parent;
	    }
	    return obj;
	}

	//该方法只能在同域名下执行，也就是说本地是测试不了的，因为xxmh和tycx的端口是不一致的。
	TycxEngine.prototype.changeHeight = function(id) {
		try {
			var height=document.body.scrollHeight+20;
			if(height<800){
				height=800;
			}
			if($("#"+id,window.parent.document).length>0){
				$("#"+id,window.parent.document).css({'height':height});
			}else if($("#"+id,window.parent.parent.document).length>0){
				height+=150;//还要算上父窗口的子菜单列表高度
				$("#"+id,window.parent.parent.document).css({'height':height});
			}
		} catch(ex) {
			//alert(ex);
		}
	}


    /**
     *  1.3版本 laypage 分页重构，方便优化修改
     *  因为angular 中 filter 会先执行过滤，过滤后才会再生成分页conf。
     * @param pageId 分页控制条id
     * @param $pageInfo 分页左边信息栏 jq对象
     * @param topScope 全局域
     * @returns {boolean}
     */
    TycxEngine.prototype.nglaypage=function(pageId,$pageInfo,topScope){
        //处理真实分页
        var isfilter=false;
        var pages = 0;//总页码数
        var scopeConf=topScope.laypageConf[pageId];
        if (scopeConf) {
            isfilter=true;
            pages = Math.ceil(scopeConf.total/scopeConf.pageSize);; //总页码
        }else{
            return false;
        }
        //laypage 分页组件参数
        var _conf={
            cont: pageId,
            pages: pages,
            first: scopeConf.first,
            last: scopeConf.last,
            groups: scopeConf.groups, //连续显示分页数
            jump: function (obj) {
                topScope.laypageConf[pageId].currPage = obj.curr;
                topScope.$apply();
            }
        };

        //渲染分页组件
        laypage?laypage(_conf) :console.log('laypage 对象不存在！');
        $pageInfo && $pageInfo.html(scopeConf.pageSize + "条/页，共" + scopeConf.total + "条信息");
        return isfilter;
    }



	//显示控制（分页等）
	TycxEngine.prototype.viewData = function(loadResult){
		if(isMainLoading){
			layer.close(TYCX.index);
		}

        // 在数据库分页
        if(pageInDb.isPageInDb){

            if(pageInDb.pageNo == 1&&pageInDb.total == pageInDb.pageSize){// 第一页
                $("#layper_page_box").append("<button class='layui-btn layui-btn-primary' name='btn_page' value='2'>下一页</button>");
            }else if(pageInDb.pageNo !=1 &&pageInDb.total != pageInDb.pageSize){// 最后一页
                $("#layper_page_box").append("<button class='layui-btn layui-btn-primary' name='btn_page' value='"+(pageInDb.pageNo-1)+"'>上一页</button>");
            }else if(pageInDb.pageNo !=1 &&pageInDb.total == pageInDb.pageSize){
                $("#layper_page_box").append("<button class='layui-btn layui-btn-primary' name='btn_page' value='"+(pageInDb.pageNo-1)+"'>上一页</button>");
                $("#layper_page_box").append("<button class='layui-btn layui-btn-primary' name='btn_page' value='"+(pageInDb.pageNo+1)+"'>下一页</button>");
            }

            // 监听上一页和下一页的点击事件
            $("button[name='btn_page']").on("click",function(){
                var isFrames = !typeof(window.frames["ifrMain"]) == "undefined";
                var trManager = null;
                if (isFrames)
                    trManager = $(window.frames["ifrMain"].document).find("table").find(".trheader");
                else
                    trManager = $(window.document).find("table").find(".trheader");
                trManager.each(function(){
                    $(this).parent().find("tr").not(".trheader").not(".trfooter").each(function(index){
                        $(this).remove();
                    });
                });
                pageInDb.pageNo=parseInt($(this).attr("value"));
                responseDs = [];    //国税查询返回结果
                responseGs = [];    //地税查询返回结果
                responseJd = [];
                $("#layper_page_box").html("");
                tycxEngine.doPageInDb(pageInDb.scope,pageInDb.http,ngControllerName,TYCX.dataSourceUrl,isShowPages);
            })

            return false;
        }

		// 判断是否为嵌套页面
		var isFrames = !typeof(window.frames["ifrMain"]) == "undefined";
		//查询到数据
		if(loadResult){

			//设置滚动条，默认是不设置的，只有页面上自定义了var customNeedScrollX="Y";变量才进行滚动条设置。如果不设置customScrollWidth，这默认2000宽度
			this.setTableScrollX();
			
			if($(".custom_layper_page_info").length>0){
				$(".custom_layper_page_info").parent().parent().parent().show();
			}
			   				
			//进行静态分页
			if(isShowPages){
                var topScope = angular.element($('div[ng-controller="angulajs_customersCtrl"]')).scope();

				var pageInfoSize;
				if (isFrames) {
                    pageInfoSize = $(window.frames["ifrMain"].document).find("table").find(".custom_layper_page_info").size();
                }else{
                    pageInfoSize=$(window.document).find("table").find(".custom_layper_page_info").size();
                }
				$(".custom_layper_page_info").html("");
				if(parseInt(pageInfoSize)>1){//页面上存在多个表格分页；
					$(".custom_layper_page_info").each(function(){
						var pageInfoId=$(this).attr("id");
						var pageTable=$(this).parent().parent().parent();//分页html所在tabel
						var dataDiv=pageTable.prev(".searchTable");
						var dataTable=dataDiv.find("table").first();

						var $pageInfo = $("#" + pageInfoId);
						//分页
                        setTimeout(function () {
                            var pageId = $(pageTable).find(".custom_page_box").attr("id");
                            var showNglaypage = tycxEngine.nglaypage(pageId,$pageInfo,topScope); // 通过过滤器 实现分页，优化后实现方式
                            if (!showNglaypage) {  //通过隐藏元素 实现分页，旧的实现方式
                                //计算有多少行
                                var itemSize = $(dataDiv).find("tr").not(".trheader").not(".trfooter").not(".noData").size();//直接从html取出已经渲染的tr
                                var pages = Math.ceil(itemSize / TYCX.pageSize); //得到总页数
                                if (itemSize > 0) {
                                    $("#" + pageInfoId).html(TYCX.pageSize + "条/页，共" + itemSize + "条信息");
                                }
                                laypage({
                                    cont: pageId,
                                    pages: pages,
                                    first: false,
                                    last: false,
                                    groups: 8, //连续显示分页数
                                    jump: function (obj) {
                                        tycxEngine.staticPagesMul(obj.curr, dataTable.attr("id"));//多表格分页
                                    }
                                });
                                tycxEngine.staticPagesMul(1, dataTable.attr("id"));//多表格分页
                            }
                        });
					});
				}else{//只有一个分页
					var counts = null;
					if (isFrames)
						count = $(window.frames["ifrMain"].document).find("table").find(".custom_layper_page_info").length;
					else 
						counts = $(window.document).find("table").find(".custom_layper_page_info").length;
					if(counts>0){
                        setTimeout(function () {

							var pageId='layper_page_box';
							var $d=isFrames ? $(window.frames["ifrMain"].document) : $(window.document);
							var $pageInfo = $d.find("table .custom_layper_page_info").first(); //分页信息框
							var showNglaypage = tycxEngine.nglaypage(pageId,$pageInfo,topScope);//// 通过过滤器 实现分页,优化后实现方式

							if(!showNglaypage){   //通过隐藏元素 实现分页，旧的实现方式
								//var itemSize=datas.length;
								TYCX.itemSize = $d.find("table").find(".trheader").parent().find("tr").not(".trheader").not(".trfooter").size();//直接从html取出已经渲染的tr
								$pageInfo.html(TYCX.pageSize + "条/页，共" + TYCX.itemSize + "条信息");
								pages = Math.ceil(TYCX.itemSize / TYCX.pageSize); //得到总页数
								laypage({
									cont: pageId,
									pages: pages,
									first: false,
									last: false,
									groups: 8, //连续显示分页数
									jump: function (obj) {
										TYCX.currPage = obj.curr;
										tycxEngine.staticPages(obj.curr, TYCX.itemSize);
									}
								});
								setTimeout(function () {
									tycxEngine.staticPages(1, TYCX.itemSize);//静态分页
								});
							}
                        });
	   	        	}
				}
			}
				//加载完数据后，需要进行一些其他操作的，比如部分加链接，国地税标志改颜色
	       	setTimeout(function(){
	       		if(tycxEngine.isExitsFunction("doAfterQuery")){
	       			doAfterQuery();//查询后，需要进行的其他操作，如果有，在各自的js里定义
	       		}
	       		tycxEngine.changeHeight('cxtable');
	       		tycxEngine.changeHeight('ifrMain');
	       		tycxEngine.changeGDSbzColor();//变更国地税颜色标志
	       	});
		}else{
			//将分页隐藏
				if($(".custom_layper_page_info").length>0){
					$(".custom_layper_page_info").parent().parent().parent().hide();
				}
				if(isMainLoading){
					layer.close(TYCX.index);
				}
				if (typeof(deliverErrorMsg)!="undefined") {
					layer.alert(deliverErrorMsg, {title:"提示",icon: 6,offset:['120px']});
				} /*else {
					layer.alert("没有数据", {title:"提示",icon: 5,offset:['120px']});
				}*/
		}

		//展示统计日期
		if(this.isExitsFunction("showStaticsDates")){
			showStaticsDates();//需引入tycxFormDate.js
		}
	}

	//装载数据
	TycxEngine.prototype.loadData = function($scope,gdslxDm,responseGs,responseDs){
		$scope.items = null;
		var datas=[];
		var bodyData;
		var gdjson = {"gs":responseGs,"ds":responseDs};
		for(var key in gdjson){
			if(gdjson[key] != undefined && null != gdjson[key] ){
				//支持国地税的多次调用，解析多条response组数据
				for(var k=0 ; k<gdjson[key].length ; k++){
					if(gdjson[key][k] !=  undefined && null != gdjson[key][k]){
						//获取taxML.body下的报文
						bodyData = gdjson[key][k].taxML.body;
						if(bodyData != undefined){
							//通过具体业务js配置的customListDataProcess，获取具体节点下的报文
							if(typeof(customListDataProcess) === 'function' && bodyData != ""){
				   				bodyData = customListDataProcess(bodyData);
				   			}
							for(var i=0;i<bodyData.length;i++){
								datas.push(bodyData[i]);
							}
							if(pageInDb.isPageInDb){
								pageInDb.total=datas.length;
							}
						}
					}
				}
			}
		}
		// 自定义数据加载，主要是兼容其他插件，比如layui
		if(tycxEngine.isExitsFunction("customListDatalay")){
			customListDatalay(datas);
		}
		$scope.formData = datas;
		return datas.length > 0

	}

	//查询成功处理
	TycxEngine.prototype.doSucess = function($scope,response,gdsbz){
		
		//TODO   queryMult[]
		if("1" == gdsbz){
			if(!(pageInDb.isPageInDb&&TYCX.queryGsMult==1))
				TYCX.queryGsMult += 1;
			responseGs.push(response);
		}else if("2" == gdsbz){
			if(!(pageInDb.isPageInDb&&TYCX.queryDsMult==1))
				TYCX.queryDsMult += 1;
			responseDs.push(response);
		}else{
			if(!(pageInDb.isPageInDb&&TYCX.queryJdMult==1))
				TYCX.queryJdMult += 1;
			responseJd.push(response);
		}
		
		//预留参数，用来判断是否国地税单独查询数据失败
		try{
			if(tycxEngine.isExitsFunction("customFailProcess")){
				//自定义业务失败处理
				customFailProcess(response,gdsbz);
			}else if(response.code=="90"){
				//默认业务失败处理
				this.tycxLayerAlert(response.message);
				refreshYzm();
				//联合办税数据处理     关闭loading效果   查询按钮可点击控制
				if("3" == gdslxDm){
					//联合显示模式，且多次查询后 统一显示
					if(lhbsModelSync && multQuerySync){
						if((TYCX.queryGsMult == TYCX.sidLength) && (TYCX.queryDsMult == TYCX.sidLength)){
							if(isMainLoading){
								layer.close(TYCX.index);
							}
							isQuering = false;
						}
					}
				}else{
					//单边查询处理  关闭loading效果  查询按钮可点击控制
					if(multQuerySync){
						if((TYCX.queryGsMult == TYCX.sidLength) || (TYCX.queryDsMult == TYCX.sidLength) || (TYCX.queryJdMult == TYCX.sidLength)){
							if(isMainLoading){
								layer.close(TYCX.index);
							}
							isQuering = false;
						}
					}
				}
				return false;
			}
		}catch(e){}

		var loadResult = false;
		//联合办税数据处理
		if("3" == gdslxDm){
			//联合显示模式，且多次查询后 统一显示
			if(lhbsModelSync && multQuerySync){
				if((TYCX.queryGsMult == TYCX.sidLength) && (TYCX.queryDsMult == TYCX.sidLength)){


	   				if(typeof(customLoadData) === 'function'){
						//数据模型处理
						loadResult = customLoadData($scope,gdslxDm,responseGs,responseDs);
	   				}else{
	   					loadResult = tycxEngine.loadData($scope,gdslxDm,responseGs,responseDs);
	   				}
					//分页显示
	   				this.viewData(loadResult);
					isQuering = false;
				}
			}else{
				//TODO 分国地税显示
			}
		}else{
			//单边查询
			//单边查询，多次查询后统一显示
			if(multQuerySync){
				if((TYCX.queryGsMult == TYCX.sidLength) || (TYCX.queryDsMult == TYCX.sidLength)){

					//单边处理情况
	   				if(typeof(customLoadData) === 'function'){
						//数据模型处理
						loadResult = customLoadData($scope,gdslxDm,responseGs,responseDs);
	   				}else{
	   					loadResult = tycxEngine.loadData($scope,gdslxDm,responseGs,responseDs);
	   				}
					//分页显示
	   				this.viewData(loadResult);
					isQuering = false;
				}else if(TYCX.queryJdMult == TYCX.sidLength){
					//单边处理情况
	   				if(typeof(customLoadData) === 'function'){
						//数据模型处理
						loadResult = customLoadData($scope,gdslxDm,responseJd,null);
	   				}else{
	   					loadResult = tycxEngine.loadData($scope,gdslxDm,responseJd,null);
	   				}
					//分页显示
	   				this.viewData(loadResult);
					isQuering = false;
				}
			}else{
				//TODO 单边查询,每次查询完毕后立即显示
			}

		}
	}
	//查询失败处理
	TycxEngine.prototype.doError = function($scope,sid,gdsbz){
		if('3'==gdslxDm){
			var errorMsg = "";
			//根据账号属性（联合账号，国【地】单边账号）
			//来选择要显示的错误信息
			if(zhxz != '0'){
				if(zhxz == gdsbz){
					errorMsg = customErrorMsg(sid,gdslxDm,gdsbz);
					dhtmlx.message(errorMsg, "info", 3000);
				}
			}else{
				errorMsg = customErrorMsg(sid,gdslxDm,gdsbz);
				dhtmlx.message(errorMsg, "info", 3000);
			}
			//联合查询，单边（另一边）可能查询查询成功
			this.doSucess($scope,null,gdsbz);
		}else{
			layer.alert("数据查询出错", {title:"提示",icon: 5,offset:['120px']});
			if(isMainLoading){
				layer.close(TYCX.index);
			}
			isQuering = false;
		}
	}
	
	
	/**
	 * 数据库分页查询
	 */
	TycxEngine.prototype.doPageInDb = function($scope,$http,ngControllerName,dataSourceUrl,isShowPages){
		pageInDb.scope=$scope;
		pageInDb.http=$http;
		// 开始行
		var startRow = (pageInDb.pageNo - 1) * pageInDb.pageSize + 1;
		// 结尾行
		var endRow = pageInDb.pageNo * pageInDb.pageSize;

		var cxcs = pageInDb.qureyParams + ",\"" + "endRow" + "\":\"" + endRow+ "\"";
		cxcs += ",\"" + "startRow" +"\":\"" + startRow + "\"";
		//支持多个查询，多个sid 通过 ; 隔开
		TYCX.sidLength = sids.length;
		for(var i=0;i<TYCX.sidLength;i++){
			var sid = sids[i];
			var bwcs=bwxx(sid,cxcs);//组装报文信息
			tycxEngine.doQuery($scope,$http,ngControllerName,dataSourceUrl,isShowPages,bwcs,null);
		}
	}
}

String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}

//获取查询请求的URLget参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 

/**
 * 填表页操作规程按钮
 */
function showCzgc() {
	this.parent.onclickCzgc();
}



