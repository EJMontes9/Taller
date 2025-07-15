using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("UserModel")]
    [XmlType("UserModel")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "user";
    }
}
