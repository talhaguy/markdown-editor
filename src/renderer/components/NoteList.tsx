import React from "react"

interface NoteListProps {
    notes: string[]
}

export function NoteList({ notes }: NoteListProps) {
    return (
        <>
            {notes.length > 0 ? (
                <ul>
                    {notes.map((note, i) => (
                        <li key={i}>note</li>
                    ))}
                </ul>
            ) : (
                <span>No notes</span>
            )}
        </>
    )
}
