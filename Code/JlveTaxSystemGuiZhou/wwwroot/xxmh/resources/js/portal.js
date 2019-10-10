/**
 * 
 */

var contPath="/xxmh";
var showGdsbz = "";//是否显示国地税标志 若非Y或N则保持原样
var Hide_Suspend =  "";
//TODO 登录后初始化是否有用户管理权限，全局变量 
//切换身份后同步是否用户管理权限
var hasYhgl = "N";

function changeCard(){
	var d;
	//等待提示
    var index = layer.load(2,{shade: 0.2});
	$.post(contPath+"/userInfoController/getNsrQysqVos.do",{},function(d){
		layer.close(index);
		if(d.flag == "error"){
			layer.alert(d.errMsg, {title:"提示",icon: 5});
		}else if(d.flag=="fail"){
			//询问框
			layer.confirm('用户登录超时？', {
				btn: ['重新登录','取消'] //按钮
			}, function(){
				login();
			}, function(){
				window.location.href="index.html";
			});
		}else{
			if(d.nsrQysqVos && d.nsrQysqVos.length > 0){
				showNsrs(d.nsrQysqVos,d.qybdid,d.isZrrsfJr,d.yhm,d.zjhm,d.zjlx,d.zjyxq,d.zrrs);
			}else if (d.zrrs && d.zrrs.length >0){
				showNsrs(d.nsrQysqVos,d.qybdid,d.isZrrsfJr,d.yhm,d.zjhm,d.zjlx,d.zjyxq,d.zrrs)
			} else {
				layer.alert("您尚未绑定任何企业身份", {title:"提示",icon: 5});
			}
		}
	});
}

var qhsfIndex=0;//layerindex
//切换身份时，展示企业用户选择
function showNsrs(nsrQysqVos,qybdid,isZrrsfJr,yhm,zjhm,zjlx,zjyxq,zrrs){
    $("#nsrzt").empty();
	//封装html
	if(nsrQysqVos && nsrQysqVos.length < 1 )
        var m='<div class="grbs-notice font-weak">'+
            '<i class="iconfont fsicon-tanhao "></i> 暂无企业，请先绑定企业'+
            '</div>';
    $("#qysfTitle").html(m);

    for(var i in nsrQysqVos){
        var active="", nsrztHtml ="";
        if(qybdid=="" && isZrrsfJr=="N"){
            active=(i==0?'this':'');//this
        }else{
            active=(nsrQysqVos[i].qybdid==qybdid?'this':'');
        }
        if(nsrQysqVos[i].dsnsrsbh!=null&&nsrQysqVos[i].dsnsrsbh!=""&&typeof(nsrQysqVos[i].dsnsrsbh)!="undefined"&&nsrQysqVos[i].gsnsrsbh!=null&&nsrQysqVos[i].gsnsrsbh!=""&&typeof(nsrQysqVos[i].gsnsrsbh)!="undefined"){
            nsrztHtml = '<li class="'+(i==0?'this':'')+'" qybdid='+nsrQysqVos[i].qybdid+'>'+nsrQysqVos[i].nsrmc+'（'+nsrQysqVos[i].zzNsrmc+'-'+nsrQysqVos[i].yhsfmc+'）  </li>';
        }else if(nsrQysqVos[i].gsnsrsbh!=null&&nsrQysqVos[i].gsnsrsbh!=""&&typeof(nsrQysqVos[i].gsnsrsbh)!="undefined"){
            nsrztHtml = '<li class="'+(i==0?'this':'')+'" qybdid='+nsrQysqVos[i].qybdid+'>'+nsrQysqVos[i].nsrmc+'（'+nsrQysqVos[i].nsrmc+'-'+nsrQysqVos[i].yhsfmc+'）  </li>';
        }else if(nsrQysqVos[i].dsnsrsbh!=null&&nsrQysqVos[i].dsnsrsbh!=""&&typeof(nsrQysqVos[i].dsnsrsbh)!="undefined"){
            nsrztHtml = '<li class="'+(i==0?'this':'')+'" qybdid='+nsrQysqVos[i].qybdid+'>'+nsrQysqVos[i].dsNsrmc+'（'+nsrQysqVos[i].dsNsrmc+'-'+nsrQysqVos[i].yhsfmc+'）  </li>';
        }
		$("#nsrzt").append(nsrztHtml);	
	}
	
	/*if(null==zjhm||""==zjhm||"undefined"==zjhm){
		$("#smzTitle").show();
		$("#addSmz").show();
		$("#smzxx").hide();
		$("#selectZrrs").hide();
	}else{
		$("#qhsf_yhmc").html("用户名称："+yhm);
		$("#qhsf_zjlx").html("用户类型："+zjlx);
		$("#qhsf_zjhm").html("证件号码："+zjhm);
		if(undefined != zjyxq && "" != zjyxq){
			$("#qhsf_zjyxq").html("证件有效期："+zjyxq);
		}
		$("#smzTitle").hide();
		$("#addSmz").hide();
		$("#smzxx").show();
	}*/
	
	if ('' != zrrs && typeof(zrrs) != "undefined" && null != zrrs) {
		if (zrrs.length == 1){
			$("#addSmz").remove();
			$("#smzTitle").remove();
			$("#selectZrrs").hide();
			$("#qhsf_yhmc").html("用户姓名："+yhm);
			$("#qhsf_zjlx").html("证件类型："+zjlx);
			$("#qhsf_zjhm").html("证件号码："+(zjhm?zjhm:''));
			$("#qhsf_zjyxq").html("证件有效期："+(zjyxq?zjyxq:''));
		} else {
			showZrrs(zrrs);
		}
		
	} else if(null==zjhm||""==zjhm||"undefined"==zjhm) {//还没有实名制申请
		$("#smzTitle").show();
		$("#addSmz").show();
		$("#smzxx").hide();
		$("#selectZrrs").hide();
	} else {
		$("#addSmz").remove();
		$("#selectZrrs").hide();
		$("#smzTitle").remove();
		$("#qhsf_yhmc").html("用户姓名："+yhm);
		$("#qhsf_zjlx").html("证件类型："+zjlx);
		$("#qhsf_zjhm").html("证件号码："+(zjhm?zjhm:''));
		$("#qhsf_zjyxq").html("证件有效期："+(zjyxq?zjyxq:''));
		
		/* $("#smzTitle").remove();
		$("#addSmz").remove();
		$("#smzxx").hide(); */
	}
	
	
    if(isZrrsfJr=="Y"){//选中自然人
        $("#zrrsList").addClass("hover");
    }else{
        $("#zrrsList").removeClass("hover");
    }
	
    $("#nsrzt li,#zrrsList li").click(function(){
        $(this).addClass("this").siblings().removeClass("this")
        $("#zrrsList").removeClass("hover");
	})
	
	
	
	$("#seachQy").live("click",function(){
	if(qykeywords!=""){
		$("#nsrzt li").show().each(function(){
			var text=$(this).text();
			if(text.search(qykeywords)==-1){
			$(this).hide();
			}
		})
            $("#nsrzt li").parent().children(".this").removeClass("this");
            $("#nsrzt li").parent().children(":visible").first().addClass("this");
	}else{
		$("#nsrzt li").show()
	}
	
	});
	
    qhsfIndex=layer.open({
        type: 1, //弹窗
        closeBtn: 1, //显示关闭按钮
        shift: 0, //动画效果
        area: ['900px'],
        title:"办税身份选择",
        content: $("#chooseNsr")
    });

}


/**
 * 展示自然人信息
 */
