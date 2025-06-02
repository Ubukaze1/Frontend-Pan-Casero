import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { delay, Subscription } from 'rxjs';

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

import { UploadEvent } from './interface/Upload';
import { Producto } from './interface/producto';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  providers: [ProductService, MessageService],
})
export class ProductosComponent {
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly productService = inject(ProductService);
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
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    precio: new FormControl('', [Validators.required, Validators.min(1)]),
    descripción: new FormControl('', Validators.required),
    cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.getListProducts();

    this.subscription = this.productService.getIsList$().subscribe({
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

    this.productService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listProducts = resp.data.list;
            this.length = resp.data.length;
          } else {
            this.listProducts = [];
            this.length = 0;
            this.sweetAlertService.error(resp.message);
          }
          this.sweetAlertService.close();
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

  uploadedFiles: any[] = [];

  obtenerImgUrl(event: FileUploadEvent) {
    console.log('Entro');
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });

    this.agregarProductoALaLista('');
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

    // Si hay archivos pendientes de subir, disparamos upload()
    if (this.fileUploader && this.fileUploader.files.length) {
      this.fileUploader.upload();
      // El flujo continúa en onUpload(), que completará la información de imageUrls
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, Colocar imagen para el producto.',
      });
      return;
    }
  }

  agregarProductoALaLista(imageUrls: string): void {
    // Obtenemos los valores del FormGroup
    const formValues = this.formProductos.value;

    const nuevoProducto: Producto = {
      nombre: formValues.nombre,
      precio: formValues.precio,
      descripción: formValues.descripción,
      cantidad: formValues.cantidad,
      imageUrls: imageUrls,
    };

    this.listProducts = [...this.listProducts, nuevoProducto];

    this.messageService.add({
      severity: 'success',
      summary: 'Producto creado',
      detail: `${nuevoProducto.nombre} se ha guardado correctamente`,
    });
    setTimeout(() => {
      this.visible = false;
      this.formProductos.reset();
      if (this.fileUploader) {
        this.fileUploader.clear();
      }
      this.uploadedFiles = [];
    }, 2000);

    // Cerramos modal y limpiamos formulario
  }
}
