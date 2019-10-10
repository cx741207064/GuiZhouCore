// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace JlveTaxSystemGuiZhou.Core
{
    public class BodyValueProvider : MyBindingSourceValueProvider
    {
        private readonly CultureInfo _culture;
        private readonly string _values;
        //private PrefixContainer _prefixContainer;
        
        public BodyValueProvider(
            BindingSource bindingSource,
            string values,
            CultureInfo culture)
            : base(bindingSource)
        {
            if (bindingSource == null)
            {
                throw new ArgumentNullException(nameof(bindingSource));
            }

            if (values == null)
            {
                throw new ArgumentNullException(nameof(values));
            }

            _values = values;
            _culture = culture;
        }

        public CultureInfo Culture => _culture;

        public override bool ContainsPrefix(string prefix)
        {
            return true;
            //throw new NotImplementedException();
        }

        public override ValueProviderResult GetValue(string key)
        {
            return new ValueProviderResult(_values, Culture);
            //throw new NotImplementedException();
        }
    }
}
