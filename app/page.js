'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { articleAPI } from '@/lib/api';

export default function HomePage() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await articleAPI.getAll({ 
          status: 'published', 
          limit: 6,
          page: 1 
        });
        if (response.success) {
          setLatestArticles(response.data.articles || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to News App
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Your trusted source for the latest news and articles
          </p>
          <Link
            href="/articles"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse All Articles
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest News</h2>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading latest articles...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading articles: {error}</p>
          </div>
        )}

        {!loading && !error && latestArticles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No articles found.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                {article.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    {article.category}
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/articles/${article.id}`} className="hover:text-blue-600">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.summary || article.content?.substring(0, 150) + '...'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {article.User?.username || 'Unknown'}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {latestArticles.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/articles"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View All Articles
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
