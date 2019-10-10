/**
 * 
 */

//是否已经加载过我的提醒，通知
var hasLoadWdtx=false;
var hasLoadWdtz=false;
var hasLoadDbsx=false;
var hasLoadZcsd=false;
var hasLoadTzgg=false;
var showGdsbz="";//是否隐藏国地税标志,若非为Y或N则保持原样
var context_path = "";

$(document).ready(function(){
	var requesturl = "/xxmh/viewsControlController/getShowGdsbz.do";
	$.ajax({
		type : "post",
		url : requesturl,
		data :{},
		datatype:"text",
		success : function(data){
			if(data == "N" || data == "Y"){
				showGdsbz = data;
			}
		}
	});
});


//查询待办事项方法
function queryDbxxList(){
	if(hasLoadDbsx==true) return;
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 5;
    var url=contPath+"/myCenterController/getDbsx.do";
	var params={pageIndex: 1, pageSize: 4};
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
        	var gsWfxx="";
    		if(res.flag=="ok"){
    			var items=res.items;
    			var contextPath = res.contextPath;
                var localStr = location.href;
                if (localStr.indexOf("test") < 0) {
                    contextPath="";
                }
    			context_path = contextPath;
    			var length=items.length;
    			var wdCount=items.wdsum;
    			var isExitWfxx=items.isExitWfxx;
    			
    			$("#dbxxDataList").find("tr[name=trData]").remove();
    			if(length > 0){
    				var trHtml= getDbxxTrHtml(contextPath,items,showCount);
    				$("#dbxxDataList").append(trHtml);
    				/*if(showGdsbz=="N"){//配置表中配置的是否显示国地税标志为N的话，则隐藏国地税标志
    					$(".ctrl2").hide();
    				}else if(showGdsbz=="Y"){
    					$(".ctrl2").show();
    				}*/
    				
    			}
    			

    			if(length<=0){
    				var nullHTML="<tr name='trData'><td colspan='4' style='text-align:center;height:220px;border-top: 1px solid #dddddd;'>暂无待办</td></tr>";
    				$("#dbxxDataList").append(nullHTML);
    			}else if(length<showCount){
    				var nullHTML="";
    				for(var i=0;i<(showCount-length);i++){
    					nullHTML+="<tr name='trData'><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td style=\"height:24px;\">&nbsp;</td></tr>";
    				}
    				$("#dbxxDataList").append(nullHTML);
    			}
				if(wdCount>showCount){
					$("#dbxxTotalCount").text(showCount);
					$("#dbxxTotalCount").show();
				}else{
					if(wdCount > 0){
						$("#dbxxTotalCount").text(wdCount);
						$("#dbxxTotalCount").show();
					}
				}
    			
//    			$("#dbxxTotalCount").html(res.recordCount);
    		}else{
    			//alert("加载数据失败！");
    		}
    		//querySstxList();//涉税提醒加载
        },
        error: function(data){
			/*var nullHTML="";
			var	showCount=4;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"</tr>";
			}
			$("#dbxxDataList").append(nullHTML);*/
        }
    });
}

