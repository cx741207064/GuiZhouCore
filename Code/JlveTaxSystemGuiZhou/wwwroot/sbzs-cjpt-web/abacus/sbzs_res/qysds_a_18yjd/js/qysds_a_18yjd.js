//获取上一年小薇企业标志
function getSnxwqy() {
	var snd = ((formData.fq.sssq.sqQ).split("-")[0]) - 1;
	var synsfysbnb = formData.kz.temp.zb.synsfysbnb;// 上一年是否已申报年报

	// 上年 A年报数据
	var cyrs = formData.fq.syndNbxx.cyrs;
	var ynssde = formData.fq.syndNbxx.ynssde;
	var zcze = formData.fq.syndNbxx.zcze;
	var csgjfxzhjzhy = formData.fq.syndNbxx.csgjfxzhjzhy;
	var hyDm = formData.fq.syndNbxx.hyDm == ''
			|| formData.fq.syndNbxx.hyDm == undefined ? formData.fq.nsrjbxx.hyDm
			: formData.fq.syndNbxx.hyDm;

	// 上一年 第四季度 或12月的小薇
	var syndsjdh12ysfsxw = formData.fq.syndsjdh12ysfsxw.sfxxwlqy;

	// 上年 B年报数据

	var ynssde_b = formData.fq.synqysdsbNdxx.acbfy_ynssde != 0 ? formData.fq.synqysdsbNdxx.acbfy_ynssde
			: formData.fq.synqysdsbNdxx.asrze_ynssbe;
	var gjxzhjzhy = formData.fq.synqysdsbNdxx.gjxzhjzhy;
	var qycyrs_qnpjrs = formData.fq.synqysdsbNdxx.qycyrs_qnpjrs;
	var zcze_qnpjrs = formData.fq.synqysdsbNdxx.zcze_qnpjrs;

	// 上年 B表 第四季度 或12月的小薇

	var synqysdsbYjdxx = formData.fq.synqysdsbYjdxx.sfxxwlqy;

	if (synsfysbnb == "Y") { // 存在年报A数据的时候根据年报数据判断小薇

		var xw = sfxwqy_ND(csgjfxzhjzhy, hyDm, cyrs, zcze, ynssde, snd);

		var xwbz = xw ? "Y" : "N";
		return xwbz;

	} else if (syndsjdh12ysfsxw != "" && syndsjdh12ysfsxw != undefined) {// 上一年
		// 第四季度
		// 或12月的小薇

		return syndsjdh12ysfsxw;

	} else if (qycyrs_qnpjrs != 0 && qycyrs_qnpjrs != undefined) {// 以上都不存在的时候
		// 说明他上一年是核定
		// 今年转查账，
		// 根据上年核定申报的数据判断

		var xw_b = sfxwqy_ND(gjxzhjzhy, hyDm, qycyrs_qnpjrs, zcze_qnpjrs,
				ynssde_b, snd);
		var xwb = xw_b ? "Y" : "N";
		return xwb;

	} else {
		return synqysdsbYjdxx != undefined ? synqysdsbYjdxx : "";

	}

}

/**
 * 判断上一年是否是小威
 * 
 * @param csgjfxzhjzhy
 * @param sshyDm
 * @param cyrs
 * @param zcze
 * @param ynssde
 * @param nd
 * @returns {Boolean}
 */

function sfxwqy_ND(csgjfxzhjzhy, sshyDm, cyrs, zcze, ynssde, nd) {
	var isXwqy = false;

	// 年度小薇起征点
	var qzd;

	if (nd < 2018) {

		qzd = 500000;
	} else {

		qzd = formData.kz.temp.zb.xwqzdje;
	}

	if (csgjfxzhjzhy == null || csgjfxzhjzhy == "" || "N" != csgjfxzhjzhy) {
		// 不满足第105项为“否”的企业的条件，返回0，
		return isXwqy;
	}

	if (ynssde > qzd) {
		// 不满足A100000《中华人民共和国企业所得税年度纳税申报表（A类）》第23行应纳税所得额<=50万元且>0的条件，返回0
		return isXwqy;
	}
	if (sshyDm == null || sshyDm == "") {
		return isXwqy;
	}
	if (cyrs == null || cyrs == "" || cyrs <= 0) {
		return isXwqy;
	}
	if (zcze == null || zcze == "" || zcze < 0) {
		return isXwqy;
	}

	if (!isNaN(sshyDm)) {
		// 行业代码还有A、B、C等字母，但是属于父类，应该不可选，但是还是判断是否为数字的
		var hyDmInt = sshyDm.substring(0, 2);
		if (hyDmInt >= 6 && hyDmInt <= 46) {
			// 因为最大的数值为4690，所以可以直接判断<=46
			// 第102项“行业明细代码”属于“工业企业”的
			if (cyrs <= 100 && zcze <= 3000) {
				isXwqy = true;
			}
		} else {
			// 第102项“行业明细代码”不属于“工业企业”的
			if (cyrs <= 80 && zcze <= 1000) {
				isXwqy = true;
			}
		}
	} else {
		// 第102项“行业明细代码”不属于“工业企业”的
		if (cyrs <= 80 && zcze <= 1000) {
			isXwqy = true;
		}

	}
	return isXwqy;
}

