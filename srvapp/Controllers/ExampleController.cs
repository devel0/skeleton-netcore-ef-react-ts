using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace srvapp.Controllers
{

    [ApiController]
    [Route("[controller]/[action]")]
    public class ExampleController : CommonController
    {

        public ExampleController(ILogger<ExampleController> logger, Global global, MyDbContext ctx) : base(logger, global, ctx)
        {
        }

        [HttpPost]
        public CommonResponse addSample(TemplatedRequest<SampleTable> req)
        {
            try
            {
                if (!checkAuth(req)) return InvalidAuthResponse();

                req.data.id = 0;
                req.data.create_timestamp = DateTime.UtcNow;                

                ctx.SampleTables.Add(req.data);
                ctx.SaveChanges();

                return SuccessfulResponse();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "");
                return ErrorResponse(ex);
            }
        }

        [HttpPost]
        public CommonResponse loadSamples(CommonRequest req)
        {
            try
            {
                if (!checkAuth(req)) return InvalidAuthResponse();
                
                return new TemplatedResponse<List<SampleTable>>
                {                    
                    data = ctx.SampleTables.ToList()
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "");
                return ErrorResponse(ex);
            }
        }
        
    }

}
