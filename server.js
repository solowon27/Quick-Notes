const express = require('express'); // import express package
const path = require('path'); // import path package
const fs = require('fs'); // import fs package
const uuid = require('./helper/uuid'); // import uuid package

const app = express(); // create express app 
const PORT = process.env.PORT || 3000; //process.env.PORT is for heroku deployment

app.use(express.json()); // middleware to parse incoming data   
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // middleware to serve static files

app.get('/api/notes', (req, res) => { // get request to get all notes
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => { // post request to add a note
  const newNote = req.body; // new note from client side
  addNote(newNote);
  res.json(newNote);
});

function getNoteIds() { // get note ids from db.json
  const notes = getNotes();
  const noteIds = notes.map(note => note.id);
  return noteIds;
  
}
app.get('/api/notes/:id', (req, res) => {
    const noteIds = getNoteIds();
  res.json(noteIds);
});

app.delete('/api/notes/:id', (req, res) => { // delete request to delete a note
    const noteId = req.params.id; 
    deleteNote(noteId);
    res.sendStatus(200);
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // get request to get/return notes.html
  });
  
  app.get('*', (req, res) => { // get request to get/return index.html
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  function getNotes() { // get notes from db.json
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'); // read db.json
    return JSON.parse(data);
  }
  
  function addNote(newNote) { // add new note to db.json by pushing new note to notes array
    const notes = getNotes();
    const noteWithId = {
        id: uuid(),
        ...newNote
    };
    notes.push(noteWithId);
    saveNotes(notes);
  }
  function deleteNote(noteId) {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  }
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    deleteNote(noteId);
    res.sendStatus(200);
  });

    function saveNotes(notes) { // save notes to db.json by writing to db.json
        fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2));
      }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
