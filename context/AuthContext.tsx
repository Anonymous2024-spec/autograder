import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../config";

// Shape of the logged-in user
interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "lecturer" | "student";
  is_active: boolean;
  created_at: string;
  photo?: string | null;
}

// Everything the context exposes
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePhoto: (uri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync("token");
      const savedUser = await SecureStore.getItemAsync("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid email or password");
      }

      const data = await response.json();

      setToken(data.access_token);
      setUser(data.user);

      try {
        await SecureStore.setItemAsync("token", data.access_token);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      } catch (storeErr) {
        console.warn("SecureStore unavailable:", storeErr);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update profile photo — persists across app restarts
  const updatePhoto = async (uri: string) => {
    if (!user || !token) return;
    
    try {
      const updated: User = { ...user, photo: uri || null };
      setUser(updated);
      await SecureStore.setItemAsync("user", JSON.stringify(updated));
      // TODO: Upload to API when endpoint is ready
    } catch (err) {
      console.error("Failed to update photo:", err);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setToken(null);
      setUser(null);
      setError(null);
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, logout, updatePhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

