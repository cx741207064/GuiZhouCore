/**
 * 属新视图
 * Add by C.Q 20190131 23:35
 * @returns
 */
function refreshView() {
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify(document.body);
}

function loadNsrmc() { // dzdw-代理机构统一社会信用代码
	var params = {};
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var dzdw = parent.formData.fjsSbbdxxVO.fjssbb.fjsslxxForm.dzdw;
//	if (dzdw==''||dzdw==null||dzdw==undefined) {
//		window.parent.parent.layer.alert('【代理机构统一社会信用代码】不能为空！', {title:"提示",area: ['200px', '200px'],offset: '100px'}); 
//		return;
//	}
	params.dzdw = dzdw;
	$.ajax({
		type: "POST",
		async: false,
 		url: mainUrl+"/nssb/fjssb/getDljgInfo.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(params),
 		success:function(data){
 			if (data!=null&&data!=''&&data!=undefined) {
 				parent.formData.fjsSbbdxxVO.fjssbb.fjsslxxForm.smrxm = data.nsrmc;
			} else {
				parent.formData.fjsSbbdxxVO.fjssbb.fjsslxxForm.smrxm = '';
			}
 			refreshView();
 		},
 		error:function(data){
 			var errmsg=data.responseText;
 			errmsg=errmsg.replace("未知异常","校验异常");
 			var start=errmsg.indexOf("<H2>Exception:");
 			if(start>-1){
 				var end=errmsg.indexOf("</H2>",start);
 				var ulTag=errmsg.indexOf("</ul>",start);
 				if(ulTag>-1&&end>-1){
 					errmsg=errmsg.replace(errmsg.substring(start,ulTag),errmsg.substring(start,end)); 					
 				}
 			} 			 		
 			if(typeof isJmsb === "function" && !isJmsb()){
 				window.parent.parent.layer.alert(errmsg, {title:"提示",area: ['800px', '450px'],offset: '100px'}); 
 			}
 		}
	});
}
