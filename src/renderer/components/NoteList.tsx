import React, { MouseEvent } from "react"
import { NoteListItem } from "../../models"
import styled from "styled-components"

const List = styled.ul`
    overflow: scroll;
`

interface NoteListProps {
    notes: NoteListItem[]
    onSelectNote: (noteId: string) => void
    onDeleteBtnClick: (fileName: string) => void
}

export function NoteList({
    notes,
    onSelectNote,
    onDeleteBtnClick,
}: NoteListProps) {
    const onDeleteClick = (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        fileName: string
    ) => {
        event.stopPropagation()
        console.log("delete clicked")
        onDeleteBtnClick(fileName)
    }

    return (
        <>
            {notes.length > 0 ? (
                <List>
                    {notes.map((note, i) => (
                        <li key={i} onClick={() => onSelectNote(note.id)}>
                            {note.title ? note.title : "N/A"}
                            <br />
                            {note.preview ? note.preview : "N/A"}
                            <br />
                            {note.lastModifiedDate
                                ? new Date(
                                      note.lastModifiedDate
                                  ).toLocaleString()
                                : "N/A"}
                            <br />
                            <button
                                onClick={(event) =>
                                    onDeleteClick(event, note.id)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </List>
            ) : (
                <span>No notes</span>
            )}
        </>
    )
}
