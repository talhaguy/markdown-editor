import { NoteListItem, NoteListMap } from "../../../shared/models"
import {
    createInitialNoteListMap,
    incrementNumNotesCompleted,
    isNotesDataComplete,
} from "./readHelpers"

describe("readHelpers", () => {
    describe("createInitialNoteListMap()", () => {
        it("should create an initial note list map that's partially filled in", () => {
            const noteListMap = createInitialNoteListMap([
                "markdown-file-1.md",
                "markdown-file-2.md",
            ])
            const expected: NoteListMap = {
                "markdown-file-1.md": {
                    id: "markdown-file-1.md",
                    title: null,
                    preview: null,
                    lastModifiedDate: null,
                },
                "markdown-file-2.md": {
                    id: "markdown-file-2.md",
                    title: null,
                    preview: null,
                    lastModifiedDate: null,
                },
            }
            expect(noteListMap).toEqual(expected)
        })
    })

    describe("incrementNumNotesCompleted()", () => {
        it("should return the incremented number of notes counter if given note list item has data filled out", () => {
            // don't increment
            let noteListItem: NoteListItem = {
                id: "markdown-file-1.md",
                title: null,
                preview: null,
                lastModifiedDate: null,
            }
            let result = incrementNumNotesCompleted(1, noteListItem)
            expect(result).toBe(1)

            // don't increment
            noteListItem = {
                id: "markdown-file-1.md",
                title: "Some Title",
                preview: null,
                lastModifiedDate: 1600313824432,
            }
            result = incrementNumNotesCompleted(1, noteListItem)
            expect(result).toBe(1)

            // increment
            noteListItem = {
                id: "markdown-file-1.md",
                title: "Some Title",
                preview: "Some text",
                lastModifiedDate: 1600313824432,
            }
            result = incrementNumNotesCompleted(1, noteListItem)
            expect(result).toBe(2)
        })
    })

    describe("isNotesDataComplete()", () => {
        it("should return a flag indicating if note data is complete based on number of markdown files and number of filled out note list items", () => {
            // incomplete
            let result = isNotesDataComplete(5, 3)
            expect(result).toBeFalsy()

            // complete
            result = isNotesDataComplete(5, 5)
            expect(result).toBeTruthy()

            // precautionary edge case if number of notes completed is larger than number of markdown files
            result = isNotesDataComplete(5, 6)
            expect(result).toBeTruthy()
        })
    })
})
