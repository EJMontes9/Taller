using System;
using System.Xml.Serialization;

namespace GestionTaller_Back.Models.DTOs
{
    // Request DTOs
    [Serializable]
    [XmlRoot("LoginRequest")]
    [XmlType("LoginRequest")]
    public class LoginRequestDTO
    {
        [XmlElement("username")]
        public string Username { get; set; } = string.Empty;

        [XmlElement("password")]
        public string Password { get; set; } = string.Empty;
    }

    [Serializable]
    [XmlRoot("RegisterRequest")]
    [XmlType("RegisterRequest")]
    public class RegisterRequestDTO
    {
        [XmlElement("username")]
        public string Username { get; set; } = string.Empty;

        [XmlElement("password")]
        public string Password { get; set; } = string.Empty;

        [XmlElement("name")]
        public string Name { get; set; } = string.Empty;

        [XmlElement("email")]
        public string Email { get; set; } = string.Empty;
    }

    // Response DTOs
    [Serializable]
    [XmlRoot("AuthResponse")]
    [XmlType("AuthResponse")]
    public class AuthResponseDTO
    {
        [XmlElement("success")]
        public bool Success { get; set; }

        [XmlElement("message")]
        public string Message { get; set; } = string.Empty;

        [XmlElement("token")]
        public string Token { get; set; } = string.Empty;

        [XmlElement("user")]
        public UserDTO? User { get; set; }
    }

    [Serializable]
    [XmlRoot("User")]
    [XmlType("User")]
    public class UserDTO
    {
        [XmlElement("username")]
        public string Username { get; set; } = string.Empty;

        [XmlElement("name")]
        public string Name { get; set; } = string.Empty;

        [XmlElement("email")]
        public string Email { get; set; } = string.Empty;

        [XmlElement("role")]
        public string Role { get; set; } = string.Empty;
    }
}
