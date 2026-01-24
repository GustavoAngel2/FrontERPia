import { useState } from "react";
import type { aiApiResponse } from "../../../data/models/aiArticles.model";
import NavBar from "../../ui/navBar";
let apiUrl: string = 'http://192.168.54.153:8000'

function ArticulosView() {
    const [loading, setLoading] = useState(false);
    const [pregunta, setPregunta] = useState("");
    const [response, setResponse] = useState<aiApiResponse | null>(null);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPregunta(e.target.value);
    };

    const obtenerUsuarios = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${apiUrl}/ia/consultar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pregunta })
            });

            const data: aiApiResponse = await res.json();
            console.log("respuesta:", data);

            setResponse(data);

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const descargarPDF = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${apiUrl}/ia/pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pregunta })
            });

            if (!res.ok) throw new Error("Error generando PDF");

            // Recibir los bytes como Blob
            const blob = await res.blob();

            // Crear URL temporal
            const url = window.URL.createObjectURL(blob);

            // Crear enlace oculto para descargar
            const a = document.createElement("a");
            a.href = url;
            a.download = "reporte.pdf";

            document.body.appendChild(a);
            a.click();

            // Limpiar
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al descargar PDF:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <NavBar />
            <div className="container">
                <h2>Usuarios</h2>

                {loading && (
                    <>
                        <p>Comunicándose con el servidor...</p>
                        <p>Por favor espere...</p>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <br />
                    </>
                )}

                <button onClick={obtenerUsuarios}>Consultar</button>

                <input
                    type="text"
                    value={pregunta}
                    onChange={manejarCambio}
                />

                <button onClick={descargarPDF}>Sacar pdf</button>

                {response?.resultados?.map((producto) => (
                    <div key={producto.Id} className="card p-3 mt-3">
                        <h5>{producto.Id} - {producto.Descripcion}</h5>
                        <small>${producto.PrecioVenta}</small>
                        <small>Codigo: {producto.Codigo}</small>
                        <small>Registrado en dia: {producto.FechaRegistro}</small>
                        <small>Modificado el dia: {producto.FechaActualiza}</small>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ArticulosView;
