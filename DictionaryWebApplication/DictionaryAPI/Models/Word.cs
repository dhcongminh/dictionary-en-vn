using DictionaryAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class Word
    {
        public Word()
        {
            PendingWords = new HashSet<PendingWord>();
            Antonyms = new HashSet<Word>();
            Definitions = new HashSet<Definition>();
            Synonyms = new HashSet<Word>();
            Users = new HashSet<User>();
            Words = new HashSet<Word>();
            WordsNavigation = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? IllustrationImage { get; set; }
        public string? Type { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<PendingWord> PendingWords { get; set; }

        public virtual ICollection<Word> Antonyms { get; set; }
        public virtual ICollection<Definition> Definitions { get; set; }
        public virtual ICollection<Word> Synonyms { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Word> Words { get; set; }
        public virtual ICollection<Word> WordsNavigation { get; set; }

        public void FromDto(WordDTO w) {
            if (w != null) {
                this.Id = w.Id;
                this.WordText = w.WordText;
                this.ShortDefinition = w.ShortDefinition;
                this.IllustrationImage = w.IllustrationImage;
                this.Type = w.Type;
                this.IsActive = w.IsActive;

                this.Antonyms = w.Antonyms.Select(a => new Word {
                    Id = w.Id,
                    WordText = w.WordText,
                    ShortDefinition = w.ShortDefinition,
                    IllustrationImage = w.IllustrationImage,
                    Type = w.Type,
                    IsActive = w.IsActive,
                    Definitions = w.Definitions,
                }).ToList() ?? new List<Word>();

                this.Definitions = w.Definitions;

                this.Synonyms = w.Synonyms.Select(a => new Word {
                    Id = w.Id,
                    WordText = w.WordText,
                    ShortDefinition = w.ShortDefinition,
                    IllustrationImage = w.IllustrationImage,
                    Type = w.Type,
                    IsActive = w.IsActive,
                    Definitions = w.Definitions,
                }).ToList() ?? new List<Word>();
            } else {
                Console.WriteLine("WordDto opject is null");
            }
        }
        public void Update(WordDTO w, Dictionary_en_vnContext context) {
            this.WordText = w.WordText;
            this.ShortDefinition = w.ShortDefinition;
            this.IllustrationImage = w.IllustrationImage;
            this.Type = w.Type;
            this.IsActive = w.IsActive;

            this.Antonyms.Clear();
            foreach (var antonymDto in w.Antonyms) {
                var antonym = context.Words.FirstOrDefault(a => a.Id == antonymDto.Id);
                if (antonym != null) {
                    this.Antonyms.Add(antonym);
                } else {
                    this.Antonyms.Add(new Word {
                        Id = antonymDto.Id,
                        WordText = antonymDto.WordText,
                        ShortDefinition = antonymDto.ShortDefinition,
                        IllustrationImage = antonymDto.IllustrationImage,
                        Type = antonymDto.Type,
                        IsActive = antonymDto.IsActive,
                        Definitions = antonymDto.Definitions
                    });
                }
            }


            this.Definitions = w.Definitions;

            this.Synonyms.Clear();
            foreach (var synonymDto in w.Synonyms) {
                var synonym = context.Words.FirstOrDefault(s => s.Id == synonymDto.Id);
                if (synonym != null) {
                    this.Synonyms.Add(synonym);
                } else {
                    this.Synonyms.Add(new Word {
                        Id = synonymDto.Id,
                        WordText = synonymDto.WordText,
                        ShortDefinition = synonymDto.ShortDefinition,
                        IllustrationImage = synonymDto.IllustrationImage,
                        Type = synonymDto.Type,
                        IsActive = synonymDto.IsActive,
                        Definitions = synonymDto.Definitions
                    });
                }
            }
        }
    }
}
