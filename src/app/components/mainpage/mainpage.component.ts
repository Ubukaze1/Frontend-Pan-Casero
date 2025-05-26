import { Component } from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {CardComponent} from './card/card.component';

@Component({
  selector: 'app-mainpage',
  imports: [HeaderComponent, CardComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css',
})
export class MainpageComponent {
}
