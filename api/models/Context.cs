using Microsoft.EntityFrameworkCore;

namespace api.models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options)
            : base(options)
        {
        }

        public DbSet<TestItem> TestItems { get; set; } = null!;
    }
}