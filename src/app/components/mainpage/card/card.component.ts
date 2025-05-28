import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() sty = '';
  @Input() img = '';
  @Input() prod = '';
  ngOnInit() {}

  constructor(private router: Router) {}

  irA(link: string) {
    console.log("Entra Aqui")
    this.router.navigate([link]).then(() => {
      window.location.reload();
    });
  }
}
