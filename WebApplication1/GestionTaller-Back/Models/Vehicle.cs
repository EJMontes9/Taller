using System;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("Vehicle")]
    [XmlType("Vehicle")]
    public class Vehicle
    {
        [Key]
        [XmlElement("id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [XmlElement("brand")]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [XmlElement("model")]
        public string Model { get; set; } = string.Empty;

        [Required]
        [XmlElement("year")]
        public int Year { get; set; }

        [StringLength(50)]
        [XmlElement("color")]
        public string Color { get; set; } = string.Empty;

        [XmlElement("price")]
        public decimal Price { get; set; }

        [StringLength(50)]
        [XmlElement("status")]
        public string Status { get; set; } = "disponible";

        [StringLength(50)]
        [XmlElement("vin")]
        public string VIN { get; set; } = string.Empty;
    }
}
