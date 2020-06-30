const ideasRouter = require('express').Router();

module.exports = ideasRouter;

const { 
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
  } = require('./db');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');


ideasRouter.param('id', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);
  if (idea) {
    req.idea = idea;
    next();
  } else {
    res.status(404).send();
  }
});

// GET /api/ideas to get an array of all ideas.
ideasRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
});

// POST /api/ideas to create a new idea and save it to the database
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    let createIdea = addToDatabase('ideas', req.body);
    res.status(201).send(createIdea);
});
// GET /api/ideas/:ideaId to get a single idea by id.
ideasRouter.get('/:id', (req, res, next) => {
    res.send(req.idea);
});
// PUT /api/ideas/:ideaId to update a single idea by id.
ideasRouter.put('/:id', checkMillionDollarIdea, (req, res, next) => {
    let updateIdea = updateInstanceInDatabase('ideas', req.body);
    res.send(updateIdea);
});
// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideasRouter.delete('/:id', (req, res, next) => {
    let deleteIdea = deleteFromDatabasebyId('ideas', req.params.id);
    if (deleteIdea) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});