//查询提醒方法
function querySstxList(){
	
	if(hasLoadWdtx==true) return;
	hasLoadWdtx=true;
	var dateSD = getLast3MonDate();
	var dateED = new Date();
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 5;
	var url=contPath+"/myCenterController/getSstx.do";
	var params={pageIndex: 1, pageSize: 5, "ydzt" : "N","sjq":dateSD,"sjz":dateED.Format("yyyy-MM-dd")};//默认获取未读的
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
    		if(res.flag=="ok"){
    			var items=res.items;
    			var length=items.length;
    			var wdsum=res.wdsum;
    			$("#sstxDataList").find("tr[name=trData]").remove();
    			for(var i=0;i<length&&i<showCount;i++){
    				var trHtml= getSstxTrHtml((i+1),items[i]);
    				$("#sstxDataList").append(trHtml);
    				
    			}
    			if(length<=0){
    				var nullHTML="<tr name='trData'><td colspan='2' style='text-align:center;height:220px;border-top: 1px solid #dddddd;'>暂无提醒</td></tr>";
    				$("#sstxDataList").append(nullHTML);
    			}else if(length<showCount){
    				var nullHTML="";
    				for(var i=0;i<(showCount-length);i++){
    					nullHTML+="<tr name='trData'><td>&nbsp;</td><td style=\"height:24px;\">&nbsp;</td></tr>";
    				}
    				$("#sstxDataList").append(nullHTML);
    			}
				if(wdsum>showCount){
					$("#sstxTotalCount").text(wdsum);
					$("#sstxTotalCount").show();
				}else{
					if(wdsum > 0){
						$("#sstxTotalCount").text(wdsum);
						$("#sstxTotalCount").show();
					}
				}
    		}else{
    			//alert("加载数据失败！");
    		}
    		//querySsTzList();//通知公告加载
        },
        error: function(data){
			/*var nullHTML="";
			var	showCount=6;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"</tr>";
			}
			$("#sstxDataList").append(nullHTML);*/
        }
    });
}

//查询政策速递方法
function queryZcsdList(){
	if(hasLoadZcsd==true) return;
	hasLoadZcsd=true;
	var showCount = 5;
	var url=contPath+"/myCenterController/getTzgg.do";
	var params={};
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
    		if(res.flag=="ok"){
    			var items = res.items;
    			var length=items.length;
    			for(var i=0;i<length&&i<showCount;i++){
    				var html = getZcsdHtml(i,items[i]);
    				$("#zcsdBox").append(html);
    			}
    			
    			if(length<=0){
    				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
    				$("#zcsdBox").append(nullHTML);
    			}
    		}else{
    			
    		}
    		
    		 var item = $("#listbox li");
             for (var i = 0; i < item.length; i++) {
                 if (i % 2 == 0) {
                     item[i].style.backgroundColor = "#f9fafd";
                 }
             }
        },
        error: function(data){
		
        }
    });
}
//查询通知公告方法
function queryTzggList(){
	if(hasLoadTzgg==true) return;
	hasLoadTzgg=true;
	var showCount = 10;
	var url=contPath+"/myCenterController/syTzgg.do";
	var params={};
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
        	if(res!=null){
        	//zngg
        	if(typeof(res.zngg)!="undefined"){
        		for(var i=0;i<res.zngg.length&&i<showCount;i++){
    				var html = getTzggHtml(i,res.zngg[i]);
    				$("#znggBox").append(html);
    			}
        	if(res.zngg.length<=0){
				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#znggBox").append(nullHTML);
			}else if(res.zngg.length>6){
				$('#znggDiv').addClass("news-container");
				$('#znggDiv').vTicker({ 
    					speed: 300,
    					pause: 3500,
					animation: 'fade',
					mousePause: false,
					showItems: 6
				});	
    				$('#znggDiv').height($('#znggDiv').height()+5)
			}
        	}else{
        		var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#znggBox").append(nullHTML);
        	}
        	
        	
        	//zcfg
        	if(typeof(res.zcfg)!="undefined"){
        		for(var i=0;i<res.zcfg.length&&i<showCount;i++){
    				var html = getTzggHtml(i,res.zcfg[i]);
    				$("#zcfgBox").append(html);
    			}
            	if(res.zcfg.length<=0){
    				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
    				$("#zcfgBox").append(nullHTML);
    			}else if(res.zcfg.length>6){
    				$('#zcfgDiv').addClass("news-container");
    				$('#zcfgDiv').vTicker({ 
    					speed: 300,
    					pause: 3500,
    					animation: 'fade',
    					mousePause: false,
    					showItems: 6
    				});	
    				$('#zcfgDiv').height($('#zcfgDiv').height()+5)
    			}
        	}else{
        		var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#zcfgBox").append(nullHTML);
        	}
        	
        	//zdss
        	if(typeof(res.zdss)!="undefined"){
        		for(var i=0;i<res.zdss.length&&i<showCount;i++){
    				var html = getTzggHtml(i,res.zdss[i]);
    				$("#zdssBox").append(html);
    			}
            	if(res.zdss.length<=0){
    				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
    				$("#zdssBox").append(nullHTML);
    			}else if(res.zdss.length>6){
    				$('#zdssDiv').addClass("news-container");
    				$('#zdssDiv').vTicker({ 
    					speed: 300,
    					pause: 3500,
    					animation: 'fade',
    					mousePause: false,
    					showItems: 6
    				});
    				$('#zdssDiv').height($('#zdssDiv').height()+5)
    			}
        	}else{
        		var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#zdssBox").append(nullHTML);
        	}
        	
        	//xydj
        	if(typeof(res.xydj)!="undefined"){
        		for(var i=0;i<res.xydj.length&&i<showCount;i++){
    				var html = getTzggHtml(i,res.xydj[i]);
    				$("#xydjBox").append(html);
    			}
            	if(res.xydj.length<=0){
    				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
    				$("#xydjBox").append(nullHTML);
    			}else if(res.xydj.length>6){
    				$('#xydjDiv').addClass("news-container");
    				$('#xydjDiv').vTicker({ 
    					speed: 300,
    					pause: 3500,
    					animation: 'fade',
    					mousePause: false,
    					showItems: 6
    				});	
    				$('#xydjDiv').height($('#xydjDiv').height()+5)
    			}
        	}else{
        		var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#xydjBox").append(nullHTML);
        	}
        	
        	//qsgg
        	if(typeof(res.qsgg)!="undefined"){
        		for(var i=0;i<res.qsgg.length&&i<showCount;i++){
    				var html = getTzggHtml(i,res.qsgg[i]);
    				$("#qsggBox").append(html);
    			}
            	if(res.qsgg.length<=0){
    				var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
    				$("#qsggBox").append(nullHTML);
    			}else if(res.qsgg.length>6){
    				$('#qsggDiv').addClass("news-container");
    				$('#qsggDiv').vTicker({ 
    					speed: 300,
    					pause: 3500,
    					animation: 'fade',
    					mousePause: false,
    					showItems: 6
    				});	
    			}
        	}else{
        		var nullHTML='<li style=\"text-align:center;\">暂无公告</li>';
				$("#qsggBox").append(nullHTML);
        	}
        	
        }
        },
        error: function(data){
		
        }
    });
}

