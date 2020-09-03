import { selectFolder as _selectFolder } from "./folder"
import { ipcRenderer } from "electron"

export interface SelectFolderFunc {
    (): Promise<string>
}
export const selectFolder = ((ipcRenderer) => () => _selectFolder(ipcRenderer))(
    ipcRenderer
)
