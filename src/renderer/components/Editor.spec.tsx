import React from "react"
import { cleanup, render, screen, fireEvent } from "@testing-library/react"
import { getTranslation } from "../../shared/translation"
import {
    CodeMirrorContext,
    MainToRendererApiContext,
    TranslationContext,
    TranslationContextMap,
} from "../providers"
import { Editor } from "./Editor"
import { MainToRendererApiMap } from "../../preload"
import CodeMirror from "codemirror"

describe("Editor", () => {
    const renderComponent = (
        editorState: "open" | "not_open",
        saveNoteImplementation?: (...args: any) => any
    ) => {
        const mainToRendererApi: MainToRendererApiMap = {
            selectFolder: jest.fn(),
            createNewNote: jest.fn(),
            getNotesInFolder: jest.fn(),
            getNoteContent: jest.fn(),
            saveNote: jest
                .fn()
                .mockImplementation(
                    saveNoteImplementation
                        ? saveNoteImplementation
                        : () => Promise.resolve()
                ),
            deleteNote: jest.fn(),
            startNotesWatch: jest.fn(),
            getOS: jest.fn(),
        }
        const translation: TranslationContextMap = {
            translation: getTranslation,
        }
        const noteContent =
            editorState === "not_open" ? null : "This is note content"
        const folderPath =
            editorState === "not_open" ? null : "some/path/to/folder"
        const noteFileName = editorState === "not_open" ? null : "note-0.md"
        const refreshNotesList = jest.fn()

        const codeMirrorFromTextArea = jest.spyOn(CodeMirror, "fromTextArea")

        const renderResult = render(
            <MainToRendererApiContext.Provider value={mainToRendererApi}>
                <TranslationContext.Provider value={translation}>
                    <CodeMirrorContext.Provider value={CodeMirror}>
                        <Editor
                            noteContent={noteContent}
                            folderPath={folderPath}
                            noteFileName={noteFileName}
                            refreshNotesList={refreshNotesList}
                        />
                    </CodeMirrorContext.Provider>
                </TranslationContext.Provider>
            </MainToRendererApiContext.Provider>
        )

        return {
            mainToRendererApi,
            noteContent,
            folderPath,
            noteFileName,
            refreshNotesList,
            codeMirrorFromTextArea,
            renderResult,
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
        cleanup()
    })

    it("should not open editor if there is no note open", () => {
        renderComponent("not_open")
        expect(screen.queryByText(getTranslation("no_note_open"))).toBeTruthy()
        expect(screen.queryByTestId("code-mirror")).toBeFalsy()
    })

    it("should open editor if note is open", () => {
        renderComponent("open")
        expect(screen.queryByText(getTranslation("no_note_open"))).toBeFalsy()
        expect(screen.queryByTestId("code-mirror")).toBeTruthy()
    })

    it("should save a note every 3 seconds", () => {
        jest.useFakeTimers()

        const { mainToRendererApi, codeMirrorFromTextArea } = renderComponent(
            "open"
        )

        // simulate edit
        const codeMirrorInstance = codeMirrorFromTextArea.mock.results[0]
        const doc = codeMirrorInstance.value.getDoc()
        doc.setValue("Some test text.")

        // save should not happen right away
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // save should not happen in 2 seconds
        jest.advanceTimersByTime(2000)
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // save should now have happened after 3 seconds
        jest.advanceTimersByTime(1000)
        expect(mainToRendererApi.saveNote).toHaveBeenCalled()

        jest.useRealTimers()
    })

    it("should batch saving of notes to 3 seconds after the last edit", () => {
        jest.useFakeTimers()

        const { mainToRendererApi, codeMirrorFromTextArea } = renderComponent(
            "open"
        )

        // simulate edit
        const codeMirrorInstance = codeMirrorFromTextArea.mock.results[0]
        const doc = codeMirrorInstance.value.getDoc()
        doc.setValue("Some test text.")

        // save should not happen right away
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // save should not happen in 2 seconds
        jest.advanceTimersByTime(2000)
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // make another edit to cancel the first save
        doc.setValue("Some more test text.")

        // save should not have happened after 3 seconds as there was another edit
        jest.advanceTimersByTime(1000)
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // save should not happen in 5 seconds
        jest.advanceTimersByTime(1000)
        expect(mainToRendererApi.saveNote).not.toHaveBeenCalled()

        // save should happen in 6 seconds
        jest.advanceTimersByTime(1000)
        expect(mainToRendererApi.saveNote).toHaveBeenCalled()

        jest.useRealTimers()
    })

    it("should refresh list of notes after saving one", (done) => {
        jest.useFakeTimers()

        const promise = Promise.resolve()
        // use `mockImplementationOnce` b/c there is a final save that happens when the component is unmounted
        jest.spyOn(promise, "then").mockImplementationOnce((cb: Function) => {
            expect(refreshNotesList).not.toHaveBeenCalled()
            // manually run callback
            cb()
            expect(refreshNotesList).toHaveBeenCalled()
            done()
            return Promise.resolve()
        })

        const { codeMirrorFromTextArea, refreshNotesList } = renderComponent(
            "open",
            () => {
                return promise
            }
        )

        // simulate edit
        const codeMirrorInstance = codeMirrorFromTextArea.mock.results[0]
        const doc = codeMirrorInstance.value.getDoc()
        doc.setValue("Some test text.")

        // advance timer to run save
        jest.advanceTimersByTime(3000)

        jest.useRealTimers()
    })

    it("should save the note when it closes if it was changed (component unmounts)", () => {
        jest.useFakeTimers()

        const promise = Promise.resolve()
        let thenCallCount = 0
        jest.spyOn(promise, "then").mockImplementation((cb: Function) => {
            thenCallCount += 1
            if (thenCallCount === 2) {
                expect(mainToRendererApi.saveNote).toHaveBeenCalledTimes(2)
            } else {
                expect(mainToRendererApi.saveNote).toHaveBeenCalledTimes(1)
            }
            return Promise.resolve()
        })

        const { codeMirrorFromTextArea, mainToRendererApi } = renderComponent(
            "open",
            () => {
                return promise
            }
        )

        // simulate edit
        const codeMirrorInstance = codeMirrorFromTextArea.mock.results[0]
        const doc = codeMirrorInstance.value.getDoc()
        doc.setValue("Some test text.")

        // advance timer to run save
        jest.advanceTimersByTime(3000)

        jest.useRealTimers()
    })
})
