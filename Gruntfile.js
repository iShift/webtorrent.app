/**
 * Called from gulpfile.js
 *
 * TODO: remove Gruntfile completely once non-grunt version of node-webkit-builder
 * is widely supported.
 */

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./dist/package.json'),
    nodewebkit: {
      options: {
        build_dir: './build',
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

