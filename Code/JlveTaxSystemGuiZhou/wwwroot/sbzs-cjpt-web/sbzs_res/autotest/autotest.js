
function getSbxx(){
	var params = arguments[0];
	var parameJson = eval('(' + params + ')');
	
	var paramArr = parent.window.location.search.substring(1).split("&");
	for (var i = 0; i < paramArr.length; i++){
		if (paramArr[i].match("nsqx_dm")){
			parameJson.nsqx = paramArr[i].split("=")[1];
		}
	}
	
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	
//	var autoUrl = "http://10.10.11.220:8080/autoTest/jsp/exportedJson/integrationSbJson.jsp";//本机联调
	var autoUrl = "http://10.10.0.161:8088/autoTest/jsp/exportedJson/integrationSbJson.jsp";//测试环境地址
	
	$.ajax({
		type : "POST",
		url : mainUrl+"/nssb/auto/autoGetNsrxx.do",
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify(parameJson),
		success : function(data) {
			if (!$.isEmptyObject(data)){
				var rtnData = eval('(' + data + ')');
				layer.open({
 	 				type : 2,
 	 				title : '自动化测试',
 	 				shadeClose : true,
 	 				shade : 0.4,
 	 				skin: 'CLYM-style',
 	 				area : [ '1200px', '550px' ],
 	 				content : autoUrl,
 	 				success: function (layero, index) {
 	 					layero.find("iframe")[0].contentWindow.postMessage(JSON.stringify(rtnData),autoUrl);
 	 				}
 	 			});
			}
			
		}
	});
	
}