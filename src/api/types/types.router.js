const express = require('express');
const TypesService = require('./types.service');

/**
 * Types Routing middleware
 */

const typesRouter = express.Router();

//regular route
typesRouter
        .route('/')
        .post(TypesService.post)


//route for types/:id
typesRouter
        .route('/:id')
        .all(TypesService.All)
        .get(TypesService.getById) //get the type for the provided type id
        .put(TypesService.updateById)
        .delete(TypesService.deleteById)


//route for types/all
typesRouter
        .route('/all')
        .get(TypesService.getAll) //get all the types


module.exports = typesRouter;