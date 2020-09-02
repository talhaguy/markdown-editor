import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    Dialog,
    IpcMainEvent,
} from "electron"
import path from "path"
import { IPCEvent } from "../shared"

console.log("main...", path.join(__dirname, "preload.js"))

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    // and load the index.html of the app.
    win.loadFile("index.html")

    // Open the DevTools.
    win.webContents.openDevTools()
}

// Set allowRendererProcessReuse to false to resolve promises not resolving if app is refreshed
// https://github.com/electron/electron/issues/22119
app.allowRendererProcessReuse = false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function onSelectFolderStart(dialog: Dialog, event: IpcMainEvent) {
    dialog
        .showOpenDialog({
            properties: ["openDirectory"],
            message: "Choose a folder",
        })
        .then((value) => {
            if (!value.canceled) {
                event.sender.send(
                    IPCEvent.SelectFolderSuccess,
                    value.filePaths[0]
                )
                return
            }
            event.sender.send(IPCEvent.SelectFolderCancel)
        })
}

ipcMain.on(
    IPCEvent.SelectFolderStart,
    ((dialog) => (event: IpcMainEvent) => onSelectFolderStart(dialog, event))(
        dialog
    )
)
