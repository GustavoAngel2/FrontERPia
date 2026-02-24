import type { defaultApiResponse } from "../data/models/response.model";
import type { Producto as ProductoModel, InsertProducto, UpdateProducto } from "../data/models/productos.model";
import type { Receta, InsertReceta, UpdateReceta } from "../data/models/receta.model";
import type { Producto as BancoModel, InsertProducto as InsertBanco, UpdateProducto as UpdateBanco } from "../data/models/bancos.model";
import type { Proveedor, InsertProveedor, UpdateProveedor } from "../data/models/proveedores.model";
import type { Categoria, InsertCategoria, UpdateCategoria } from "../data/models/categorias.model";
import type { aiApiResponse } from "../data/models/aiArticles.model";

const API_URL = "http://localhost:5020";
const AI_API_URL = "http://192.168.54.153:8000";

// ============== ARTICULOS SERVICE ==============
export const articulosService = {
  async consultarArticulos(pregunta: string): Promise<aiApiResponse> {
    const res = await fetch(`${AI_API_URL}/ia/consultar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pregunta }),
    });
    return res.json();
  },

  async descargarPDF(pregunta: string): Promise<Blob> {
    const res = await fetch(`${AI_API_URL}/ia/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pregunta }),
    });

    if (!res.ok) throw new Error("Error generando PDF");
    return res.blob();
  },
};

// ============== PRODUCTOS SERVICE ==============
export const productosService = {
  async obtenerProductos(): Promise<defaultApiResponse> {
    const res = await fetch(`${API_URL}/api/Productos/Get`, { method: "GET" });
    return res.json();
  },

  async crearProducto(payload: InsertProducto): Promise<void> {
    await fetch(`${API_URL}/api/Productos/Insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async actualizarProducto(payload: UpdateProducto): Promise<void> {
    await fetch(`${API_URL}/api/Productos/Update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async eliminarProducto(id: number): Promise<void> {
    await fetch(`${API_URL}/api/Productos/Delete/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  },
};

// ============== RECETAS SERVICE ==============
export const recetasService = {
  async obtenerRecetas(): Promise<defaultApiResponse> {
    const res = await fetch(`${API_URL}/api/Recetas/Get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  },

  async crearReceta(payload: InsertReceta): Promise<void> {
    const res = await fetch(`${API_URL}/api/Recetas/Insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error creando receta");
  },

  async actualizarReceta(id: number, payload: UpdateReceta): Promise<void> {
    const res = await fetch(`${API_URL}/api/Recetas/Update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error actualizando receta");
  },

  async eliminarReceta(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/Recetas/Delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error eliminando receta");
  },
};

// ============== BANCOS SERVICE ==============
export const bancosService = {
  async obtenerBancos(): Promise<defaultApiResponse> {
    const res = await fetch(`${API_URL}/api/Bancos/Get`, { method: "GET" });
    return res.json();
  },

  async crearBanco(payload: InsertBanco): Promise<void> {
    await fetch(`${API_URL}/api/Bancos/Insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async actualizarBanco(payload: UpdateBanco): Promise<void> {
    await fetch(`${API_URL}/api/Bancos/Update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async eliminarBanco(id: number): Promise<void> {
    await fetch(`${API_URL}/api/Bancos/Delete/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  },
};

// ============== PROVEEDORES SERVICE ==============
export const proveedoresService = {
  async obtenerProveedores(): Promise<defaultApiResponse> {
    const res = await fetch(`${API_URL}/api/Proveedores/Get`, { method: "GET" });
    return res.json();
  },

  async crearProveedor(payload: InsertProveedor): Promise<void> {
    await fetch(`${API_URL}/api/Proveedores/Insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async actualizarProveedor(payload: UpdateProveedor): Promise<void> {
    await fetch(`${API_URL}/api/Proveedores/Update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async eliminarProveedor(id: number): Promise<void> {
    await fetch(`${API_URL}/api/Proveedores/Delete/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  },
};

// ============== CATEGORIAS SERVICE ==============
export const categoriasService = {
  async obtenerCategorias(): Promise<defaultApiResponse> {
    const res = await fetch(`${API_URL}/api/Categorias/Get`, { method: "GET" });
    return res.json();
  },

  async crearCategoria(payload: InsertCategoria): Promise<void> {
    await fetch(`${API_URL}/api/Categorias/Insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async actualizarCategoria(payload: UpdateCategoria): Promise<void> {
    await fetch(`${API_URL}/api/Categorias/Update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async eliminarCategoria(id: number): Promise<void> {
    await fetch(`${API_URL}/api/Categorias/Delete/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  },
};
