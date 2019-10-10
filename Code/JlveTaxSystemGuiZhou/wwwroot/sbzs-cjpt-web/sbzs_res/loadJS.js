$("#frmSheet").on('load' , function(){
    	if($(this).attr("src") == "about:blank"){    //当src属性为空时 不注入css和js文件。
			return;
		}
    	if((typeof lookBack != "undefined" && "Y" == lookBack)  || parent.location.href.indexOf("yslookBack=Y")>-1){
    		var frame = document.getElementById("frmSheet");
    		var domDocument = frame.contentWindow.document;
    		syncLoadJs(domDocument.body, pathRes + "/js/lib/jquery.min.js");
    		syncLoadJs(domDocument.body, pathRes + "/js/lib/mask.js");
    		syncLoadJs(domDocument.body, pathRoot + "/abacus/resources4/layui/layui.js");
    		syncLoadJs(domDocument.body, pathRoot + "/" + ywlx + "_res/lookBack.js"); //动态加载js文件时,浏览器默认为异步,要设置成同步,加载完直接调用才不会出错	
    	}
    }
);
   
  	//ajax同步加载js
	function syncLoadJs(rootObject, url){
		$.ajax({
		    url:url,
		    async:false,
		    dataType:"text",
		    success:function(data){
		    	 var oScript = document.createElement( "script" );
		         oScript.type = "text/javascript"; 
		         oScript.text = data; 
		         rootObject.appendChild(oScript); 
		    }
		});
	}