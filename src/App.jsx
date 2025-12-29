import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
// NoteForm and NotesList are no longer needed
import './index.css';

const STORAGE_KEY = 'sticky-notes-app';

function App() {
    const [notes, setNotes] = useState(() => {
        // Load notes from localStorage on initial render
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        return savedNotes ? JSON.parse(savedNotes) : [];
    });

    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: '',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setSelectedNoteId(newNote.id);
    };

    const updateNote = (updatedNote) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
            )
        );
    };

    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        if (selectedNoteId === id) {
            setSelectedNoteId(null);
        }
    };

    const selectedNote = notes.find((note) => note.id === selectedNoteId);

    const handleSelectNote = (noteId) => {
        setSelectedNoteId(noteId);
        setIsSidebarOpen(false); // Close sidebar on mobile after selecting
    };

    return (
        <div className="app-container">
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            <Sidebar
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={handleSelectNote}
                onAddNote={addNote}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <NoteEditor
                note={selectedNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
            />
        </div>
    );
}

export default App;
