# ![WebTorrent](https://raw.github.com/feross/webtorrent.app/master/assets/img/webtorrent-logo.gif)
[![build](https://img.shields.io/travis/feross/webtorrent.app.svg)](https://travis-ci.org/feross/webtorrent.app)
[![npm](https://img.shields.io/npm/v/webtorrent.app.svg)](https://npmjs.org/package/webtorrent.app)
[![gittip](https://img.shields.io/gittip/feross.svg)](https://www.gittip.com/feross/)

### WebTorrent.app - Streaming bittorrent client for OS X, Windows, and Linux

Note: this app is a very early work in progress. It currently only supports adding a single torrent and streaming torrent videos, but it will eventually be a full-fledged streaming bittorrent client ala [Vuze](http://www.vuze.com/) or [uTorrent](http://www.utorrent.com/) with the added benefit of being built off of [webtorrent](http://webtorrent.io). This means that seeders of the app will be facilitating plugin-free web-based bittorrent over [WebRTC](http://www.webrtc.org/)!

Please see the list of [issues](https://github.com/feross/webtorrent.app/issues) tracking the project's status. Contributions are very welcome, even if it's just trying the app out and reporting bugs :)

### Structure

Webtorrent.app is a [node-webkit](https://github.com/rogerwang/node-webkit) [angularjs](https://angularjs.org/) application built off of [webtorrent](http://webtorrent.io). An underlying webtorrent client, which manages the actual bittorrent connections and downloading, is spawned as a child process that communicates with the main node-webkit app via websockets courtesy of [express.io](http://express-io.org/) ([express](http://expressjs.com/)+[socket.io](http://socket.io/)).

The app bootstraps by loading index.html, and it's reasonably easy to follow the logic from there.

### Building

Install [bower](http://bower.io/) (web package manager) and [gulp](http://gulpjs.com/) (build system). Note that you do not need to install grunt; the Gruntfile exists strictly as an internal workaround for building the node-webkit app.

```
npm install -g bower gulp nodewebkit
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

You can now run `npm start` to run the local version of the app. This is mainly used for debugging during development.

To build release distributions, run

```
gulp nodewebkit
```

This will build executables for Windows, Mac OS, 32-bit Linux, and 64-bit Linux under `build/releases/webtorrent`.


### License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).

![Magic](https://raw.github.com/feross/webtorrent.app/master/assets/img/logo.png)
