export interface Proveedor {
  Id: number;
  Nombre: string;
  Direccion: string;
  Telefono: string;
  Banco: string;
  PlazoPago: number;
  Correo: string;
  RFC: string;
  RazonSocial: string;
  CLABE: string;
  FechaRegistro: string;
  FechaActualiza: string;
  UsuarioActualiza: string;
}

export interface InsertProveedor {
  nombre: string;
  direccion: string;
  telefono: string;
  idBanco: number;
  plazoPago: number;
  correo: string;
  rfc: string;
  razonSocial: string;
  clabe: string;
  usuarioActualiza: number;
}

export interface UpdateProveedor {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  idBanco: number;
  plazoPago: number;
  correo: string;
  rfc: string;
  razonSocial: string;
  clabe: string;
  usuarioActualiza: number;
}