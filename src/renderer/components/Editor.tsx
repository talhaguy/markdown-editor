import React, { useEffect, useRef } from "react"
import CodeMirror from "codemirror"
import "codemirror/mode/gfm/gfm"
import "codemirror/lib/codemirror.css"

interface EditorProps {
    noteContent: string
}

export function Editor({ noteContent }: EditorProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const editorContainerRef = useRef<HTMLDivElement>()

    useEffect(() => {
        textAreaRef.current.value = noteContent
        const codeMirror = CodeMirror.fromTextArea(textAreaRef.current, {
            mode: "gfm",
        })

        return () => {
            codeMirror.toTextArea()
        }
    }, [noteContent])

    return (
        <div ref={editorContainerRef}>
            <textarea ref={textAreaRef}></textarea>
        </div>
    )
}
