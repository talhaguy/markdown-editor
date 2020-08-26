import * as React from "react"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"

export function App() {
    return (
        <div className="app">
            <div>
                <div>
                    <AppTitle />
                </div>
                <div>
                    <Controls />
                </div>
                <div>
                    <NoteList />
                </div>
            </div>
            <div>
                <Editor />
            </div>
        </div>
    )
}
