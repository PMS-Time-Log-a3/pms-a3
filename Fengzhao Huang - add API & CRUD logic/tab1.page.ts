import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular/standalone';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class Tab1Page {
  constructor() {}

  // Privacy and Security modal
  @ViewChild(IonModal) modal1: IonModal | undefined
}
