/**
 * 附送资料多文件上传组件 
 * 基于JQuery、AngularJS等JS框架和uploadify多文件上传插件
 */

var upLoadFileNum=0;								    //正在上传的文件数
/*进度条变化设置设置*/
var orange = 25, yellow = 50, green = 85;
//GEARS-8957,sbywbm、djxh已修改重url中传导过来
//var sbywbm = $(window.parent.frames["frmMain"].document).find("input[id='ywbm']").val();
//var djxh = $(window.parent.frames["frmMain"].document).find("input[id='djxh']").val();

var count = 2;
var yscwbbwjlx =  "xls|txt|img|doc|pdf|jpg|bmp|png|xlsx|docx|rar|zip|xml|gif|jpeg";
var fzwjlx =  "xls|txt|img|doc|pdf|jpg|bmp|png|xlsx|docx|rar|zip|xml|gif|jpeg";
//按钮加载完成开始执行，加载上传附注页面
$(document).ready(function(){
	//GEARS-8957 不能直接操作父页面元素
	//var formData = window.parent.frames["frmMain"].window.formData;
	//获取父页面元素
	var frmMain = parent.loadFrmMainData();
	var formData = frmMain.contentWindow.formData;
	var swjgdm =formData.qcs.djNsrxx.zgswjdm;
	if(swjgdm.indexOf('111')==0){
		 count = 10;//
		 yscwbbwjlx =  "xls|xlsx";
		 fzwjlx =  "doc|docx";
			//清空
			$('#yscwbbTable').html("");
			$('#fzTable').html("");
			$('#addtryscwbb').hide();
			$('#addtrfz').hide();
			$('#tsxxp').html("<span style='color: red;'>温馨提示：原始财务报表上传文件的格式只支持(xls,,xlsx)，附注上传文件的格式只支持(doc,,docx)支持最大上传值为10M.</span></p>");
			
	}else{
		//清空
		$('#yscwbbTablebj').html("");
		$('#fzTablebj').html("");
	}
	uploadify();
	//删除暂存上传附列资料的报文，保留一个空的节点
	//更新formData
	if(formData!=null && formData.fileGrid!=null && formData.fileGrid.fileGridlb!=null && formData.fileGrid.fileGridlb.length>0){
		formData.fileGrid.fileGridlb.splice(0,formData.fileGrid.fileGridlb.length);
	}
	//更新formData	
	replaceFormData(formData);
});

function uploadify(){
	for(i=1;i<=count;i++){
		var sclx = $('#sclx'+i).val();
		var scwjlx =  "xls|txt|img|doc|pdf|jpg|bmp|png|xlsx|docx|rar|zip|xml|gif|jpeg";
		var flzldm = "003084";//003084原始财务报表，003085附注
		if("原始财务报表"==sclx){
			scwjlx = yscwbbwjlx;
			flzldm = "003084";
		}else if("附注"==sclx){
			scwjlx = fzwjlx;
			flzldm = "003085";
		}
		
		$("#uploadify"+i).fileupload({
	        dataType: 'json',
			url:'../attachmentSb/uploadFile.do?sbywbm='+sbywbm+'&flzldm='+flzldm+'&djxh='+djxh+'&gdslxDm='+gdslxDm,
	        formData : { 'someKey' : 'someValue' },
	        autoUpload: true,
	        fileTypes: scwjlx,
	        disabled:false,
	        maxFileSize: 10*1024*1024, // 10 MB
	        sequentialUploads: true,
	        queueID:'queue'+i,
	        paramName: 'file',
	        add: function (e, data) {
	        }
		}).on("fileuploadadd", function(e, data) {
			var isPass = validateBeforeSend(e, data, this);
			if(!isPass){
				return false;
			}
			uploadify_onSelect(e, data, this);
            if (e.isDefaultPrevented()) {
                return false;
            }
            if (data.autoUpload || (data.autoUpload !== false &&
                    $(this).fileupload('option', 'autoUpload'))) {
                data.process().done(function () {
                    data.submit();
                });
            }
		}).on("fileuploadstart",function(e, data){
			uploadify_onUploadStart(data, this);
		}).on("fileuploadfail",function(e, data){
			var settings = $(this).fileupload('option');
			var idxh=settings.queueID.substring(5,settings.queueID.length);
			canceljudge(idxh);
			onFileuploadfail(e, data, this);
		}).on("fileuploaddone",function(e, data){
			uploadify_onUploadProgress(e, data, this);
			uploadify_onUploadSuccess(e, data, this);
		}).on("fileuploadprogress",function(e, data){
			uploadify_onUploadProgress(e, data, this);
		});
	}
}

