import { Routes } from '@angular/router';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProductosComponent } from './components/productos/productos.component';
import {MainpageComponent} from './components/mainpage/mainpage.component';
import {TiendaComponent} from './components/tienda/tienda.component';
import {CarritoComponent} from './components/carrito/carrito.component';

export const routes: Routes = [
  {
    path: '',
    component: MainpageComponent,
  },
  {
    path: 'tienda',
    component: TiendaComponent,
  },
  {
    path: 'inventario',
    component: InventarioComponent,
  },
  {
    path: 'productos',
    component: ProductosComponent,
  },
  {
    path: 'carrito',
    component: CarritoComponent,
  },
];
