
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<title>申报清册</title>


<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script>

<!--4.0版本UI  -->
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/layui/css/layui.css" />
</head>
<body>
   <div class="buttonmain buttonmenu" >
        <!-- 调用联合申报js -->
        <a class="layui-btn" href="javaScript:window.parent.document.getElementById('lhsbIframe').contentWindow.resetSbqc()">重置申报清册</a>
   </div>
	<script type="text/javascript">
	//根据按钮自适应大小
	$(function(){
		parent.setBtnIframe();
	})
   </script>
</body>
</html>