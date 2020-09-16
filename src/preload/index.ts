import { selectFolder, SelectFolderFunc } from "./ipcEvents"
import {
    CreateNewNoteFunc,
    GetNotesInFolderFunc,
    GetNoteContentFunc,
    SaveNoteFunc,
    DeleteNoteFunc,
    StartNotesWatchFunc,
    createNewNote,
    getNotesInFolder,
    getNoteContent,
    saveNote,
    deleteNote,
    startNotesWatch,
} from "./notes"
import { getOS, GetOSFunc } from "./services/utils"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: SelectFolderFunc
    createNewNote: CreateNewNoteFunc
    getNotesInFolder: GetNotesInFolderFunc
    getNoteContent: GetNoteContentFunc
    saveNote: SaveNoteFunc
    deleteNote: DeleteNoteFunc
    startNotesWatch: StartNotesWatchFunc
    getOS: GetOSFunc
}

const MainToRendererApi: MainToRendererApiMap = {
    selectFolder,
    createNewNote,
    getNotesInFolder,
    getNoteContent,
    saveNote,
    deleteNote,
    startNotesWatch,
    getOS,
}

// add to window object to gain access from renderer
;(window as any)._MainToRendererApi = MainToRendererApi
