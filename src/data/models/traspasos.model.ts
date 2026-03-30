export interface Traspaso {
  Id: number;
  IdAlmacenOrigen?: number;
  IdAlmacenDestino?: number;
  UsuarioEnvia?: number;
  UsuarioRecibe?: number;
  Estatus?: number;
  FechaRegistro?: string;
  FechaActualiza?: string;
}

export interface GetTraspasosFilters {
  pAlmacenOrigen?: string;
  pAlmacenDestino?: string;
  pFechaInicio?: string;
  pFechaFinal?: string;
}

export interface InsertTraspaso {
  idAlmacenOrigen: number;
  idAlmacenDestino: number;
  usuarioEnvia: number;
  usuarioActualiza: number;
}

export interface UpdateTraspaso {
  id: number;
  idAlmacenOrigen: number;
  idAlmacenDestino: number;
  usuarioEnvia: number;
  usuarioActualiza: number;
}

export interface AutorizarTraspaso {
  id: number;
  fechaRecibido: string;
  estatus: number;
  usuarioRecibe: number;
  usuarioActualiza: number;
}