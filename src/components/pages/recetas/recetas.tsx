import { useState, useEffect } from "react";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Receta, InsertReceta, UpdateReceta } from "../../../data/models/receta.model";
import { useAuth } from "../../../utils/auth";
import { recetasService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";

function RecetasView() {
    const { user, isLogged } = useAuth();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<defaultApiResponse | null>(null);
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nombre: ""
    });

    const recetasColumns: Column<Receta>[] = [
        { key: "Id", label: "ID", width: "60px" },
        { key: "Nombre", label: "Nombre" },
        {
            key: "FechaCreacion",
            label: "Fecha Creación",
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: "FechaActualiza",
            label: "Fecha Actualización",
            render: (value) => new Date(value).toLocaleDateString(),
        },
        { key: "UsuarioRegistra", label: "Usuario Registra", width: "120px" },
        { key: "UsuarioActualiza", label: "Usuario Actualiza", width: "120px" },
    ];

    const usuarioId = user?.Id; // Get from auth context
    useEffect(() => {
        obtenerRecetas();
    }, []);

    const obtenerRecetas = async () => {
        try {
            setLoading(true);
            const data: defaultApiResponse = await recetasService.obtenerRecetas();
            console.log("respuesta:", data);
            if (data.Response?.data && Array.isArray(data.Response.data)) {
                setRecetas(data.Response.data as Receta[]);
            }
            setResponse(data);
        } catch (error) {
            console.error("Error al obtener recetas:", error);
        } finally {
            setLoading(false);
        }
    };

    const crearReceta = async () => {
        if (!formData.nombre.trim()) {
            alert("Ingresa el nombre de la receta");
            return;
        }
        try {
            setLoading(true);
            const payload: InsertReceta = {
                nombre: formData.nombre,
                usuarioRegistra: usuarioId || 0,
                usuarioActualiza: usuarioId || 0
            };
            await recetasService.crearReceta(payload);
            setFormData({ nombre: "" });
            await obtenerRecetas();
        } catch (error) {
            console.error("Error al crear receta:", error);
            alert("Error al crear la receta");
        } finally {
            setLoading(false);
        }
    };

    const actualizarReceta = async (id: number) => {
        if (!formData.nombre.trim()) {
            alert("Ingresa el nombre de la receta");
            return;
        }
        try {
            setLoading(true);
            const payload: UpdateReceta = {
                id: id,
                nombre: formData.nombre,
                usuarioActualiza: String(usuarioId || 0)
            };
            await recetasService.actualizarReceta(id, payload);
            setFormData({ nombre: "" });
            setEditingId(null);
            await obtenerRecetas();
        } catch (error) {
            console.error("Error al actualizar receta:", error);
            alert("Error al actualizar la receta");
        } finally {
            setLoading(false);
        }
    };

    const editarReceta = (receta: Receta) => {
        setEditingId(receta.Id);
        setFormData({
            nombre: receta.Nombre
        });
    };

    const eliminarReceta = async (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar esta receta?")) return;
        try {
            setLoading(true);
            await recetasService.eliminarReceta(id);
            await obtenerRecetas();
        } catch (error) {
            console.error("Error al eliminar receta:", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        setFormData({ nombre: "" });
    };


    return (
        <>
            <div className="page-content">
                {!isLogged && (
                    <div className="container mt-4">
                        <div className="alert alert-warning" role="alert">
                            <h4 className="alert-heading">No autenticado</h4>
                            <p>Debes iniciar sesión para acceder a esta página.</p>
                        </div>
                    </div>
                )}
                {isLogged && (
                    <div className="container mt-4">
                        <h2 className="mb-4">Gestión de Recetas</h2>

                        {/* Formulario Create/Update */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">{editingId ? "Editar Receta" : "Crear Nueva Receta"}</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label">Nombre de la Receta</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            placeholder="Ingrese el nombre de la receta"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    {editingId ? (
                                        <>
                                            <button 
                                                className="btn btn-warning"
                                                onClick={() => actualizarReceta(editingId)}
                                                disabled={loading}
                                            >
                                                Actualizar
                                            </button>
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={cancelarEdicion}
                                                disabled={loading}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            className="btn btn-success"
                                            onClick={crearReceta}
                                            disabled={loading}
                                        >
                                            Crear Receta
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="alert alert-info">
                                <div className="spinner-border text-primary me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <span>Cargando datos...</span>
                            </div>
                        )}

                        {/* Tabla de Recetas */}
                        <DataTable
                            data={recetas}
                            columns={recetasColumns}
                            itemsPerPage={10}
                            loading={loading}
                            onEdit={editarReceta}
                            onDelete={eliminarReceta}
                            showActions={true}
                            emptyMessage="No hay recetas disponibles. Crea una nueva receta para comenzar."
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default RecetasView;