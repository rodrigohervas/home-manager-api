const express = require('express');
const AddressesService = require('./addresses.service');

/**
 * Addresses Routing middleware
 */

const addressesRouter = express.Router();

//regular route
addressesRouter
        .route('/')
        .post(AddressesService.post)


//route for addresses/:id
addressesRouter
        .route('/:id')
        .all(AddressesService.All)
        .post(AddressesService.getById)
        .put(AddressesService.updateById)
        .delete(AddressesService.deleteById)

module.exports = addressesRouter;