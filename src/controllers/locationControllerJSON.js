const fs = require('fs');
const path = require('path');

const LOCATIONS_DIR = path.join(__dirname, '../../locations');

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

const locationControllerJSON = {
  // Get all countries
  getCountries: async (req, res) => {
    try {
      const countriesFile = path.join(LOCATIONS_DIR, 'global/countries.json');
      const data = readJSONFile(countriesFile);
      
      if (!data || !data.countries) {
        return res.status(500).json({
          success: false,
          message: 'Error loading countries data.'
        });
      }

      // Format countries to match expected format
      const countries = data.countries.map(country => ({
        id: country.code,
        name: country.name,
        code: country.code,
        type: 'country',
        metadata: {
          iso3166_alpha2: country.iso3166_alpha2,
          iso3166_alpha3: country.iso3166_alpha3,
          iso3166_numeric: country.iso3166_numeric,
          officialName: country.officialName
        }
      }));

      res.status(200).json({
        success: true,
        data: { locations: countries }
      });
    } catch (error) {
      console.error('Get countries error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching countries.',
        error: error.message
      });
    }
  },

  // Get jurisdictions by country
  getJurisdictionsByCountry: async (req, res) => {
    try {
      const { countryId } = req.params;

      if (!countryId) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required.'
        });
      }

      // For non-GR countries or combined option, return empty jurisdictions
      if (countryId !== 'GR') {
        return res.status(200).json({
          success: true,
          data: { locations: [] }
        });
      }

      // Load Greek subdivisions
      const subdivisionsFile = path.join(LOCATIONS_DIR, 'gr/subdivisions.json');
      const data = readJSONFile(subdivisionsFile);
      
      if (!data || !data.subdivisions) {
        return res.status(500).json({
          success: false,
          message: 'Error loading jurisdictions data.'
        });
      }

      // Format subdivisions to match expected format
      const jurisdictions = data.subdivisions.map(subdivision => ({
        id: subdivision.code,
        name: subdivision.name,
        code: subdivision.code,
        type: 'jurisdiction',
        parentId: 'GR',
        metadata: {
          iso3166_2: subdivision.iso3166_2,
          type: subdivision.type,
          municipalitiesFile: subdivision.municipalitiesFile
        }
      }));

      res.status(200).json({
        success: true,
        data: { locations: jurisdictions }
      });
    } catch (error) {
      console.error('Get jurisdictions error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching jurisdictions.',
        error: error.message
      });
    }
  },

  // Get municipalities by jurisdiction
  getMunicipalitiesByJurisdiction: async (req, res) => {
    try {
      const { jurisdictionId } = req.params;

      if (!jurisdictionId) {
        return res.status(400).json({
          success: false,
          message: 'Jurisdiction ID is required.'
        });
      }

      // Load jurisdiction data to find the municipalities file
      const subdivisionsFile = path.join(LOCATIONS_DIR, 'gr/subdivisions.json');
      const subdivisionsData = readJSONFile(subdivisionsFile);
      
      if (!subdivisionsData || !subdivisionsData.subdivisions) {
        return res.status(500).json({
          success: false,
          message: 'Error loading subdivisions data.'
        });
      }

      // Find the specific jurisdiction
      const jurisdiction = subdivisionsData.subdivisions.find(
        sub => sub.code === jurisdictionId
      );

      if (!jurisdiction || !jurisdiction.municipalitiesFile) {
        return res.status(200).json({
          success: true,
          data: { locations: [] }
        });
      }

      // Load municipalities file
      const municipalitiesFile = path.join(
        LOCATIONS_DIR,
        'gr/municipalities',
        jurisdiction.municipalitiesFile
      );
      const municipalitiesData = readJSONFile(municipalitiesFile);
      
      if (!municipalitiesData || !municipalitiesData.municipalities) {
        return res.status(500).json({
          success: false,
          message: 'Error loading municipalities data.'
        });
      }

      // Format municipalities to match expected format
      const municipalities = municipalitiesData.municipalities.map((municipality, index) => ({
        id: `${jurisdictionId}-${municipality.kallikratisCode || index}`,
        name: municipality.name,
        code: municipality.kallikratisCode || null,
        type: 'municipality',
        parentId: jurisdictionId,
        metadata: {
          kallikratisCode: municipality.kallikratisCode,
          subdivisionCode: municipalitiesData.subdivisionCode,
          subdivisionName: municipalitiesData.subdivisionName
        }
      }));

      res.status(200).json({
        success: true,
        data: { locations: municipalities }
      });
    } catch (error) {
      console.error('Get municipalities error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching municipalities.',
        error: error.message
      });
    }
  },

  // Get a specific location by ID (code)
  getLocationById: async (req, res) => {
    try {
      const { id } = req.params;

      // Try to find in countries
      const countriesFile = path.join(LOCATIONS_DIR, 'global/countries.json');
      const countriesData = readJSONFile(countriesFile);
      
      if (countriesData && countriesData.countries) {
        const country = countriesData.countries.find(c => c.code === id);
        if (country) {
          return res.status(200).json({
            success: true,
            data: {
              location: {
                id: country.code,
                name: country.name,
                code: country.code,
                type: 'country',
                metadata: {
                  iso3166_alpha2: country.iso3166_alpha2,
                  iso3166_alpha3: country.iso3166_alpha3,
                  iso3166_numeric: country.iso3166_numeric,
                  officialName: country.officialName
                }
              }
            }
          });
        }
      }

      // Try to find in Greek subdivisions
      const subdivisionsFile = path.join(LOCATIONS_DIR, 'gr/subdivisions.json');
      const subdivisionsData = readJSONFile(subdivisionsFile);
      
      if (subdivisionsData && subdivisionsData.subdivisions) {
        const subdivision = subdivisionsData.subdivisions.find(s => s.code === id);
        if (subdivision) {
          return res.status(200).json({
            success: true,
            data: {
              location: {
                id: subdivision.code,
                name: subdivision.name,
                code: subdivision.code,
                type: 'jurisdiction',
                parentId: 'GR',
                metadata: {
                  iso3166_2: subdivision.iso3166_2,
                  type: subdivision.type,
                  municipalitiesFile: subdivision.municipalitiesFile
                }
              }
            }
          });
        }
      }

      // Try to find in municipalities
      // This requires checking all municipality files - for now return not found
      return res.status(404).json({
        success: false,
        message: 'Location not found.'
      });
    } catch (error) {
      console.error('Get location error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching location.',
        error: error.message
      });
    }
  }
};

module.exports = locationControllerJSON;
