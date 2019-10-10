var frmMainURLObj={};
if (typeof dzswjTgcParam === "undefined") {
    dzswjTgcParam = "";
}
/**
 * 设置国地税标志
 */
function setGdsBz() {
    var $gdFlag = $("#gdFlag");
    if (1 === gdslxDm) {
        $gdFlag.text("原国税" + emName);
    } else if (2 === gdslxDm) {
        $gdFlag.text("原地税" + emName);
    } else {
        $gdFlag.text("国地");
    }
    if (isGgUser === "00") {
        $gdFlag.text("国地");
    }
    //判断是否是国地税合并，为Y则不显示国税、地税标识
    if ("Y" !== gdshbbz ) {
        $gdFlag.text("");
        $gdFlag.removeClass();
    }
    var href = window.location.href;
    //判断联合附加税申报模式
    if (href.indexOf("lhFjsSbBz=Y") > -1) {
    	ywbm = "lhfjssb";
    }
    //判断是否显示申报表名
    var sbbName = getSbbMc(ywbm);
    if (sbbmBz === "Y" && sbbName) {
        $("#sbbName").text(sbbName);
    }
    if ("undefined" != typeof title && title && title === "sbbName") {
        $(document).attr("title",sbbName);
    }
	//zdzclx为区域需求，特定业务的才需要进行自动暂存，配置在配置中心。财务报表按申报需求为默认都需要暂存.假如zdzclx都不存在，说明不是申报业务。
    if (typeof(zdzclx)!="undefined" && zdzclx != null) {
    	setTimeout('autoSave(zdzclx)', 3000); 
    }
}


function openWin(url) {
    window.open(url + "&nsrsbh=" + nsrsbh + "&_bt=chreom&_st=sm,0,800,600,培训视频");
}

function resizeFrame() {
    var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    document.body.style.height = winH + "px";
    var height = $(document).height();
    autoResizeIframe("frmMain", height);
}

function loadPage(page) {
    var href = window.location.href;
    if (href.indexOf("?") > -1) {
        href = href.substr(0, href.indexOf("?"));
    }
    if (href.indexOf(";") > -1) {
        href = href.substr(0, href.indexOf(";"));
    }
    if("SXSQ" === ywlx && queryString.indexOf("ysqxxid") > -1&&queryString.indexOf("sxjdglCkbz") > -1){
        hideFrameHead();
    }

    if (typeof dzswjTgcParam !== "undefined" && "" !== dzswjTgcParam && dzswjTgcParam !== "null"
        && dzswjTgcParam != null && queryString.indexOf('DZSWJ_TGC') === -1) {
        document.getElementById("frmMain").src = href + "/" + page + "?" + queryString + "&" + dzswjTgcParam;
    }else{
        document.getElementById("frmMain").src = href + "/" + page + "?" + queryString;
    }
}

var index_loading;

function initFrame() {
    if(!layer){
        window.setTimeout(function () {
            initFrame()
        }, 50);
        return;
    }
    //提示错误信息
    if (errors != null && errors !== '' && errors !== '[]') {
        alertErrors();
        //阻断流程
        return;
    }
    //提示警告信息
    if (warns != null && warns !== '' && warns !== '[]') {
        alertWarns();
    }

    index_loading = layer.load(2, {shade: 0.3});
    window.setTimeout(function () {
        resizeFrame()
    }, 50);
    if (jsonConfig && jsonConfig.pages.length) {
        window.setTimeout(function () {
            loadPage(jsonConfig.pages[0].name)
        }, 1);
    }
}

function autoResizeIframe(frameId, customizedHeight, customizedWidth) {
    if (typeof frameId !== 'string') {
        if (frameId.frameElement && frameId.frameElement.id) {
            frameId = frameId.frameElement.id;
            //frameId error into frame window object
        } else {
            console.info("frameId error into unknow object:" + frameId);
        }
    }
    var frame = document.getElementById(frameId);
    if (frame != null && !window.opera) {
        if (frame.contentDocument && frame.contentDocument.body && frame.contentDocument.body.offsetHeight) {
            var height = frame.contentDocument.body.offsetHeight + 20;
            if (customizedHeight) {
                height = height > customizedHeight ? height : customizedHeight;
                if ($(".TopHead").css("display") === "block") {
                	var headHeight = $(".TopHead").height();
                    height -= (headHeight + 10);
                }
            }
            if(this.queryString && this.queryString.indexOf("yjlsb=Y")>0 && height < 300){
            	height = 400;
            }
            frame.style.height = height + "px";
            frame.height = height;
            frameContentWidth = frame.contentDocument.body.offsetWidth;
        } else if (frame.Document && frame.Document.body && frame.Document.body.scrollHeight) {
            frame.style.height = frame.Document.body.scrollHeight;
            frame.height = frame.Document.body.scrollHeight;
            frameContentWidth = frame.Document.body.scrollWidth;
        } else {
            window.setTimeout("autoResizeIframe(" + frameId + "," + customizedHeight + "," + customizedWidth + ")", 50);
            return;
        }
        layer.close(index_loading);
    }
}

