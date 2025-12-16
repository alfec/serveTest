import * as hp from '../../page-object/homepage.js';
import * as product from '../../page-object/productList.js';
import * as login from '../../page-object/login.js';
import * as createUser from '../../page-object/createUser.js'

const password = 'teste1234';
const name = 'Teste QA';

describe('Product List', () => {
  beforeEach(() => {
    cy.createEmail().then((email) => {
      cy.visit('/')
      login.clickRegister()
      createUser.createUser(name, email, password)
      hp.validateElement('serverestLogo')
    });
  });

  it('Add a product to List', () => {
    hp.searchProduct('Logitech');
    product.clickBtn('AddtoList');
    product.validateProductList();
  });

  it('Increase the amount of item on the List', () => {
    hp.clickGridProduct(0);
    product.validateProductList();
    product.checkProductchangeQuantity();
  });
});
