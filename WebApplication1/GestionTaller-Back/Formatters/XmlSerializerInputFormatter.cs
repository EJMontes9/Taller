using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using GestionTaller_Back.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

namespace GestionTaller_Back.Formatters
{
    public class XmlSerializerInputFormatter : TextInputFormatter
    {
        public XmlSerializerInputFormatter()
        {
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/xml"));
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/xml"));

            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
        }

        public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context, Encoding encoding)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            if (encoding == null)
                throw new ArgumentNullException(nameof(encoding));

            var request = context.HttpContext.Request;

            using var reader = new StreamReader(request.Body, encoding);
            var xmlString = await reader.ReadToEndAsync();

            if (string.IsNullOrEmpty(xmlString))
            {
                return InputFormatterResult.NoValue();
            }

            try
            {
                var result = XmlHelperExtensions.Deserialize(xmlString, context.ModelType);
                return InputFormatterResult.Success(result);
            }
            catch (Exception ex)
            {
                context.ModelState.AddModelError("XML", $"Error deserializing XML: {ex.Message}");
                return InputFormatterResult.Failure();
            }
        }

        protected override bool CanReadType(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return true;
        }
    }

    // Helper method for non-generic deserialization
    public static class XmlHelperExtensions
    {
        public static object? Deserialize(string xml, Type type)
        {
            if (string.IsNullOrEmpty(xml))
                return null;

            try
            {
                using var stringReader = new StringReader(xml);
                var serializer = new XmlSerializer(type);
                return serializer.Deserialize(stringReader);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deserializing XML to object: {ex.Message}", ex);
            }
        }
    }
}
