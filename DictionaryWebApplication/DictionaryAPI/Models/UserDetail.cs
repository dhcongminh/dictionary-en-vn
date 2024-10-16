using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class UserDetail
    {
        public int UserId { get; set; }
        public string? Nickname { get; set; }
        public string? YearOfBirth { get; set; }
        public string? Email { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
