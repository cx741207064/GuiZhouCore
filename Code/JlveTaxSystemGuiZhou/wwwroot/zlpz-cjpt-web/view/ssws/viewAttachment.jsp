


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<title>附报资料展示</title>
<link rel="stylesheet" type="text/css" href="/zlpz-cjpt-web/resources/css/common.css" />
<script type="text/javascript" src="/zlpz-cjpt-web/resources/js/ecm-taglib/jquery/jquery.min.js?v="></script>
<script type="text/javascript" src="/zlpz-cjpt-web/resources/js/ecm-taglib/message/Message.js?v="></script>
<script type="text/javascript" src="/zlpz-cjpt-web/resources/js/lib/jquery.media.js?v="></script>
<script type="text/javascript" src="/zlpz-cjpt-web/resources/js/ecm-taglib/mask.js"></script>
<script type="text/javascript" src="/zlpz-cjpt-web/resources/js/lib/pdfobject.js?v="></script>
<script type="text/javascript" src="/zlpz-cjpt-web/abacus/resources4/layui/layui.js"></script>
<script type="text/javascript">
		var dzswjTgc ='DZSWJ_TGC=a2e81c8c93c34e178e54b44f537918a5';
		var AcroPDF = null;
		//全局变量-现在位于第几个文件
		var index = 0;
		var layer;
		layui.use('layer', function() { //独立版的layer无需执行这一句
	        layer = layui.layer;
	    });
		
		//全局变量-总共有几个文件
		var num = 0;
		//全局变量-保存文件url
		var allFiles = null;
		var flzlMc = decodeURI('null');
      	window.onload = function (){
			var w = $(document).width();
	        var h = $(document).height();
			$("#main").css("width", "80%").css("height", h);
			
			var bcwjms = '20190808705B6A96AC10010F75B59C054BE61078CWBB.pdf';
			
			//以,为界限划分字符串，长度为0则跳过，显示文件按钮
			allFiles = bcwjms.split(",");
			num= allFiles.length;
			
			var bcwjm = allFiles[0];
			
			showView(bcwjm, flzlMc);
		};
		
		$(window).resize(function() {
			var w = $(document).width();
	        var h = $(document).height();
			$("#main").css("width", "80%").css("height", h);
		});
		
		function showView(bcwjm, flzlMc){
			var imgs = $("#imgs").val();
			var index = bcwjm.lastIndexOf(".");
			var fn = bcwjm.substring(index + 1).toLowerCase();
			var fileName = "";
			var url = "/zlpz-cjpt-web/attachment/getPdfFile.do?targetName=" + bcwjm  + "&gdslxDm=1&fileName=" + encodeURI(flzlMc);
			if (typeof dzswjTgc != "undefined" && "" != dzswjTgc && dzswjTgc != "null" && dzswjTgc != null) {
				url = url + "&" + dzswjTgc;
            }
			$("#main").html('')
			if(bcwjm.indexOf("pdf") > -1 || bcwjm.indexOf("PDF") > -1){
	 			AcroPDF = document.createElement("object");
	 			AcroPDF.setAttribute("data", url);
	 			AcroPDF.setAttribute("width", "100%");
	 			AcroPDF.setAttribute("height", "100%");
	 	        AcroPDF.setAttribute("type", "application/pdf");
		 	   	document.getElementById("main").appendChild(AcroPDF);
	 			window.setTimeout('initAcroPDF();',1000);
	    	    
	    	    $("body").mask("正在加载文件，请稍后...");
			} else if (imgs.indexOf(fn) > -1) {
				//在线浏览图片
				$("#main").html("<div style='width:100%; height:100%; display:table;text-align:center;'><span style='display:table-cell;vertical-align:middle;'><img src='"+url+"' style='max-width:1024px;'/></span></div>");
			} else {
				//下载
				if (index === -1) {
					/*由于mongodb中zlpzxxVO存在无.pdf后缀名的pdf名称，暂时先处理当pdf文件处理*/
	                AcroPDF = document.createElement("object");
	                AcroPDF.setAttribute("data", url);
	                AcroPDF.setAttribute("width", "100%");
	                AcroPDF.setAttribute("height", "100%");
	                AcroPDF.setAttribute("type", "application/pdf");
	                document.getElementById("main").appendChild(AcroPDF);
	                window.setTimeout('initAcroPDF();',1000);
	                $("body").mask("正在加载文件，请稍后...");
				} else {
					$("#main").html("<div style='width:100%; height:100%; display:table;text-align:center;'><span style='display:table-cell;vertical-align:middle;'><img style='width:100px;' src='/zlpz-cjpt-web/resources/images/icon/"+fn+"_icon.png' /></span></div>");
					document.getElementById("download").src = url;
				}
			}
		}
		
		// 初始化控件
		function initAcroPDF() {
			if (null == AcroPDF) {
    	    	AcroPDF = document.getElementById("pdfFile");
			}

			AcroPDF.messageHandler = {
					onMessage: function(msg) {
						if (!isExternalSupported()) {
							//Message.alert("MSG:" + msg[0] + "," + msg[1] + "," + msg[2] + ". Message is:" + msg[3]);
							if (msg[2] == 'success') {
							} else {
								if (msg[1] != 'controlTijiao') {
									if (msg[0] != 'initialized') {
										Message.alert("MSG:" + msg[0] + "," + msg[1] + "," + msg[2] + ". Message is:" + msg[3]);
									} else {
										controlTijiao();
										$("body").unmask();
									}
								} else {
									controlTijiao();
								}
							}		
						} else {
							window.external.DoOnMessage(msg[0], msg[1], msg[2], msg[3]);
						}
					},
					onError: function(error, msg) {
						if (!isExternalSupported()) {
							Message.errorInfo({
								title : "错误", 
								message : 'ERROR: ' + error + '; MSG: ' + msg[0] + ',' + msg[1] + ',' + msg[2] + ',' + msg[3]
							});
						} else {
							window.external.DoOnError(error.message, msg[0], msg[1], msg[2], msg[3]);
						}
						
					} 
				};
			$("body").unmask();
		}
		
		function isExternalSupported() {
			if (window.external != undefined && 'DoOnMessage' in window.external) {
				return true;
			}
			return false;
		}
		
		// 设置文档里面的提交按钮不可用
		function controlTijiao() {
			if (null == AcroPDF) {
    	    	AcroPDF = document.getElementById("pdfFile");
			}
			AcroPDF.postMessage(new Array('controlTijiao','controlTijiao','','','',''));
		}
		
		// 打印文档
		function printPDF() {
			AcroPDF.postMessage(new Array('printPDF','printPDF','','','',''));
		}
		
		function upfile() {
			if (index==0){
				layer.msg("当前为第一页");
			} else {
				if (allFiles[index-1].length!=0) {
					showView(allFiles[index-1], flzlMc);
					index--;
				} else {
					index--;
					upfile();
				}
			}
		}
		function downfile()	{
			if (index==num-1){
				layer.msg("当前为最后一页");
			} else {
				if (allFiles[index+1].length!=0) {
					showView(allFiles[index+1], flzlMc);
					index++;
				} else {
					index++;
					downfile();
				}
			}
		}
