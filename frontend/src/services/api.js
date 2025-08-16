import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 seconds timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// File upload function
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('transcript', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minutes for large file uploads
  });

  return response.data;
};

// Generate summary function
export const generateSummary = async (transcriptId, customPrompt = '') => {
  const response = await api.post('/summarize', {
    transcriptId,
    customPrompt,
  }, {
    timeout: 120000, // 2 minutes for AI processing
  });

  return response.data;
};

// Update summary function
export const updateSummary = async (summaryId, editedSummary) => {
  const response = await api.put(`/summary/${summaryId}`, {
    editedSummary,
  });

  return response.data;
};

// Share summary function
export const shareSummary = async (summaryId, recipients, subject, message = '') => {
  const response = await api.post('/share', {
    summaryId,
    recipients,
    subject,
    message,
  });

  return response.data;
};

// Get transcript by ID
export const getTranscript = async (transcriptId) => {
  const response = await api.get(`/transcript/${transcriptId}`);
  return response.data;
};

// Get summary by ID
export const getSummary = async (summaryId) => {
  const response = await api.get(`/summary/${summaryId}`);
  return response.data;
};

// Get all transcripts
export const getTranscripts = async () => {
  const response = await api.get('/transcripts');
  return response.data;
};

// Test email configuration
export const testEmailConfig = async () => {
  const response = await api.get('/test-email');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
