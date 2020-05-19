const app = require('../src/app');
const db = require('../src/knexContext');
const { generateUsersTestData } = require('./users.tests.data');
const { generateTypesTestData } = require('./types.tests.data');
const { generateExpensesTestData } = require('./expenses.tests.data');

const testUsers = generateUsersTestData();
const testTypes = generateTypesTestData();
const testExpenses = generateExpensesTestData();

const usersTable = 'users';
const typesTable = 'types';
const expensesTable = 'expenses';


beforeEach('empty all tables', () => db.raw('TRUNCATE users, types, expenses RESTART IDENTITY CASCADE') );

afterEach('empty all tables', () => db.raw('TRUNCATE users, types, expenses RESTART IDENTITY CASCADE') );

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
        return db
            .insert(testExpenses)
            .into(expensesTable)
    });
};

const formatShortDate = (date) => {
    return new Date(date + ' 00:00:00').toLocaleDateString('en-US');
}

const formatDBLongDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
}

describe('GET /api/expenses', () => {
    
    insertTestData();

    it('GET /api/expenses/:id => responds with specified expense', () => {
        const expense = { 
            id: 3, 
            user_id: 1, 
            type_id: 2, 
            amount: '200.00', 
            name: 'Monthly Gas Utility', 
            description: 'Gas expense. It\'s a periodic expense for utilities.', 
            date: '05/02/2020'
        };

        return supertest(app)
                .get(`/api/expenses/${expense.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const exp = res.body;
                    //console.log('EXPENSE: ', exp);
                    expect(expense.id).to.eql(exp.id);
                    expect(expense.user_id).to.eql(exp.user_id);
                    expect(expense.type_id).to.eql(exp.type_id);
                    expect(expense.amount).to.eql(exp.amount);
                    expect(expense.name).to.eql(exp.name);
                    expect(expense.description).to.eql(exp.description);
                    expect(formatShortDate(expense.date)).to.eql(formatDBLongDate(exp.date));
                });
    });

    it('GET /api/expenses/:id responds with 404 "Not Found" when id is incorrect', () => {
        const id = 888;
        return supertest(app)
                .get(`/api/expenses/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error;
                    expect(error.status).to.eql(404);
                    expect(error.message).to.eql('The expense doesn\'t exist');
                });
    });
});

describe('POST /api/expenses/:id', () => {
        
    insertTestData();

    it('POST /api/expenses/:id => getAllByUserId: returns all expenses for a specified user id', () => {
        const userId = 1
        const expensesByUserId = testExpenses.filter(expense => expense.user_id === userId);
        const formattedExpenses = expensesByUserId.map( expense => {            
            expense.date = formatShortDate(expense.date)
            return expense;
        } );

        return supertest(app)
                .post(`/api/expenses/${userId}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect(res => {
                    const expensesList = res.body
                    const formattedExps = expensesList.map( expense => { 
                        expense.date = formatDBLongDate(expense.date)
                        return expense;
                    });
                    expect(formattedExpenses).to.eql(formattedExps);
                })
    })
})

describe('POST /api/expenses', () => {
    
    beforeEach('insert all test data', async () => {
        await db
            .insert(testUsers)
            .into(usersTable)
        await db
            .insert(testTypes)
            .into(typesTable)
    });

    it('POST /api/expenses => creates an expense, responding with 201 and the new expense', () => {
        const expense = {
            user_id: 1, 
            type_id: 2, 
            amount: '200.00', 
            name: 'Monthly Gas Utility', 
            description: 'Gas expense. It\'s a periodic expense for utilities.', 
            date: '05/02/2020'
        };
        
        return supertest(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(expense)
                .expect(201)
                .expect( res => {
                    const exp = res.body;
                    //console.log('EXPENSE: ', exp);
                    expect(expense.user_id).to.eql(exp.user_id);
                    expect(expense.type_id).to.eql(exp.type_id);
                    expect(expense.amount).to.eql(exp.amount);
                    expect(expense.name).to.eql(exp.name);
                    expect(expense.description).to.eql(exp.description);
                    expect(formatShortDate(expense.date)).to.eql(formatDBLongDate(exp.date));
                });
    });
});

describe('PUT /api/expenses/:id', () => {
    
    insertTestData();

    it('PUT /api/expenses/:id => updates an expense, responding with 201 and the updated expense', () => {
        const expense = { 
            id: 3, 
            user_id: 1, 
            type_id: 2, 
            amount: '200.50', 
            name: 'Monthly Gas Utilities', 
            description: 'Gas expense. Lorem ipsum..', 
            date: '05/24/2020'
        };
        return supertest(app)
                .put(`/api/expenses/${expense.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(expense)
                .expect(201)
                .expect( res => {
                    const exp = res.body;
                    //console.log('EXPENSE: ', exp);
                    expect(expense.user_id).to.eql(exp.user_id);
                    expect(expense.type_id).to.eql(exp.type_id);
                    expect(expense.amount).to.eql(exp.amount);
                    expect(expense.name).to.eql(exp.name);
                    expect(expense.description).to.eql(exp.description);
                    expect(formatShortDate(expense.date)).to.eql(formatDBLongDate(exp.date));
                })
    })
})

describe('DELETE /api/expenses/:id', () => {
        
    insertTestData();

    it('DELETE /api/expenses/:id deletes an expense, responding with 200 and "1 expense/s deleted"', () => {
        const id = 3;
        expense = {
            user_id: 1
        };

        return supertest(app)
                .delete(`/api/expenses/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(expense)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 expense/s deleted');
                });
    });
});