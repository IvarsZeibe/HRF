using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<TypingTest> TypingTests { get; set; } = null!;
        public DbSet<ReactionTimeTest> ReactionTimeTests { get; set; } = null!;
        public DbSet<AimTest> AimTests { get; set; } = null!;
        public DbSet<NumberMemoryTest> NumberMemoryTests { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
    }
}