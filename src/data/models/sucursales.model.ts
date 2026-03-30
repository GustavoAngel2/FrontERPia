export interface Sucursal {
  Id: number;
  Nombre: string;
  Direccion: string;
  FechaRegistro?: string;
  FechaActualiza?: string;
  UsuarioActualiza?: string;
}

export interface InsertSucursal {
  nombre: string;
  direccion: string;
  idUsuario: number;
}

export interface UpdateSucursal {
  id: number;
  nombre: string;
  direccion: string;
  idUsuario: number;
}