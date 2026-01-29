'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChartBarIcon, ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [newOptionText, setNewOptionText] = useState('');
  const [showAddOption, setShowAddOption] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPoll();
    }
  }, [params.id, token]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch poll');
      }

      const data = await response.json();
      setPoll(data.data.poll);
      
      // Initialize ranking with all options if ranked-choice
      if (data.data.poll.questionType === 'ranked-choice') {
        setRanking(data.data.poll.options.map(o => o.id));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError('Αποτυχία φόρτωσης ψηφοφορίας');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!poll) return;

    // Validation
    if (poll.questionType === 'single-choice' && !selectedOption && !freeText) {
      alert('Παρακαλώ επιλέξτε μια απάντηση ή προσθέστε ελεύθερο κείμενο');
      return;
    }

    setSubmitting(true);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const voteData = {};
      
      if (poll.questionType === 'single-choice') {
        if (selectedOption) voteData.optionId = selectedOption;
        if (freeText) voteData.freeTextResponse = freeText;
      } else if (poll.questionType === 'ranked-choice') {
        voteData.ranking = ranking;
        if (freeText) voteData.freeTextResponse = freeText;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}/vote`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(voteData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit vote');
      }

      // Redirect to results
      router.push(`/polls/${params.id}/results`);
    } catch (err) {
      console.error('Error submitting vote:', err);
      alert(err.message || 'Αποτυχία υποβολής ψήφου');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddOption = async () => {
    if (!newOptionText.trim()) {
      alert('Παρακαλώ εισάγετε κείμενο για την επιλογή');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/polls/${params.id}/options`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ text: newOptionText })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add option');
      }

      // Refresh poll
      await fetchPoll();
      setNewOptionText('');
      setShowAddOption(false);
    } catch (err) {
      console.error('Error adding option:', err);
      alert(err.message || 'Αποτυχία προσθήκης επιλογής');
    }
  };

  const moveRanking = (index, direction) => {
    const newRanking = [...ranking];
    const newIndex = index + direction;
    
    if (newIndex >= 0 && newIndex < newRanking.length) {
      [newRanking[index], newRanking[newIndex]] = [newRanking[newIndex], newRanking[index]];
      setRanking(newRanking);
    }
  };

  if (loading) {
    return (
      <div className="app-container py-8">
        <SkeletonLoader height="400px" />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="app-container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Η ψηφοφορία δεν βρέθηκε'}
        </div>
        <Link href="/polls" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4" />
          Επιστροφή στις ψηφοφορίες
        </Link>
      </div>
    );
  }

  const canEdit = user && poll.creator && user.id === poll.creator.id;

  return (
    <div className="app-container py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/polls" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4" />
            Επιστροφή στις ψηφοφορίες
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-900">{poll.title}</h1>
              {poll.description && (
                <p className="text-gray-700 mt-2">{poll.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                <span>Από: {poll.creator?.username}</span>
                <span>•</span>
                <span>{poll.voteCount || 0} ψήφοι</span>
                <span>•</span>
                <span>{new Date(poll.createdAt).toLocaleDateString('el-GR')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Link
                  href={`/polls/${poll.id}/edit`}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md"
                >
                  <PencilIcon className="h-4 w-4" />
                  Επεξεργασία
                </Link>
              )}
              <Link
                href={`/polls/${poll.id}/results`}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md"
              >
                <ChartBarIcon className="h-4 w-4" />
                Αποτελέσματα
              </Link>
            </div>
          </div>
        </div>

        {/* Voting Area */}
        {poll.status !== 'active' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            {poll.status === 'draft' ? 'Αυτή η ψηφοφορία είναι σε πρόχειρη κατάσταση' : 'Αυτή η ψηφοφορία έχει κλείσει'}
          </div>
        ) : poll.hasVoted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Έχετε ήδη ψηφίσει σε αυτήν την ψηφοφορία</p>
            <Link
              href={`/polls/${poll.id}/results`}
              className="inline-flex items-center gap-2 mt-3 text-green-700 hover:text-green-800"
            >
              Δείτε τα αποτελέσματα →
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              {poll.questionType === 'single-choice' ? 'Επιλέξτε μια απάντηση' : 'Κατατάξτε τις επιλογές σας'}
            </h2>

            {/* Single Choice */}
            {poll.questionType === 'single-choice' && (
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-seafoam hover:bg-seafoam/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="h-4 w-4 text-blue-600"
                    />
                    {option.photoUrl && poll.pollType === 'complex' && (
                      <img
                        src={option.photoUrl}
                        alt={option.text}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">{option.text}</div>
                      {option.linkUrl && (
                        <a
                          href={option.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Περισσότερα →
                        </a>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Ranked Choice */}
            {poll.questionType === 'ranked-choice' && (
              <div className="space-y-3">
                {ranking.map((optionId, index) => {
                  const option = poll.options.find(o => o.id === optionId);
                  if (!option) return null;
                  
                  return (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-4 border border-seafoam rounded-lg"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveRanking(index, -1)}
                          disabled={index === 0}
                          className="text-blue-600 hover:text-blue-700 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <span className="text-sm font-semibold text-blue-900 text-center">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveRanking(index, 1)}
                          disabled={index === ranking.length - 1}
                          className="text-blue-600 hover:text-blue-700 disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      {option.photoUrl && poll.pollType === 'complex' && (
                        <img
                          src={option.photoUrl}
                          alt={option.text}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">{option.text}</div>
                        {option.linkUrl && (
                          <a
                            href={option.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Περισσότερα →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* User-submitted options */}
            {poll.allowUserSubmittedAnswers && (
              <div className="mt-4">
                {!showAddOption ? (
                  <button
                    type="button"
                    onClick={() => setShowAddOption(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Προσθήκη δικής σας επιλογής
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                      placeholder="Η δική σας επιλογή..."
                      className="flex-1 rounded-md border-seafoam"
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Προσθήκη
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddOption(false); setNewOptionText(''); }}
                      className="px-4 py-2 border border-seafoam rounded-md hover:bg-seafoam/20"
                    >
                      Ακύρωση
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Free text response */}
            {poll.allowFreeTextResponse && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Ελεύθερη απάντηση (προαιρετικό)
                </label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-md border-seafoam"
                  placeholder="Προσθέστε τα σχόλιά σας..."
                />
                <div className="text-xs text-gray-600 mt-1">
                  {freeText.length}/1000 χαρακτήρες
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleVote}
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Υποβολή...' : 'Υποβολή Ψήφου'}
              </button>
            </div>

            {/* Auth notice */}
            {!user && !poll.allowUnauthenticatedVoting && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                Πρέπει να συνδεθείτε για να ψηφίσετε σε αυτήν την ψηφοφορία.
                <Link href="/login" className="text-blue-600 hover:underline ml-1">
                  Σύνδεση
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
