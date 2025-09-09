import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLogin from '@/pages/AdminLogin';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

export default AdminRoute;

