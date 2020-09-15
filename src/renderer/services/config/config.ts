import { ConfigStorageKey } from "../../../shared/constants"

export function getLastFolderPathOpened(localStorage: Storage) {
    return localStorage.getItem(ConfigStorageKey.LastFolderPathOpened)
}

export function setLastFolderPathOpened(localStorage: Storage, value: string) {
    console.log("DEBUG: setLastFolderPathOpened", value)
    localStorage.setItem(ConfigStorageKey.LastFolderPathOpened, value)
}