/**
 * 当A200000第11行-本表第1+2+…+28行<=0时，本行数据清空
 * 
 * @param value
 */
function cal_qysds_a_18yjd_A201030_29Row(value, jmzlxDm, jzfd) {
	if (value <= 0) {
		formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.jzmzlx = "";
		formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.jzfd = 0;
	} else {
		if (!isNull(jmzlxDm) && jmzlxDm == '2') {
			return ROUND(ROUND((value * 0.4) * 100, 2) / 100, 2);
		} else if (!isNull(jmzlxDm) && jmzlxDm == '1') {
			return ROUND(
					ROUND(
							(ROUND(ROUND((value * 0.4) * 100, 2) / 100, 2) * jzfd) * 100,
							2) / 100, 2);
		}
	}
	return 0;
}

function cal_qysds_a_18yjd_A201030_1Row(xxwlqy, sjlreLj) {
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var fhtjdxxwlqyjmqysdsLj = formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj;
	var je = formData.kz.temp.zb.xwqzdje;

	if (xxwlqy == 'Y' && sjlreLj > 0.03 && sjlreLj <= je) {
		return ROUND(ROUND((sjlreLj * 0.15) * 100, 2) / 100, 2);
	}
	return 0;
}

function vaild_qysds_a_18yjd_A201030_1Row(fhtjdxxwlqyjmqysdsLj, xxwlqy,
		sjlreLj, bz) {
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var fhtjdxxLj = formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj;
	var je = formData.kz.temp.zb.xwqzdje;
	if (xxwlqy == 'Y' && sjlreLj > 0.03 && sjlreLj <= je) {
		if (bz == 'vaild1') {
			return fhtjdxxwlqyjmqysdsLj == ROUND(ROUND((sjlreLj * 0.15) * 100,
					2) / 100, 2)
					|| fhtjdxxwlqyjmqysdsLj == 0;
		} else if (bz == 'vaild2') {
			var t_hj1_28 = formData.kz.temp.fb3.t_hj1_28;
			return fhtjdxxwlqyjmqysdsLj != 0 || t_hj1_28 != 0;
		}
	}
	if (bz == 'vaild1') {
		return true;
	} else if (bz == 'vaild2') {
		return true;
	}
}

function vaild_qysds_a_18yjd_A201030_2_28Row() {
	var sum = 0;
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i] != 0) {
			sum++;
		}
	}
	if (sum >= 2) {
		return false;
	} else {
		return true;
	}
}

// 初始化本期小薇判断
function getXwinit() {
	var sbqylx = formData.hq.sbQysdsczzsyjdsbqtxxVO.sbqylx;
	var tsnsrlxDm = formData.hq.sbQysdsczzsyjdsbqtxxVO.tsnsrlxDm
	var kdqsszyDm = formData.fq.kdqsszyDm;
	var zfjglxDm = formData.fq.zfjglxDm;
	var sjlreLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
	var synsfsxwqy = formData.kz.temp.zb.synsfsxwqy;// 上一年是否是小薇
	var swjgDm = formData.fq.nsrjbxx.swjgDm;
	var gsdq = (swjgDm).substring(0, 5);
	var dq = (swjgDm).substring(1, 3);
	var qzd = formData.kz.temp.zb.xwqzdje;
	// 分支机构是小薇默认N ; 应纳大于100万默认N
	if (sbqylx == '2' || sjlreLj > qzd || tsnsrlxDm == "05"
			|| tsnsrlxDm == "06" || tsnsrlxDm == "10" || kdqsszyDm == "0"
			|| (zfjglxDm == "2" && kdqsszyDm == "1")) {
		return 'N';
	}

	// 当 应纳小于100万 且 上一年为N 或上一年没信息（新开企业）时 返回空纳税人手动填写
	if (synsfsxwqy == 'N' || synsfsxwqy == '') {

		// 大连/青海个性化
		if (gsdq == "12102" || dq == "63") {

			return "Y";

		} else {

			return '';
		}

	}

	return 'Y';

}

