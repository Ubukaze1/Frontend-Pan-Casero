import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {InventarioComponent} from './components/inventario/inventario.component';
import {ProductService} from '../service/product.service';
import {ProductosComponent} from './components/productos/productos.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, InventarioComponent, ProductosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProductService],
})
export class AppComponent {
  title = 'Frontend-Pan-Casero';
}
