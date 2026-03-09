import type { defaultApiResponse } from "../data/models/response.model";
import type { Producto as ProductoModel, InsertProducto, UpdateProducto } from "../data/models/productos.model";
import type { Receta, InsertReceta, UpdateReceta } from "../data/models/receta.model";
import type { Producto as BancoModel, InsertProducto as InsertBanco, UpdateProducto as UpdateBanco } from "../data/models/bancos.model";
import type { Proveedor, InsertProveedor, UpdateProveedor } from "../data/models/proveedores.model";
import type { Categoria, InsertCategoria, UpdateCategoria } from "../data/models/categorias.model";
import type { aiApiResponse } from "../data/models/aiArticles.model";
import type { GetDetalleReceta, InsertDetalleReceta, UpdateDetalleReceta } from "../data/models/detalleReceta.model";

const API_URL = "http://localhost:5020";
const AI_API_URL = "http://192.168.54.153:8000";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

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
  obtenerProductos(): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/Productos/Get`, { method: "GET" });
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
  obtenerRecetas(): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/Recetas/Get`, { method: "GET" });
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
  obtenerBancos(): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/Bancos/Get`, { method: "GET" });
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
  obtenerProveedores(): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/Proveedores/Get`, { method: "GET" });
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
  obtenerCategorias(): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/Categorias/Get`, { method: "GET" });
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
  obtenerDetallesReceta(payload: GetDetalleReceta): Promise<defaultApiResponse> {
    return fetchJSON(`${API_URL}/api/DetalleReceta/Get`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
