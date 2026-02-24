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

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-5">
                <input className="form-control" placeholder="Nombre" value={form.Nombre} onChange={(e) => setForm({ ...form, Nombre: e.target.value })} />
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Dirección" value={form.Direccion} onChange={(e) => setForm({ ...form, Direccion: e.target.value })} />
              </div>
              <div className="col-md-2 d-flex gap-2">
                {editingId ? (
                  <>
                    <button className="btn btn-warning" onClick={() => actualizarBanco(editingId)} disabled={loading}>Actualizar</button>
                    <button className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ Nombre: "", Direccion: "" }); }} disabled={loading}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-success" onClick={crearBanco} disabled={loading}>Crear</button>
                )}
              </div>
            </div>
          </div>
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
    </>
  );
}

export default BancosView;
