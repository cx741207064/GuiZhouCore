using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public class BodyValueProviderFactory : IValueProviderFactory
    {
        public Task CreateValueProviderAsync(ValueProviderFactoryContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var request = context.ActionContext.HttpContext.Request;
            StreamReader sr = new StreamReader(request.Body);
            string str = sr.ReadToEnd();
            if (!string.IsNullOrEmpty(str))
            {
                // Allocating a Task only when the body is form data.
                return Task.Run(() =>
                {
                    AddValueProviderAsync(context, str);
                });
            }

            return Task.CompletedTask;
        }

        private static  void AddValueProviderAsync(ValueProviderFactoryContext context,string body)
        {
            var request = context.ActionContext.HttpContext.Request;
            var valueProvider = new BodyValueProvider(
                BindingSource.Body,
                body,
                CultureInfo.CurrentCulture);

            context.ValueProviders.Add(valueProvider);
        }

    }
}
