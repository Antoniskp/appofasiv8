'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function PollForm({ initialData = null, onSubmit, isLoading = false }) {
  const canEditOptions = !(initialData?.voteCount > 0);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    pollType: initialData?.pollType || 'simple',
    questionType: initialData?.questionType || 'single-choice',
    allowUserSubmittedAnswers: initialData?.allowUserSubmittedAnswers || false,
    allowUnauthenticatedVoting: initialData?.allowUnauthenticatedVoting || false,
    allowFreeTextResponse: initialData?.allowFreeTextResponse || false,
    status: initialData?.status || 'draft',
    options: initialData?.options || [
      { text: '', photoUrl: '', linkUrl: '' },
      { text: '', photoUrl: '', linkUrl: '' }
    ]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    if (!canEditOptions) {
      return;
    }
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]: value
      };
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    if (!canEditOptions) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', photoUrl: '', linkUrl: '' }]
    }));
  };

  const removeOption = (index) => {
    if (!canEditOptions) {
      return;
    }
    if (formData.options.length <= 2) {
      alert('A poll must have at least 2 options');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title.trim()) {
      alert('Please enter a poll title');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    // Filter out empty options and prepare data
    const submitData = {
      ...formData,
      options: validOptions.map((opt, index) => ({
        text: opt.text.trim(),
        photoUrl: opt.photoUrl?.trim() || null,
        linkUrl: opt.linkUrl?.trim() || null,
        orderIndex: index
      }))
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-blue-900">Βασικές Πληροφορίες</h2>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-blue-900">
            Τίτλος Ψηφοφορίας *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="π.χ. Ποια είναι η καλύτερη πόλη της Ελλάδας;"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-blue-900">
            Περιγραφή
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Προσθέστε περισσότερες λεπτομέρειες για την ψηφοφορία..."
          />
        </div>
      </div>

      {/* Poll Type and Settings */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-blue-900">Ρυθμίσεις Ψηφοφορίας</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pollType" className="block text-sm font-medium text-blue-900">
              Τύπος Ψηφοφορίας
            </label>
            <select
              id="pollType"
              name="pollType"
              value={formData.pollType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="simple">Απλή (Κείμενο)</option>
              <option value="complex">Σύνθετη (Με Φωτογραφίες & Links)</option>
            </select>
          </div>

          <div>
            <label htmlFor="questionType" className="block text-sm font-medium text-blue-900">
              Είδος Ερώτησης
            </label>
            <select
              id="questionType"
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="single-choice">Μονή Επιλογή</option>
              <option value="ranked-choice">Κατάταξη Επιλογών</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-blue-900">
              Κατάσταση
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="draft">Πρόχειρο</option>
              <option value="active">Ενεργή</option>
              <option value="closed">Κλειστή</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowUserSubmittedAnswers"
              checked={formData.allowUserSubmittedAnswers}
              onChange={handleChange}
              className="rounded border-seafoam text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-blue-900">
              Επιτρέπεται η προσθήκη απαντήσεων από χρήστες
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowUnauthenticatedVoting"
              checked={formData.allowUnauthenticatedVoting}
              onChange={handleChange}
              className="rounded border-seafoam text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-blue-900">
              Επιτρέπεται η ψηφοφορία χωρίς σύνδεση
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowFreeTextResponse"
              checked={formData.allowFreeTextResponse}
              onChange={handleChange}
              className="rounded border-seafoam text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-blue-900">
              Επιτρέπεται ελεύθερη απάντηση κειμένου
            </span>
          </label>
        </div>
      </div>

      {/* Poll Options */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-900">Επιλογές Ψηφοφορίας</h2>
          <button
            type="button"
            onClick={addOption}
            disabled={!canEditOptions}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
            Προσθήκη Επιλογής
          </button>
        </div>
        {!canEditOptions && (
          <p className="text-sm text-gray-600">
            Οι επιλογές δεν μπορούν να αλλάξουν μετά την καταχώρηση ψήφων.
          </p>
        )}

        <div className="space-y-4">
          {formData.options.map((option, index) => (
            <div key={index} className="border border-seafoam rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-blue-900">
                  Επιλογή {index + 1}
                </span>
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={!canEditOptions}
                    className="text-red-600 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Κείμενο *
                </label>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  disabled={!canEditOptions}
                  className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Εισάγετε το κείμενο της επιλογής..."
                  required
                />
              </div>

              {formData.pollType === 'complex' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">
                      <PhotoIcon className="inline h-4 w-4 mr-1" />
                      URL Φωτογραφίας
                    </label>
                    <input
                      type="url"
                      value={option.photoUrl}
                      onChange={(e) => handleOptionChange(index, 'photoUrl', e.target.value)}
                      disabled={!canEditOptions}
                      className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {option.photoUrl && (
                      <div className="mt-2">
                        <img
                          src={option.photoUrl}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded border border-seafoam"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900">
                      Link URL (Άρθρο/Προφίλ)
                    </label>
                    <input
                      type="url"
                      value={option.linkUrl}
                      onChange={(e) => handleOptionChange(index, 'linkUrl', e.target.value)}
                      disabled={!canEditOptions}
                      className="mt-1 block w-full rounded-md border-seafoam shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://example.com/profile"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Αποθήκευση...' : initialData ? 'Ενημέρωση Ψηφοφορίας' : 'Δημιουργία Ψηφοφορίας'}
        </button>
      </div>
    </form>
  );
}
