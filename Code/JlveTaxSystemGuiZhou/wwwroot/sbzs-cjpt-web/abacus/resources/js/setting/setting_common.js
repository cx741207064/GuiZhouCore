

/**
 * 初始化
 */
$(document).ready(function() {
	
	//获取局端数据按钮，企业所得税年度a与关联业务往来报告要隐藏。
	if(window.location.href.indexOf("gzsb=Y") == -1 && $("#ywbm").val().toLowerCase() != 'ybnsrzzsxbsz' &&$("#ywbm").val().toLowerCase() != 'qysdsjmandjcsz' && $("#ywbm").val().toLowerCase() != 'glywwlndbgsbjcsz'&& !$("#ywbm").val().match("CWBB")){
		$("#hqjdsj").show();
	}else{
		$("#hqjdsj").hide();
	}
	//财税管家企业所得税年度a 增加重置按钮
	if(window.location.href.indexOf("sjlybz=02")>-1&&$("#ywbm").val().toLowerCase() == 'qysdsjmandjcsz' ){
		$("#czan").show();
	}
	window.saveEvent = function () {
		if(typeof validateBeforeSubmit == "function"){
			var rtnFlag = false;
			if(!validateBeforeSubmit()){
				if ($("#ywbm").val().toLowerCase().indexOf("cwbb") > -1){
					rtnFlag = true;
					layer.alert("数据有误或空值或报送期间与属期不匹配！",{
						icon:2,
	    				title : "错误"
	    			});
				}else {
					return false;
				}
			}
			if (rtnFlag){
				return ;
			}
		}

		var drowMap = {};
		formData = $("#iframehtm").contents().find('#formDataSpan').html();

		var sssqQ = "";
		var sssqZ = "";
		if(formData!=null && formData!="" && $("#ywbm").val().match("CWBB")){
			var cwbbbsjcsz = jQuery.parseJSON(formData).cwbbbsjcsz;
			if(cwbbbsjcsz!=null){
				sssqQ = cwbbbsjcsz.sssqq;
				sssqZ = cwbbbsjcsz.sssqz;
			}
		}
		if(sssqQ==null || sssqQ==""){
			sssqQ = $("#sssqQ").val();
		}
		if(sssqZ==null || sssqZ==""){
			sssqZ = $("#sssqZ").val();
		}
		var ywzt = "";
		if(location.search.indexOf("ywzt=")>-1){
			var ywztParam = location.search.substr(location.search.indexOf("ywzt="));
			if(ywztParam.indexOf("&")>-1){
                ywzt = ywztParam.substr(0,ywztParam.indexOf("&")).split("=")[1];
			}else if(ywztParam.indexOf("#")>-1){
                ywzt = ywztParam.substr(0,ywztParam.indexOf("#")).split("=")[1];
			}else{
                ywzt = ywztParam.split("=")[1];
			}
		}
        //dlsbrq 不要
        if(formData != null && formData != "" && $("#ywbm").val().match("QYSDSJMA18NDJCSZ")){
            var delDlsbrq = jQuery.parseJSON(formData);
            delDlsbrq.a000000.qyjcxxb2018Form.dlsbrq="";
            formData = delDlsbrq;
            delDlsbrq ==="";
        }

		$("body").mask("正在保存数据，请稍候...");
		$.ajax({
			type : "POST",
	 		url : cp+"/setting/saveData.do?djxh="+$("#djxh").val()+"&ywbm="+$("#ywbm").val()+"&ywzt="+ywzt+"&sssqQ="+sssqQ+"&sssqZ="+sssqZ+"&gdslxDm="+$("#gdslxDm").val()+"&test="+$("#test").val()+"&nsrsbh="+$("#nsrsbh").val()+"&swjgDm="+$("#swjgDm").val(),
	 		dataType:"json",      
	        contentType:"application/json",
	 		data:JSON.stringify(formData),
	 		success:function(data){
	 			$("body").unmask();
	 			var jsondata = jQuery.parseJSON(data);
				if("Y" == jsondata.returnFlag) {
					var msg="";
					if(window.location.href.indexOf("gzsb=zx")>-1&&$("#ywbm").val().match("QYSDSJMA18NDJCSZ")){
						msg="请继续进行下一步申报表填写更正操作";
					}else{
						msg=jsondata.warnInfo?jsondata.warnInfo.msg:"保存成功。";
					}
		
					layer.alert(msg,{
						icon:1,
						title : "提示",
						btn1:function(index){
							 if(typeof saveDataCallback == 'function'){
			                    	saveDataCallback(data,index);
			                  }
						}
					});
				}else{
					if(jsondata.errInfo){
						 if(jsondata.errInfo.code == "111"){
							 layer.alert("财务会计制度准则与资料报送小类不匹配！",{
								icon:2,
			    				title : "错误"
							 });
			 			} else if(jsondata.errInfo.code == "101"){
			 				layer.alert("数据有误或空值！",{
								icon:2,
			    				title : "错误"
			    			});
			 			} else if(jsondata.errInfo.code == "100"){
			 				layer.alert("报送期间与属期不匹配！",{
								icon:2,
			    				title : "错误"
			    			});
			 			} else {
			 				var msg = jsondata.errInfo.msg;
			 				layer.alert(msg,{
								icon:2,
			    				title : "错误"
			    			});
			 			}
			 			$("body").unmask();
					}else{
						layer.alert("保存失败，未知原因。",{
							icon:2,
							title : "错误"
						});
					}
				}
	
	 		},
	 		error:function(){
	 			$("body").unmask();
	 			layer.alert("保存失败，请稍侯再试。",{
					icon:2,
					title : "错误"
				});
	 		}
	 	});
	};
	
	/**提交表单,保存json对象到服务端**/
	$("#save").on("click", saveEvent);
	
	$("#hqjdsj").click(function(){
		var url = window.location.href;
		if(url.indexOf("sjlybz=01")>-1){
			window.location.reload();
		}else{
			if(url.indexOf("sjlybz")>-1){
				var pre = url.substr(0,url.indexOf("sjlybz"));
				var andIndex = url.indexOf("&",url.indexOf("sjlybz"));
				var end = "";
				if(andIndex > -1){
					end = url.substr(andIndex);
				}else{
					end ="";
				}
				url = pre + "sjlybz=01"+end;
				window.location.href = url;
			}else{
				if(url.lastIndexOf("#")>-1){
					url = url.substr(0,url.length-1) + "&sjlybz=01#";
				}else{
					url = url + "&sjlybz=01";
				}
				window.location.href = url;
			}
			
		}
	});
	
	$("#czan").click(function(){
		
		layer.confirm('&nbsp &nbsp &nbsp &nbsp尊敬的纳税人，重置后将从税局重新获取企业基础信息，如果您之前已经保存基础信息，数据可能将被覆盖。请确认是否重置？',{
			area: ['333px','200px'],
			title:'提示',
			btn : ['确定','取消'],
			btn2:function(index){
				return;
			}
		},function(index){

			 
			var url = window.location.href;
			if(url.indexOf("sjlybz=01")>-1){
				window.location.reload();
			}else{
				if(url.indexOf("sjlybz")>-1){
					var pre = url.substr(0,url.indexOf("sjlybz"));
					var andIndex = url.indexOf("&",url.indexOf("sjlybz"));
					var end = "";
					if(andIndex > -1){
						end = url.substr(andIndex);
					}else{
						end ="";
					}
					url = pre + "sjlybz=01"+end;
					window.location.href = url;
				}else{
					url = url + "&sjlybz=01";
					window.location.href = url;
				}
				
			}
		});
		
	});
	
	
	
	//进入页面后加载数据
	getInitData();
	
	var gdslxDm = $("#gdslxDm").val();
  	if(1 == gdslxDm){
    	$("#gdFlag").text("国税");
    }else{
    	$("#gdFlag").text("地税");
    }
  	var isGgUser = $("#isGgUser").val();
  	if("00"==isGgUser){
  		$("#gdFlag").text("国地");
  	}
});

