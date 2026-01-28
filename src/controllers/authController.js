const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
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

const normalizeGithubUrl = (githubUrl) => {
  if (githubUrl === undefined) {
    return { value: undefined };
  }
  if (githubUrl === null) {
    return { value: null };
  }
  if (typeof githubUrl !== 'string') {
    return { error: 'GitHub profile URL must be a string.' };
  }
  const trimmed = githubUrl.trim();
  if (!trimmed) {
    return { value: null };
  }
  if (!/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(trimmed)) {
    return { error: 'GitHub profile URL must be a valid github.com profile URL.' };
  }
  return { value: trimmed.replace(/\/$/, '') };
};

const normalizeGithubUsername = (githubUsername) => {
  if (githubUsername === undefined) {
    return { value: undefined };
  }
  if (githubUsername === null) {
    return { value: null };
  }
  if (typeof githubUsername !== 'string') {
    return { error: 'GitHub username must be a string.' };
  }
  const trimmed = githubUsername.trim();
  if (!trimmed) {
    return { value: null };
  }
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(trimmed) || /--/.test(trimmed)) {
    return { error: 'GitHub username must be a valid GitHub handle.' };
  }
  return { value: trimmed };
};

const githubStateStore = new Map();

const cleanupGithubStates = () => {
  const now = Date.now();
  for (const [key, expiresAt] of githubStateStore.entries()) {
    if (expiresAt < now) {
      githubStateStore.delete(key);
    }
  }
};

const getGithubRedirectUri = () => {
  if (process.env.GITHUB_REDIRECT_URI) {
    return process.env.GITHUB_REDIRECT_URI;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  return `${appUrl.replace(/\/$/, '')}/auth/github/callback`;
};

const createGithubState = () => {
  cleanupGithubStates();
  const state = crypto.randomBytes(16).toString('hex');
  githubStateStore.set(state, Date.now() + 10 * 60 * 1000);
  return state;
};

const consumeGithubState = (state) => {
  if (!state) {
    return false;
  }
  cleanupGithubStates();
  const expiresAt = githubStateStore.get(state);
  if (!expiresAt || expiresAt < Date.now()) {
    githubStateStore.delete(state);
    return false;
  }
  githubStateStore.delete(state);
  return true;
};

const ensureGithubConfigured = () => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return false;
  }
  return true;
};

const createTokenPayload = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role
});

const createAuthToken = (user) => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  return jwt.sign(
    createTokenPayload(user),
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    { expiresIn: '24h' }
  );
};

const buildGithubAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: getGithubRedirectUri(),
    scope: 'read:user user:email',
    state
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const fetchGithubAccessToken = async (code) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    signal: controller.signal,
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getGithubRedirectUri()
    })
  });
  clearTimeout(timeout);
  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error_description || 'Unable to fetch GitHub access token.');
  }
  return data.access_token;
};

const fetchGithubProfile = async (token) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'news-app'
    },
    signal: controller.signal
  });
  clearTimeout(timeout);
  if (!response.ok) {
    throw new Error('Unable to fetch GitHub profile.');
  }
  return response.json();
};

const fetchGithubEmails = async (token) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const response = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'news-app'
    },
    signal: controller.signal
  });
  clearTimeout(timeout);
  if (!response.ok) {
    return [];
  }
  return response.json();
};

const buildGithubUserPayload = (profile, primaryEmail) => {
  const avatarResult = normalizeAvatarUrl(profile.avatar_url ?? null);
  const githubUsernameResult = normalizeGithubUsername(profile.login ?? null);
  const githubUrlResult = normalizeGithubUrl(profile.html_url ?? null);

  if (avatarResult.error) {
    return { error: avatarResult.error };
  }
  if (githubUsernameResult.error) {
    return { error: githubUsernameResult.error };
  }
  if (githubUrlResult.error) {
    return { error: githubUrlResult.error };
  }

  return {
    githubId: profile.id ? String(profile.id) : null,
    githubUsername: githubUsernameResult.value,
    githubProfileUrl: githubUrlResult.value,
    githubAvatarUrl: avatarResult.value,
    githubEmail: primaryEmail || profile.email || null,
    avatarUrl: avatarResult.value,
    firstName: profile.name?.split(' ')[0] || null,
    lastName: profile.name?.split(' ').slice(1).join(' ') || null
  };
};

const resolvePrimaryEmail = (emails = [], profileEmail) => {
  const primary = emails.find((email) => email.primary && email.verified);
  if (primary?.email) {
    return primary.email;
  }
  const verified = emails.find((email) => email.verified);
  if (verified?.email) {
    return verified.email;
  }
  return profileEmail || null;
};

const ensureUniqueUsername = async (baseUsername) => {
  const trimmed = baseUsername?.trim() || '';
  const fallback = trimmed && trimmed.length >= 3 ? trimmed : 'githubuser';
  let candidate = fallback.slice(0, 50);
  let suffix = 0;
  let randomSuffix = null;

  while (await User.findOne({ where: { username: candidate } })) {
    suffix += 1;
    const suffixText = String(suffix);
    candidate = `${fallback.slice(0, 50 - suffixText.length)}${suffixText}`;
    if (suffix >= 6) {
      randomSuffix = randomSuffix || crypto.randomBytes(3).toString('hex');
      candidate = `${fallback.slice(0, 50 - randomSuffix.length)}${randomSuffix}`;
    }
  }

  return candidate;
};

