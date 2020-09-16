import { promises as fsPromises } from "fs"
import path from "path"

export function deleteNote(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    folderPath: string,
    noteFileName: string
) {
    return nodeFsPromises.unlink(nodePath.join(folderPath, noteFileName))
}
