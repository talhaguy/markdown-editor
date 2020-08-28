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
