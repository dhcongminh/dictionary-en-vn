using Microsoft.AspNetCore.Authorization;

namespace DictionaryAPI.Policies.Requirements {
    public class WordListViewOwnerRequirement : IAuthorizationRequirement {
        public WordListViewOwnerRequirement() { }
    }
}
