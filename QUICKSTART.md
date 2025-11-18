# 🚀 Quick Start Guide

## Get Running in 3 Steps!

### Step 1: Install Dependencies
Open PowerShell or Command Prompt in this folder and run:
```bash
npm install
```
Wait 2-3 minutes for all packages to download.

### Step 2: Start the App
```bash
npm run dev
```
The app will open automatically in a new window!

### Step 3: Try It Out!
1. Click the **Image** tab
2. Click **Encode**
3. Drag an image into the drop zone
4. Type a message like "Hello World!"
5. Click **Encode Message**
6. Click the download icon to save your encoded image
7. Switch to **Decode** mode
8. Upload the encoded image
9. Click **Decode Message**
10. Your message appears! 🎉

## What You Can Do

### 🖼️ Images
- Hide text in PNG, JPG, BMP images
- Invisible to the eye
- Download as PNG

### 🎵 Audio
- Hide messages in WAV, MP3, OGG files
- No audible difference
- Saves as WAV

### 🎬 Video
- Distribute data across video frames
- MP4, WebM, AVI support
- Frame interval control

### 🔐 Security
- Toggle password protection
- AES-256 encryption
- Secure your messages

## Building for Windows

Want to create an installer?
```bash
npm run package
```
Find the installer in the `release` folder!

## Need Help?

- **Full Guide**: Check `README.md`
- **Installation**: See `INSTALL.md`
- **Usage Tips**: Read `USAGE_GUIDE.md`
- **In-App Help**: Click the "About" tab

## Tips for Best Results

✅ Use PNG for images (not JPG)
✅ Use WAV for audio (not MP3)
✅ Test decode right after encode
✅ Use strong passwords
✅ Keep original files as backup

## Troubleshooting

**App won't start?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build failing?**
- Run as Administrator
- Disable antivirus temporarily

**White screen?**
- Check Node.js version: `node --version` (need 18+)
- Rebuild: `npm run build`

---

**That's it! Start hiding your secret messages! 🎭**
