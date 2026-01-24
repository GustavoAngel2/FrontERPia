export interface Articulo {
    Codigo: string;
    Descripcion: string;
    Estatus: number;
    FechaActualiza: string;
    FechaRegistro: string;
    PrecioVenta:number;
    Id: number;
}

export interface aiApiResponse {
    sql: string;
    resultados: Articulo[];
}