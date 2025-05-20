import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {InventarioComponent} from './components/inventario/inventario.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, InventarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [],
})
export class AppComponent {
  title = 'Frontend-Pan-Casero';
}
