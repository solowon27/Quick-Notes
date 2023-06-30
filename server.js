const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => { // get request to get all notes
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => { // post request to add a note
  const newNote = req.body;
  addNote(newNote);
  res.json(newNote);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
