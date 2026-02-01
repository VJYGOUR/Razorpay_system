import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../axios/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  plan?: string;
  businessName?: string;
  profileImage?: string | null;
  subscriptionId?: string;
  subscriptionStatus?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginOpen: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginOpen: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser ,openLoginModal: () => setLoginOpen(true),
        closeLoginModal: () => setLoginOpen(false),
        loginOpen,}}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
