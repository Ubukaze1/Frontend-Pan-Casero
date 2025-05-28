import {NgIf} from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  header = document.getElementById('Header')!;
  icon = document.getElementById('icon')!;
  specialMenuItem = document.getElementById('Special')!;
  cartCount: number = 0;
  constructor(private router: Router) {}

  irA(link: string) {
    console.log('Entra aqui');
    //this.router.navigateByUrl(link);
    this.router.navigate([link]).then(() => {
      window.location.reload();
    });
  }

  iraInicio() {
    console.log('Entra aqui');
    //this.router.navigateByUrl('/');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit() {
    this.header = document.getElementById('Header')!;
    this.specialMenuItem = document.getElementById('Special')!;
    this.icon = document.getElementById('icon')!;
  }

  @HostListener('window:scroll', [])
  mov() {
    let scroll = window.scrollY || document.documentElement.scrollTop;
    if (scroll > 0) {
      this.header.style.backgroundColor = 'white';
      this.header.style.color = 'var(--second-color)';
      this.specialMenuItem.classList.add('special-scrolled');
      this.icon.style.fill = 'black';
    } else {
      this.header.style.backgroundColor = 'transparent';
      this.header.style.color = 'white';
      this.specialMenuItem.classList.remove('special-scrolled');
      this.icon.style.fill = 'white';
    }
  }

}
