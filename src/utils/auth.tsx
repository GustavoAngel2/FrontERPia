import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { LoginResponse, UserInfo } from "../data/models/auth.model";
import type { JSX } from "react";

export interface Credentials {
  username: string;
  userpassword: string;
  idUsername: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isLogged: boolean;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = "http://localhost:5020";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  async function login(credentials: Credentials): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/SignIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await res.json();

      if (!data.Error) {
        setUser(data.Response.data.Usuario);
        setIsLogged(true);
        toast.info(`Bienvenido ${credentials.username}!`);
        return true;
      }

      toast.error("Credenciales incorrectas");
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error al conectar con el servidor");
      return false;
    }
  }

  function logout() {
    setUser(null);
    setIsLogged(false);
  }

  return (
    <AuthContext.Provider value={{ user, isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isLogged } = useAuth();

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function DisabledUponLogin({ children }: { children: JSX.Element }) {
  const { isLogged } = useAuth();

  if (isLogged) {
    return <Navigate to="/" replace />;
  }

  return children;
}
