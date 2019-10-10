using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlveTaxSystemGuiZhou.Code
{
    /// <summary>
    /// 返回数据格式
    /// </summary>
    public class GTXResult
    {
        /// <summary>
        /// 调用是否成功
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// 返回提示信息
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// 调用代码
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 调用返回数据格式
        /// </summary>
        public object Data { get; set; }
    }
}