import Link from 'next/link';

/**
 * Reusable article card component
 * @param {Object} article - Article object with title, category, summary, content, User, createdAt
 * @param {string} variant - 'grid' for grid layout (compact) or 'list' for list layout (detailed)
 */
export default function ArticleCard({ article, variant = 'grid' }) {
  const isListVariant = variant === 'list';
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <article className={isListVariant ? 'card p-6' : 'card'}>
      {isListVariant ? (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              {article.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {article.category}
                </span>
              )}
              {article.isFeatured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/articles/${article.id}`} className="hover:text-blue-600">
                {article.title}
              </Link>
            </h2>
            {article.subtitle && (
              <p className="text-gray-600 mb-2">{article.subtitle}</p>
            )}
            <p className="body-copy mb-4">
              {article.summary || article.content?.substring(0, 200) + '...'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>By {article.author?.username || article.User?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              {article.readingTimeMinutes && (
                <>
                  <span>•</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </>
              )}
              {article.status !== 'published' && (
                <>
                  <span>•</span>
                  <span className="text-orange-600 font-medium">{article.status}</span>
                </>
              )}
            </div>
          </div>
          <Link
            href={`/articles/${article.id}`}
            className="inline-block mt-4 md:mt-0 md:ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap"
          >
            Read More
          </Link>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {article.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {article.category}
              </span>
            )}
            {article.isFeatured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="headline">
            <Link href={`/articles/${article.id}`} className="hover:text-blue-600">
              {article.title}
            </Link>
          </h3>
          {article.subtitle && (
            <p className="text-gray-600 mb-2">{article.subtitle}</p>
          )}
          <p className="body-copy mb-4 line-clamp-3">
            {article.summary || article.content?.substring(0, 150) + '...'}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex flex-wrap gap-2">
              <span>By {article.author?.username || article.User?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              {article.readingTimeMinutes && (
                <>
                  <span>•</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </>
              )}
            </div>
          </div>
          <Link
            href={`/articles/${article.id}`}
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More →
          </Link>
        </div>
      )}
    </article>
  );
}
