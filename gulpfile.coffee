autoprefixer = require 'gulp-autoprefixer'
browserSync = require('browser-sync').create()
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
debug = require 'gulp-debug'
gulp = require 'gulp'
gutil = require 'gulp-util'
sass = require 'gulp-sass'
serve = require 'gulp-serve'

coffeeOptions =
  bare: true
  join: true

paths =
  coffee:
    source: ['bower_components/take-and-make/dist/*.coffee', 'source/**/*.coffee']
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
    .pipe browserSync.stream()

gulp.task 'coffee', ()->
  gulp.src paths.coffee.source
    .pipe coffee(coffeeOptions).on('error', gutil.log)
    .pipe concat 'script.js'
    .pipe gulp.dest paths.coffee.dest
    .pipe browserSync.stream()

gulp.task 'sass', ()->
  gulp.src paths.sass.source
    .pipe sass
      errLogToConsole: true
    .pipe autoprefixer
      browsers: 'last 2 versions'
      remove: false
      cascade: false
    .pipe gulp.dest paths.sass.dest
    .pipe browserSync.stream()

gulp.task 'serve', ()->
  browserSync.init
    server:
      baseDir: "public"
    
gulp.task 'default', ['sass', 'coffee', 'html', 'serve'], ()->
  gulp.watch paths.sass.watch, ['sass']
  gulp.watch paths.coffee.watch, ['coffee']
  gulp.watch paths.html.watch, ['html']
