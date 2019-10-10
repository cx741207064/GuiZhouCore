using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JlveTaxSystemGuiZhou.Core
{
    public abstract class MyBindingSourceValueProvider: IBindingSourceValueProvider
    {
        public MyBindingSourceValueProvider(BindingSource bindingSource)
        {
            if (bindingSource == null)
            {
                throw new ArgumentNullException(nameof(bindingSource));
            }

            if (!bindingSource.IsGreedy)
            {
                var message = "IsGreedy";
                throw new ArgumentException(message, nameof(bindingSource));
            }

            if (bindingSource is CompositeBindingSource)
            {
                var message = "CompositeBindingSource";
                throw new ArgumentException(message, nameof(bindingSource));
            }

            BindingSource = bindingSource;
        }

        protected BindingSource BindingSource { get; }

        public abstract bool ContainsPrefix(string prefix);

        public abstract ValueProviderResult GetValue(string key);

        public virtual IValueProvider Filter(BindingSource bindingSource)
        {
            if (bindingSource == null)
            {
                throw new ArgumentNullException(nameof(bindingSource));
            }

            if (bindingSource.CanAcceptDataFrom(BindingSource))
            {
                return this;
            }
            else
            {
                return null;
            }
        }

    }
}