/**
 *   按钮控制说明
 */
function menuBtnControl(menuBtnConfig, isExporting) {
    var $areaHeadBtn = $(".areaHeadBtn");
    //1、先清空按钮
    $areaHeadBtn.html("");

    //2、再添加按鈕，按需显示按钮
    var menuBtn = "";
    var menuMoreBtn = "";
    var menuToMoreBtns = "";
    if (showPxsp.indexOf(ywbm.toUpperCase()) !== -1 && bbFunction === 'tx') {
        menuBtn += spcd;
    }
    var hideBtnsSet = {};
    var arr = hideBtns.split(",");
    for (var i in arr) {
        if (arr[i] !== "") {
            hideBtnsSet[arr[i]] = 1;
        }
    }
    var showBtnsSet = {};
    arr = showBtns.split(",");
    for (var i in arr) {
        if (arr[i] !== "") {
            showBtnsSet[arr[i]] = 1;
        }
    }
    // 3、获取配置中心sbzs.btn.title和sxsq.btn.title配置
    var btnTitle = JSON.parse("{}");
    if (typeof sbzsBtnTitle!=="undefined" && (document.location.pathname.indexOf("/sbzs/")!=-1 || document.location.pathname.indexOf("/cwbb/")!=-1)) {
    	btnTitle = JSON.parse(sbzsBtnTitle);
    } else if (typeof sxsqBtnTitle!=="undefined" && document.location.pathname.indexOf("/sxsq/")!=-1){
    	btnTitle = JSON.parse(sxsqBtnTitle);
    }
    /**
     改成map 形式，避免按钮名包含，indexOf 无法正确控制按钮。
     */
    $.each(menuBtnConfig, function (name, value) {
    	menuBtn += analysisBtn(name, value, showBtnsSet, hideBtnsSet, btnTitle);
    });

    var processer = "";
    try{
        var processerUrl = $("#frmMain").contents().find("#myform").attr("action");
        var processerArr = processerUrl.split("/");
        processer = processerArr[5];
    }catch(e){

    }

    if(menuBtn.indexOf('btnExport01') == -1 && window.cp && window.curDjxh && window.curNsrsbh
    && ("SBZS" === ywlx || "SBZSB1" === ywlx || "CWBB" === ywlx || "CWBBB1" === ywlx)
    && processer == 'make' && ywbm != 'fcssbyd' && ywbm != 'cztdsysbyd'
        && ywbm != 'fcssbcj' && ywbm != 'cztdsysbcj') {
    	$.ajaxSettings.async = false;
        $.getJSON(cp + "/abacus/resources/js/frame/bmd.json").then(function (datas) {
            if (datas[curDjxh]) {
                var importExport = {
                    "btnExport01": {"name": "导出", "func": "exportJson()", "disp": "block"},
                    "btnImport01": {"name": "导入", "func": "importJson()", "disp": "block"}
                };
                $.each(importExport, function (name, value) {
                    var clas = 'btn btn06';
                    if (value.isUsual && (value.isUsual === 'true' || value.isUsual === true)) {
                        clas += ' btn10';
                    }
                    //扣缴个税上传文件按钮要黄色显示
                    if (value.sichuan && (value.sichuan === 'true' || value.sichuan === true)) {
                        clas += ' btn11';
                    }
                    menuBtn += '<li><a id=\"' + name + '\" class="' + clas + '\" onClick=\"javascript:window.frames[0].' + value.func + ';\">' + value.name + '</a></li>';
                });
            }
            $areaHeadBtn.append($(menuBtn));
            $(".TopHead").show();
            resetCtrl();
        }, function () {
            $areaHeadBtn.append($(menuBtn));
            $(".TopHead").show();
            resetCtrl();
        });
        $.ajaxSettings.async = true;
    }else{
        $areaHeadBtn.append($(menuBtn));
        if("SXSQ" === ywlx && queryString.indexOf("ysqxxid") > -1&&queryString.indexOf("sxjdglCkbz") > -1){
            hideFrameHead();
        }else{
            $(".TopHead").show();
        }
        resetCtrl();
    }

    layui.use('element', function(){
    	  var element = layui.element;
       	  element.render('nav');
    	});
}

