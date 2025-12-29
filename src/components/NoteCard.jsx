import { useState } from 'react';

function NoteCard({ note, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            onDelete(note.id);
        }, 300);
    };

    return (
        <div className={`note-card note-${note.color} ${isDeleting ? 'deleting' : ''}`}>
            {note.title && <h3 className="note-title">{note.title}</h3>}
            {note.content && <p className="note-content">{note.content}</p>}
            <div className="note-footer">
                <span className="note-date">{note.createdAt}</span>
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    aria-label="Delete note"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default NoteCard;
