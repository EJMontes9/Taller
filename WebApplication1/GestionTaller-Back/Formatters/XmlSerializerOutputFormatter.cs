using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using GestionTaller_Back.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

namespace GestionTaller_Back.Formatters
{
    public class XmlSerializerOutputFormatter : TextOutputFormatter
    {
        public XmlSerializerOutputFormatter()
        {
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/xml"));
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/xml"));

            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
        }

        protected override bool CanWriteType(Type? type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            // We can handle ProblemDetails and ValidationProblemDetails with our custom serializer
            if (typeof(ProblemDetails).IsAssignableFrom(type))
            {
                return true;
            }

            // For other types, we'll use the standard XmlSerializer
            return true;
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            if (selectedEncoding == null)
                throw new ArgumentNullException(nameof(selectedEncoding));

            var response = context.HttpContext.Response;

            string xmlString;

            // Special handling for ProblemDetails and ValidationProblemDetails
            if (context.Object is ProblemDetails problemDetails)
            {
                xmlString = SerializeProblemDetails(problemDetails);
            }
            // Check if the value is a collection
            else if (context.Object is IEnumerable enumerable && !(context.Object is string))
            {
                // Get the element type of the collection
                Type elementType = context.ObjectType.GetElementType();
                if (elementType == null && context.ObjectType.IsGenericType)
                {
                    elementType = context.ObjectType.GetGenericArguments()[0];
                }

                // If we can determine the element type, use our custom serializer for collections
                if (elementType != null)
                {
                    // Use reflection to call the generic SerializeList method
                    var method = typeof(XmlHelper).GetMethod("SerializeList");
                    var genericMethod = method.MakeGenericMethod(elementType);

                    // Get the root element name from the element type
                    string rootElementName = elementType.Name + "s";

                    xmlString = (string)genericMethod.Invoke(null, new object[] { enumerable, rootElementName });
                }
                else
                {
                    // Fallback to standard serialization
                    xmlString = XmlHelper.Serialize(context.Object);
                }
            }
            else
            {
                // For single objects, use the standard serializer
                xmlString = XmlHelper.Serialize(context.Object);
            }

            await response.WriteAsync(xmlString, selectedEncoding);
        }

        private string SerializeProblemDetails(ProblemDetails problemDetails)
        {
            // Create a simple XML representation of ProblemDetails
            var sb = new StringBuilder();
            sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.AppendLine("<ProblemDetails>");

            if (!string.IsNullOrEmpty(problemDetails.Title))
                sb.AppendLine($"  <Title>{System.Security.SecurityElement.Escape(problemDetails.Title)}</Title>");

            if (!string.IsNullOrEmpty(problemDetails.Detail))
                sb.AppendLine($"  <Detail>{System.Security.SecurityElement.Escape(problemDetails.Detail)}</Detail>");

            if (!string.IsNullOrEmpty(problemDetails.Type))
                sb.AppendLine($"  <Type>{System.Security.SecurityElement.Escape(problemDetails.Type)}</Type>");

            if (!string.IsNullOrEmpty(problemDetails.Instance))
                sb.AppendLine($"  <Instance>{System.Security.SecurityElement.Escape(problemDetails.Instance)}</Instance>");

            if (problemDetails.Status.HasValue)
                sb.AppendLine($"  <Status>{problemDetails.Status.Value}</Status>");

            // Handle ValidationProblemDetails
            if (problemDetails is ValidationProblemDetails validationProblemDetails && validationProblemDetails.Errors?.Count > 0)
            {
                sb.AppendLine("  <Errors>");
                foreach (var error in validationProblemDetails.Errors)
                {
                    sb.AppendLine($"    <Error Key=\"{System.Security.SecurityElement.Escape(error.Key)}\">");
                    foreach (var message in error.Value)
                    {
                        sb.AppendLine($"      <Message>{System.Security.SecurityElement.Escape(message)}</Message>");
                    }
                    sb.AppendLine("    </Error>");
                }
                sb.AppendLine("  </Errors>");
            }

            // Handle additional properties
            if (problemDetails.Extensions?.Count > 0)
            {
                sb.AppendLine("  <Extensions>");
                foreach (var extension in problemDetails.Extensions)
                {
                    sb.AppendLine($"    <Extension Key=\"{System.Security.SecurityElement.Escape(extension.Key)}\">");
                    sb.AppendLine($"      <Value>{System.Security.SecurityElement.Escape(extension.Value?.ToString() ?? string.Empty)}</Value>");
                    sb.AppendLine("    </Extension>");
                }
                sb.AppendLine("  </Extensions>");
            }

            sb.AppendLine("</ProblemDetails>");
            return sb.ToString();
        }
    }
}
