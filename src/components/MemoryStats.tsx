import React from 'react';
import { Activity, HardDrive, Zap } from 'lucide-react';
import { RAMData } from './useRAMData';

interface MemoryStatsProps {
  data: RAMData | null;
}

export const MemoryStats: React.FC<MemoryStatsProps> = ({ data }) => {
  if (!data) return <div className="text-gray-500">Loading...</div>;

  const usagePercent = (data.usedMemory / data.totalMemory) * 100;
  const usageColor =
    usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Memory */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-medium">Total Memory</h3>
          <HardDrive className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{data.totalMemory / 1024} GB</p>
        <p className="text-xs text-gray-500 mt-1">{data.totalMemory} MB</p>
      </div>

      {/* Used Memory */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-medium">Used Memory</h3>
          <Activity className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {(data.usedMemory / 1024).toFixed(1)} GB
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${usageColor}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{usagePercent.toFixed(1)}% used</p>
      </div>

      {/* Available Memory */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-medium">Available Memory</h3>
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {(data.availableMemory / 1024).toFixed(1)} GB
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {((data.availableMemory / data.totalMemory) * 100).toFixed(1)}% free
        </p>
      </div>
    </div>
  );
};
