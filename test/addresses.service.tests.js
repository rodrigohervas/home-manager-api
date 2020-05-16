const app = require('../src/app');
const db = require('../src/knexContext');
const { generateAddressesTestData } = require('./addresses.tests.data');

const testAddresses = generateAddressesTestData();
const addressesTable = 'addresses';


beforeEach('empty all tables', () => db.raw('TRUNCATE addresses RESTART IDENTITY CASCADE') );

afterEach('empty all tables', () => db.raw('TRUNCATE addresses RESTART IDENTITY CASCADE') );

after('disconnect from the test db', () => {
    db.destroy();
});

const insertTestData = () => { 
    return beforeEach('insert all test data', async () => {
        return db
            .insert(testAddresses)
            .into(addressesTable)
    });
};

describe('GET /api/addresses/:id', () => {
    
    insertTestData();

    it('POST /api/addresses/:id => getById() => responds with the address for the provided id', () => {
        const address = {
            id: 4, 
            street: 'P.O. Box 741, 2975 Quis St.', 
            city: 'Vienna', 
            state: 'VA', 
            zipcode: '531674'
        };
        
        return supertest(app)
                .post(`/api/addresses/${address.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const adr = res.body;
                    //console.log('Address: ', adr);
                    expect(address.id).to.eql(adr.id);
                    expect(address.street).to.eql(adr.street);
                    expect(address.city).to.eql(adr.city);
                    expect(address.state).to.eql(adr.state);
                    expect(address.zipcode).to.eql(adr.zipcode);
                });
    });

    it('POST /api/addresses/:id => getById() => responds with 404 "The address doesn\'t exist" when id is incorrect', () => {
        const id = 888;
        return supertest(app)
                .post(`/api/addresses/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error;
                    //console.log('ERROR: ', error)
                    expect(error.status).to.eql(404);
                    expect(error.message).to.eql('The address doesn\'t exist');
                });
    });
});

describe('POST /api/addresses', () => {
    
    it('POST /api/addresses => post() => creates an address, responding with 201 and the new address', () => {
        const address = {
            street: 'P.O. Box 741, 2975 Quis St.', 
            city: 'Vienna', 
            state: 'VA', 
            zipcode: '531674'
        };
        
        return supertest(app)
                .post('/api/addresses')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(address)
                .expect(201)
                .expect( res => {
                    const adr = res.body;
                    //console.log('Address: ', adr);
                    expect(address.street).to.eql(adr.street);
                    expect(address.city).to.eql(adr.city);
                    expect(address.state).to.eql(adr.state);
                    expect(address.zipcode).to.eql(adr.zipcode);
                });
    });
});

describe('PUT /api/addresses/:id', () => {
    
    insertTestData();

    it('PUT /api/addresses/:id => updateById() => updates an address, responding with 201 and the updated address', () => {
        const address = {
            id: 4, 
            street: 'P.O. Box 741, 2975 Quis St.', 
            city: 'Vienna', 
            state: 'VA', 
            zipcode: '531674'
        };

        return supertest(app)
                .put(`/api/addresses/${address.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(address)
                .expect(201)
                .expect( res => {
                    const adr = res.body;
                    //console.log('Address: ', adr);
                    expect(address.id).to.eql(adr.id);
                    expect(address.street).to.eql(adr.street);
                    expect(address.city).to.eql(adr.city);
                    expect(address.state).to.eql(adr.state);
                    expect(address.zipcode).to.eql(adr.zipcode);
                })
    })
})

describe('DELETE /api/addresses/:id', () => {
        
    insertTestData();

    it('DELETE /api/addresses/:id => deleteById() =>  deletes an address, responding with 200 and "1 address/es deleted"', () => {
        const address = {
            id: 3, 
            user_id: 1
        };

        return supertest(app)
                .delete(`/api/addresses/${address.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(address)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 address/es deleted');
                });
    });
});