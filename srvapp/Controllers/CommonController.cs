using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SearchAThing;

namespace srvapp.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class CommonController : ControllerBase
    {

        protected readonly Global global;
        protected readonly ILogger logger;
        protected readonly MyDbContext ctx;

        public CommonController(ILogger logger, Global global, MyDbContext ctx)
        {
            this.global = global;
            this.logger = logger;
            this.ctx = ctx;
        }

        protected CommonResponse InvalidAuthResponse()
        {
            return new CommonResponse() { exitCode = CommonResponseExitCodes.InvalidAuth };
        }

        protected CommonResponse SuccessfulResponse()
        {
            return new CommonResponse() { exitCode = CommonResponseExitCodes.Successful };
        }

        protected CommonResponse ErrorResponse(string errMsg)
        {
            return new CommonResponse()
            {
                exitCode = CommonResponseExitCodes.Error,
                errorMsg = errMsg
            };
        }

        protected CommonResponse ErrorResponse(Exception ex)
        {
            var basePath = System.IO.Path.GetDirectoryName(System.IO.Path.GetDirectoryName(
                System.IO.Path.GetDirectoryName(System.IO.Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory))));

            return new CommonResponse()
            {
                exitCode = CommonResponseExitCodes.Error,
                errorMsg = ex.Details(false),
                stackTrace = ex.StackTrace.Replace(basePath, ""),
            };
        }

        protected bool checkAuth(CommonRequest req)
        {
            if (req == null) return false;
            return true; // TODO: authentication checks
        }



    }
}
