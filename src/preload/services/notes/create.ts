import { promises as fsPromises } from "fs"
import path from "path"
import { prependZeroesToSingleDigit } from "../utils"
import { GetTranslationFunc } from "../../../shared/services/translation"

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

export function createNewNote(
    nodeFsPromises: typeof fsPromises,
    nodePath: typeof path,
    translate: GetTranslationFunc,
    folderPath: string
) {
    const fileName = createNoteFileName()
    const filePath = nodePath.join(folderPath, fileName)
    return nodeFsPromises
        .writeFile(filePath, translate("new_note_placeholder"), {
            encoding: "utf8",
        })
        .then(() => {
            return fileName
        })
}
