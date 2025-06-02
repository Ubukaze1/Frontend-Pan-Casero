import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

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

  constructor(private messageService: MessageService) { }
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
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    description: new FormControl('', Validators.required),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    image: new FormControl(''),
  });

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

  uploadedFiles: any[] = [];

  obtenerImgUrl(event: any) {
    const file = event.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'productos');

    fetch('https://api.cloudinary.com/v1_1/dtskjaarj/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('Imagen subida a Cloudinary:', data);
        const imageUrl = data.secure_url;

        this.formProductos.get('image')?.setValue(imageUrl); //

        this.uploadedFiles.push(file);

        this.messageService.add({
          severity: 'success',
          summary: 'Imagen subida correctamente',
          detail: 'URL guardada en el formulario'
        });
        // Puedes continuar con lo que necesites (crear producto, etc.)
        this.agregarProductoALaLista(imageUrl);
      }).catch(err => {
        console.error('Error al subir a Cloudinary', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo subir la imagen'
        });
      });
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

    this.sweetAlertService.load();

    this.productService.create(this.formProductos.value).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.productService.sendIsList$(true);
          this.visible = false;
        } else {
          this.sweetAlertService.information(resp.message);
        }
      },
      error: (err) => {
        console.error({ 'create-product': err.message });
      }
    });

  }

  agregarProductoALaLista(imageUrls: string): void {
    // Obtenemos los valores del FormGroup
    const formValues = this.formProductos.value;

    const nuevoProducto: any = {
      name: formValues.name,
      price: formValues.price,
      description: formValues.description,
      quantity: formValues.quantity,
      imageUrls: imageUrls,
    };

    this.listProducts = [...this.listProducts, nuevoProducto];

    this.messageService.add({
      severity: 'success',
      summary: 'Producto creado',
      detail: `${nuevoProducto.name} se ha guardado correctamente`,
    });

    setTimeout(() => {
      // this.visible = false;
      // this.formProductos.reset();
      if (this.fileUploader) {
        this.fileUploader.clear();
      }
      this.uploadedFiles = [];
    }, 10000);
    // Cerramos modal y limpiamos formulario
  }
}
