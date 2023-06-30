const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; //process.env.PORT is for heroku deployment

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => { // get request to get all notes
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => { // post request to add a note
  const newNote = req.body; // new note from client side
  addNote(newNote);
  res.json(newNote);
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
  
  function getNotes() {
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
    return JSON.parse(data);
  }
  
  function addNote(newNote) { // add new note to db.json by pushing new note to notes array
    const notes = getNotes();
    notes.push(newNote);
    saveNotes(notes);
  }
  
  function deleteNote(noteIndex) { // delete note from db.json
      const notes = getNotes();
      notes.splice(noteIndex, 1);
      saveNotes(notes);
    }

    function saveNotes(notes) { // save notes to db.json by writing to db.json
        fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2));
      }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
