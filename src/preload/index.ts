import fs, { promises as fsPromises } from "fs"
import path from "path"
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron"
import chokidar from "chokidar"
import { IPCEvent, NoteListMap } from "../shared"
import readline from "readline"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: () => Promise<string>
    getNotesInFolder: (folderPath: string) => Promise<NoteListMap>
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

function _getFirstLineOfFile(
    nodeReadline: typeof readline,
    nodeFs: typeof fs,
    pathToFile: string
) {
    return new Promise<string>((res, rej) => {
        const rl = nodeReadline.createInterface({
            input: nodeFs.createReadStream(pathToFile),
            output: process.stdout,
            terminal: false,
        })

        let wasLineRead = false // rl.close() doesn't close immediately, so need this to check
        rl.on("line", (line) => {
            if (!wasLineRead) {
                console.log("got a line...", line)
                res(line)
                wasLineRead = true
                rl.close()
            }
        })

        // TODO: rl error handling
    })
}

const getFirstLineOfFile = ((readline, fs) => (pathToFile) =>
    _getFirstLineOfFile(readline, fs, pathToFile))(readline, fs)

function getNotesInFolder(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    folderPath: string
) {
    return nodeFsPromises.readdir(folderPath).then((files) => {
        const markdownFiles = files.filter((file) => file.indexOf(".md") > -1)

        return new Promise<NoteListMap>((res, rej) => {
            if (markdownFiles.length > 0) {
                let numNotesRead = 0
                let noteListMap: NoteListMap = {}
                markdownFiles.forEach((mdFileName) => {
                    noteListMap[mdFileName] = {
                        id: mdFileName,
                        title: null,
                        preview: null,
                        lastModifiedDate: null,
                    }
                })

                markdownFiles.forEach((mdFileName) => {
                    getFirstLineOfFile(
                        nodePath.join(folderPath, mdFileName)
                    ).then((line) => {
                        numNotesRead += 1
                        noteListMap[mdFileName].preview =
                            line.slice(0, 20) + "..."

                        // if all files have been read, fullfill promise
                        if (markdownFiles.length === numNotesRead) {
                            res(noteListMap)
                        }
                    })
                })
            }
        })
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
    nodeFsPromises: typeof fsPromises,
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
    getNotesInFolder: ((fsPromises, path) => (folderPath) =>
        getNotesInFolder(fsPromises, path, folderPath))(fsPromises, path),
    createNewNote: ((fsPromises, path) => (folderPath) =>
        createNewNote(fsPromises, path, folderPath))(fsPromises, path),
    startNotesWatch: ((chokidar, path) => (folderPath) =>
        startNotesWatch(chokidar, path, folderPath))(chokidar, path),
}

;(window as any)._MainToRendererApi = MainToRendererApi
