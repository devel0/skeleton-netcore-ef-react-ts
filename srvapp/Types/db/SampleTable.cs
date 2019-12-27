using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using Reinforced.Typings.Attributes;
using SearchAThing;

namespace srvapp
{

    [TsInterface]
    [Table("sample_table")]
    public class SampleTable : IRecordBase
    {

        [Key]
        public int id { get; set; }

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

    }

}