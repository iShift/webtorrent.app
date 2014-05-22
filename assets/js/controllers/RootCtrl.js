
angular.module('webtorrent').controller('RootCtrl', function (
  $rootScope, webtorrent)
{
  var fs = require('fs')

  //webtorrent.add('JH2TF3UY4IIOMTJ7SCNAZIBZ3IFSX45H')
  $rootScope.safeApply = function (fn) {
    var phase = this.$root.$$phase
    if (phase == '$apply' || phase == '$digest') {
      if (fn && typeof(fn) === 'function') {
        fn()
      }
    } else {
      this.$apply(fn)
    }
  }

  $rootScope.torrentMap = {}
  $rootScope.torrents = []

  function addTorrent (data) {
    var id = data.infoHash
    if (!(id in $rootScope.torrentMap)) {
      data.numPeers = 0
      $rootScope.safeApply(function () {
        $rootScope.torrentMap[id] = data
        $rootScope.torrents.push(data)
      })
    }
  }
  webtorrent.on('addTorrent', addTorrent)

  webtorrent.on('error', function (data) { console.log(data) })
  webtorrent.on('torrent:metadata:update', function (data) {
    var torrent = $rootScope.torrentMap[data.infoHash]

    $rootScope.safeApply(function () {
      torrent.numPeers = data.numPeers
    })
  })

  webtorrent.on('torrent:update', function (data) {
    var torrent = $rootScope.torrentMap[data.infoHash]
    if (!torrent) return addTorrent(data)

    $rootScope.safeApply(function () {
      $rootScope.torrentMap[data.infoHash] = $rootScope.torrents[$rootScope.torrents.indexOf(torrent)] = _.extend(torrent, data)
    })
  })

  /**
   * Handle drag & drop of .torrent files onto app window
   */
  function isValidTorrent(e) {
    var file = e.dataTransfer.files[0]
    if (file.name.indexOf(".torrent") !== -1) {
      return file
    } else {
      return null
    }
  }

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
            webtorrent.add(filename)
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
      webtorrent.add(data)
    }
    return true
  }
})

