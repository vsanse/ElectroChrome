var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('scss', function () {
    return gulp.src('./renderer/css/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./renderer/css/'));
});

gulp.task('default',['scss'], function () {
    gulp.watch('./renderer/css/*.scss', ['scss']);
});
