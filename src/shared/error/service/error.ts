import { CustomError } from "../models/CustomError"
import { ErrorCode } from "../constants/ErrorCode"

export function createError(code: ErrorCode, msg?: string) {
    const error = new Error(msg ? msg : code) as CustomError
    error.code = code
    return error
}
