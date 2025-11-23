import React, { useState } from 'react';
import { HardDrive, Upload, Lock, LogOut } from 'lucide-react';
import { UserProfile } from '../types/profile';

interface ProfileSelectorProps {
  loadedProfile: UserProfile | null;
  onProfileSelect: (profile: UserProfile) => void;
  onProfileUnload: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  loadedProfile,
  onProfileSelect,
  onProfileUnload,
}) => {
  const [profiles] = useState<UserProfile[]>([
    {
      id: 'profile-1',
      username: 'john_doe',
      email: 'john@gmail.com',
      createdAt: Date.now() - 86400000 * 30,
      lastModified: Date.now() - 86400000 * 2,
      cookies: [
        { name: 'session_id', value: 'session_abc123', domain: 'gmail.com', path: '/', httpOnly: true, secure: true },
        { name: 'logged_in', value: 'true', domain: 'github.com', path: '/', httpOnly: false, secure: true },
      ],
      settings: { theme: 'dark', language: 'en' },
      bookmarks: [
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'Gmail', url: 'https://gmail.com' },
      ],
    },
    {
      id: 'profile-2',
      username: 'jane_work',
      email: 'jane@company.com',
      createdAt: Date.now() - 86400000 * 60,
      lastModified: Date.now() - 86400000 * 5,
      cookies: [
        { name: 'auth_token', value: 'token_xyz789abc', domain: 'company.com', path: '/', httpOnly: true, secure: true },
        { name: 'workspace', value: 'eng_team', domain: 'company.com', path: '/', httpOnly: false, secure: true },
      ],
      settings: { theme: 'light', language: 'en' },
      bookmarks: [{ title: 'Jira', url: 'https://jira.company.com' }],
    },
  ]);

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">USB Profiles</h3>
        </div>
        <p className="text-xs text-gray-600 mb-2">Load a profile to activate logins & cookies in RAM</p>
        <p className="text-xs text-gray-500 italic">💡 Or browse without one, sign in on websites, then save as new profile</p>
      </div>

      {/* Current Profile */}
      {loadedProfile && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-900">{loadedProfile.username}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{loadedProfile.email}</p>
              <p className="text-xs text-green-600 font-semibold mt-2">✓ Active in RAM</p>
            </div>
            <button
              onClick={onProfileUnload}
              className="text-red-600 hover:text-red-700 p-1"
              title="Unload profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Available Profiles */}
      <div className="flex-1 overflow-y-auto">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onProfileSelect(profile)}
            disabled={loadedProfile?.id === profile.id}
            className="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <div className="font-semibold text-gray-900 text-sm">{profile.username}</div>
            <div className="text-xs text-gray-600 mt-1">{profile.email}</div>
            <div className="text-xs text-gray-500 mt-2">
              {profile.cookies.length} cookies • {new Date(profile.lastModified).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>

      {/* Upload */}
      <div className="border-t border-gray-200 p-3">
        <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 cursor-pointer transition">
          <Upload className="w-4 h-4" />
          Upload Profile
          <input type="file" accept=".json" className="hidden" />
        </label>
      </div>
    </div>
  );
};
