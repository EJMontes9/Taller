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
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SalePart> SaleParts { get; set; }

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

            // Seed vehicles
            modelBuilder.Entity<Vehicle>().HasData(
                new Vehicle
                {
                    Id = 1,
                    Brand = "Toyota",
                    Model = "Corolla",
                    Year = 2023,
                    Color = "Blanco",
                    Price = 25000,
                    Status = "disponible",
                    VIN = "ABC123456789"
                },
                new Vehicle
                {
                    Id = 2,
                    Brand = "Honda",
                    Model = "Civic",
                    Year = 2022,
                    Color = "Negro",
                    Price = 23500,
                    Status = "disponible",
                    VIN = "DEF987654321"
                },
                new Vehicle
                {
                    Id = 3,
                    Brand = "Ford",
                    Model = "Mustang",
                    Year = 2023,
                    Color = "Rojo",
                    Price = 45000,
                    Status = "vendido",
                    VIN = "GHI456789123"
                }
            );

            // Seed parts
            modelBuilder.Entity<Part>().HasData(
                new Part
                {
                    Id = 1,
                    Name = "Filtro de aceite",
                    Category = "filtros",
                    SKU = "FIL-001",
                    Price = 15.99m,
                    Stock = 45,
                    MinStock = 10,
                    Supplier = "AutoPartes S.A."
                },
                new Part
                {
                    Id = 2,
                    Name = "Pastillas de freno",
                    Category = "frenos",
                    SKU = "FRE-002",
                    Price = 45.50m,
                    Stock = 20,
                    MinStock = 5,
                    Supplier = "Frenos Seguros Inc."
                },
                new Part
                {
                    Id = 3,
                    Name = "Batería 12V",
                    Category = "electricidad",
                    SKU = "BAT-003",
                    Price = 89.99m,
                    Stock = 15,
                    MinStock = 3,
                    Supplier = "ElectroAuto"
                }
            );

            // Seed inventory items
            modelBuilder.Entity<InventoryItem>().HasData(
                new InventoryItem
                {
                    Id = 1,
                    Name = "Compresor de aire",
                    Category = "herramientas",
                    Description = "Compresor de aire para taller",
                    Quantity = 2,
                    Location = "Almacén principal",
                    PurchaseDate = new DateTime(2023, 1, 15),
                    PurchasePrice = 350.00m
                },
                new InventoryItem
                {
                    Id = 2,
                    Name = "Kit de limpieza de interiores",
                    Category = "limpieza",
                    Description = "Kit completo para limpieza de interiores de vehículos",
                    Quantity = 5,
                    Location = "Estante B3",
                    PurchaseDate = new DateTime(2023, 3, 22),
                    PurchasePrice = 45.99m
                },
                new InventoryItem
                {
                    Id = 3,
                    Name = "Gato hidráulico",
                    Category = "herramientas",
                    Description = "Gato hidráulico de 3 toneladas",
                    Quantity = 3,
                    Location = "Área de servicio",
                    PurchaseDate = new DateTime(2022, 11, 5),
                    PurchasePrice = 120.50m
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