//查询通知方法
function querySsTzList(){
	
	if(hasLoadWdtz==true) return;
	hasLoadWdtz=true;
	
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 5;
	var url=contPath+"/myCenterController/getSstz.do";
	var params={pageIndex: 1, pageSize: 5, "ydzt" : "N"};//默认获取未读数据
	
	$.ajax({
		type: "post",
		url: url,
		data: params,
		dataType: "json",
		success: function(data){
			var res = data;
			var html="";
			if(res.flag=="ok"){
				var items=res.items;
				var length=items.length;
				var wdCount=res.wdsum;
				$("#tzggDataList").find("li[name=trData]").remove();
				for(var i=0;i<length&&i<showCount;i++){
					var trHtml= getTzggTrHtml((i+1),items[i]);
					$("#tzggDataList").append(trHtml);
					
					if(showGdsbz=="N"){//配置表中配置的是否显示国地税标志为N的话，则隐藏国地税标志
						$(".ctrl2").hide();
    				}else if(showGdsbz=="Y"){
    					$(".ctrl2").show();
    				}
					
				}
				if(length<=0){
    				var nullHTML="<li name='trData' style='text-align:center;height:202px;line-height:202px;border-top: 1px solid #dddddd;'>暂无通知</li>";
    				$("#tzggDataList").append(nullHTML);
    			}else if(length<showCount){
					var nullHTML="";
					for(var i=0;i<(showCount-length);i++){
						nullHTML+="<li name='trData'></li>";
					}
					$("#tzggDataList").append(nullHTML);
				}
				
				
				if(wdCount>showCount){
					$("#tzggTotalCount").text(showCount);
					$("#tzggTotalCount").show();
				}else{
					if(wdCount > 0){
						$("#tzggTotalCount").text(wdCount);
						$("#tzggTotalCount").show();
					}
				}
				
//				$("#tzggTotalCount").html(res.recordCount);
			}else{
				//alert("加载数据失败！");
			}
		},
		error: function(data){
			/*var nullHTML="";
			var	showCount=6;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"</tr>";
			}
			$("#tzggDataList").append(nullHTML);*/
		}
	});
}

