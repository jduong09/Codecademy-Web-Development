const express = require('express');
const apiRouter = express.Router(); 
const artistsRouter = require('/artists.js');
const seriesRouter = require('/series.js');
const issuesRouter = require('/issues.js');

app.use('/artists', artistsRouter);
app.use('/series', seriesRouter);
app.use('/issues', issuesRouter);

module.exports = apiRouter;