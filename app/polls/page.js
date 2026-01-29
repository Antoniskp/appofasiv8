'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';
import PollCard from '@/components/PollCard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function PollsPage() {
  const { user, token } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPolls();
  }, [filter, page, token]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls?status=${filter}&page=${page}&limit=10`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data = await response.json();
      setPolls(data.data.polls);
      setTotalPages(data.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Αποτυχία φόρτωσης ψηφοφοριών');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Ψηφοφορίες</h1>
            <p className="text-gray-600 mt-1">
              Συμμετέχετε στις ψηφοφορίες και δείτε τα αποτελέσματα
            </p>
          </div>
          {user && (
            <Link
              href="/polls/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Νέα Ψηφοφορία
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilter('active'); setPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 border border-seafoam hover:bg-seafoam/20'
            }`}
          >
            Ενεργές
          </button>
          <button
            onClick={() => { setFilter('closed'); setPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'closed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 border border-seafoam hover:bg-seafoam/20'
            }`}
          >
            Κλειστές
          </button>
          <button
            onClick={() => { setFilter('all'); setPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 border border-seafoam hover:bg-seafoam/20'
            }`}
          >
            Όλες
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} height="200px" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : polls.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            Δεν βρέθηκαν ψηφοφορίες
          </p>
          {user && (
            <Link
              href="/polls/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Δημιουργία Πρώτης Ψηφοφορίας
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-seafoam rounded-md text-blue-900 hover:bg-seafoam/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Προηγούμενη
              </button>
              <span className="px-4 py-2 text-blue-900">
                Σελίδα {page} από {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-seafoam rounded-md text-blue-900 hover:bg-seafoam/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Επόμενη
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
