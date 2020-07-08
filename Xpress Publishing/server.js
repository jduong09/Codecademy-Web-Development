const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('errorhandler');
const apiRouter = require('./api/api');

const PORT = process.env.PORT || 4000;

//Mount apiRouter at all routes starting at /api
app.use('/api', apiRouter);


app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(errorHandler());

//Start server and log a message once server is running
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});

module.exports = app;
