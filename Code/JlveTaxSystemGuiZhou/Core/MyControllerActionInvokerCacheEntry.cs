using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.Extensions.Internal;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyControllerActionInvokerCacheEntry
    {
        internal MyControllerActionInvokerCacheEntry(
            FilterItem[] cachedFilters,
            Func<ControllerContext, object> controllerFactory,
            Action<ControllerContext, object> controllerReleaser,
            ControllerBinderDelegate controllerBinderDelegate,
            ObjectMethodExecutor objectMethodExecutor,
            ActionMethodExecutor actionMethodExecutor)
        {
            ControllerFactory = controllerFactory;
            ControllerReleaser = controllerReleaser;
            ControllerBinderDelegate = controllerBinderDelegate;
            CachedFilters = cachedFilters;
            ObjectMethodExecutor = objectMethodExecutor;
            ActionMethodExecutor = actionMethodExecutor;
        }

        public FilterItem[] CachedFilters { get; }

        public Func<ControllerContext, object> ControllerFactory { get; }

        public Action<ControllerContext, object> ControllerReleaser { get; }

        public ControllerBinderDelegate ControllerBinderDelegate { get; }

        internal ObjectMethodExecutor ObjectMethodExecutor { get; }

        internal ActionMethodExecutor ActionMethodExecutor { get; }
    }
}
