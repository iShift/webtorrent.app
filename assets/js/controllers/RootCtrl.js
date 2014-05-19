
angular.module('webtorrent').controller('RootCtrl', function (
  $rootScope, webtorrent)
{
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
})

