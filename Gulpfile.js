'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    babel_polyfill = require('babel-polyfill'),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver'),
    header = require('gulp-header'),
    gulpIncludeTemplate = require("gulp-include-template"),
    tfs = require('gulp-tfs');


/***********************
*** TFS GET LATEST ***
************************/
gulp.task('getLatest:all', function () {
    return gulp.src([
        './css/*',
        './sass/**/*'
    ])
    .pipe(tfs.get());
});


/***********
*** SASS ***
************/
gulp.task('sass', function () {
    console.log('COMPILING SASS');
    return gulp.src([
        './src/scss/*.scss'
    ])
        .pipe(plumber(function (error) {
            console.log('sass error: compile plumber', error);
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Explorer >= 10', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
                cascade: false
            })
        )
        .pipe(sourcemaps.write())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist/css'));
    // minify
    //.pipe(cssmin())
    //.pipe(rename({ suffix: '.min' }))
    //.pipe(gulp.dest('./css'));
});


/*****************
*** SASS WATCH ***
******************/
gulp.task('sass:watch', function () {
    var watcher = gulp.watch('./src/scss/main.scss', ['sass']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/*********
*** JS ***
**********/
gulp.task('js', function () {
    console.log('COMPILING JS');
    gulp.src('src/js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
});


/***************
*** JS WATCH ***
****************/
gulp.task('js:watch', function () {
    var watcher = gulp.watch('./src/js/main.js', ['js']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/****************
*** WEBSERVER ***
*****************/
gulp.task('webserver', function () {
    return gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            host: 'localhost',
            port: 8080,
            open: 'index.html'
        })
    );
});


/************
*** START ***
*************/
gulp.task('start', ['webserver', 'sass', 'sass:watch', 'js', 'js:watch']);