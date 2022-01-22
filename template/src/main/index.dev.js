/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', async () => {
  var {default: installExtension, VUEJS_DEVTOOLS} = require('electron-devtools-installer')
  if (process.env.NODE_ENV !== 'production') {
    try {
      await installExtension(VUEJS_DEVTOOLS, {loadExtensionOptions: {allowFileAccess: true}})
    } catch (error) {
      console.error('Failed to install custom devtools; ', error)
    }
  }
})

// Require `main` process to boot app
require('./index')