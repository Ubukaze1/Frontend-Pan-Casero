import { Routes } from '@angular/router';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProductosComponent } from './components/productos/productos.component';
import {MainpageComponent} from './components/mainpage/mainpage.component';

export const routes: Routes = [
  {
    path: '',
    component: MainpageComponent,
  },
  {
    path: 'inventario',
    component: InventarioComponent,
  },
  {
    path: 'productos',
    component: ProductosComponent,
  },
];