function autoResizeIframe (frameId,customizedHeight,customizedWidth) {
	var frame = document.getElementById(frameId);
	if (frame != null && !window.opera) {
		/* var frameDoc = frame.document || frame.ownerDocument;
		if (frameDoc != null) {
			var width = customizedWidth || frameDoc.body.scrollWidth;
			var height = customizedHeight || frameDoc.body.scrollHeight;
			frame.height = height;
			frame.width = width;
		} */
		if (frame.contentDocument && frame.contentDocument.body.offsetHeight) { 
			frame.height = frame.contentDocument.body.offsetHeight; 
		} else if (frame.Document && frame.Document.body.scrollHeight) { 
			frame.height = frame.Document.body.scrollHeight; 
		} 
	}
}

function updateFormData() {
	formData = $("#iframehtm").contents().find('#formDataSpan').html();
	console.log(formData);
}

function cloneFormData (scope, newData) {
    formData = jQuery.extend(true, {}, newData);
    scope.$apply();
}

function getInitData(){
	//更正申报需要从url里取值
	var data = [];
	try {
		 /*获取请求信息*/
		   var info = location.search;
		   /*去除？*/
		   info = info.length > 0 ? info.substring(1) : " ";
		   /*以&分割字符串*/
		   var result1 = info.split("&");
		   /*存储key和value的数组*/
		   var key,value;
		   for(var i=0;i<result1.length;i++){
		       /*以=分割字符串*/
		       var result2 = result1[i].split("=");
		       key = result2[0];
		       value = result2[1];
		       data[key] = value;
		   }
	} catch (e) {
		// TODO: handle exception
	}
	  
	var reqUrl=(cp+"/setting/mainSetting.do?djxh="+$("#djxh").val()
	+"&ywbm="+$("#ywbm").val()
	+"&ywzt="+data["ywzt"]
	+"&sssqQ="+$("#sssqQ").val()+"&sssqZ="+$("#sssqZ").val()
	+"&skssqQ="+$("#sssqQ").val()+"&skssqZ="+$("#sssqZ").val()
	+"&nsrsbh="+$("#nsrsbh").val()+"&test="+$("#test").val()
	+"&gdslxDm="+$("#gdslxDm").val()
	+"&sjlybz="+$("#sjlybz").val()+"&bzz="+$("#bzz").val()
	+"&bbbsqDm="+$("#bbbsqDm").val()+"&zlbsxlDm="+$("#zlbsxlDm").val()
	+"&kjzdzzDm="+$("#kjzdzzDm").val()+"&isycs="+$("#isycs").val()
	+"&cusId="+$("#cusId").val()
	+"&gzsb="+data["gzsb"]
	+"&pzxh="+data["pzxh"]
	+"&gzqybtse="+data["gzqybtse"]
	+"&sbuuid="+data["sbuuid"]);
	//alert(reqUrl);
	$("body").mask("加载数据中，请稍候...");
	$.ajax({
		type : "POST",
		url :reqUrl,
		dataType:"json",      
	    contentType:"application/json",
		success:function(data){
			var jsondata = jQuery.parseJSON(data);
			if("undefined" == typeof jsondata.returnFlag || "Y" == jsondata.returnFlag) {
				if(jsondata.body != null){
					$("#save").show();
					if(typeof jsondata.body == 'object'){
						formData = jsondata.body;
					}else{
						formData = jQuery.parseJSON(jsondata.body);
					}
                    setTimeout("$('body').unmask()", 400);
					flagDataLoaded = true;
					if(jsondata.extraParam){
						formData.extraParam = jsondata.extraParam;
					}
					if(jsondata.ss_ && jsondata.ss_.th_){
                    	formData = $.extend(true, formData, jsondata.ss_.th_);
					}
					$("#ywmc").val(jsondata.ywmc);
				}else{
					$("#save").hide();
					$("body").unmask();
					var index = layer.load(2,{shade: 0.3});
					layer.alert("获取初始数据失败，失败原因：未查询到初始化数据！", {title:"提示",icon: 5});
					layer.close(index);
					autoResizeIframe("iframehtm");
				}
			}else{
				$("#save").hide();
				var msg = jsondata.errInfo.msg;
				$("body").unmask();
				var index = layer.load(2,{shade: 0.3});
				if("INFO" == jsondata.errInfo.code){
					var msgInfo = msg.substring(0,msg.indexOf("(错误码"));
					layer.alert(msgInfo, {title:"提示",icon: 5});
				}else{
					msg="获取初始数据失败，失败原因：" + msg;
					if($("#ywbm").val().toLowerCase() == 'glywwlndbgsbjcsz'&&msg.indexOf("申报属期不存在年度申报记录")!=-1){
						msg="尊敬的纳税人您好，未检测到您年度申报记录，暂不予申报。请办理企业所得税年度申报。";
					}
					layer.alert(msg, {title:"提示",icon: 5});
				}
				layer.close(index);
				autoResizeIframe("iframehtm");
			}		
			
		},
		error:function(data){
			$("body").unmask();
			$("#save").hide();
			var index = layer.load(2,{shade: 0.3});
			layer.alert(data.responseText,{area: ['650px', '400px']});
			layer.close(index);
			autoResizeIframe("iframehtm");
		}
	});

}



