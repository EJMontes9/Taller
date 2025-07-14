using System;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("Cliente")]
    public class Cliente
    {
        [Key]
        [XmlElement("id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [XmlElement("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [XmlElement("apellido")]
        public string Apellido { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(150)]
        [XmlElement("email")]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [StringLength(20)]
        [XmlElement("telefono")]
        public string Telefono { get; set; } = string.Empty;
    }
}
