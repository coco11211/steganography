# 🎭 Steganography Studio

> Professional data hiding in multimedia files with a stunning Figma-level UI

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%2011-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🖼️ Image Steganography
- **Supported Formats**: PNG, JPG, BMP
- **Advanced LSB Algorithm**: Hide data in the 2 least significant bits
- **High Capacity**: Store large messages in images
- **Lossless Encoding**: Export as PNG for perfect quality
- **Real-time Preview**: See your image before encoding

### 🎵 Audio Steganography
- **Supported Formats**: WAV, MP3, OGG
- **Imperceptible Changes**: Hide data without affecting audio quality
- **Audio Preview**: Play and preview your audio files
- **Waveform Manipulation**: Embed data in audio samples

### 🎬 Video Steganography
- **Supported Formats**: MP4, WebM, AVI
- **Frame-based Hiding**: Distribute data across video frames
- **Adjustable Intervals**: Control data density per frame
- **Video Preview**: Watch your video before processing

### 🔐 Security Features
- **AES Encryption**: Password-protect your hidden messages
- **Strong Password Support**: Use complex passwords for maximum security
- **Encrypted Metadata**: Timestamp and encryption flags

### 🎨 Premium UI/UX
- **Dark/Light Mode**: Beautiful themes for any preference
- **Smooth Animations**: Powered by Framer Motion
- **Drag & Drop**: Intuitive file handling
- **Real-time Feedback**: Progress indicators and status messages
- **Glass Morphism**: Modern, professional design
- **Responsive Layout**: Adapts to any window size

### 📊 Advanced Features
- **Operation History**: Track all your encode/decode operations
- **Export History**: Save your operation log as JSON
- **Capacity Calculator**: See exactly how much data you can hide
- **File Information**: Detailed metadata display
- **Smart Validation**: Intelligent error handling

## 🚀 Quick Start

### Prerequisites
- Windows 11 (or Windows 10)
- Node.js 18+ and npm

### Installation

1. **Clone or download this repository**
```bash
cd steganography
```

2. **Install dependencies**
```bash
npm install
```

3. **Run in development mode**
```bash
npm run dev
```

4. **Build for Windows**
```bash
npm run package
```

The installer will be created in the `release` folder.

## 📖 How to Use

### Encoding (Hiding a Message)

1. **Select Media Type**: Choose Image, Audio, or Video tab
2. **Choose Encode Mode**: Click the "Encode" button
3. **Upload File**: Drag & drop or click to select your cover file
4. **Enter Message**: Type your secret message in the text area
5. **Optional Security**: Enable password protection if desired
6. **Encode**: Click "Encode Message"
7. **Download**: Save your file with the hidden message

### Decoding (Extracting a Message)

1. **Select Media Type**: Choose the appropriate tab
2. **Choose Decode Mode**: Click the "Decode" button
3. **Upload File**: Select the file containing the hidden message
4. **Enter Password**: If the message was encrypted
5. **Decode**: Click "Decode Message"
6. **View Message**: Your secret message will appear

## 🔬 Technical Details

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Desktop Framework**: Electron 28
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Encryption**: CryptoJS (AES-256)
- **Build Tool**: Vite
- **Package Manager**: npm

### Steganography Algorithm

**LSB (Least Significant Bit) Technique**:
- Modifies the 2 least significant bits of each pixel/sample
- Invisible to human perception
- Metadata includes encryption flag and timestamp
- Header stores message length for extraction

**Image Processing**:
- RGB channels (alpha channel preserved)
- 32-bit header for message length
- Supports up to capacity of image

**Audio Processing**:
- Works on PCM samples
- 16-bit audio encoding
- Multi-channel support
- WAV output format

**Video Processing**:
- Frame extraction at intervals
- Distributed data storage
- Frame-by-frame encoding
- Configurable frame density

### Security

- **AES-256 Encryption**: Industry-standard encryption
- **Password Hashing**: Secure password handling
- **Metadata Protection**: Encrypted message metadata
- **No Cloud Storage**: All processing is local

## 📋 File Format Recommendations

| Media Type | Best Format | Why |
|------------|-------------|-----|
| Image | PNG | Lossless compression preserves hidden data |
| Audio | WAV | Uncompressed format maintains data integrity |
| Video | MP4 | Good balance of quality and file size |

## ⚠️ Important Notes

- **PNG for Images**: Always use PNG when saving encoded images to avoid lossy compression
- **WAV for Audio**: MP3 compression may destroy hidden data
- **Backup Files**: Keep original files before encoding
- **Password Security**: Lost passwords cannot be recovered
- **Legal Use**: Only use for legitimate purposes
- **File Size**: Larger files can hide more data

## 🎯 Capacity Guidelines

**Image Steganography**:
- 1920x1080 PNG ≈ 1.5 MB capacity
- 4K image ≈ 6 MB capacity

**Audio Steganography**:
- 1 minute WAV (44.1kHz) ≈ 600 KB capacity
- 5 minute audio ≈ 3 MB capacity

**Video Steganography**:
- Depends on resolution, frame rate, and interval
- 1080p 30fps video ≈ several MB per minute

## 🛠️ Development

### Project Structure
```
steganography/
├── electron/           # Electron main process
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── utils/         # Utility functions
│   │   ├── imageSteganography.ts
│   │   ├── audioSteganography.ts
│   │   ├── videoSteganography.ts
│   │   └── fileUtils.ts
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run dev:react        # Start React dev server only
npm run dev:electron     # Start Electron only

# Building
npm run build            # Build React app
npm run build:electron   # Build Electron installer
npm run package          # Build complete Windows package
```

## 🎨 UI Components

- **Glass Cards**: Frosted glass effect containers
- **Gradient Buttons**: Smooth gradient animations
- **Drop Zones**: Drag & drop file upload areas
- **Progress Indicators**: Visual feedback for operations
- **Status Badges**: Color-coded status indicators
- **Theme Toggle**: Smooth dark/light mode transition

## 🐛 Troubleshooting

**Issue**: Application won't start
- **Solution**: Ensure Node.js 18+ is installed, run `npm install`

**Issue**: Encoding fails with "capacity exceeded"
- **Solution**: Use a larger cover file or shorter message

**Issue**: Decoded message is garbled
- **Solution**: Ensure correct password, check file wasn't compressed

**Issue**: Audio playback doesn't work
- **Solution**: Try converting to WAV format first

## 📝 License

MIT License - feel free to use for personal or educational purposes.

## 🤝 Contributing

This is a standalone educational project. Feel free to fork and modify!

## ⭐ Acknowledgments

- LSB Steganography research and algorithms
- Electron and React communities
- Tailwind CSS and Framer Motion teams

## 📬 Support

For issues or questions, please check:
1. This README file
2. The "About" tab in the application
3. Operation history for debugging

---

**Made with ❤️ for privacy enthusiasts**

*Use responsibly and legally. For educational purposes.*
