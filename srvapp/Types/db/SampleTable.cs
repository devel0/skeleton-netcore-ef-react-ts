using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsInterface]
    [Table("sample_table")]
    public class SampleTable : IRecordBase
    {

        [Key]
        public int id { get; set; }

        /// <summary>
        /// create timestamp ( server:UTC js:LOCAL )
        /// </summary>        
        public DateTime create_timestamp { get; set; }

        /// <summary>
        /// user timestamp ( serveR:UTC js:LOCAL )
        /// </summary>
        public DateTime user_timestamp { get; set; }

    }

}