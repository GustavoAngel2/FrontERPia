export interface Movimiento {
  Id: number;
  IdSucursal?: number;
  TipoMovimiento?: number;
  IdProveedor?: number;
  FolioFactura?: string;
  Estatus?: number;
  IdAlmacen?: number;
  UsuarioRegistro?: number;
  UsuarioRegistra?: number;
  UsuarioAutoriza?: number;
  UsuarioActualiza?: number;
  FechaRegistro?: string;
  FechaActualiza?: string;
}

export interface InsertMovimiento {
  idSucursal: number;
  tipoMovimiento: number;
  idProveedor: number;
  folioFactura: string;
  usuarioRegistro: number;
}

export interface UpdateMovimiento {
  id: number;
  idAlmacen: number;
  tipoMovimiento: number;
  estatus: number;
  usuarioRegistra: number;
  usuarioAutoriza: number;
  usuarioActualiza: number;
}