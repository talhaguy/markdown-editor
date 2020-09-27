import { ConfigStorageKey } from "../../../shared/constants"

export function getLastFolderPathOpened(localStorage: Storage) {
    return localStorage.getItem(ConfigStorageKey.LastFolderPathOpened)
}

export function setLastFolderPathOpened(localStorage: Storage, value: string) {
    localStorage.setItem(ConfigStorageKey.LastFolderPathOpened, value)
}
