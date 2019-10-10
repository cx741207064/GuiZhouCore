/**
 * 根据方法名执行对应方法
 * @param mathFlag
 * @param data
 * @param scope
 */
function extMethods(mathFlag,newData,olddata,scope){
	
	//非重要行业填写第二行的时候弹出提示
	if ("zyhyts"==mathFlag){		
		zyhyts();
	}
	
	//第三行的提示
	if ("qthyts"==mathFlag){		
		qthyts(newData);
	}
}

function zyhyts(){
	
	var fb2=parent.formData.ht.qysdsczzsyjdSbbdxxVO.A201020Ywbd.gdzcjszjkcMxbGrid.gdzcjszjkcmxbGridlb;
	var hyDm=parent.formData.kz.temp.fb2.hyDm;
	var tscs=parent.formData.kz.temp.fb2.t_tscs;
	
	//判断第二行是否有填写数据
	
	var  sftx=false;
	
	if(fb2[1].zcyz!=0||fb2[1].zzzjjeLj!=0||fb2[1].azssybgdjsdzjjeLj!=0||fb2[1].xsjszjyhjsdzjjeLj!=0||fb2[1].nstjjeLj!=0||fb2[1].xsjszjyhjeLj!=0){
		sftx=true;
		
	}else{
		parent.formData.kz.temp.fb2.t_tscs='0';
	}
	   	     
	//非重要行业填写第二行的时候弹出提示  ， hyDm为空的时候是非重要行业
	
	if(hyDm==""&&sftx&&tscs=='0'){
		 var msg="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二行为享受6大行业4大领域固定资产加速折旧政策的企业录入，当前企业登记信息显示不属于可以享受该项政策的行业，若行业信息有误，请及时变更登记信息，按确定可继续填报"
		
			 parent.layer.alert(msg);
		 parent.formData.kz.temp.fb2.t_tscs='1';
	}
	
	
	
}


function qthyts(zcyz){
	
	if(zcyz>0&&zcyz<1000000){
		var msg="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三行用于填报100万元以上研发设备，请检查原值是否正确！";
		 parent.layer.alert(msg);
		
	}
	
	
}



