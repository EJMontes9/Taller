import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Define interfaces for the inventory models
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  status: string;
  vin: string;
}

export interface Part {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  location: string;
  purchaseDate: Date;
  purchasePrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
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
      if (obj.hasOwnProperty(prop) && prop !== 'id') {
        const value = obj[prop];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            xml += `<${prop}>${this.jsonToXml(value, '')}</${prop}>`;
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

  // Vehicles API
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get(`${this.apiUrl}/vehicles`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        return parsed.Vehicles?.Vehicle || [];
      }),
      catchError(error => {
        console.error('Error fetching vehicles', error);
        return [];
      })
    );
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get(`${this.apiUrl}/vehicles/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Vehicle),
      catchError(error => {
        console.error(`Error fetching vehicle ${id}`, error);
        throw error;
      })
    );
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const xml = this.jsonToXml(vehicle, 'Vehicle');
    return this.http.post(`${this.apiUrl}/vehicles`, xml, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Vehicle),
      catchError(error => {
        console.error('Error creating vehicle', error);
        throw error;
      })
    );
  }

  updateVehicle(vehicle: Vehicle): Observable<any> {
    const xml = this.jsonToXml(vehicle, 'Vehicle');
    return this.http.put(`${this.apiUrl}/vehicles/${vehicle.id}`, xml, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error updating vehicle ${vehicle.id}`, error);
        throw error;
      })
    );
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicles/${id}`, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error deleting vehicle ${id}`, error);
        throw error;
      })
    );
  }

  // Parts API
  getParts(): Observable<Part[]> {
    return this.http.get(`${this.apiUrl}/parts`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        return parsed.Parts?.Part || [];
      }),
      catchError(error => {
        console.error('Error fetching parts', error);
        return [];
      })
    );
  }

  getPart(id: number): Observable<Part> {
    return this.http.get(`${this.apiUrl}/parts/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Part),
      catchError(error => {
        console.error(`Error fetching part ${id}`, error);
        throw error;
      })
    );
  }

  createPart(part: Part): Observable<Part> {
    const xml = this.jsonToXml(part, 'Part');
    return this.http.post(`${this.apiUrl}/parts`, xml, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Part),
      catchError(error => {
        console.error('Error creating part', error);
        throw error;
      })
    );
  }

  updatePart(part: Part): Observable<any> {
    const xml = this.jsonToXml(part, 'Part');
    return this.http.put(`${this.apiUrl}/parts/${part.id}`, xml, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error updating part ${part.id}`, error);
        throw error;
      })
    );
  }

  deletePart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/parts/${id}`, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error deleting part ${id}`, error);
        throw error;
      })
    );
  }

  getLowStockParts(): Observable<Part[]> {
    return this.http.get(`${this.apiUrl}/parts/lowstock`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        return parsed.Parts?.Part || [];
      }),
      catchError(error => {
        console.error('Error fetching low stock parts', error);
        return [];
      })
    );
  }

  // Inventory Items API
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get(`${this.apiUrl}/inventoryitems`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        return parsed.InventoryItems?.InventoryItem || [];
      }),
      catchError(error => {
        console.error('Error fetching inventory items', error);
        return [];
      })
    );
  }

  getInventoryItem(id: number): Observable<InventoryItem> {
    return this.http.get(`${this.apiUrl}/inventoryitems/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).InventoryItem),
      catchError(error => {
        console.error(`Error fetching inventory item ${id}`, error);
        throw error;
      })
    );
  }

  createInventoryItem(item: InventoryItem): Observable<InventoryItem> {
    const xml = this.jsonToXml(item, 'InventoryItem');
    return this.http.post(`${this.apiUrl}/inventoryitems`, xml, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).InventoryItem),
      catchError(error => {
        console.error('Error creating inventory item', error);
        throw error;
      })
    );
  }

  updateInventoryItem(item: InventoryItem): Observable<any> {
    const xml = this.jsonToXml(item, 'InventoryItem');
    return this.http.put(`${this.apiUrl}/inventoryitems/${item.id}`, xml, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error updating inventory item ${item.id}`, error);
        throw error;
      })
    );
  }

  deleteInventoryItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/inventoryitems/${id}`, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error deleting inventory item ${id}`, error);
        throw error;
      })
    );
  }

  getInventoryItemsByCategory(category: string): Observable<InventoryItem[]> {
    return this.http.get(`${this.apiUrl}/inventoryitems/bycategory/${category}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        return parsed.InventoryItems?.InventoryItem || [];
      }),
      catchError(error => {
        console.error(`Error fetching inventory items by category ${category}`, error);
        return [];
      })
    );
  }
}
