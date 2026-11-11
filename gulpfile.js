const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const cp = require('child_process');

/**
 * Compile and minify sass
 */
function styles() {
  return gulp
    .src(['_sass/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/css'));
}

function stylesVendors() {
  return gulp
    .src(['_sass/vendors/*.css'])
    .pipe(concat('vendors.min.css'))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(gulp.dest('assets/css'));
}

/**
 * Compile and minify js
 */
function scripts() {
  return gulp
    .src(['_js/app.js'])
    .pipe(rename('app.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/js'));
}

function scriptsVendors() {
  return gulp
    .src(['_js/vendors/*.js'])
    .pipe(concat('vendors.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(gulp.dest('assets/js'));
}

/**
 * Server functionality handled by BrowserSync
 */
function browserSyncServe(done) {
  browserSync.init({
    server: '_site',
    port: 4000
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

/**
 * Build Jekyll site
 */
function jekyll(done) {
  return cp
    .spawn(
      'bundle',
      [
        'exec',
        'jekyll',
        'build',
        '--incremental',
        '--config=_config.yml,_config_dev.yml'
      ],
      {
        stdio: 'inherit'
      }
    )
    .on('close', done);
}

/**
 * Watch source files for changes & recompile
 * Watch html/md files, run Jekyll & reload BrowserSync
 */
function watchData() {
  gulp.watch(
    ['_data/*.yml', '_config.yml', 'assets/*.json'],
    gulp.series(jekyll, browserSyncReload)
  );
}

function watchMarkup() {
  gulp.watch(
    ['index.html', '_includes/*.html', '_layouts/*.html'],
    gulp.series(jekyll, browserSyncReload)
  );
}

function watchScripts() {
  gulp.watch(['_js/*.js'], scripts);
}

function watchStyles() {
  gulp.watch(['_sass/*.scss'], styles);
}

const compile = gulp.parallel(styles, stylesVendors, scripts, scriptsVendors);
const serve = gulp.series(compile, jekyll, browserSyncServe);
const watch = gulp.parallel(watchData, watchMarkup, watchScripts, watchStyles);

/**
 * `gulp build` compiles the assets that get committed to assets/.
 * Running just `gulp` also builds Jekyll, launches BrowserSync & watches files.
 */
exports.build = compile;
exports.default = gulp.parallel(serve, watch);
