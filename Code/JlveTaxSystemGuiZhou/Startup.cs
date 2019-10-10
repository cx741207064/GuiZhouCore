using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages.Internal;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace JlveTaxSystemGuiZhou
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.TryAddSingleton<IActionInvokerFactory, MyActionInvokerFactory>();
            services.TryAddSingleton<ControllerActionInvokerCache, MyControllerActionInvokerCache>();
            services.TryAddSingleton<IModelBinderFactory, MyModelBinderFactory>();
            services.TryAddSingleton<ParameterBinder, MyParameterBinder>();

            services.TryAddEnumerable(
                ServiceDescriptor.Transient<IActionInvokerProvider, MyControllerActionInvokerProvider>());
            services.TryAddEnumerable(
                ServiceDescriptor.Singleton<IActionInvokerProvider, MyPageActionInvokerProvider>());

            services.AddSingleton<YsbqcSetting>();
            services.AddScoped<Service>();
            services.AddScoped<Repository>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSession();

            services.AddMvc(options =>
            {
                // add custom binder to beginning of collection
                options.ModelBinderProviders.Insert(0, new AuthorBinderProvider());
                options.ValueProviderFactories.Add(new BodyValueProviderFactory());
                options.Filters.Add<ActionFilter>();
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, YsbqcSetting set)
        {
            //var rewrite = new RewriteOptions().AddRedirect(@"m2/(\w+)", "?m3=$1");
            //app.UseRewriter(rewrite);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            //MyRewrite(app);

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".jsp"] = "text/html";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

            app.UseCookiePolicy();

            app.UseSession();

            app.UseMiddleware<SessionMiddleware>(set);

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            GTXMethod.config = Configuration;
            GTXMethod.set = ServiceProviderServiceExtensions.GetRequiredService<YsbqcSetting>(app.ApplicationServices);

        }

        void MyRewrite(IApplicationBuilder app)
        {
            var options = new RewriteOptions()
                //.AddRewrite(@"products.aspx?id=(\w+)", "prosucts/$1", skipRemainingRules: false)
                .AddRedirect(@"products.aspx?id=(\w+)", "prosucts/$1");

            app.UseRewriter(options);
        }

    }
}
