import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext } from "../providers"
import { NoteListItem, NoteListMap } from "../../shared"

const Container = styled.div`
    display: flex;
`

const LeftColumn = styled.div`
    width: 265px;
`

const RightColumn = styled.div`
    flex-grow: 1;
`

export function App() {
    const [folderPath, setFolderPath] = useState(null)
    const [notesListMap, setNotesListMap] = useState<NoteListMap>({})
    const [selectedNoteId, setSelectedNoteId] = useState<string>(null)
    const [noteContent, setNoteContent] = useState<string>(null)

    const {
        selectFolder,
        getNotesInFolder,
        createNewNote,
        startNotesWatch,
        getNoteContent,
    } = useContext(MainToRendererApiContext)

    const chooseFolder = () => {
        selectFolder()
            .then((folderPath) => {
                console.log("chosen folder", folderPath)
                setFolderPath(folderPath)
                getNotesInDirectory(folderPath)
            })
            .catch(() => {
                console.log("canceled")
            })
    }

    const getNotesInDirectory = (path) => {
        getNotesInFolder(path)
            .then((notesListMap) => {
                console.log(notesListMap)
                setNotesListMap(notesListMap)
            })
            .catch((e) => {
                console.log("error getting notes")
            })
    }

    const createNewNoteFile = () => {
        createNewNote(folderPath)
            .then(() => {
                console.log("done creating note")
            })
            .catch(() => {
                console.log("could not create note")
            })

        getNotesInDirectory(folderPath)
    }

    const onSelectNote = (noteId: string) => {
        setSelectedNoteId(noteId)

        getNoteContent(folderPath, noteId)
            .then((noteContent) => {
                setNoteContent(noteContent)
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        if (folderPath) {
            console.log("got folder path, start watch")
            startNotesWatch(folderPath)
        }
    }, [folderPath])

    return (
        <Container>
            <LeftColumn>
                <div>
                    <AppTitle />
                </div>
                <div>
                    <Controls
                        chooseFolder={chooseFolder}
                        folderName={folderPath}
                        createNewNote={createNewNoteFile}
                    />
                </div>
                <div>
                    <NoteList
                        notes={Object.values(notesListMap)}
                        onSelectNote={onSelectNote}
                    />
                </div>
            </LeftColumn>
            <RightColumn>
                <Editor
                    noteContent={noteContent}
                    folderPath={folderPath}
                    noteFileName={selectedNoteId}
                />
            </RightColumn>
        </Container>
    )
}
