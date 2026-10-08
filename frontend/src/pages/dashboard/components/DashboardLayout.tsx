import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, type DashboardUser } from '../api';
import { cmsResourceOptions } from '../cms-api';

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: 'ri-dashboard-line', end: true },
  { label: 'Leads', to: '/dashboard/leads', icon: 'ri-inbox-line' },
  { label: 'Smart Assistant', to: '/dashboard/assistant', icon: 'ri-sparkling-2-line' },
  { label: 'Maintenance', to: '/dashboard/site-access', icon: 'ri-lock-password-line' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((payload) => {
        if (active) setUser(payload.user);
      })
      .catch(() => navigate('/dashboard/login', { replace: true }))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    navigate('/dashboard/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-100 text-sm text-foreground-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-100 text-foreground-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-background-300 bg-background-50 px-5 py-6 shadow-md transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <img src="/brand/college-of-marketing-mark.png" alt="College of Marketing" className="h-11 w-11 object-contain" />
            <span>
              <span className="block text-sm font-semibold leading-tight text-foreground-950">Dashboard</span>
              <span className="block text-xs text-foreground-500">College of Marketing</span>
            </span>
          </NavLink>
          <button type="button" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close dashboard navigation">
            <i className="ri-close-line text-2xl" />
          </button>
        </div>

        <nav className="mt-8 max-h-[calc(100vh-13rem)] space-y-1 overflow-y-auto pr-1" aria-label="Dashboard">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-800 text-background-50' : 'text-foreground-700 hover:bg-background-100 hover:text-foreground-950'
                }`
              }
            >
              <i className={`${item.icon} text-lg`} />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-5">
            <div className="space-y-1">
              {cmsResourceOptions.map((item) => (
                <NavLink
                  key={item.id}
                  to={`/dashboard/content/${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-800 text-background-50' : 'text-foreground-700 hover:bg-background-100 hover:text-foreground-950'
                    }`
                  }
                >
                  <i className={`${item.icon} text-lg`} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-md border border-background-300 bg-background-100 p-4">
          <p className="text-sm font-semibold text-foreground-900">{user?.name}</p>
          <p className="mt-1 break-all text-xs text-foreground-500">{user?.email}</p>
          <button type="button" onClick={handleLogout} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 hover:text-primary-900">
            <i className="ri-logout-box-line" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-background-300 bg-background-50/90 backdrop-blur-md shadow-sm">
          <div className="flex h-16 items-center justify-between px-5 md:px-8">
            <button type="button" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open dashboard navigation">
              <i className="ri-menu-line text-2xl" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">Staff area</p>
              <p className="text-sm text-foreground-500">Manage enquiries and site operations</p>
            </div>
            <NavLink to="/" className="hidden text-sm font-semibold text-primary-800 hover:text-primary-900 sm:inline-flex">
              View site
            </NavLink>
          </div>
        </header>

        <main className="px-5 py-8 md:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