var onFileuploadfail = function(e, data, $this){
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var status = data.bitrateInterval;
	if (status === 500) {
        layer.alert("文件格式或大小不合标准", {title:"提示",icon: 5});
	} else if (status === 404){
		layer.alert("服务器无响应，请检查网络状况", {title:"提示",icon: 5});
	} else {
		layer.alert("上传出现未知异常!", {title:"提示",icon: 5});
	}
}

var validateBeforeSend = function(e, data, $this){
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var idxh=settings.queueID.substring(5,settings.queueID.length);
    var acceptFileTypes=new RegExp('(\.|\/)('+settings.fileTypes+')$', 'i');
    var msgText = "上传失败\n";
    var isError = false;
	if(file.size>settings.maxFileSize){
        msgText += "文件大小超过限制( " + settings.maxFileSize/1024 + " KB)"; 
        isError = true;
	}else if(acceptFileTypes &&
            !(acceptFileTypes.test(file.type) ||
            		acceptFileTypes.test(file.name))){
        msgText += "文件格式不正确，仅限 " + settings.fileTypes;  
        isError = true;
	};
	if(isError){
		canceljudge(idxh);
	    layer.alert(msgText, {title:"提示",icon: 5});
	    return false;
	}
	return true;
}

//选择文件后调用
var uploadify_onSelect = function(e, data, $this) {
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var idxh=settings.queueID.substring(5,settings.queueID.length);
	
	var fileSize = Math.round(file.size / 1024);
	var suffix   = 'KB';
	//数据库传附件大小是kb单位的值
	if (fileSize > 1000) {
		fileSize = Math.round(fileSize / 1000);
		suffix   = 'MB';
	}
	var fileSizeParts = fileSize.toString().split('.');
	fileSize = fileSizeParts[0];
	if (fileSizeParts.length > 1) {
		fileSize += '.' + fileSizeParts[1].substr(0,2);
	}
	fileSize += suffix;
	var queue = $('#' + settings.queueID);
	if(file.size===undefined){
		queue.html('<span class="uploadify-button-text" id="data2'+idxh+'">'+file.name+'</span>');
	}else{
		queue.html('<span class="uploadify-button-text" id="data2'+idxh+'">'+file.name+"["+fileSize+"]"+'</span>');
	}
	$('#fs'+idxh).html(0);
	$('#sczt'+idxh).html("就绪");
	$("#sczt"+idxh).removeAttr('style');
};


//开始上传文件后调用
var uploadify_onUploadStart = function(data,$this) {
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var idxh=settings.queueID.substring(5,settings.queueID.length);
	var trobj=$("#queue"+idxh).parent().parent();
	var divwidth=trobj.width()/2;
	var divheight=trobj.height()/2;
	var divmargin=divheight/2;		
	//先判断是否已经有上传过
	var i=0, flag=0;
	while(flag == 0){
		
		if($('#data3'+idxh +i).length == 0){
			flag++;
		}else{
			i++
		}
	}
	var idx = idxh + "" +i;
	var divhtml='<div class="uploadify-queue-item">\
		<span class="fileName">'+file.name+'</span><span id="data1'+idx+'"></span>\
		<div class="uploadify-progress">\
			<div class="uploadify-progress-bar1" id="bar1'+idx+'"><!--Progress Bar--></div>\
		</div>\
	</div>';
	//$("#divbar").html($("#divbar").html()+divhtml);
	divhtml='<div class="uploadify-queue-item">\
		<div class="progress" id="progress">\
			<b class="progress__bar" id="progress__bar'+idx+'">\
		    	<span class="progress__text" id="progress__text'+idx+'">\
		    	'+file.name+' <span class="progress__text" id="data3'+idx+'"></span>\
		    	</span>\
		  	</b>\
		</div>\
	</div>';
	divhtml='<div class="uploadify-div-bar2">\
		<div class="progress" id="progress'+idx+'">\
			<span class="progress__text" id="data3'+idx+'"></span>\
			<b class="progress__bar" id="progress__bar'+idx+'">\
		  	</b>\
		</div>\
	</div>';
	
	$("#queue"+idxh).html(divhtml);
	$("#progress"+idx).addClass('progress--active');
	$("#sczt"+idxh).removeAttr('style');
	$("#sczt"+idxh).html("上传中");
	var param = {};
	upLoadFileNum = upLoadFileNum + 1;
	data.formData=param;
};

