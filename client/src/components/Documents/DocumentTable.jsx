import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, HardDrive, Search, Trash2, RefreshCw } from 'lucide-react';

const DocumentTable = ({ onRefresh }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { fileAPI } = await import('../services/api');
      const response = await fileAPI.getFiles({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder
      });
      
      setDocuments(response.data.files);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename, originalName) => {
    try {
      const { fileAPI } = await import('../services/api');
      fileAPI.downloadFile(filename);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const { fileAPI } = await import('../services/api');
      await fileAPI.deleteFile(fileId);
      fetchDocuments(); // Refresh the list
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mr-3" />
          <span className="text-gray-600">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Livvic, sans-serif' }}>
          Document Library
        </h2>
        <button
          onClick={fetchDocuments}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Documents Table */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">
            {searchTerm ? 'No documents found' : 'No documents uploaded yet'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    <button
                      onClick={() => handleSort('originalName')}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      style={{ fontFamily: 'Livvic, sans-serif' }}
                    >
                      <span>File Name</span>
                      <span className="text-sm text-blue-500">{getSortIcon('originalName')}</span>
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    <button
                      onClick={() => handleSort('fileSize')}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      style={{ fontFamily: 'Livvic, sans-serif' }}
                    >
                      <span>Size</span>
                      <span className="text-sm text-blue-500">{getSortIcon('fileSize')}</span>
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      style={{ fontFamily: 'Livvic, sans-serif' }}
                    >
                      <span>Date</span>
                      <span className="text-sm text-blue-500">{getSortIcon('createdAt')}</span>
                    </button>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate text-lg" style={{ fontFamily: 'Livvic, sans-serif' }}>
                            {document.originalName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-gray-800 text-base" style={{ fontFamily: 'Livvic, sans-serif' }}>
                          {formatFileSize(document.fileSize)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-700" style={{ fontFamily: 'Livvic, sans-serif' }}>
                          {formatDate(document.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleDownload(document.filename, document.originalName)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          title="Download"
                          style={{ fontFamily: 'Livvic, sans-serif' }}
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleDelete(document._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentTable;
