using System;
using System.ComponentModel.DataAnnotations;
using Reinforced.Typings.Attributes;
using SearchAThing;

namespace srvapp
{

    [TsInterface(AutoExportMethods = false)]
    public interface IRecordBase
    {
        int id { get; set; }        

        DateTime? update_timestamp { get; set; }
    }

    [TsInterface(AutoExportMethods = false)]
    public abstract class IRecord : IRecordBase
    {
        [Key]
        public int id { get; set; }        

        DateTime? _update_timestamp;
        /// <summary>
        /// user timestamp ( serveR:UTC js:LOCAL )
        /// </summary>
        public DateTime? update_timestamp
        {
            get { return _update_timestamp != null ? _update_timestamp.Value.UnspecifiedAsUTCDateTime() : new DateTime?(); }
            set { _update_timestamp = value; }
        }
    }

}