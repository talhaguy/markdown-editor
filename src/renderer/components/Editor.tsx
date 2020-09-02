import React, { useEffect, useRef, useContext, MutableRefObject } from "react"
import CodeMirror from "codemirror"
import "codemirror/mode/gfm/gfm"
import "codemirror/lib/codemirror.css"
import { MainToRendererApiContext } from "../providers"

function useCodeMirror(noteFileName: string, noteContent: string) {
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const codeMirrorRef = useRef<CodeMirror.EditorFromTextArea>()

    useEffect(() => {
        textAreaRef.current.value = noteContent
        codeMirrorRef.current = CodeMirror.fromTextArea(textAreaRef.current, {
            mode: "gfm",
        })

        return () => {
            // destroy codeMirror instance
            codeMirrorRef.current.toTextArea()
            codeMirrorRef.current = null
        }
    }, [noteFileName, noteContent])

    return [codeMirrorRef, textAreaRef] as [
        MutableRefObject<CodeMirror.EditorFromTextArea>,
        MutableRefObject<HTMLTextAreaElement>
    ]
}

function useCodeMirrorSave(
    codeMirror: MutableRefObject<CodeMirror.EditorFromTextArea>,
    noteContent: string,
    folderPath: string,
    noteFileName: string
) {
    const { saveNote } = useContext(MainToRendererApiContext)
    const timerRef = useRef<number>(null)
    const isSavingRef = useRef(false)
    const editorNoteContentRef = useRef("")
    const saveNotePromiseRef = useRef(null)
    const fileChanged = useRef(false)

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
        fileChanged.current = true
        editorNoteContentRef.current = instance.getValue()

        // clear timer if already started
        if (timerRef.current) {
            console.log("kill old batch")
            clearTimeout(timerRef.current)
        }
        // start timer
        timerRef.current = window.setTimeout(() => {
            console.log("...done batch")
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
        if (codeMirror.current && noteContent !== null) {
            editorNoteContentRef.current = noteContent
            codeMirror.current.on("change", changeHandler)
        }

        return () => {
            // do a final save before closing file
            // kill timer and save right away
            clearTimeout(timerRef.current)
            if (
                noteFileName !== null &&
                folderPath !== null &&
                noteContent !== null &&
                fileChanged.current
            ) {
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

            fileChanged.current = false
        }
    }, [codeMirror.current, noteContent, folderPath, noteFileName])
}

interface EditorProps {
    noteContent: string
    folderPath: string
    noteFileName: string
}

export function Editor({ noteContent, folderPath, noteFileName }: EditorProps) {
    const [codeMirrorRef, textAreaRef] = useCodeMirror(
        noteFileName,
        noteContent
    )
    useCodeMirrorSave(codeMirrorRef, noteContent, folderPath, noteFileName)

    return (
        <div>
            <textarea ref={textAreaRef}></textarea>
        </div>
    )
}
