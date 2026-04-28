import { Component, EnvironmentInjector, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { addCircleOutline, clipboardOutline, createOutline, helpCircleOutline, homeOutline, idCardOutline, locateOutline, starOutline } from 'ionicons/icons';
import {IonicModule} from "@ionic/angular";
import {ItemService} from "../item.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonicModule],
  providers: [ItemService]
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ addCircleOutline, clipboardOutline, createOutline, helpCircleOutline, homeOutline, idCardOutline, locateOutline, starOutline });
  }

  isOpen: boolean = false
}
