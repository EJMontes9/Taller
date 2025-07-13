using GestionTaller_Back.Data;
using GestionTaller_Back.Models;
using GestionTaller_Back.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GestionTaller_Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginRequestDTO loginRequest)
        {
            _logger.LogInformation("Login attempt for user: {Username}", loginRequest.Username);

            // Find user by username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

            if (user == null)
            {
                _logger.LogWarning("Login failed: User {Username} not found", loginRequest.Username);
                return Unauthorized(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid username or password"
                });
            }

            // Verify password
            if (!VerifyPassword(loginRequest.Password, user.PasswordHash))
            {
                _logger.LogWarning("Login failed: Invalid password for user {Username}", loginRequest.Username);
                return Unauthorized(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid username or password"
                });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            _logger.LogInformation("Login successful for user: {Username}", loginRequest.Username);

            // Return successful response with token
            return Ok(new AuthResponseDTO
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = new UserDTO
                {
                    Username = user.Username,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegisterRequestDTO registerRequest)
        {
            _logger.LogInformation("Registration attempt for user: {Username}", registerRequest.Username);

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == registerRequest.Username))
            {
                _logger.LogWarning("Registration failed: Username {Username} already exists", registerRequest.Username);
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Username already exists"
                });
            }

            // Create new user
            var user = new User
            {
                Username = registerRequest.Username,
                PasswordHash = HashPassword(registerRequest.Password),
                Name = registerRequest.Name,
                Email = registerRequest.Email,
                Role = "user" // Default role for new users
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user);

            _logger.LogInformation("Registration successful for user: {Username}", registerRequest.Username);

            // Return successful response with token
            return Ok(new AuthResponseDTO
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = new UserDTO
                {
                    Username = user.Username,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.GivenName, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryInMinutes"])),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == storedHash;
        }
    }
}