using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;

namespace JlveTaxSystemGuiZhou.Code
{
    /// <summary>
    /// 学员英申报清册信息
    /// </summary>
    public class GDTXUserYSBQC
    {

        /// <summary>
        /// 主键
        /// </summary>
        public Int32 Id { get; set; }

        /// <summary>
        /// 学员id
        /// </summary>
        public String UserId { get; set; }

        /// <summary>
        /// 企业id
        /// </summary>
        public Int32 CompanyId { get; set; }

        /// <summary>
        /// 共享的应申报清册id
        /// </summary>
        public string YSBQCId { get; set; }

        /// <summary>
        /// 题目id
        /// </summary>
        public Int32 QuestionId { get; set; }

        /// <summary>
        /// 用户题目id
        /// </summary>
        public Int32 UserQuestionId { get; set; }

        /// <summary>
        /// 任务名称
        /// </summary>
        public String TaskName { get; set; }

        /// <summary>
        /// 征收项目名称
        /// </summary>
        public String ZSXM { get; set; }

        public String Url { get; set; }

        /// <summary>
        /// BDDM
        /// </summary>
        public String BDDM { get; set; }

        /// <summary>
        /// 发生日期
        /// </summary>
        public String HappenDate { get; set; }

        /// <summary>
        /// 申报状态
        /// </summary>
        public String SBZT { get; set; }

        /// <summary>
        /// 申报税额
        /// </summary>
        public String SBSE { get; set; }

        /// <summary>
        /// 税款所属期起
        /// </summary>
        public String SKSSQQ { get; set; }

        /// <summary>
        /// 税款所属期止
        /// </summary>
        public String SKSSQZ { get; set; }

        /// <summary>
        /// 申报期限
        /// </summary>
        public String SBQX { get; set; }

        /// TBQK
        /// </summary>
        public String TBQK { get; set; }

        /// <summary>
        /// 征收项目代码
        /// </summary>
        public string zsxmDm { get; set; }

        public string ywbm { get { return BDDM; } }

        public string yzpzzlDm { get; set; }

        public string sbblxDm { get; set; }

    }
}
