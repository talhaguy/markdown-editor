import {
    getLastFolderPathOpened as _getLastFolderPathOpened,
    setLastFolderPathOpened as _setLastFolderPathOpened,
} from "./config"
import { getTranslation as _getTranslation } from "./translation"
import translations from "../../translation/en.json"

export interface GetLastFolderPathOpenedFunc {
    (): string | null
}

export const getLastFolderPathOpened: GetLastFolderPathOpenedFunc = ((
    localStorage
) => () => _getLastFolderPathOpened(localStorage))(window.localStorage)

export interface SetLastFolderPathOpenedFunc {
    (value: string): void
}

export const setLastFolderPathOpened: SetLastFolderPathOpenedFunc = ((
    localStorage
) => (value: string) => _setLastFolderPathOpened(localStorage, value))(
    window.localStorage
)

export interface GetTranslationFunc {
    (key: string): string
}

export const getTranslation = ((translations) => (key: string) =>
    _getTranslation(translations, key))(translations)
