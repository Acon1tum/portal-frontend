"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WaveData {
  time: string;
  value: number;
}

export const MetricsWaveComponent = () => {
  const [data, setData] = useState<WaveData[]>([]);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData = [
      { time: "00:00", value: 400 },
      { time: "03:00", value: 300 },
      { time: "06:00", value: 600 },
      { time: "09:00", value: 800 },
      { time: "12:00", value: 500 },
      { time: "15:00", value: 700 },
      { time: "18:00", value: 900 },
      { time: "21:00", value: 600 },
    ];
    setData(mockData);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Daily Activity</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 