/**
 * Created by Administrator on 2016-05-07.
 */
/**
  * 删除报文中的节点
 * @param   
 * @returns 
 */
function delBranch(){
	var jsxmGridLb = formData.zzssyyxgmnsrySbSbbdxxVO.zzsjmssbmxb.zzsjmssbmxbjsxmGrid.zzsjmssbmxbjsxmGridlbVO;
	 for(var i=jsxmGridLb.length-1;i>=0;i--){
		 //纳税人没有选择减免性质，则删除该节点
		 if(jsxmGridLb[i].hmc == "" || jsxmGridLb[i].hmc == null){
			 jsxmGridLb.splice(i,1);
		 }
	 }
	 
	 var msxmGridLb = formData.zzssyyxgmnsrySbSbbdxxVO.zzsjmssbmxb.zzsjmssbmxbmsxmGrid.zzsjmssbmxbmsxmGridlbVO;
	 for(var i=msxmGridLb.length-1;i>=0;i--){
		 //纳税人没有选择减免性质，则删除该节点
		 if(msxmGridLb[i].hmc == "" || msxmGridLb[i].hmc == null){
			 msxmGridLb.splice(i,1);
		 }
	 }
}

/**
 * 删除报文中的节点,删除数组中某节点的值为空的下标数据
* @param   
* @returns 
*/
function delBranch2(data, key){
	
	if(data != null && data.length >= 1){
		for( var i = data.length - 1; i >= 0; i--){
			var grib = data[i];
			if(grib[key] == null || grib[key] == ""){
				data.splice(i, 1);
			}
		}
	}
}

/**
 * 删除节点,不包含合计/出口免税/跨境服务
 * @param data
 * @param key
 */
function delBranch3(flag,data, key){

	if(flag == 1){
        var zzsjmssbmxbjsxmGridlbVO = data.zzsjmssbmxbjsxmGridlbVO;
        var zzsjmssbmxbmsxmGridlbVO = data.zzsjmssbmxbmsxmGridlbVO;

        if(zzsjmssbmxbjsxmGridlbVO != 'undefined' && zzsjmssbmxbjsxmGridlbVO != null && zzsjmssbmxbjsxmGridlbVO.length > 0){
            for( var i = zzsjmssbmxbjsxmGridlbVO.length - 1; i >= 1; i--){
                  var grib = zzsjmssbmxbjsxmGridlbVO[i];
                  if(grib[key] == null || grib[key] == ""){
                        zzsjmssbmxbjsxmGridlbVO.splice(i, 1);
                  }
             }
           }

            if(zzsjmssbmxbmsxmGridlbVO != 'undefined' && zzsjmssbmxbmsxmGridlbVO != null && zzsjmssbmxbmsxmGridlbVO.length > 0){
                for( var i = zzsjmssbmxbmsxmGridlbVO.length - 1; i >= 3; i--){
                    var grib = zzsjmssbmxbmsxmGridlbVO[i];
                    if(grib[key] == null || grib[key] == ""){
                        zzsjmssbmxbmsxmGridlbVO.splice(i, 1);
                    }
                }
            }

	}else{
        var jsxmGridLb = data.zzsjmssbmxbjsxmGridlbVO;
        var msxmGridLb = data.zzsjmssbmxbmsxmGridlbVO;

        if(jsxmGridLb != 'undefined' && jsxmGridLb != null && jsxmGridLb.length > 0){            
            for( var i = jsxmGridLb.length - 1; i >= 0; i--){
                var grib = jsxmGridLb[i];
                if(grib[key] == null || grib[key] == ""){
                    jsxmGridLb.splice(i, 1);
                }
            }
		}

        if(msxmGridLb != 'undefined' && msxmGridLb != null && msxmGridLb.length > 0){        
            for( var i = msxmGridLb.length - 1; i >= 0; i--){
                var grib = msxmGridLb[i];
                if(grib[key] == null || grib[key] == ""){
                    msxmGridLb.splice(i, 1);
                }
            }
		}

	}


}

/**
 * 小规模差额征收起征点计算
 */
function xgmCezsqzd(bqfse,bqkce,ysfwxsqbhssr,bqfse5,bqkce5,ysfwxsqbhssr5,yzzzsbhsxse,xsczbdcbhsxse,msxse,ckmsxse){
	//存在差额征税
	if(ROUND(bqfse + bqkce + ysfwxsqbhssr,2) > 0){
		yzzzsbhsxse = ysfwxsqbhssr / 1.03;
	}
	//存在差额征税
	if(ROUND(bqfse5 + bqkce5 + ysfwxsqbhssr5,2) > 0){
		xsczbdcbhsxse = ysfwxsqbhssr5 / 1.05;
	}	
	return ROUND(yzzzsbhsxse+xsczbdcbhsxse+msxse+ckmsxse,2);
}

/**
 * 改变计税依据、减免性质时重新计算减免税额，重复行所有行都重新计算
 */
