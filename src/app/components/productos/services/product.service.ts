import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly URL_API = environment.apiUrl + '/product';
  private readonly isList = new BehaviorSubject<boolean>(false);
  private readonly isList$ = this.isList.asObservable();
  private readonly http = inject(HttpClient);

  constructor() { }

  sendIsList$(resp: boolean) {
    return this.isList.next(resp);
  }

  getIsList$() {
    return this.isList$;
  }

  create(data: any) {
    return this.http.post<any>(this.URL_API, data)
      .pipe(
        catchError(err => throwError(() => err))
      )
  }

  update(id: string, data: any) {
    return this.http.patch<any>(this.URL_API + `/${id}`, data)
      .pipe(
        catchError(err => throwError(() => err))
      )
  }

  find(id: string) {
    return this.http.get<any>(this.URL_API + `/${id}`)
      .pipe(
        catchError(err => throwError(() => err))
      )
  }

  list(params: { limit?: string; offset?: string; }) {
    return this.http.get<any>(this.URL_API, { params })
      .pipe(
        catchError(err => throwError(() => err))
      )
  }
}
