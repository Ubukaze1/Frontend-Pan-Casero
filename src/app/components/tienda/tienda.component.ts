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
      { id: "1", nombre: 'Cookies', precio: 4000, description: "Una buena galleta", img: "/cookies.jpg" },
      { id: "2", nombre: 'Croissants', precio: 5000, description: "Un buen Croissants", img: "/Croissants.jpg" },
      { id: "3", nombre: 'Croissants', precio: 5000, description: "Un buen Croissants", img: "/Croissants.jpg" },
      { id: "4", nombre: 'Panes', precio: 2000, description: "Un buenn pan", img: "/Panes.jpg" },
      { id: "5", nombre: 'Panes', precio: 2000, description: "Un buenn pan", img: "/Panes.jpg" },
      { id: "6", nombre: 'Cookies', precio: 4000, description: "Una buena galleta", img: "/cookies.jpg" },
      { id: "7", nombre: 'Cookies', precio: 4000, description: "Una Buena galleta", img: "/cookies.jpg" },
      { id: "8", nombre: 'Torta', precio: 8000, description: "Un buena Torta", img: "/Torta.jpg" },
      { id: "9", nombre: 'Torta', precio: 8000, description: "Un buena Torta", img: "/Torta.jpg" },
      { id: "10", nombre: 'Panes', precio: 2000, description: "Un buen pan", img: "/Panes.jpg" },
      { id: "11", nombre: 'Panes', precio: 2000, description: "Un buen pan", img: "/Panes.jpg" },
      { id: "12", nombre: 'Cookies', precio: 4000, description: "Una Buena galletae", img: "/cookies.jpg" },
    ];
  }
}
