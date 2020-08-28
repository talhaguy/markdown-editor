export enum IPCEvent {
    SelectFolderStart = "select_folder_start",
    SelectFolderSuccess = "select_folder_success",
    SelectFolderCancel = "select_folder_cancel",
}

export interface NoteListItem {
    id: string
    title: string
    preview: string
    lastModifiedDate: number
}

export interface NoteListMap {
    [id: string]: NoteListItem
}
