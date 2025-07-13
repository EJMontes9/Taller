using GestionTaller_Back.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace GestionTaller_Back.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed some initial data
            modelBuilder.Entity<Cliente>().HasData(
                new Cliente
                {
                    Id = 1,
                    Nombre = "Juan",
                    Apellido = "Pérez",
                    Email = "juan.perez@example.com",
                    Telefono = "555-1234"
                },
                new Cliente
                {
                    Id = 2,
                    Nombre = "María",
                    Apellido = "González",
                    Email = "maria.gonzalez@example.com",
                    Telefono = "555-5678"
                }
            );

            // Seed admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    // Hash for "admin123"
                    PasswordHash = HashPassword("admin123"),
                    Name = "Administrator",
                    Email = "admin@example.com",
                    Role = "admin"
                }
            );
        }

        // Helper method to hash passwords for seed data
        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
