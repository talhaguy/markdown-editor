import {
    getLastFolderPathOpened as _getLastFolderPathOpened,
    setLastFolderPathOpened as _setLastFolderPathOpened,
} from "./config"

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
