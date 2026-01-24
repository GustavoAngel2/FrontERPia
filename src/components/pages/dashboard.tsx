import NavBar from "../ui/navBar";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";

function Dashboard() {
  const { isLogged, user } = useAuth();
  return (
    <>
      <NavBar />
      <div className="container mt-3 p-3">
        {
          isLogged && (
            <div className="row mt-3 row-cols-1 row-cols-md-3 mb-3 text-center">
              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-basket2-fill"></i> Articulos</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Ver, editar o borrar articulos que tenga registrados en el sistema
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/articulos'>Ir</Link>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-header py-3">
                    <h4 className="my-0 fw-normal"><i className="bi bi-fullscreen"></i> Modulo</h4>
                  </div>
                  <div className="card-body">
                    <p className="list-unstyled mt-2 mb-4">
                      Descripcion
                    </p>
                    <Link className="w-100 btn btn-lg btn-outline-primary" to='/'>Ir</Link>
                  </div>
                </div>
              </div>
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
    </>
  );
}

export default Dashboard;