// 触发性本期小薇判断

function getBqxwqy(sjlreLj) {

	var sjlreLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
	var synsfsxwqy = formData.kz.temp.zb.synsfsxwqy;
	var sfsyxxwlqy = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sfsyxxwlqy;
	var sbqylx = formData.hq.sbQysdsczzsyjdsbqtxxVO.sbqylx;
	var qzd = formData.kz.temp.zb.xwqzdje;
	var tsnsrlxDm = formData.hq.sbQysdsczzsyjdsbqtxxVO.tsnsrlxDm
	var kdqsszyDm = formData.fq.kdqsszyDm;
	var zfjglxDm = formData.fq.zfjglxDm;

	if (sjlreLj > qzd || sbqylx == "2" || tsnsrlxDm == "05"
			|| tsnsrlxDm == "06" || tsnsrlxDm == "10" || kdqsszyDm == "0"
			|| (zfjglxDm == "2" && kdqsszyDm == "1")) {
		return 'N';
	}

	if (synsfsxwqy == "Y" && sbqylx != "2") {
		return "Y"
	}

	return sfsyxxwlqy;

}

// 获取分配比例
function getfpbl(fzjgsrze, fzjggzze, fzjgzcze, fzjgnsrsbh, t_fzjgsrzeHj,
		t_fzjggzzeHj, t_fzjgzczeHj, fzjglxlb, idx) {

	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var nsrsbh = formData.fq.nsrjbxx.nsrsbh;
	if (fzjgxx.length == 1) {

		return 1;

	}

	if (idx === 0) {
		var fdlbmHj = 0; // 记录非独立生产经营部门的分配比例之和
		var sfczdlbm = false; // 判断是否存在独立部门
		var blhj = 0;
		var srzebl = 0;
		var gzzebl = 0;
		var zczebl = 0;
		var fpbl = 0;
		for (var i = 0, len = fzjgxx.length; i < len; i++) {
			srzebl = ROUND(t_fzjgsrzeHj === 0 ? 0 : (fzjgxx[i].fzjgsrze
					/ t_fzjgsrzeHj * 0.35), 16);
			gzzebl = ROUND(t_fzjggzzeHj === 0 ? 0 : (fzjgxx[i].fzjggzze
					/ t_fzjggzzeHj * 0.35), 16);
			zczebl = ROUND(t_fzjgzczeHj === 0 ? 0 : (fzjgxx[i].fzjgzcze
					/ t_fzjgzczeHj * 0.3), 16);
			fpbl = ROUND(srzebl + gzzebl + zczebl, 10);

			if (fzjgxx[i].fzjglxlb !== "dlbm") {
				fdlbmHj += fpbl;
			}

			if (fzjgxx[i].fzjglxlb === "dlbm") {
				sfczdlbm = true;
			}

			if (i !== fzjgxx.length - 1) {
				blhj += fpbl;
			}

		}
		formData.ht['fdlbmHj'] = fdlbmHj;
		formData.ht['blhj'] = blhj;
		formData.ht['sfczdlbm'] = sfczdlbm;
	}

	var cs1 = ROUND(t_fzjgsrzeHj == 0 ? 0 : (fzjgsrze / t_fzjgsrzeHj * 0.35),
			16);
	var cs2 = ROUND(t_fzjggzzeHj == 0 ? 0 : (fzjggzze / t_fzjggzzeHj * 0.35),
			16);
	var cs3 = ROUND(t_fzjgzczeHj == 0 ? 0 : (fzjgzcze / t_fzjgzczeHj * 0.3), 16);

	if (fzjglxlb == "dlbm") { // 独立生产经营部门分配比例的算法

		var hj = 0; // 记录非独立生产经营部门的分配比例之和
		hj = formData.ht['fdlbmHj'];
		var bl = ROUND((1 - hj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - hj) * 100000, 10) / 100000 : 0;

		return bl;

	} else { // 非独立生产经营部门分配比例的算法
		var sfczdlbm = formData.ht['sfczdlbm']; // 判断是否存在独立部门
		var sfzhyh = false; // 判断是否是 计算最后一行的比例
		var blhj = formData.ht['blhj'];// 记录除最后一行外其他行的比例之和
		if (idx == fzjgxx.length - 1) {
			sfzhyh = true;
		}

		if (sfczdlbm || !sfzhyh) {
			return ROUND((cs1 + cs2 + cs3) * 100000, 10) / 100000;

		} else {

			// 不存在独立部门的时候 最后一行的分配比例 用1减去其他行的比例之和

			var bl = ROUND((1 - blhj) * 100000, 10) / 100000 > 0 ? ROUND(
					(1 - blhj) * 100000, 10) / 100000 : 0;

			return bl;
		}

	}

}

