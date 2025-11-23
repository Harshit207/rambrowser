import { useState } from 'react';
import { Shield } from 'lucide-react';
import { USBBrowser } from './components/USBBrowser';
import { ProfileViewer } from './components/ProfileViewer';
import { useRAMStorage } from './hooks/useRAMStorage';
import { UserProfile } from './types/profile';

function App() {
  const [view, setView] = useState<'browser' | 'profile'>('browser');
  const ramStorage = useRAMStorage();

  const handleProfileSelect = (profile: UserProfile) => {
    ramStorage.loadProfile(profile);
    setView('profile');
  };

  const handleBack = () => {
    if (ramStorage.isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to go back? Changes will be saved to RAM only and can be exported.'
      );
      if (!confirmed) return;
    }
    setView('browser');
  };

  const handleSave = () => {
    const profileToSave = ramStorage.getProfileToSave();
    if (profileToSave) {
      const blob = new Blob([JSON.stringify(profileToSave, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileToSave.username}_profile_backup.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('Profile exported. You can save this back to your USB drive.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">USB Profile Loader</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Load profiles from USB to RAM • Zero disk access • Save changes back to USB
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'browser' ? (
          <USBBrowser onProfileSelect={handleProfileSelect} />
        ) : (
          ramStorage.loadedProfile && (
            <ProfileViewer
              profile={ramStorage.loadedProfile}
              isDirty={ramStorage.isDirty}
              cookies={ramStorage.cookies}
              onBack={handleBack}
              onSave={handleSave}
              onClear={() => {
                if (window.confirm('Clear profile from RAM?')) {
                  ramStorage.clearRAM();
                  setView('browser');
                }
              }}
              onAddCookie={ramStorage.addCookie}
              onRemoveCookie={ramStorage.removeCookie}
            />
          )
        )}
      </main>

      {/* RAM Status Indicator */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
        <div className="text-xs font-semibold text-gray-700">RAM STORAGE STATUS</div>
        <div className="mt-2 space-y-1 text-xs text-gray-600">
          <div>Profile: {ramStorage.loadedProfile ? '✓ Loaded' : '✗ Empty'}</div>
          <div>Cookies: {ramStorage.cookies.length} in RAM</div>
          <div>Status: {ramStorage.isDirty ? '⚠️ Unsaved changes' : '✓ Synced'}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
