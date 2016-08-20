// gulp-stylus Examples
// https://github.com/stevelacy/gulp-stylus#examples

const option = require("./gulp");
const nib = require("nib");

module.exports = {
    use         : [nib()],
    compress    : true,
    sourcemap   : {
        // inline      : true,
        sourceRoot  : "css/",
    },
}
