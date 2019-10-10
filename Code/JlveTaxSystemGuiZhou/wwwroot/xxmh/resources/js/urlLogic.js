/**
 * 顶部菜单控制
 */
var contPath="/xxmh";

/**
 * 框架内链接跳转
 * @param url 跳转url
 * @param m1 一级菜单标识
 * @param m2 
 * @param fromWhere 从哪里跳转来的,top 代表从页头菜单跳转过来
 */
var index = 0;

/*
 * 刷新界面，因为72号文,首页没有id=ifrMain,需要特殊处理
 */
function refresh(url,m1,m2,fromWhere,qxkzsx){
    goIndexUrl(url,m1,m2,fromWhere,qxkzsx);
}

function goPage(url,m1,m2,fromWhere,qxkzsx){
	if($("#hid_gnUrl").val() !=null && $("#hid_gnUrl").val() !="" && $("#hid_gnUrl").val() !=url){
		return false;
	}
	
	/*index = layer.load(0,{shade: 0.2});*/
	var ifraMain=document.getElementById("ifrMain");
	var loadingUrl=contPath+"/html/loading.html";
	if(ifraMain){
        ifraMain.src="";
        ifraMain.src=contPath+"/html/loading.html";//更新iframe地址
    }else{
        refresh(loadingUrl,m1,m2,fromWhere,qxkzsx);
    }

	
	if(qxkzsx!=undefined && qxkzsx!="" && qxkzsx!=0 && qxkzsx!='null' && qxkzsx!='undefined'){//需要登录的
		$.post(contPath+"/portalSer/checkLogin.do",{},function(d){
			var isLogin=d.isLogin;
			if(isLogin=="N"){
				layer.msg('未登录或登陆超时，请先登录');
				setTimeout(function(){
					login();
//					window.location.href="index.html";
				},500);
				return;
			}
		});
	}
    if(m1==null){
		window.location.href=url;
		return;
	}else{
		
		var ch=$(".leftmenuul");
		if(ch.find("li").length==0 && url.indexOf("bszm")==-1){//没有子元素，可能是浏览器点了返回
			$("#curM1").val("");//情况，重新获取
		}
		
		menuActive(m1)
		if(m1=="index"){//显示首页
			$("#mainContent").hide();//隐藏次页模块
			$("#indexMain").show();//展示首页
			$("#mainBodyDiv").removeClass("bodybg");//首页不需要这个样式
		}else{
			$("#mainBodyDiv").addClass("bodybg");//需要这个样式
			var curM1=$("#curM1").val();//隐藏的一级菜单标识符
			
			if(url!=null && url.indexOf("bszm")!=-1){//个人桌面直接替换，并且隐藏左侧菜单
				$(".new_index_box").css({"display":""});
				$("#curM1").val(m1);//更新
				$(".left_box").hide();//隐藏左菜单
				$(".right_box").css({"width":"100%"});
				$("#mainBodyDiv").removeClass("bodybg");//不需要这个样式
				url.indexOf("?")!=-1?url+="&t=":url+="?t=";
				url+=(+new Date());//加上时间戳，是为了是静态页面刷新
				setIfrUrl(url);
			}else if(curM1!=m1 && m1!=""){//不相同，需要更新左侧菜单，并更新右侧主体部分
				$(".new_index_box").css({"display":"none"});
				$(".left_menu").empty();
                document.getElementById("ifrMain")?document.getElementById("ifrMain").src="":"";
				
				$("#curM1").val(m1);//更新
				if(url!="" && !url){
					setIfrUrl(url);
				}
				
				//获取子菜单
				//$.get(contPath+"/portalSer/getSubMenus.do?m1="+m1, function(data){
				$.ajax({        		
			  		url : contPath+"/portalSer/getSubMenus.do?m1="+m1,
			  		async : false,
			        data:{},
			   		success:function(data){ 
						var result = eval("("+data+")");
						var html="";
						if(result.flag=="ok"){
							var menuHtml=result.menuHtml;
							var menus=result.menus;
							var gsdjxh=result.gsdjxh;
							var dsdjxh=result.dsdjxh;
							//构造二级菜单html
							var subMenuHtml=makeSubMenusHtml(menus,gsdjxh,dsdjxh);//该方法在portal.js里
							
							$(".left_menu").empty();
							$(".left_menu").html(subMenuHtml);//更新左边菜单内容
							
							//设置菜单事件监听
							setLeftMenuClickListen()
							//更新右边主体部分
							loadMainPage(url,m1,m2,curM1,fromWhere);
							
							//为适合在电子客户端展示，需要做些边距调整
							$(document).ready(function() {
								var dzswjclient=getURLParameter("dzswjclient");
								if(dzswjclient!=undefined && dzswjclient!=null && dzswjclient!=""){
									if(dzswjclient!="bszm"){
										$(".title").css({"padding":"15px 0 15px 0"});
										$(".left_box").css({"padding-left":"10px"});
									}else{
									//	$(".right_box").css({"padding-left":"10px"});
									}
								}
							});
						}else{
						}
			   		}
				});
				$(".left_box").show();
				$(".left_menu").show();
			}else{
				loadMainPage(url,m1,m2,curM1,fromWhere);
			}

			$("#mainContent").show();// 展示次页模块
			$("#indexMain").hide();// 隐藏首页
		}
		
	}
	
	//跳转后回到顶部
	var speed=200;//滑动的速度
	$('body,html').animate({ scrollTop: 0 }, speed);
	/*
	setTimeout(function(){ //延迟执行，如果js或者服务问题，可以在这里取消
		layer.close(index);
	},2000);
*/
	
//	showGuide(m1);
	
	goStatLog(url,m1,m2);
}
		
