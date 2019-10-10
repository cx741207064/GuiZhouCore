
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<title>提示说明</title>


<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/resources/css/comon0.css" />
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script>
</head>
<body>
<!-- 提示说明，可覆盖，自行覆盖 -->
<!-- js调用父页面js -->
<div style="padding: 20px 0 0 0; color: #999;letter-spacing:1px;font-size: 12px">
	温馨提示：
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 1、如近期有税费种认定、纳税人资格、备案等发生变动，页面展现清册与实际所需不符的，
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 请点此处<a href="JavaScript:parent.resetSbqc()" id="czBtn">“重置申报清册”</a>对该户清册进行重新生成。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 2、点击页眉“申报缴税”即会触发下属首个菜单“按期应申报”，无需再点击“按期应申报”。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 如发现清册重复，也请点前述链接“重置申报清册”。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 无上述1、2情况请勿点击重置。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 3、仅当操作期间申报状态有变化时点“刷新”，切换月份、刚进入本页面、申报完成后本页面已显示“已申报”等情形均无需刷新。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 4、如发现“刷新”后的申报日期和状态不是最新情况，通常是因“刷新”按钮所查数据同步延时所致。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 如遇此情况，等几秒钟再“刷新”或退出稍后重进申报清册查看。
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 5、没有财务报表清册，可能是以下原因之一：
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 未做财务报表备案， 
	<a onclick="javaScript:parent.cwbainit('CWKJZDBA','N',parent.cwbbzzfDm);return false;" target='_blank' href="#">现在去备案</a> ;
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 只做了备案报告书但未做具体的会计报表名称；
	<br>&nbsp; &nbsp; &nbsp; &nbsp; 财务报表备案中报送期为季、半年、年等情况，非本月报送。
	<!-- <div style="color: #999;letter-spacing:1px;font-size: 12px" id="sbqcWxts">&nbsp; &nbsp; &nbsp; &nbsp; 如企业所得税在国税认定，则财务报表随之在国税方报送，地税清册中不显示财报。同理：如企业所得税在地税认定，则国税不显示。如纳税人仅需报个人所得税，则按个人所得税来判断。</div> -->
</div>
<!-- 隐藏纳税人主体信息 -->
<div id="nsrztxxId"></div>
<script type="text/javascript">
	//根据按钮自适应大小
/* 	$(window.parent.document).find("#msgIframe").load(function () {
	    var main = $(window.parent.document).find("#msgIframe");
	    main.height(350);
	}); */
	$(function(){
		parent.setMsgIframe();
	});
	//隐藏纳税人信息
	function addnsrmsg(msg){
	  document.getElementById('nsrztxxId').innerHTML = msg;
	}
   </script>
</body>
</html>