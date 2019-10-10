using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace JlveTaxSystemGuiZhou.Core
{
    public class MyJsonModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);

            var value = valueProviderResult.FirstValue;
            if (Regex.IsMatch(value, @"\A%"))
            {
                value = HttpUtility.UrlDecode(value);
            }

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
                model = JsonConvert.DeserializeObject<JToken>(value);
            }

            CheckModel(bindingContext, valueProviderResult, model);
            return Task.CompletedTask;
        }

        protected void CheckModel(ModelBindingContext bindingContext, ValueProviderResult valueProviderResult, object model)
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
