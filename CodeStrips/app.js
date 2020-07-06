const express =  require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/strips', (req, res, next) => {
  db.all('SELECT * FROM Strip', (err, rows) => {
    if (err) {
      res.status(500);
    } else {
      res.send({ strips: rows })
    }
  });
});

const validateStrip = (req, res, next) => {
  const stripToCreate = req.body.strip;
  if (
  !stripToCreate.head ||
  !stripToCreate.body ||
  !stripToCreate.background ||
  !stripToCreate.bubbleType
  ) {
    return res.status(400);
  }
  next();
};

app.post('/strips', validateStrip, (req, res, next) => {
  const stripToCreate = req.body.strip;
  db.run(
    `INSERT INTO Strip (head, body, background, bubble_type, bubble_text, caption) VALUES ($head, $body, $background, $bubbleType, $bubbleText, $caption)`, 
    {
      $head: stripToCreate.head,
      $body: stripToCreate.body,
      $background: stripToCreate.background,
      $bubbleType: stripToCreate.bubbleType,
      $bubbleText: stripToCreate.bubbleText,
      $caption: stripToCreate.caption
    },
  function(err) {
    if (err) {
      return res.status(500); //internal server error
    }
    db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err, row) => {
      if (!row) {
        res.status(500);
      }
      res.status(201).send({ strip: row });
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

module.exports = app;
