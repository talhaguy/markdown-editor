import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { Controls } from "./Controls"
import { getTranslation } from "../../shared/translation"
import {
    MainToRendererApiContext,
    TranslationContext,
    TranslationContextMap,
    UtilContext,
    UtilServiceMap,
} from "../providers"
import { MainToRendererApiMap } from "../../preload"

describe("Controls", () => {
    function renderComponent(chooseFolder, folderName, createNewNote) {
        const translation: TranslationContextMap = {
            translation: getTranslation,
        }
        const mainToRendererApi: MainToRendererApiMap = {
            selectFolder: jest.fn(),
            createNewNote: jest.fn(),
            getNotesInFolder: jest.fn(),
            getNoteContent: jest.fn(),
            saveNote: jest.fn(),
            deleteNote: jest.fn(),
            startNotesWatch: jest.fn(),
            getOS: jest.fn(),
        }
        const util: UtilServiceMap = {
            getLastPathItem: jest.fn().mockReturnValue(folderName),
        }

        render(
            <MainToRendererApiContext.Provider value={mainToRendererApi}>
                <UtilContext.Provider value={util}>
                    <TranslationContext.Provider value={translation}>
                        <Controls
                            chooseFolder={chooseFolder}
                            folderName={folderName}
                            createNewNote={createNewNote}
                        />
                    </TranslationContext.Provider>
                </UtilContext.Provider>
            </MainToRendererApiContext.Provider>
        )

        return {
            translation,
            mainToRendererApi,
            util,
        }
    }

    afterEach(() => {
        jest.clearAllMocks()
        cleanup()
    })

    it("should not show a folder name, not have a new note button, and be able to choose a folder when folder name is not set", () => {
        const chooseFolder = jest.fn()
        const folderName = null
        const createNewNote = jest.fn()
        renderComponent(chooseFolder, folderName, createNewNote)

        // there should be no folder name yet
        expect(
            screen.getByText(getTranslation("not_available_short"))
        ).toBeTruthy()

        // there should be no new note button yet
        expect(
            screen.queryByLabelText(getTranslation("new_note_button"))
        ).toBeFalsy()

        fireEvent.click(
            screen.getByLabelText(getTranslation("choose_folder_button"))
        )
        expect(chooseFolder).toHaveBeenCalled()
    })

    it("should show a folder name, have a new note button, and be able to choose a folder when folder name is set", () => {
        const chooseFolder = jest.fn()
        const folderName = "my-folder"
        const createNewNote = jest.fn()
        renderComponent(chooseFolder, folderName, createNewNote)

        // there should be a folder name
        expect(screen.getByText(folderName)).toBeTruthy()

        // there should be a new note button
        fireEvent.click(screen.getByText(getTranslation("new_note_button")))
        expect(createNewNote).toHaveBeenCalled()

        // even when folder is set, should still be able to set new folder
        fireEvent.click(
            screen.getByLabelText(getTranslation("choose_folder_button"))
        )
        expect(chooseFolder).toHaveBeenCalled()
    })
})
