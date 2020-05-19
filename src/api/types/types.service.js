const db = require("../../knexContext");
const xss = require('xss');
const logger = require('../../logger');


//Types table
const typesTable = 'types';

/**
 * XSS validator
 * @param {object} type 
 */
const sanitizeType = (type) => (
    {
        id: type.id, 
        name: xss(type.name), 
        description: xss(type.description)
    }
);

/**
 * Validator function to validate the Type object has valid data
 * @param {object} type
 */
const validate = (type) => {
    for (const [key, value] of Object.entries(type)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} );
        }
    }
}

/**
 * Types Service
 */
const TypesService = {

    /**
     * validates that requests with 'PUT', 'PATCH', 'DELETE' have a valid user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    All(req, res, next){
        try {
            const method = req.method;
            const id = req.params.id;
            const verbs = ['PUT', 'PATCH', 'DELETE'];

            if( verbs.includes(method) && isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } );
            }

            next();
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at types.service.All', 
                internalMessage: error.message
            });
        }
    },


    /**
     * getById: gets a type for the type id provided
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getById(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*')
                    .from(typesTable)
                    .where({ id: id })
                    .then( types => {
                        const type = types[0];
                        
                        if(!type) {
                            throw ( {message: `The type doesn't exist`, status: 404} );
                        }

                        res.status(200).json(sanitizeType(type));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at types.service.getById`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting type', 
                status: error.status, 
                loc: 'at types.service.getById', 
                internalMessage: error.message
            });
        }
    },

    /**
     * getAll: gets all the types
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getAll(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*')
                    .from(typesTable)
                    .then( types => {
                        if(!types) {
                            throw ( {message: `There are no types available`, status: 404} );
                        }

                        res.status(200).json(types.map(type => sanitizeType(type)));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at types.service.getAll`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting types', 
                status: error.status, 
                loc: 'at types.service.getAll', 
                internalMessage: error.message
            });
        }
    },

    /**
     * post: creates a type and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post(req, res, next) {
        try{
            const { name, description } = req.body;

            const type = {
                name: name, 
                description: description
            };

            validate(type);

            return db
                .insert(type)
                .into(typesTable)
                .returning('*')
                .then(types => {
                    const type = types[0];
                    
                    res.status(201).json(sanitizeType(type));
                })
                .catch(error => {
                    logger.error(`${error.message} at types.service.post`);
                    next( { message: error.message, status: error.status } );
                })
        }
        catch(error) {
            next({
                message: 'error creating type', 
                status: error.status, 
                loc: 'at types.service.post', 
                internalMessage: error.message
            });
        }
    },

    /**
     * updateById: updates a type for the type id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    updateById(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const type = {
                id: id, 
                name: name, 
                description: description
            };
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            validate(type);

            return db
                .update(type)
                .from(typesTable)
                .where({ id: id })
                .returning('*')
                .then( types => {
                    const type = types[0];
                    if(!types) {
                        throw ( {message: `The type doesn't exist`, status: 404} );
                    }
                    //res.status(204).end()
                    res.status(201).json(sanitizeType(type));
                })
                .catch (error => {
                    logger.error(`${error.message} at types.service.updateById`);
                    next( { message: error.message, status: error.status } );
                })           
        }
        catch(error) {
            next({
                message: 'error updating type', 
                status: error.status, 
                loc: 'at types.service.updateById', 
                internalMessage: error.message
            });
        }
    }, 

    /**
     * deleteById: deletes a type for the type id provided and returns a confirmation message
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    deleteById(req, res, next) {
        try {
            const { id } = req.params;
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            return db
                    .del()
                    .from(typesTable)
                    .where({ id: id})
                    .then(result => {
                        if(!result) {
                            throw ( {message: `The type doesn't exist`, status: 404} );
                        }
                        res.status(200).json(`${result} type/s deleted`);
                    })
                    .catch(error => {
                        logger.error(`${error.message} at types.service.deleteById`);
                        next( { message: error.message, status: error.status } );
                    })
        }
        catch(error) {
            next({
                message: 'error deleting type', 
                status: error.status, 
                loc: 'at types.service.deleteById', 
                internalMessage: error.message
            });
        }
    }

};

module.exports = TypesService;