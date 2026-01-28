'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LocationSelector from '@/components/LocationSelector';
import { articleAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function EditorDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const statusLabels = {
    draft: 'Πρόχειρο',
    published: 'Δημοσιευμένο',
    archived: 'Αρχειοθετημένο'
  };
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    summary: '',
    category: '',
    status: 'draft',
    isNews: false,
    isFeatured: false,
    coverImageUrl: '',
    coverImageCaption: '',
    sourceName: '',
    sourceUrl: '',
    tags: '',
    readingTimeMinutes: '',
    locationId: null,
    useUserLocation: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await articleAPI.getAll({ limit: 50 });
      if (response.success) {
        setArticles(response.data.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'number') {
      if (value === '') {
        setFormData({
          ...formData,
          [name]: '',
        });
        return;
      }
      if (Number.isNaN(Number(value))) {
        return;
      }
    }
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const parsedReadingTime = formData.readingTimeMinutes
        ? Number(formData.readingTimeMinutes)
        : null;
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
          : [],
        readingTimeMinutes: parsedReadingTime && parsedReadingTime >= 1
          ? parsedReadingTime
          : null
      };
      const response = await articleAPI.create(payload);
      if (response.success) {
        alert('Το άρθρο δημιουργήθηκε με επιτυχία!');
        setShowForm(false);
        setFormData({
          title: '',
          subtitle: '',
          content: '',
          summary: '',
          category: '',
          status: 'draft',
          isNews: false,
          isFeatured: false,
          coverImageUrl: '',
          coverImageCaption: '',
          sourceName: '',
          sourceUrl: '',
          tags: '',
          readingTimeMinutes: '',
          locationId: null,
          useUserLocation: false
        });
        fetchArticles();
      }
    } catch (error) {
      alert('Αποτυχία δημιουργίας άρθρου: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Πίνακας Άρθρων</h1>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Καλώς ήρθες, {user?.username}!</h2>
          <p className="text-gray-600">
            Εδώ μπορείτε να δημιουργείτε και να διαχειρίζεστε άρθρα.
          </p>
        </div>

        {/* Create Article Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Δημιουργία Νέου Άρθρου</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showForm ? 'Απόκρυψη φόρμας' : 'Προβολή φόρμας'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Τίτλος *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Εισάγετε τίτλο άρθρου"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Υπότιτλος
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Εισάγετε υπότιτλο άρθρου"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Περίληψη
                </label>
                <input
                  type="text"
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Σύντομη περίληψη (προαιρετικό)"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Περιεχόμενο *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Γράψτε εδώ το περιεχόμενο του άρθρου..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Εικόνας Εξωφύλλου
                </label>
                  <input
                    type="url"
                    id="coverImageUrl"
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label htmlFor="coverImageCaption" className="block text-sm font-medium text-gray-700 mb-1">
                  Λεζάντα Εικόνας
                </label>
                  <input
                    type="text"
                    id="coverImageCaption"
                    name="coverImageCaption"
                    value={formData.coverImageCaption}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Λεζάντα εικόνας (προαιρετικό)"
                />
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">
                  Πηγή
                </label>
                  <input
                    type="text"
                    id="sourceName"
                    name="sourceName"
                    value={formData.sourceName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Πρακτορείο ή πηγή"
                />
              </div>
              <div>
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Πηγής
                </label>
                  <input
                    type="url"
                    id="sourceUrl"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://source.example.com"
                />
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Κατηγορία
                </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="π.χ. Τεχνολογία, Αθλητισμός"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Ετικέτες (με κόμμα)
                </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="πολιτική, οικονομία, τοπικά"
                />
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="readingTimeMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Χρόνος ανάγνωσης (λεπτά)
                </label>
                  <input
                    type="number"
                    id="readingTimeMinutes"
                    name="readingTimeMinutes"
                    min="1"
                    value={formData.readingTimeMinutes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Κατάσταση *
                </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  >
                  <option value="draft">Πρόχειρο</option>
                  <option value="published">Δημοσιευμένο</option>
                  <option value="archived">Αρχειοθετημένο</option>
                </select>
              </div>
            </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNews"
                    name="isNews"
                    checked={formData.isNews}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isNews" className="ml-2 block text-sm text-gray-700">
                    Σήμανση ως είδηση (απαιτείται έγκριση για δημοσίευση)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                    Προτεινόμενο άρθρο
                  </label>
                </div>
              </div>

              {/* Location Selection */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τοποθεσία (Προαιρετικό)
              </label>
              <LocationSelector
                  selectedLocationId={formData.locationId}
                  onLocationChange={(locationId) => setFormData({ ...formData, locationId })}
                  showUseUserLocation={true}
                  useUserLocation={formData.useUserLocation}
                  onUseUserLocationChange={(checked) => setFormData({ ...formData, useUserLocation: checked })}
                />
              </div>

              <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Δημιουργία...' : 'Δημιουργία'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Ακύρωση
              </button>
            </div>
          </form>
        )}
      </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Πρόσφατα Άρθρα</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Φόρτωση άρθρων...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Δεν βρέθηκαν άρθρα. Δημιουργήστε το πρώτο σας άρθρο!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {articles.slice(0, 10).map((article) => {
                const canEdit = user.role === 'admin' || user.role === 'editor' || user.id === article.authorId;
                const canDelete = user.role === 'admin' || user.id === article.authorId;
                
                return (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold mb-1">
                          <Link href={`/articles/${article.id}`} className="hover:text-blue-600">
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {article.summary || article.content?.substring(0, 100) + '...'}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded ${
                            article.status === 'published' ? 'bg-green-100 text-green-800' :
                            article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {statusLabels[article.status] || article.status}
                          </span>
                          {article.isNews && (
                          <span className={`px-2 py-1 rounded ${
                            article.newsApprovedAt ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {article.newsApprovedAt ? '📰 Εγκεκριμένη είδηση' : '📰 Εκκρεμής είδηση'}
                          </span>
                        )}
                        {article.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {article.category}
                          </span>
                        )}
                        <span>Από {article.User?.username || 'Άγνωστος'}</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Προβολή
                      </Link>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Διαγραφή
                        </button>
                      )}
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          )}

          {articles.length > 10 && (
            <div className="px-6 py-4 bg-gray-50 text-center">
              <Link href="/articles" className="text-blue-600 hover:text-blue-800 font-medium">
                📚 Όλα τα άρθρα →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'editor', 'moderator', 'viewer']}>
      <EditorDashboardContent />
    </ProtectedRoute>
  );
}
