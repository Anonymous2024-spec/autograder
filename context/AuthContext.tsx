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

    const url = `${API_BASE_URL}/auth/login`;
    console.log("[AUTH] Login attempt");
    console.log("[AUTH] URL:", url);
    console.log("[AUTH] Email:", email);

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("[AUTH] Response received in", Date.now() - startTime, "ms");
      console.log("[AUTH] Status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.warn("[AUTH] Login error response:", errorData);
        throw new Error(errorData.detail || "Invalid email or password");
      }

      const data = await response.json();
      console.log("[AUTH] Login success, user role:", data.user?.role);

      setToken(data.access_token);
      setUser(data.user);

      try {
        await SecureStore.setItemAsync("token", data.access_token);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      } catch (storeErr) {
        console.warn("SecureStore unavailable:", storeErr);
      }
    } catch (err: any) {
      console.error("[AUTH] Login FAILED");
      console.error("[AUTH] Error name:", err?.name);
      console.error("[AUTH] Error message:", err?.message);
      console.error("[AUTH] Error stack:", err?.stack);
      // Provide a more actionable message for network failures
      const isNetworkError =
        err?.message === "Network request failed" ||
        err?.name === "TypeError";
      const errorMessage = isNetworkError
        ? `Network request failed — cannot reach ${API_BASE_URL}. Check that the server is running and accessible from this device.`
        : err.message || "Login failed. Please try again.";
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

