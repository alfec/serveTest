import * as hp from "../page-object/homepage";
import * as product from "../page-object/productList";
const email = 'test@testqa.com.br';
const password = 'teste1234';
before(function () {
    cy.visit("/");
});

describe('Validate the search for items', function () {
  beforeEach(function () {
    cy.request('GET', '/')
    .then((response) => {
      expect(response.status).to.eq(200);
    });

    cy.visit("/");
  });

  it('Add a product to cart', function () {
    hp.searchProduct('Logitech');
    product.addProductToCart();
    product.validateCart();
  });

  it('Increase the amount of item on the List', function() {
    hp.clickBtn('AddtoList').first();
    product.validateProductList();
    product.checkProductchangeQuantity();
  });

});
