export interface Product {
   id : string ,
   code :  string ,
   name :  string ,
   description :  string ,
   image :  string ,
   price : number,
   category :  string ,
   quantity : number,
   inventoryStatus :  string ,
   rating : number
}

export interface ProductDTO {
  data: Product[]
}


export interface ListaProductos {
  producto: string,
  categoria: string,
  precio: number,
  inventario: number,
}
