

//初始化layui插件
var form,laydate,layer;
layui.use(['form','laydate','layer'], function(){
	form = layui.form;
	laydate = layui.laydate;
	layer = layui.layer;
	//申报日期起
	laydate.render({
		elem: '#sbssqq'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }

	});
	//申报日期止
	laydate.render({
		elem: '#sbssqz'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }

	});
	//税款所属日期起
	laydate.render({
		elem: '#skssqq'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }
	});
	//税款所属日期止
	laydate.render({
		elem: '#skssqz'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }
	});
	
	form.on('checkbox(checkNum)', function(event){
		checkNum(event)
		form.render();
	});
});




//var sids=["dzswj.yhscx.SBZS.SBXXCX"];
var sids=["dzswj.yhscx.sbzs.sbxxcx"];
//设置表格是否出现横向滚动条。不定义，这不会出现横向滚动条。
var customNeedScrollX="Y";
//设置表格出现滚动条后的宽度，不定义，则默认宽度为2000。
var customScrollWidth="1800";

function customListDataProcess(bodyData){
	var data=bodyData.taxML.ysbxxList.ysbxx;
	
	return data;
}

//查询前，进行查询条件判定函数
function customBeforeQuery(){

	var sbssqq = $("#sbssqq").val();
	var sbssqz = $("#sbssqz").val();
	var skssqq = $("#skssqq").val();
	var skssqz = $("#skssqz").val();
	var endD1 = sbssqz.replace(sbssqz.substring(0,4),(parseInt(sbssqz.substring(0,4))-1).toString());
	var endD2 = skssqz.replace(skssqz.substring(0,4),(parseInt(skssqz.substring(0,4))-1).toString());
	if(sbssqq!="" && sbssqz!="" && sbssqq<endD1){
		tycxEngine.tycxLayerAlert("申报日期起止间隔不能大于一年");
		return false;
	}
	if(skssqq!="" && skssqz!="" && skssqq<endD2){
		tycxEngine.tycxLayerAlert("税款所属日期起止间隔不能大于一年");
		return false;
	}
	//税款所属期和申报日期不能同时为空
	if(sbssqq=="" && sbssqz=="" && skssqz=="" && skssqz==""){
		tycxEngine.tycxLayerAlert("税款所属期和申报日期不能同时为空");
		return false;
	}
	
	//申报日期不能只填一个
	if(sbssqq=="" && sbssqz!=""){
		tycxEngine.tycxLayerAlert("申报日期起不能为空");
		return false;
	}
	if(sbssqz=="" && sbssqq!=""){
		tycxEngine.tycxLayerAlert("申报日期止不能为空");
		return false;
	}
	//税款所属期不能只填一个
	if(skssqq=="" && skssqz!=""){
		tycxEngine.tycxLayerAlert("税款所属期起不能为空");
		return false;
	}
	if(skssqz=="" && skssqq!=""){
		tycxEngine.tycxLayerAlert("税款所属期止不能为空");
		return false;
	}
	//日期大小校验
	if(sbssqq > sbssqz){
		tycxEngine.tycxLayerAlert("申报日期止的时间不能小于申报日期起");
		return false;
	}
	if(skssqq > skssqz){
		tycxEngine.tycxLayerAlert("税款所属期止的时间不能小于税款所属期起");
		return false;
	}
	return true;
}
function doAfterQuery(){
	$("table").find("tr").each(function(){
		var pzxh=$(this).attr("pzxh");
		if(undefined!=pzxh){//增加手心样式
			/*$(this).css({"cursor":"pointer"});
			$(this).attr("title","点击查看详细报表");*/
			
			//判断 如果某条申报记录的申报日期迟于申报期限，则该条记录以红色显示。 
			var sbrq=$(this).find("td[name='sbrq']").text();
			var sbqx=$(this).find("td[name='sbqx']").text();
			if(sbrq>sbqx){
				$(this).css({"background-color":"#da7979"});//红色背景
				$(this).find("td").css({"color":"#fff"});//白色底
				/*$(this).find("td").css({"color":"#E00"});//红色文字*/
			}
		}
		
		//点击事件
		/*$(this).click(function(){
			if(undefined!=pzxh){
				var gdslx=$(this).attr("gdslx");
				//window.open("/web-sbzs/nssb/printPdf.do?pzxh="+pzxh);
				dtprintPdf(pzxh,gdslx);
			}
		});*/
	});
}


/**
 * 申报信息（电厅）打印pdf 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询国地税归档信息
 * @param pzxh
 * @param gdslxDm
 */
function dtprintPdf(pzxh,gdslxDm){
	var index = layer.load(0,{shade: 0.2});
	var printPdfUrl = cp+"/cxpt/getPdfName.do?pzxh=" + pzxh +"&gdslxDm="+gdslxDm;
	$.ajax({
		url : printPdfUrl,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			var pdfName = eval("(" + data + ")");
			if (pdfName == null || pdfName == "") {
				layer.alert('该资料文件尚未上传到资料中心，请稍后查看!', {icon : 5});
				return;
			}
			if ( pdfName == "notExistId") {
				layer.alert('非本渠道申报，暂不提供打印!', {icon : 5});
				return;
			}
			var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName="+ pdfName + "&gdslxDm=" + gdslxDm;
			window.open(url);
		},
		error : function() {
			layer.alert('链接超时或网络异常', {icon : 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
	
}



var errorMsg = {"dzswj.yhscx.sbzs.sbxxcx":"查询申报信息失败",
        "dzswj.yhscx.sbzs.sbxxcx.1":"查询国税申报信息失败",
        "dzswj.yhscx.sbzs.sbxxcx.2":"查询地税申报信息失败"};

function customErrorMsg(sid,gdslxDm,gdsbz){
	//单边查询
	if("1" == gdslxDm || "2" == gdslxDm){
		return errorMsg[sid];
	}else{
	//联合办税
	return errorMsg[sid + "." + gdsbz];
	}
}