/**
 * 山东国税财税管家个性化需求，获取初始化数据
 * 
 * */
function getCwbbchssj(){
	$("body").mask("正在获取初始化数据.....");
	var djxh = $("#djxh").val();
	var nsrsbh = $("#nsrsbh").val();
	var sssqQ = $("#iframehtm").contents().find("#sssqqId").val();
	var sssqZ = $("#iframehtm").contents().find("#sssqzId").val();
	if(sssqQ==null || sssqQ == undefined || sssqQ=="" || sssqQ == "undefined"){
		//使用默认的税款所属期止，默认按月
		var _start = new Date();
		if(_start.getMonth() == 0){
			sssqQ = (_start.getFullYear()-1) + '-12-01';
			var _end = new Date(_start.getFullYear()+1,0,0);
			sssqZ = (_start.getFullYear()-1) + '-12-31'
		}else{
			sssqQ = _start.getFullYear() + '-' + ((_start.getMonth())<=9?'0'+(_start.getMonth()):(_start.getMonth())) + '-01';
			var _end = new Date(_start.getFullYear(),_start.getMonth(),0);
			sssqZ = _start.getFullYear() + '-' + ((_start.getMonth())<=9?'0'+(_start.getMonth()):(_start.getMonth())) + '-' + (_end.getDate());
		}
	}
	var gdslxDm = $("#gdslxDm").val();
	var pramData = {};
	pramData.djxh = djxh;
	pramData.sid = "Fxsw.SB.queryNsrCwbb.zlbsxlDm";
	pramData.gdslxDm = gdslxDm;
	pramData.nsrsbh = nsrsbh;
	pramData.sssqQ = sssqQ;
	pramData.sssqZ = sssqZ;
	pramData.rtnJson = "true";
	pramData.isNsrxx = "false";
	var formDataHtml = $("#iframehtm").contents().find('#formDataSpan').html();
	if(formDataHtml==null || formDataHtml=="" || formDataHtml=="undefined" || formDataHtml==undefined){
		$("body").unmask();
		layer.alert("获取初始化数据失败，请稍侯再试。",{
			icon:2,
			title : "错误" 
		});
		return ;
	}
	var formData = jQuery.parseJSON(formDataHtml);
	$.ajax({
		type: "POST",
		async: false,
		url: cp+"/nssb/getSwkfptData.do"+location.search,
		dataType:"json",      
		contentType:"application/json",
		data:JSON.stringify(pramData),
		async:false,
		success:function(data){
			if (data!=""&&data!=null&&data!=undefined) {
				var jsondata = jQuery.parseJSON(data);
				if(formData!=null && formData!="" && formData.cwbbbsjcsz!=null && formData.cwbbbsjcsz!="" && jsondata!=null && jsondata.taxML!=null){
					var bsqj = jsondata.taxML.bsqj;
					if(bsqj==null || bsqj==""){
						bsqj = "04";
					}
					bsqj=bsqj=="4"?"04":bsqj;
					bsqj=bsqj=="3"?"03":bsqj;
					bsqj=bsqj=="1"?"01":bsqj;
					var sssqq = jsondata.taxML.sssqq;
					var sssqz = jsondata.taxML.sssqz;
					var zlbsxl = jsondata.taxML.zlbsxlDm;
					var kjzdzzDm = jsondata.taxML.kjzdzzDm;
					formData.cwbbbsjcsz.bsqj = bsqj;
					formData.cwbbbsjcsz.sssqq = sssqq;
					formData.cwbbbsjcsz.sssqz = sssqz;
					formData.cwbbbsjcsz.zlbsxl = zlbsxl;
					formData.cwbbbsjcsz.cwkjzdzz = kjzdzzDm;
					var dateIsTrue = cwbbCheckDate(bsqj,sssqq,sssqz);
					if(!dateIsTrue){
						//如果税款所属期起止和报送期间不对应，则根据报送期间设置默认的所属期起止
						var ssqJson = cwbbBsqjForSsq(bsqj);
						sssqq = ssqJson.sssqq;
						sssqz = ssqJson.sssqz;
						formData.cwbbbsjcsz.sssqq = ssqJson.sssqq;
						formData.cwbbbsjcsz.sssqz = ssqJson.sssqz;
					}
					
					if("01"==bsqj){
						formData.cwbbbsjcsz.nbsssqq = sssqq;
						formData.cwbbbsjcsz.nbsssqz = sssqz;
					}
					var isSave = true;//是否可以保存，当接口返回的值都不为空时，可以保存；
					if(sssqq!=null && sssqq!=""){
						$("#sssqQ").val(sssqz);
					}else{
						isSave = false;
					}
					if(sssqz!=null && sssqz!=""){
						$("#sssqZ").val(sssqz);
					}else{
						isSave = false;
					}
					if(zlbsxl!=null && zlbsxl!=""){
						$("#iframehtm").contents().find("#zlbsxlDm").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#zlbsxlDm").attr('disabled',false);
						isSave = false;
					}
					if(bsqj!=null && bsqj!=""){
						$("#iframehtm").contents().find("#bsqjId").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#bsqjId").attr('disabled',false);
						isSave = false;
					}
					if(kjzdzzDm!=null && kjzdzzDm!=""){
						$("#iframehtm").contents().find("#cwkjzdzzDm").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#cwkjzdzzDm").attr('disabled',false);
						isSave = false;
					}
					$("#iframehtm").contents().find("#sssqqId").val(sssqq);
					$("#iframehtm").contents().find("#sssqzId").val(sssqz);
					$("#iframehtm").contents().find("#bsqjId").val(bsqj);
					$("#iframehtm").contents().find("#cwkjzdzzDm").val(kjzdzzDm);
					$("#iframehtm").contents().find("#zlbsxlDm").val(zlbsxl);
					$("#iframehtm").contents().find('#formDataSpan').html(JSON.stringify(formData));
					if(typeof updateCwbbData == 'function'){
						updateCwbbData(formData);
	                }
					if(isSave){
						//保存数据
						saveFormData(formData);
					}else{
						$("body").unmask();
					}
				}else{
					$("body").unmask();
					layer.alert("获取初始化数据失败，请稍侯再试。",{
						icon:2,
						title : "错误"
					});
				}
			}else{
				$("body").unmask();
				layer.alert("获取初始化数据失败，请稍侯再试。",{
					icon:2,
					title : "错误"
				});
			}
		},
 		error:function(data){
 			$("body").unmask();
 			layer.alert("获取初始化数据失败，请稍侯再试。",{
				icon:2,
				title : "错误"
			});
 		}
	});
	
	
	function saveFormData(formData){
		//获取初始化数据之后保存数据
		$.ajax({
			type : "POST",
			async: false,
	 		url : cp+"/setting/saveData.do?djxh="+$("#djxh").val()+"&ywbm="+$("#ywbm").val()+"&sssqQ="+formData.cwbbbsjcsz.sssqq+"&sssqZ="+formData.cwbbbsjcsz.sssqz+"&gdslxDm="+$("#gdslxDm").val()+"&test="+$("#test").val()+"&nsrsbh="+$("#nsrsbh").val()+"&swjgDm="+$("#swjgDm").val(),
	 		dataType:"json",      
	        contentType:"application/json",
	 		data:JSON.stringify(formData),
	 		success:function(data){
	 			var jsondata = jQuery.parseJSON(data);
				if("Y" != jsondata.returnFlag) {
					if(jsondata.errInfo){
						 if(jsondata.errInfo.code == "111"){
							layer.alert("财务会计制度准则与资料报送小类不匹配！",{
								icon:2,
			    				title : "错误"
			    			});
			 			} else if(jsondata.errInfo.code == "101"){
			 				layer.alert("数据有误或空值！",{
								icon:2,
			    				title : "错误"
			    			});
			 			} else if(jsondata.errInfo.code == "100"){
			 				layer.alert("报送期间与属期不匹配！",{
								icon:2,
			    				title : "错误"
			    			});
			 			} else {
			 				var msg = jsondata.errInfo.msg;
			 				layer.alert(msg,{
								icon:2,
			    				title : "错误"
			    			});
			 			}
					}else{
						$("body").unmask();
						layer.alert("获取初始化数据失败，未知原因。",{
							icon:2,
							title : "错误"
						});
					}
				}
				$("body").unmask();
	 		},
	 		error:function(){
	 			$("body").unmask();
	 			layer.alert("获取初始化数据失败，请稍侯再试。",{
					icon:2,
					title : "错误"
				});
	 		}
	 	});
	}
}


