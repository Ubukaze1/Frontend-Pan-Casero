import { Component } from '@angular/core';
import {HeaderComponent} from '../mainpage/header/header.component';
import {FooterComponent} from '../mainpage/footer/footer.component';
import {CardComponent} from '../mainpage/card/card.component';

@Component({
  selector: 'app-tienda',
  imports: [ HeaderComponent, FooterComponent, CardComponent],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  wandh = "width: 300px ;height: 235px; border-radius: 0px;"
}
