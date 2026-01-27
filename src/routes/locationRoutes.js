const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { apiLimiter } = require('../middleware/rateLimiter');

// All location routes are public (read-only) with rate limiting
// More specific routes first to avoid conflicts
router.get('/countries', apiLimiter, locationController.getCountries);
router.get('/countries/:countryId/jurisdictions', apiLimiter, locationController.getJurisdictionsByCountry);
router.get('/jurisdictions/:jurisdictionId/municipalities', apiLimiter, locationController.getMunicipalitiesByJurisdiction);
// Generic ID route last to avoid conflicts
router.get('/:id', apiLimiter, locationController.getLocationById);

module.exports = router;
