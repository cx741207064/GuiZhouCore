using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlveTaxSystemGuiZhou.Models
{
    public class Nsrxx
    {
        /// <summary>
        /// 纳税人识别号
        /// </summary>
        public string NSRSBH { get; set; }

        /// <summary>
        /// 纳税人名称
        /// </summary>
        public string NSRMC { get; set; }

        /// <summary>
        /// 登记注册类型
        /// </summary>
        public string DJZCLX { get; set; }

        /// <summary>
        /// 注册地址
        /// </summary>
        public string ZCDZ { get; set; }

        /// <summary>
        /// 生产经营地址
        /// </summary>
        public string SCJYDZ { get; set; }

        /// <summary>
        /// 联系电话
        /// </summary>
        public string LXDH { get; set; }

        /// <summary>
        /// 国标行业（名称）
        /// </summary>
        public string GBHY { get; set; }

        /// <summary>
        /// 主管地税税务局分局名称
        /// </summary>
        public string ZGDSSWJFJMC { get; set; }

        /// <summary>
        /// 法人姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 法人身份证号码
        /// </summary>
        public string IDCardNum { get; set; }

        /// <summary>
        /// 纳税人类型
        /// </summary>
        public int TaxPayerType { get; set; }

        /// <summary>
        /// 行业类型
        /// </summary>
        public int BusinessType { get; set; }

        /// <summary>
        /// 纳税人类型名称
        /// </summary>
        public string TaxPayerTypeName { get; set; }

        /// <summary>
        /// 行业类型名称
        /// </summary>
        public string BusinessTypeName { get; set; }

    }
}