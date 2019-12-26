using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SearchAThing.PsqlUtil;

namespace srvapp
{

    public class MyDbContext : DbContext
    {

        static bool psql_initialized = false;
        static object lck_psql_initialized = new object();

        private readonly Global global;

        public MyDbContext(DbContextOptions options, Global global) : base(options)
        {
            this.global = global;

            if (!psql_initialized)
            {
                lock (lck_psql_initialized)
                {
                    if (psql_initialized) return;

                    //this.EnableFirstLastAggregateFunctions();

                    if (Program.MainStarted)
                    {

                        // initialize or ensure some data

                    }

                    SaveChanges();

                    psql_initialized = true;
                }
            }
        }

        void CheckValidate(IEnumerable<object> entities)
        {
            foreach (var entity in entities)
            {
                var validCtx = new ValidationContext(entity);
                Validator.ValidateObject(entity, validCtx);
            }
        }

        void MySaveChanges()
        {
            if (Program.MainStarted) // avoid to process these if in migrations
            {
                var entities = from e in ChangeTracker.Entries()
                               where e.State == EntityState.Added || e.State == EntityState.Modified
                               select e.Entity;

                CheckValidate(entities);
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            MySaveChanges();

            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            MySaveChanges();

            return base.SaveChanges();
        }

        /// <summary>
        /// unique index, index, delete cascade, default values required db fields 
        /// </summary>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //
            // INDEX
            //                        
            //builder.Entity<SampleTable>().HasIndex(x => new { x.field });            

            //
            // UNIQUE INDEX
            //
            //builder.Entity<SampleTable>().HasIndex("id_a", "b").IsUnique();            

            //
            // DELETE BEHAVIOR
            //
            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict; //.Cascade
            }

            //
            // DEFAULT VALUES
            //            
            // builder.Entity<SampleTable>().Property(p => p.a).HasDefaultValue(A_DEFAULT);            
        }

        public DbSet<SystemConfig> SystemConfig { get; set; }
        public DbSet<SampleTable> SampleTables { get; set; }

    }

}