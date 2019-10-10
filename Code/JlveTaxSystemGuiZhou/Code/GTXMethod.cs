using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;
using System.Configuration;
using Microsoft.Extensions.Configuration;

namespace JlveTaxSystemGuiZhou.Code
{
    public class GTXMethod
    {
        public static IConfiguration config { get; set; }

        public static YsbqcSetting set { get; set; }

        public static SessionModel sm { get { return set.getSession(); } }

        static string PracticePath { get { return config.GetSection("AppSettings")["Practicepath"]; } }

        static string TikuPath { get { return config.GetSection("AppSettings")["tikupath"]; } }

        /// <summary>
        /// 获取企业联系人
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetCompanyPerson()
        {
            string companyId = sm.companyId;
            string path = PracticePath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/CompanyPerson.asmx/GetByCompanyId?CompanyId=" + companyId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取企业信息表记录
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetCompany()
        {
            string companyId = sm.companyId;
            string path = PracticePath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/Company.asmx/GetByCompanyId?CompanyId=" + companyId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        public static GTXResult GetCompanyDetail()
        {
            string companyId = sm.companyId;
            string path = PracticePath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/Company.asmx/GetDetailByCompanyId?CompanyId=" + companyId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取学员题目信息
        /// </summary>
        /// <param name="id">用户题目id</param>
        /// <returns></returns>
        public static GTXResult GetUserQuestion(string id)
        {
            string userid = sm.userId;
            string classid = sm.classId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GTXUserQuestion/GetEnter?userid=" + userid + "&questionid=" + id + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }


        /// <summary>
        /// 获取国地税应申报清册记录
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetUserYSBQC()
        {
            string userid = sm.userId;
            string questionId = sm.questionId;
            string classid = sm.classId;

            string path = TikuPath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/GetList?userid=" + userid + "&questionId=" + questionId + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 国地税通用的保存报表数据
        /// </summary>
        /// <param name="jsonReportData">报表中的name value</param>
        /// <returns></returns>
        public static GTXResult SaveUserReportData(string jsonReportData, string userYsbqcId, string reportCode)
        {
            string classid = sm.classId;
            string userId = sm.userId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Add", string.Format("classid={0}&jsonReportData={1}&userYsbqcId={2}&reportCode={3}&userId={4}"
                , classid, jsonReportData, userYsbqcId, reportCode, userId));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取厦门国税通用的已保存的报表数据
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetUserReportData(string userYsbqcId, string reportCode)
        {
            string classid = sm.classId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Get", string.Format("classid={0}&userYsbqcId={1}&reportCode={2}"
                , classid, userYsbqcId, reportCode));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 更新应申报清册的状态,已申报
        /// </summary>
        public static GTXResult UpdateYSBQC(string userYSBQCId, string SBZT)
        {
            string classid = sm.classId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/UpdateSBZT?Id=" + userYSBQCId + "&classid=" + classid + "&SBZT=" + SBZT;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }


        /// <summary>
        /// 更新英申报清册的申报税额
        /// </summary>
        public static GTXResult UpdateSBSE(string userYSBQCId, string SBSE)
        {
            string classid = sm.classId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/UpdateSBSE?Id=" + userYSBQCId + "&classid=" + classid + "&SBSE=" + SBSE;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 更新英申报清册的填报情况
        /// </summary>
        public static GTXResult UpdateYSBQCtbzt(string userYSBQCId, string reportCode, string tbzt)
        {
            string nowtbzt = (tbzt + reportCode + ";");
            if (reportCode == "")
            {
                nowtbzt = tbzt;
            }
            string classid = sm.classId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/Updatetbzt?Id=" + userYSBQCId + "&classid=" + classid + "&tbzt=" + nowtbzt;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 删除用户报表数据
        /// </summary>
        /// <returns></returns>
        public static GTXResult DeleteUserReportData(string userYsbqcId, string reportCode)
        {
            string classid = sm.classId;
            string userId = sm.userId;
            string path = TikuPath;
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Delete", string.Format("classid={0}&userYsbqcId={1}&userId={2}&reportCode={3}"
                , classid, userYsbqcId, userId, reportCode));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

    }
}