//待办事项行html
function getDbxxTrHtml(contextPath,items,showCount){
	var html = "";
	for(var i=0;i<items.length&&i<showCount; i++){
		var item = items[i];
		var cor="fontcolor01";//国地税颜色
		var gdsmc="";
		var url;
		/*if("G"==item.ly){
			gdsmc="<span class=\"fontcolor01\">[国税]</span>";
		}else if("D"==item.ly){
			gdsmc="<span class=\"fontcolor02\">[地税]</span>";
		}else if("GD"==item.ly){
			gdsmc="<span class=\"fontcolor03\">[国地]</span>";
		}*/
		
		//拼接url
		url =	contextPath  + item.url;
		var paramers = item.paramers;
		var ysqxxid = "";
		if(paramers != null){
			url=url+ "?";
			for(var j in paramers){
				if(j=="ysqxxid"){
					ysqxxid =  paramers[j];
				}
				if(paramers[j]!=null){
						url=url+ "&"+ j +"=" + paramers[j] ;
				}
				
				}
		}
		
		if(item.id!=null){
			url =url + "&mesSendId=" + item.id ;
		}
		
		var czlink="";
		/*czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\""+url+"\">办理</a></div>";*/
		
//		czlink="<div class=\"sbtnbox1\"><a href=\"#\" class=\"layui-btn layui-btn-primary layui-btn-xs\"  ly=\""+item.ly+ "\" id= \""+item.id+"\" url =\" " + url+  "\"ysqxxid=\""+ysqxxid+"\" isRead=\""+item.isRead+"\" isCompleted=\""+item.isCompleted+"\" onclick=\"updateDbsxZt(this)\">办理</a></div>";
		czlink="<button class=\"layui-btn layui-btn-xs\" style=\"width: 60px;\" ly=\""+item.ly+ "\" id= \""+item.id+"\" url =\" " + url+  "\"ysqxxid=\""+ysqxxid+"\" isRead=\""+item.isRead+"\" isCompleted=\""+item.isCompleted+"\" onclick=\"updateDbsxZt(this)\">办理</button>";
		
		
		if("true"==item.isExitWfxx){
			czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\"/web-fzfg/fzfg/wsInit.do?sbywbm=JYXZCF&swsxDm=SXA122030001&dzbzdszlDm=BDA1220074\">办理</a></div>";
			czlink="<button class=\"layui-btn layui-btn-xs\" style=\"width: 60px;\" onclick=\"goUrl('/web-fzfg/fzfg/wsInit.do?sbywbm=JYXZCF&swsxDm=SXA122030001&dzbzdszlDm=BDA1220074')\">办理</button>";
		}
		
		if("true"==item.isyhzxdb){
			gdsmc="<span class=\"fontcolor03\">[联合业务]</span>";
			if("/yhgl/service/um/enterprise/bsqxList" == item.url){
//				czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" href=\"#none\" onclick=\"window.parent.goPage('/yhgl/service/um/enterprise/bsqxList?cdId=932&gnDm=gndm-932','yhgl','yhsqgl','','');\">办理</a></div>";
				czlink="<button class=\"layui-btn layui-btn-xs\" style=\"width: 60px;\"  onclick=\"window.parent.goPage('/yhgl/service/um/enterprise/bsqxList?cdId=932&gnDm=gndm-932','yhgl','yhsqgl','','');\">办理</button>";
			}else{
//				czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\""+item.url+"\">办理</a></div>";
				czlink="<button class=\"layui-btn layui-btn-xs\" style=\"width: 60px;\" onclick=\"goUrl('"+item.url+"')\">办理</button>";
			}
		}
		
		
//		var sxsm="<div class=\"sbtnbox1\"><a href=\"javascript:void(0)\" class=\"sbtn sbtn01\"  content=\""+item.content+ "\" onclick=\"checkdb(this)\">查看</a></div>";
		
		
		var showtitle=subString(item.txbt,33);
		var winwidth=$(window.parent).width();	
		if(winwidth<1240){//1024下
			showtitle=subString(item.txbt,23);
		}
		
		html +="<tr name='trData'>";
		/*if(showGdsbz=="Y"){
			html+="<td class=\"ctrl2\">"+gdsmc+"</td>";
		}else if(showGdsbz=="N"){
			//不显示
		}else{
			html+="<td class=\"ctrl2\">"+gdsmc+"</td>";
		}*/
	          
	      html+="<td style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor:pointer;\" onclick='clickBl(this);' title='"+item.txbt+"'>"+showtitle+"</td>"
	          +"<td class=\"font-medium\">"+item.dbsj+"</td>"
	          +"<td class=\"font-red\">"+"未处理"+"</td>"
	          +"<td >"+czlink+"</td>"
	          +"</tr>";
		
	}
	
	
	return html;
}
//涉税提醒行html
function getSstxTrHtml(num,item){
	var cor="fontcolor01";//国地税颜色
	
	var liclass="";
	if(item.sxzt=="N"){
		liclass="bold";
	}
	
	//替换标题和提醒时间
	item.txnr = item.txnr.replace(/@@1/, item.bt);
	item.txnr = item.txnr.replace(/@@2/, item.txsj);
	
	//缴款状态不明提醒
	if("缴款状态不明提醒"==item.bt){
		item.txnr = jkztbmtx(item);
	}
	
	var html="<tr class=\""+liclass+"\" name='trData' id=\"sstx_li_"+(num)+"\">";
 

	var clickfun = "\"javaScript:";
	if(item.link=="Y"){
		clickfun+="openTxUrl('"+num+"','"+item.url+"','sstx');";
	}else{
		clickfun+="showTzggDetail('"+num+"','"+item.id+"','"+item.bt+"','sstx');";
	}
	
	if(item.groupMes=="Y"){
		clickfun+="\"";
	}else{
		clickfun+="updateSSxxzt('"+item.id+"','"+item.ly+"','SSTX','"+item.sxzt+"');\"";
	}
	
	html+="<td style=\"height:24px;\"><a title='"+item.bt+"' href="+clickfun+">"
			+subString(item.bt,60)+"</a></td><td>"+item.txsj+"</td>";
	
	html += 	"<td style=\"display:none\"><div class=\"\" style=\"display:none\" id=\"sstx_"+(num)+"\">"
	 +			"<div class=\"news_nav\" style=\"padding:20px\">"
	 +  			"<div class=\"news_cont\" style=\"border-top: 0px dashed #ddd;padding-top: 0px;\">"+item.txnr+"</div>"
	 +  		"</div>"
	 + 		"</div></td></tr>";
	return html;
}
//通知公告行html(我的通知
function getTzggTrHtml(num,item){
	var cor="";
	var ly="";
	if("G"==item.ly){
		cor="cor ctrl2";
		ly="国税";
	}else if("D"==item.ly){
		cor="ctrl2";
		ly="地税";
	}else if("GD"==item.ly){
		cor="cor1 ctrl2";
		ly="国地";
	}
	var liclass="";
	if("N"==item.isyd){
		liclass="bold";
		//sstzWdCount++;
	}
	
	//替换标通知题和通知日期
	item.tznr = item.tznr.replace(/@@1/, item.tzbt);
	item.tznr = item.tznr.replace(/@@2/, item.tzsj);
	
	var html="<li class=\""+liclass+"\" name='trData' id=\"tzgg_li_"+(num)+"\">";
	if(showGdsbz=="Y"){
		html+="<span class='"+cor+"'>["+ly+"]</span>";
	}else if(showGdsbz=="N"){
		//不显示
	}else{
		html+="<span class='"+cor+"'>["+ly+"]</span>";
	}
	
	
	html+="<a href=\"javascript:showTzggDetail('"+num+"','"+item.tzid+"','"+item.tzbt+"','tzgg');" 
			+"updateSSxxzt('"+item.tzid+"','"+item.ly+"','SSTZ','"+item.tzzt+"');\" title='"+item.tzbt+"'>"
			+subString(item.tzbt,60)+"</a><p>"+item.tzsj+"</p></li>";
	html += 	"<div class=\"\" style=\"display:none\" id=\"tzgg_"+(num)+"\">"
		 +			"<div class=\"news_nav\" style=\"padding:20px\">"
		 +  			"<div class=\"news_cont\" style=\"border-top: 0px dashed #ddd;padding-top: 0px;\">"+item.tznr+"</div>"
		 +  		"</div>"
		 + 		"</div>";
	return html;
}

