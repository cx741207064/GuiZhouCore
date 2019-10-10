using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    [ApiController]
    public class bizController : ControllerBase
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

        public bizController(IHostingEnvironment _he, IHttpContextAccessor _hca, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            hca = _hca;
            set = _set;
            service = _ser;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/enterSbqc")]
        public async Task<ActionResult> enterSbqc()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            await service.aqsb_getSbqcList(retJtok as JObject);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/enterQtsb")]
        public ActionResult enterQtsb()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.enterQtsb(retJtok as JObject);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/sbqxControl")]
        public ActionResult sbqxControl(string type, string yzpzzlDm)
        {
            param.Add(action);
            param.Add(type);
            if (yzpzzlDm != null)
            {
                param.Add(yzpzzlDm);
            }
            retJtok = set.GetJsonObject(param);
            cr = set.PlainResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/{submenu}/sburlControl")]
        public ActionResult sburlControl(string sbywbm)
        {
            param.Add(action);
            param.Add(sbywbm);
            retJtok = set.GetJsonObject(param);
            cr = set.PlainResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/cburlControl")]
        public ActionResult cburlControl(string sbywbm)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.PlainResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xInitData")]
        public async Task<ActionResult> xInitData(Ywbm dm)
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            await service.getInitData(dm, retJobj);
            cr = set.JsonResult(retJobj);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xFormula")]
        public ActionResult xFormula()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xSheets")]
        public async Task<ActionResult> xSheets(Ywbm dm)
        {
            param.Add(action);
            retJarr = set.GetJsonArray(param);
            await service.xSheets(dm, retJarr);
            cr = set.JsonResult(retJarr);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xTempSave")]
        public async Task<ActionResult> xTempSave(string dm, [FromForm]JObject formData)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            Ywbm bm = Enum.Parse<Ywbm>(dm);
            await service.SaveDataService(bm, formData);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/yqsb/yqsbqc/enterYqsbUrl")]
        public ActionResult enterYqsbUrl(string sbywbm)
        {
            param.Add(action);
            param.Add(sbywbm);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/cwbb/cwbb_main")]
        public ActionResult cwbb_main()
        {
            LocalRedirectResult lrr = LocalRedirect("/sbzs-cjpt-web/biz/setting/cwbbydy?gos=true&gdslxDm=1&skssqQ=2019-08-01&biz=null&kjzdzzDm=102&ywbm=CWBBYDY&isCwbabz=Y&tjNd=2019&sssqZ=2019-08-31&bbbsqDm=4&bzz=dzswj&skssqZ=2019-08-31&sssqQ=2019-08-01&zlbsxlDm=&tjYf=09&gsdq=152");
            return lrr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/refreshSbqc")]
        public async Task<ActionResult> refreshSbqc(string type)
        {
            param.Add(action);
            param.Add(type);
            retJtok = set.GetJsonObject(param);
            await service.aqsb_getSbqcList(retJtok as JObject, type);
            cr = set.PlainResult(retJtok);
            return cr;
        }

    }
}