function getFpse(fzjgftdsdse, fpbl, fzjglxlb, fzjgnsrsbh, idx) {
	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var len = fzjgxx.length;

	if (idx === 0) {
		var sfczdlbm = false; // 判断是否存在独立部门

		var hj = 0; // 记录非独立生产经营部门的分配税额之和
		var sehj = 0;
		for (var i = 0; i < len; i++) {
			if (fzjgxx[i].fzjglxlb !== "dlbm") {
				hj += ROUND(fzjgftdsdse * fzjgxx[i].fpbl, 2);
			}

			if (fzjgxx[i].fzjglxlb === "dlbm") {
				sfczdlbm = true;
			}

			if (i !== fzjgxx.length - 1) {
				sehj += ROUND(fzjgftdsdse * fzjgxx[i].fpbl, 2);
			}

		}
		formData.ht['hj'] = hj;
		formData.ht['sehj'] = sehj;
		formData.ht['sfczdlbm'] = sfczdlbm;
	}
	var fpse = 0;
	if (fzjglxlb === "dlbm") { // 独立生产经营部门分配税额的算法
		var hj = formData.ht['hj']; // 记录非独立生产经营部门的分配税额之和
		fpse = fzjgftdsdse - hj > 0 ? fzjgftdsdse - hj : 0;
		return fpse;
	} else {// 非独立生产经营部门分配税额的算法
		var sfzhyh = false; // 判断是否是 计算最后一行的税额
		if (fzjgxx[fzjgxx.length - 1].fzjgnsrsbh === fzjgnsrsbh
				&& fzjgxx[fzjgxx.length - 1].fzjglxlb === fzjglxlb) {
			sfzhyh = true;
		}
		if (sfczdlbm || !sfzhyh) {
			return fzjgftdsdse * fpbl;
		} else {
			var sehj = formData.ht['sehj'];// 记录除最后一行外其他行的税额之和
			fpse = fzjgftdsdse - sehj > 0 ? fzjgftdsdse - sehj : 0;
			return fpse;
		}
	}

}

// 更正申报是要不参股表的证件类型名称重新赋值。GDSDZSWJ-8118
function setZjlxMc() {
	var gzbz = formData.kz.temp.gzsbbz;
	if (gzbz != "Y") {
		return;
	}
	var dmb = formData.kz.basedata["sfzjlx"];
	var zjCT = formCT.sfzjlxCT
	var cgbList = formData.kz.temp.cgwgqyxxbgbVO;
	var arr = new Array();
	if (!isNull(dmb)) {
		arr = dmb['item'];
	}

	for (var i = 0; i < cgbList.length; i++) {

		var dsxxList = cgbList[i].dsxxGrid.dsxxGridlb;

		for (var j = 0; j < dsxxList.length; j++) {

			dm = dsxxList[j].sfzjlx;
			mc = zjCT[dm];

			if (!isNull(dm) && !isNull(mc)) {
				dmb = {};
				// 去掉重复的TODO
				var item = {};
				item['dm'] = dm;
				item['mc'] = mc;
				arr.push(item);
				dmb['item'] = arr;
			}

		}

	}

}

function isNull(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param) {
		return true;
	}
	return false;
}

/**
 * 逾期申报校验
 * 
 */

