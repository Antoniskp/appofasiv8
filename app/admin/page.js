'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { articleAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function AdminDashboardContent() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const statusLabels = {
    draft: 'Πρόχειρο',
    published: 'Δημοσιευμένο',
    archived: 'Αρχειοθετημένο'
  };
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    pendingNews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all articles (admin can see all)
        const response = await articleAPI.getAll({ limit: 100 });
        if (response.success) {
          const allArticles = response.data.articles || [];
          setArticles(allArticles);
          
          // Calculate stats
          setStats({
            total: allArticles.length,
            published: allArticles.filter(a => a.status === 'published').length,
            draft: allArticles.filter(a => a.status === 'draft').length,
            archived: allArticles.filter(a => a.status === 'archived').length,
            pendingNews: allArticles.filter(a => a.isNews && !a.newsApprovedAt).length,
          });
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το άρθρο;')) {
      return;
    }

    try {
      await articleAPI.delete(id);
      setArticles(articles.filter(a => a.id !== id));
      alert('Το άρθρο διαγράφηκε με επιτυχία.');
    } catch (error) {
      alert('Αποτυχία διαγραφής άρθρου: ' + error.message);
    }
  };

  const handleApproveNews = async (id) => {
    if (!confirm('Έγκριση αυτού του άρθρου ως είδηση και δημοσίευση;')) {
      return;
    }

    try {
      const response = await articleAPI.approveNews(id);
      if (response.success) {
        // Update the article in the list with server response
        setArticles(articles.map(a => 
          a.id === id ? response.data.article : a
        ));
        alert('Η είδηση εγκρίθηκε και δημοσιεύτηκε με επιτυχία!');
      }
    } catch (error) {
      alert('Αποτυχία έγκρισης είδησης: ' + error.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Πίνακας Διαχείρισης</h1>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Καλώς ήρθες, {user?.username}!</h2>
          <p className="text-gray-600">
            Έχετε πρόσβαση {user?.role === 'admin' ? 'διαχειριστή' : user?.role === 'moderator' ? 'συντονιστή' : 'συντάκτη'}. Μπορείτε {user?.role === 'admin' ? 'να δημιουργείτε, να επεξεργάζεστε και να διαγράφετε όλα τα άρθρα' : 'να εγκρίνετε ειδήσεις και να διαχειρίζεστε περιεχόμενο'}.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Σύνολο Άρθρων</h3>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Δημοσιευμένα</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{stats.published}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Πρόχειρα</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.draft}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Αρχειοθετημένα</h3>
            <p className="text-3xl font-bold mt-2 text-gray-600">{stats.archived}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Εκκρεμείς Ειδήσεις</h3>
            <p className="text-3xl font-bold mt-2 text-orange-600">{stats.pendingNews}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Γρήγορες Ενέργειες</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/editor"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Νέο Άρθρο
            </Link>
            <Link
              href="/articles"
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
            >
              📚 Όλα τα Άρθρα
            </Link>
          </div>
        </div>

        {/* Recent Articles Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Όλα τα Άρθρα</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Φόρτωση άρθρων...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Δεν βρέθηκαν άρθρα.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Τίτλος
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Συντάκτης
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Κατάσταση
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Κατάσταση Ειδήσεων
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Κατηγορία
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ημερομηνία
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ενέργειες
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.User?.username || 'Άγνωστος'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {statusLabels[article.status] || article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.isNews ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            article.newsApprovedAt ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {article.newsApprovedAt ? '✓ Εγκεκριμένο' : '⏳ Εκκρεμεί'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.category || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Προβολή
                        </Link>
                        {article.isNews && !article.newsApprovedAt && (
                          <button
                            onClick={() => handleApproveNews(article.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Έγκριση
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Διαγραφή
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'moderator']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