</script>
<style type="text/css">
a {
	line-height:28px; 
	border-radius:1px; 
	top: 45%;
	display: block;
	border:1px solid transparent; 
	color:black;
	cursor:pointer;
}
#left {
	position: fixed;
	top: 0px;
	width: 10%;
	left:0%;
	height: 100%;
	filter:alpha(opacity=50); /*IE滤镜，透明度50%*/
	-moz-opacity:0.5; /*Firefox私有，透明度50%*/
	opacity:0.5;/*其他，透明度50%*/	
	cursor:pointer;
	z-index:9999;
	background-color: #CCC;
}
#right {
	position: fixed;
	top: 0px;
	width: 10%;
	height: 100%;
	filter:alpha(opacity=50); /*IE滤镜，透明度50%*/
	-moz-opacity:0.5; /*Firefox私有，透明度50%*/
	opacity:0.5;/*其他，透明度50%*/
	right:0%;
	cursor:pointer;
	z-index:9999;
	background-color: #CCC;
}

.figure_area .figure-area-arrow {
    position: absolute;
    z-index: 10;
    width: 27px;
    height: 44px;
    line-height: 150px;
    overflow: hidden;
}

.figure_area .arrow-pre {
    background-image:url(photo-scan-layer.32-adg161122171739.png);
	background-position:-62px -1px;
    _background-image: url(photo-scan-layer.ie6-adg161122171739.png);
    _background-position: 0 -62px;
}
.figure_area .arrow-pre-hover {
    background-image: url(photo-scan-layer.32-adg161122171739.png);
    background-position: -120px -1px;
    _background-image: url(photo-scan-layer.ie6-adg161122171739.png);
    _background-position: -62px -62px;
}
.figure_area .arrow-next {
    background-image: url(photo-scan-layer.32-adg161122171739.png);
    background-position: -90px -1px;
    _background-image: url(photo-scan-layer.ie6-adg161122171739.png);
    _background-position: -31px -62px;
}
.figure_area .arrow-next-hover {
    background-image: url(photo-scan-layer.32-adg161122171739.png);
    background-position: -149px -1px;
    _background-image: url(photo-scan-layer.ie6-adg161122171739.png);
    _background-position: -62px 0;
}

</style>
</head>
<body class="figure_area" >
	<div id="FileBtn" align="center"></div>
	<input type="hidden" id="imgs" name="imgs" value="null"/>
	<iframe id="download" name="download" style="display: none;"></iframe>
	<div id="left" onclick="upfile()">
		<a id="js-btn-prevPhoto" href="javascript:;" class="figure-area-arrow arrow-pre-hover" style="left:10%">上一张</a>
	</div>
	<div id="main" style="padding-left:10%; padding-right:10%"></div>
	<div id="right" onclick="downfile()">
		<a id="js-btn-nextPhoto" href="javascript:;" class="figure-area-arrow arrow-next-hover" style="left:60%">下一张</a>
	</div>
</body>
</html>