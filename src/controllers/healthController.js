const { sequelize } = require('../models');

const healthHandler = async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { healthHandler };
