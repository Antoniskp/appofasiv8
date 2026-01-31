'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';
import { getAuthToken } from '@/lib/api';
import PollCard from '@/components/PollCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import ProtectedRoute from '@/components/ProtectedRoute';

function MyPollsPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchMyPolls();
    }
  }, [user?.id]);

  const fetchMyPolls = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls?status=all&page=1&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data = await response.json();
      // Filter to show only the user's polls
      const myPolls = data.data.polls.filter(poll => poll.creatorId === user.id);
      setPolls(myPolls);
      setError(null);
    } catch (err) {
      console.error('Error fetching my polls:', err);
      setError('Αποτυχία φόρτωσης ψηφοφοριών');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pollId) => {
    if (!confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την ψηφοφορία;')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${pollId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete poll');
      }

      // Remove the deleted poll from the list
      setPolls(polls.filter(poll => poll.id !== pollId));
      alert('Η ψηφοφορία διαγράφηκε με επιτυχία.');
    } catch (err) {
      console.error('Error deleting poll:', err);
      alert('Αποτυχία διαγραφής ψηφοφορίας: ' + err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Οι ψηφοφορίες μου</h1>
          <p className="text-gray-600">
            Διαχειριστείτε τις ψηφοφορίες που έχετε δημιουργήσει
          </p>
        </div>

        {/* Create Poll Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Δημιουργία Νέας Ψηφοφορίας</h2>
              <p className="text-gray-600 text-sm">
                Δημιουργήστε μια νέα ψηφοφορία για να συλλέξετε απόψεις από την κοινότητα
              </p>
            </div>
            <Link
              href="/polls/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Νέα Ψηφοφορία
            </Link>
          </div>
        </div>

        {/* My Polls List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Οι Ψηφοφορίες μου</h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} height="200px" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            </div>
          ) : polls.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                Δεν έχετε δημιουργήσει ψηφοφορίες ακόμα
              </p>
              <Link
                href="/polls/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
                Δημιουργία Πρώτης Ψηφοφορίας
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {polls.map((poll) => (
                <div key={poll.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-grow">
                      <Link
                        href={`/polls/${poll.id}`}
                        className="text-xl font-semibold text-blue-900 hover:text-blue-700"
                      >
                        {poll.title}
                      </Link>
                      {poll.description && (
                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                          {poll.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          poll.status === 'active' ? 'bg-green-100 text-green-800' :
                          poll.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {poll.status === 'active' ? 'Ενεργή' : 
                           poll.status === 'closed' ? 'Κλειστή' : 'Πρόχειρο'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {poll.voteCount || 0} ψήφοι
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">
                          {poll.options?.length || 0} επιλογές
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">
                          {new Date(poll.createdAt).toLocaleDateString('el-GR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col sm:items-end">
                      <Link
                        href={`/polls/${poll.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Προβολή
                      </Link>
                      <Link
                        href={`/polls/${poll.id}/edit`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                        Επεξεργασία
                      </Link>
                      <Link
                        href={`/polls/${poll.id}/results`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Αποτελέσματα
                      </Link>
                      <button
                        onClick={() => handleDelete(poll.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        Διαγραφή
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyPollsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'editor', 'moderator', 'viewer']}>
      <MyPollsPageContent />
    </ProtectedRoute>
  );
}
