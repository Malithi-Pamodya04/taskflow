import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
    isActive
      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
      : 'text-gray-400 hover:bg-surface-2 hover:text-white'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="bg-surface/80 backdrop-blur sticky top-0 z-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xl font-extrabold bg-linear-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
          <nav className="flex gap-2">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/tasks" className={linkClass}>Tasks</NavLink>
            {user?.role === 'admin' && <NavLink to="/users" className={linkClass}>Users</NavLink>}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 hidden sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-surface-2 border border-line text-gray-200 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-red-600 hover:border-red-600 hover:text-white active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 animate-page">
        <Outlet />
      </main>
    </div>
  );
}