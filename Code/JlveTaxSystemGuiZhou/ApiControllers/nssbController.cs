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
    public class nssbController : ControllerBase
    {
        YsbqcSetting set { get; }

        Service service { get; }

        IHostingEnvironment he { get; }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        JsonResult jr { get; set; }

        Model m { get; set; }

        List<string> param { get; } = new List<string>();

        public nssbController(IHostingEnvironment _he, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            set = _set;
            service = _ser;
        }

        [Route("sbzs-cjpt-web/nssb/jscwbbSbqx.do")]
        public ActionResult jscwbbSbqx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getSsqz.do")]
        public ActionResult getSsqz()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getSsqz(retJtok as JObject);
            cr = set.PlainResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getsbzf.do")]
        public ActionResult getsbzf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            service.getsbzf(retJtok);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getsbzfmx.do")]
        public ActionResult getsbzfmx(int pzxh)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getsbzfmx(pzxh, retJtok as JObject);
            cr = set.PlainResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbZfSubmit.do")]
        public ActionResult sbZfSubmit(JObject reqParamsJSON)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            //JObject reqParamsJSON = JObject.Parse(Request.Form["reqParamsJSON"]);
            string pzxh = reqParamsJSON["pzxh"].ToString();
            service.sbZfSubmit(int.Parse(pzxh));
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/getsbxx.do")]
        public ActionResult getsbxx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            service.getSbxxcx(retJtok as JObject);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/printPdf.do")]
        public ActionResult printPdf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/getOtherData.do")]
        public ActionResult getOtherData()
        {
            param.Add(action);
            retJval = set.GetXmlValue(param);
            jr = set.XmlValueResult(retJval);
            return jr;
        }

        [Route("sbzs-cjpt-web/nssb/zzsybnsr/sffx/getData.do")]
        public ActionResult getData()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getSbqx.do")]
        public ActionResult getSbqx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.PlainResult(retJtok);
            return cr;
        }

    }
}