const express = require('express');
const ExpensesService = require('./expenses.service');

/**
 * Expenses Routing middleware
 */

const expensesRouter = express.Router();

//regular route
expensesRouter
        .route('/')
        .post(ExpensesService.post)


//route for expenses/:id
expensesRouter
        .route('/:id')
        .all(ExpensesService.All)
        .post(ExpensesService.getAllByUserId)
        .get(ExpensesService.getById)
        .put(ExpensesService.updateById)
        .delete(ExpensesService.deleteById)

module.exports = expensesRouter;