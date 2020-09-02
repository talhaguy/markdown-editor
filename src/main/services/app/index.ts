import path from "path"
import {
    createWindowAfterReady as _createWindowAfterReady,
    onActivate as _onActivate,
} from "./callbacks"
import { BrowserWindow } from "electron"

export const createWindowAfterReady = ((path) => () =>
    _createWindowAfterReady(path))(path)

export { onAllWindowsClosed } from "./callbacks"

export const onActivate = ((browserWindow, createWindowAfterReady) => () =>
    _onActivate(browserWindow, createWindowAfterReady))(
    BrowserWindow,
    createWindowAfterReady
)
