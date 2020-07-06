const express = require('express');
const morgan = require('morgan');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

// return a single random quote when you click the 'Fetch a Random Quote' button
app.get('/api/quotes/random', (req, res, next) => {
  const getRandomQuote = getRandomElement(quotes);
  res.send({ quote: getRandomQuote });
});

// return all quotes when you click 'Fetch all Quote'
app.get('/api/quotes', (req, res, next) => {
  if (!req.query.hasOwnProperty('person')) {
    res.send({ quotes: quotes });
  } else {
    const filterPerson = quotes.filter(element => element.person === req.query.person);
    res.send({ quotes: filterPerson });
  }
});

app.post('/api/quotes', (req, res, next) => {
  if (!req.query.person || !req.query.quote) {
    res.status(400).send();
  } else {
    const newQuote = { quote: req.query.quote, person: req.query.person };
    quotes.push(newQuote);
    res.send({ quote: newQuote });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
