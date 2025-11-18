# Installation Guide - Steganography Studio

## Windows 11 Installation

### Method 1: Using Pre-built Installer (Recommended)

1. **Download the installer**
   - Navigate to the `release` folder after building
   - Run `Steganography Studio Setup.exe`
   - Follow the installation wizard

2. **Launch the application**
   - Find "Steganography Studio" in your Start Menu
   - Or use the desktop shortcut if created

### Method 2: Build from Source

#### Prerequisites

**Node.js Installation:**
1. Download Node.js 18+ from https://nodejs.org/
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Build Steps

1. **Open PowerShell or Command Prompt**
   - Press `Win + X` and select "Windows PowerShell" or "Terminal"

2. **Navigate to the project folder**
   ```bash
   cd path\to\steganography
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   This will take a few minutes to download all required packages.

4. **Build the application**
   ```bash
   npm run package
   ```
   This creates a Windows installer in the `release` folder.

5. **Run the installer**
   ```bash
   cd release
   ```
   Double-click the `.exe` file to install.

### Method 3: Development Mode

If you want to run the app without building an installer:

1. **Install dependencies** (if not done already)
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **The app will open automatically**
   - React dev server starts on http://localhost:5173
   - Electron window opens with hot reload enabled
   - Changes to code will update the app automatically

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: Build fails with "EPERM" error

**Solution:**
- Run PowerShell/CMD as Administrator
- Disable antivirus temporarily during build
- Close any file explorers viewing the project folder

### Issue: Application won't start

**Solution:**
1. Check Windows Defender isn't blocking it
2. Right-click the .exe → Properties → Check "Unblock"
3. Run as Administrator

### Issue: White screen on launch

**Solution:**
- Ensure all dependencies installed correctly
- Check `dist` folder was created
- Try rebuilding: `npm run build && npm run build:electron`

## System Requirements

- **OS**: Windows 11 (or Windows 10 version 1903+)
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk Space**: 500 MB for installation
- **Display**: 1024x768 minimum resolution

## Uninstallation

1. Open "Add or Remove Programs"
2. Search for "Steganography Studio"
3. Click "Uninstall"

Or use the uninstaller in the installation directory.

## First Launch

On first launch, the application will:
- Create a settings folder in `AppData`
- Initialize the theme (defaults to dark mode)
- Create an empty operation history

No internet connection is required - everything runs locally!

## File Associations (Optional)

To open files directly with Steganography Studio:
1. Right-click an image/audio/video file
2. Select "Open with" → "Choose another app"
3. Browse to Steganography Studio executable
4. Check "Always use this app"

## Updates

Currently, updates must be installed manually:
1. Download the new version
2. Run the new installer
3. It will replace the old version

Your history and settings are preserved during updates.

## Getting Help

- Check the README.md for detailed documentation
- Use the "About" tab in the app for quick reference
- Check your operation history for debugging

---

**Enjoy secure steganography on Windows 11!**
