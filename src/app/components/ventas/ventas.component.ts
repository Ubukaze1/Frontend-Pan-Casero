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
import {VentasService} from './service/ventas.service';

@Component({
  selector: 'app-ventas',
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
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
  providers: [VentasService, MessageService],
})
export class VentasComponent {

  constructor(private messageService: MessageService) { }
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly ventasService = inject(VentasService);

  subscription!: Subscription; //TODO
  listVentas: any[] = [];
  value!: string;

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  limit: number = this.pageSizeOptions[0];
  length: number = 0;
  skip: number = 0;

  ngOnInit(): void {
    this.getListVentas();

    this.subscription = this.ventasService.getIsList$().subscribe({
      next: (resp) => {
        if (resp) {
          this.getListVentas();
        }
      },
      error: (err) => {
        this.sweetAlertService.error(err);
      },
    });
  }

  getListVentas() {
    this.sweetAlertService.load();

    this.ventasService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listVentas = resp.data.list;
            this.length = resp.data.length;
            this.sweetAlertService.close();
          } else {
            this.listVentas = [];
            this.length = 0;
            this.sweetAlertService.information(resp.message);
          }
        },
        error: (err) => {
          this.sweetAlertService.error(err);
        },
      });
  }
}
