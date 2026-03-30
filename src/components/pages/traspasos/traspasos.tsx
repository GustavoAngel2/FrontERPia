import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type {
  Traspaso,
  GetTraspasosFilters,
  InsertTraspaso,
  UpdateTraspaso,
  AutorizarTraspaso,
} from "../../../data/models/traspasos.model";
import { traspasosService } from "../../../data/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function TraspasosView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [traspasos, setTraspasos] = useState<Traspaso[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState<GetTraspasosFilters>({
    pAlmacenOrigen: "",
    pAlmacenDestino: "",
    pFechaInicio: "",
    pFechaFinal: "",
  });

  const [form, setForm] = useState({
    IdAlmacenOrigen: 0,
    IdAlmacenDestino: 0,
    UsuarioEnvia: 0,
    FechaRecibido: "",
    Estatus: 0,
    UsuarioRecibe: 0,
  });

  const traspasosColumns: Column<Traspaso>[] = [
    { key: "Id", label: "ID", width: "70px" },
    { key: "IdAlmacenOrigen", label: "Almacén Origen", width: "130px" },
    { key: "IdAlmacenDestino", label: "Almacén Destino", width: "130px" },
    { key: "UsuarioEnvia", label: "Usuario Envía", width: "120px" },
    { key: "Estatus", label: "Estatus", width: "90px" },
    {
      key: "FechaRegistro",
      label: "Fecha Registro",
      width: "120px",
    },
  ];

  useEffect(() => {
    if (isLogged) obtenerTraspasos();
  }, [isLogged]);

  const limpiarFormulario = () => {
    setForm({
      IdAlmacenOrigen: 0,
      IdAlmacenDestino: 0,
      UsuarioEnvia: user?.Id || 0,
      FechaRecibido: "",
      Estatus: 0,
      UsuarioRecibe: 0,
    });
  };

  const obtenerTraspasos = async (customFilters?: GetTraspasosFilters) => {
    try {
      setLoading(true);
      const data = await traspasosService.obtenerTraspasos(customFilters ?? filters);
      setTraspasos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    await obtenerTraspasos(filters);
  };

  const limpiarFiltros = async () => {
    const cleared = {
      pAlmacenOrigen: "",
      pAlmacenDestino: "",
      pFechaInicio: "",
      pFechaFinal: "",
    };
    setFilters(cleared);
    await obtenerTraspasos(cleared);
  };

  const crearTraspaso = async () => {
    if (form.IdAlmacenOrigen <= 0 || form.IdAlmacenDestino <= 0) {
      return alert("Ingrese almacén origen y destino");
    }
    try {
      setLoading(true);
      const payload: InsertTraspaso = {
        idAlmacenOrigen: form.IdAlmacenOrigen,
        idAlmacenDestino: form.IdAlmacenDestino,
        usuarioEnvia: form.UsuarioEnvia || user?.Id || 0,
        usuarioActualiza: user?.Id || 0,
      };

      await traspasosService.crearTraspaso(payload);
      limpiarFormulario();
      setShowModal(false);
      await obtenerTraspasos();
    } catch (err) {
      console.error(err);
      alert("Error creando traspaso");
    } finally {
      setLoading(false);
    }
  };

  const actualizarTraspaso = async (id: number) => {
    if (form.IdAlmacenOrigen <= 0 || form.IdAlmacenDestino <= 0) {
      return alert("Ingrese almacén origen y destino");
    }
    try {
      setLoading(true);
      const payload: UpdateTraspaso = {
        id,
        idAlmacenOrigen: form.IdAlmacenOrigen,
        idAlmacenDestino: form.IdAlmacenDestino,
        usuarioEnvia: form.UsuarioEnvia || user?.Id || 0,
        usuarioActualiza: user?.Id || 0,
      };

      await traspasosService.actualizarTraspaso(payload);
      await obtenerTraspasos();
    } catch (err) {
      console.error(err);
      alert("Error actualizando traspaso");
    } finally {
      setLoading(false);
    }
  };

  const autorizarTraspaso = async (id: number) => {
    if (!form.FechaRecibido) return alert("Ingrese fecha de recibido");
    try {
      setLoading(true);
      const payload: AutorizarTraspaso = {
        id,
        fechaRecibido: form.FechaRecibido,
        estatus: form.Estatus,
        usuarioRecibe: form.UsuarioRecibe || user?.Id || 0,
        usuarioActualiza: user?.Id || 0,
      };

      await traspasosService.autorizarTraspaso(payload);
      limpiarFormulario();
      setEditingId(null);
      setShowModal(false);
      await obtenerTraspasos();
    } catch (err) {
      console.error(err);
      alert("Error autorizando traspaso");
    } finally {
      setLoading(false);
    }
  };

  const editarTraspaso = (t: Traspaso) => {
    setEditingId(t.Id);
    setForm({
      IdAlmacenOrigen: t.IdAlmacenOrigen || 0,
      IdAlmacenDestino: t.IdAlmacenDestino || 0,
      UsuarioEnvia: t.UsuarioEnvia || user?.Id || 0,
      FechaRecibido: "",
      Estatus: t.Estatus || 0,
      UsuarioRecibe: t.UsuarioRecibe || 0,
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEditingId(null);
    limpiarFormulario();
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    limpiarFormulario();
  };

  const eliminarTraspaso = async (id: number) => {
    if (!confirm("¿Eliminar traspaso?")) return;
    try {
      setLoading(true);
      await traspasosService.eliminarTraspaso(id);
      await obtenerTraspasos();
    } catch (err) {
      console.error(err);
      alert("Error eliminando traspaso");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver traspasos.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Traspasos</h2>

          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Almacén Origen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.pAlmacenOrigen || ""}
                    onChange={(e) => setFilters({ ...filters, pAlmacenOrigen: e.target.value })}
                    placeholder="ID o texto"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Almacén Destino</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.pAlmacenDestino || ""}
                    onChange={(e) => setFilters({ ...filters, pAlmacenDestino: e.target.value })}
                    placeholder="ID o texto"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.pFechaInicio || ""}
                    onChange={(e) => setFilters({ ...filters, pFechaInicio: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Fecha Final</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.pFechaFinal || ""}
                    onChange={(e) => setFilters({ ...filters, pFechaFinal: e.target.value })}
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end gap-2">
                  <button className="btn btn-primary w-100" onClick={aplicarFiltros} disabled={loading}>Buscar</button>
                  <button className="btn btn-outline-secondary w-100" onClick={limpiarFiltros} disabled={loading}>Limpiar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Traspaso
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={traspasos}
            columns={traspasosColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarTraspaso}
            onDelete={eliminarTraspaso}
            showActions={true}
            emptyMessage="No hay traspasos"
          />
        </div>
      </div>

      <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? "Editar Traspaso" : "Crear Traspaso"}</h5>
              <button type="button" className="btn-close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">ID Almacén Origen</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.IdAlmacenOrigen}
                    onChange={(e) => setForm({ ...form, IdAlmacenOrigen: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ID Almacén Destino</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.IdAlmacenDestino}
                    onChange={(e) => setForm({ ...form, IdAlmacenDestino: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Usuario Envía</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.UsuarioEnvia}
                    onChange={(e) => setForm({ ...form, UsuarioEnvia: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                {editingId && (
                  <>
                    <hr className="mt-2" />
                    <div className="col-md-4">
                      <label className="form-label">Fecha Recibido</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.FechaRecibido}
                        onChange={(e) => setForm({ ...form, FechaRecibido: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Estatus</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.Estatus}
                        onChange={(e) => setForm({ ...form, Estatus: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Usuario Recibe</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.UsuarioRecibe}
                        onChange={(e) => setForm({ ...form, UsuarioRecibe: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <>
                  <button type="button" className="btn btn-warning" onClick={() => actualizarTraspaso(editingId)} disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar"}
                  </button>
                  <button type="button" className="btn btn-success" onClick={() => autorizarTraspaso(editingId)} disabled={loading}>
                    {loading ? "Autorizando..." : "Autorizar"}
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearTraspaso} disabled={loading}>
                  {loading ? "Creando..." : "Crear"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default TraspasosView;