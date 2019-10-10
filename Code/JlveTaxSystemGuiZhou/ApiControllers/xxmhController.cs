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

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    [ApiController]
    public class xxmhController : ControllerBase
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

        [Route("xxmh/viewsControlController/getShowGdsbz.do")]
        public ActionResult getShowGdsbz()
        {
            param.Add(action);
            retStr = set.GetString(param);
            cr = set.PlainResult(retStr);
            return cr;
        }

        [Route("xxmh/viewsControlController/getGolobalTitle.do")]
        public ActionResult getGolobalTitle()
        {
            param.Add(action);
            retStr = set.GetString(param);
            cr = set.PlainResult(retStr);
            return cr;
        }

        [Route("xxmh/portalSer/checkLogin.do")]
        public ActionResult checkLogin()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/txss/txfdsas.do")]
        public ActionResult txfdsas()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/sycdController/getCd.do")]
        public ActionResult getCd()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.formatCd(retJobj);
            cr = set.JsonResult(retJobj);
            return cr;
        }

        [Route("xxmh/portalSer/getRootMenu.do")]
        public ActionResult getRootMenu()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.setHeadNsrxx(retJobj);
            cr = set.PlainResult(retJobj);
            return cr;
        }

        [Route("xxmh/portalSer/getSubMenus.do")]
        public ActionResult getSubMenus(string m1)
        {
            param.Add(action);
            retJobj = service.getSubMenus(param, m1);
            cr = set.PlainResult(retJobj);
            return cr;
        }

        [Route("xxmh/mlogController/addLog.do")]
        public ActionResult addLog()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/myCenterController/getDbsx.do")]
        public ActionResult getDbsx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getDbsx(retJtok);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/myCenterController/getSstx.do")]
        public ActionResult getSstx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/myCenterController/syTzgg.do")]
        public ActionResult syTzgg()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/cygnController/getCygncdDetail.do")]
        public ActionResult getCygncdDetail()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("xxmh/myCenterController/updateDbsxZt.do")]
        public ActionResult updateDbsxZt()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

    }
}