function showZrrs(zrrs){

	var zrrHtml = new Array();
	for (var i in zrrs) {
		
		if (zrrs[i]!=null && zrrs[i].xm != null && zrrs[i].xm != "" && typeof(zrrs[i].xm) != "undefined") {
            zrrHtml.push('<li class="'+(i==0?'this':'')+'" zrrDjxh='+zrrs[i].djxh+'>姓名：'+zrrs[i].xm+'（证件号码：'+zrrs[i].sfzjhm+ '）  </li>');
		}
	}
	var searchHtml = new Array();
    searchHtml.push("请选择个人身份");
    searchHtml.push("<input type=\"text\" id=\"grkeywords\" placeholder=\"请输入关键词\" name=\"grkeywords\" class=\"search-input\"> >");
    searchHtml.push("<a id=\"seachGr\" href=\"#\">查询</a>");

	$("#grsfTitle").html(searchHtml.join(""));
	$("#smzTitle").remove();
	$("#addSmz").remove();
	$("#smzxx").remove();
	$("#zrrsList").html(zrrHtml.join(''));
	
	$("#seachGr").live("click",function() {
		var grkeywords = "";
	   	grkeywords = $("#grkeywords").val();
		if (grkeywords != "") {
			$("#zrrsList li").show().each(function() {
				var text = $(this).text();
				if(text.search(grkeywords) == -1) {
					$(this).hide();
				}
			})
            $("#zrrsList").children(".this").removeClass("this");
            $("#zrrsList").children(":visible").first().addClass("this");
		}else{
			$("#zrrsList li").show();
		} 
	});
}

//获取搜索关键字
var qykeywords="";
function getValue(value){
	qykeywords=value;
}




//切换身份时，选择企业进入
function selectQy(){
	
	var qybdid=$("#nsrzt").find("li.this").attr("qybdid");
	if(!qybdid){
		layer.alert("请先选择企业!", {title:"提示",icon: 5});
		//layer.close(qhsfIndex);//关闭弹出框
		return;
	}
    var index = layer.load(2,{shade: 0.2});
	$.post(contPath+"/userInfoController/changeQySf.do",{"qybdid":qybdid},function(d){
		layer.close(index);
		if(d.flag == "error"){
			layer.alert(d.errMsg, {title:"提示",icon: 5});
			layer.close(qhsfIndex);//关闭弹出框
		}else{
        	cleanSessionStorageCache();
			if(null != Hide_Suspend && Hide_Suspend != "" && typeof Hide_Suspend != "undefined"){
				try{ 
					//window.external.InvokeService("OmniContainer", "NotifyChagneQY", JSON.stringify(str));
					invokeServiceWithSessionInfo("NotifyChagneQY");
				} 
				catch (e){ 
				}
			}
			//window.location.href = "index.html?bszmFrom=1";
			layer.close(qhsfIndex);//关闭弹出框
			zztsfqh();
            //goPage('../page/bszm.html?type=qhsf','bszm','','','1');//不刷新整个页面，为了兼容切换身份时，通知外围系统
            goUrl('/xxmh/html/index_login.html?isChangesf=true','1');


            var ssoServerAddr=$("#ssoServerAddr").val();
            document.getElementById("qhsfIfrm").src=ssoServerAddr+"/auth/noticeChangeSf.do?t="+(new Date()).getTime();//切换身份后，通知外围系统
        }
    });
}
//切换身份时，选择以个人身份进入
function grsfjr(){
	var length = $("#zrrsList").find("li").length;
    var zrrDjxh = '';
    if (length > 0) {
		zrrDjxh = $("#zrrsList").find("li.this").attr("zrrdjxh");
        if (typeof(zrrDjxh) == "undefined" || null == zrrDjxh || '' == zrrDjxh || zrrDjxh=="undefined") {
            return;
        }
    }
	var index = layer.confirm('您确定以个人身份直接进入系统吗？', {
		  icon: 3,
		  title:"提示",
		  btn: ['是','否'] //按钮
		}, function(){
			$.post(contPath+"/userInfoController/changeGrSf.do",{zztId:"",djxh:zrrDjxh},function(d){
        	cleanSessionStorageCache();
				if(null != Hide_Suspend && Hide_Suspend != "" && typeof Hide_Suspend != "undefined"){
					try{ 
						window.external.InvokeService("OmniContainer", "NotifyChagneGR", JSON.stringify(str));
						invokeServiceWithSessionInfo("NotifyChagneGR");
					} 
					catch (e){ 
					}
				}
				$("#yhqymc").html("");
				$("#zztsfqhBtn").hide();
				layer.close(index);//关闭弹出框
				layer.close(qhsfIndex);//关闭弹出框
            //goPage('../page/bszm.html?type=qhsf','bszm','','','1');//不刷新整个页面，为了兼容切换身份时，通知外围系统
            goUrl('/xxmh/html/index_login.html?isChangesf=true','1');

            var ssoServerAddr=$("#ssoServerAddr").val();
            document.getElementById("qhsfIfrm").src=ssoServerAddr+"/auth/noticeChangeSf.do?t="+(new Date()).getTime();//切换身份后，通知外围系统
        });
        //window.location.href = "index.html?bszmFrom=1";
    }, function(){
        layer.close(index);
    });
}

//------------子主体身份切换start-------------
var zztsfIndex=0;
function zztsfqh(){
	var chr;
	if (arguments.length == 1) {
		chr = arguments[0];
	}
	var d;
	//等待提示
    var index = layer.load(2,{shade: 0.2});

	$.post(contPath+"/userInfoController/getZztList.do",{},function(d){
		layer.close(index);
		if(d.flag == "error"){
			layer.alert(d.errMsg, {title:"提示",icon: 5});
		}else if(d.flag=="fail"){
			//询问框
			layer.confirm('用户登录超时？', {
				btn: ['重新登录','取消'] //按钮
			}, function(){
				login();
			}, function(){
				window.location.href="index.html";
			});
		}else{
			if(d.isZrrsfJr=="N"){
				if(d.zztList && d.zztList.length > 0){
					if(chr) {
						showZztsfqhDialog(d.zztList,d.gsDjxh,d.dsDjxh,chr);
					} else {
						showZztsfqhDialog(d.zztList,d.gsDjxh,d.dsDjxh);
					}
				}else{
					if(chr) {
						layer.alert("您尚未绑定任何主管税务机关，将无法正常办理涉税业务！", {title:"提示",icon: 5});
					} else {
                    	layer.alert("不需要选择主管税务机关!", {title:"提示",icon: 6});
					}
				}
			}
		}
	});
}

