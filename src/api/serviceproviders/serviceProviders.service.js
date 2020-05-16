const db = require("../../knexContext");
const xss = require('xss');
const logger = require('../../logger');
const AddressService = require('./../addresses/addresses.service');


//serviceProviders table
const serviceProvidersTable = 'serviceproviders';
const addressesTable = 'addresses';

/**
 * XSS validator
 * @param {object} serviceProvider 
 */
const sanitizeServiceProvider = (serviceProvider) => (
    {
        id: serviceProvider.id, 
        user_id: serviceProvider.user_id, 
        type_id: serviceProvider.type_id, 
        address_id: serviceProvider.address_id, 
        name: xss(serviceProvider.name), 
        description: xss(serviceProvider.description), 
        telephone: xss(serviceProvider.telephone), 
        email: xss(serviceProvider.email), 
    }
);

const sanitizeServiceProviderAndAddress = (serviceProvider) => (
    {
        id: serviceProvider.id, 
        user_id: serviceProvider.user_id, 
        type_id: serviceProvider.type_id, 
        
        name: xss(serviceProvider.name), 
        description: xss(serviceProvider.description), 
        telephone: xss(serviceProvider.telephone), 
        email: xss(serviceProvider.email),
        address: { 
            street: xss(serviceProvider.address.street), 
            city: xss(serviceProvider.address.city), 
            state: xss(serviceProvider.address.state), 
            zipcode: xss(serviceProvider.address.zipcode), 
        }
    }
);

/**
 * Validator function to validate the object serviceProvider has valid data
 * @param {object} serviceProvider 
 */
const validate = (serviceProvider) => {
    for (const [key, value] of Object.entries(serviceProvider)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} );
        }
    }
}

/**
 * Service Providers Service
 */
