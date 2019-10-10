using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyControllerActionInvokerProvider : ControllerActionInvokerProvider
    {
        public MyControllerActionInvokerProvider(
            ControllerActionInvokerCache controllerActionInvokerCache,
            IOptions<MvcOptions> optionsAccessor,
            ILoggerFactory loggerFactory,
            DiagnosticSource diagnosticSource,
            IActionResultTypeMapper mapper) : base(controllerActionInvokerCache, optionsAccessor, loggerFactory, diagnosticSource, mapper)
        {
        }

    }

}
