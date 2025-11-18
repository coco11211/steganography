import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Music, Video, Moon, Sun, Info, History } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import ImageSteganography from './components/ImageSteganography';
import AudioSteganography from './components/AudioSteganography';
import VideoSteganography from './components/VideoSteganography';
import HistoryPanel from './components/HistoryPanel';
import AboutPanel from './components/AboutPanel';

type Tab = 'image' | 'audio' | 'video' | 'history' | 'about';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('image');
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'image' as Tab, label: 'Image', icon: Image },
    { id: 'audio' as Tab, label: 'Audio', icon: Music },
    { id: 'video' as Tab, label: 'Video', icon: Video },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'about' as Tab, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen p-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="feature-icon">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Steganography Studio
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional data hiding in multimedia files
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="glass-button-secondary p-3"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2 mt-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon className="w-5 h-5 inline-block mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.header>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'image' && <ImageSteganography />}
            {activeTab === 'audio' && <AudioSteganography />}
            {activeTab === 'video' && <VideoSteganography />}
            {activeTab === 'history' && <HistoryPanel />}
            {activeTab === 'about' && <AboutPanel />}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400"
        >
          <p>
            Steganography Studio v1.0.0 • Secure your messages with advanced LSB techniques
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
