
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<meta http-equiv="pragma" content="no-cache">  
<meta http-equiv="cache-control" content="no-cache">  
<meta http-equiv="expires" content="0">  
<title>国地联合其他申报</title>

<script type="text/javascript">var cp = '/sbzs-cjpt-web';var contextRoot="/sbzs-cjpt-web";</script>
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/resources/css/comon0.css" />
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/resources/js/ecm-taglib/DatePicker/DatePicker.js"></script>


<script type="text/javascript" src="/sbzs-cjpt-web/resources/js/lib/angular.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/abacus/exAlert.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources/js/nssb/sbqc/sbqc_qtsb.js"></script>

<!--4.0版本UI  -->
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/layui/css/layui.css" id="layui_layer_skinlayercss"/>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources4/layui/layui.js"></script>
<style>
.layui-layer-loading{
	left: 50%!important;
}


</style>
</head>
<body>
	<div ng-app="viewApp" ng-controller="viewCtrl" id="viewCtrlid" class="searchbox">
	  <div class="searchTable">
		<table width="99%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
			<tr>
			    <th width="50px">序号</th>
			    <th ng-if="showGdsbz == 'Y' || showGdsbz == ''" width="50px">国地标志</th>
			    <th width="320">申报表</th>
			    <th width="120">征收项目</th>
			    <th width="120">征收品目</th>
			    <th width="120px">税（费）款所属期起</th>
			    <th width="120px">税（费）款所属期止</th>
			    <th width="120px">操作</th>
			</tr>
			<tr ng-repeat="item in items">
				<td width="30px" align="center" ng-cloak ng-bind="$index + 1"></td>
				<td width="50px" align="center" ng-if="showGdsbz == 'Y' || showGdsbz == ''" ng-bind-html="item.gdslx | gdslxDmFilter | to_trusted"></td>
				<td width="320" align="left" ng-cloak ng-bind="item.sbbmc"></td>
				<td width="120" align="left" ng-cloak ng-bind="item.zsxmMc"></td>
				<td width="120" align="left" ng-cloak ng-bind="item.zspmMc"></td>
				<td width="120px" align="center" ng-cloak ng-bind="item.skssqQ"></td>
				<td width="120px" align="center" ng-cloak ng-bind="item.skssqZ"></td>
				<td width="120px" align="center" ng-cloak ng-bind-html="item | sbztDmFilter | to_trusted"></td>
			</tr>
			<tr ng-cloak ng-if="items.length <= 0">
				<td colspan="8" align="center"><font color="red">没有其他申报清册信息</font></td>
			</tr>
		</table>
	</div></div>
	<!-- 服务异常展示 -->
	<br/>
    <div id="serviceErrId"></div>
	<script type="text/javascript">
		var layer
		//初始化加载数据
		$(document).ready(
				function(e) {
					layui.use('layer', function(){
						layer = layui.layer;
						loadQtsb();
					})
				});
	</script>
</body>
</html>