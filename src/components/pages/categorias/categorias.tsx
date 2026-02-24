import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Categoria, InsertCategoria, UpdateCategoria } from "../../../data/models/categorias.model";
import { categoriasService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function CategoriasView() {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [response, setResponse] = useState<defaultApiResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ Nombre: "" });

  const categoriasColumns: Column<Categoria>[] = [
    { key: "Id", label: "ID", width: "60px" },
    { key: "Nombre", label: "Nombre" },
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
    if (isLogged) obtenerCategorias();
  }, [isLogged]);

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const data: defaultApiResponse = await categoriasService.obtenerCategorias();
      setResponse(data);
      if (data.Response?.data && Array.isArray(data.Response.data)) {
        setCategorias(data.Response.data);
      }
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

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-10">
                <input className="form-control" placeholder="Nombre" value={form.Nombre} onChange={(e) => setForm({ ...form, Nombre: e.target.value })} />
              </div>
              <div className="col-md-2 d-flex gap-2">
                {editingId ? (
                  <>
                    <button className="btn btn-warning" onClick={() => actualizarCategoria(editingId)} disabled={loading}>Actualizar</button>
                    <button className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ Nombre: "" }); }} disabled={loading}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-success" onClick={crearCategoria} disabled={loading}>Crear</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading && <div className="alert alert-info">Cargando...</div>}

        <DataTable
          data={categorias}
          columns={categoriasColumns}
          itemsPerPage={10}
          loading={loading}
          onEdit={editarCategoria}
          onDelete={eliminarCategoria}
          showActions={true}
          emptyMessage="No hay categorías"
        />
        </div>
      </div>
    </>
  );
}

export default CategoriasView;
