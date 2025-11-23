import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Trash2 } from 'lucide-react';
import { UserProfile, CookieData } from '../types/profile';

interface ProfileViewerProps {
  profile: UserProfile;
  isDirty: boolean;
  cookies: CookieData[];
  onBack: () => void;
  onSave: () => void;
  onClear: () => void;
  onAddCookie: (cookie: CookieData) => void;
  onRemoveCookie: (name: string) => void;
}

export const ProfileViewer: React.FC<ProfileViewerProps> = ({
  profile,
  isDirty,
  cookies,
  onBack,
  onSave,
  onClear,
  onAddCookie,
  onRemoveCookie,
}) => {
  const [newCookie, setNewCookie] = useState<Partial<CookieData>>({
    name: '',
    value: '',
    domain: '',
    path: '/',
    httpOnly: false,
    secure: true,
  });

  const handleAddCookie = () => {
    if (newCookie.name && newCookie.value && newCookie.domain) {
      onAddCookie({
        name: newCookie.name,
        value: newCookie.value,
        domain: newCookie.domain,
        path: newCookie.path || '/',
        httpOnly: newCookie.httpOnly || false,
        secure: newCookie.secure || true,
      });
      setNewCookie({ name: '', value: '', domain: '', path: '/', httpOnly: false, secure: true });
    }
  };

  const handleDownload = () => {
    const profileData = {
      ...profile,
      cookies,
      lastModified: Date.now(),
    };
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.username}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to USB Browser
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{profile.username}</h2>
            <p className="text-gray-600 mt-1">{profile.email}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span>Created: {new Date(profile.createdAt).toLocaleDateString()}</span>
              <span>Modified: {new Date(profile.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isDirty && (
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Save className="w-4 h-4" />
                Save to USB
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear RAM
            </button>
          </div>
        </div>
      </div>

      {/* Cookies Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Session Cookies (In RAM)</h3>
          <p className="text-sm text-gray-600 mb-4">
            All cookies are stored only in RAM. They will be cleared when you exit or unload the profile.
          </p>

          {/* Add New Cookie */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Add New Cookie</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Cookie name"
                value={newCookie.name || ''}
                onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Domain"
                value={newCookie.domain || ''}
                onChange={(e) => setNewCookie({ ...newCookie, domain: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="Cookie value"
              value={newCookie.value || ''}
              onChange={(e) => setNewCookie({ ...newCookie, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newCookie.httpOnly || false}
                  onChange={(e) => setNewCookie({ ...newCookie, httpOnly: e.target.checked })}
                />
                HttpOnly
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newCookie.secure !== false}
                  onChange={(e) => setNewCookie({ ...newCookie, secure: e.target.checked })}
                />
                Secure
              </label>
            </div>
            <button
              onClick={handleAddCookie}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
            >
              Add Cookie
            </button>
          </div>
        </div>

        {/* Cookies List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Flags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cookies.map((cookie) => (
                <tr key={cookie.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cookie.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{cookie.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{cookie.domain}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {cookie.httpOnly && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">HttpOnly</span>}
                      {cookie.secure && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Secure</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onRemoveCookie(cookie.name)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cookies.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <p>No cookies loaded yet. Add one above or load from the profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};
