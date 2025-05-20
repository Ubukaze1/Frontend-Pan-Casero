import { Routes } from '@angular/router';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProductosComponent } from './components/productos/productos.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
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
