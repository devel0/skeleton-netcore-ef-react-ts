using System.ComponentModel.DataAnnotations.Schema;
using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsInterface]
    [Table("migrations_backup")]
    public class MigrationsBackup : IRecord
    {

        public string migration_id { get; set; }
        public byte[] migrations_folder { get; set; }

    }

}