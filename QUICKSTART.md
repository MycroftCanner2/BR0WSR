# Quick Start Guide

## Build BR0WSR for Windows in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Windows Executable
```bash
npm run build:win
```

### 3. Find Your Build
The executables will be in the `dist/` directory:
- `BR0WSR Setup 1.0.0.exe` - Installer (recommended)
- `BR0WSR-1.0.0-portable.exe` - Portable version

That's it! You now have Windows .exe distributables ready to run or distribute.

---

## Other Build Options

### macOS (on Mac)
```bash
npm run build:mac
```

### Linux (on Linux)
```bash
npm run build:linux
```

### Run in Development Mode
```bash
npm start
```

---

## Need More Details?

See [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for comprehensive Windows build instructions including:
- Troubleshooting
- Custom icons
- Code signing
- Advanced configuration

See [README.md](README.md) for:
- Feature overview
- Architecture details
- Development guide
