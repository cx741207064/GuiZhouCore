var zyUrl="/xxmh";
$(function() {
	getShowGdsbz();// 获取国地税标志是否显示配置 在portal.js

	if (showGdsbz == "N") {
		$(".ctrl01").hide();
		$(".ctrl02").show();
	} else if (showGdsbz == "Y") {
		$(".ctrl01").show();
		$(".ctrl02").hide();
	} else {
		$(".ctrl01").show();
		$(".ctrl02").hide();
	}

	layui.use(['element','layer','jquery'], function() {
		layer = layui.layer;
	});

	// 是否登录
	var checkLoginUrl = "/xxmh/portalSer/checkLogin.do";
	$.post(checkLoginUrl, {}, function(d) {
		getLoginMenus();
		getMenu();
	});

	/*获取切换身份、主管税务机关div*/
	getQhsfDiv();
	
	/**
	 * 全局搜索
	 */
	var yjcd = getURLParameter("yjcd");
	var ejcd = getURLParameter("ejcd");
	var sjcd = getURLParameter("sjcd");
	var from = getURLParameter("from");
	if ("dzswj_qjss" == from) {
		if (yjcd != null && yjcd != "" && ejcd != null && ejcd != "") {
			if (yjcd == "znhd") {
				goPage('/xxmh/html/znhd.html', 'znhd', '', '', '')
			} else {
				goPage('', yjcd, ejcd, '', '');
			}
		}
	}


	
	
	//事件绑定开始

	/**
	 * 绑定回车搜索
	 */
	$("#keyword").keydown(function(e) {
		if (e.keyCode == 13) {
			window.open("/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key="+ encodeURI($('#keyword').val()));
		}
	});

	/**
	 * 绑定按钮搜索
	 */
	$("#keysearch").click(function(e) {
		window.open("/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key="+ encodeURI($('#keyword').val()));
	});

	/**
	 * 鼠标划入切换标签,把对应的id存入cookie,返回时切换到对应标签
	 */
	$(".layui-tab-hover>.layui-tab-title>li").on("mouseenter", function() {
		$(this).click();
		//把对应的id存入localStorage,返回时切换到对应标签，目前取值在portal.js
		var storage=window.localStorage;
		storage.setItem("tabTitle",$(this).attr("id"));
	});

	/**
	 * 常用功能设置
	 */
	$('#cygnsz').click(function() {
		layer.open({
			type : 2,
			area : [ '940px', '572px' ],
			title : [ '常用功能设置' ],
			scrollbar : false,
			id : 'layerCygn' // 防止重复弹出
			,
			content : '/xxmh/html/cygn.html'
		});
	});
	
	//切换用户脚本		
	var iSum;
   
	$(".user-item").on("mouseenter",function(){
		var i=0
		iSum=setInterval(function(){
		if(i>3){
			$(".user-item ul").fadeIn()
			clearInterval(iSum);
		}
		i++	
		},70)
			
	})

	$(".user-item").on("mouseleave",function(){
		$(".user-item ul").fadeOut();
        clearInterval(iSum);
	})
//切换用户脚本结束
	
	//事件绑定结束
	
	/**
	 * 获取切换身份和主管税务机关切换div
	 */
	function getQhsfDiv(){
		$.ajax({
			type:"post",
			url:"/xxmh/html/qhsf.html",
			dataType:"text",
			success:function(data){
				$('body').append(data);
			}
		});
	}
});