//展示子主体身份切换div
function showZztsfqhDialog(zztList,gsDjxh,dsDjxh){
    $("#zztIdUL").empty();
	var chr;
	if (arguments.length == 4) {
		chr = arguments[3];
	}
	if(typeof chr != 'undefined')chr = eval(chr.toLowerCase());
	
	var gsDjxh=gsDjxh;
	var dsDjxh=dsDjxh;
	var gdsDjxh=gsDjxh+","+dsDjxh;	
	//封装html
	//if(zztList && zztList.length < 1 ) $("#qysfTitle").text("暂无企业，请先绑定企业");
	for(var i in zztList){
		var djxh=zztList[i].djxh;
		var gdsbz=zztList[i].gdsbz;
		var hover="";
		var gdskqccsztdjbz = zztList[i].gdskqccsztdjbz;
		if(gdskqccsztdjbz == "Y"){
			gdskqccsztdjbz = "是";
		}else{
			gdskqccsztdjbz = "否";
		}
		
		var gdswcjyhdssglzmbh = zztList[i].gdswcjyhdssglzmbh;
		if(typeof(gdswcjyhdssglzmbh) == "undefined"|| gdswcjyhdssglzmbh == null || gdswcjyhdssglzmbh==""){
			gdswcjyhdssglzmbh = "";
		}
		var kzztdjlxName = zztList[i].kzztdjlxName;
		if(typeof(kzztdjlxName) == "undefined"|| kzztdjlxName == null || kzztdjlxName == ""){
			kzztdjlxName = "";
		}
		

        var html = '<tr>'
            +'<td>'
            +'<div class="layui-form-item ">'
            +'<div class="layui-form-item ">'
            +'<input type="radio" id="radio'+i+'" name="radio" lay-skin="primary" value="'+djxh+'">'
            +'<input type="hidden" id="GDSBZ'+i+'" name="GDSBZ" value="'+gdsbz+'" />'
            +'</div>'
            +'</div>'
            +'</td>'
            +'<td >'+zztList[i].zgswjgName+'</td>'
            +'<td>'+kzztdjlxName+'</td>'
            +'<td>'+gdskqccsztdjbz+'</td>'
            +'<td>'+gdswcjyhdssglzmbh+'</td>'
            +'<td></td>'
            +'</tr>';
		$("#closeNsrzztLayer").show();//当用户点击身份切换按钮时，可以选择关闭按钮
		if(chr) {
            html = '<tr>'
                +'<td>'
                +'<div class="layui-form-item ">'
                +'<div class="layui-form-item ">'
                +'<input type="radio" id="radio'+i+'" name="radio" lay-skin="primary" value="'+djxh+'" checked="">'
                +'<input type="hidden" id="GDSBZ'+i+'" name="GDSBZ" value="'+gdsbz+'" />'
                +'<input type="hidden" id="szmr'+i+'" name="SZMR" value="'+chr+'" />'
                +'</div>'
                +'</div>'
                +'</td>'
                +'<td>'+zztList[i].zgswjgName+'</td>'
                +'<td>'+kzztdjlxName+'</td>'
                +'<td>'+gdskqccsztdjbz+'</td>'
                +'<td>'+gdswcjyhdssglzmbh+'</td>'
                +'<td><input class=\"btn btn01\" type=\"button\" onclick=\"javascript:window.xzZztsf(this);\" value=\"设为默认\" title="纳税主体未确定，设为默认可绑定纳税主体"</td>'
                +'</tr>';
			$("#closeNsrzztLayer").hide();//当用户初次登录时，关闭按钮没有作用，不显示
		}
		
		$("#zztIdUL").append(html);
		if(djxh==gsDjxh||djxh==dsDjxh||djxh==gdsDjxh){
			$("input[name='radio'][value='"+djxh+"']").attr("checked",true);
		}
	}
    layformRender();//刷新form样式
//	var html = $("#zztsfqhDiv").html();
//	$("#zztIdUL").empty();
    zztsfIndex=layer.open({
        type: 1, //弹窗
        closeBtn: 1, //close关闭按钮
        shift: 0, //动画效果
        area: ['900px','400px'],
        title:"主管税务机关选择",
        btn: ['确定', '关闭'],
        content: $("#zztsfqhDiv"),
        yes: function(){
            xzZztsf();
        },
        btn2: function(index, layero){
            closeZztDialog();
        },
        success:function(){
            
        }
    });

}
var zgswjgkeywords="";
function getZgswjgValue(value){
	zgswjgkeywords=value;
};

function seachZgswjg(){
	
	if(zgswjgkeywords!=""){
        $("#zztIdUL tr").show().each(function(){
			var text=$(this).children("td:eq(1)").text();
			if(text.search(zgswjgkeywords)==-1){
				$(this).hide();
			}
		})
        $("#zztIdUL :radio").attr("checked",false);
	}else{
        $("#zztIdUL tr").show()
	}
}
//选择了子主体身份
function xzZztsf(){
	var djxh = null;
	var GDSBZ = null;
	var gdsbz = null;
	var szmr = false;
	if(arguments.length == 1) {
		var _doc = arguments[0];
		djxh = $(_doc).parent().parent().find("input[type='radio']").val();
		gdsbz = $(_doc).parent().parent().find("input[name$=GDSBZ]").val();
		szmr = $(_doc).parent().parent().find("input[name$=SZMR]").val();
	} else {
		var obj = document.getElementsByName("radio");
		for (var i=0;i<obj.length;i++){ //遍历Radio 
			if(obj[i].checked){ 
				djxh = obj[i].value; 
				GDSBZ = document.getElementById("GDSBZ"+i);
				gdsbz = GDSBZ.value;
                break;
			}
		}
	}
	if(!djxh){
		layer.alert("请先选择主管税务机关!", {title:"提示",icon: 5});
		return;
	}
    var index = layer.load(2,{shade: 0.2});
	$.post(contPath+"/userInfoController/changeZztSf.do",{djxh:djxh,gdsbz:gdsbz,szmr:szmr},function(d){
		layer.close(index);
		if(d.flag == "error"){
			layer.alert(d.errMsg, {title:"提示",icon: 5});
			layer.close(zztsfIndex);//关闭弹出框
		}else{
        	cleanSessionStorageCache();
			layer.close(zztsfIndex);//关闭弹出框
			getMenu();	//更新菜单
			$("#yhqymc").html("企业名称："+d.yhqymc);
            //goPage('../page/bszm.html','bszm','','','1');//不刷新整个页面，为了兼容切换身份时，通知外围系统
            goUrl('/xxmh/html/index_login.html?isChangesf=true','1');
            var ssoServerAddr=$("#ssoServerAddr").val();
			document.getElementById("qhsfIfrm").src=ssoServerAddr+"/auth/noticeChangeSf.do?t="+(new Date()).getTime();//切换身份后，通知外围系统
		}
	});
}

//返回联合业务
function fhlhyw(){
    var index = layer.load(2,{shade: 0.2});
	$.post(contPath+"/userInfoController/resetQySf.do",{1:1},function(d){
		layer.close(index);
		if(d.flag == "error"){
			layer.alert(d.errMsg, {title:"提示",icon: 5});
			layer.close(zztsfIndex);//关闭弹出框
		}else{
			layer.close(zztsfIndex);//关闭弹出框
            //goPage('../page/bszm.html','bszm','','','1');//不刷新整个页面，为了兼容切换身份时，通知外围系统
            goUrl('/xxmh/html/index_login.html?isChangesf=true','1');
            var ssoServerAddr=$("#ssoServerAddr").val();
            document.getElementById("qhsfIfrm").src=ssoServerAddr+"/auth/noticeChangeSf.do?t="+(new Date()).getTime();//切换身份后，通知外围系统
        }
    });
}

//关闭子主体窗口
function closeZztDialog(){
	/*if(arguments.length == 1) {
		var sfxzNsrzzt = false;
		var obj = document.getElementsByName("radio");
		for (var i=0;i<obj.length;i++){ //遍历Radio 
			if(obj[i].checked){ 
				sfxzNsrzzt = true;
				break;
			}
		}
		if(sfxzNsrzzt){
			xzZztsf();
		} else {
			layer.alert("请先选择主管税务机关!", {title:"提示",icon: 5});
			return;
		}
	} else {
		layer.close(zztsfIndex);//关闭弹出框
	}*/
	layer.close(zztsfIndex);//关闭弹出框
}
//------------子主体身份切换end-------------

