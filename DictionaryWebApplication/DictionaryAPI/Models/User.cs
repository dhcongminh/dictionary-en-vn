using DictionaryAPI.DTOs;
using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class User
    {
        public User()
        {
            PendingWords = new HashSet<PendingWord>();
            Words = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }

        public virtual UserDetail? UserDetail { get; set; }
        public virtual ICollection<PendingWord> PendingWords { get; set; }

        public virtual ICollection<Word> Words { get; set; }

        public void FromRegisterDto(UserRegisterDTO userDto) {
            this.Username = userDto.Username;
            this.Password = userDto.Password;
            if (UserDetail == null) {
                this.UserDetail = new UserDetail();
            }
            this.UserDetail.Email = userDto.Email;
        }
    }
}
