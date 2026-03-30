import type { defaultApiResponse } from "./models/response.model";
import type { Producto as ProductoModel, InsertProducto, UpdateProducto } from "./models/productos.model";
import type { Receta, InsertReceta, UpdateReceta } from "./models/receta.model";
import type { Producto as BancoModel, InsertProducto as InsertBanco, UpdateProducto as UpdateBanco } from "./models/bancos.model";
import type { Proveedor, InsertProveedor, UpdateProveedor } from "./models/proveedores.model";
import type { Categoria, InsertCategoria, UpdateCategoria } from "./models/categorias.model";
import type { aiApiResponse } from "./models/aiArticles.model";
import type { GetDetalleReceta, InsertDetalleReceta, UpdateDetalleReceta } from "./models/detalleReceta.model";
import type { Movimiento, InsertMovimiento, UpdateMovimiento } from "./models/movimientos.model";
import type { Sucursal, InsertSucursal, UpdateSucursal } from "./models/sucursales.model";
import type {
  Traspaso,
  GetTraspasosFilters,
  InsertTraspaso,
  UpdateTraspaso,
  AutorizarTraspaso,
} from "./models/traspasos.model";

const API_URL = "http://187.77.10.190:7000";
const AI_API_URL = "http://187.77.10.190:8000";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

function extractResponseData<T>(response: any): T {
  return (response?.Data ?? response?.Response?.Data ?? response?.Response?.data ?? response?.Response) as T;
}

