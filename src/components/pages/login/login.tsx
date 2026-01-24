import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './login.css'
import { useAuth } from "../../../utils/auth";
import { toast } from "react-toastify";

function Login() {
    const { login,user } = useAuth();
    const [username, setUsername] = useState("");
    const [userpassword, setUserpassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function doLogin() {
        if (loading) return; 

        try {
            setLoading(true);

            const ok = await login({
                username,
                userpassword,
                idUsername: "string"
            });

            if (ok) {
                navigate("/");
            }

        } catch (error) {
            toast.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="contenedor">
            <div className="caja mb-3">
                <div className="header">
                    <h1>Login</h1>
                    <i className="bi bi-door-open-fill"></i>
                </div>

                <hr />

                <img src="/DummyPicture.png" alt="Mi imagen" />

                <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuario"
                        disabled={loading}
                    />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-key"></i></span>
                    <input
                        type="password"
                        className="form-control"
                        value={userpassword}
                        onChange={(e) => setUserpassword(e.target.value)}
                        placeholder="Contraseña"
                        disabled={loading}
                    />
                </div>

                <div className="input-group mb-3">
                    <button
                        className="form-control btn btn-outline-success"
                        onClick={doLogin}
                        disabled={loading}
                    >
                        {loading ? "Iniciando..." : "Iniciar sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
