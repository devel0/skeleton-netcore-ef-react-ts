using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Diagnostics;
using System;

namespace srvapp.Controllers
{

    [ApiController]
    [Route("[controller]/[action]")]
    public class ErrorController : CommonController
    {

        [Route("/error")]
        public CommonResponse Error()
        {
            try
            {
                var error = HttpContext.Features.Get<IExceptionHandlerFeature>();
                if (error == null)
                    return ErrorResponse("unknown");

                var ex = error.Error;
                logger.LogError(ex, "");
                return ErrorResponse(ex);
            }
            catch (Exception ex2)
            {
                return ErrorResponse($"unhandled: {ex2}");
            }
        }

        public ErrorController(ILogger<ErrorController> logger, Global global, MyDbContext ctx) : base(logger, global, ctx)
        {
        }

    }

}

