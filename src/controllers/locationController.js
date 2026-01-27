const { Location } = require('../models');
const { Op } = require('sequelize');

const locationController = {
  // Get all countries
  getCountries: async (req, res) => {
    try {
      const countries = await Location.findAll({
        where: { type: 'country' },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'code', 'type', 'metadata']
      });

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

      const jurisdictions = await Location.findAll({
        where: {
          type: 'jurisdiction',
          parentId: countryId
        },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'code', 'type', 'parentId', 'metadata']
      });

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

      const municipalities = await Location.findAll({
        where: {
          type: 'municipality',
          parentId: jurisdictionId
        },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'code', 'type', 'parentId', 'metadata']
      });

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

  // Get a specific location by ID
  getLocationById: async (req, res) => {
    try {
      const { id } = req.params;

      const location = await Location.findByPk(id, {
        include: [
          {
            model: Location,
            as: 'parent',
            attributes: ['id', 'name', 'code', 'type']
          },
          {
            model: Location,
            as: 'children',
            attributes: ['id', 'name', 'code', 'type']
          }
        ]
      });

      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: { location }
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

module.exports = locationController;
