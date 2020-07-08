const express = require('express');
const apiRouter = express.Router(); 
const artistsRouter = require('/artists.js');
const seriesRouter = require('/series.js');

app.use('/artists', artistsRouter);
app.use('/series', seriesRouter);


module.exports = apiRouter;
