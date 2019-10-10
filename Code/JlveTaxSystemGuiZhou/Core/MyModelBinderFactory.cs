using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Core;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyModelBinderFactory : ModelBinderFactory
    {
        public MyModelBinderFactory(
            IModelMetadataProvider metadataProvider,
            IOptions<MvcOptions> options,
            IServiceProvider serviceProvider) : base(metadataProvider, options, serviceProvider)
        {
        }

    }

}
