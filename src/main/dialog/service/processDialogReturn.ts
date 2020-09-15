import { OpenDialogReturnValue } from "electron"
import { createError, ErrorCode } from "../../../shared/services/error"

export function getSelectedFolderFilePath(value: OpenDialogReturnValue) {
    if (!value.canceled) {
        return Promise.resolve(value.filePaths[0])
    }

    return Promise.reject(createError(ErrorCode.OpenFolderCancel))
}