//上传到服务器，服务器返回相应信息到data里
var uploadify_onUploadSuccess = function(e, data, $this){
	var settings = $($this).fileupload('option');
	var idxh=settings.queueID.substring(5,settings.queueID.length);
	upLoadFileNum = upLoadFileNum - 1;
	if(upLoadFileNum == 0){
		setTimeout(function () {
			$("#divbar").html('');
		}, 3000);
	}	
	if(data != null){
		var data_={};
		try{
			data_ = data.result;
		}catch(e){
			data_.flag=='failure';
		}
		if(data_.flag=='ok'){
			$('#fs'+idxh).html(1);
			$('#bcwjm'+idxh).val(data_.targetName);
			$('#bcwjgs'+idxh).val(data_.fileType);
			$('#sczt'+idxh).html("成功");
			$("#sczt"+idxh).removeAttr('style');
			$("#uploadify"+idxh).parent().hide();
			$('#downfile'+idxh).show();
			$('#delete'+idxh).show();
			var flzlDm = $("#flzlDm"+idxh).val();
			//上传成功之后，将上传的文件名写到formData
			updateFormData(data_.targetName,data_.fileType,flzlDm);
		}else{
			$('#downfile'+idxh).hide();
			$('#delete'+idxh).hide();
			$("#uploadify"+idxh).parent().show();
			$('#sczt'+idxh).html("失败");
			$("#sczt"+idxh).css({
				color: 'red'
			}); 
		}
	}else{
		$('#downfile'+idxh).hide();
		$('#delete'+idxh).hide();
		$("#uploadify"+idxh).parent().show();
		$('#sczt'+idxh).html("失败");
		$("#sczt"+idxh).css({
			color: 'red'
		}); 
	}
}

var update = function(file, idxh, percent) {
	
	var fileSize = Math.round(file.size / 1024);
	var suffix   = 'KB';
	if (fileSize > 1000) {
		fileSize = Math.round(fileSize / 1000);
		suffix   = 'MB';
	}
	var fileSizeParts = fileSize.toString().split('.');
	fileSize = fileSizeParts[0];
	if (fileSizeParts.length > 1) {
		fileSize += '.' + fileSizeParts[1].substr(0,2);
	}
	fileSize += suffix;
	//找到最近上传的文件id，并进行操作
	var i=0, flag=0;
	while(flag == 0){
		
		if($('#data3'+idxh +i).length == 0){
			flag++;
		}else{
			i++
		}
	}
	i--;
	var fileName = file.name;
	if(file.name.length>=18){
		var prefix=(file.name).substring((file.name).lastIndexOf(".")+1);
		fileName=((file.name).substring(0,12));
		fileName=((fileName)+"***."+prefix);
	}
	var idx = idxh + "" +i;

	if(file.size===undefined){
		$('#data3'+idx).html(fileName);
	}else{
		$('#data3'+idx).html(fileName+"["+fileSize+"]"+' - ' + percent + '%');
	}
	if (percent >= 100) {
		percent = 100;
		$('#progress'+idx).addClass('progress--complete');
		$('#progress__bar'+idx).addClass('progress__bar--blue');
		if(file.size===undefined){
			$('#data3'+idx).html(fileName+' - Complete');
		}else{
			$('#data3'+idx).html(fileName+"["+fileSize+"]"+' - Complete');
		}
		$('#sczt'+idxh).html("处理中");
	} else {
		if (percent >= green) {
			$('#progress__bar'+idx).addClass('progress__bar--green');
		} else if (percent >= yellow) {
			$('#progress__bar'+idx).addClass('progress__bar--yellow');
		} else if (percent >= orange) {
			$('#progress__bar'+idx).addClass('progress__bar--orange');
		}
	}
	$('#progress__bar'+idx).css({
		width : percent + '%'
	});
	$('#uploadjudge'+idxh).show();
	$('#delete'+idxh).hide();
};

