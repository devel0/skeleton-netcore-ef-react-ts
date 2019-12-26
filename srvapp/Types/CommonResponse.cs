using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsEnum]
    public enum CommonResponseExitCodes
    {
        /// <summary>
        /// api exited successfully
        /// </summary>
        Successful = 0,

        /// <summary>
        /// unhandled exception occurred
        /// </summary>
        Error = 1,

        /// <summary>
        /// access denied due to missing valid authentication
        /// </summary>
        InvalidAuth = 2
    }

    [TsInterface]
    public class CommonResponse
    {
        /// <summary>
        /// 0 - ok
        /// 1 - error ( see ErrorMsg and stackTrace)
        /// 2 - invalid auth
        /// </summary>
        public CommonResponseExitCodes exitCode { get; set; }

        public string errorMsg { get; set; }

        public string stackTrace { get; set; }
    }

    [TsInterface]
    public class TemplatedResponse<T> : CommonResponse
    {
        public T data { get; set; }
    }

}