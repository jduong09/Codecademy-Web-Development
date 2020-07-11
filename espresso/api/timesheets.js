const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheet.Id';
    const values = {$timesheetId: timesheetId};

    db.get(sql, values, (error, timesheet) => {
        if (error) {
            next(error);
        } else if (timesheet) {
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

//Retrieve timesheets from database timesheet where employee id matches.
timesheetsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId';
    const values = { $employeeId: req.params.employeeId };

    db.all(sql, values, (error, timesheets) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json({timesheets: timesheets});
        }
    });
});

// Create new timesheet as long as the req.body has all the required information to insert into the database
timesheetsRouter.post('/', (req, res, next) => {
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    if (!hours || !rate || date) {
        return res.sendStatus(400);
    }

    const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: employeeId
    }

    db.run(sql, values, (error, timesheets) => {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = {this.lastID}`, 
            (error, timesheet) => {
                res.status(201).json({timesheet: timesheet});
            });
        }
    });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    if (!hours || !rate || !date) {
        return res.sendStatus(400);
    }

    const sql = 'UPDATE TIMESHEET SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: employeeId,
        $timesheetId: req.params.timesheetId
    };

    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`, 
            (error, timesheet) => {
                res.status(200).json({timesheet: timesheet});
            });
        }
    });
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
    const sql = 'DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId';
    const values = {
        $timesheetId: req.params.timesheetId
    };

    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = timesheetsRouter;
