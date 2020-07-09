const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//Create Artists Table
db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS Artist`);
    db.run(`CREATE TABLE IF NOT EXISTS Artist (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        biography TEXT NOT NULL,
        is_currently_employed INTEGER DEFAULT 1
    )`);
});

//Create Series Table
db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS Series`);
    db.run(`CREATE TABLE IF NOT EXISTS Series (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL
    )`);
});

//Create Issues Table
db.serialize(() => {
    db.run(`DREOP TABLE IF EXISTS Issues`);
    db.run(`CREATE TABLE IF NOT EXISTS Series (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        issue_number INTEGER NOT NULL,
        publication_date TEXT NOT NULL,
        artist_id INTEGER NOT NULL,
        series_id INTEGER NOT NULL,
        FOREIGN KEY(artist_id) REFERENCES Artist(id),
        FOREIGN KEY(series_id) REFERENCES Series(id)
    )`);
});
