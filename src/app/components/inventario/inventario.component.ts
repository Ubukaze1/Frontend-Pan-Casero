import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { ProductService } from '../productos/services/product.service';
import { SweetAlertService } from '../shared/sweet-alert.service';

import { HeaderComponent } from '../header/header.component';
import { InventarioService } from './services/inventario.service';

@Component({
  selector: 'app-inventario',
  imports: [
    TableModule,
    CommonModule,
    PanelModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    Dialog,
    FileUpload,
    InputNumber,
    ToastModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgIf,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  providers: [ProductService, MessageService],
})
export class InventarioComponent {
  showSave = false;
  showUpdate = false;
  id = '';
  nuevoProducto: any = {};

  constructor(private messageService: MessageService) { }
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly inventaryService = inject(InventarioService);

  visible: boolean = false;
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  subscription!: Subscription; //TODO
  listinventary: any[] = [];
  value!: string;

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  limit: number = this.pageSizeOptions[0];
  length: number = 0;
  skip: number = 0;

  formProductos = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.getListinventary();

    this.subscription = this.inventaryService.getIsList$().subscribe({
      next: (resp) => {
        if (resp) {
          this.getListinventary();
        }
      },
      error: (err) => {
        this.sweetAlertService.error(err);
      },
    });
  }

  getListinventary() {
    this.sweetAlertService.load();

    this.inventaryService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listinventary = resp.data.list;
            this.length = resp.data.length;
            this.sweetAlertService.close();
          } else {
            this.listinventary = [];
            this.length = 0;
            this.sweetAlertService.information(resp.message);
          }
        },
        error: (err) => {
          this.sweetAlertService.error(err);
        },
      });
  }

  abrirModal() {
    this.visible = true;
    this.showSave = true;
    this.showUpdate = false;
    this.formProductos.reset();
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }

  abrirModalModificar(prod: any) {
    this.visible = true;
    this.showSave = false;
    this.showUpdate = true;
    console.log(prod);
    this.formProductos.controls['name'].setValue(prod.name || ' ');
    this.formProductos.controls['quantity'].setValue(
      prod.quantity?.toString() || 0 || null
    );
    this.id! = prod.id! || ' ';
  }

  actualizarProducto() {
    this.nuevoProducto = {
      name: this.formProductos.value.name,
      quantity: Number(this.formProductos.value.quantity),
    };

    if (this.formProductos.invalid) {
      this.formProductos.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa correctamente todos los campos.',
      });
      return;
    }
    this.inventaryService.update(this.id!, this.nuevoProducto).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.visible = false;
          this.inventaryService.sendIsList$(true);
        } else {
          this.sweetAlertService.information(resp.message);
        }
        this.sweetAlertService.close();
      },
      error: (err) => {
        console.error({ 'update-product': err.message });
      },
    });
    this.visible = false;
  }

  salvarProducto(): void {
    // Primero validamos que el formulario sea válido
    if (this.formProductos.invalid) {
      this.formProductos.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa correctamente todos los campos.',
      });
      return;
    }

    this.sweetAlertService.load();

    this.inventaryService.create(this.formProductos.value).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.inventaryService.sendIsList$(true);
          this.visible = false;
        } else {
          this.sweetAlertService.information(resp.message);
        }
      },
      error: (err) => {
        console.error({ 'create-product': err.message });
      },
    });
    this.agregarProductoALaLista();
  }

  agregarProductoALaLista(): void {
    // Obtenemos los valores del FormGroup
    const formValues = this.formProductos.value;

    const nuevoInventario: any = {
      name: formValues.name,
      quantity: formValues.quantity,
    };

    this.listinventary = [...this.listinventary, nuevoInventario];

    this.messageService.add({
      severity: 'success',
      summary: 'Producto creado',
      detail: `${nuevoInventario.name} se ha guardado correctamente`,
    });
  }
}
