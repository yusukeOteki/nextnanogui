const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs");

let win;
const info_path = path.join(__dirname, '/userData.json');

const client = require('electron-connect').client;

const loadDevtool = require('electron-load-devtool');

var ipc = require('electron').ipcMain;
let regexp = /.*\.(dat)$/i;

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
                "contents": fs.readdirSync(directoryPath + "/" + file).map(function (file2) {
                    if (/.*\.(dat)$/i.test(file2)) {
                        return ({
                            "type": "file",
                            "name": file2,
                            "checked": false
                        })
                    }
                }).filter(item => item)
            })
        } else if (/.*\.(dat)$/i.test(file)) {
            return ({
                "type": "file",
                "name": file,
                "checked": false
            })
        }
    }).filter(item => item && (item.type === 'file' || (item.type === 'directory' && item.contents.length)));
    event.sender.send('mul-async-dialog-replay', directoryPath, album, 0);
});

ipc.on('saveInputFile', function (event, arg, content) {
    fs.writeFileSync(arg, content, 'utf8')
    //event.sender.send('openInputFile-replay', arg[0], JSON.stringify(JSON.parse(fs.readFileSync(arg[0], 'utf8'))));
});

ipc.on('openInputFile', function (event, arg) {
    event.sender.send('openInputFile-replay', arg[0], fs.readFileSync(arg[0], 'utf8'));
});

ipc.on('readDat', function (event, arg) {
    event.returnValue = fs.readFileSync(arg, 'utf8');
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

    loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);

    win.on('close', function () {
        fs.writeFileSync(info_path, JSON.stringify(win.getBounds()));
    });

    //ウィンドウが閉じられると発生します。
    win.on('closed', () => {
        win = null
    });

    win.webContents.openDevTools();

    client.create(win);
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