function yqsbVaild() {
	var yqsbbz = parent.parent.yqsbbz;
	var sbqx = formData.hq.sbxxGrid.sbxxGridlb[0].sbqx;
	var gdslxDm = formData.fq.nsrjbxx.gdslxDm;

	if (yqsbbz != "Y") {
		var sbiniturl = parent.pathRoot
				+ "/biz/yqsb/yqsbqc/enterYqsbUrl?gdslxDm=" + gdslxDm + "&sbqx="
				+ sbqx + "&yqsbbz=" + yqsbbz;
		$
				.ajax({
					url : sbiniturl,
					type : "GET",
					data : {},
					dataType : "json",
					contentType : "application/json",
					success : function(data) {
						var sfkyqsbbz = data.sfkyqsbbz;

						if (sfkyqsbbz == "N") {

							$(window.parent.document.body).mask("&nbsp;");
							window.parent.cleanMeunBtn();

							var b = parent.layer
									.confirm(
											data.msg,
											{
												// area: ['250px','150px'],
												title : '提示',
												btn : [ '确定' ]
											// btn2:function(index){}
											},
											function(index) {
												parent.layer.close(b);

												var wfurl = data.wfurlList;

												if (wfurl != undefined
														&& wfurl != ""
														&& wfurl != null) {
													var gnurl = wfurl[0].gnurl;
													var url = parent.location.protocol
															+ "//"
															+ parent.location.host
															+ gnurl
													parent.parent.window.location.href = url;

												} else {
													if (navigator.userAgent
															.indexOf("MSIE") > 0) {
														if (navigator.userAgent
																.indexOf("MSIE 6.0") > 0) {
															window.opener = null;
															window.close();
														} else {
															window.open('',
																	'_top');
															window.top.close();
														}
													} else if (navigator.userAgent
															.indexOf("Firefox") > 0) {
														window.location.href = 'about:blank ';
														window.close();
													} else if (navigator.userAgent
															.indexOf("Chrome") > 0) {
														top.open(location,
																'_self')
																.close();
													} else {
														window.open('', '_top');
														window.top.close();
													}
												}
											});

						}

					},
					error : function() {
						layer.alert('链接超时或网络异常', {
							icon : 5
						});
					}
				});
	}
}

// 弥补亏损的提示:当暑期在1-5月内且年报没有申报时，8行的弥补亏损不带出初始化值，这时候要给予对应的提示
function mbksVerify() {
	var synsfysbnb = formData.kz.temp.zb.synsfysbnb;// 上一年是否已申报年报
	var sfqymbksjk = formData.kz.temp.zb.sfqymbksjk;// 是否启用弥补亏损监控
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var month = parseInt((skssqz).split("-")[1], 10);

	if (synsfysbnb == "N" && month < 6 && sfqymbksjk == "Y") {

		var msg = "因您的弥补亏损数据需关联上年度年度申报数据，请完成年度申报后再填写弥补亏损数据，如因未能在第一季度预缴前完成年度申报，建议第二季度预缴再弥补。";

		layer.alert(msg, {
			icon : 7
		});

	}

}

/**
 * 初始化A202000表
 */
function setFpbxx() {
	var fzjgxxList = formData.hq.fzjgxxGrid.fzjgxxGridlb;

	// 把核心接口返回的分支机构信息初始化到表单界面对应的节点中
	for (var i = 0; i < fzjgxxList.length; i++) {
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i] = {
			"fzjgdjxh" : "",
			"fzjgzgswjDm" : "",
			"fzjglxlb" : "",
			"fzjgnsrsbh" : "",
			"fzjgmc" : "",
			"fzjgsrze" : 0,
			"fzjggzze" : 0,
			"fzjgzcze" : 0,
			"fpbl" : 0,
			"fpse" : 0,
			"sfxsdfjm" : 0,
			"xsdfjmje" : 0,
			"xsdfjmfd" : 0
		};
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjglxlb = fzjgxxList[i].fzjglxlb;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgnsrsbh = fzjgxxList[i].fzjgnsrsbh;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgmc = fzjgxxList[i].fzjgmc;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgsrze = fzjgxxList[i].fzjgsrze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjggzze = fzjgxxList[i].fzjggzze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgzcze = fzjgxxList[i].fzjgzcze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgdjxh = fzjgxxList[i].fzjgdjxh;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].sfxsdfjm = fzjgxxList[i].sfxsdfjm;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].xsdfjmje = fzjgxxList[i].xsdfjmje;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].xsdfjmfd = fzjgxxList[i].xsdfjmfd;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgzgswjDm = fzjgxxList[i].fzjgzgswjDm;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].idx = i;

	}

}

