import { lazy, Suspense, useMemo } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from '../routeLayout'
import { RequireAuth, DisabledUponLogin } from '../utils/auth'
import { ThemeProvider } from '../context/ThemeContext'
import Login from './pages/login/login'

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('./pages/dashboard'))
const RecetasView = lazy(() => import('./pages/recetas/recetas'))
const ProductosView = lazy(() => import('./pages/productos/productos'))
const BancosView = lazy(() => import('./pages/bancos/bancos'))
const ProveedoresView = lazy(() => import('./pages/proveedores/proveedores'))
const CategoriasView = lazy(() => import('./pages/categorias/categorias'))

// Loading placeholder component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
)

function App() {
  const router = useMemo(() => createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        } />

        <Route 
          path='login' 
          element={
            <DisabledUponLogin>
              <Login />
            </DisabledUponLogin>
          } 
        />

        <Route path="recetas" element={
          <Suspense fallback={<LoadingFallback />}>
            <RequireAuth>
              <RecetasView />
            </RequireAuth>
          </Suspense>
        } />

        <Route path="productos" element={
          <Suspense fallback={<LoadingFallback />}>
            <RequireAuth>
              <ProductosView />
            </RequireAuth>
          </Suspense>
        } />

        <Route path="bancos" element={
          <Suspense fallback={<LoadingFallback />}>
            <RequireAuth>
              <BancosView />
            </RequireAuth>
          </Suspense>
        } />

        <Route path="proveedores" element={
          <Suspense fallback={<LoadingFallback />}>
            <RequireAuth>
              <ProveedoresView />
            </RequireAuth>
          </Suspense>
        } />

        <Route path="categorias" element={
          <Suspense fallback={<LoadingFallback />}>
            <RequireAuth>
              <CategoriasView />
            </RequireAuth>
          </Suspense>
        } />

      </Route>
    )
  ), [])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App