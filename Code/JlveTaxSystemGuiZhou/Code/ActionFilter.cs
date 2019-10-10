using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Web;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JlveTaxSystemGuiZhou.Code
{
    public class ActionFilter: ActionFilterAttribute
    {
        //
        // 摘要: 
        //     在执行操作方法之前调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
        }

        // 摘要: 
        //     在执行操作方法后调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
        }
    }
}
