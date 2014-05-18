
angular.module('webtorrent').controller('AddTorrentCtrl', function (
  $scope, $modalInstance)
{
  //JH2TF3UY4IIOMTJ7SCNAZIBZ3IFSX45H

  $scope.torrent = {}
  $scope.ok = function () {
    if ($scope.torrent.id) {
      $modalInstance.close($scope.torrent.id)
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel')
  }
})

