const app = require('../src/app')
const db = require('../src/knexContext')
const bcrypt = require('bcrypt')
const { generateUsersTestData } = require('./users.tests.data')

const testUsers = generateUsersTestData()
const usersTable = 'users'

const validatePassword = (password, hashedPassword) => { 
    return bcrypt.compareSync(password, hashedPassword)
}

beforeEach('empty the tables', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE') )

afterEach( 'empty the tables', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE') )

after('disconnect from the test db', () => {
    db.destroy()
})

describe.skip('POST /api/users/auth', () => {
        
    beforeEach('insert test data for POST Login tests', () => {
        return db
                .insert(testUsers)
                .into(usersTable)
    })

    it('POST /api/users/auth responds with specified user', () => {
        const user = {
            id: 3, 
            username: 'paul@jones.com', 
            password: 'paul'
        }
        return supertest(app)
                .post('/api/users/auth')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send({
                    username: user.username, 
                    password: user.password
                })
                .expect(200)
                .expect( res => {
                    const usr = res.body
                    expect(usr.id).to.eql(user.id)
                    expect(usr.username).to.eql(user.username)
                   expect(true).to.eql(validatePassword(user.password, usr.password))
                })
    })
})

describe.skip('POST /api/users', () => {
    
    it('POST /api/users/ creates a user, responding with 201 and the new user', () => {
        const user = {
            id: 1, 
            username: 'james@jones.com', 
            password: 'james'
        }
        return supertest(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(user)
                .expect(201)
                .expect( res => {
                    const usr = res.body
                    //console.log('USER: ', usr)
                    expect(usr.id).to.eql(user.id)
                    expect(usr.username).to.eql(user.username)
                    expect(true).to.eql(validatePassword(user.password, usr.password))
                })
    })
})

describe.skip('PUT /api/users', () => {
    
    beforeEach('insert test users', () => {
        return db
                .insert(testUsers)
                .into(usersTable)
    })

    it('PUT /api/users updates a user\'s password, responding with 201 and the updated user', () => {
        const user = {
            id: 1, 
            username: 'michael@jones.com', 
            password: 'michael',
            newPassword: 'michael1'
        }
        return supertest(app)
                .put('/api/users')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(user)
                .expect(201)
                .expect( res => {
                    const usr = res.body
                    expect(usr.id).to.eql(user.id)
                    expect(usr.username).to.eql(user.username)
                    expect(true).to.eql(validatePassword(user.newPassword, usr.password))
                })
    })
})

describe.skip('PATCH /api/users', () => {
        
    beforeEach('insert test users', () => {
        return db
                .insert(testUsers)
                .into(usersTable)
    })

    it('PATCH /api/users updates a user\'s password, responding with 201 and the updated user', () => {
        const user = {
            id: 1, 
            username: 'michael@jones.com', 
            password: 'michael', 
            newPassword: 'michael1'
        }
        return supertest(app)
                .patch('/api/users')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(user)
                .expect(201)
                .expect( res => {
                    const usr = res.body
                    expect(usr.id).to.eql(user.id)
                    expect(usr.username).to.eql(user.username)                    
                    expect(true).to.eql(validatePassword(user.newPassword, usr.password))
                })
    })
})

describe.skip('DELETE /api/users', () => {
        
    beforeEach('insert test users', () => {
        return db
                .insert(testUsers)
                .into(usersTable)
    })

    it('DELETE /api/users deletes a user, responding with 200 and "1 user/s deleted"', () => {
        const user = {
            username: 'michael@jones.com', 
            password: 'michael'
        }
        return supertest(app)
                .delete('/api/users')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(user)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 user/s deleted')
                })
    })
})