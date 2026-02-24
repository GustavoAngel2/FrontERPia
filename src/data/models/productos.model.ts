export interface Producto {
    Id: number;
    Producto: string;
    Codigo: string;
    Descripcion: string;
    Costo: number;
    PrecioVenta: number;
    UnidadMedida: string;
    FechaRegistro: string;
    FechaActualiza: string;
    UsuarioActualiza: string;
    Tipo: string;
}

export interface InsertProducto {
    producto: string,
    descripcion: string,
    costo: number,
    unidadMedida: number,
    tipo: number,
    usuarioActualiza: number,
    codigo: string,
    precioVenta: number
}

export interface UpdateProducto {
    id: number;
    producto: string,
    descripcion: string,
    costo: number,
    unidadMedida: number,
    tipo: number,
    usuarioActualiza: number,
    codigo: string,
    precioVenta: number
}