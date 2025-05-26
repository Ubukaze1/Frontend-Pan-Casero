import { Component } from '@angular/core';
import {HeaderComponent} from '../mainpage/header/header.component';
import {FooterComponent} from '../mainpage/footer/footer.component';
import {Tienda} from '../../../interface/product';
import {CardmodalComponent} from './cardmodal/cardmodal.component';

@Component({
  selector: 'app-tienda',
  imports: [ HeaderComponent, FooterComponent, CardmodalComponent],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  wandh = "width: 300px ;height: 235px; border-radius: 0px;"
  products!: Tienda[];

  ngOnInit() {
    this.products = [
      { id: 1, nombre: 'Pan', precio: 4000, description: "Un buenn pan1", img: "/Pan1.jpg" },
      { id: 2, nombre: 'Pan', precio: 4000, description: "Un buenn pan2", img: "/Pan1.jpg" },
      { id: 3, nombre: 'Pan', precio: 4000, description: "Un buenn pan3", img: "/Pan1.jpg" },
      { id: 4, nombre: 'Pan', precio: 4000, description: "Un buenn pan4", img: "/Pan1.jpg" },
      { id: 5, nombre: 'Pan', precio: 4000, description: "Un buenn pan5", img: "/Pan1.jpg" },
      { id: 6, nombre: 'Pan', precio: 4000, description: "Un buenn pan6", img: "/Pan1.jpg" },
      { id: 7, nombre: 'Pan', precio: 4000, description: "Un buenn pan7", img: "/Pan1.jpg" },
      { id: 8, nombre: 'Pan', precio: 4000, description: "Un buenn pan8", img: "/Pan1.jpg" },
      { id: 9, nombre: 'Pan', precio: 4000, description: "Un buenn pan9", img: "/Pan1.jpg" },
      { id: 10, nombre: 'Pan', precio: 4000, description: "Un buenn pan10", img: "/Pan1.jpg" },
      { id: 11, nombre: 'Pan', precio: 4000, description: "Un buenn pan11", img: "/Pan1.jpg" },
      { id: 12, nombre: 'Pan', precio: 4000, description: "Un buenn pan12", img: "/Pan1.jpg" },
    ];
  }
}