//注销登录
function logout(){
	cleanSessionStorageCache();
	//如果是客户端，通知退出登录
	try{
		if(null != Hide_Suspend && Hide_Suspend != "" && typeof Hide_Suspend != "undefined"){
			//window.external.InvokeService("OmniContainer", "NotifyLogout", "");
			invokeServiceWithSessionInfo("NotifyLogout");
		}
	}catch (e){}
	var logoutUrl=$("#logoutUrl").val();
	top.window.location.href=logoutUrl;//"/sso/logout?service="+encodeURIComponent(indexUrl);
}

//跳转到登录页面
function login(){
	//window.location.origin 兼容IE8
	cleanSessionStorageCache();
	if (window["context"] == undefined) {
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        window["context"] = location.origin + "/V6.0";
    }
    var ssoXxmhUrl=$("#ssoXxmhUrl").val();
    if(typeof(ssoXxmhUrl) =="undefined" || ssoXxmhUrl == "" ){
        window.location.href.split(".")[0].split("//")[1];
        var ssoXxmhUrl = "/sso/login?service=" + window.document.location.origin + "/xxmh/html/index_login.html?t="+(+new Date());
    }

	window.location.href = ssoXxmhUrl; //登录页面需要判断是否已经登录，否则进入单点登录页面
}

//注册
function reg(){
	$("#mainContent").show();//展示次页模块
	$("#indexMain").hide();//隐藏首页
	$(".left_menu").hide();
	$(".right_box").css({"width":"100%"});
	
	$("*[name='logTip3']").show();
	$("*[name='logTip1']").hide();
	$("*[name='logTip2']").hide();
	$("*[name='logTip4']").hide();
	
	$("#ifrMain").css("height",1000);
	document.getElementById("ifrMain").src=contPath+"/html/reg.html";//更新iframe地址
}

var zhjAlertIndex=0;
//证件号码为空时，展示提示
function showAlertWhenZjhIsNull(zjh){
	if(zjh==null || zjh==""){//证件号码为空，则提醒用户完善个人信息，点击确定，进入个人信息修改页面
		var alerthtml="<div class=\"tc_nav\" style='padding: 25px 40px 30px 40px;'>"
            +"<div style=\"height:60px; line-height:60px; text-align:center;\">未绑定个人身份，不能办理个人业务，请点击确定按钮进行绑定。</div>"
			+"<div class=\"page01\">"
			+"<input class=\"btn btn01\" type=\"button\" onclick=\"javascript:window.goSmzsq();\" value=\"确定\"/>"
			+"</div>"
			+"</div>";
		zhjAlertIndex=layer.open({
			type: 1, //弹窗
			closeBtn: 0, //显示关闭按钮
			offset:96,
		 	shift: 0, //动画效果
		 	area: ['540px', '225px'],
		 	title:"温馨提醒",
		 	content: alerthtml
		});
	}
}
//TODO 废弃方法
function goModifyUserInfo(){
	layer.close(zhjAlertIndex);
	window.parent.goPage('','yhgl','zhxx');
}

/**实名制申请*/
function goSmzsq(){
	layer.close(zhjAlertIndex);
	if(window.parent.hasYhgl=="Y"){//
		window.parent.goPage('','yhgl','smzsq');
	}else{
		window.parent.layer.alert('用户未分配用户权限！', {icon: 5});
	}
	
}

//页头获取已经菜单信息和用户信息
function getMenu(m1){
	var getMenuData = window.sessionStorage.getItem("getMenuData");
	if(getMenuData==null){
		$.get(contPath+"/portalSer/getRootMenu.do?t="+new Date().getTime(), function(data){
	    	getMenuCallback(data);
	    });
	}else{
		getMenuCallback(getMenuData);
	}
}

function getMenuCallback(data){

    var result = eval("("+data+")");
    var html="";
    $("#topMenu").css("display","none");
    if(result.flag=="ok"){
    	window.sessionStorage.setItem("getMenuData",data);
			var menuHtml=result.menuHtml;
			
			
			var menuHtml2=result.menus;
//			console.log(menuHtml2);

            var userInfo=result.userInfo;
            var userName=result.userName;
            var yhqymc=result.yhqymc;
            var hasLogined=result.hasLogined;
            hasYhgl=result.hasYhgl;
            var logoutUrl=result.logoutUrl;
            var ssoServerAddr=result.ssoServerAddr;
            var isShowQhsf=result.isShowQhsf;
            var yhsfdm=result.yhsfdm;
            var isNSR=result.isNSR;
            var tybz=result.tybz;
            if(menuHtml!=""){
                $("#topMenu").empty();
                $("#topMenu").html(menuHtml);
                var name;
                var name2;
                
                if(yhqymc!=""){
                	name = "欢迎，"+yhqymc;
                    name2 = yhqymc;
                }else{
                	name = "欢迎，"+userName;
                	name2 = userName;
                }
                
                if("Y"==hasLogined){
                	$('#userName').html(name);
                	$('#userBtn').show();
                    $('#userName2').html(name2);
                    var userAwidth=$(".user-item .user-name").width();
                    if(userAwidth<150){
                		$(".user-item").width(userAwidth)
                	   
                	}else{
                		$(".user-item .user-name").width(150)
                	}
                }
                if(isNSR == "Y"){ //企业用户
                    if(hasYhgl=="Y"){//
                        $("#userName").attr("href","javascript:void(0);");
                    }else{
                        $("#userName").attr("href","javascript:alertMessgae('用户未分配用户权限！')");
                    }
                }else{ //个人用户
                    if(hasYhgl=="Y"){//
                        $("#userName").attr("href","javascript:window.goIndexUrl('','yhgl','zhxx');");
                    }else{
                        $("#userName").attr("href","javascript:alertMessgae('用户未分配用户权限！')");
                    }
                }

                if(yhqymc!=""){
                    /*
                    if(yhsfdm=="04"){
                        $("#yhqymc").html("被代理企业："+yhqymc);//04为被代理企业
                    }else{
                        $("#yhqymc").html("企业名称："+yhqymc);
                    }*/
                    $("#yhqymc").html("企业名称："+yhqymc);
                    $("#liM1_sy").hide();//企业身份，隐藏首页菜单
                }
                if(isShowQhsf=="Y"){
                    $("#qhsfBtn").show();//身份切换
                }

                if(isNSR=="Y"){//企业身份
                    $("#zztsfqhBtn").show();//子主体身份切换
                }
            }
            $("#ssoServerAddr").val(ssoServerAddr);//单点登录地址
            $("#logoutUrl").val(logoutUrl);//退出登录地址
            if("Y"==hasLogined){//已经登录
                $("*[name='logTip2']").show();
                $("*[name='logTip1']").hide();
                $("*[name='logTip3']").hide();
                $("*[name='logTip4']").hide();

                $("#liM1_sy").hide();//只要登录，个人和企业身份，隐藏首页菜单
                $(".head_menu").removeClass("head_menu01");
            }else{
                $("*[name='logTip1']").show();
                $("*[name='logTip2']").hide();
                $("*[name='logTip3']").hide();
                $("*[name='logTip4']").hide();
                $(".head_menu").addClass("head_menu01");
            }

            /*if(m1=="bszm"){//办税桌面
                menuActive(m1);
            }*/
            
            var isChangesf = getURLParameter("isChangesf");
            if("true"==isChangesf){
            	document.getElementById("qhsfIfrm").src=ssoServerAddr+"/auth/noticeChangeSf.do?t="+(new Date()).getTime();//切换身份后，通知外围系统
            }
            
 
			if("Y"==tybz){
				var tyyy=result.tyyy;
				var nsrdtsxx=result.nsrdtsxx;
				var nsrsbh=result.nsrsbh;
				$("#topMenu").empty();
				$("#topMenu").html("");//菜单数据
				$("#qhsfBtn").hide();//身份切换
				$("#zztsfqhBtn").hide();//主管税务机关选择	
				$("#userInfo").hide();//欢迎你
				$("#userName").hide();//用户名
				$("#yhqymc").hide();//企业名称

				nsrztEno(yhsfdm);
			}else{
        	layui.use(['layer'], function() {
        		layui.layer.close(resNsrIndex);
        	});
			}
			
		}else{
			var hasLogined=result.hasLogined;
			var logoutUrl=result.logoutUrl;
			var ssoServerAddr=result.ssoServerAddr;
			$("#ssoServerAddr").val(ssoServerAddr);//单点登录地址
			$("#logoutUrl").val(logoutUrl);//退出登录地址
			if("Y"==hasLogined){//已经登录
				$("*[name='logTip2']").show();
				$("*[name='logTip1']").hide();
				$("*[name='logTip3']").hide();
				$("*[name='logTip4']").hide();
				$("#qhsfBtn").show();//身份切换
			}else{
				$("*[name='logTip1']").show();
				$("*[name='logTip2']").hide();
				$("*[name='logTip3']").hide();
				$("*[name='logTip4']").hide();
				$(".head_menu").addClass("head_menu01");
			}
			
			
		}
		

}

