require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const accessHandler = require('./access-handler')
const { NODE_ENV } = require('./config')
const logger = require('./logger')
const errorHandler = require('./error-handler')
const usersRouter = require('./api/users/users.router');
const expensesRouter = require('./api/expenses/expenses.router');
const serviceProvidersRouter = require('./api/serviceproviders/serviceProviders.router');
const addressesRouter = require('./api/addresses/addresses.router');
const typesRouter = require('./api/types/types.router');

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

//SECURITY HANDLE MIDDLEWARE
app.use(accessHandler)



//home endpoint
app.route('/')
    .get((req, res) => {
        res.status(200).json('Welcome to Home Manager API')
    })

//users endpoint
app.use('/api/users', usersRouter);


//expenses endpoint
app.use('/api/expenses', expensesRouter);


//service providers endpoint
app.use('/api/serviceproviders', serviceProvidersRouter);


//addresses endpoint
app.use('/api/addresses', addressesRouter);


//types endpoint
app.use('/api/types', typesRouter);


app.use(errorHandler)


module.exports = app