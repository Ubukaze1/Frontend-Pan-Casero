import { Routes } from '@angular/router';

import { AuthGuard } from './components/shared/auth.guard';

import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { ProductosComponent } from './components/productos/productos.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import {VentasComponent} from './components/ventas/ventas.component';
import {EmpleadoComponent} from './components/empleado/empleado.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

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
  {
    path: 'ventas',
    component: VentasComponent, canActivate: [AuthGuard]
  },
  {
    path: 'empleados',
    component: EmpleadoComponent, canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
];
