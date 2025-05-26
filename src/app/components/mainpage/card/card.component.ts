import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Tienda } from '../../../../interface/product';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() sty = '';
  @Input() img = '';
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
}
