describe('Tests for Login calls', () => {
    //first API test written
    before(() => {
        cy.createsDefaultUser()
    });
    describe('Tests scenarios for the POST call', () => {
        it('Validate Login using correct credentials', () =>{
            cy.requestsFor({
                method: 'POST',
                url: '/login',
                body: {
                    "email": Cypress.env('defaultEmail'),
                    "password": Cypress.env('defaultPassword')
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201])
            });
        });

        it('Validate Login using incorrect credentials', () =>{
            cy.requestsFor({
                method: 'POST',
                url: '/login',
                body: {
                    "email": "test123123123@t.com",
                    "password": "testeeee123"
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([400, 401]);
                console.log(response.body);
                expect(response.body).to.have.property('message');
            });
        });

        it('Validate Login without Password', () =>{
            cy.requestsFor({
                method: 'POST',
                url: '/login',
                body: {
                    "identifier": "test@t.com",
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([400, 401])
                expect(response.body).to.have.property('password')
            });
        });

        it('Validate Login without Email', () =>{
            cy.requestsFor({
                method: 'POST',
                url: '/login',
                body: {
                    "password": "teste"
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([400, 401])
                expect(response.body).to.have.property('email')
            });
        });
        
        it('Validate Login with empty body', () =>{
            cy.requestsFor({
                method: 'POST',
                url: '/login',
                body: {
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([400, 401])
                expect(response.body).to.have.property('email')
                expect(response.body).to.have.property('password')
            });
        });

    });
    
});
