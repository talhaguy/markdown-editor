import { selectFolder, SelectFolderFunc } from "./services/ipcEvents"
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
} from "./services/notes"

console.log("preload js")

export interface MainToRendererApiMap {
    selectFolder: SelectFolderFunc
    createNewNote: CreateNewNoteFunc
    getNotesInFolder: GetNotesInFolderFunc
    getNoteContent: GetNoteContentFunc
    saveNote: SaveNoteFunc
    deleteNote: DeleteNoteFunc
    startNotesWatch: StartNotesWatchFunc
}

const MainToRendererApi: MainToRendererApiMap = {
    selectFolder,
    createNewNote,
    getNotesInFolder,
    getNoteContent,
    saveNote,
    deleteNote,
    startNotesWatch,
}

// add to window object to gain access from renderer
;(window as any)._MainToRendererApi = MainToRendererApi
