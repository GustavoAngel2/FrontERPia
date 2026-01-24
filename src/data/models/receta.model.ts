export interface Receta{
    Id: number;
    Nombre: string;
    FechaCreacion: string;
    FechaActualiza: string;
    UsuarioRegistra: string;
    UsuarioActualiza: string;
}

export interface InsertReceta{
    nombre: string;
    usuarioActualiza: number;
    usuarioRegistra: number;
}

export interface UpdateReceta{
    id:number;
    nombre:string;
    usuarioActualiza: string;
}