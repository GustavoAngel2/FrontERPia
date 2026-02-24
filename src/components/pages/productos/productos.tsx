import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Producto as ProductoModel, InsertProducto, UpdateProducto } from "../../../data/models/productos.model";
import { productosService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function ProductosView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<ProductoModel[]>([]);
  const [response, setResponse] = useState<defaultApiResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" });

  const productosColumns: Column<ProductoModel>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Codigo", label: "Código" },
    { key: "Descripcion", label: "Descripción" },
    {
      key: "PrecioVenta",
      label: "Precio",
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: "FechaRegistro",
      label: "Fecha Registro",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "FechaActualiza",
      label: "Fecha Actualiza",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    if (isLogged) obtenerProductos();
  }, [isLogged]);

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const data: defaultApiResponse = await productosService.obtenerProductos();
      setResponse(data);
      if (data.Response?.data && Array.isArray(data.Response.data)) {
        setProductos(data.Response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearProducto = async () => {
    if (!form.Descripcion.trim()) return alert("Ingrese descripción");
    try {
      setLoading(true);
      const payload: InsertProducto = {
        producto: form.Codigo,
        descripcion: form.Descripcion,
        costo: parseFloat(form.Costo) || 0,
        unidadMedida: 1,
        tipo: 1,
        usuarioActualiza: user?.Id || 0,
        codigo: form.Codigo,
        precioVenta: parseFloat(form.PrecioVenta) || 0,
      };
      await productosService.crearProducto(payload);
      setForm({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" });
      await obtenerProductos();
    } catch (err) {
      console.error(err);
      alert("Error creando producto");
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (id: number) => {
    if (!form.Descripcion.trim()) return alert("Ingrese descripción");
    try {
      setLoading(true);
      const payload: UpdateProducto = {
        id,
        producto: form.Descripcion,
        descripcion: form.Descripcion,
        costo: parseFloat(form.Costo) || 0,
        unidadMedida: 1,
        tipo: 1,
        usuarioActualiza: user?.Id || 0,
        codigo: form.Codigo,
        precioVenta: parseFloat(form.PrecioVenta) || 0,
      };
      await productosService.actualizarProducto(payload);
      setForm({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" });
      setEditingId(null);
      await obtenerProductos();
    } catch (err) {
      console.error(err);
      alert("Error actualizando producto");
    } finally {
      setLoading(false);
    }
  };

  const editarProducto = (p: ProductoModel) => {
    setEditingId(p.Id);
    setForm({ Costo: p.Costo.toString(), Codigo: p.Codigo, Descripcion: p.Descripcion, PrecioVenta: p.PrecioVenta.toString() });
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      setLoading(true);
      await productosService.eliminarProducto(id);
      await obtenerProductos();
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver productos.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Productos</h2>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-3">
                <input className="form-control" placeholder="Código" value={form.Codigo} onChange={(e) => setForm({ ...form, Codigo: e.target.value })} />
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Descripción" value={form.Descripcion} onChange={(e) => setForm({ ...form, Descripcion: e.target.value })} />
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Costo" value={form.Costo} onChange={(e) => setForm({ ...form, Costo: e.target.value })} type="number" step="0.01" />
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Precio" value={form.PrecioVenta} onChange={(e) => setForm({ ...form, PrecioVenta: e.target.value })} type="number" step="0.01" />
              </div>
              <div className="col-md-2 d-flex gap-2">
                {editingId ? (
                  <>
                    <button className="btn btn-warning" onClick={() => actualizarProducto(editingId)} disabled={loading}>Actualizar</button>
                    <button className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" }); }} disabled={loading}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-success" onClick={crearProducto} disabled={loading}>Crear</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading && <div className="alert alert-info">Cargando...</div>}

        <DataTable
          data={productos}
          columns={productosColumns}
          itemsPerPage={10}
          loading={loading}
          onEdit={editarProducto}
          onDelete={eliminarProducto}
          showActions={true}
          emptyMessage="No hay productos"
        />
        </div>
      </div>
    </>
  );
}

export default ProductosView;
