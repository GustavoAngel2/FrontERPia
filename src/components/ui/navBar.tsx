// Adjust the path as necessary
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";

const NavBar = () => {
  const { isLogged, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MiTienda Gestor Pro</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>

          {/* LADO DERECHO */}
          <ul className="navbar-nav ms-auto">
            {!isLogged && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Usuario
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="login" className="dropdown-item">Iniciar sesion</Link>
                  </li>
                </ul>
              </li>
            )}

            {isLogged && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {user?.NombrePersona}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
