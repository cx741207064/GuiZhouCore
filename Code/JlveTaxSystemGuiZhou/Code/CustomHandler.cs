using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace JlueTaxSystemBeiJing.Code
{
    public class CustomHandler : IHttpHandler, IRequiresSessionState
    {
        // 摘要: 
        //     由自定义 HTTP Web 请求的允许处理 HttpHandler 实现 System.Web.IHttpHandler 接口。
        //
        // 参数: 
        //   context:
        //     System.Web.HttpContext 提供对内部服务器对象的引用的对象 (例如， Request, ，Response, ，Session,
        //     ，和 Server) 用于处理 HTTP 请求。
        public void ProcessRequest(HttpContext context)
        {
            HttpRequest Request = context.Request;
            string questionId = Request.QueryString["questionId"];
            string userquestionId = Request.QueryString["userquestionId"];
            string companyId = Request.QueryString["companyId"];
            string classId = Request.QueryString["classid"];
            string courseId = Request.QueryString["courseid"];
            string userId = Request.QueryString["userid"];
            string Name = Request.QueryString["Name"];

            if (!string.IsNullOrEmpty(questionId))
            {
                JObject jo = new JObject();
                jo["questionId"] = questionId;
                jo["userquestionId"] = userquestionId;
                jo["companyId"] = companyId;
                jo["classId"] = classId;
                jo["courseId"] = courseId;
                jo["userId"] = userId;
                jo["Name"] = Name;

                YsbqcSetting.insertSession(jo);

                string split = "/";
                string path = AppDomain.CurrentDomain.BaseDirectory + split + "Log" + split + YsbqcSetting.getSession().userId;
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                string fileFullPath = path + split + "Session.json";
                StringBuilder str = new StringBuilder();
                str.Append(JsonConvert.SerializeObject(jo));
                StreamWriter sw = System.IO.File.CreateText(fileFullPath);
                sw.WriteLine(str.ToString());
                sw.Close();

                string logPath = AppDomain.CurrentDomain.BaseDirectory + split + "Log";
                DirectoryInfo[] DIs = Directory.CreateDirectory(logPath).GetDirectories();
                foreach (DirectoryInfo DI in DIs)
                {
                    if (DI.LastAccessTime.Date != DateTime.Now.Date)
                    {
                        DI.Delete(true);
                    }
                }
            }

            string JsonStr = System.IO.File.ReadAllText(context.Server.MapPath("index_login.html"));
            context.Response.ContentType = "text/html;charset=utf-8";
            context.Response.Write(JsonStr);
        }

        // 摘要: 
        //     获取一个值，该值指示是否可以使用另一个请求 System.Web.IHttpHandler 实例。
        //
        // 返回结果: 
        //     true 如果 System.Web.IHttpHandler 实例是可重复使用; 否则为 false。
        public bool IsReusable { get { return false; } }

    }
}