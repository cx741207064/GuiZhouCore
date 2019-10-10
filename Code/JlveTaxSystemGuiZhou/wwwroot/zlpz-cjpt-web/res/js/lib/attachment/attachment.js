/**
 * 附送资料多文件上传组件 
 * 基于JQuery、AngularJS等JS框架和uploadify多文件上传插件
 */

var flzlListSize;								    //需要上传的文件列表数
var upLoadFileNum;								    //正在上传的文件数
/*进度条变化设置设置*/
var orange = 25, yellow = 50, green = 85;
//浏览 按钮
var scanIndex = 0;
var wdzlkIndex = 0;
//保存的我的资料库标志，防止重复提交。false为没有在保存 可以提交，true为在保存中 不可以提交
var saveFlag = false;
var currentChoose = '';
var currentChooseDm = '';
var currentIdxh = 0;
var tip = '';
//上传资料文件是否是必报的，根据下标{"N","N","Y"}
//var sczlbz = new Array();

//记录资料'上传成功标志'  "N","Y"  {"N","N","Y"}
//var sccgbz = new Array();
$(document).ready(function(){
	//保存必送份数
	var sybbfs1 = parent.sybbfs1;
	//保存条件必报份数
	var sytjbbfs1 = parent.sytjbbfs1;
	$("#sybbfs").val(sybbfs1);
	$("#sytjbbfs").val(sytjbbfs1);
	
	$('input:checkbox[name="box"]').each(function(i){  
		/* 如果加载之前已经保存的数据，已经上传过文件的复选框可选  */
		if(parseInt($('#fs'+(i+1)).html()) === 0)
			$(this).attr('disabled',true);
	}); 
	
});
//浏览按钮
function xzwj(idxh){
	currentChoose = $("#flzlmc"+idxh).text();//当前选择的附列资料名称
	currentChooseDm = $("#flzldm"+idxh).text();//当前选择的附列资料名称
	currentIdxh = idxh;//当前选择的附列资料名称
	var mobileUploadBtn = "";
	var xzwjWindowHeight = "45px";
	if (mobileUploadUrl!=='null' && mobileUploadUrl!=="" && isWdzlk) {
		mobileUploadBtn = '<a href="javascript:void(0);"  style="margin:0 20px 10px 20px;" class="layui-btn layui-btn-xs" onclick="mobileUpload()">手机上传</a>';
		xzwjWindowHeight = "130px";
	} else if (mobileUploadUrl!=='null' && mobileUploadUrl!=="" && !isWdzlk){
		mobileUploadBtn = '<a href="javascript:void(0);"  style="margin:0 20px 10px 20px;" class="layui-btn layui-btn-xs" onclick="mobileUpload()">手机上传</a>';
		xzwjWindowHeight = "90px";
	} else if (isWdzlk){
		xzwjWindowHeight = "90px";
	}
	if (!isWdzlk) {
		scanIndex = layer.open({
			title:false,		//去掉标题
			type: 1,
			skin: 'layui-layer-rim', //加上边框
			area: ['150px', xzwjWindowHeight], //宽高
			content: '<div class="file layui-btn layui-btn-xs" style="margin: 10px 19px;">本地选择<input id="fileupload'+idxh+'" class="file-input" type="file" name="pic" multiple></div>'
			+ mobileUploadBtn
		});
	}
	else if(wdzlkSize < 1 && isWdzlk){
		scanIndex = layer.open({
			title:false,		//去掉标题
			type: 1,
			skin: 'layui-layer-rim', //加上边框
			area: ['150px', xzwjWindowHeight], //宽高
			content: '<div class="file layui-btn layui-btn-xs" style="margin: 10px 19px;">本地选择<input id="fileupload'+idxh+'" class="file-input" type="file" name="pic" multiple></div>'
			+ mobileUploadBtn
			+'<a href="javascript:void(0);"  style="margin:0 20px;" class="layui-btn layui-btn-xs layui-btn-disabled" onclick="fromWdzlk(0)" disabled="">我的资料库选择</a>'
		});
	}else {
		scanIndex = layer.open({
			title:false,	//去掉标题
			type: 1,
			skin: 'layui-layer-rim', //加上边框
			area: ['150px', xzwjWindowHeight], //宽高
			content: '<div class="file layui-btn layui-btn-xs" style="margin: 10px 19px;">本地选择<input id="fileupload'+idxh+'" class="file-input" type="file" name="pic" multiple></div>'
			+ mobileUploadBtn
			+'<a href="javascript:void(0);" align="center" style="margin:0 20px;" class="layui-btn layui-btn-xs" onclick="fromWdzlk(1)">我的资料库选择</a>'
		});
		
	}	
	
	// 初始化上传按钮
	cbdxz(idxh);
}

