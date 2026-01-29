'use client';

import Link from 'next/link';
import { ChartBarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function PollCard({ poll }) {
  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Ενεργή', class: 'bg-green-100 text-green-800' },
      draft: { text: 'Πρόχειρο', class: 'bg-gray-100 text-gray-800' },
      closed: { text: 'Κλειστή', class: 'bg-red-100 text-red-800' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const getQuestionTypeBadge = (type) => {
    const badges = {
      'single-choice': { text: 'Μονή Επιλογή', class: 'bg-blue-100 text-blue-800' },
      'ranked-choice': { text: 'Κατάταξη', class: 'bg-purple-100 text-purple-800' }
    };
    const badge = badges[type] || badges['single-choice'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            href={`/polls/${poll.id}`}
            className="text-xl font-semibold text-blue-900 hover:text-blue-700"
          >
            {poll.title}
          </Link>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(poll.status)}
            {getQuestionTypeBadge(poll.questionType)}
            {poll.pollType === 'complex' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Σύνθετη
              </span>
            )}
          </div>
        </div>
      </div>

      {poll.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {poll.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <ChartBarIcon className="h-4 w-4" />
          <span>{poll.voteCount || 0} ψήφοι</span>
        </div>
        {poll.creator && (
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>{poll.creator.username}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>{new Date(poll.createdAt).toLocaleDateString('el-GR')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {poll.options?.length || 0} επιλογές
        </div>
        <div className="flex gap-2">
          <Link
            href={`/polls/${poll.id}/results`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Αποτελέσματα
          </Link>
          {poll.status === 'active' && !poll.hasVoted && (
            <Link
              href={`/polls/${poll.id}`}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Ψήφισε
            </Link>
          )}
          {poll.hasVoted && (
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700">
              ✓ Ψηφίσατε
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
