using System;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("InventoryItem")]
    public class InventoryItem
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

        [StringLength(500)]
        [XmlElement("description")]
        public string Description { get; set; } = string.Empty;

        [XmlElement("quantity")]
        public int Quantity { get; set; }

        [StringLength(100)]
        [XmlElement("location")]
        public string Location { get; set; } = string.Empty;

        [XmlElement("purchaseDate")]
        public DateTime PurchaseDate { get; set; }

        [XmlElement("purchasePrice")]
        public decimal PurchasePrice { get; set; }
    }
}
