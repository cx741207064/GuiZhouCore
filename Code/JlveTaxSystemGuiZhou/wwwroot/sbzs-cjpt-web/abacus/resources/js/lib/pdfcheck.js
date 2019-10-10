function isPDFPluginInstall() {
    if (!isIE()) {
        //  非ie 浏览器   Adobe Reader | Adobe PDF | Acrobat | Chrome PDF Viewer |Adobe Acrobat
        if (navigator.plugins && navigator.plugins.length)
            for (var i = 0; i < navigator.plugins.length; i++) {
                var plugin = navigator.plugins[i].name;
                var version = "";
                if (plugin == 'Adobe Reader' || plugin == 'Adobe PDF' || plugin == 'Acrobat' || plugin == 'Adobe Acrobat') {
                    version = navigator.plugins['Adobe PDF Plug-in'] ? navigator.plugins['Adobe Acrobat'].version : navigator.plugins['Adobe Acrobat'].version;
                    if (version == undefined || version == "undefined") {
                        //console.log(BrowserDetect.init()+',PDF插件:' + plugin);
                    } else {
                        //console.log(BrowserDetect.init()+",Adobe Reader版本:"+version+',PDF插件:' + plugin);
                    }
                    return true;
                } else if (plugin == 'Chrome PDF Viewer' || plugin == 'Chromium PDF Viewer') {
                    //console.log(BrowserDetect.init()+",Adobe Reader版本:谷歌PDF插件暂不支持");
                }
            }
        return false;
    } else {
        //  ie浏览器
        var isInstalled = false;
        var version = null;
        var control = null;
        try {
            control = new ActiveXObject('AcroPDF.PDF');
        } catch (e) {
            //alert(e);
        }
        if (!control) {
            try {
                control = new ActiveXObject('PDF.PdfCtrl');
            } catch (e) {
                //alert(e);
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe Acrobat');
            } catch (e) {
                //alert(e);
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe PDF Plug-in');
            } catch (e) {
                //alert(e);
            }
        }
        if (control) {
            isInstalled = true;
            version = control.GetVersions().split(',');
            version = version[0].split('=');
            version = parseFloat(version[1]);
            return isInstalled;
        }
    }
}

function isIE() { // ie 支持到ie11
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

//操作系統和浏览器检测
var BrowserDetect = {

    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
        return "操作系統:" + this.OS + ",浏览器版本:" + this.browser + " " + this.version;
    },

    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },

    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1)
            return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },

    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],

    dataOS: [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]
};

//////////////////////////////////
function getPDFPlugin() {

    var plugin = null;
    var version = null;

    if (!isIE()) {
        // 非ie 浏览器 Adobe Reader | Adobe PDF | Acrobat | Chrome PDF Viewer |Adobe
        // Acrobat
        if (navigator.plugins && navigator.plugins.length)
            for (var i = 0; i < navigator.plugins.length; i++) {
                plugin = navigator.plugins[i].name;
                if (plugin == 'Adobe Reader' || plugin == 'Adobe PDF' || plugin == 'Acrobat' || plugin == 'Adobe Acrobat') {
                    version = navigator.plugins['Adobe PDF Plug-in'] ? navigator.plugins['Adobe Acrobat'].version : navigator.plugins['Adobe Acrobat'].version;
                    break;
                } else if (plugin == 'Chrome PDF Viewer' || plugin == 'Chromium PDF Viewer') {
                    // console.log(BrowserDetect.init()+",Adobe
                    // Reader版本:谷歌PDF插件暂不支持");
                    plugin = null
                }
            }
    } else {
        // ie浏览器
        var control = null;
        try {
            control = new ActiveXObject('AcroPDF.PDF');
            if (control != null) plugin = 'AcroPDF.PDF';
        } catch (e) {
        }
        if (!control) {
            try {
                control = new ActiveXObject('PDF.PdfCtrl');
                if (control != null) plugin = 'PDF.PdfCtrl';
            } catch (e) {
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe Acrobat');
                if (control != null) plugin = 'Adobe Acrobat';
            } catch (e) {
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe PDF Plug-in');
                if (control != null) plugin = 'Adobe PDF Plug-in';
            } catch (e) {
            }
        }
        if (control) {
            version = control.GetVersions().split(',');
            version = version[0].split('=');
            version = version[1];
        }
    }
    return {'plugin': plugin, 'version': parseFloat(version)};
}

function isIE() { // ie 支持到ie11
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}


