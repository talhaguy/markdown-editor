import React from "react"
import { NoteListItem as NoteListItemModel } from "../../shared/models"
import styled from "styled-components"
import { NoteListItemContainer } from "./NoteListItemContainer"

const List = styled.ul`
    overflow-y: auto;
    height: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
`

interface NoteListProps {
    notes: NoteListItemModel[]
    onSelectNote: (noteId: string) => void
    onDeleteBtnClick: (fileName: string) => void
    selectedNoteId: string
}

export function NoteList({
    notes,
    onSelectNote,
    onDeleteBtnClick,
    selectedNoteId,
}: NoteListProps) {
    return (
        <>
            {notes.length > 0 ? (
                <List>
                    {notes.map((note, i) => (
                        <NoteListItemContainer
                            key={i}
                            note={note}
                            onSelectNote={onSelectNote}
                            onDeleteBtnClick={onDeleteBtnClick}
                            isSelected={selectedNoteId === note.id}
                        />
                    ))}
                </List>
            ) : (
                ""
            )}
        </>
    )
}