function goStatLog(url,m1,m2){
	var title="";
	
	var mFlag=getGoUrlMNum(url,m1,m2);//找到要展示url的层级标记
	if(url==""){
		var realUrl="";
		if((!m2 || m2=="") && m1!=null){//代表点了一级菜单，那么寻找第一个子级菜单来展示
			var theAMenu=$(".left_box").find("a[aFlag=hasUrl]").first();
			realUrl=theAMenu.attr('realurl');
		}else{
			realUrl=$(".left_box").find("a[mFlag$='"+mFlag+"']").attr('realurl');//找到该标识符隐藏的真正url地址
		}
	}
	if(m1=="index"){
		title="首页";
	}else if(m1=="bszm"){
		title="办税桌面";
	}else if(m2==undefined || m2==""){
		var titleObj=$("#topMenu").find("li[id$='liM1_"+m1+"']");
		if(titleObj.length>0){
			title=titleObj.text();
		}
	}else{
		var titleObj=$(".left_box").find("a[mFlag$='"+mFlag+"']");
		if(titleObj.length>0){
			title=titleObj.text();
		}
	}
	statLog(url,m1,m2,title);
}

//跳转到新页面后，需要处理子页面展示，左边菜单，右边详细iframe的情况下。
function loadMainPage(url,m1,m2,curM1,fromWhere){
	
	if(m1==""){
		$(".left_box").hide();
		setIfrUrl(url);
	}else{
		var mFlag=getGoUrlMNum(url,m1,m2);//找到要展示url的层级标记
		var realUrl="";
		if((!m2 || m2=="") && m1!=null){//代表点了一级菜单，那么寻找第一个子级菜单来展示
			
			var theAMenu=$(".left_box").find("a[aFlag=hasUrl]").first();
			var realUrl=theAMenu.attr('realurl');
			if(theAMenu.attr('mflag')==='sssxbl'){
				inspectUrl(realUrl,"sxbl","sssxbl","","undefined");
			}else{
				setIfrUrl(realUrl);
			}
			//如果没有三级，则第一个状态更改
			$(".unactive").removeClass("unactive")
			$(".inactive").removeClass("inactive")
			if(m1!='grsxbl'){
				if($(".leftmenuul").find("li").first().find("ul").length<=0){
					if($(".leftmenuul").find("li").find("ul").length<=0){//如果全部都没有三级菜单
						$(".leftmenuul").find("li").addClass("noerj");
					}
					$(".leftmenuul").find("li").first().addClass("unactive");//第一个
					$(".leftmenuul").find("li").first().find("a").addClass("inactive");
				}else{ //有三级,找到三级第一个
					if(m1!="znhd"){//征纳互动除外
						var obj=$(".leftmenuul").find("li").first().find("ul").find("li").first().find("a");
						obj.addClass("sonover");
						obj.parent().show();
						obj.parent().siblings().children("ul").fadeOut();
						
						var realUrl=obj.attr('realurl');
						setIfrUrl(realUrl);
					}
					
				}
			}else{
				setIfrUrl(url);
			}
		}else if(mFlag!=null){
			
			realUrl=$(".left_box").find("a[mFlag$='"+mFlag+"']").attr('realurl');//找到该标识符隐藏的真正url地址
			
			if(realUrl!=null){//找到属性url
				if(url!=null && url!="" && url!=realUrl){
					setIfrUrl(url);
				}else{
					if(mFlag=="dwnsrswdjxxcj"||mFlag=="gtjynsrswdjxxcj"||mFlag=="clfxsxxcj"){//打开新页面
						window.open(realUrl);
					}else{
					setIfrUrl(realUrl);
					}
				}
			}
			
			var p=$(".left_box").find("a[mFlag='"+mFlag+"']").parent().parent();//ul
			
			if(curM1!=m1){//从其他页面，非当前左菜单点击切换，需要重置活动状态
				//至于活动状态
				$(".inactive").removeClass("inactive")
				$(".left_box").find("a[mFlag='"+mFlag+"']").parent().addClass("unactive");
				
				if(p.hasClass("leftmenuul")){//二级
					$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("inactive");
				}else{
					$(".leftmenuul").find("a").removeClass("sonover");
					$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("sonover");
					p.show();
					p.parent().find("a").first().addClass("inactive");
					p.parent().siblings().children("ul").fadeOut()
				}
			}else{
				$(".inactive").removeClass("inactive")
				//$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("inactive");
				//$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("sonover");
			}
			
			if(fromWhere=="other"){
				//$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("inactive");
				$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("sonover");
			}
			
			//从顶部菜单二级菜单进入
			if(fromWhere=="top"){
				
				$(".inactive").removeClass("inactive")
				$(".left_box").find("a[mFlag='"+mFlag+"']").removeClass("noerj");
				$(".left_box").find(".unactive").removeClass("unactive");
				$(".left_box").find("a[mFlag='"+mFlag+"']").parent().addClass("unactive");
				
				if(p.hasClass("leftmenuul")){//二级
					$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("inactive");
					$(".leftmenuul").find("li").addClass("noerj");
				}else{//三级
					$(".leftmenuul").find("a").removeClass("sonover");
					$(".left_box").find("a[mFlag='"+mFlag+"']").addClass("sonover");
					p.show();
					p.parent().find("a").first().addClass("inactive");
					p.parent().siblings().children("ul").fadeOut()
				}
			}
		}
	}
	//左侧菜单的展示隐藏
	doHideLeft(realUrl);
}

