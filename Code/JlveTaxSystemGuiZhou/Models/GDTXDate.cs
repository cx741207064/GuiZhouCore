using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlveTaxSystemGuiZhou.Models
{
    public class GDTXDate
    {
        /// <summary>
        /// 申报日期起
        /// </summary>
        public string sbrqq { get; set; }

        /// <summary>
        /// 申报日期止
        /// </summary>
        public string sbrqz { get; set; }

        /// <summary>
        /// 申报年代
        /// </summary>
        public string sbNd { get; set; }

        /// <summary>
        /// 申报月份
        /// </summary>
        public string sbYf { get; set; }

        /// <summary>
        /// 税款所属期
        /// </summary>
        public string skssq { get; set; }

        /// <summary>
        /// 税款所属期起
        /// </summary>
        public string skssqq { get; set; }

        /// <summary>
        /// 税款所属期止
        /// </summary>
        public string skssqz { get; set; }

        public string skssNd { get; set; }

        public string skssYf { get; set; }

        /// <summary>
        /// 填表日期
        /// </summary>
        public string tbrq { get; set; }

    }
}