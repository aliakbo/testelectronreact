var electron  = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var ipc = electron.ipcMain;

app.on('ready', function() {
    var appWindow, infoWindow;
    appWindow = new BrowserWindow({
        show: false
    });
    appWindow.loadURL('file://' + __dirname + '/index.html');

    infoWindow = new BrowserWindow({
        width: 400,
        height: 300,
        transparent: true,
        frame: false,
        show: false
    });
    infoWindow.loadURL('file://' + __dirname + '/info.html');

    appWindow.once('ready-to-show', function() {
        appWindow.show();
        //infoWindow.show();
    });

    ipc.on('closeInfoWindow', function(event, arg){
        event.returnValue= "";
        infoWindow.hide();
    });

    ipc.on('openInfoWindow', function(event, arg){
        event.returnValue= "";
        infoWindow.show();
    });
});


