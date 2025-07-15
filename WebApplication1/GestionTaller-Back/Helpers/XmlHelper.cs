using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using GestionTaller_Back.Models;
using GestionTaller_Back.Models.DTOs;
using GestionTaller_Back.Controllers;

namespace GestionTaller_Back.Helpers
{
    public static class XmlHelper
    {
        /// <summary>
        /// Serializes an object to XML string
        /// </summary>
        public static string Serialize<T>(T obj) where T : class
        {
            if (obj == null)
                return string.Empty;

            try
            {
                using var stringWriter = new StringWriter();
                using var xmlWriter = XmlWriter.Create(stringWriter, new XmlWriterSettings { Indent = true });

                // Crear un serializador con conocimiento de tipos adicionales
                XmlSerializer serializer;

                // Si estamos serializando un tipo que podría contener Vehicle u otros tipos de inventario
                if (typeof(T) == typeof(object) || typeof(IEnumerable).IsAssignableFrom(typeof(T)))
                {
                    var knownTypes = new Type[] { 
                        typeof(Vehicle), 
                        typeof(Part), 
                        typeof(InventoryItem),
                        typeof(Cliente),
                        typeof(User),
                        // Auth DTOs
                        typeof(AuthResponseDTO),
                        typeof(UserDTO),
                        typeof(LoginRequestDTO),
                        typeof(RegisterRequestDTO),
                        // Wrapper classes from controllers
                        typeof(VehicleWrapper),
                        typeof(VehiclesWrapper),
                        typeof(PartWrapper),
                        typeof(PartsWrapper),
                        typeof(InventoryItemWrapper),
                        typeof(InventoryItemsWrapper),
                        typeof(ClienteWrapper),
                        typeof(ClientesWrapper)
                    };

                    serializer = new XmlSerializer(typeof(T), knownTypes);
                }
                else
                {
                    serializer = new XmlSerializer(typeof(T));
                }

                var namespaces = new XmlSerializerNamespaces();
                namespaces.Add(string.Empty, string.Empty); // Remove namespaces

                serializer.Serialize(xmlWriter, obj, namespaces);
                return stringWriter.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error serializing object to XML: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Deserializes an XML string to an object
        /// </summary>
        public static T? Deserialize<T>(string xml) where T : class
        {
            if (string.IsNullOrEmpty(xml))
                return null;

            try
            {
                using var stringReader = new StringReader(xml);
                var serializer = new XmlSerializer(typeof(T));
                return serializer.Deserialize(stringReader) as T;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deserializing XML to object: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Serializes a collection to XML string
        /// </summary>
        public static string SerializeList<T>(IEnumerable<T> list, string rootElementName = "Items") where T : class
        {
            if (list == null)
                return string.Empty;

            try
            {
                // Create a wrapper class to hold the collection with a custom root element name
                var wrapper = new XmlSerializerWrapper<T>(list, rootElementName);

                using var stringWriter = new StringWriter();
                using var xmlWriter = XmlWriter.Create(stringWriter, new XmlWriterSettings { Indent = true });

                // Crear un serializador con conocimiento de tipos adicionales
                XmlSerializer serializer;

                // Incluir tipos conocidos para evitar errores de serialización
                var knownTypes = new Type[] { 
                    typeof(Vehicle), 
                    typeof(Part), 
                    typeof(InventoryItem),
                    typeof(Cliente),
                    typeof(User),
                    typeof(XmlSerializerWrapper<T>),
                    // Auth DTOs
                    typeof(AuthResponseDTO),
                    typeof(UserDTO),
                    typeof(LoginRequestDTO),
                    typeof(RegisterRequestDTO),
                    // Wrapper classes from controllers
                    typeof(VehicleWrapper),
                    typeof(VehiclesWrapper),
                    typeof(PartWrapper),
                    typeof(PartsWrapper),
                    typeof(InventoryItemWrapper),
                    typeof(InventoryItemsWrapper),
                    typeof(ClienteWrapper),
                    typeof(ClientesWrapper)
                };

                serializer = new XmlSerializer(typeof(XmlSerializerWrapper<T>), knownTypes);
                var namespaces = new XmlSerializerNamespaces();
                namespaces.Add(string.Empty, string.Empty); // Remove namespaces

                serializer.Serialize(xmlWriter, wrapper, namespaces);
                return stringWriter.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error serializing list to XML: {ex.Message}", ex);
            }
        }
    }

    /// <summary>
    /// Helper class for serializing collections with custom root element name
    /// </summary>
    [XmlRoot("Root")]
    public class XmlSerializerWrapper<T> where T : class
    {
        [XmlArray]
        public List<T> Items { get; set; }

        public XmlSerializerWrapper() 
        {
            Items = new List<T>();
        }

        public XmlSerializerWrapper(IEnumerable<T> items, string rootElementName)
        {
            Items = new List<T>(items);

            // Set the root element name dynamically
            var attributes = this.GetType().GetCustomAttributes(typeof(XmlRootAttribute), true);
            if (attributes.Length > 0)
            {
                var rootAttr = attributes[0] as XmlRootAttribute;
                if (rootAttr != null)
                {
                    rootAttr.ElementName = rootElementName;
                }
            }
        }
    }
}
