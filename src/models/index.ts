export interface NoteListItem {
    id: string
    title: string
    preview: string
    lastModifiedDate: number
}

export interface NoteListMap {
    [id: string]: NoteListItem
}
