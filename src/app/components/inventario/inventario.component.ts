import { Product } from '../../../interface/product';
import { ProductService } from '../../../service/product.service';
import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  selector: 'app-inventario',
  imports: [DataView, ButtonModule, Tag, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  providers: [ProductService],
})
export class InventarioComponent {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((items) => {
      this.products.set(items)
    })

  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }
}
