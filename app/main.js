var electron  = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var app = electron.app;
var ipc = electron.ipcMain;
var myAppMenu, menuTemplate;

function toggleWindow(whichWindow) {
    if(whichWindow.isVisible()) {
        whichWindow.hide();
    } else {
        whichWindow.show();
    }
}


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

    menuTemplate= [
        {
            label: 'Wisdom Pet',
            submenu: [
                {
                    label: 'About this App',
                    accelerator: 'Ctrl+I',
                    click(item) {
                        toggleWindow(infoWindow);
                    }
                },
                {
                    label: 'Add Appointment',
                    accelerator: 'Ctrl+N',
                    click(item, focusedWindow) {
                        if(focusedWindow) focusedWindow.webContents.send('addAppointment');
                    }
                },
                {
                    role: 'help',
                    label: 'Our Website',
                    click() {electron.shell.openExternal('http://raybo.org')}
                },
                {role: 'close'},
                {role: 'quit'}
            ]
        }, {
            label: 'View',
            submenu: [
              {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                  if (focusedWindow) focusedWindow.reload()
                }
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                  if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
              },
              {type: 'separator'},
              {role: 'resetzoom'},
              {role: 'zoomin'},
              {role: 'zoomout'},
              {type: 'separator'},
              {role: 'togglefullscreen'}
            ]
          }, {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectall' }
            ]
        }
    ]

    myAppMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(myAppMenu);
});


