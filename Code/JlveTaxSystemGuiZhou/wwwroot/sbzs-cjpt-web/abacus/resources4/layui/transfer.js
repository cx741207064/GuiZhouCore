// 低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = {
        log: function () {
        }
    };
}

function _INIT_LAY() {
    if (typeof _INIT_LAY._inited === "undefined") {
        _INIT_LAY.prototype.init = function () {
            // 当jquery，loader， layui加载完了才执行layui的模块化加载
            if ('undefined' !== typeof $ && 'undefined' !== typeof loader
                && 'undefined' !== typeof layui) {
                layui.use(['layer', 'laydate', 'form'], function () {
                    if (!window.form) {
                        window.form = layui.form;
                    }
                    if (!window.layer) {
                        window.layer = layui.layer;
                    }
                    if (!window.laydate) {
                        window.laydate = layui.laydate;
                    }
                });
            } else {
                setTimeout('_initLay_.init()', 50);
            }
            _INIT_LAY._inited = true;
        };

        /*
         * Initialize
         */
        window.setTimeout('_initLay_.init()', 50);
    }
}

_initLay_ = new _INIT_LAY();

/**
 * form样式渲染
 */
function layformRender(){
    if(window.form){
        window.form.render();
    }else if(layui.form){
        layui.form.render();
    }else{
        layui.use('form', function (form) {
            form.render();
            window.form=layui.form;
        });
    }
}