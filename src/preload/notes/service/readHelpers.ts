import { NoteListItem, NoteListMap } from "../../../shared/models"

export function createInitialNoteListMap(markdownFileNames: string[]) {
    let noteListMap: NoteListMap = {}
    markdownFileNames.forEach((mdFileName) => {
        noteListMap[mdFileName] = {
            id: mdFileName,
            title: null,
            preview: null,
            lastModifiedDate: null,
        }
    })
    return noteListMap
}

export function incrementNumNotesCompleted(
    numNotesDataCompleted: number,
    noteListItem: NoteListItem
) {
    if (
        noteListItem.title !== null &&
        noteListItem.preview !== null &&
        noteListItem.lastModifiedDate
    ) {
        numNotesDataCompleted += 1
    }

    return numNotesDataCompleted
}

export function isNotesDataComplete(
    numMarkdownFiles: number,
    numNotesDataCompleted: number
) {
    return numMarkdownFiles <= numNotesDataCompleted
}
