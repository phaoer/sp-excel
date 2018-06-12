var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload')

gulp.task('js', function() {
  return gulp.src('src/*.js')
      .pipe(concat('sp-excel.js'))
      .pipe(uglify())
      .pipe(notify({ message: 'uglify javascript' }))
      .pipe(gulp.dest('dist/'))
      .pipe(notify({ message: 'javascript compile complete' }));
});

gulp.task('clean', function() {
  return gulp.src(['dist/'], {read: false})
      .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.start('js');
});


gulp.task('watch', function() {

  gulp.watch('src/*.js', ['js']);

  livereload.listen();

  gulp.watch(['dist/**','*.html']).on('change', livereload.changed);

});