//修改必报份数
var uploadify_updateBlfs  = function(idxh, num){
	var flzlbslxDm = $('#flzlbslxDm'+idxh).val();
	//设置条件必录和必录的值
	if (num<0) {
		var yscfs = $("#fs"+idxh).text();
		if("1" === flzlbslxDm && (yscfs==='1' || yscfs==='0')){//必报
			var sybbfs =  parseInt($("#sybbfs").val());
			$("#sybbfs").val(sybbfs+ num);
            parent.sybbfs1 = sybbfs+ num;
		}else if("2" === flzlbslxDm && (yscfs==='1' || yscfs==='0')){//条件
			var sytjbbfs =  parseInt($("#sytjbbfs").val());
			$("#sytjbbfs").val(sytjbbfs+ num);
            parent.sytjbbfs1 = sytjbbfs+ num;
		}
	} else {
		if("1" === flzlbslxDm){//必报
			var sybbfs =  parseInt($("#sybbfs").val());
			$("#sybbfs").val(sybbfs+ num);
            parent.sybbfs1 = sybbfs+ num;
		}else if("2" === flzlbslxDm){//条件
			var sytjbbfs =  parseInt($("#sytjbbfs").val());
			$("#sytjbbfs").val(sytjbbfs+ num);
            parent.sytjbbfs1 = sytjbbfs+ num;
		}
	}
	
	var btmake = $("#btnPrepareMake", window.top.document);
//	 1、获取已经必录份数、条件必录份数
//	 2、获取已经上传的必录份数、已经上传的条件必录份数
//	 3、根据1、2点的结果判断：
//	 	1）如果必录已经上传份数 小于 必录上传份数，那在 “附列资料”右上角显示红圈及圈内的 还没上传的必录份数
//	 	2）如果必录已经上传份数 等于 必录上传份数，那判断
//	 		2.1）如果条件必录已经上传份数 小于  条件必录份数，那在 “附列资料”右上角显示黄圈及圈内的 还没上传的条件必录份数
//	 		2.2）如果条件必录已经上传份数 等于  条件必录份数，那在 “附列资料”右上角不显示任何东西
    var doc = null;
    if (parent.ywlx.toLowerCase().indexOf("sxsq") > -1) {
		doc= window.parent.frames["fszlFrame"].document||window.parent.frames[1].document;
    } else {
        //申报文件上传按钮占用myModa1的fszlFrame，申报将附送资料改为myModa7的sbFszlFrame
        doc= window.parent.frames["sbFszlFrame"].document||window.parent.frames[1].document;
    }
	var sybbfs = $("#sybbfs",doc).val();
	var sytjbbfs = $("#sytjbbfs",doc).val();
	var jybz = $("#jybz",doc).val();
	if(sybbfs>0){
		$("#syblfs", window.top.document).addClass("temp01").html(sybbfs);
		$("#syblfs", window.top.document).removeClass("temp02");
		$("#syblfs", window.top.document).css("display","block");
	}else if(sytjbbfs>0){
		$("#syblfs", window.top.document).addClass("temp02").html(sytjbbfs);
		$("#syblfs", window.top.document).removeClass("temp01");
		$("#syblfs", window.top.document).css("display","block");
	}else{
		$("#syblfs", window.top.document).html(sytjbbfs);
		$("#syblfs", window.top.document).css("display","none");
	}
};

//当单个文件上传出错时触发
var uploadify_onUploadError = function(file, errorCode, errorMsg) {
	
	var settings = this.settings;
	var idxh=settings.queueID.substring(5,settings.queueID.length);
	
	upLoadFileNum = upLoadFileNum - 1;
	if(upLoadFileNum === 0){
		$("#divbar").html('');
	}
	
	if(errorCode!==-280){
		$('#sczt' + idxh).html("失败");
		$("#sczt"+idxh).css({
			color: 'red'
		}); 
	}else{
		$('#sczt' + idxh).html("未上传");
	}
};
//取消文件上传
var uploadify_onCancel = function (event, ID, fileObj, data) {
	var settings = this.settings;
	var idxh=settings.queueID.substring(5,settings.queueID.length);
	$('#' + settings.queueID).html("");
	$('#fs' + idxh).html(0);
	$('#sczt' + idxh).html("未上传");
	$('#box' + idxh).attr('checked',false);
	$('#box' + idxh).attr('disabled',true);
};

