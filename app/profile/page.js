'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import LocationSelector from '@/components/LocationSelector';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const normalizeProfileColorInput = (value) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }
  const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) {
    return null;
  }
  return normalized.toLowerCase();
};

function ProfilePageContent() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    locationId: null,
    avatarUrl: '',
    profileColor: '',
    githubUsername: '',
    githubProfileUrl: '',
    githubEmail: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          const {
            username,
            firstName,
            lastName,
            locationId,
            avatarUrl,
            profileColor,
            githubAvatarUrl,
            githubUsername,
            githubProfileUrl,
            githubEmail
          } = response.data.user;
          setProfileData({
            username: username || '',
            firstName: firstName || '',
            lastName: lastName || '',
            locationId: locationId || null,
            avatarUrl: avatarUrl || githubAvatarUrl || '',
            profileColor: profileColor || '',
            githubUsername: githubUsername || '',
            githubProfileUrl: githubProfileUrl || '',
            githubEmail: githubEmail || ''
          });
        }
      } catch (error) {
        setProfileError(error.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorPickerChange = (event) => {
    const { value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      profileColor: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');

    const normalizedProfileColor = normalizeProfileColorInput(profileData.profileColor);
    if (normalizedProfileColor === null) {
      setProfileError('Profile color must be a valid hex value.');
      return;
    }

    try {
      const response = await updateProfile({
        ...profileData,
        profileColor: normalizedProfileColor
      });
      const updatedUser = response?.data?.user;
      if (updatedUser) {
        setProfileData({
          username: updatedUser.username || '',
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          locationId: updatedUser.locationId || null,
          avatarUrl: updatedUser.avatarUrl || updatedUser.githubAvatarUrl || '',
          profileColor: updatedUser.profileColor || '',
          githubUsername: updatedUser.githubUsername || '',
          githubProfileUrl: updatedUser.githubProfileUrl || '',
          githubEmail: updatedUser.githubEmail || ''
        });
      }
      setProfileMessage('Profile updated successfully.');
    } catch (error) {
      setProfileError(error.message || 'Failed to update profile.');
    }
  };

  const handleGithubConnect = async () => {
    setProfileError('');
    setProfileMessage('');
    setGithubLoading(true);

    try {
      const response = await authAPI.githubAuth();
      const authUrl = response?.data?.url;
      const state = response?.data?.state;
      if (authUrl && state) {
        sessionStorage.setItem('github_oauth_state', state);
        window.location.href = authUrl;
      } else {
        throw new Error('Unable to start GitHub connection.');
      }
    } catch (error) {
      setProfileError(error.message || 'Failed to connect GitHub account.');
      setGithubLoading(false);
    }
  };


  const resetPasswordData = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage('Password updated successfully.');
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password.');
    } finally {
      resetPasswordData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const displayName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ');
  const avatarLabel = displayName || profileData.username || 'User';
  const avatarInitials = avatarLabel
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part && part[0] ? part[0].toUpperCase() : ''))
    .join('');
  const normalizedProfileColor = normalizeProfileColorInput(profileData.profileColor);
  const avatarColor = normalizedProfileColor || '#94a3b8';
  const colorPickerValue = normalizedProfileColor || '#94a3b8';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-full border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: avatarColor }}
              >
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={`${avatarLabel} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-white">
                    {avatarInitials || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                {displayName && <p className="text-sm text-gray-600">{displayName}</p>}
                <p className="text-sm text-gray-500">Signed in as {user?.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Update profile information</h2>
          {profileError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {profileError}
            </div>
          )}
          {profileMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {profileMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={profileData.username}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={profileData.avatarUrl}
                onChange={handleProfileChange}
                placeholder="https://example.com/avatar.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add a photo URL to personalize your profile (optional).
              </p>
            </div>
            <div>
              <label htmlFor="profileColor" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Color
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id="profileColorPicker"
                  type="color"
                  value={colorPickerValue}
                  onChange={handleColorPickerChange}
                  className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                />
                <input
                  id="profileColor"
                  name="profileColor"
                  type="text"
                  value={profileData.profileColor}
                  onChange={handleProfileChange}
                  placeholder="#94a3b8"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Pick an accent color to show with your avatar (optional).
              </p>
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <LocationSelector
                selectedLocationId={profileData.locationId}
                onLocationChange={(locationId) => setProfileData((prev) => ({ ...prev, locationId }))}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">GitHub</h3>
              {(profileData.githubUsername || user?.githubUsername) ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Connected as{' '}
                      <a
                        href={profileData.githubProfileUrl || user?.githubProfileUrl || '#'}
                        className="text-blue-600 hover:text-blue-700"
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{profileData.githubUsername || user?.githubUsername}
                      </a>
                    </p>
                    {(profileData.githubEmail || user?.githubEmail) && (
                      <p className="text-xs text-gray-500">GitHub email: {profileData.githubEmail || user?.githubEmail}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGithubConnect}
                    disabled={githubLoading}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {githubLoading ? 'Updating...' : 'Refresh GitHub data'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGithubConnect}
                  disabled={githubLoading}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                >
                  {githubLoading ? 'Connecting...' : 'Connect GitHub account'}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save changes
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change password</h2>
          {passwordError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {passwordError}
            </div>
          )}
          {passwordMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {passwordMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'moderator', 'editor', 'viewer']}>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
