const app = require('../src/app');
const db = require('../src/knexContext');
const { generateUsersTestData } = require('./users.tests.data');
const { generateTypesTestData } = require('./types.tests.data');
const { generateServiceProvidersTestData } = require('./serviceProviders.tests.data');
const { generateSPTestDataAll } = require('./serviceProviders.test.data.all');
const { generateAddressesTestData } = require('./addresses.tests.data');


const testUsers = generateUsersTestData();
const testTypes = generateTypesTestData();
const testServiceProviders = generateServiceProvidersTestData();
const testAddresses = generateAddressesTestData();

const usersTable = 'users';
const typesTable = 'types';
const serviceProvidersTable = 'serviceproviders';
const addressesTable = 'addresses';


beforeEach('empty all tables', () => db.raw('TRUNCATE users, types, addresses, serviceproviders RESTART IDENTITY CASCADE') );

afterEach('empty all tables', () => db.raw('TRUNCATE users, types, addresses, serviceproviders RESTART IDENTITY CASCADE') );

after('disconnect from the test db', () => {
    db.destroy();
});

const insertTestData = () => { 
    return beforeEach('insert all test data', async () => {
        await db
            .insert(testUsers)
            .into(usersTable)
        await db
            .insert(testTypes)
            .into(typesTable)
        await db
            .insert(testAddresses)
            .into(addressesTable)
        return db
            .insert(testServiceProviders)
            .into(serviceProvidersTable)
    });
};


describe('GET /api/serviceproviders/:id => ', () => {
    
    insertTestData();

    it('POST /api/serviceproviders/:id => getByIdJoin() => responds with specified service provider', () => {
        const serviceProvider = { 
            id: 1, user_id: 1, type_id: 4, 
            name: 'Nunc Incorporated', description: 'mauris id sapien. Cras dolor dolor, tempus non, lacinia at.', 
            telephone: '669624543', email: 'consectetuer@sitamet.org', 
            address: {
                id: 1, street: 'Ap #479-8906 Magnis Street', 
                city: 'San Miguel', state: 'VA', zipcode: 'V2A 4H0'
            }
        };

        return supertest(app)
                .post(`/api/serviceproviders/${serviceProvider.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const sp = res.body;
                    //console.log('serviceProvider: ', sp);
                    expect(serviceProvider.id).to.eql(sp.id);
                    expect(serviceProvider.user_id).to.eql(sp.user_id);
                    expect(serviceProvider.type_id).to.eql(sp.type_id);
                    expect(serviceProvider.name).to.eql(sp.name);
                    expect(serviceProvider.description).to.eql(sp.description);
                    expect(serviceProvider.telephone).to.eql(sp.telephone);
                    expect(serviceProvider.email).to.eql(sp.email);
                    expect(serviceProvider.street).to.eql(sp.street);
                    expect(serviceProvider.city).to.eql(sp.city);
                    expect(serviceProvider.state).to.eql(sp.state);
                    expect(serviceProvider.zipcode).to.eql(sp.zipcode);
                });
    });

    it('POST /api/serviceproviders/:id => getByIdJoin() => responds with 404 "The service provider doesn\'t exist" when id is incorrect', () => {
        const id = 888;
        return supertest(app)
                .post(`/api/serviceproviders/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error;
                    expect(error.status).to.eql(404);
                    expect(error.message).to.eql('The service provider doesn\'t exist');
                });
    });
});