function analysisBtn(name, value, showBtnsSet, hideBtnsSet, btnTitle, isToMore){
	var btns = "";
    if ("block" === value.disp || showBtnsSet[name]) {
        //判断哪些按钮需要隐藏
        if (hideBtns != null && (hideBtnsSet[name] === undefined || showBtnsSet[name])) {
            var clas = 'btn btn06';
            if (value.isUsual && (value.isUsual === 'true' || value.isUsual === true)) {
                clas += ' btn10';
            }
            //扣缴个税上传文件按钮要黄色显示
            if (value.sichuan && (value.sichuan === 'true' || value.sichuan === true)) {
                clas += ' btn11';
            }
            // "下一步" 根据配置中心确定按钮名称 a by C.Q 20180327
            var btnName = value.name;
            if (name === 'btnPrepareMake' && makeTypeDefualt === 'HTML'
                && ("SBZS" === ywlx || "SBZSB1" === ywlx || "CWBB" === ywlx || "CWBBB1" === ywlx || "SB" === ywlx)) {//添加业务中台的适配，ywlx=SB
                btnName = '申报';
                if (typeof btnTitle!=="undefined") {
                	btnTitle['btnPrepareMake'] = btnTitle['btnPrepareMake_sb'];
                }
            }
            //处理带参数的方法
            var func=value.func;
            var reg = new RegExp('\"',"g");
            func = func.replace(reg,"'");
            var btnHtml = "";
            if (isToMore && (isToMore === 'true' || isToMore === true)) {
                clas = "";
            }
            var numTips = "";
            if(value.showNumTips && (value.showNumTips === 'true' || value.showNumTips === true)){
                numTips = "<span class=\"numberbox\"><p class=\"number\"></p></span>";
            }
            if (typeof btnTitle[name]!=="undefined") {
            	btnHtml += '<li><a id=\"' + name + '\" class="' + clas + '\" onClick=\"javascript:window.frames[0].' + func + ';\" title="'+btnTitle[name]+'">' + btnName + numTips + '</a></li>';
            }else {
            	btnHtml += '<li><a id=\"' + name + '\" class="' + clas + '\" onClick=\"javascript:window.frames[0].' + func + ';\">' + btnName + numTips + '</a></li>';
            }
            
            if (value.isMore && (value.isMore === 'true' || value.isMore === true)) {
                if (value.isCp !== 'true' && value.isCp !== true) {
                    clas = "";
                }
            	btns += '<li  class="moreadd layui-nav">'
            		+ '<div class="layui-nav-item layui-this">'
            		+ '<a href="#" class=\"' + clas + '\">' + btnName + '</a>'
            		+ ' <ul class="layui-nav-child">';
            	if(value.chaildBtn){
            		$.each(value.chaildBtn, function (name, value) {
            			btns += analysisBtn(name, value, showBtnsSet, hideBtnsSet, btnTitle, true);
            		});
            	}
            	btns += '</ul></div>'
            		+ '</li>';
        	}else{
        		btns += btnHtml;
        	}
        }
    }
    return btns;
}

/**
 * 清空按钮区域
 */
function cleanMeunBtn() {
    $(".areaHeadBtn").empty();
}

/**
 *获取主页面frmMain元素
 */
function loadFrmMainData() {
    return document.getElementById("frmMain");
}

/**
 * 重新加载 frmMain 的URL
 */
function loadFrmMainURL(frmURL) {
    document.getElementById("frmMain").src = frmURL;
    //获取引导页传过来的swsxDm
    var str = frmURL;
    var num = str.indexOf("?");
    str = str.substr(num + 1);
    frmMainURLObj = queryString2Obj(str);
}

