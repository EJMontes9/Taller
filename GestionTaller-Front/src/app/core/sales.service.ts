import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Define interfaces for the sales models
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
  price: number;
}

export interface Part {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: number;
  date: Date;
  customerId: number;
  vehicleId?: number;
  parts?: Part[];
  total: number;
  status: string;
  paymentMethod: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = environment.apiUrl;
  private xmlHeaders = new HttpHeaders({
    'Content-Type': 'application/xml',
    'Accept': 'application/xml'
  });

  constructor(private http: HttpClient) { }

  // XML parser helper
  private parseXml(xml: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    return this.xmlToJson(xmlDoc);
  }

  // Convert XML to JSON
  private xmlToJson(xml: Document | Element): any {
    // Define result with index signature to allow dynamic property access
    const result: { [key: string]: any } = {};

    // Check if the node is an Element (not a Document) before accessing attributes
    if (xml.nodeType === Node.ELEMENT_NODE && 'attributes' in xml) {
      const element = xml as Element;
      if (element.attributes && element.attributes.length > 0) {
        for (let i = 0; i < element.attributes.length; i++) {
          const attribute = element.attributes[i];
          result[attribute.nodeName] = attribute.nodeValue;
        }
      }
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (nodeName === '#text') {
          // Add null check for nodeValue
          if (item.nodeValue && item.nodeValue.trim() !== '') {
            return item.nodeValue;
          }
        } else {
          const obj = this.xmlToJson(item as Element);

          if (result[nodeName]) {
            if (!Array.isArray(result[nodeName])) {
              result[nodeName] = [result[nodeName]];
            }
            result[nodeName].push(obj);
          } else {
            result[nodeName] = obj;
          }
        }
      }
    }

    return result;
  }

  // Convert JSON to XML
  private jsonToXml(obj: any, rootName: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?><${rootName}>`;

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        const value = obj[prop];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            if (Array.isArray(value)) {
              // Handle arrays
              for (const item of value) {
                xml += `<${prop}>${this.jsonToXml(item, '')}</${prop}>`;
              }
            } else {
              xml += `<${prop}>${this.jsonToXml(value, '')}</${prop}>`;
            }
          } else {
            let formattedValue = value;
            if (value instanceof Date) {
              formattedValue = value.toISOString();
            }
            xml += `<${prop}>${formattedValue}</${prop}>`;
          }
        }
      }
    }

    xml += `</${rootName}>`;
    return xml;
  }

  // Customers API
  getCustomers(): Observable<Customer[]> {
    return this.http.get(`${this.apiUrl}/clientes`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        console.log('Parsed Customers XML:', parsed);

        // Navigate through the nested structure
        if (parsed.anyType && parsed.anyType.Clientes && parsed.anyType.Clientes.ClienteWrapper) {
          return parsed.anyType.Clientes.ClienteWrapper.map((wrapper: any) => wrapper.Cliente);
        }

        // Fallback to the original path in case the structure changes
        return parsed.Clientes?.Cliente || [];
      }),
      catchError(error => {
        console.error('Error fetching customers', error);
        return [];
      })
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get(`${this.apiUrl}/clientes/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Cliente),
      catchError(error => {
        console.error(`Error fetching customer ${id}`, error);
        throw error;
      })
    );
  }

  // Sales API
  getSales(): Observable<Sale[]> {
    return this.http.get(`${this.apiUrl}/sales`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        console.log('Parsed Sales XML:', parsed);

        // Navigate through the nested structure
        if (parsed.anyType && parsed.anyType.Sales && parsed.anyType.Sales.SaleWrapper) {
          return parsed.anyType.Sales.SaleWrapper.map((wrapper: any) => wrapper.Sale);
        }

        // Fallback to the original path in case the structure changes
        return parsed.Sales?.Sale || [];
      }),
      catchError(error => {
        console.error('Error fetching sales', error);
        return [];
      })
    );
  }

  getSale(id: number): Observable<Sale> {
    return this.http.get(`${this.apiUrl}/sales/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Sale),
      catchError(error => {
        console.error(`Error fetching sale ${id}`, error);
        throw error;
      })
    );
  }

  createSale(sale: Sale): Observable<Sale> {
    const xml = this.jsonToXml(sale, 'Sale');
    return this.http.post(`${this.apiUrl}/sales`, xml, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Sale),
      catchError(error => {
        console.error('Error creating sale', error);
        throw error;
      })
    );
  }

  updateSale(sale: Sale): Observable<any> {
    const xml = this.jsonToXml(sale, 'Sale');
    return this.http.put(`${this.apiUrl}/sales/${sale.id}`, xml, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error updating sale ${sale.id}`, error);
        throw error;
      })
    );
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sales/${id}`, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error deleting sale ${id}`, error);
        throw error;
      })
    );
  }

  // Get vehicles from inventory service
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get(`${this.apiUrl}/vehicles`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        console.log('Parsed Vehicles XML:', parsed);

        // Navigate through the nested structure
        if (parsed.anyType && parsed.anyType.Vehicles && parsed.anyType.Vehicles.VehicleWrapper) {
          return parsed.anyType.Vehicles.VehicleWrapper.map((wrapper: any) => wrapper.Vehicle);
        }

        // Fallback to the original path in case the structure changes
        return parsed.Vehicles?.Vehicle || [];
      }),
      catchError(error => {
        console.error('Error fetching vehicles', error);
        return [];
      })
    );
  }

  // Get parts from inventory service
  getParts(): Observable<Part[]> {
    return this.http.get(`${this.apiUrl}/parts`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        console.log('Parsed Parts XML:', parsed);

        // Navigate through the nested structure
        if (parsed.anyType && parsed.anyType.Parts && parsed.anyType.Parts.PartWrapper) {
          return parsed.anyType.Parts.PartWrapper.map((wrapper: any) => wrapper.Part);
        }

        // Fallback to the original path in case the structure changes
        return parsed.Parts?.Part || [];
      }),
      catchError(error => {
        console.error('Error fetching parts', error);
        return [];
      })
    );
  }
}