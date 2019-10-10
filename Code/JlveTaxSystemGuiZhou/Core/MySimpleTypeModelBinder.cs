using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MySimpleTypeModelBinder : IModelBinder
    {
        private readonly TypeConverter _typeConverter;

        public MySimpleTypeModelBinder(Type type) //: base(type, NullLoggerFactory.Instance)
        {
            _typeConverter = TypeDescriptor.GetConverter(type);
        }

        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);

            try
            {
                var value = valueProviderResult.FirstValue;

                object model;
                if (bindingContext.ModelType == typeof(string))
                {
                    // Already have a string. No further conversion required but handle ConvertEmptyStringToNull.
                    if (bindingContext.ModelMetadata.ConvertEmptyStringToNull && string.IsNullOrWhiteSpace(value))
                    {
                        model = null;
                    }
                    else
                    {
                        model = value;
                    }
                }
                else if (string.IsNullOrWhiteSpace(value))
                {
                    // Other than the StringConverter, converters Trim() the value then throw if the result is empty.
                    model = null;
                }
                else
                {
                    model = _typeConverter.ConvertFrom(
                        context: null,
                        culture: valueProviderResult.Culture,
                        value: value);
                }

                CheckModel(bindingContext, valueProviderResult, model);

                return Task.CompletedTask;
            }
            catch (Exception exception)
            {
                var isFormatException = exception is FormatException;
                if (!isFormatException && exception.InnerException != null)
                {
                    // TypeConverter throws System.Exception wrapping the FormatException,
                    // so we capture the inner exception.
                    exception = ExceptionDispatchInfo.Capture(exception.InnerException).SourceException;
                }

                bindingContext.ModelState.TryAddModelError(
                    bindingContext.ModelName,
                    exception,
                    bindingContext.ModelMetadata);

                // Were able to find a converter for the type but conversion failed.
                return Task.CompletedTask;
            }
        }

        protected virtual void CheckModel(ModelBindingContext bindingContext, ValueProviderResult valueProviderResult, object model)
        {
            // When converting newModel a null value may indicate a failed conversion for an otherwise required
            // model (can't set a ValueType to null). This detects if a null model value is acceptable given the
            // current bindingContext. If not, an error is logged.
            if (model == null && !bindingContext.ModelMetadata.IsReferenceOrNullableType)
            {
                bindingContext.ModelState.TryAddModelError(
                    bindingContext.ModelName,
                    bindingContext.ModelMetadata.ModelBindingMessageProvider.ValueMustNotBeNullAccessor(
                        valueProviderResult.ToString()));
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(model);
            }
        }

    }

}
