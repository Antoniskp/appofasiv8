const { Location } = require('../models');

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

    // Add some Greek jurisdictions (administrative regions) as examples
    const attica = await Location.create({
      name: 'Attica',
      type: 'jurisdiction',
      code: 'GR-I',
      parentId: greece.id,
      metadata: {
        names: {
          en: 'Attica',
          el: 'Αττική'
        }
      }
    });

    const centralMacedonia = await Location.create({
      name: 'Central Macedonia',
      type: 'jurisdiction',
      code: 'GR-B',
      parentId: greece.id,
      metadata: {
        names: {
          en: 'Central Macedonia',
          el: 'Κεντρική Μακεδονία'
        }
      }
    });

    const crete = await Location.create({
      name: 'Crete',
      type: 'jurisdiction',
      code: 'GR-M',
      parentId: greece.id,
      metadata: {
        names: {
          en: 'Crete',
          el: 'Κρήτη'
        }
      }
    });

    // Add some municipalities as examples
    await Location.create({
      name: 'Athens',
      type: 'municipality',
      code: 'GR-I-ATH',
      parentId: attica.id,
      metadata: {
        names: {
          en: 'Athens',
          el: 'Αθήνα'
        }
      }
    });

    await Location.create({
      name: 'Piraeus',
      type: 'municipality',
      code: 'GR-I-PIR',
      parentId: attica.id,
      metadata: {
        names: {
          en: 'Piraeus',
          el: 'Πειραιάς'
        }
      }
    });

    await Location.create({
      name: 'Thessaloniki',
      type: 'municipality',
      code: 'GR-B-THE',
      parentId: centralMacedonia.id,
      metadata: {
        names: {
          en: 'Thessaloniki',
          el: 'Θεσσαλονίκη'
        }
      }
    });

    await Location.create({
      name: 'Heraklion',
      type: 'municipality',
      code: 'GR-M-HER',
      parentId: crete.id,
      metadata: {
        names: {
          en: 'Heraklion',
          el: 'Ηράκλειο'
        }
      }
    });

    console.log('Location data seeded successfully!');
  } catch (error) {
    console.error('Error seeding locations:', error);
    throw error;
  }
}

module.exports = seedLocations;
