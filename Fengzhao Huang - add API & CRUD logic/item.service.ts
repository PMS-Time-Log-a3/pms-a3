import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { map, Observable } from "rxjs";

export type ItemCategory = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

// Interface for item
export interface Item {
  item_id?: number;
  item_name: string;
  category: ItemCategory;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: StockStatus;
  featured_item: number;
  special_note?: string;
}

@Injectable()
export class ItemService {
  private readonly endpoint = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Adds a new item to the beginning of the inventory list.
   * @param item - The item to be added.
   */
  createNewItem (item: Item) : Observable<Item> {
    return this.httpClient.post<Item>(`${this.endpoint}/`, item)
	}

  /**
   * Updates an existing item in the inventory based on itemID.
   * @param item - The updated item details.
   */
  updateItem (item: Item) : Observable<Item> {
    return this.httpClient.put<Item>(`${this.endpoint}/${encodeURIComponent(item.item_name)}`, {
      ...item
    })
  }

  /**
   * Retrieves all items in the inventory.
   * @returns An array of all items.
   */
  getAllItems() : Observable<Item[]>
  {
    return this.httpClient.get<Item[]>(this.endpoint)
  }

  /**
   * Retrieves all featured items from the inventory.
   * @returns An array of featured items.
   */
  getFeaturedItems() : Observable<Item[]>
  {
    return this.getAllItems()
      .pipe(
        map(response => response.filter(item => item.featured_item === 1)),
      )
  }

  /**
   * Searches for items by name (case insensitive, trims spaces).
   * @param name - The name to search for.
   * @returns An array of matching items.
   */
	searchItem (name: string) : Observable<Item[]> {
    return this.httpClient.get<Item | Item[]>(`${this.endpoint}/${encodeURIComponent(name.trim())}`)
      .pipe(
        map(response => Array.isArray(response) ? response : [response])
      )
	}

  /**
   * Deletes an item from the inventory by its ID.
   * @param name - The item name of the item to be deleted.
   */
  doDelete (name: string) : Observable<any> {
    return this.httpClient.delete<any>(`${this.endpoint}/${encodeURIComponent(name)}`)
  }
}
