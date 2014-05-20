
var gui = require('nw.gui')
var fs  = require('fs')

var isDebug = (gui.App.argv.indexOf('--debug') > -1)
var isWin   = (process.platform === 'win32')
var isLinux = (process.platform === 'linux')
var isOSX   = (process.platform === 'darwin')

var BUTTON_ORDER = [ 'close', 'min', 'max' ]

if (isWin)   { BUTTON_ORDER = [ 'min', 'max', 'close' ] }
if (isLinux) { BUTTON_ORDER = [ 'min', 'max', 'close' ] }
if (isOSX)   { BUTTON_ORDER = [ 'close', 'min', 'max' ] }

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
    $("#header").html(_.template(header, { buttons: BUTTON_ORDER }))
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
  $('body').tooltip({
    selector: "*[data-toggle^='tooltip']"
  })

  /**
   * Drag & Drop torrent onto window
   */
  window.ondragover = function(e) { e.preventDefault(); return false }
  window.ondrop = function(e) { e.preventDefault(); return false }

  var holder = $('body')[0]
  holder.ondragover = function () { this.classList.add('dragging'); return false; }
  holder.ondragend = function ()  { this.classList.remove('dragging'); return false; }
  holder.ondrop = function (e) {
    e.preventDefault()

    var file = e.dataTransfer.files[0]
    if (file.name.indexOf(".torrent") !== -1) {
      var reader = new FileReader()

      reader.onload = function () {
        var filename = gui.App.dataPath + '/' + file.name
        var content = reader.result
        fs.writeFile(filename, content, function (err) {
          if (err) {
            window.alert("Error Loading Torrent: " + err)
          } else {
            console.log(filename)
            // TODO: add torrent
          }
        })
      }
      reader.readAsBinaryString(file)
    }

    return false
  }

  holder.onpaste = function (e) {
    var data = e.clipboardData.getData('text/plain')

    if (data.substring(0,8) == "magnet:?") {
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