//从资料库选择 
function chooseWdzlk(that){
	var theText = $(that).attr("value");
	theText = theText.split("-");
	var _id = theText[0];
	var zlpzname = theText[1];
	var fszllj = theText[2];
	//选择的时候会存到currentChooseDm
	var yzpzzlDm = currentChooseDm;
	var bsfs = $("#bsfs"+currentIdxh).text();
	$.when(
			$.ajax({
				type : "POST",
				url : zlpzWebContextPath+"/wdzlk/chooseWdzlk.do?"
				+"_id="+ _id
				+"&ysqxxid="+$("#ysqxxid",window.parent.frames["frmMain"].document).val()
				+"&gdslxDm="+gdslxDm+"&yzpzzlDm="+yzpzzlDm+"&bsfs="+bsfs+"&fszllj="+fszllj,
				data:{"zlpzname":zlpzname},
				dataType:"json",      
			    contentType:"application/x-www-form-urlencoded; charset=utf-8"
			})
		).done(function (data) {
			while(typeof(data) === "string"){
				data = JSON.parse(data);
			}
			if(data.flag === 'ok'){
				//成功后的操作
				layer.close(wdzlkIndex);
				layer.close(scanIndex);
				layer.msg('成功',{icon : 6},{time:400});
				
				//删除按钮正常
				$('#delete'+currentIdxh).removeClass("layui-btn-disabled");
				$('#delete'+currentIdxh).attr('disabled', false);	
				
				//查看按钮正常
				$('#view'+currentIdxh).removeClass("layui-btn-disabled");
				$('#view'+currentIdxh).attr('disabled', false);		

				//份数
				var fs = parseInt($('#fs' + currentIdxh).html()) + 1;
				$('#fs' + currentIdxh).html(fs);
				//点击查看的文件名
				var bcwjm = $('#bcwjm' + currentIdxh).html();
				if(bcwjm === ""){
					$('#bcwjm' + currentIdxh).html(data.fszllj);
				}else{
					$('#bcwjm' + currentIdxh).html(bcwjm+","+data.fszllj);
				}
				
				$('#sczt' + currentIdxh).html("成功");
				$("#sczt"+currentIdxh).removeAttr('style');
				//选中复选框
				$('#box' + currentIdxh).attr('checked',true);
				$('#box' + currentIdxh).attr('disabled',false);
				//成功后判断要不要屏蔽上传按钮
				var bsfs = $('#bsfs' + currentIdxh).html();
				if  (fs === parseInt(bsfs)) {
					$('#scan'+currentIdxh).addClass('layui-btn-disabled');
					$('#scan'+currentIdxh).attr('disabled', true);
				}

				//设置名称
				var zlpzname = data.zlpzname;
				
				var progressTemp = "<div class=\"upload-file\" title=\"name\"><ul><p class=\"progress\" style=\"width: 100%;\"></p><span>name</span></ul></div>";
				var temp = progressTemp.replace(/name/g, zlpzname);
                $("#queue"+currentIdxh+" .filebox").append(temp);
                    
				uploadify_updateBlfs(currentIdxh,-1);
			}
		}).fail(function () {
			layer.alert("系统出现异常了，从资料库选择失败！", {title:"提示",icon: 5});
		});
}

function fromWdzlk(size){
	if(size === 0){
		return;
	}
	tip = '<span>以下是资料库中的资料，请选择对应的文件。您当前需要上传的资料是：<font color="red">'+ currentChoose +'</font></span>';
	
	//iframe层
	wdzlkIndex =layer.open({
	  type: 2,
	  title: '我的资料库列表',
	  skin: 'layui-layer-rim', //加上边框
	  shadeClose: true,
	  shade: 0.8,
	  area: ['580px','350px'],
	  content: zlpzWebContextPath+'/view/form/wdzlk.jsp' //iframe的url
	});
}

function viewWdzlk(that){
	var fszllj = $(that).attr("value");
	if(fszllj === undefined || fszllj === ""){
		layer.alert('糟糕，没有找到文件！需要联系客服解决。',{icon:5});
	}else{
		window.open(zlpzWebContextPath+"/wdzlk/view.do?fszllj="+fszllj+"&gdslxDm="+gdslxDm);
	}
}
//单个点击取消超链接判断
function canceljudge(idxh){
	
	$.when(
		//删除zlpzxxvo和zlpzsxvo中的数据
		$.ajax({
			type : "POST",
			url : zlpzWebContextPath+"/attachment/deleteFile.do?sfzb=N"
				+"&ccwjids="+ $("#bcwjm"+idxh).html()
				+"&ysqxxid="+$("#ysqxxid",window.parent.frames["frmMain"].document).val()
				+"&yzpzzlDms="+$("#flzldm"+idxh).text()+"&gdslxDm="+gdslxDm,
			dataType:"json",      
		    contentType:"application/json"
		})
	).done(function (data) {
		if(data !== "1"){
			layer.alert("取消文件上传失败", {title:"提示",icon: 5});
			return;
		}
		var fs = $("#fs"+idxh).html();
		if(parseInt($("#fs"+idxh).html()) > 0){
			$('#fs' + idxh).html(0);
			$('#sczt' + idxh).html("未上传");
            $("#queue"+idxh+" .filebox").html("");
			$('#box' + idxh).attr('checked',false);
			$('#box' + idxh).attr('disabled',true);
		}
		
		$('#bcwjm' + idxh).html("");
		
		//选择文件  正常
		$('#scan'+idxh).removeClass('layui-btn-disabled');
		$('#scan'+idxh).attr("disabled",false);
		//取消 置灰
		$('#delete'+idxh).addClass("layui-btn-disabled");
		$('#delete'+idxh).attr("disabled",true);
		//查看 置灰
		$('#view'+idxh).addClass("layui-btn-disabled");
		$('#view'+idxh).attr("disabled",true);
		//删除添加的行
		if($('#flzlxh'+idxh).html() === ""){
			$('#tr'+idxh).remove();
		}
		
		//删除时增加条件必录，和非条件必录
		// 有份数才执行以下方法 
		if(fs > 0){
			uploadify_updateBlfs(idxh,1);
		}
		
	}).fail(function () {
		layer.alert("取消文件上传失败", {title:"提示",icon: 5});
	});
}

//单个点击上传超链接判断
function uploadjudge(idxh){
	if(parseInt($("#fs"+idxh).html()) > 0 ){
		alert("文件已上传！");
	}
	$('#uploadify'+idxh).uploadify('upload');
}

