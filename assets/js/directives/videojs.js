
angular.module('webtorrent').directive('videojs', function () {
  var linker = function (scope, element, attrs) {
    attrs.type = attrs.type || scope.torrent.mime || "video/mp4"

    var setup = {
      techOrder: ['html5', 'flash'],
      controls: true,
      preload: 'auto',
      autoplay: true,
      width: 640,
      height: 480
    }

    var videoid = 107
    attrs.id = "videojs"
    element.attr('id', attrs.id)
    var player = _V_(attrs.id, setup, function () {
      var source = [{
        type: attrs.type,
        src: attrs.src || scope.torrent.streamUrl
      }]
      this.src({type : attrs.type, src: source })
    })

    //console.log("VIDEO CAN PLAY: ", document.createElement('video').canPlayType(attrs.type))
    player.on('error', function (error) {
      console.log(error)
      console.log(player.error())
      console.log(videoError(player.error()))

      alert('Video error: ' + videoError(player.error()))
    })
    scope.$on('$destroy', function () {
      player.dispose()
    })
  }
  return {
    restrict : 'A',
    link : linker
  }
})

function videoError(e) {
  switch (e.code) {
    case e.MEDIA_ERR_ABORTED:
      return 'The video playback was aborted.'
    case e.MEDIA_ERR_NETWORK:
      return 'A network error caused the video download to fail part-way.'
    case e.MEDIA_ERR_DECODE:
      return 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.'
    case e.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'The video format is not supported.'
    default:
      return 'An unknown error occurred.'
   }
}

