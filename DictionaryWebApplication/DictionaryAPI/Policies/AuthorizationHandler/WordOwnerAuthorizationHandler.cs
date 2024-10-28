using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Policies.Requirements;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DictionaryAPI.Policies.AuthorizationHandler {
    public class WordOwnerAuthorizationHandler : AuthorizationHandler<WordOwnerRequirement, WordInputDTO> {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, 
            WordOwnerRequirement requirement, WordInputDTO word) {

            if (context.User == null || word == null) {
                return Task.CompletedTask;
            }
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (word.AddByUser.ToString() == userId) {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;

        }
    }
}
