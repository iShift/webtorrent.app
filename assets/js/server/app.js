#!/usr/bin/env node

/**
 * Run as a child process of the main node-webkit app, this process manages the
 * webtorrent client and communicates back to the node-webkit app via websockets
 * courtesy of socket.io.
 *
 * TODO: make ports customizable via commandline parameters.
 */

var WebTorrent = require('webtorrent')
var numeral    = require('numeral')
var address    = require('network-address')
var moment     = require('moment')
var express    = require('express.io')

var app = express()
app.http().io()
app.listen(9001)

var client = new WebTorrent({ quiet: true })
client.server.listen(9000)

app.io.route('addTorrent', function (req) {
  client.add(req.data.torrentId, req.data.opts)
})

client.on('addTorrent', function (torrent) {
  var started = Date.now()
  app.io.broadcast('addTorrent', { infoHash: torrent.infoHash })

  function updateMetadata () {
    app.io.broadcast('torrent:metadata:update', {
      infoHash: torrent.infoHash,
      numPeers: torrent.swarm.numPeers
    })
  }

  torrent.swarm.on('wire', updateMetadata)

  client.on('torrent', function (t) {
    if (torrent !== t) return
    torrent.swarm.removeListener('wire', updateMetadata)

    var href = 'http://' + address() + ':' + client.server.address().port + '/'
    var swarm = torrent.swarm
    var wires = swarm.wires
    var hotswaps = 0

    torrent.on('hotswap', function () {
      hotswaps++
    })

    function active (wire) {
      return !wire.peerChoking
    }

    function bytes (num) {
      return numeral(num).format('0.0b')
    }

    function getRuntime () {
      return Math.floor((Date.now() - started) / 1000)
    }

    function update (done) {
      if (torrent._destroyed) {
        clearInterval(updateId)
        return
      }

      var unchoked = swarm.wires.filter(active)
      var runtime = getRuntime()
      var speed = swarm.downloadSpeed()
      var percentDone = swarm.downloaded / torrent.length
      var estimatedSecondsRemaining = Math.max(0, torrent.length - swarm.downloaded) / (speed > 0 ? speed : -1)
      var estimate = moment.duration(estimatedSecondsRemaining, 'seconds').humanize()

      app.io.broadcast('torrent:update', {
        infoHash: torrent.infoHash,
        name: torrent.name,
        runtime: runtime,
        done: !!done,
        streamable: true,
        streamUrl: href,
        mime: client.mime,
        percentDone: 100 * percentDone,
        downloadSpeed: bytes(speed) + '/s',
        downloadSpeedRaw: speed,
        numUnchoked: unchoked.length,
        numPeers: wires.length,
        downloaded: bytes(swarm.downloaded),
        downloadedRaw: swarm.downloaded,
        length: bytes(torrent.length),
        lengthRaw: torrent.length,
        uploaded: bytes(swarm.uploaded),
        uploadedRaw: swarm.uploaded,
        eta: estimate,
        etaRaw: estimatedSecondsRemaining,
        peerQueueSize: swarm.numQueued,
        wires: wires.map(function (wire) {
          return {
            addr: wire.remoteAddress,
            downloaded: bytes(wire.downloaded),
            downloadedRaw: wire.downloaded,
            downloadSpeed: bytes(wire.downloadSpeed()),
            downloadSpeedRaw: wire.downloadSpeed(),
            choked: wire.peerChoking
          }
        })
      })
    }

    var updateId = setInterval(update, 100)
    update()

    torrent.once('done', function () {
      clearInterval(updateId)
      update(true)
    })
  })
})

