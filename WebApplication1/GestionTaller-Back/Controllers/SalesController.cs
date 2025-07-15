using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;
using GestionTaller_Back.Data;
using GestionTaller_Back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionTaller_Back.Controllers
{
    // Wrapper classes for XML serialization
    public class SaleWrapper
    {
        public Sale? Sale { get; set; }

        public SaleWrapper() { }

        public SaleWrapper(Sale sale)
        {
            Sale = sale;
        }
    }

    public class SalesWrapper
    {
        public List<SaleWrapper> Sales { get; set; } = new List<SaleWrapper>();

        public SalesWrapper() { }

        public SalesWrapper(IEnumerable<Sale> sales)
        {
            if (sales != null)
            {
                Sales = sales.Select(s => new SaleWrapper(s)).ToList();
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SalesController> _logger;

        public SalesController(ApplicationDbContext context, ILogger<SalesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Sales
        [HttpGet]
        [Produces("application/xml")]
        public async Task<ActionResult> GetSales()
        {
            _logger.LogInformation("Getting all sales");
            var sales = await _context.Sales
                .Include(s => s.SaleParts)
                .ThenInclude(sp => sp.Part)
                .ToListAsync();

            // Map SaleParts to Parts DTOs for XML serialization
            foreach (var sale in sales)
            {
                sale.Parts = sale.SaleParts.Select(sp => new SalePartDto
                {
                    Id = sp.Part.Id,
                    Name = sp.Part.Name,
                    Price = sp.Price,
                    Quantity = sp.Quantity
                }).ToList();
            }

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new SalesWrapper(sales);
            return Ok(wrapper);
        }

        // GET: api/Sales/5
        [HttpGet("{id}")]
        [Produces("application/xml")]
        public async Task<ActionResult<Sale>> GetSale(int id)
        {
            _logger.LogInformation("Getting sale with id {Id}", id);
            var sale = await _context.Sales
                .Include(s => s.SaleParts)
                .ThenInclude(sp => sp.Part)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null)
            {
                _logger.LogWarning("Sale with id {Id} not found", id);
                return NotFound();
            }

            // Map SaleParts to Parts DTOs for XML serialization
            sale.Parts = sale.SaleParts.Select(sp => new SalePartDto
            {
                Id = sp.Part.Id,
                Name = sp.Part.Name,
                Price = sp.Price,
                Quantity = sp.Quantity
            }).ToList();

            return sale;
        }

        // POST: api/Sales
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<ActionResult<Sale>> CreateSale(Sale sale)
        {
            _logger.LogInformation("Creating new sale");

            // Extract parts from the DTO
            var parts = sale.Parts;
            sale.Parts = new List<SalePartDto>(); // Clear parts to avoid serialization issues

            // Add the sale to the context
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            // Add sale parts if any
            if (parts != null && parts.Count > 0)
            {
                foreach (var part in parts)
                {
                    var salePart = new SalePart
                    {
                        SaleId = sale.Id,
                        PartId = part.Id,
                        Quantity = part.Quantity,
                        Price = part.Price
                    };
                    _context.SaleParts.Add(salePart);
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, sale);
        }

        // PUT: api/Sales/5
        [HttpPut("{id}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> UpdateSale(int id, Sale sale)
        {
            if (id != sale.Id)
            {
                _logger.LogWarning("Sale id mismatch: {Id} vs {SaleId}", id, sale.Id);
                return BadRequest();
            }

            // Extract parts from the DTO
            var parts = sale.Parts;
            sale.Parts = new List<SalePartDto>(); // Clear parts to avoid serialization issues

            _context.Entry(sale).State = EntityState.Modified;

            try
            {
                _logger.LogInformation("Updating sale with id {Id}", id);

                // Update sale parts
                if (parts != null)
                {
                    // Remove existing sale parts
                    var existingSaleParts = await _context.SaleParts.Where(sp => sp.SaleId == id).ToListAsync();
                    _context.SaleParts.RemoveRange(existingSaleParts);

                    // Add new sale parts
                    foreach (var part in parts)
                    {
                        var salePart = new SalePart
                        {
                            SaleId = sale.Id,
                            PartId = part.Id,
                            Quantity = part.Quantity,
                            Price = part.Price
                        };
                        _context.SaleParts.Add(salePart);
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    _logger.LogWarning("Sale with id {Id} not found during update", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Sales/5
        [HttpDelete("{id}")]
        [Produces("application/xml")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            _logger.LogInformation("Deleting sale with id {Id}", id);
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                _logger.LogWarning("Sale with id {Id} not found during delete", id);
                return NotFound();
            }

            // Delete associated sale parts
            var saleParts = await _context.SaleParts.Where(sp => sp.SaleId == id).ToListAsync();
            _context.SaleParts.RemoveRange(saleParts);

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Sales/ByCustomer/{customerId}
        [HttpGet("ByCustomer/{customerId}")]
        [Produces("application/xml")]
        public async Task<ActionResult> GetSalesByCustomer(int customerId)
        {
            _logger.LogInformation("Getting sales by customer id: {CustomerId}", customerId);
            var sales = await _context.Sales
                .Include(s => s.SaleParts)
                .ThenInclude(sp => sp.Part)
                .Where(s => s.CustomerId == customerId)
                .ToListAsync();

            // Map SaleParts to Parts DTOs for XML serialization
            foreach (var sale in sales)
            {
                sale.Parts = sale.SaleParts.Select(sp => new SalePartDto
                {
                    Id = sp.Part.Id,
                    Name = sp.Part.Name,
                    Price = sp.Price,
                    Quantity = sp.Quantity
                }).ToList();
            }

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new SalesWrapper(sales);
            return Ok(wrapper);
        }

        private bool SaleExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }
    }
}
