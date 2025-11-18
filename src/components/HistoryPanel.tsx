import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Image, Music, Video, Lock, Unlock, Trash2, Download } from 'lucide-react';
import { formatBytes } from '../utils/fileUtils';

interface HistoryEntry {
  type: 'encode' | 'decode';
  mediaType: 'image' | 'audio' | 'video';
  filename: string;
  messageLength: number;
  encrypted: boolean;
  timestamp: number;
}

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'video'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('steganography_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('steganography_history');
      setHistory([]);
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steganography-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(entry => entry.mediaType === filter);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'audio': return Music;
      case 'video': return Video;
      default: return Image;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="feature-icon">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Operation History</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {history.length} operations recorded
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportHistory}
              disabled={history.length === 0}
              className="glass-button-secondary disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2 inline-block" />
              Export
            </button>
            <button
              onClick={clearHistory}
              disabled={history.length === 0}
              className="glass-button-secondary disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2 inline-block" />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'image', 'audio', 'video'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* History List */}
      <div className="grid gap-4">
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <History className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold mb-2">No history yet</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your steganography operations will appear here
            </p>
          </motion.div>
        ) : (
          filteredHistory.map((entry, index) => {
            const MediaIcon = getMediaIcon(entry.mediaType);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    entry.type === 'encode'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                    <MediaIcon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{entry.filename}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`status-badge ${
                          entry.type === 'encode' ? 'status-success' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                          {entry.type === 'encode' ? (
                            <>
                              <Lock className="w-3 h-3" />
                              Encoded
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              Decoded
                            </>
                          )}
                        </span>

                        {entry.encrypted && (
                          <span className="status-badge status-warning">
                            <Lock className="w-3 h-3" />
                            Encrypted
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Type: </span>
                        <span className="font-semibold">{entry.mediaType}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Message: </span>
                        <span className="font-semibold">{formatBytes(entry.messageLength)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
