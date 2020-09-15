import { Dialog, IpcMainEvent } from "electron"
import { IPCEvent } from "../../../constants"
import { getSelectedFolderFilePath } from "../service/processDialogReturn"

export function onSelectFolderStart(dialog: Dialog, event: IpcMainEvent) {
    dialog
        .showOpenDialog({
            properties: ["openDirectory"],
            message: "Choose a folder",
        })
        .then(getSelectedFolderFilePath)
        .then((filePath) => {
            event.sender.send(IPCEvent.SelectFolderSuccess, filePath)
        })
        .catch(() => {
            event.sender.send(IPCEvent.SelectFolderCancel)
        })
}
