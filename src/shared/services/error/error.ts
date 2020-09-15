import { CustomError } from "./CustomError"
import { ErrorCode } from "./ErrorCode"

export function createError(code: ErrorCode, msg?: string) {
    const error = new Error(msg ? msg : code) as CustomError
    error.code = code
    return error
}
