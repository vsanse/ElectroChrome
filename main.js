// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow,
    secWindow,
    offscreenWindow,
    loginCred = {
        username: "",
        password: "",
        canceled: false,
        isUpdate: false
    };
let mainMenu = Menu.buildFromTemplate(require("./menus/menu"));
Menu.setApplicationMenu(mainMenu);
let contextMenu = Menu.buildFromTemplate([
    {
        label: "Full Screen",
        role: "toggleFUllScreen"
    }
]);

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });
    // Create the browser window.
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            safeDialogs: true
            // allowRunningInsecureContent: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile("./renderer/main.html");

    mainWindow.webContents.on("context-menu", e => {
        contextMenu.popup();
    });
    mainWindow.setTitle("");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    mainWindowState.manage(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on(
    "certificate-error",
    (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);
    }
);

app.on("login", (event, webContents, request, authInfo, callback) => {
    event.preventDefault();
    secWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow,
        resizable: false,
        modal: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    secWindow.loadFile("./renderer/windows/login.html");
    ipcMain.once("loginchannel", (e, args) => {
        loginCred = args;
        if (loginCred.canceled) {
            callback();
        } else {
            callback(loginCred.username, loginCred.password);
        }
        secWindow = null;
    });
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

ipcMain.on("windowchannel", (e, args) => {
    offscreenWindow = new BrowserWindow({
        width: args.width,
        height: args.height,
        fullscreenable: false,
        enableLargerThanScreen: true,
        show: false,
        webPreferences:{
          offscreen: true
        }
    });
    offscreenWindow.loadURL(args.url);

    offscreenWindow.webContents.on("did-finish-load", function() {
        var code =
            "var r = {}; \
                     r.pageWidth = document.body.offsetWidth;\
                    r.pageHeight = document.body.offsetHeight; \
                    r;";
        offscreenWindow.webContents.executeJavaScript(code, false, function(r) {
            let pageMeta = {};
            pageMeta.captureHeight = r.pageHeight;
            pageMeta.captureWidth = r.pageWidth;
            offscreenWindow.setSize(pageMeta.captureWidth, pageMeta.captureHeight);
            offscreenWindow.webContents.capturePage(img => {
                console.log("heere");
                fs.writeFile(
                    `${app.getPath("desktop")}/temp2.jpg`,
                    img.toJPEG(100),
                    err => {
                        if (err) {
                            throw err;
                        } else {
                            console.log(
                                `file saved at`,
                                app.getPath("desktop")
                            );
                        }
                        offscreenWindow.close();
                        offscreenWindow = null;
                    }
                );
            });
        });
    });
});
