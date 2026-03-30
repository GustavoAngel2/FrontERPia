import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { Movimiento, InsertMovimiento, UpdateMovimiento } from "../../../data/models/movimientos.model";
import { movimientosService } from "../../../data/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function MovimientosView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    IdSucursal: 0,
    TipoMovimiento: 0,
    IdProveedor: 0,
    FolioFactura: "",
    IdAlmacen: 0,
    Estatus: 0,
    UsuarioAutoriza: 0,
  });

  const movimientoColumns: Column<Movimiento>[] = [
    { key: "Id", label: "ID", width: "70px" },
    { key: "IdSucursal", label: "Sucursal", width: "90px" },
    { key: "TipoMovimiento", label: "Tipo", width: "90px" },
    { key: "IdProveedor", label: "Proveedor", width: "100px" },
    { key: "FolioFactura", label: "Folio Factura" },
    { key: "IdAlmacen", label: "Almacén", width: "90px" },
    { key: "Estatus", label: "Estatus", width: "90px" },
    {
      key: "FechaRegistro",
      label: "Fecha Registro",
      render: (value) => {
        if (!value) return "-";
        const date = typeof value === "string" ? new Date(value.split("T")[0]) : new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
      },
      width: "120px",
    },
  ];

  useEffect(() => {
    if (isLogged) obtenerMovimientos();
  }, [isLogged]);

  const obtenerMovimientos = async () => {
    try {
      setLoading(true);
      const data = await movimientosService.obtenerMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      IdSucursal: 0,
      TipoMovimiento: 0,
      IdProveedor: 0,
      FolioFactura: "",
      IdAlmacen: 0,
      Estatus: 0,
      UsuarioAutoriza: 0,
    });
  };

  const crearMovimiento = async () => {
    if (!form.FolioFactura.trim()) return alert("Ingrese folio de factura");
    try {
      setLoading(true);
      const payload: InsertMovimiento = {
        idSucursal: form.IdSucursal,
        tipoMovimiento: form.TipoMovimiento,
        idProveedor: form.IdProveedor,
        folioFactura: form.FolioFactura,
        usuarioRegistro: user?.Id || 0,
      };

      await movimientosService.crearMovimiento(payload);
      limpiarFormulario();
      setShowModal(false);
      await obtenerMovimientos();
    } catch (err) {
      console.error(err);
      alert("Error creando movimiento");
    } finally {
      setLoading(false);
    }
  };

  const actualizarMovimiento = async (id: number) => {
    try {
      setLoading(true);
      const payload: UpdateMovimiento = {
        id,
        idAlmacen: form.IdAlmacen,
        tipoMovimiento: form.TipoMovimiento,
        estatus: form.Estatus,
        usuarioRegistra: user?.Id || 0,
        usuarioAutoriza: form.UsuarioAutoriza,
        usuarioActualiza: user?.Id || 0,
      };

      await movimientosService.actualizarMovimiento(payload);
      limpiarFormulario();
      setEditingId(null);
      setShowModal(false);
      await obtenerMovimientos();
    } catch (err) {
      console.error(err);
      alert("Error actualizando movimiento");
    } finally {
      setLoading(false);
    }
  };

  const editarMovimiento = (m: Movimiento) => {
    setEditingId(m.Id);
    setForm({
      IdSucursal: m.IdSucursal || 0,
      TipoMovimiento: m.TipoMovimiento || 0,
      IdProveedor: m.IdProveedor || 0,
      FolioFactura: m.FolioFactura || "",
      IdAlmacen: m.IdAlmacen || 0,
      Estatus: m.Estatus || 0,
      UsuarioAutoriza: m.UsuarioAutoriza || 0,
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

  const eliminarMovimiento = async (id: number) => {
    if (!confirm("¿Eliminar movimiento?")) return;
    try {
      setLoading(true);
      await movimientosService.eliminarMovimiento(id);
      await obtenerMovimientos();
    } catch (err) {
      console.error(err);
      alert("Error eliminando movimiento");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver movimientos.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Movimientos</h2>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Movimiento
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={movimientos}
            columns={movimientoColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarMovimiento}
            onDelete={eliminarMovimiento}
            showActions={true}
            emptyMessage="No hay movimientos"
          />
        </div>
      </div>

      <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? "Editar Movimiento" : "Crear Movimiento"}</h5>
              <button type="button" className="btn-close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                {!editingId && (
                  <>
                    <div className="col-md-4">
                      <label className="form-label">ID Sucursal</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.IdSucursal}
                        onChange={(e) => setForm({ ...form, IdSucursal: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Tipo Movimiento</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.TipoMovimiento}
                        onChange={(e) => setForm({ ...form, TipoMovimiento: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">ID Proveedor</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.IdProveedor}
                        onChange={(e) => setForm({ ...form, IdProveedor: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Folio Factura</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.FolioFactura}
                        onChange={(e) => setForm({ ...form, FolioFactura: e.target.value })}
                        placeholder="Ingrese folio de factura"
                      />
                    </div>
                  </>
                )}

                {editingId && (
                  <>
                    <div className="col-md-4">
                      <label className="form-label">ID Almacén</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.IdAlmacen}
                        onChange={(e) => setForm({ ...form, IdAlmacen: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Tipo Movimiento</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.TipoMovimiento}
                        onChange={(e) => setForm({ ...form, TipoMovimiento: parseInt(e.target.value) || 0 })}
                        placeholder="0"
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
                    <div className="col-md-6">
                      <label className="form-label">Usuario Autoriza</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.UsuarioAutoriza}
                        onChange={(e) => setForm({ ...form, UsuarioAutoriza: parseInt(e.target.value) || 0 })}
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
                <button type="button" className="btn btn-warning" onClick={() => actualizarMovimiento(editingId)} disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearMovimiento} disabled={loading}>
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

export default MovimientosView;