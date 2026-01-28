'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';

export default function TopNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const roleLabels = {
    admin: 'Διαχειριστής',
    editor: 'Συντάκτης',
    moderator: 'Συντονιστής',
    viewer: 'Αναγνώστης'
  };
  const roleLabel = user ? roleLabels[user.role] || user.role : '';

  const isActive = (path) => pathname === path ? 'text-blue-600' : '';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="app-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold text-black">
              Εφαρμογή Ειδήσεων
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-black ${isActive('/')}`}
              >
                Αρχική
              </Link>
              <Link
                href="/articles"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-black ${isActive('/articles')}`}
              >
                Άρθρα
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex flex-wrap items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-black">
                  Καλώς ήρθες, {user.username} ({roleLabel})
                </span>
                <Link
                  href="/profile"
                  className={`text-sm font-medium text-black ${isActive('/profile')}`}
                >
                  Προφίλ
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`text-sm font-medium text-black ${isActive('/admin')}`}
                  >
                    Διαχείριση
                  </Link>
                )}
                {(user.role === 'admin' || user.role === 'editor') && (
                  <Link
                    href="/editor"
                    className={`text-sm font-medium text-black ${isActive('/editor')}`}
                  >
                    Συντάκτης
                  </Link>
                )}
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                  Νέο Άρθρο
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  Έξοδος
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-blue-700"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  Είσοδος
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <UserPlusIcon className="h-4 w-4" aria-hidden="true" />
                  Εγγραφή
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-100 sm:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">Άνοιγμα κύριου μενού</span>
            {isMenuOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          <Link
            href="/"
            className={`block text-base font-medium text-black ${isActive('/')}`}
          >
            Αρχική
          </Link>
          <Link
            href="/articles"
            className={`block text-base font-medium text-black ${isActive('/articles')}`}
          >
            Άρθρα
          </Link>
        </div>
        <div className="border-t border-gray-200 px-4 py-3 space-y-3">
          {user ? (
            <>
              <span className="block text-sm text-black">
                Καλώς ήρθες, {user.username} ({roleLabel})
              </span>
              <Link
                href="/profile"
                className={`block text-base font-medium text-black ${isActive('/profile')}`}
              >
                Προφίλ
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`block text-base font-medium text-black ${isActive('/admin')}`}
                >
                  Διαχείριση
                </Link>
              )}
              {(user.role === 'admin' || user.role === 'editor') && (
                <Link
                  href="/editor"
                  className={`block text-base font-medium text-black ${isActive('/editor')}`}
                >
                  Συντάκτης
                </Link>
              )}
              <Link
                href="/editor"
                className="inline-flex w-full items-center justify-center gap-2 text-base font-medium bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                Νέο Άρθρο
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex w-full items-center gap-2 text-left text-base font-medium text-red-600 hover:text-red-800"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                Έξοδος
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-base font-medium text-black hover:text-blue-700"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                Είσοδος
              </Link>
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 text-base font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
                Εγγραφή
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
