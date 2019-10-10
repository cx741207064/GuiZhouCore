using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Internal;
using Microsoft.Extensions.Options;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyControllerActionInvokerCache : ControllerActionInvokerCache
    {
        public MyControllerActionInvokerCache(
            IActionDescriptorCollectionProvider collectionProvider,
            ParameterBinder parameterBinder,
            IModelBinderFactory modelBinderFactory,
            IModelMetadataProvider modelMetadataProvider,
            IEnumerable<IFilterProvider> filterProviders,
            IControllerFactoryProvider factoryProvider,
            IOptions<MvcOptions> mvcOptions) : base(collectionProvider, parameterBinder, modelBinderFactory, modelMetadataProvider, filterProviders, factoryProvider, mvcOptions)
        {
        }

    }
}
