# Steganography Studio - Complete Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Image Steganography](#image-steganography)
3. [Audio Steganography](#audio-steganography)
4. [Video Steganography](#video-steganography)
5. [Security & Passwords](#security--passwords)
6. [History & Export](#history--export)
7. [Tips & Best Practices](#tips--best-practices)
8. [Common Use Cases](#common-use-cases)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch
1. **Launch the application** from your Start Menu or desktop shortcut
2. **Choose your theme** using the sun/moon icon in the top-right
3. **Select a media type** from the navigation tabs (Image, Audio, Video)

### Interface Overview
- **Header**: Title, theme toggle, and navigation
- **Left Panel**: Controls for file selection, message input, and encoding/decoding
- **Right Panel**: Live preview of your selected file
- **Footer**: Version info and status

## Image Steganography

### Hiding a Message in an Image

#### Step-by-Step Guide

1. **Select Image Tab**
   - Click on "Image" in the navigation bar

2. **Choose Encode Mode**
   - Click the "Encode" button

3. **Upload Your Cover Image**
   - Drag and drop an image into the drop zone
   - Or click to browse your files
   - **Recommended**: Use PNG files for best results
   - **Supported**: PNG, JPG, BMP

4. **Enter Your Secret Message**
   - Type or paste your message in the text area
   - Watch the capacity indicator to ensure it fits
   - Example: "Meet me at the park at 3 PM"

5. **Optional: Add Password Protection**
   - Toggle "Password Protection" to Enabled
   - Enter a strong password
   - Remember this password - you'll need it to decode!

6. **Encode the Message**
   - Click "Encode Message"
   - Wait for the success message
   - The encoded image is ready!

7. **Download Your Encoded Image**
   - Click the download button (arrow icon)
   - Save as PNG to preserve the hidden data
   - The file will be named `yourimage_encoded.png`

### Extracting a Message from an Image

1. **Select Image Tab & Decode Mode**
   - Click "Decode" button

2. **Upload the Encoded Image**
   - Drag and drop or browse to select
   - Must be the encoded image (not compressed/edited)

3. **Enter Password (if encrypted)**
   - Enable password protection
   - Enter the exact password used during encoding

4. **Decode the Message**
   - Click "Decode Message"
   - Your secret message appears in the text area!

### Image Tips
- **Use PNG format** - JPG compression destroys hidden data
- **Larger images** = more message capacity
- **Don't edit** encoded images in photo editors
- **Keep originals** as backups

## Audio Steganography

### Hiding a Message in Audio

#### Step-by-Step Guide

1. **Select Audio Tab**
   - Click on "Audio" in the navigation

2. **Choose Encode Mode**
   - Click the "Encode" button

3. **Upload Your Audio File**
   - Drag and drop an audio file
   - **Best Format**: WAV (uncompressed)
   - **Also Supported**: MP3, OGG
   - Preview: Click play to listen

4. **Enter Your Message**
   - Type your secret message
   - Check capacity indicator
   - Longer audio = more capacity

5. **Optional: Password Protection**
   - Enable and enter a password

6. **Encode the Message**
   - Click "Encode Message"
   - Processing may take a few seconds
   - Success message appears when done

7. **Download Encoded Audio**
   - Click download button
   - Saves as WAV format
   - Play it - sounds identical to original!

### Extracting a Message from Audio

1. **Audio Tab → Decode Mode**

2. **Upload Encoded Audio**
   - Select your encoded WAV file

3. **Enter Password** (if used)

4. **Decode Message**
   - Click "Decode Message"
   - Message appears instantly

### Audio Tips
- **WAV format is essential** for encoding
- **Don't convert** encoded files to MP3
- **Longer audio** = more capacity
- **Test playback** before sharing

## Video Steganography

### Hiding a Message in Video

#### Step-by-Step Guide

1. **Select Video Tab**
   - Navigate to "Video"

2. **Choose Encode Mode**

3. **Upload Your Video**
   - Drag and drop a video file
   - Supported: MP4, WebM, AVI
   - Preview plays in the panel

4. **Adjust Frame Interval**
   - Use the slider to set interval
   - **Lower values** (1-5): More capacity, slightly more noticeable
   - **Higher values** (20-30): Less capacity, completely invisible
   - **Recommended**: 10 frames

5. **Enter Your Message**

6. **Optional: Password Protection**

7. **Encode the Message**
   - Click "Encode Message"
   - Processing video frames...
   - Note: This is a demonstration feature

8. **Result**
   - Success message shows frames processed
   - Video steganography is conceptual in this version

### Video Tips
- **Higher resolution** = more capacity
- **Longer videos** = more capacity
- **Frame interval** balances capacity vs. stealth
- **MP4 format** recommended

## Security & Passwords

### Password Protection

**When to Use:**
- Sending sensitive information
- Extra layer of security
- Ensuring only recipient can read

**Password Best Practices:**
- Use **strong passwords**: Mix letters, numbers, symbols
- **Remember it**: No password recovery available
- **Share securely**: Don't email passwords with files
- **Test first**: Encode/decode a test message

### Encryption Details
- **Algorithm**: AES-256
- **Implementation**: CryptoJS
- **Metadata**: Encrypted flag stored with message
- **Security**: Industry-standard encryption

### Password Example
```
Bad:  "password123"
Good: "My$ecr3t!Key#2024"
```

## History & Export

### Viewing Operation History

1. **Click History Tab**
   - See all your encode/decode operations

2. **Filter by Type**
   - All, Image, Audio, or Video

3. **Information Shown**
   - Filename
   - Operation type (Encode/Decode)
   - Message size
   - Encryption status
   - Timestamp

### Exporting History

1. **Click "Export" Button**
   - Saves as JSON file
   - Contains metadata only (no actual messages)

2. **Use Cases**
   - Backup your operation log
   - Track your usage
   - Debugging

### Clearing History

1. **Click "Clear All"**
   - Confirms before deleting
   - Cannot be undone
   - Fresh start

## Tips & Best Practices

### General Tips

**File Management:**
- ✅ Keep original files separate
- ✅ Use descriptive names for encoded files
- ✅ Test decode immediately after encode
- ✅ Store backup copies

**Quality Preservation:**
- ✅ Use lossless formats (PNG, WAV)
- ❌ Don't compress encoded files
- ❌ Don't edit encoded files
- ❌ Don't convert formats after encoding

**Security:**
- ✅ Use strong passwords
- ✅ Test password before sharing
- ✅ Securely share passwords separately
- ❌ Don't use obvious passwords

### Capacity Optimization

**For Larger Messages:**
1. Use bigger files (4K images, long audio)
2. Use video steganography
3. Split message across multiple files

**Current Limits:**
- Image: Up to several MB
- Audio: Hundreds of KB per minute
- Video: Several MB depending on length

### Quality Checks

**Before Sharing Encoded Files:**
- [ ] Decoded successfully with password
- [ ] File plays/displays normally
- [ ] No visible/audible artifacts
- [ ] Original quality maintained

## Common Use Cases

### 1. Secure Communication
**Scenario**: Send confidential info
- Use image steganography
- Enable password protection
- Share image publicly, password privately

### 2. Digital Watermarking
**Scenario**: Mark your photos
- Hide copyright info in images
- Add contact details
- Prove ownership

### 3. Secure Notes
**Scenario**: Hide personal notes
- Encode notes in family photos
- Password protect
- Store in cloud safely

### 4. Educational Projects
**Scenario**: Learn cryptography
- Experiment with different formats
- Compare capacities
- Test security features

### 5. Privacy-Conscious Messaging
**Scenario**: Extra security layer
- Hide message in innocent-looking files
- No obvious encryption
- Plausible deniability

## Troubleshooting

### Problem: "Message too large" error

**Solution:**
- Use a larger cover file
- Shorten your message
- Use video instead of image
- Split across multiple files

### Problem: Decoded message is garbled

**Causes & Solutions:**
- ❌ Wrong password → Use correct password
- ❌ File was compressed → Use original encoded file
- ❌ File was edited → Don't modify encoded files
- ❌ Wrong file type → Ensure PNG for images, WAV for audio

### Problem: Can't find hidden message

**Solutions:**
1. Verify it's the encoded file (not original)
2. Check if password is required
3. Ensure file wasn't altered
4. Try re-encoding with test message

### Problem: Image/audio quality degraded

**Solutions:**
- Save images as PNG (not JPG)
- Keep audio as WAV (not MP3)
- Don't use "Save for Web" in editors
- Avoid any compression

### Problem: App won't encode

**Checks:**
- [ ] File is selected
- [ ] Message is entered
- [ ] File format is supported
- [ ] Enough capacity in cover file

### Problem: Password doesn't work

**Remember:**
- Passwords are case-sensitive
- No spaces at start/end
- Exact match required
- No recovery option

## Advanced Features

### Batch Operations (Future)
Currently, encode files one at a time for best results.

### Custom Settings
- Theme: Light/Dark mode
- Frame interval for video
- Password complexity

### Keyboard Shortcuts
- `Ctrl + O`: Open file (when input focused)
- `Ctrl + S`: Save/Download
- `F11`: Toggle fullscreen

## Best Results Checklist

### For Encoding:
- [ ] Using recommended file format
- [ ] Message fits capacity
- [ ] Password noted (if used)
- [ ] Test decode performed
- [ ] Original file backed up

### For Decoding:
- [ ] Have original encoded file
- [ ] Correct password ready
- [ ] File not modified/compressed
- [ ] Using same media type

## Privacy & Security Notes

🔒 **All processing is local** - nothing sent to servers
🔒 **No data collection** - your files stay private
🔒 **No internet required** - fully offline capable
🔒 **Strong encryption** - AES-256 industry standard

---

## Need More Help?

1. **Check the About tab** - Quick reference guide
2. **Review examples** - Try test files first
3. **Read README.md** - Technical details
4. **Check history** - See what worked before

**Happy hiding!** 🎭
