browser_sync = require('browser-sync').create()
gulp = require 'gulp'
g_autoprefixer = require 'gulp-autoprefixer'
g_coffee = require 'gulp-coffee'
g_concat = require 'gulp-concat'
g_sass = require 'gulp-sass'
g_util = require 'gulp-util'

coffeeOptions =
  bare: true
  join: true

paths =
  coffee:
    source: [
      'bower_components/take-and-make/dist/*.coffee'
      'bower_components/curry/dist/*.coffee'
      'source/**/*.coffee'
    ]
    watch: 'source/**/*.coffee'
    dest: 'public'
  html:
    source: 'source/**/*.html'
    watch: 'source/**/*.html'
    dest: 'public'
  sass:
    source: 'source/style.scss'
    watch: 'source/**/*.scss'
    dest: 'public'

gulp.task 'html', ()->
  gulp.src paths.html.source
    .pipe gulp.dest paths.html.dest
    .pipe browser_sync.stream()

gulp.task 'coffee', ()->
  gulp.src paths.coffee.source
    .pipe g_coffee coffeeOptions
    .on 'error', g_util.log
    .pipe g_concat 'script.js'
    .pipe gulp.dest paths.coffee.dest
    .pipe browser_sync.stream()

gulp.task 'sass', ()->
  gulp.src paths.sass.source
    .pipe g_sass
      errLogToConsole: true
    .pipe g_autoprefixer
      browsers: 'last 2 versions'
      remove: false
      cascade: false
    .pipe gulp.dest paths.sass.dest
    .pipe browser_sync.stream()

gulp.task 'serve', ()->
  browser_sync.init
    server:
      baseDir: "public"
    open: false
    
gulp.task 'default', ['sass', 'coffee', 'html', 'serve'], ()->
  gulp.watch paths.sass.watch, ['sass']
  gulp.watch paths.coffee.watch, ['coffee']
  gulp.watch paths.html.watch, ['html']
