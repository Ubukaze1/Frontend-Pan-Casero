import { Component } from '@angular/core';
import { ListaProductos } from '../../../interface/product';
import { ProductService } from '../../../service/product.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';


@Component({
  selector: 'app-productos',
  imports: [TableModule, CommonModule, PanelModule,FormsModule,InputTextModule,ButtonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  providers: [ProductService],
})
export class ProductosComponent {
  value: string
  products!: ListaProductos[];

  constructor(private productService: ProductService) {
    this.value = ""
  }

  ngOnInit() {
    this.products = [
      { producto: 'Baguette', categoria: 'Pan', precio: 2500, inventario: 100 },
      { producto: 'Croissant', categoria: 'Pan', precio: 3000, inventario: 80 },
      { producto: 'Pretzel', categoria: 'Pan', precio: 1500, inventario: 120 },
      { producto: 'Scone', categoria: 'Pan', precio: 2250, inventario: 90 },
      { producto: 'Biscuit', categoria: 'Pan', precio: 2000, inventario: 110 },
      { producto: 'Muffin', categoria: 'Pan', precio: 2750, inventario: 95 },
      { producto: 'Donut', categoria: 'Pan', precio: 1750, inventario: 115 },
      { producto: 'Cookie', categoria: 'Pan', precio: 1250, inventario: 125 },
      { producto: 'Loaf', categoria: 'Pan', precio: 4000, inventario: 75 },
      { producto: 'Pie', categoria: 'Pan', precio: 5000, inventario: 70 },
    ];
  }
}
