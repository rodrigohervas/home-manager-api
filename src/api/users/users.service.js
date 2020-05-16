const db = require('./../../knexContext')
const xss = require('xss')
const bcrypt = require('bcrypt')
const config = require('./../../config')
const logger = require('./../../logger')

//salt rounds for password hashing
const saltRounds = config.SALT_ROUNDS;

//users table
const usersTable = 'users';

/**
 * XSS validator to sanitize user object has no invalid data
 * @param {object} user ;
 */
const sanitizeUser = (user) => (
    {
        id: user.id, 
        username: xss(user.username), 
        password: xss(user.password)
    }
);

/**
 * Validator function to validate the object user has valid data
 * @param {object} user 
 */
const validate = (user) => {
    for (const [key, value] of Object.entries(user)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} );
        }
    }
};

/**
 * Validator function to validate that username and password are not empty
 * @param {String} username 
 * @param {String} password 
 * @param {Function} next
 */
const validateUsernameAndPassword = (username, password, next) => {
    if(!username) {
        next({message: 'username is mandatory', status: 400});
    }
    
    if(!password) {
        next({message: 'password is mandatory', status: 400});
    }
};


/**
 * UsersService
 */
const UsersService = {

    /**
     * All: validates that requests with 'GET', 'PUT', 'PATCH', 'DELETE' have a valid user id
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
                loc: 'at users.service.All', 
                internalMessage: error.message
            });
        }
    },

    
    /**
     * post: insert a user in the DB asynchronously, and returns it. The password is inserted hashed.
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post(req, res, next) {
        try{
            const { username, password } = req.body;

            validateUsernameAndPassword(username, password, next);

            bcrypt.hash(password, parseInt(saltRounds))
                  .then( hash => {
                      const user = {
                        
                        username: username, 
                        password: hash
                    };

                    validate(user);

                    return db
                        .insert(user)
                        .into(usersTable)
                        .returning('*')
                        .then(users => {
                            const user = users[0];
                            res.status(201).json(sanitizeUser(user));
                        })
                        .catch(error => {
                            next( { message: error.message, status: error.status } );
                        })
                })
                .catch(error => {
                    logger.error(`${error.message} at users.service.post`);
                    next( { message: error.message, status: error.status } );
                })
        }
        catch(error) {
            next({
                message: 'error creating user', 
                status: error.status, 
                loc: 'at users.service.post', 
                internalMessage: error.message
            });
        }
    },


    /**
     * postHashSync: insert a user in the DB synchronously, and returns it. The password is inserted hashed.
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    postHashSync(req, res, next) {
        try{
            const { username, password } = req.body;

            validateUsernameAndPassword(username, password, next);

            const hashedPassword = bcrypt.hashSync(password, parseInt(saltRounds));

            const user = {
                username: username, 
                password: hashedPassword
            };
            
            validate(user);

            return db
                .insert(user)
                .into(usersTable)
                .returning('*')
                .then(users => {
                    const user = users[0];
                    res.status(201).json(sanitizeUser(user));
                })
                .catch(error => {
                    logger.error(`${error.message} at users.service.post`);
                    next( { message: error.message, status: error.status } );
                })
        }
        catch(error) {
            next({
                message: 'error creating user', 
                status: error.status, 
                loc: 'at users.service.post', 
                internalMessage: error.message
            });
        }
    },


    /**
     * authenticateUser: authenticates if the username/password received exist, and returns its corresponding user.
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    authenticateUser(req, res, next) {
        try {
            const { username, password } = req.body;
            
            validateUsernameAndPassword(username, password, next);
            
            return db
                .select('*')
                .from(usersTable)
                .where({
                    username: username
                })
                .first()
                .then( user => {
                    if(!user) {
                        next( {message: `User doesn't exist`, status: 404} );
                    }

                    bcrypt.compare(password, user.password)
                            .then(result => {
                                if(!result) {
                                    next({message: 'password is invalid', status: 404});
                                }
                                res.status(200).json(sanitizeUser(user));
                            })
                            .catch (error => {
                                next({message: error.message, status: error.status});
                            })
                })
                .catch( error => {
                    logger.error(`${error.message} at users.service.authenticateUser`)
                    next({ message: error.message, status: error.status})
                })
        }
        catch(error) {
            next({
                message: 'error getting user', 
                status: error.status, 
                loc: 'at users.service.authenticateUser', 
                internalMessage: error.message
            })
        }
    },


    /**
     * updateByUsername: updates a user by the given username/password, and returns it.
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    updatePasswordByUsername(req, res, next) { 
        try {
            const { username, password, newPassword } = req.body;
            
            validateUsernameAndPassword(username, password, next);

            return db
                    .select('*')
                    .from(usersTable)
                    .where({
                        username: username
                    })
                    .first()
                    .then( user => {
                        if(!user) {
                            next( {message: `User doesn't exist`, status: 404} );
                        }
                        
                        const hashedPassword = user.password;

                        bcrypt.compare(password, hashedPassword)
                            .then(result => {
                                if(!result) {
                                    next({message: 'password is invalid', status: 404});
                                }  
                                
                                bcrypt.hash(newPassword, parseInt(saltRounds))
                                        .then( hash => {
                                            const user = {
                                                username: username, 
                                                password: hashedPassword, 
                                                newPassword: hash
                                            };
                                            
                                            return db
                                                .update({ password: user.newPassword })
                                                .from(usersTable)
                                                .where({
                                                    username: user.username, 
                                                    password: user.password
                                                })
                                                .returning('*')
                                                .then( users => {
                                                    const user = users[0];
                                                    if(!user) {
                                                        throw ( {message: `User doesn't exist`, status: 404} );
                                                    }
                                                    //res.status(204).end()
                                                    res.status(201).json(sanitizeUser(user));
                                                })
                                                .catch(error => {
                                                    next( { message: error.message, status: error.status } );
                                                })

                                        })
                                        .catch (error => {
                                            logger.error(`${error.message} at users.service.putByUsername`);
                                            next( { message: error.message, status: error.status } );
                                        })
                            })
                            .catch (error => {
                                logger.error(`${error.message} at users.service.putByUsername`);
                                next( { message: error.message, status: error.status } );
                            })
                    })
                    .catch( error => {
                        next( { message: error.message, status: error.status } );
                    })            
            }
            catch(error) {
                next({
                    message: 'error updating user', 
                    status: error.status, 
                    loc: 'at users.service.putByUsername', 
                    internalMessage: error.message
                });
            }
    },
    


    /**
     * deleteByUsername: deletes a user by the given username/password, and returns a confirmation message.
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    deleteByUsername(req, res, next){
        try {
            const {username, password} = req.body;
            
            validateUsernameAndPassword(username, password, next);

            return db
                    .del()
                    .from(usersTable)
                    .where({
                        username: username
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `User doesn't exist`, status: 404} );
                        }
                        res.status(200).json(`${result} user/s deleted`);
                    })
                    .catch(error => {
                        logger.error(`${error.message} at users.service.deleteByUsername`);
                        next( { message: error.message, status: error.status } );
                    })
        }
        catch(error) {
            next({
                message: 'error deleting user', 
                status: error.status, 
                loc: 'at users.service.deleteByUsername', 
                internalMessage: error.message
            });
        }
    }
};


module.exports = UsersService