function getPDFPlugin() {

    var plugin = null;
    var version = null;

    if (!isIE()) {
        // 非ie 浏览器 Adobe Reader | Adobe PDF | Acrobat | Chrome PDF Viewer |Adobe
        // Acrobat
        if (navigator.plugins && navigator.plugins.length)
            for (var i = 0; i < navigator.plugins.length; i++) {
                plugin = navigator.plugins[i].name;
                if (plugin == 'Adobe Reader' || plugin == 'Adobe PDF' || plugin == 'Acrobat' || plugin == 'Adobe Acrobat') {
                    //version = navigator.plugins['Adobe PDF Plug-in'] ? navigator.plugins['Adobe Acrobat'].version : navigator.plugins['Adobe Acrobat'].version;
                    if (navigator.plugins['Adobe Acrobat'] && navigator.plugins['Adobe Acrobat'].version) {
                        version = navigator.plugins['Adobe Acrobat'].version;

                    } else if (navigator.plugins['Adobe Acrobat'].description) {
                        //"Adobe PDF Plug-In For Firefox and Netscape 11.0.0"
                        version = navigator.plugins['Adobe Acrobat'].description.replace(/[^0-9.]/g, '');
                    }
                    break;
                } else if (plugin == 'Chrome PDF Viewer' || plugin == 'Chromium PDF Viewer') {
                    // console.log(BrowserDetect.init()+",Adobe
                    // Reader版本:谷歌PDF插件暂不支持");
                    plugin = null;
                } else {
                    plugin = null;
                }
            }
    } else {
        // ie浏览器
        var control = null;
        try {
            control = new ActiveXObject('AcroPDF.PDF');
            if (control != null) plugin = 'AcroPDF.PDF';
        } catch (e) {
        }
        if (!control) {
            try {
                control = new ActiveXObject('PDF.PdfCtrl');
                if (control != null) plugin = 'PDF.PdfCtrl';
            } catch (e) {
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe Acrobat');
                if (control != null) plugin = 'Adobe Acrobat';
            } catch (e) {
            }
        }
        if (!control) {
            try {
                control = new ActiveXObject('Adobe PDF Plug-in');
                if (control != null) plugin = 'Adobe PDF Plug-in';
            } catch (e) {
            }
        }
        if (control) {
            version = control.GetVersions().split(',');
            version = version[0].split('=');
            version = version[1];
        }
    }
    return {'plugin': plugin, 'version': parseFloat(version)};
}

// 获取浏览器版本信息
function getBrowserVer() {
    var userAgent = navigator.userAgent,
        rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
        rFirefox = /(firefox)\/([\w.]+)/,
        rOpera = /(opera).+version\/([\w.]+)/,
        rChrome = /(chrome)\/([\w.]+)/,
        rSafari = /version\/([\w.]+).*(safari)/;
    var browser;
    var version;
    var platform = null;
    var ua = userAgent.toLowerCase();

    function uaMatch(ua) {
        var match = rMsie.exec(ua);
        if (match != null) {
            return {browser: "IE", version: match[2] || "0"};
        }
        var match = rFirefox.exec(ua);
        if (match != null) {
            return {browser: match[1] || "", version: match[2] || "0"};
        }
        var match = rOpera.exec(ua);
        if (match != null) {
            return {browser: match[1] || "", version: match[2] || "0"};
        }
        var match = rChrome.exec(ua);
        if (match != null) {
            return {browser: match[1] || "", version: match[2] || "0"};
        }
        var match = rSafari.exec(ua);
        if (match != null) {
            return {browser: match[2] || "", version: match[1] || "0"};
        }
        if (match != null) {
            return {browser: "", version: "0"};
        }
    }

    var browserMatch = uaMatch(userAgent.toLowerCase());
    if (browserMatch.browser) {
        browser = browserMatch.browser;
        version = parseFloat(browserMatch.version);
    }
    if (browser === 'firefox' && navigator.platform === "Win32") {
        platform = '32';
    }

    return {'browser': browser, 'version': version, 'platform': platform};

}

// 获取操作系统
function getOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows") || (navigator.platform == "Win64");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
        if (isWin8) return "Win8";
        var isWin10 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10) return "Win10";
    }
    return "other";
}

