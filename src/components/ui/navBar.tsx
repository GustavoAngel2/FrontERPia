// Adjust the path as necessary
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { useTheme } from "../../context/ThemeContext";
import "./navBar.css";

const NavBar = () => {
  const { isLogged, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          {/* Brand (Left side) */}
          <div className="navbar-left">
            <Link className="navbar-brand" to="/">
              <i className="bi bi-app"></i>
              <span>App</span>
            </Link>
          </div>

          {/* Right Side - Theme Toggle and User Menu */}
          <div className="navbar-actions">
            <button
              className="navbar-theme-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>

            <div className="navbar-user">
              {!isLogged ? (
                <Link to="login" className="navbar-link">
                  <i className="bi bi-person-fill"></i>
                  <span>Iniciar sesion</span>
                </Link>
              ) : (
                <div className="user-menu">
                  <span className="user-name">{user?.NombrePersona}</span>
                  <button className="logout-btn" onClick={logout} title="Cerrar sesión">
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button
            className="sidebar-toggle-close"
            onClick={() => setSidebarOpen(false)}
            title="Cerrar sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">
            <i className="bi bi-house-fill"></i>
            <span>Home</span>
          </Link>

          {isLogged && (
            <>
              <Link to="/productos" className="sidebar-link">
                <i className="bi bi-box-seam"></i>
                <span>Productos</span>
              </Link>

              <Link to="/recetas" className="sidebar-link">
                <i className="bi bi-book-half"></i>
                <span>Recetas</span>
              </Link>

              <Link to="/categorias" className="sidebar-link">
                <i className="bi bi-tags-fill"></i>
                <span>Categorias</span>
              </Link>

              <Link to="/proveedores" className="sidebar-link">
                <i className="bi bi-building"></i>
                <span>Proveedores</span>
              </Link>

              <Link to="/bancos" className="sidebar-link">
                <i className="bi bi-bank"></i>
                <span>Bancos</span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Sidebar Toggle Button */}
      {!sidebarOpen && (
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          title="Abrir sidebar"
        >
          <i className="bi bi-list"></i>
        </button>
      )}
    </>
  );
};

export default NavBar;
