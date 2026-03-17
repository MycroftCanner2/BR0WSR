const { app, BrowserWindow, ipcMain, session, systemPreferences, dialog } = require('electron')
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const { exec } = require('child_process')
const { spawn } = require('child_process')
const path = require('path')
const os = require('os')

const platform = process.platform
const isWindows = platform === 'win32'
const isMac = platform === 'darwin'

const VPN_PROFILE = 'ExpressVPN Lightway'

const COUNTRIES = [
  { code: 'us', name: 'USA',         flag: '🇺🇸' },
  { code: 'gb', name: 'UK',          flag: '🇬🇧' },
  { code: 'de', name: 'Germany',     flag: '🇩🇪' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'jp', name: 'Japan',       flag: '🇯🇵' },
]

function run(cmd, options = {}) {
  return new Promise(resolve => {
    exec(cmd, options, (err, stdout) => resolve(err ? '' : stdout.trim()))
  })
}

// Windows-friendly command execution
function runWin(cmd, args = []) {
  return new Promise(resolve => {
    const child = spawn(cmd, args, {
      shell: true,
      windowsHide: true
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', data => stdout += data.toString())
    child.stderr.on('data', data => stderr += data.toString())
    child.on('close', code => resolve(stdout.trim()))
  })
}

// ── Auth ─────────────────────────────────────────────────────
ipcMain.handle('auth-check', () => {
  if (isMac) {
    try {
      return systemPreferences.canPromptTouchID()
    } catch {
      return false
    }
  }
  // Windows: Support Windows Hello is not natively available in current Electron API
  // Return true to indicate password/PIN auth is available
  return true
})

ipcMain.handle('auth-fingerprint', async () => {
  if (isMac) {
    try {
      await systemPreferences.promptTouchID('unlock BR0WSR')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
  
  // Windows: Show a simple dialog-based authentication
  // In production, you would integrate Windows Hello here
  return new Promise(resolve => {
    const result = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Cancel', 'Unlock'],
      defaultId: 1,
      cancelId: 0,
      title: 'BR0WSR Security',
      message: 'Authentication Required',
      detail: 'Click "Unlock" to authenticate and access BR0WSR',
    })
    resolve({ success: result === 1 })
  })
})

ipcMain.handle('get-platform', () => platform)

ipcMain.handle('vpn-countries', () => COUNTRIES)

ipcMain.handle('vpn-status', async () => {
  if (isMac) {
    const out = await run('scutil --nc list')
    for (const line of out.split('\n')) {
      if (line.includes(VPN_PROFILE)) {
        if (line.includes('(Connected)'))    return 'Connected'
        if (line.includes('(Connecting)'))   return 'Connecting'
        if (line.includes('(Disconnecting)'))return 'Disconnecting'
      }
    }
    return 'Disconnected'
  }
  
  // Windows: Check ExpressVPN status via CLI if available
  // expressvpn status returns output like "Connected to USA - New York"
  try {
    const out = await runWin('expressvpn', ['status'])
    if (out.toLowerCase().includes('connected')) return 'Connected'
    if (out.toLowerCase().includes('connecting')) return 'Connecting'
    if (out.toLowerCase().includes('disconnecting')) return 'Disconnecting'
    return 'Disconnected'
  } catch (err) {
    console.error('VPN status check failed:', err)
    return 'Unavailable'
  }
})

ipcMain.handle('vpn-connect', async (_, countryCode) => {
  if (isMac) {
    await run(`open "expressvpn://"`)
    await new Promise(r => setTimeout(r, 800))
    await run(`scutil --nc start "${VPN_PROFILE}"`)
    return { success: true }
  }
  
  // Windows: Use ExpressVPN CLI to connect
  try {
    await runWin('expressvpn', ['connect', countryCode])
    return { success: true }
  } catch (err) {
    console.error('VPN connect failed:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('vpn-disconnect', async () => {
  if (isMac) {
    await run(`scutil --nc stop "${VPN_PROFILE}"`)
    return { success: true }
  }
  
  // Windows: Use ExpressVPN CLI to disconnect
  try {
    await runWin('expressvpn', ['disconnect'])
    return { success: true }
  } catch (err) {
    console.error('VPN disconnect failed:', err)
    return { success: false, error: err.message }
  }
})

let win

app.whenReady().then(() => {
  const windowOptions = {
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  }
  
  // Platform-specific window styling
  if (isMac) {
    windowOptions.titleBarStyle = 'hiddenInset'
  } else {
    // Windows: Use default title bar or custom frame
    windowOptions.frame = true
  }
  
  win = new BrowserWindow(windowOptions)

  win.loadFile('index.html')

  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    blocker.enableBlockingInSession(session.defaultSession)
    app.on('session-created', s => blocker.enableBlockingInSession(s))
    console.log('[blocker] active on', platform)
  }).catch(err => console.error('[blocker] error:', err))
})

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (isMac) {
    // Standard macOS behavior: don't quit on window close
    // The app can be quit via Command+Q
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS: Create window when dock icon is clicked and no windows are open
  if (isMac && BrowserWindow.getAllWindows().length === 0) {
    if (!win) {
      const windowOptions = {
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webviewTag: true,
          preload: path.join(__dirname, 'preload.js'),
        }
      }
      win = new BrowserWindow(windowOptions)
      win.loadFile('index.html')
    }
  }
})
