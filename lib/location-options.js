const locationHierarchy = {
  Greece: {
    Attica: ['Athens'],
  },
  Italy: {
    Lombardy: ['Milan'],
  },
  Spain: {
    Catalonia: ['Barcelona'],
  },
  Portugal: {
    Lisbon: ['Lisbon'],
  },
};

const allJurisdictions = Object.values(locationHierarchy).flatMap((jurisdictions) =>
  Object.keys(jurisdictions)
);
const allMunicipalities = Object.values(locationHierarchy).flatMap((jurisdictions) =>
  Object.values(jurisdictions).flat()
);

export const locationOptions = {
  countries: Object.keys(locationHierarchy),
  jurisdictions: allJurisdictions,
  municipalities: allMunicipalities,
};

export const getJurisdictionOptions = (country) =>
  country ? Object.keys(locationHierarchy[country] || {}) : locationOptions.jurisdictions;

export const getMunicipalityOptions = (country, jurisdiction) => {
  if (country && jurisdiction) {
    return locationHierarchy[country]?.[jurisdiction] || [];
  }

  if (country) {
    return Object.values(locationHierarchy[country] || {}).flat();
  }

  return locationOptions.municipalities;
};

export const formatLocationLabel = ({ municipality, jurisdiction, country } = {}) =>
  [municipality, jurisdiction, country].filter(Boolean).join(', ');
