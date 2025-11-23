import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { MemoryProcess } from './useRAMData';

interface ProcessListProps {
  processes: MemoryProcess[];
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
  const [sortBy, setSortBy] = useState<'memory' | 'name'>('memory');
  const [filter, setFilter] = useState('');

  const sortedProcesses = [...processes]
    .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'memory') return b.memory - a.memory;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Running Processes</h2>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter processes..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'memory' | 'name')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="memory">Sort by Memory</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Process Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                PID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Memory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                % of Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Usage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProcesses.map((process) => (
              <tr key={process.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{process.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{process.pid}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{process.memory} MB</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{process.percentOfTotal}%</span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        process.percentOfTotal > 10
                          ? 'bg-red-500'
                          : process.percentOfTotal > 5
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, process.percentOfTotal * 10)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedProcesses.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <p>No processes found matching your filter.</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {sortedProcesses.length} of {processes.length} processes
        </p>
      </div>
    </div>
  );
};
