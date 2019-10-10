using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;
using System.Text;
using System.Web;
using System.Reflection;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using JlveTaxSystemGuiZhou.Models;

namespace JlveTaxSystemGuiZhou.Code
{
    public class YsbqcSetting
    {
        public YsbqcSetting(IHostingEnvironment _he, IHttpContextAccessor _hca)
        {
            he = _he;
            hca = _hca;
        }

        IHostingEnvironment he { get; }

        IHttpContextAccessor hca { get; }

        HttpRequest request { get { return hca.HttpContext.Request; } }

        ISession session { get { return hca.HttpContext.Session; } }

        string fileName { get; set; }

        string reqPath { get { return he.WebRootPath + request.Path; } }

        DirectoryInfo Dir { get; set; }

        string JsonStr { get; set; }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        string str { get; set; }

        ContentResult cr { get; set; }

        XmlDocument xd { get; set; }

        public const string functionNotOpen = "FunctionNotOpen";

        public JObject GetJsonObject(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJobj = JsonConvert.DeserializeObject<JObject>(JsonStr);
                return retJobj;
            }
        }

        public JArray GetJsonArray(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJarr = JsonConvert.DeserializeObject<JArray>(JsonStr);
                return retJarr;
            }
        }

        public JToken GetJsonValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                string val = JsonConvert.DeserializeObject<JValue>(JsonStr).Value<string>();
                bool bl = Regex.IsMatch(val, @"\A[\[\{]");
                if (!bl)
                {
                    if (Regex.IsMatch(val, "\\A\""))
                    {
                        retJtok = JsonConvert.DeserializeObject<JValue>(val);
                    }
                    else
                    {
                        retJtok = new JValue(val);
                    }
                }
                else
                {
                    retJtok = JsonConvert.DeserializeObject<JToken>(val);
                    //retJval = new JValue(JsonConvert.SerializeObject(retJtok));
                }
                return retJtok;
            }
        }

        public string GetString(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    if (!string.IsNullOrEmpty(p))
                    {
                        fileName += p + ".";
                    }
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retStr = JsonStr;
                return retStr;
            }
        }

        public ContentResult GetHtml(List<string> param, string fileExtension = "html")
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += fileExtension;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                cr = new ContentResult() { Content = JsonStr, ContentType = "text/html;charset=utf-8" };
                //cr = Content(JsonStr, "text/html", Encoding.UTF8);
                return cr;
            }
        }

        public JValue GetXmlValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "xml";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                xd = new XmlDocument();
                xd.LoadXml(JsonConvert.DeserializeObject<JValue>(JsonStr).Value.ToString());
                retJval = new JValue(xd.InnerXml);
                return retJval;
            }
        }

        public SessionModel getSession()
        {
            if (session == null)
            {
                //return null;
                throw new Exception("session为空");
            }
            SessionModel sm = new SessionModel();
            foreach (PropertyInfo pi in sm.GetType().GetProperties())
            {
                pi.SetValue(sm, session.GetString(pi.Name));
            }
            return sm;
        }

        public void insertSession(JObject jo)
        {
            session.SetString("questionId", jo["questionId"].ToString());
            session.SetString("userquestionId", jo["userquestionId"].ToString());
            session.SetString("companyId", jo["companyId"].ToString());
            session.SetString("classId", jo["classId"].ToString());
            session.SetString("courseId", jo["courseId"].ToString());
            session.SetString("userId", jo["userId"].ToString());
            session.SetString("Name", jo["Name"].ToString());
        }

        public JValue JTokenToJValue(JToken jt)
        {
            Type type = jt.GetType();
            if (type == typeof(JObject) || type == typeof(JArray))
            {
                return new JValue(JsonConvert.SerializeObject(jt));
            }
            else
            {
                return new JValue(jt.Value<string>());
            }
        }

        public string JsonToString(JToken jt)
        {
            return JsonConvert.SerializeObject(jt, Formatting.None);
        }

        public ContentResult JsonResult(object obj)
        {
            str = JsonConvert.SerializeObject(obj);
            cr = new ContentResult() { Content = str, ContentType = "application/json;charset=utf-8" };
            return cr;
        }

        public ContentResult PlainResult(JToken obj)
        {
            str = JsonConvert.SerializeObject(obj);
            cr = new ContentResult() { Content = str, ContentType = "text/plain;charset=utf-8" };
            return cr;
        }

        public ContentResult PlainResult(string str)
        {
            cr = new ContentResult() { Content = str, ContentType = "text/plain;charset=utf-8" };
            return cr;
        }

        public JsonResult ValueResult(JToken obj)
        {
            str = JsonConvert.SerializeObject(obj);
            JsonResult jr = new JsonResult(str) { ContentType = "application/json;charset=utf-8" };
            return jr;
        }

        public JsonResult ValueResult(JValue obj)
        {
            JsonResult jr = new JsonResult(obj) { ContentType = "application/json;charset=utf-8" };
            return jr;
        }

        public JsonResult XmlValueResult(JValue obj)
        {
            JsonResult jr = new JsonResult(obj.Value) { ContentType = "application/json;charset=utf-8" };
            return jr;
        }

    }
}