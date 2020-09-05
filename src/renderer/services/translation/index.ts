import translations from "../../../translation/en.json"
import { getTranslation as _getTranslation } from "./translation"

export interface GetTranslationFunc {
    (key: string): string
}

export const getTranslation = ((translations) => (key: string) =>
    _getTranslation(translations, key))(translations)
