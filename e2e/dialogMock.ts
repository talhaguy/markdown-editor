import path from "path"
import { Dialog, OpenDialogOptions, OpenDialogReturnValue } from "electron"

export const dialogMock: Dialog = {
    showOpenDialog: (options: OpenDialogOptions) => {
        console.log("I AM A SPYYYYYYYYYYYY")
        const openDialogReturnValue: OpenDialogReturnValue = {
            canceled: false,
            filePaths: [
                path.join(__dirname, "..", process.env.E2E_TEST_FOLDER),
            ],
        }

        return Promise.resolve(openDialogReturnValue)
    },
} as any
