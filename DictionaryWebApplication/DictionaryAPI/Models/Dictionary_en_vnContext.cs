using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DictionaryAPI.Models
{
    public partial class Dictionary_en_vnContext : DbContext
    {
        public Dictionary_en_vnContext()
        {
        }

        public Dictionary_en_vnContext(DbContextOptions<Dictionary_en_vnContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Definition> Definitions { get; set; } = null!;
        public virtual DbSet<PendingWord> PendingWords { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserDetail> UserDetails { get; set; } = null!;
        public virtual DbSet<Word> Words { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                optionsBuilder.UseSqlServer(config.GetConnectionString("DB"));

            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Definition>(entity =>
            {
                entity.ToTable("Definition");

                entity.Property(e => e.Detail).IsUnicode(true);
            });

            modelBuilder.Entity<PendingWord>(entity =>
            {
                entity.ToTable("PendingWord");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.PendingWords)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__PendingWo__UserI__5070F446");

                entity.HasOne(d => d.Word)
                    .WithMany(p => p.PendingWords)
                    .HasForeignKey(d => d.WordId)
                    .HasConstraintName("FK__PendingWo__WordI__5165187F");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Password).IsUnicode(false);

                entity.Property(e => e.Username)
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Role)
                    .HasMaxLength(16)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserDetail>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__UserDeta__1788CC4CE71A24AC");

                entity.ToTable("UserDetail");

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.Nickname)
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.YearOfBirth)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.HasOne(d => d.User)
                    .WithOne(p => p.UserDetail)
                    .HasForeignKey<UserDetail>(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UserDetai__UserI__398D8EEE");
            });

            modelBuilder.Entity<Word>(entity =>
            {
                entity.ToTable("Word");

                entity.HasIndex(e => e.WordText, "UQ__Word__918B59BD20D0FB40")
                    .IsUnique();

                entity.Property(e => e.IllustrationImage).IsUnicode(false);

                entity.Property(e => e.ShortDefinition).IsUnicode(true);

                entity.Property(e => e.Type)
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.WordText)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasMany(d => d.Antonyms)
                    .WithMany(p => p.Words)
                    .UsingEntity<Dictionary<string, object>>(
                        "AntonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("AntonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___Anton__4D94879B"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___WordI__4CA06362"),
                        j =>
                        {
                            j.HasKey("WordId", "AntonymsId").HasName("PK__Antonyms__81C56F4FD00E7BB7");

                            j.ToTable("Antonyms_Word");
                        });

                entity.HasMany(d => d.Definitions)
                    .WithMany(p => p.Words)
                    .UsingEntity<Dictionary<string, object>>(
                        "WordDefinition",
                        l => l.HasOne<Definition>().WithMany().HasForeignKey("DefinitionId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Word_Defi__Defin__4222D4EF"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Word_Defi__WordI__412EB0B6"),
                        j =>
                        {
                            j.HasKey("WordId", "DefinitionId").HasName("PK__Word_Def__75F695370F48DCF0");

                            j.ToTable("Word_Definition");
                        });

                entity.HasMany(d => d.Synonyms)
                    .WithMany(p => p.WordsNavigation)
                    .UsingEntity<Dictionary<string, object>>(
                        "SynonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("SynonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___Synon__49C3F6B7"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___WordI__48CFD27E"),
                        j =>
                        {
                            j.HasKey("WordId", "SynonymsId").HasName("PK__Synonyms__CFB8151612E66196");

                            j.ToTable("Synonyms_Word");
                        });

                entity.HasMany(d => d.Users)
                    .WithMany(p => p.Words)
                    .UsingEntity<Dictionary<string, object>>(
                        "Favourite",
                        l => l.HasOne<User>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Favourite__UserI__44FF419A"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Favourite__WordI__45F365D3"),
                        j =>
                        {
                            j.HasKey("WordId", "UserId").HasName("PK__Favourit__FD587CA2DED9B0B1");

                            j.ToTable("Favourite");
                        });

                entity.HasMany(d => d.Words)
                    .WithMany(p => p.Antonyms)
                    .UsingEntity<Dictionary<string, object>>(
                        "AntonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___WordI__4CA06362"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("AntonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___Anton__4D94879B"),
                        j =>
                        {
                            j.HasKey("WordId", "AntonymsId").HasName("PK__Antonyms__81C56F4FD00E7BB7");

                            j.ToTable("Antonyms_Word");
                        });

                entity.HasMany(d => d.WordsNavigation)
                    .WithMany(p => p.Synonyms)
                    .UsingEntity<Dictionary<string, object>>(
                        "SynonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___WordI__48CFD27E"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("SynonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___Synon__49C3F6B7"),
                        j =>
                        {
                            j.HasKey("WordId", "SynonymsId").HasName("PK__Synonyms__CFB8151612E66196");

                            j.ToTable("Synonyms_Word");
                        });
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
