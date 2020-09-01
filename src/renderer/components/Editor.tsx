import React, { useEffect, useRef, useContext } from "react"
import CodeMirror from "codemirror"
import "codemirror/mode/gfm/gfm"
import "codemirror/lib/codemirror.css"
import { MainToRendererApiContext } from "../providers"

interface EditorProps {
    noteContent: string
    folderPath: string
    noteFileName: string
}

export function Editor({ noteContent, folderPath, noteFileName }: EditorProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const editorContainerRef = useRef<HTMLDivElement>()
    const { saveNote } = useContext(MainToRendererApiContext)

    const timerRef = useRef<number>(null)
    const isSavingRef = useRef(false)
    const editorNoteContentRef = useRef("")
    const saveNotePromiseRef = useRef(null)

    const startSaveNote = () => {
        // save changes
        console.log("saving...", folderPath, noteFileName)
        isSavingRef.current = true
        saveNotePromiseRef.current = saveNote(
            folderPath,
            noteFileName,
            editorNoteContentRef.current
        )
        saveNotePromiseRef.current
            .then(() => {
                console.log("...done saving")

                // TODO: refresh notes list
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                isSavingRef.current = false
                saveNotePromiseRef.current = null
            })
    }

    const changeHandler = (
        instance: CodeMirror.Editor,
        changeObj: CodeMirror.EditorChangeLinkedList
    ) => {
        console.log("batch...")
        editorNoteContentRef.current = instance.getValue()

        // clear timer if already started
        if (timerRef.current) {
            console.log("kill old batch")
            clearTimeout(timerRef.current)
        }
        // start timer
        timerRef.current = window.setTimeout(() => {
            console.log("... done batch")
            // if already performing save, skip
            console.log("isSavingRef.current", isSavingRef.current)
            if (!isSavingRef.current) {
                startSaveNote()
            }

            clearTimeout(timerRef.current)
            timerRef.current = null
        }, 3000)
    }

    useEffect(() => {
        editorNoteContentRef.current = noteContent
        textAreaRef.current.value = noteContent
        const codeMirror = CodeMirror.fromTextArea(textAreaRef.current, {
            mode: "gfm",
        })

        codeMirror.on("change", changeHandler)

        return () => {
            // do a final save before closing file
            // kill timer and save right away
            clearTimeout(timerRef.current)
            if (noteFileName !== null && folderPath !== null) {
                if (isSavingRef.current) {
                    saveNotePromiseRef.current
                        .then(() => {
                            console.log("...done saving")
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    startSaveNote()
                }
            }

            // destroy codeMirror instance
            codeMirror.toTextArea()
        }
    }, [noteContent, folderPath, noteFileName])

    return (
        <div ref={editorContainerRef}>
            <textarea ref={textAreaRef}></textarea>
        </div>
    )
}
