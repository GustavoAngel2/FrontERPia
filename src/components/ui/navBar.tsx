// Adjust the path as necessary
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { useTheme } from "../../context/ThemeContext";
import "./navBar.css";

const NavBar = () => {
  const { isLogged, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          {/* Left side - Hamburger + Brand */}
          <div className="navbar-left">
            <button
              className="navbar-hamburger"
              onClick={toggleSidebar}
              title="Alternar menú"
            >
              <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
            <Link className="navbar-brand" to="/">
              <i className="bi bi-app"></i>
              <span>Admin Panel</span>
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
                  <span>Iniciar sesión</span>
                </Link>
              ) : (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">{user?.NombrePersona}</span>
                    <span className="user-status">Conectado</span>
                  </div>
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

        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={closeSidebar}>
            <i className="bi bi-house-fill"></i>
            <span>Inicio</span>
          </Link>

          {isLogged && (
            <>
              <Link to="/productos" className="sidebar-link" onClick={closeSidebar}>
                <i className="bi bi-box-seam"></i>
                <span>Productos</span>
              </Link>

              <Link to="/recetas" className="sidebar-link" onClick={closeSidebar}>
                <i className="bi bi-book-half"></i>
                <span>Recetas</span>
              </Link>

              <Link to="/categorias" className="sidebar-link" onClick={closeSidebar}>
                <i className="bi bi-tags-fill"></i>
                <span>Categorías</span>
              </Link>

              <Link to="/proveedores" className="sidebar-link" onClick={closeSidebar}>
                <i className="bi bi-building"></i>
                <span>Proveedores</span>
              </Link>

              <Link to="/bancos" className="sidebar-link" onClick={closeSidebar}>
                <i className="bi bi-bank"></i>
                <span>Bancos</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default NavBar;
