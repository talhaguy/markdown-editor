import path from "path"
import { BrowserWindow, App } from "electron"

export function createWindowAfterReady(
    nodePath: typeof path,
    process: NodeJS.Process
) {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: nodePath.join(__dirname, "preload.js"),
            // needs to be true for spectron to be able to access `app.browserWindow` and `app.client` properties
            enableRemoteModule:
                process.env.NODE_ENV === "spectron" ? true : false,
        },
    })

    // and load the index.html of the app.
    win.loadFile(nodePath.join(__dirname, "index.html"))

    // Open the DevTools.
    // win.webContents.openDevTools()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
export function onAllWindowsClosed(app: App) {
    if (process.platform !== "darwin") {
        app.quit()
    }
}

export function onActivate(
    browserWindow: typeof BrowserWindow,
    createWindowAfterReady: () => void
) {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow.getAllWindows().length === 0) {
        createWindowAfterReady()
    }
}
