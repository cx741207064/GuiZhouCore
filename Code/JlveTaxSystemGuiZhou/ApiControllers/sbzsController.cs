using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    [ApiController]
    public class sbzsController : ControllerBase
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

        JsonResult jr { get; set; }

        List<string> param { get; } = new List<string>();

        Model m { get; set; }

        public sbzsController(IHostingEnvironment _he, IHttpContextAccessor _hca, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            hca = _hca;
            set = _set;
            service = _ser;
        }

        [Route("sbzs-cjpt-web/ywzt/getYsData.do")]
        public ActionResult getYsData()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            cr = set.JsonResult(retJtok);
            return cr;
        }

        [Route("sbzs-cjpt-web/cbxxcx/getCbxxcx.do")]
        public ActionResult getCbxxcx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/setting/mainSetting.do")]
        public async Task<ActionResult> mainSetting(Ywbm ywbm)
        {
            param.Add(action);
            param.Add(ywbm.ToString());
            retJtok = set.GetJsonValue(param);
            await service.mainSetting(ywbm, retJtok);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/setting/saveData.do")]
        public async Task<ActionResult> saveData(Ywbm ywbm, [FromBody]string requestBody)
        {
            JValue body = JsonConvert.DeserializeObject<JValue>(requestBody);
            JObject input = JObject.Parse(body.Value.ToString());
            param.Add(action);
            param.Add(ywbm.ToString());
            retJtok = set.GetJsonValue(param);
            await service.SaveDataService(ywbm, input);
            jr = set.ValueResult(retJtok);
            return jr;
        }

        [Route("sbzs-cjpt-web/jyxx/updateJyxx.do")]
        public ActionResult updateJyxx()
        {
            param.Add(action);
            retJval = set.GetJsonValue(param) as JValue;
            jr = set.ValueResult(retJval);
            return jr;
        }

        [Route("sbzs-cjpt-web/save/saveYsqbw.do")]
        public async Task<ActionResult> saveYsqbw([FromForm]string ywbm, JObject saveData)
        {
            Ywbm bm = Enum.Parse<Ywbm>(ywbm);
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            await service.SaveDataService(bm, saveData);
            cr = set.JsonResult(retJtok);
            return cr;
        }

    }
}