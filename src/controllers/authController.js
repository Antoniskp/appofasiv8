const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Location } = require('../models');
require('dotenv').config();

const normalizeAvatarUrl = (avatarUrl) => {
  if (avatarUrl === undefined) {
    return { value: undefined };
  }
  if (avatarUrl === null) {
    return { value: null };
  }
  if (typeof avatarUrl !== 'string') {
    return { error: 'Avatar URL must be a string.' };
  }
  const trimmed = avatarUrl.trim();
  if (!trimmed) {
    return { value: null };
  }
  if (trimmed.length > 2048) {
    return { error: 'Avatar URL is too long.' };
  }
  return { value: trimmed };
};

const normalizeProfileColor = (profileColor) => {
  if (profileColor === undefined) {
    return { value: undefined };
  }
  if (profileColor === null) {
    return { value: null };
  }
  if (typeof profileColor !== 'string') {
    return { error: 'Profile color must be a string.' };
  }
  const trimmed = profileColor.trim();
  if (!trimmed) {
    return { value: null };
  }
  const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  const hex = normalized.slice(1);
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
    return { error: 'Profile color must be a valid hex color.' };
  }
  return { value: `#${hex.toLowerCase()}` };
};

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password, role, firstName, lastName, locationId, avatarUrl, profileColor } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required.'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists.'
        });
      }

      const avatarResult = normalizeAvatarUrl(avatarUrl);
      if (avatarResult.error) {
        return res.status(400).json({
          success: false,
          message: avatarResult.error
        });
      }

      const colorResult = normalizeProfileColor(profileColor);
      if (colorResult.error) {
        return res.status(400).json({
          success: false,
          message: colorResult.error
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        role: role || 'viewer',
        firstName,
        lastName,
        avatarUrl: avatarResult.value ?? null,
        profileColor: colorResult.value ?? null,
        locationId: locationId || null
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            profileColor: user.profileColor
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user.',
        error: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            profileColor: user.profileColor
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging in.',
        error: error.message
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'code', 'type']
        }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile.',
        error: error.message
      });
    }
  },

  // Update current user profile (excluding email)
  updateProfile: async (req, res) => {
    try {
      const { username, firstName, lastName, locationId, avatarUrl, profileColor } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      if (username !== undefined) {
        if (typeof username !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Username must be a string.'
          });
        }

        const trimmedUsername = username.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
          return res.status(400).json({
            success: false,
            message: 'Username must be between 3 and 50 characters.'
          });
        }

        if (trimmedUsername !== user.username) {
          const existingUser = await User.findOne({
            where: {
              username: trimmedUsername,
              id: { [Op.ne]: user.id }
            }
          });

          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: 'Username is already taken.'
            });
          }
          user.username = trimmedUsername;
        }
      }

      if (firstName !== undefined) {
        user.firstName = firstName;
      }

      if (lastName !== undefined) {
        user.lastName = lastName;
      }

      const avatarResult = normalizeAvatarUrl(avatarUrl);
      if (avatarResult.error) {
        return res.status(400).json({
          success: false,
          message: avatarResult.error
        });
      }
      if (avatarResult.value !== undefined) {
        user.avatarUrl = avatarResult.value;
      }

      const colorResult = normalizeProfileColor(profileColor);
      if (colorResult.error) {
        return res.status(400).json({
          success: false,
          message: colorResult.error
        });
      }
      if (colorResult.value !== undefined) {
        user.profileColor = colorResult.value;
      }

      if (locationId !== undefined) {
        // Validate locationId if provided
        if (locationId !== null) {
          const location = await Location.findByPk(locationId);
          if (!location) {
            return res.status(400).json({
              success: false,
              message: 'Invalid location ID. Location does not exist.'
            });
          }
        }
        user.locationId = locationId;
      }

      await user.save();

      const updatedUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'code', 'type']
        }]
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile.',
        error: error.message
      });
    }
  },

  // Update current user password
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters.'
        });
      }

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      const isValidPassword = await user.comparePassword(currentPassword);

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully.'
      });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating password.',
        error: error.message
      });
    }
  }
};

module.exports = authController;
