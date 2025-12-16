import * as login from '../../page-object/login.js'
import * as createUser from '../../page-object/createUser.js'

const password = 'teste1234';
const email = 'test@qaTest.com.br';

describe('Login', () => {
  beforeEach(() => {
    cy.request('GET', '/')
      .then((response) => {
          expect(response.status).to.eq(200)
    });
    cy.visit("/");
  });

  it('Create new user', () =>{
    login.clickRegister();
    createUser.createUser(email, password);
  });

  it('Do a login with the correct user and password', () => {
    login.doLogin('fulano@qa.com', 'teste');
  });

  it('Do a login with wrong credentials should see an error message', ()=>{
    login.wrongLogin('test1@test.com', 'Test12');
    login.wrongLogin('', 'Test12');
    login.wrongLogin('test1@test.com', '');
    login.wrongLogin('', '');
    login.wrongLogin('test1@', 'Test1234');
    login.wrongLogin('test1@test.com', 'Test1');
    login.wrongLogin('test1@test.com', 'test1234');
    login.wrongLogin('test1@test.com', '12345678');

  });

})