/*页头菜单文字下方的三角形点击效果*/
function menuActive(m1){
    $(".head_menu").find("li").removeClass("active");
    if(m1!=null && m1!=""){
        $("li[id=liM1_"+m1+"]").addClass("active");
    }else{
        $(".head_menu").find("li").first().addClass("active");
    }
}

//生成子菜单--从菜单中心获取的
function makeSubMenusHtml(menus,gsdjxh,dsdjxh){
	var html="<div class=\"left-title\"><span>"+menus.cdmc+"</span><a href=\"#\" onclick=\"backZy()\" class=\"title-index\"><i class=\"iconfont fsicon-fanhui\"></i>返回主页</a></div>";
    html+="<ul class=\"leftmenuul\">";
    var subMenus=menus.childrenNodes;
    if(subMenus.length>0){//二级
        for(var i=0;i<subMenus.length;i++){
            var secMenu=subMenus[i];
            var thirdMenus=secMenu.childrenNodes;
            var noerj="";
            var mFlag=secMenu.cdtb;//getMFlag(secMenu);//取得链接标志
            var params="'"+makeRealUrl(secMenu.cdid,"",secMenu,gsdjxh,dsdjxh)+"','"+menus.cdtb+"','"+secMenu.cdtb+"','','"+secMenu.qxkzsx+"'";
            var onclick="";

            //组装菜单onclik事件
            if(thirdMenus.length==0 || (menus.cdtb=="sxbl" && secMenu.cdtb=="sssxbl")){//涉税事项办理特殊处理
                noerj="class='noerj'";
                onclick="onclick=\"javascript:goPage("+params+");\"";
                if(secMenu.cdtb==="sssxbl"&&secMenu.cdid==="33"){
                    onclick="onclick=\"javascript:inspectUrl("+params+");\"";
                }
            }
            //组装左菜单树
            if(secMenu.dkfs=="_blank"){//新窗口打开
                var openUrlClick ="onclick=\"javascript:openUrlClick('"+secMenu.gnUrl+"');\"";
                html+="<li "+noerj+"><i class=\"iconfont fsicon-tree-dot\"></i><a class=\"active\" href=\"#none\"" + openUrlClick+">"+secMenu.cdmc+"</a>";
            }else{
				html+="<li "+noerj+"><i class=\"iconfont fsicon-tree-dot\"></i><a class=\"active\" href=\"#none\" mFlag='"+mFlag+"' realurl='"
					+makeRealUrl(secMenu.cdid,"",secMenu,gsdjxh,dsdjxh)+"' aFlag=\"hasUrl\" "+onclick+">"+secMenu.cdmc+"</a>";
            }
			if(menus.cdtb=="sxbl" &&(secMenu.cdtb !="dzzlgl") ){//事项办理特殊处理
			
				
				
			}else if(thirdMenus.length>0){
				html+="<ul>";
				for(var k=0;k<thirdMenus.length;k++){
					var thirdMenu=thirdMenus[k];
					if(thirdMenu.dkfs=="_blank"){//新窗口打开
                        var openUrlClick ="onclick=\"javascript:openUrlClick('"+thirdMenu.gnUrl+"');\"";
                        html+="<li><a href=\"#none\""+openUrlClick+">"+thirdMenu.cdmc+"</a>";
					}else{
					
						var mFlag3=thirdMenu.cdtb;//getMFlag(thirdMenu);//取得链接标志
						//单位纳税人税务登记信息采集、个体纳税人税务登记信息采集、自然人登记 整个页面跳转
						if(mFlag3=="dwnsrswdjxxcj"||mFlag3=="gtjynsrswdjxxcj"||mFlag3=="clfxsxxcj"||mFlag3=="lsswdjnsrdj"||mFlag3=="kjywrdj"){
							
							var onclick3= "onclick=\"javascript:goDj(this);\"";
							html+="<li><a href=\"#none\" mFlag='"+mFlag3+"' pMFlag='"+secMenu.cdtb+"' realurl='" 
								+makeRealUrl(thirdMenu.cdid,"",thirdMenu,gsdjxh,dsdjxh)+"' aFlag=\"hasUrl\" "+onclick3+">"+thirdMenu.cdmc+"</a>";
							
						}else{
							
                            var params3="'"+makeRealUrl(secMenu.cdid,thirdMenu.cdid,thirdMenu,gsdjxh,dsdjxh)+"','"+menus.cdtb+"','"+thirdMenu.cdtb+"','','"+thirdMenu.qxkzsx+"'";
							var onclick3= "onclick=\"javascript:goPage("+params3+");\"";
							html+="<li><a href=\"#none\" mFlag='"+mFlag3+"' pMFlag='"+secMenu.cdtb+"' realurl='" 
								+makeRealUrl(thirdMenu.cdid,"",thirdMenu,gsdjxh,dsdjxh)+"' aFlag=\"hasUrl\" "+onclick3+">"+thirdMenu.cdmc+"</a>";
						}
							 
						
						
						
					}
					
				}
				html+="</ul>";
			}
			html+="</li>"
		}
	}
	html+="</ul>";
	return html;
}

//构造左菜单url，加上菜单id和标记,mflag是菜单图标
function makeRealUrl(cid1,cid2,menu,gsdjxh,dsdjxh){
	var url=menu.gnUrl;
	if(!url) return "";
	
	//TODO  如果是地税环境，并且当前菜单为发票查验
	/**
	if(menu.cdtb && "fpcy" == menu.cdtb && $("#xxmhGdsbz").val() == "ds") {
		url = "/web-tycx/sscx/gzcx/fpcy/fpcy.jsp";
	}**/
	
	if(menu.gnUrl.indexOf("?")!=-1){
		url+="&";
	}else{
		url+="?";
	}
	var cid=cid1;
	if(cid2!="") cid=cid2;
	//增加gdslxDm
	var gdslxDm=menu.gdsywsx=="0"?"3":menu.gdsywsx;
	
	url+="cdId="+cid+"&gnDm="+menu.gndm;
	
	if(url.indexOf("gdslxDm")==-1){
		url+="&gdslxDm="+gdslxDm;
	}
	//判断是否1.0的url,如果是1.0url就加上djxh参数,djxh参数在1.0系统中作为判断2.0是否切换用户的依据。
	if(url.indexOf("/etax/")>-1||url.indexOf("/tycx/")>-1){
		if(gsdjxh!=null){
			url+="&gsdjxh="+gsdjxh;
		}
		if(dsdjxh!=null){
			url+="&dsdjxh="+dsdjxh;
		}
	}
    /**
	  * 福建问题--外部网站链接，传入参数会有问题
    * http://www.fj-n-tax.gov.cn/zfxxgkzl/zfxxgkml/xzzf/zdsswfajgbl/
    * http://www.fj-n-tax.gov.cn/zfxxgkzl/zfxxgkml/xzzf/zdsswfajgbl/?gdslxDm=3
    */
	if(url!=null && url!="" && url.indexOf("noUrlParam=true")>-1) {
		url = url.split("?")[0];
	}
	return url;
}

