import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Shape of the logged-in user
interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "lecturer";
  photo?: string | null;
}

// Everything the context exposes
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePhoto: (uri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    // ── STATIC LOGIN FOR TESTING ──────────────────────────
    // TODO: Remove this block once the real backend is ready
    if (email === "admin@gulu.ac.ug" && password === "admin123") {
      const mockUser: User = {
        id: 1,
        username: "Admin User",
        email,
        role: "admin",
        photo: null,
      };
      const mockToken = "static-admin-token";
      setUser(mockUser);
      setToken(mockToken);
      await SecureStore.setItemAsync("token", mockToken);
      await SecureStore.setItemAsync("user", JSON.stringify(mockUser));
      return;
    }

    if (email === "lecturer@gulu.ac.ug" && password === "lecturer123") {
      const mockUser: User = {
        id: 2,
        username: "Dr. Okello",
        email,
        role: "lecturer",
        photo: null,
      };
      const mockToken = "static-lecturer-token";
      setUser(mockUser);
      setToken(mockToken);
      await SecureStore.setItemAsync("token", mockToken);
      await SecureStore.setItemAsync("user", JSON.stringify(mockUser));
      return;
    }
    // ─────────────────────────────────────────────────────

    // Wrong credentials
    // TODO: Replace with real fetch once backend is ready
    throw new Error("Invalid email or password");

    // ── Real API call — uncomment when backend is ready ──
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) {
    //   const body = await response.json();
    //   throw new Error(body.message || "Invalid email or password");
    // }
    // const data = await response.json();
    // setToken(data.token);
    // setUser(data.user);
    // await SecureStore.setItemAsync("token", data.token);
    // await SecureStore.setItemAsync("user", JSON.stringify(data.user));
  };

  // Update profile photo — persists across app restarts
  // TODO: Also upload to API when backend is ready
  const updatePhoto = async (uri: string) => {
    if (!user) return;
    const updated: User = { ...user, photo: uri || null };
    setUser(updated);
    await SecureStore.setItemAsync("user", JSON.stringify(updated));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updatePhoto }}
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
