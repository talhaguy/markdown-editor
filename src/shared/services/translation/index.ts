import translations from "../../../translation/en.json"
import { getTranslation as _getTranslation } from "./translate"

export interface GetTranslationFunc {
    (key: string, ...args: any): string
}

export const getTranslation = ((translations) => (key: string, ...args: any) =>
    _getTranslation(translations, key, ...args))(translations)

export { Translation } from "./Translation"
