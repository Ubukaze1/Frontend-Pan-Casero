import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, ProductDTO } from '../interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log("Entro aqui")
    return this.httpClient
      .get<ProductDTO>('../assets/product.json')
      .pipe(map((u) => u.data))
  }
}
