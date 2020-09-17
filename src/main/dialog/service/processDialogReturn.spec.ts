import { OpenDialogReturnValue } from "electron"
import { ErrorCode } from "../../../shared/error"
import { getSelectedFolderFilePath } from "./processDialogReturn"

describe("processDialogReturn", () => {
    describe("getSelectedFolderFilePath()", () => {
        it("should reject with an error if user canceled open dialog", (done) => {
            const openDialogReturnValue: OpenDialogReturnValue = {
                canceled: true,
                filePaths: [],
            }
            getSelectedFolderFilePath(openDialogReturnValue).catch((error) => {
                expect(error.code).toBe(ErrorCode.OpenFolderCancel)
                done()
            })
        })

        it("should resolve with a file path if user did not cancel the open dialog", (done) => {
            const pathToFolder = "path/to/some/folder"
            const openDialogReturnValue: OpenDialogReturnValue = {
                canceled: false,
                filePaths: [pathToFolder],
            }
            getSelectedFolderFilePath(openDialogReturnValue).then(
                (filePath) => {
                    expect(filePath).toBe(pathToFolder)
                    done()
                }
            )
        })
    })
})
