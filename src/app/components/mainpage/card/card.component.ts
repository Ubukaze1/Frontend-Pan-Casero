import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() sty = ""
  @Input() img = ""
  @Input() prod = "Producto"
  ngOnInit() {}

  @Output() verMas: EventEmitter<any> = new EventEmitter()

  onVerMasClick() {
    this.verMas.emit()
  }

}
