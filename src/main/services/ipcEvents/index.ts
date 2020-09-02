import { onSelectFolderStart as _onSelectFolderStart } from "./folder"
import { dialog, IpcMainEvent } from "electron"

export const onSelectFolderStart = ((dialog) => (event: IpcMainEvent) =>
    _onSelectFolderStart(dialog, event))(dialog)
