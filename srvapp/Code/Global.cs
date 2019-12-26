using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using static System.Environment;
using System.Threading;
using System.Threading.Tasks;

namespace srvapp
{

    public class Global
    {
        public string CallerIPAddress(HttpContext httpctx)
        {
            var url = "";
            if (httpctx?.Request?.Headers != null)
            {
                var q = httpctx.Request.Headers["X-Real-IP"];
                if (q.Count > 0) url = q.First();
            }

            return url;
        }

        public bool IsDevelopmentEnvironment => Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        /// <summary>
        /// /data ( or ~/.config/srvapp for development )
        /// </summary>        
        public string AppFolder
        {
            get
            {
                var pathname = "/data";

                if (IsDevelopmentEnvironment)
                    pathname = Path.Combine(Path.Combine(Environment.GetFolderPath(SpecialFolder.UserProfile), ".config"), "srvapp");

                if (!Directory.Exists(pathname)) Directory.CreateDirectory(pathname);

                return pathname;
            }
        }

        public string AppConfigPathfilename
        {
            get { return Path.Combine(AppFolder, "config.json"); }
        }

        public string AppConfigPathfilenameBackup
        {
            get { return Path.Combine(AppFolder, "config.json.bak"); }
        }

        private readonly ILogger<Global> logger;

        public Config Config { get; private set; }

        public string ConnectionString => Config.ConnectionString;

        public Global(ILogger<Global> logger)
        {
            this.logger = logger;

            if (!File.Exists(AppConfigPathfilename))
            {
                Config = new Config();
                Config.Save(logger, this);
            }
            else
            {
                // check mode 600
                if (!LinuxHelper.IsFilePermissionSafe(AppConfigPathfilename, Convert.ToInt32("600", 8)))
                {
                    throw new Exception($"invalid file permission [{AppConfigPathfilename}] must set to 600");
                }

                var attrs = File.GetAttributes(AppConfigPathfilename);
                Config = System.Text.Json.JsonSerializer.Deserialize<Config>(File.ReadAllText(AppConfigPathfilename));
            }

            if (string.IsNullOrEmpty(Config.DBHostname) || Config.DBPassword == "pass")
            {
                Config.DBHostname = "hostname";
                Config.DBPort = 5432;
                Config.DBName = "srvdb";
                Config.DBUsername = "postgres";
                Config.DBPassword = "pass";
                Config.Save(logger, this);

                Task.Run(async () =>
                {
                    var res = await SearchAThing.Util.Toolkit.ExecBashRedirect($"ls -la {AppFolder}", CancellationToken.None, false, false);
                    System.Console.WriteLine(res.output);
                });

                throw new Exception($"please configure [{AppConfigPathfilename}] setting DBHostname, DBPort, DBName, DBUsername, DBPassword (see README.md)");
            }
        }

    }

}
