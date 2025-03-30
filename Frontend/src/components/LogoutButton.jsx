import { logout } from '../utils/auth';

export default function LogoutButton({ className = '' }) {
  const handleLogout = () => {
    logout();
    // Force a page reload after logout to ensure clean state
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-sm font-medium text-red-600 hover:text-red-800 ${className}`}
    >
      Sign out
    </button>
  );
} 