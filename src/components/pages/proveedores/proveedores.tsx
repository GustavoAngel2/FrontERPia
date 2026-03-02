import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Proveedor, InsertProveedor, UpdateProveedor } from "../../../data/models/proveedores.model";
import { proveedoresService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function ProveedoresView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [response, setResponse] = useState<defaultApiResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    Nombre: "",
    Direccion: "",
    Telefono: "",
    IdBanco: 0,
    PlazoPago: 0,
    Correo: "",
    RFC: "",
    RazonSocial: "",
    CLABE: "",
  });
  const [showModal, setShowModal] = useState(false);

  const proveedoresColumns: Column<Proveedor>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Nombre", label: "Nombre" },
    { key: "Direccion", label: "Dirección" },
    { key: "Telefono", label: "Teléfono", width: "120px" },
    { key: "Correo", label: "Correo" },
    { key: "RFC", label: "RFC", width: "100px" },
    { key: "RazonSocial", label: "Razón Social" },
    { key: "CLABE", label: "CLABE", width: "130px" },
    { key: "PlazoPago", label: "Plazo Pago", width: "100px" },
    {
      key: "FechaRegistro",
      label: "Fecha Registro",
      render: (value) => new Date(value).toLocaleDateString(),
      width: "120px",
    },
  ];

  useEffect(() => {
    if (isLogged) obtenerProveedores();
  }, [isLogged]);

  const obtenerProveedores = async () => {
    try {
      setLoading(true);
      const data: defaultApiResponse = await proveedoresService.obtenerProveedores();
      setResponse(data);
      if (data.Response?.data && Array.isArray(data.Response.data)) {
        setProveedores(data.Response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearProveedor = async () => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: InsertProveedor = {
        nombre: form.Nombre,
        direccion: form.Direccion,
        telefono: form.Telefono,
        idBanco: form.IdBanco,
        plazoPago: form.PlazoPago,
        correo: form.Correo,
        rfc: form.RFC,
        razonSocial: form.RazonSocial,
        clabe: form.CLABE,
        usuarioActualiza: user?.Id || 0,
      };
      await proveedoresService.crearProveedor(payload);
      setForm({ Nombre: "", Direccion: "", Telefono: "", IdBanco: 0, PlazoPago: 0, Correo: "", RFC: "", RazonSocial: "", CLABE: "" });
      setShowModal(false);
      await obtenerProveedores();
    } catch (err) {
      console.error(err);
      alert("Error creando proveedor");
    } finally {
      setLoading(false);
    }
  };

  const actualizarProveedor = async (id: number) => {
    if (!form.Nombre.trim()) return alert("Ingrese nombre");
    try {
      setLoading(true);
      const payload: UpdateProveedor = {
        id,
        nombre: form.Nombre,
        direccion: form.Direccion,
        telefono: form.Telefono,
        idBanco: form.IdBanco,
        plazoPago: form.PlazoPago,
        correo: form.Correo,
        rfc: form.RFC,
        razonSocial: form.RazonSocial,
        clabe: form.CLABE,
        usuarioActualiza: user?.Id || 0,
      };
      await proveedoresService.actualizarProveedor(payload);
      setForm({ Nombre: "", Direccion: "", Telefono: "", IdBanco: 0, PlazoPago: 0, Correo: "", RFC: "", RazonSocial: "", CLABE: "" });
      setEditingId(null);
      setShowModal(false);
      await obtenerProveedores();
    } catch (err) {
      console.error(err);
      alert("Error actualizando proveedor");
    } finally {
      setLoading(false);
    }
  };

  const editarProveedor = (p: Proveedor) => {
    setEditingId(p.Id);
    setForm({
      Nombre: p.Nombre,
      Direccion: p.Direccion,
      Telefono: p.Telefono,
      IdBanco: parseInt(p.Banco) || 0,
      PlazoPago: p.PlazoPago,
      Correo: p.Correo,
      RFC: p.RFC,
      RazonSocial: p.RazonSocial,
      CLABE: p.CLABE,
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setEditingId(null);
    setForm({
      Nombre: "",
      Direccion: "",
      Telefono: "",
      IdBanco: 0,
      PlazoPago: 0,
      Correo: "",
      RFC: "",
      RazonSocial: "",
      CLABE: "",
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      Nombre: "",
      Direccion: "",
      Telefono: "",
      IdBanco: 0,
      PlazoPago: 0,
      Correo: "",
      RFC: "",
      RazonSocial: "",
      CLABE: "",
    });
  };

  const eliminarProveedor = async (id: number) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    try {
      setLoading(true);
      await proveedoresService.eliminarProveedor(id);
      await obtenerProveedores();
    } catch (err) {
      console.error(err);
      alert("Error eliminando proveedor");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <>
        <div className="page-content">
          <div className="container mt-4">
            <div className="alert alert-warning">Debes iniciar sesión para ver proveedores.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container mt-4">
          <h2 className="mb-4">Proveedores</h2>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={abrirModalCrear}>
              <i className="fas fa-plus me-2"></i>Agregar Proveedor
            </button>
          </div>

          {loading && <div className="alert alert-info">Cargando...</div>}

          <DataTable
            data={proveedores}
            columns={proveedoresColumns}
            itemsPerPage={10}
            loading={loading}
            onEdit={editarProveedor}
            showActions={true}
            emptyMessage="No hay proveedores"
          />
        </div>
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar Proveedor' : 'Crear Proveedor'}</h5>
              <button type="button" className="btn-close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.Nombre}
                    onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                    placeholder="Ingrese nombre del proveedor"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.Direccion}
                    onChange={(e) => setForm({ ...form, Direccion: e.target.value })}
                    placeholder="Ingrese dirección"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.Telefono}
                    onChange={(e) => setForm({ ...form, Telefono: e.target.value })}
                    placeholder="Ingrese teléfono"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.Correo}
                    onChange={(e) => setForm({ ...form, Correo: e.target.value })}
                    placeholder="Ingrese correo electrónico"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">RFC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.RFC}
                    onChange={(e) => setForm({ ...form, RFC: e.target.value })}
                    placeholder="Ingrese RFC"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Razón Social</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.RazonSocial}
                    onChange={(e) => setForm({ ...form, RazonSocial: e.target.value })}
                    placeholder="Ingrese razón social"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">CLABE</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.CLABE}
                    onChange={(e) => setForm({ ...form, CLABE: e.target.value })}
                    placeholder="Ingrese CLABE"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ID Banco</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.IdBanco}
                    onChange={(e) => setForm({ ...form, IdBanco: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Plazo de Pago (días)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.PlazoPago}
                    onChange={(e) => setForm({ ...form, PlazoPago: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {editingId && (
                <button type="button" className="btn btn-danger me-auto" onClick={() => eliminarProveedor(editingId)} disabled={loading}>
                  {loading ? 'Eliminando...' : '🗑️ Eliminar'}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              {editingId ? (
                <button type="button" className="btn btn-warning" onClick={() => actualizarProveedor(editingId)} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={crearProveedor} disabled={loading}>
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

export default ProveedoresView;
