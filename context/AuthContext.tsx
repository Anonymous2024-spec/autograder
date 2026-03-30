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

  // ── STATIC LOGIN FOR TESTING ──────────────────────────
  // TODO: Remove this block once the real backend is ready
  if (email === 'admin@gulu.ac.ug' && password === 'admin123') {
    const mockUser = { id: 1, username: 'Admin User', email, role: 'admin' as const };
    const mockToken = 'static-admin-token';
    setUser(mockUser);
    setToken(mockToken);
    await SecureStore.setItemAsync('token', mockToken);
    await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
    return;
  }

  if (email === 'lecturer@gulu.ac.ug' && password === 'lecturer123') {
    const mockUser = { id: 2, username: 'Dr. Okello', email, role: 'lecturer' as const };
    const mockToken = 'static-lecturer-token';
    setUser(mockUser);
    setToken(mockToken);
    await SecureStore.setItemAsync('token', mockToken);
    await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
    return;
  }
  // ─────────────────────────────────────────────────────

  // Wrong credentials — show error on login screen
  // TODO: Replace this with the real fetch call once backend is ready
  throw new Error('Invalid email or password');

  // ── Real API call — uncomment when backend is ready ──
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // if (!response.ok) {
  //   const body = await response.json();
  //   throw new Error(body.message || 'Invalid email or password');
  // }
  // const data = await response.json();
  // setToken(data.token);
  // setUser(data.user);
  // await SecureStore.setItemAsync('token', data.token);
  // await SecureStore.setItemAsync('user', JSON.stringify(data.user));
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
