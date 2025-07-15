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
    public class ClienteWrapper
    {
        public Cliente? Cliente { get; set; }

        public ClienteWrapper() { }

        public ClienteWrapper(Cliente cliente)
        {
            Cliente = cliente;
        }
    }

    public class ClientesWrapper
    {
        public List<ClienteWrapper> Clientes { get; set; } = new List<ClienteWrapper>();

        public ClientesWrapper() { }

        public ClientesWrapper(IEnumerable<Cliente> clientes)
        {
            if (clientes != null)
            {
                Clientes = clientes.Select(c => new ClienteWrapper(c)).ToList();
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClientesController> _logger;

        public ClientesController(ApplicationDbContext context, ILogger<ClientesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Clientes
        [HttpGet]
        [Produces("application/xml")]
        public async Task<ActionResult> GetClientes()
        {
            _logger.LogInformation("Getting all clientes");

            // TODO: Implementar procedimiento almacenado sp_GetAllClientes
            // El procedimiento almacenado debe devolver todos los clientes ordenados por apellido y nombre
            // Ejemplo de implementación:
            // EXEC sp_GetAllClientes

            var clientes = await _context.Clientes.ToListAsync();

            // Create a wrapper object to ensure proper XML serialization
            var wrapper = new ClientesWrapper(clientes);
            return Ok(wrapper);
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        [Produces("application/xml")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            _logger.LogInformation("Getting cliente with id {Id}", id);

            // TODO: Implementar procedimiento almacenado sp_GetClienteById
            // El procedimiento almacenado debe devolver un cliente específico por su ID
            // Ejemplo de implementación:
            // EXEC sp_GetClienteById @Id = id

            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                _logger.LogWarning("Cliente with id {Id} not found", id);
                return NotFound();
            }

            return cliente;
        }

        // POST: api/Clientes
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _logger.LogInformation("Creating new cliente");

            // TODO: Implementar procedimiento almacenado sp_CreateCliente
            // El procedimiento almacenado debe crear un nuevo cliente a partir de un XML
            // y devolver el ID generado
            // Ejemplo de implementación:
            // DECLARE @OutputId INT;
            // EXEC sp_CreateCliente @ClienteXml = '<Cliente>...</Cliente>', @OutputId = @OutputId OUTPUT;
            // SELECT @OutputId;

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                _logger.LogWarning("Cliente id mismatch: {Id} vs {ClienteId}", id, cliente.Id);
                return BadRequest();
            }

            // TODO: Implementar procedimiento almacenado sp_UpdateCliente
            // El procedimiento almacenado debe actualizar un cliente existente a partir de un XML
            // Ejemplo de implementación:
            // EXEC sp_UpdateCliente @ClienteXml = '<Cliente><id>1</id>...</Cliente>'

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                _logger.LogInformation("Updating cliente with id {Id}", id);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    _logger.LogWarning("Cliente with id {Id} not found during update", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        [Produces("application/xml")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            _logger.LogInformation("Deleting cliente with id {Id}", id);

            // TODO: Implementar procedimiento almacenado sp_DeleteCliente
            // El procedimiento almacenado debe eliminar un cliente por su ID
            // Ejemplo de implementación:
            // EXEC sp_DeleteCliente @Id = id

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                _logger.LogWarning("Cliente with id {Id} not found during delete", id);
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }
    }
}