function lhbsfssb_jmse(zsxmDm,ssjmxzDm){
	  var sbxxGridlb=formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb;
	  var old_sbxxGridlb=formData.qcs.formContent.sbTysb.body.sbxxGrid.sbxxGridlb; 
	  for(var i=0;i<sbxxGridlb.length;i++){
		  if(sbxxGridlb[i].zsxmDm==zsxmDm){
			 if(old_sbxxGridlb[i].ssjmxzDm==ssjmxzDm&&old_sbxxGridlb[i].jmse==sbxxGridlb[i].bqjmsfe){
				 return old_sbxxGridlb[i].jmse;
			 }else{
				 return 0;
			 }			 
		  }
	  }
}
  
  /**
   * 改变计税依据，根据起征点信息改变减免性质
   * @param zsJsyj
   * @param jsfyj
   * @param fjsQzdxx
   * @returns
   */
  function lhbsfssb_ssjmxzDm(zsxmDm){	  
	  var ssjmxzDm ="";
	  var qzdMxxxArr = [];	 
	  var zsJsyj =formData.qcs.initData.tysbbInitData.zsJsyj;
	  var sbxxGridlb=formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb;
	  var skssqq =formData.qcs.formContent.sbTysb.head.publicHead.sssq.rqQ;
	  var skssqz =formData.qcs.formContent.sbTysb.head.publicHead.sssq.rqZ;
	  var fjsQzdxx=formData.qcs.initData.tysbbInitData.fjsQzdMxxxs.fjsQzdMxxx;
	  var fjsbqybtsfe=0;
	  var nsqxDm=calculateNsqxDm(skssqq,skssqz);
	  for(var i=0;i<sbxxGridlb.length;i++){
		  if(sbxxGridlb[i].zsxmDm==zsxmDm){
			  ssjmxzDm = typeof(sbxxGridlb[i].ssjmxzDm)=='object'?ssjmxzDm:sbxxGridlb[i].ssjmxzDm;
			  fjsbqybtsfe=typeof(sbxxGridlb[i].bqybtsfe)!='number'?fjsbqybtsfe:sbxxGridlb[i].bqybtsfe;
			  break;
		  }
	  }
	   	
	//获取纳服配置中起征点明细信息中的起征点信息
	  if(fjsQzdxx!=undefined && $.isArray(fjsQzdxx)){
		  for(var i=0;i<fjsQzdxx.length;i++){
			  qzdMxxxArr[fjsQzdxx[i].zsxmDm] = (parseFloat(fjsQzdxx[i].qzdje)-parseFloat(fjsQzdxx[i].ysbje)).toFixed(2);			 
		  }
	  }
	  //根据主税的计税依据判断起征点，未达起征点返回默认值
	  if(qzdMxxxArr[zsxmDm+'_'+nsqxDm]!=undefined && zsJsyj > 0 && zsJsyj<qzdMxxxArr[zsxmDm+'_'+nsqxDm]&&fjsbqybtsfe!=0){
		  return '0099129999';			 
	  }else{
		  return ssjmxzDm;
	  }
  }
  
  function tlxfs_dktz_qckcje(qckcje){
	  var dctlskdktzGridlb=formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.dctlskdktzGrid.dctlskdktzGridlb;
	  dctlskdktzGridlb[0].qckcje=ROUND(dctlskdktzGridlb[0].wtjgshje+qckcje-dctlskdktzGridlb[0].dklyje-dctlskdktzGridlb[0].qtlyje,2);
	  dctlskdktzGridlb[0].qckcynse=ROUND(dctlskdktzGridlb[0].qckcje*dctlskdktzGridlb[0].sl1,2);	 
	  if(dctlskdktzGridlb.length>1){		  
		  for(var i=1;i<dctlskdktzGridlb.length;i++){			 
			  dctlskdktzGridlb[i].qckcje=ROUND(dctlskdktzGridlb[i].wtjgshje+dctlskdktzGridlb[i-1].qckcje-dctlskdktzGridlb[i].dklyje-dctlskdktzGridlb[i].qtlyje,2);
			  dctlskdktzGridlb[i].qckcynse=ROUND(dctlskdktzGridlb[i].qckcje*dctlskdktzGridlb[i].sl1,2);
		  }
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcjehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcje;
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcynsehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcynse;
	  }else{
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcjehj=dctlskdktzGridlb[0].qckcje;
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcynsehj=dctlskdktzGridlb[0].qckcynse;
	  }
  }
  
  function tlxfs_dktz_kc(wtjgshje,dklyje,qtlyje){
	  var dctlskdktzGridlb=formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.dctlskdktzGrid.dctlskdktzGridlb;
	  dctlskdktzGridlb[0].qckcje=ROUND(dctlskdktzGridlb[0].wtjgshje+formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qckcje-dctlskdktzGridlb[0].dklyje-dctlskdktzGridlb[0].qtlyje,2);
	  dctlskdktzGridlb[0].qckcynse=ROUND(dctlskdktzGridlb[0].qckcje*dctlskdktzGridlb[0].sl1,2);	  
	  if(dctlskdktzGridlb.length>1){		  
		  for(var i=1;i<dctlskdktzGridlb.length;i++){			  
			  dctlskdktzGridlb[i].qckcje=ROUND(dctlskdktzGridlb[i].wtjgshje+dctlskdktzGridlb[i-1].qckcje-dctlskdktzGridlb[i].dklyje-dctlskdktzGridlb[i].qtlyje,2);
			  dctlskdktzGridlb[i].qckcynse=ROUND(dctlskdktzGridlb[i].qckcje*dctlskdktzGridlb[i].sl1,2);
		  }	
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcjehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcje;
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcynsehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcynse;
	  }else{
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcjehj=dctlskdktzGridlb[0].qckcje;
		  formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb4.qmkcynsehj=dctlskdktzGridlb[0].qckcynse;
	  }
  }
  
  function dcxfs_dktz_qckcje(qckcje){
	  var dctlskdktzGridlb=formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.dctlskdktzGrid.dctlskdktzGridlb;
	  dctlskdktzGridlb[0].qckcje=ROUND(dctlskdktzGridlb[0].wtjgshje+qckcje-dctlskdktzGridlb[0].dklyje-dctlskdktzGridlb[0].qtlyje,2);
	  dctlskdktzGridlb[0].qckcynse=ROUND(dctlskdktzGridlb[0].qckcje*dctlskdktzGridlb[0].sl1,2);	 
	  if(dctlskdktzGridlb.length>1){		  
		  for(var i=1;i<dctlskdktzGridlb.length;i++){			  
			  dctlskdktzGridlb[i].qckcje=ROUND(dctlskdktzGridlb[i].wtjgshje+dctlskdktzGridlb[i-1].qckcje-dctlskdktzGridlb[i].dklyje-dctlskdktzGridlb[i].qtlyje,2);
			  dctlskdktzGridlb[i].qckcynse=ROUND(dctlskdktzGridlb[i].qckcje*dctlskdktzGridlb[i].sl1,2);
		  }
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcjehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcje;
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcynsehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcynse;
	  }else{
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcjehj=dctlskdktzGridlb[0].qckcje;
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcynsehj=dctlskdktzGridlb[0].qckcynse;
	  }
  }
  
  function dcxfs_dktz_kc(wtjgshje,dklyje,qtlyje){
	  var dctlskdktzGridlb=formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.dctlskdktzGrid.dctlskdktzGridlb;
	  dctlskdktzGridlb[0].qckcje=ROUND(dctlskdktzGridlb[0].wtjgshje+formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qckcje-dctlskdktzGridlb[0].dklyje-dctlskdktzGridlb[0].qtlyje,2);
	  dctlskdktzGridlb[0].qckcynse=ROUND(dctlskdktzGridlb[0].qckcje*dctlskdktzGridlb[0].sl1,2);	  
	  if(dctlskdktzGridlb.length>1){		  
		  for(var i=1;i<dctlskdktzGridlb.length;i++){			 
			  dctlskdktzGridlb[i].qckcje=ROUND(dctlskdktzGridlb[i].wtjgshje+dctlskdktzGridlb[i-1].qckcje-dctlskdktzGridlb[i].dklyje-dctlskdktzGridlb[i].qtlyje,2);
			  dctlskdktzGridlb[i].qckcynse=ROUND(dctlskdktzGridlb[i].qckcje*dctlskdktzGridlb[i].sl1,2);
		  }	
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcjehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcje;
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcynsehj=dctlskdktzGridlb[dctlskdktzGridlb.length-1].qckcynse;
	  }else{
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcjehj=dctlskdktzGridlb[0].qckcje;
		  formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb4.qmkcynsehj=dctlskdktzGridlb[0].qckcynse;
	  }
  }

  
  
  function qtxfs_xfpmc_different(gridLb,zspmDm){
	  if((zspmDm == "") || (zspmDm == null)){return true;}
	  var count = 0;
	  var xfpmcs = gridLb;	  
	  for(var i = 0;i < xfpmcs.length;i++){
		  if(xfpmcs[i] == zspmDm){
			  count++;
			  if(count == 2){
				  return false;
			  }
		  }
	  }	 
	  return true;
  }

  /**
   * 校验《本期减（免）税额明细表》中，[减（免）性质代码]相同时，[应税消费品名称]不能重复！
   * @param zspmDm    征收品目代码
   * @param ssjmxzDm    减免性质代码
   * @param gridLb    节点的父路径
   * @returns
   */
  function jmsemxb_different(zspmDm,ssjmxzDm,gridLb){
	  if((zspmDm == "") || (zspmDm == null)){return true;}
	  var indexs = new Array();
	  if((ssjmxzDm == "") || (ssjmxzDm == null)){return true;}
	  var nodeDms = gridLb;		
	  for(var i = 0;i < nodeDms.length;i++){
		  if(nodeDms[i].ssjmxzDm == ssjmxzDm){
			  indexs.push(i);
		  }
	  }
	  if((zspmDm == "") || (zspmDm == null)){return true;}
	  var count = 0;
	  for(var j = 0;j < indexs.length;j++){
		  if(nodeDms[indexs[j]].zspmDm == zspmDm){
			  count++;
			  if(count == 2){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  
 
  
  
  
  function jsbcpy_mxb_samebqjmse101020603(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020603')){//柴油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020603')){//柴油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  function jsbcpy_mxb_samebqjmse101020604(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020604')){//航空煤油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020604')){//航空煤油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  function jsbcpy_mxb_samebqjmse101020606(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020606')){//溶剂油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020606')){//溶剂油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  function jsbcpy_mxb_samebqjmse101020607(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020607')){//润滑油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020607')){//润滑油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  function jsbcpy_mxb_samebqjmse101020608(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020608')){//燃料油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020608')){//燃料油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  function jsbcpy_mxb_samebqjmse101020605(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020605')){//石脑油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020605')){//石脑油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  
  function jsbcpy_mxb_samebqjmse101020609(zspmDm,bqjmse,bqjmsejsbcpyGridlb,bqjmsl,bqjmsemxbGridlb){
	  if((zspmDm==null)||(zspmDm=='')){return true;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if((zspmDm == bqjmsemxbGridlb[j].zspmDm)&&(zspmDm=='101020609')){//汽油
			  bqjmse = ROUND(bqjmsemxbGridlb[j].bqjmse + bqjmse,2);
		  }
	  }
	  var k = 0;
	  for(var i = 0;i < bqjmsejsbcpyGridlb.length;i++){
		  if((zspmDm == bqjmsejsbcpyGridlb[i].zspmDm)&&(zspmDm=='101020609')){//汽油
			  if(bqjmse != bqjmsejsbcpyGridlb[i].bqjmse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  
  
  
  
  
  /**
   * 校验：《本期减（免）税额明细表》中[XXX]的[减（免）税额]应小于等于主表相同品目对应的[应纳税额]
   * @param zspmDm    征收品目代码
   * @param gridLb    主表应纳税额节点的父路径
   * @returns
   */  
  function jmsemxb_compare_ynse(bqjmse,zspmDm,gridLb,xssl,xse){
	  if((zspmDm == "") || (zspmDm == null)){return true;}
	  var ynseDms = gridLb;
	  for(var j = 0;j < ynseDms.length;j++){
		  if(ynseDms[j].zspmDm == zspmDm){
			  if(bqjmse > ynseDms[j].ynse){
				  return false;
			  }
		  }
	  }
	  return true;
  }
  
  /**
   * 校验：《本期减（免）税额明细表》中[XXX]的[减（免）税额]应小于等于主表相同品目对应的[应纳税额]
   * @param zspmDm    征收品目代码
   * @param gridLb    征收品目代码节点的父路径
   * @returns
   */  
  function jmsemxb_count_bqjmse(zspmDm,gridLb){
	  if((zspmDm == "") || (zspmDm == null)){return 0;}
	  var zspmDms = gridLb;
	  var bqjmse = 0;
	  for(var j = 0;j < zspmDms.length;j++){
		  if(zspmDms[j].zspmDm == zspmDm){
			  bqjmse += zspmDms[j].bqjmse
		  }
	  }
	  return bqjmse;
  }
  
  /**
   * 根据《本期减（免）税额明细表》中的[征收品目]找到主表相同品目对应的[应纳税额]
   * @param zspmDm    征收品目代码
   * @param ynse    主表中应纳税额
   * @param gridLb    主表应纳税额节点的父路径
   * @returns
   */
  function jmsemxb_get_ynse(zspmDm,ynse,gridLb){
	  if((zspmDm == "") || (zspmDm == null)){return null;}
	  var ynseDms = gridLb;
	  for(var j = 0;j < ynseDms.length;j++){
		  if(ynseDms[j].zspmDm == zspmDm){
			  return ynseDms[j].ynse;
		  }
	  }
	  return null;
  }
  
  function dcjmsemxb_get_ynse(zspmDm,ynse,ynse1,gridLb){
	  if((zspmDm == "") || (zspmDm == null)){return 0;}
	  var ynseDms = gridLb;
	  for(var j = 0;j < ynseDms.length;j++){
		  if(ynseDms[j].zspmDm == zspmDm){
			  return ynseDms[j].ynse;
		  }
	  }
	  return 0;
  }
  
  function jmsemxb_get_bqjmse(zspmDm,bqjmse,bqjmsemxbGridlb){
	  if((zspmDm == "") || (zspmDm == null)){return 0;}
	  bqjmse = 0;
	  for(var j = 0;j < bqjmsemxbGridlb.length;j++){
		  if(bqjmsemxbGridlb[j].zspmDm == zspmDm){
			  bqjmse = bqjmsemxbGridlb[j].bqjmse + bqjmse;
		  }
	  }
	  return bqjmse;
  }
  
  /**
   * 小规模增值税减免税申报明细表，根据“减税性质代码及名称”获取起初报文中的期末余额
   * @param hmc    行代码
   * @param gridLb    起初报文中期末余额节点的路径
   * @returns
   */
  function jmsesbmxb_get_qcs_qmye(hmc,swsxDm,gridLb){
	  if((hmc == "") || (hmc == null)){
		  return 0;
	  }
	  var qmyes = gridLb;
	  for(var j = 0;j < qmyes.length;j++){
		  if(qmyes[j].hmc == hmc && qmyes[j].swsxDm == swsxDm){
			  return qmyes[j].qmye;
		  }
	  }
	  return 0;
  }
 function ssjmxzDmAndJmse(ssjmxzDm){
	 if(ssjmxzDm==null||ssjmxzDm==''){
		 return 0;
	 }
	 return formData.fdckfhdzssyyywbw.tdzzssbcsfdckfhdzssy.hdzssbbxxForm.jmse;
 }
 function tdzzs6_sysl(hbsrQtlxfc,swsrjqtsrQtlxfc,stxssrQtlxfc,qdtdsyqszfdjeQtlxfc,tdzyjcqbcfQtlxfc,qqgcfQtlxfc,jzazgcfQtlxfc,jcssfQtlxfc,ggptssfQtlxfc,kfjjfyQtlxfc,lxzcQtlxfc,qtfdckffyQtlxfc,yysQtlxfc,cswhjsfQtlxfc,jyffjQtlxfc,czbgddqtkcxmQtlxfc,jmseQtlxfc,yjtdzzsseQtlxfc,kcxmjehjQtlxfc,zzeykcxmjezbQtlxfc){
	if(kcxmjehjQtlxfc==0){return 0.60;}
    else	if(zzeykcxmjezbQtlxfc>=0&&zzeykcxmjezbQtlxfc<=0.5){return 0.30;}
    else	if(zzeykcxmjezbQtlxfc>0.5&&zzeykcxmjezbQtlxfc<=1){return 0.40;}
    else	if(zzeykcxmjezbQtlxfc>1&&zzeykcxmjezbQtlxfc<=2){return 0.5;	}
    else {return 0.60;}
 }
 
 function tdzzs6_sskcxsQtlxfc(hbsrQtlxfc,swsrjqtsrQtlxfc,stxssrQtlxfc,qdtdsyqszfdjeQtlxfc,tdzyjcqbcfQtlxfc,qqgcfQtlxfc,jzazgcfQtlxfc,jcssfQtlxfc,ggptssfQtlxfc,kfjjfyQtlxfc,lxzcQtlxfc,qtfdckffyQtlxfc,yysQtlxfc,cswhjsfQtlxfc,jyffjQtlxfc,czbgddqtkcxmQtlxfc,jmseQtlxfc,yjtdzzsseQtlxfc,kcxmjehjQtlxfc,zzeykcxmjezbQtlxfc){
	 	if(kcxmjehjQtlxfc==0){return 0.35;}
	    else	if(zzeykcxmjezbQtlxfc>=0&&zzeykcxmjezbQtlxfc<=0.5){return 0.00;}
	    else	if(zzeykcxmjezbQtlxfc>0.5&&zzeykcxmjezbQtlxfc<=1){return 0.05;}
	    else	if(zzeykcxmjezbQtlxfc>1&&zzeykcxmjezbQtlxfc<=2){return 0.15;	}
	    else {return 0.35;}
 }
 
 function tdzzs6_jmseQtlxfc(ssjmxzDm){
	 for(var index in formData.qcs.initData.jmxxlist.option){
		 var entry = formData.qcs.initData.jmxxlist.option[index];
		 if(entry.dm===ssjmxzDm && entry.jmzlxDm==='02'){
			 return formData.tdzzsbzjgcztzrsyywbw.tdzzsbzjgcztzrsy.tdzzsbzjgcztzrsybd.nsrztzrsbxxForm.yjtdzzsseQtlxfc;
		 }
	 }
	 return formData.tdzzsbzjgcztzrsyywbw.tdzzsbzjgcztzrsy.tdzzsbzjgcztzrsybd.nsrztzrsbxxForm.jmseQtlxfc;
 }
  
  
  function tdzzs_zspmdmzszmdm_different(zspmdmzszmdm,zszmMc){
	  var tdzzs_zspmdmzszmdm = formData.tdzzsnssbywbw.tdzzssbcsfdckfnsrsy.sbbxxfdckfGrid.sbbxxfdckfGridlb;	
	  var sbxxGridlb = formData.qcs.initData.tdzzssbInitData.qcsData.sbxxGrid.sbxxGridlb;
	  if((tdzzs_zspmdmzszmdm == null || tdzzs_zspmdmzszmdm == undefined) || (sbxxGridlb == null || sbxxGridlb == undefined)){
		  return true;
	  }
	  var a = 0;
	  for(var i = 0;i < sbxxGridlb.length;i++){
		  var count = 0;
		  for(var j = 0;j < tdzzs_zspmdmzszmdm.length;j++){
			  if(sbxxGridlb[i].zszmMc==zszmMc&&zszmMc!=""&&zszmMc!=null){
				  if(tdzzs_zspmdmzszmdm[j].zszmMc == sbxxGridlb[i].zszmMc && tdzzs_zspmdmzszmdm[j].zspmDm == zspmdmzszmdm.substring(0,9)){
					  count++;
					  if(count == 2){
						  return false;
					  }
				  } 
			  }
		  }
	  }
	  for(var k = 0;k < tdzzs_zspmdmzszmdm.length;k++){
		  if((tdzzs_zspmdmzszmdm[k].zszmMc=="" || tdzzs_zspmdmzszmdm[k].zszmMc==null)&&(zspmdmzszmdm!=""&&zspmdmzszmdm!=null)&&(zszmMc=="" || zszmMc==null)){
			  if(zspmdmzszmdm.substring(0,9)==tdzzs_zspmdmzszmdm[k].zspmDm){
				  a++;
				  if(a == 2){
					  return false;
				  } 
			  }
		  }
	  }
	  return true;
  }
  
  function tdzzs_zszmMc(zspmdmzszmdm,ewbhxh){
	  var sbbxxfdckfGridlb = formData.tdzzsnssbywbw.tdzzssbcsfdckfnsrsy.sbbxxfdckfGrid.sbbxxfdckfGridlb;
	  var sbbxxGridlb = formData.qcs.formContent.tdzzssbb1.body.sbbxxForm.sbbxxGridlb;
	  var sbxxGridlb = formData.qcs.initData.tdzzssbInitData.qcsData.sbxxGrid.sbxxGridlb;
	  if((sbbxxfdckfGridlb == null || sbbxxfdckfGridlb == undefined) || (sbbxxGridlb == null || sbbxxGridlb == undefined) || (sbxxGridlb == null || sbxxGridlb == undefined)){
		  return "";
	  }
	  if(zspmdmzszmdm!=""&&zspmdmzszmdm!=null){
		  for(var i = 0;i < sbbxxGridlb.length;i++){
			  if(parseInt(ewbhxh)==1&&parseInt(sbbxxfdckfGridlb[sbbxxfdckfGridlb.length-1].ewbhxh)==sbbxxfdckfGridlb.length-1){
				  if(zspmdmzszmdm==sbbxxGridlb[i].zspmdmzszmdm&&sbbxxfdckfGridlb[ewbhxh-1].zszmMc!=sbbxxGridlb[i].zszmMc&&sbbxxGridlb[i].zszmMc!=""&&sbbxxGridlb[i].zszmMc!=null&&sbbxxfdckfGridlb[ewbhxh-1].zspmDm==sbbxxGridlb[i].zspmDm){
					  return sbbxxfdckfGridlb[ewbhxh-1].zszmMc;
				  }
			  }
			  if(zspmdmzszmdm==sbbxxGridlb[i].zspmdmzszmdm&&sbbxxGridlb[i].zszmMc!=""&&sbbxxGridlb[i].zszmMc!=null){
				  return sbbxxGridlb[i].zszmMc;
			  }
		  }
		  if((zspmdmzszmdm=="101130501"||zspmdmzszmdm=="101130502"||zspmdmzszmdm=="101130503") && typeof ewbhxh=="number"){
			  for(var j = 0;j < sbxxGridlb.length;j++){
				  if(zspmdmzszmdm==sbxxGridlb[j].zspmDm&&sbbxxfdckfGridlb[ewbhxh-1].zszmMc==sbxxGridlb[j].zszmMc){
					  return sbbxxfdckfGridlb[ewbhxh-1].zszmMc;
				  }
			  }
			  return "";
		  }
	  }else {
		  return "";  
	  }
  }

  function tdzzs_zszm(zspmDm,zszmMc){
	  var sbxxGridlb = formData.qcs.initData.tdzzssbInitData.qcsData.sbxxGrid.sbxxGridlb;
	  if(sbxxGridlb == null || sbxxGridlb == undefined){
		  return "";
	  }
	  if(zszmMc!=""&&zszmMc!=null&&zspmDm!=""&&zspmDm!=null){
		  for(var i = 0;i < sbxxGridlb.length;i++){
			  if(zszmMc==sbxxGridlb[i].zszmMc&&zspmDm==sbxxGridlb[i].zspmDm){
				  return sbxxGridlb[i].zszmDm;
			  }
		  }
	  }
	  return "";
  }
  function tdzzs_zspm(zspmdmzszmdm){
	  var sbxxGridlb = formData.qcs.initData.tdzzssbInitData.qcsData.sbxxGrid.sbxxGridlb;
	  if(sbxxGridlb == null || sbxxGridlb == undefined){
		  return "";
	  }
	  if(zspmdmzszmdm!=""&&zspmdmzszmdm!=null){
		  for(var i = 0;i < sbxxGridlb.length;i++){
			  if(zspmdmzszmdm==sbxxGridlb[i].zspmdmzszmdm){
				  return sbxxGridlb[i].zspmDm;
			  }
		  }
	  }
	  return zspmdmzszmdm;
  }
  function tdzzs_yzl(zspmDm,zszmMc){
	  var sbxxGridlb = formData.qcs.initData.tdzzssbInitData.qcsData.sbxxGrid.sbxxGridlb;
	  var sbbxxGridlb = formData.qcs.formContent.tdzzssbb1.body.sbbxxForm.sbbxxGridlb;
	  if((sbxxGridlb == null || sbxxGridlb == undefined) || (sbbxxGridlb == null || sbbxxGridlb == undefined)){
		  return 0;
	  }
	  if(zszmMc!=""&&zszmMc!=null){
		  for(var i = 0;i < sbxxGridlb.length;i++){
			  if(zszmMc==sbxxGridlb[i].zszmMc){
				  return sbxxGridlb[i].sl1;
			  }
		  }
	  }else {
		  for(var j = 0;j < sbbxxGridlb.length;j++){
			  if(zspmDm==sbbxxGridlb[j].zspmDm){
				  return parseFloat(sbbxxGridlb[j].yzl);
			  }
		  }
	  }
	  return 0;
  }
  
  function tdzzs_lock(zspmDm,zszmMc){
	  var sbbxxGridlb = formData.qcs.formContent.tdzzssbb1.body.sbbxxForm.sbbxxGridlb;
	  var count = 0;
	  if(sbbxxGridlb!=null&&sbbxxGridlb!=undefined){
		  
	  for(var i = 0;i < sbbxxGridlb.length;i++){
		  if(zspmDm==sbbxxGridlb[i].zspmDm){
			  count=count+1;
		  }
	  }
	  if(zszmMc!=""&&zszmMc!=null&&zspmDm!=""&&zspmDm!=null){
		  for(var i = 0;i < sbbxxGridlb.length;i++){
			  if(zszmMc==sbbxxGridlb[i].zszmMc&&zspmDm==sbbxxGridlb[i].zspmDm&&count==1){
				  return true;
			  }
		  }
	  }
	  }
	  
	  return false;
  }

  
  function calculateNsqxDm(skssqq,skssqz){	  
	  if(skssqq==""||skssqz==""){
		  return "06";				//默认为按月
	  }
	  var monthq=skssqq.substring(5,7);
	  var monthz=skssqz.substring(5,7);
	  var dayq=skssqq.substring(8);
	  var dayz=skssqz.substring(8);
	  if(Number(monthz)-Number(monthq)==2){
		  return "08";		//按季
	  }else if(Number(monthz)-Number(monthq)==0){
		  if(Number(dayz)==Number(dayq)){
			  return "11"; 	//按天
		  }else{
			  return "06";
		  }
	  }
  }
  
  
	function changeJmsxDm(xh,jmsxDm){
		if(jmsxDm==""||jmsxDm==null){
			var arr=formData.ywbw.grsdsjmssxbgbBzds.body.grsdsjmssxbgbHz.jmssxHzlb.jmssxHz;
			for(var i=0;i<arr.length;i++){
				if(arr[i].bh==xh){
					arr[i].uuid="";
					arr[i].tzrdjxh="";
					arr[i].btzdwdjxh="";
					arr[i].yhjmly="";
					arr[i].zspmDm="";
					arr[i].jmzlxDm="";
					arr[i].jmfsDm="";
					arr[i].jmlxDm="";
					arr[i].jmqxq="";
					arr[i].jmqxz="";
					arr[i].jzfd=0;
					arr[i].jzsl=0;
					arr[i].jzed=0;
					arr[i].jmxzmc=0;
					arr[i].jmxzdlDm=0;
					arr[i].jmxzDm=0;
					arr[i].jmxzxlDm=0;
				}
			}
		}
		return "";
	}
  
	
	 /**
	   * 两种情况不需填写本选项：一是项目实施状态为“未完成”的；二是项目实施状态虽为“已完成”，但同一项目名称本年有两条明细的；
	   * @param xmmc    项目名称
	   * @param xmssztxx    项目实施状态选项
	   * @param yfcg    研发成果
	   * @param gridLb    节点的父路径
	   * @returns
	   */
	function yfzcfzzhzbGridlb_yfcg(xmmc,xmssztxx,yfcg,gridLb){
		if(yfcg == null || yfcg == ''){return true;}
		if(xmssztxx == null || xmssztxx == ''){return true;}
		
		
			if(xmssztxx == '01' && (yfcg != null || yfcg != '')){
				return false;
			}
			
			if((xmmc == "") || (xmmc == null)){return true;}
			if(xmssztxx == '02'){	
				var indexs = new Array();
				var nodeDms = gridLb;		
				for(var i = 6;i < nodeDms.length;i++){
					if(nodeDms[i].xmmc == xmmc){
						indexs.push(i);
					}
				}
				var count = 0;
				for(var j = 0;j < indexs.length;j++){
					if(nodeDms[indexs[j]].xmmc == xmmc){
						count++;
						if(count == 2){
							return false;
						}
					}
				}
			}
		
		return true;
	}
	
	 /**
	   * 两种情况不需填写本选项：一是项目实施状态为“未完成”的；二是项目实施状态虽为“已完成”，但同一项目名称本年有两条明细的；
	   * @param xmmc    项目名称
	   * @param xmssztxx    项目实施状态选项
	   * @param yfcgzsh    研发成果证书号
	   * @param gridLb    节点的父路径
	   * @returns
	   */
	function yfzcfzzhzbGridlb_yfcgzsh(xmmc,xmssztxx,yfcgzsh,gridLb){
		if(yfcgzsh == null || yfcgzsh == ''){return true;}
		if(xmssztxx == null || xmssztxx == ''){return true;}
		
		
			if(xmssztxx == '01' && (yfcgzsh != null || yfcgzsh != '')){
				return false;
			}
			
			if((xmmc == "") || (xmmc == null)){return true;}
			if(xmssztxx == '02'){	
				var indexs = new Array();
				var nodeDms = gridLb;		
				for(var i = 6;i < nodeDms.length;i++){
					if(nodeDms[i].xmmc == xmmc){
						indexs.push(i);
					}
				}
				var count = 0;
				for(var j = 0;j < indexs.length;j++){
					if(nodeDms[indexs[j]].xmmc == xmmc){
						count++;
						if(count == 2){
							return false;
						}
					}
				}
			}
		
		return true;
	}
	
	/**
	   * 土增四    验证项目编号是否清算
	   * @param bdcxmbh    需要验证的项目编号
	   * @param gridLb    期初数中清算信息路径
	   * @returns
	   */
	function tdzzs4_sfQs(bdcxmbh, gridLb,dJTdzzsxmAllxxGridlb){
		if(bdcxmbh == null || bdcxmbh ==""){
			return true;
		}
		var xmbhs = gridLb;
        for(var i=0;i<xmbhs.length;i++){
            if(bdcxmbh == xmbhs[i].xmbh){
                if(xmbhs[i].qsbz == "Y"){return true} else {
                    for (var j = 0; j < dJTdzzsxmAllxxGridlb.length; j++) {
                        if (bdcxmbh == dJTdzzsxmAllxxGridlb[j].tdzzsxmxx.tdzzsxmbh) {
                           return (dJTdzzsxmAllxxGridlb[j].tdzzsxmxx.tdzzsxmztDm == "01"  || dJTdzzsxmAllxxGridlb[j].tdzzsxmxx.tdzzsxmztDm == null || dJTdzzsxmAllxxGridlb[j].tdzzsxmxx.tdzzsxmztDm == "")?false:true;
                        }
                    }
                }
            }
        }
		return true;
	}
	/**
	   * 土增四    验证对应征收品目是否认定
	   * @param bdcxmbh   征收品目代码
	   * @param gridLb    期初数中的认定信息路径
	   * @returns
	   */
	function tdzzs4_sfRd(zspmDm, gridLb){
		var zspmDms = gridLb;
		for(var i=0;i<zspmDms.length;i++){
			if(zspmDm == zspmDms[i].zspmDm){
				return true;
			}
		}
		return false;
	}
	
	
	/**
	   * 契税    评估价格大于等于成交价格时，计税价格强制等于评估价格，不可修改。
	   * @param hdjsjg    评估价格
	   * @param cjjg      成交价格
	   * @returns
	   */
	function qs_jsjg(hdjsjg,cjjg){
		var jsjg = formData.sb030QssbVO.zzjsjg;
		if(hdjsjg>0 && cjjg>=0){
			if(hdjsjg>=cjjg){
				return hdjsjg;
			}
		}
		return jsjg;
	}
	
	
	/**
	   * 财务报表   附表研发支出的[其中：委托境外进行研发活动所发生的费用（包括存在关联关系的委托研发）]=
	   * (1)当“委托方与受托方是否存在关联关系选项”为不存在，且“是否委托境外选项”为委托境外时，序号7.1等于序号7；
	   * (2)当“委托方与受托方是否存在关联关系选项”为存在，且“是否委托境外选项”为委托境外时，序号7.1等于序号一至六的合计；
	   * (因为前6行是固定行，不需要计算，第7行开始是动态行，需要计算，所以才使用自定义公式)
	   */
	function cwbbyfzc_f043(){
		var yfzcfzzhzbGridlb = formData.SB100VO.SB100BdxxVO.cjbdxml.yfzcfzzhzbVO.yfzcfzzhzbGrid.yfzcfzzhzbGridlb;
		if(yfzcfzzhzbGridlb!=null && yfzcfzzhzbGridlb.length>6){
			for(i=6;i<yfzcfzzhzbGridlb.length;i++){
				var yfzcfzzhzbGridVo = yfzcfzzhzbGridlb[i];
				if(yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='01'&&yfzcfzzhzbGridVo.sfwtjwxx=='02'){
					yfzcfzzhzbGridVo.f043 = ROUND(yfzcfzzhzbGridVo.f001+yfzcfzzhzbGridVo.f002+yfzcfzzhzbGridVo.f003+yfzcfzzhzbGridVo.f004+yfzcfzzhzbGridVo.f005+yfzcfzzhzbGridVo.f006+yfzcfzzhzbGridVo.f007+yfzcfzzhzbGridVo.f008+yfzcfzzhzbGridVo.f009+yfzcfzzhzbGridVo.f010+yfzcfzzhzbGridVo.f011+yfzcfzzhzbGridVo.f012+yfzcfzzhzbGridVo.f013+yfzcfzzhzbGridVo.f014+yfzcfzzhzbGridVo.f015+yfzcfzzhzbGridVo.f016+yfzcfzzhzbGridVo.f017+yfzcfzzhzbGridVo.f018+yfzcfzzhzbGridVo.f019+yfzcfzzhzbGridVo.f020+yfzcfzzhzbGridVo.f041,2);
				}else if(yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='02'&&yfzcfzzhzbGridVo.sfwtjwxx=='02'){
					yfzcfzzhzbGridVo.f043 = ROUND(yfzcfzzhzbGridVo.f042,2);
				}else if(yfzcfzzhzbGridVo.sfwtjwxx=='01'){
					if(yfzcfzzhzbGridVo.tempf043 != undefined && yfzcfzzhzbGridVo.tempf043 != null && yfzcfzzhzbGridVo.tempf043 != ''){
						yfzcfzzhzbGridVo.f043 = yfzcfzzhzbGridVo.tempf043;
					}else{
						yfzcfzzhzbGridVo.f043 = 0.00;
					}
				}
				else{
					yfzcfzzhzbGridVo.f043 = 0.00;
				}
			}
		}
	}
	
	
	/**
	   * 财务报表   附表研发支出的[九、当期费用化支出可加计扣除总额]
	   * （1）当项目明细中“资本化、费用化支出选项”为费用化且“研发形式”为委托研发、“委托方与受托方是否存在关联关系选项”为存在时=
	   *     [序号8+最小值（其他相关费用序号6合计,序号8.1）-序号7.1]×80%，其中，“最小值”是指其他相关费用序号6合计与序号8.1相比的孰小值（下同）；
	   * （2）当项目明细中“资本化、费用化支出选项”为费用化且“研发形式”为委托研发、“委托方与受托方是否存在关联关系选项”为不存在时=（序号7-序号7.1）×80%；
	   * （3）当项目明细中“资本化、费用化支出选项”为费用化且“研发形式”为自主研发、合作研发和集中研发时=序号8+最小值（其他相关费用序号6合计,序号8.1）；
	   * （4）其他情形不需填写本栏次；
	   * (因为前6行是固定行，不需要计算，第7行开始是动态行，需要计算，所以才使用自定义公式)
	   */
	function cwbbyfzc_f046(){
		var yfzcfzzhzbGridlb = formData.SB100VO.SB100BdxxVO.cjbdxml.yfzcfzzhzbVO.yfzcfzzhzbGrid.yfzcfzzhzbGridlb;
		if(yfzcfzzhzbGridlb!=null && yfzcfzzhzbGridlb.length>6){
			for(i=6;i<yfzcfzzhzbGridlb.length;i++){
				var yfzcfzzhzbGridVo = yfzcfzzhzbGridlb[i];
				if(yfzcfzzhzbGridVo.zbhfyhzcxx=='02'&&yfzcfzzhzbGridVo.yfxs=='2'&&yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='01'){
					yfzcfzzhzbGridVo.f046 = ROUND((yfzcfzzhzbGridVo.f044+MIN(yfzcfzzhzbGridVo.f041,yfzcfzzhzbGridVo.f045)-yfzcfzzhzbGridVo.f043)*0.8,2);
				}else if(yfzcfzzhzbGridVo.zbhfyhzcxx=='02'&&yfzcfzzhzbGridVo.yfxs=='2'&&yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='02'){
					yfzcfzzhzbGridVo.f046 = ROUND((yfzcfzzhzbGridVo.f042-yfzcfzzhzbGridVo.f043)*0.8,2);
				}else if(yfzcfzzhzbGridVo.zbhfyhzcxx=='02'&&(yfzcfzzhzbGridVo.yfxs=='1'||yfzcfzzhzbGridVo.yfxs=='3'||yfzcfzzhzbGridVo.yfxs=='4')){
					yfzcfzzhzbGridVo.f046 = ROUND(yfzcfzzhzbGridVo.f044+MIN(yfzcfzzhzbGridVo.f041,yfzcfzzhzbGridVo.f045),2);
				}else{
					yfzcfzzhzbGridVo.f046 = 0.00;
				}
			}
		}
	}
	
	
	/**
	   * 财务报表   附表研发支出的[当期资本化可加计扣除的研发费用率]
	   * （1）当项目明细中“资本化、费用化支出选项”为资本化且“项目实施状态选项”为已完成、“研发形式”为委托研发、“委托方与受托方是否存在关联关系选项”为存在时=
	   *    {[序号8+最小值（其他相关费用序号6合计,序号8.1)-序号7.1]×80%}/序号一至六的合计×100%；
	   * （2）当项目明细中“资本化、费用化支出选项”为资本化且“项目实施状态选项”为已完成、“研发形式”为委托研发、“委托方与受托方是否存在关联关系选项”为不存在时=
	   *     [（序号7-序号7.1）×80%]/序号7×100%；
	   * （3）当项目明细中“资本化、费用化支出选项”为资本化且“项目实施状态选项”为已完成、“研发形式”为自主研发、合作研发和集中研发时=
	   *     [序号8+最小值（其他相关费用序号6合计,序号8.1）]/序号一至六的合计×100%；
	   * （4）其他情形不需填写本栏次；
	   * （5）“当期资本化可加计扣除的研发费用率”应当记录在对应的无形资产明细账上，以便用于计算归集《研发项目可加计扣除研究开发费用情况归集表》序号10.1“其中：准予加计扣除的摊销额”；
	   * (因为前6行是固定行，不需要计算，第7行开始是动态行，需要计算，所以才使用自定义公式)
	   */
	function cwbbyfzc_f047(){
		var yfzcfzzhzbGridlb = formData.SB100VO.SB100BdxxVO.cjbdxml.yfzcfzzhzbVO.yfzcfzzhzbGrid.yfzcfzzhzbGridlb;
		if(yfzcfzzhzbGridlb!=null && yfzcfzzhzbGridlb.length>6){
			var yfzcfzzhzbGridVo5 = yfzcfzzhzbGridlb[5];//第6行的vo
			for(i=6;i<yfzcfzzhzbGridlb.length;i++){
				var yfzcfzzhzbGridVo = yfzcfzzhzbGridlb[i];
				if(yfzcfzzhzbGridVo.zbhfyhzcxx=='01'&&yfzcfzzhzbGridVo.xmssztxx=='02'&&yfzcfzzhzbGridVo.yfxs=='2'&&yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='01'&&(yfzcfzzhzbGridVo.f001+yfzcfzzhzbGridVo.f002+yfzcfzzhzbGridVo.f003+yfzcfzzhzbGridVo.f004+yfzcfzzhzbGridVo.f005+yfzcfzzhzbGridVo.f006+yfzcfzzhzbGridVo.f007+yfzcfzzhzbGridVo.f008+yfzcfzzhzbGridVo.f009+yfzcfzzhzbGridVo.f010+yfzcfzzhzbGridVo.f011+yfzcfzzhzbGridVo.f012+yfzcfzzhzbGridVo.f013+yfzcfzzhzbGridVo.f014+yfzcfzzhzbGridVo.f015+yfzcfzzhzbGridVo.f016+yfzcfzzhzbGridVo.f017+yfzcfzzhzbGridVo.f018+yfzcfzzhzbGridVo.f019+yfzcfzzhzbGridVo.f020+yfzcfzzhzbGridVo.f041)!=0){
					yfzcfzzhzbGridVo.f047 = ROUND(((yfzcfzzhzbGridVo.f044+MIN(yfzcfzzhzbGridVo.f041,yfzcfzzhzbGridVo.f045)-yfzcfzzhzbGridVo.f043)*0.8)/(yfzcfzzhzbGridVo.f001+yfzcfzzhzbGridVo.f002+yfzcfzzhzbGridVo.f003+yfzcfzzhzbGridVo.f004+yfzcfzzhzbGridVo.f005+yfzcfzzhzbGridVo.f006+yfzcfzzhzbGridVo.f007+yfzcfzzhzbGridVo.f008+yfzcfzzhzbGridVo.f009+yfzcfzzhzbGridVo.f010+yfzcfzzhzbGridVo.f011+yfzcfzzhzbGridVo.f012+yfzcfzzhzbGridVo.f013+yfzcfzzhzbGridVo.f014+yfzcfzzhzbGridVo.f015+yfzcfzzhzbGridVo.f016+yfzcfzzhzbGridVo.f017+yfzcfzzhzbGridVo.f018+yfzcfzzhzbGridVo.f019+yfzcfzzhzbGridVo.f020+yfzcfzzhzbGridVo.f041),2);
				}else if(yfzcfzzhzbGridVo.zbhfyhzcxx=='01'&&yfzcfzzhzbGridVo.xmssztxx=='02'&&yfzcfzzhzbGridVo.yfxs=='2'&&yfzcfzzhzbGridVo.wtfystfsfczglgxxx=='02'&&yfzcfzzhzbGridVo.f042!=0){
					yfzcfzzhzbGridVo.f047 = ROUND(((yfzcfzzhzbGridVo.f042-yfzcfzzhzbGridVo.f043)*0.8)/yfzcfzzhzbGridVo.f042,2);
				}else if(yfzcfzzhzbGridVo.zbhfyhzcxx=='01'&&yfzcfzzhzbGridVo.xmssztxx=='02'&&(yfzcfzzhzbGridVo.yfxs=='1'||yfzcfzzhzbGridVo.yfxs=='3'||yfzcfzzhzbGridVo.yfxs=='4')&&(yfzcfzzhzbGridVo.f001+yfzcfzzhzbGridVo.f002+yfzcfzzhzbGridVo.f003+yfzcfzzhzbGridVo.f004+yfzcfzzhzbGridVo.f005+yfzcfzzhzbGridVo.f006+yfzcfzzhzbGridVo.f007+yfzcfzzhzbGridVo.f008+yfzcfzzhzbGridVo.f009+yfzcfzzhzbGridVo.f010+yfzcfzzhzbGridVo.f011+yfzcfzzhzbGridVo.f012+yfzcfzzhzbGridVo.f013+yfzcfzzhzbGridVo.f014+yfzcfzzhzbGridVo.f015+yfzcfzzhzbGridVo.f016+yfzcfzzhzbGridVo5.f017+yfzcfzzhzbGridVo5.f018+yfzcfzzhzbGridVo5.f019+yfzcfzzhzbGridVo.f020+yfzcfzzhzbGridVo5.f041)!=0){
					yfzcfzzhzbGridVo.f047 = ROUND((yfzcfzzhzbGridVo.f044+MIN(yfzcfzzhzbGridVo.f041,yfzcfzzhzbGridVo.f045))/(yfzcfzzhzbGridVo.f001+yfzcfzzhzbGridVo.f002+yfzcfzzhzbGridVo.f003+yfzcfzzhzbGridVo.f004+yfzcfzzhzbGridVo.f005+yfzcfzzhzbGridVo.f006+yfzcfzzhzbGridVo.f007+yfzcfzzhzbGridVo.f008+yfzcfzzhzbGridVo.f009+yfzcfzzhzbGridVo.f010+yfzcfzzhzbGridVo.f011+yfzcfzzhzbGridVo.f012+yfzcfzzhzbGridVo.f013+yfzcfzzhzbGridVo.f014+yfzcfzzhzbGridVo.f015+yfzcfzzhzbGridVo.f016+yfzcfzzhzbGridVo.f017+yfzcfzzhzbGridVo.f018+yfzcfzzhzbGridVo.f019+yfzcfzzhzbGridVo.f020+yfzcfzzhzbGridVo.f041),2);
				}else{
					yfzcfzzhzbGridVo.f047 = 0.00;
				}
			}
		}
	}
	
	/**
	   * 增值税预缴申报 预征项目在期初数不包含，该行锁定，不可修改。
	   * @param yzxm    预征项目
	   * @param yzxmGridlb      期初数预征项目
	   * @returns
	   */
	function zzsyjsb_yzxm(yzxm,yzxmGridlb){
		if(yzxmGridlb == null || yzxmGridlb == undefined){
			return true;
		}
		for(var i = 0; i < yzxmGridlb.length; i++){
			if(yzxm == yzxmGridlb[i].yzxmDm){
				return false;
			}
		}
		return true;
	}
	
	
	/**个人所得税设置任职、受雇单位、任职受雇单位 所属行业、行业代码为空*/
	function setRzdwValueNull(flag){
		if(flag){
			formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.rzdwMc = '';
			formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.rzdwSshyMc = '';
			formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.rzdwSshyDm = '';
		}
	}
	
	/**个人所得税经营单位名称为''*/
	function setJydwValueNull(flag){
		if(flag){
			formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.jydwNsrmc = '';
		}
	}
	
	
	function indexOf(s,r){
		r = r.replace('==','=');
		return s.indexOf(r);
	}
	/**本表中销项税额必须等于销售额乘以对应税率（允许存在有一块钱误差） （本表第2列中的第1栏至第5栏、第8栏至第13c栏有此校验）
	* 全国（除陕西外）增加校验,现陕西允许有正负10元钱的差额*/ 
	function checkXxse(xxse,xse,ewbhxh,yzl13a,gzZzsTlzgsYzl,kshztlzcdnsrYzl,sjgsdq){
		var flag = true;
		var ce = 1;
		var sls={"1":"0.16","2":"0.16","3":"0.13","4":"0.10","5":"0.06"
			,"8":"0.06","9":"0.05","10":"0.04","11":"0.03","12":"0.03","13":""+yzl13a+"",
			"20":""+gzZzsTlzgsYzl+"","21":""+kshztlzcdnsrYzl+"","22":"0.05","23":"0.11"};
		if(sjgsdq.substring(0,3)=="161"){
			ce = 10;
		}
		var tempXxse = ROUND(parseFloat(sls[ewbhxh])*xse,2);
		if(Math.abs(xxse-tempXxse)>ce){
			flag = false;
			return flag;
		}
		return flag;
	}
	
	/**个人所得税年12万设置申报日期,因为有暂存报文的时候，申报日期还是用了暂存报文，所以需要使用12公式触发*/
	function setN12wSbrq(){
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth()+1;
		var day = currDate.getDate();
		var monthStr = "" + month;
		var dayStr = "" + day;
		if(month<9){
			monthStr = "0" + month;
		}
		if(day<9){
			dayStr = "0" + day;
		}
		var tbrq = year + "-" + monthStr + "-" + dayStr;
		formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.tbrq1 = tbrq;
		formData.nsdsewysnsrgrsdssbYwbw.nsdsewysnsrgrsdssb.head.lrrq = tbrq;
		formData.grsdsjmssxbgbYwbw.grsdsjmssxbgbBzds.head.tbrq1 =  tbrq;
		formData.grsdsjmssxbgbYwbw.grsdsjmssxbgbBzds.head.sbrq =  tbrq;
		formData.grsdsjmssxbgbYwbw.grsdsjmssxbgbBzds.head.slrq =  tbrq;
		formData.grsdsjmssxbgbYwbw.grsdsjmssxbgbBzds.head.lrrq =  tbrq;
		//因为是用12公式触发，所以返回true
		return true;
	}
	
	/**水资源税税源信息采集根据选择的水源类型设置年取用水计划（地下水）或者年取用水计划（地表水）为0*/
	function szyssycj_setDxdbs(){
		var sylxjhDm = formData.DJSzyssyxxVO.sylxjh_dm;
		if(sylxjhDm=="1"){
			//选择了地表水，地下水清0
			formData.DJSzyssyxxVO.nqysjhdxs = 0;
		}else if(sylxjhDm=="2"){
			//选择了地下水，地表水清0
			formData.DJSzyssyxxVO.nqysjhdbs = 0;
		}else{
			//都清0
			formData.DJSzyssyxxVO.nqysjhdxs = 0;
			formData.DJSzyssyxxVO.nqysjhdbs = 0;
		}
	}
	
	//水资源申报校验zspm
	function checkZspm(zspm,zjbl){
		var zspmList = formData.szyvo.szysSbb.skxxGrid.skxxGridlb;
		if(zspm == ''||zspm == null){
			return true;
		}
		for(var i = 0;i<zspmList.length;i++){
			if(zspm == zspmList[i].zspmDm){
				return true;
			}
		}
		return false;
	}
	//水资源申报校验zszm
	function checkZszm(zszm,zjbl){
		var zszmList = formData.szyvo.szysSbb.skxxGrid.skxxGridlb;
		if(zszm == ''||zszm == null){
			return true;
		}
		for(var i = 0;i<zszmList.length;i++){
			if(zszm == zszmList[i].zszmDm){
				return true;
			}
		}
		return false;
	}
	
	//水资源A计算ynse
	function getSzyYnse(sqljqsl,bqqsl,bqljqsl,sl1,nqysjhdbs,nqysjhdxs){
		var skxxGridlb = formData.szyvo.szysSbb.skxxGrid.skxxGridlb;
		var csz = formData.qcs.initData.cspzGrid.csz;
		var csz1 = parseFloat(formData.qcs.initData.cspzGrid2.csz);
		var bs = csz.split(';')[0].split(',');//倍数
		var qj = csz.split(';')[1].split(',');//区间
		var len = qj.length;//区间的长度
		var ljindex = 0;//累计取水量所在的区间
		var sqindex = 0;//上期取水量所在的区间
		var ynse = 0;
		if(formData.szyvo.szysSbb.syxxForm.qsxkzt == 'Y'){
			if(nqysjhdbs!=0){
				for(var i=0;i<len;i++){
					if(i==0 && bqljqsl<=nqysjhdbs){
						ljindex = i;
					}else if(i+1<len){
						var x1 = parseFloat(qj[i]);
						var x2 = parseFloat(qj[i+1]);
						var zjz1 = nqysjhdbs*(1+x1);
						var zjz2 = nqysjhdbs*(1+x2);
						if(bqljqsl>zjz1 && bqljqsl<=zjz2){
							ljindex = i+1;
							break ;
						}
					}else{
						var x1 = parseFloat(qj[i]);
						var zjz2 = nqysjhdbs*(1+x1);
						if(bqljqsl>zjz2){
							ljindex = i+1;
						}
					}		
				}
				for(var j=0;j<ljindex;j++){
					if(j==0&&sqljqsl<=nqysjhdbs){
						sqindex = j;
					}else if(j+1<ljindex){
						var x1 = parseFloat(qj[j]);
						var x2 = parseFloat(qj[j+1]);
						var zjz1 = nqysjhdbs*(1+x1);
						var zjz2 = nqysjhdbs*(1+x2);
						if(sqljqsl>zjz1 && sqljqsl<=zjz2){
							sqindex = j+1;
							break ;
						}
					}else{
						var x1 = parseFloat(qj[j]);
						var zjz2 = nqysjhdbs*(1+x1);
						if(sqljqsl>zjz2){
							sqindex = j+1;
						}
					}
				}
				
				for(var x = sqindex;x <= ljindex;x++){
					if(sqindex == ljindex){
						ynse = bqqsl * sl1 * bs[x];
					}else if(x == sqindex){
						ynse = ynse + (nqysjhdbs*(1+parseFloat(qj[x]))-sqljqsl)*sl1*parseFloat(bs[x]);
					}else if(x < ljindex){
						ynse = ynse + (parseFloat(qj[x])-parseFloat(qj[x-1]))*nqysjhdbs*sl1*parseFloat(bs[x]);
					}else{
						ynse = ynse  + (bqljqsl-nqysjhdbs*(1+parseFloat(qj[x-1])))*sl1*parseFloat(bs[x]);
					}			
				}
			}else{
				for(var i=0;i<len;i++){
					if(i==0 && bqljqsl<=nqysjhdxs){
						ljindex = i;
					}else if(i+1<len){
						var x1 = parseFloat(qj[i]);
						var x2 = parseFloat(qj[i+1]);
						var zjz1 = nqysjhdxs*(1+x1);
						var zjz2 = nqysjhdxs*(1+x2);
						if(bqljqsl>zjz1 && bqljqsl<=zjz2){
							ljindex = i+1;
							break ;
						}
					}else{
						var x1 = parseFloat(qj[i]);
						var zjz2 = nqysjhdxs*(1+x1);
						if(bqljqsl>zjz2){
							ljindex = i+1;
						}
					}		
				}
				for(var j=0;j<ljindex;j++){
					if(j==0&&sqljqsl<=nqysjhdxs){
						sqindex = j;
					}else if(j+1<ljindex){
						var x1 = parseFloat(qj[j]);
						var x2 = parseFloat(qj[j+1]);
						var zjz1 = nqysjhdxs*(1+x1);
						var zjz2 = nqysjhdxs*(1+x2);
						if(sqljqsl>zjz1 && sqljqsl<=zjz2){
							sqindex = j+1;
							break ;
						}
					}else{
						var x1 = parseFloat(qj[j]);
						var zjz2 = nqysjhdxs*(1+x1);
						if(sqljqsl>zjz2){
							sqindex = j+1;
						}
					}
				}
				
				for(var x = sqindex;x <= ljindex;x++){
					if(sqindex == ljindex){
						ynse = bqqsl * sl1 * bs[x];
						//ynse = (nqysjhdxs*(1+parseFloat(qj[x]))-sqljqsl)*sl1*parseFloat(bs[x]) + (bqljqsl-nqysjhdxs*(1+parseFloat(qj[x])))*sl1*parseFloat(bs[x]);
					}else if(x == sqindex){
						ynse = ynse + (nqysjhdxs*(1+parseFloat(qj[x]))-sqljqsl)*sl1*parseFloat(bs[x]);
					}else if(x < ljindex){
						ynse = ynse + (parseFloat(qj[x])-parseFloat(qj[x-1]))*nqysjhdxs*sl1*parseFloat(bs[x]);
					}else{
						ynse = ynse  + (bqljqsl-nqysjhdxs*(1+parseFloat(qj[x-1])))*sl1*parseFloat(bs[x]);
					}			
				}
			}
		}else{
			ynse = bqqsl*sl1*csz1;
		}
		
		
		formData.szyvo.szysSbb.skxxGrid.skxxGridlb[0].bqynse = ynse.toFixed(2);
		formulaEngine.apply("szyvo.szysSbb.skxxGrid.skxxGridlb[0].bqynse",ynse.toFixed(2));
	
	}
	
	//校验税款所属期是否为按次、按月、按季申报
	function checkSkssq(skssqq,skssqz){
		var qq_year = skssqq.split('-')[0];
		var qq_month = skssqq.split('-')[1];
		var qq_day = skssqq.split('-')[2];
		
		var qz_year = skssqz.split('-')[0];
		var qz_month = skssqz.split('-')[1];
		var qz_day = skssqz.split('-')[2];
		var end_day = new Date(qz_year,qz_month,0).getDate();//当月的天数
		
		var t1 = qq_month == '01' && qq_day == '01' && qz_month == '03' && qz_day == end_day;
		var t2 = qq_month == '04' && qq_day == '01' && qz_month == '06' && qz_day == end_day;
		var t3 = qq_month == '07' && qq_day == '01' && qz_month == '09' && qz_day == end_day;
		var t4 = qq_month == '10' && qq_day == '01' && qz_month == '12' && qz_day == end_day;
		
		if(qq_year != qz_year){
			return false;
		}else{
			if(qq_month == qz_month && qq_day == qz_day){//按次
				return true;
			}
			if(qq_month == qz_month && qq_day == '01' && qz_day == end_day){//按月
				return true;
			}
			if(t1 || t2 || t3 ||t4){//按季
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 水资源 url没传属期时，把报文中属期传入queryString提供给回执页展示
	 * @param skssqq
	 * @param skssqz
	 */
	function setSkssq(skssqq,skssqz){
		$("#sssqQ").val(skssqq);
		$("#sssqZ").val(skssqz);
		var _query_string_Obj = JSON.parse("{"+$("#_query_string_").val()+"}");
		_query_string_Obj.sssqQ = skssqq;
		_query_string_Obj.sssqZ = skssqz;
		var _query_string_ = JSON.stringify(_query_string_Obj).replace("{","").replace("}","");
		$("#_query_string_").val(_query_string_);
		return true;
	}
	
/**
 * 环保税B表自定义计算公式
 * @returns
 */	
	
//IE8 不兼容JQ的$.isEmptyObject()方法
	
function isEmptyObject(obj){
	if(obj==""||obj==null||obj==undefined){
		return true;
	}else{
		return false;
	}
	return true;
}
	
function HBSB_GET_JSJSDWMC(){
	var sblx = this.formData.ywbw.hbssbForm.sblx;
	if (sblx == "02"){//简易申报计量单位为空
		return "";
	}
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	var dmMcbz = arguments[2];//代码还是名称赋值标记
	
	if (isEmptyObject(zspmDm)){
		return "";
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[3]){
		return "";
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	
	if (!isEmptyObject(zszmDm)){
		if (dmMcbz=="0"){//名称赋值
			return zszmCT[zspmDm][zszmDm].jsjsdwmc;
		}
		if (dmMcbz=="1"){//代码赋值
			return zszmCT[zspmDm][zszmDm].jldwDm;
		}
	}
	if (dmMcbz=="0"&&zspmCT[zsxmDm][zspmDm].pmtzzBz=="Y"){//名称赋值
	
		return zspmCT[zsxmDm][zspmDm].jsjsdwmc;
	}
	if (dmMcbz=="1"&&zspmCT[zsxmDm][zspmDm].pmtzzBz=="Y"){//代码赋值
		return zspmCT[zsxmDm][zspmDm].jldwDm;
	}
	
	return "";
}

function HBSB_GET_WRDLZ(){
	var sblx = this.formData.ywbw.hbssbForm.sblx;
	if (sblx == "02"){//简易申报污染当量值为0且不可填
		return 0.00;
	}
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	
	if (isEmptyObject(zspmDm)){
		return 0.00;
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[2]){
		return 0.00;
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	
	if (!isEmptyObject(zszmDm)){
		if (zszmCT[zspmDm][zszmDm].tzzbz1 == "Y"){
			return zszmCT[zspmDm][zszmDm].wrdlz;
		}
	}
	if (zspmCT[zsxmDm][zspmDm].tzzbz1 == "Y"&&zspmCT[zsxmDm][zspmDm].pmtzzBz=="Y"){
		return zspmCT[zsxmDm][zspmDm].wrdlz;
	}
	return 0.00;
}

function HBSB_GET_WRDLS(){
	var ewbhxh = arguments[4];//二维表行序号
	var wrdls=this.formData.ywbw.sbskxxGrid.sbskxxGridlb[ewbhxh-1].wrdls;
	
	var sblx = this.formData.ywbw.hbssbForm.sblx;
	//如果他本身就有数据了， 就不需要重新计算，  曾删行的时候会触发公式，如果重新计算会覆盖自己手填写的
	if(wrdls!=0 && sblx == "02"){
		return wrdls;
	}
	
	var zspmDm = arguments[0];
	if (isEmptyObject(zspmDm)){
		return 0.00;
	}
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	var zbz = arguments[2];//特征指标值
	var  tzxs=this.formData.ywbw.sbskxxGrid.sbskxxGridlb[ewbhxh-1].tzcwxs; //特征系数
	
	if (isEmptyObject(zspmDm)){
		return 0.00;
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[3]){
		return 0.00;
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	
	var tzzbz1 = "";
	var wrdlz = 0.00;
	var tzzjsf=""; //特征值计算规则 1：特征污染当量值;2：特征污染当量数;3：特征产污系数 
	if (!isEmptyObject(zszmDm)){
		tzzbz1 = zszmCT[zspmDm][zszmDm].tzzbz1;
		wrdlz = zszmCT[zspmDm][zszmDm].wrdlz;
		tzzjsf = zszmCT[zspmDm][zszmDm].tzzjsf;
		if (sblx == "01"  && wrdlz != 0){
			//采用特征系数计算的，“污染当量数或计税依据”=“特征指标数量”×“特征系数”÷“污染当量值”
			if(tzzjsf=="3"){
				return (zbz*tzxs)/wrdlz;
			}
							
			//采用特征值计算的，“污染当量数或计税依据”=“特征指标数量”×“特征值）
			if(tzzjsf=="2"){
				return zbz*wrdlz;
			}
			
			//采用污染当量值计算的，“污染当量数或计税依据”=“特征指标数量”÷“污染当量值”
			if(tzzjsf=="1"){
				return zbz/wrdlz;
			}
			
		}
	}
	tzzbz1 = zspmCT[zsxmDm][zspmDm].tzzbz1;
	wrdlz = zspmCT[zsxmDm][zspmDm].wrdlz;
	tzzjsf = zspmCT[zsxmDm][zspmDm].tzzjsf;
	if (sblx == "01" && wrdlz != 0&&zspmCT[zsxmDm][zspmDm].pmtzzBz=="Y"){
		//采用特征系数计算的，“污染当量数或计税依据”=“特征指标数量”×“特征系数”÷“污染当量值”
		if(tzzjsf=="3"){
			return (zbz*tzxs)/wrdlz;
		}
						
		//采用特征值计算的，“污染当量数或计税依据”=“特征指标数量”×“特征值）
		if(tzzjsf=="2"){
			return zbz*wrdlz;
		}
		
		//采用污染当量值计算的，“污染当量数或计税依据”=“特征指标数量”÷“污染当量值”
		if(tzzjsf=="1"){
			return zbz/wrdlz;
		}
		
	}
	return 0.00;
}

function HBSB_GET_TZCWXS(){
	var sblx = this.formData.ywbw.hbssbForm.sblx;
	if (sblx == "02"){
		return 0.00;
	}
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	
	if (isEmptyObject(zspmDm)){
		return 0.00;
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[2]){
		return 0.00;
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	var tzzjsf="";
	if (!isEmptyObject(zszmDm)){
		tzzjsf = zszmCT[zspmDm][zszmDm].tzzjsf;
		if(tzzjsf=="3"){
		return zszmCT[zspmDm][zszmDm].tzcwxs;
		}
	}
	if(zspmCT[zsxmDm][zspmDm].pmtzzBz=="Y"){
		tzzjsf = zspmCT[zsxmDm][zspmDm].tzzjsf;
		if(tzzjsf=="3"){
		return zspmCT[zsxmDm][zspmDm].tzcwxs;
		}
	}
	return 0.00;
}

function HBSB_GET_SL1(){
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	
	if (isEmptyObject(zspmDm)){
		return 0.00;
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[2]){
		return 0.00;
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	
	var sblx = this.formData.ywbw.hbssbForm.sblx;
	if (sblx == "01"){
		if (!isEmptyObject(zszmDm)){
			return zszmCT[zspmDm][zszmDm].sl1;
		}
	}else{
		if (!isEmptyObject(zszmDm)){
			if(zszmCT[zspmDm][zszmDm] 
				&& zszmCT[zspmDm][zszmDm].sl1 != undefined 
				&& zszmCT[zspmDm][zszmDm].sl1 != null){
				return zszmCT[zspmDm][zszmDm].sl1;
			}
		}
	}
	var pmtzzBz=zspmCT[zsxmDm][zspmDm].pmtzzBz;
	if(pmtzzBz=="N"&&sblx=="01"){
		return 0.00;
	}
	return zspmCT[zsxmDm][zspmDm].sl1;
}
/**
 * 环保税B表减免税额计算——默认规则
 * @returns {Number}
 */
function HBS_GET_JMSE(){
	var zspmDm = arguments[0];
	var zszmDm = arguments[1];
	var ynse = arguments[2];
	var jmxzDm = arguments[3];
	var jmse=0;
	if(jmxzDm!=''&&jmxzDm!=null&&this.formCT.jmxzCT!=undefined&&(zspmDm).indexOf('1012130')==-1){
		jmse=((this.formCT.jmxzCT[zspmDm][jmxzDm].jmed==undefined?1:this.formCT.jmxzCT[zspmDm][jmxzDm].jmed)*ynse).toFixed(2);
		
	}
	
	return jmse ;
}	

function HBSB_GET_FZSPMDM(){
	var zspmDm = arguments[0];//征收品目代码
	var zszmDm = arguments[1];//征收子目代码
	
	if (isEmptyObject(zspmDm)){
		return "";
	}
	
	var zsxmDm = zspmDm.substring(0,6)+"000";
	if (zsxmDm != arguments[2]){
		return "";
	}
	var zspmCT = this.formCT.zspmCT;
	var zszmCT = this.formCT.zszmCT;
	
	if (!isEmptyObject(zszmDm)){
		return zszmCT[zspmDm][zszmDm].sjpmDm;
	}
	
	return zspmCT[zsxmDm][zspmDm].sjpmDm;
}

/**
 * 更正申报，不执行正常申报的公式时使用。 有关联公式时可能不起效
 * @param flag
 * @param trueValue
 * @param falseValue 传入公式左边的ng-model, 如果flag不通过，赋值原来的，相当于不赋值
 */
function gzsbSetValue(flag, trueValue, falseValue) {
	if (flag) {
		return eval(trueValue);
	} else {
		return eval(falseValue);
	}
}


function HBSB_CHECK_YJSE(){
	var rtnData = {};
	rtnData.isTrue = true;
	rtnData.yjse = 0.00;
	
	var zspmDm = arguments[0];
	var yjse= arguments[1];
	var sybh = arguments[2];
	var zszmDm = arguments[3];
	var ewbhxh = arguments[4];
	var sbywbm=$("#ywbm").val().toUpperCase();
	
	if (yjse == 0){//填写的预缴税额为0
		rtnData.isTrue = true;
		rtnData.yjse = 0.00;
		return rtnData;
	}
	//输入值不为0需做校验
	if (isEmptyObject(zspmDm)){
		rtnData.isTrue = false;
		rtnData.yjse = 0.00;
		return rtnData;
	}
	var skssqq = this.formData.ywbw.hbssbForm.skssqq;
	var skssqz = this.formData.ywbw.hbssbForm.skssqz;
	var nsryjxxGridlb = this.formData.qcs.initData.nsryjxxGrid.nsryjxxGridlb;
	
	var yjyehj = 0.00;
	
	if (nsryjxxGridlb.length > 0 && !isEmptyObject(nsryjxxGridlb[0].zspmDm)){
		for (var i = 0; i < nsryjxxGridlb.length; i++){
			//预缴属期止只要在所属期止之前的都可用
			if (nsryjxxGridlb[i].zspmDm == zspmDm && nsryjxxGridlb[i].skssqz <= skssqz){
				yjyehj += nsryjxxGridlb[i].yjyehj;
			}
		}
	}
	

		
	var syxx=this.formData.ywbw.sbskxxGrid.sbskxxGridlb;
	var  key1="";
	//环保税A 
	if (sbywbm=="HBS_A"){
		
		  key1=sybh+"_"+zspmDm+"_"+zszmDm;
		
	}
	
	//环保税A 
	if (sbywbm=="HBS_B"){
		
		  key1=ewbhxh+"_"+zspmDm+"_"+zszmDm;
		
	}
	
  //已用预缴余额合计
	var yyyjehj=0;
	
	 for(var i = 0; i < syxx.length; i++){
		 var  key2="";
		//环保税A 
			if (sbywbm=="HBS_A"){
				   key2=syxx[i].sybh1+"_"+syxx[i].zspmDm+"_"+syxx[i].zszmDm
			}
			
			//环保税B
			if (sbywbm=="HBS_B"){
				   key2=syxx[i].ewbhxh+"_"+syxx[i].zspmDm+"_"+syxx[i].zszmDm
				}
		 	 
	    if(key1!=key2){
			yyyjehj=yyyjehj+syxx[i].yjse;
			
		 }
	 }
	 
		//可用预缴余额  
		var kyyjye=yjyehj-yyyjehj>=0?yjyehj-yyyjehj:0;;
	
		
		rtnData.isTrue = (yjse <= kyyjye);
		rtnData.yjse = kyyjye;
		
		return rtnData;
		

}


/**
 * 当第14、15、16、17、18列均≠0，14列绝对值=15列+16列+17列+18列的绝对值
 * @param nsrsbh
 * @param qsannd
 * @param qernd
 * @param qyind
 * @param bn
 * @returns qsind
 */
function qysdsa17nd_fhbxzctzdynstzmxbGridlb_qsind(nsrsbh,qsannd,qernd,qyind,bn){
	var fhbxzctzdynstzmxbGridlb=formData.ywbw.fhbxzctzdynstzmxb.fhbxzctzdynstzmxbGrid.fhbxzctzdynstzmxbGridlb;
	var qsind=0;
	for (var i = 0; i < fhbxzctzdynstzmxbGridlb.length; i++) {
		//判断条件可能不足
		if(nsrsbh==fhbxzctzdynstzmxbGridlb[i].nsrsbh&&qsannd==fhbxzctzdynstzmxbGridlb[i].qsannd&&qernd==fhbxzctzdynstzmxbGridlb[i].qernd&&qyind==fhbxzctzdynstzmxbGridlb[i].qyind&&bn==fhbxzctzdynstzmxbGridlb[i].bn){
			qsind=fhbxzctzdynstzmxbGridlb[i].qsind;
			break;
		}
	}
	if(qsind!=0&&qsannd!=0&&qernd!=0&&qyind!=0&&bn!=0){
		qsind=Math.abs(qsannd+qernd+qyind+bn);
	}
	return qsind;
}

/**
 * 判断封面经办人是否为空，为辅助节点
 * @param jbr
 * @returns {String}
 */
function qysdsa17nd_A000000_jbrVaild(jbr,node){
	if(jbr==''||jbr==undefined||jbr==null){
		return '';
	}else{
		if(node=='jbrzyzjhm'){
			var smzbz=formData.qcs.initData.nsrjbxx.smzxx.smzbz;
			if(smzbz=='Y'){
				return formData.qcs.initData.nsrjbxx.smzxx.zjhm;
			}
			return formData.qcs.initData.qysdsndAInitData.jbrzyzjhm;
		}else{
			return formData.qcs.initData.qysdsndAInitData.dlsbrq;
		}
	}
}

function qysdsa17nd_A109000_lastSeasonYjbData(flag){
	var sbQysdsczzsndsb2014NsrqtxxVO=formData.qcs.initData.qysdsndAInitData.sbQysdsczzsndsb2014NsrqtxxVO;
	if(sbQysdsczzsndsb2014NsrqtxxVO==undefined||sbQysdsczzsndsb2014NsrqtxxVO==null){
		return 0;
	}
	if(flag=='ZJGLJYFTDSDSE'){
		return isNull(sbQysdsczzsndsb2014NsrqtxxVO.zjgftse)?0:sbQysdsczzsndsb2014NsrqtxxVO.zjgftse;
	}else if(flag=='CZJZFPSDSE_LJ'){
		return isNull(sbQysdsczzsndsb2014NsrqtxxVO.zjgczjzftse)?0:sbQysdsczzsndsb2014NsrqtxxVO.zjgczjzftse;
	}else if(flag=='FZJGYFTSDSE_LJ'){
		return isNull(sbQysdsczzsndsb2014NsrqtxxVO.fzjgftse)?0:sbQysdsczzsndsb2014NsrqtxxVO.fzjgftse;
	}else if(flag=='ZJGDLSCJYBMYFTSDSE_LJ'){
		return isNull(sbQysdsczzsndsb2014NsrqtxxVO.scjydlbmse)?0:sbQysdsczzsndsb2014NsrqtxxVO.scjydlbmse;
	}else{
		return 0;
	}
}
/**
 * 计算两个日期之间的天数
 * @param startDate
 * @param endDate
 * @returns {Number}
 */
function getDateDiff(startDate,endDate) {
	if (isEmptyObject(startDate) || isEmptyObject(endDate)){
		return 0;
	}
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    return dates;
}

/**
 * 大连个性化
 * 计算两个日期之间的天数
 * @param startDate
 * @param endDate
 * @returns {Number}
 */
function getDateDiffByDl(startDate,endDate) {
	if (isEmptyObject(startDate) || isEmptyObject(endDate)){
		return 0;
	}
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = (startTime - endTime)/(1000*60*60*24);
    return dates;
}

/**
 * 传入formData... ，防止数据不在的时候公式编译失败。
 * @param str
 * @returns {Boolean}
 */
function hasNotZeroData(str) {
	try {
		var data = eval(str);
		if (Number(data) != 0) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

function dataEquals(str, val) {
	try {
		var data = eval(str);
		if (Number(data) == Number(val)) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}


function sfjmba(hmc1,ssjmxzDm,jmsspsxDm,jmxxGridlb,jmzlxDm,gzsbBz){
	if(jmxxGridlb != undefined && jmxxGridlb.length>0 && gzsbBz==1){
		if(ssjmxzDm!="" && ssjmxzDm!=null && jmsspsxDm!="" && jmsspsxDm!=null){
			for(var i=0; i<jmxxGridlb.length;i++){
				if(ssjmxzDm==jmxxGridlb[i].ssjmxzhzDm && jmsspsxDm==jmxxGridlb[i].jmsspsxDm&&jmzlxDm==jmxxGridlb[i].jmzlxDm){
					return true;
				}
			}
			return false;
		}
	}
	return true;
}

//成品油消费税获取主表对应品目的xssl
function cpyxfs_getXsslByZspmDm(zspmDm,sbsjxxcpyGridlb,cpyxsslhj,bqzykcsl){
	if(sbsjxxcpyGridlb!=undefined){
		for(var i=0;i<sbsjxxcpyGridlb.length;i++){
			if(sbsjxxcpyGridlb[i].zspmDm==zspmDm){
				return sbsjxxcpyGridlb[i].xssl;
			}
		}
	}
	return bqzykcsl;
}

//成品油消费税获取对应商品和服务税收分类编码的委托加工收回数量
function cpyxfs_getWtjgshslBySphfwssflbm(sphfwssflbm,stfdkdjskqkGridlb,bqwtjgshsl,wtjgshslhj,tempSphfwssflbm){
	if(stfdkdjskqkGridlb!=undefined && sphfwssflbm!=undefined){
		for(var i=0;i<stfdkdjskqkGridlb.length;i++){
			if(stfdkdjskqkGridlb[i].sphfwssflbm==sphfwssflbm){
				return stfdkdjskqkGridlb[i].wtjgshsl;
			}
		}
	}
	return bqwtjgshsl;
}

//成品油消费税获取按照【商品和服务税收分类编码】对应的征收品目汇总本期委托加工收回用于连续生产数量
function cpyxfs_getBqwtjgshyylxscslBySphfwssflbm(wtjghsdysxfplyqkGridlb,sphfwssflbm,bqwtjgshyylxscsl){
	var sphfwssflbmCT = this.formCT.sphfwssflbmCT;
	var zspmDm = "";
	if(sphfwssflbm!=undefined && sphfwssflbmCT!=undefined){
		zspmDm = sphfwssflbmCT[sphfwssflbm]!=null?sphfwssflbmCT[sphfwssflbm].zspmdm:"";
	}
	var hssl = 0;
	if(wtjghsdysxfplyqkGridlb!=undefined && zspmDm!="101020604" && zspmDm!="101020606"){
		for(var i=0;i<wtjghsdysxfplyqkGridlb.length;i++){
			//其他煤油不参与比对
			if(wtjghsdysxfplyqkGridlb[i].zspmDm==zspmDm && wtjghsdysxfplyqkGridlb[i].sphfwssflbm!="1070101020200000000"){
				hssl = hssl+wtjghsdysxfplyqkGridlb[i].bqwtjgshyylxscsl;
			}
		}
	}
	return hssl;
}

//成品油消费税获取《本期准予扣除税额计算表》中对应品目的[委托加工收回数量]
function cpyxfs_getWtjghsslByZspmDm(sphfwssflbm,wtjghssl,dksejkcjsForm){
	var sphfwssflbmCT = this.formCT.sphfwssflbmCT;
	var zspmDm = "";
	if(sphfwssflbm!=undefined && sphfwssflbmCT!=undefined){
		zspmDm = sphfwssflbmCT[sphfwssflbm]!=null?sphfwssflbmCT[sphfwssflbm].zspmdm:"";
	}
	if(dksejkcjsForm!=undefined){
		if(zspmDm==="101020609"){//汽油
			return dksejkcjsForm[0].wtjghssl;
		}
		if(zspmDm==="101020603"){//柴油
			return dksejkcjsForm[1].wtjghssl;
		}
		if(zspmDm==="101020605"){//石脑油
			return dksejkcjsForm[2].wtjghssl;
		}
		if(zspmDm==="101020607"){//润滑油
			return dksejkcjsForm[3].wtjghssl;
		}
		if(zspmDm==="101020608"){//燃料油
			return dksejkcjsForm[4].wtjghssl;
		}
	}
	return 0;
}

/**
 * 检查数据是否为空
 * 
 * @method isNull
 * @param param
 *            {Object} 参数对象
 * @returns {Boolean} 检查结果为空或未定义返回true，不为空返回false
 */
function isNull(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param) {
		return true;
	}
	return false;
}

/**
 * 检查数据是否为空 公式编译时，会把没为定义的参数赋值为{}, 这个是一个对象。
 * 
 * @method isNullForStr
 * @param param
 *            {Object} 参数对象
 * @returns {Boolean} 检查结果为空或未定义返回true，不为空返回false
 */
function isNullForStr(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param || typeof param === 'object') {
		return true;
	}
	return false;
}

/**
 * 获取附加税更正减免性质在码表的下标
 */
function fjsgzsb_getIndex(jmxzDm,option,rdpzuuid,zspmDm) {
	var sbxx = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	if(parent.location.href){
		if(parent.location.href.indexOf("appid=")>-1 || parent.location.href.indexOf('gzsb=zx') > -1){
			for(var i in sbxx){
				if(sbxx[i].rdpzuuid == rdpzuuid){
					jmxzDm = sbxx[i].ssjmxzDm;
				}
			}
		}
	}
	var jmxzIndex = 0;
	if(option!=undefined && option!=null){
		for(var i=0;i<option.length;i++){
			//var tempValue = i+"";
			if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm){
				jmxzIndex = i;
				return jmxzIndex+"";
			}
		}
	}
	return "";
}

/**
 * 获取附加税更正减免性质在码表的下标
 */
function fjsgzsb_getIndexYwzt(jmxzDm,option,rdpzuuid,zspmDm) {
    var sbxx = formData.ht_.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
    if(parent.location.href){
        if(parent.location.href.indexOf("appid=")>-1 || parent.location.href.indexOf('gzsb=zx') > -1){
            for(var i in sbxx){
                if(sbxx[i].rdpzuuid == rdpzuuid){
                    jmxzDm = sbxx[i].ssjmxzDm;
                }
            }
        }
    }
    var jmxzIndex = 0;
    if(option!=undefined && option!=null){
        for(var i=0;i<option.length;i++){
            //var tempValue = i+"";
            if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm){
                jmxzIndex = i;
                return jmxzIndex+"";
            }
        }
    }
    return jmxzDm;
}

/**
 * 获取附加税申报减免性质代码在码表的下标索引
 * @param idx
 * @param jmxzDm
 * @param swsxDm
 * @param zspmDm
 * @param option
 */
function fjssb_getIndexYwzt(jmxzDm,option,zspmDm,swsxDm) {
	var jmxzIndex = 0;
    if(option!=undefined && option!=null){
        for(var i=0;i<option.length;i++){
            if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm && option[i].swsxDm==swsxDm){
                jmxzIndex = i;
                return jmxzIndex+"";
            }
        }
    }
    return "";
}

/**
 * 获取增值税预缴减免性质在码表的下标
 */
function zzsyjsbsb_getIndex(jmxzDm,option,rdpzuuid,zspmDm) {
	var sbxx = formData.qcs.initData.zzsyjsbInitData.sfzrdxxVO.sfzrdxxVOlb;
	if(rdpzuuid != null && rdpzuuid != ''){
		for(var i in sbxx){
			if(sbxx[i].rdpzuuid == rdpzuuid){
				jmxzDm = sbxx[i].ssjmxzDm != undefined? sbxx[i].ssjmxzDm: '';
			}
		}
	}
	var jmxzIndex = 0;
	if(option!=undefined && option!=null){
		for(var i=0;i<option.length;i++){
			if(option[i]!=null && option[i].dm==jmxzDm && option[i].pc == zspmDm){
				jmxzIndex = i;
				return jmxzIndex+"";
			}
		}
	}
	return jmxzDm;
}

/**
 * 残保金更正申报，初始化联系电话
 * 
 * */
function CBJ_INIT_LXDH(){
	if(parent.location.href.indexOf('ywzt=Y') != -1){
		var lxdh = formData.ht_.cjrvoList.cjrvoListlb[0].zcdlxdh;
		if(lxdh==null || lxdh==''){
			lxdh = formData.fq_.nsrjbxx.dhhm;
		}
		return lxdh;
	}
	var lxdh = formData.cjrvoList.cjrvoListlb[0].zcdlxdh;
	if(lxdh==null || lxdh==''){
		lxdh = formData.qcs.initData.nsrjbxx.dhhm;
	}
	return lxdh;
}

/**
 * 从url地址中获取参数
 */
function GET_PARAM(link, csm){
	var paraObj={};
	if(link){
		var qs = link.split("&");
		for(var i=0;i<qs.length; i++){
			var kv = qs[i].split("=");
			if(kv[0] && kv[1]){
				paraObj[kv[0]]=kv[1];
			}
		}
	}
	if(paraObj[csm]){
		var csz = paraObj[csm]*1;
		if(isNaN(csz)){
			return 0;
		}else{
			return csz;
		}
	}else{
		return 0;
	}
}

/**
 * 判断是否存在于数组中。如果存在返回下标索引。否则返回-1
 * 参数列表:
 * key ,需要校验是否存在的key值。
 * column ,值所在列名。
 * array 数组
 * param 二级数组参数。
 */ 
function getIndexFromArray(key,column,array,param){
	if(!array){
		return -1;
	}
	if(!param){
		for(var i in array){
			if(array[i][column] && array[i][column] == key){
				return i;
			}
		}
	}else{
		var array2 = [];
		var pc = "";
		var path = param;
		if( param.indexOf("[") > -1 && param.indexOf("]") > -1 ){
			pc = param.substring(param.indexOf("[")+1,param.indexOf("]"));
			path = param.substr(param.indexOf("]") + 1);
		}
		var pcs = pc.indexOf("&")==-1?[]:pc.split("&");
		var paths = path.split(".");
		for(var i in array){
			if(pcs.length == 0){
				array2 = pushIntoArray(array2,getItemByPath(array[i],paths));
			}else{
				if(array[i][pcs[0]] && array[i][pcs[0]] == pcs[1]){
					array2 = pushIntoArray(array2,getItemByPath(array[i],paths));
				}
			}
		}
		for(var i in array2){
			if(array2[i][column] && array2[i][column] == key){
				return i;
			}
		}
	}
	
	return -1;
}

function pushIntoArray(arr, items){
	if(!items){
		return arr;
	}
	var isArray = false;
	if(Array){
		if(items instanceof Array){
			isArray = true;
		}
	}else{
		if(items.length != undefined && typeof items != "string"){
			isArray = true;
		}
	}
	if(isArray){
		for(var i in items){
			arr = pushIntoArray(arr, items[i]);
		}
	}else{
		arr.push(items);
	}
	return arr;
}

function getItemByPath(obj,paths){
	var item = [];
	var iterator = obj;
	for(var i in paths){
		if(paths[i]){
			if(!iterator){
				break;
			}
			if(i != "indexOf"){
				iterator = iterator[paths[i]];
			}
		}
	}
	return iterator;
}
/**
 * 判断特定行业个人所得税年度申报表主表减免税额和附表中的减免税额是不是一致
 * param 
 * fblx 附表类型 1：个人所得税减免税事项报告表 2：商业健康保险税前扣除表 
 * jmse1/jmse2无实际意义，用于触发校验
 * */
function tdhyndsbb_jmsejy(fblx,sfzjlxdm,sfzjhm,xm,jmse1,jmse2){
	if(fblx=="1"){
		//主表减免税额
		var jmse=0;
		//主表list
		var tdhyndsdssbbMx = this.formData.tdhyndsdssbbBzds.body.tdhyndsdssbb.tdhyndsdssbbMx;
		if(tdhyndsdssbbMx!=null && tdhyndsdssbbMx!=undefined && tdhyndsdssbbMx.length>0){
			for(i=0;i<tdhyndsdssbbMx.length;i++){
				var tdhyndsdssbbMxObj = tdhyndsdssbbMx[i];
				if(tdhyndsdssbbMxObj!=null && tdhyndsdssbbMxObj!=undefined){
					if(tdhyndsdssbbMxObj.zzlxdm==sfzjlxdm&&tdhyndsdssbbMxObj.zzhm==sfzjhm&&tdhyndsdssbbMxObj.nsrxm==xm){
						jmse += ROUND(tdhyndsdssbbMxObj.jmse,2);
					}
				}
			}
		}
		//附表减免税额
		var fbjmse=0;
		//附表list
		var jmssxMx = this.formData.grsdsjmssxbgbBzds.body.grsdsjmssxbgbMx.jmssxMxlb.jmssxMx;
		if(jmssxMx!=null && jmssxMx!=undefined && jmssxMx.length>0){
			for(i=0;i<jmssxMx.length;i++){
				var jmssxMxObj = jmssxMx[i];
				if(jmssxMxObj!=null && jmssxMxObj!=undefined){
					if(jmssxMxObj.sfzjlxDm==sfzjlxdm&&jmssxMxObj.sfzjhm==sfzjhm&&jmssxMxObj.nsrxm==xm){
						fbjmse += ROUND(jmssxMxObj.jmse,2);
					}
				}
			}
		}
		if(fbjmse!=jmse){
			return false;
		}else{
			return true;
		}
	}else if(fblx=="2"){
		//主表减免税额
		var jmse=0;
		//主表list
		var tdhyndsdssbbMx = this.formData.tdhyndsdssbbBzds.body.tdhyndsdssbb.tdhyndsdssbbMx;
		if(tdhyndsdssbbMx!=null && tdhyndsdssbbMx!=undefined && tdhyndsdssbbMx.length>0){
			for(i=0;i<tdhyndsdssbbMx.length;i++){
				var tdhyndsdssbbMxObj = tdhyndsdssbbMx[i];
				if(tdhyndsdssbbMxObj!=null && tdhyndsdssbbMxObj!=undefined){
					if(tdhyndsdssbbMxObj.zzlxdm==sfzjlxdm&&tdhyndsdssbbMxObj.zzhm==sfzjhm&&tdhyndsdssbbMxObj.nsrxm==xm){
						jmse += ROUND(tdhyndsdssbbMxObj.qnsqkcxmsyjkxje,2);
					}
				}
			}
		}
		//附表减免税额
		var fbjmse=0;
		//附表list
		var syjkbxmx = this.formData.syjkbxmxlb.syjkbxmx;
		if(syjkbxmx!=null && syjkbxmx!=undefined && syjkbxmx.length>0){
			for(i=0;i<syjkbxmx.length;i++){
				var syjkbxmxObj = syjkbxmx[i];
				if(syjkbxmxObj!=null && syjkbxmxObj!=undefined){
					if(syjkbxmxObj.sfzjlxdm==sfzjlxdm&&syjkbxmxObj.sfzjhm==sfzjhm&&syjkbxmxObj.xm==xm){
						fbjmse += ROUND(syjkbxmxObj.bqkcje,2);
					}
				}
			}
		}
		if(fbjmse!=jmse){
			return false;
		}else{
			return true;
		}		
	}
	
}
/**
 * 判断是否包括数字
 */
function checkhasNum(r) {
	if (/[0-9]/.test(r)) {
		return true;
	}
	return false;
}

/**
 * 判断限售股转让所得扣缴个人所得税报告表1-7列是否存在完全相同的数据
 * */
function xsgzrsgkjsb_xtljy(xh,nsrxm,sfzjlxDm,sfzjhm,zqzhh,gpDm,gpmc,mgjsjg){
	if(xh!=undefined && nsrxm!="" && sfzjlxDm!="" && sfzjhm!="" && zqzhh!="" && gpDm!="" && gpmc!="" && mgjsjg!=0 ){
		var xsgzrsdkjgrsdsbgbMx = this.formData.xsgzrsdkjgrsdsbgbBzds.xsgzrsdkjgrsdsbgbBody.xsgzrsdkjgrsdsbgb.xsgzrsdkjgrsdsbgbMx;
		if(xsgzrsdkjgrsdsbgbMx!=null && xsgzrsdkjgrsdsbgbMx!=undefined && xsgzrsdkjgrsdsbgbMx.length>0){
			for(i=0;i<xsgzrsdkjgrsdsbgbMx.length;i++){
				var xsgzrsdkjgrsdsbgbMxObj = xsgzrsdkjgrsdsbgbMx[i];
				if(xsgzrsdkjgrsdsbgbMxObj!=null && xsgzrsdkjgrsdsbgbMxObj!=undefined&&xsgzrsdkjgrsdsbgbMxObj.xh!=undefined){
					if(xh!=xsgzrsdkjgrsdsbgbMxObj.xh){
						if(nsrxm==xsgzrsdkjgrsdsbgbMxObj.nsrxm&&sfzjlxDm==xsgzrsdkjgrsdsbgbMxObj.sfzjlxDm&&sfzjhm==xsgzrsdkjgrsdsbgbMxObj.sfzjhm&&zqzhh==xsgzrsdkjgrsdsbgbMxObj.zqzhh&&gpDm==xsgzrsdkjgrsdsbgbMxObj.gpDm&&gpmc==xsgzrsdkjgrsdsbgbMxObj.gpmc&&mgjsjg==xsgzrsdkjgrsdsbgbMxObj.mgjsjg){
							xsgzrsdkjgrsdsbgbMx[xh-1].cfxh=xsgzrsdkjgrsdsbgbMxObj.xh;
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	return true;
}

/**
 * 广东小规模个性化：GDSDZSWJ-8100
 * 是否发生过销售不动产业务
 */
function gdXsbdcyw(lc1, lc4, lc9, lc13) {
	var total = lc1 + lc4 + lc9 + lc13;
	var nsqxDm = formData.qcs.initData.zzsxgmsbInitData.nsqxDm;
	if (((nsqxDm == '06' && total > 30000)||(nsqxDm == '08' && total > 90000)) && lc4 > 0) {
		var defaultValue = formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse;
		var gdLock = formData.qcs.initData.zzsxgmsbInitData.gdLock;
		var message = "";
		message += "<table style='font-size:14px;'>";
		message += "	<tr>";
		message += "		<td colspan='2' width='60%'>本期发生销售不动产业务？</td>";
		message += "		<td width='20%' valign='middle'>";
		message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"visible\";' value='1' " + (gdLock&&gdLock=='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;是&nbsp;&nbsp;";
		message += "		</td>";
		message += "		<td valign='middle'>";
		message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"hidden\";' value='2' " + (!gdLock||gdLock!='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;否";
		message += "		</td>";
		message += "	</tr>";
		message += "	<tr id='xsbdc' " + (!gdLock||gdLock!='1'?"style='visibility: hidden;'":"") + " >";
		message += "		<td colspan='2'>当期不动产不含税销售额：</td>";
		message += "		<td colspan='2'>";
		message += "			<input type='text' placeholder='请输入销售额' id='myInput' value='" + (defaultValue||defaultValue==0?defaultValue:'') + "' style='border:1px solid #fff;border-bottom-color:#b5b5b5;width:100%;'/>";
		message += "		</td>";
		message += "	</tr>";
		message += "</table>";

        window.parent.layer.confirm(message,{
			type: 1,
			area: ['450px','210px'],
			btn: ['确定'],
			title: '提示',
			closeBtn:0,
			yes: function (index, layero) {
				var radioValue = $(layero).find(':radio[name="sfbqxsbdc"]:checked').val();
				if (radioValue === "1") {
					var value = $(layero).find('#myInput').val();
                    if(value === ""|| value=== undefined || !/(^[-]{0,1}\d+$)|(^[-]{0,1}\d+\.\d+$)/g.test(value)){
                        $(layero).find('#myInput').val('');
                        $(layero).find('#myInput').attr('placeholder', '请输入正确的不含税销售额');
					} else {
                        var val = ROUND(Number(value), 2);
                        formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse = val;
                        formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse", val);
                        window.parent.layer.closeAll();
                        // 调整
                        result = 1;
					}
				} else {
                    formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse = 0;
                    formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse", 0);
                    window.parent.layer.closeAll();
                    // 调整
                    result = -1;
				}

                formData.qcs.initData.zzsxgmsbInitData.gdLock = result;
                formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdLock", result);
                var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
                var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
                var body = $("#frmSheet")[0].contentWindow.document.body;
                viewEngine.formApply($viewAppElement);
                viewEngine.tipsForVerify(body);
			}
		});
	} else {
		formData.qcs.initData.zzsxgmsbInitData.gdLock = 0;
		setTimeout(function() {
			formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdLock", 0);
			var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
			var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
			var body = $("#frmSheet")[0].contentWindow.document.body;
			viewEngine.formApply($viewAppElement);
			viewEngine.tipsForVerify(body);
		}, 500);
		
	}
	
}

/**
 * 业务中台使用
 * 广东小规模个性化：GDSDZSWJ-8100
 * 是否发生过销售不动产业务
 */
function gdXsbdcywYwzt(lc1, lc4, lc9, lc13) {
	var total = lc1 + lc4 + lc9 + lc13;
	var nsqxDm = formData.fq_.nsqxDm;
	if (((nsqxDm == '06' && total > 30000)||(nsqxDm == '08' && total > 90000)) && lc4 > 0) {
		var defaultValue = formData.ss_.gdDqbdcbhsxse;
		var gdLock = formData.ss_.gdLock;
		var message = "";
		message += "<table style='font-size:14px;'>";
		message += "	<tr>";
		message += "		<td colspan='2' width='60%'>&nbsp;&nbsp;本期发生销售不动产业务？</td>";
		message += "		<td width='20%' valign='middle'>";
		message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"visible\";' value='1' " + (gdLock&&gdLock=='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;是&nbsp;&nbsp;";
		message += "		</td>";
		message += "		<td valign='middle'>";
		message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"hidden\";' value='2' " + (!gdLock||gdLock!='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;否";
		message += "		</td>";
		message += "	</tr>";
		message += "	<tr id='xsbdc' " + (!gdLock||gdLock!='1'?"style='visibility:hidden;''":"") + " >";
		message += "		<td colspan='2'>当期不动产不含税销售额：</td>";
		message += "		<td colspan='2'>";
		message += "			<input type='text' placeholder='请输入销售额' id='myInput' value='" + (defaultValue||defaultValue==0?defaultValue:'') + "' style='border:1px solid #fff;border-bottom-color:#b5b5b5;width:100%;'/>";
		message += "		</td>";
		message += "	</tr>";
		message += "</table>";

        window.parent.layer.confirm(message,{
            type: 1,
            area: ['450px','210px'],
            btn: ['确定'],
            title: '提示',
            closeBtn:0,
            yes: function (index, layero) {
                var radioValue = $(layero).find(':radio[name="sfbqxsbdc"]:checked').val();
                if (radioValue === "1") {
                    var value = $(layero).find('#myInput').val();
                    if(value === ""|| value=== undefined || !/(^[-]{0,1}\d+$)|(^[-]{0,1}\d+\.\d+$)/g.test(value)){
                        $(layero).find('#myInput').val('');
                        $(layero).find('#myInput').attr('placeholder', '请输入正确的不含税销售额');
                    } else {
                        var val = ROUND(Number(value), 2);
                        formData.ss_.gdDqbdcbhsxse = val;
                        formulaEngine.apply("ss_.gdDqbdcbhsxse", val);
                        window.parent.layer.closeAll();
                        // 调整
                        result = 1;
                    }
                } else {
                    formData.ss_.gdDqbdcbhsxse = 0;
                    formulaEngine.apply("ss_.gdDqbdcbhsxse", 0);
                    window.parent.layer.closeAll();
                    // 调整
                    result = -1;
                }

                formData.ss_.gdLock = result;
                formulaEngine.apply("ss_.gdLock", result);
                var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
                var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
                var body = $("#frmSheet")[0].contentWindow.document.body;
                viewEngine.formApply($viewAppElement);
                viewEngine.tipsForVerify(body);
            }
        });
	} else {
		formData.ss_.gdLock = 0;
		setTimeout(function() {
			formulaEngine.apply("ss_.gdLock", 0);
			var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
			var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
			var body = $("#frmSheet")[0].contentWindow.document.body;
			viewEngine.formApply($viewAppElement);
			viewEngine.tipsForVerify(body);
		}, 500);
		
	}
	
}

/**
 * JSONE-2115
 * 是否发生过销售不动产业务
 */
function xsbdcyw(xseHj,qzd,lc4fw) {
    if (xseHj > qzd && lc4fw > 0) {
        var defaultValue = formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse;
        var gdLock = formData.qcs.initData.zzsxgmsbInitData.gdLock;
        var message = "";
        message += "<table style='font-size:14px;'>";
        message += "	<tr>";
        message += "		<td colspan='2'>&nbsp;&nbsp;按照现行政策规定，小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元（按季30万元），但扣除本期发生的销售不动产销售额后，未超过10万元（按季30万元）的，销售货物、劳务、服务、无形资产的月销售额可以免征增值税。您本期是否发生销售不动产的销售额？</td>";
        message += "    </tr>";
        message += "	<tr>";
        message += "		<td width='60%' valign='middle'>";
        message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"visible\";' value='1' " + (gdLock&&gdLock=='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;是&nbsp;&nbsp;";
        message += "		</td>";
        message += "		<td valign='middle'>";
        message += "			<input type='radio' name='sfbqxsbdc' onclick='javascript:document.getElementById(\"xsbdc\").style.visibility=\"hidden\";' value='2' " + (!gdLock||gdLock!='1'?"checked='checked'":"") + "/>&nbsp;&nbsp;否";
        message += "		</td>";
        message += "	</tr>";
        message += "	<tr id='xsbdc' " + (!gdLock||gdLock!='1'?"style='visibility:hidden;''":"") + " >";
        message += "		<td>为帮助您判断是否可以享受免征增值税政策，请准确录入本期销售不动产的销售额：</td>";
        message += "		<td>";
        message += "			<input type='text' placeholder='请输入销售额' id='myInput' value='" + (defaultValue||defaultValue==0?defaultValue:'') + "' style='border:1px solid #fff;border-bottom-color:#b5b5b5;width:100%;'/>";
        message += "		</td>";
        message += "	</tr>";
        message += "</table>";

        window.parent.layer.confirm(message,{
            type: 1,
            area: ['450px','290px'],
            btn: ['确定'],
            title: '提示',
            closeBtn:0,
            yes: function (index, layero) {
                var radioValue = $(layero).find(':radio[name="sfbqxsbdc"]:checked').val();
                if (radioValue === "1") {
                    var value = $(layero).find('#myInput').val();
                    if(value === ""|| value=== undefined || !/(^[-]{0,1}\d+$)|(^[-]{0,1}\d+\.\d+$)/g.test(value)){
                        $(layero).find('#myInput').val('');
                        $(layero).find('#myInput').attr('placeholder', '请输入正确的不含税销售额');
                    } else {
                        var val = ROUND(Number(value), 2);
                        formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse = val;
                        formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = val;
                        formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse", val);
                        window.parent.layer.closeAll();
                        if(xseHj - val > qzd){
                            window.parent.layer.alert("本期销售额已达起征点，请继续申报。");
						}else{
                        	var lc1hw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[0].yzzzsbhsxse;
                        	var lc2hw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[0].swjgdkdzzszyfpbhsxse;
                            var lc1fw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].yzzzsbhsxse;
                            var lc2fw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].swjgdkdzzszyfpbhsxse;
                            var lc4fw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].xsczbdcbhsxse;
                            var lc5fw = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].swjgdkdzzszyfpbhsxse1;
                        	if(lc1hw - lc2hw > 0 || lc1fw - lc2fw > 0 || lc4fw - lc5fw != val){
                                window.parent.layer.alert("剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第10栏“小微企业免税销售额”或第11栏“未达起征点销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。");
							}else{
                                window.parent.layer.alert("剔除不动产销售额后，本期销售额未达起征点，请继续申报");
							}
						}
                        // 调整
                        result = 1;
                    }
                } else {
                    formData.qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse = 0;
                    formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = 0;
                    formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdDqbdcbhsxse", 0);
                    window.parent.layer.closeAll();
                    window.parent.layer.alert("本期销售额已达起征点，请继续申报。");
                    // 调整
                    result = -1;
                }

                formData.qcs.initData.zzsxgmsbInitData.gdLock = result;
                formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdLock", result);
                var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
                var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
                var body = $("#frmSheet")[0].contentWindow.document.body;
                viewEngine.formApply($viewAppElement);
                viewEngine.tipsForVerify(body);
            }
        });
    } else {
        formData.qcs.initData.zzsxgmsbInitData.gdLock = 0;
        setTimeout(function() {
            formulaEngine.apply("qcs.initData.zzsxgmsbInitData.gdLock", 0);
            var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
            var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
            var body = $("#frmSheet")[0].contentWindow.document.body;
            viewEngine.formApply($viewAppElement);
            viewEngine.tipsForVerify(body);
        }, 500);

    }
}
/**
 * 收入支出表_月报（适用科学事业单位会计制度的单位)中的
 *五、本年非财政补助结转结余_本月数应满足公式：四、弥补以前年度经营亏损后的经营结余_本月数0.00＜=0时，五、本年非财政补助结转结余_本月数=2.事业结转结余_本月数
 *四、弥补以前年度经营亏损后的经营结余_本月数0.00大于0时，规则不变。
 *
 * @param mbbys 弥补以前年度经营亏损后的经营结余
 * @param sybys  2.事业结转结余
 * @param zgswskfjdm  主管税务机关代码
 * @returns   本年非财政补助结转结余月
 */
function bMbjyjy(mbbys,sybys,zgswskfjdm){
	var subzgswjdm=zgswskfjdm.substr(0,3);
	var Ybys=0;
	if(subzgswjdm=='144'|subzgswjdm=='244'){
		if(mbbys>0){
			return Ybys;
		}else{
			return sybys;
		}
	}else{
		return Ybys;
	}
}

/**
 * 消费税,是否存在分配表
 */
function isExistXfsFpb(){
	var sbbfl = formData.xfssbSbbdxxVO.xfssbblxDm;
	var fpb = "";
	switch (sbbfl){
		case '01':
            fpb = formData.xfssbSbbdxxVO.xfsYlsb.xfssb1_fb6;
            break;
		case '02':
			fpb = formData.xfssbSbbdxxVO.xfsYlpfsb.xfssb2_fb2.fzjgGrid?formData.xfssbSbbdxxVO.xfsYlpfsb.xfssb2_fb2:"";
            break;
        case '03':
            fpb = formData.xfssbSbbdxxVO.xfsJlsb.xfssb3_fb6;
            break;
        case '04':
            fpb = formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb14;
            break;
        case '05':
            fpb = formData.xfssbSbbdxxVO.xfsClsb.xfssb5_fb4;
            break;
        case '06':
            fpb = formData.xfssbSbbdxxVO.xfsQtsb.xfssb6_fb6;
            break;
        case '07':
            fpb = formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb5;
            break;
        case '08':
            fpb = formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb5;
            break;
		default: return false;
	}
	return fpb != undefined && fpb != null  && fpb != "";
}

/**
 * 消费税从分配表获取计税依据
 * @returns {*}
 */
function getFjsjsyjFromXfsFpb(){
    var sbbfl = formData.xfssbSbbdxxVO.xfssbblxDm;
    var fpb = "";
    switch (sbbfl){
        case '01':
            fpb = formData.xfssbSbbdxxVO.xfsYlsb.xfssb1_fb6;
            break;
        case '02':
            fpb = formData.xfssbSbbdxxVO.xfsYlpfsb.xfssb2_fb2.fzjgGrid?formData.xfssbSbbdxxVO.xfsYlpfsb.xfssb2_fb2:"";
            break;
        case '03':
            fpb = formData.xfssbSbbdxxVO.xfsJlsb.xfssb3_fb6;
            break;
        case '04':
            fpb = formData.xfssbSbbdxxVO.xfsCpylsb.xfssb4_fb14;
            break;
        case '05':
            fpb = formData.xfssbSbbdxxVO.xfsClsb.xfssb5_fb4;
            return;
        case '06':
            fpb = formData.xfssbSbbdxxVO.xfsQtsb.xfssb6_fb6;
            break;
        case '07':
            fpb = formData.xfssbSbbdxxVO.xfsDcsb.xfssb7_fb5;
            break;
        case '08':
            fpb = formData.xfssbSbbdxxVO.xfsTlsb.xfssb8_fb5;
            break;
        default: return 0;
    }
    if(fpb){
    	return fpb.zjgForm.zjgfpse;
	}else{
    	return 0;
	}
}

/**
 *  “企业重点群体人员采集”、“企业退役士兵采集”采集，使用该方法的业务：
 *  增值税一般纳税人申报、增值税小规模申报、通用申报、定期定额自行申报
 *  cjbz  区分 “企业重点群体人员采集”和“企业退役士兵采集”
 */
function redirectQyzdqtrycjAndQytysbcjPage(cjbz){
	if("qyzdrq"==cjbz){
		pathname = "/sxsq-cjpt-web/biz/sxsq/qyzdqtrycj";
		title =  "企业重点群体人员采集";
		swsxDm = "SXA033200001";
	}else if("qytysb"==cjbz){
		pathname = "/sxsq-cjpt-web/biz/sxsq/qytysbcj";
		title =  "企业退役士兵采集";
		swsxDm = "SXA033100001";
	}
	var search = top.window.location.search;
	var searchList = search.substring(1).split('&');
	var sssqQ = "";
	for(var index in searchList){
		var value = searchList[index];
		if(value.indexOf("sssqQ")!==-1){
			var valueList = value.split('=');
			sssqQ = valueList[1];
			break;
		}
	}
	if(sssqQ==''||sssqQ==null||sssqQ==undefined){
		var qcs = formData.qcs||formData.dqdeqcs;
		if (qcs == undefined || qcs == null) {
			qcs = formData;
			sssqQ = qcs.fq_.nsrjbxx.tbrq;
		}else {
			sssqQ = qcs.initData.nsrjbxx.tbrq;
		}
	}
	var pathsearch = "?swsxDm="+swsxDm+"&gdslxDm="+parent.gdslxDm+"&nd="+sssqQ.substring(0,4);
	var callback = function(){
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var qcs = formData.qcs||formData.dqdeqcs;
		var djxh,zgswjDm,nsrsbh;
		if (qcs == undefined || qcs == null) {
			qcs = formData;
			djxh = qcs.fq_.nsrjbxx.djxh;
			zgswjDm = qcs.fq_.nsrjbxx.zgswjDm;
			nsrsbh = qcs.fq_.nsrjbxx.nsrsbh;
		} else {
			djxh = qcs.initData.nsrjbxx.djxh;
			zgswjDm = qcs.initData.nsrjbxx.zgswjDm;
			nsrsbh = qcs.initData.nsrjbxx.nsrsbh;
		}
		var jsonData = {
				"djxh":djxh,
				"swjgDm":zgswjDm,
				"nsrsbh":nsrsbh,
				"sssqQ":sssqQ,
				"gdslxDm":parent.gdslxDm
				};
		$.ajax({
			type: "POST",
			url: mainUrl+"/nssb/qyzdqtryAndQytysbCj/geCjxx.do",
			dataType:"json",      
			contentType:"application/json",
			data:JSON.stringify(jsonData),
			success:function(qydata){
				var qytysbcj = qydata.taxML.qytysbcj;
				var qyzdrq = qydata.taxML.qyzdrq;
				var formDataStr = JSON.stringify(formData);
				formDataStr = formDataStr.replace(/"qyzdrq":"(.*?)"/g,'"qyzdrq":"'+qyzdrq+'"');
				formDataStr = formDataStr.replace(/"qytysbcj":"(.*?)"/g,'"qytysbcj":"'+qytysbcj+'"');
				formData = jQuery.parseJSON(formDataStr);
				var frmSheet = $(window.parent.document).find("iframe[id='frmMain']");
				var formulaEngine = frmSheet[0].contentWindow.formulaEngine;
				formulaEngine.applyImportFormulas(false);
			    frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
			    var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
			    var viewEngine = frmSheet[0].contentWindow.viewEngine;
			    var body = frmSheet[0].contentWindow.document.body;
			    viewEngine.formApply($viewAppElement);
			    viewEngine.tipsForVerify(body);
			}});
	}
	layer.open({
        type : 2,
        title : title,
        shadeClose : true,
        shade : 0.8,
        area : [ '1200px', '85%' ],
        content :pathname+pathsearch,
        cancel:callback
    });
}

/**
 *  “企业重点群体人员采集”、“企业退役士兵采集”采集，使用该方法的业务：
 *  增值税一般纳税人申报、增值税小规模申报、通用申报、定期定额自行申报
 *  cjbz  区分 “企业重点群体人员采集”和“企业退役士兵采集”
 */
function redirectQyzdqtrycjAndQytysbcjPageByYwzt(cjbz){
	if("qyzdrq"==cjbz){
		pathname = "/sxsq-cjpt-web/biz/sxsq/qyzdqtrycj";
		title =  "企业重点群体人员采集";
		swsxDm = "SXA033200001";
	}else if("qytysb"==cjbz){
		pathname = "/sxsq-cjpt-web/biz/sxsq/qytysbcj";
		title =  "企业退役士兵采集";
		swsxDm = "SXA033100001";
	}
	var search = top.window.location.search;
	var searchList = search.substring(1).split('&');
	var sssqQ = "";
	for(var index in searchList){
		var value = searchList[index];
		if(value.indexOf("sssqQ")!==-1){
			var valueList = value.split('=');
			sssqQ = valueList[1];
			break;
		}
	}
	var pathsearch = "?swsxDm="+swsxDm+"&gdslxDm="+parent.gdslxDm+"&nd="+sssqQ.substring(0,4);
	var callback = function(){
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var qcs = formData.fq_;
		var djxh = qcs.nsrjbxx.djxh;
		var zgswjDm = qcs.nsrjbxx.zgswjDm;
		var nsrsbh = qcs.nsrjbxx.nsrsbh;
		var jsonData = {
				"djxh":djxh,
				"swjgDm":zgswjDm,
				"nsrsbh":nsrsbh,
				"sssqQ":sssqQ,
				"gdslxDm":parent.gdslxDm,
				"sid":"dzswj.ywzz.sb.common.qyzdrqAndqytysbCj",
				"noCache":"Y",
				"_random":Math.random()
				};
		$.ajax({
			type: "POST",
			url: mainUrl+"/ywzt/getData.do",
			async: true,
			data:jsonData,
			success:function(qydata){
				var data = parent.resolveYwztResponse(qydata);
				var qytysbcj = data.qytysbcj;
				var qyzdrq = data.qyzdrq;
				var formDataStr = JSON.stringify(formData);
				formDataStr = formDataStr.replace(/"qyzdrq":"(.*?)"/g,'"qyzdrq":"'+qyzdrq+'"');
				formDataStr = formDataStr.replace(/"qytysbcj":"(.*?)"/g,'"qytysbcj":"'+qytysbcj+'"');
				formData = jQuery.parseJSON(formDataStr);
				var frmSheet = $(window.parent.document).find("iframe[id='frmMain']");
				var formulaEngine = frmSheet[0].contentWindow.formulaEngine;
				formulaEngine.applyImportFormulas(false);
			    frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
			    var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
			    var viewEngine = frmSheet[0].contentWindow.viewEngine;
			    var body = frmSheet[0].contentWindow.document.body;
			    viewEngine.formApply($viewAppElement);
			    viewEngine.tipsForVerify(body);
			}});
	}
	layer.open({
        type : 2,
        title : title,
        shadeClose : true,
        shade : 0.8,
        area : [ '1200px', '85%' ],
        content :pathname+pathsearch,
        cancel:callback
    });
}


function redirectQytysbcjPage(){
	
}

function setKdqjyDlJbrzyzjhm(bz,zjhm){
	var smzbz=formData.fq_.nsrjbxx.smzxx.smzbz;
	var zjlx=formData.fq_.nsrjbxx.smzxx.zjlx;
	var smzjhm=formData.fq_.nsrjbxx.smzxx.zjhm;
	var tjz=formData.ht_.qysdskdqhznsfzjgnbywbw.qysdsyjdyjnssbbal.nsrqtxxForm.blrysfzjhm;
		  
	if(bz==="xsbz"){
		if(smzbz=="Y"){
			
			if(zjlx=="201"){
				return zjhm.substring(0,6)+"********"+ zjhm.substring(14);
			}else{
				return  zjhm;
			}
		
		}else{
			return  tjz;
		}
	}else{
		if(smzbz=="Y"){
			return smzjhm;
		}else{
			
			return  zjhm;
		}

	}
}

function setKdqjyBlr(smzbz,smzxm){
	var jbr=formData.ht_.qysdskdqhznsfzjgnbywbw.qysdsyjdyjnssbbal.nsrqtxxForm.blr;
	if(smzbz=='Y'){
		return smzxm;
	}
	return jbr;
}

function setKdqjyBlrysfzjlxDm(smzbz,zjlx){
	var blrysfzjlxDm=formData.ht_.qysdskdqhznsfzjgnbywbw.qysdsyjdyjnssbbal.nsrqtxxForm.blrysfzjlxDm;
	if(smzbz=='Y'){
		return zjlx;
	}
	return  blrysfzjlxDm;
}

//附加税季中转公式06100120010100062
function calPhjmse(zspmDm,changed){
	var bqsfsyxgmyhzc;
	var sbxxGridlbVOArr;
	if(parent.location.href.indexOf('ywzt=Y') != -1){
		bqsfsyxgmyhzc=formData.ht_.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc;
		sbxxGridlbVOArr = formData.ht_.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	} else {
		bqsfsyxgmyhzc=formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc;
		sbxxGridlbVOArr = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	}
	
	var index=0;
	for (var i = 0; i < sbxxGridlbVOArr.length; i++){
    	if(zspmDm==sbxxGridlbVOArr[i].zspmDm){
    		index=i;
    		break;
    	}
    }
	
	var afterCalPhjmse=ROUND((sbxxGridlbVOArr[index].bqynsfe-sbxxGridlbVOArr[index].jme)*(sbxxGridlbVOArr[index].phjzbl),2);
    if (bqsfsyxgmyhzc=='Y'){
    	if (parent.location.href.indexOf('ywzt=Y') != -1) {
    		if (sbxxGridlbVOArr[index].t_jmxzChanged=='Y') {
    			sbxxGridlbVOArr[index].t_jmxzChanged='';
        		return afterCalPhjmse;
    		}
    	}else if(sbxxGridlbVOArr[index].jmxzChanged=='Y'){
    		sbxxGridlbVOArr[index].jmxzChanged='';
    		return afterCalPhjmse;
    	}
    	//phjmse必定数字,增加是否为数字的校验
    	if(0 == sbxxGridlbVOArr[index].phjmse || "0" == sbxxGridlbVOArr[index].phjmse || isEmptyObject(sbxxGridlbVOArr[index].phjmse)
    			|| typeof sbxxGridlbVOArr[index].phjmse !== 'number' || !isEmptyObject(changed)){
    		return afterCalPhjmse;
    	}else{
    		return sbxxGridlbVOArr[index].phjmse;
    	}
    }else{
    	return 0;
    }
}

