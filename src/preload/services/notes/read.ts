import { promises as fsPromises } from "fs"
import path from "path"
import { NoteListMap } from "../../../shared/models"
import { GetLinesOfFileFunc } from "../../fileSystem"
import { GetTranslationFunc } from "../../../shared/services/translation"

export interface GetTextForDisplayFunc {
    (str: string | undefined, maxLength: number): string
}

export function getTextForDisplayFactory(translate: GetTranslationFunc) {
    const getTextForDisplay: GetTextForDisplayFunc = (
        str: string | undefined,
        maxLength: number
    ) => {
        if (typeof str !== "undefined") {
            const append =
                str.length - 1 > maxLength ? translate("ellipses") : ""
            return str.slice(0, maxLength) + append
        } else {
            return translate("not_available_short")
        }
    }
    return getTextForDisplay
}

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
                        noteListMap[mdFileName].title = getTextForDisplay(
                            lines[0],
                            30
                        )
                        noteListMap[mdFileName].preview = getTextForDisplay(
                            lines[1],
                            30
                        )

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
