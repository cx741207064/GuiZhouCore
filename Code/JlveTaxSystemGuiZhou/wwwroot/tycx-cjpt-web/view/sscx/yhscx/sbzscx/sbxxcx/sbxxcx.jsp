



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="renderer" content="ie-comp" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE" />
<title>已申报信息查询</title>
<!-- 通用样式和框架js -->
<link href="/tycx-cjpt-web/tycx-res/skin/css/comon0.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script>

<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/laypage/laypage.js"></script>
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/layer-v2.2/layer/layer.js"></script>

<script type="text/javascript" src="/tycx-cjpt-web/resources/js/ecm-taglib/DatePicker/DatePicker.js"></script>
        
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/lib/angular.js"></script>

<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/abacus/_res_/css/message/message_solid.css">
<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/abacus/_res_/js/message/skin/default/Message.css"/>
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/message/Message.js"></script>
<script src="/tycx-cjpt-web/abacus/_res_/js/lib/message.js"></script>
<script type="text/javascript">
   var cp = "/tycx-cjpt-web";
</script>

<!-- 4.0版本UI -->
<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/resources4/layui/css/layui.css" />
<script type="text/javascript" src="/tycx-cjpt-web/resources4/layui/layui.js"></script>
<link rel="stylesheet" href="/tycx-cjpt-web/resources4/tax-css/common.css">
<script type="text/javascript" src="/tycx-cjpt-web/resources4/tax-js/common.js"></script>

<script src="/tycx-cjpt-web/resources4/tax-module/select2/select2.js"></script>
<link href="/tycx-cjpt-web/resources4/tax-module/select2/select2.css" rel="stylesheet" />

<!-- 自定义脚本 -->
<script language=JavaScript src="/tycx-cjpt-web/resources/js/lib/cascade-select.js"></script>
<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/base-tycx2.js"></script>
<script type="text/javascript" src="sbxxcx.js"></script>
<script language=JavaScript src="/tycx-cjpt-web/resources/js/tycx/timeValidate.js"></script>
<style type="text/css">
	.btn{overflow: visible!important;}
