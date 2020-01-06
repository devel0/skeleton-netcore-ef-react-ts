using System.ComponentModel.DataAnnotations.Schema;
using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsInterface]
    [Table("system_config")]
    public class SystemConfig : IRecord
    {        

        public string other_info { get; set; }
        
    }

}