//政策速递html
function getZcsdHtml(num,item){
	var html ="";
	if(item.link=="Y"){
		//仅作为链接
		html = "<li><a href=\""+item.url+"\" target=\"_blank\">"+item.ggbt+"</a><span>"+item.fbsj+"</span></li>";
	}else{
		html = "<li><a href=\"javascript:showGgxx('"+num+"','"+item.ggbt+"')\" >"+item.ggbt+"</a><span>"+item.fbsj+"</span></li>";
	}
	
	html += 	"<div class=\"\" style=\"display:none\" id=\"gg_"+(num)+"\">"
	 +			"<div class=\"news_nav\" style=\"padding:20px\">"
	 +  			"<div class=\"news_cont\" style=\"border-top: 0px dashed #ddd;padding-top: 0px;\">"+item.ggnr+"</div>"
	 +  		"</div>"
	 + 		"</div>";
	return html;
}

//通知公告html
function getTzggHtml(i,item){
	var bznr="";//标注
	var btmc=item.btmc;
	
	//有标注内容
	if(typeof item.bz != "undefined" && item.bz !=null && item.bz !=""){
		bznr = "<span style='color:red;position:relative;'>"+'【'+ item.bz +'】'+"</span>";
	}
	//标题标红
	if(item.bh == "1"){
		btmc = "<span style='color:red;position:relative;'>"+btmc+"</span>" 
	}
	
	if(i%2==0){
		var html = "<li style='background-color:#f9fafd;height:47px;'><a href=\""+item.url+"\" target=\"_blank\">"+btmc+bznr+"</a><span>"+item.fbsj+"</span></li>";
	}else{
		var html = "<li style='height:47px;'><a href=\""+item.url+"\" target=\"_blank\">"+btmc+bznr+"</a><span>"+item.fbsj+"</span></li>";
	}
	return html;
}

