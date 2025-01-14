{{#if_eq eslintConfig 'standard'}}
'use strict'

{{/if_eq}}
import { app, BrowserWindow } from 'electron'{{#if_eq eslintConfig 'airbnb'}} // eslint-disable-line{{/if_eq}}
{{#isEnabled plugins 'vuex-electron'}}
import '../renderer/store'
{{/isEnabled}}

ipcMain.on('memoryUsage', (event) => {
    function logBytes (x) {
        return [x[0], x[1]]
    }
    
    let oe = Object.entries(process.memoryUsage()).map(logBytes)
    let total = 0
    let mapped = oe.map(e => parseFloat(e[1]))
    for (let i = 0; i < mapped.length; i++) {
        total += mapped[i]
    }
    oe.push(['total', total])
    let data = Object.fromEntries(oe)
    event.returnValue = data
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\'){{#if_eq eslintConfig 'airbnb'}} // eslint-disable-line{{/if_eq}}
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1600,
    allowRendererProcessReuse: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.allowRendererProcessReuse = false
app.on('ready', createWindow)

app.on('ready', () => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''))
    callback(pathname)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
{{#if_eq builder 'builder'}}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
{{/if_eq}}