var uploadify_onUploadProgress = function(e, data, $this) {
	var file = data.files[0];
	var fileBytesLoaded=data.loaded;
	var fileTotalBytes=data.total;
	var settings = $($this).fileupload('option');
	var idxh=settings.queueID.substring(5,settings.queueID.length);

	// Setup all the variables
	var timer            = new Date();
	var newTime          = timer.getTime();
	var lapsedTime       = newTime - this.timer;
	if (lapsedTime > 500) {
		this.timer = newTime;
	}
	var lapsedBytes      = fileBytesLoaded - this.bytesLoaded;
	this.bytesLoaded     = fileBytesLoaded;
	var percentage       = Math.round(fileBytesLoaded / fileTotalBytes * 100);
    update(file, idxh, percentage);
}
//单个点击取消超链接判断
function canceljudge(idxh){
	//被删除的文件名
	var fileName = $('#bcwjm'+idxh).val();
	$('#fs'+idxh).html(0);
	$('#sczt'+idxh).html("未上传");
	$("#queue"+idxh).html("");
	$('#bcwjm'+idxh).val("");
	$('#bcwjgs'+idxh).val("");
	$('#delete'+idxh).hide();
	$('#downfile'+idxh).hide();
	$("#uploadify"+idxh).parent().show();
	//更新formData
	//var formData = window.parent.frames["frmMain"].window.formData;
	//GEARS-8957 不能直接操作父页面元素
	var frmMain = parent.loadFrmMainData();
	var formData = frmMain.contentWindow.formData;
	
	if(formData!=null && formData.fileGrid!=null && formData.fileGrid.fileGridlb!=null){
		var fileGridlb = formData.fileGrid.fileGridlb;
		if(fileGridlb!=null && fileGridlb.length==1){
			formData.fileGrid = null;
		}else{
			for(i=0;i<fileGridlb.length;i++){
				var fileGridlbVo = formData.fileGrid.fileGridlb[i];
				if(fileName == fileGridlbVo.filename){
					formData.fileGrid.fileGridlb.splice(i,1);
				}
			}
		}
	}
	//更新formData	
	replaceFormData(formData);
}

//单个点击上传超链接判断
function uploadjudge(idxh){
	if($("#fs"+idxh).html()=='1'){
		layer.alert('文件已上传', {title:"提示",icon: 5});
		$('#uploadjudge'+idxh).hide();
		$('#delete'+idxh).show();
	}
	$('#uploadify'+idxh).uploadify('upload');
	if($("#fs"+idxh).html()=='0'){
		$('#uploadjudge'+idxh).show();
		$('#delete'+idxh).hide();
	}else{
		$('#uploadjudge'+idxh).hide();
		$('#delete'+idxh).show();
	}
}


//设置formData
function updateFormData(fileName,fileType,flzlDm){
	//var formData = window.parent.frames["frmMain"].window.formData;
	//获取父页面元素
	var frmMain = parent.loadFrmMainData();
	var formData = frmMain.contentWindow.formData;
	
	if(formData!=null){
		var fileGrid = formData.fileGrid;
		if(fileGrid!=null && fileGrid!=""){
			var fileGridlb = fileGrid.fileGridlb;
			if(fileGridlb!=null){
				//新增加一个
				var obj = jQuery.parseJSON('{"filepath": "'+flzlDm+'", "yxbz": "Y", "filename": "'+fileName+'", "filetype": "'+fileType+'", "fileindex": "'+(fileGridlb.length+1)+'"}');
				formData.fileGrid.fileGridlb.push(obj);
			}else{
				var obj = jQuery.parseJSON('{"fileGridlb":[{"filepath": "'+flzlDm+'", "yxbz": "Y", "filename": "'+fileName+'", "filetype": "'+fileType+'", "fileindex": "1"}]}');
				formData.fileGrid = obj;
			}
		}else{
			var obj = jQuery.parseJSON('{"fileGridlb":[{"filepath": "'+flzlDm+'", "yxbz": "Y", "filename": "'+fileName+'", "filetype": "'+fileType+'", "fileindex": "1"}]}');
			formData.fileGrid = obj;
		}
		
	}
	//更新formData	
	replaceFormData(formData);
}

