using Microsoft.AspNetCore.Authorization;

namespace DictionaryAPI.Policies.Requirements
{
    public class WordOwnerRequirement : IAuthorizationRequirement
    {
        public WordOwnerRequirement() { }

    }
}
