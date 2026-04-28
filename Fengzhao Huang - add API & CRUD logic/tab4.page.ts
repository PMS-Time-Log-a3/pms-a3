import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item, ItemService } from '../item.service';
import { IonicModule } from "@ionic/angular";
import { ToastController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab4Page implements OnInit {
  data : null | Item = null // Item result of a successful search
  searchName: string = "" // The name input by user for search
  searched : boolean = false // Tracks if a search has been performed
  loading: boolean = false // Loading flag to show spinner while searching

  constructor (
    private ItemService:ItemService,
    private toastController: ToastController) {
  }

  // Lifecycle hook
  ngOnInit(): void {}

  // Triggered when user clicks "Search"
  searchItem(): void {
    if (this.searchName.trim()) {
      this.data = null // Reset previous result
      this.searched = true; // Mark that a search was performed
      this.loading = true // Show loading spinner

      // Call service to search item by name
      this.ItemService.searchItem(this.searchName).subscribe(data => {
        this.loading = false // Hide loading spinner

        // If item is found, assign first result; otherwise set to null
        this.data = data.length > 0 ? data[0] : null
      })
    } else {
      // Show toast if search input is empty
      this.presentToast('bottom')
    }
  }


  // Show toast message when search input is empty
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Please input search name',
      duration: 1500,
      cssClass: 'hint-toast',
      position: position,
    });

    await toast.present();
  }
}
