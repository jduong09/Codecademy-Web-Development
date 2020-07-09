const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('/sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Router param to reduce boilerplate code, router param of artistId
artistsRouter.param('artistId', (req, res, next, artistId) => {
    const sql = `SELECT * FROM Artist WHERE Artist.id = $artistId`;
    const values = { $artistId: artistId };
    db.get(sql, values, (error, artist) => {
        if (err) {
            next(err);
        } else {
            if (artist) {
                req.artist = artist;
                next();
            } else {
                res.status(404);
            }
        }
    })
});

// Retrieve all currently-employed artists
artistsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Artist WHERE is_currently_employed = 1`, (err, artists) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({ artists: artists });
        }
    });
});

//Retrieve artist by artistId
artistsRouter.get(':artistId', (req, res, next) => {
    res.status(200).json({ artist: req.artist });
});

// Add new artist to Artist table
artistsRouter.post('/', (req, res, next) => {
    // Check that all required fields are present on the artist object of the request body.
    if (!req.body.artist.name || !req.body.artist.dateOfBirth || !req.body.artist.biography) {
        return res.status(400);
    }
    // Check if is_currently_employed was set on the request's artist object. If not, set to 1. 
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    const sql = 'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)';
    const values = {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed
    };

    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`, (error, artist) => {
                res.status(201).json({artist: artist});
            });
        }
    });
});

// Update Artist Table
artistsRouter.put(':artistId', (req, res, next) => {
     // Check that all required fields are present on the artist object of the request body.
     if (!req.body.artist.name || !req.body.artist.dateOfBirth || !req.body.artist.biography) {
        return res.status(400);
    }

    const sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE Artist.id = $artist.Id';
    const values = {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed,
        $artistId: req.params.artistId
    };

    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`, (error, artist) => {
                res.status(200).json({artist: artist});
            });

        }
    });
});

// Delete Artist (mark them as unemployed)
artistsRouter.delete(':artistId', (req, res, next) => {
    const sql = 'UPDATE Artist SET is_currently_employed = $isCurrentlyEmployed WHERE Artist.id = $artistId';
    const values = {
        $isCurrentlyEmployed: 0,
        $artistId: req.params.artistId
    }

    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Arist WHERE Artist.id = ${this.lastID}`, (error, artist) => {
                res.status(200).json({artist: artist});
            });
        }
    });
});


module.exports = artistsRouter;