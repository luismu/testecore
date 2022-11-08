import React, { useState, useReducer } from 'react';
import { notesReducer } from './reducer';
import { v4 as uuid } from 'uuid';

const initialNotesState = {
    lastNoteCreated: null,
    totalNotes: 0,
    notes: [],
};


export function App() {
    const [notesState, dispatch] = useReducer(notesReducer, initialNotesState);
    const [noteInput, setNoteInput] = useState('');
    const [trashList, setTrashList] = useState({
        targetTrashItem: null,
        status: 'NA',
        trash: []
    })

    const addNote = event => {
        event.preventDefault();
        if (!noteInput) {
            return;
        }

        const newNote = {
            id: uuid(),
            text: noteInput,
            rotate: Math.floor(Math.random() * 20)
        }

        dispatch({ type: 'ADD_NOTE', payload: newNote });
        setNoteInput('');
    };

    const dragOver = event => {
        event.stopPropagation();
        event.preventDefault();
        setTrashList({status: 'onDragOver'})
    }

    const dropNote = (event, note) => {
        setTrashList ({ status: 'onStart', targetTrashItem: note}) //saves dragged item id
        console.log(trashList.targetTrashItem)
        event.target.style.left = `${event.pageX - 50}px`;
        event.target.style.top = `${event.pageY - 50}px`;
    };

    const onDrop = () => {
        
       let item = trashList.targetTrashItem
       //dispatch({ type: 'DELETE_NOTE', payload: item})
       setTrashList({status: 'onDrop'})
       //console.log(item)
    }

    return (
        //onDragOver={dragOver}
        <div className="app" >
            <h1>
                Sticky Notes ({notesState.totalNotes})
                <span>{notesState.notes.length ? `Last note created: ${notesState.lastNoteCreated}` : ' '}</span>
            </h1>

            <form className="note-form" onSubmit={addNote}>
                <textarea placeholder="Create a new note..." 
                    value={noteInput}
                    onChange={event => setNoteInput(event.target.value)}>
                </textarea>
                <button>Add</button>
            </form>

            {notesState
                .notes
                .map(note => (
                    <div className="note"
                        style={{ transform: `rotate(${note.rotate}deg)` }}
                        onDragEnd={(event) => dropNote(event , note)}
                       
                        draggable="true"
                        key={note.id}>

                        <div onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })}
                            className="close">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <pre className="text">{note.text}</pre>
                    </div>
                ))
            }

            <div >
                <img src={require('./img/trashcanempty.png')} 
                className="trash"
                onDragOver={dragOver}
                onDrop={onDrop}/>
            </div>
        </div>
    );
}