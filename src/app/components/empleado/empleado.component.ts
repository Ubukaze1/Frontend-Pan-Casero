import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
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
import { EmpleadoService } from './service/empleado.service';

@Component({
  selector: 'app-empleado',
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
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css',
  providers: [ProductService, MessageService],
})
export class EmpleadoComponent {
  constructor(private messageService: MessageService,private fb: FormBuilder) {
    this.formReception = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      number_identification: ['', [Validators.required, Validators.min(1)]],
      role: ['', Validators.required],
      address: ['', [Validators.required]],
      payroll: this.fb.group({
        salary: [null, Validators.required],
      }),
    });
  }
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly employeService = inject(EmpleadoService);
  imageUrl = '';
  showSave = false;
  showUpdate = false;
  id = '';
  nuevoEmpleado: any = {};
  formReception!: FormGroup;

  visible: boolean = false;
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  subscription!: Subscription; //TODO
  listEmploye: any[] = [];
  value!: string;

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  limit: number = this.pageSizeOptions[0];
  length: number = 0;
  skip: number = 0;

  ngOnInit(): void {
    this.getListEmployes();

    this.subscription = this.employeService.getIsList$().subscribe({
      next: (resp) => {
        if (resp) {
          this.getListEmployes();
        }
      },
      error: (err) => {
        this.sweetAlertService.error(err);
      },
    });
  }

  getListEmployes() {
    this.sweetAlertService.load();

    this.employeService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listEmploye = resp.data.list;
            this.length = resp.data.length;
            this.sweetAlertService.close();
          } else {
            this.listEmploye = [];
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
    this.formReception.reset();
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }

  abrirModalModificar(prod: any) {
    this.visible = true;
    this.showSave = false;
    this.showUpdate = true;
    console.log(prod);
    this.formReception.controls['name'].setValue(prod.name || ' ');
    this.formReception.controls['number_identification'].setValue(
      prod.number_identification?.toString() || 0 || null
    );
    this.formReception.controls['role'].setValue(prod.role || ' ');
    this.formReception.controls['address'].setValue(
      prod.address?.toString() || 0 || null
    );
    this.id! = prod.id! || ' ';
    this.imageUrl = prod.imageUrl;
  }

  actualizarProducto() {
    this.nuevoEmpleado = {
      name: this.formReception.value.name,
      number_identification: Number(
        this.formReception.value.number_identification
      ),
      role: this.formReception.value.role,
      address: Number(this.formReception.value.address),
      image: this.imageUrl,
    };

    if (!this.nuevoEmpleado.image) {
      delete this.nuevoEmpleado.image;
    }

    if (this.formReception.invalid) {
      this.formReception.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa correctamente todos los campos.',
      });
      return;
    }
    this.employeService.update(this.id!, this.nuevoEmpleado).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.visible = false;
          this.employeService.sendIsList$(true);
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
    if (this.formReception.invalid) {
      this.formReception.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, completa correctamente todos los campos.',
      });
      return;
    }
    console.log(this.formReception.value);

    /*
    this.agregarEmpleadoALaLista(this.imageUrl)

    this.sweetAlertService.load();

    this.employeService.create(this.formReception.value).subscribe({
      next: (resp) => {
        if (resp.statusCode === 201) {
          this.employeService.sendIsList$(true);
          this.visible = false;
        } else {
          this.sweetAlertService.information(resp.message);
        }
      },
      error: (err) => {
        console.error({ 'create-employee': err.message });
      }
    });

     * */
  }

  agregarEmpleadoALaLista(salary: string): void {
    // Obtenemos los valores del FormGroup
    const formValues = this.formReception.value;

    const nuevoEmpleado: any = {
      name: formValues.name,
      number_identification: formValues.number_identification,
      role: formValues.role,
      address: formValues.address,
      salary: salary,
    };

    this.listEmploye = [...this.listEmploye, nuevoEmpleado];

    this.messageService.add({
      severity: 'success',
      summary: 'Producto creado',
      detail: `${nuevoEmpleado.name} se ha guardado correctamente`,
    });
  }
}
