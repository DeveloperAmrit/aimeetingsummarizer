import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadFile } from '../services/api';

const FileUpload = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const allowedTypes = ['.txt', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Please select a .txt or .docx file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading file...');

    try {
      const response = await uploadFile(selectedFile);
      
      toast.success('File uploaded successfully!', { id: loadingToast });
      onFileUpload(response.transcript);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📄 Upload Meeting Transcript
        </h2>
        <p className="text-gray-600">
          Upload a .txt or .docx file containing your meeting notes or call transcript
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`file-upload-area border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 scale-105'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`text-6xl ${selectedFile ? 'text-green-500' : 'text-gray-400'}`}>
            {selectedFile ? '✅' : '📁'}
          </div>

          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-green-700">
                File Selected: {selectedFile.name}
              </p>
              <p className="text-sm text-gray-600">
                Size: {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-sm text-gray-600">
                Type: {selectedFile.name.split('.').pop().toUpperCase()}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Drag and drop your file here
              </p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-sm text-gray-400">
                Supported formats: .txt, .docx (max 50MB)
              </p>
            </div>
          )}

          <input
            type="file"
            accept=".txt,.docx"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-input"
          />
          
          <label
            htmlFor="file-input"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium"
          >
            Choose File
          </label>
        </div>
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <div className="mt-8 text-center">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn-primary px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              '🚀 Upload & Continue'
            )}
          </button>
        </div>
      )}

      {/* File Format Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Supported File Formats</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>.txt files:</strong> Plain text meeting notes or transcripts</li>
          <li>• <strong>.docx files:</strong> Microsoft Word documents with meeting content</li>
          <li>• <strong>File size limit:</strong> Maximum 50MB per file</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
