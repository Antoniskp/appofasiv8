'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/ProtectedRoute';
import LocationSelector from '@/components/LocationSelector';
import { articleAPI } from '@/lib/api';

function EditArticleContent() {
  const params = useParams();
  const router = useRouter();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articleAPI.getById(params.id);
        if (response.success) {
          const article = response.data.article;
          setFormData({
            title: article.title || '',
            subtitle: article.subtitle || '',
            content: article.content || '',
            summary: article.summary || '',
            category: article.category || '',
            status: article.status || 'draft',
            isNews: article.isNews || false,
            isFeatured: article.isFeatured || false,
            coverImageUrl: article.coverImageUrl || '',
            coverImageCaption: article.coverImageCaption || '',
            sourceName: article.sourceName || '',
            sourceUrl: article.sourceUrl || '',
            tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
            readingTimeMinutes: article.readingTimeMinutes || '',
            locationId: article.locationId || null,
            useUserLocation: false
          });
        } else {
          setLoadError(response.message || 'Αποτυχία φόρτωσης άρθρου.');
        }
      } catch (err) {
        setLoadError(err.message || 'Αποτυχία φόρτωσης άρθρου.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'number') {
      if (value === '') {
        setFormData((prev) => ({
          ...prev,
          [name]: '',
        }));
        return;
      }
      if (Number.isNaN(Number(value))) {
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
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
      const response = await articleAPI.update(params.id, payload);
      if (response.success) {
        alert('Το άρθρο ενημερώθηκε με επιτυχία!');
        router.push(`/articles/${params.id}`);
      } else {
        setSubmitError(response.message || 'Αποτυχία ενημέρωσης άρθρου.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Αποτυχία ενημέρωσης άρθρου.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-600">Φόρτωση άρθρου...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{loadError}</p>
        </div>
        <Link href="/articles" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Πίσω στα άρθρα
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Επεξεργασία Άρθρου</h1>
          <Link href={`/articles/${params.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Πίσω στο άρθρο
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τοποθεσία (Προαιρετικό)
              </label>
              <LocationSelector
                selectedLocationId={formData.locationId}
                onLocationChange={(locationId) => setFormData((prev) => ({ ...prev, locationId }))}
                showUseUserLocation={true}
                useUserLocation={formData.useUserLocation}
                onUseUserLocationChange={(checked) => setFormData((prev) => ({ ...prev, useUserLocation: checked }))}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Αποθήκευση...' : 'Αποθήκευση'}
              </button>
              <Link
                href={`/articles/${params.id}`}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Ακύρωση
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditArticlePage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'editor', 'viewer', 'moderator']}>
      <EditArticleContent />
    </ProtectedRoute>
  );
}