/**
 * 影藏框架头部区域
 */
function hideFrameHead() {
    $(".TopHead").hide();
}

function fszlMeunBtnShow(ysqxxid) {
    var secondLoadTag = null;
    if (typeof window.frames[0].flzlDeliver === 'function') {
        var json = window.frames[0].flzlDeliver();
        if (json.flag === "Y" && (json.params !== undefined && json.params !== "")) {
            secondLoadTag = json.params;
        }
    }
    if ($("#btnScfszl").length > 0) {
        var paraObj = queryString2Obj();
        var djxh = $("#djxh", window.frames["frmMain"].document).val() || paraObj.djxh;
        var nsrsbh = $("#nsrsbh", window.frames["frmMain"].document).val() || paraObj.nsrsbh;
        var test = $("#test", window.frames["frmMain"].document).val() || paraObj.test;
        var ywlx = location.href.indexOf("yjlsb=Y")>-1?window.ywlx:parent.ywlx;//一键零申报父页面多了一级iframe
        if(paraObj.sxjdglCkbz==="Y"){
        	ywlx="SXSQ";
        }
        if (typeof ywlx === "undefined" || ywlx === null || ywlx === "") {
            layer.load(2, {shade: 0.3});
            layer.alert('业务类型为空', {icon: 5});
            return;
        }
        var param = null;
        var tmpSwsxDm = "";
        //文书附送资料逻辑
        if (ywlx.toLowerCase().indexOf("sxsq") > -1) {
            var tmpLcswsxDm = "";
            var tmpSlswsxDm = "";
            if (typeof frmMainURLObj === 'object') {
                tmpSwsxDm = frmMainURLObj.swsxDm;
                tmpLcswsxDm = frmMainURLObj.lcswsxDm;
                tmpSlswsxDm = frmMainURLObj.slswsxDm;
            }
            tmpSwsxDm = !tmpSwsxDm ? cs_swsxDm : tmpSwsxDm;//优先获取引导页传过来的swsxDm，如无则取本来的
            tmpLcswsxDm = !tmpLcswsxDm ? lcswsxDm : tmpLcswsxDm;
            tmpSlswsxDm = !tmpSlswsxDm ? slswsxDm : tmpSlswsxDm;
            updateSwsx(tmpSwsxDm, tmpLcswsxDm, tmpSlswsxDm);

            param = "swsxDm=" + tmpSwsxDm + "&gdslxDm=" + gdslxDm
                + "&ysqxxid=" + ysqxxid + "&djxh=" + djxh + "&lcswsxDm=" + tmpLcswsxDm + "&slswsxDm=" + tmpSlswsxDm
                + "&nsrsbh=" + nsrsbh + "&test=" + test + "&secondLoadTag=" + secondLoadTag + "&" + dzswjTgcParam;
            if (typeof tmpSwsxDm === "undefined" || tmpSwsxDm === null || tmpSwsxDm === "") {
                layer.load(2, {shade: 0.3});
                layer.alert('税务事项为空', {icon: 5});
                return;
            }
        } else {
            //申报财报，业务中台财报附送资料逻辑
            tmpSwsxDm = location.href.indexOf("yjlsb=Y")>-1?window.ywbm:parent.ywbm;
            param = "swsxDm=" + tmpSwsxDm + "&gdslxDm=" + gdslxDm
                + "&ysqxxid=" + ysqxxid + "&djxh=" + djxh
                + "&nsrsbh=" + nsrsbh + "&test=" + test + "&" + dzswjTgcParam;
            if (typeof tmpSwsxDm === "undefined" || tmpSwsxDm == null || tmpSwsxDm === "") {
                layer.load(2, {shade: 0.3});
                layer.alert('业务编码为空', {icon: 5});
                return;
            }
        }
        if (typeof ysqxxid === "undefined" || ysqxxid == null || ysqxxid === "") {
            layer.load(2, {shade: 0.3});
            layer.alert('依申请信息为空', {icon: 5});
            return;
        }
        var btmake = $("#btnPrepareMake");
        $.ajax({
            type: "POST",
            url: zlpzWebContextPath + "/attachment/queryFszlfs.do?" + param,
            success: function (data) {
                //保存必报份数
                sybbfs1 = data.blfs;
                //保存条件报送份数
                sytjbbfs1 = data.tjblfs;
                var flzlsldiv, flzltjbssldiv;
                var jybz = data.jybz;
                //根据返回的资料份数（必传、非必传）,在附送资料按钮中显示对应的数目和颜色
                if (data.blfs > 0) {
                    flzlsldiv = '<div id="syblfs" class="temp01" style="">' + data.blfs + '</div>';
                } else if (data.tjblfs > 0) {
                    flzltjbssldiv = '<div id="syblfs" class="temp02" style="">' + data.tjblfs + '</div>';
                }
                if (flzlsldiv) {
                    $("#btnScfszl").append($(flzlsldiv));
                }
                if (flzltjbssldiv) {
                    $("#btnScfszl").append($(flzltjbssldiv));
                }
                if (ywlx.toLowerCase().indexOf("sxsq") > -1) {
                    var $fszlFrame = $("#fszlFrame").attr("src", zlpzWebContextPath + "/attachment/getDzbdFlzlList.do?" + param);
                } else {
                    //申报文件上传按钮占用myModa1的fszlFrame，申报将附送资料改为myModa7的sbFszlFrame
                    var $sbFszlFrame = $("#sbFszlFrame").attr("src", zlpzWebContextPath + "/attachment/getDzbdFlzlList.do?" + param);
                }

            },
            error: function () {
                layer.alert('查询附送资料份数失败', {icon: 5});
            }
        });
        //点击附送资料按钮，弹出附列资料框
        // 2018-05-05 迁移关闭按钮事件，将修改附送资料右上方红标时间迁移到attachment.js的uploadify_updateBlfs函数中
        var $winclose = $(window.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.document).find(".winbox_bg");
            $winbox_bg.remove();
            if (ywlx.toLowerCase().indexOf("sxsq") > -1) {
                $winclose.parents("#myModa1").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
            } else {
                //申报文件上传按钮占用myModa1的fszlFrame，申报将附送资料改为myModa7的sbFszlFrame
                $winclose.parents("#myModa7").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
            }
        });
    }
}