// ============== REUSABLE FETCH HELPER ==============
async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchBlob(url: string, options: RequestInit = {}): Promise<Blob> {
  const response = await fetch(url, {
    ...options,
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.blob();
}

// ============== ARTICULOS SERVICE ==============
export const articulosService = {
  consultarArticulos(pregunta: string): Promise<aiApiResponse> {
    return fetchJSON(`${AI_API_URL}/ia/consultar`, {
      method: "POST",
      body: JSON.stringify({ pregunta }),
    });
  },

  descargarPDF(pregunta: string): Promise<Blob> {
    return fetchBlob(`${AI_API_URL}/ia/pdf`, {
      method: "POST",
      body: JSON.stringify({ pregunta }),
    });
  },
};

// ============== PRODUCTOS SERVICE ==============
export const productosService = {
  async obtenerProductos(): Promise<ProductoModel[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Productos/Get`, { method: "GET" });
    return extractResponseData<ProductoModel[]>(response) ?? [];
  },

  crearProducto(payload: InsertProducto): Promise<void> {
    return fetchJSON(`${API_URL}/api/Productos/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarProducto(payload: UpdateProducto): Promise<void> {
    return fetchJSON(`${API_URL}/api/Productos/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarProducto(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Productos/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== RECETAS SERVICE ==============
export const recetasService = {
  async obtenerRecetas(): Promise<Receta[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Recetas/Get`, { method: "GET" });
    return extractResponseData<Receta[]>(response) ?? [];
  },

  crearReceta(payload: InsertReceta): Promise<void> {
    return fetchJSON(`${API_URL}/api/Recetas/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarReceta(id: number, payload: UpdateReceta): Promise<void> {
    return fetchJSON(`${API_URL}/api/Recetas/Update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarReceta(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Recetas/Delete/${id}`, {
      method: "DELETE",
    });
  },
};

// ============== BANCOS SERVICE ==============
export const bancosService = {
  async obtenerBancos(): Promise<BancoModel[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Bancos/Get`, { method: "GET" });
    return extractResponseData<BancoModel[]>(response) ?? [];
  },

  crearBanco(payload: InsertBanco): Promise<void> {
    return fetchJSON(`${API_URL}/api/Bancos/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarBanco(payload: UpdateBanco): Promise<void> {
    return fetchJSON(`${API_URL}/api/Bancos/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarBanco(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Bancos/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== PROVEEDORES SERVICE ==============
export const proveedoresService = {
  async obtenerProveedores(): Promise<Proveedor[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Proveedores/Get`, { method: "GET" });
    return extractResponseData<Proveedor[]>(response) ?? [];
  },

  crearProveedor(payload: InsertProveedor): Promise<void> {
    return fetchJSON(`${API_URL}/api/Proveedores/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarProveedor(payload: UpdateProveedor): Promise<void> {
    return fetchJSON(`${API_URL}/api/Proveedores/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarProveedor(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Proveedores/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== CATEGORIAS SERVICE ==============
export const categoriasService = {
  async obtenerCategorias(): Promise<Categoria[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Categorias/Get`, { method: "GET" });
    return extractResponseData<Categoria[]>(response) ?? [];
  },

  crearCategoria(payload: InsertCategoria): Promise<void> {
    return fetchJSON(`${API_URL}/api/Categorias/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarCategoria(payload: UpdateCategoria): Promise<void> {
    return fetchJSON(`${API_URL}/api/Categorias/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarCategoria(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Categorias/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== DETALLE RECETA SERVICE ==============
export const detalleRecetaService = {
  async obtenerDetallesReceta(payload: GetDetalleReceta): Promise<unknown[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/DetalleReceta/Get`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return extractResponseData<unknown[]>(response) ?? [];
  },

  crearDetalleReceta(payload: InsertDetalleReceta): Promise<void> {
    return fetchJSON(`${API_URL}/api/DetalleReceta/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarDetalleReceta(payload: UpdateDetalleReceta): Promise<void> {
    return fetchJSON(`${API_URL}/api/DetalleReceta/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarDetalleReceta(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/DetalleReceta/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== MOVIMIENTOS SERVICE ==============
export const movimientosService = {
  async obtenerMovimientos(): Promise<Movimiento[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Movimientos/Get`, { method: "GET" });
    return extractResponseData<Movimiento[]>(response) ?? [];
  },

  crearMovimiento(payload: InsertMovimiento): Promise<void> {
    return fetchJSON(`${API_URL}/api/Movimientos/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarMovimiento(payload: UpdateMovimiento): Promise<void> {
    return fetchJSON(`${API_URL}/api/Movimientos/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarMovimiento(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Movimientos/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== SUCURSALES SERVICE ==============
export const sucursalesService = {
  async obtenerSucursales(): Promise<Sucursal[]> {
    const response = await fetchJSON<defaultApiResponse>(`${API_URL}/api/Sucursales/Get`, { method: "GET" });
    return extractResponseData<Sucursal[]>(response) ?? [];
  },

  crearSucursal(payload: InsertSucursal): Promise<void> {
    return fetchJSON(`${API_URL}/api/Sucursales/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarSucursal(payload: UpdateSucursal): Promise<void> {
    return fetchJSON(`${API_URL}/api/Sucursales/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarSucursal(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Sucursales/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },
};

// ============== TRASPASOS SERVICE ==============
export const traspasosService = {
  async obtenerTraspasos(filters?: GetTraspasosFilters): Promise<Traspaso[]> {
    const query = new URLSearchParams();

    if (filters?.pAlmacenOrigen) query.append("pAlmacenOrigen", filters.pAlmacenOrigen);
    if (filters?.pAlmacenDestino) query.append("pAlmacenDestino", filters.pAlmacenDestino);
    if (filters?.pFechaInicio) query.append("pFechaInicio", filters.pFechaInicio);
    if (filters?.pFechaFinal) query.append("pFechaFinal", filters.pFechaFinal);

    const queryString = query.toString();
    const endpoint = queryString
      ? `${API_URL}/api/Traspasos/Get?${queryString}`
      : `${API_URL}/api/Traspasos/Get`;

    const response = await fetchJSON<defaultApiResponse>(endpoint, { method: "GET" });
    return extractResponseData<Traspaso[]>(response) ?? [];
  },

  crearTraspaso(payload: InsertTraspaso): Promise<void> {
    return fetchJSON(`${API_URL}/api/Traspasos/Insert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarTraspaso(payload: UpdateTraspaso): Promise<void> {
    return fetchJSON(`${API_URL}/api/Traspasos/Update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  eliminarTraspaso(id: number): Promise<void> {
    return fetchJSON(`${API_URL}/api/Traspasos/Delete/`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
  },

  autorizarTraspaso(payload: AutorizarTraspaso): Promise<void> {
    return fetchJSON(`${API_URL}/api/Traspasos/AutorizarTraspaso`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
