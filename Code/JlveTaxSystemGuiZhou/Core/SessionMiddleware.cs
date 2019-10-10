using JlveTaxSystemGuiZhou.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public class SessionMiddleware
    {
        private readonly RequestDelegate _next;

        private YsbqcSetting set { get; set; }

        IHostingEnvironment he { get; }

        public SessionMiddleware(RequestDelegate next, YsbqcSetting _set, IHostingEnvironment _he)
        {
            _next = next;
            set = _set;
            he = _he;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string Path = context.Request.Path;
            if (Regex.IsMatch(Path, "index_login"))
            {
                create(context.Request);
            }
            await _next(context);
        }

        protected void create(HttpRequest Request)
        {
            string questionId = Request.Query["questionId"];
            string userquestionId = Request.Query["userquestionId"];
            string companyId = Request.Query["companyId"];
            string classId = Request.Query["classid"];
            string courseId = Request.Query["courseid"];
            string userId = Request.Query["userid"];
            string Name = Request.Query["Name"];

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

                set.insertSession(jo);

                string split = "/";
                string logPath = he.ContentRootPath + split + "Log";
                DirectoryInfo[] DIs = Directory.CreateDirectory(logPath).GetDirectories();
                foreach (DirectoryInfo DI in DIs)
                {
                    if (DI.LastWriteTime.Date != DateTime.Now.Date)
                    {
                        DI.Delete(true);
                    }
                }

                string path = he.ContentRootPath + split + "Log" + split + set.getSession().userId;
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                string fileFullPath = path + split + "Session.json";
                StringBuilder str = new StringBuilder();
                str.Append(JsonConvert.SerializeObject(jo));
                StreamWriter sw = System.IO.File.CreateText(fileFullPath);
                sw.WriteLine(str.ToString());
                sw.Close();
            }
        }

        protected void insert()
        {
        }

    }
}
