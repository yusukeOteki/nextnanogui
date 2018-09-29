const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs");

let win;
const info_path = path.join(__dirname, '/userData.json');

var ipc = require('electron').ipcMain;
var directoryPath = ""; //初期値
var filePath = "";
var album = null;
var index = 0;
let regexp = /.*\.(jpg|jpeg|png|gif)$/i;

function fileRead() {
    if (!album) {
        album = fs.readdirSync(directoryPath);
        album = album.map(function (file) {
            if (fs.statSync(directoryPath + "/" + file).isDirectory()) {
                return ({
                    "name": file,
                    "contents": fs.readdirSync(directoryPath + "/" + file).filter(function (file2) { return regexp.test(file2) })
                })
            } else {
                if (regexp.test(file)) { return file };
            }
        });
    }
    console.log(album)
    filePath = directoryPath + "/" + album[index];
    index += 1;
    if (index >= album.length) {
        index = 0;
    }
}

ipc.on('mul-async', function (event) {
    // console.log(arg);
    fileRead();
    event.sender.send('mul-async-replay', filePath);
});

ipc.on('mul-async-dialog', function (event, arg) {
    if (!arg) { return; } // cancel selected
    const directoryPath = arg[0];
    let album = fs.readdirSync(directoryPath);
    album = album.map(function (file) {
        if (fs.statSync(directoryPath + "/" + file).isDirectory()) {
            return ({
                "type": "directory",
                "name": file,
                "opened": false,
                "contents": fs.readdirSync(directoryPath + "/" + file).map(function (file2) { return ({
                    "type": "file",
                    "name": file2,
                    "checked": false
                })})
            })
        } else {
            return ({
                "type": "file",
                "name": file,
                "checked": false
            })
        }
    });
    event.sender.send('mul-async-dialog-replay', directoryPath, album);
});

ipc.on('saveInputFile', function (event, arg, content) {
    console.log(arg)
    console.log(content)
    fs.writeFileSync(arg, content, 'utf8')
    //event.sender.send('openInputFile-replay', arg[0], JSON.stringify(JSON.parse(fs.readFileSync(arg[0], 'utf8'))));
});

ipc.on('openInputFile', function (event, arg) {
    event.sender.send('openInputFile-replay', arg[0], JSON.stringify(JSON.parse(fs.readFileSync(arg[0], 'utf8'))));
});

function createWindow() {
    // ブラウザウィンドウを作成します。
    let bounds_info;
    try {
        bounds_info = JSON.parse(fs.readFileSync(info_path, 'utf8'));
    }
    catch (e) {
        bounds_info = { width: 1200, height: 1000 };  // デフォルトバリュー
    }
    win = new BrowserWindow(bounds_info);
    
    win.setMenu(null);

    //アプリケーションのindex.htmlをロードします。
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/client/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('close', function () {
        fs.writeFileSync(info_path, JSON.stringify(win.getBounds()));
    });

    //ウィンドウが閉じられると発生します。
    win.on('closed', () => {
        win = null
    });

    win.webContents.openDevTools();
}
//このメソッドは、Electronが初期化を終了し、ブラウザウィンドウを作成する準備ができたときに呼び出されます。
app.on('ready', createWindow);

//すべてのウィンドウが閉じられると終了します。
app.on('window-all-closed', () => {
    // MacOSでは、ユーザーがCmd + Qで明示的に終了するまでプロセスは生き続ける
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // MacOSでは、ウィンドウを全て閉じても、プロセスは生き続け、
    // ドックアイコンをクリックすると、再表示される。
    if (win === null) {
        createWindow();
    }
});