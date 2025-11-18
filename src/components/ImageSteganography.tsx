import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Download, Lock, Unlock, Eye, EyeOff,
  AlertCircle, CheckCircle, Image as ImageIcon,
  FileImage, Trash2
} from 'lucide-react';
import { imageSteganography } from '../utils/imageSteganography';
import { readFileAsDataURL, loadImage, imageToCanvas, canvasToBlob, downloadFile, formatBytes } from '../utils/fileUtils';

type Mode = 'encode' | 'decode';

const ImageSteganography: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      await handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setResult(null);
    setSelectedFile(file);

    const dataUrl = await readFileAsDataURL(file);
    setPreviewUrl(dataUrl);

    // Calculate capacity for encode mode
    if (mode === 'encode') {
      const img = await loadImage(dataUrl);
      const canvas = imageToCanvas(img);
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const cap = imageSteganography.calculateCapacity(imageData);
      setCapacity(cap);
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
      setResult({ type: 'error', message: 'Please select an image and enter a message' });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const dataUrl = await readFileAsDataURL(selectedFile);
      const img = await loadImage(dataUrl);
      const canvas = imageToCanvas(img);
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const result = imageSteganography.encode(imageData, {
        message,
        password: usePassword ? password : undefined
      });

      if (result.success) {
        ctx.putImageData(imageData, 0, 0);
        processedCanvasRef.current = canvas;

        setResult({
          type: 'success',
          message: `Message successfully hidden! Capacity used: ${formatBytes(message.length)} / ${formatBytes(result.capacity || 0)}`
        });

        // Save to history
        saveToHistory({
          type: 'encode',
          mediaType: 'image',
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
      setResult({ type: 'error', message: 'Please select an image' });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const dataUrl = await readFileAsDataURL(selectedFile);
      const img = await loadImage(dataUrl);
      const canvas = imageToCanvas(img);
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const result = imageSteganography.decode(imageData, {
        password: usePassword ? password : undefined
      });

      if (result.success) {
        setMessage(result.data || '');
        setResult({ type: 'success', message: 'Message successfully extracted!' });

        // Save to history
        saveToHistory({
          type: 'decode',
          mediaType: 'image',
          filename: selectedFile.name,
          messageLength: result.data?.length || 0,
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

  const handleDownload = async () => {
    if (!processedCanvasRef.current) return;

    const blob = await canvasToBlob(processedCanvasRef.current, 'image/png');
    const filename = selectedFile?.name.replace(/\.[^/.]+$/, '_encoded.png') || 'encoded.png';
    downloadFile(blob, filename);
  };

  const saveToHistory = (entry: any) => {
    const history = JSON.parse(localStorage.getItem('steganography_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('steganography_history', JSON.stringify(history.slice(0, 50)));
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setMessage('');
    setPassword('');
    setResult(null);
    setCapacity(null);
    processedCanvasRef.current = null;
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
            <ImageIcon className="w-6 h-6 text-primary-600" />
            Image Steganography
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => { setMode('encode'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'encode'
                  ? 'glass-button'
                  : 'glass-button-secondary'
              }`}
            >
              <Lock className="w-5 h-5 inline-block mr-2" />
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'decode'
                  ? 'glass-button'
                  : 'glass-button-secondary'
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
          <h3 className="font-semibold mb-4">Select Image</h3>

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
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="text-center">
              <FileImage className="w-16 h-16 mx-auto mb-4 text-primary-500" />
              <p className="text-lg font-semibold mb-2">
                {selectedFile ? selectedFile.name : 'Drop image here or click to browse'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supports PNG, JPG, BMP
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

          {mode === 'encode' && processedCanvasRef.current && (
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
        <h3 className="font-semibold mb-4">Image Preview</h3>

        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700"
            />
            {selectedFile && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">File Name:</span>
                  <span className="font-semibold">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">File Size:</span>
                  <span className="font-semibold">{formatBytes(selectedFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Type:</span>
                  <span className="font-semibold">{selectedFile.type}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-2" />
              <p>No image selected</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageSteganography;
