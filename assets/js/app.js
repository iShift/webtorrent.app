/**
 * Angular application initialization
 */

angular.module('webtorrent', [
  'ngRoute',
  'ngTable',
  'ui.bootstrap'
])

angular.module('webtorrent').config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl : '/assets/html/home.html',
    controller  : 'HomeCtrl'
  }).when('/torrent/:infoHash', {
    templateUrl : '/assets/html/torrent.html',
    controller  : 'TorrentCtrl'
  }).when('/torrent/:infoHash/stream', {
    templateUrl : '/assets/html/torrent-stream.html',
    controller  : 'TorrentStreamCtrl'
  }).otherwise({
    redirectTo: '/'
  })

  $locationProvider.html5Mode(true)
})

// TODO: in node-webkit 0.9.2, this anularjs routing workaround may no longer be necessary
angular.module('webtorrent').config(['$compileProvider', function ($compileProvider) {
  // prevent angular from adding unsafe: to local resources which would otherwise
  // use an unrecognized / nonstandard file: prefix
  var regex = /^\s*(https?|ftp|mailto|file|tel|content|blob):|data:image|/
  $compileProvider.imgSrcSanitizationWhitelist(regex)
  $compileProvider.aHrefSanitizationWhitelist(regex)
}])