/**
 * 更新页面旧的数据模型
 * @param jsonData
 */
function replaceFormData(formData) {
	//var frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
	//GEARS-8957 不能直接操作父页面元素
	var frmMain = parent.loadFrmMainData();
	var frmSheet = $(frmMain.contentWindow.document).find("iframe[id='frmSheet']")
	//注意对象之间的直接引用
	var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
	var viewEngine = frmSheet[0].contentWindow.viewEngine;
	var body = frmSheet[0].contentWindow.document.body;
	
	var frmSheet = $(window.parent.document).find("iframe[id='frmMain']");
	var formEngine = frmSheet[0].contentWindow.formEngine;
	var formulaEngine = frmSheet[0].contentWindow.formulaEngine;
	
	if(viewEngine!=null && viewEngine!="" && viewEngine!=undefined && viewEngine!="undefined"){
		viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
		var flagExecuteInitial = false;
		formulaEngine.applyImportFormulas(true);
		viewEngine.formApply($viewAppElement);
		viewEngine.tipsForVerify(body);
	}
}

var yscwbbXh = 1;
var fzXh = 1;
//增加行
function addTr(tableId,type,flzlDm){
	if(tableId==null || tableId==""){
		return ;
	}
	var xh = 1;
	if("yscwbbTable"==tableId){
		xh = yscwbbXh+1;
		yscwbbXh = yscwbbXh+1;
		$('#yscwbbDeleteButton').show();
	}else if("fzTable"==tableId){
		xh = fzXh+1;
		fzXh = fzXh+1;
		$('#fzDeleteButton').show();
	}
	count = count + 1;
	var trHmtl = '<tr id="'+tableId+ +xh+'">'+
		'<input id="'+count+'count" type="hidden"/>'+
	    '<td align="center" class="title01">'+xh+'</td> '+
	    '<td class="ReadInput02" > <input type="text" readonly value="'+type+'" id="sclx'+count+'" ></td> '+
	    '<td class="ReadInput02" > <input type="text" readonly value="条件报送"></td> '+
	    '<td class="ReadInput02" align="center"> '+
	    	'<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0"> '+
				'<tr> '+
					'<td align="center" id="queue'+count+'" width="40%"></td>'+	
					'<td align="center" width="10%"><span id="sczt'+count+'">未上传</span><span id="fs'+count+'" style="display: none;">0</span><div id="fj'+count+'" style="display: none;"></div><input type="hidden" id="bcwjm'+count+'" value=""><input type="hidden" id="bcwjgs'+count+'" value=""><input type="hidden" id="flzlDm'+count+'" value="'+flzlDm+'"></td>'+
					'<td align="center" width="20%"><div  class="uploadify-button" >选择文件<input  type="file" width="60px" name="uploadify'+count+ '" id="uploadify'+count+'" class="uploadifyInput" /></div></td>'+
					'<td align="center" width="15%">&nbsp;<a class="sbtn sbtn02" id="downfile'+count+'" href="javascript:void(0)" style="display: none;" onclick="chakan('+count+');">查看</a>&nbsp</td>'+
					'<td align="center" width="15%"><a class="sbtn btn01 btnBack" id="delete'+count+'"  href="javascript:void(0)"  onclick="canceljudge('+count+')" style="display: none;">删除</a></td>'+
				'</tr> '+
			'</table> '+
	    '</td> '+
    '</tr> ';
	$("#"+tableId).append(trHmtl);
	 
	var scwjlx =  "xls|txt|img|doc|pdf|jpg|bmp|png|xlsx|docx|rar|zip|xml|gif|jpeg";
	var flzldm = "003084";//003084原始财务报表，003085附注
	if("原始财务报表"==type){
		scwjlx = yscwbbwjlx;
		flzldm = "003084";
	}else if("附注"==type){
		scwjlx = fzwjlx;
		flzldm = "003085";
	}
	$("#uploadify"+count).fileupload({
        dataType: 'json',
		url:'../attachmentSb/uploadFile.do?sbywbm='+sbywbm+'&flzldm='+flzldm+'&djxh='+djxh+'&gdslxDm='+gdslxDm,
        formData : { 'someKey' : 'someValue' },
        autoUpload: true,
        fileTypes: scwjlx,
        disabled:false,
        maxFileSize: 10*1024*1024, // 10 MB
        sequentialUploads: true,
        queueID:'queue'+count,
        paramName: 'file',
        add: function (e, data) {
        }
	}).on("fileuploadadd", function(e, data) {
		var isPass = validateBeforeSend(e, data, this);
		if(!isPass){
			return false;
		}
		uploadify_onSelect(e, data, this);
        if (e.isDefaultPrevented()) {
            return false;
        }
        if (data.autoUpload || (data.autoUpload !== false &&
                $(this).fileupload('option', 'autoUpload'))) {
            data.process().done(function () {
                data.submit();
            });
        }
	}).on("fileuploadstart",function(e, data){
		uploadify_onUploadStart(data, this);
	}).on("fileuploadfail",function(e, data){
		var settings = $(this).fileupload('option');
		var idxh=settings.queueID.substring(5,settings.queueID.length);
		canceljudge(idxh);
		onFileuploadfail(e, data, this);
	}).on("fileuploaddone",function(e, data){
		uploadify_onUploadProgress(e, data, this);
		uploadify_onUploadSuccess(e, data, this);
	}).on("fileuploadprogress",function(e, data){
		uploadify_onUploadProgress(e, data, this);
	});
}

