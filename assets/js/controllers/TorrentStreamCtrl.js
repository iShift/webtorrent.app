
angular.module('webtorrent').controller('TorrentStreamCtrl', function (
  $scope, $routeParams)
{
  var torrent = $scope.torrent = $scope.torrentMap[$routeParams.infoHash]
})

