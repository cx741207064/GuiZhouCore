
/**
 * 根据方法名执行对应方法
 * @param mathFlag
 * @param data
 * @param scope
 */
function extMethods(mathFlag,newData,olddata,scope){
	
	//房地产开发企业行业代码：7010，填写此行给予提示
	if ("zb4row"==mathFlag){		
		zb4row();
	}
	//GEARS-9487 2.0企业所得税月季报A表2018版，GT3-ZJ-金税三期标准服务清册_V2.29新增功能
	if ("changeXzqh"==mathFlag){		
		changeXzqh();
	}
		
	
}

function  changeXzqh(){
	var xzqhDm = parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.xzqhszDm;
	if(!isEmptyObject(xzqhDm)){
	var fpbl = 0;
	var fpse = 0;
	var djxh = parent.formData.fq.nsrjbxx.djxh;
	var gdslxDm = parent.formData.fq.nsrjbxx.gdslxDm;
	var nsrsbh = parent.formData.fq.nsrjbxx.nsrsbh;
	var zgswjDm = parent.formData.fq.nsrjbxx.zgswjDm;
	var sbqylx = parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx;

	var skssqq = parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqq;
	var skssqz = parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var sbsxDm1 = parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbsxDm1;

	var requestXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><taxML xsi:type=\"HXZGSB10102Request\" bbh=\"\" xmlbh=\"\" xmlmc=\"\" xsi:schemaLocation=\"http://www.chinatax.gov.cn/dataspec/ TaxMLBw_HXZG_SB_10102_Request_V1.0.xsd\" xmlns=\"http://www.chinatax.gov.cn/dataspec/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><sbNsrxxJhVO><djxh>"+djxh+"</djxh><skssqq>"+skssqq+"</skssqq><skssqz>"+skssqz+"</skssqz><sbsxDm1>"+sbsxDm1+"</sbsxDm1><yzpzzlDm>BDA0611033</yzpzzlDm><pzxh/><sbuuid/><xzqhszDm>"+xzqhDm+"</xzqhszDm></sbNsrxxJhVO></taxML>";
	
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var jsonData = {};
	jsonData.ywlx = "SBINIT";
	jsonData.sbywbm = "QYSDS_A_18YJD";
	jsonData.sid = "Nfzh.SWZJ.HXZG.SB.QYSDSCZZSYJDSBCSH";
	jsonData.addXml=requestXml;	
	jsonData.isRequestXml='Y';	
	jsonData.gdslxDm = gdslxDm;
	jsonData.skssqq = skssqq;
	jsonData.skssqz = skssqz;
	jsonData.djxh = djxh;
	jsonData.nsrsbh = nsrsbh;
	jsonData.swjgDm = zgswjDm;
	$.ajax({
		type: "POST",
		url: mainUrl+"/nssb/getOtherData.do",
		dataType:"json",      
		contentType:"application/json",
		data:JSON.stringify(jsonData),
		success:function(data){
			if(!isEmptyObject(data)){
			
			var xmlDoc = $.parseXML(data);
			$(xmlDoc).find('fzjgxxGrid > fzjgxxGridlb').each(function() {
				var fzjgnsrsbh = $(this).children("fzjgnsrsbh").text();
				var jkfpbl = $(this).children("fpbl").text();
				var jkfpse = $(this).children("fpse").text();
				if(fzjgnsrsbh == nsrsbh){
					fpbl = SUM(jkfpbl,fpbl);
					fpse = SUM(jkfpse,fpse);
				}
			})
			if(sbqylx == 2){
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpbl = ROUND(fpbl,10);
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpse = ROUND(fpse,2);
			}else{
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpbl = 0;
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpse = 0;
			}
			
		}
			var _jpath1 = "parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpbl";
			var _jpath2 = "parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.fpse";
			parent.formulaEngine.apply(_jpath1,  "");
			parent.formulaEngine.apply(_jpath2,  "");
		
			// 3、刷新校验结果和控制结果
			viewEngine.formApply($('#viewCtrlId'));
			viewEngine.tipsForVerify(document.body);	
			
		}
			
	})
	}
}

