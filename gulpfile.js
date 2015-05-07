/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('clean', require('del').bind(null,
  ['.tmp', 'script.js', 'script.min.js', 'style.css']));

gulp.task('serve', ['build'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'examples'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'src/**/*',
    'examples/**/*'
  ]).on('change', reload);

  gulp.watch('src/**/*.js', ['core']);
  gulp.watch('src/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('examples/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('examples'));
});

gulp.task('styles', function() {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('core', ['styles'], function() {
  return gulp.src('src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.uglify())
    .pipe($.concat('script.min.js'))
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['core'], function () {
  return gulp.src('src/**/*.js').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
