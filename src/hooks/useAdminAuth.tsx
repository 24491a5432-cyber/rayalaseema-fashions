import { createContext, useContext, useEffect, useState } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminId: string | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('admin_authenticated');
    const adminId = localStorage.getItem('admin_id');
    
    if (adminAuth === 'true' && adminId) {
      setIsAuthenticated(true);
      setAdminId(adminId);
    }
  }, []);

  const login = (id: string, password: string): boolean => {
    // Check admin credentials
    if (id === 'rfmask' && password === 'rfmask') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_id', id);
      setIsAuthenticated(true);
      setAdminId(id);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_id');
    setIsAuthenticated(false);
    setAdminId(null);
  };

  const value = {
    isAuthenticated,
    adminId,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

