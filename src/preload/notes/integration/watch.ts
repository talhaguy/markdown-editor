import chokidar from "chokidar"
import path from "path"

export function startNotesWatch(
    chokidarLib: typeof chokidar,
    nodePath: typeof path,
    folderPath: string
) {
    // TODO: remove listener on previous folder; maybe return an unsub obj with method to unsub
    const watcher = chokidarLib
        .watch(nodePath.join(folderPath, "*.md"))
        .on("ready", () => {
            console.log("Initial scan complete. Ready for changes")

            watcher.on("add", (path) =>
                console.log(`File ${path} has been added`)
            )
            watcher.on("change", (path) =>
                console.log(`File ${path} has been changed`)
            )
            watcher.on("unlink", (path) =>
                console.log(`File ${path} has been removed`)
            )
        })
}