// 检查pdf插件的方法
function checkPDFPlugin() {
    //添加makeType的类型判断，防止index.jsp忘记添加 makeType参数，而导致页面数据加载终止
    if (typeof(makeType) == 'string' && makeType == 'HTML') {
        return true;
    }
    var signType = '';
    if (typeof otherParams !== 'undefined' && typeof otherParams.signType !== 'undefined') {
        signType = otherParams.signType;
    }
    if (signType === '' && typeof parent.signType !== 'undefined') {
        signType = parent.signType;
    }
    if (signType === 'wzt' || signType === 'ocx') {//容器框签名
        return true;
    }
    var result = true;
    var broserVer = getBrowserVer();

    // 1、浏览器版本是否为Chrome40以下版本、 火狐浏览器52以下版本、IE8、IE9、IE10、IE11，360兼容模式
    if ((broserVer.browser === 'IE' && broserVer.version >= 7 && broserVer.version <= 11)
        || (broserVer.browser === 'firefox' && broserVer.platform === '32' && broserVer.version < 52)
        || (broserVer.browser === 'chrome' && broserVer.version < 40)) {

        // 检查Adobe Reader 10.0以上版本是否安装
        var adobe = getPDFPlugin();
        if ((adobe.plugin == 'Adobe Reader' || adobe.plugin == 'Adobe PDF' || adobe.plugin == 'Acrobat' || adobe.plugin == 'Adobe Acrobat') && adobe.version > 9
            || (adobe.plugin == 'AcroPDF.PDF' || adobe.plugin == 'PDF.PdfCtrl' || adobe.plugin == 'Adobe Acrobat' || adobe.plugin == 'Adobe PDF Plug-in') && adobe.version > 9) {

        } else {
            var result = false;
            var os = getOS();
            // 2、adobe版本为：adobe acrobat reader dc、adobe reader 11及以上 、adobe
            // reader xi、adobe reader x
            var url = null;
            if (os.toUpperCase() === 'WINXP') {
                url = "http://download.etaxcn.com/omni/package/adobereaderxi_11.0.0.379.exe?_ominact=110000&pname=adobereader";
            } else {
                url = "http://download.etaxcn.com/omni/package/AcroRdrDC1500720033_zh_CN.exe?_ominact=110000&pname=adobereader";
            }
            if (adobe.plugin == null) {
            	window.parent.layer.confirm('未检测到adobe插件！若已安装，请检查该插件是否被浏览器禁用；否则请重新下载安装如下版本：adobe acrobat reader dc， adobe reader 9及以上，adobe reader xi，adobe reader x，或直接点击下载进行安装。', {
                    title: '错误',
                    icon: 5,
                    btn: ['直接下载', '官网下载'],// 按钮
                    yes: function (index, layero) {
                        //按钮【按钮一】的回调
                        window.location.href = url;
                        window.parent.layer.msg('正在下载，请等待……', {
                            icon: 6,
                            time: 3000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        window.parent.layer.close(index);
                    },
                    btn2: function (index, layero) {
                        //按钮【按钮二】的回调
                        window.open('https://get.adobe.com/reader/');
                    },
                    cancel: function (index) {
                    	window.parent.layer.close(index);
                    }
                });
            } else {
            	window.parent.layer.confirm('您的adobe插件为：' + adobe.plugin + adobe.version + '，请重新安装以下版本：adobe acrobat reader dc， adobe reader 9及以上，adobe reader xi，adobe reader x，或直接点击下载进行安装。', {
                    title: '错误',
                    icon: 5,
                    btn: ['直接下载', '官网下载'], // 按钮
                    yes: function (index, layero) {
                        //按钮【按钮一】的回调
                        window.location.href = url;
                        window.parent.layer.msg('正在下载，请等待……', {
                            icon: 6,
                            time: 3000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        window.parent.layer.close(index);
                    },
                    btn2: function (index, layero) {
                        //按钮【按钮二】的回调
                        window.open('https://get.adobe.com/reader/');
                    },
                    cancel: function (index) {
                    	window.parent.layer.close(index);
                    }
                });
            }
        }

    } else {
        var msg = '';
        if (broserVer.browser === 'IE') {
            msg = '您使用的是IE' + broserVer.version + '浏览器。为了更好的支持pdf插件，请使用以下浏览器及对应版本：IE8、IE9、IE10、IE11，360浏览器兼容模式、Chrome40以下版本、32位Firefox 52以下版本。';
        } else {
            var browser = broserVer.browser;
            if (broserVer.browser === 'firefox') {
                browser = '64位' + browser;
            }
            msg = '您使用的是' + broserVer.version + '版本的' + browser + '浏览器。为了更好的支持pdf插件，请使用以下浏览器及对应版本：IE8、IE9、IE10、IE11，360浏览器兼容模式、Chrome40以下版本、32位Firefox 52以下版本。';
        }

        window.parent.layer.confirm(msg, {
            title: '错误',
            icon: 5,
            btn: ['确定'] // 按钮
        }, function (index) {
            window.parent.layer.close(index);
        });

        result = false;
    }
    return result;
}