//展示公告信息
function showGgxx(num,ggbt){
	window.parent.showBszmDetail(ggbt,$("#"+"gg_"+num).html());
}

//截取字符串
function subString(str,len){
	if(str.length>len){
		return str.substring(0,len);
	}
	return str;
}

function checkdb(obj){
	layer.alert($(obj).attr("content"), {title : "事项说明",offset: '50px',area: '600px'});
	
}

function updateDbsxZt(obj){
	var requesturl =context_path + "/xxmh/myCenterController/updateDbsxZt.do";
	$.ajax({
		type : "post",
		data : {"ysqxxid":$(obj).attr("ysqxxid"),"ly":$(obj).attr("ly"),"isRead":$(obj).attr("isRead"),"isCompleted":$(obj).attr("isCompleted")},
		url : requesturl,
		dataType : "json",
		success : function(data){
			
			if("Y" == data.isSuccess){		//更新待办事项状态成功，页面跳转
				window.open($(obj).attr("url"));
			}else{
				if(data.isRead1!=null&&data.isCompleted1!=null){
					var clzt = "";
					if(data.isRead1=="N"&&data.isCompleted1=="N"){
						clzt="未处理";
					}else if(data.isRead1=="Y"&&data.isCompleted1=="N"){
						clzt="处理中";
					}else if(data.isRead1=="Y"&&data.isCompleted1=="Y"){
						clzt="已处理";
					}
					
				if($(obj).attr("isRead")==data.isRead1&&$(obj).attr("isCompleted")==data.isCompleted1){
					layer.alert("更新待办事项状态失败", {title:"提示",icon: 5,offset:150});
				}else{
					layer.alert("该待办事项状态已发生改变，请刷新页面，当前状态为："+clzt, {title:"提示",icon: 5,offset:150});
				}
				
				}else{
					layer.alert("更新待办事项状态失败", {title:"提示",icon: 5,offset:150});
				}
				}
		},
		error: function(data){
			layer.alert("调用updateDbsxZt.do失败", {title:"提示",icon: 5,offset:150});
		}
	});
	}

