var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var electron = require('electron-connect').server.create();

var srcDir = './client/src';
var libDir = './client/build';

// jsファイルのコンパイル。
gulp.task('compile', function(){
    browserify(srcDir + '/app.js', {debug: true})
      .transform(babelify.configure({
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }))
      .bundle()
      .on("error", function(err){
        console.log("Error : "+err.message);
      })
      .pipe(source('app.js'))
      .pipe(gulp.dest(libDir));
});

// コンパイルしてElectron起動
gulp.task('start', ['compile'], function(){
  // electron開始
  electron.start();
  // ファイルが変更されたら再コンパイル
  gulp.watch(srcDir + '/**/*.{js,jsx}', ['compile']);
  // BrowserProcessが読み込むファイルが変更されたらRestart。
  gulp.watch(['main.js'], electron.restart);
  // RendererProcessが読み込むファイルが変更されたらReload。
  gulp.watch(['client/' + 'index.html', libDir + '/**/*.{html,js,css}'], electron.reload);
});
