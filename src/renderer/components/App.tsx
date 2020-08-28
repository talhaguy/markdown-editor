import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext } from "../providers"

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
    const [notes, setNotes] = useState([])

    const {
        selectFolder,
        getNotesInFolder,
        createNewNote,
        startNotesWatch,
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
            .then((files) => {
                console.log(files)
                setNotes(files)
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
                    <NoteList notes={notes} />
                </div>
            </LeftColumn>
            <RightColumn>
                <Editor />
            </RightColumn>
        </Container>
    )
}
