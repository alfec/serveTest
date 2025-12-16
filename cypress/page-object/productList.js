const btnAddCart = "[data-testid='adicionar-ao-carrinho']";
const btnAddToList = "[data-testid='adicionarNaLista']";
const btnCleanup = "[data-testid='limparLista']";
const btnDecrease = "[data-testid='product-decrease-quantity']";
const btnIncrease = "[data-testid='product-increase-quantity']";
const checkQuantity = "[data-testid='shopping-cart-product-quantity']";
const btnHome = "[data-testid='paginaInicial']";

export const clickBtn = (button) =>{
    const btn ={
        'AddtoCart': btnAddCart,
        'Cleanup List': btnCleanup,
        'Increase': btnDecrease,
        'Decrease': btnIncrease,
        'Homepage': btnHome,
        'AddtoList': btnAddToList
    }[button]
    cy.get(btn, {timeout: 3000}).click()
}

export const validateCart = () =>{
    cy.get(btnCheckout, {timeout: 3000}).should('be.visible');
}

export const validateProductList = () =>{
    cy.get("h1").should('be.visible').and('have.text', "Lista de Compras");
}

export const addProductToCart = () =>{ 
    clickBtn('btnAddToList');
    validateProductList();
}

export const checkProductchangeQuantity = () =>{
    let quantityValue = 0;
    cy.get(checkQuantity)
    .invoke('text')
    .then((message) => {
      expect(message).to.contain('1');
      quantityValue = message.match(/\d+/)[0];
    });
    clickBtn('Increase');
    cy.get(checkQuantity)
    .invoke('text')
    .then((message) => {
      const newQuantity = message.match(/\d+/)[0];
      expect(Number(newQuantity)).to.eq(Number(quantityValue) + 1);
    });
}