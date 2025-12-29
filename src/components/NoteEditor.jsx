import React, { useState, useEffect, useRef } from 'react';

function NoteEditor({ note, onUpdateNote, onDeleteNote }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isListening, setIsListening] = useState(false);

    const [interimText, setInterimText] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Voice-to-Text Logic
    const recognitionRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        setErrorMsg('');
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setErrorMsg('Not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('Voice recognition started. Speak into the microphone.');
            setIsListening(true);
            setInterimText('');
            setErrorMsg('');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                setContent((prev) => {
                    const newContent = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript;
                    return newContent;
                });
            }
            setInterimText(interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech') {
                return;
            }
            if (event.error === 'not-allowed') {
                setErrorMsg('Mic access denied. Check settings.');
            } else {
                setErrorMsg(`Error: ${event.error}`);
            }
            stopListening();
        };

        recognition.onend = () => {
            console.log('Voice recognition ended.');
            setIsListening(false);
            setInterimText('');
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (error) {
            console.error("Failed to start recognition:", error);
            setErrorMsg('Failed to start.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setInterimText('');
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            // If the note is new (empty), default to edit mode
            if (!note.title && !note.content) {
                setIsEditing(true);
            } else {
                setIsEditing(false);
            }
        }
    }, [note]);

    if (!note) {
        return (
            <div className="main-content">
                <div className="no-selection">
                    <div className="no-selection-icon">📝</div>
                    <h2>Select a note to view</h2>
                    <p>Choose a note from the sidebar or create a new one.</p>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        onUpdateNote({
            ...note,
            title,
            content,
            updatedAt: new Date().toISOString()
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(note.title);
        setContent(note.content);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDeleteNote(note.id);
    };

    return (
        <main className="main-content">
            <div className="note-editor-container">
                {!isEditing ? (
                    // View Mode
                    <>
                        <div className="note-view-header">
                            <h1 className="note-title-display">{note.title || 'Untitled Note'}</h1>
                            <div className="note-actions">
                                <button className="action-btn" onClick={() => setIsEditing(true)}>
                                    <span>✎</span> Edit
                                </button>
                                <button className="action-btn delete" onClick={handleDelete}>
                                    <span>🗑</span> Delete
                                </button>
                            </div>
                        </div>
                        <div className="note-content-display">
                            {note.content || <span style={{ fontStyle: 'italic', color: '#adb5bd' }}>No content...</span>}
                        </div>
                    </>
                ) : (
                    // Edit Mode
                    <div className="note-edit-form">
                        <input
                            type="text"
                            className="edit-input-title"
                            placeholder="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <textarea
                                className="edit-input-content"
                                placeholder="Start typing or click the mic to speak..."
                                value={isListening ? content + ' ' + interimText : content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            {isListening && interimText && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '80px',
                                    left: '20px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontSize: '0.9rem',
                                    pointerEvents: 'none'
                                }}>
                                    Hearing: "{interimText}"...
                                </div>
                            )}
                            {errorMsg && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '80px',
                                    right: '2px', // Align with mic
                                    background: '#fee2e2',
                                    color: '#b91c1c',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontSize: '0.8rem',
                                    maxWidth: '150px',
                                    textAlign: 'center',
                                    border: '1px solid #fecaca',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}>
                                    {errorMsg}
                                </div>
                            )}
                            <button
                                className={`mic-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                title={isListening ? "Stop Listening" : "Start Voice Typing"}
                            >
                                {isListening ? '⏹' : '🎤'}
                            </button>
                        </div>
                        <div className="edit-actions">
                            <button className="action-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="action-btn primary" onClick={handleSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default NoteEditor;
