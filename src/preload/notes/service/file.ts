import { prependZeroesToSingleDigit } from "../../utils"
import { GetTranslationFunc } from "../../../shared/translation"

export function createNoteFileName(date: Date) {
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

export function getMarkdownFilesNamesFromList(fileList: string[]) {
    return fileList.filter((file) => file.indexOf(".md") > -1)
}
