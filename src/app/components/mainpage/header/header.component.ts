import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  header = document.getElementById('Header')!;
  specialMenuItem = document.getElementById('Special')!;

  ngOnInit() {
    this.header = document.getElementById('Header')!;
    this.specialMenuItem = document.getElementById('Special')!;
  }

  @HostListener('window:scroll', ['$event'])
  mov() {
    let scroll = window.scrollY;
    if (scroll > 0) {
      this.header.style.backgroundColor = 'white';
      this.header.style.color = 'var(--second-color)';
      this.specialMenuItem.classList.add('special-scrolled');
      console.log('Entra');
    } else {
      this.header.style.backgroundColor = 'transparent';
      this.header.style.color = 'white';
      this.specialMenuItem.classList.remove('special-scrolled');
    }
  }
}