/**
 * 取得图标 ,构造左菜单二级图标地址
 * @param menu
 * @returns {String}
 */
function getLeftIcon(menu){
	var icon="left_icon_13.png";
	if(menu.cdtb!=null){
		icon="left_icon_"+menu.cdtb+".png";
	}
	return icon;
}

//展示待办提醒的详细内容
var index_mx=0;
function showBszmDetail(bt,content){
	//iframe层-父子操作
  index_mx=layer.open({
		type: 1,
		closeBtn: 1, //不显示关闭按钮
		area: ['800px', '450px'],
	  	title:"详细内容",
	  	content: content
	});
}
//关闭待办提醒的详细内容
function closeYybsPage(){
		layer.close(index_mx);
}
//跳转到预约办税的页面
//如纳税人选择“放弃”，则将本次的申请记录置为“转大厅办理”（新增事项状态编码D01）
//跳转预约链接给纳税人选择预约，网上办理流程结束。如纳税人选择“保留”，则不跳转预约链接，可继续网上办理
function openYybsPage(djxh,ysqxxid,ywlxBm,yydz){
	var content = "<p><span style=\"color:#333333;\">您</span><span style=\"color:#333333;\">即将</span><span style=\"color:#333333;\">选择</span><span style=\"color:#333333;\">预约前往大厅办理，是否</span><span style=\"color:#333333;\">放弃本次申请？</span></p>" +
			"<p><span style=\"color:#333333;\">&nbsp;</span><span style=\"color:#333333;\"></span></p><p><span style=\"color:#FF0000;\">温馨提示</span><span style=\"color:#FF0000;\">：</span></p>" +
					"<p><span style=\"color:#FF0000;\">如果</span><span style=\"color:#FF0000;\">确认</span><span style=\"color:#FF0000;\">放弃</span><span style=\"color:#FF0000;\">，</span><span style=\"color:#FF0000;\">则</span><span style=\"color:#FF0000;\">本次申请将作废，如要</span><span style=\"color:#FF0000;\">重新申请</span><span style=\"color:#FF0000;\">，需从“事项办理”菜单进入，重新填表并提交附送资料。</span></p>";
	if(ywlxBm!=="ws_bqbz"){
		//跳转到预约页面
		window.open(yydz, '_blank');
	}else{
		layer.confirm(content, {
			btn: ['放弃','保留'],
			area : ['420px' , 'auto'], //宽高
			title : "提示",
			icon : 3,
			offset : '270px'
		},function(i){
			parent.layer.close(i);//关闭提示框
			//跳转到预约页面
			window.open(yydz, '_blank');
			//将本次的申请记录置为“转大厅办理”（新增事项状态编码D01）
			sxsqTodtbl(djxh,ysqxxid);
		},function(){
			
		});
	}
}
//企业绑定
function newQysf(){
	layer.close(qhsfIndex);
	if(window.parent.hasYhgl=="Y"){//
		window.parent.goPage('','yhgl','yhqxgl');
	}else{
		window.parent.layer.alert('用户未分配用户权限！', {icon: 5});
	}
	
}
//实名制申请
function newSmz(){
	layer.close(qhsfIndex);
	if(window.parent.hasYhgl=="Y"){//
		window.parent.goPage('','yhgl','smzsq');
	}else{
		window.parent.layer.alert('用户未分配用户权限！', {icon: 5});
	}
}

//弹出提示信息
function alertMessgae(message){
	window.layer.alert(message, {icon: 5});
}

var resNsrIndex = 0;
//纳税人主体停用提示
function nsrztEno(sfdm){
	layer.close(resNsrIndex);
	var alerthtml ="";
	if("06"==sfdm){
		alerthtml+="<div class=\"tc_nav\" style='padding: 25px 40px 30px 40px;'>"
	 		+"<div style=\"height:60px; line-height:60px; text-align:center;\">该纳税人主体已被停用，请咨询税务机关！</div>"
	 		+"<div class=\"page01\">"
	 		+"<input class=\"btn btn01\" type=\"button\" onclick=\"javascript:window.logout();\" value=\"确定\"/>"
	 		+"</div>"
			+"</div>";
	}else{
		alerthtml+="<div class=\"tc_nav\" style='padding: 25px 40px 30px 40px;'>"
	 		+"<div style=\"height:60px; line-height:60px; text-align:center;\">该纳税人主体已被停用，请咨询税务机关！</div>"
	 		+"<div class=\"page01\">"
	 		+"<input class=\"btn btn01\" type=\"button\" onclick=\"javascript:window.changeCard();\" value=\"确定\"/>"
	 		+"</div>"
			+"</div>";
	}
		resNsrIndex=layer.open({
 		type: 1, //弹窗
 		closeBtn: 0, //显示关闭按钮
 		offset:96,
 		shift: 0, //动画效果
 		area: ['540px', '225px'],
 		title:"温馨提醒",
 		content: alerthtml
 	});
}


function goDj(obj){

	window.open($(obj).attr("realurl"));
}
//对接客户端，在登录、登出、切换身份等环节调用客户端接口，将电子税务局会话信息通知对方
function invokeServiceWithSessionInfo(args) {
	
	$.ajax({url : contPath+"/portalSer/getDzswjSessionInfo.do",
		type : "post",
		success:function(data){
			data =JSON.parse(data);
            var dzswjSessionInfo =JSON.stringify(data)
		//	console.log(success_session);
            window.external.InvokeService("OmniContainer", args, dzswjSessionInfo);
		},
        error: function(){
        	console.log("error_session");
        }
});
}
function sxsqTodtbl(djxh,ysqxxid){
	var params={"djxh": djxh,"ysqxxid": ysqxxid};
	$.ajax({url : "/sxsq-cjpt-web/sxsq/toDtbl.do",
		type : "post",
		data: params,
        dataType: "json",
		success:function(data){
			
		},
        error: function(){
        	
        }
    });
}

/**
 * 收藏功能
 * @returns
 */
