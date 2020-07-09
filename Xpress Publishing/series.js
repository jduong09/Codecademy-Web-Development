const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('/sqlite3');
const issuesRouter = require('/issues.js');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Mount Issues Router
app.use('/:seriesId/issues', issuesRouter);

//Router Param for handling the seriesId parameter
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
    const sql = `SELECT * FROM Series WHERE Series.id = $seriesId`;
    const values = { $seriesId: seriesId };
    db.get(sql, values, (error, series) => {
        if (err) {
            next(err);
        } else {
            if (series) {
                req.series = series;
                next();
            } else {
                res.status(404);
            }
        }
    });
});

//Retrieve all existing series from the Database
seriesRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Series`, (err, series) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({ series: series });
        }
    });
});

//Retrive a single series from the Database
seriesRouter.get('/:seriesId', (req, res, next) => {
    res.status(200).json({ series: req.series });
});

//Add new series to Database
seriesRouter.post('/', (req, res, next) => {
    if (!req.body.series.name || !req.body.series.description) {
        res.status(400);
    } 
    const sql = `INSERT INTO Series (name, description) VALUES ($name, $description)`;
    const values = { $name: name, $description: description };

    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Series WHERE Series.id = ${this.lastID}`, (error, series) => {
                res.status(201).json({series: series});
            });
        }
    });
});

//Update a series in the Database
seriesRouter.put(':seriesId', (req, res, next) => {
    if (!req.body.series.name || !req.body.series.description) {
        return res.status(400);
    }

    const sql = 'UPDATE Series SET name = $name, description = $description WHERE Series.id = $seriesId';
    const values = {
        $name: name,
        $description: description,
        $seriesId: req.params.seriesId
    };

    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Series WHERE Series.id = ${req.params.seriesId}`, (error, series) => {
                res.status(200).json({series: series});
            });
        }
    });
});

//Delete a series in the Database
seriesRouter.delete('/:seriesId', (req, res, next) => {
    const issueSql = 'SELECT * FROM Issue WHERE Issue.series_id = $seriesId';
    const issuesValues = {$seriesId: req.params.seriesId};

    db.get(issueSql, issuesValues, (error, issue) => {
        if (error) {
            next(error) {
            } else if (issue) {
                res.status(400);
            } else {
                const deleteSql = 'DELETE FROM Series WHERE Series.id = $seriesID';
                const deleteValues = {$seriesId: req.params.seriesId};

                db.run(deleteSql, deleteValues, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(204);
                    }
                });
            }
        }
    });
});

module.exports = seriesRouter;