//查看上传的附例资料
//imgs 允许上传传的图片类型
//flzlMc，如果是下载文件浏览的，提供文件名
function chakan(idxh, imgs, flzlMc){
	var bcwjm = $("#bcwjm"+idxh).html();
	var fs = parseInt($("#fs"+idxh).html());
	if(bcwjm!=='' && fs > 0){
		flzlMc && (flzlMc = encodeURI(flzlMc));
		var url = this.contextPath + "/view/ssws/viewAttachment.jsp?targetName="+bcwjm+"&gdslxDm="+gdslxDm+"&imgs="+imgs+"&flzlMc="+flzlMc;
		window.open(url);
	}
}

//批量上传
function plsc(){
	$('input:checkbox[name="box"]').each(function(i){  
		if(this.checked === true){
			$('#uploadify'+(i+1)).uploadify('upload');
		}
	}); 
	document.getElementsByName('boxId')[0].checked=false;
}
//批量删除
function pldelete(){
	var bcwjms=new Array();
	var flzldms=new Array();
	$('input:checkbox[name="box"]').each(function(){  
		if(this.checked === true){
			var idxh=this.id.split("box")[1];//checkbox的id，从1开始
			if(parseInt($("#fs"+idxh).html()) > 0){
				bcwjms.push($('#bcwjm' + idxh).html());
				flzldms.push($("#flzldm"+idxh).text());
			}
		}
	}); 
	if(bcwjms.length === 0 || flzldms.length === 0){
		layer.alert("没有选择批量删除的文件", {title:"提示",icon: 5});
		return;
	}
	$.when(
		//删除zlpzxxvo和zlpzsxvo中的数据
		$.ajax({
			type : "POST",
			url : zlpzWebContextPath+"/attachment/deleteFile.do?sfzb=N"
				+"&ccwjids="+ bcwjms.join(",")
				+"&ysqxxid="+$("#ysqxxid",window.parent.frames["frmMain"].document).val()
				+"&yzpzzlDms="+flzldms.join(",")+"&gdslxDm="+gdslxDm,
			dataType:"json",      
		    contentType:"application/json"
		})
	).done(function (data) {
		if(data !== "1"){
			layer.alert("取消文件上传失败", {title:"提示",icon: 5});
			return;
		}
		$('input:checkbox[name="box"]').each(function(){  
			
			var idxh=this.id.split("box")[1];//checkbox的id，从1开始
			
			if(this.checked === true){
				if(parseInt($("#fs"+idxh).html()) > 0){
					$('#fs' + idxh).html(0);
					$('#sczt' + idxh).html("未上传");

                    $("#queue"+idxh+" .filebox").html("");
					$('#box' + idxh).attr('checked',false);
					$('#box' + idxh).attr('disabled',true);
					
				}
				$('#bcwjm' + idxh).html("");
				//选择文件正常
				$('#scan'+idxh).removeClass('layui-btn-disabled');
				$('#scan'+idxh).attr("disabled",false);
				//取消 置灰
				$('#delete'+idxh).addClass("layui-btn-disabled");
				$('#delete'+idxh).attr("disabled",true);
				//查看 置灰
				$('#view'+idxh).addClass("layui-btn-disabled");
				$('#view'+idxh).attr("disabled",true);
				//删除添加的行
				if($('#flzlxh'+idxh).html() === ""){
					$('#tr'+idxh).remove();
				}
				
				//删除时增加条件必录，和非条件必录
				uploadify_updateBlfs(idxh,1);
			}
		}); 
		
		$('input:checkbox[name="box"]').each(function(i){  
			this.checked = false;  
		}); 
		document.getElementsByName('boxId')[0].checked=false;
		
	}).fail(function () {
		layer.alert("取消文件上传失败", {title:"提示",icon: 5});
	});
}

//保存到我的资料库
function bcdwdzlk(){
	var bcwjms='';	//保存文件名
	var flzlmcs='';	//附列资料名称
	var bcfs = 0;   //保存份数
	$('input:checkbox[name="box"]').each(function(){  
		if(this.checked === true){
			var idxh=this.id.split("box")[1];//checkbox的id，从1开始
			if(parseInt($("#fs"+idxh).html()) > 0){
				bcfs++;	//保存份数+1
				bcwjms = bcwjms.concat($('#bcwjm' + idxh).html() + ",");		//对应ccwjid
				flzlmcs = flzlmcs.concat($("#flzlmc"+idxh).text() + ",");		//附列资料名称
			}
		}
	}); 
	if(bcwjms === '' || flzlmcs === ''){
		layer.alert("没有选择保存到我的资料库的文件", {title:"提示",icon: 5});
		return;
	}
	//设置在为true，表示在保存中，防止重复提交。不用遮罩层，这样界面友好一点
	if(!saveFlag){
		saveFlag = true;
	}else{
		layer.msg('正在保存中，请稍候...',{icon : 6});
		return;
	}
	bcwjms = bcwjms.substring(0, bcwjms.lastIndexOf(','));	//对应ccwjid
	flzlmcs = flzlmcs.substring(0, flzlmcs.lastIndexOf(','));	//附列资料名称
	$.when(
		//删除zlpzxxvo和zlpzsxvo中的数据
		$.ajax({
			type : "POST",
			url : zlpzWebContextPath+"/wdzlk/bcdwdzlk.do?"
			+"ccwjids="+ bcwjms
			+"&ysqxxid="+$("#ysqxxid",window.parent.frames["frmMain"].document).val()
			+"&gdslxDm="+gdslxDm,
			data:{"flzlmcs":flzlmcs},
			dataType:"json",      
		    contentType:"application/x-www-form-urlencoded; charset=utf-8"
		})
	).done(function (count) {
		wdzlkSize += count * 1.0;
		//保存成功
		saveFlag = false;
		//让js自动换转类型，返回的为成功保持份数。
		if(count == bcfs)
			layer.alert('全部保存成功！',{icon : 6});
		else{
			layer.alert('保存成功 '+count+' 份，有'+(bcfs-count)+'份文件没能正确保存,您可以到我的资料库查中看保存的结果！');
		}
		
	}).fail(function () {
		layer.alert("系统出现异常，保存到我的资料库失败！", {title:"提示",icon: 5});
	});
}

