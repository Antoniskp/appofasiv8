const { Location } = require('../models');
const greeceMunicipalities = require('./greeceMunicipalities');

async function seedLocations() {
  try {
    // Check if locations already exist
    const existingLocations = await Location.count();
    if (existingLocations > 0) {
      console.log('Locations already seeded, skipping...');
      return;
    }

    console.log('Seeding initial location data...');

    // Create Greece
    const greece = await Location.create({
      name: 'Greece',
      type: 'country',
      code: 'GR',
      metadata: {
        iso3166: 'GR',
        officialName: 'Hellenic Republic',
        names: {
          en: 'Greece',
          el: 'Ελλάδα'
        }
      }
    });

    // Create International
    const international = await Location.create({
      name: 'International',
      type: 'country',
      code: 'INT',
      metadata: {
        description: 'For content not specific to any country'
      }
    });

    // Add Greek jurisdictions (administrative regions)
    const jurisdictions = [
      { name: 'Eastern Macedonia and Thrace', greekName: 'Ανατολικής Μακεδονίας και Θράκης', code: 'GR-A' },
      { name: 'Central Macedonia', greekName: 'Κεντρικής Μακεδονίας', code: 'GR-B' },
      { name: 'Western Macedonia', greekName: 'Δυτικής Μακεδονίας', code: 'GR-C' },
      { name: 'Epirus', greekName: 'Ηπείρου', code: 'GR-D' },
      { name: 'Thessaly', greekName: 'Θεσσαλίας', code: 'GR-E' },
      { name: 'Ionian Islands', greekName: 'Ιονίων Νήσων', code: 'GR-F' },
      { name: 'Western Greece', greekName: 'Δυτικής Ελλάδας', code: 'GR-G' },
      { name: 'Central Greece', greekName: 'Στερεάς Ελλάδας', code: 'GR-H' },
      { name: 'Attica', greekName: 'Αττικής', code: 'GR-I' },
      { name: 'Peloponnese', greekName: 'Πελοποννήσου', code: 'GR-J' },
      { name: 'North Aegean', greekName: 'Βορείου Αιγαίου', code: 'GR-K' },
      { name: 'South Aegean', greekName: 'Νοτίου Αιγαίου', code: 'GR-L' },
      { name: 'Crete', greekName: 'Κρήτης', code: 'GR-M' }
    ];

    const jurisdictionMap = new Map();
    for (const jurisdiction of jurisdictions) {
      const createdJurisdiction = await Location.create({
        name: jurisdiction.name,
        type: 'jurisdiction',
        code: jurisdiction.code,
        parentId: greece.id,
        metadata: {
          names: {
            en: jurisdiction.name,
            el: jurisdiction.greekName
          }
        }
      });
      jurisdictionMap.set(jurisdiction.greekName, createdJurisdiction);
    }

    const createdMunicipalities = new Set();
    for (const municipality of greeceMunicipalities) {
      const jurisdiction = jurisdictionMap.get(municipality.periferies_name);
      if (!jurisdiction) {
        continue;
      }

      const municipalityKey = `${jurisdiction.id}-${municipality.dimos_name}`;
      if (createdMunicipalities.has(municipalityKey)) {
        continue;
      }
      createdMunicipalities.add(municipalityKey);

      await Location.create({
        name: municipality.dimos_name,
        type: 'municipality',
        parentId: jurisdiction.id,
        metadata: {
          names: {
            el: municipality.dimos_name
          },
          nomos: municipality.nomos_name
        }
      });
    }

    console.log('Location data seeded successfully!');
  } catch (error) {
    console.error('Error seeding locations:', error);
    throw error;
  }
}

module.exports = seedLocations;
