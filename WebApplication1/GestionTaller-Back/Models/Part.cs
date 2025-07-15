using System;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("Part")]
    [XmlType("Part")]
    public class Part
    {
        [Key]
        [XmlElement("id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [XmlElement("name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(50)]
        [XmlElement("category")]
        public string Category { get; set; } = string.Empty;

        [StringLength(50)]
        [XmlElement("sku")]
        public string SKU { get; set; } = string.Empty;

        [XmlElement("price")]
        public decimal Price { get; set; }

        [XmlElement("stock")]
        public int Stock { get; set; }

        [XmlElement("minStock")]
        public int MinStock { get; set; }

        [StringLength(100)]
        [XmlElement("supplier")]
        public string Supplier { get; set; } = string.Empty;
    }
}
