using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemBeiJing.Code
{
    public class ResultFilter : Controller
    {
        //
        // 摘要: 
        //     在操作结果执行之前调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
        }

        // 摘要: 
        //     在操作结果执行后调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
        }

    }
}