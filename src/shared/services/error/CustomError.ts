import { ErrorCode } from "./ErrorCode"

export interface CustomError extends Error {
    code: ErrorCode
}