describe('GET /api/serviceproviders/all/:id', () => {
        
    insertTestData();

    it('POST /api/expenses/:id => getAllByUserIdJoin(): returns all service providers for a specified user id', () => {
        const user_id = 1;
        const allServiceProviders = generateSPTestDataAll();

        return supertest(app)
                .post(`/api/serviceproviders/all/${user_id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect(res => {
                    const serviceProvidersList = res.body;
                    //console.log('serviceProvidersList: ', serviceProvidersList[0]);
                    expect(allServiceProviders).to.eql(serviceProvidersList);
                })
    })
})

describe('POST /api/serviceproviders', () => {
    
    beforeEach('insert all test data', async () => {
        await db
            .insert(testUsers)
            .into(usersTable)
        await db
            .insert(testTypes)
            .into(typesTable)
        // return db
        //     .insert(testAddresses)
        //     .into(addressesTable)
    });

    it('POST /api/serviceproviders => creates a service provider, responding with 201 and the new service provider', () => {
        const serviceProvider = { 
            user_id: 1, type_id: 3, 
            name: 'Maecenas Mi Company', description: 'Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo,', 
            telephone: '(731) 941-8164', email: 'Suspendisse@pharetranibhAliquam.co.uk', 
            address: {
                street: '3091 Sem Ave', 
                city: 'Taupo', 
                state: 'MD', 
                zipcode: '70607'
            }
        };
        
        return supertest(app)
                .post('/api/serviceproviders')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(serviceProvider)
                .expect(201)
                .expect( res => {
                    const sp = res.body;
                    //console.log('ServiceProvider: ', sp);
                    expect(serviceProvider.user_id).to.eql(sp.user_id);
                    expect(serviceProvider.type_id).to.eql(sp.type_id);
                    expect(serviceProvider.name).to.eql(sp.name);
                    expect(serviceProvider.description).to.eql(sp.description);
                    expect(serviceProvider.telephone).to.eql(sp.telephone);
                    expect(serviceProvider.email).to.eql(sp.email);
                    expect(serviceProvider.address.street).to.eql(sp.address.street);
                    expect(serviceProvider.address.city).to.eql(sp.address.city);
                    expect(serviceProvider.address.state).to.eql(sp.address.state);
                    expect(serviceProvider.address.zipcode).to.eql(sp.address.zipcode);
                });
    });
});

describe('PUT /api/serviceproviders/:id', () => {
    
    insertTestData();

    it('PUT /api/serviceproviders/:id => updateByIdAsync() => updates a service provider, responding with 201 and the updated service provider', () => {
        const serviceProvider = { 
            id: 3,
            user_id: 1, 
            type_id: 3, 
            name: 'Micenas Corp', 
            description: 'Micenas Corp is a corporation that doesn\'t really exist', 
            telephone: '(111) 000-9999', 
            email: 'sales@micenas.co.uk', 
            address: {
                street: '321 Main Ave', 
                city: 'Micenas', 
                state: 'WI', 
                zipcode: '76667'
            }
        };

        return supertest(app)
                .put(`/api/serviceproviders/${serviceProvider.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(serviceProvider)
                .expect(201)
                .expect( res => {
                    const sp = res.body;
                    //console.log('ServiceProvider: ', sp);
                    expect(serviceProvider.id).to.eql(sp.id);
                    expect(serviceProvider.user_id).to.eql(sp.user_id);
                    expect(serviceProvider.type_id).to.eql(sp.type_id);
                    expect(serviceProvider.name).to.eql(sp.name);
                    expect(serviceProvider.description).to.eql(sp.description);
                    expect(serviceProvider.telephone).to.eql(sp.telephone);
                    expect(serviceProvider.email).to.eql(sp.email);
                    expect(serviceProvider.address.street).to.eql(sp.address.street);
                    expect(serviceProvider.address.city).to.eql(sp.address.city);
                    expect(serviceProvider.address.state).to.eql(sp.address.state);
                    expect(serviceProvider.address.zipcode).to.eql(sp.address.zipcode);
                })
    })
})

describe('DELETE /api/serviceproviders/:id', () => {
        
    insertTestData();

    it('DELETE /api/serviceproviders/:id => deleteByIdAsync() => deletes a servicep rovider, responding with 200 and "The service provider was deleted"', () => {
        serviceProvider = {
            id: 3, 
            user_id: 1
        };

        return supertest(app)
                .delete(`/api/serviceproviders/${serviceProvider.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(serviceProvider)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('The service provider was deleted');
                });
    });
});