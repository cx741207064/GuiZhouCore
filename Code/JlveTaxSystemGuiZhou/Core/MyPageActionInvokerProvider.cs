// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.AspNetCore.Mvc.RazorPages.Internal;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.AspNetCore.Razor.Language;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyPageActionInvokerProvider : PageActionInvokerProvider
    {
        public MyPageActionInvokerProvider(
            IPageLoader loader,
            IPageFactoryProvider pageFactoryProvider,
            IPageModelFactoryProvider modelFactoryProvider,
            IRazorPageFactoryProvider razorPageFactoryProvider,
            IActionDescriptorCollectionProvider collectionProvider,
            IEnumerable<IFilterProvider> filterProviders,
            ParameterBinder parameterBinder,
            IModelMetadataProvider modelMetadataProvider,
            IModelBinderFactory modelBinderFactory,
            ITempDataDictionaryFactory tempDataFactory,
            IOptions<MvcOptions> mvcOptions,
            IOptions<HtmlHelperOptions> htmlHelperOptions,
            IPageHandlerMethodSelector selector,
            RazorProjectFileSystem razorFileSystem,
            DiagnosticSource diagnosticSource,
            ILoggerFactory loggerFactory,
            IActionResultTypeMapper mapper) : base(loader, pageFactoryProvider, modelFactoryProvider, razorPageFactoryProvider, collectionProvider, filterProviders, parameterBinder, modelMetadataProvider, modelBinderFactory, tempDataFactory, mvcOptions, htmlHelperOptions, selector, razorFileSystem, diagnosticSource, loggerFactory, mapper)
        {
        }

    }
}
