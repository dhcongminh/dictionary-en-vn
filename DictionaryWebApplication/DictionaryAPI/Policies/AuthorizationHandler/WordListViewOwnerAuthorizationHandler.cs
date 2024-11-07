using DictionaryAPI.Policies.Requirements;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DictionaryAPI.Policies.AuthorizationHandler {
    public class WordListViewOwnerAuthorizationHandler : AuthorizationHandler<WordListViewOwnerRequirement, int> {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, 
            WordListViewOwnerRequirement requirement, 
            int uid) {


            if (context.User == null || uid == 0) {
                return Task.CompletedTask;
            }
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (uid.ToString() == userId) {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
