'use strict'

process.env.NODE_ENV = 'production'

var { say } = require('cfonts')
var chalk = require('chalk')
var del = require('del')
{{#if_eq builder 'packager'}}
var packager = require('electron-packager')
{{else}}
var { spawn } = require('child_process')
{{/if_eq}}
var webpack = require('webpack')
var Listr = require('listr')


var mainConfig = require('./webpack.main.config')
var rendererConfig = require('./webpack.renderer.config')
var webConfig = require('./webpack.web.config')
var Multispinner = require('multispinner')

var doneLog = chalk.bgGreen.white(' DONE ') + ' '
var errorLog = chalk.bgRed.white(' ERROR ') + ' '
var okayLog = chalk.bgBlue.white(' OKAY ') + ' '
var isCI = process.env.CI || false

if (process.env.BUILD_TARGET === 'clean') clean()
else if (process.env.BUILD_TARGET === 'web') web()
else build()

function clean () {
  del.sync(['build/*', '!build/icons', '!build/icons/icon.*'])
  console.log(`\n${doneLog}\n`)
  process.exit()
}

async function build () {
  greeting()

  del.sync(['dist/electron/*', '!.gitkeep'])

  var m = new Multispinner(['main', 'renderer'], {
    preText: 'building',
    postText: 'process'
  })

  let results = ''

  var tasks = new Listr(
    [
      {
        title: 'building master process',
        task: async () => {
          await pack(mainConfig)
            .then(result => {
              results += result + '\n\n'
            })
            .catch(err => {
              console.log(`\n  ${errorLog}failed to build main process`)
              console.error(`\n${err}\n`)
            })
        }
      },
      {
        title: 'building renderer process',
        task: async () => {
          await pack(rendererConfig)
            .then(result => {
              results += result + '\n\n'
            })
            .catch(err => {
              console.log(`\n  ${errorLog}failed to build renderer process`)
              console.error(`\n${err}\n`)
            })
        }
      }
    ],
    { concurrent: 2 }
  )

  await tasks
    .run()
    .then(() => {
      process.stdout.write('\x1B[2J\x1B[0f')
      console.log(`\n\n${results}`)
      console.log(`${okayLog}take it away ${chalk.yellow('`electron-builder`')}\n`)
      process.exit()
    })
    .catch(err => {
      process.exit(1)
    })
}

function pack (config) {
  return new Promise((resolve, reject) => {
    config.mode = 'production'
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        })
        .split(/\r?\n/)
        .forEach(line => {
          err += `    ${line}\n`
        })

        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

{{#if_eq builder 'packager'}}
function bundleApp () {
  buildConfig.mode = 'production'
  packager(buildConfig, (err, appPaths) => {
    if (err) {
      console.log(`\n${errorLog}${chalk.yellow('`electron-packager`')} says...\n`)
      console.log(err + '\n')
    } else {
      console.log(`\n${doneLog}\n`)
    }
  })
}

{{/if_eq}}
function web () {
  del.sync(['dist/web/*', '!.gitkeep'])
  webConfig.mode = 'production'
  webpack(webConfig, (err, stats) => {
    if (err || stats.hasErrors()) console.log(err)

    console.log(stats.toString({
      chunks: false,
      colors: true
    }))

    process.exit()
  })
}

function greeting () {
  var cols = process.stdout.columns
  let text = ''

  if (cols > 85) text = 'lets-build'
  else if (cols > 60) text = 'lets-|build'
  else text = false

  if (text && !isCI) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  lets-build'))
  console.log()
}
