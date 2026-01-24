export interface LoginResponse {
  StatusCode: number;
  Success: boolean;
  Error: boolean;
  Message: string;
  Response: LoginResponseWrapper;
}

export interface LoginResponseWrapper {
  data: LoginData;
}

export interface LoginData {
  Status: boolean;
  Mensaje: string;
  Token: string;
  Usuario: UserInfo;
}

export interface UserInfo {
  Id: number;
  NombreUsuario: string;
  NombrePersona: string;
  IdPerfil: number;
}
