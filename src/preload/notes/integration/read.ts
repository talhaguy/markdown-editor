import { promises as fsPromises } from "fs"
import path from "path"
import { NoteListMap } from "../../../shared/models"
import { GetLinesOfFileFunc } from "../../fileSystem"
import { GetTextForDisplayFunc } from "../service/file"
import { getMarkdownFilesNamesFromList } from "../service/file"
import {
    createInitialNoteListMap,
    incrementNumNotesCompleted,
    isNotesDataComplete,
} from "../service/readHelpers"

export function getNotesInFolder(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    getLinesOfFile: GetLinesOfFileFunc,
    getTextForDisplay: GetTextForDisplayFunc,
    folderPath: string
) {
    console.log("preload - getNotesInFolder()", nodeFsPromises)
    return nodeFsPromises.readdir(folderPath).then((files) => {
        console.log(
            `preload - getNotesInFolder() - nodeFsPromises.readdir(${folderPath}).then()`,
            nodeFsPromises
        )

        const markdownFiles = getMarkdownFilesNamesFromList(files)

        return new Promise<NoteListMap>((res, rej) => {
            let numNotesDataCompleted = 0

            const resolvePromiseIfDataComplete = (
                noteListMap: NoteListMap,
                numNotesDataCompleted: number
            ) => {
                // if all files have data collected, fullfill promise
                if (
                    isNotesDataComplete(
                        markdownFiles.length,
                        numNotesDataCompleted
                    )
                ) {
                    res(noteListMap)
                }
            }

            if (markdownFiles.length > 0) {
                let noteListMap: NoteListMap = createInitialNoteListMap(
                    markdownFiles
                )

                markdownFiles.forEach((mdFileName) => {
                    const filePath = nodePath.join(folderPath, mdFileName)

                    getLinesOfFile(filePath, 2).then((lines) => {
                        noteListMap[mdFileName].title = getTextForDisplay(
                            lines[0],
                            30
                        )
                        noteListMap[mdFileName].preview = getTextForDisplay(
                            lines[1],
                            30
                        )

                        numNotesDataCompleted = incrementNumNotesCompleted(
                            numNotesDataCompleted,
                            noteListMap[mdFileName]
                        )
                        resolvePromiseIfDataComplete(
                            noteListMap,
                            numNotesDataCompleted
                        )
                    })

                    nodeFsPromises.stat(filePath).then(({ mtime }) => {
                        noteListMap[
                            mdFileName
                        ].lastModifiedDate = mtime.getTime()

                        numNotesDataCompleted = incrementNumNotesCompleted(
                            numNotesDataCompleted,
                            noteListMap[mdFileName]
                        )
                        resolvePromiseIfDataComplete(
                            noteListMap,
                            numNotesDataCompleted
                        )
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
