import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { getTranslation } from "../../shared/translation"
import { TranslationContext, TranslationContextMap } from "../providers"
import { NoteList } from "./NoteList"
import { NoteListItem as NoteListItemModel } from "../../shared/models"

describe("NoteList", () => {
    const renderComponent = (
        selectNoteIndex?: number,
        notesOverride?: NoteListItemModel[]
    ) => {
        const translation: TranslationContextMap = {
            translation: getTranslation,
        }

        const notes: NoteListItemModel[] = notesOverride
            ? notesOverride
            : [
                  {
                      id: "note-0",
                      title: "First Note",
                      preview: "This is first note content",
                      lastModifiedDate: 1600805758430,
                  },
                  {
                      id: "note-1",
                      title: "Second Note",
                      preview: "This is second note content",
                      lastModifiedDate: 1600805758430,
                  },
                  {
                      id: "note-2",
                      title: "Third Note",
                      preview: "This is third note content",
                      lastModifiedDate: 1600805758430,
                  },
              ]
        const onSelectNote = jest.fn()
        const onDeleteBtnClick = jest.fn()
        const selectedNoteId =
            typeof selectNoteIndex !== "undefined" && selectNoteIndex !== null
                ? `note-${selectNoteIndex}`
                : null

        const renderResult = render(
            <TranslationContext.Provider value={translation}>
                <NoteList
                    notes={notes}
                    onSelectNote={onSelectNote}
                    onDeleteBtnClick={onDeleteBtnClick}
                    selectedNoteId={selectedNoteId}
                />
            </TranslationContext.Provider>
        )

        return {
            renderResult,
            notes,
            onSelectNote,
            onDeleteBtnClick,
            selectedNoteId,
        }
    }

    const cleanTasks = () => {
        jest.clearAllMocks()
        cleanup()
    }

    beforeEach(cleanTasks)

    it("should display notes passed in", () => {
        const { notes } = renderComponent()
        const listItems = screen.getAllByTestId("list-item")
        expect(listItems.length).toBe(notes.length)
    })

    it("should display nothing if no notes passed in", () => {
        renderComponent(null, [])
        expect(screen.queryAllByTestId("list-item")).toEqual([])
    })

    it("should display default unavailable text if title, preview, or last modified date is not available", () => {
        const notAvailableText = getTranslation("not_available_short")

        // title
        renderComponent(null, [
            {
                id: "note-0",
                title: null,
                preview: "This is first note content",
                lastModifiedDate: 1600805758430,
            },
        ])
        expect(screen.getByTestId("note-0-title").textContent).toContain(
            notAvailableText
        )

        // preview
        cleanTasks()
        renderComponent(null, [
            {
                id: "note-0",
                title: "First title",
                preview: null,
                lastModifiedDate: 1600805758430,
            },
        ])
        expect(screen.getByTestId("note-0-preview").textContent).toContain(
            notAvailableText
        )

        // last modified date
        cleanTasks()
        renderComponent(null, [
            {
                id: "note-0",
                title: "First title",
                preview: "This is first note content",
                lastModifiedDate: null,
            },
        ])
        expect(
            screen.getByTestId("note-0-last-modified-date").textContent
        ).toContain(notAvailableText)
    })

    it("should select a note when user selects a note list item", () => {
        const { onSelectNote } = renderComponent()
        const listItems = screen.getAllByTestId("list-item")
        const firstListItem = listItems[0]
        fireEvent.click(firstListItem)
        expect(onSelectNote).toHaveBeenCalled()
    })

    it("should not rereun select if note is already selected", () => {
        const { onSelectNote } = renderComponent(0)
        const listItems = screen.getAllByTestId("list-item")
        const firstListItem = listItems[0]
        fireEvent.click(firstListItem)
        expect(onSelectNote).not.toHaveBeenCalled()
    })

    it("should show a delete button on selected note", () => {
        // delete button should not be there initially
        renderComponent()
        let listItems = screen.getAllByTestId("list-item")
        let firstListItem = listItems[0]
        expect(
            screen.queryByLabelText(getTranslation("note_delete"))
        ).toBeFalsy()

        // if note is selected, then delete button should be visible
        cleanTasks()
        renderComponent(0)
        listItems = screen.getAllByTestId("list-item")
        firstListItem = listItems[0]
        expect(
            screen.queryByLabelText(getTranslation("note_delete"))
        ).toBeTruthy()
    })

    it("should delete note if delete button is clicked", () => {
        const { onDeleteBtnClick } = renderComponent(0)
        fireEvent.click(screen.queryByLabelText(getTranslation("note_delete")))
        expect(onDeleteBtnClick).toHaveBeenCalled()
    })
})
