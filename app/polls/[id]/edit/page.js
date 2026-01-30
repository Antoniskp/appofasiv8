'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';
import { getAuthToken } from '@/lib/api';
import PollForm from '@/components/PollForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonLoader from '@/components/SkeletonLoader';

function EditPollPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params.id || authLoading) {
      return;
    }
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setLoadError('');
        const token = getAuthToken();
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}`,
          { headers }
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch poll');
        }
        const pollData = data.data?.poll;
        if (!pollData) {
          throw new Error('Poll not found');
        }
        setPoll({
          ...pollData,
          options: [...(pollData.options || [])].sort(
            (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
          )
        });
      } catch (err) {
        console.error('Error fetching poll:', err);
        setLoadError(err.message || 'Αποτυχία φόρτωσης ψηφοφορίας');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id, authLoading]);

  useEffect(() => {
    if (poll && user && poll.creator && user.id !== poll.creator.id) {
      setLoadError('Δεν έχετε δικαίωμα να επεξεργαστείτε αυτήν την ψηφοφορία.');
    }
  }, [poll, user]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Απαιτείται σύνδεση για την επεξεργασία της ψηφοφορίας');
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update poll');
      }

      router.push(`/polls/${params.id}`);
    } catch (err) {
      console.error('Error updating poll:', err);
      setSubmitError(err.message || 'Αποτυχία ενημέρωσης ψηφοφορίας');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container py-8">
        <SkeletonLoader height="500px" />
      </div>
    );
  }

  const canEdit = user && poll?.creator && user.id === poll.creator.id;
  if (loadError || !poll) {
    return (
      <div className="app-container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {loadError || 'Η ψηφοφορία δεν βρέθηκε'}
        </div>
        <Link href="/polls" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4" />
          Επιστροφή στις ψηφοφορίες
        </Link>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="app-container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Δεν έχετε δικαίωμα να επεξεργαστείτε αυτήν την ψηφοφορία.
        </div>
        <Link href={`/polls/${params.id}`} className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4" />
          Επιστροφή στην ψηφοφορία
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Επεξεργασία Ψηφοφορίας</h1>
          <Link href={`/polls/${params.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeftIcon className="h-4 w-4" />
            Πίσω στην ψηφοφορία
          </Link>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {submitError}
          </div>
        )}

        <PollForm initialData={poll} onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}

export default function EditPollPage() {
  return (
    <ProtectedRoute>
      <EditPollPageContent />
    </ProtectedRoute>
  );
}
