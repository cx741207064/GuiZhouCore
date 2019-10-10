/**
 * Created by C.Q on 2017-02-16.
 */
/**
 * 风险扫描信息初始化，支持2次探测，实现个性化需求。
 */
function FxsmInitData() {
    /**
     * Constant. 常量定义.
     */
	// 获取风险扫描结果
	FxsmInitData.prototype.QUERY_SDSNB_FXSMJG = pathRoot+"/fxsmjg/querySdsnbFxsmjg.do";
    FxsmInitData.prototype.idxVariable2NoPass = {}; // 单元格集合
    FxsmInitData.prototype.fxsmfbidlts = []; // 具有风险的fbid列表
    // Declare function
    /**
     * 获取风险扫描提醒信息 A by C.Q 20170213 
     */
    FxsmInitData.prototype.loadThirdIV2NoPass = function(){};

    /**
     * Event handler: clearFxtx on input UI. 清除风险提醒 A by C.Q 20170220
     */
    FxsmInitData.prototype.clearFxtx = function(){};
    FxsmInitData.prototype.autoShowFxjk = function(_obj){} 
}
