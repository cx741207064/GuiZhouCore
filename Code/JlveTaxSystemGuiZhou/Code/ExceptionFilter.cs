using JlueTaxSystemBeiJing.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemBeiJing.Code
{
    public class ExceptionFilter : Controller
    {
        // 摘要: 
        //     在发生异常时调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        protected override void OnException(ExceptionContext filterContext)
        {
            string Accept = filterContext.HttpContext.Request.Headers["Accept"];
            Exception ex = filterContext.Exception;
            if (Regex.IsMatch(Accept, "json"))
            {
                filterContext.Result = Content(ex.Message, "application/json", Encoding.UTF8);
                filterContext.ExceptionHandled = true;
                filterContext.HttpContext.Response.StatusCode = 500;
            }
            else
            {
                ErrorModel em = new ErrorModel();
                em.title = "未知错误";
                em.message = ex.Message;
                em.stackTrace = ex.StackTrace;
                filterContext.Result = View("Error", em);
                filterContext.ExceptionHandled = true;
            }
        }

    }
}