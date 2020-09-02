import fs, { promises as fsPromises } from "fs"
import path from "path"
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron"
import chokidar from "chokidar"
import { IPCEvent } from "../constants"
import { NoteListMap } from "../models"
import readline from "readline"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: () => Promise<string>
    getNotesInFolder: (folderPath: string) => Promise<NoteListMap>
    createNewNote: (folderPath: string) => Promise<string>
    startNotesWatch: (folderPath: string) => void
    getNoteContent: (
        folderPath: string,
        noteFileName: string
    ) => Promise<string>
    saveNote: (
        folderPath: string,
        noteFileName: string,
        content: string
    ) => Promise<void>
    deleteNote: (folderPath: string, noteFileName: string) => Promise<void>
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
    console.log("preload - getNotesInFolder()", nodeFsPromises)
    return nodeFsPromises.readdir(folderPath).then((files) => {
        console.log(
            `preload - getNotesInFolder() - nodeFsPromises.readdir(${folderPath}).then()`,
            nodeFsPromises
        )

        const markdownFiles = files.filter((file) => file.indexOf(".md") > -1)

        return new Promise<NoteListMap>((res, rej) => {
            let numNotesDataCompleted = 0

            const incrementNumNotesDataCompleted = (
                noteListMap: NoteListMap,
                id: string
            ) => {
                if (
                    noteListMap[id].title !== null &&
                    noteListMap[id].preview !== null &&
                    noteListMap[id].lastModifiedDate
                ) {
                    numNotesDataCompleted += 1
                }
            }

            const resolvePromiseIfDataComplete = (noteListMap: NoteListMap) => {
                // if all files have data collected, fullfill promise
                if (markdownFiles.length === numNotesDataCompleted) {
                    res(noteListMap)
                }
            }

            if (markdownFiles.length > 0) {
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
                    const filePath = nodePath.join(folderPath, mdFileName)

                    getLinesOfFile(filePath, 2).then((lines) => {
                        noteListMap[mdFileName].title = lines[0]
                            ? lines[0].slice(0, 20) + "..."
                            : "N/A"
                        noteListMap[mdFileName].preview = lines[1]
                            ? lines[1].slice(0, 20) + "..."
                            : ""

                        incrementNumNotesDataCompleted(noteListMap, mdFileName)
                        resolvePromiseIfDataComplete(noteListMap)
                    })

                    nodeFsPromises.stat(filePath).then(({ mtime }) => {
                        noteListMap[
                            mdFileName
                        ].lastModifiedDate = mtime.getTime()

                        incrementNumNotesDataCompleted(noteListMap, mdFileName)
                        resolvePromiseIfDataComplete(noteListMap)
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
    return nodeFsPromises
        .writeFile(filePath, "initial file contents...", {
            encoding: "utf8",
        })
        .then(() => {
            return fileName
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

function getNoteContent(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    folderPath: string,
    noteFileName: string
) {
    console.log("getNoteContent()", nodePath.join(folderPath, noteFileName))
    return nodeFsPromises.readFile(nodePath.join(folderPath, noteFileName), {
        encoding: "utf8",
    })
}

function saveNote(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    folderPath: string,
    noteFileName: string,
    content: string
) {
    const filePath = nodePath.join(folderPath, noteFileName)
    // check if file exists, then write (for cases when a file is deleted but a save was triggered to happen)
    return nodeFsPromises.access(filePath).then(() => {
        return nodeFsPromises.writeFile(filePath, content, {
            encoding: "utf8",
        })
    })
}

function deleteNote(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    folderPath: string,
    noteFileName: string
) {
    return nodeFsPromises.unlink(nodePath.join(folderPath, noteFileName))
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
    getNoteContent: ((fsPromises, path) => (folderPath, noteFileName) =>
        getNoteContent(fsPromises, path, folderPath, noteFileName))(
        fsPromises,
        path
    ),
    saveNote: ((fsPromises, path) => (folderPath, noteFileName, content) =>
        saveNote(fsPromises, path, folderPath, noteFileName, content))(
        fsPromises,
        path
    ),
    deleteNote: ((fsPromises, path) => (folderPath, noteFileName) =>
        deleteNote(fsPromises, path, folderPath, noteFileName))(
        fsPromises,
        path
    ),
}

;(window as any)._MainToRendererApi = MainToRendererApi
