import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, AvatarModule,SharedModule,Toolbar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  constructor(private router:Router){}

  iraProductos() {
    console.log("Entra aqui")
    this.router.navigateByUrl("productos")
  }
  iraInventario() {
    this.router.navigateByUrl("inventario")
  }

}
