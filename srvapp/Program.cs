using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace srvapp
{
    public class Program
    {
        public static bool MainStarted { get; private set; }

        public static void Main(string[] args)
        {
            MigrationsTools.CheckMigrationsToolCmdline(args);            

            MainStarted = true;

            var g = new Global(null);

            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var q = WebHost.CreateDefaultBuilder(args)
                .ConfigureLogging((hostingContext, logging) =>
                {
                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                });

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                q = q.UseUrls("http://0.0.0.0:5000");
            }

            q = q.UseStartup<Startup>();

            return q;
        }
    }
}
