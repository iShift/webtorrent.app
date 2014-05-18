
var gui = require('nw.gui')

var isDebug = (gui.App.argv.indexOf('--debug') > -1)
var isWin   = (process.platform === 'win32')
var isLinux = (process.platform === 'linux')
var isOSX   = (process.platform === 'darwin')

var BUTTON_ORDER = [ 'close', 'min', 'max' ]

if (isWin)   { BUTTON_ORDER = [ 'min', 'max', 'close' ] }
if (isLinux) { BUTTON_ORDER = [ 'min', 'max', 'close' ] }
if (isOSX)   { BUTTON_ORDER = [ 'close', 'min', 'max' ] }

// TODO: render chrome buttons

var win = gui.Window.get()
win.title = 'WebTorrent'
win.focus()

