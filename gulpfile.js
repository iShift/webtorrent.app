var gulp      = require('gulp')
var gulpGrunt = require('gulp-grunt')
var less      = require('gulp-less')
var minifyCSS = require('gulp-minify-css')
var clean     = require('gulp-clean')
var rename    = require('gulp-rename')
var replace   = require('gulp-replace')
var concat    = require('gulp-concat')
var imagemin  = require('gulp-imagemin')
var debug     = require('gulp-debug')
var jshint    = require('gulp-jshint')
var shell     = require('gulp-shell')

/* ---------------------------------------------------------------------
 * Paths and globs used in tasks
 * --------------------------------------------------------------------- */

var paths = {
  root  : './',
  src   : {},
  dest  : {},
  build : {}
}

// source files
paths.src.root                   = paths.root + 'assets/'
paths.src.index                  = paths.root + 'index.html'
paths.src.scripts                = paths.src.root + 'js/**/*.js'
paths.src.fonts                  = paths.src.root + 'fonts/*'
paths.src.images                 = paths.src.root + 'img/*'
paths.src.stylesRoot             = paths.src.root + 'css/'
paths.src.styles                 = paths.src.stylesRoot + '**/*.less'
paths.src.stylesEntryFile        = paths.src.stylesRoot + 'app.less'
paths.src.templates              = paths.src.root + 'html/*'
paths.src.bowerDependencies      = paths.src.root + 'third-party/**'
paths.src.nodeDependencies       = [ paths.root + 'node_modules', paths.root + 'package.json' ]

// local distribution
paths.dest.root                  = './dist/'
paths.dest.assetsRoot            = paths.dest.root + 'assets/'
paths.dest.stylesRoot            = paths.dest.assetsRoot + 'css'
paths.dest.fontsRoot             = paths.dest.assetsRoot + 'fonts'
paths.dest.imagesRoot            = paths.dest.assetsRoot + 'img'
paths.dest.scriptsRoot           = paths.dest.assetsRoot + 'js'
paths.dest.templatesRoot         = paths.dest.assetsRoot + 'html'
paths.dest.bowerDependenciesRoot = paths.dest.assetsRoot + 'third-party'

// release builds
paths.build.root                 = './build/releases/webtorrent/'
paths.build.linux32              = paths.build.root + 'linux32/webtorrent/libffmpegsumo.so'
paths.build.linux64              = paths.build.root + 'linux64/webtorrent/libffmpegsumo.so'
paths.build.mac                  = paths.build.root + 'mac/webtorrent.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so'
paths.build.win                  = paths.build.root + 'win/webtorrent/ffmpegsumo.dll'

/* ---------------------------------------------------------------------
 * Import grunt tasks (needs to come before Gulp tasks)
 * --------------------------------------------------------------------- */

// TODO: remove this once non-grunt version of grunt-node-webkit-builder is ready
gulpGrunt(gulp, { base: './' })

/* ---------------------------------------------------------------------
 * App top-level gulp tasks
 * --------------------------------------------------------------------- */

gulp.task('default', [ 'compile' ])

// depends on this task existing in the Gruntfile
gulp.task('nodewebkit', [ 'grunt-nodewebkit', 'ffmpeg' ])

gulp.task('compile', [
  'fonts',
  'images',
  'scripts',
  'styles',
  'templates',
  'index',
  'node-dependencies',
  'bower-dependencies'
])

gulp.task('clean', function () {
  gulp.src([ paths.dest.root, paths.build.root ], { read: false })
    .pipe(clean())
})

gulp.task('compile-watch', [ 'compile' ], function () {
  gulp.watch(paths.src.nodeDependencies, [ 'node-dependencies' ])
  gulp.watch([ paths.src.bowerDependencies ], [ 'bower-dependencies' ])
  gulp.watch([ paths.src.fonts ], [ 'fonts' ])
  gulp.watch([ paths.src.images ], [ 'images' ])
  gulp.watch([ paths.src.scripts ], [ 'scripts' ])
  gulp.watch([ paths.src.styles ], [ 'styles' ])
  gulp.watch([ paths.src.templates ], [ 'templates' ])
  gulp.watch([ paths.src.index ], [ 'index' ])
})

gulp.task('lint', function () {
  // Generate a nice report of all lint errors
  gulp.src(paths.src.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
})

/* ---------------------------------------------------------------------
 * Sub gulp tasks
 * --------------------------------------------------------------------- */

var nodeModuleTasks = [ 'mkdir -p ' + paths.dest.root ]
paths.src.nodeDependencies.forEach(function (path) {
  nodeModuleTasks.push('cp -rf ' + path + ' ' + paths.dest.root + '  &> /dev/null||echo')
})
gulp.task('node-dependencies', shell.task(nodeModuleTasks))

// TODO: sometimes gulp.src hits a stack overflow error if there are too many input files,
// such as for the node-dependencies. this is apparently a known issue. Using gulp-shell
// to copy node-dependencies as a temporary workaround.
//gulp.task('node-dependencies', function () {
//  gulp.src(paths.src.nodeDependencies, { base: paths.root })
//    .pipe(gulp.dest(paths.dest.root))
//})

gulp.task('bower-dependencies', function () {
  gulp.src(paths.src.bowerDependencies)
    .pipe(gulp.dest(paths.dest.bowerDependenciesRoot))
})

gulp.task('scripts', function () {
  gulp.src(paths.src.scripts)
    .pipe(gulp.dest(paths.dest.scriptsRoot))
})

gulp.task('fonts', function () {
  gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dest.fontsRoot))
})

gulp.task('images', function () {
  gulp.src(paths.src.images)
    //.pipe(imagemin())
    .pipe(gulp.dest(paths.dest.imagesRoot))
})

gulp.task('styles', function () {
  gulp.src(paths.src.stylesEntryFile)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dest.stylesRoot))
})

gulp.task('index', function () {
  gulp.src(paths.src.index)
    .pipe(gulp.dest(paths.dest.root))
})

gulp.task('templates', function () {
  gulp.src(paths.src.templates)
    .pipe(gulp.dest(paths.dest.templatesRoot))
})

// overwrite node-webkit's version of ffmpeg with our own to support more codecs.
// see https://github.com/rogerwang/node-webkit/wiki/Support-mp3-and-h264-in-video-and-audio-tag
gulp.task('ffmpeg', [ 'grunt-nodewebkit' ], shell.task([
  'cp -f ' + 'lib/mac/ffmpegsumo.so' + ' "' + paths.build.mac + '"',
  'cp -f ' + 'lib/win/ffmpegsumo.dll' + ' "' + paths.build.win + '"',
  'cp -f ' + 'lib/linux32/libffmpegsumo.so' + ' "' + paths.build.linux32 + '"',
  'cp -f ' + 'lib/linux64/libffmpegsumo.so' + ' "' + paths.build.linux64 + '"'
]))

