import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../utils/auth";
import ChatBot from "../ui/ChatBot";

function Dashboard() {
  const { isLogged } = useAuth();

  const modules = useMemo(() => [
    {
      key: "recetas",
      title: "Recetas",
      description: "Crea, organiza y consulta todas tus recetas.",
      icon: "bi-journal-text",
      to: "/recetas",
      colorClass: "dashboard-card-recetas",
    },
    {
      key: "productos",
      title: "Productos",
      description: "Administra tu catálogo de productos fácilmente.",
      icon: "bi-basket3",
      to: "/productos",
      colorClass: "dashboard-card-productos",
    },
    {
      key: "bancos",
      title: "Bancos",
      description: "Controla las cuentas y movimientos bancarios.",
      icon: "bi-bank",
      to: "/bancos",
      colorClass: "dashboard-card-bancos",
    },
    {
      key: "proveedores",
      title: "Proveedores",
      description: "Gestiona tus proveedores y sus contactos.",
      icon: "bi-building",
      to: "/proveedores",
      colorClass: "dashboard-card-proveedores",
    },
    {
      key: "categorias",
      title: "Categorías",
      description: "Organiza tus productos por categorías.",
      icon: "bi-tags",
      to: "/categorias",
      colorClass: "dashboard-card-categorias",
    },
    {
      key: "movimientos",
      title: "Movimientos",
      description: "Registra y consulta los movimientos del sistema.",
      icon: "bi-arrow-left-right",
      to: "/movimientos",
      colorClass: "dashboard-card-productos",
    },
    {
      key: "sucursales",
      title: "Sucursales",
      description: "Gestiona sucursales y su dirección.",
      icon: "bi-shop",
      to: "/sucursales",
      colorClass: "dashboard-card-categorias",
    },
    {
      key: "traspasos",
      title: "Traspasos",
      description: "Gestiona traspasos entre almacenes.",
      icon: "bi-arrow-left-right",
      to: "/traspasos",
      colorClass: "dashboard-card-bancos",
    },
  ], []);

  return (
    <div className="page-content dashboard-page">
      <div className="container py-4">
        {isLogged ? (
          <>
            <section className="dashboard-hero mb-4">
              <div className="row align-items-center">
                <div className="col-12 col-lg-7">
                  <h1 className="dashboard-title mb-2">
                    Panel principal
                  </h1>
                  <p className="dashboard-subtitle mb-3">
                    Accede rápidamente a los módulos del sistema para gestionar
                    recetas, productos, bancos, proveedores y categorías desde un
                    solo lugar.
                  </p>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge rounded-pill text-bg-primary">
                      <i className="bi bi-lightning-charge me-1" />
                      Acceso rápido
                    </span>
                    <span className="badge rounded-pill text-bg-success">
                      <i className="bi bi-shield-check me-1" />
                      Sesión activa
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section
              id="asistente-virtual"
              className="dashboard-chat-section mt-4"
            >
              <div className="row g-3 g-md-4">
                <div className="col-12 col-lg-6">
                  <div className="dashboard-chat-card p-3 p-md-4 h-100">
                    <h2 className="dashboard-section-title mb-2">
                      Asistente virtual
                    </h2>
                    <p className="dashboard-subtitle mb-3">
                      Chatea con el asistente para resolver dudas rápidas sobre
                      el uso del sistema sin salir del panel.
                    </p>
                    <ul className="dashboard-list mb-0">
                      <li>Pregúntale dónde encontrar funciones específicas.</li>
                      <li>Obtén explicaciones rápidas de cada módulo.</li>
                      <li>Recibe soporte básico mientras trabajas.</li>
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <ChatBot variant="inline" />
                </div>
              </div>
            </section>

            <section className="mt-4">
              <h2 className="dashboard-section-title mb-3">
                Módulos del sistema
              </h2>
              <div className="row g-3 g-md-4">
                {modules.map((module) => (
                  <div
                    key={module.key}
                    className="col-12 col-sm-6 col-lg-4 d-flex"
                  >
                    <div className={`card dashboard-card ${module.colorClass} flex-fill`}>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-center mb-3">
                          <div className="dashboard-icon me-3">
                            <i className={`bi ${module.icon}`} />
                          </div>
                          <div>
                            <h5 className="card-title mb-1">{module.title}</h5>
                            <p className="card-subtitle text-muted small mb-0">
                              Módulo principal
                            </p>
                          </div>
                        </div>
                        <p className="card-text flex-grow-1 mb-3">
                          {module.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="text-muted small">
                            <i className="bi bi-arrow-right-circle me-1" />
                            Ir al módulo
                          </span>
                          <Link
                            className="btn btn-sm btn-outline-secondary"
                            to={module.to}
                          >
                            Abrir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="dashboard-hero dashboard-hero-logged-out">
            <div className="row align-items-center">
              <div className="col-12 col-lg-7">
                <h1 className="dashboard-title mb-2">Bienvenido</h1>
                <p className="dashboard-subtitle mb-3">
                  Para acceder al panel y comenzar a utilizar todas las
                  funcionalidades del sistema, inicia sesión con tu cuenta.
                </p>
                <ul className="dashboard-list mb-3">
                  <li>Gestión centralizada de recetas y productos.</li>
                  <li>Administración de bancos y proveedores.</li>
                  <li>Organización por categorías para un mejor control.</li>
                </ul>
                <Link className="btn btn-lg btn-success px-4" to="/login">
                  Iniciar sesión
                </Link>
              </div>
              <div className="col-12 col-lg-5 mt-4 mt-lg-0 text-center">
                <div className="dashboard-placeholder-card mx-auto">
                  <i className="bi bi-box-arrow-in-right dashboard-placeholder-icon" />
                  <p className="mt-2 mb-0 text-muted small">
                    Inicia sesión para desbloquear el panel completo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;