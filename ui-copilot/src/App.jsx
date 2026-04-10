import React, { useState, useEffect } from 'react';
import { generateUI } from './lib/gemini';
import { useDailyLimit } from './hooks/useDailyLimit';
import LoginSignup from './components/LoginSignup';
import CodePreview from './components/CodePreview';
import History from './components/History';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const { remaining, canGenerate, incrementUsage } = useDailyLimit();
  const [history, setHistory] = useState([]);

  // Load saved data on mount
  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('ui_copilot_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.isLoggedIn) {
        setIsLoggedIn(true);
        setUser(userData);
      }
    }

    // Load history
    const savedHistory = localStorage.getItem('ui_copilot_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('ui_copilot_history', JSON.stringify(history));
    }
  }, [history]);

  const saveToHistory = (promptText, code) => {
    const newHistoryItem = {
      id: Date.now(),
      prompt: promptText,
      code: code,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20 items
    setHistory(updatedHistory);
  };

  const handleGenerate = async () => {
    // Validation
    if (!prompt.trim()) {
      setError('Please enter a prompt!');
      return;
    }

    if (!canGenerate) {
      setError(`Daily limit reached! You have ${remaining} generation${remaining === 1 ? '' : 's'} left today.`);
      return;
    }

    // Clear previous error and start loading
    setError('');
    setLoading(true);

    try {
      const code = await generateUI(prompt);
      setGeneratedCode(code);
      incrementUsage();
      saveToHistory(prompt, code);
    } catch (err) {
      setError(err.message || 'Failed to generate UI. Please check your API key.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ui_copilot_user');
    setIsLoggedIn(false);
    setUser(null);
    setGeneratedCode('');
    setPrompt('');
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginSignup onLogin={(userData) => {
      setIsLoggedIn(true);
      setUser(userData);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ UI Copilot AI
              </h1>
              <p className="text-gray-400 text-sm mt-1 hidden md:block">
                Generate React components with AI
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Daily Limit Badge */}
              <div className="px-3 py-1.5 bg-gray-800 rounded-full">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="ml-1 text-white text-sm font-medium">
                  {remaining}/5
                </span>
              </div>
              
              {/* User Info */}
              {user && (
                <div className="hidden md:block text-right">
                  <p className="text-white text-sm font-medium">{user.email}</p>
                  <p className="text-gray-400 text-xs">Active</p>
                </div>
              )}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input & History */}
          <div className="space-y-6">
            {/* Input Card */}
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span>🎨</span> What should I create?
              </h2>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example prompts:&#10;• Create a modern login page with email and password fields&#10;• Make a pricing card with 3 tiers: Basic, Pro, Enterprise&#10;• Design a dashboard with 4 stats cards&#10;• Create a contact form with name, email, and message"
                className="w-full h-32 px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none resize-none placeholder-gray-500"
                disabled={loading}
              />
              
              {error && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleGenerate}
                disabled={loading || !canGenerate}
                className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating UI...
                  </span>
                ) : (
                  `🚀 Generate UI ${!canGenerate ? '(Limit Reached)' : `(${remaining} left)`}`
                )}
              </button>
            </div>

            {/* History Component */}
            <History history={history} onSelect={(code) => setGeneratedCode(code)} />
          </div>

          {/* Right Column - Preview */}
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span>👁️</span> Live Preview
            </h2>
            <CodePreview code={generatedCode} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;