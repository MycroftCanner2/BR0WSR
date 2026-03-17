# Changelog

All notable changes to BR0WSR will be documented in this file.

## [1.0.0] - 2024-03-17

### Added

- **Windows .exe Distribution Support**
  - Configured electron-builder for Windows packaging
  - Added NSIS installer with setup wizard
  - Added portable .exe build option
  - Cross-platform build scripts (Windows, macOS, Linux)

- **Platform Compatibility Improvements**
  - Added Windows-specific authentication (dialog-based unlock)
  - Added Windows ExpressVPN CLI integration
  - Platform detection and conditional code paths
  - macOS hidden inset title bar preserved
  - Windows standard title bar for better compatibility

- **Build Infrastructure**
  - `electron-builder.yml` configuration file
  - Build scripts in `package.json`
  - `build/` directory for assets and hooks
  - `build/afterPack.js` for post-packaging customization
  - `build/entitlements.mac.plist` for macOS code signing

- **Documentation**
  - `README.md` - Project overview and quick start
  - `BUILD_WINDOWS.md` - Detailed Windows build guide
  - `build/README.md` - Build assets documentation
  - `.gitignore` - Proper exclusion of build artifacts

- **Enhanced IPC API**
  - Added `get-platform` endpoint for platform detection
  - Improved VPN error handling with success/failure responses
  - Windows-specific command execution via `runWin()`

### Changed

- Updated `main.js` with platform detection and Windows support
- Updated `preload.js` to expose `getPlatform()` to renderer
- Enhanced window management for cross-platform compatibility
- Improved app lifecycle handling (window-all-closed, activate)

### Technical Details

#### Windows Build Output
- **NSIS Installer**: `BR0WSR Setup 1.0.0.exe` (~100-150 MB)
  - Installation wizard with directory selection
  - Desktop and Start Menu shortcuts
  - Automatic uninstaller

- **Portable Executable**: `BR0WSR-1.0.0-portable.exe` (~100-150 MB)
  - No installation required
  - Self-contained executable

#### Platform-Specific Behavior

**macOS**
- Touch ID authentication via `systemPreferences`
- VPN control via `scutil` system commands
- ExpressVPN deep link integration

**Windows**
- Dialog-based authentication (ready for Windows Hello upgrade)
- ExpressVPN CLI integration (requires ExpressVPN Windows app)
- Standard Windows title bar

### Dependencies

- Added: `electron-builder@^24.13.3` (devDependency)
- Existing: `electron@^29.0.0`, `@cliqz/adblocker-electron@^1.34.0`

### Build Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run in development mode |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows NSIS installer |
| `npm run build:mac` | Build macOS .dmg |
| `npm run build:linux` | Build Linux packages |
| `npm run build:portable` | Build Windows portable .exe |

### Known Limitations

- **Windows VPN**: Requires ExpressVPN CLI in system PATH
- **Windows Auth**: Uses dialog instead of Windows Hello (upgrade path exists)
- **Icons**: Uses default Electron icon unless custom icons are added
- **Code Signing**: Not configured (optional for internal distribution)

### Migration Notes

No breaking changes. Existing macOS builds will continue to work.

### Future Enhancements

Potential improvements for future releases:
- Windows Hello biometric authentication integration
- Auto-update support via electron-updater
- Code signing configuration
- Linux AppImage and Snap packages
- Custom icon assets for branding
- Multi-language installer support