/**取得需要被跳转的url要在哪级显示*/
function getGoUrlMNum(url,m1,m2){
	if(m2!=null && m2!=undefined && m2!="") return m2; 
	if(m1!=null && m1!=undefined && m1!="") return m1; 
}

//通过判断地址是否有 isHideLeft参数，来隐藏左边菜单
function doHideLeft(url){
	if(url==null || url=="") return;
	if(url.indexOf('isHideLeft')!=-1){
		$(".left_box").hide();
		//$(".right_box").css({"width":"100%"});
	}else{
		$(".left_box").show();
		$(".left_menu").show();
		//$(".right_box").css({"width":"80%"});
	}
}

function setIframeHeight(id) {
	try {
		var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
		var isIE9More = (! -[1, ] == false);
		var iframe = document.getElementById(id);
		if (iframe.attachEvent) {
			iframe.attachEvent("onload",
			function() {
				var newHeight=iframe.contentWindow.document.documentElement.scrollHeight;
				if(isIE){
					/** IE9以下版本获取高度 */
					if(!isIE9More){
						newHeight=iframe.contentWindow.document.body.scrollHeight;
					}
				}
				if(newHeight<600){
					newHeight="600";
				}else{
					newHeight=newHeight+4;
				}
				$("#"+id).css("height",newHeight);
			});
			return;
		} else {
			iframe.onload = function() {
				var newHeight=iframe.contentDocument.body.scrollHeight;
				if(newHeight<600){
					newHeight="600";
				}else{
					newHeight=newHeight+4;
				}
				$("#"+id).css("height",newHeight);
			};
			return;
		}
	} catch(e) {
		alert(e);
	}
}

function changeHeight(id) {
	try {
		var height=document.body.scrollHeight+4;
		$("#"+id,window.parent.document).css({'height':height});
	} catch(ex) {}
}

