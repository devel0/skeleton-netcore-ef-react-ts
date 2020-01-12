using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace srvapp
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
            services.AddControllersWithViews();

            services.AddMvc().AddNewtonsoftJson((o) =>
            {
                o.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects;                
            });

            // MY SINGLETONS
            {
                services.AddSingleton<Global>();
            }

            // db ctx
            services.AddDbContext<MyDbContext>((o) =>
            {
                var global = (Global)services.BuildServiceProvider().GetRequiredService(typeof(Global));

                SetupDbContextOptions(o, global);
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // EP: disable model validation
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
        }

        public static string ExceptionDetail(Exception ex)
        {
            var msg = ex.Message;

            if (ex.InnerException != null && ex.InnerException is Npgsql.PostgresException)
            {
                var npgsqlex = ex.InnerException as Npgsql.PostgresException;
                msg = $"{npgsqlex.Message}: {npgsqlex.Detail}";
            }
            return msg;
        }

        public static CommonResponse ErrorResponse(Exception ex)
        {
            var basePath = System.IO.Path.GetDirectoryName(System.IO.Path.GetDirectoryName(
                System.IO.Path.GetDirectoryName(System.IO.Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory))));

            var st = ex.StackTrace;
            if (Directory.Exists(basePath))
                st = st.Replace(basePath, "");

            return new CommonResponse()
            {
                exitCode = CommonResponseExitCodes.Error,
                errorMsg = ExceptionDetail(ex),
                stackTrace = st
            };
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            System.Console.WriteLine($"---> env.EnvironmentName=[{env.EnvironmentName}] ; env.IsDevelopment={env.IsDevelopment()}");
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/error");
            }
            else
            {
                app.UseExceptionHandler("/error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        public static void SetupDbContextOptions(DbContextOptionsBuilder o, Global global)
        {
            var configureNamedOptions = new ConfigureNamedOptions<ConsoleLoggerOptions>("", null);

            var optionsFactory = new OptionsFactory<ConsoleLoggerOptions>(
                new[] { configureNamedOptions },
                Enumerable.Empty<IPostConfigureOptions<ConsoleLoggerOptions>>());

            var optionsMonitor = new OptionsMonitor<ConsoleLoggerOptions>(
                optionsFactory,
                Enumerable.Empty<IOptionsChangeTokenSource<ConsoleLoggerOptions>>(),
                new OptionsCache<ConsoleLoggerOptions>());

            var loggerFactory = new LoggerFactory(
                new[] { new ConsoleLoggerProvider(optionsMonitor) },
                new LoggerFilterOptions
                {
                    MinLevel = global.IsDevelopmentEnvironment ? LogLevel.Debug : LogLevel.Information
                });

            o.UseNpgsql(global.ConnectionString)
                .EnableSensitiveDataLogging() // TODO: disable this to avoid SQL trace
                .UseLoggerFactory(loggerFactory);
        }
    }
}
