export interface InsertDetalleReceta {
    idReceta: number
    insumo: string
    cantidad: number
    usuarioActualiza: number
}

export interface UpdateDetalleReceta {
    id: number
    insumo: string
    cantidad: number
    usuarioActualiza: number
}

export interface GetDetalleReceta {
    idReceta: number
}