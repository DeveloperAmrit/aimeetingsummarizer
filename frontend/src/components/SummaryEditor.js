import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateSummary } from '../services/api';

const SummaryEditor = ({ summary, onSummaryEdited }) => {
  const [editedContent, setEditedContent] = useState(summary.content);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(editedContent !== summary.content);
  }, [editedContent, summary.content]);

  const handleSave = async () => {
    if (!hasChanges) {
      onSummaryEdited(editedContent);
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Saving changes...');

    try {
      await updateSummary(summary.id, editedContent);
      
      toast.success('Summary saved successfully!', { id: loadingToast });
      onSummaryEdited(editedContent);
      setHasChanges(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save changes', { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditedContent(summary.content);
    setHasChanges(false);
    toast.success('Changes reset to original');
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const formatContent = (content) => {
    // Simple formatting for display
    return content
      .split('\n')
      .map((line, index) => {
        // Make lines starting with ** bold
        if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
          return (
            <div key={index} className="font-semibold text-gray-900 mt-4 mb-2">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        // Handle bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
          return (
            <div key={index} className="ml-4 mb-1">
              {line}
            </div>
          );
        }
        // Regular lines
        return line.trim() ? (
          <div key={index} className="mb-2">
            {line}
          </div>
        ) : (
          <div key={index} className="mb-2"></div>
        );
      });
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ✏️ Review & Edit Summary
        </h2>
        <p className="text-gray-600">
          Review the AI-generated summary and make any necessary edits
        </p>
      </div>

      {/* Summary Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">📊 Summary Details</h3>
            <div className="text-sm text-gray-600 mt-1">
              Generated: {new Date(summary.createdDate).toLocaleDateString()} • 
              AI Provider: {summary.aiProvider?.toUpperCase() || 'N/A'} • 
              Words: {getWordCount(editedContent)}
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              📝 Edit Summary
            </label>
            <div className="text-xs text-gray-500">
              {getWordCount(editedContent)} words
            </div>
          </div>
          
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="Edit your summary here..."
          />

          {/* Formatting Tips */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Formatting Tips</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p>• Use **text** for section headers</p>
              <p>• Start lines with - or • for bullet points</p>
              <p>• Leave blank lines between sections</p>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            👁️ Live Preview
          </label>
          
          <div className="h-96 p-4 border border-gray-200 rounded-lg bg-white overflow-y-auto">
            <div className="summary-content text-sm text-gray-700 leading-relaxed">
              {formatContent(editedContent)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          🔄 Reset Changes
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : hasChanges ? (
            '💾 Save & Continue'
          ) : (
            '➡️ Continue to Share'
          )}
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          💡 Tip: Use Ctrl+S (Cmd+S on Mac) to save your changes quickly
        </p>
      </div>
    </div>
  );
};

export default SummaryEditor;
