'use client';

import { useState, useEffect } from 'react';

/**
 * LocationSelector Component
 * Provides hierarchical location selection with three dependent dropdowns:
 * - Country
 * - Jurisdiction (filtered by selected country)
 * - Municipality (filtered by selected jurisdiction)
 * 
 * Also includes a free-text location list field for future map integration.
 */
export default function LocationSelector({ 
  selectedLocationId, 
  onLocationChange,
  showUseUserLocation = false,
  useUserLocation = false,
  onUseUserLocationChange = null
}) {
  const [countries, setCountries] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/locations/countries`);
      const data = await response.json();
      if (data.success) {
        setCountries(data.data.locations || []);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      setError('Failed to load countries');
    }
  };

  // Fetch jurisdictions when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchJurisdictions(selectedCountry);
    } else {
      setJurisdictions([]);
      setSelectedJurisdiction('');
    }
  }, [selectedCountry]);

  const fetchJurisdictions = async (countryId) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/locations/countries/${countryId}/jurisdictions`);
      const data = await response.json();
      if (data.success) {
        setJurisdictions(data.data.locations || []);
      }
    } catch (error) {
      console.error('Failed to fetch jurisdictions:', error);
      setError('Failed to load jurisdictions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch municipalities when jurisdiction changes
  useEffect(() => {
    if (selectedJurisdiction) {
      fetchMunicipalities(selectedJurisdiction);
    } else {
      setMunicipalities([]);
      setSelectedMunicipality('');
    }
  }, [selectedJurisdiction]);

  const fetchMunicipalities = async (jurisdictionId) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/locations/jurisdictions/${jurisdictionId}/municipalities`);
      const data = await response.json();
      if (data.success) {
        setMunicipalities(data.data.locations || []);
      }
    } catch (error) {
      console.error('Failed to fetch municipalities:', error);
      setError('Failed to load municipalities');
    } finally {
      setLoading(false);
    }
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const value = e.target.value;
    setSelectedCountry(value);
    setSelectedJurisdiction('');
    setSelectedMunicipality('');
    
    // Always set country as location when selected - more specific selections will override
    if (value && onLocationChange) {
      onLocationChange(value);
    } else if (!value && onLocationChange) {
      onLocationChange(null);
    }
  };

  // Handle jurisdiction selection
  const handleJurisdictionChange = (e) => {
    const value = e.target.value;
    setSelectedJurisdiction(value);
    setSelectedMunicipality('');
    
    // Set jurisdiction as location
    if (value && onLocationChange) {
      onLocationChange(value);
    }
  };

  // Handle municipality selection
  const handleMunicipalityChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipality(value);
    
    // Set municipality as location (most specific)
    if (value && onLocationChange) {
      onLocationChange(value);
    }
  };

  // Handle location notes change
  const handleLocationNotesChange = (e) => {
    setLocationNotes(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Use User Location Checkbox (for articles) */}
      {showUseUserLocation && onUseUserLocationChange && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useUserLocation"
            checked={useUserLocation}
            onChange={(e) => onUseUserLocationChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="useUserLocation" className="ml-2 block text-sm text-gray-700">
            Use my location (from profile)
          </label>
        </div>
      )}

      {/* Only show dropdowns if not using user location */}
      {(!showUseUserLocation || !useUserLocation) && (
        <>
          {/* Country Dropdown */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Dropdown (only show if country is selected) */}
          {selectedCountry && (
            <div>
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 mb-1">
                Jurisdiction / Region
              </label>
              <select
                id="jurisdiction"
                value={selectedJurisdiction}
                onChange={handleJurisdictionChange}
                disabled={loading || jurisdictions.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {loading ? 'Loading...' : jurisdictions.length === 0 ? 'No jurisdictions available' : 'Select a jurisdiction'}
                </option>
                {jurisdictions.map((jurisdiction) => (
                  <option key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Municipality Dropdown (only show if jurisdiction is selected) */}
          {selectedJurisdiction && (
            <div>
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
                Municipality / City
              </label>
              <select
                id="municipality"
                value={selectedMunicipality}
                onChange={handleMunicipalityChange}
                disabled={loading || municipalities.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {loading ? 'Loading...' : municipalities.length === 0 ? 'No municipalities available' : 'Select a municipality'}
                </option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location Notes (placeholder for future map integration) */}
          <div>
            <label htmlFor="locationNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Location Details (Optional)
            </label>
            <input
              type="text"
              id="locationNotes"
              value={locationNotes}
              onChange={handleLocationNotesChange}
              placeholder="e.g., specific address, landmark, or coordinates (for future use)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This field is reserved for future map integration and does not currently affect the location selection.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