//复选框点击事件
function checkall(){

	var obj=document.getElementsByName('box');
	var boxIdobj=document.getElementsByName('boxId');
	
	if(boxIdobj[0].checked===true){
		for (i = 0; i < obj.length; i++) {
			//多文件上传中序号不是按1 2 3顺序排的，暂时注释判断文件是否为空的代码
			if(/*($('#queue' + (i+1)).html()!='' && */obj[i].disabled === false){
				obj[i].checked = true; 
			}
		  } 
	}else{
		for (i = 0; i < obj.length; i++) {
			if(obj[i].disabled === false){
				obj[i].checked = false;  
			}				
		  } 
	}
}

//从本地选择
function cbdxz(i){
	var multi = true;
	var bsfs = parseInt($("#bsfs"+i).html());
	
	if(multiFiles !== 'Y' || bsfs <= 1){
		multi = false;//4、副表时，且有配置，当配置为Y且份数为1时，要删除已经上传的附件
	}
	//var fileSizeLimit = document.getElementById("fileSizeLimit").value || "10MB";	//文件上传大小上限，单位MB
	//(fileSizeLimit.indexOf("B") === -1) && (fileSizeLimit += "B");
	var doc = window.parent.frames["frmMain"].document || window.parent.frames[0].document;

    var progressTemplate = "<div class=\"upload-file active\"><ul><p class=\"progress\"></p><span>$fileName$</span></ul></div>";
    // 设置默认文件上传大小
    var fileSizeLimit = 10000000;
    if (document.getElementById("fileSizeLimit").value) {
        var sizeLimit = document.getElementById("fileSizeLimit").value;
        sizeLimit = sizeLimit.substring(0, sizeLimit.length-1);
        fileSizeLimit = parseInt(sizeLimit)*1000*1000;
	}
    // 默认的文件格式
    var fileExtLimit = "jpg,jpeg,png,bmp,pdf,doc,docx,xls,xlsx,rar,zip";
    if (uploadFileType!=="" && uploadFileType!==undefined) {
		fileExtLimit = uploadFileType;
    }
    var ywlx = "";
    if (typeof parent.ywlx === "undefined") {
    	ywlx = "SXSQ";
    } else {
    	ywlx = parent.ywlx;
    }
	// 初始化jqueryFileUpload
    var fileUploader = $("#fileupload"+i);
    fileUploader.fileupload({
        dataType: 'json',
		url: '../attachment/uploadFile.do?DZSWJ_TGC=' + DZSWJ_TGC+"&gdslxDm="+gdslxDm+"&ysqxxid="+$("#ysqxxid",doc).val(),
		formData: {
            swsxDm : $("#swsxDm",doc).val(),
            nsrsbh : $("#nsrsbh",doc).val(),
            test : $("#test",doc).val(),
            gdslxDm : $("#gdslxDm",doc).val(),
            ywbm : $("#ywbm",doc).val(),
            yzpzzlDm : $("#flzldm"+i).text(),
            bsfs : $("#bsfs"+i).text(),
            djxh : $("#djxh",doc).val(),
            ywlxDm : ywlx
		},
        sequentialUploads: true // 按顺序发出所有文件上载请求，而不是同时发出请求。
	}).on("fileuploadchange", function(e, data) {
        // 校验文件数量
        var idxh = data.fileInput.context.id.replace("fileupload", "");
        var scfs = data.files.length;
        if (scfs+parseInt($("#fs"+idxh).text()) > parseInt($("#bsfs"+idxh).text())) {
            layer.alert("最多上传"+$("#bsfs"+idxh).text()+"份文件!", {title:"提示",icon: 5});
            return false;
        }
        // 校验文件名后缀、大小
        var fileArray = new Array();
        for (i=0 ; i<data.files.length ; i++) {
            var file = data.files[i];
            var index = file.name.lastIndexOf(".");
            var ext = file.name.substr(index+1).toLowerCase();
            if (fileExtLimit.indexOf(ext)<0) {
                layer.alert("文件格式不正确，仅限"+fileExtLimit, {title:"提示",icon: 5});
                return false;
            }
            if (file.size>fileSizeLimit) {
                layer.alert("文件大小超过限制("+fileSizeLimit/1000000+"MB)", {title:"提示",icon: 5});
                return false;
            }
        }
        //用户点击本地选择后，关闭本地选择弹框，防止用户再次点击本地选择上传份数超过最多报送份数
        layer.close(scanIndex);
    }).on("fileuploadstart", function(e, data) {
        // 选择完文件,上传就绪
        var idxh = e.target.id.replace("fileupload", "");
        $('#sczt' + idxh).html("就绪");
        $('#box' + idxh).attr('disabled',false);
        $("#sczt"+idxh).removeAttr('style');
    }).on("fileuploadsend", function(e, data) {
        // 每个文件开始上传时调用,这里增加进度条样式
        var idxh = data.fileInput.context.id.replace("fileupload", "");
        var progressStr = progressTemplate.replace("$fileName$", data.files[0].name);
        $("#queue"+idxh).find(".filebox").append(progressStr);
        // 修改状态
        $("#sczt"+idxh).removeAttr('style');
        $("#sczt"+idxh).html("上传中");
        // 进度条缓慢增长到90
        $("#queue"+idxh+" .filebox .progress:last").animate({width:"90%"},1000);
    }).on("fileuploadfail", function(e, data) {
    	var xhr = data._response.jqXHR;
    	if (xhr.status === 500) {
            layer.alert("文件格式或大小不合标准", {title:"提示",icon: 5});
		} else if (xhr.status === 404){
    		layer.alert("服务器无响应，请检查网络状况", {title:"提示",icon: 5});
		} else {
    		layer.alert("文件上传失败，请重新上传!", {title:"提示",icon: 5});
		}
        var idxh = data.fileInput.context.id.replace("fileupload", "");
    	// 移除进度条
		$("#queue"+idxh+" .filebox .upload-file").remove();
		layer.close(scanIndex);
    }).on("fileuploaddone", function(e, data) {
        var idxh = data.fileInput.context.id.replace("fileupload", "");
        // 服务器处理成功并返回信息，在此判断  服务器处理成功 处理返回信息，查看按钮等
        // 上传完成将进度条调至100%
        $("#queue"+idxh+" .filebox .active .progress:first").animate({width:"100%"},1000);
        
        if (data.files[0].name.length>=25) {
        	$("#queue"+idxh+" .filebox .active:first").attr("title", data.files[0].name);
        }
        $("#queue"+idxh+" .filebox .active:first").removeClass("active");
        // 修改已上传份数
        $("#fs"+idxh).text(parseInt($("#fs"+idxh).text())+1);
        // 修改附送资料按钮的份数提示
        uploadify_updateBlfs(idxh,-1);
        setTimeout('layer.close('+scanIndex+')',1000);
        var data_=data.result;
        if(data_.flag==='ok') {
        	$('#delete'+idxh).removeClass("layui-btn-disabled");
            $('#delete' + idxh).attr('disabled', false);
            $('#view'+idxh).removeClass("layui-btn-disabled");
            $('#view'+idxh).attr('disabled', false);
            var bcwjm = $('#bcwjm' + idxh).html();
            if (bcwjm === "") {
                $('#bcwjm' + idxh).html(data_.targetName);
            } else {
                $('#bcwjm' + idxh).html(bcwjm + "," + data_.targetName);
            }
            // 修改上传状态
            $('#sczt' + idxh).html("成功");
            $("#sczt" + idxh).removeAttr('style');
            //选中复选框
            $('#box' + idxh).attr('checked', true);
            //成功后判断要不要屏蔽上传按钮
            var bsfs = $('#bsfs' + idxh).html();
            var fs = $('#fs' + idxh).text();
            if (fs === bsfs || bsfs === 1) {
                // 屏蔽上传按钮
                $('#scan'+idxh).addClass("layui-btn-disabled");
                $('#scan'+idxh).attr("disabled",true);
            }
        } else {
            $('#sczt' + idxh).html("失败");
            $("#sczt" + idxh).css({
                color: 'red'
            });
        }
    });
}

