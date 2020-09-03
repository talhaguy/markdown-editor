import { promises as fsPromises } from "fs"
import path from "path"

export function saveNote(
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
