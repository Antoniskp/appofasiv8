const express = require('express');
const router = express.Router();
const locationControllerJSON = require('../controllers/locationControllerJSON');
const { apiLimiter } = require('../middleware/rateLimiter');

// All location routes are public (read-only) with rate limiting
// More specific routes first to avoid conflicts
router.get('/countries', apiLimiter, locationControllerJSON.getCountries);
router.get('/countries/:countryId/jurisdictions', apiLimiter, locationControllerJSON.getJurisdictionsByCountry);
router.get('/jurisdictions/:jurisdictionId/municipalities', apiLimiter, locationControllerJSON.getMunicipalitiesByJurisdiction);
// Generic ID route last to avoid conflicts
router.get('/:id', apiLimiter, locationControllerJSON.getLocationById);

module.exports = router;