// 获取分配比例
function getfpblhfpse(fzjgsrze, fzjggzze, fzjgzcze, fzjgnsrsbh, t_fzjgsrzeHj,
		t_fzjggzzeHj, t_fzjgzczeHj, fzjglxlb,fzjgftdsdse) {

	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var nsrsbh = formData.fq.nsrjbxx.nsrsbh;

	var fdlbmfpblHj = 0; // 记录非独立生产经营部门的分配比例之和
	var fdlbmfpseHj = 0; // 记录非独立生产经营部门的分配税额之和
	var sfczdlbm = false; // 判断是否存在独立部门
	var dlbmID = 0; // 用于记录独立部门的下标
	var blhj = 0; // 用于记录除最后一行外的比例合计
	var sehj = 0; // 用于记录除最后一行外的税额合计
	var srzebl = 0;
	var gzzebl = 0;
	var zczebl = 0;
	var fpbl = 0;
	var defaultVal=ROUND(0,16);
	
	for (var i = 0, len = fzjgxx.length; i < len; i++) {

		// 只有一个分支机构时
		if (fzjgxx.length == 1) {
			fzjgxx[0].fpbl = ROUND(1, 10);
			fzjgxx[0].fpse = ROUND(fzjgftdsdse, 2);
			break;
		}

		srzebl = t_fzjgsrzeHj === 0 ? defaultVal : ROUND((fzjgxx[i].fzjgsrze/ t_fzjgsrzeHj * 0.35), 16);
		gzzebl =t_fzjggzzeHj === 0 ? defaultVal :  ROUND((fzjgxx[i].fzjggzze/ t_fzjggzzeHj * 0.35), 16);
		zczebl = t_fzjgzczeHj === 0 ? defaultVal: ROUND((fzjgxx[i].fzjgzcze/ t_fzjgzczeHj * 0.3), 16);
		fpbl = ROUND(srzebl + gzzebl + zczebl, 10);
		fpbl=ROUND(ROUND(fpbl * 100000, 10) / 100000, 10);
		fpse=ROUND(fzjgftdsdse*fpbl,2);

		if (fzjgxx[i].fzjglxlb === "dlbm") {
			sfczdlbm = true;
			dlbmID = i;
		}else{
			fdlbmfpblHj += fpbl;
			fdlbmfpseHj+=fpse;
		}

		if (i !== fzjgxx.length - 1) {
			blhj += fpbl;
			sehj+=fpse;
		}

		// 每一行的分配比例和分配税额赋值
		fzjgxx[i].fpbl =fpbl;
		fzjgxx[i].fpse =fpse;

	}

	if (sfczdlbm) { // 独立生产经营部门分配比例和分配税额要重新计算

		fzjgxx[dlbmID].fpbl =ROUND( ROUND((1 - fdlbmfpblHj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - fdlbmfpblHj) * 100000, 10) / 100000
				: 0,10);

		fzjgxx[dlbmID].fpse = ROUND(fzjgftdsdse-fdlbmfpseHj, 2);
		
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((fdlbmfpblHj+fzjgxx[dlbmID].fpbl)*100000,10)/100000,10);
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(fdlbmfpseHj+fzjgxx[dlbmID].fpse,2);
	} else { // 不存在独立部门时最后一行重新计算

		fzjgxx[fzjgxx.length - 1].fpbl =ROUND( ROUND((1 - blhj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - blhj) * 100000, 10) / 100000
				: 0,10);

		fzjgxx[fzjgxx.length - 1].fpse = ROUND(fzjgftdsdse
				-sehj, 2);
		
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((blhj+fzjgxx[fzjgxx.length - 1].fpbl)*100000,10)/100000,10);
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(sehj+fzjgxx[fzjgxx.length - 1].fpse,2);

	}
	
	
}

function validFpbl(fpbl){
	// $..A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpbl>=0&&$..A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpbl<=1
	var gridlb = fpbl.substring(0,fpbl.lastIndexOf('[')); // 截取jpath中最后一个节点所在的列表路径
	var _lst = eval(gridlb); // 通过eval 将列表路径转成集合数据
	var ret=[];
	for(var i=0;i<_lst.length;i++) {
		ret[i] = _lst[i].fpbl >=0&&_lst[i].fpbl<=1;
	}
	return ret;
}