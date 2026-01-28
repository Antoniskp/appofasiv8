'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function GithubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGithub } = useAuth();
  const [message, setMessage] = useState('Ολοκλήρωση σύνδεσης GitHub...');
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun) {
      return;
    }
    const finalizeAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = sessionStorage.getItem('github_oauth_state');

      if (!code || !state || !savedState || state !== savedState) {
        setError('Η κατάσταση σύνδεσης GitHub δεν είναι έγκυρη ή έληξε.');
        setMessage('');
        setHasRun(true);
        return;
      }

      try {
        sessionStorage.removeItem('github_oauth_state');
        await loginWithGithub({ code, state });
        router.push('/profile');
      } catch (err) {
        setError(err.message || 'Η πιστοποίηση GitHub απέτυχε.');
        setMessage('');
        setHasRun(true);
      }
    };

    finalizeAuth();
    setHasRun(true);
  }, [hasRun, loginWithGithub, router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
        {message && <p className="text-gray-700">{message}</p>}
        {error && (
          <>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Πίσω στην είσοδο
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={(
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-700">Φόρτωση πιστοποίησης GitHub...</p>
        </div>
      </div>
    )}
    >
      <GithubCallbackContent />
    </Suspense>
  );
}
