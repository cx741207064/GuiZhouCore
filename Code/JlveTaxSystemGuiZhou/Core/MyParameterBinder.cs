using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyParameterBinder : ParameterBinder
    {
        public MyParameterBinder(IModelMetadataProvider modelMetadataProvider, IModelBinderFactory modelBinderFactory, IObjectModelValidator validator, IOptions<MvcOptions> mvcOptions, ILoggerFactory loggerFactory) : base(modelMetadataProvider, modelBinderFactory, validator, mvcOptions, loggerFactory)
        {
        }

        public override Task<ModelBindingResult> BindModelAsync(ActionContext actionContext, IModelBinder modelBinder, IValueProvider valueProvider, ParameterDescriptor parameter, ModelMetadata metadata, object value)
        {
            if (parameter.BindingInfo?.RequestPredicate?.Invoke(actionContext) == false)
            {
                //SetBindingSource(valueProvider, BindingSource.Form, ref parameter);
                //SetBindingSource(valueProvider, BindingSource.Body, ref parameter);
            }
            parameter.BindingInfo = null;

            return base.BindModelAsync(actionContext, modelBinder, valueProvider, parameter, metadata, value);
        }

        void SetBindingSource(IValueProvider valueProvider, BindingSource bindingSource, ref ParameterDescriptor parameter)
        {
            var compositeValueProvider = valueProvider as CompositeValueProvider;
            var Form = compositeValueProvider.Filter(bindingSource);
            var b = Form?.ContainsPrefix(parameter.Name) ?? false;
            if (b)
            {
                parameter.BindingInfo.BindingSource = bindingSource;
            }
        }

    }
}
