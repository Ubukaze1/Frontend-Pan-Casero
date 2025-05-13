import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent {
  title = 'Frontend-Pan-Casero';
  constructor(private messageService: MessageService) {}
  show() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Esto deberia ser como maron',
      life: 3000,
    });
  }
}