var fyzlFlag = true;
function findFyzl() {
	var doc = window.parent.frames["frmMain"].document || window.parent.frames[0].document;
	var rows = ($(".attachTable tr").length - 3) / 2;
	for (var i = 1; i <= rows; i++) {
		if ($("#fs" + i).text() !== "0") {
			fyzlFlag = false;
		}
	}
	if (fyzlFlag) {
		$.ajax({
			type : "POST",
			url : zlpzWebContextPath + "/flzlFy/findFyzl.do",
			data : {
				nsrsbh : $("#nsrsbh", doc).val(),
				djxh : $("#djxh", doc).val(),
				swsxDm : $("#swsxDm", doc).val(),
				gdslxDm : $("#gdslxDm", doc).val(),
				swjgDm : $("#swjgDm", doc).val(),
				ywbm : $("#ywbm", doc).val(),
				test : $("#test", doc).val()
			},
			dataType : 'json',
			async : true, // 异步请求，在显示附送资料列表时弹窗提示
			success : function(data) {
				var json = eval('(' + data + ')');
				if (json.fyzlMc != null && json.fyzlMc !== "" && json.fyzlMc.length!==0) {
					var tip = "";
					var i = 1;
					for ( var k in json.fyzlMc) {
						tip = tip + i + "、" + json.fyzlMc[k] + "</br>";
						i++;
					}
					layer.confirm('系统检测到您最近有上传过以下资料：</br>' + tip + '请确认是否复用？',
							{
								title : "友情提示",
								btn : [ '确认', '取消' ], // 按钮
								area : [ '400px', '250px' ],
								closeBtn : 0 // 不显示关闭按钮
							}, function(index) {
								// 确认按钮函数，由后台储存资料的相关信息，并修改附送资料列表信息
								// console.log(data);
								layer.close(index);
								saveFyzl();
							}, function() {
								// 取消按钮函数，显示附送资料列表，不做任何处理
								fyzlFlag = false;
							});
					$(".layui-layer-btn").css('background-color', 'white');
				} else {
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				//console.log("异常状态码：" + textStatus + ";异常信息：" + errorThrown);
			}
		});
	}
}

function saveFyzl() {
	var doc = window.parent.frames["frmMain"].document || window.parent.frames[0].document;
	// TODO 先判断是否有暂存报文
	$.ajax({
		type : "post",
		url : zlpzWebContextPath + "/flzlFy/saveFyzl.do",
		data : {
			nsrsbh : $("#nsrsbh",doc).val(),
			djxh : $("#djxh",doc).val(),
			swsxDm : $("#swsxDm",doc).val(),
			gdslxDm : $("#gdslxDm",doc).val(),
			ysqxxId : $("#ysqxxid",doc).val(),
			test : $("#test",doc).val()
		},
		dataType : "json",
		async : false, // 同步请求，在显示附送资料列表时弹窗提示
		success : function(data) {
			// TODO 获得返回信息，修改附列资料列表
			var json = eval('(' + data + ')');
			var params = json.ccwjId;
			// key是pzzlDm，value是ccwjId
			// 1、根据pzzlDm查是第几份文件；2、修改对应行数的数据
			for (var key in params) {
				var fywjxh = $("tr td."+key).html();
				//上传成功后
				// 隐藏下拉框
				$('#chooseMenu'+fywjxh).hide();
				//取消按钮变正常
				$('#delete'+fywjxh).removeClass('layui-btn-disabled');
				$('#delete'+fywjxh).attr("disabled",false);
				
				//浏览按钮变正常
				$('#view'+fywjxh).removeClass('layui-btn-disabled');
				$('#view'+fywjxh).attr("disabled",false);
				var yscfs = parseInt($('#fs' + fywjxh).html());
				if (yscfs === 0) {
					uploadify_updateBlfs(fywjxh,-1);
				}
				var fs = parseInt($('#fs' + fywjxh).html()) + 1;
				$('#fs' + fywjxh).html(fs);
				
				var bcwjm = $('#bcwjm' + fywjxh).html();
				if(bcwjm === ""){
					$('#bcwjm' + fywjxh).html(params[key]);
				}else{
					$('#bcwjm' + fywjxh).html(bcwjm+","+params[key]);
				}
				
				$('#sczt' + fywjxh).html("成功");
				$("#sczt"+fywjxh).removeAttr('style');
				//选中复选框
				$('#box' + fywjxh).attr('checked',true);
				//成功后判断要不要屏蔽上传按钮
				var bsfs = $('#bsfs' + fywjxh).html();
				if(fs === parseInt(bsfs)){
					//只上传一份的情况下：选择文件按钮变灰
					$('#scan'+fywjxh).addClass("layui-btn-disabled");
					$('#scan'+fywjxh).attr("disabled",true);
				}
				
				$("#queue"+fywjxh+" .filebox").html($("#flzlmc"+fywjxh).text());
				//uploadify_updateBlfs(fywjxh,-1);
			}
		}
	});
}

// 判断IE版本
function IEVersion() {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion === 7) {
            return 7;
        } else if(fIEVersion === 8) {
            return 8;
        } else if(fIEVersion === 9) {
            return 9;
        } else if(fIEVersion === 10) {
            return 10;
        } else {
            return 6;// IE版本<=7
        }   
    } else if(isEdge) {
        return 'edge';// edge
    } else if(isIE11) {
        return 11; // IE11
    }else{
        return -1;// 不是ie浏览器
    }
}

