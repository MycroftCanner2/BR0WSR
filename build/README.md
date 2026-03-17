# Build Assets

This directory contains build assets for packaging BR0WSR.

## Required Icon Files

### Windows (icon.ico)
- File: `build/icon.ico`
- Format: Windows ICO file
- Recommended sizes: 16x16, 32x32, 48x48, 256x256
- Can be generated from PNG files using tools like:
  - https://icoconvert.com/
  - `npm install -g png-to-ico`
  - `png-to-ico icon.png > icon.ico`

### macOS (icon.icns)
- File: `build/icon.icns`
- Format: macOS ICNS file
- Recommended source size: 1024x1024 PNG
- Can be generated using:
  - `npm install -g @electron/osx-sign`
  - Online converters like https://cloudconvert.com/png-to-icns

### NSIS Installer Graphics (Windows)
- `build/installer-header.bmp` - 150x57 bitmap for installer header
- `build/installer-sidebar.bmp` - 164x314 bitmap for installer sidebar
- Can be created from PNG using tools like GIMP or Paint.NET

## Quick Setup (macOS/Linux)

```bash
# If you have a source PNG icon at icon.png
# Install icon generation tools
npm install -g png-to-ico

# Generate Windows icon
png-to-ico icon.png > build/icon.ico
```

## Placeholder Notes

- These icons are required for building distributables
- If missing, electron-builder will use the default Electron icon
- For production releases, create branded icons matching the BR0WSR aesthetic
- The terminal/Matrix theme suggests a green-on-black icon design
