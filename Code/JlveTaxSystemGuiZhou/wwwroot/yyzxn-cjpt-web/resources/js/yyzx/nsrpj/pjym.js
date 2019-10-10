
$(document).ready(function(){
	$(".simpleAlertBtn.simpleAlertBtn0").click(function() {
		$("#mypl2").hide();
	})
});


//评分....

window.onload = function (){
	var oStar = document.getElementById("star");
	var aLi = oStar.getElementsByTagName("li");
	var oUl = oStar.getElementsByTagName("ul")[0];
	var oSpan = oStar.getElementsByTagName("span")[1];
	var oP = oStar.getElementsByTagName("p")[0];
	var i = iScore = iStar = 0;
	var aMsg = [

				"很不满意| 很不满意",

				"不满意| 不满意",

				"一般| 一般",

				"满意| 满意",

				"非常满意| 非常满意"

				]

	for (i = 1; i <= aLi.length; i++){
		aLi[i - 1].index = i;
		//鼠标移过显示分数
		aLi[i - 1].onmouseover = function (){
			fnPoint(this.index);
			//浮动层显示
			oP.style.display = "block";
            oP.style.zIndex = 99;
			//计算浮动层位置
			oP.style.left = oUl.offsetLeft + this.index * this.offsetWidth - 82 + "px";
			//匹配浮动层文字内容
			oP.innerHTML = "<em><b>" + this.index + "</b> 分 " + aMsg[this.index - 1].match(/(.+)\|/)[1] + "</em>"
		};		
		//鼠标离开后恢复上次评分
		aLi[i - 1].onmouseout = function (){
			fnPoint();
			//关闭浮动层
			oP.style.display = "none"
		};		
		//点击后进行评分处理
		aLi[i - 1].onclick = function (){
			iStar = this.index;
			oP.style.display = "none";
			oSpan.innerHTML = "<strong>" + (this.index) + " 分</strong> (" + aMsg[this.index - 1].match(/\|(.+)/)[1] + ")"
		}
	}	
	//评分处理
	function fnPoint(iArg){
		//分数赋值
		iScore = iArg || iStar;
		for (i = 0; i < aLi.length; i++) aLi[i].className = i < iScore ? "on" : "";	
	}	
};
	
/**
 * 提交评分
 */
/*var pjid = '';*/
function tjpf(){
	//评分  1,2,3,4,5 分
	var myd = $("#star .on").length;
	var pjnr = $("#textarea").val();
	if(myd < 1){
		layer.msg("请先评分!!!", {icon:0,time:1500});
	}else if((myd <= 3 || myd <= 2 || myd <= 1)&& pjnr.trim().length<1){
		layer.msg("星级评价少于3星,请留下您宝贵的意见!!", {icon:0,time:2500});
	}else {
		var type = '';//自由业务
		var id = '';//自由业务
		var rt_biz = '';
		var jsonConfig = top.jsonConfig;
		if(typeof(jsonConfig) == 'object' && jsonConfig.rt_biz != undefined && jsonConfig.rt_biz != ''){
			rt_biz = jsonConfig.rt_biz;
			
			type = jsonConfig.type;//自由业务:ZYYW
			id = jsonConfig.id;//自由业务:ZYYW-XQGL;ZYYW-TSJJ
		}
		var swsxDm = parent.swsxDm;
		var pjnr = $("#textarea").val();
		var queryString = parent.queryString;
		$.ajax({
			type:'post',
			url:'/yyzxn-cjpt-web/nsrpj/add.do',
			timeout : 2500, //超时时间设置，单位毫秒
			data:{
				/*pjid:pjid,*/
				'rt_biz' : rt_biz,
				'pjnr' : pjnr,
				'myd' : myd,
				'queryString' : queryString,
				'type':type,
				'id':id
			},
			success:function(data){
				pjcg();
				//自由业务ZR
				if(typeof queryString == "undefinded" || queryString == "" || queryString == null){
					parent.zyywnsrpj();
				}
			},
			error:function(req, status, err){
				pjcg();
			}
		})
	}
}	

/**
 * 评价成功后的操作
 */
function pjcg(){
	$("#mypl2 .msc_tzgg").remove();
	/*感谢评价，改为用layer弹出*/
	layer.msg("感谢评价 !", {icon: 6,time:2000});
	$("#mypl2").css('left', '0px');
	
	
}

	
	
	