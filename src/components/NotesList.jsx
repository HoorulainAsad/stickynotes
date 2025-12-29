import NoteCard from './NoteCard';

function NotesList({ notes, onDeleteNote }) {
    if (notes.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-text">No notes yet!</p>
                <p className="empty-subtext">Create your first note above to get started.</p>
            </div>
        );
    }

    return (
        <div className="notes-container">
            <div className="notes-grid">
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={onDeleteNote}
                    />
                ))}
            </div>
        </div>
    );
}

export default NotesList;
