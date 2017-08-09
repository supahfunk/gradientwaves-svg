'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver'),
    header = require('gulp-header'),
    gulpIncludeTemplate = require("gulp-include-template"),
    tfs = require('gulp-tfs'),
    refresh = require('gulp-refresh');


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
        .pipe(gulp.dest('./dist/css'))
        .pipe(refresh());
    // minify
    //.pipe(cssmin())
    //.pipe(rename({ suffix: '.min' }))
    //.pipe(gulp.dest('./css'));
});


/*****************
*** SASS WATCH ***
******************/
gulp.task('sass:watch', function () {
    var watcher = gulp.watch('./sass/**/*.scss', ['sass']);
    refresh.listen();
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/*********
*** JS ***
**********/
gulp.task('js', function () {
    console.log('MINIFYING JS');
    return gulp.src('./js/main.js')
        // minify
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'));
});


/***************
*** JS WATCH ***
****************/
gulp.task('js:watch', function () {
    var watcher = gulp.watch('./js/main.js', ['js']);
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
        }));
});


/************
*** START ***
*************/
gulp.task('start', ['webserver', 'sass', 'sass:watch']);