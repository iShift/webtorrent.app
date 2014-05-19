
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var cp = require('child_process')
var q = require('q')

inherits(Client, EventEmitter)

function Client () {
  var self = this
  if (!(self instanceof Client)) return new Client()
  EventEmitter.call(self)

  // start the express server running webtorrent in a child process and attempt to connect to it
  var script = process.cwd() + '/assets/js/server/app.js'
  var child  = cp.exec('node ' + script, function (error, stdout, stderr) {
    console.log('child process died; error', error)
    console.log('child process died; stdout', stdout)
    console.log('child process died; stderr', stderr)
  })

  process.on('SIGINT',  function () { child.kill('SIGINT')  })
  process.on('SIGTERM', function () { child.kill('SIGTERM') })

  var deferredSocket = q.defer()
  var numConnectionAttempts = 0
  self.socketP = deferredSocket.promise

  function onConnectError (err) {
    if (numConnectionAttempts++ > 5) {
      deferredSocket.reject(err)
    } else {
      setTimeout(tryConnect, 100 * numConnectionAttempts)
    }
  }

  function tryConnect () {
    var socket
    try {
      socket = io.connect('http://localhost:9001')
    } catch (e) {
      onConnectError(e)
    }

    socket.on('connect', function () {
      console.log('successfully connected to socket server', socket, numConnectionAttempts)
      deferredSocket.resolve(socket)
    })
    socket.on('connect_error', onConnectError)
    socket.on('connect_timeout', function () { onConnectError(new Error('timeout')) })
  }
  setTimeout(tryConnect, 1000)

  self.socketP.then(function (socket) {
    socket.on('addTorrent', function (torrent) {
      self.emit('addTorrent', torrent)
    })
    socket.on('torrent:metadata:update', function (torrent) {
      self.emit('torrent:metadata:update', torrent)
    })
    socket.on('torrent:update', function (torrent) {
      self.emit('torrent:update', torrent)
    })
  })
}

Client.prototype.add = function (torrentId, opts) {
  var self = this
  self.socketP.then(function (socket) {
    socket.emit('addTorrent', { torrentId: torrentId, opts: opts })
  })
}

angular.module('webtorrent').service('webtorrent', Client)

