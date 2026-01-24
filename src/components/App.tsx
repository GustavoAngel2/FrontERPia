import RootLayout from '../routeLayout'
import Dashboard from './pages/dashboard'
import Login from './pages/login/login'
import ArticulosView from './pages/articulos/articulos'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { RequireAuth, DisabledUponLogin } from '../utils/auth'

import RecetasView from './pages/recetas/recetas'

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
          path="articulos"
          element={
            <RequireAuth>
              <ArticulosView />
            </RequireAuth>
          }
        />

        <Route
          path="recetas"
          element={
              <RecetasView />
          }
        />

      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App;
