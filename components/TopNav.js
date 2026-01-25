'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path) => pathname === path ? 'text-blue-600' : '';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
              News App
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/articles')}`}
              >
                Articles
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.username} ({user.role})
                </span>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`text-sm font-medium ${isActive('/admin')}`}
                  >
                    Admin
                  </Link>
                )}
                {(user.role === 'admin' || user.role === 'editor') && (
                  <Link
                    href="/editor"
                    className={`text-sm font-medium ${isActive('/editor')}`}
                  >
                    Editor
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
