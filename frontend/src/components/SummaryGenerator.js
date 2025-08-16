import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { generateSummary } from '../services/api';

const SummaryGenerator = ({ transcript, customPrompt, setCustomPrompt, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('Generating AI summary...');

    try {
      const response = await generateSummary(transcript.id, customPrompt);
      
      toast.success('Summary generated successfully!', { id: loadingToast });
      onSummaryGenerated(response.summary);
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error(error.message || 'Failed to generate summary', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const truncateText = (text, maxLength = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const promptExamples = [
    "Summarize in bullet points for executives",
    "Highlight only action items and deadlines",
    "Focus on decisions made and next steps",
    "Create a brief overview for team members who missed the meeting",
    "Extract key insights and recommendations",
    "Summarize technical discussion points and solutions"
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🤖 Generate AI Summary
        </h2>
        <p className="text-gray-600">
          Customize your summary with specific instructions for the AI
        </p>
      </div>

      {/* File Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">📄 {transcript.filename}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Uploaded: {new Date(transcript.uploadDate).toLocaleDateString()} • 
              Size: {Math.round(transcript.fileSize / 1024)} KB • 
              Type: {transcript.fileType.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showPreview && (
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-sm text-gray-700 max-h-40 overflow-y-auto">
            {truncateText(transcript.content)}
          </div>
        )}
      </div>

      {/* Custom Prompt Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💬 Custom Instructions (Optional)
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter specific instructions for how you'd like the AI to summarize your meeting (e.g., 'Focus on action items', 'Bullet points for executives', etc.)"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
        />
        
        {/* Prompt Examples */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">💡 Example instructions:</p>
          <div className="flex flex-wrap gap-2">
            {promptExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setCustomPrompt(example)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Default Summary Format Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="font-medium text-blue-900 mb-2">📋 Default Summary Format</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>If no custom instructions are provided, the AI will create a summary with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Key Topics Discussed:</strong> Main subjects covered</li>
            <li><strong>Action Items:</strong> Tasks assigned with responsible parties</li>
            <li><strong>Decisions Made:</strong> Important conclusions or resolutions</li>
            <li><strong>Next Steps:</strong> Follow-up actions or future meetings</li>
          </ul>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="btn-primary px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Summary...</span>
            </div>
          ) : (
            '✨ Generate AI Summary'
          )}
        </button>
      </div>

      {/* AI Provider Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Powered by OpenAI GPT-3.5 with Groq fallback • 
          Processing typically takes 10-30 seconds
        </p>
      </div>
    </div>
  );
};

export default SummaryGenerator;
