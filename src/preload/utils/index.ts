export { GetOSFunc } from "./service/os"

import { GetOSFunc, getOSFactory } from "./service/os"

export const getOS: GetOSFunc = getOSFactory(process)

export { prependZeroesToSingleDigit } from "./service/string"
