using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsInterface]
    [Table("system_config")]
    public class SystemConfig : IRecordBase
    {

        [Key]
        public int id { get; set; }

    }

}