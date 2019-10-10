/// <reference path="D:\实训2017114\source\JlueMakeBill\JlueTaxSystemHeBeiBS\BillApi/BankQuestion.asmx" />
/// <reference path="D:\实训2017114\source\JlueMakeBill\JlueTaxSystemHeBeiBS\BillApi/BankQuestion.asmx" />
/// <reference path="D:\实训2017114\source\JlueMakeBill\JlueTaxSystemHeBeiBS\BillApi/Question.asmx" />
//企业名册：               苏州精略包装有限公司
//税号：                   536259796436818
//法定代表人：             陈永圣

//开户行(基本户)：         中国建行苏州干将路支行
//基本户行号：             105453097001
//建设银行账号：           5159889499456339
//客户识别号：             SZ32200008178928801

//财务部人员如下
//出纳姓名：刘洋
//出纳操作码：787878
//财务经理：李玉莲
//总经理：陈永圣

//获取目录文件所在的根目录
function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host + '/' + webName + '/';
}
//获取国税题
var GetTaxList = "/GTX/GTXUserQuestion/GetList";
//获取单题状态
var GetTaxStatus = "/GTX/GTXUserQuestion/GetStatus";
//清空记录
var CleanTaxRecord = "/acc/accuseranswer/DellACCUserAnswer";
//获取单条国地税题
var GetUserQuestion = "/GTX/GTXUserQuestion/GetEnterCallBack";
//获取涉税查询数据
var GetSSCXList = "/GTXSSCX/GetList";
//重新做题
var chongzu = "/GTX/GTXUserQuestion/RedoAllQuestions";



