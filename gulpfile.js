'use strict';
var del = require('del');
var gulp = require('gulp');
var psi = require('psi');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

gulp.task('clean', () => del(['dist/*', '!dist/.git'], { dot: true }));

// HZ
// gulp.task('lint', () =>
//   gulp.src(['src/**/*.js'])
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
// );

gulp.task('speed', (cb) => {
    psi.output('prikaz647.ru').then(cb);
});

gulp.task('pug', () => {
    return gulp.src('src/view/*.pug')
        .pipe($.pug())
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('main.min.js'))
        .pipe($.uglify())
        .pipe($.size({ title: 'js' }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('libs', () => {
    return gulp.src('src/libs/**/*')
        .pipe(gulp.dest('dist/libs/'));
});

gulp.task('misc', () => {
    return gulp.src('src/*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['clean', 'pug', 'js', 'libs', 'misc'], () => {
    browserSync({
        server: {
            baseDir: "dist",
            index: "index.html"
        },
        port: 3000
    });

    gulp.watch(['src/js/*.js'], ['js']);
    gulp.watch(['src/view/**/*'], ['pug']);
    gulp.watch(['src/libs/**/*'], ['libs']);
    gulp.watch(['dist/**/*'], browserSync.reload);
});