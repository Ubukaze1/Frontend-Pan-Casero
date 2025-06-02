import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, AvatarModule, SharedModule, Toolbar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  constructor(private router: Router) { }

  iraProductos() {
    console.log("Entra aqui")
    this.router.navigateByUrl("productos")
  }
  
  iraInventario() {
    this.router.navigateByUrl("inventario")
  }

}
