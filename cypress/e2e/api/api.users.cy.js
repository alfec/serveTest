describe('Test for the calls of Users', () => {
    before(() => {
        cy.createsDefaultUser()
    });
    
    describe('Scenarios to test the GET calls', () => {
        it('User should use GET /usuarios and see all users created', () => {
            cy.requestsFor({
                method: 'GET',
                url: '/usuarios'
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201]);
            });
        });

        it('GET /usuarios - should only accpet true or false', () => {
            cy.requestsFor({
                method: 'GET',
                url: '/usuarios',
                qs: {
                    administrador: 'test',
                },
            }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.administrador).to.include("administrador deve ser 'true' ou 'false'");
            })
        })

        it('GET /usuarios - send the request with an invalid field', () => {
            cy.requestsFor({
                method: 'GET',
                url: '/usuarios',
                qs: {
                    test: 'test',
                },
            }).then((response) => {
                expect(response.status).to.be.a(400);
                expect(response.body).to.have.property('test');
                expect(response.body).to.have.property('usuarios');
                expect(response.body.test).to.include('não é permitido');
            });
        });

        describe('GET /usuarios - should not accept invalid emails', () => {
            const invalidEmails = [
                { description: 'email without @', value: 'email.com' },
                { description: 'email empty', value: '' },
                { description: 'email with space', value: 'teste @qa.com' },
                { description: 'email null', value: null },
            ]

            invalidEmails.forEach(({ description, value }) => {
                it(`Should give an error with  ${description}`, () => {
                    cy.requestsFor({
                        method: 'GET',
                        url: '/usuarios',
                        qs: {
                            email: value,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(400)
                        expect(response.body.email).to.be.an('array')
                        expect(response.body.email).to.include('email deve ser um email válido')
                    })
                })
            })
        });

        describe('GET /usuarios/ by Ids - scenarios to validate the call for the _id field', () => {
            const idsToValidate = [
                {description: '_id does not exist', value: 'idTest',expectedStatus: 400},
                {description: '_id is Invalid', value: '@@@###',expectedStatus: 400},
                {description: '_id with empty field', value: '',expectedStatus: 400},
                {description: '_id with space', value: ' ',expectedStatus: 400},
                {description: 'Correct _id', value: '0uxuPY0cbmQhpEz1',expectedStatus: 200},
            ]

            idsToValidate.forEach(({ description, value, expectedStatus }) => {
                it(`Check the ${description}`, () => {
                    cy.requestsFor({
                        method: 'GET',
                        url: `/usuarios/${value}`,
                    }).then((response) => {
                        expect(response.status).to.eq(expectedStatus)
                        if (expectedStatus === 400) {
                            expect(response.text()).to.include("id deve ter exatamente 16 caracteres alfanuméricos");
                        } else if (expectedStatus === 200){
                            expect(response.body).to.have.property('_id');
                            expect(response.body).to.have.property('nome');
                            expect(response.body).to.have.property('email');
                            expect(response.body).to.have.property('password');
                            expect(response.body).to.have.property('administrador');
                            expect(response.body).to.have.property('_id');
                        }
                        expect(response.body.message).to.exist
                    });
                });
            });
        });
        
    });

    describe('Scenarios to test the POST call', () => {
        it('POST /usuarios - happy path', () => {
            cy.createsDefaultUser().then((response) => {
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
                expect(response.body._id).to.be.a('string');
            });
        });

        it('POST /usuarios - should not allow create users with the same email', () => {
            cy.createsDefaultUser().then(() => {
                cy.requestsFor({
                    method: 'POST',
                    url: '/usuarios',
                    body: {
                        nome: 'Outro usuário',
                        email: Cypress.env('defaultEmail'),
                        password: 'teste',
                        administrador: 'false',
                    },
                }).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.match(/"Este email já está sendo usado"/i)
                });
            });
        });


    });

    describe('Scenarios to test the DELETE call', () => {
        it('Delete /usuarios/by _id - should not allow Deleting the users with cart', () => {
            cy.loginAndStoreToken('fulano@qa.com', 'teste').then((token) => {
                cy.requestsFor({
                    method: 'DELETE',
                    url: '/usuarios/0uxuPY0cbmQhpEz1',
                    headers: {
                        Authorization: Cypress.env('authToken'),
                    },
                }).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.inlcude("Email e/ou senha inválidos")
                });
            });
        });

        it('Delete /usuarios/by _id - happy path', () => {
            cy.createsDefaultUser().then((createResponse) => {
                const userId = createResponse.body._id
                const email = Cypress.env('defaultEmail')
                const password = Cypress.env('defaultPassword')

                cy.loginAndStoreToken(email, password).then((token) => {
                    cy.deleteUserWithToken(userId, token).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.include("Registro excluído com sucesso | Nenhum registro excluído")
                    });
                });
            });
        });

    });

    describe('Scenarios to test the PUT call', () => {
        it('PUT /usuarios/ by id - if the user id doesnt exists, then should create a new one', () => {
            const invalidId = 'idInexistente123'
            cy.createEmail().then((email) => {
                cy.requestsFor({
                    method: 'PUT',
                    url: `/usuarios/${invalidId}`,
                    body: {
                        nome: 'New Test User PUT',
                        email,
                        password: 'teste',
                        administrador: 'false',
                    },
                }).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.message).to.match(/Cadastro realizado com sucesso/i)
                    expect(response.body).to.have.property('_id')
                });
            });
        });

        it('PUT /usuarios/ by id -  should edit the user by _id', () => {
            cy.createsDefaultUser()
            cy.then(() => {
                const userId = Cypress.env('_id')
                cy.createEmail().then((newEmail) => {
                    cy.requestsFor({
                        method: 'PUT',
                        url: `/usuarios/${userId}`,
                        body: {
                            nome: 'Altered Test User',
                            email: newEmail,
                            password: 'teste',
                            administrador: 'true',
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.match(/Registro alterado com sucesso/i)
                    });
                });
            });
        });

        it('PUT /usuarios/ by id - should not allow edit the user with the same email', () => {
            cy.createsDefaultUser()
            cy.then(() => {
                const emailDuplicado = Cypress.env('defaultEmail')
                cy.createsDefaultUser()
                cy.then(() => {
                    const userId = Cypress.env('_id')
                    cy.requestsFor({
                        method: 'PUT',
                        url: `/usuarios/${userId}`,
                        body: {
                            nome: 'Test User User',
                            email: emailDuplicado,
                            password: 'teste',
                            administrador: 'true',
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(400)
                        expect(response.body.message).to.include("Este email já está sendo usado")
                    });
                });
            });
        });


    });
});