function onclickScgl(){
	if($('#ifrMain').length>0){
		var cdid = getQueryString($('#ifrMain').attr("src"),"cdId");
		var cdmc = $(".sonover").html();
		if(cdmc==null||cdmc==""){
			cdmc = $(".inactive").html();
		}
		if(cdid!=null){
			//获取已收藏的菜单id
            var isSc="N";
			$.ajax({
					type: "post",
					url: "/xxmh/scglController/getYscgn.do",
					dataType: "json",
					data:{},
					success: function (datas) {
						if(datas.flag=='success'){
							if(datas.ysccd.length > 0){
								$.each(datas.ysccd, function(i, data) {
                                if(data.cdid==cdid){
                                	isSc="Y";
                                }
								});
							}
                        if(isSc=="Y"){
								layer.confirm("是否要取消收藏【"+cdmc+"】功能？", {btn: ['打开收藏夹','确定', '取消'], title: "提示",icon: 7}, 
								function () {
                            	goPage('/yhgl/view/favorites/scgnglList.jsp?cdId=78e168690b36419cbbac5746c05a7e4c&gnDm=gndm-scgl&gdslxDm=3','yhgl','gnsc','','1');
									 layer.close(layer.index);
								}
								,function(){
								 $.ajax({
										type: "post",
										url: "/xxmh/scglController/insertOrDeleteOne.do",
										dataType: "json",
										data:{"cdid":cdid},
										success: function (data) {
											if(data.code!="0"){
												layer.alert(data.msg, {title:"提示",icon: 2});
											}else{
												layer.close(layer.index);
											}
										}
								  });
								}, function () {
									layer.close(layer.index);
								});
							}else{
								layer.confirm("是否要收藏【"+cdmc+"】功能？", {btn: ['打开收藏夹','确定', '取消'], title: "提示",icon: 3}, 
								   function () {
                            	goPage('/yhgl/view/favorites/scgnglList.jsp?cdId=78e168690b36419cbbac5746c05a7e4c&gnDm=gndm-scgl&gdslxDm=3','yhgl','gnsc','','1');
									layer.close(layer.index);
								}, function () {
									$.ajax({
										type: "post",
										url: "/xxmh/scglController/insertOrDeleteOne.do",
										dataType: "json",
										data:{"cdid":cdid},
										success: function (data) {
											if(data.code!="0"){
												layer.alert(data.msg, {title:"提示",icon: 2});
											}else{
												layer.close(layer.index);
											}
										}
								  });
								}, function () {
									layer.close(layer.index);
								});
							}
						}else{
							layer.alert("获取已收藏功能列表失败！", {title:"提示",icon: 2,offset: '200px'});
							return;
						}
					},
					error: function(datas){
						layer.alert("获取已收藏功能列表失败！", {title:"提示",icon: 2,offset: '200px'});
						return;
					}
			});
		}else{
			layer.alert("当前页面非具体功能，无法收藏", {title:"提示",icon: 2});
		}
	}
}
function getQueryString(url,name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    if (url.indexOf("?") != -1){
    	url = url.substr(url.indexOf("?")+1);
    }
    var r = url.match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 

function getShowGdsbz(){
/*var requesturl = "/xxmh/viewsControlController/getShowGdsbz.do";
    $.ajax({
        type : "get",
        async: false,
        cache:true,
        url : requesturl,
        data :{},
        datatype:"text",
        success : function(data){
            if(data == "N" || data == "Y"){
                showGdsbz = data;
            }
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
        }
    });*/
	
	//合并后直接赋值N
	showGdsbz = "N";
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

}

/**
 * 显示新手指南
 * @param pageId
 */

/**
 * 选择新手指南具体步骤
 * @param obj
 */

/**
 * 主页按钮返回主页
 * @returns
 */
function backZy(){
	window.location.href=zyUrl;
}

/**
 * 重新计算背景灰图层左右两侧宽度
 */

$(document).ready(function(){
	/**
     * 初始化渲染下拉框： 操作规程
     */
    layui.use('form',function () {
        var form = layui.form;
        form.render('select');
	});
});


/**
 * 全局搜索拼接URL
 */
function makeUrl(secGnUrl,secCdid,thirdCdtb,thirdGndm){
	var url=secGnUrl;
	if(!url) return "";
	if(secGnUrl.indexOf("?")!=-1){
		url+="&";
	}else{
		url+="?";
	}
	if(secCdid!="") var cid=secCdid;
	url+="cdId="+cid+"&mflag="+thirdCdtb+"&gnDm="+thirdGndm;
	return url;
}

//点击弹出操作规程
function onclickCzgc(){
	layui.use('layer',function () {
		if($('#ifrMain').length>0){
			var cdid = getQueryString($('#ifrMain').attr("src"),"gnDm");//根据功能代码弹出关联的操作规程
			if(cdid!=null){
				$.post("/zyywn-cjpt-web/czgc/loadDataList.do",{"glgn":cdid,"page":1,"limit":100},function(data){
					if (data.code == 0){
						if (data.count < 1){
							layer.alert(
									"  <ul>此功能暂未添加操作规程。</i>\n </ul>\n"
									,{
										title : '提示',icon : 5
									});
						} else {
							//加载数据
							czgcTableLoad(cdid);
							//弹出页面
							var type = 1;
							layer.open({
								type: type
								, area: ['60%','60%']
								, title: ['<h5 style="color: #0994dc">操作规程指引</h5>']
								, scrollbar: false
								, gl: type
								, id: 'layerDemo' + type
								, content: $("#czgcDiv")
								, btnAlign: 'c'
								, yes: function () {
									layer.closeAll();
								}
							});
						}
					} else{
						layer.alert(
								"  <ul>此功能暂未添加操作规程。</i>\n </ul>\n"
								,{
                                    title : '提示',icon : 5
								});
					}
				});
			}else{
				layer.alert(
						"  <ul>此功能暂未添加操作规程。</i>\n </ul>\n"
						,{
                            title : '提示',icon : 5
						});
			}
		}else{
			layer.alert(
					"  <ul>此功能暂未添加操作规程。</i>\n </ul>\n"
					,{
                        title : '提示',icon : 5
					});
		}
	});   
}

function getQueryString(url,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (url.indexOf("?") != -1){
        url = url.substr(url.indexOf("?")+1);
    }
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//操作规程table
function czgcTableLoad(glgn){
    layui.use(['form','layer','table'], function() {
        var table = layui.table;
        var table = layui.table;
        var form = layui.form;
        var layer = layui.layer;
        form.on('select(czgcmc)', function (data) {
            //触发按钮事件 yysjTab
            var czgcid = $('#czgcmc').val();
            loadData(czgcid);
        });
        /***
         *  动态加载div数据
         */
        function  loadData(czgcid) {
            $.ajax({
                url: "/zyywn-cjpt-web/czgc/queryDataLoad.do",
                data: {czgcid : czgcid},
                async: false,
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        var html = '';
                        /**
                         * 文件列表拼接 ： 循环拼接
                         */
                        var fileList = data.filesList;
                        /**
                         * 实体内容：  czgcmc
                         * 				发布时间 说明
                         */
                        $("#loadCzgcDivChild").html('');
                        var czgcVo = data.czgcVo;
                        var czgcsmStr = '';
                        if( czgcVo.czgcsm != null &&  czgcVo.czgcsm != '') {
							czgcsmStr = czgcVo.czgcsm;
                            //czgcsmStr = czgcVo.czgcsm.replace(/\n/g,'<br/><br/>');
                        }
                        html += '<div class="news-text marginT8 marginB32">\n' +
                            '                             <div id="content"  style="margin-left:8px;margin-right: 8px;">' + czgcsmStr + '</div>\n' +
                            '                             </div>';
                        if(fileList != null && fileList != '' && fileList.length > 0) {
                            html += '<div class="item-attached marginT30 marginT10">';
                            html += '<p class="marginB8"><b>【附件】</b></p>';
                            for(var i = 0; i < fileList.length; i++) {
                                var file = fileList[i];
                                html += '<ul>';
                                html += '<a href="#" class="link-strong" style="margin-left: 30px;" onclick="downFile(' + "'" + file.filePath + "'" + ',' + "'" + file.fileName +  "'" + ')">' + file.fileName + '</a>';
                                html += '</ul>';
                            }
                            html += '</div>';
                        }
                        html += '<div class="item-attached marginT30" id="item-attached">\n' +
                            '\n' +
                            '\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t<div class="news-bottom-text marginT30">\n' +
                            '\t\t\t\t\t\t\t</div>\n';
                        $("#loadCzgcDivChild").css('border','1px solid #ebebeb');
                        $("#loadCzgcDivChild").html(html);
                        resizePicture();//返回成功了再调整图片大小
                    } else {
                        layer.alert('加载数据失败!',{
                            icon : 5
                        });
                    }
                }
            });
        }
        /**
         * 初始化下拉列表框
         */
        function initCzgczy(glgn) {
            $.ajax({
                url: "/zyywn-cjpt-web/czgc/loadDataList.do",
                data: {glgn:glgn,limit : 10, page : 1},
                async: false,
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        if (data.data.length > 0) {//至少保证了下拉框有内容
                            $("#czgcmc").html("");
                            // $("#czgcmc").append("<option value=''>请选择...</option>");
                            $.each(data.data, function (index, item) {
                                $("#czgcmc").append("<option value='" + item.czgcid + "'>" + item.czgcmc + "</option>");
                            })
                            /**
							 * 默认选中第一项下拉框 style="background-color: #0994dc"
                             */
                            form.render('select');
                            var czgcmcOptions = $("#czgcmc").find('option');
                            /**
							 * 拼接实体内容
							 * <h1 class="news-title">${czgcVo.czgcmc} </h1>
							 * <h2 class="news-num"  style="text-align: right">发布时间：${czgcVo.fbsj}</h2>
							 * <div class="news-text marginT30 marginB32">
                             <div id="content">${czgcVo.czgcsm}</div>
                             </div>

                             <c:if test="${filesList != null}">
                             <p>附件：</p>
                             <ul>
                             <c:forEach items="${filesList}" var="file" varStatus="status">
                             <a href="#" class="link-strong" onclick="downFile('${file.filePath}','${file.fileName}')">${status.index + 1}．${file.fileName}</a>
                             </c:forEach>
                             </ul>
                             </c:if>
                             */
                            $(czgcmcOptions[0]).prop("selected",true);
                            $("#czgcmc").css({'background-color':'#0994dc'});
                            var html = '';
                            /**
                             * 文件列表拼接 ： 循环拼接
                             */
                            var fileList = data.filesList;
                            /**
                             * 实体内容：  czgcmc
                             * 				发布时间 说明
                             */
                            $("#loadCzgcDivChild").html('');
                            var czgcVo = data.czgcVo;
                            var czgcsmStr = '';
                            if( czgcVo.czgcsm != null &&  czgcVo.czgcsm != '') {
								czgcsmStr = czgcVo.czgcsm;
                                //czgcsmStr = czgcVo.czgcsm.replace(/\n/g,'<br/><br/>');
                            }
                            html += '<div class="news-text marginT8 marginB32">\n' +
                                '                             <div id="content"  style="margin-left:8px;margin-right: 8px;">' + czgcsmStr + '</div>\n' +
                                '                             </div>';
                            if(fileList != null && fileList != '' && fileList.length > 0) {
                                html += '<div class="item-attached marginT30 marginT10">';
                                html += '<p class="marginB8"><b>【附件】</b></p>';
                                for(var i = 0; i < fileList.length; i++) {
                                    var file = fileList[i];
                                    html += '<ul>';
                                    html += '<a href="#" class="link-strong" style="margin-left: 30px;" onclick="downFile(' + "'" + file.filePath + "'" + ',' + "'" + file.fileName +  "'" + ')">' + file.fileName + '</a>';
                                    html += '</ul>';
                                }
                                html += '</div>';
                            }
                            html += '<div class="item-attached marginT30" id="item-attached">\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t<div class="news-bottom-text marginT30">\n' +
                                '\t\t\t\t\t\t\t</div>\n';
                            $("#loadCzgcDivChild").css('border','1px solid #ebebeb');
                            $("#loadCzgcDivChild").html(html);
                            resizePicture();//返回成功了再调整图片大小
                        }
                    } else {
                        layer.alert('没有操作规程指引内容,无法查看!', {
                            icon: 5
                        });
                    }
                }
            });
        }

        $(document).ready(function(){
            /**
             * 初始化操作规程指引数据
             */
            layui.use('form',function () {
            initCzgczy(glgn);
            });

            /**
             * 初始化展示div内容 并调整
             */
            // resizePicture();
        });
    });
}
//下载附件
function downFile(filePath, fileName){
    filePath = filePath.replace(" ", "");
    var url = "/zyywn-cjpt-web/file/readFile.do?fileNameID=" + filePath + "&fileName=" + encodeURI(encodeURI(fileName));
    window.open(url,"文件下载");
}
//获取宽度限制图片宽度
function resizePicture(){
    // var contentDiv = document.getElementById("content");
    // var contentWidth = contentDiv.clientWidth;
    // alert(contentWidth)
    // var contentImags = contentDiv.getElementsByTagName("img");
    // if(contentImags != null && contentImags != '' && contentImags.length > 0) {
    	// for(var i = 0; i < contentImags.length; i++){
     //        var contentImagsI = contentImags[i];
     //        alert(contentImagsI.width);
     //    }
	// }
    var widthDiv = $("#content").width();
    var imgs =  $("#content").children('img');
    // imgs.each(function(){
    $("#content").children('img').each(function(){
        //获取图片宽度
        var widthImg = $(this).width();
        if (widthImg > widthDiv){
            $(this).css({ width: widthDiv});
        }
    });
}
//键码获取--112
//F1弹出操作规程
$(document).on("keydown",function (event) {
	if (event.keyCode == 112 || event.keyCode == 173){
        onclickCzgc();
	}
});
/**
 * cookie操作
 */
