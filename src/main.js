// electronモジュールを読み込み
const electron = require('electron')
const { app, BrowserWindow, ipcMain, Tray, Menu } = electron;
const is_mac = process.platform==='darwin'

if(is_mac) {
  app.dock.hide()
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
  createMainWindow();
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
      contextIsolation: false,
  }
  })
  mainWindow.setPosition(0, size.height)
  mainWindow.setAlwaysOnTop(true, "screen-saver")
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createInputWindow)
ipcMain.on("mainWindow:create", (event, id) => {
  if (id !== "") {
    mainWindow.webContents.send("mainWindow:create", id);
    inputWindow.close();
    let appIcon = null
    app.whenReady().then(() => {
      appIcon = new Tray(__dirname + '/img/tray.png')
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Your roomID is ' + id, type: 'normal', click: () => {}},
        { label: 'Change roomID', type: 'normal', click: () => {app.relaunch(); app.exit();}},
        { label: 'Quit', type: 'normal', click: () => app.quit()}
      ])
      appIcon.setContextMenu(contextMenu)
    })
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})