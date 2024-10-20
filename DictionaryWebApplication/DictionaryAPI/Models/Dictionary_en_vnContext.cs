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
        public virtual DbSet<Example> Examples { get; set; } = null!;
        public virtual DbSet<Type> Types { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserDetail> UserDetails { get; set; } = null!;
        public virtual DbSet<Word> Words { get; set; } = null!;
        public virtual DbSet<WordDefinition> WordDefinitions { get; set; } = null!;

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
            });

            modelBuilder.Entity<Example>(entity =>
            {
                entity.ToTable("Example");

                entity.HasOne(d => d.Definition)
                    .WithMany(p => p.Examples)
                    .HasForeignKey(d => d.DefinitionId)
                    .HasConstraintName("FK__Example__Definit__440B1D61");
            });

            modelBuilder.Entity<Type>(entity =>
            {
                entity.ToTable("Type");

                entity.Property(e => e.Title).HasMaxLength(20);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Password).IsUnicode(false);

                entity.Property(e => e.Role)
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.Username)
                    .HasMaxLength(16)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserDetail>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__UserDeta__1788CC4C58E4F984");

                entity.ToTable("UserDetail");

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.Nickname).HasMaxLength(16);

                entity.Property(e => e.YearOfBirth)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.HasOne(d => d.User)
                    .WithOne(p => p.UserDetail)
                    .HasForeignKey<UserDetail>(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UserDetai__UserI__398D8EEE");
            });

            modelBuilder.Entity<Word>(entity =>
            {
                entity.ToTable("Word");

                entity.HasIndex(e => e.Id, "IDX_WordText");

                entity.HasIndex(e => e.WordText, "UQ__Word__918B59BD70999499")
                    .IsUnique();

                entity.Property(e => e.Status)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.WordText)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.AddByUserNavigation)
                    .WithMany(p => p.WordsNavigation)
                    .HasForeignKey(d => d.AddByUser)
                    .HasConstraintName("FK__Word__AddByUser__3D5E1FD2");

                entity.HasMany(d => d.Antonyms)
                    .WithMany(p => p.Words)
                    .UsingEntity<Dictionary<string, object>>(
                        "AntonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("AntonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___Anton__5535A963"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___WordI__5441852A"),
                        j =>
                        {
                            j.HasKey("WordId", "AntonymsId").HasName("PK__Antonyms__81C56F4FE9D8B30C");

                            j.ToTable("Antonyms_Word");

                            j.HasIndex(new[] { "AntonymsId" }, "IDX_AntonymsId");
                        });

                entity.HasMany(d => d.Synonyms)
                    .WithMany(p => p.WordsNavigation)
                    .UsingEntity<Dictionary<string, object>>(
                        "SynonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("SynonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___Synon__5165187F"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___WordI__5070F446"),
                        j =>
                        {
                            j.HasKey("WordId", "SynonymsId").HasName("PK__Synonyms__CFB81516CC4AAF1C");

                            j.ToTable("Synonyms_Word");

                            j.HasIndex(new[] { "SynonymsId" }, "IDX_SynonymsId");
                        });

                entity.HasMany(d => d.Users)
                    .WithMany(p => p.Words)
                    .UsingEntity<Dictionary<string, object>>(
                        "Favourite",
                        l => l.HasOne<User>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Favourite__UserI__4CA06362"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Favourite__WordI__4D94879B"),
                        j =>
                        {
                            j.HasKey("WordId", "UserId").HasName("PK__Favourit__FD587CA255A5AD43");

                            j.ToTable("Favourite");
                        });

                entity.HasMany(d => d.Words)
                    .WithMany(p => p.Antonyms)
                    .UsingEntity<Dictionary<string, object>>(
                        "AntonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___WordI__5441852A"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("AntonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Antonyms___Anton__5535A963"),
                        j =>
                        {
                            j.HasKey("WordId", "AntonymsId").HasName("PK__Antonyms__81C56F4FE9D8B30C");

                            j.ToTable("Antonyms_Word");

                            j.HasIndex(new[] { "AntonymsId" }, "IDX_AntonymsId");
                        });

                entity.HasMany(d => d.WordsNavigation)
                    .WithMany(p => p.Synonyms)
                    .UsingEntity<Dictionary<string, object>>(
                        "SynonymsWord",
                        l => l.HasOne<Word>().WithMany().HasForeignKey("WordId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___WordI__5070F446"),
                        r => r.HasOne<Word>().WithMany().HasForeignKey("SynonymsId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__Synonyms___Synon__5165187F"),
                        j =>
                        {
                            j.HasKey("WordId", "SynonymsId").HasName("PK__Synonyms__CFB81516CC4AAF1C");

                            j.ToTable("Synonyms_Word");

                            j.HasIndex(new[] { "SynonymsId" }, "IDX_SynonymsId");
                        });
            });

            modelBuilder.Entity<WordDefinition>(entity =>
            {
                entity.HasKey(e => new { e.WordId, e.TypeId })
                    .HasName("PK__Word_Def__6936005DD538FD07");

                entity.ToTable("Word_Definition");

                entity.HasIndex(e => e.DefinitionId, "IDX_Word_Definition");

                entity.HasIndex(e => e.DefinitionId, "UQ__Word_Def__9D6655152647B802")
                    .IsUnique();

                entity.HasOne(d => d.Definition)
                    .WithOne(p => p.WordDefinition)
                    .HasForeignKey<WordDefinition>(d => d.DefinitionId)
                    .HasConstraintName("FK__Word_Defi__Defin__49C3F6B7");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.WordDefinitions)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Word_Defi__TypeI__48CFD27E");

                entity.HasOne(d => d.Word)
                    .WithMany(p => p.WordDefinitions)
                    .HasForeignKey(d => d.WordId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Word_Defi__WordI__47DBAE45");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
