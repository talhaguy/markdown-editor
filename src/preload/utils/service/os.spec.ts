import { OS } from "../../../shared/constants"
import { getOSFactory } from "./os"

describe("os", () => {
    describe("getOSFactory()", () => {
        it("should return the type of OS", () => {
            // mac
            let process = ({
                platform: "darwin",
            } as unknown) as NodeJS.Process
            let getOS = getOSFactory(process)
            expect(getOS()).toBe(OS.Posix)

            // windows
            process.platform = "win32"
            getOS = getOSFactory(process)
            expect(getOS()).toBe(OS.Windows)
        })
    })
})
