import path from "path"
import electron from "electron"
import { Application } from "spectron"

jest.setTimeout(10000)

describe("App", () => {
    let app: Application

    const startApp = () => {
        app = new Application({
            path: electron as any,
            args: [path.join(__dirname, "..", "dist", "index.js")],
        })

        return app.start()
    }

    const stopApp = async () => {
        if (app && app.isRunning()) {
            return app.stop()
        }
    }

    beforeEach(() => {
        return startApp()
    })

    afterEach(async (done) => {
        await stopApp()
        app = null
        done()
    })

    it("should open the app window", async (done) => {
        const numWindows = await app.client.getWindowCount()
        expect(numWindows).toBe(1)
        done()
    })
})
