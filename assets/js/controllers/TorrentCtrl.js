
angular.module('webtorrent').controller('TorrentCtrl', function (
  $scope, $routeParams)
{
  var torrent = $scope.torrent = $scope.torrentMap[$routeParams.infoHash]
})

