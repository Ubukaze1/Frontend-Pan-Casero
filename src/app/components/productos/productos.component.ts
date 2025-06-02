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
    HeaderComponent,
    NgIf
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  providers: [ProductService, MessageService],
})

export class ProductosComponent {

  constructor(private messageService: MessageService) { }
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly productService = inject(ProductService);
  imageUrl = ""
  showSave = false
  showUpdate = false
  id = ""
  nuevoProducto: any = {}

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
    this.showSave = true
    this.showUpdate = false
    this.formProductos.reset();
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }

  abrirModalModificar(prod: any) {
    this.visible = true;
    this.showSave = false
    this.showUpdate = true
    console.log(prod)
    this.formProductos.controls['name'].setValue(prod.name || " ")
    this.formProductos.controls['price'].setValue(prod.price?.toString() || 0 || null)
    this.formProductos.controls['description'].setValue(prod.description || " ")
    this.formProductos.controls['quantity'].setValue(prod.quantity?.toString() || 0 || null)
    this.id! = prod.id! || " "
    this.imageUrl = prod.imageUrl
  }

  actualizarProducto() {

    this.nuevoProducto = {
      name: this.formProductos.value.name,
      price: Number(this.formProductos.value.price),
      description: this.formProductos.value.description,
      quantity: Number(this.formProductos.value.quantity),
      image: this.imageUrl,
    };

    if (!this.nuevoProducto.image) {
      delete this.nuevoProducto.image;
    }

    if (this.formProductos.invalid) {
      this.formProductos.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa correctamente todos los campos.',
      });
      return;
    }
    this.productService.update(this.id!, this.nuevoProducto).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.visible = false
          this.productService.sendIsList$(true);
        } else {
          this.sweetAlertService.information(resp.message);
        }
        this.sweetAlertService.close();
      },
      error: (err) => {
        console.error({ 'update-product': err.message });
      }
    });
    this.visible = false;
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
        this.imageUrl = data.secure_url;

        this.formProductos.get('image')?.setValue(this.imageUrl); //

        this.uploadedFiles.push(file);

        this.messageService.add({
          severity: 'success',
          summary: 'Imagen subida correctamente',
          detail: 'URL guardada en el formulario'
        });
        // Puedes continuar con lo que necesites (crear producto, etc.)
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

    this.agregarProductoALaLista(this.imageUrl)
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
  }
}
