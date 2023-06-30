const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => { // get request to get all notes
  const notes = fetchNote();
  res.json(notes);
});

app.post('/api/notes', (req, res) => { // post request to add a note
  const newNote = req.body; // new note from client side
  addNote(newNote);
  res.json(newNote);
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // get request to get/return notes.html
  });
  
  app.get('*', (req, res) => { // get request to get/return index.html
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  function fetchNote() {
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
    return JSON.parse(data);
  }
  
  function addNote(newNote) {
    const notes = fetchNote();
    notes.push(newNote);
    saveNotes(notes);
  }
  

    function saveNotes(notes) {
        fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2));
      }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
