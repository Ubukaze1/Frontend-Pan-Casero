import { Component, inject } from '@angular/core';
import {HeaderComponent} from '../mainpage/header/header.component';
import {FooterComponent} from '../mainpage/footer/footer.component';
import {CardmodalComponent} from './cardmodal/cardmodal.component';
import {SweetAlertService} from '../shared/sweet-alert.service';
import {TiendaService} from './service/tienda.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tienda',
  imports: [ HeaderComponent, FooterComponent, CardmodalComponent],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  wandh = "width: 300px ;height: 235px; border-radius: 0px;"
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly tiendaService = inject(TiendaService);

  subscription!: Subscription; //TODO
  listProducts: any[] = [];
  value!: string;
  cantidadArticulos:number = 0

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  limit: number = this.pageSizeOptions[0];
  length: number = 0;
  skip: number = 0;

  ngOnInit(): void {
    this.getListProducts();

    this.subscription = this.tiendaService.getIsList$().subscribe({
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

    this.tiendaService
      .list({ limit: this.limit.toString(), offset: this.skip.toString() })
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200) {
            this.listProducts = resp.data.list;
            this.length = resp.data.length;
            this.cantidadArticulos = this.length
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

}
