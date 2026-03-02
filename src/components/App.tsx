import RootLayout from '../routeLayout'
import Dashboard from './pages/dashboard'
import Login from './pages/login/login'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { RequireAuth, DisabledUponLogin } from '../utils/auth'

import RecetasView from './pages/recetas/recetas'
import { ThemeProvider } from '../context/ThemeContext'
import ProductosView from './pages/productos/productos'
import BancosView from './pages/bancos/bancos'
import ProveedoresView from './pages/proveedores/proveedores'
import CategoriasView from './pages/categorias/categorias'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Dashboard />} />


        <Route 
          path='login' 
          element={
            <DisabledUponLogin>
              <Login />
            </DisabledUponLogin>
          } 
        />

        <Route
          path="recetas"
          element={
              <RecetasView />
          }
        />

        <Route
          path="productos"
          element={
              <ProductosView />
          }
        />

                <Route
          path="bancos"
          element={
              <BancosView />
          }
        />

        <Route
          path="proveedores"
          element={
              <ProveedoresView />
          }
        />

        <Route
          path="categorias"
          element={
              <CategoriasView />
          }
        />

      </Route>
    )
  )

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
export default App