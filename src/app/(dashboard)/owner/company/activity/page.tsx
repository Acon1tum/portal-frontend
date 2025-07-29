'use client';

import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamLog {
  id: number;
  memberName: string;
  action: string;
  timestamp: string;
  description: string;
}

const teamLogs: TeamLog[] = [
  {
    id: 1,
    memberName: 'Sarah Thompson',
    action: 'Created a new project',
    timestamp: '2025-05-01 10:30 AM',
    description: 'Sarah created the "AI Development" project.',
  },
  {
    id: 2,
    memberName: 'David Lee',
    action: 'Updated company profile',
    timestamp: '2025-05-02 02:15 PM',
    description: 'David updated the company address and contact details.',
  },
  {
    id: 3,
    memberName: 'Emily Chen',
    action: 'Added a new team member',
    timestamp: '2025-05-03 09:45 AM',
    description: 'Emily added "Michael Rodriguez" to the engineering team.',
  },
  {
    id: 4,
    memberName: 'Jessica Parker',
    action: 'Deleted a document',
    timestamp: '2025-05-04 11:20 AM',
    description: 'Jessica deleted the outdated "Marketing Strategy 2024" document.',
  },
];

const TeamLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState(teamLogs);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredLogs(
      teamLogs.filter(
        (log) =>
          log.memberName.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query)
      )
    );
  };

  // Handle download report as CSV
  const handleDownloadReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Team Member,Action,Timestamp,Description']
        .concat(
          filteredLogs.map(
            (log) =>
              `"${log.memberName}","${log.action}","${log.timestamp}","${log.description}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'team_activity_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Team Activity Logs</h1>
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border rounded-md focus:outline-none "
          />
        </div>

        {/* Download Report Button */}
        <Button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 "
          variant={'outline'}
        >
          <Download className="h-5 w-5" />
          Download Report
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Team Member
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Action
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b last:border-none hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                  {log.memberName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                  {log.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamLogs;