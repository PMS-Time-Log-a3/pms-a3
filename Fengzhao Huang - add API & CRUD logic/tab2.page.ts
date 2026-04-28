import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { Item, ItemService } from '../item.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ToastController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class Tab2Page {
  // All items fetched from backend
  data : Item[];

  // Button configuration for delete alerts
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {  }
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {  }
    }
  ];

  // Loading flag to show/hide loading indicators
  loading: boolean = false

  constructor (
    private ItemService: ItemService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ){
    this.data = []

    // Subscribe to router navigation events
    // This ensures data is reloaded each time user navigates to '/tabs/list'
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        if (event.url === '/tabs/list') {
          this.scheduleLoadItems()
        }
      }
    });
  }

  ionViewWillEnter(): void {
    this.scheduleLoadItems()
  }

  private scheduleLoadItems(): void {
    setTimeout(() => this.loadItems(), 0)
  }

  // Loads the complete inventory list from the remote API.
  loadItems(): void {
    this.loading = true
    this.ItemService.getAllItems().subscribe({
      next: data => {
        this.loading = false
        this.data = [...data]
        this.cdr.detectChanges()
      },
      error: () => {
        this.loading = false
        this.cdr.detectChanges()
        this.presentToast("bottom", "Unable to refresh item list")
      }
    })
  }

  // Method to confirm and delete an item by name
  async doDelete(name: string) {
    // Create a confirmation alert before deletion
    const alert = await this.alertController.create({
      header: 'Delete Confirm',
      message: `Do you really want to delete ${name}?`,
      buttons: [{
        text: 'Cancel',
        handler: () => {
          // Do nothing on cancel
        }
      },
        {
          text: 'Confirm',
          handler: () => {
            // If confirmed, call the delete API
            this.ItemService.doDelete(name).subscribe({
              next: (message: any) => {
                this.data = this.data.filter(item => item.item_name !== name)
                this.cdr.detectChanges()
                this.presentToast("bottom", message?.delete || message?.message || "Delete success")
                // Refresh item list after deletion
                this.scheduleLoadItems()
              },
              error: error => {
                const message = error?.error || "Delete failed"
                this.presentToast("bottom", message)
              }
            });
          }
        }]
    });

    // Present the alert
    await alert.present();
  }

  // Present hint message
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      cssClass: 'hint-toast',
      position: position,
    });

    await toast.present();
  }

  // Navigate to the edit page with the selected item's name
  doEdit(ItemName: string): void {
    this.router.navigate([`/tabs/edit/${''+ItemName}`])
  }

  // Navigate to the add page
  toAdd(): void {
    this.router.navigate(['/tabs/add'])
  }
}
