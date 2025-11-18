import React from 'react';
import { motion } from 'framer-motion';
import {
  Info, Shield, Zap, Eye, Lock, Image, Music, Video,
  CheckCircle, Github, Heart
} from 'lucide-react';

const AboutPanel: React.FC = () => {
  const features = [
    {
      icon: Image,
      title: 'Image Steganography',
      description: 'Hide messages in PNG, JPG, and BMP images using advanced LSB techniques',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Music,
      title: 'Audio Steganography',
      description: 'Embed data in WAV, MP3, and OGG audio files without audible changes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Video,
      title: 'Video Steganography',
      description: 'Hide information across video frames in MP4, WebM, and AVI files',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Lock,
      title: 'Password Protection',
      description: 'Secure your hidden messages with AES encryption',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Eye,
      title: 'Imperceptible',
      description: 'Changes are invisible to the human eye and ear',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Optimized algorithms for quick encoding and decoding',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const technologies = [
    'Electron - Cross-platform desktop app',
    'React - Modern UI framework',
    'TypeScript - Type-safe code',
    'Tailwind CSS - Beautiful styling',
    'Framer Motion - Smooth animations',
    'LSB Algorithm - Steganography technique',
    'AES Encryption - Secure messaging',
    'Web Audio API - Audio processing'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <div className="feature-icon mx-auto mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Steganography Studio
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Professional data hiding in multimedia files
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Version 1.0.0
        </p>
      </motion.div>

      {/* What is Steganography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">What is Steganography?</h2>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Steganography is the practice of concealing messages or information within other
          non-secret data. Unlike cryptography, which makes messages unreadable, steganography
          hides the very existence of the message. This application uses the LSB (Least Significant Bit)
          technique to embed data in the least significant bits of image pixels, audio samples,
          or video frames, making changes imperceptible to human senses.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass-card p-6 hover:scale-105 transition-transform"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Built With</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {technologies.map((tech, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">{tech}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How to Use */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Encoding (Hiding a Message)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>Select the media type (Image, Audio, or Video)</li>
              <li>Choose "Encode" mode</li>
              <li>Upload your cover file (the file to hide data in)</li>
              <li>Enter your secret message</li>
              <li>Optionally enable password protection</li>
              <li>Click "Encode Message" and download the result</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              Decoding (Extracting a Message)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>Select the media type</li>
              <li>Choose "Decode" mode</li>
              <li>Upload the file containing the hidden message</li>
              <li>Enter the password if the message was encrypted</li>
              <li>Click "Decode Message" to extract the hidden text</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
      >
        <h2 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-100">
          Important Notes
        </h2>
        <ul className="space-y-2 text-amber-800 dark:text-amber-200">
          <li>• Use PNG format for images to avoid lossy compression</li>
          <li>• WAV format is recommended for audio files</li>
          <li>• Video steganography is a demonstration feature</li>
          <li>• Always keep a backup of your original files</li>
          <li>• Password-protected messages require the exact password for decoding</li>
          <li>• Larger files can hide more data</li>
        </ul>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6 text-center"
      >
        <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for privacy enthusiasts
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Use responsibly and legally. For educational purposes.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPanel;
