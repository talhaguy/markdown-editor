import { app, ipcMain } from "electron"
import { IPCEvent } from "../shared/constants"
import { createWindowAfterReady, onActivate, onAllWindowsClosed } from "./app"
import { onSelectFolderStart } from "./dialog"

// Set allowRendererProcessReuse to false to resolve promises not resolving if app is refreshed
// https://github.com/electron/electron/issues/22119
app.allowRendererProcessReuse = false

app.whenReady().then(createWindowAfterReady)

app.on("window-all-closed", () => {
    onAllWindowsClosed(app)
})

app.on("activate", onActivate)

ipcMain.on(IPCEvent.SelectFolderStart, onSelectFolderStart)
