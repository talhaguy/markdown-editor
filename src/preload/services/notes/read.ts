import { promises as fsPromises } from "fs"
import path from "path"
import { NoteListMap } from "../../../models"
import { GetLinesOfFileFunc } from "../fileSystem"

export function getNotesInFolder(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    getLinesOfFile: GetLinesOfFileFunc,
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

export function getNoteContent(
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
