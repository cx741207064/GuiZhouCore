using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JlveTaxSystemGuiZhou.Models;
using JlveTaxSystemGuiZhou.Code;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return RedirectToAction("QuestionMain");
        }

        [Route("QuestionMain.aspx")]
        public ActionResult QuestionMain(string userid, string classid, string sortid)
        {
            string content = "";
            if (string.IsNullOrEmpty(userid))
            {
                content += "userid" + "不能为空，";
            }
            if (string.IsNullOrEmpty(classid))
            {
                content += "classid" + "不能为空，";
            }
            if (string.IsNullOrEmpty(sortid))
            {
                content += "sortid" + "不能为空";
            }
            if (content != "")
            {
                ErrorModel m = new ErrorModel { title = "参数错误", message = content };
                return View("Error", m);
            }
            return View();
        }

        [Route("functionNotOpen")]
        public ActionResult functionNotOpen()
        {
            return View(YsbqcSetting.functionNotOpen);
        }

    }
}
