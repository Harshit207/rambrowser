import React, { useState } from 'react';
import { HardDrive, Upload, Folder, File } from 'lucide-react';
import { UserProfile } from '../types/profile';

interface USBBrowserProps {
  onProfileSelect: (profile: UserProfile) => void;
}

export const USBBrowser: React.FC<USBBrowserProps> = ({ onProfileSelect }) => {
  const [usbProfiles, setUsbProfiles] = useState<UserProfile[]>([
    {
      id: 'profile-1',
      username: 'john_doe',
      email: 'john@example.com',
      createdAt: Date.now() - 86400000 * 30,
      lastModified: Date.now() - 86400000 * 2,
      cookies: [
        { name: 'session_id', value: 'abc123xyz', domain: 'example.com', path: '/', httpOnly: true, secure: true },
        { name: 'preferences', value: 'theme=dark', domain: 'example.com', path: '/', httpOnly: false, secure: true },
      ],
      settings: { theme: 'dark', language: 'en', notifications: true },
      bookmarks: [
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
      ],
    },
    {
      id: 'profile-2',
      username: 'jane_smith',
      email: 'jane@example.com',
      createdAt: Date.now() - 86400000 * 60,
      lastModified: Date.now() - 86400000 * 5,
      cookies: [
        { name: 'auth_token', value: 'token_xyz789', domain: 'work.com', path: '/', httpOnly: true, secure: true },
      ],
      settings: { theme: 'light', language: 'en', notifications: false },
      bookmarks: [{ title: 'Jira', url: 'https://jira.work.com' }],
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const profile = JSON.parse(e.target?.result as string);
          if (profile.username && profile.email) {
            setUsbProfiles((prev) => [...prev, profile]);
          }
        } catch (err) {
          console.error('Failed to parse profile:', err);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">USB Profile Browser</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Profiles stored on USB will be loaded entirely into RAM. No data touches the disk until you save.
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
          <Upload className="w-4 h-4" />
          Load Profile from USB
          <input
            type="file"
            multiple
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="p-6">
        {usbProfiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No profiles found on USB</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usbProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => onProfileSelect(profile)}
                className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
              >
                <div className="flex items-start gap-3">
                  <File className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{profile.username}</h3>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {profile.cookies.length} cookies
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {new Date(profile.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
