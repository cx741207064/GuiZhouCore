using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class tycxController : Controller
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

        public tycxController(IHostingEnvironment _he, IHttpContextAccessor _hca, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            hca = _hca;
            set = _set;
            service = _ser;
        }

        [Route("tycx-cjpt-web/cxpt/4thLvlFunTabsInit.do")]
        public ActionResult _4thLvlFunTabsInit()
        {
            param.Add("4thLvlFunTabsInit");
            cr = set.GetHtml(param);
            return cr;
        }
    }
}