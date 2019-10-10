using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public class AuthorBinderProvider : IModelBinderProvider
    {
        public AuthorBinderProvider()
        {
        }

        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            //if (context.Metadata.ParameterName == "formData")
            //{
            //    return new MyModelBinder(typeof(JToken));
            //}

            if (typeof(JToken).IsAssignableFrom(context.Metadata.ModelType))
            {
                return new MyJsonModelBinder();
            }

            if (!context.Metadata.IsComplexType)
            {
                return new MySimpleTypeModelBinder(context.Metadata.ModelType);
            }

            return null;
        }
    }
}
