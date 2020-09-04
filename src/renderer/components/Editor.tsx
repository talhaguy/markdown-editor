import React from "react"
import "codemirror/mode/gfm/gfm"
import "codemirror/lib/codemirror.css"
import { useCodeMirror, useCodeMirrorSave } from "../hooks"

interface EditorProps {
    noteContent: string
    folderPath: string
    noteFileName: string
    refreshNotesList: () => void
}

export function Editor({
    noteContent,
    folderPath,
    noteFileName,
    refreshNotesList,
}: EditorProps) {
    const [codeMirrorRef, textAreaRef] = useCodeMirror(
        noteFileName,
        noteContent
    )
    useCodeMirrorSave(
        codeMirrorRef,
        noteContent,
        folderPath,
        noteFileName,
        refreshNotesList
    )

    const validNoteOpen = noteContent !== null && noteFileName !== null

    return (
        <>
            <textarea ref={textAreaRef} style={{ display: "none" }}></textarea>
            {!validNoteOpen ? <>No note open</> : ""}
        </>
    )
}