//缴款状态不明提醒内容封装
function jkztbmtx(item){
	var unlockJkxx = item.txnr;
	var mxxxs = JSON.parse(unlockJkxx);

	//缴款状态不明的提醒内容拼装
	var jkxxMbStart = 	'<div id="div_unlockxx">' +
					'	<table width="100%" border="0" cellpadding="0" cellspacing="0" class="top_title">' +
					'	  <tr>' +
			  		'			<td><div class="big_title">扣款状态不明处理结果</div></td>' +
					'	  </tr>' +
					'	</table>' +
				   	'	<div class="user_box01" style="overflow-x:auto;">' +
					'		<div class="searchbox">' +
					'			<div class="searchTable">' +
					'				<table width="100%" border="0" cellspacing="0" cellpadding="0" id="unlockxxGrid">' +
					'					<tbody>' +
					'						<tr>';
		if(showGdsbz=="Y"){
			jkxxMbStart+='							<th width="60">国地标志</th>';
		}else if(showGdsbz=="N"){
			//不显示
		}else{
			jkxxMbStart+='							<th width="60">国地标志</th>';
		}
		jkxxMbStart+='							<th>税款缴纳方式</th>' +
					 '							<th>电子税票号码</th>' +
					 '							<th>扣款返回码</th>' +
					 '							<th>扣款返回信息</th>' +							
					 '						</tr>' +
					 '					</tbody>' ;
	var trs = "";
	var lyFlag = item.ly;
	for(var j in mxxxs){
		var mxxx=mxxxs[j];
		var dzsphm = mxxx["dzsphm"];
		var kkfhDm = mxxx["kkfhDm"];
		var kkfhmc = mxxx["kkfhmc"];
		var unLockType = mxxx["unLockType"];
		trs+="<tr>";
		if(showGdsbz=="Y"){
			if("D" == lyFlag){
				trs+="<td align=\"center\"><span class=\"fontcolor02\">地税</span><span class=\"fontcolor02\"></span></td>";
			}else{
				trs+="<td align=\"center\"><span class=\"fontcolor01\"></span><span class=\"fontcolor01\">国税</span></td>";
			}
		}else if(showGdsbz=="N"){
			
		}else{
			if("D" == lyFlag){
				trs+="<td align=\"center\"><span class=\"fontcolor02\">地税</span><span class=\"fontcolor02\"></span></td>";
			}else{
				trs+="<td align=\"center\"><span class=\"fontcolor01\"></span><span class=\"fontcolor01\">国税</span></td>";
			}
		}
		
		trs+="<td align=\"center\"><span name='unLockType' >"+unLockType+"</span></td>";
		trs+="<td align=\"center\"><span name='dzsphm'>"+dzsphm+"</span></td>";
		trs+="<td align=\"center\"><span name='kkfhDm'>"+kkfhDm+"</span></td>";
		trs+="<td align=\"center\"><span name='kkfhmc' >"+kkfhmc+"</span></td>";
		trs+="</tr>"
	}
	
	var jkxxMbEnd = '				</table>' +
				'			</div>   ' +
				'		</div>' +
				'	</div>' +
				'</div>' ;
		
	return jkxxMbStart + trs + jkxxMbEnd;
}


