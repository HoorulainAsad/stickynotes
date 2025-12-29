import React from 'react';

function Sidebar({ notes, selectedNoteId, onSelectNote, onAddNote, isOpen, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="app-brand">
                        <span>📑</span> Sticky Notes
                    </div>
                    <button className="add-note-btn" onClick={onAddNote}>
                        <span>+</span> New Note
                    </button>
                </div>

                <div className="sidebar-list">
                    {notes.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#868e96', fontSize: '0.9rem' }}>
                            No notes yet
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className={`sidebar-item ${selectedNoteId === note.id ? 'active' : ''}`}
                                onClick={() => onSelectNote(note.id)}
                            >
                                <h4>{note.title || 'Untitled Note'}</h4>
                                <p>{note.content || 'No content'}</p>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