function zb4row(){
	
	
	var hyDm=parent.formData.fq.nsrjbxx.hyDm;
	var tdywjsdynssdeLj=parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.tdywjsdynssdeLj
	
	if(hyDm!="7010"&&tdywjsdynssdeLj>0){
		var msg="房地产开发企业销售未完工开发产品取得的预售收入，按照税收规定的预计计税毛利率计算的预计毛利额填入此行。请确认是否填写正确。";
				
		
		
		var b = parent.layer.confirm(msg,{
		 	area: ['350px','180px'],
		 	title:'提示',
			btn : ['是','否'],
			btn2:function(index){
				
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.tdywjsdynssdeLj=0;
			//3、刷新校验结果和控制结果
				var _jpath = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.tdywjsdynssdeLj";
				parent.formulaEngine.apply(_jpath,  "");
				   viewEngine.tipsForVerify(document.body);
					viewEngine.formApply($('#viewCtrlId'));
					parent.layer.close(b);
				
			}
			},function(index){
			
				parent.layer.close(b);
	});
						 
	}
		
}


 /**
  * 非空校验
  * @param obj
  * @returns {Boolean}
  */
 function isEmptyObject(obj){
 	if(obj==""||obj==null||obj==undefined){
 		return true;
 	}else{
 		return false;
 	}
 }


 /**
  * Rounding the fractional part.<BR>
  * 将数字的小数部分进行四舍五入, 缺省保留两位精度.
  * @param number Number: Number for rounding. 数字：需要做四舍五入的数值.
  * @param precision Number: Precision. 数字：精度，默认为2.
  * @returns Number: Rounding result.
  */
 function ROUND(number, precision){
     if (isNaN(number)) {
         return 0;
     }
     if (number == Infinity || number == -Infinity) {
         return 0;
     }
     /* 默认精度为2位 */
     if (precision == undefined) precision = 2;
     var t = 1;
     for (; precision > 0; t *= 10, precision--);
     for (; precision < 0; t /= 10, precision++);
     return Math.round(mul(number, t)+1e-9) / t;
 }

 function mul() {
		if(arguments.length < 2){
			throw "Wrong parameter Number!" 
		}
		else if(arguments.length == 2){
			a = arguments[0];
			b = arguments[1];
			var c = 0,
	        d = a.toString(),
	        e = b.toString();
		    try {
		        c += d.split(".")[1].length;
		    } catch (f) {}
		    try {
		        c += e.split(".")[1].length;
		    } catch (f) {}
		    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
		}else{
			a = arguments[0];
			b = arguments[1];
			var rtn_left = mul(a,b);
			var i = 2;
			var param = [];
			param[0] = rtn_left;
			while(i < arguments.length){
				param[i-1] = arguments[i];
				i++;
			}
			return mul.apply(this,param);
		}
	}

 
 function SUM() {
		var ps;
		if (arguments.length <= 0) {
			return null;
		} else if (arguments.length == 1) {
			ps = arguments[0];
		} else {
			ps = arguments;
		}
		if (ps.length) {
			var ret = 0;
			var fix = 1;
			for (var i = 0; i < ps.length; i++) {
				if (ps[i] instanceof Array) {
					var t = SUM(ps[i]) * fix;
					while(t % 1 !=0){
						fix *= 10;
						t *= 10;
						ret *= 10;
					}
					ret += t;
				} else {
					var t = ps[i] * fix;
					while(t % 1 != 0){
						fix *= 10;
						t *= 10;
						ret *= 10;
					}
					ret += t;
				}
			}
			return ret/fix;
		} else if (!isNaN(ps)) {
			return ps;
		}
	}
 
 
 //甘肃个性化提示
 function jsrgtisp(val){
	 
	var dqDm= (parent.formData.fq.nsrjbxx.swjgDm).substring(1,3);
	var jsrg=val.value;
	
	if(dqDm!="62"||jsrg!="Y"){
		
		return;
		
		
	}

	var msg="根据《财政部 国家税务总局关于完善股权激励和技术入股有关所得税政策的通知》（财税〔2016〕101号）文件规定，企业以技术成果投资入股到境内居民企业，被投资企业支付的对价全部为股票（权）的，企业可以选择适用递延纳税优惠政策。本年内发生以技术成果投资入股且选择适用递延纳税优惠政策的纳税人，选择“是”；本年内未发生以技术成果投资入股或者以技术成果投资入股但选择继续按现行有关税收政策执行的纳税人，选择“否””，请您确认是否要进行修改！";
	
	var b = parent.layer.confirm(msg,{
	 	area: ['550px','280px'],
	 	title:'提示',
		btn : ['是','否'],
		btn2:function(index){
			
			parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sffsjsrgdynssx='N';
		//3、刷新校验结果和控制结果
			var _jpath = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sffsjsrgdynssx";
			parent.formulaEngine.apply(_jpath,  "");
			   viewEngine.tipsForVerify(document.body);
				viewEngine.formApply($('#viewCtrlId'));
				parent.layer.close(b);
			
		}
		},function(index){
		
			parent.layer.close(b);
});

	
 }
 
