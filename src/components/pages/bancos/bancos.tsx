import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Producto as BancoModel, InsertProducto, UpdateProducto } from "../../../data/models/bancos.model";
import { bancosService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function BancosView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bancos, setBancos] = useState<BancoModel[]>([]);
  const [response, setResponse] = useState<defaultApiResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ Nombre: "", Direccion: "" });
  const [showModal, setShowModal] = useState(false);

  const bancosColumns: Column<BancoModel>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Nombre", label: "Nombre" },
    { key: "Direccion", label: "Dirección" },
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
    if (isLogged) obtenerBancos();
  }, [isLogged]);

  const obtenerBancos = async () => {
    try {
      setLoading(true);
      const data: defaultApiResponse = await bancosService.obtenerBancos();
      setResponse(data);
      if (data.Response?.data && Array.isArray(data.Response.data)) {
        setBancos(data.Response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearBanco = async () => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: InsertProducto = {
        nombre: form.Nombre,
        direccion: form.Direccion,
        usuarioActualiza: user?.Id || 0,
      };
      await bancosService.crearBanco(payload);
      setForm({ Nombre: "", Direccion: "" });
      setShowModal(false);
      await obtenerBancos();
    } catch (err) {
      console.error(err);
      alert("Error creando banco");
    } finally {
      setLoading(false);
    }
  };

  const actualizarBanco = async (id: number) => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: UpdateProducto = {
        id,
        nombre: form.Nombre,
        direccion: form.Direccion,
        usuarioActualiza: user?.Id || 0,
      };
      await bancosService.actualizarBanco(payload);
      setForm({ Nombre: "", Direccion: "" });
      setEditingId(null);
      setShowModal(false);
      await obtenerBancos();
    } catch (err) {
      console.error(err);
      alert("Error actualizando banco");
    } finally {
      setLoading(false);
    }
  };

  const editarBanco = (b: BancoModel) => {
    setEditingId(b.Id);
    setForm({ Nombre: b.Nombre, Direccion: b.Direccion });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEditingId(null);
    setForm({ Nombre: "", Direccion: "" });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ Nombre: "", Direccion: "" });
  };

  const eliminarBanco = async (id: number) => {
    if (!confirm("¿Eliminar banco?")) return;
    try {
      setLoading(true);
      await bancosService.eliminarBanco(id);
      await obtenerBancos();
    } catch (err) {
      console.error(err);
      alert("Error eliminando banco");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver bancos.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Bancos</h2>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Banco
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={bancos}
            columns={bancosColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarBanco}
            onDelete={eliminarBanco}
            showActions={true}
            emptyMessage="No hay bancos"
          />
        </div>
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar Banco' : 'Crear Banco'}</h5>
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
                  placeholder="Ingrese nombre del banco"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.Direccion}
                  onChange={(e) => setForm({ ...form, Direccion: e.target.value })}
                  placeholder="Ingrese dirección del banco"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <button type="button" className="btn btn-warning" onClick={() => actualizarBanco(editingId)} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearBanco} disabled={loading}>
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

export default BancosView;
