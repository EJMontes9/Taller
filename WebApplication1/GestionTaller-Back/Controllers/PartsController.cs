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
    public class PartWrapper
    {
        public Part? Part { get; set; }

        public PartWrapper() { }

        public PartWrapper(Part part)
        {
            Part = part;
        }
    }

    public class PartsWrapper
    {
        public List<PartWrapper> Parts { get; set; } = new List<PartWrapper>();

        public PartsWrapper() { }

        public PartsWrapper(IEnumerable<Part> parts)
        {
            if (parts != null)
            {
                Parts = parts.Select(p => new PartWrapper(p)).ToList();
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PartsController> _logger;

        public PartsController(ApplicationDbContext context, ILogger<PartsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Parts
        [HttpGet]
        [Produces("application/xml")]
        public async Task<ActionResult> GetParts()
        {
            _logger.LogInformation("Getting all parts");
            var parts = await _context.Parts.ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new PartsWrapper(parts);
            return Ok(wrapper);
        }

        // GET: api/Parts/5
        [HttpGet("{id}")]
        [Produces("application/xml")]
        public async Task<ActionResult<Part>> GetPart(int id)
        {
            _logger.LogInformation("Getting part with id {Id}", id);
            var part = await _context.Parts.FindAsync(id);

            if (part == null)
            {
                _logger.LogWarning("Part with id {Id} not found", id);
                return NotFound();
            }

            return part;
        }

        // POST: api/Parts
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<ActionResult<Part>> CreatePart(Part part)
        {
            _logger.LogInformation("Creating new part");
            _context.Parts.Add(part);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPart), new { id = part.Id }, part);
        }

        // PUT: api/Parts/5
        [HttpPut("{id}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> UpdatePart(int id, Part part)
        {
            if (id != part.Id)
            {
                _logger.LogWarning("Part id mismatch: {Id} vs {PartId}", id, part.Id);
                return BadRequest();
            }

            _context.Entry(part).State = EntityState.Modified;

            try
            {
                _logger.LogInformation("Updating part with id {Id}", id);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartExists(id))
                {
                    _logger.LogWarning("Part with id {Id} not found during update", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Parts/5
        [HttpDelete("{id}")]
        [Produces("application/xml")]
        public async Task<IActionResult> DeletePart(int id)
        {
            _logger.LogInformation("Deleting part with id {Id}", id);
            var part = await _context.Parts.FindAsync(id);
            if (part == null)
            {
                _logger.LogWarning("Part with id {Id} not found during delete", id);
                return NotFound();
            }

            _context.Parts.Remove(part);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Parts/LowStock
        [HttpGet("LowStock")]
        [Produces("application/xml")]
        public async Task<ActionResult> GetLowStockParts()
        {
            _logger.LogInformation("Getting parts with low stock");
            var lowStockParts = await _context.Parts
                .Where(p => p.Stock <= p.MinStock)
                .ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new PartsWrapper(lowStockParts);
            return Ok(wrapper);
        }

        private bool PartExists(int id)
        {
            return _context.Parts.Any(e => e.Id == id);
        }
    }
}
