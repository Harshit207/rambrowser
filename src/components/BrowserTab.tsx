import React, { useState } from 'react';
import { X, Plus, Globe, Lock, ArrowLeft, ArrowRight, RotateCcw, Search } from 'lucide-react';

export interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
}

interface BrowserTabProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  hasProfile: boolean;
}

export const BrowserTab: React.FC<BrowserTabProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onNewTab,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  hasProfile,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      let url = urlInput.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      onNavigate(url);
      setUrlInput('');
    }
  };

  React.useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex items-center gap-1 px-2 py-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-l border-r border-t transition whitespace-nowrap max-w-xs cursor-pointer ${
              activeTabId === tab.id
                ? 'bg-white border-gray-300 text-gray-900'
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm truncate">{tab.title || tab.url}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={onNewTab}
          className="ml-auto px-2 py-2 text-gray-600 hover:text-gray-900"
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div className="flex gap-1">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onForward}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow">
              {hasProfile && <Lock className="w-4 h-4 text-green-500" title="Profile loaded - cookies active" />}
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNavigate(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Enter URL or search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Go"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {!hasProfile && (
            <div className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded">
              ⚠️ No Profile
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
        {activeTab ? (
          <iframe
            key={activeTab.id}
            src={activeTab.url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-storage-access-by-user-activation"
            allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            title={activeTab.title || 'Browser Tab'}
          />
        ) : null}
      </div>
    </div>
  );
};
