﻿// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyActionInvokerFactory : IActionInvokerFactory
    {
        private readonly IActionInvokerProvider[] _actionInvokerProviders;

        public MyActionInvokerFactory(IEnumerable<IActionInvokerProvider> actionInvokerProviders)
        {
            _actionInvokerProviders = actionInvokerProviders.OrderBy(item => item.Order).ToArray();
        }

        public IActionInvoker CreateInvoker(ActionContext actionContext)
        {
            var context = new ActionInvokerProviderContext(actionContext);

            foreach (var provider in _actionInvokerProviders)
            {
                provider.OnProvidersExecuting(context);
            }

            for (var i = _actionInvokerProviders.Length - 1; i >= 0; i--)
            {
                _actionInvokerProviders[i].OnProvidersExecuted(context);
            }

            return context.Result;
        }
    }
}
