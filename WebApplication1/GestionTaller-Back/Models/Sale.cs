using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models
{
    [Serializable]
    [XmlRoot("Sale")]
    public class Sale
    {
        [Key]
        [XmlElement("id")]
        public int Id { get; set; }

        [Required]
        [XmlElement("date")]
        public DateTime Date { get; set; }

        [Required]
        [XmlElement("customerId")]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        [XmlIgnore]
        public Cliente? Customer { get; set; }

        [XmlElement("vehicleId")]
        public int? VehicleId { get; set; }

        [ForeignKey("VehicleId")]
        [XmlIgnore]
        public Vehicle? Vehicle { get; set; }

        [XmlElement("total")]
        public decimal Total { get; set; }

        [Required]
        [StringLength(50)]
        [XmlElement("status")]
        public string Status { get; set; } = "pendiente";

        [Required]
        [StringLength(50)]
        [XmlElement("paymentMethod")]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(500)]
        [XmlElement("notes")]
        public string Notes { get; set; } = string.Empty;

        [XmlIgnore]
        public List<SalePart> SaleParts { get; set; } = new List<SalePart>();

        [XmlArray("parts")]
        [XmlArrayItem("part")]
        public List<SalePartDto> Parts { get; set; } = new List<SalePartDto>();
    }

    [Serializable]
    [XmlRoot("SalePartDto")]
    public class SalePartDto
    {
        [XmlElement("id")]
        public int Id { get; set; }

        [XmlElement("name")]
        public string Name { get; set; } = string.Empty;

        [XmlElement("price")]
        public decimal Price { get; set; }

        [XmlElement("quantity")]
        public int Quantity { get; set; }
    }
}