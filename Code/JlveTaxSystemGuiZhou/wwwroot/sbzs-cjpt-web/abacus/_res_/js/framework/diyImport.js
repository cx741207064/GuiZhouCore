
DiyImport={};
DiyImport.loadScript4Sheet = function(scriptUrl){
            var domDocument = document;
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = scriptUrl;
            var headEle = document.getElementsByTagName("head")[0];
            headEle.appendChild(oScript);
}

DiyImport.load = function(commonParam,list){
    for(var i in list){
    	var item=list[i];
    	var key=item['key'];
    	var param=item['param']?item['param']:commonParam;
    	if(param.indexOf(key)>=0||param.indexOf(key.toLowerCase())>=0)  this.loadScript4Sheet(item['script']);
    }
}


 