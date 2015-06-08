gulp = require 'gulp'
autoprefixer = require 'gulp-autoprefixer'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
debug = require 'gulp-debug'
gutil = require 'gulp-util'
sass = require 'gulp-sass'
serve = require 'gulp-serve'

coffeeOptions =
  bare: true
  join: true

paths =
  coffee:
    source: 'source/**/*.coffee'
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

gulp.task 'coffee', ()->
  gulp.src paths.coffee.source
    .pipe coffee(coffeeOptions).on('error', gutil.log)
    .pipe concat 'script.js'
    .pipe gulp.dest paths.coffee.dest

gulp.task 'sass', ()->
  gulp.src paths.sass.source
    .pipe sass
      errLogToConsole: true
    .pipe autoprefixer
      browsers: 'last 2 versions'
      remove: false
      cascade: false
    .pipe gulp.dest paths.sass.dest

gulp.task 'serve', serve
  root: 'public'
  redirect: true

gulp.task 'default', ['sass', 'coffee', 'html', 'serve'], ()->
  gulp.watch paths.sass.watch, ['sass']
  gulp.watch paths.coffee.watch, ['coffee']
  gulp.watch paths.html.watch, ['html']
