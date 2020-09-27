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

    win.loadFile(nodePath.join(__dirname, "index.html"))
}

export function onAllWindowsClosed(app: App) {
    if (process.platform !== "darwin") {
        app.quit()
    }
}

export function onActivate(
    browserWindow: typeof BrowserWindow,
    createWindowAfterReady: () => void
) {
    if (browserWindow.getAllWindows().length === 0) {
        createWindowAfterReady()
    }
}
