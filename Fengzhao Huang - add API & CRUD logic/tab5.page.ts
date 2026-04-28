import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Item, ItemService } from '../item.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab5Page implements OnInit {
  data : Item[]; // Featured items fetched from backend
  loading: boolean = false // Loading flag to show spinner while fetching data

  // Lifecycle hook (currently unused, reserved for future logic)
  ngOnInit(): void {}

  constructor (private ItemService: ItemService, private router: Router){
    this.data = []

    // Listen for navigation events
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {

        // If the user navigated to this tab, fetch featured items
        if (event.url === '/tabs/featured-list') {
          this.getFeaturedItems()
        }
      }
    })
  }

  // Fetch featured items from backend
  getFeaturedItems(): void {
    this.loading = true // Show loading indicator

    this.ItemService.getFeaturedItems().subscribe(data => {
      this.data = data  // Assign the fetched items to the `data` array
      this.loading = false // Hide loading indicator
    })
  }
}
