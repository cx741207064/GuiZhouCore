$(document).ready(
		function() {
			// -----------------总控页面宽度--------------------------------

			var winwidth = $(window).width()
			if (winwidth < 1240) {
				$(".juz").css({
					width : 1000
				})
			}
			// -------------------界面所有左菜单------------------------------
			// var
			// imgurl2=$(".leftmenuul>li").eq(0).children("a").children("img").attr("alt")
			$(".leftmenuul>li").eq(0).children("ul").slideDown()
			$(".leftmenuul>li").eq(0).children("a").addClass("inactive")
					.children("img")// .attr("src",'../images/icons/icons/'+imgurl2+'.png')

			$(".leftmenuul>li>a").on(
					"click",
					function() {
						// var imgurl=$(this).children("img").attr("alt")
						// $(".leftmenuul>li>a").children("img").attr("src",'../images/icons/'+imgurl+'.png')
						// $(this).children("img").attr("src",'../images/icons/icons/'+imgurl+'.png')

						$(".unactive").removeClass(".unactive").addClass(
								"noerj")
						$(this).toggleClass("inactive")
						$(this).next("ul").slideToggle().parent("li")
								.siblings().children("ul").slideUp()
						$(this).parent("li").siblings().children("a")
								.removeClass("inactive")
					})
			$(".leftmenuul>li>ul>li>a").on(
					"click",
					function() {// mouseover
						$(".unactive").removeClass("unactive")
								.addClass("noerj")
						$(this).addClass("sonover")
						$(this).next("div").fadeIn().parent("li").siblings()
								.children("div").fadeOut()
						$(this).parent("li").siblings().children("div")
								.fadeOut()
						$(this).parent("li").siblings().children("a")
								.removeClass("sonover")
					})
			$(".noerj").on("click", function() {
				$(".noerj").removeClass("unactive").addClass("noerj")
				$(this).removeClass("noerj").addClass("unactive")
				$(".sonover").removeClass("sonover")
			})

			$(".leftmenuul>li>ul>li>div").on('mouseleave', function() {
				// $(this).prev().removeClass("sonover")
				$(this).css({
					"display" : "none"
				})
			})
			$(".leftmenu_sondiv li>a").on('click', function() {
				$(this).parent().parent().parent("div").fadeOut()
			})// 左侧菜单效果结束

			// 更多操作按钮---------------------------------

			$(".btn_more").mouseover(function() {
				$(".btn_more ul").fadeIn()
			})

			$(".btn_more").mouseleave(function() {
				$(".btn_more ul").fadeOut(100)
			})

			$(".btn_more li a").click(function() {
				$(".btn_more ul").fadeOut(100)
			})

			// 内容TABS----------------------------------------
			$(".tabs_01 li").click(function() {
				var indexdq = $(this).index()
				$(this).addClass("active").siblings().removeClass()
				$(".show01").children().eq(indexdq).show().siblings().hide()
			})

		});

// 设置菜单监听
function setLeftMenuClickListen() {
	// -------------------界面所有左菜单------------------------------
	// var
	// imgurl2=$(".leftmenuul>li").eq(0).children("a").children("img").attr("alt")
	$(".leftmenuul>li").eq(0).children("ul").slideDown()
	$(".leftmenuul>li").eq(0).children("a").addClass("inactive")
			.children("img")// .attr("src",'../images/icons/icons/'+imgurl2+'.png')

	$(".leftmenuul>li>a").on(
			"click",
			function() {

				var target = $(this).attr("target");
				if (undefined != target && "_blank" == target)
					return;

				// var imgurl=$(this).children("img").attr("alt")
				// $(".leftmenuul>li>a").children("img").attr("src",'../images/icons/'+imgurl+'.png')
				// $(this).children("img").attr("src",'../images/icons/icons/'+imgurl+'.png')

				$(".unactive").removeClass(".unactive").addClass("noerj")
				$(this).toggleClass("inactive")
				$(this).next("ul").slideToggle().parent("li").siblings()
						.children("ul").slideUp()
				$(this).parent("li").siblings().children("a").removeClass(
						"inactive")
			})
	$(".leftmenuul>li>ul>li>a").on(
			"click",
			function() {// mouseover

				var target = $(this).attr("target");
				if (undefined != target && "_blank" == target)
					return;

				$(".unactive").removeClass("unactive").addClass("noerj")
				$(".leftmenuul>li>ul>li>ul>li>a").removeClass("sonover")
				$(this).addClass("sonover")
				$(this).next("div").fadeIn().parent("li").siblings().children(
						"div").fadeOut()
				$(this).parent("li").siblings().children("div").fadeOut()
				$(this).parent("li").siblings().children("a").removeClass(
						"sonover")

			})
	$(".noerj").on("click", function() {
		var target = $(this).children("a").attr("target");
		if (undefined != target && "_blank" == target)
			return;
		$(".noerj").removeClass("unactive").addClass("noerj")
		$(this).removeClass("noerj").addClass("unactive")
		$(".sonover").removeClass("sonover")
	})

	$(".leftmenuul>li>ul>li>div").on('mouseleave', function() {
		// $(this).prev().removeClass("sonover")
		$(this).css({
			"display" : "none"
		})
	})
	$(".leftmenu_sondiv li>a").on('click', function() {
		$(this).parent().parent().parent("div").fadeOut()
	})// 左侧菜单效果结束

	// 四级菜单
	$(".css").on(
			"click",
			function() {
				$(".css").removeClass("sonover")
				$(this).toggleClass("inactive")
				$(this).next("ul").slideToggle().parent("li").siblings()
						.children("ul").slideUp()
				$(this).parent("li").siblings().children("a").removeClass(
						"inactive")
			})
	$(".leftmenuul>li>ul>li>ul>li>a").on(
			"click",
			function() {// mouseover
				$(".unactive").removeClass("unactive").addClass("noerj")
				$(this).addClass("sonover")
				$(".leftmenuul>li>ul>li>a").removeClass("sonover")
				$(this).next("div").fadeIn().parent("li").siblings().children(
						"div").fadeOut()
				$(this).parent("li").siblings().children("div").fadeOut()
				$(this).parent("li").siblings().children("a").removeClass(
						"sonover")
			})
	$(".noerj").on("click", function() {
		$(".noerj").removeClass("unactive").addClass("noerj")
		$(this).removeClass("noerj").addClass("unactive")
		$(".sonover").removeClass("sonover")
	})

	$(".leftmenuul>li>ul>li>div").on('mouseleave', function() {
		$(this).css({
			"display" : "none"
		})
	})
	$(".leftmenu_sondiv li>a").on('click', function() {
		$(this).parent().parent().parent("div").fadeOut()
	})// 左侧菜单效果结束
}