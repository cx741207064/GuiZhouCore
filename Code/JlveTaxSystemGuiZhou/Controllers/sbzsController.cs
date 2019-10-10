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
    public class sbzsController : Controller
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

        string viewName { get; set; }

        public sbzsController(IHostingEnvironment _he, IHttpContextAccessor _hca, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            hca = _hca;
            set = _set;
            service = _ser;
        }

        [Route("sbzs-cjpt-web/biz/sbzs/{dm}")]
        public ActionResult sbzs(string dm)
        {
            param.Add(dm);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb")]
        public ActionResult sbqc_aqsb()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb")]
        public ActionResult sbqc_qtsb()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/{submenu}/setting")]
        public ActionResult sbqc(string submenu)
        {
            m = service.getModel(Ywbm.fjssb.ToString());
            viewName = submenu + "_setting";
            return View(viewName, m);
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/begin")]
        public ActionResult begin(string reset, string dm)
        {
            if (reset == "Y")
            {
                service.reset(dm);
            }
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbzf.do")]
        public ActionResult sbzf()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbzfmx.do")]
        public ActionResult sbzfmx(int pzxh)
        {
            m = service.getModel(pzxh);
            return View(m);
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/sbcx.do")]
        public ActionResult sbcx()
        {
            m = service.getModel(Ywbm.fjssb.ToString());
            return View(m);
        }

        [Route("sbzs-cjpt-web/cbxxcx/cbxxcx.do")]
        public ActionResult cbxxcx()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/setting/{dm}")]
        public ActionResult setting(string dm)
        {
            param.Add(dm);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/cwbb/cwbb_xqy_kjzz")]
        public ActionResult cwbb_xqy_kjzz()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/attachmentSb/getUploadList.do")]
        public ActionResult getUploadList()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/attachmentSb/getCwbbUploadList.do")]
        public ActionResult getCwbbUploadList()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbzs/{dm}/make")]
        public ActionResult make()
        {
            return View();
        }

        [Route("sbzs-cjpt-web/biz/sbzs/{dm}/well")]
        public ActionResult well(string dm)
        {
            m = service.getModel(dm);
            return View(m);
        }

        [Route("sbzs-cjpt-web/sb/gotoSbresult.do")]
        public ActionResult gotoSbresult(int ysqxxid)
        {
            service.UpdateSBZT(ysqxxid, SBZT.YSB);
            m = service.getModel(ysqxxid);
            m.msg = service.getSBCGMessage(ysqxxid);
            return View(m);
        }

    }
}