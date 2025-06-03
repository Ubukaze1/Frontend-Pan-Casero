import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CartItem } from '../tienda/interface/cart-item';

import { FooterComponent } from '../mainpage/footer/footer.component';
import { HeaderComponent } from '../mainpage/header/header.component';

import { CartService } from '../tienda/service/cart.service';
import { SaleService } from './services/sale.service';
import { ProductService } from '../productos/services/product.service';

@Component({
  selector: 'app-carrito',
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {

  constructor(
    private cartService: CartService,
    private router: Router,
    private saleService: SaleService,
    private productService: ProductService
  ) { }

  carrito: CartItem[] = [];
  subtotal: number = 0;
  stockDisponible: { [id: string]: number } = {};

  private itemsSub$!: Subscription


  irA(link: string) {
    this.router.navigateByUrl("tienda")
  }

  /** Si el usuario cambia la cantidad en el carrito mismo */
  // cambiarCantidad(productId: string, nuevaCantidad: number) {


  //   //if (nuevaCantidad > 0) return;

  //   //console.log(nuevaCantidad)
  //   // 1) Actualizo la cantidad en el array local
  //   //const index = this.carrito.findIndex((ci) => ci.id === item.id);
  //   //if (index === -1) {
  //   //this.carrito[index].cantidad = nuevaCantidad;
  //   //}

  //   //console.log(index)

  //   // 2) Reemplazo completamente la lista en el servicio
  //   //    (podrías implementar un método “updateCartItems(...)” en el servicio)
  //   //this.cartService.clearCart();
  //   //this.carrito.forEach((ci) => this.cartService.addToCart(ci));

  //   // 3) Recalculo subtotal
  //   //this.calcularSubtotal();
  //   if (nuevaCantidad < 1) {
  //     // Por seguridad, si fuera 0 ó negativo, lo tratamos como eliminación.
  //     this.cartService.updateQuantity(productId, 0);
  //   } else {
  //     this.cartService.updateQuantity(productId, nuevaCantidad);
  //   }
  //   // No hace falta recalcular manualmente subtotal aquí,
  //   // pues la suscripción a items$ ya llamó a calcularSubtotal().
  // }

  cambiarCantidad(productId: string, nuevaCantidad: number) {
    const max = this.stockDisponible[productId] ?? Infinity;

    if (nuevaCantidad < 1) {
      this.cartService.updateQuantity(productId, 0);
    } else if (nuevaCantidad > max) {
      alert(`Solo hay ${max} unidades disponibles para este producto.`);
      // Revertimos la cantidad al máximo permitido visualmente
      const item = this.carrito.find(i => i.id === productId);
      if (item) item.cantidad = max;
      this.cartService.updateQuantity(productId, max);
    } else {
      this.cartService.updateQuantity(productId, nuevaCantidad);
    }
  }


  finalizarPedido() {
    const productos = this.carrito.map(item => ({
      productoId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      name: item.nombre,
      total: item.cantidad * item.precio
    }));

    const total = this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const ventaPayload = {
      products: productos,
      total: total
    };

    this.saleService.create(ventaPayload).subscribe({
      next: (resp) => {
        console.log('Venta registrada con éxito', resp);
        this.cartService.clearCart();
        // this.router.navigateByUrl('/gracias'); // o la ruta que tengas
      },
      error: (err) => {
        console.error('Error al guardar la venta', err);
      }
    });

    this.carrito.forEach(item => {
      this.productService.find(item.id).subscribe({
        next: (producto) => {
          // Actualizar la cantidad del producto en la base de datos
          const nuevaCantidad = Number(producto.data.quantity) - item.cantidad;
          this.productService.update(item.id, { quantity: nuevaCantidad }).subscribe({
            next: (resp) => {
              console.log('Producto actualizado con éxito', resp);
            },
            error: (err) => {
              console.error('Error al actualizar el producto', err);
            }
          })
          item.cantidad = nuevaCantidad; // Actualizar la cantidad en el carrito
        },
        error: (err) => {
          console.error('Error al obtener el producto', err);
        }
      })
      // this.productService.update(item.id, { quantity: item.cantidad }).subscribe({
      //   next: (resp) => {
      //     console.log('Producto actualizado con éxito', resp);
      //   },
      //   error: (err) => {
      //     console.error('Error al actualizar el producto', err);
      //   }
      // });
    });

  }

  // finalizarPedido() {
  //   console.log("Entra aqui")
  //   this.cartService.clearCart()
  //   this.router.navigateByUrl("")
  // }


  ngOnInit(): void {
    // Tomo una copia de los ítems actuales
    //this.carrito = this.cartService.getCartItems();
    //this.calcularSubtotal();

    // Si quieres que reaccione a cambios en tiempo real (p. ej. otro componente añade un producto):
    //this.cartService.items$.subscribe((items) => {
    //  this.carrito = items;
    //  this.calcularSubtotal();
    //});
    // 1) Nos suscribimos a items$, de modo que recibamos actualizaciones
    // this.itemsSub$ = this.cartService.items$.subscribe(items => {
    //   // Cada vez que cambie el carrito (añadir, borrar, updateQuantity),
    //   // "items" será el array actualizado.
    //   this.carrito = items;
    //   this.calcularSubtotal();
    // });
    this.itemsSub$ = this.cartService.items$.subscribe(items => {
      this.carrito = items;
      this.calcularSubtotal();

      // Obtener stock disponible desde el backend
      this.carrito.forEach(item => {
        this.productService.find(item.id).subscribe({
          next: (producto) => {
            this.stockDisponible[item.id] = producto.data.quantity;
          },
          error: () => {
            this.stockDisponible[item.id] = 0;
          }
        });
      });
    });

  }

  ngOnDestroy(): void {
    if (this.itemsSub$) {
      this.itemsSub$.unsubscribe();
    }
  }

  calcularSubtotal(): void {
    this.subtotal = this.carrito.reduce((sum, item) => {
      return sum + item.precio * item.cantidad;
    }, 0);
  }

  quitarProducto(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

}
