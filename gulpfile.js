const gulp = require('gulp');

const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const gulpif = require('gulp-if');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const babelify = require('babelify');
const nodemon = require('gulp-nodemon');
const connect = require('gulp-connect');
const browserSync = require('browser-sync').create();
const glob = require('glob');
const clean = require('gulp-clean');

const reload = browserSync.reload;

const production = process.env.NODE_ENV === 'production';
const paths = {
    front: {
        js: 'src/index.js',
        watchJs:'src/!(admin)/*.js',
        css: 'src/css/*.less',
        img: 'src/img/**/*.*'
    },
    admin: {
        js: 'src/admin/js/*.js',
        css: 'src/admin/css/*.less',
        img: 'src/admin/img/*.*',
        vendor:'src/admin/vendor/**/*.*'
    },
    public: {
        js: 'public/js',
        css: 'public/css',
        img: 'public/img'
    },
    server:{
        check:'' ,
        watch:[
            'views/**/*.pug'
            , 'src/**/*.*'
        ]
    },
    clean: 'public',
    normalize: 'node_modules/normalize.css/normalize.css'
};

const dependencies = [
    'react'
    , 'react-dom'
    , 'redux'
    , 'react-redux'
    , 'iscroll'
    , 'jquery'
];

/**
 * Compile third-party dependencies separately for faster performance.
 */
gulp.task('front-vendor', function () {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gulpif(production, uglify({mangle: false})))
        .pipe(gulp.dest(paths.public.js));
});

/**
 * Compile only project files, excluding all third-party dependencies.
 */
gulp.task('front-js', function () {
    return browserify({entries: paths.front.js, debug: true})
        .external(dependencies)
        .transform(babelify, {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulpif(production, uglify({mangle: false})))
        .pipe(gulp.dest(paths.public.js));
});

/**
 * Compile front-less stylesheets.
 */
gulp.task('front-less', function () {
    return gulp.src(paths.front.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less({
            'strict-math': 'on'
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest(paths.public.css));
});

/**
 * Compile bootstrap stylesheets.
 */
gulp.task('admin-vendor', function () {
    return gulp.src(paths.admin.vendor)
        .pipe(gulp.dest('public/vendor'));
});

/**
 * Compile only project files, excluding all third-party dependencies.
 */
gulp.task('admin-js', function () {
    return gulp.src(paths.admin.js)
        .pipe(gulpif(production, uglify({mangle: false})))
        .pipe(gulp.dest(paths.public.js));
});

/**
 * Compile admin-less stylesheets.
 */
gulp.task('admin-less', function () {
    return gulp.src(paths.admin.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less({
            'strict-math': 'on'
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest(paths.public.css));
});

/**
 * Compile images.
 */
gulp.task('images', function () {
    return gulp.src(paths.front.img)
        .pipe(gulp.dest(paths.public.img));
});


/**
 * normalize
 */
gulp.task('normalize', function () {
    return gulp.src(paths.normalize)
        .pipe((gulpif(production, cssmin())))
        .pipe(gulp.dest(paths.public.css));
});

/**
 |--------------------------------------------------------------------------
 | Compile favicon.ico
 |--------------------------------------------------------------------------
 */
gulp.task('favicon', function () {
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('public'));
});

/**
 |--------------------------------------------------------------------------
 | Nodemon
 |--------------------------------------------------------------------------
 */
gulp.task('nodemon', function () {
    nodemon({
        script: 'app.js'
        , ext: 'js'
        , ignore: [
            'public/'
            , 'src/'
            , 'node_modules/'
        ]
        , env: {'NODE_ENV': 'development'}
    })
});

/**
 |--------------------------------------------------------------------------
 | Live reload
 |--------------------------------------------------------------------------
 */
gulp.task('server', ['nodemon'], function () {
    browserSync.init(paths.server.watch, {
        proxy: 'http://localhost:3000',
        notify: false,
        port: 3001
    });

    gulp.watch(paths.server.watch).on("change", reload)

});

/**
 |--------------------------------------------------------------------------
 | Watch for change.
 |--------------------------------------------------------------------------
 */
gulp.task('watch', ['front-js', 'admin-js', 'front-less','admin-less'], function () {
    gulp.watch(paths.front.watchJs, ['front-js']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
    });
    gulp.watch(paths.admin.js, ['admin-js']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
    });
    gulp.watch(paths.front.css, ['front-less']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
    });
    gulp.watch(paths.admin.css, ['admin-less']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
    });
});

/**
 * delete the pre public
 */
gulp.task('clean', function () {
    return gulp.src('public')
        .pipe(clean());
});

/**
 * Produce.
 */
gulp.task('produce', [
    'front-vendor',
    'front-js',
    'front-less',
    'admin-vendor',
    'admin-less',
    'admin-js',
    'images',
    'normalize',
    'favicon'
]);
