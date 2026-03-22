import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../constants";

// Shape of the logged-in user
interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "lecturer";
}

// Everything the context exposes
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // True while we are reading SecureStore on first launch
  const [loading, setLoading] = useState(true);

  // On app launch, restore any saved session
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
      // Loading done whether we found a session or not
      setLoading(false);
    }
  };

  // Call the login endpoint, save token + user to state and SecureStore
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Throw so the login screen can catch and show the error
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message || "Invalid email or password");
    }

    const data = await response.json();
    // API must return { token, user: { id, username, email, role } }

    setToken(data.token);
    setUser(data.user);

    await SecureStore.setItemAsync("token", data.token);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
  };

  // Clear everything on logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook — use this in every screen instead of useContext directly
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
