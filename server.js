const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const dbPath = './db/db.json';
const readTheFile = util.promisify(fs.readFile);
process.env.PORT;
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const noteid = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
app.get('/api/notes', (req,res) => {
  readTheFile(dbPath).then((data) => res.json(JSON.parse(data)));
})
// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
const writeTheFile = (location, data) => {
  fs.writeFile(location, JSON.stringify(data), (err) =>{
    if (err) {
      console(err);
      return;
    }
  })
}


const appendFile = (content, file) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      console(err);
    } else {
    const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeTheFile(file, parsedData);
  }
});
}
// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: noteid()
    };

    const response = {
      status: 'success',
      body: newNote,
    };
    appendFile(newNote, dbPath);

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }

  
});


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
