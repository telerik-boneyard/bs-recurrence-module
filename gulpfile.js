var gulp = require('gulp');
var browserify = require('browserify');
var mocha = require('gulp-mocha');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var exorcist = require('exorcist');

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/*.js', ['build'], {partial: true});
});

gulp.task('build', function () {
    var main = './src/recurrence.js';

    var bundler = browserify({
        entries: [main],
        debug: true,
        standalone: 'recurrence'
    });

    return bundler.bundle()
        .on('error', console.log)
        .pipe(exorcist('./dist/recurrence.js.map'))
        .pipe(source(main))
        .pipe(rename('./recurrence.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', ['build'], function () {
    return gulp.src('./test/recurrence-test.js')
        .pipe(mocha({
            ui: 'tdd'
        }))
        .once('end', function () {
            process.exit();
        });
});