using System;
using System.ComponentModel.DataAnnotations.Schema;
using Reinforced.Typings.Attributes;
using SearchAThing;

namespace srvapp
{

    [TsInterface(AutoExportMethods = false)]
    [Table("sample_table")]
    public class SampleTable : IRecord
    {

        DateTime _create_timestamp;
        /// <summary>
        /// create timestamp ( server:UTC js:LOCAL )
        /// </summary>        
        public DateTime create_timestamp
        {
            get { return _create_timestamp.UnspecifiedAsUTCDateTime(); }
            set { _create_timestamp = value; }
        }

        DateTime _user_timestamp;
        /// <summary>
        /// user timestamp ( serveR:UTC js:LOCAL )
        /// </summary>
        public DateTime user_timestamp
        {
            get { return _user_timestamp.UnspecifiedAsUTCDateTime(); }
            set { _user_timestamp = value; }
        }

        public int touch_data { get; set; }

    }

}