function delTr(tableId){
	if(tableId==null || tableId==""){
		return ;
	}
	var idxh = 1;
	if("yscwbbTable"==tableId && yscwbbXh>1){
		trId = tableId+yscwbbXh;
		yscwbbXh = yscwbbXh-1;
	}else if("fzTable"==tableId && fzXh>1){
		trId = tableId+fzXh;
		fzXh = fzXh-1;
	}else {
		return ;
	}
	if(yscwbbXh==1){
		$('#yscwbbDeleteButton').hide();
	}
	if(fzXh==1){
		$('#fzDeleteButton').hide();
	}
	if($('#'+trId) != null && $('#'+trId) != undefined){
		//使用字符串截取方式获取idxh，解决IE9兼容性问题
		var hiddenHtml = document.getElementById(trId).firstChild.innerHTML;
		if(hiddenHtml!=""){
			idxh = hiddenHtml.substring(hiddenHtml.indexOf("id=")+"id=".length+1,hiddenHtml.indexOf("count"));
		}else{
			var cid = document.getElementById(trId).firstChild.id;
			idxh = cid.substring(0,cid.indexOf("count"));
		}
		var bcwjm = $("#bcwjm"+idxh).val();
		var bcwjgs = $("#bcwjgs"+idxh).val();
		var fs = parseInt($("#fs"+idxh).html());
		if(bcwjm!='' && fs > 0){ 
			canceljudge(idxh);
		}
		$('#'+trId).remove();
	}
}

//查看上传的附例资料
function chakan(idxh){
	var bcwjm = $("#bcwjm"+idxh).val();
	var bcwjgs = $("#bcwjgs"+idxh).val();
	var fs = parseInt($("#fs"+idxh).html());
	if(bcwjm!='' && fs > 0){ 
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var url = mainUrl+"/attachmentSb/downloadFile.do?fileName="+bcwjm+"&ext="+bcwjgs+"&DZSWJ_TGC=" + DZSWJ_TGC ;
		window.open(url);
	}

}


