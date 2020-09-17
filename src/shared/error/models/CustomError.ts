import { ErrorCode } from "../constants/ErrorCode"

export interface CustomError extends Error {
    code: ErrorCode
}
