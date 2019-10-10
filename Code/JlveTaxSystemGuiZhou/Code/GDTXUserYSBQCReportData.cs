using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;

namespace JlveTaxSystemGuiZhou.Code
{
    /// <summary>
    /// 山东省国税的学员填写的报表数据
    /// </summary>
    public partial class GDTXUserYSBQCReportData
    {

        /// <summary>
        /// 主键
        /// </summary>
        public Int32 Id { get; set; }

        /// <summary>
        /// 报表编号
        /// </summary>
        public String ReportCode { get; set; }

        /// <summary>
        /// 学员Id
        /// </summary>
        public String UserId { get; set; }

        /// <summary>
        /// 用户英申报清册id
        /// </summary>
        public Int32 UserYSBQCId { get; set; }

        /// <summary>
        /// 报表数据key
        /// </summary>
        public String DataKey { get; set; }

        /// <summary>
        /// 报表数据值
        /// </summary>
        public String DataValue { get; set; }

    }
}
