import {Component} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Item, ItemCategory, ItemService, StockStatus} from "../item.service";
import {ToastController} from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {
  // Form fields
  id: string = "";
  name: string = "";
  category: ItemCategory | "" = "";
  quantity: string = "";
  price: string = "";
  supplierName: string = "";
  stockStatus: StockStatus | "" = "";
  featuredItem: string = "";
  specialNote: string = "";
  isAdd: boolean = true; // Flag to check if adding or editing
  private currentEditName: string = "";

  constructor (
    private ItemService : ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ){
    // Subscribe to URL parameters to detect if we are editing an item
    this.route.params
      .subscribe((params: any) => {
          this.preparePage(params.name)
        }
      );
  }

  ionViewWillEnter(): void {
    this.preparePage(this.route.snapshot.paramMap.get('name'))
  }

  private preparePage(name: string | null | undefined): void {
    if (name) {
      this.isAdd = false;

      if (this.currentEditName !== name || !this.name) {
        this.currentEditName = name;
        this.loadItemForEdit(name);
      }
    } else {
      this.resetField();
    }
  }

  private loadItemForEdit(name: string): void {
    this.ItemService.searchItem(name).subscribe(data => {
      if (data.length > 0) {
        this.fillForm(data[0])
      }
    })
  }

  private fillForm(item: Item): void {
    this.id = String(item.item_id);
    this.name = item.item_name;
    this.category = item.category;
    this.quantity = String(item.quantity);
    this.price = String(item.price);
    this.supplierName = item.supplier_name;
    this.stockStatus = item.stock_status;
    this.featuredItem = String(item.featured_item);
    this.specialNote = item.special_note || "";
  }

  // Called on form submit to either add or edit an item
  saveItem(): void {

    // Basic form validations
    if (this.name == ""){
      this.presentToast("bottom", "Please input item name")
      return;
    }

    if (this.category == ""){
      this.presentToast("bottom", "Please select category")
      return;
    }

    if (this.quantity == ""){
      this.presentToast("bottom", "Please input quantity")
      return;
    }

    if (!/^(0|[1-9]\d*)$/.test(this.quantity)){
      this.presentToast("bottom", "Quantity is not a valid positive integer")
      return;
    }

    if (this.price == ""){
      this.presentToast("bottom", "Please input price")
      return;
    }

    if (!/^(0|[1-9]\d*)$/.test(this.price)){
      this.presentToast("bottom", "Price must be a positive integer")
      return;
    }

    if (this.supplierName == ""){
      this.presentToast("bottom", "Please input supplier name")
      return;
    }

    if (this.stockStatus == ""){
      this.presentToast("bottom", "Please select stock status")
      return;
    }

    if (this.featuredItem == ""){
      this.presentToast("bottom", "Please select featured item")
      return;
    }

    // Construct Item object from form fields
    const Item: Item = {
      item_name: this.name,
      category: this.category,
      quantity: Number(this.quantity),
      price: Number(this.price),
      supplier_name: this.supplierName,
      stock_status: this.stockStatus,
      featured_item: Number(this.featuredItem),
      special_note: this.specialNote,
    };

    if (this.isAdd) {
      // Check item name unique
      this.ItemService.searchItem(Item.item_name).subscribe(data => {
        if (data.length > 0) {
          this.presentToast("bottom", "Please input unique item name")
        } else {
          // If it's a new item, call create API
          this.ItemService.createNewItem(Item).subscribe(() => {
            this.presentToast("bottom", "Add success");
            this.resetField();  // Reset the form
            this.router.navigate(['/tabs/list']); // Navigate back to list
          })
        }
      })
    } else {
      // If editing an existing item, call update API
      this.ItemService.updateItem(Item).subscribe(() => {
        this.presentToast("bottom", "Edit success");
        this.resetField();  // Reset the form
        this.router.navigate(['/tabs/list']);
      })
    }
  }

  setCategory(value: string | null | undefined): void {
    this.category = (value || "") as ItemCategory | "";
  }

  setStockStatus(value: string | null | undefined): void {
    this.stockStatus = (value || "") as StockStatus | "";
  }

  // Navigate back to the item list
  goToBack() {
    this.router.navigate(['/tabs/list']);
    this.resetField();
  }

  // Show toast message at specified position
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      cssClass: 'hint-toast',
      position: position,
    });

    await toast.present();
  }


  // Reset field value
  resetField(): void {
    this.id = "";
    this.name = "";
    this.category = "";
    this.quantity = "";
    this.price = "";
    this.supplierName = "";
    this.stockStatus = "";
    this.featuredItem = "";
    this.specialNote = "";
    this.isAdd = true;
    this.currentEditName = "";
  }
}
