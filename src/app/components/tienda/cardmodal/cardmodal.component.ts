import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tienda } from '../../../../interface/product';
import {CartService} from '../service/cart.service';
import {CartItem} from '../interface/cart-item';

@Component({
  selector: 'app-cardmodal',
  imports: [],
  templateUrl: './cardmodal.component.html',
  styleUrl: './cardmodal.component.css',
})
export class CardmodalComponent {
  cantidad: number = 1;
  mensaje = ""

  @Input() sty = '';
  @Input() img = '';
  @Input() nom = '';
  @Input() prod!: Tienda;
  ngOnInit() {}

  onVerMasClick(produ: Tienda) {
    console.log(produ);
    console.log('VerMasClick');
  }

  @ViewChild('cardDialog') dialogRef!: ElementRef<HTMLDialogElement>;

  constructor(private cartService: CartService) {}



  abrirModal() {
    // .showModal() abre el <dialog> en pantalla
    this.dialogRef.nativeElement.showModal();
  }

  cerrarModal() {
    this.dialogRef.nativeElement.close();
  }
  incrementar() {
    this.cantidad++;
  }

  // Método para decrementar (con tope mínimo en 1, o en 0 si prefieres)
  decrementar() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  agregarAlCarrito() {

        // 1) Armar el objeto CartItem
    const nuevoItem: CartItem = {
      id: this.prod.id,
      nombre: this.prod.nombre,
      precio: this.prod.precio,
      img: this.prod.img,
      cantidad: this.cantidad
    };

    // 2) Llamar al servicio
    this.cartService.addToCart(nuevoItem);

    // 3) Mostrar un mensaje breve al usuario
    this.mensaje = '✔ Agregado al carrito';
  }

}
