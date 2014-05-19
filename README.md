# ![WebTorrent](https://raw.github.com/feross/webtorrent.app/master/assets/img/webtorrent-logo.gif)
[![build](https://img.shields.io/travis/feross/webtorrent.app.svg)](https://travis-ci.org/feross/webtorrent)
[![npm](https://img.shields.io/npm/v/webtorrent.app.svg)](https://npmjs.org/package/webtorrent)
[![gittip](https://img.shields.io/gittip/feross.svg)](https://www.gittip.com/feross/)

### WebTorrent.app - Streaming bittorrent client for OS X, Windows, and Linux

Note: this app is a very early work in progress. It is a node-webkit angularjs application built off of [webtorrent](https://github.com/feross/webtorrent).

Please see the list of [issues](https://github.com/feross/webtorrent.app/issues) tracking for project status. Contributions are very welcome :)

### Building

Install bower (web package manager), gulp (build system), and nodewebkit (only necessary for debug, non-release builds). Note that you do not need to install grunt; the Gruntfile exists strictly as an internal workaround for building the node-webkit app.

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

You can now run `npm start` which will run `nodewebkit dist` on the local distribution. This is mainly used for debugging during development.

To build release distributions, run

```
gulp nodewebkit
```

This will build executables for Windows, Mac OS, 32-bit Linux, and 64-bit Linux under `build/releases/webtorrent`.


### License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).

![Magic](https://raw.github.com/feross/webtorrent.app/master/assets/img/logo.png)
