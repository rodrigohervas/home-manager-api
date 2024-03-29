const { NODE_ENV } = require('./config')
const logger = require('./logger')

//Error Handling middleware
function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {
            //error: { message: "server error", status: 500 }
            error: { message: error.message, status: error.status }
        }
        //Log in Server console the Production error
        console.log("Managed Error in error-handler.js: ", error)
    }
    else {
        logger.error(error)
        response = {
            error: { message: error.message, status: error.status ? error.status: 500 }
        }
    }

    res.status(response.error.status).json(response);
}

module.exports = errorHandler