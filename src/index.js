const electron = require('electron')
const path = require('path');
const { app, BrowserWindow, ipcMain, Tray, Menu, clipboard} = electron;
const is_darwin = process.platform==='darwin';

app.disableHardwareAcceleration();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// if user is on mac, don't show dock icon
if(is_darwin) {
  app.dock.hide();
}

let inputWindow
function createInputWindow () {
  inputWindow = new electron.BrowserWindow({
    width: 512,
    height: 512,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  inputWindow.loadURL(`file://${__dirname}/input.html`);
}

let mainWindow
function createMainWindow() {
  const Screen = electron.screen
  const size = Screen.getPrimaryDisplay().size
  mainWindow = new BrowserWindow({
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    transparent: true,
    frame: false,
    resizable:false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  // mainWindow.setPosition(0, size.height)
  mainWindow.setAlwaysOnTop(true, "screen-saver")
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

let linkWindow
function createLinkWindow(id) {
  linkWindow = new electron.BrowserWindow({
    width: 512,
    height: 512,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  linkWindow.webContents.once('did-finish-load', () => {
    linkWindow.webContents.send('linkWindow:create', id);
  });
  linkWindow.loadURL(`file://${__dirname}/showLink.html`);
}

app.on('ready', createInputWindow);

ipcMain.on("mainWindow:create", (event, ws_url) => {
  if (ws_url !== "") {
    createMainWindow();

    mainWindow.webContents.send("mainWindow:create", ws_url);
    inputWindow.close();
    let appIcon = null
    app.whenReady().then(() => {
      appIcon = new Tray(__dirname + '/img/tray.png')
      const contextMenu = Menu.buildFromTemplate([
        // { label: 'Your RoomID is ' + ws_url, type: 'normal', click: () => {}},
        // { label: "Show Your Room's Link", type: 'normal', click: () => { createLinkWindow(id); }},
        // { label: 'Copy Room URL', type: 'normal', click: () => { clipboard.writeText("https://api.gaya-on.com/room/" + id); }},
        { label: 'Change roomID', type: 'normal', click: () => { app.relaunch(); app.exit(); }},
        { label: 'Quit', type: 'normal', click: () => app.quit()}
      ])
      appIcon.setContextMenu(contextMenu)
    })
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
