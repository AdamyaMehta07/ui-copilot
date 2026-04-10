import React, { useState } from 'react';

export default function CodePreview({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-white font-semibold mb-2">No UI Generated Yet</h3>
        <p className="text-gray-400 text-sm">
          Type a prompt and click "Generate UI" to see magic happen!
        </p>
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
          <p className="text-purple-300 text-xs">
            💡 Try: "Create a login page" or "Make a pricing card"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live Preview */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">📱 Live Preview</span>
          <span className="text-xs text-gray-500">React + Tailwind</span>
        </div>
        <div className="p-4 min-h-[400px]">
          <iframe
            srcDoc={`
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <script src="https://cdn.tailwindcss.com"></script>
                  <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
                  <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
                  <style>
                    body { margin: 0; padding: 20px; background: white; font-family: system-ui, -apple-system, sans-serif; }
                    #root { width: 100%; }
                  </style>
                </head>
                <body>
                  <div id="root"></div>
                  <script>
                    try {
                      ${code.replace('export default', 'window.UIComponent =')}
                      const root = ReactDOM.createRoot(document.getElementById('root'));
                      root.render(React.createElement(window.UIComponent));
                    } catch(error) {
                      document.getElementById('root').innerHTML = 
                        '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
                    }
                  </script>
                </body>
              </html>
            `}
            className="w-full h-[400px] border-0 rounded"
            title="UI Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-300">💻 Generated Code</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <pre className="p-4 overflow-auto max-h-96">
          <code className="text-gray-300 text-xs font-mono whitespace-pre-wrap">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}