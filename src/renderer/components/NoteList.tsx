import React from "react"
import { NoteListItem } from "../../shared"

interface NoteListProps {
    notes: NoteListItem[]
    onSelectNote: (noteId: string) => void
}

export function NoteList({ notes, onSelectNote }: NoteListProps) {
    return (
        <>
            {notes.length > 0 ? (
                <ul>
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
                        </li>
                    ))}
                </ul>
            ) : (
                <span>No notes</span>
            )}
        </>
    )
}
