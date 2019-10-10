using JlueTaxSystemBeiJing.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;

namespace JlueTaxSystemBeiJing.Code
{
    public class AuthenticationFilter : Controller
    {
        // 摘要: 
        //     对请求进行身份验证。
        //
        // 参数: 
        //   filterContext:
        //     用于身份验证的上下文。
        protected override void OnAuthentication(AuthenticationContext filterContext)
        {

        }

        //
        // 摘要: 
        //     向当前 System.Web.Mvc.ActionResult 添加身份验证质询。
        //
        // 参数: 
        //   filterContext:
        //     用于身份验证质询的上下文。
        protected override void OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
        {

        }

    }
}