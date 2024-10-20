using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using DictionaryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase {
        private readonly IUserService _service;
        public UserController(IUserService service) {
            _service = service;
        }


    }
}
