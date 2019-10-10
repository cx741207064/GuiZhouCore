
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<meta http-equiv="pragma" content="no-cache">  
<meta http-equiv="cache-control" content="no-cache">  
<meta http-equiv="expires" content="0">  
<title>国地联合申报表</title>


 <script type="text/javascript">var cp = '/sbzs-cjpt-web';var contextRoot="/sbzs-cjpt-web";</script>
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/resources/css/comon0.css" />
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script> 
<script type="text/javascript" src="/sbzs-cjpt-web/resources/js/lib/angular.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/abacus/exAlert.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources/js/nssb/sbqc/sbqc_aqsb.js"></script>

<!--4.0版本UI  -->
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/layui/css/layui.css" id="layui_layer_skinlayercss"/>
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/tax-font-icon/iconfont.css"/>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources4/layui/layui.js"></script>
<link rel="stylesheet" href="/sbzs-cjpt-web/abacus/resources4/tax-css/common.css">

<style>
.layui-layer-loading{
	left: 50%!important;
}
.font-x th, .font-x td{
	font-size: 12px!important;
}
.font-x th{
	font-weight: 700;
}

</style>
</head>
<body>
	<div ng-app="viewApp" ng-controller="viewCtrl" id="viewCtrlid">
	<ng-codetable url="dm_sb_sbywbmxmc.json" name="sbywbmCT" node="" dm="" mc=""></ng-codetable>
	<!-- 清册申报表格，可覆盖，但不建议覆盖  -->
	<div class="sh_title01 sh_title02" style="width: 99%;border-bottom: none;">
		<div id="gdslhsfsb"  class="tax-title marginB16 blold"><i class="dot" style="height: 16px;top: 11px;"></i>税费申报</div>
	</div>
	<div class="searchbox">
		<div class="searchTable">
			<table width="99%" border="0" cellspacing="0" cellpadding="0" id="gdslhsb" style="border-collapse: collapse">
				<tr>
					<th width="50px">序号</th>
					<th ng-if="showGdsbz == 'Y' || showGdsbz == ''" width="50px">国地标志</th>
					<th ng-if="sbqcShowms != 'SBB'" width="270">征收项目</th>
					<th ng-if="sbqcShowms != 'SBB'" width="270">征收品目</th>
					<th ng-if="sbqcShowms == 'SBB'" width="540">申报表</th>
					<th width="120px">税（费）款所属期起</th>
					<th width="120px">税（费）款所属期止</th>
					<th width="120px">申报期限</th>
					<th width="120px">申报日期</th>
					<th width="120px">操作</th>
					<th width="30">
						
						<a class="link-strong remove-line iconfont fsicon-refresh " href="javaScript:refreshSbqc()" title="刷 新" style="text-decoration: none"></a>
					</th>
				</tr>
				<tr ng-repeat="item in qcitems">
					<td width="30px" align="center" ng-cloak ng-bind="$index + 1"></td>
					<td width="50px" align="center" ng-if="showGdsbz == 'Y' || showGdsbz == ''"  ng-bind-html="item.gdslxDm | gdslxDmFilter | to_trusted"></td>
					<td width="270" align="left" ng-if="sbqcShowms != 'SBB'" ng-cloak ng-bind="item.zsxmMc"></td>
					<td width="270" align="left" ng-if="sbqcShowms != 'SBB'" ng-cloak ng-bind="item.zspmMc"></td>
					<td width="540" align="left" ng-if="sbqcShowms == 'SBB'" ng-cloak ng-bind-html="item.zspmDm | sbbmcFilter:CT.sbywbmCT[item.sbywbm] | to_trusted"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.skssqQ"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.skssqZ"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.sbqx"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.sbrq"></td>
					<td width="120px" align="center" ng-cloak ng-bind-html="item | sbztDmFilter | to_trusted"></td>
					<td width="10"  align="center" ng-cloak ng-bind-html="item | uuidFilter:$index | to_trusted"></td>
				</tr>
				<tr ng-cloak ng-if="qcitems.length <= 0">
					<td colspan="10" align="center"><font color="red">没有申报清册信息</font></td>
				</tr>
			</table>
		</div>
	</div>
	<!-- 特色区域，可覆盖，自行覆盖 初始化时，暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="aqsbkzIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!-- 财报申报表格，可覆盖，但不建议覆盖  -->
	<div class="sh_title01 sh_title02" style="width: 99%;border-bottom: none;">
		<div id="gdslhcwbbbs" class="tax-title marginB16 blold"><i class="dot" style="height: 16px;top: 11px;"></i>财务报表报送</div>
	</div>
	<div class="searchbox">
		   <div class="searchTable">
				<table width="99%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse">
					<tr style="height: 44px">
						<th width="50px">序号</th>
						<th ng-if="showGdsbz == 'Y' || showGdsbz == ''" width="50px">国地标志</th>
						<th width="270">财务、会计制度</th>
						<th width="270">财务报表报送小类</th>
						<th width="120px">报送所属期起</th>
						<th width="120px">报送所属期止</th>
						<th width="120px">报送期限</th>
						<th width="120px">报送日期</th>
						<th width="120px">操作</th>
					</tr>
					<tr ng-repeat="item in cbitems">
						<td width="30px" align="center" ng-cloak ng-bind="$index + 1"></td>
						<td width="50px" align="center" ng-cloak ng-if="showGdsbz == 'Y' || showGdsbz == ''" ng-bind-html="item.gdsbz | cbgdsbzFilter | to_trusted"></td>
						<td width="270" align="left" ng-cloak ng-bind="item.cwkjzd"></td>
						<td width="270" align="left" ng-cloak ng-bind="item.cwbsxlmc"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsssqQ"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsssqZ"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsqx"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsrq"></td>
						<td width="120px" align="center" ng-cloak ng-bind-html="item | cbBtnFilter | to_trusted"></td>
					</tr>
					<!-- 未启用国地财报模式 -->
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz==''">
						<td colspan="9" align="center"><font ng-if="cwbbzzfDm==1 && (showGdsbz == 'Y' || showGdsbz == '')">你在国税</font><font ng-if="cwbbzzfDm==2 && (showGdsbz == 'Y' || showGdsbz == '')">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N',cwbbzzfDm);return false;" href="#" target='_blank' ng-show="showCburlbz">现在去备案</a><br/>
							<font>若无需财务备案,请点击此处</font><a class="link-strong" onclick="JavaScript:cwbainit('WCWBBBS','N',cwbbzzfDm);return false;" href="#" target='_blank'>立即填报</a>
						</td>
					</tr>
					<!-- 国无地无财报 -->
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz=='GWDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在国税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','1');return false;" href="#" target='_blank' ng-show="showGsCburlBz">现在去备案</a><br/>
							<font>若无需备案,请点击此处</font><a class="link-strong" onclick="JavaScript:cwbainit('WCWBBBS','N','1');return false;" href="#" target='_blank'>立即填报</a>
						</td>
					</tr>
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz=='GWDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','2');return false;" href="#" target='_blank' ng-show="showDsCburlBz">现在去备案</a><br/>
							<font>若无需备案,请点击此处</font><a class="link-strong" onclick="JavaScript:cwbainit('WCWBBBS','N','2');return false;" href="#" target='_blank'>立即填报</a>
						</td>
					</tr>
					<!-- 国无地有财报 -->
					<tr ng-cloak ng-if="cbitems.length > 0 && gdbamsBz=='GWDY'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在国税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','1');return false;" href="#" target='_blank' ng-show="showGsCburlBz">现在去备案</a><br/>
							<font>若无需备案,请点击此处</font><a class="link-strong" onclick="JavaScript:cwbainit('WCWBBBS','N','1');return false;" href="#" target='_blank'>立即填报</a>
						</td>
					</tr>
					<!--地有国无财报  -->
					<tr ng-cloak ng-if="cbitems.length > 0 && gdbamsBz=='GYDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','2');return false;" href="#" target='_blank' ng-show="showDsCburlBz">现在去备案</a><br/>
							<font>若无需备案,请点击此处</font><a class="link-strong" onclick="JavaScript:cwbainit('WCWBBBS','N','2');return false;" href="#" target='_blank'>立即填报</a>
						</td>
					</tr>
					<!--GWDW=国无地无 GYDY=国有地有  GYDW=国有地无 GWDY=国无地有  -->
				</table>
		</div>
	</div>
	<!-- 特色区域，可覆盖，自行覆盖  暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="cwbbkzIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!-- 财报扩展提示  原写在cwbbkzIframe模块在，但存在加载iframe子页面比渲染数据速度慢引起报错，所以移到这里 -->
	<div id="cwbaMsgId"></div>
	<!-- 服务异常，可覆盖，不建议覆盖 -->
	<div id="serviceErrId"></div>
	<!-- 特色区域，可覆盖，自行覆盖   暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="msgIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!--纳税人基础信息隐藏区  -->
	<div id="nsrztxxId" style="word-break: break-all; color: #fff"></div>
	</div>
    <script type="text/javascript">
    	var layer,page;
		//初始化加载数据
		$(document).ready(
				function(e) {
					layui.use(['layer','laypage'], function(){
						layer = layui.layer;
						page = layui.laypage; 
						loadAqsb();
						loadIframe();
					})
				});
		
		//提供给lhCwbbbsKz.jsp页面调用     设置iframe大小
		function setCwbbkzIframe(){
			//高度自行修改
			$("#cwbbkzIframe").height(0);
		}
		
		//提供给doWord.jsp页面调用    设置iframe大小
		function setMsgIframe(){
			$("#msgIframe").height(310);
		}
		
		//提供给lhSbbbsKz.jsp页面调用   设置iframe大小
		function setAqsbkzIframe(){
			//高度自行修改
			$("#aqsbkzIframe").height(0);
		}
		
		//加载其他iframe扩展模块，写成动态加载是为了让lhSbbbs.jsp里的初始化清册方法优先加载。
		function loadIframe(){
			//加载重置清册模块
			parent.$("#btnIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/doHead.jsp");
			//加载税费申报扩展模块
			$("#aqsbkzIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/lhSbbbsKz.jsp");
			//加载财务报表模块
			$("#cwbbkzIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/lhCwbbbsKz.jsp");
			//加载温馨提示模块
			$("#msgIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/doWord.jsp");
		}
	</script>
	
	<div class="showsy">		
		<div class="win-center" id="showsy" style="display: none;">
			<div class="con-symx searchbox font-x"> 
				<span><span class="font-orange" id="wxts" >您本期应申报税源x条，已申报x条。</span>  
				<div class="layui-form marginT8">
					<table class="layui-table" lay-even="">
    					<thead>
					      <tr>
					        <th>序号</th>
					        <th>税源编号</th>
					        <th>所属期起</th>
					        <th>所属期止</th>
					        <th>申报状态</th>
					      </tr> 
    					</thead>
						<tbody id="syxxmx">
    					</tbody>
					</table>		
				</div>	
				<!-- 存放分页的容器 -->
				<div id="layuiPage"></div>  
			</div>
		</div>
	</div>
	
</body>
</html>