</style>
</head>
<body>
	<div class="user_box01" ng-app="angulajs_tycxApp" ng-controller="angulajs_customersCtrl">
		<div class="show01">
			<div class="searchbox" id="queryContion">
				<div class="layui-form-item" style="margin-top: 10px;margin-bottom: 0px;">
					
					   	<div class="layui-inline marginB16">
						   	<label class="layui-form-label label-left" style="width:110px">征收项目(税种):</label>
						   	<div class="layui-input-inline">
						   	<select  id="zsxmDm" name="zsxmDm" class="mySelect" style="width:190px;"  cde-init="Y"  cde-subname =""  readonly  cde-datasource="/tycx-cjpt-web/resources/xml/hx_dm_gy_zsxm.xml">
							</select>
							</div>
					   	</div>
						
						<div class="layui-inline marginB16">
							<label class="layui-form-label label-left" style="width:110px">税款所属期起止:</label>
							<div class="layui-input-inline" style="width: 120px">
								<input type="text" name="skssqq" id="skssqq" class="layui-input layui-date-input">
							</div>
							<label class="layui-form-label label-left" style="width: 20px"> &nbsp;-</label>
							<div class="layui-input-inline" style="width: 120px">
							<input type="text" name="skssqz" id="skssqz" class="layui-input layui-date-input">
							</div>
						</div>
					
					<div class="layui-inline marginB16">
						<label class="layui-form-label label-left" style="width:110px">申报类型:</label>
						<div class="layui-input-inline">
						<select class="mySelect" id="sblxDm" style="width:190px;" cde-init="Y"  cde-subname =""  readonly cde-datasource="/tycx-cjpt-web/resources/xml/hx_dm_gy_sblx.xml">
        				</select>
						</div>
					</div>
					
					<div class="layui-inline marginB16">
						<label class="layui-form-label label-left" style="width:110px">申报日期起止:</label>
						<div class="layui-input-inline" style="width: 120px">					
							<input type="text" name="sbssqq" id="sbssqq" class="layui-input layui-date-input" defualtValue="" />
						</div>
						<label class="layui-form-label label-left" style="width:20px">&nbsp;-</label>
						<div class="layui-input-inline" style="width: 120px">
						<input type="text" name="sbssqz" id="sbssqz" class="layui-input layui-date-input" defualtValue=""/>
						</div>
						<div class="layui-inline">
						 	<input id="queryBtn" class="layui-btn layui-btn-primary" type="button" ng-click="queryBtn()" value="查询">
						 </div>
					</div>
					
					 
				      <!--  <td><input class="btn btn05 cz" type="button" ng-click="resetBtn()" value="重 置"/></td> -->
					<!-- <td style="display: none;"><input type="text" id="gdbz" name="gdbz"/>
					</td> -->
				</div>
				
				<div class="layui-table" style="clear:both;">
					
					<!-- <div style="padding:5px 0 10px 0; color:#666;float:left;">统计日期：<span class="show_dates"></span></div>
					 -->
					<table width="100%" border="0" cellspacing="0" cellpadding="0" id="dataList">
						<tbody>
							<tr class="trheader">	
								<th ng-cloak width="50px">序号</th>
								<th ng-cloak width="50" ng-cloak ng-if="gdslxDm == 3" ng-class="{'ng-show':showGdsbz=='Y','ng-hide':showGdsbz=='N'}">国地标志</th>
								<th ng-cloak width="180px">征收项目(税种)</th>
								<th ng-cloak width="290px">申报表名称</th>
								<th ng-cloak width="100px">申报日期</th>
								<th ng-cloak width="100px">申报期限</th>
								<th ng-cloak width="100px">税款所属期起</th>
								<th ng-cloak width="100px">税款所属期止</th>
								<th ng-cloak width="200px">销售(营业)收入(所得税为应纳所得额)</th>
								<th ng-cloak width="90px">应纳税额</th>
								<th ng-cloak width="90px">减免税额</th>
								<th ng-cloak width="90px">已预缴税额</th>
								<th ng-cloak width="90px">本期应补退税额</th>
							</tr>
							<tr ng-repeat="item in formData | orderBy:'sbrq_1':'true'" pzxh="{{item.pzxh}}"  gdslx="{{item.gdslxDm}}"  >
								<td align="center" ng-cloak ng-bind="$index + 1"></td>
								<td align="center" ng-cloak ng-if="gdslxDm == 3" ng-class="{'ng-show':showGdsbz=='Y','ng-hide':showGdsbz=='N'}"><span class="fontcolor01" ng-bind="item.gdslx"></span></td>
								<td ng-cloak ng-bind="item.zsxmmc"></td>
								<td ng-cloak ng-bind="item.dzbzdszlmc"></td>
								<td name="sbrq" ng-cloak ng-bind="item.sbrq_1 | limitTo : 10"></td>
								<td name="sbqx" ng-cloak ng-bind="item.sbqx | limitTo : 10"></td>
								<td ng-cloak ng-bind="item.skssqq | limitTo : 10"></td>
								<td ng-cloak ng-bind="item.skssqz | limitTo : 10"></td>
								<td ng-cloak ng-bind="item.ysx | number:2" style="text-align:right"></td>
								<td ng-cloak ng-bind="item.ynse | number:2" style="text-align:right"></td>
								<td ng-cloak ng-bind="item.jmse | number:2" style="text-align:right"></td>
								<td ng-cloak ng-bind="item.yjse | number:2" style="text-align:right"></td>
								<td ng-cloak ng-bind="item.ybtse | number:2" style="text-align:right"></td>
							</tr>
							<tr class="noData" ng-cloak ng-if="formData.length <= 0">
					      		<td colspan="13" align="center"><font color="red">查无数据</font></td>
					   		</tr>
						</tbody>
					</table>
				</div>
				
				<!-- 分页位置 -->
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td class="custom_layper_page_info"></td>
							<td>
								<div style="padding: 10px 0; float: right;">
		        					<div class="custom_page_box" id="layper_page_box" style="margin-right: 0px"></div>
		        				</div>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- 分页位置 -->
				<div class="tax-text-primary marginT16">
				  <h5>温馨提示</h5>
				  <ul class="text-center">
					<li>逾期申报的申报记录会标红显示！</li>
				  </ul>
				</div>
			</div>
		</div>
	</div>

<!-- 通用查询数据引入，必须 -->
<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/tycxDataTable.js"></script>
<!-- 如果有时间起止控件，直接定义sjq,sjz，引用这个js，如果只有单个的，自己直接参考写js -->
<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/tycxFormDate.js"></script>
</body>
</html>