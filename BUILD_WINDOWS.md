# Building BR0WSR for Windows

This guide explains how to build Windows .exe distributables for BR0WSR.

## Prerequisites

- **Windows 10/11** (for building Windows packages)
- **Node.js** v18 or later (https://nodejs.org/)
- **Git** (https://git-scm.com/)
- **NSIS** (for installer creation) - Optional but recommended
  - Download from: https://nsis.sourceforge.io/Download
  - Install to default location or add to PATH

## Quick Start

### 1. Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd br0wsr

# Install npm dependencies
npm install
```

### 2. Prepare Icons (Recommended)

Create or convert icons for branding:

```bash
# Install icon generation tool (optional)
npm install -g png-to-ico

# Generate Windows icon from a PNG source
# You need a source PNG file (e.g., icon.png)
png-to-ico icon.png > build/icon.ico
```

**Note:** If you skip this step, the default Electron icon will be used.

### 3. Build Windows Distribution

#### Option A: Full NSIS Installer
```bash
npm run build:win
```

This creates:
- `dist/BR0WSR Setup 1.0.0.exe` - NSIS installer with setup wizard
- `dist/BR0WSR-1.0.0-win-x64.exe` - Same installer with different naming

The installer will:
- Let users choose installation directory
- Create desktop and Start Menu shortcuts
- Register for uninstallation
- Include all dependencies in a single package

#### Option B: Portable Executable
```bash
npm run build:portable
```

This creates:
- `dist/BR0WSR-1.0.0-portable.exe` - Standalone executable (no install needed)

The portable version:
- Runs directly without installation
- Extracts to a temp directory on launch
- Good for USB drives or testing

### 4. Locate Output

After building, check the `dist/` directory:

```bash
# List generated files
ls -lh dist/
```

Expected output:
```
BR0WSR-1.0.0-portable.exe      (~100-150 MB)
BR0WSR Setup 1.0.0.exe         (~100-150 MB)
builder-effective-config.yaml
win-unpacked/                  (Unpacked build for testing)
```

## Build Scripts

The following npm scripts are available:

| Script | Description |
|--------|-------------|
| `npm start` | Run BR0WSR in development mode |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows NSIS installer |
| `npm run build:mac` | Build macOS .dmg (on macOS) |
| `npm run build:linux` | Build Linux packages (on Linux) |
| `npm run build:portable` | Build Windows portable .exe |
| `npm run dist` | Alias for `npm run build` |

## Testing the Build

### Test Unpacked Build
```bash
# Navigate to the unpacked directory
cd dist/win-unpacked

# Run the executable
./BR0WSR.exe
```

### Test Installer
```bash
# Run the installer (will launch setup wizard)
./dist/"BR0WSR Setup 1.0.0.exe"
```

### Test Portable
```bash
# Run portable version directly
./dist/"BR0WSR-1.0.0-portable.exe"
```

## Platform-Specific Features

### Windows Features
- **Authentication**: Simple dialog-based unlock (can be upgraded to Windows Hello)
- **VPN**: Integration with ExpressVPN CLI (must be installed separately)
- **Window Style**: Standard Windows title bar (vs. macOS hidden inset)

### Mac Features (for comparison)
- **Authentication**: Touch ID biometric authentication
- **VPN**: Integration with ExpressVPN via `scutil` system commands
- **Window Style**: Hidden inset title bar

## VPN Integration on Windows

For VPN functionality to work on Windows, users need:

1. **ExpressVPN Windows App** installed
2. **ExpressVPN CLI** in system PATH
3. **ExpressVPN subscription** and active account

If ExpressVPN CLI is not available, the VPN controls will show "Unavailable" status but the browser will function normally.

## Troubleshooting

### Build Fails with "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### NSIS Installer Not Created
- Ensure NSIS is installed
- Add NSIS to your PATH environment variable
- Restart your terminal after installing NSIS

### Icons Not Applied
- Verify `build/icon.ico` exists
- Ensure .ico file is valid (can open with default image viewer)
- Try building without icons first, then add them later

### "Cannot find module" Errors
```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Large File Sizes
Windows Electron apps are typically 100-150 MB because:
- They bundle the entire Chromium engine
- Include Node.js runtime
- Package all dependencies
- This is normal for Electron applications

## Advanced Configuration

### Modify Build Settings

Edit `electron-builder.yml` to customize:

```yaml
win:
  target:
    - target: nsis        # or: portable, zip, 7z
      arch: x64           # or: ia32, arm64

nsis:
  oneClick: false         # Show installation wizard
  perMachine: true        # Install for all users
  createDesktopShortcut: true
  createStartMenuShortcut: true
```

### Sign Your Application

For distribution, code-sign your .exe to avoid security warnings:

1. Obtain a code signing certificate (DigiCert, Sectigo, etc.)
2. Install the certificate on your Windows machine
3. Add to `electron-builder.yml`:

```yaml
win:
  signingHashAlgorithms: ['sha256']
  certificateFile: 'path/to/cert.pfx'
  certificatePassword: 'your-password'
```

### Auto-Update Support

To enable auto-updates, integrate `electron-updater`:

```bash
npm install electron-updater
```

Then configure update servers in your main process code.

## Cross-Platform Building

You can build for Windows from macOS or Linux using:

```bash
# Build Windows from macOS/Linux (requires Wine)
npm run build:win -- --x64 --ia32
```

Note: Building on the target platform is recommended for best results.

## Distribution

### Internal Distribution
- Upload .exe to internal file server
- Share via company Slack/Teams/Email
- Host on internal web server

### Public Distribution
- Upload to GitHub Releases
- Host on your own website
- Use software distribution platforms (SourceForge, etc.)

### Version Management

Update `package.json` version before each release:

```json
{
  "version": "1.1.0"  // Follow semantic versioning
}
```

Then rebuild to create a new distributable.

## Security Considerations

1. **Code Signing**: Always sign your distributables
2. **Dependencies**: Keep npm packages updated (`npm audit fix`)
3. **Electron Version**: Use latest stable Electron version
4. **Testing**: Test builds on clean Windows machines before distribution

## Support

For issues specific to:
- **electron-builder**: https://www.electron.build/
- **Electron**: https://www.electronjs.org/docs
- **ExpressVPN Windows**: https://www.expressvpn.com/support/vpn-setup/app-for-windows
