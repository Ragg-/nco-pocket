import g from "gulp";
import bs from "browser-sync";
import {spawn} from "child_process";
import webpack from "webpack";
const $ = require("gulp-load-plugins")();

const option = require("./gulp_config/gulp");

const buildPath = (dir, ext, withinDirs) => {
    if (withinDirs == null) {
        withinDirs = [];
    }
    if (ext != null && ext[0] !== ".") {
        ext = "." + ext;
    }
    if (dir != null && dir !== "") {
        dir = dir + "/";
    }
    return [
        option.sourceDir + "/" + dir + "**/*" + ext,
        "!" + option.sourceDir + "/" + dir + "**/_*" + ext,
        "!" + option.sourceDir + "/" + dir + "_*/**"
    ].concat(withinDirs);
};

export function runWebpack(done) {
    webpack(require("./gulp_config/webpack"), (err, stats) => {
        if (stats.compilation.errors.length > 0) {
            console.log(stats.compilation.errors.map(e => e.toString()).join('\n'));
        }
        done(err);
    });
};

export function vendor_js() {
    return g.src(buildPath("vendor_js", ".js"), {since: g.lastRun('vendor_js')})
        .pipe($.plumber())
        .pipe(g.dest(option.publishDir + "/" + option.js.vendorJsDir + "/"));
};

export function fonts_copy() {
    return g.src(buildPath("fonts", ".{ttf,otf,eot,woff,svg}"), {since: g.lastRun('fonts_copy')})
        .pipe($.plumber())
        .pipe(g.dest(option.publishDir + "/fonts/"));
};

export function css_copy() {
    return g.src(buildPath("style", ".css"), {since: g.lastRun('css_copy')})
        .pipe($.plumber())
        .pipe(g.dest(option.publishDir + "/css/"));
};

export function stylus() {
    return g.src(buildPath("style", ".styl"), {since: g.lastRun('stylus')})
        .pipe($.plumber())
        .pipe($.stylus(require("./gulp_config/stylus")))
        .pipe(g.dest(option.publishDir + "/css/"));
};

export function pug() {
    return g.src(buildPath("", "pug", ["!" + option.sourceDir + "/scripts/**/*.pug"]), {since: g.lastRun('pug')})
        .pipe($.plumber())
        .pipe($.pug())
        .pipe($.prettify())
        .pipe(g.dest(option.publishDir + "/"));
};

export function images() {
    return g.src(buildPath("img", ".{png,jpg,jpeg,gif}"), {since: g.lastRun('images')})
        .pipe($.imagemin(require("./gulp_config/imagemin")))
        .pipe(g.dest(option.publishDir + "/img/"));
};

export function watch() {
    g.watch(option.sourceDir + "/scripts/**/*.{jsx,js,pug}", g.series(runWebpack));
    g.watch(option.sourceDir + "/vendor_js/**/*.js", g.series(vendor_js));
    g.watch(option.sourceDir + "/fonts/**/*.{ttf,otf,eot,woff,svg}", g.series(fonts_copy));
    g.watch(option.sourceDir + "/css/**/*.css", g.series(css_copy));
    g.watch(option.sourceDir + "/style/**/*.styl", g.series(stylus));
    g.watch([
        option.sourceDir + "/**/*.pug",
        "!" + option.sourceDir + "/scripts/**/*.pug"
    ], g.series(pug));
    g.watch(option.sourceDir + "/img/**/*.{png,jpg,jpeg,gif}", g.series(images));
};

export function run() {
    spawn("node", ["index.js", "-p", "8000"], {
        cwd: process.cwd()
    });
};

export function runBrowserSync(cb) {
    bs({
        port: 3000,
        open: false,
        notify: false,
        files: option.publishDir + "/**",
        index: "index.html",
        server: {
            baseDir: option.publishDir
        }
    });
    cb();
}

const self_watch = g.series(runBrowserSync, (cb) => {
    var command, args, proc;

    if (/^win/.test(process.platform)) {
        command = "cmd";
        args = ["/c", "./node_modules/.bin/gulp", "devel"];
    } else {
        command = "./node_modules/.bin/gulp";
        args = ["devel"];
    }

    const spawnChildren = () => {
        if (proc != null) proc.kill();
        proc = spawn(command, args, {stdio: 'inherit'});
    };

    $.watch(["gulpfile.babel.js", "./gulp_config/**"], spawnChildren);
    $.watch([option.publishDir + "/**/*"], () => bs.reload({stream: true}));

    spawnChildren();
    cb();
});

const build = g.parallel(runWebpack, stylus, pug, images, fonts_copy, css_copy);
export {build};

const devel = g.series(build, watch, run);
export {devel};

export default self_watch;
