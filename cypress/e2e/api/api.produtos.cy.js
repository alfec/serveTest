describe('Test for the calls of Products', () => {
    before(() => {
        cy.createsDeafultUser()
    });
    describe('Scenarios to test the GET calls', () => {
        it('GET /produtos - should see all products created', () => {
            cy.requestsFor({
                method: 'GET',
                url: '/produtos'
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201]);
            });
        });

        it('GET /produtos - send the request with an invalid field', () => {
            cy.requestsFor({
                method: 'GET',
                url: '/produtos',
                qs: {
                    test: 'test',
                },
            }).then((response) => {
                expect(response.status).to.be.a(400);
                expect(response.body).to.have.property('test');
                expect(response.body.test).to.include('não é permitido');
            });
        });

        describe('GET /produtos - should not accept invalid Preco and Quantidade', () => {
            const invalidsFields = [
                { description: 'preco and quantidade with letters', qs: {preco: 'a', quantidade: 'a'} },
                { description: 'preco and quantidade with empty fields', qs: {preco: '', quantidade: ''} },
                { description: 'preco and quantidade with spaces', qs: {preco: ' ', quantidade: ' '} },
                { description: 'preco and quantidade with null', qs: {preco: null, quantidade: null} },
            ]

            invalidsFields.forEach(({ description, qs }) => {
                it(`Should give an error with  ${description}`, () => {
                    cy.requestsFor({
                        method: 'GET',
                        url: '/produtos',
                        qs,
                    }).then((response) => {
                        expect(response.status).to.eq(400)
                        expect(response.body.email).to.be.an('array')
                        expect(response.body.email).to.include('quantidade deve ser um número')
                    })
                })
            })
        });

        describe('GET /produtos/ by Ids - scenarios to validate the call for the _id field', () => {
            const idsToValidate = [
                {description: '_id does not exist', value: 'idTest',expectedStatus: 400},
                {description: '_id is Invalid', value: '@@@###',expectedStatus: 400},
                {description: '_id with empty field', value: '',expectedStatus: 400},
                {description: '_id with space', value: ' ',expectedStatus: 400},
                {description: 'Correct _id', value: 'BeeJh5lz3k6kSIzA',expectedStatus: 200},
            ]

            idsToValidate.forEach(({ description, value, expectedStatus }) => {
                it(`Check the ${description}`, () => {
                    cy.requestsFor({
                        method: 'GET',
                        url: `/produtos/${value}`,
                    }).then((response) => {
                        expect(response.status).to.eq(expectedStatus)
                        if (expectedStatus === 400) {
                            expect(response.text()).to.include("id deve ter exatamente 16 caracteres alfanuméricos");
                        } else if (expectedStatus === 200){
                            expect(response.body).to.have.property('_id');
                            expect(response.body).to.have.property('nome');
                            expect(response.body).to.have.property('preco');
                            expect(response.body).to.have.property('descricao');
                            expect(response.body).to.have.property('quantidade');
                            expect(response.body).to.have.property('_id');
                        }
                        expect(response.body.message).to.exist
                    });
                });
            });
        });
        
    });

    describe('Scenarios to test the POST call', () => {
        it('POST /produtos - happy path', () => {
            cy.createsDefaultUser().then((response) => {
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
                expect(response.body._id).to.be.a('string');
            });
        });

        it('POST /produtos - should not allow create products with the same name', () => {
            cy.createsDeafultUser().then(() => {
                cy.requestsFor({
                    method: 'POST',
                    url: '/produtos',
                    body: {
                        nome: "Logitech MX Vertical",
                        preco: 470,
                        descricao: "Mouse",
                        quantidade: 381
                    },
                }).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.match(/"Já existe produto com esse nome"/i)
                });
            });
        });


    });

    describe('Scenarios to test the DELETE call', () => {
        it('DELETE /produtos/by id - should NOT allow deleting product that is in a cart', () => {
            cy.loginAndStoreToken('fulano@qa.com', 'teste').then(() => {
                cy.requestsFor({
                    method: 'DELETE',
                    url: '/produtos/K6leHdftCeOJj8BJ',
                    headers: {
                        Authorization: Cypress.env('authToken'),
                    },
                }).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.include('Produto faz parte de carrinho')
                });
            });
        });

        it('DELETE /produtos/by id - should allow deleting a product successfully', () => {
            cy.loginAndStoreToken('fulano@qa.com', 'teste').then(() => {
                cy.createDefaultProduct().then((product) => {
                    cy.deleteProductWithToken(product.id).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.match(/registro excluído com sucesso/i)
                    });
                });
            });
        });


    });

    describe('Scenarios to test the PUT call', () => {
        it('PUT /produtos/:id - should create a new product if id does not exist', () => {
            const invalidId = 'idInexistente123'

            cy.loginAndStoreToken('fulano@qa.com', 'teste').then(() => {
                cy.requestsFor({
                method: 'PUT',
                url: `/produtos/${invalidId}`,
                headers: {
                    Authorization: Cypress.env('authToken'),
                },
                body: {
                    nome: `Produto PUT ${Date.now()}`,
                    preco: 150,
                    descricao: 'Produto criado via PUT com ID inexistente',
                    quantidade: 5,
                },
                }).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.message).to.match(/Cadastro realizado com sucesso/i)
                    expect(response.body).to.have.property('_id')
                })
            })
        })

        it('PUT /produtos/:id - should update product successfully', () => {
            cy.loginAndStoreToken('fulano@qa.com', 'teste').then(() => {
                cy.createDefaultProduct().then((product) => {
                    cy.requestsFor({
                        method: 'PUT',
                        url: `/produtos/${product.id}`,
                        headers: {
                            Authorization: Cypress.env('authToken'),
                        },
                        body: {
                            nome: 'Produto alterado',
                            preco: 200,
                            descricao: 'Descrição alterada',
                            quantidade: 20,
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.match(/Registro alterado com sucesso/i)
                    });
                });
            });
        });


        it('PUT /produtos/:id - should not allow update with duplicated product name', () => {
            cy.loginAndStoreToken('fulano@qa.com', 'teste').then(() => {
                cy.createDefaultProduct().then((productA) => {
                    cy.createDefaultProduct().then((productB) => {
                        cy.requestsFor({
                            method: 'PUT',
                            url: `/produtos/${productB.id}`,
                            headers: {
                                Authorization: Cypress.env('authToken'),
                            },
                            body: {
                                nome: productA.nome,
                                preco: 300,
                                descricao: 'Tentando duplicar nome',
                                quantidade: 1,
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(400)
                            expect(response.body.message).to.match(/Já existe produto com esse nome/i)
                        });
                    });
                });
            });
        });


    });
});