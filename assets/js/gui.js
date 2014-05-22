
var gui = require('nw.gui')
var fs  = require('fs')

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

  function isValidTorrent(e) {
    var file = e.dataTransfer.files[0]
    if (file.name.indexOf(".torrent") !== -1) {
      return file
    } else {
      return null
    }
  }

  /**
   * Drag & Drop torrent onto window
   */
  window.ondragover = function (e) {
    if (isValidTorrent(e)) {
      $('body').addClass('dragging')
    }
    return false
  }

  window.ondragend = function ()  {
    // TODO: this isn't being triggered
    $('body').removeClass('dragging')
    return false
  }

  window.ondrop = function (e) {
    $('body').removeClass('dragging')
    e.preventDefault()

    var file = isValidTorrent(e)
    if (file) {
      var reader = new FileReader()

      reader.onload = function () {
        var filename = gui.App.dataPath + '/' + file.name
        var content = reader.result
        fs.writeFile(filename, content, function (err) {
          if (err) {
            // TODO: more user-friendly error handling
            window.alert("Error Loading Torrent: " + err)
          } else {
            console.log("addTorrent", filename)
            // TODO: add torrent
          }
        })
      }
      reader.readAsBinaryString(file)
    }

    return false
  }

  window.onpaste = function (e) {
    var data = e.clipboardData.getData('text/plain')

    if (data.substring(0,8) === "magnet:?") {
      console.log(data)
      // TODO: add torrent
    }
    return true
  }
})

// Show 404 page on uncaughtException
process.on('uncaughtException', function (err) {
  window.console.error(err, err.stack)
})

