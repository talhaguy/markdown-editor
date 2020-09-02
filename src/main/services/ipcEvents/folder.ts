import { Dialog, IpcMainEvent } from "electron"
import { IPCEvent } from "../../../constants"

export function onSelectFolderStart(dialog: Dialog, event: IpcMainEvent) {
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
