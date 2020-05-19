const db = require("../../knexContext");
const xss = require('xss');
const logger = require('./../../logger');

//Expenses table
const expensesTable = 'expenses';

/**
 * XSS validator
 * @param {object} expense 
 */
const sanitizeExpense = (expense) => (
    {
        id: expense.id, 
        user_id: expense.user_id, 
        type_id: expense.type_id, 
        amount: expense.amount, 
        name: xss(expense.name), 
        description: xss(expense.description), 
        date: expense.date.toLocaleDateString()
    }
);

/**
 * Validator function to validate the object expense has valid data
 * @param {object} expense 
 */
const validate = (expense) => {
    for (const [key, value] of Object.entries(expense)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} );
        }
    }
}

/**
 * ExpensesService
 */
const ExpensesService = {

    /**
     * validates that requests with 'GET', 'PUT', 'PATCH', 'DELETE' have a valid user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    All(req, res, next){
        try {
            const method = req.method;
            const id = req.params.id;
            const verbs = ['GET', 'PUT', 'PATCH', 'DELETE'];

            if( verbs.includes(method) && isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } );
            }

            next()
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at expenses.service.All', 
                internalMessage: error.message
            });
        }
    },

    /**
     * getAllByUserId: returns a list of expenses for the user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getAllByUserId(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*')
                    .from(expensesTable)
                    .where({
                        user_id: id
                    })
                    .then( expenses => {
                        res.status(200).json(expenses.map(expense => sanitizeExpense(expense)));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at expenses.service.getAllByUserId`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting expenses', 
                status: error.status, 
                loc: 'at expenses.service.getAllByUserId', 
                internalMessage: error.message
            });
        }
    },

    /**
     * getById: gets an expense for the expense id provided
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getById(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*')
                    .from(expensesTable)
                    .where({ id: id })
                    .then( expenses => {
                        const expense = expenses[0];
                        if(!expense) {
                            throw ( {message: `The expense doesn't exist`, status: 404} );
                        }

                        res.status(200).json(sanitizeExpense(expense));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at expenses.service.getById`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting expenses', 
                status: error.status, 
                loc: 'at expenses.service.getById', 
                internalMessage: error.message
            });
        }
    },

    /**
     * post: creates an expense for the user id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post(req, res, next) {
        try{
            const { user_id, type_id, amount, name, description, date } = req.body;

            const expense = {
                user_id: user_id, 
                type_id: type_id, 
                amount: amount, 
                name: name, 
                description: description, 
                date: date
            };

            validate(expense);

            return db
                .insert(expense)
                .into(expensesTable)
                .returning('*')
                .then(expenses => {
                    const expense = expenses[0];
                    res.status(201).json(sanitizeExpense(expense));
                })
                .catch(error => {
                    logger.error(`${error.message} at expenses.service.post`);
                    next( { message: error.message, status: error.status } );
                })
        }
        catch(error) {
            next({
                message: 'error creating expense', 
                status: error.status, 
                loc: 'at expense.service.post', 
                internalMessage: error.message
            });
        }
    },

    /**
     * updateById: updates an expense for the expense id and user id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    updateById(req, res, next) {
        try {
            const { id } = req.params;
            const { user_id, type_id, amount, name, description, date } = req.body;

            const expense = {
                user_id: user_id, 
                type_id: type_id, 
                amount: amount, 
                name: name, 
                description: description, 
                date: date
            };
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }
            
            if(!user_id) {
                next({message: 'user_id is mandatory', status: 400});
            }

            validate(expense);

            return db
                .update(expense)
                .from(expensesTable)
                .where({ 
                    id: id, 
                    user_id: user_id
                })
                .returning('*')
                .then( expenses => {
                    const expense = expenses[0];
                    if(!expense) {
                        throw ( {message: `The expense doesn't exist`, status: 404} );
                    }
                    //res.status(204).end()
                    res.status(201).json(sanitizeExpense(expense));
                })
                .catch (error => {
                    logger.error(`${error.message} at expenses.service.updateById`);
                    next( { message: error.message, status: error.status } );
                })           
        }
        catch(error) {
            next({
                message: 'error updating expense', 
                status: error.status, 
                loc: 'at expenses.service.updateById', 
                internalMessage: error.message
            });
        }
    }, 

    /**
     * deleteById: deletes an expense for the expense id and user_id provided and returns a confirmation message
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    deleteById(req, res, next) {
        try {
            const { id } = req.params;
            const { user_id } = req.body;
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            if(!user_id) {
                next({message: 'user_id is mandatory', status: 400});
            }

            return db
                    .del()
                    .from(expensesTable)
                    .where({
                        id: id, 
                        user_id: user_id
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `The expense doesn't exist`, status: 404} );
                        }
                        res.status(200).json(`${result} expense/s deleted`);
                    })
                    .catch(error => {
                        logger.error(`${error.message} at expenses.service.deleteById`);
                        next( { message: error.message, status: error.status } );
                    })
        }
        catch(error) {
            next({
                message: 'error deleting expense', 
                status: error.status, 
                loc: 'at expenses.service.deleteById', 
                internalMessage: error.message
            });
        }
    }

};

module.exports = ExpensesService;