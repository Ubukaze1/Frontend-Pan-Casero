import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CartItem } from '../tienda/interface/cart-item';

import { FooterComponent } from '../mainpage/footer/footer.component';
import { HeaderComponent } from '../mainpage/header/header.component';

import { CartService } from '../tienda/service/cart.service';

@Component({
  selector: 'app-carrito',
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {


  carrito: CartItem[] = [];
  subtotal: number = 0;

  private itemsSub$!: Subscription

  constructor(private cartService: CartService, private router: Router) { }

  irA(link: string) {
    this.router.navigateByUrl("tienda")
  }

  /** Si el usuario cambia la cantidad en el carrito mismo */
  cambiarCantidad(productId: string, nuevaCantidad: number) {


    //if (nuevaCantidad > 0) return;

    //console.log(nuevaCantidad)
    // 1) Actualizo la cantidad en el array local
    //const index = this.carrito.findIndex((ci) => ci.id === item.id);
    //if (index === -1) {
    //this.carrito[index].cantidad = nuevaCantidad;
    //}

    //console.log(index)

    // 2) Reemplazo completamente la lista en el servicio
    //    (podrías implementar un método “updateCartItems(...)” en el servicio)
    //this.cartService.clearCart();
    //this.carrito.forEach((ci) => this.cartService.addToCart(ci));

    // 3) Recalculo subtotal
    //this.calcularSubtotal();
    if (nuevaCantidad < 1) {
      // Por seguridad, si fuera 0 ó negativo, lo tratamos como eliminación.
      this.cartService.updateQuantity(productId, 0);
    } else {
      this.cartService.updateQuantity(productId, nuevaCantidad);
    }
    // No hace falta recalcular manualmente subtotal aquí,
    // pues la suscripción a items$ ya llamó a calcularSubtotal().
  }


  finalizarPedido() {
    console.log("Entra aqui")
    this.cartService.clearCart()
    this.router.navigateByUrl("")
  }


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
    this.itemsSub$ = this.cartService.items$.subscribe(items => {
      // Cada vez que cambie el carrito (añadir, borrar, updateQuantity),
      // "items" será el array actualizado.
      this.carrito = items;
      this.calcularSubtotal();
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
