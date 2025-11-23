import { useState, useEffect } from 'react';

export interface MemoryProcess {
  id: string;
  name: string;
  pid: number;
  memory: number; // in MB
  percentOfTotal: number;
}

export interface RAMData {
  totalMemory: number; // in MB
  usedMemory: number; // in MB
  availableMemory: number; // in MB
  processes: MemoryProcess[];
  timestamp: Date;
}

// Simulated process data with realistic values
const generateProcesses = (usedMemory: number, totalMemory: number): MemoryProcess[] => {
  const processNames = [
    'Chrome',
    'Node.js',
    'Firefox',
    'Visual Studio Code',
    'Docker',
    'Slack',
    'Spotify',
    'PostgreSQL',
    'Redis',
    'Python',
  ];

  let allocated = 0;
  const processes: MemoryProcess[] = [];

  for (let i = 0; i < 8; i++) {
    const name = processNames[i % processNames.length];
    const maxMemory = Math.max(50, (usedMemory - allocated) / (8 - i));
    const memory = Math.random() * maxMemory * 0.7 + maxMemory * 0.3;
    allocated += memory;

    if (allocated <= usedMemory) {
      processes.push({
        id: `${name}-${i}`,
        name: `${name}`,
        pid: 1000 + i,
        memory: Math.round(memory),
        percentOfTotal: 0,
      });
    }
  }

  return processes
    .map((p) => ({
      ...p,
      percentOfTotal: Math.round((p.memory / totalMemory) * 100),
    }))
    .sort((a, b) => b.memory - a.memory);
};

export const useRAMData = () => {
  const [data, setData] = useState<RAMData | null>(null);

  useEffect(() => {
    const updateMemoryData = () => {
      const totalMemory = 16384; // 16GB
      const baseUsed = 6144 + Math.random() * 2048; // 6-8GB
      const usedMemory = baseUsed + Math.sin(Date.now() / 5000) * 1024; // Oscillate by 1GB

      const memData: RAMData = {
        totalMemory,
        usedMemory: Math.max(0, Math.min(totalMemory, usedMemory)),
        availableMemory: totalMemory - usedMemory,
        processes: generateProcesses(usedMemory, totalMemory),
        timestamp: new Date(),
      };

      setData(memData);
    };

    updateMemoryData();
    const interval = setInterval(updateMemoryData, 1000);

    return () => clearInterval(interval);
  }, []);

  return data;
};
