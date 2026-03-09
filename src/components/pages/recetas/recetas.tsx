import { useState, useEffect } from "react";
import type { defaultApiResponse } from "../../../data/models/response.model";
import type { Receta, InsertReceta, UpdateReceta } from "../../../data/models/receta.model";
import type { GetDetalleReceta, InsertDetalleReceta, UpdateDetalleReceta } from "../../../data/models/detalleReceta.model";
import { useAuth } from "../../../utils/auth";
import { recetasService, detalleRecetaService } from "../../../utils/dataService";
import DataTable, { type Column } from "../../ui/DataTable";
interface DetalleReceta {
    Id: number;
    IdReceta: number;
    Insumo: string;
    Cantidad: number;
    UsuarioRegistra: number;
    UsuarioActualiza: number;
}


function RecetasView() {
    const { user, isLogged } = useAuth();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<defaultApiResponse | null>(null);
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nombre: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [modalView, setModalView] = useState<"receta" | "detalle">("receta");
    const [currentRecetaId, setCurrentRecetaId] = useState<number | null>(null);
    const [detalles, setDetalles] = useState<DetalleReceta[]>([]);
    const [detalleFormData, setDetalleFormData] = useState({
        insumo: "",
        cantidad: 0
    });
    const [editingDetalleId, setEditingDetalleId] = useState<number | null>(null);

    const recetasColumns: Column<Receta>[] = [
        { key: "Id", label: "ID", width: "60px" },
        { key: "Nombre", label: "Nombre" },
        {
            key: "FechaCreacion",
            label: "Fecha Creación",
            render: (value) => {
                if (!value) return "-";
                const date = typeof value === 'string' ? new Date(value.split('T')[0]) : new Date(value);
                return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
            },
        },
        {
            key: "FechaActualiza",
            label: "Fecha Actualización",
            render: (value) => {
                if (!value) return "-";
                const date = typeof value === 'string' ? new Date(value.split('T')[0]) : new Date(value);
                return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
            },
        },
        { key: "UsuarioRegistra", label: "Usuario Registra", width: "120px" },
        { key: "UsuarioActualiza", label: "Usuario Actualiza", width: "120px" },
    ];

    const usuarioId = user?.Id; // Get from auth context
    useEffect(() => {
        obtenerRecetas();
    }, []);

    const obtenerRecetas = async (): Promise<Receta[] | null> => {
        try {
            setLoading(true);
            const data: defaultApiResponse = await recetasService.obtenerRecetas();
            console.log("respuesta:", data);
            if (data.Response?.data && Array.isArray(data.Response.data)) {
                const list = data.Response.data as Receta[];
                setRecetas(list);
                setResponse(data);
                return list;
            }
            setRecetas([]);
            setResponse(data);
            return [];
        } catch (error) {
            console.error("Error al obtener recetas:", error);
            return null;
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
            // Fetch fresh list and pick the latest created receta
            const lista = await obtenerRecetas();
            const latestReceta = lista && lista.length > 0 ? lista[lista.length - 1] : (recetas[recetas.length - 1] || { Id: 0 });
            if (latestReceta && latestReceta.Id) {
                setCurrentRecetaId(latestReceta.Id);
                setModalView("detalle");
                await obtenerDetalles(latestReceta.Id);
            }
            setFormData({ nombre: "" });
        } catch (error) {
            console.error("Error al crear receta:", error);
            alert("Error al crear la receta");
        } finally {
            setLoading(false);
        }
    };

    // Removed auto-selection effect to avoid unexpected recipe selection

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
            setShowModal(false);
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
        setShowModal(true);
    };

    const abrirModalCrear = () => {
        setEditingId(null);
        setFormData({ nombre: "" });
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ nombre: "" });
        setModalView("receta");
        setCurrentRecetaId(null);
        setDetalles([]);
        setDetalleFormData({ insumo: "", cantidad: 0 });
        setEditingDetalleId(null);
    };

    const volverARecetas = () => {
        setModalView("receta");
        setCurrentRecetaId(null);
        setDetalles([]);
        setDetalleFormData({ insumo: "", cantidad: 0 });
        setEditingDetalleId(null);
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

    const obtenerDetalles = async (idReceta: number) => {
        try {
            setLoading(true);
            const payload: GetDetalleReceta = { idReceta };
            const data: defaultApiResponse = await detalleRecetaService.obtenerDetallesReceta(payload);
            if (data.Response?.data && Array.isArray(data.Response.data)) {
                setDetalles(data.Response.data as DetalleReceta[]);
            }
        } catch (error) {
            console.error("Error al obtener detalles:", error);
        } finally {
            setLoading(false);
        }
    };

    const crearDetalle = async () => {
        if (!currentRecetaId) return;
        if (!detalleFormData.insumo.trim() || detalleFormData.cantidad <= 0) {
            alert("Ingresa insumo y cantidad válidos");
            return;
        }
        try {
            setLoading(true);
            const payload: InsertDetalleReceta = {
                idReceta: currentRecetaId,
                insumo: detalleFormData.insumo,
                cantidad: detalleFormData.cantidad,
                usuarioActualiza: usuarioId || 0
            };
            await detalleRecetaService.crearDetalleReceta(payload);
            setDetalleFormData({ insumo: "", cantidad: 0 });
            await obtenerDetalles(currentRecetaId);
        } catch (error) {
            console.error("Error al crear detalle:", error);
            alert("Error al crear el detalle");
        } finally {
            setLoading(false);
        }
    };

    const actualizarDetalle = async (id: number) => {
        if (!detalleFormData.insumo.trim() || detalleFormData.cantidad <= 0) {
            alert("Ingresa insumo y cantidad válidos");
            return;
        }
        try {
            setLoading(true);
            const payload: UpdateDetalleReceta = {
                id,
                insumo: detalleFormData.insumo,
                cantidad: detalleFormData.cantidad,
                usuarioActualiza: usuarioId || 0
            };
            await detalleRecetaService.actualizarDetalleReceta(payload);
            setDetalleFormData({ insumo: "", cantidad: 0 });
            setEditingDetalleId(null);
            if (currentRecetaId) await obtenerDetalles(currentRecetaId);
        } catch (error) {
            console.error("Error al actualizar detalle:", error);
            alert("Error al actualizar el detalle");
        } finally {
            setLoading(false);
        }
    };

    const editarDetalle = (detalle: DetalleReceta) => {
        setEditingDetalleId(detalle.Id);
        setDetalleFormData({
            insumo: detalle.Insumo,
            cantidad: detalle.Cantidad
        });
    };

    const eliminarDetalle = async (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar este detalle?")) return;
        try {
            setLoading(true);
            await detalleRecetaService.eliminarDetalleReceta(id);
            if (currentRecetaId) await obtenerDetalles(currentRecetaId);
        } catch (error) {
            console.error("Error al eliminar detalle:", error);
        } finally {
            setLoading(false);
        }
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

                        <div className="mb-3">
                            <button className="btn btn-primary" onClick={abrirModalCrear}>
                                <i className="fas fa-plus me-2"></i>Agregar Receta
                            </button>
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
                            showActions={true}
                            emptyMessage="No hay recetas disponibles. Crea una nueva receta para comenzar."
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modalView === "receta" 
                                    ? (editingId ? 'Editar Receta' : 'Crear Receta')
                                    : `Detalles - ${recetas.find(r => r.Id === currentRecetaId)?.Nombre}`
                                }
                            </h5>
                            <button type="button" className="btn-close" onClick={cerrarModal}></button>
                        </div>
                        <div className="modal-body">
                            {modalView === "receta" ? (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre de la Receta</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            placeholder="Ingrese el nombre de la receta"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <h6>Agregar Insumo</h6>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            value={detalleFormData.insumo}
                                            onChange={(e) => setDetalleFormData({ ...detalleFormData, insumo: e.target.value })}
                                            placeholder="Nombre del insumo"
                                        />
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            value={detalleFormData.cantidad}
                                            onChange={(e) => setDetalleFormData({ ...detalleFormData, cantidad: parseFloat(e.target.value) })}
                                            placeholder="Cantidad"
                                        />
                                        {editingDetalleId ? (
                                            <button className="btn btn-sm btn-warning" onClick={() => actualizarDetalle(editingDetalleId!)} disabled={loading}>
                                                {loading ? 'Actualizando...' : 'Actualizar Insumo'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-success" onClick={crearDetalle} disabled={loading}>
                                                {loading ? 'Agregando...' : 'Agregar Insumo'}
                                            </button>
                                        )}
                                        {editingDetalleId && (
                                            <button className="btn btn-sm btn-secondary ms-2" onClick={() => {
                                                setEditingDetalleId(null);
                                                setDetalleFormData({ insumo: "", cantidad: 0 });
                                            }} disabled={loading}>
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                    <hr />
                                    <h6>Insumos de la Receta</h6>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {detalles.length === 0 ? (
                                            <p className="text-muted">No hay insumos agregados</p>
                                        ) : (
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Insumo</th>
                                                        <th>Cantidad</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalles.map(detalle => (
                                                        <tr key={detalle.Id}>
                                                            <td>{detalle.Insumo}</td>
                                                            <td>{detalle.Cantidad}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-primary me-1" onClick={() => editarDetalle(detalle)}>
                                                                    ✎
                                                                </button>
                                                                <button className="btn btn-sm btn-danger" onClick={() => eliminarDetalle(detalle.Id)}>
                                                                    🗑️
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            {modalView === "detalle" && (
                                <button type="button" className="btn btn-secondary" onClick={volverARecetas} disabled={loading}>
                                    Volver
                                </button>
                            )}
                            {modalView === "receta" && editingId && (
                                <button type="button" className="btn btn-danger me-auto" onClick={() => eliminarReceta(editingId!)} disabled={loading}>
                                    {loading ? 'Eliminando...' : '🗑️ Eliminar'}
                                </button>
                            )}
                            <button type="button" className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
                                Cancelar
                            </button>
                            {modalView === "receta" ? (
                                editingId ? (
                                    <button type="button" className="btn btn-warning" onClick={() => actualizarReceta(editingId!)} disabled={loading}>
                                        {loading ? 'Actualizando...' : 'Actualizar'}
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-success" onClick={crearReceta} disabled={loading}>
                                        {loading ? 'Creando...' : 'Crear'}
                                    </button>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}

export default RecetasView;