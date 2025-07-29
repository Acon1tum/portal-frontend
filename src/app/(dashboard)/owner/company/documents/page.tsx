'use client';

import React, { useState } from 'react';
import { Download, Trash, Search, Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: number;
  name: string;
  uploadDate: string;
  fileUrl: string;
}

const initialDocuments: Document[] = [
  {
    id: 1,
    name: 'Business License.pdf',
    uploadDate: '2025-01-15',
    fileUrl: '/documents/business-license.pdf',
  },
  {
    id: 2,
    name: 'Tax Registration.pdf',
    uploadDate: '2025-02-10',
    fileUrl: '/documents/tax-registration.pdf',
  },
  {
    id: 3,
    name: 'Employee Handbook.pdf',
    uploadDate: '2025-03-05',
    fileUrl: '/documents/employee-handbook.pdf',
  },
];

const CompanyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle document deletion
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (confirmDelete) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery)
  );

  const handleAddDocument = () => {
    const newDocument: Document = {
      id: documents.length + 1,
      name: `New Document ${documents.length + 1}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: `/documents/new-document-${documents.length + 1}.pdf`,
    };
    setDocuments([newDocument, ...documents]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Document Archive</h1>

      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <Search className="absolute h-5 left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border rounded-md focus:outline-none"
          />
        </div>

        {/* Add Document Button */}
        <Button
          onClick={handleAddDocument}
          className="flex items-center gap-2 px-4 py-2   rounded-md focus:outline-none "
        >
          <Upload className="h-5 w-5" />
          Add Document
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border rounded-lg shadow-sm "
          >
            <div className='flex items-center justify-between'>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Uploaded on: {doc.uploadDate}
                </p>
              </div>
              <div className='h-14 w-14 mb-4 flex justify-center   items-center border-2 rounded-full'>
                <File/>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <a
                href={doc.fileUrl}
                download
                className="text-blue-600 dark:text-blue-400"
              >
                <Button variant="ghost" className="flex items-center gap-2 border">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDocuments;