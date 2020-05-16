const db = require("../../knexContext");
const xss = require('xss');
const logger = require('../../logger');


//Addresses table
const addressesTable = 'addresses';

/**
 * XSS validator
 * @param {object} address 
 */
const sanitizeAddress = (address) => (
    {
        id: address.id, 
        street: xss(address.street), 
        city: xss(address.city), 
        state: xss(address.state), 
        zipcode: xss(address.zipcode)
    }
);

/**
 * Validator function to validate the Address object has valid data
 * @param {object} address
 */
const validate = (address) => {
    for (const [key, value] of Object.entries(address)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} );
        }
    }
}

/**
 * Addresses Service
 */
const AddressesService = {

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

            next();
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at addresses.service.All', 
                internalMessage: error.message
            });
        }
    },


    /**
     * getById: gets an address for the address id provided
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getById(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*')
                    .from(addressesTable)
                    .where({ id: id })
                    .then( addresses => {
                        const address = addresses[0];
                        
                        if(!address) {
                            throw ( {message: `The address doesn't exist`, status: 404} );
                        }

                        res.status(200).json(sanitizeAddress(address));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at addresses.service.getById`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting address', 
                status: error.status, 
                loc: 'at addresses.service.getById', 
                internalMessage: error.message
            });
        }
    },

    /**
     * post: creates an address and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post(req, res, next) {
        try{
            const { street, city, state, zipcode } = req.body;

            const address = {
                street: street, 
                city: city, 
                state: state, 
                zipcode, zipcode
            };

            validate(address);

            return db
                .insert(address)
                .into(addressesTable)
                .returning('*')
                .then(addresses => {
                    const address = addresses[0];
                    
                    res.status(201).json(sanitizeAddress(address));
                })
                .catch(error => {
                    logger.error(`${error.message} at addresses.service.post`);
                    next( { message: error.message, status: error.status } );
                })
        }
        catch(error) {
            next({
                message: 'error creating address', 
                status: error.status, 
                loc: 'at addresses.service.post', 
                internalMessage: error.message
            });
        }
    },

    /**
     * updateById: updates an address for the address id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    updateById(req, res, next) {
        try {
            const { id } = req.params;
            const { street, city, state, zipcode } = req.body;

            const address = {
                street: street, 
                city: city, 
                state: state, 
                zipcode, zipcode
            };
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            validate(address);

            return db
                .update(address)
                .from(addressesTable)
                .where({ id: id })
                .returning('*')
                .then( addresses => {
                    const address = addresses[0];
                    if(!addresses) {
                        throw ( {message: `The address doesn't exist`, status: 404} );
                    }
                    //res.status(204).end()
                    res.status(201).json(sanitizeAddress(address));
                })
                .catch (error => {
                    logger.error(`${error.message} at addresses.service.updateById`);
                    next( { message: error.message, status: error.status } );
                })           
        }
        catch(error) {
            next({
                message: 'error updating address', 
                status: error.status, 
                loc: 'at addresses.service.updateById', 
                internalMessage: error.message
            });
        }
    }, 

    /**
     * deleteById: deletes an address for the address id provided and returns a confirmation message
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
                    .from(addressesTable)
                    .where({ id: id})
                    .then(result => {
                        if(!result) {
                            throw ( {message: `The address doesn't exist`, status: 404} );
                        }
                        res.status(200).json(`${result} address/es deleted`);
                    })
                    .catch(error => {
                        logger.error(`${error.message} at addresses.service.deleteById`);
                        next( { message: error.message, status: error.status } );
                    })
        }
        catch(error) {
            next({
                message: 'error deleting address', 
                status: error.status, 
                loc: 'at addresses.service.deleteById', 
                internalMessage: error.message
            });
        }
    }

};

module.exports = AddressesService;