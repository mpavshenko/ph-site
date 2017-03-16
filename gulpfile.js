'use strict';
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var ftp = require('vinyl-ftp');
var ftpConf = require('./ftp-conf.js');

const dist = 'docs/'


gulp.task('deploy', function() {
    var conn = ftp.create(ftpConf);
    return gulp.src([`${dist}**/*`], { base: dist, buffer: false })
        .pipe(conn.newer(ftpConf.folder))
        .pipe(conn.dest(ftpConf.folder));
});

gulp.task('clean', () => del([`${dist}*`, `!${dist}.git`], { dot: true }));

gulp.task('pug', () => {
    return gulp.src('src/view/*.pug')
        .pipe($.pug())
        .pipe(gulp.dest(dist));
});

// gulp.task('js', () => {
//     return gulp.src('src/js/*.js')
//         .pipe($.sourcemaps.init())
//         .pipe($.babel())
//         .pipe($.concat('main.min.js'))
//         .pipe($.uglify())
//         .pipe($.size({ title: 'js' }))
//         .pipe($.sourcemaps.write('.'))
//         .pipe(gulp.dest(`${dist}js/`));
// });

gulp.task('libs', () => {
    return gulp.src('src/libs/**/*')
        .pipe(gulp.dest(`${dist}libs/`));
});

gulp.task('images', () => {
    return gulp.src('src/images/*')
        .pipe(gulp.dest(`${dist}images/`));
});

gulp.task('styles', () => {
    return gulp.src('src/styles/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        // .pipe($.concatCss('site.css'))
        .pipe(gulp.dest(`${dist}styles`));
});

gulp.task('build', (cb) => $.sequence('clean', ['pug', 'styles', 'libs', 'images'])(cb));
gulp.task('bd', (cb) => $.sequence('build', 'deploy')(cb));

gulp.task('serve', ['build'], () => {
    browserSync({
        server: {
            baseDir: dist,
            index: "index.html"
        },
        port: 3000
    });

    gulp.watch(['src/styles/*.scss'], ['styles']);
    // gulp.watch(['src/js/*.js'], ['js']);
    gulp.watch(['src/view/**/*'], ['pug']);
    gulp.watch(['src/libs/**/*'], ['libs']);
    gulp.watch(['src/images/*'], ['images']);
    gulp.watch([`${dist}/**/*`], browserSync.reload);
});

// JS lint
// gulp.task('lint', () =>
//   gulp.src(['src/**/*.js'])
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
// );

// Page speed
// var psi = require('psi');
// gulp.task('speed', (cb) => {
//     psi.output('prikaz647.ru').then(cb);
// });