const applyGithubProfileDefaults = (user, githubPayload) => {
  if (!user.firstName && githubPayload.firstName) {
    user.firstName = githubPayload.firstName;
  }
  if (!user.lastName && githubPayload.lastName) {
    user.lastName = githubPayload.lastName;
  }
  if (!user.avatarUrl && githubPayload.avatarUrl) {
    user.avatarUrl = githubPayload.avatarUrl;
  }
};

const serializeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  avatarUrl: user.avatarUrl,
  profileColor: user.profileColor,
  githubId: user.githubId,
  githubUsername: user.githubUsername,
  githubProfileUrl: user.githubProfileUrl,
  githubAvatarUrl: user.githubAvatarUrl,
  githubEmail: user.githubEmail
});

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
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) {
    return { error: 'Profile color must be a valid hex color.' };
  }
  return { value: normalized.toLowerCase() };
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

      // Validate locationId format if provided (should be a string code)
      if (locationId !== undefined && locationId !== null && typeof locationId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid location ID format. Location ID must be a string code.'
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
        avatarUrl: avatarResult.value === undefined ? null : avatarResult.value,
        profileColor: colorResult.value === undefined ? null : colorResult.value,
        locationId: locationId || null
      });

      // Generate JWT token
      const token = createAuthToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: {
          token,
          user: serializeUser(user)
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
      const token = createAuthToken(user);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: serializeUser(user)
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
        attributes: { exclude: ['password'] }
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
        // Validate locationId format if provided (should be a string code)
        if (locationId !== null && typeof locationId !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Invalid location ID format. Location ID must be a string code.'
          });
        }
        user.locationId = locationId;
      }

      await user.save();

      const updatedUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
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
  },
  // Start GitHub OAuth flow
  githubAuth: async (req, res) => {
    try {
      if (!ensureGithubConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'GitHub OAuth is not configured.'
        });
      }

      const state = createGithubState();
      const url = buildGithubAuthUrl(state);

      res.status(200).json({
        success: true,
        data: {
          url,
          state
        }
      });
    } catch (error) {
      console.error('GitHub auth start error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to start GitHub authentication.',
        error: error.message
      });
    }
  },

  // Handle GitHub OAuth callback
  githubCallback: async (req, res) => {
    try {
      if (!ensureGithubConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'GitHub OAuth is not configured.'
        });
      }

      const { code, state } = req.body;
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Authorization code is required.'
        });
      }

      if (!consumeGithubState(state)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OAuth state.'
        });
      }

      const accessToken = await fetchGithubAccessToken(code);
      const profile = await fetchGithubProfile(accessToken);
      const emails = await fetchGithubEmails(accessToken);
      const primaryEmail = resolvePrimaryEmail(emails, profile.email);
      const githubPayload = buildGithubUserPayload(profile, primaryEmail);

      if (githubPayload.error) {
        return res.status(400).json({
          success: false,
          message: githubPayload.error
        });
      }

  if (!githubPayload.githubId) {
    return res.status(400).json({
      success: false,
      message: 'GitHub account information is incomplete (missing GitHub id).'
    });
  }

      const existingGithubUser = await User.findOne({ where: { githubId: githubPayload.githubId } });

      if (req.user) {
        const user = await User.findByPk(req.user.id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.'
          });
        }

        if (existingGithubUser && existingGithubUser.id !== user.id) {
          return res.status(400).json({
            success: false,
            message: 'This GitHub account is already linked to another user.'
          });
        }

        user.githubId = githubPayload.githubId;
        user.githubUsername = githubPayload.githubUsername;
        user.githubProfileUrl = githubPayload.githubProfileUrl;
        user.githubAvatarUrl = githubPayload.githubAvatarUrl;
        user.githubEmail = githubPayload.githubEmail;
        applyGithubProfileDefaults(user, githubPayload);

        await user.save();

        const token = createAuthToken(user);

        return res.status(200).json({
          success: true,
          message: 'GitHub account connected successfully.',
          data: {
            token,
            user: serializeUser(user)
          }
        });
      }

      if (existingGithubUser) {
        const token = createAuthToken(existingGithubUser);
        return res.status(200).json({
          success: true,
          message: 'Login successful.',
          data: {
            token,
            user: serializeUser(existingGithubUser)
          }
        });
      }

      const usernameBase = githubPayload.githubUsername || primaryEmail?.split('@')[0];
      const username = await ensureUniqueUsername(usernameBase || 'githubuser');
      const email = primaryEmail || `github-${githubPayload.githubId}@users.noreply.github.com`;

      const user = await User.create({
        username,
        email,
        password: `oauth:${crypto.randomBytes(32).toString('hex')}`,
        role: 'viewer',
        firstName: githubPayload.firstName,
        lastName: githubPayload.lastName,
        avatarUrl: githubPayload.avatarUrl,
        githubId: githubPayload.githubId,
        githubUsername: githubPayload.githubUsername,
        githubProfileUrl: githubPayload.githubProfileUrl,
        githubAvatarUrl: githubPayload.githubAvatarUrl,
        githubEmail: githubPayload.githubEmail
      });

      const token = createAuthToken(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: {
          token,
          user: serializeUser(user)
        }
      });
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.status(500).json({
        success: false,
        message: 'GitHub authentication failed.',
        error: error.message
      });
    }
  }
};

module.exports = authController;
