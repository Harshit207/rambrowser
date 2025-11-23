import React, { useState, useCallback } from 'react';
import { Shield, Download, Trash2 } from 'lucide-react';
import { BrowserTab, Tab } from './BrowserTab';
import { ProfileSelector } from './ProfileSelector';
import { UserProfile } from '../types/profile';

export const RAMBrowser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: 'https://google.com', title: 'Google', isLoading: false },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [loadedProfile, setLoadedProfile] = useState<UserProfile | null>(null);
  const [sessionCookies, setSessionCookies] = useState<Record<string, string>>({});

  const handleNewTab = useCallback(() => {
    const newId = String(Date.now());
    setTabs((prev) => [
      ...prev,
      { id: newId, url: 'https://google.com', title: 'New Tab', isLoading: false },
    ]);
    setActiveTabId(newId);
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      if (newTabs.length === 0) {
        const newTab: Tab = { id: '1', url: 'https://google.com', title: 'New Tab', isLoading: false };
        setActiveTabId('1');
        return [newTab];
      }
      if (activeTabId === tabId) {
        setActiveTabId(newTabs[0].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const handleNavigate = useCallback((url: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url, title: new URL(url).hostname, isLoading: false }
          : t
      )
    );
  }, [activeTabId]);

  const handleProfileSelect = (profile: UserProfile) => {
    setLoadedProfile(profile);
    const cookies: Record<string, string> = {};
    profile.cookies.forEach((cookie) => {
      cookies[cookie.name] = cookie.value;
    });
    setSessionCookies(cookies);
  };

  const handleProfileUnload = () => {
    setLoadedProfile(null);
    setSessionCookies({});
  };

  const handleExportSession = () => {
    const sessionData = {
      profile: loadedProfile,
      browsedSites: tabs.map((t) => t.url),
      sessionCookies,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser_session_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearRAM = () => {
    if (window.confirm('Clear all browser data from RAM? This cannot be undone.')) {
      setTabs([{ id: '1', url: 'https://google.com', title: 'New Tab', isLoading: false }]);
      setActiveTabId('1');
      setLoadedProfile(null);
      setSessionCookies({});
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Control Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <h1 className="text-lg font-bold text-white">RAM Browser</h1>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Zero Disk • Profile Protected</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSession}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
            title="Export session to USB"
          >
            <Download className="w-4 h-4" />
            Save Session
          </button>
          <button
            onClick={handleClearRAM}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
            title="Clear all data from RAM"
          >
            <Trash2 className="w-4 h-4" />
            Clear RAM
          </button>
        </div>
      </div>

      {/* Browser */}
      <div className="flex-1 overflow-hidden">
        <BrowserTab
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          onTabClose={handleTabClose}
          onNewTab={handleNewTab}
          onNavigate={handleNavigate}
          onBack={() => {}}
          onForward={() => {}}
          onRefresh={() => {}}
          hasProfile={!!loadedProfile}
        />
      </div>

      {/* Profile Selector */}
      <ProfileSelector
        loadedProfile={loadedProfile}
        onProfileSelect={handleProfileSelect}
        onProfileUnload={handleProfileUnload}
      />
    </div>
  );
};
