// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secWindow,loginCred = {
  username:"",
  password:"",
  canceled:false,
  isUpdate:false
}
let mainMenu = Menu.buildFromTemplate(require("./menus/menu"));
Menu.setApplicationMenu(mainMenu);
let contextMenu = Menu.buildFromTemplate([
    {
        label: "Inspect",
        role: "toggleDevTools",
        accelerator: "F12"
    },
    {
        label: "Full Screen",
        role: "toggleFUllScreen"
    }
]);

ipcMain.on("loginchannel",(e,args)=>{
  loginCred = args;
  console.log(loginCred)
})

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });
  // Create the browser window.
  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      safeDialogs: true,
      // allowRunningInsecureContent: true 
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./renderer/main.html')

  mainWindow.webContents.on("context-menu", e => {
    contextMenu.popup();
  });
  mainWindow.setTitle("");

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  mainWindowState.manage(mainWindow);

  mainWindow.webContents.on('did-finish-load',()=>{
    mainWindow.webContents.send("loginchannel","test")
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('certificate-error', (event, webContents, url, error, certificate, callback)=>{
  event.preventDefault();
  callback(true);
  
})

app.on('login', (event, webContents, request, authInfo, callback) => {
  event.preventDefault()
  console.log(callback,)
  secWindow = new BrowserWindow({
    width:200,
    height:200,
    parent:mainWindow,
    modal:true,
    webPreferences: {
      nodeIntegration: true
      }
  });
  secWindow.loadFile('./renderer/secondarywindows/login.html');
  ipcMain.on("loginchannel",(e,args)=>{
    loginCred = args;
    if(loginCred.canceled){
      callback()
    }
    else{
      callback(loginCred.username, loginCred.password);
    }
    secWindow = null;
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.