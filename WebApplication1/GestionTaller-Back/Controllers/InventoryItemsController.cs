﻿using System;
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
    public class InventoryItemWrapper
    {
        public InventoryItem? InventoryItem { get; set; }

        public InventoryItemWrapper() { }

        public InventoryItemWrapper(InventoryItem item)
        {
            InventoryItem = item;
        }
    }

    public class InventoryItemsWrapper
    {
        public List<InventoryItemWrapper> InventoryItems { get; set; } = new List<InventoryItemWrapper>();

        public InventoryItemsWrapper() { }

        public InventoryItemsWrapper(IEnumerable<InventoryItem> items)
        {
            if (items != null)
            {
                InventoryItems = items.Select(i => new InventoryItemWrapper(i)).ToList();
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class InventoryItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InventoryItemsController> _logger;

        public InventoryItemsController(ApplicationDbContext context, ILogger<InventoryItemsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/InventoryItems
        [HttpGet]
        [Produces("application/xml")]
        public async Task<ActionResult> GetInventoryItems()
        {
            _logger.LogInformation("Getting all inventory items");
            var items = await _context.InventoryItems.ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new InventoryItemsWrapper(items);
            return Ok(wrapper);
        }

        // GET: api/InventoryItems/5
        [HttpGet("{id}")]
        [Produces("application/xml")]
        public async Task<ActionResult<InventoryItem>> GetInventoryItem(int id)
        {
            _logger.LogInformation("Getting inventory item with id {Id}", id);
            var inventoryItem = await _context.InventoryItems.FindAsync(id);

            if (inventoryItem == null)
            {
                _logger.LogWarning("Inventory item with id {Id} not found", id);
                return NotFound();
            }

            return inventoryItem;
        }

        // POST: api/InventoryItems
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<ActionResult<InventoryItem>> CreateInventoryItem(InventoryItem inventoryItem)
        {
            _logger.LogInformation("Creating new inventory item");
            _context.InventoryItems.Add(inventoryItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryItem), new { id = inventoryItem.Id }, inventoryItem);
        }

        // PUT: api/InventoryItems/5
        [HttpPut("{id}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> UpdateInventoryItem(int id, InventoryItem inventoryItem)
        {
            if (id != inventoryItem.Id)
            {
                _logger.LogWarning("Inventory item id mismatch: {Id} vs {ItemId}", id, inventoryItem.Id);
                return BadRequest();
            }

            _context.Entry(inventoryItem).State = EntityState.Modified;

            try
            {
                _logger.LogInformation("Updating inventory item with id {Id}", id);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryItemExists(id))
                {
                    _logger.LogWarning("Inventory item with id {Id} not found during update", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/InventoryItems/5
        [HttpDelete("{id}")]
        [Produces("application/xml")]
        public async Task<IActionResult> DeleteInventoryItem(int id)
        {
            _logger.LogInformation("Deleting inventory item with id {Id}", id);
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                _logger.LogWarning("Inventory item with id {Id} not found during delete", id);
                return NotFound();
            }

            _context.InventoryItems.Remove(inventoryItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/InventoryItems/ByCategory/{category}
        [HttpGet("ByCategory/{category}")]
        [Produces("application/xml")]
        public async Task<ActionResult> GetInventoryItemsByCategory(string category)
        {
            _logger.LogInformation("Getting inventory items by category: {Category}", category);
            var items = await _context.InventoryItems
                .Where(i => i.Category.ToLower() == category.ToLower())
                .ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new InventoryItemsWrapper(items);
            return Ok(wrapper);
        }

        private bool InventoryItemExists(int id)
        {
            return _context.InventoryItems.Any(e => e.Id == id);
        }
    }
}
