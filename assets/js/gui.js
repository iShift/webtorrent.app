
var gui = require('nw.gui')
var win = gui.Window.get()

win.title = 'WebTorrent'
win.focus()

// Developer Shortcuts
Mousetrap.bind([ 'ctrl+d', 'shift+f12', 'f12' ], function () {
  win.showDevTools()
})

Mousetrap.bind([ 'ctrl+r', 'f11' ], function () {
  win.reloadIgnoringCache()
})

$(document).ready(function () {
  // render chrome buttons
  $.get('/assets/html/header.html').then(function (header) {
    var buttons = {
      win32: [ 'min', 'max', 'close' ],
      linux: [ 'min', 'max', 'close' ],
      darwin: [ 'close', 'min', 'max' ]
    }[process.platform]

    $("#header").html(_.template(header, { buttons: buttons }))
    spinningLogo({}).paintTo(".spinning-logo")

    // Maximize, minimize
    $('.btn-os.os-max').on('click', function () {
      if (win.isFullscreen) {
        win.toggleFullscreen()
      } else {
        if (screen.availHeight <= win.height) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    })

    $('.btn-os.os-min').on('click', function () {
      win.minimize()
    })

    $('.btn-os.os-close').on('click', function () {
      win.close()
    })

    $('.btn-os.fullscreen').on('click', function () {
      win.toggleFullscreen()
      $('.btn-os.fullscreen').toggleClass('active')
    })
  })

  // enable tooltips
  //$('body').tooltip({ selector: "*[data-toggle^='tooltip']" })
})

// Show 404 page on uncaughtException
process.on('uncaughtException', function (err) {
  window.console.error(err, err.stack)
})

