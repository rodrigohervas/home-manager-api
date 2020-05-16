const express = require('express')
const UsersService = require('./users.service')

/**
 * Users Routing middleware
 */

const usersRouter = express.Router()

//route for /users
usersRouter
    .route('/')
    .post(UsersService.post) //post new user
    .put(UsersService.updatePasswordByUsername) //update password by username
    .patch(UsersService.updatePasswordByUsername) //update password for a username
    .delete(UsersService.deleteByUsername) //delete user for a username

//route for users/auth
usersRouter
    .route('/auth')
    .post(UsersService.authenticateUser) //authenticate user (username/password)

//router for users/:id
usersRouter
    .route('/:id')
    .all(UsersService.All)

module.exports = usersRouter