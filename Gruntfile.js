/**
 * Called from gulpfile.js
 *
 * TODO: remove Gruntfile completely once non-grunt version of node-webkit-builder
 * is widely supported.
 */

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    nodewebkit: {
      options: {
        version: '0.9.2',
        build_dir: './build',
        mac_icns: 'assets/img/icon.icns',
        mac: true,
        win: true,
        linux32: true,
        linux64: true
      },
      src: './dist/**/*'
    }
  })

  grunt.loadNpmTasks('grunt-node-webkit-builder')
}

