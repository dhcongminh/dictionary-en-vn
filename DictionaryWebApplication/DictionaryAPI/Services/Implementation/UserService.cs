using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using DictionaryAPI.Repositories;
using System.Numerics;

namespace DictionaryAPI.Services.Implementation {
    public class UserService : IUserService {
        private readonly IUserRepo _repo;
        public UserService(IUserRepo repo) {
            _repo = repo;
        }

    }
}