function getCookie(c_name){
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
		
		if (c_start!=-1){
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}

function setCookie(c_name,value,expiremin)
{
	var exdate=new Date()
	exdate.setMinutes(exdate.getMinutes()+expiremin)
	document.cookie=c_name+ "=" +escape(value)+
	((expiremin==null) ? "" : "; expires="+exdate.toGMTString())
}

/**
 * 退出/切换身份/切换子主体清除sessionStorage缓存
 */
function cleanSessionStorageCache(){
	window.sessionStorage.clear();
}

function openUrlClick(url) {
    //文书业务校验
    if("sxsq"==getURLParameter2(url,"ywlx")){
        verifyApply(url);
    }else{
        window.open(url);
    }
}

/**
 * 文书业务校验是否重复办理
 * @param url
 */
function verifyApply(url){
    var ywbm=url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('?'));
    var param=url.substring(url.lastIndexOf('?')+1,url.length);
    //window.open(url);
    $.ajax({
        type : "get",
        url : "/sxsq-cjpt-web/sxsq/verifyApply.do?ywbm="
        + ywbm+"&"+param,
        dataType : "json",
        async : true,
        showFooter : true,
        success : function(data) {
            if(data.code==='99'){
                parent.layer.alert(data.message, {
                    title : "提示",
                    icon : 5,
                    offset : '270px'
                });
            }else if(data.code==='90'){
                window.parent.layer.confirm(data.message, {icon: 5, title:'提示',btn:['确定']}, function(index) {
                    //关闭遮罩层
                    window.parent.layer.close(index);
                    window.open(url);
                });
            }else if(data.code==='00'){
                window.open(url);
            }
        },
        error : function() {
            parent.layer.alert("校验是否重复申请出错,请联系系统管理员！", {
                title : "提示",
                icon : 5,
                offset : '270px'
            });
        }
    });
}