import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import type { DashboardUser } from '../data/api';

export default function AdminOnly() {
  const user = useOutletContext<DashboardUser>();
  return user.role === 'admin' ? <Outlet context={user} /> : <Navigate to="/dashboard" replace />;
}