//获取url参数值
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function setIfrUrl(url){
    var ifrMain = document.getElementById("ifrMain");
     //TODO 这里需要改成菜单刷新
	 if(url!=null && url.indexOf("/sbqc/")!=-1){ //由于申报清册的页面加载比较慢，导致会出现切换iframe时停留在上一个页面，所以加了延时
	 	setTimeout(function(){
            ifrMain ? ifrMain.src=url : refresh(url);//更新iframe地址
	 	},70);
	 }else{
         ifrMain ? ifrMain.src=url : refresh(url);//更新iframe地址
	 }
	/*layer.close(index);*/
	
	var ifrObj=$("#ifrMain");
	if(url!=null){
		if(url.indexOf("bszm")!=-1){//办税桌面,办税桌面的高度在myCenter.js里设置 ，需要判断是个人还是企业身份后，才设置高度
		}else if(url.indexOf("reg")!=-1){//注册页面
			ifrObj.css("height",950);
		}else if(url.indexOf("yhgl")!=-1){//用户管理
			ifrObj.css("height",950);
		}else if(url.indexOf("/html/bsfw/bsdt.html")!=-1){//办税地图
			ifrObj.css("height",808);
		}if(url.indexOf("/html/bsfw/bszn.html")!=-1
				|| url.indexOf("/html/bsfw/bsdh.html")!=-1
				|| url.indexOf("/html/bsfw/xzzq.html")!=-1
				|| url.indexOf("/html/bsfw/bsyy.html")!=-1
				|| url.indexOf("/html/znhd.html")!=-1
				|| url.indexOf("/html/sxbl.html")!=-1
				){//办税指南,办税地图，通知公告除外
			ifrObj.css("height",600);
		}else if(url.indexOf("/html/bsfw/bsdt.html")!=-1){//办税地图
			ifrObj.css("height",808);
		}else if(url.indexOf("/html/bsfw/bszt.html")!=-1){//办税专题
			ifrObj.css("height",600);
		}else if(url.indexOf("/html/bsfw/tzgg.html")!=-1){//通知通告
			ifrObj.css("height",700);
		}else{//其他
			ifrObj.css("height",950);
		}
	}
	else{
		ifrObj.css("height",950);
	}
}

//弹窗打开,公用的方法，请不要随便修改
function openWindowByLayer(url){
	layer.open({
	  type: 2,
	  title: '详细页面',
	  /*shadeClose: true,*/ //点击阴影处也关闭
	  maxmin: true, //开启最大化最小化按钮
	  shade: 0.1,
	  area: ['90%', '90%'],
	  content: url //iframe的url
	}); 
}
function inspectUrl(url,m1,m2,fromWhere,qxkzsx){
	$.ajax({
				type : "post",
				url : "/zlpz-cjpt-web/wddz/judgeExistWddz.do?gdslxDm=3",
				dataType : "json",
				async : false,
				success : function(data) {
					if(data==null||data.flag==='N'){
						goPage(url,m1,m2,fromWhere,qxkzsx);
					}else if (data.flag==='Y'){
						layer.confirm("您还未维护地址信息，请先录入!", {
							icon : 7,
							btn: ['确定'],
							title : '提示'
						}, function(index) {
							layer.close(index);
							$("a[mflag='dzzlgl']").click();
							$("a[mflag='wddzgl']").click();
						});
					}
				},
				error : function() {
				}
			});
}


//获取session数据，回调给客户端
function getSession_gz(arg){
    //console.log(arg);
    var url = contPath+"/portalSer/getSession_gz.do";
    $.ajax({url : url,
        type : "post",
        success:function(data){
            data =JSON.parse(data);
            var success_session =JSON.stringify(data)
            //	console.log(success_session);
            window.external.InvokeService("OmniContainer", arg, success_session);
        },
        error: function(){
            console.log("error_session");
        }
    });
}

$(document).ready(function(){

    if(Hide_Suspend=="Hide_Suspend_GZ"){
        if("NotifyChagneQY"==NotifyChagneQY){
            NotifyChagneQY ="";
            getSession_gz("NotifyChagneQY");
        }else{
            getSession_gz("NotifyLogined");
        }
    }
});

function getHide_Suspend(Hide_Suspendcookie){
    var results = document.cookie.match('(^|;) ?' + "Hide_Suspend" + '=([^;]*)(;|$)');
    if (results)
        return results[2];
    else
        return null;
}

