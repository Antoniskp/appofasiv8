'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { articleAPI } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          status: 'published',
          isNews: true,
        };

        const response = await articleAPI.getAll(params);
        if (response.success) {
          setArticles(response.data.articles || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        <h1 className="text-4xl font-bold mb-8">Ειδήσεις</h1>

        {loading && (
          <div className="space-y-6">
            <SkeletonLoader count={5} variant="list" />
          </div>
        )}

        {error && (
          <EmptyState
            type="error"
            title="Σφάλμα φόρτωσης ειδήσεων"
            description={error}
            action={{
              text: 'Δοκιμή ξανά',
              icon: ArrowPathIcon,
              onClick: () => window.location.reload()
            }}
          />
        )}

        {!loading && !error && articles.length === 0 && (
          <EmptyState
            type="empty"
            title="Δεν βρέθηκαν ειδήσεις"
            description="Δεν υπάρχουν εγκεκριμένες ειδήσεις αυτή τη στιγμή."
          />
        )}

        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="list" />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              Προηγούμενο
            </button>
            <span className="text-gray-700">
              Σελίδα {page} από {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Επόμενο
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