const ServiceProvidersService = {

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
                loc: 'at serviceProviders.service.All', 
                internalMessage: error.message
            });
        }
    },

    /**
     * getAllByUserId: returns a list of service providers for the user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getAllByUserIdJoin(req, res, next) {
        try {
            const { user_id } = req.params;

            return db
                    .select('*', 'serviceproviders.id')
                    .from('serviceproviders')
                    .innerJoin('addresses', 'serviceproviders.address_id', 'addresses.id')
                    .where({ 'serviceproviders.user_id': user_id})
                    .then( serviceProviders => {
                        if(!serviceProviders) {
                            throw ( {message: `There are no service providers for the user`, status: 404} );
                        }
                        
                        const response = serviceProviders.map(sp => {
                            return {
                                id: sp.id, 
                                user_id: sp.user_id,
                                type_id: sp.type_id, 
                                name: sp.name,
                                description: sp.description,
                                telephone: sp.telephone, 
                                email: sp.email, 
                                address: {
                                    street: sp.street,
                                    city: sp.city,
                                    state: sp.state, 
                                    zipcode: sp.zipcode
                                }
                            };
                        });

                        res.status(200).json(response.map( sp => sanitizeServiceProviderAndAddress(sp)));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at serviceProviders.service.getAllByUserIdJoin`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting service providers', 
                status: error.status, 
                loc: 'at serviceProviders.service.getAllByUserIdJoin', 
                internalMessage: error.message
            });
        }
    },

    /**
     * getById: gets a service provider for the serviceProviders id provided
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getById(req, res, next) {
        try {
            const { id } = req.params;

            db.select('*')
                .from(serviceProvidersTable)
                .where({ id: id })
                .then( serviceProviders => {
                    const serviceProvider = serviceProviders[0];
                    if(!serviceProvider) {
                        throw ( {message: `The service provider doesn't exist`, status: 404} );
                    }

                    return sanitizeServiceProvider(serviceProvider);
                })
                .then(result => {
                    const sp = result;
                    //get address for serviceProvider
                    return db
                            .select('*')
                            .from(addressesTable)
                            .where({ id: id })
                            .then( addresses => {
                                const adr = addresses[0];
                                if(!adr) {
                                    throw ( {message: `The address doesn't exist`, status: 404} );
                                }
                                
                                //create response object:
                                const serviceProvider = {
                                    id: sp.id, 
                                    user_id: sp.user_id,
                                    type_id: sp.type_id, 
                                    name: sp.name,
                                    description: sp.description,
                                    telephone: sp.telephone, 
                                    email: sp.email, 
                                    address: {
                                        street: adr.street,
                                        city: adr.city,
                                        state: adr.state, 
                                        zipcode: adr.zipcode
                                    }
                                };

                                //send the response
                                res.status('200').json(sanitizeServiceProviderAndAddress(serviceProvider));
                            })
                            .catch( error => {
                                logger.error(`${error.message} at serviceProviders.service.getById`);
                                next({ message: error.message, status: error.status});
                            })
                    })
                    .catch( error => {
                        logger.error(`${error.message} at serviceProviders.service.getById`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting service providers', 
                status: error.status, 
                loc: 'at serviceProviders.service.getById', 
                internalMessage: error.message
            });
        }
    },


    getByIdJoin(req, res, next) {
        try {
            const { id } = req.params;

            return db
                    .select('*', 'serviceproviders.id')
                    .from('serviceproviders')
                    .innerJoin('addresses', 'serviceproviders.address_id', 'addresses.id')
                    .where({ 'serviceproviders.id': id })
                    .then( serviceProviders => {
                        const sp = serviceProviders[0];
                        if(!sp) {
                            throw ( {message: `The service provider doesn't exist`, status: 404} );
                        }

                        //create response object:
                        const serviceProvider = {
                            id: sp.id, 
                            user_id: sp.user_id,
                            type_id: sp.type_id, 
                            name: sp.name,
                            description: sp.description,
                            telephone: sp.telephone, 
                            email: sp.email, 
                            address: {
                                street: sp.street,
                                city: sp.city,
                                state: sp.state, 
                                zipcode: sp.zipcode
                            }
                        };

                        res.status(200).json(sanitizeServiceProviderAndAddress(serviceProvider));
                    })
                    .catch( error => {
                        logger.error(`${error.message} at serviceProviders.service.getByIdJoin`);
                        next({ message: error.message, status: error.status});
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting service providers', 
                status: error.status, 
                loc: 'at serviceProviders.service.getByIdJoin', 
                internalMessage: error.message
            });
        }
    },



    /**
     * post: creates a service provider for the user id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    async postAsync(req, res, next) {
        try{
            const { user_id, type_id, name, description, telephone, email, address } = req.body;

            const addressData = {
                street: address.street, 
                city: address.city, 
                state: address.state, 
                zipcode: address.zipcode
            };

            const sProvider = {
                user_id: user_id, 
                type_id: type_id, 
                name: name, 
                description: description, 
                telephone: telephone, 
                email: email
            };

            validate(sProvider);

            //INSERT ADDRESS FIRST
            const addressResultList = await db.insert(addressData)
                                            .into(addressesTable)
                                            .returning('*')
                                            .catch(error => {
                                                logger.error(`${error.message} at serviceProviders.service.postAsync.creatingAddress`);
                                                next( { message: error.message, status: error.status } );
                                            });

            //get the first and only address in the list
            const addressResult = addressResultList[0];

            if(!addressResult) {
                throw ( {message: `Address couldn't be created`, status: 404} );
            }

            //add address_id into sProvider object
            sProvider.address_id = addressResult.id;            

            //INSERT SERVICEPROVIDER
            const serviceProviderList = await db.insert(sProvider)
                                                    .into(serviceProvidersTable)
                                                    .returning('*')
                                                    .catch(error => {
                                                        logger.error(`${error.message} at serviceProviders.service.postAsync.creatingServiceProvider`);
                                                        next( { message: error.message, status: error.status } );
                                                    });
            //get the first and only serviceProvider in the list
            const serviceProvider = serviceProviderList[0];
            
            if(!serviceProvider) {
                throw ( {message: `Service Provider couldn't be created`, status: 404} );
            }

            //add address into serviceprovider object
            serviceProvider.address = {
                street: addressResult.street,
                city: addressResult.city,
                state: addressResult.state, 
                zipcode: addressResult.zipcode
            };

            //send response
            res.status(201).json(sanitizeServiceProviderAndAddress(serviceProvider));
        }
        catch(error) {
            next({
                message: 'error creating service providers', 
                status: error.status, 
                loc: 'at serviceProviders.service.postAsync', 
                internalMessage: error.message
            });
        }
    },


    /**
     * updateByIdAsync: updates a service provider for the serviceProvider id and user id provided and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    async updateByIdAsync(req, res, next) {
        try {
            const { id } = req.params;
            const { user_id, type_id, name, description, telephone, email, address } = req.body;

            const addressData = {
                street: address.street, 
                city: address.city, 
                state: address.state, 
                zipcode: address.zipcode
            };

            const sProvider = {
                id: id, 
                user_id: user_id, 
                type_id: type_id, 
                name: name, 
                description: description, 
                telephone: telephone, 
                email: email
            };

            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            if(!user_id) {
                next({message: 'user_id is mandatory', status: 400});
            }
            
            validate(sProvider);

            //UPDATE SERVICEPROVIDER
            const serviceProviderList = await db.update(sProvider)
                                                .from(serviceProvidersTable)
                                                .where({ id: sProvider.id, user_id: sProvider.user_id })
                                                .returning('*')
                                                .catch(error => {
                                                    logger.error(`${error.message} at serviceProviders.service.updateByIdAsync.updatingServiceProvider`);
                                                    next( { message: error.message, status: error.status } );
                                                });
            //get the first and only serviceProvider in the list
            const serviceProvider = serviceProviderList[0];
            
            if(!serviceProvider) {
                throw ( {message: `Service Provider couldn't be updated`, status: 404} );
            }

            //UPDATE ADDRESS
            const addressResultList = await db.update(addressData)
                                                .from(addressesTable)
                                                .where({ id: serviceProvider.address_id })
                                                .returning('*')
                                                .catch(error => {
                                                    logger.error(`${error.message} at serviceProviders.service.updateByIdAsync.updatingAddress`);
                                                    next( { message: error.message, status: error.status } );
                                                });

            //get the first and only address in the list
            const addressResult = addressResultList[0];

            if(!addressResult) {
                throw ( {message: `Address couldn't be updated`, status: 404} );
            }

            //add address into serviceprovider object
            serviceProvider.address = {
                street: addressResult.street,
                city: addressResult.city,
                state: addressResult.state, 
                zipcode: addressResult.zipcode
            };

            //send response
            res.status(201).json(sanitizeServiceProviderAndAddress(serviceProvider));       
        }
        catch(error) {
            next({
                message: 'error updating service provider', 
                status: error.status, 
                loc: 'at serviceProviders.service.updateByIdAsync', 
                internalMessage: error.message
            });
        }
    }, 

    /**
     * deleteById: deletes a service provider for the serviceProvider id and user_id provided and returns a confirmation message
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    async deleteByIdAsync(req, res, next) {
        try {
            const { id } = req.params;
            const { user_id } = req.body;
            
            if(!id) {
                next({message: 'id is mandatory', status: 400});
            }

            if(!user_id) {
                next({message: 'user_id is mandatory', status: 400});
            }

            //get service provider address_id
            const addressIdResult = await db.select('address_id')
                                        .from(serviceProvidersTable)
                                        .where({ id: id })
                                        .catch(error => {
                                            logger.error(`${error.message} at serviceProviders.service.deleteByIdAsync.gettingAddress`);
                                            next( { message: error.message, status: error.status } );
                                        });
            
            const address_id = addressIdResult[0].address_id;

            if(!address_id) {
                throw ( {message: `The address for the service provider doesn't exist`, status: 404} );
            }

            //delete address by address_id
            const addressResult = await db.del()
                                          .from(addressesTable)
                                          .where({ id: address_id })
                                          .catch(error => {
                                              logger.error(`${error.message} at serviceProviders.service.deleteByIdAsync.deletingAddress`);
                                              next( { message: error.message, status: error.status } );
                                          });
            if(!addressResult) {
                throw ( {message: `The address for the service provider couldn't be deleted`, status: 404} );
            }

            //delete service provider by id
            const serviceProviderResult = await db.del()
                                                  .from(serviceProvidersTable)
                                                  .where({ id: id })
                                                  .andWhere({ user_id: user_id })
                                                  .catch(error => {
                                                      logger.error(`${error.message} at serviceProviders.service.deleteByIdAsync.deletingServiceProvider`);
                                                      next( { message: error.message, status: error.status } );
                                                  });
            
            res.status(200).json(`The service provider was deleted`);
        }
        catch(error) {
            next({
                message: 'error deleting service provider', 
                status: error.status, 
                loc: 'at serviceProviders.service.deleteByIdAsync', 
                internalMessage: error.message
            });
        }
    }

};

module.exports = ServiceProvidersService;