import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { Categoria, InsertCategoria, UpdateCategoria } from "../../../data/models/categorias.model";
import { categoriasService } from "../../../data/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function CategoriasView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ Nombre: "" });
  const [showModal, setShowModal] = useState(false);

  const categoriasColumns: Column<Categoria>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Nombre", label: "Nombre" },
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
    if (isLogged) obtenerCategorias();
  }, [isLogged]);

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriasService.obtenerCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearCategoria = async () => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: InsertCategoria = {
        nombre: form.Nombre,
        usuarioActualiza: user?.Id || 0,
      };
      await categoriasService.crearCategoria(payload);
      setForm({ Nombre: "" });
      setShowModal(false);
      await obtenerCategorias();
    } catch (err) {
      console.error(err);
      alert("Error creando categoría");
    } finally {
      setLoading(false);
    }
  };

  const actualizarCategoria = async (id: number) => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: UpdateCategoria = {
        id,
        nombre: form.Nombre,
        usuarioActualiza: user?.Id || 0,
      };
      await categoriasService.actualizarCategoria(payload);
      setForm({ Nombre: "" });
      setEditingId(null);
      setShowModal(false);
      await obtenerCategorias();
    } catch (err) {
      console.error(err);
      alert("Error actualizando categoría");
    } finally {
      setLoading(false);
    }
  };

  const editarCategoria = (c: Categoria) => {
    setEditingId(c.Id);
    setForm({ Nombre: c.Nombre });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEditingId(null);
    setForm({ Nombre: "" });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ Nombre: "" });
  };

  const eliminarCategoria = async (id: number) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      setLoading(true);
      await categoriasService.eliminarCategoria(id);
      await obtenerCategorias();
    } catch (err) {
      console.error(err);
      alert("Error eliminando categoría");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver categorías.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Categorías</h2>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Categoría
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={categorias}
            columns={categoriasColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarCategoria}
            showActions={true}
            emptyMessage="No hay categorías"
          />
        </div>
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar Categoría' : 'Crear Categoría'}</h5>
              <button type="button" className="btn-close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.Nombre}
                  onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                  placeholder="Ingrese nombre de la categoría"
                />
              </div>
            </div>
            <div className="modal-footer">
              {editingId && (
                <button type="button" className="btn btn-danger me-auto" onClick={() => eliminarCategoria(editingId)} disabled={loading}>
                  {loading ? 'Eliminando...' : '🗑️ Eliminar'}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <button type="button" className="btn btn-warning" onClick={() => actualizarCategoria(editingId)} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearCategoria} disabled={loading}>
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

export default CategoriasView;
