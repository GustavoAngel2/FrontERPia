export interface Producto {
    Id: number,
    Nombre: string,
    Direccion: string,
    FechaRegistro: string,
    FechaActualiza: string,
    UsuarioActualiza: string
}

export interface InsertProducto {
    nombre: string,
    direccion: string,
    usuarioActualiza: number
}

export interface UpdateProducto {
    id: number;
    nombre: string,
    direccion: string,
    usuarioActualiza: number
}