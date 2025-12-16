Cypress.Commands.add('requestsFor', (options) => {
  const defaultOpt = {
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  }

  return cy.request({
    ...defaultOpt,
    ...options,
    headers: {
      ...defaultOpt.headers,
      ...options.headers,
    },
    url: `${Cypress.env('apiUrl')}${options.url}`,
  })
});

Cypress.Commands.add('createsDefaultUser', () => {
  const password = 'teste'

  return cy.createEmail().then((email) => {
    return cy.requestsFor({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Test',
        email,
        password,
        administrador: 'false',
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
      expect(response.body).to.have.property('message')
      expect(response.body).to.have.property('_id')

      Cypress.env('defaultEmail', email)
      Cypress.env('defaultPassword', password)
      Cypress.env('_id', response.body._id)

      return response
    })
  })
});

Cypress.Commands.add('createEmail', () => {
  const x = Math.floor(Math.random() * 10000);
  return `test_${x}@qa.com.br`;;
});

Cypress.Commands.add('createRandomName', () => {
  const timestamp = Date.now()
  const name = `Test User ${timestamp}`

  Cypress.env('randomName', name)

  return cy.wrap(name)
})


Cypress.Commands.add('loginAndStoreToken', (email, password) => {
  return cy.requestsFor({
    method: 'POST',
    url: '/login',
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('authorization')

    const token = response.body.authorization

    Cypress.env('authToken', token)

    return token
  });
});

Cypress.Commands.add('deleteUserWithToken', (userId, token) => {
  return cy.requestsFor({
    method: 'DELETE',
    url: `/usuarios/${userId}`,
    headers: {
      Authorization: token,
    },
  });
});

Cypress.Commands.add('createDefaultProduct', () => {
  const product = {
    nome: `Mousa super legal ${Date.now()}`,
    preco: 100,
    descricao: 'Produto criado para teste automatizado',
    quantidade: 10,
  }

  return cy.requestsFor({
    method: 'POST',
    url: '/produtos',
    headers: {
      Authorization: Cypress.env('authToken'),
    },
    body: product,
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 201])
    expect(response.body).to.have.property('_id')

    Cypress.env('productId', response.body._id)

    return {
      id: response.body._id,
      ...product,
    }
  })
});

Cypress.Commands.add('deleteProductWithToken', (productId) => {
  return cy.requestsFor({
    method: 'DELETE',
    url: `/produtos/${productId}`,
    headers: {
      Authorization: Cypress.env('authToken'),
    },
  })
});
