import React from "react"
import { NoteListItem } from "../../shared"

interface NoteListProps {
    notes: NoteListItem[]
}

export function NoteList({ notes }: NoteListProps) {
    return (
        <>
            {notes.length > 0 ? (
                <ul>
                    {notes.map((note, i) => (
                        <li key={i}>
                            {note.title}
                            <br />
                            {note.preview}
                        </li>
                    ))}
                </ul>
            ) : (
                <span>No notes</span>
            )}
        </>
    )
}
