/**
 * 根据方法名执行对应方法
 * @param mathFlag
 * @param data
 * @param scope
 */
function extMethods(mathFlag,newData,olddata,scope){
	
	//设置总机构具有主体生产经营职能部门分摊比例
	if ("change1Row"==mathFlag){		
		change1Row();
	}
	

}

function change1Row(){	
	var dq=(parent.formData.fq.nsrjbxx.swjgDm).substring(1,3);
	var xxwlqy=parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sfsyxxwlqy;
	var sjlreLj=parent.formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
	var je=parent.formData.kz.temp.zb.xwqzdje;
	var fhtjdxxwlqyjmqysdsLj=parent.formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj;	  
	if(dq=='52'&&xxwlqy=='Y'&&sjlreLj>0.03&&sjlreLj<=je&&fhtjdxxwlqyjmqysdsLj==0){			
		parent.layer.confirm("您符合小型微利企业所得税优惠政策条件，是否选择享受其他税收优惠政策？",{
		 	area:['100px','150px'],
		 	title:'提示',
			btn : ['是','否'],
			btn2:function(index){
				parent.formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj=ROUND(ROUND((sjlreLj*0.15)*100,2)/100,2);
				var _jpath="ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj";
				parent.formulaEngine.apply(_jpath, parent.formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj);
				//刷新模型
				viewEngine.formApply($('#viewCtrlId'));
				viewEngine.tipsForVerify(document.body);				
				parent.layer.close(index);				
			 }
			},function(index){				
				parent.layer.close(index);
			});		
	}
}

function ROUND(number, precision) {
	if (isNaN(number)) {
		return 0;
	}
	if (number == Infinity || number == -Infinity) {
		return 0;
	}
	/* 默认精度为2位 */
	if (precision == undefined)
		precision = 2;
	var t = 1;
	for (; precision > 0; t *= 10, precision--)
		;
	for (; precision < 0; t /= 10, precision++)
		;
	return Math.round(mul(number, t) + 1e-9) / t;
}

function mul() {
	if (arguments.length < 2) {
		throw "Wrong parameter Number!"
	} else if (arguments.length == 2) {
		a = arguments[0];
		b = arguments[1];
		var c = 0, d = a.toString(), e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) {
		}
		try {
			c += e.split(".")[1].length;
		} catch (f) {
		}
		return Number(d.replace(".", "")) * Number(e.replace(".", ""))
				/ Math.pow(10, c);
	} else {
		a = arguments[0];
		b = arguments[1];
		var rtn_left = mul(a, b);
		var i = 2;
		var param = [];
		param[0] = rtn_left;
		while (i < arguments.length) {
			param[i - 1] = arguments[i];
			i++;
		}
		return mul.apply(this, param);
	}
}
