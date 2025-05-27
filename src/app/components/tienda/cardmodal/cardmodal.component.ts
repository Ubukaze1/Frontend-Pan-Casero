import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tienda } from '../../../../interface/product';

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

  ngAfterViewInit() {
    // Asegúrate de que el <dialog> existe antes de manipularlo.
    // Nada que hacer aquí explícitamente, solo que Angular lo inicialice.
  }

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

  mensajeFun() {

    this.mensaje = "¡Este producto ha sido agregado al carrito!"
  }

}
