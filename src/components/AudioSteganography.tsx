import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Download, Lock, Unlock, Eye, EyeOff,
  AlertCircle, CheckCircle, Music,
  FileAudio, Trash2, Play, Pause
} from 'lucide-react';
import { audioSteganography } from '../utils/audioSteganography';
import { readFileAsArrayBuffer, downloadFile, formatBytes, loadAudioBuffer } from '../utils/fileUtils';

type Mode = 'encode' | 'decode';

const AudioSteganography: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<ArrayBuffer | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));

    if (audioFile) {
      await handleFileSelect(audioFile);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setResult(null);
    setSelectedFile(file);

    // Create audio element for preview
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
    audioRef.current = audio;

    // Calculate capacity for encode mode
    if (mode === 'encode') {
      try {
        const audioBuffer = await loadAudioBuffer(file);
        const cap = audioSteganography.calculateCapacity(audioBuffer);
        setCapacity(cap);
      } catch (error) {
        setResult({ type: 'error', message: 'Failed to load audio file' });
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleEncode = async () => {
    if (!selectedFile || !message) {
      setResult({ type: 'error', message: 'Please select an audio file and enter a message' });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const audioBuffer = await loadAudioBuffer(selectedFile);

      const result = await audioSteganography.encode(audioBuffer, {
        message,
        password: usePassword ? password : undefined
      });

      if (result.success && result.data) {
        processedAudioRef.current = result.data as ArrayBuffer;

        setResult({
          type: 'success',
          message: `Message successfully hidden! Capacity used: ${formatBytes(message.length)} / ${formatBytes(result.capacity || 0)}`
        });

        // Save to history
        saveToHistory({
          type: 'encode',
          mediaType: 'audio',
          filename: selectedFile.name,
          messageLength: message.length,
          encrypted: usePassword,
          timestamp: Date.now()
        });
      } else {
        setResult({ type: 'error', message: result.error || 'Encoding failed' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred during encoding' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!selectedFile) {
      setResult({ type: 'error', message: 'Please select an audio file' });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const audioBuffer = await loadAudioBuffer(selectedFile);

      const result = await audioSteganography.decode(audioBuffer, {
        password: usePassword ? password : undefined
      });

      if (result.success) {
        setMessage(result.data as string || '');
        setResult({ type: 'success', message: 'Message successfully extracted!' });

        // Save to history
        saveToHistory({
          type: 'decode',
          mediaType: 'audio',
          filename: selectedFile.name,
          messageLength: (result.data as string)?.length || 0,
          encrypted: usePassword,
          timestamp: Date.now()
        });
      } else {
        setResult({ type: 'error', message: result.error || 'Decoding failed' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred during decoding' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedAudioRef.current) return;

    const blob = new Blob([processedAudioRef.current], { type: 'audio/wav' });
    const filename = selectedFile?.name.replace(/\.[^/.]+$/, '_encoded.wav') || 'encoded.wav';
    downloadFile(blob, filename);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const saveToHistory = (entry: any) => {
    const history = JSON.parse(localStorage.getItem('steganography_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('steganography_history', JSON.stringify(history.slice(0, 50)));
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMessage('');
    setPassword('');
    setResult(null);
    setCapacity(null);
    setDuration(null);
    setIsPlaying(false);
    processedAudioRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Music className="w-6 h-6 text-primary-600" />
            Audio Steganography
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => { setMode('encode'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'encode' ? 'glass-button' : 'glass-button-secondary'
              }`}
            >
              <Lock className="w-5 h-5 inline-block mr-2" />
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'decode' ? 'glass-button' : 'glass-button-secondary'
              }`}
            >
              <Unlock className="w-5 h-5 inline-block mr-2" />
              Decode
            </button>
          </div>
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Select Audio File</h3>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`drop-zone ${dragActive ? 'active' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="text-center">
              <FileAudio className="w-16 h-16 mx-auto mb-4 text-primary-500" />
              <p className="text-lg font-semibold mb-2">
                {selectedFile ? selectedFile.name : 'Drop audio here or click to browse'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supports WAV, MP3, OGG
              </p>
            </div>
          </div>

          {selectedFile && (
            <button
              onClick={resetForm}
              className="mt-4 w-full glass-button-secondary"
            >
              <Trash2 className="w-4 h-4 inline-block mr-2" />
              Clear
            </button>
          )}
        </motion.div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">
            {mode === 'encode' ? 'Message to Hide' : 'Extracted Message'}
          </h3>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter your secret message here...' : 'Decoded message will appear here...'}
            className="textarea-field"
            readOnly={mode === 'decode'}
          />

          {mode === 'encode' && capacity && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Capacity: {formatBytes(message.length)} / {formatBytes(capacity)}
            </div>
          )}
        </motion.div>

        {/* Password Protection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Password Protection</h3>
            <button
              onClick={() => setUsePassword(!usePassword)}
              className={`px-4 py-2 rounded-lg transition-all ${
                usePassword
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {usePassword ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {usePassword && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <button
            onClick={mode === 'encode' ? handleEncode : handleDecode}
            disabled={processing || !selectedFile || (mode === 'encode' && !message)}
            className="flex-1 glass-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                Processing...
              </>
            ) : mode === 'encode' ? (
              <>
                <Upload className="w-5 h-5 inline-block mr-2" />
                Encode Message
              </>
            ) : (
              <>
                <Download className="w-5 h-5 inline-block mr-2" />
                Decode Message
              </>
            )}
          </button>

          {mode === 'encode' && processedAudioRef.current && (
            <button
              onClick={handleDownload}
              className="glass-button-secondary"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Result Message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-4 flex items-start gap-3 ${
              result.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            {result.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={result.type === 'success' ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}>
              {result.message}
            </p>
          </motion.div>
        )}
      </div>

      {/* Right Panel - Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 sticky top-6"
      >
        <h3 className="font-semibold mb-4">Audio Preview</h3>

        {selectedFile ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-8 text-white">
              <Music className="w-24 h-24 mx-auto mb-4 opacity-80" />
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">{selectedFile.name}</p>
                {duration && (
                  <p className="text-sm opacity-80">Duration: {formatTime(duration)}</p>
                )}
              </div>
            </div>

            <button
              onClick={togglePlayPause}
              className="w-full glass-button"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 inline-block mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 inline-block mr-2" />
                  Play
                </>
              )}
            </button>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">File Size:</span>
                <span className="font-semibold">{formatBytes(selectedFile.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Type:</span>
                <span className="font-semibold">{selectedFile.type}</span>
              </div>
              {capacity && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Message Capacity:</span>
                  <span className="font-semibold">{formatBytes(capacity)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Music className="w-16 h-16 mx-auto mb-2" />
              <p>No audio file selected</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AudioSteganography;
