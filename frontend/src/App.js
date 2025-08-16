import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import SummaryGenerator from './components/SummaryGenerator';
import SummaryEditor from './components/SummaryEditor';
import EmailSharer from './components/EmailSharer';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleFileUpload = (uploadedTranscript) => {
    setTranscript(uploadedTranscript);
    setCurrentStep(2);
  };

  const handleSummaryGenerated = (generatedSummary) => {
    setSummary(generatedSummary);
    setCurrentStep(3);
  };

  const handleSummaryEdited = (editedSummary) => {
    setSummary(prev => ({ ...prev, content: editedSummary }));
    setCurrentStep(4);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setTranscript(null);
    setSummary(null);
    setCustomPrompt('');
  };

  const goToStep = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 AI Meeting Summarizer
              </h1>
              <p className="text-gray-600 mt-1">
                Upload, summarize, and share your meeting notes with AI
              </p>
            </div>
            <button
              onClick={resetApp}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-8">
          {[
            { number: 1, title: 'Upload', desc: 'Upload transcript' },
            { number: 2, title: 'Generate', desc: 'Create summary' },
            { number: 3, title: 'Edit', desc: 'Review & edit' },
            { number: 4, title: 'Share', desc: 'Send via email' }
          ].map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center cursor-pointer ${
                  step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => goToStep(step.number)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.number === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.desc}</div>
                </div>
              </div>
              {index < 3 && (
                <div
                  className={`w-8 h-0.5 mx-4 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-sm border">
          {currentStep === 1 && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {currentStep === 2 && transcript && (
            <SummaryGenerator
              transcript={transcript}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              onSummaryGenerated={handleSummaryGenerated}
            />
          )}

          {currentStep === 3 && summary && (
            <SummaryEditor
              summary={summary}
              onSummaryEdited={handleSummaryEdited}
            />
          )}

          {currentStep === 4 && summary && (
            <EmailSharer
              summary={summary}
              transcript={transcript}
              onComplete={resetApp}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>AI Meeting Notes Summarizer & Sharer</p>
            <p className="mt-1">
              Built with React, Node.js, MongoDB, and OpenAI API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