// 手机上传按钮：点击生成url二维码；手机扫描之后跳转到免登陆的上传文件页面
function mobileUpload() {
	// TODO 1. 生成sessionId，并将纳税人基本信息发送给 mobileUploadInfo.do，缓存
	// 2. 生成手机上传页面url的二维码，附上sessionID
	// 3. 开始轮询操作
	var sessionId = guid();
	var url = window.location.protocol + "//" + window.location.host + zlpzWebContextPath;
	var doc = window.parent.frames["frmMain"].document || window.parent.frames[0].document;
	$.ajax({
		type : "post",
		url : zlpzWebContextPath + "/attachment/mobileUploadInfo.do",
		data : {
			nsrsbh : $("#nsrsbh",doc).val(),
			djxh : $("#djxh",doc).val(),
			swsxDm : $("#swsxDm",doc).val(),
			gdslxDm : $("#gdslxDm",doc).val(),
			ysqxxid : $("#ysqxxid",doc).val(),
			yzpzzlDm : currentChooseDm,
			zlpzname : currentChoose,
			bsfs : $('#bsfs' + currentIdxh).html(),
			sessionId : sessionId,
			test : $("#test",doc).val()
		},
		async : false,
		success : function(data) {
			// 生成二维码
			layer.open({
				type: 1,
				title: false,
				//skin: 'layui-layer-rim', //加上边框
				area: ['270px', '270px'], //宽高
				content: '<div id="code" align="center" style="padding: 10px;"></div>',
				end: function () {
	                $("#pollState").val("N");
	                // 注销sessionId
	                cancleUpload(sessionId);
	            }
			});
			var gdslxDm = $("#gdslxDm",doc).val();
			if (data.code==='00') {
				$('#code').html("");
				var uploadUrl = "";
				if (mobileUploadUrl!=undefined && mobileUploadUrl!=='null' && mobileUploadUrl!=="") {
					uploadUrl = mobileUploadUrl+ zlpzWebContextPath+"/attachment/uploadPage.do?sessionId="+sessionId+"&gdslxDm="+gdslxDm+"&DZSWJ_TGC="+DZSWJ_TGC;
				} else {
					uploadUrl = url+"/attachment/uploadPage.do?sessionId="+sessionId+"&gdslxDm="+gdslxDm+"&DZSWJ_TGC="+DZSWJ_TGC;
				}
				/*$("#code").qrcode({
					text : uploadUrl,  //设置二维码内容    
					render : "table",
					width : 300,
					height : 300
				});*/
				var qrcode = new QRCode('code', {
					  text: uploadUrl,
					  width: 250,
					  height: 250
					});
				$("#pollState").val("Y");
				// 轮询服务器是否已经上传文件
				checkUploadFile(sessionId);
			} else {
				layer.msg(data.msg);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			layer.msg("网络异常,请稍后再试!"+textStatus);
		}
	});
	var params = "";
	// 生成二维码
	
	// 开始轮询服务器是否已经上传文件
}

function checkUploadFile(sessionId) {
	var url = window.location.protocol + "//" + window.location.host + zlpzWebContextPath;
	var flag = $("#pollState").val();
	$.ajax({
		url : zlpzWebContextPath + "/attachment/checkUploadFile.do?sessionId="+sessionId+"&flzlDm="+currentChooseDm,
		type : "POST",
		success : function(data) {
			if (data.code === "99" && flag==='Y') {
				//setTimeout(,1000);  //关键在这里，回调函数内再次请求Ajax
				setTimeout("checkUploadFile('"+sessionId+"')",5000);
			} else if (data.code === "00") {
				var wjId = data.ccwjId;
				wjId = wjId.substring(1,wjId.length-1);
				var fileName = data.fileName;
				fileName = fileName.substring(1,fileName.length-1);
				//alert("手机上传成功，返回" + json.result);
				//取消按钮变正常
				$('#delete'+currentIdxh).removeClass('layui-btn-disabled');
				$('#delete'+currentIdxh).attr("disabled",false);
				
				//浏览按钮变正常
				$('#view'+currentIdxh).removeClass('layui-btn-disabled');
				$('#view'+currentIdxh).attr("disabled",false);
				
				var fs = parseInt($('#fs' + currentIdxh).html()) + parseInt(data.fs);
				$('#fs' + currentIdxh).html(fs);
				
				var bcwjm = $('#bcwjm' + currentIdxh).html();
				if(bcwjm === ""){
					$('#bcwjm' + currentIdxh).html(wjId);
				}else{
					$('#bcwjm' + currentIdxh).html(bcwjm+","+wjId);
				}
				
				$('#sczt' + currentIdxh).html("成功");
				$("#sczt"+currentIdxh).removeAttr('style');
				//选中复选框
				$('#box' + currentIdxh).attr('checked',true);
				//成功后判断要不要屏蔽上传按钮
				var bsfs = $('#bsfs' + currentIdxh).html();
				//var sizeLimit = settings.queueSizeLimit;
				if(fs === parseInt(bsfs)){
					//只上传一份的情况下：选择文件按钮变灰
					$('#scan'+currentIdxh).addClass("layui-btn-disabled");
					$('#scan'+currentIdxh).attr("disabled",true);
				}
				/*var queueName = $("#queue"+currentIdxh).html();
				if (queueName==="") {
					$("#queue"+currentIdxh+" .filebox").html(fileName);
				} else {
					$("#queue"+currentIdxh+" .filebox").html(queueName+","+fileName);
				}*/
				var progressTemp = "<div class=\"upload-file\" title=\"name\"><ul><p class=\"progress\" style=\"width: 100%;\"></p><span>name</span></ul></div>";
				var fileArray = fileName.split(",");
				for (var i=0 ; i<fileArray.length ; i++) {
					var temp = progressTemp.replace(/name/g, fileArray[i]);
                    $("#queue"+currentIdxh+" .filebox").append(temp);
				}
				uploadify_updateBlfs(currentIdxh,-1);
				layer.closeAll();
			}
		},
		//当请求时间过长（默认为60秒），就再次调用ajax长轮询
		error : function(data) {
			if (flag==='Y') {
				setTimeout("checkUploadFile('"+sessionId+"')",5000);
			}
		}
	});
}

function cancleUpload(sessionId) {
	$.ajax({
		url : zlpzWebContextPath + "/attachment/cancleMobileUpload.do?sessionId="+sessionId,
		type : "POST",
		async : false,
		success : function(data) {
			
		},
		error : function(data) {
			
		}
	});
}

// 生成UUID
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()).toUpperCase();
}