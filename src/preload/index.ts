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

function _getLinesOfFile(
    nodeReadline: typeof readline,
    nodeFs: typeof fs,
    pathToFile: string,
    numLines: number
) {
    return new Promise<string[]>((res, rej) => {
        const rl = nodeReadline.createInterface({
            input: nodeFs.createReadStream(pathToFile),
            output: process.stdout,
            terminal: false,
        })

        let lines = []
        rl.on("line", (line) => {
            if (lines.length < numLines) {
                if (line.trim() !== "") {
                    console.log("got a line...", line)
                    lines.push(line)
                }
            }

            if (lines.length === numLines) {
                rl.close()
            }
        })

        rl.on("close", () => {
            res(lines)
        })

        // TODO: rl error handling
    })
}

const getLinesOfFile = ((readline, fs) => (pathToFile, numLines) =>
    _getLinesOfFile(readline, fs, pathToFile, numLines))(readline, fs)

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
                    getLinesOfFile(
                        nodePath.join(folderPath, mdFileName),
                        2
                    ).then((lines) => {
                        numNotesRead += 1

                        noteListMap[mdFileName].title = lines[0]
                            ? lines[0].slice(0, 20) + "..."
                            : "N/A"
                        noteListMap[mdFileName].preview = lines[1]
                            ? lines[1].slice(0, 20) + "..."
                            : ""

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
