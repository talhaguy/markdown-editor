import { onSelectFolderStart as _onSelectFolderStart } from "./integration/openDialog"
import { dialog, IpcMainEvent } from "electron"

export const onSelectFolderStart = ((dialog) => (event: IpcMainEvent) =>
    _onSelectFolderStart(dialog, event))(dialog)
