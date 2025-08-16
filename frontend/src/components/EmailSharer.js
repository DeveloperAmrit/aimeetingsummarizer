import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { shareSummary } from '../services/api';

const EmailSharer = ({ summary, transcript, onComplete }) => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState(`Meeting Summary: ${transcript.filename}`);
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const parseEmails = (emailString) => {
    return emailString
      .split(/[,;\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleShare = async () => {
    const emailList = parseEmails(recipients);
    
    if (emailList.length === 0) {
      toast.error('Please enter at least one email address');
      return;
    }

    const invalidEmails = emailList.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }

    setIsSharing(true);
    const loadingToast = toast.loading(`Sending to ${emailList.length} recipient(s)...`);

    try {
      await shareSummary(summary.id, emailList, subject, message);
      
      toast.success(
        `Summary shared successfully with ${emailList.length} recipient(s)!`, 
        { id: loadingToast, duration: 5000 }
      );
      
      // Optional: Show completion options
      setTimeout(() => {
        if (window.confirm('Would you like to start over with a new transcript?')) {
          onComplete();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Share error:', error);
      toast.error(error.message || 'Failed to share summary', { id: loadingToast });
    } finally {
      setIsSharing(false);
    }
  };

  const addSampleRecipient = () => {
    const samples = ['colleague@company.com', 'team@company.com', 'manager@company.com'];
    const currentEmails = parseEmails(recipients);
    const availableSamples = samples.filter(sample => !currentEmails.includes(sample));
    
    if (availableSamples.length > 0) {
      const newEmail = availableSamples[0];
      setRecipients(prev => prev ? `${prev}, ${newEmail}` : newEmail);
    }
  };

  const recipientList = parseEmails(recipients);
  const validEmails = recipientList.filter(validateEmail);
  const invalidEmails = recipientList.filter(email => !validateEmail(email));

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📧 Share via Email
        </h2>
        <p className="text-gray-600">
          Send the meeting summary to team members and stakeholders
        </p>
      </div>

      {/* Summary Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">📄 Summary to Share</h3>
          <div className="text-sm text-gray-600">
            {summary.content.trim().split(/\s+/).length} words
          </div>
        </div>
        <div className="max-h-40 overflow-y-auto text-sm text-gray-700 bg-white p-3 rounded border">
          {summary.content.substring(0, 300)}
          {summary.content.length > 300 && '...'}
        </div>
      </div>

      <div className="space-y-6">
        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👥 Recipients *
          </label>
          <div className="space-y-2">
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Enter email addresses separated by commas, semicolons, or spaces&#10;e.g., john@company.com, sarah@company.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={addSampleRecipient}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add sample email
              </button>
              
              {recipientList.length > 0 && (
                <div className="text-sm text-gray-600">
                  {validEmails.length} valid email(s)
                  {invalidEmails.length > 0 && (
                    <span className="text-red-600 ml-1">
                      • {invalidEmails.length} invalid
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email Validation Display */}
          {recipientList.length > 0 && (
            <div className="mt-3 space-y-2">
              {validEmails.length > 0 && (
                <div>
                  <p className="text-xs text-green-700 font-medium mb-1">✅ Valid emails:</p>
                  <div className="flex flex-wrap gap-1">
                    {validEmails.map((email, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {invalidEmails.length > 0 && (
                <div>
                  <p className="text-xs text-red-700 font-medium mb-1">❌ Invalid emails:</p>
                  <div className="flex flex-wrap gap-1">
                    {invalidEmails.map((email, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📋 Email Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Meeting Summary: [Meeting Title]"
          />
        </div>

        {/* Personal Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💬 Personal Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message that will appear at the top of the email (e.g., 'Please review the action items from today's meeting...')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          />
        </div>
      </div>

      {/* Email Preview Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📧 Email Preview</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Subject:</strong> {subject || '[No subject]'}</p>
          <p><strong>Recipients:</strong> {validEmails.length} recipient(s)</p>
          <p><strong>Content includes:</strong> Summary, meeting details, and professional formatting</p>
          {message && <p><strong>Personal message:</strong> Included at the top</p>}
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleShare}
          disabled={isSharing || validEmails.length === 0 || !subject.trim()}
          className="btn-primary px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all"
        >
          {isSharing ? (
            <div className="flex items-center space-x-2">
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending emails...</span>
            </div>
          ) : (
            `📤 Send to ${validEmails.length} recipient${validEmails.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>

      {/* Email Service Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Emails are sent via secure SMTP • Recipients will see a professionally formatted summary
        </p>
      </div>

      {/* Alternative Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onComplete}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          🔄 Start Over
        </button>
      </div>
    </div>
  );
};

export default EmailSharer;
