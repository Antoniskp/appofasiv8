'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import PollForm from '@/components/PollForm';
import ProtectedRoute from '@/components/ProtectedRoute';

function CreatePollPageContent() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create poll');
      }

      // Redirect to the created poll
      router.push(`/polls/${data.data.poll.id}`);
    } catch (err) {
      console.error('Error creating poll:', err);
      setError(err.message || 'Αποτυχία δημιουργίας ψηφοφορίας');
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Δημιουργία Νέας Ψηφοφορίας</h1>
          <p className="text-gray-600 mt-2">
            Δημιουργήστε μια ψηφοφορία για να συλλέξετε απόψεις από την κοινότητα
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <PollForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <CreatePollPageContent />
    </ProtectedRoute>
  );
}
