
var Database = require('nedb')
var path = require('path')

angular.module('webtorrent').service('database', function () {
  var self = this

  var root = path.join(require('nw.gui').App.dataPath, 'data')
  self.settings = new Database({ filename: path.join(root, 'settings.db'), autoload: true })
  self.torrents = new Database({ filename: path.join(root, 'torrents.db'), autoload: true })

  self.settings.ensureIndex({ fieldName: 'key', unique: true })
  self.torrents.ensureIndex({ fieldName: 'infoHash', unique: true })

  // TODO
})

