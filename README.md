# BR0WSR

A privacy-focused Electron browser with built-in ad blocking and VPN integration.

## Features

- **Ad & Tracking Blocking** - Powered by Cliqz's prebuilt filter lists
- **VPN Integration** - Built-in ExpressVPN controls (macOS/Windows)
- **Biometric Authentication** - Touch ID on macOS, PIN dialog on Windows
- **Tabbed Browsing** - Multi-tab support with session management
- **Collapsible Sidebar** - Tab list and VPN controls in a hideable sidebar
- **Privacy-First Design** - No telemetry, no tracking, open source
- **Terminal/Matrix Aesthetic** - Green-on-black UI with scanlines and glow effects

## Platform Support

- ✅ **macOS** - Full support with Touch ID and native VPN integration
- ✅ **Windows** - Full support with NSIS installer and ExpressVPN CLI integration

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm start
```

## Building

### Windows .exe Distribution

See [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for detailed instructions.

```bash
# Build Windows NSIS installer
npm run build:win

# Build Windows portable executable
npm run build:portable
```

### macOS .dmg Distribution

```bash
# Build macOS DMG (run on macOS)
npm run build:mac
```

### Linux Packages

```bash
# Build Linux packages (run on Linux)
npm run build:linux
```

## Build Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run in development mode |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows .exe |
| `npm run build:mac` | Build macOS .dmg |
| `npm run build:linux` | Build Linux packages |
| `npm run build:portable` | Build Windows portable .exe |

## Keyboard Shortcuts

- `Cmd/Ctrl + T` - New tab
- `Cmd/Ctrl + W` - Close current tab
- `Cmd/Ctrl + L` - Focus URL bar
- `Cmd/Ctrl + R` - Reload page

## Architecture

The application follows standard Electron architecture:

1. **Main Process** (`main.js`) - Window management, IPC, auth, VPN controls
2. **Preload Script** (`preload.js`) - Secure bridge to renderer via contextBridge
3. **Renderer Process** (`index.html`) - Single-page UI with embedded CSS/JS

## Dependencies

- **electron** (^29.0.0) - Desktop application framework
- **@cliqz/adblocker-electron** (^1.34.0) - Ad and tracking blocker
- **electron-builder** (^24.13.3) - Build tool for packaging

## Platform-Specific Notes

### macOS
- Uses `systemPreferences` for Touch ID authentication
- Controls VPN via `scutil` system commands
- ExpressVPN deep link integration
- Hidden inset title bar style

### Windows
- Uses dialog-based authentication (can be upgraded to Windows Hello)
- Controls VPN via ExpressVPN CLI (must be installed separately)
- Standard Windows title bar
- NSIS installer with setup wizard

## VPN Integration

### Requirements

- **macOS**: ExpressVPN app installed
- **Windows**: ExpressVPN Windows app + CLI in PATH
- **Both**: Active ExpressVPN subscription

### Supported Locations

- USA 🇺🇸
- UK 🇬🇧
- Germany 🇩🇪
- Netherlands 🇳🇱
- Japan 🇯🇵

## Development

### Project Structure

```
br0wsr/
├── main.js              # Main process
├── preload.js           # Preload script
├── index.html           # Renderer UI (includes CSS/JS)
├── package.json         # Dependencies and scripts
├── electron-builder.yml # Build configuration
├── build/               # Build assets
│   ├── README.md        # Icon instructions
│   ├── afterPack.js     # Post-packaging hook
│   └── entitlements.mac.plist  # macOS entitlements
├── BUILD_WINDOWS.md     # Windows build guide
└── README.md            # This file
```

### Code Style

- Vanilla JavaScript (no framework)
- Platform detection with conditional logic
- IPC for main-renderer communication
- Context isolation enabled for security

## License

MIT

## Contributing

Contributions welcome! Please ensure:

1. Code follows existing style
2. Platform-specific code is properly gated
3. Changes work on both macOS and Windows when applicable
4. Tests pass on target platforms

## Security

- Context isolation enabled
- Node integration disabled in renderer
- No remote code execution
- All external content loaded in webview tags

## Acknowledgments

- [Electron](https://www.electronjs.org/) - Desktop framework
- [Cliqz AdBlocker](https://github.com/cliqz-oss/adblocker) - Ad blocking engine
- [ExpressVPN](https://www.expressvpn.com/) - VPN service integration
