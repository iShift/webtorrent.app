
angular.module('webtorrent', [
  'ngRoute',
  'ngTable',
  'ui.bootstrap'
])

angular.module('webtorrent').config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl : '/assets/html/home.html',
    controller  : 'HomeCtrl'
  }).when('/torrent/:infoHash/stream', {
    templateUrl : '/assets/html/torrent-stream.html',
    controller  : 'TorrentStreamCtrl'
  }).otherwise({
    redirectTo: '/'
  })

  $locationProvider.html5Mode(true)
})

angular.module('webtorrent').config(['$compileProvider', function ($compileProvider) {
  // NOTE (travis): prevent angular from adding unsafe: to local trigger.io resources
  // which would otherwise use an unrecognized/nonstandard content: prefix.
  var regex = /^\s*(https?|ftp|mailto|file|tel|content|blob):|data:image|/
  $compileProvider.imgSrcSanitizationWhitelist(regex)
  $compileProvider.aHrefSanitizationWhitelist(regex)
}])

