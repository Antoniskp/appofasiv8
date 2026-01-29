'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PollResults from '@/components/PollResults';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function PollResultsPage() {
  const params = useParams();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchResults();
    }
  }, [params.id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}/results`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setPoll(data.data.poll);
      setResults(data.data.results);
      setError(null);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Αποτυχία φόρτωσης αποτελεσμάτων');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container py-8">
        <SkeletonLoader height="600px" />
      </div>
    );
  }

  if (error || !poll || !results) {
    return (
      <div className="app-container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Τα αποτελέσματα δεν βρέθηκαν'}
        </div>
        <Link href="/polls" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4" />
          Επιστροφή στις ψηφοφορίες
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/polls/${poll.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4" />
            Επιστροφή στην ψηφοφορία
          </Link>
          
          <h1 className="text-3xl font-bold text-blue-900">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-700 mt-2">{poll.description}</p>
          )}
        </div>

        {/* Results */}
        <PollResults poll={poll} results={results} />
      </div>
    </div>
  );
}
