import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {ProductService} from '../service/product.service';
import {MainpageComponent} from './components/mainpage/mainpage.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MainpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProductService],
})
export class AppComponent {
  title = 'Frontend-Pan-Casero';
}
