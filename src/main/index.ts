import { app, ipcMain } from "electron"
import { IPCEvent } from "../constants"
import {
    createWindowAfterReady,
    onActivate,
    onAllWindowsClosed,
} from "./services/app"
import { onSelectFolderStart } from "./services/ipcEvents"

console.log("main...")

// Set allowRendererProcessReuse to false to resolve promises not resolving if app is refreshed
// https://github.com/electron/electron/issues/22119
app.allowRendererProcessReuse = false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindowAfterReady)

app.on("window-all-closed", () => {
    onAllWindowsClosed(app)
})

app.on("activate", onActivate)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on(IPCEvent.SelectFolderStart, onSelectFolderStart)
