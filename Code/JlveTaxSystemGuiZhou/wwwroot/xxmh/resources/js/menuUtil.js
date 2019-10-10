var isQyyh = "";//是企业用户
var isZrrDj = "N";//自然人登记
var ZgswkfjDm;//主管税务科分局代码
var dqdm;//地区代码
var qymenu_Array_type1 = ["我的信息","我要办税","我要查询","互动中心","个性服务"];//图标方式排列
var qymenu_Array_type2 = ["公众服务"];//分类方式排列
var grmenu_Array_type1 = ["我的信息","我要办税","互动中心","个性服务"];//图标方式排列
var grmenu_Array_type2 = ["我要查询","公众服务"];//分类方式排列
var dlqmenu_Array_type1 = ["我的信息","我要办税","我要查询","互动中心","个性服务"];//图标方式排列
var dlqmenu_Array_type2 = ["公众服务"];//分类方式排列


function getLoginMenus(){
	$.ajax({
        type: "post",
        url: contPath+"/sycdController/getCd.do",
        dataType: "json",
        success: function(data){
        	var hasLogined = data.hasLogined;
        	var isZrrsfJr = data.isZrrsfJr;
        	if(hasLogined == "Y"){
        		if(isZrrsfJr == "N"){
            		handleQydesktop();
            		getLoginQyMenus(data);
            	}else if(isZrrsfJr == "Y"){
            		handleZrrdesktop();
            		getLoginZrrMenus(data);
            	}
        		initCygn();
        	}else{
        		handleDlqdesktop();
        		getDlqMenus(data);
        	}
        	//定位我的信息、我要办税、我要查询、互动中心、公众服务
        	var tabTitle = getURLParameter("tabTitle");
        	if(tabTitle!=null&&tabTitle!=""&&$('#'+tabTitle).length>0){
        		$('#'+tabTitle).click();
        		//把对应的id存入cookie,返回时切换到对应标签，目前取值在portal.js
        		var storage=window.localStorage;
        		storage.setItem("tabTitle",tabTitle);
        	}
        }
	});
}

/**
 * 企业登录菜单
 * @param data
 * @returns
 */
