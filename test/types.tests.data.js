module.exports = {
    generateTypesTestData() {
        return [
            { id:1, name:"Water", description: 'Water utility service providers'}, 
            { id:2, name:"Gas", description: 'Gas utility service providers'}, 
            { id:3, name:"Electric", description: 'Power utility service providers'}, 
            { id:4, name:"Groceries", description: 'Groceries service providers'},
            { id:5, name:"Insurance", description: 'Insurance service providers'}, 
            { id:6, name:"HVAC/Heat Pump", description: 'Cooling and Heating service providers'},
            { id:7, name:"Plumbing", description: 'Plumbing service providers'}, 
            { id:8, name:"Landscaping", description: 'Landscaping service providers'}, 
            { id:9, name:"Extraordinary Expense", description: 'Extraordianry expenses, in value or type, service providers'}, 
            { id:10, name:"Other", description: 'Expense types or service providers that cannot be catalogued in the previous types'}
        ];
    }
}