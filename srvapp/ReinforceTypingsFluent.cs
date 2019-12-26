using System.Reflection;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;

namespace srvapp
{

    public static class ReinforcedTypingsConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            //
            // set type for DateTime
            //
            //builder.Substitute(typeof(System.DateTime), new RtSimpleTypeName("Date"));

            //
            // global configuration
            //
            builder.Global((cfg) =>
            {
                cfg.UseModules(true);
                // cfg.ReorderMembers(true);
                cfg.AutoOptionalProperties(true);                
            });

            //
            // include docs
            //
            builder.TryLookupDocumentationForAssembly(Assembly.GetExecutingAssembly());

            //
            // enums out of this assembly
            //
            builder
            .ExportAsEnum<SearchAThing.DocX.PaperType>();

            builder
            .ExportAsEnum<DocumentFormat.OpenXml.Wordprocessing.PageOrientationValues>();
        }
    }

}