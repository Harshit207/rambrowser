import React from 'react';
import { Monitor, RefreshCw } from 'lucide-react';
import { MemoryStats } from './MemoryStats';
import { ProcessList } from './ProcessList';
import { useRAMData } from './useRAMData';

export const RAMProfiler: React.FC = () => {
  const data = useRAMData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">RAM Profile Browser</h1>
          </div>
          <p className="text-gray-400 text-lg">Real-time memory usage monitoring and process tracking</p>
        </div>

        {/* Timestamp and Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <p className="text-sm">
              Last updated: {data ? data.timestamp.toLocaleTimeString() : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <MemoryStats data={data} />

        {/* Process List */}
        {data && <ProcessList processes={data.processes} />}
      </div>
    </div>
  );
};
