import path from "path"
import {
    createWindowAfterReady as _createWindowAfterReady,
    onActivate as _onActivate,
} from "./integration/callbacks"
import { BrowserWindow } from "electron"

export const createWindowAfterReady = ((path, process) => () =>
    _createWindowAfterReady(path, process))(path, process)

export { onAllWindowsClosed } from "./integration/callbacks"

export const onActivate = ((browserWindow, createWindowAfterReady) => () =>
    _onActivate(browserWindow, createWindowAfterReady))(
    BrowserWindow,
    createWindowAfterReady
)
