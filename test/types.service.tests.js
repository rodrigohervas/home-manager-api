const app = require('../src/app');
const db = require('../src/knexContext');
const { generateTypesTestData } = require('./types.tests.data');

const testTypes = generateTypesTestData();
const typesTable = 'types';


beforeEach('empty all tables', () => db.raw('TRUNCATE types RESTART IDENTITY CASCADE') );

afterEach('empty all tables', () => db.raw('TRUNCATE types RESTART IDENTITY CASCADE') );

after('disconnect from the test db', () => {
    db.destroy();
});

const insertTestData = () => { 
    return beforeEach('insert all test data', async () => {
        return db
            .insert(testTypes)
            .into(typesTable)
    });
};

describe('POST /api/types/all', () => {
    
    insertTestData();

    it('POST /api/types/all => getAll() => responds with the a list of the available types', () => {
        const types = generateTypesTestData();
        
        return supertest(app)
                .post('/api/types/all')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const typesList = res.body;
                    //console.log('typesList: ', typesList);
                    expect(types).to.eql(typesList);
                });
    });
});

describe('POST /api/types', () => {
    
    it('POST /api/types => post() => creates a type, responding with 201 and the new type', () => {
        const type = { 
            id:"4", 
            name:"Groceries", 
            description: 'Groceries service providers'
        };
        
        return supertest(app)
                .post('/api/types')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(type)
                .expect(201)
                .expect( res => {
                    const typeCreated = res.body;
                    //console.log('Type: ', type);
                    expect(type.name).to.eql(typeCreated.name);
                    expect(type.description).to.eql(typeCreated.description);
                });
    });
});

describe('GET /api/types/:id', () => {

    insertTestData();
    
    it('GET /api/types => getById() => gets a type for the provided type id, responding with 201 and the new type', () => {
        const type = { 
            id: 4, 
            name: 'Groceries', 
            description: 'Groceries service providers'
        };
        
        return supertest(app)
                .get(`/api/types/${type.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(type)
                .expect(200)
                .expect( res => {
                    const typeDB = res.body;
                    //console.log('Type: ', typeDB);
                    expect(type.id).to.eql(typeDB.id);
                    expect(type.name).to.eql(typeDB.name);
                    expect(type.description).to.eql(typeDB.description);
                });
    });

    it('GET /api/types => getById() => responds with 404 and "The type doesn\'t exist" when id is incorrect', () => {
        const type = { id:"456" };
        
        return supertest(app)
                .get(`/api/types/${type.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(type)
                .expect( res => {
                    const error = res.body.error;
                    //console.log('ERROR: ', error)
                    expect(error.status).to.eql(404);
                    expect(error.message).to.eql('The type doesn\'t exist');
                });
    });
});

describe('PUT /api/types/:id', () => {
    
    insertTestData();

    it('PUT /api/types/:id => updateById() => updates a type, responding with 201 and the updated address', () => {
        const type = {
            id: 8, 
            name: "Test name", 
            description: 'Test description'
        };

        return supertest(app)
                .put(`/api/types/${type.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(type)
                .expect(201)
                .expect( res => {
                    const typeDB = res.body;
                    //console.log('Type: ', typeDB);
                    expect(type.id).to.eql(typeDB.id);
                    expect(type.name).to.eql(typeDB.name);
                    expect(type.description).to.eql(typeDB.description);
                })
    })
})

describe('DELETE /api/types/:id', () => {
        
    insertTestData();

    it('DELETE /api/types/:id => deleteById() =>  deletes a type, responding with 200 and "1 type/s deleted"', () => {
        const type = { id: 3 };

        return supertest(app)
                .delete(`/api/types/${type.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(type)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 type/s deleted');
                });
    });
});