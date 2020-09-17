import { ErrorCode } from "../constants/ErrorCode"
import { createError } from "./error"

describe("error", () => {
    describe("createError()", () => {
        it("should create a custom error object witht the specified code and message", () => {
            // with message
            let errMsg = "Some Error Message"
            let error = createError(ErrorCode.OpenFolderCancel, errMsg)
            expect(error.code).toBe(ErrorCode.OpenFolderCancel)
            expect(error.message).toBe(errMsg)

            // without message
            errMsg = "Some Error Message"
            error = createError(ErrorCode.OpenFolderCancel)
            expect(error.code).toBe(ErrorCode.OpenFolderCancel)
            expect(error.message).toBe(ErrorCode.OpenFolderCancel)
        })
    })
})
