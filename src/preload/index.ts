import { promises as fs } from "fs"
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron"
import { IPCEvent } from "../shared"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: () => Promise<string>
    getNotesInFolder: (folderPath: string) => Promise<string[]>
}

function selectFolder(ipcRenderer: IpcRenderer) {
    return new Promise<string>((res, rej) => {
        const onSelectFolderSuccess = (
            event: IpcRendererEvent,
            folderPath: string
        ) => {
            res(folderPath)
            ipcRenderer.off(IPCEvent.SelectFolderSuccess, onSelectFolderSuccess)
        }

        const onSelectFolderCancel = (event: IpcRendererEvent) => {
            rej()
            ipcRenderer.off(IPCEvent.SelectFolderCancel, onSelectFolderCancel)
        }

        ipcRenderer.on(IPCEvent.SelectFolderSuccess, onSelectFolderSuccess)
        ipcRenderer.on(IPCEvent.SelectFolderCancel, onSelectFolderCancel)
        ipcRenderer.send(IPCEvent.SelectFolderStart)
    })
}

function getNotesInFolder(nodeFs: typeof fs, folderPath: string) {
    return nodeFs.readdir(folderPath).then((files) => {
        const markdownFiles = files.filter((file) => file.indexOf(".md") > -1)
        return markdownFiles
    })
}

const MainToRendererApi: MainToRendererApiMap = {
    selectFolder: ((ipcRenderer) => () => selectFolder(ipcRenderer))(
        ipcRenderer
    ),
    getNotesInFolder: ((fs) => (folderPath) =>
        getNotesInFolder(fs, folderPath))(fs),
}

;(window as any)._MainToRendererApi = MainToRendererApi
