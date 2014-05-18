# ![WebTorrent](https://raw.github.com/feross/webtorrent.app/master/assets/img/webtorrent-logo.gif)
[![build](https://img.shields.io/travis/feross/webtorrent.app.svg)](https://travis-ci.org/feross/webtorrent)
[![npm](https://img.shields.io/npm/v/webtorrent.app.svg)](https://npmjs.org/package/webtorrent)
[![gittip](https://img.shields.io/gittip/feross.svg)](https://www.gittip.com/feross/)

### WebTorrent.app - Streaming bittorrent client for OS X, Windows, and Linux

Note: this app is a very early work in progress. It is a node-webkit angularjs application built off of [webtorrent](https://github.com/feross/webtorrent).


### Todo for basic app
  * Move webtorrent client into worker thread! Currently, the node-webkit UI starts to freeze up once a torrent ramps up and starts consuming most of the thread's resources.
  * Test basic app on all platforms: Windows, ~~Mac OS~~, Linux32, Linux64
  * Remove tmp files on exit
  * Support streaming: video, audio. Note that video streaming is currently in a broken state after converting from a webapp to a node-webkit app.
  * Build out interface and add functionality

### Building

Install bower (web package manager) and gulp (build system). Note that you do not need to install grunt; the Gruntfile exists strictly as an internal workaround for building the node-webkit app.

```
npm install -g bower gulp
```

Initialize dependencies.

```
npm install
bower install
```

Compile local distribution.

```
gulp
```

Build release distribution.

```
gulp nodewebkit
```

This will build executables for Windows, Mac OS, 32-bit Linux, and 64-bit Linux under `build/releases/webtorrent`.


### License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).

![Magic](https://raw.github.com/feross/webtorrent.app/master/assets/img/logo.png)
