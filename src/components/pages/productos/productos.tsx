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
  const [showModal, setShowModal] = useState(false);

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
      render: (value) => {
        if (!value) return "-";
        const date = typeof value === 'string' ? new Date(value.split('T')[0]) : new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
      },
    },
    {
      key: "FechaActualiza",
      label: "Fecha Actualiza",
      render: (value) => {
        if (!value) return "-";
        const date = typeof value === 'string' ? new Date(value.split('T')[0]) : new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
      },
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
      setShowModal(false);
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
      setShowModal(false);
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
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEditingId(null);
    setForm({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ Costo: "", Codigo: "", Descripcion: "", PrecioVenta: "" });
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

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Producto
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={productos}
            columns={productosColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarProducto}
            showActions={true}
            emptyMessage="No hay productos"
          />
        </div>
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar Producto' : 'Crear Producto'}</h5>
              <button type="button" className="btn-close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Código</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.Codigo}
                    onChange={(e) => setForm({ ...form, Codigo: e.target.value })}
                    placeholder="Ingrese código del producto"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.Descripcion}
                    onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                    placeholder="Ingrese descripción del producto"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Costo</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={form.Costo}
                    onChange={(e) => setForm({ ...form, Costo: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Precio de Venta</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={form.PrecioVenta}
                    onChange={(e) => setForm({ ...form, PrecioVenta: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {editingId && (
                <button type="button" className="btn btn-danger me-auto" onClick={() => eliminarProducto(editingId)} disabled={loading}>
                  {loading ? 'Eliminando...' : '🗑️ Eliminar'}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <button type="button" className="btn btn-warning" onClick={() => actualizarProducto(editingId)} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearProducto} disabled={loading}>
                  {loading ? 'Creando...' : 'Crear'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default ProductosView;