function cwbbBsqjForSsq(bsqj){
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


function cwbbCheckDate(sbqj, sssqq, sssqz){
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
 * 引导页使用的逾期申报控制
 * 业务参照 @see common.js -> sbbYqsbValid
 * 1、有申报期限，传参及顺序：gdslxDm -> sbqx
 * 2、无申报期限，传参及顺序：gdslxDm -> sbywbm -> zsxmDm -> ssqq -> ssqz -> nsqxDm -> sbqxDm
 *
 * 目前仅支持上述两种传参，判断参数个数为2或者7，其他都不执行。
 */
function settingYqsbValid() {
    // 仅正常申报使用，更正申报的逾期暂不处理
    if (parent.location.href.indexOf('gzsb=zx') == -1) {
        var params = "";
        if (arguments.length == 2) {
            var gdslxDm = arguments[0];
            var sbqx = arguments[1];
            // sbqx = '2019-11-11';
            params += 'gdslxDm=' + gdslxDm + '&sbqx=' + sbqx;
            if (!gdslxDm || !sbqx) {
                console.info("Error params, params = [" + params + "]");
                params = '';
            }
        } else if (arguments.length == 7) {
            var gdslxDm = arguments[0];
            var sbywbm = arguments[1];
            var zsxmDm = arguments[2];
            var ssqq = arguments[3];
            var ssqz = arguments[4];
            var nsqxDm = arguments[5];
            var sbqxDm = arguments[6];
            params += 'gdslxDm=' + gdslxDm + '&sbywbm=' + sbywbm +
                '&zsxmDm=' + zsxmDm + '&ssqq=' + ssqq +
                '&ssqz=' + ssqz + '&nsqxDm=' + nsqxDm +
                '&sbqxDm=' + sbqxDm;

            if (!gdslxDm || !sbywbm || !zsxmDm || !ssqq || !ssqz || !nsqxDm || !sbqxDm) {
                console.info("Error params, params = [" + params + "]");
                params = '';
            }
        } else {
            console.info("Wrong Parameter Number, exit yqsb validate!");
        }

        if (params) {
            var yqsbbz = parent.parent.yqsbbz;
          //  yqsbbz = 'N';
            params += '&yqsbbz=' + yqsbbz;

            if (yqsbbz != "Y") {
                // var sUrl = parent.pathRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
				var sUrl = parent.location.protocol + "//" + parent.location.host + cp +
					'/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
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
                            // window.parent.cleanMeunBtn();
							var btnSave = $('#save', parent.document);
							if (btnSave) {
								btnSave.hide();
							}

							// 调整按钮名称，如果有跳转URL，则为取办理，否则确定。
							// JSONE-1535
                            var wfurl = data.wfurlList;
							var btnName = wfurl != undefined && wfurl != "" && wfurl != null ? '去办理' : '确定';
                            var b = layer.confirm(data.msg, {
                                //area: ['250px','150px'],
                                title: '提示',
                                closeBtn: false,
                                btn: [btnName]
                            }, function (index) {
                                layer.close(b);
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
                        }else if (sfkyqsbbz === "Y") {	// 弹框提示，不阻断
                            // modify by dfw - 2018年11月26日15:09:17。
                            // 可能会返回逾期提示(yqtsmsg)和处罚提示(msg)。
                            // 处理逻辑->弹出逾期提示（继续申报） -> 弹出行政处罚（确定）
                            if (data.msg) {
                                if (data.yqtsmsg) {
                                    var tab = layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        layer.close(tab);

                                        var subTab = layer.confirm(data.msg, {
                                            title: '提示',
                                            closeBtn: false,
                                            btn: ['确定']
                                        }, function (index1) {
                                            layer.close(subTab);
                                        });
                                    });
                                } else {
                                    var tab = layer.confirm(data.msg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['确定']
                                    }, function (index) {
                                        layer.close(tab);
                                    });
                                }
                            } else {
                                if (data.yqtsmsg) {
                                    var tab = layer.confirm(data.yqtsmsg, {
                                        title: '提示',
                                        closeBtn: false,
                                        btn: ['继续申报']
                                    }, function (index) {
                                        layer.close(tab);
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