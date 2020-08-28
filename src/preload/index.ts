import { promises as fs } from "fs"
import path from "path"
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron"
import chokidar from "chokidar"
import { IPCEvent } from "../shared"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: () => Promise<string>
    getNotesInFolder: (folderPath: string) => Promise<string[]>
    createNewNote: (folderPath: string) => Promise<void>
    startNotesWatch: (folderPath: string) => void
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

function getNotesInFolder(nodeFsPromises: typeof fs, folderPath: string) {
    return nodeFsPromises.readdir(folderPath).then((files) => {
        const markdownFiles = files.filter((file) => file.indexOf(".md") > -1)
        return markdownFiles
    })
}

function prependZeroesToSingleDigit(num: number, numZeroes: number) {
    const prepend = Array(numZeroes).fill("0").join("")
    return num < 10 ? prepend + num : num
}

function createNoteFileName() {
    const date = new Date()
    return `${prependZeroesToSingleDigit(
        date.getMonth() + 1,
        1
    )}${prependZeroesToSingleDigit(
        date.getDate(),
        1
    )}${prependZeroesToSingleDigit(
        date.getFullYear(),
        1
    )}${prependZeroesToSingleDigit(
        date.getHours(),
        1
    )}${prependZeroesToSingleDigit(
        date.getMinutes(),
        1
    )}${prependZeroesToSingleDigit(date.getSeconds(), 1)}.md`
}

function createNewNote(
    nodeFsPromises: typeof fs,
    nodePath: typeof path,
    folderPath: string
) {
    const fileName = createNoteFileName()
    const filePath = nodePath.join(folderPath, fileName)
    return nodeFsPromises.writeFile(filePath, "initial file contents...", {
        encoding: "utf8",
    })
}

function startNotesWatch(
    chokidarLib: typeof chokidar,
    nodePath: typeof path,
    folderPath: string
) {
    // TODO: remove listener on previous folder; maybe return an unsub obj with method to unsub
    const watcher = chokidarLib
        .watch(nodePath.join(folderPath, "*.md"))
        .on("ready", () => {
            console.log("Initial scan complete. Ready for changes")

            watcher.on("add", (path) =>
                console.log(`File ${path} has been added`)
            )
            watcher.on("change", (path) =>
                console.log(`File ${path} has been changed`)
            )
            watcher.on("unlink", (path) =>
                console.log(`File ${path} has been removed`)
            )
        })
}

const MainToRendererApi: MainToRendererApiMap = {
    selectFolder: ((ipcRenderer) => () => selectFolder(ipcRenderer))(
        ipcRenderer
    ),
    getNotesInFolder: ((fs) => (folderPath) =>
        getNotesInFolder(fs, folderPath))(fs),
    createNewNote: ((fs, path) => (folderPath) =>
        createNewNote(fs, path, folderPath))(fs, path),
    startNotesWatch: ((chokidar, path) => (folderPath) =>
        startNotesWatch(chokidar, path, folderPath))(chokidar, path),
}

;(window as any)._MainToRendererApi = MainToRendererApi