//优惠备案要求重置按钮失效不可用
function resetCtrl() {
    var urlYsquuidFlag = false; //如果浏览器中传入了依申请uuid，表单入口就是事项进度管理。
    var resetBtn = $("#btnReset");
    var str = location.href;
    var num = str.indexOf("?");
    var beforeNum = str.lastIndexOf("\/");
    var strBefore = str.substring(beforeNum + 1, num);
    var strAfter = str.substr(num + 1);
    if (strAfter.indexOf("ysqxxid") > 0) {
        urlYsquuidFlag = true;
    }
    if (urlYsquuidFlag === true
        && (strBefore === 'ssjmyhsq' || strBefore === 'ssjmyhba' || strBefore === 'qysdsyhba' || strBefore === 'zzsjzjt' || strBefore === 'ccsjmsba' || strBefore === 'sqkcba')) {
        resetBtn.prop('disabled', true);
        resetBtn.css('background-color', "#DDE0E5");
        resetBtn.css("opacity", "0.8");
        resetBtn.css("color", "#fff");
    }
}

/**
 *
 * 文件上传菜单显示
 */
function fileUploadMeunBtnShow() {
    var $fszlFrame, $winclose;
    if ($("#btnUpload").length > 0) {

        if (ywbm.toUpperCase() === "QYSDS_A_17ND") {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getQysdsA17ndUploadList.do" + "?" + dzswjTgcParam);
        } else if ((ywbm.toUpperCase()).indexOf("HBS") > -1) {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getHbsUploadList.do" + "?" + dzswjTgcParam);
        } else if(ywbm.toUpperCase()==="JYPFXFS") {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getJypfxfsUploadList.do" + "?" + dzswjTgcParam);
        }else {
                $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getUploadList.do" + "?" + dzswjTgcParam);
        }

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa1").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

    //上传附注
    if ($("#btnScfzzl").length > 0) {
        var paraObj = queryString2Obj();
        var djxh = $("#djxh", window.frames["frmMain"].document).val() || paraObj.djxh;
        var scfzzlParm = "?sbywbm=" + ywbm + "&djxh=" + djxh + "&gdslxDm=" + gdslxDm + "&" + dzswjTgcParam;
        $fzzlFrame = $("#fzzlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getCwbbUploadList.do" + scfzzlParm);

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa2").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

	 //预缴上传附注
    if ($("#btnScyjfzzl").length > 0) {
        var paraObj = queryString2Obj();
        var djxh = $("#djxh", window.frames["frmMain"].document).val() || paraObj.djxh;
        var scfzzlParm = "?sbywbm=" + ywbm + "&djxh=" + djxh + "&gdslxDm=" + gdslxDm + "&" + dzswjTgcParam;
        $fzzlFrame = $("#yjfzzlFrame").attr("src", sbzsWebContextPath + "/view/nssb/yjscfj/lhyjscfj.jsp" + scfzzlParm);

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa6").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }
	
    if ($("#btnDrxml").length > 0) {
        $fzzlFrame = $("#xmlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/openDrym.do" + "?" + dzswjTgcParam);

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa4").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

}
/**
 * 调用menubutton.js中的autoSave，先进行判空操作
 */
function autoSave(zdzclx) {
    if(typeof window.frames[0].autoSave != 'undefined'){
    	eval("window.frames[0].autoSave(zdzclx)");
    }  
}


function closeWindow() {
    var browserName = navigator.appName;
    if (browserName === "Netscape") {
        window.opener = null;
        window.open('', '_self');
        window.close();

    } else {
        if (browserName === "Microsoft Internet Explorer") {
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    }
}

//将querystring转为obj
function queryString2Obj(queryStrPara) {
    var paraObj = {};
    if(queryStrPara){
		 var qs = queryStrPara.split("&");
        for (var i = 0; i < qs.length; i++) {
            var kv = qs[i].split("=");
            if (kv[0] && kv[1]) {
                paraObj[kv[0]] = kv[1];
            }
        }
    }else if (queryString) {
        var qs = queryString.split("&");
        for (var i = 0; i < qs.length; i++) {
            var kv = qs[i].split("=");
            if (kv[0] && kv[1]) {
                paraObj[kv[0]] = kv[1];
            }
        }
    }
    return paraObj;
}

//提示错误信息
function alertErrors() {
    var myErrors = '';
    try {
        var tempErrors = eval('(' + errors + ')');
        for (var i = 1; i <= tempErrors.length; i++) {
            if (tempErrors.length === 1) {
                myErrors = tempErrors[0].msg;
                break;
            }
            myErrors += i + "：" + tempErrors[i - 1].msg + "<br>";
        }
    } catch (err) {
        myErrors = errors;
    }
    window.parent.layer.load(2, {shade: 0.3});
    window.parent.layer.alert(myErrors, {
        icon: 5,
        closeBtn: 0,
        offset: '270px'
    }, function () {
        closeWindow();
    });
}

//提示警告信息
function alertWarns() {
    var myWarns = '';
    try {
        var tempWarns = eval('(' + warns + ')');
        for (var i = 1; i <= tempWarns.length; i++) {
            if (tempWarns.length === 1) {
                myWarns = tempWarns[0].msg;
                break;
            }
            myWarns += i + "：" + tempWarns[i - 1].msg + "<br>";
        }
    } catch (err) {
        myWarns = warns;
    }
    var index = window.parent.layer.load(2, {shade: 0.3});
    window.parent.layer.alert(myWarns, {
        icon: 5,
        offset: '270px'
    });
    window.parent.layer.close(index);
}
/**
 * 封装业务中台ajax请求
 * @param reqParams
 *  调jsp服务的样例：{"sid":"dzswj.wbzy.rd.rdSfzrdxxb.cxSfzrdxx","业务key":"业务值" ....} djxh、nsrsbh等字段，无需传，后台从会话获取；
 *  直接调核心接口的样例为：{"sid":"核心接口名称","sidType":"02","qqbw":"请求金三核心接口的业务报文；"}
 * @param successCallback 为数据请求成功的回调函数
 * @param errorCallback  数据请求失败的回调函数,
 * @param setAsync为：true或false 默认为异步
 */
function requestYwztData(reqParams,successCallback,errorCallback,setAsync){
	var url = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1] +"/ywzt/getData.do";
	var realUrl = window.location.href;
	//把页面url后的参数拼接到请求参数
	var index = -1;
    var str = '';
    var requestAsync = false;
    var arr = [];
    var async = false;
    var length = 0;
    var res = {};
    if(setAsync){
    	async =setAsync
    }
    if(reqParams){
    	if(realUrl.indexOf('?')!=-1){
			index = realUrl.indexOf('?');
			str = realUrl.substring(index+1);
			arr = str.split('&');
			length = arr.length;
			for(var i=0; i<length-1; i++){
				res[arr[i].split('=')[0]] = arr[i].split('=')[1];
			}
		}else{
			res = {};
		}
		if(typeof reqParams.sid != "undefined" && reqParams.sid != null && reqParams.sid != ""){
			res["sid"] = reqParams.sid;
	    }
		
		if(typeof reqParams.qqbw != "undefined" && reqParams.qqbw != null && reqParams.qqbw != ""){
			res["qqbw"] = reqParams.qqbw;
	    }
		//默认为异步请求
		if(typeof reqParams.async != "undefined" && reqParams.async != null && reqParams.async != ""){
			requestAsync = reqParams.async;
	    }
		var requestData = {};
		try{
			requestData = Object.assign(res,reqParams);
		}catch(e){
			//requestData =res;
			//ie合并json对象
			for(var keyName in res){
				if(reqParams[keyName]){
					continue;
				}else{
					reqParams[keyName] = res[keyName];
				}
				}
			requestData = reqParams;
		}
		$.ajax({        		
			type : "POST",
	 		url : url,
	 		async: async,
	 		data:requestData,
	 		success:function(data){
	 			//尝试转化为json对象，转化不了直接返回数据
	 			var json = JSON.parse(data);
	 			if(json["rtnCode"]){
	 				if(json["rtnCode"].match(/^[0]*$/)){
	 					if(json["body"]){
	 						if(typeof successCallback =="function"){
		 						try{
				 					var response = JSON.parse(json["body"]);
				 					successCallback(response);
				 				}catch(e){
				 					var resData = json["body"];
				 					successCallback(resData);
				 				}
	 						}
	 					}
	 				}else{
	 					if(json["errInfo"]){
			 				if(json["errInfo"]["msg"]){
			 					//判断是否支持打印
			 					if (window["console"]){
			 				        console.log(json["errInfo"]["msg"]);
			 				    }
			 					if(errorCallback && typeof errorCallback =="function"){
			 						if(json["errInfo"]["stack"]){
			 							errorCallback(json["errInfo"]["msg"],"02",json["errInfo"]["stack"]);
			 						}else{
			 							errorCallback(json["errInfo"]["msg"],"02","");
			 						}
			 					}else{
			 						layer.alert(json["errInfo"]["msg"]);
			 					}
			 				}
			 			}
	 				}
	 			}
	 			
	 		},
	 		error:function(data,type, err){
	 			if(errorCallback && typeof(eval(errorCallback))=="function"){
	 				errorCallback(err,"01");
	 			}else{
	 				layer.alert(err);
	 			}
			}
	 		});
    }else{
    	errorCallback("参数错误","02");
    }
}

function resolveYwztResponse(data){
    //尝试转化为json对象，转化不了直接返回数据
    var json = data;
    if(typeof data == "string"){
        json = JSON.parse(data)
    }
    if(json["body"]){
        try{
            var response = JSON.parse(json["body"]);
            return response;
        }catch(e){
            var resData = json["body"];
            return resData;
        }
    }
    if(json["errInfo"]){
        if(json["errInfo"]["msg"]){
            //判断是否支持打印
            if (window["console"]){
                console.log(json["errInfo"]["msg"]);
            }
            var errorResponse = json["errInfo"]["msg"];
            return errorResponse;
        }
    }
}

function cloneFormData (scope, newData) {
    formData = jQuery.extend(true, {}, newData);
    scope.$apply();
}

/**
 * 事项办理提示公共方法
 */
function commonTs(codeList,ts_dm){
	for(key in codeList){
		if(key===ts_dm){
			return codeList[key];
        }
	}
}

//判断是否为静默申报
function isJmsb(){
	var href = window.location.href;
	if (href.indexOf("jmsbId") > -1) {
       return true;
    }
	return false;
}
//更新相关值
function updateSwsx(swsxDm, lcswsxDm, slswsxDm){
	parent.swsxDm = !swsxDm?parent.swsxDm:swsxDm;
	parent.lcswsxDm = !lcswsxDm?parent.lcswsxDm:lcswsxDm;
	parent.slswsxDm = !slswsxDm?parent.slswsxDm:slswsxDm;
}