//展示通知通过详细内容
function showTzggDetail(num,tzid,tzbt,type){
	if($("#"+type+"_li_"+num).hasClass("bold")){
		$("#"+type+"_li_"+num).removeClass("bold");
		var wds = $("#"+type+"TotalCount").text();
		if(wds>0)wds=wds-1;
		$("#"+type+"TotalCount").text(wds);
		if(wds==0){
			$("#"+type+"TotalCount").hide();
		}
	}
//		window.parent.showBszmDetail(tzbt,$("#"+type+"_"+num).html().replace(/\n/g, "<br />"));
	//解决IE8显示样式问题
	window.parent.showBszmDetail(tzbt,$("#"+type+"_"+num).html());
}

//打开url
function openTxUrl(num,url,type){
	if($("#"+type+"_li_"+num).hasClass("bold")){
		$("#"+type+"_li_"+num).removeClass("bold");
		var wds = $("#"+type+"TotalCount").text();
		if(wds>0)wds=wds-1;
		$("#"+type+"TotalCount").text(wds);
		if(wds==0){
			$("#"+type+"TotalCount").hide();
		}
	}
	
	window.open(url);
}
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

//更新涉税信息状态，提醒，通知
function updateSSxxzt(xxid,ly,xxlx,xxzt){
	if("Y"==xxzt)return;
	var requesturl = "/xxmh/myCenterController/updateSsxxZt.do";
	$.post(requesturl,{ 
		xxid:xxid,
		ly:ly,
		xxlx:xxlx
	},function(data){
		//var result = eval("("+data+")");
	});
}
//增加（全体/范围）消息阅读记录
function insertMesReadRec(xxid,ly,xxzt){
	if("Y"==xxzt)return;
	var requesturl = "/xxmh/myCenterController/insertMesReadRec.do";
	$.post(requesturl,{ 
		xxid:xxid,
		ly:ly
	},function(data){
		//var result = eval("("+data+")");
	});
}

//待办点击办理
function clickBl(obj){
	$(obj).parent().find("td:eq(3) button").click();
}

//上三个月当天日
function getLast3MonDate(){
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth()+1;//当前月份
	var preMonth = month-3;//前三个月份
	var date = myDate.getDate();
	
	//如果当前月份是1,2,3月，年份取上年
	if(month==1){
		year = year-1;
		preMonth = 10;
	}
	if(month==2){
		year = year-1;
		preMonth = 11;
	}
	if(month==3){
		year = year-1;
		preMonth = 12;
	}
	var preSize = new Date(year,preMonth,0).getDate(); //前三个月份的天数
	if(date>preSize){
		preMonth = preMonth+1;
		date = 1;
	}

	if(preMonth<10){
		preMonth="0"+preMonth;
	}
	if(date<10){
		date="0"+date;
	}
	return year+"-"+preMonth+"-"+date;
}

Date.prototype.Format = function (fmt) { 
	var o = {
	    "M+": this.getMonth() + 1, //月份 
	    "d+": this.getDate(), //日 
	    "h+": this.getHours(), //小时 
	    "m+": this.getMinutes(), //分 
	    "s+": this.getSeconds(), //秒 
	    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	    "S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    	return fmt;
	}