function getLoginQyMenus(data){
	for(var qysycdnum in data.menus.yhGncds){
		var menu = data.menus.yhGncds[qysycdnum];
		if(menu.cdid == "qysycd-l"){//企业首页菜单-左侧
			//TODO leftmenus的栏目也改成配置，当前是固定常用功能、套餐业务、特色业务三个
			for(var leftmenuNum in menu.yhGncds){//leftmenus--常用功能、套餐业务、特色业务
				var html = "";
				var leftmenu = menu.yhGncds[leftmenuNum];
				html += "<ul>";
				if(leftmenu.yhGncds.length>0){
					for(var secnum in leftmenu.yhGncds){
		    			var secmenu = leftmenu.yhGncds[secnum];
		    			if(secmenu.hasOwnProperty("realUrl")){
		    				if(secmenu.hasOwnProperty("sycddkfs")){
		    					if(secmenu.sycddkfs=="0"){// 本页跳转打开
			            			html +="<li><a href='#' onclick='goUrl(\""+secmenu.realUrl+"\")'>";
			            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
			            			html +="<li><a href='#' onclick='goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
			            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else{
			            			//默认新窗口打开
			            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}
		    				}else{
		    					//没有设置首页菜单打开方式 默认新窗口打开
		    					html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
		    				}
		        		}else{
		        			html +="<li><a href='#'>";
		        		}
		    			html += secmenu.cdmc + "</a></li>";
		    		}
				}else{
					//没有就空1行
					html +="<li></li>";
				}
				html +="</ul>";
				$('.menusDiv-l').eq(leftmenuNum).html(html);
			}
			
		}else if(menu.cdid == "qysycd-r"){//企业首页菜单-右侧
			//TODO rightmenus的栏目也改成配置，当前是固定我的信息、我要办税、我要查询、互动中心、公众查询五个
			for(var rightmenuNum in menu.yhGncds){//rightmenus--我的信息、我要办税、我要查询、互动中心、公众查询
				var html = "";
				var rightmenu = menu.yhGncds[rightmenuNum];
				if($.inArray(rightmenu.cdmc, qymenu_Array_type1)>-1){
					var rownum = 33;//每行摆放图标个数
					var showrow = 1;//显示行数
					var menunum = rightmenu.yhGncds.length;//菜单总个数
					var rowsum = Math.ceil(rightmenu.yhGncds.length/rownum);//行数
					var row = rowsum <= showrow ? rowsum : showrow;
					
					for(var i=0;i<row;i++){
						html +="<div class=\"layui-row tabico\">";
						
						for(var j=i*rownum;j<menunum&&j<(i+1)*rownum;j++){
							var secmenu = rightmenu.yhGncds[j];
							html +="<div class=\"itme-icon\">";
							if(secmenu.hasOwnProperty("realUrl")){
								if(secmenu.hasOwnProperty("sycddkfs")){
									if(secmenu.sycddkfs=="0"){// 本页跳转打开
				            			html +="<a href='#' onclick='goUrl(\""+secmenu.realUrl+"\")'>";
				            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
				            			html +="<a href='#' onclick='goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
				            			html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else{
				            			html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}
								}else{
									html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
								}
			        		}else{
			        			html +="<a href='#'>";
			        		}
							html +="<div class=\"imgbox\"><img src=\"/xxmh/resources/images/newimg/"+secmenu.cdtb+".png\"></div>";
							html +="<h4>"+ secmenu.cdmc +"</h4></a></div>";
						}
						html+="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}else if($.inArray(rightmenu.cdmc, qymenu_Array_type2)>-1){
					//公众服务
					var showrow = 1;//显示行数
					var rownum = 2;//每行摆放模块数
					var menunum = rightmenu.yhGncds.length;
					for(var i=0;i<showrow;i++){
						html +="<div class=\"layui-row\">";
						for(var j=i*rownum; j<menunum && j<(i+1)*rownum; j++){
							var secmenu = rightmenu.yhGncds[j];
							var showThirdNum = 8;//三级显示数量
							var thirdNum = secmenu.yhGncds.length;//三级数量
							html+="<div class=\"layui-col-md6\"><div class=\"gzfwbox\"><div class=\"title ttbg"+(j%2+1)+"\">";
							html+="<span class=\"con-"+(j%2+1)+"\">";
							html+="<img src=\"/xxmh/resources/images/newimg/"+ secmenu.cdtb +".png\">"+ secmenu.cdmc +"</span></div>";
							html+="<ul class=\"listcon\">";
							for(var k=0;k<thirdNum && k<showThirdNum;k++){
								var thirdmenu = secmenu.yhGncds[k];
								if(thirdmenu.hasOwnProperty("realUrl")){
									if(thirdmenu.hasOwnProperty("sycddkfs")){
										if(thirdmenu.sycddkfs=="0"){// 本页跳转打开
					            			html +="<li><a href='#' onclick='goUrl(\""+thirdmenu.realUrl+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="1"){// 从旧门户页面打开
					            			html +="<li><a href='#' onclick='goIndexUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.topMenu+"\",\""+thirdmenu.subCdtb+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="2"){// 新页面打开
					            			html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else{
					            			html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}
									}else{
										html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
									}
				            		
				        		}else{
				        			html +="<li><a href='#'>";
				        		}
								html+="<i class=\"layui-icon layui-icon-triangle-r\"></i>";
								html+=thirdmenu.cdmc;
								html+="</a></li>";
							}
							html+="</ul></div></div>";
						}
						html +="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}
				
					
			}
		}
		
	}
}

/**
 * 自然人登录菜单
 * @param data
 * @returns
 */
function getLoginZrrMenus(data){
	
	for(var grsycdnum in data.menus.yhGncds){
		var menu = data.menus.yhGncds[grsycdnum];
		if(menu.cdid == "grsycd-l"){//个人首页菜单-左侧
			//TODO leftmenus的栏目也改成配置，当前是固定常用功能、套餐业务、特色业务三个
			for(var leftmenuNum in menu.yhGncds){//leftmenus--常用功能、套餐业务、特色业务
				var html = "";
				var leftmenu = menu.yhGncds[leftmenuNum];
				html += "<ul>";
				if(leftmenu.yhGncds.length>0){
					for(var secnum in leftmenu.yhGncds){
		    			var secmenu = leftmenu.yhGncds[secnum];
		    			if(secmenu.hasOwnProperty("realUrl")){
		    				var smbsHtml="";
		    				if(secmenu.hasOwnProperty("smbsbz") && secmenu.smbsbz=="Y"){
		        				//需要校验自然人登记信息
		    					smbsHtml+="if(jyZrrdjxx()) ";
		        			}
		    				if(secmenu.hasOwnProperty("sycddkfs")){
		    					if(secmenu.sycddkfs=="0"){// 本页跳转打开
			            			html +="<li><a href='#' onclick='"+smbsHtml+"goUrl(\""+secmenu.realUrl+"\")'>";
			            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
			            			html +="<li><a href='#' onclick='"+smbsHtml+"goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
			            			html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else{
			            			//默认新窗口打开
			            			html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}
		    				}else{
		    					//没有设置首页菜单打开方式 默认新窗口打开
		    					html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
		    				}
		        		}else{
		        			html +="<li><a href='#'>";
		        		}
		    			html += secmenu.cdmc + "</a></li>";
		    		}
				}else{
					//没有就空1行
					html +="<li></li>";
				}
				
				html +="</ul>";
				$('.menusDiv-l').eq(leftmenuNum).html(html);
			}
			
		}else if(menu.cdid == "grsycd-r"){//个人首页菜单-右侧
			//TODO rightmenus的栏目也改成配置，当前是固定我的信息、我要办税、我要查询、互动中心、公众查询五个
			for(var rightmenuNum in menu.yhGncds){//rightmenus--我的信息、我要办税、我要查询、互动中心、公众查询
				var html = "";
				var rightmenu = menu.yhGncds[rightmenuNum];
				if($.inArray(rightmenu.cdmc, grmenu_Array_type1)>-1){
//					$('.menusDiv-r').eq(rightmenuNum).addClass("noNextTab");
					var rownum = 33;//每行摆放图标个数
					var showrow = 1;//显示行数
					var menunum = rightmenu.yhGncds.length;//菜单总个数
					var rowsum = Math.ceil(rightmenu.yhGncds.length/rownum);//行数
					var row = rowsum <= showrow ? rowsum : showrow;
					
					for(var i=0;i<row;i++){
						html +="<div class=\"layui-row tabico\">";
						for(var j=i*rownum;j<menunum&&j<(i+1)*rownum;j++){
							var secmenu = rightmenu.yhGncds[j];
							html +="<div class=\"itme-icon\">";
							if(secmenu.hasOwnProperty("realUrl")){
								var smbsHtml="";
			    				if(secmenu.hasOwnProperty("smbsbz") && secmenu.smbsbz=="Y"){
			        				//需要校验自然人登记信息
			    					smbsHtml+="if(jyZrrdjxx()) ";
			        			}
								if(secmenu.hasOwnProperty("sycddkfs")){
									if(secmenu.sycddkfs=="0"){// 本页跳转打开
				            			html +="<a href='#' onclick='"+smbsHtml+"goUrl(\""+secmenu.realUrl+"\")'>";
				            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
				            			html +="<a href='#' onclick='"+smbsHtml+"goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
				            			html +="<a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else{
				            			html +="<a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}
								}else{
									html +="<a href='#' onclick='"+smbsHtml+"openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
								}
			        		}else{
			        			html +="<a href='#'>";
			        		}
							html +="<div class=\"imgbox\"><img src=\"/xxmh/resources/images/newimg/"+secmenu.cdtb+".png\"></div>";
							html +="<h4>"+ secmenu.cdmc +"</h4></a></div>";
						}
						html+="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}else if($.inArray(rightmenu.cdmc, grmenu_Array_type2)>-1){
					//我要查询、公众服务 
					var showrow = 1;//显示行数
					var rownum = 2;//每行摆放模块数
					var menunum = rightmenu.yhGncds.length;
					if(rightmenu.cdmc=="我要查询"){
						$('.menusDiv-r').eq(rightmenuNum).addClass("noNextTab");//自然人没有待办提醒
						showrow = 2;
					}
					
					for(var i=0;i<showrow;i++){
						html +="<div class=\"layui-row\">";
						for(var j=i*rownum; j<menunum && j<(i+1)*rownum; j++){
							var secmenu = rightmenu.yhGncds[j];
							var showThirdNum = 8;//三级显示数量
							var thirdNum = secmenu.yhGncds.length;//三级数量
							html+="<div class=\"layui-col-md6\"><div class=\"gzfwbox\"><div class=\"title ttbg"+(j%2+1)+"\">";
							html+="<span class=\"con-"+(j%2+1)+"\">";
							html+="<img src=\"/xxmh/resources/images/newimg/"+ secmenu.cdtb +".png\">"+ secmenu.cdmc +"</span></div>";
							html+="<ul class=\"listcon\">";
							for(var k=0;k<thirdNum && k<showThirdNum;k++){
								var thirdmenu = secmenu.yhGncds[k];
								if(thirdmenu.hasOwnProperty("realUrl")){
									var smbsHtml="";
				    				if(secmenu.hasOwnProperty("smbsbz") && secmenu.smbsbz=="Y"){
				        				//需要校验自然人登记信息
				    					smbsHtml+="if(jyZrrdjxx()) ";
				        			}
									if(thirdmenu.hasOwnProperty("sycddkfs")){
										if(thirdmenu.sycddkfs=="0"){// 本页跳转打开
					            			html +="<li><a href='#' onclick='"+smbsHtml+"goUrl(\""+thirdmenu.realUrl+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="1"){// 从旧门户页面打开
					            			html +="<li><a href='#' onclick='"+smbsHtml+"goIndexUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.topMenu+"\",\""+thirdmenu.subCdtb+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="2"){// 新页面打开
					            			html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else{
					            			html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}
									}else{
										html +="<li><a href='#' onclick='"+smbsHtml+"openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
									}
				            		
				        		}else{
				        			html +="<li><a href='#'>";
				        		}
								html+="<i class=\"layui-icon layui-icon-triangle-r\"></i>";
								html+=thirdmenu.cdmc;
								html+="</a></li>";
							}
							html+="</ul></div></div>";
						}
						html +="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}
			}
		}
		
	}
	
}

/**
 * 登录前菜单
 * @param data
 * @returns
 */
function getDlqMenus(data){
	
	for(var dlqsycdnum in data.menus.yhGncds){
		var menu = data.menus.yhGncds[dlqsycdnum];
		if(menu.cdid == "dlqsycd-l"){//登录前首页菜单-左侧
			//TODO leftmenus的栏目也改成配置，当前是固定常用功能、套餐业务、特色业务三个
			for(var leftmenuNum in menu.yhGncds){//leftmenus--常用功能、套餐业务、特色业务
				var html = "";
				var leftmenu = menu.yhGncds[leftmenuNum];
				html += "<ul>";
				if(leftmenu.yhGncds.length>0){
					for(var secnum in leftmenu.yhGncds){
		    			var secmenu = leftmenu.yhGncds[secnum];
		    			if(secmenu.hasOwnProperty("realUrl")){
		    				if(secmenu.hasOwnProperty("sycddkfs")){
		    					if(secmenu.sycddkfs=="0"){// 本页跳转打开
			            			html +="<li><a href='#' onclick='goUrl(\""+secmenu.realUrl+"\")'>";
			            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
			            			html +="<li><a href='#' onclick='goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
			            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}else{
			            			//默认新窗口打开
			            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
			            		}
		    				}else{
		    					//没有设置首页菜单打开方式 默认新窗口打开
		    					html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
		    				}
		        		}else{
		        			html +="<li><a href='#'>";
		        		}
		    			html += secmenu.cdmc + "</a></li>";
		    		}
				}else{
					//没有就空1行
					html +="<li></li>";
				}
				html +="</ul>";
				$('.menusDiv-l').eq(leftmenuNum).html(html);
			}
			
		}else if(menu.cdid == "dlqsycd-r"){//登录前首页菜单-右侧
			//TODO rightmenus的栏目也改成配置，当前是固定我的信息、我要办税、我要查询、互动中心、公众查询五个
			for(var rightmenuNum in menu.yhGncds){//rightmenus--我的信息、我要办税、我要查询、互动中心、公众查询
				var html = "";
				var rightmenu = menu.yhGncds[rightmenuNum];
				if($.inArray(rightmenu.cdmc, dlqmenu_Array_type1)>-1){
					$('.menusDiv-r').eq(rightmenuNum).addClass("noNextTab");
					var rownum = 33;//每行摆放图标个数
					var showrow = 1;//显示行数
					var menunum = rightmenu.yhGncds.length;//菜单总个数
					var rowsum = Math.ceil(rightmenu.yhGncds.length/rownum);//行数
					var row = rowsum <= showrow ? rowsum : showrow;
					
					for(var i=0;i<row;i++){
						html +="<div class=\"layui-row tabico\">";
						for(var j=i*rownum;j<menunum&&j<(i+1)*rownum;j++){
							var secmenu = rightmenu.yhGncds[j];
							html +="<div class=\"itme-icon\">";
							if(secmenu.hasOwnProperty("realUrl")){
								if(secmenu.hasOwnProperty("sycddkfs")){
									if(secmenu.sycddkfs=="0"){// 本页跳转打开
				            			html +="<a href='#' onclick='goUrl(\""+secmenu.realUrl+"\")'>";
				            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
				            			html +="<a href='#' onclick='goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
				            			html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}else{
				            			html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
				            		}
								}else{
									html +="<a href='#' onclick='openUrl(\""+secmenu.realUrl+"\",\""+secmenu.qxkzsx+"\")'>";
								}
			        		}else{
			        			html +="<a href='#'>";
			        		}
							html +="<div class=\"imgbox\"><img src=\"/xxmh/resources/images/newimg/"+secmenu.cdtb+".png\"></div>";
							html +="<h4>"+ secmenu.cdmc +"</h4></a></div>";
						}
						html+="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}else if($.inArray(rightmenu.cdmc, dlqmenu_Array_type2)>-1){
					//公众服务 
					var showrow = 1;//显示行数
					var rownum = 2;//每行摆放模块数
					var menunum = rightmenu.yhGncds.length;
					
					for(var i=0;i<showrow;i++){
						html +="<div class=\"layui-row\">";
						for(var j=i*rownum; j<menunum && j<(i+1)*rownum; j++){
							var secmenu = rightmenu.yhGncds[j];
							var showThirdNum = 8;//三级显示数量
							var thirdNum = secmenu.yhGncds.length;//三级数量
							html+="<div class=\"layui-col-md6\"><div class=\"gzfwbox\"><div class=\"title ttbg"+(j%2+1)+"\">";
							html+="<span class=\"con-"+(j%2+1)+"\">";
							html+="<img src=\"/xxmh/resources/images/newimg/"+ secmenu.cdtb +".png\">"+ secmenu.cdmc +"</span></div>";
							html+="<ul class=\"listcon\">";
							for(var k=0;k<thirdNum && k<showThirdNum;k++){
								var thirdmenu = secmenu.yhGncds[k];
								if(thirdmenu.hasOwnProperty("realUrl")){
									if(thirdmenu.hasOwnProperty("sycddkfs")){
										if(thirdmenu.sycddkfs=="0"){// 本页跳转打开
					            			html +="<li><a href='#' onclick='goUrl(\""+thirdmenu.realUrl+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="1"){// 从旧门户页面打开
					            			html +="<li><a href='#' onclick='goIndexUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.topMenu+"\",\""+thirdmenu.subCdtb+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else if(thirdmenu.sycddkfs=="2"){// 新页面打开
					            			html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}else{
					            			html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
					            		}
									}else{
										html +="<li><a href='#' onclick='openUrl(\""+thirdmenu.realUrl+"\",\""+thirdmenu.qxkzsx+"\")'>";
									}
				            		
				        		}else{
				        			html +="<li><a href='#'>";
				        		}
								html+="<i class=\"layui-icon layui-icon-triangle-r\"></i>";
								html+=thirdmenu.cdmc;
								html+="</a></li>";
							}
							html+="</ul></div></div>";
						}
						html +="</div>";
					}
					$('.menusDiv-r').eq(rightmenuNum).html(html);
				}
			}
		}
		
	}
	
}

/**
 * 企业桌面操作
 * @returns
 */
function handleQydesktop(){
	$(".nexttab1").show();
	$("#userBtn").show();//用户信息
	$("#tcBtn").before("<p>|</p>")
	$("#tcBtn").show();//退出按钮
//	$("#qhsfBtn").show();//切换身份按钮
//	$("#zztsfqhBtn").show();//子主体身份切换按钮
	//切换tabs，子tabs跟着切换
	$(".showtab1").click(function(){
		$(".nexttab2").hide();
		$(".nexttab1").show();
	});
	$(".showtab2").click(function(){
		$(".nexttab1").hide();
		$(".nexttab2").show();
	});
	//查询待办信息
	queryDbxxList();
	//查询提醒信息
	querySstxList();
	//查询政策速递
//	queryZcsdList();
	//查询通知公告
	queryTzggList();
}

/**
 * 自然人桌面操作
 * @returns
 */
function handleZrrdesktop(){
	$(".nexttab1").show();
	$("#userBtn").show();//用户信息
	$("#tcBtn").before("<p>|</p>")
	$("#tcBtn").show();//退出按钮
//	$("#qhsfBtn").show();//切换身份按钮
	isZrrsfJr();//是否自然人
	//切换tabs，子tabs跟着切换
	$(".showtab1").click(function(){
		$(".nexttab2").hide();
		if("wycxTab" != $(this).attr('id')){
			$(".nexttab1").show();
		}else{
			$(".nexttab1").hide();
		}
	});
	$(".showtab2").click(function(){
		$(".nexttab1").hide();
		$(".nexttab2").show();
	});
	//查询通知公告
	queryTzggList();
}

/**
 * 登录前桌面操作
 * @returns
 */
function handleDlqdesktop(){
	$("#cygnsz").hide();
    
	$("#zyBtn").show();//返回首页按钮
	$("#dlbox").show();//登录按钮
	$(".loginbefore").css("margin-right","60px");
	//登录前移除滑动切换事件,点击登录
	$("#topTabs>.layui-tab-title>li").off("mouseenter");
	//切换tabs，子tabs跟着切换
	$(".showtab1").click(function(){
		$("#topTabs").removeClass("layui-tab");
		login();
//		$(".nexttab2").hide();
//		$(".nexttab1").show();
	});
	$(".showtab2").click(function(){
		$(".nexttab1").hide();
		$(".nexttab2").show();
	});
	$(".nexttab1").hide();
	
	//查询通知公告
	queryTzggList();
}


/*
 * 自然人校验相关
 */



//判断是否自然人登录
function isZrrsfJr(){
	$.post(contPath+"/portalSer/isZrrsfJr.do?t="+new Date().getTime(),{},function(d){
		var res = eval("("+d+")");
		var isZrrsfJr=res.isZrrsfJr;
		var isThirdFlag = res.isThirdFlag;
		var yhm=res.yhm;
		// added at 2017.11.22 增加备选用户名的显示
		if( null !== res.bxyhm && '' !== res.bxyhm && undefined !== res.bxyhm){
			yhm += "(&nbsp;"+ res.bxyhm + "&nbsp;)";
		}
		
		var nsrsbh=res.nsrsbh;
		var djxh=res.djxh;
		var zjh=res.zjh;
		var yhqymc=res.yhqymc;
		dqdm=res.dqdm;
		if(null!=res.isZrrDj){
			//已做自然人登记
			isZrrDj=res.isZrrDj;
		}
		//山东--主管税务机关分配信息
		if(null!=res.ZgswkfjDm){
			ZgswkfjDm=res.ZgswkfjDm;
		}
		isQyyh = res.isqyyh;
		
		
		if(res.flag=="ok" && res.isZrrsfJr == "Y"){//以自然人身份登录
			if(zjh==null || zjh==""){//证件号码为空，则提醒用户完善个人信息，点击确定，进入个人信息修改页面
				//TODO 等统一组件
				layer.open({
					content: "未绑定个人身份，不能办理个人业务，请点击确定按钮进行绑定。"
					,btn: ['确定']
					,yes: function(index, layero){
						layer.close(index);
						if(hasYhgl=="Y"){
							goIndexUrl('','yhgl','smzsq');//实名制申请
						}else{
							layer.alert('用户未分配用户权限！', {icon: 5});
						}
					}  
				});
			}
		}
	});
}


//校验自然人登录信息
function jyZrrdjxx(){
	//判断自然人地税登记信息
	if("Y"==isZrrDj){
		return true;
	}else{
		layer.alert("自然人登记信息不完整，请补全信息后再办理本业务。", {title : "提示",icon : 5},
			function(index){
				layer.close(index);
				openUrl('/sxsq-cjpt-web/biz/sxsq/zrrdj?swsxDm=SXA011010004&gdslxDm=2&yhlx=0&sfzym=1');//实名制申请
		});
		return false;
	}
}



/**
 * 常用功能设置
 */
var defaultHtml="";
function initCygn() {
	if(defaultHtml==""){
		defaultHtml=$('#cygn').html();
	}
    $.ajax({
        type: "post",
        url: "/xxmh/cygnController/getCygncdDetail.do",
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                $('#cygn').empty();
                var html = '<ul>';
                if (data.length > 6) {
                    data.length = 6;//领导要求暂时只显示6条
                }

				var html = "";
				html += "<ul>";
				for(var i = 0; i < data.length; i++){
	    			var secmenu = data[i];
	    			if(secmenu.hasOwnProperty("realUrl")){
	    				if(secmenu.hasOwnProperty("sycddkfs")){
	    					if(secmenu.sycddkfs=="0"){// 本页跳转打开
		            			html +="<li><a href='#' onclick='goUrl(\""+secmenu.realUrl+"\")'>";
		            		}else if(secmenu.sycddkfs=="1"){// 从旧门户页面打开
		            			html +="<li><a href='#' onclick='goIndexUrl(\""+secmenu.realUrl+"\",\""+secmenu.topMenu+"\",\""+secmenu.subCdtb+"\",\""+secmenu.qxkzsx+"\")'>";
		            		}else if(secmenu.sycddkfs=="2"){// 新页面打开
		            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\")'>";
		            		}else{
		            			//默认新窗口打开
		            			html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\")'>";
		            		}
	    				}else{
	    					//没有设置首页菜单打开方式 默认新窗口打开
	    					html +="<li><a href='#' onclick='openUrl(\""+secmenu.realUrl+"\")'>";
	    				}
	        		}else{
	        			html +="<li><a href='#'>";
	        		}
	    			html += secmenu.cdmc + "</a></li>";
	    		}
				html +="</ul>";
				$('#cygn').html(html);
            }else{
            	$('#cygn').html(defaultHtml);
            }
        }
    });
}

function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
} 