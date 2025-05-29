import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

import { ProductService } from '../productos/services/product.service';
import { SweetAlertService } from '../shared/sweet-alert.service';


@Component({
  selector: 'app-productos',
  imports: [TableModule, CommonModule, PanelModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  providers: [ProductService],
})
export class ProductosComponent {
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly productService = inject(ProductService);

  subscription!: Subscription; //TODO 
  listProducts: any[] = [];
  value!: string

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  limit: number = this.pageSizeOptions[0];
  length: number = 0;
  skip: number = 0;


  constructor() { }

  ngOnInit(): void {
    this.getListProducts();

    this.subscription = this.productService.getIsList$().subscribe({
      next: (resp) => {
        if (resp) {
          this.getListProducts();
        }
      },
      error: (err) => {
        this.sweetAlertService.error(err);
      }
    });
  }

  getListProducts() {
    this.sweetAlertService.load();

    this.productService.list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listProducts = resp.data.list;
            this.length = resp.data.length;
          } else {
            this.listProducts = [];
            this.length = 0;
            this.sweetAlertService.error(resp.message);
          }
          this.sweetAlertService.close();
        },
        error: (err) => {
          this.sweetAlertService.error(err);
        }
      });
  }
}
