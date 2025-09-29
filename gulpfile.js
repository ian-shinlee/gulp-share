
const { src, dest, series, watch } = require('gulp');
const fs = require("fs");
const path = require("path");

const gulp = require('gulp');
const rename = require("gulp-rename");

//path
const paths = {
    dist: 'dist/',
    dist_css: 'dist/css',
    dist_img: 'dist/img',
    dist_html: 'dist/html',

    src: 'src/',
    src_css: 'src/css/',
    src_scss: 'src/scss/',
    src_img: 'src/img/',
    src_img_ori: 'src/img_ori',
    src_js: 'src/js/',
    src_html: 'src/html/',

    sprite_png: 'src/sprites/png',
    sprite_svg: 'src/sprites/svg',

    // gulpconfig: 'gulpconfig/',
    // stats_src: 'src/stats/',
    // reports_src: 'src/reports/'
};
function changePath() { // path 조절용
    return rename(function(file) {
        file.dirname = path.dirname('.');
    })
}

// ejs
const ejs = require("gulp-ejs");
function makeHTML5file (cb) {
    return gulp
        .src(path.join(paths.src_html, '**/*.html'))
        .pipe(ejs())
        .pipe(changePath())
        .pipe(gulp.dest(path.join(paths.dist_html)))
}

// index: 산출물 리스트

// browserSnyc
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
function makeDevServer(cb) {
    browserSync.init({
        server: {
            baseDir: paths.dist_html,
            directory: true
        }
    });
    gulp.watch('src/scss/**/*', makeCSSfile);
    gulp.watch('src/html/**/*', makeHTML5file);
    gulp.watch('src/html/**/*').on('change', browserSync.reload);
    cb();
}

// scss
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob-use-forward"); // for dart-sass
const dartSass = require("dart-sass");
const postcss = require("gulp-postcss"); // to make css files
const Fiber = require("fibers");
const purgecss = require('gulp-purgecss')
sass.compiler = dartSass;
const autoprefixer = require("autoprefixer");
const autoprefixerBrowsers = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.3'
];

async function makeCSSfile(cb) {
    let options = {
        sass: {
            outputStyle: 'expanded',
            indentType: 'space',
            indentWidth: 2,
            fiber: Fiber
        },
        postcss: [ autoprefixer({
            overrideBrowserslist: autoprefixerBrowsers,
        }) ]
    }
    return src(path.join(paths.src_scss, '**/*.scss'))
            .pipe(sassGlob())
            .pipe(sass(options.sass).on('error', sass.logError))
            .pipe(postcss(options.postcss))
            .pipe(changePath())
            .pipe(dest(paths.src_css))
            .pipe(browserSync.stream());
}

// minify CSS
const cleanCss = require("gulp-clean-css");
function minifyCSSfile(cb) {
    return src(path.join(paths.src_css, '*.css'))
            .pipe(purgecss({
                content: ['./dist/html/*.html']
                // content: [path.join(paths.dist_html, '*.html')]
            }))
            .pipe(cleanCss({
                // https://github.com/clean-css/clean-css#minify-method
                format: { // 멀티 라인으로 제작해줌
                    breaks: {
                        afterRuleEnds: 1,
                    }
                },
                level: {
                    2: {
                        mergeSemantically: false, // controls semantic merging; defaults to false
                        removeEmpty: false, // controls removing empty rules and nested blocks; defaults to `true`
                        overrideProperties: false, // controls property overriding based on understandability; defaults to true
                        mergeIntoShorthands: false, // controls merging properties into shorthands; defaults to true
                    }
                }
            }))
            .pipe(changePath())
            .pipe(dest(paths.dist_css));
}

// image min
const newer = require("gulp-newer"); //새로운 이미지만 선별
const imagemin = require("gulp-imagemin");
const imageminPngquant = require('imagemin-pngquant');
function makeImageMin(cb) {
    return src(path.join(paths.src_img_ori, '**/*'))
            .pipe(newer(path.join(paths.src_img)))
            .pipe(imagemin([
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imageminPngquant({
                    quality: [0.7, 0.7]
                })
            ], {verbose: true}))
            .pipe(changePath())
            .pipe(dest(path.join(paths.src_img)));
}

// npm run develop
exports.default = series(
    makeHTML5file,
    makeCSSfile,
    makeImageMin,
    makeDevServer,
)
// npm run build
exports.build = series(
    makeHTML5file,
    makeCSSfile,
    minifyCSSfile,
    makeImageMin,
);