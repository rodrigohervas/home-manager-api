const express = require('express');
const ServiceProvidersService = require('./serviceProviders.service');

/**
 * Service Providers Routing middleware
 */

const serviceProvidersRouter = express.Router();

//regular route
serviceProvidersRouter
        .route('/')
        .post(ServiceProvidersService.postAsync) //creates a service provider


//route for serviceproviders/:id
serviceProvidersRouter
        .route('/:id')
        .all(ServiceProvidersService.All)
        .post(ServiceProvidersService.getByIdJoin) //gets a service provider for the serviceProviders id provided
        .put(ServiceProvidersService.updateByIdAsync) //update a service provider
        .delete(ServiceProvidersService.deleteByIdAsync) //delete a service provider


//route for serviceproviders/all/:user_id
serviceProvidersRouter
        .route('/all/:user_id')
        .all(ServiceProvidersService.All)
        .post(ServiceProvidersService.getAllByUserIdJoin) //gets All service providers for a user_id


module.exports = serviceProvidersRouter;