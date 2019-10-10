/**
* 重写暂存按钮
*/
function tempSave() {
    $(top.document).find("body").mask("正在保存数据，请稍候...");
    //暂存时增加校验的逻辑
    try{
        var child = document.getElementById("frmSheet").contentWindow;
        if(typeof(child.isTempSave) === 'function'){
            if(!child.isTempSave()){
                $(top.document).find("body").unmask();
                return;
            }
        }
    }catch(e){

    }
    if(checkDIffDjxh()){//djxh不一致，不进行保存
        return;
    }

    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

    var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['djxh'] = $("#djxh").val();
    d['secondLoadTag'] = $("#secondLoadTag").val();
    d['_bizReq_path_'] = _bizReq_path_;
    d['_guideParam'] = _guideParam;
    d['formData'] = encodeURIComponent(JSON.stringify(formData));
    $.ajax({
        type : "POST",
        url : "xTempSave?",
        dataType : "json",
        //contentType : "text/json",
        data : d,
        success : function(data) {
            if ('Y' == data.returnFlag) {
				var url1=$("frmMain").context.URL.toString();
				parent.layer.alert("所有申报表数据暂存成功！", {
					icon : 1
				});
				
            } else {
            	var returnType = data.returnType;
		    	if(returnType&&returnType==='refresh'){
		    		var errMsg = data.errMsg;
		    		parent.layer.confirm(errMsg,{
	            		icon : 1,
	            		title:'提示',
	            		btn2noclose:1,
	            		btn : ["是","否"]
	            	},function(index){
	            		$(top.document).find("body").unmask();
	            		parent.layer.close(index);
	            		window.location.reload();
	            	});
		    		return;
		    	}else {
	                parent.layer.alert('尊敬的纳税人：暂存失败，请稍后再试！', {
	                    icon : 5
	                });
		    	}
            }
            $(top.document).find("body").unmask();
        },
        error : function() {
            $(top.document).find("body").unmask();
            parent.layer.alert('尊敬的纳税人：暂存失败，请稍后再试！', {
                icon : 5
            });
        }
    });
}


/**
 * 重写保存按钮
 */
function save() {
    $(top.document).find("body").mask("正在保存数据，请稍候...");
    //暂存时增加校验的逻辑
    try{
        var child = document.getElementById("frmSheet").contentWindow;
        if(typeof(child.isTempSave) === 'function'){
            if(!child.isTempSave()){
                $(top.document).find("body").unmask();
                return;
            }
        }
    }catch(e){

    }
    if(checkDIffDjxh()){//djxh不一致，不进行保存
        return;
    }

    var regEvent = new RegEvent();
    var tips = regEvent.verifyAllNoAlert();

    if('' != tips){
        parent.layer.alert(tips, {title: "保存失败！(表格校验没通过，请检查)", icon: 5});
        $(top.document).find("body").unmask();
        return;
    }

    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

    var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['djxh'] = $("#djxh").val();
    d['secondLoadTag'] = $("#secondLoadTag").val();
    d['_bizReq_path_'] = _bizReq_path_;
    d['_guideParam'] = _guideParam;
    d['formData'] = encodeURIComponent(JSON.stringify(formData));
    $.ajax({
        type : "POST",
        url : "xTempSave?",
        dataType : "json",
        //contentType : "text/json",
        data : d,
        success : function(data) {
            if ('Y' == data.returnFlag) {
                parent.layer.alert("所有申报表数据保存成功！", {
                    icon: 1
                });
            } else {
                parent.layer.alert('尊敬的纳税人：保存失败，请稍后再试！', {
                    icon : 5
                });
            }
            $(top.document).find("body").unmask();
        },
        error : function() {
            $(top.document).find("body").unmask();
            parent.layer.alert('尊敬的纳税人：保存失败，请稍后再试！', {
                icon : 5
            });
        }
    });
}


//根据总局验收标准，现对所有申报表点击申报时，进行提示（申报提示，文书不提示）
function ctips(isSecondCall){
    var xybNoTip = $("#xybNoTip").val();
    if(xybNoTip != true && xybNoTip != "true" && (!isJmsb())) {
        layer.confirm('请确定是否提交申报，确定则提交，取消则返回申报表界面。', {
            icon: -1, title: '提示',
            btn2: function (index) {
                $("body").unmask();
                prepareMakeFlag = true;
                layer.close(index);
                return;
            }
            ,cancel: function(index, layero){
                $("body").unmask();
                prepareMakeFlag = true;
                layer.close(index);
                return;
            }
        }, function (index) {
            if (typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
                $("body").mask("正在提交，请稍候...");
            } else {
                $("body").mask("正在处理，请稍候...");
            }

            var saveData = JSON.stringify(formData);
            formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
            var submitData = JSON.stringify(formData);
            if (saveData == submitData) {
                submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
            }
            // 将特殊字符转为全角字符避免合成pdf异常
            saveData = saveData.replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, "＞").replace(/\\\\/g, "＼");

            $("#saveData1").val(encodeURIComponent(saveData));
            $("#submitData1").val(encodeURIComponent(submitData));

            /**
             * 申报提交时框架校验成功后调用业务特有校验（一般在ywbm.js中实现）
             * 然后在业务特有校验中调用doBeforSubmitForm，在提交表单之前做一些事情。如弹出申报前的确认提示
             * 最后由doBeforSubmitForm调用submitForm实现申报提交
             */
            doAfterVerify(doBeforSubmitForm, submitForm, isSecondCall);

            layer.close(index);
        });
    }else{
        if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
            $("body").mask("正在提交，请稍候...");
        } else {
            $("body").mask("正在处理，请稍候...");
        }

        var saveData = JSON.stringify(formData);
        formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
        var submitData = JSON.stringify(formData);
        if (saveData == submitData) {
            submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
        }
        // 将特殊字符转为全角字符避免合成pdf异常
        saveData = saveData.replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, "＞").replace(/\\\\/g, "＼");

        $("#saveData1").val(encodeURIComponent(saveData));
        $("#submitData1").val(encodeURIComponent(submitData));

        /**
         * 申报提交时框架校验成功后调用业务特有校验（一般在ywbm.js中实现）
         * 然后在业务特有校验中调用doBeforSubmitForm，在提交表单之前做一些事情。如弹出申报前的确认提示
         * 最后由doBeforSubmitForm调用submitForm实现申报提交
         */
        doAfterVerify(doBeforSubmitForm,submitForm,isSecondCall);
    }
}