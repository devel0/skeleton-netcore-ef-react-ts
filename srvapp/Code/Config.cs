using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace srvapp
{

    public class Config
    {

        private static TimeSpan? authCacheExpire = null;
        /// <summary>
        /// server authentication cache expire time ( to avoid flood of sql )
        /// </summary>        
        public static TimeSpan AuthCacheExpire
        {
            get
            {
                if (authCacheExpire == null) authCacheExpire = TimeSpan.FromMinutes(5);
                return authCacheExpire.Value;
            }
        }

        public string DBHostname { get; set; }
        public int DBPort { get; set; }
        public string DBName { get; set; }
        public string DBUsername { get; set; }
        public string DBPassword { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public string ConnectionString
        {
            get
            {
                return $"Server={DBHostname};Database={DBName};Username={DBUsername};Port={DBPort};Password={DBPassword}";
            }
        }

        public void Save(ILogger logger, Global global)
        {
            try
            {
                if (File.Exists(global.AppConfigPathfilename))
                    File.Copy(global.AppConfigPathfilename, global.AppConfigPathfilenameBackup, true);
            }
            catch (Exception ex)
            {
                logger.LogError($"unable to backup config file [{global.AppConfigPathfilename}] to [{global.AppConfigPathfilenameBackup}] : {ex.Message}");
            }
            File.WriteAllText(global.AppConfigPathfilename, System.Text.Json.JsonSerializer.Serialize(this, new JsonSerializerOptions() { WriteIndented = true }));
            // save with mode 600
            LinuxHelper.SetFilePermission(global.AppConfigPathfilename, 384);
        }

    }

}