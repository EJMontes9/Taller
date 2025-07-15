using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("SalePart")]
    public class SalePart
    {
        [Key]
        [XmlElement("id")]
        public int Id { get; set; }

        [Required]
        [XmlElement("saleId")]
        public int SaleId { get; set; }

        [ForeignKey("SaleId")]
        [XmlIgnore]
        public Sale? Sale { get; set; }

        [Required]
        [XmlElement("partId")]
        public int PartId { get; set; }

        [ForeignKey("PartId")]
        [XmlIgnore]
        public Part? Part { get; set; }

        [Required]
        [XmlElement("quantity")]
        public int Quantity { get; set; } = 1;

        [Required]
        [XmlElement("price")]
        public decimal Price { get; set; }
    }
}