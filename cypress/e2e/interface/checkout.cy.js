import * as checkout from '../../page-object/checkOut.js';
import * as hp from '../../page-object/homepage.js';
import * as product from '../../page-object/productList.js';

describe('Checkout', () => {
  beforeEach(() => {
    cy.request('GET', '/')
      .then((response) => {
          expect(response.status).to.eq(200)
    });
    cy.visit("/");
  });

  it('Go to checkout page using the button on the Menu', () => {
    hp.clickBtn('Checkout');
    checkout.validateProductList()
  });

  it('Go to checkout page doing all the user path', () => {
    hp.searchProduct('Logitech');
    hp.clickBtn('AddtoList');
    product.clickBtn('btnAddCart');
    checkout.validateProductList();
  });
});
