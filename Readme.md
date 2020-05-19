# Home Manager API

Nodejs Express server with CRUD functionality.


## Description:

Home Manager API is a Nodejs API that allows CRUD operations, to a PostgreSQL database, to store and manage home expenses and service providers.


## Technologies used:

Backend data repository: PostgreSQL database.

Packages used: express, morgan, cors, dotenv, helmet, winston, xss, pg, postgreSQL, knex, bcrypt.


## Live Site

[Home manager API](https://homemanagerrh.herokuapp.com/)

## API Documentation:

### API key:

All API requests must be made using an API Key. For testing purposes the following API key can be used:

Test API key: `6u4z8451-7ch3-1547-8e15-bf1419bf2315`

If you clone this Git repository you'll want to store the API key in the .env file (more information on that below).


***

### Endpoints:

The API has the following endpoints: 

* _users_: CRUD users for the app

* _expenses_: CRUD expenses for a user

* _service-providers_: CRUD service providers for a user

* _addresses_: CRUD adresses for a service provider

* _types_: CRUD expense and service providers types


***

### users endpoint: 

#### post => /api/users/auth

* Description: returns a user object for a provided username and password

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| username      | String   | body         |
| password      | String   | body         |


* Response:

A user object.

| param name    | type     |
| ------------- |:--------:|
| id            | Number   |
| username      | String   |
| password      | String   |


#### post => /api/users

* Description: creates a user object

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| username      | String   | body         |
| password      | String   | body         |


* Response:

The user object created.

| param name    | type     |
| ------------- |:--------:|
| id            | Number   |
| username      | String   |
| password      | String   |


#### put => /api/users

* Description: updates a user's password

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| username      | String   | body         |
| password      | String   | body         |
| newPassword   | String   | body         |

* Response:

The user object updated.

| param name    | type     |
| ------------- |:--------:|
| id            | numeric  |
| username      | String   |
| password      | String   |


#### delete => /api/users

* Description: deletes a user

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| username      | String   | body         |
| password      | String   | body         |


* Response: a string confirming the user is deleted.

***

### expenses endpoint: 

#### post => /api/expenses/:user_id

* Description: returns an array of expense objects for a provided user id

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| user_id       | Number   | querystring  |

* Response:

An array of expense objects.

| param name  | type     |
| ------------|:--------:|
| id          | Number   |
| type_id     | Number   |
| amount      | Number   |
| name        | String   |
| description | String   |
| date        | Date     |
| user_id     | Number   |


#### get => /api/expenses/:id

* Description: returns an expense object for a provided expense id

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| id            | Number   | querystring  |

* Response:

An expense object.

| param name  | type     |
| ------------|:--------:|
| id          | Number   |
| type_id     | Number   |
| amount      | Number   |
| name        | String   |
| description | String   |
| date        | Date     |
| user_id     | Number   |


#### post => /api/expenses/

* Description: creates an expense

* Request params:

| param name  | type     | param type   |
| ------------|:--------:| ------------:|
| type_id     | Number   | body         |
| amount      | Number   | body         |
| name        | String   | body         |
| description | String   | body         |
| date        | Date     | body         |
| user_id     | Number   | body         |

* Response:

The expense object created.

| param name  | type     |
| ------------|:--------:|
| id          | Number   |
| type_id     | Number   |
| amount      | Number   |
| name        | String   |
| description | String   |
| date        | Date     |
| user_id     | Number   |


#### put => /api/expenses/:id

* Description: updates an expense

* Request params: 

| param name  | type     | param type   |
| ------------|:--------:| ------------:|
| id          | Number   | querystring  |
| type_id     | Number   | body         |
| amount      | Number   | body         |
| name        | String   | body         |
| description | String   | body         |
| date        | Date     | body         |
| user_id     | Number   | body         |

* Response:

The expense object updated.

| param name  | type     |
| ------------|:--------:|
| id          | Number   |
| type_id     | Number   |
| amount      | Number   |
| name        | String   |
| description | String   |
| date        | Date     |
| user_id     | Number   |


#### delete => /api/expenses/:id

* Description: deletes an expense

* Request params:

| param name  | type     | param type   |
| ------------|:--------:| ------------:|
| id          | Number   | querystring  |
| user_id     | Number   | body         |


* Response:

A string confirming that the expense was deleted.

***

### service providers endpoint: 

#### post => /api/serviceproviders/all

* Description: returns an array of serviceprovider objects (and its addresses) for a provided user id

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| user_id       | Number   | querystring  |

* Response:

An array of expense objects.

| param name      | type    |
| ----------------|:-------:|
| id              | Number  |
| user_id         | Number  |
| type_id         | Number  |
| name            | String  |
| description     | String  |
| telephone       | String  |
| Email           | String  |
| address.street  | String  |
| address.city    | String  |
| address.state   | String  |
| address.zipcode | String  |


#### post => /api/serviceproviders/:id

* Description: returns a serviceprovider object (and its address) for a provided serviceprovider id

* Request params:

| param name    | type     | param type   |
| ------------- |:--------:| ------------:|
| id            | Number   | querystring  |

* Response:

An expense object.

| param name      | type    |
| ----------------|:-------:|
| id              | Number  |
| user_id         | Number  |
| type_id         | Number  |
| name            | String  |
| description     | String  |
| telephone       | String  |
| Email           | String  |
| address.street  | String  |
| address.city    | String  |
| address.state   | String  |
| address.zipcode | String  |


#### post => /api/serviceproviders/

* Description: creates a serviceprovider (and its address)

* Request params:

| param name      | type    | param type   |
| --------------- |:-------:| ------------:|
| user_id         | Number  | body         |
| type_id         | Number  | body         |
| name            | String  | body         |
| description     | String  | body         |
| telephone       | String  | body         |
| Email           | String  | body         |
| address.street  | String  | body         |
| address.city    | String  | body         |
| address.state   | String  | body         |
| address.zipcode | String  | body         |

* Response:

The expense object created.

| param name      | type    |
| ----------------|:-------:|
| id              | Number  |
| user_id         | Number  |
| type_id         | Number  |
| name            | String  |
| description     | String  |
| telephone       | String  |
| Email           | String  |
| address.street  | String  |
| address.city    | String  |
| address.state   | String  |
| address.zipcode | String  |


### put => /api/serviceproviders/:id

* Description: updates a serviceprovider (and its address)

* Request params:

| param name      | type    | param type   |
| --------------- |:-------:| ------------:|
| id              | Number  | querystring  |
| user_id         | Number  | body         |
| type_id         | Number  | body         |
| name            | String  | body         |
| description     | String  | body         |
| telephone       | String  | body         |
| Email           | String  | body         |
| address.street  | String  | body         |
| address.city    | String  | body         |
| address.state   | String  | body         |
| address.zipcode | String  | body         |

* Response:

* The expense object updated.

| param name      | type    |
| ----------------|:-------:|
| id              | Number  |
| user_id         | Number  |
| type_id         | Number  |
| name            | String  |
| description     | String  |
| telephone       | String  |
| Email           | String  |
| address.street  | String  |
| address.city    | String  |
| address.state   | String  |
| address.zipcode | String  |


#### delete => /api/serviceproviders/:id

* Description: deletes a serviceprovider (and its address)

* Request params:

| param name      | type    | param type   |
| --------------- |:-------:| ------------:|
| id              | Number  | querystring  |
| user_id         | Number  | body         |

* Response:

A string confirming that the service provided was deleted.

***

### addresses endpoint: 

#### post => api/addresses/

* Description: creates an address

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| street      | String  | body         |
| city        | String  | body         |
| state       | String  | body         |
| zipcode     | String  | body         |

* Response:

The address object created.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| street      | String  |
| city        | String  |
| state       | String  |
| zipcode     | String  |

#### post => /api/addresses/:id

* Description: returns an address object for a provided address id

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Number  | Querystring  |

* Response:

An address object.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| street      | String  |
| city        | String  |
| state       | String  |
| zipcode     | String  |


#### put => /api/addresses/:id

* Description: updates an address

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Number  | querystring  |
| street      | String  | body         |
| city        | String  | body         |
| state       | String  | body         |
| zipcode     | String  | body         |

* Response:

The address object updated.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| street      | String  |
| city        | String  |
| state       | String  |
| zipcode     | String  |


#### delete => /api/addresses/:id

* Description: deletes an address

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Number  | querystring  |

* Response:

A string confirming that the address has been deleted.

***

### types endpoint:

#### post => api/types/all

* Description: returns an array of types

* Request params:

None

* Response:

An array of type objects.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| name        | String  |
| description | String  |


#### get => /api/types/:id

* Description: return a type object for a provided type id

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Numeric | Querystring  |

* Response:

A type object.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| name        | String  |
| description | String  |


#### post => /api/types/

* Description: creates a type

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| name        | String  | body         |
| description | String  | body         |


* Response:

The type object created.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| name        | String  |
| description | String  |


#### put => /api/types/:id

* Description: updates a type

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Number  | querystring  |
| name        | String  | body         |
| description | String  | body         |


* Response:

The type object updated.

| param name  | type    |
| ------------|:-------:|
| id          | Number  |
| name        | String  |
| description | String  |


#### delete => /api/types/:id

* Description: deletes a type

* Request params:

| param name  | type    | param type   |
| ----------- |:-------:| ------------:|
| id          | Number | querystring  |

* Response:

A string confirming that the type object has been deleted.


## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/rodrigohervas/home-manager-api.git NEW-PROJECT-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -r -Force .git`, amd then `git init`
4. Make sure that the .gitignore file is encoded as 'UTF-8'
5. Install the node dependencies `npm install`
6. Add an `.env` file with the following content:
    1. NODE_ENV='development'
    2. PORT=4000
    3. API_KEY=[YOUT_API_KEY_HERE]
    4. DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
    5. TEST_DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
    6. SALT_ROUNDS=10
7. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "home-manager-api"`

Note. This server can be used with the following client repo: https://github.com/rodrigohervas/home-manager-client
(`git clone https://github.com/rodrigohervas/home-manager-client NEW-PROJECT-NAME`)


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`


## Related Repos

[Home Manager client](https://homemanager-app.now.sh/)

[Home Manager client GitHub Repo](https://github.com/rodrigohervas/home-manager-client)

