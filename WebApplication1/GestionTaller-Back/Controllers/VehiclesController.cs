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
    public class VehicleWrapper
    {
        public Vehicle? Vehicle { get; set; }

        public VehicleWrapper() { }

        public VehicleWrapper(Vehicle vehicle)
        {
            Vehicle = vehicle;
        }
    }

    public class VehiclesWrapper
    {
        public List<VehicleWrapper> Vehicles { get; set; } = new List<VehicleWrapper>();

        public VehiclesWrapper() { }

        public VehiclesWrapper(IEnumerable<Vehicle> vehicles)
        {
            if (vehicles != null)
            {
                Vehicles = vehicles.Select(v => new VehicleWrapper(v)).ToList();
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<VehiclesController> _logger;

        public VehiclesController(ApplicationDbContext context, ILogger<VehiclesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Vehicles
        [HttpGet]
        [Produces("application/xml")]
        public async Task<ActionResult> GetVehicles()
        {
            _logger.LogInformation("Getting all vehicles");
            var vehicles = await _context.Vehicles.ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new VehiclesWrapper(vehicles);
            return Ok(wrapper);
        }

        // GET: api/Vehicles/5
        [HttpGet("{id}")]
        [Produces("application/xml")]
        public async Task<ActionResult<Vehicle>> GetVehicle(int id)
        {
            _logger.LogInformation("Getting vehicle with id {Id}", id);
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
            {
                _logger.LogWarning("Vehicle with id {Id} not found", id);
                return NotFound();
            }

            return vehicle;
        }

        // POST: api/Vehicles
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
        {
            _logger.LogInformation("Creating new vehicle");
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }

        // PUT: api/Vehicles/5
        [HttpPut("{id}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> UpdateVehicle(int id, Vehicle vehicle)
        {
            if (id != vehicle.Id)
            {
                _logger.LogWarning("Vehicle id mismatch: {Id} vs {VehicleId}", id, vehicle.Id);
                return BadRequest();
            }

            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                _logger.LogInformation("Updating vehicle with id {Id}", id);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
                {
                    _logger.LogWarning("Vehicle with id {Id} not found during update", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id}")]
        [Produces("application/xml")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            _logger.LogInformation("Deleting vehicle with id {Id}", id);
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                _logger.LogWarning("Vehicle with id {Id} not found during delete", id);
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehicleExists(int id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }
    }
}
