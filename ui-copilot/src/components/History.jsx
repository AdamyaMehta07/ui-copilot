import React from 'react';

export default function History({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📜</span>
          <h3 className="text-white font-semibold">Generation History</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No history yet</p>
          <p className="text-gray-500 text-xs mt-1">Your generated UIs will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📜</span>
          <h3 className="text-white font-semibold">History</h3>
        </div>
        <span className="text-xs text-gray-400">{history.length} items</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.code)}
            className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition group"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-purple-300 font-medium text-sm truncate">
                  {item.prompt}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition">
                <span className="text-xs text-purple-400">↗</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}