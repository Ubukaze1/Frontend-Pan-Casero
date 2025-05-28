import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interface/cart-item';

@Injectable({providedIn: 'root'})
export class CartService {
  /** Clave usada en localStorage */
  private STORAGE_KEY = 'miCarrito';

  /** BehaviorSubject que contiene el array de ítems actualmente en el carrito */
  private itemsSubject: BehaviorSubject<CartItem[]>;

  /** Observable público para suscribirse desde el header (o donde quieras) */
  public items$;

  /** BehaviorSubject que emite el total de unidades en el carrito (badge count) */
  private countSubject: BehaviorSubject<number>;
  public count$;

  constructor() {
    // 1) Al iniciar el servicio, intento leer lo que haya en localStorage
    const savedItemsJson = localStorage.getItem(this.STORAGE_KEY);
    let savedItems: CartItem[] = [];

    if (savedItemsJson) {
      try {
        savedItems = JSON.parse(savedItemsJson);
      } catch (e) {
        console.warn('Error parseando carrito guardado en localStorage', e);
        savedItems = [];
      }
    }

    // 2) Inicializo los BehaviorSubjects con lo que haya (o vacío)
    this.itemsSubject = new BehaviorSubject<CartItem[]>(savedItems);
    this.items$ = this.itemsSubject.asObservable();

    // 3) Calcular la cantidad total de unidades
    const initialCount = savedItems.reduce((sum, item) => sum + item.cantidad, 0);
    this.countSubject = new BehaviorSubject<number>(initialCount);
    this.count$ = this.countSubject.asObservable();
  }

  /** Devuelve una copia del array de ítems */
  getCartItems(): CartItem[] {
    return [...this.itemsSubject.value];
  }

  /** Devuelve solo el badge count (número de unidades totales) */
  getTotalCount(): number {
    return this.countSubject.value;
  }

  /**
   * Agrega un producto al carrito (o aumenta la cantidad si ya existía).
   * @param item El ítem a añadir (id, nombre, precio, img, cantidad)
   */
  addToCart(item: CartItem) {
    // 1) Obtener listado actual
    const currentItems = this.itemsSubject.value;
    const index = currentItems.findIndex(ci => ci.id === item.id);

    if (index > -1) {
      // Ya existe el mismo producto: simplemente incrementamos la cantidad
      currentItems[index].cantidad += item.cantidad;
    } else {
      // No existe: agregamos un nuevo objeto
      currentItems.push({ ...item });
    }
 this.emitAndSave(currentItems);
  }

  removeFromCart(productId: string) {
    const currentItems = this.itemsSubject.value.filter(ci => ci.id !== productId);
    this.emitAndSave(currentItems);
  }

  clearCart() {
    this.emitAndSave([]);
  }

  /**
   * Nuevo método: actualiza solo la cantidad de un ítem existente.
   * Si la nuevaCantidad es 0 o negativa, lo elimina directamente.
   */
  updateQuantity(productId: string, nuevaCantidad: number) {
    const currentItems = this.itemsSubject.value.map(ci => ({ ...ci })); // clonamos cada objeto
    const index = currentItems.findIndex(ci => ci.id === productId);

    if (index > -1) {
      if (nuevaCantidad < 1) {
        // Si la cantidad resultante es menor a 1, lo eliminamos del carrito.
        currentItems.splice(index, 1);
      } else {
        // Actualizamos la cantidad
        currentItems[index].cantidad = nuevaCantidad;
      }
      this.emitAndSave(currentItems);
    }
  }

  /** Emite a ambos subjects y guarda en localStorage */
  private emitAndSave(items: CartItem[]) {
    // 1) Emitir nuevo array de ítems
    this.itemsSubject.next(items);

    // 2) Recalcular y emitir el nuevo total de unidades
    const nuevoCount = items.reduce((sum, ci) => sum + ci.cantidad, 0);
    this.countSubject.next(nuevoCount);

    // 3) Guardar en localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage', e);
    }
  }
}

