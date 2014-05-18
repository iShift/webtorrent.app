
angular.module('webtorrent').controller('HomeCtrl', function (
  $scope, webtorrent, ngTableParams, $modal)
{
  $scope.torrentsTable = new ngTableParams({}, { counts: [] })

  $scope.addTorrent = function () {
    var modalInstance = $modal.open({
      templateUrl: '/assets/html/add-torrent.html',
      controller: 'AddTorrentCtrl',
      resolve: {
        items: function () {
          return $scope.items
        }
      }
    })

    modalInstance.result.then(function (torrentId) {
      webtorrent.add(torrentId)
    })
  }
})

