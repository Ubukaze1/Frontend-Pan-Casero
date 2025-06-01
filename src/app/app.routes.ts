import { Routes } from '@angular/router';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProductosComponent } from './components/productos/productos.component';
import {MainpageComponent} from './components/mainpage/mainpage.component';
import {TiendaComponent} from './components/tienda/tienda.component';
import {CarritoComponent} from './components/carrito/carrito.component';
import { AuthGuard } from './components/shared/auth.guard';

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
    component: InventarioComponent, canActivate: [AuthGuard] 
  },
  {
    path: 'productos',
    component: ProductosComponent, canActivate: [AuthGuard]
  },
  {
    path: 'carrito',
    component: CarritoComponent, canActivate: [AuthGuard]
  },
];
