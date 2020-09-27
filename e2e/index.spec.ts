import path from "path"
import electron from "electron"
import { Application } from "spectron"

jest.setTimeout(30000)

describe("App", () => {
    let app: Application

    const startApp = () => {
        app = new Application({
            path: electron as any,
            args: [path.join(__dirname, "..", "dist", "index.js")],
        })

        return app.start()
    }

    const stopApp = async () => {
        if (app && app.isRunning()) {
            return app.stop()
        }
    }

    beforeEach(() => {
        return startApp()
    })

    afterEach(async (done) => {
        await stopApp()
        app = null
        done()
    })

    it("should be able to get notes from selcted folder and create new notes", async (done) => {
        // click on choose folder button
        const chooseFoldlerBtn = await app.client.$(
            '[data-testid="choose-folder-btn"]'
        )
        await chooseFoldlerBtn.waitForExist()
        chooseFoldlerBtn.click()

        // wait for notes to appear
        const noteList = await app.client.$('[data-testid="note-list"]')
        await noteList.waitForExist()

        // folder name should display
        const folderName = await app.client.$('[data-testid="folder-name"]')
        await folderName.waitForExist()
        expect(await folderName.getText()).toContain("e2e-temp")

        // correct notes should be there
        const noteListItems = await app.client.$$('[data-testid="list-item"')
        expect(noteListItems.length).toBe(1)

        const noteTitle = await noteList.$(
            '[data-testid="list-item"] [data-testid="note-0.md-title"]'
        )
        await noteTitle.waitForExist()
        const noteTitleText = await noteTitle.getText()
        expect(noteTitleText).toContain("First Note")

        const notePreview = await noteList.$(
            '[data-testid="list-item"] [data-testid="note-0.md-preview"]'
        )
        await notePreview.waitForExist()
        const notePreviewText = await notePreview.getText()
        expect(notePreviewText).toContain("This is the preview text")

        // add a note
        const newNoteBtn = await app.client.$('[data-testid="new-note-btn"]')
        newNoteBtn.click()

        // verify that there are 2 notes now
        ;(
            await app.client.$('[data-testid="list-item"]:nth-child(2)')
        ).waitForExist()

        // click on first note (this should be the most recently created note)
        const firstNoteListItem = await app.client.$(
            '[data-testid="list-item"]:first-child'
        )
        await firstNoteListItem.waitForExist()
        firstNoteListItem.click()

        // make an edit to the newly created note
        let editor = await app.client.$('[data-testid="code-mirror"]')
        await editor.waitForExist()
        await app.client.executeAsync((done) => {
            ;(window as any).__e2e.codeMirror
                .getDoc()
                .setValue("New Note Content\nNew note preview")
            done()
        })

        // wait for note to save
        await app.client.pause(3000)

        // check note list to see if it updated correctly
        const updatedNotesList = await app.client.$$('[data-testid="list-item"')
        expect(updatedNotesList.length).toBe(2)
        const updatedFirstNoteTitle = await updatedNotesList[0].$(
            '[data-testid*="-title"'
        )
        expect(await updatedFirstNoteTitle.getText()).toContain(
            "New Note Content"
        )
        const updatedFirstNotePreview = await updatedNotesList[0].$(
            '[data-testid*="-preview"'
        )
        expect(await updatedFirstNotePreview.getText()).toContain(
            "New note preview"
        )
        const updatedSecondNoteTitle = await updatedNotesList[1].$(
            '[data-testid*="-title"'
        )
        expect(await updatedSecondNoteTitle.getText()).toContain("First Note")
        const updatedSecondNotePreview = await updatedNotesList[1].$(
            '[data-testid*="-preview"'
        )
        expect(await updatedSecondNotePreview.getText()).toContain(
            "This is the preview text"
        )

        // click second note (the original note) and check if content in editor is correct
        const secondNoteListItem = await app.client.$(
            '[data-testid="list-item"]:nth-child(2)'
        )
        secondNoteListItem.click()
        editor = await app.client.$('[data-testid="code-mirror"]')
        let editorText = await editor.getText()
        expect(editorText).toContain("First Note")
        expect(editorText).toContain("This is the preview text")
        expect(editorText).toContain("This is another line")

        // click first note (the newer note) and check if content in editor is correct
        const updatedfirstNoteListItem = await app.client.$(
            '[data-testid="list-item"]:nth-child(1)'
        )
        updatedfirstNoteListItem.click()
        editor = await app.client.$('[data-testid="code-mirror"]')
        editorText = await editor.getText()
        expect(editorText).toContain("New Note Content")
        expect(editorText).toContain("New note preview")

        done()
    })
})
