'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LocationSelector from '@/components/LocationSelector';

export default function ArticleForm({
  formData,
  onInputChange,
  onSubmit,
  submitting = false,
  submitLabel = 'Αποθήκευση',
  submitError,
  cancelLabel = 'Ακύρωση',
  cancelHref,
  onCancel,
  onLocationChange = () => {},
  onUseUserLocationChange = () => {},
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [formData.coverImageUrl]);

  const renderCancelAction = () => {
    if (cancelHref) {
      return (
        <Link
          href={cancelHref}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          {cancelLabel}
        </Link>
      );
    }

    if (onCancel) {
      return (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          {cancelLabel}
        </button>
      );
    }

    return null;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Λεζάντα εικόνας (προαιρετικό)"
          />
        </div>
      </div>

      {formData.coverImageUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Προεπισκόπηση Εικόνας
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {!imageError ? (
              <img
                src={formData.coverImageUrl}
                alt={formData.coverImageCaption || 'Προεπισκόπηση εικόνας εξωφύλλου άρθρου'}
                className="w-full h-auto max-h-96 object-contain bg-gray-100"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="p-4 text-center text-red-600 text-sm" role="alert">
                Αδυναμία φόρτωσης εικόνας. Ελέγξτε το URL.
              </div>
            )}
          </div>
        </div>
      )}

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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          onLocationChange={onLocationChange}
          showUseUserLocation={true}
          useUserLocation={formData.useUserLocation}
          onUseUserLocationChange={onUseUserLocationChange}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? `${submitLabel}...` : submitLabel}
        </button>
        {renderCancelAction()}
      </div>
    </form>
  );
}
