import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
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
const STORAGE_KEY = "auth_user";
const LOGIN_KEY = "auth_isLogged";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const storedIsLogged = localStorage.getItem(LOGIN_KEY);

    if (storedUser && storedIsLogged === "true") {
      try {
        setUser(JSON.parse(storedUser));
        setIsLogged(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOGIN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: Credentials): Promise<boolean> => {
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
        const userData = data.Response.data.Usuario;
        setUser(userData);
        setIsLogged(true);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(LOGIN_KEY, "true");
        
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
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLogged(false);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOGIN_KEY);
  }, []);

  const value = useMemo(() => ({
    user,
    isLogged,
    login,
    logout,
  }), [user, isLogged, login, logout]);

  // Don't render until we've checked localStorage
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
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
