using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class xxmhController : Controller
    {
        YsbqcSetting set { get; }

        Service service { get; }

        IHostingEnvironment he { get; }

        IHttpContextAccessor hca { get; }

        HttpRequest req => hca.HttpContext.Request;

        string action { get { return RouteData.Values["action"].ToString(); } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        List<string> param { get; } = new List<string>();

        Model m { get; set; }

        public xxmhController(IHostingEnvironment _he, IHttpContextAccessor _hca, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            hca = _hca;
            set = _set;
            service = _ser;
        }

        [Route("xxmh/html/index_login.html")]
        public ActionResult index_login()
        {
            return View();
        }

        [Route("xxmh/html/qhsf.html")]
        public ActionResult qhsf()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("xxmh/html/index_origin.html")]
        public ActionResult index_origin(string m2)
        {
            if ((m2 ?? "") != "sbzscx")
            {
                m2 = "";
            }
            string Value = Request.QueryString.Value;
            Value = Regex.Replace(Value, @"m1=(\w+)", "m1=$1");
            Value = Regex.Replace(Value, @"m2=(\w+)", "m2=" + m2);
            string Path = Request.Path + Value;
            if (Value != Request.QueryString.Value)
            {
                return new RedirectResult(Path);
            }
            return View();
        }

    }
}