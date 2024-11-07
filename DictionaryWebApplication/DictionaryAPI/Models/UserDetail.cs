using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DictionaryAPI.Models
{
    public partial class UserDetail
    {
        public int UserId { get; set; }
        public string? Nickname { get; set; }
        public string? YearOfBirth { get; set; }
        public string? Email { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
    }
}
