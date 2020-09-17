import { promises as fsPromises } from "fs"
import path from "path"
import chokidar from "chokidar"
import { createNewNote as _createNewNote } from "./integration/create"
import {
    getNotesInFolder as _getNotesInFolder,
    getNoteContent as _getNoteContent,
} from "./integration/read"
import { saveNote as _saveNote } from "./integration/update"
import { deleteNote as _deleteNote } from "./integration/delete"
import { startNotesWatch as _startNotesWatch } from "./integration/watch"
import { getLinesOfFile } from "../fileSystem"
import { NoteListMap } from "../../shared/models"
import { getTranslation } from "../../shared/translation"
import { getTextForDisplayFactory } from "./service/file"

export interface CreateNewNoteFunc {
    (folderPath: string): Promise<string>
}

export const createNewNote: CreateNewNoteFunc = ((
    fsPromises,
    path,
    getTranslation
) => (folderPath) =>
    _createNewNote(fsPromises, path, getTranslation, folderPath))(
    fsPromises,
    path,
    getTranslation
)

export interface GetNotesInFolderFunc {
    (folderPath: string): Promise<NoteListMap>
}

export const getNotesInFolder: GetNotesInFolderFunc = ((
    fsPromises,
    path,
    getLinesOfFile,
    getTextForDisplay
) => (folderPath) =>
    _getNotesInFolder(
        fsPromises,
        path,
        getLinesOfFile,
        getTextForDisplay,
        folderPath
    ))(
    fsPromises,
    path,
    getLinesOfFile,
    getTextForDisplayFactory(getTranslation)
)

export interface GetNoteContentFunc {
    (folderPath: string, noteFileName: string): Promise<string>
}

export const getNoteContent: GetNoteContentFunc = ((fsPromises, path) => (
    folderPath,
    noteFileName
) => _getNoteContent(fsPromises, path, folderPath, noteFileName))(
    fsPromises,
    path
)

export interface SaveNoteFunc {
    (folderPath: string, noteFileName: string, content: string): Promise<void>
}

export const saveNote: SaveNoteFunc = ((fsPromises, path) => (
    folderPath,
    noteFileName,
    content
) => _saveNote(fsPromises, path, folderPath, noteFileName, content))(
    fsPromises,
    path
)

export interface DeleteNoteFunc {
    (folderPath: string, noteFileName: string): Promise<void>
}

export const deleteNote: DeleteNoteFunc = ((fsPromises, path) => (
    folderPath,
    noteFileName
) => _deleteNote(fsPromises, path, folderPath, noteFileName))(fsPromises, path)

export interface StartNotesWatchFunc {
    (folderPath: string): void
}

export const startNotesWatch: StartNotesWatchFunc = ((chokidar, path) => (
    folderPath
) => _startNotesWatch(chokidar, path, folderPath))(chokidar, path)
