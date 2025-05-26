import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductService} from '../service/product.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProductService],
})
export class AppComponent {
  title = 'Frontend-Pan-Casero';
}
