import { useEffect, useRef, useContext, MutableRefObject } from "react"
import { CodeMirrorContext, MainToRendererApiContext } from "../providers"

export function useCodeMirror(noteFileName: string, noteContent: string) {
    const CodeMirror = useContext(CodeMirrorContext)
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const codeMirrorRef = useRef<CodeMirror.EditorFromTextArea>()

    useEffect(() => {
        if (noteFileName && noteContent) {
            textAreaRef.current.value = noteContent
            codeMirrorRef.current = CodeMirror.fromTextArea(
                textAreaRef.current,
                {
                    mode: "gfm",
                    theme: "monokai custom",
                }
            )
            codeMirrorRef.current
                .getWrapperElement()
                .setAttribute("data-testid", "code-mirror")
            codeMirrorRef.current.focus()

            // give access to e2e tests to modify note content
            ;(window as any).__e2e = {
                codeMirror: codeMirrorRef.current,
            }
        }

        return () => {
            // destroy codeMirror instance
            codeMirrorRef.current?.toTextArea()
            // set display of text area to none as `codeMirrorRef.current.toTextArea()` recreates the DOM node
            textAreaRef.current.style.display = "none"
            codeMirrorRef.current = null
        }
    }, [noteFileName, noteContent])

    return [codeMirrorRef, textAreaRef] as [
        MutableRefObject<CodeMirror.EditorFromTextArea>,
        MutableRefObject<HTMLTextAreaElement>
    ]
}

export function useCodeMirrorSave(
    codeMirror: MutableRefObject<CodeMirror.EditorFromTextArea>,
    noteContent: string,
    folderPath: string,
    noteFileName: string,
    refreshNotesList: () => void
) {
    const { saveNote } = useContext(MainToRendererApiContext)
    const timerRef = useRef<number>(null)
    const isSavingRef = useRef(false)
    const editorNoteContentRef = useRef("")
    const saveNotePromiseRef = useRef(null)
    const fileChanged = useRef(false)

    const startSaveNote = () => {
        // save changes
        isSavingRef.current = true
        saveNotePromiseRef.current = saveNote(
            folderPath,
            noteFileName,
            editorNoteContentRef.current
        )
        saveNotePromiseRef.current
            .then(() => {
                refreshNotesList()
            })
            .catch((err) => {
                console.error(err)
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
        fileChanged.current = true
        editorNoteContentRef.current = instance.getValue()

        // clear timer if already started
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        // start timer
        timerRef.current = window.setTimeout(() => {
            // if already performing save, skip
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
                    saveNotePromiseRef.current.catch((err) => {
                        console.error(err)
                    })
                } else {
                    startSaveNote()
                }
            }

            fileChanged.current = false
        }
    }, [codeMirror.current, noteContent, folderPath, noteFileName])
}
