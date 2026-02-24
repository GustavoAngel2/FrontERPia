export interface Categoria {
    Id: number
    Nombre: string
    FechaRegistro: string
    FechaActualiza: string
    UsuarioActualiza:string
}

export interface InsertCategoria {
    nombre: string;
    usuarioActualiza: number;
}

export interface UpdateCategoria {
    id: number;
    nombre: string;
    usuarioActualiza: number;
}