import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputNumber } from 'primeng/inputnumber';

import { MessageService } from 'primeng/api';
import { ProductService } from '../productos/services/product.service';
import { SweetAlertService } from '../shared/sweet-alert.service';

import { HeaderComponent } from '../header/header.component';
import {InventarioService} from './services/inventario.service';



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
    HeaderComponent
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  providers: [ProductService, MessageService],
})
export class InventarioComponent {

  constructor(private messageService: MessageService) { }
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly inventaryService = inject(InventarioService);

  visible: boolean = false;
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  subscription!: Subscription; //TODO
  listProducts: any[] = [];
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
    this.getListProducts();

    this.subscription = this.inventaryService.getIsList$().subscribe({
      next: (resp) => {
        if (resp) {
          this.getListProducts();
        }
      },
      error: (err) => {
        this.sweetAlertService.error(err);
      },
    });
  }

  getListProducts() {
    this.sweetAlertService.load();

    this.inventaryService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listProducts = resp.data.list;
            this.length = resp.data.length;
            this.sweetAlertService.close();
          } else {
            this.listProducts = [];
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
    this.formProductos.reset();
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
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
      }
    });
    this.agregarProductoALaLista()

  }

  agregarProductoALaLista(): void {
    // Obtenemos los valores del FormGroup
    const formValues = this.formProductos.value;

    const nuevoProducto: any = {
      name: formValues.name,
      quantity: formValues.quantity,
    };

    this.listProducts = [...this.listProducts, nuevoProducto];

    this.messageService.add({
      severity: 'success',
      summary: 'Producto creado',
      detail: `${nuevoProducto.name} se ha guardado correctamente`,
    });

  }
}
