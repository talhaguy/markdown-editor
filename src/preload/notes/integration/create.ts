import { promises as fsPromises } from "fs"
import path from "path"
import { createNoteFileName } from "../service/file"
import { GetTranslationFunc } from "../../../shared/services/translation"

export function createNewNote(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    translate: GetTranslationFunc,
    folderPath: string
) {
    const fileName = createNoteFileName(new Date())
    const filePath = nodePath.join(folderPath, fileName)
    return nodeFsPromises
        .writeFile(filePath, translate("new_note_placeholder"), {
            encoding: "utf8",
        })
        .then(() => {
            return fileName
        })
}
