using Reinforced.Typings.Attributes;

namespace srvapp
{

    [TsInterface]
    public class CommonRequest
    {
        public string authToken { get; set; } // TODO: implement auth logic                
    }

    [TsInterface]
    public class TemplatedRequest<T> : CommonRequest
    {
        public T data { get; set; }
    }

}