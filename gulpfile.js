'use strict';

const del = require('del');
const gulp = require('gulp');
const ect = require('gulp-ect');
const watch = require('gulp-watch');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

//
// functions
//

function styles()
{
  return gulp.src('./src/css/app.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'));
}

function js()
{
  return gulp.src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'));
}

function startEct()
{
  return gulp.src('./src/*.ect')
    .pipe(ect())
    .pipe(gulp.dest('./build/'));
}

function images()
{
  return gulp.src('./src/img/*.{png,jpg,svg}')
    .pipe(gulp.dest('./build/img/'));
}

function imagesWatch()
{
  return watch('./src/img/*.{jpg,png,svg}', function () 
  {
    images();
  });
}

function startUsemin()
{
  return gulp.src('./build/*.html')
    .pipe(usemin())
    .pipe(gulp.dest('./build/'));
}


//
// tasks
//

gulp.task('clean', function()
{
  return del(['./build/']);
});

gulp.task('styles:build', ['clean'], styles);
gulp.task('styles:dev', styles);

gulp.task('js:build', ['clean'], js);
gulp.task('js:dev', js);

gulp.task('ect:build', ['clean'], startEct);
gulp.task('ect:dev', startEct);

gulp.task('images:build', ['clean'], images);
gulp.task('images:dev', imagesWatch);

gulp.task('usemin:build', ['clean', 'ect:build'], startUsemin);
gulp.task('usemin:dev', startUsemin);

gulp.task('browser-sync', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  gulp.watch("./build/*.html").on('change', browserSync.reload);
});

gulp.task('watch', ['build'], function()
{
  gulp.watch('./src/**/*.styl', ['styles:dev']);
  gulp.watch('./src/**/*.js', ['js:dev']);
  gulp.watch('./src/**/*.ect', ['ect:dev']);
  gulp.watch('./build/**/*.html', ['usemin:dev']);
});

gulp.task('build', ['clean', 'styles:build', 'js:build', 'ect:build', 'images:build', 'usemin:build']);
gulp.task('dev', ['build', 'images:dev', 'watch', 'browser-sync']);
