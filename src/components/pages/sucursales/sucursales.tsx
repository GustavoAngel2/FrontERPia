import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { Sucursal, InsertSucursal, UpdateSucursal } from "../../../data/models/sucursales.model";
import { sucursalesService } from "../../../data/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function SucursalesView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ Nombre: "", Direccion: "" });

  const sucursalesColumns: Column<Sucursal>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Nombre", label: "Nombre" },
    { key: "Direccion", label: "Dirección" },
    {
      key: "FechaRegistro",
      label: "Fecha Registro",
      render: (value) => {
        if (!value) return "-";
        const date = typeof value === "string" ? new Date(value.split("T")[0]) : new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
      },
    },
    {
      key: "FechaActualiza",
      label: "Fecha Actualiza",
      render: (value) => {
        if (!value) return "-";
        const date = typeof value === "string" ? new Date(value.split("T")[0]) : new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
      },
    },
  ];

  useEffect(() => {
    if (isLogged) obtenerSucursales();
  }, [isLogged]);

  const obtenerSucursales = async () => {
    try {
      setLoading(true);
      const data = await sucursalesService.obtenerSucursales();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearSucursal = async () => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: InsertSucursal = {
        nombre: form.Nombre,
        direccion: form.Direccion,
        idUsuario: user?.Id || 0,
      };
      await sucursalesService.crearSucursal(payload);
      setForm({ Nombre: "", Direccion: "" });
      setShowModal(false);
      await obtenerSucursales();
    } catch (err) {
      console.error(err);
      alert("Error creando sucursal");
    } finally {
      setLoading(false);
    }
  };

  const actualizarSucursal = async (id: number) => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: UpdateSucursal = {
        id,
        nombre: form.Nombre,
        direccion: form.Direccion,
        idUsuario: user?.Id || 0,
      };
      await sucursalesService.actualizarSucursal(payload);
      setForm({ Nombre: "", Direccion: "" });
      setEditingId(null);
      setShowModal(false);
      await obtenerSucursales();
    } catch (err) {
      console.error(err);
      alert("Error actualizando sucursal");
    } finally {
      setLoading(false);
    }
  };

  const editarSucursal = (s: Sucursal) => {
    setEditingId(s.Id);
    setForm({ Nombre: s.Nombre, Direccion: s.Direccion });
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

  const eliminarSucursal = async (id: number) => {
    if (!confirm("¿Eliminar sucursal?")) return;
    try {
      setLoading(true);
      await sucursalesService.eliminarSucursal(id);
      await obtenerSucursales();
    } catch (err) {
      console.error(err);
      alert("Error eliminando sucursal");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver sucursales.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Sucursales</h2>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Sucursal
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={sucursales}
            columns={sucursalesColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarSucursal}
            onDelete={eliminarSucursal}
            showActions={true}
            emptyMessage="No hay sucursales"
          />
        </div>
      </div>

      <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? "Editar Sucursal" : "Crear Sucursal"}</h5>
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
                  placeholder="Ingrese nombre"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.Direccion}
                  onChange={(e) => setForm({ ...form, Direccion: e.target.value })}
                  placeholder="Ingrese dirección"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <button type="button" className="btn btn-warning" onClick={() => actualizarSucursal(editingId)} disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearSucursal} disabled={loading}>
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

export default SucursalesView;