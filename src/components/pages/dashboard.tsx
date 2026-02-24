import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";

function Dashboard() {
  const { isLogged, user } = useAuth();
  return (
    <>
      <div className="page-content">
        <div className="container mt-3 p-3">
        {
          isLogged && (
            <div className="row mt-3 row-cols-1 row-cols-md-3 mb-3 text-center">
              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-book-half"></i> Recetas</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Descripcion de recetas
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/recetas'>Ir</Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-book-half"></i> Productos</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Descripcion de productos
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/productos'>Ir</Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-book-half"></i> Bancos</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Descripcion de bancos
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/bancos'>Ir</Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-building"></i> Proveedores</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Gestión de proveedores
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/proveedores'>Ir</Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-tag"></i> Categorías</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Gestión de categorías
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/categorias'>Ir</Link>
                  </div>
                </div>
              </div>

            </div>
          )
        }

        {
          !isLogged && (
            <>
              <div className="row mt-3 row-cols-1 row-cols-md-3 mb-3 text-center">
                <div className="col">
                  <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                      <h4 className="my-0 fw-normal">Iniciar sesion</h4>
                    </div>
                    <div className="card-body">
                      <p className="list-unstyled mt-2 mb-4">
                        Por favor inicie sesion para continuar y utilisar el sistema
                      </p>
                      <Link className="w-100 btn btn-lg btn-outline-success" to='/login'>Ir</Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }

      </div>
      </div>
    </>
  );
}

export default Dashboard;