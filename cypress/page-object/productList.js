const btnAddCart = "[data-testid='adicionar carrinho']";
const btnAddToList = "[data-testid='adicionarNaLista']";
const btnCleanup = "[data-testid='limparLista']";
const btnDecrease = "[data-testid='product-decrease-quantity']";
const btnIncrease = "[data-testid='product-increase-quantity']";
const checkQuantity = "[data-testid='shopping-cart-product-quantity']";
const btnHome = "[data-testid='paginaInicial']";

export const clickBtn = (button) =>{
    const btnMap ={
        'AddtoCart': btnAddCart,
        'Cleanup List': btnCleanup,
        'Increase': btnIncrease,
        'Decrease': btnDecrease,
        'Homepage': btnHome,
        'AddtoList': btnAddToList
    }
    const btn = btnMap[button]
    cy.get(btn, {timeout: 3000}).click()
}

export const validateProductList = () =>{
    cy.get("h1").should('be.visible').and('have.text', "Lista de Compras");
}

export const addProductToCart = () =>{ 
    clickBtn('AddtoCart');
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
